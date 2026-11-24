// Espace admin (/admin) : une seule fonction serverless, action choisie par ?action=...
// Variables d'environnement Vercel (voir README, section Admin) :
//   ADMIN_PASSWORD_HASH (obligatoire)  : généré par `node scripts/admin-setup.mjs`
//   ADMIN_SESSION_SECRET (obligatoire) : longue chaîne aléatoire (générée par le même script)
//   ADMIN_TOTP_SECRET (recommandé)     : active le code à 6 chiffres (Google Authenticator)
//   GITHUB_TOKEN (obligatoire)         : jeton GitHub « fine-grained », accès Contents: Read and write au seul dépôt du portfolio
//   GITHUB_REPO (obligatoire)          : ex. EddahiryAmine/portfolio-Amine ; GITHUB_BRANCH (facultatif, défaut main)
import {
  DATA_PATHS, PHOTO_DIR, checkSession, clearFailures, clientIp, github, imageType, makeSession, readCookie, recordFailure,
  sameOrigin, sessionCookie, slugify, toJson, tooManyAttempts, validatePhotos, validateSite, verifyPassword, verifyTotp,
} from "./_lib/admin.js";

export const config = { api: { bodyParser: { sizeLimit: "4mb" } } };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const send = (res, status, body) => { res.setHeader("Cache-Control", "no-store"); res.setHeader("X-Robots-Tag", "noindex"); return res.status(status).json(body); };

