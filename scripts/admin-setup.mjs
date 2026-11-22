// Prépare les variables secrètes de l'espace admin. Usage : node scripts/admin-setup.mjs
// Demande un mot de passe, puis affiche les valeurs à copier dans Vercel (Settings → Environment Variables).
// Rien n'est enregistré sur le disque.
import crypto from "node:crypto";
import readline from "node:readline";
import { hashPassword, totp } from "../api/_lib/admin.js";

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((r) => rl.question(q, r));

const pass = await ask("Mot de passe admin (12 caractères minimum) : ");
if (pass.length < 12) { console.error("\n✗ Trop court : choisis au moins 12 caractères."); process.exit(1); }
const again = await ask("Confirme le mot de passe : ");
rl.close();
if (pass !== again) { console.error("\n✗ Les deux mots de passe sont différents."); process.exit(1); }

const B32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const totpSecret = [...crypto.randomBytes(20)].map((b) => B32[b % 32]).join("");
const otpauth = `otpauth://totp/Portfolio%20Amine:admin?secret=${totpSecret}&issuer=Portfolio%20Amine`;

console.log(`
──────── À copier dans Vercel → Settings → Environment Variables ────────

ADMIN_PASSWORD_HASH   = ${hashPassword(pass)}
ADMIN_SESSION_SECRET  = ${crypto.randomBytes(48).toString("base64url")}
ADMIN_TOTP_SECRET     = ${totpSecret}
GITHUB_REPO           = EddahiryAmine/portfolio-Amine
GITHUB_TOKEN          = (ton jeton GitHub, voir README)

Code à 6 chiffres : dans Google Authenticator, « Ajouter un code » → « Saisir une clé »,
  nom : Portfolio Amine, clé : ${totpSecret}
  (ou lien : ${otpauth})
  Code actuel pour vérifier : ${totp(totpSecret)}
──────────────────────────────────────────────────────────────────────────
`);
