// Contenu du portfolio.
// Les données modifiables (profil, parcours, projets, certifs, études, langues, avis) sont dans site.json,
// éditable depuis la page /admin. Ici : les constantes fixes du site.
import SITE from "./site.json";

export const PROFILE = SITE.profile;
export const ROLE = SITE.role;
export const COMPANY = SITE.company;
export const CERT_TOTAL = SITE.certTotal;
export const LANGUAGES = SITE.languages;
export const EXPERIENCE = SITE.experience;
export const PROJECTS = SITE.projects;
export const CERTIFICATIONS = SITE.certifications;
export const EDUCATION = SITE.education;

// Ma bande-son (Spotify). trackId = la partie après /track/ dans le lien Spotify.
export const SPOTIFY = {
  trackId: "4k2a36VX1rzKerMZqb1Dok",
  title: "Before I Go",
  artist: "TalkinToys",
  track: "https://open.spotify.com/track/4k2a36VX1rzKerMZqb1Dok",
  profile: "https://open.spotify.com/user/31n2btoywtjissfh57bpsshsspda",
};

export const HELLO = [
  ["Hello", "en"], ["Hola", "es"], ["مرحبا", "ar"], ["你好", "zh"], ["こんにちは", "ja"], ["Hallo", "de"], ["Ciao", "it"],
  ["Olá", "pt"], ["Привет", "ru"], ["안녕하세요", "ko"], ["नमस्ते", "hi"], ["Merhaba", "tr"], ["Bonjour", "fr"],
];

// [id de section, icône]. Les libellés sont dans src/i18n/strings.js (nav.*).
export const NAV = [
  ["about", "user"],
  ["parcours", "branch"],
  ["projets", "folder"],
  ["certifs", "award"],
  ["formation", "cap"],
  ["ask", "spark"],
  ["contact", "mail"],
];

export const PROJECT_KINDS = [
  ["all", { fr: "Tous", en: "All" }], ["stage", { fr: "Stages", en: "Internships" }], ["academique", { fr: "Académiques", en: "Academic" }], ["perso", { fr: "Perso", en: "Personal" }],
];
