// Réinitialise l'accès admin SANS copier-coller : demande le mot de passe, génère les secrets
// et les enregistre directement dans Vercel (Production), puis redéploie.
// Usage (dans le dossier du portfolio) : node scripts/admin-reset.mjs
//   node scripts/admin-reset.mjs --code-only  → ne change que la clé du code à 6 chiffres (garde le mot de passe)
// Rien n'est enregistré sur le disque. Le jeton GitHub déjà présent dans Vercel n'est pas touché.
import crypto from "node:crypto";
import readline from "node:readline";
import { spawnSync } from "node:child_process";
import { hashPassword, newTotpSecret, totp } from "../api/_lib/admin.js";

const VERCEL = ["--yes", "vercel@65.12.0"];
const npx = process.platform === "win32" ? "npx.cmd" : "npx";
const run = (args, input) => spawnSync(npx, [...VERCEL, ...args], { input, encoding: "utf8", shell: process.platform === "win32" });

// Saisie masquée du mot de passe
function askHidden(q) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    rl._writeToOutput = (s) => { if (s.includes(q)) rl.output.write(q); else if (s.includes("\n") || s.includes("\r")) rl.output.write("\n"); else rl.output.write("•"); };
    rl.question(q, (a) => { rl.close(); resolve(a); });
  });
}

const codeOnly = process.argv.includes("--code-only");
const pass = codeOnly ? "x".repeat(12) : await askHidden("Nouveau mot de passe admin (12 caractères minimum) : ");
if (pass.length < 12) { console.error("✗ Trop court."); process.exit(1); }
const again = codeOnly ? pass : await askHidden("Confirme le mot de passe : ");
if (pass !== again) { console.error("✗ Les deux mots de passe sont différents."); process.exit(1); }

const totpSecret = newTotpSecret();
const vars = codeOnly ? { ADMIN_TOTP_SECRET: totpSecret } : {
  ADMIN_PASSWORD_HASH: hashPassword(pass),
  ADMIN_SESSION_SECRET: crypto.randomBytes(48).toString("base64url"),
  ADMIN_TOTP_SECRET: totpSecret,
  GITHUB_REPO: "EddahiryAmine/portfolio-Amine",
};

console.log("\nEnregistrement dans Vercel…");
for (const [name, value] of Object.entries(vars)) {
  run(["env", "rm", name, "production", "--yes"]); // supprime l'ancienne valeur si elle existe
  const r = run(["env", "add", name, "production"], value);
  const ok = r.status === 0;
  console.log(`  ${ok ? "✓" : "✗"} ${name}`);
  if (!ok) { console.error((r.stderr || r.stdout || "").trim().split("\n").slice(-3).join("\n")); process.exit(1); }
}

console.log("\nRedéploiement (environ 1 minute)…");
const d = run(["deploy", "--prod", "--yes"]);
console.log(d.status === 0 ? "  ✓ Site redéployé" : "  ✗ Redéploiement échoué : lance « npx vercel --prod » à la main.");

console.log(`
──────────────── Dernière étape : Google Authenticator ────────────────
1. Supprime l'ancienne entrée « Portfolio Amine » si elle existe.
2. Appuie sur + → « Saisir une clé de configuration »
     Nom : Portfolio Amine
     Clé : ${totpSecret}
     Type : basé sur l'heure
3. Vérifie : le code affiché par l'appli doit être ${totp(totpSecret)} (il change toutes les 30 s).
   S'il est différent, règle l'heure du téléphone sur « automatique ».

Ensuite : https://amine-eddahiry.vercel.app/admin
───────────────────────────────────────────────────────────────────────
`);
