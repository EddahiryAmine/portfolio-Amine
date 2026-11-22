# Portfolio – Amine Eddahiry

React + Vite. Deux univers séparés :
- **Pro** (minuit, pluie fine, clair de lune) : intro « boot » multilingue, bento, parcours façon git log, projets en terminaux,
  certifications, frise de formation, CV, assistant **Ask about me**, contact. Thème clair/sombre. Palette Ctrl+K.
- **Perso** (nuit, ambre) : photographie, bande-son Spotify, Instagram.
La musique (« Before I Go » de TalkinToys) est présente des deux côtés.

## Démarrer
```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # dossier dist/ à mettre en ligne
npm run build:single # un seul fichier HTML (dist-single/index.html)
```

## Assistant « Ask about me »
- Par défaut, il répond depuis `src/lib/knowledge.js` : aucun serveur, aucune clé, rien n’est envoyé.
- Pour une vraie IA (Vercel) : ajoute la variable `ANTHROPIC_API_KEY` dans Vercel, et crée un fichier `.env.production`
  contenant `VITE_ASK_ENDPOINT=/api/ask`. La clé reste sur le serveur (`api/ask.js`), avec une limite de 15 questions / 10 min par IP.
  Attention : chaque question est facturée par l’API.

## Sécurité
- Aucun envoi de fichier par les visiteurs (la galerie est fixe).
- Lecteur Spotify chargé seulement au clic, dans une iframe isolée.
- En-têtes de sécurité (CSP, HSTS, nosniff…) : `vercel.json` (Vercel) et `public/_headers` (Netlify).
- Aucune clé ni secret dans le code du navigateur.

## Où modifier quoi
| Je veux changer…              | Fichier                              |
|-------------------------------|--------------------------------------|
| Textes (parcours, certifs…)   | `src/data/content.js`                |
| Mes coordonnées et liens      | `src/data/content.js` (`PROFILE`)    |
| Portrait du hero (PNG/WebP détouré)| `src/assets/amine.webp`         |
| Poste / entreprise            | `ROLE` et `COMPANY` dans `src/data/content.js` |
| Chanson Spotify               | `SPOTIFY` dans `src/data/content.js` |
| Mes photos                    | déposer les images dans `src/assets/photos/` ; titres et tags dans `src/data/photoInfo.js` |
| Réponses de l’assistant       | `src/lib/knowledge.js` |
| Certifications                | `CERTIFICATIONS` dans `src/data/content.js` |
| Mon CV                        | remplacer `src/assets/CV_Amine_Eddahiry.pdf` et `cv-preview.webp` |
| Instagram, WhatsApp, liens    | `PROFILE` dans `src/data/content.js` |
| Couleurs et thème             | `src/styles/global.css` (variables en haut) |
| Textes de l’interface (FR / EN) | `src/i18n/strings.js` |
| Contenus traduits             | `src/data/content.js` : chaque texte s’écrit `{ fr: "…", en: "…" }` |
| Langues parlées (jauges)      | `LANGUAGES` dans `src/data/content.js` |
| Compétences, niveaux, logos   | `src/data/tech.js` (descriptions anglaises dans `CTX_EN`) |
| Titres anglais des photos     | `title_en` dans `src/data/photoInfo.js` |
| Réponses de l’assistant en anglais | champ `en` de chaque entrée dans `src/lib/knowledge.js` |

### Photos
Dépose tes images (`.jpg`, `.png`, `.webp`) dans `src/assets/photos/`.
Le nom du fichier devient le titre : `ruelle-essaouira.jpg` → « ruelle essaouira ».
Tant que le dossier est vide, des illustrations d’exemple s’affichent.
Pour ajouter lieu et réglages, complète `src/data/photoInfo.js`.

## Déployer
Vercel ou Netlify : connecte le dépôt GitHub, commande `npm run build`, dossier `dist`.

## Espace admin (/admin)
Page secrète pour modifier le contenu sans toucher au code : profil, parcours, projets, certifications, études, langues, avis et photos (ajout, suppression, titres, tags).
Les modifications sont enregistrées sur GitHub (`src/data/site.json`, `src/data/photos.json`, `src/assets/photos/`) puis le site se redéploie tout seul.

**Sécurité** : mot de passe haché (scrypt), code à 6 chiffres (Google Authenticator), session signée en cookie HttpOnly / Secure / SameSite=Strict (2 h),
blocage après 5 échecs, requêtes refusées si elles ne viennent pas du site, validation stricte des données (liens `https://` uniquement, images vérifiées), page non indexée.

**Mise en place (une seule fois)**
1. `node scripts/admin-setup.mjs` : choisis ton mot de passe, le script affiche les valeurs à copier (rien n'est enregistré).
2. Ajoute le code dans Google Authenticator avec la clé affichée.
3. Crée un jeton GitHub : github.com → Settings → Developer settings → Fine-grained tokens → accès au seul dépôt `portfolio-Amine`, permission **Contents : Read and write**.
4. Vercel → projet → Settings → Environment Variables : `ADMIN_PASSWORD_HASH`, `ADMIN_SESSION_SECRET`, `ADMIN_TOTP_SECRET`, `GITHUB_TOKEN`, `GITHUB_REPO`.
5. Vercel → Settings → Git : connecte le dépôt GitHub (pour que chaque modification soit mise en ligne automatiquement).

⚠️ Après des modifications depuis /admin, fais `git pull` avant de modifier le code sur ton ordinateur.
