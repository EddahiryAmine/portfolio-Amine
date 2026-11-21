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
