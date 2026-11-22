// Outils partagés de l'espace admin (les fichiers préfixés par « _ » ne sont pas exposés comme routes par Vercel).
// Sécurité : mot de passe haché (scrypt), code à 6 chiffres optionnel (TOTP), session signée (HMAC) en cookie HttpOnly,
// limitation des tentatives, vérification de l'origine, validation stricte des données avant toute écriture.
import crypto from "node:crypto";

export const DATA_PATHS = { site: "src/data/site.json", photos: "src/data/photos.json" };
export const PHOTO_DIR = "src/assets/photos";
const SESSION_HOURS = 2;
const enc = (b) => Buffer.from(b).toString("base64url");

// ---------- Mot de passe (format : scrypt$N$r$p$sel$hash) ----------
export function hashPassword(password, salt = crypto.randomBytes(16)) {
  const N = 16384, r = 8, p = 1;
  const hash = crypto.scryptSync(password, salt, 64, { N, r, p });
  return `scrypt$${N}$${r}$${p}$${salt.toString("base64")}$${hash.toString("base64")}`;
}
export function verifyPassword(password, stored) {
  try {
    const [algo, N, r, p, salt, hash] = String(stored).split("$");
    if (algo !== "scrypt") return false;
    const expected = Buffer.from(hash, "base64");
    const got = crypto.scryptSync(String(password), Buffer.from(salt, "base64"), expected.length, { N: +N, r: +r, p: +p });
    return crypto.timingSafeEqual(got, expected);
  } catch { return false; }
}

// ---------- Code à 6 chiffres (TOTP, RFC 6238, compatible Google Authenticator) ----------
const B32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
export function base32Decode(s) {
  let bits = "", out = [];
  for (const ch of s.replace(/=+$/, "").toUpperCase().replace(/\s/g, "")) { const v = B32.indexOf(ch); if (v < 0) throw new Error("base32"); bits += v.toString(2).padStart(5, "0"); }
  for (let i = 0; i + 8 <= bits.length; i += 8) out.push(parseInt(bits.slice(i, i + 8), 2));
  return Buffer.from(out);
}
export function totp(secret, t = Date.now(), step = 30) {
  const counter = Buffer.alloc(8); counter.writeBigUInt64BE(BigInt(Math.floor(t / 1000 / step)));
  const h = crypto.createHmac("sha1", base32Decode(secret)).update(counter).digest();
  const o = h[h.length - 1] & 15;
  return String(((h.readUInt32BE(o) & 0x7fffffff) % 1e6)).padStart(6, "0");
}
export function verifyTotp(secret, code, t = Date.now()) {
  if (!/^\d{6}$/.test(String(code || ""))) return false;
  return [-1, 0, 1].some((w) => crypto.timingSafeEqual(Buffer.from(totp(secret, t + w * 30000)), Buffer.from(String(code))));
}

// ---------- Session signée ----------
function sign(data, secret) { return crypto.createHmac("sha256", secret).update(data).digest("base64url"); }
export function makeSession(secret, now = Date.now()) {
  const payload = enc(JSON.stringify({ exp: now + SESSION_HOURS * 3600e3, n: crypto.randomBytes(8).toString("hex") }));
  return `${payload}.${sign(payload, secret)}`;
}
export function checkSession(token, secret, now = Date.now()) {
  if (!token || !secret) return false;
  const [payload, sig] = String(token).split(".");
  if (!payload || !sig) return false;
  const expected = sign(payload, secret);
  if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  try { return JSON.parse(Buffer.from(payload, "base64url").toString()).exp > now; } catch { return false; }
}
export const readCookie = (req, name) => (req.headers.cookie || "").split(/;\s*/).map((c) => c.split("=")).find(([k]) => k === name)?.[1];
export const sessionCookie = (token, maxAge = SESSION_HOURS * 3600) =>
  `adm=${token}; HttpOnly; Secure; SameSite=Strict; Path=/api; Max-Age=${maxAge}`;

// ---------- Limitation des tentatives (par instance ; complétée par le délai et le code TOTP) ----------
const attempts = new Map();
export function tooManyAttempts(ip, now = Date.now()) {
  const list = (attempts.get(ip) || []).filter((t) => now - t < 15 * 60e3);
  attempts.set(ip, list);
  return list.length >= 5;
}
export const recordFailure = (ip, now = Date.now()) => attempts.set(ip, [...(attempts.get(ip) || []), now]);
export const clearFailures = (ip) => attempts.delete(ip);
export const clientIp = (req) => (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || req.socket?.remoteAddress || "?";

// ---------- Origine : les requêtes d'écriture doivent venir du site lui-même ----------
export function sameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return false;
  try { return new URL(origin).host === req.headers.host; } catch { return false; }
}