// Tolère les erreurs de copier-coller dans Vercel (ligne entière « NOM = valeur », espaces, guillemets).
const lastToken = (v) => String(v || "").trim().replace(/^["']|["']$/g, "").split(/[\s=]+/).filter(Boolean).pop() || "";
function cleanEnv(raw) {
  const hash = String(raw.ADMIN_PASSWORD_HASH || "").match(/scrypt\$\d+\$\d+\$\d+\$[A-Za-z0-9+/=]+\$[A-Za-z0-9+/=]+/)?.[0] || "";
  return {
    ...raw,
    ADMIN_PASSWORD_HASH: hash,
    ADMIN_SESSION_SECRET: lastToken(raw.ADMIN_SESSION_SECRET),
    ADMIN_TOTP_SECRET: raw.ADMIN_TOTP_SECRET ? lastToken(raw.ADMIN_TOTP_SECRET).toUpperCase() : "",
    GITHUB_TOKEN: lastToken(raw.GITHUB_TOKEN),
    GITHUB_REPO: lastToken(raw.GITHUB_REPO),
  };
}

export default async function handler(req, res, deps = {}) {
  const raw = deps.env || process.env;
  const env = cleanEnv(raw);
  const gh = () => (deps.github || github)(env);
  const action = String(req.query?.action || "");
  const secret = env.ADMIN_SESSION_SECRET;

  if (!env.ADMIN_PASSWORD_HASH || !secret || secret.length < 32) return send(res, 503, { error: "not_configured" });

  // ----- Connexion -----
  if (action === "login") {
    if (req.method !== "POST") return send(res, 405, { error: "method" });
    if (!sameOrigin(req)) return send(res, 403, { error: "origin" });
    const ip = clientIp(req);
    if (tooManyAttempts(ip)) return send(res, 429, { error: "rate" });
    const { password, code } = req.body || {};
    await sleep(deps.noDelay ? 0 : 600); // ralentit les essais automatisés
    const okPass = typeof password === "string" && password.length <= 200 && verifyPassword(password, env.ADMIN_PASSWORD_HASH);
    const needCode = !!env.ADMIN_TOTP_SECRET;
    const okCode = !needCode || verifyTotp(env.ADMIN_TOTP_SECRET, code);
    if (!okPass || !okCode) { recordFailure(ip); return send(res, 401, { error: "invalid", needCode }); }
    clearFailures(ip);
    res.setHeader("Set-Cookie", sessionCookie(makeSession(secret)));
    return send(res, 200, { ok: true });
  }

  // ----- État de session (indique aussi si le code à 6 chiffres est demandé) -----
  if (action === "session") {
    return send(res, 200, { authenticated: checkSession(readCookie(req, "adm"), secret), needCode: !!env.ADMIN_TOTP_SECRET });
  }

  // ----- Diagnostic de configuration : uniquement « format correct ou non », aucune valeur révélée -----
  if (action === "check") {
    return send(res, 200, {
      passwordHash: !!env.ADMIN_PASSWORD_HASH,
      sessionSecret: secret.length >= 32,
      totpSecret: !env.ADMIN_TOTP_SECRET || /^[A-Z2-7]{16,64}$/.test(env.ADMIN_TOTP_SECRET),
      githubToken: /^(github_pat_|ghp_)[A-Za-z0-9_]{20,}$/.test(env.GITHUB_TOKEN),
      githubRepo: /^[\w.-]+\/[\w.-]+$/.test(env.GITHUB_REPO),
      serverTime: new Date().toISOString(),
    });
  }

  // ----- Toutes les autres actions exigent une session valide -----
  if (!checkSession(readCookie(req, "adm"), secret)) return send(res, 401, { error: "unauthenticated" });

  if (action === "logout") {
    if (req.method !== "POST" || !sameOrigin(req)) return send(res, 403, { error: "origin" });
    res.setHeader("Set-Cookie", sessionCookie("", 0));
    return send(res, 200, { ok: true });
  }

  try {
    // ----- Lecture des données actuelles (depuis GitHub, la source de vérité) -----
    if (action === "data" && req.method === "GET") {
      const g = gh();
      const [site, photos, files] = await Promise.all([g.readJson(DATA_PATHS.site), g.readJson(DATA_PATHS.photos), g.list(PHOTO_DIR)]);
      return send(res, 200, { site: site.data, photos: photos.data, siteSha: site.sha, photosSha: photos.sha, files: files.map((f) => f.name) });
    }

    if (req.method !== "POST" || !sameOrigin(req)) return send(res, 403, { error: "origin" });
    const g = gh();

    // ----- Publication des textes -----
    if (action === "save") {
      const { site, photos, siteSha, photosSha } = req.body || {};
      validateSite(site);
      validatePhotos(photos);
      const [curSite, curPhotos] = await Promise.all([g.readJson(DATA_PATHS.site), g.readJson(DATA_PATHS.photos)]);
      if (curSite.sha !== siteSha || curPhotos.sha !== photosSha) return send(res, 409, { error: "conflict" });
      const sha = await g.commit([{ path: DATA_PATHS.site, content: toJson(site) }, { path: DATA_PATHS.photos, content: toJson(photos) }], "admin: mise à jour du contenu");
      return send(res, 200, { ok: true, commit: sha });
    }

    // ----- Ajout d'une photo (image + infos dans un seul commit) -----
    if (action === "photo-add") {
      const { image, title, tags, ratio } = req.body || {};
      if (typeof image !== "string" || image.length > 5_600_000) return send(res, 413, { error: "too_large" });
      const buf = Buffer.from(image, "base64");
      const ext = imageType(buf);
      if (!ext) return send(res, 400, { error: "not_image" });
      const cur = await g.readJson(DATA_PATHS.photos);
      const key = `${slugify(title?.fr || "photo")}-${Date.now().toString(36)}`;
      const info = {
        title: String(title?.fr || "").slice(0, 120), title_en: String(title?.en || title?.fr || "").slice(0, 120),
        tags: (Array.isArray(tags) ? tags : []).filter((t) => /^[a-z]{1,20}$/.test(t)).slice(0, 6),
        ratio: Math.min(4, Math.max(0.25, Number(ratio) || 1)), exif: "",
      };
      const photos = { ...cur.data, [key]: info };
      validatePhotos(photos);
      const sha = await g.commit([{ path: `${PHOTO_DIR}/${key}.${ext}`, content: buf }, { path: DATA_PATHS.photos, content: toJson(photos) }], `admin: ajout de la photo ${key}`);
      return send(res, 200, { ok: true, key, commit: sha, info });
    }

    // ----- Suppression d'une photo -----
    if (action === "photo-delete") {
      const { key } = req.body || {};
      if (!/^[a-z0-9-]{1,60}$/.test(String(key))) return send(res, 400, { error: "input" });
      const [cur, files] = await Promise.all([g.readJson(DATA_PATHS.photos), g.list(PHOTO_DIR)]);
      const file = files.find((f) => f.name.replace(/\.[^.]+$/, "") === key);
      if (!file) return send(res, 404, { error: "not_found" });
      const photos = { ...cur.data }; delete photos[key];
      const sha = await g.commit([{ path: file.path, delete: true }, { path: DATA_PATHS.photos, content: toJson(photos) }], `admin: suppression de la photo ${key}`);
      return send(res, 200, { ok: true, commit: sha });
    }

    return send(res, 404, { error: "action" });
  } catch (e) {
    const msg = String(e?.message || e);
    const isValidation = !/^GitHub|GitHub non configuré/.test(msg);
    return send(res, isValidation ? 400 : 502, { error: isValidation ? "validation" : "upstream", detail: msg.slice(0, 200) });
  }
}
