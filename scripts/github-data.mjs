// Récupère mon activité GitHub publique au moment du build (aucune requête depuis le navigateur des visiteurs).
// Écrit src/data/github.json. En cas d'échec réseau, garde le fichier existant : le build ne casse jamais.
import { readFile, writeFile } from "node:fs/promises";

const USER = "EddahiryAmine";
const OUT = new URL("../src/data/github.json", import.meta.url);
const H = { "user-agent": "portfolio-build", accept: "application/vnd.github+json" };
if (process.env.GITHUB_TOKEN) H.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

// Balisage et styles exclus : ils gonflent les statistiques sans refléter le code écrit.
const MARKUP = new Set(["HTML", "CSS", "SCSS", "Blade", "Less", "Dockerfile", "Procfile"]);

const get = async (url, type = "json") => {
  const r = await fetch(url, { headers: H, signal: AbortSignal.timeout(15000) });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return type === "json" ? r.json() : r.text();
};

async function main() {
  const repos = (await get(`https://api.github.com/users/${USER}/repos?per_page=100&sort=updated`)).filter((r) => !r.fork && r.name !== USER);

  // Langages : octets de code par langage, cumulés sur mes dépôts.
  const bytes = {};
  for (const r of repos) {
    try {
      for (const [k, v] of Object.entries(await get(r.languages_url))) if (!MARKUP.has(k)) bytes[k] = (bytes[k] || 0) + v;
    } catch { /* dépôt ignoré */ }
  }
  const total = Object.values(bytes).reduce((a, b) => a + b, 0) || 1;
  const languages = Object.entries(bytes).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, b]) => ({ name, pct: Math.round((b / total) * 1000) / 10 }));

  // Calendrier de contributions (page publique de GitHub).
  let days = [];
  try {
    const html = await get(`https://github.com/users/${USER}/contributions`, "text");
    const levels = new Map();
    for (const m of html.matchAll(/data-date="(\d{4}-\d{2}-\d{2})"[^>]*?id="([^"]+)"[^>]*?data-level="(\d)"/g)) levels.set(m[2], { date: m[1], level: +m[3], count: 0 });
    for (const m of html.matchAll(/<tool-tip[^>]*for="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
      const d = levels.get(m[1]); const n = /^(\d+)/.exec(m[2].trim());
      if (d) d.count = n ? +n[1] : 0;
    }
    days = [...levels.values()].sort((a, b) => a.date.localeCompare(b.date));
  } catch (e) { console.warn("[github] calendrier indisponible :", e.message); }

  const data = {
    user: USER, updated: new Date().toISOString().slice(0, 10),
    repos: repos.length, stars: repos.reduce((a, r) => a + r.stargazers_count, 0),
    contributions: days.reduce((a, d) => a + d.count, 0),
    languages, days,
    recent: repos.slice(0, 4).map((r) => ({ name: r.name, url: r.html_url, lang: r.language, updated: r.pushed_at?.slice(0, 10) })),
  };
  await writeFile(OUT, JSON.stringify(data, null, 1) + "\n");
  console.log(`[github] ${data.repos} dépôts, ${data.contributions} contributions, ${days.length} jours`);
}

main().catch(async (e) => {
  console.warn("[github] données non mises à jour :", e.message);
  try { await readFile(OUT); } catch { await writeFile(OUT, JSON.stringify({ user: USER, repos: 0, languages: [], days: [], recent: [], contributions: 0 }) + "\n"); }
});