// ---------- Validation des données ----------
const URL_KEYS = /^(url|repo|linkedin|linkedinCerts|github|instagram|whatsapp|track|profile)$/;
export function validateData(value, path = "", depth = 0) {
  if (depth > 8) throw new Error(`Trop profond : ${path}`);
  if (value === null || typeof value === "boolean") return;
  if (typeof value === "number") { if (!Number.isFinite(value)) throw new Error(`Nombre invalide : ${path}`); return; }
  if (typeof value === "string") {
    if (value.length > 5000) throw new Error(`Texte trop long : ${path}`);
    const key = path.split(".").pop();
    if (URL_KEYS.test(key) && value && !/^(https:\/\/|mailto:)/.test(value)) throw new Error(`Lien invalide (https:// requis) : ${path}`);
    return;
  }
  if (Array.isArray(value)) { if (value.length > 200) throw new Error(`Liste trop longue : ${path}`); value.forEach((v, i) => validateData(v, `${path}[${i}]`, depth + 1)); return; }
  if (typeof value === "object") {
    const keys = Object.keys(value);
    if (keys.length > 100) throw new Error(`Objet trop grand : ${path}`);
    for (const k of keys) { if (!/^[A-Za-z0-9_-]{1,40}$/.test(k)) throw new Error(`Clé invalide : ${path}.${k}`); validateData(value[k], path ? `${path}.${k}` : k, depth + 1); }
    return;
  }
  throw new Error(`Type non autorisé : ${path}`);
}
const REQUIRED_SITE = ["profile", "role", "company", "certTotal", "languages", "experience", "projects", "certifications", "education", "testimonials"];
export function validateSite(site) {
  if (!site || typeof site !== "object" || Array.isArray(site)) throw new Error("Données du site invalides");
  for (const k of REQUIRED_SITE) if (!(k in site)) throw new Error(`Champ manquant : ${k}`);
  for (const k of Object.keys(site)) if (!REQUIRED_SITE.includes(k)) throw new Error(`Champ inconnu : ${k}`);
  for (const k of ["languages", "experience", "projects", "certifications", "education", "testimonials"]) if (!Array.isArray(site[k])) throw new Error(`${k} doit être une liste`);
  validateData(site);
}
export function validatePhotos(photos) {
  if (!photos || typeof photos !== "object" || Array.isArray(photos)) throw new Error("Données photos invalides");
  for (const [k, v] of Object.entries(photos)) {
    if (!/^[a-z0-9-]{1,60}$/.test(k)) throw new Error(`Nom de photo invalide : ${k}`);
    if (!v || typeof v.title !== "string") throw new Error(`Titre manquant : ${k}`);
  }
  validateData(photos);
}

// ---------- Images : contrôle du contenu réel (signature du fichier) ----------
export function imageType(buf) {
  if (buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpg";
  if (buf.length > 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "png";
  if (buf.length > 12 && buf.subarray(0, 4).toString() === "RIFF" && buf.subarray(8, 12).toString() === "WEBP") return "webp";
  return null;
}
export const slugify = (s) => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "photo";

// ---------- GitHub (écriture des fichiers, un seul commit par publication) ----------
export function github(env = process.env) {
  const repo = env.GITHUB_REPO, token = env.GITHUB_TOKEN, branch = env.GITHUB_BRANCH || "main";
  if (!repo || !token) throw new Error("GitHub non configuré");
  const api = async (path, opts = {}) => {
    const r = await fetch(`https://api.github.com/repos/${repo}${path}`, {
      ...opts,
      headers: { authorization: `Bearer ${token}`, accept: "application/vnd.github+json", "user-agent": "portfolio-admin", "x-github-api-version": "2022-11-28", ...(opts.body ? { "content-type": "application/json" } : {}) },
      signal: AbortSignal.timeout(20000),
    });
    if (!r.ok) throw new Error(`GitHub ${r.status} ${path.split("?")[0]}`);
    return r.status === 204 ? null : r.json();
  };
  return {
    async readJson(path) {
      const f = await api(`/contents/${path}?ref=${encodeURIComponent(branch)}`);
      return { sha: f.sha, data: JSON.parse(Buffer.from(f.content, "base64").toString("utf8")) };
    },
    async list(dir) {
      const items = await api(`/contents/${dir}?ref=${encodeURIComponent(branch)}`);
      return items.filter((x) => x.type === "file").map((x) => ({ name: x.name, path: x.path, sha: x.sha }));
    },
    // files : [{ path, content (Buffer|string) }] ou [{ path, delete: true }]
    async commit(files, message) {
      const ref = await api(`/git/ref/heads/${encodeURIComponent(branch)}`);
      const head = ref.object.sha;
      const base = await api(`/git/commits/${head}`);
      const tree = [];
      for (const f of files) {
        if (f.delete) { tree.push({ path: f.path, mode: "100644", type: "blob", sha: null }); continue; }
        const blob = await api("/git/blobs", { method: "POST", body: JSON.stringify({ content: Buffer.from(f.content).toString("base64"), encoding: "base64" }) });
        tree.push({ path: f.path, mode: "100644", type: "blob", sha: blob.sha });
      }
      const newTree = await api("/git/trees", { method: "POST", body: JSON.stringify({ base_tree: base.tree.sha, tree }) });
      const commit = await api("/git/commits", { method: "POST", body: JSON.stringify({ message, tree: newTree.sha, parents: [head] }) });
      await api(`/git/refs/heads/${encodeURIComponent(branch)}`, { method: "PATCH", body: JSON.stringify({ sha: commit.sha }) });
      return commit.sha;
    },
  };
}
export const toJson = (o) => JSON.stringify(o, null, 2) + "\n";
