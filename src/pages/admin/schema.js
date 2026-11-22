// Description des sections modifiables dans /admin. Types de champ :
// text, textarea, i18n (FR + EN), i18nArea, number, bool, color, url, select (options), tags (liste de mots).
// Les champs non décrits ici sont conservés tels quels à l'enregistrement.
const KINDS = [["stage", "Stage"], ["academique", "Académique"], ["perso", "Perso"]];
const RELATIONS = [["colleague", "Collègue"], ["manager", "Manager"], ["mentor", "Encadrant"], ["client", "Client"], ["classmate", "Camarade de projet"], ["other", "Autre"]];
export const PHOTO_TAGS = [["bw", "Noir et blanc"], ["golden", "Golden hour"], ["table", "Table"], ["street", "Street"], ["nuit", "Nuit"], ["archi", "Architecture"]];

export const SECTIONS = [
  {
    id: "profile", label: "Profil", icon: "user", kind: "object",
    fields: [
      ["$role", "Poste", "text"], ["$company", "Entreprise", "text"], ["$certTotal", "Nombre total de certifications", "number"],
      ["name", "Nom complet", "text"], ["email", "Email", "text"], ["phone", "Téléphone", "text"], ["city", "Ville", "text"],
      ["linkedin", "LinkedIn", "url"], ["linkedinCerts", "Page LinkedIn des certifications", "url"], ["github", "GitHub", "url"], ["githubHandle", "Pseudo GitHub", "text"],
      ["instagram", "Instagram", "url"], ["handle", "Pseudo Instagram", "text"], ["whatsapp", "Lien WhatsApp", "url"],
    ],
  },
  {
    id: "experience", label: "Parcours", icon: "branch", kind: "list", title: (x) => x.title,
    blank: { title: { fr: "", en: "" }, company: "", where: { fr: "", en: "" }, date: { fr: "", en: "" }, current: false, text: { fr: "", en: "" }, tags: [] },
    fields: [
      ["title", "Poste", "i18n"], ["company", "Entreprise", "text"], ["logo", "Logo", "select", [["", "Aucun (initiales)"], ["capgemini", "Capgemini"], ["eqdom", "EQDOM"]]],
      ["where", "Lieu / type", "i18n"], ["date", "Dates", "i18n"], ["current", "Poste actuel", "bool"], ["text", "Description", "i18nArea"], ["tags", "Technologies", "tags"],
    ],
  },
  {
    id: "projects", label: "Projets", icon: "folder", kind: "list", title: (x) => x.title,
    blank: { slug: "", title: { fr: "", en: "" }, status: { fr: "", en: "" }, kind: "academique", text: { fr: "", en: "" }, tags: [] },
    fields: [
      ["title", "Titre", "i18n"], ["slug", "Identifiant (sans espaces)", "text"], ["kind", "Catégorie", "select", KINDS], ["status", "Statut", "i18n"],
      ["repo", "Lien GitHub", "url"], ["text", "Description", "i18nArea"], ["tags", "Technologies", "tags"],
    ],
  },
  {
    id: "certifications", label: "Certifications", icon: "award", kind: "list", title: (x) => x.title,
    blank: { title: { fr: "", en: "" }, issuer: "", year: { fr: "", en: "" }, mono: "", color: "#34507E", kind: { fr: "Certificat", en: "Certificate" } },
    fields: [
      ["title", "Titre", "i18n"], ["issuer", "Organisme", "text"], ["year", "Date", "i18n"], ["kind", "Type", "i18n"],
      ["mono", "Texte du badge", "text"], ["color", "Couleur du badge", "color"], ["id", "Identifiant", "text"], ["featured", "Mise en avant", "bool"],
    ],
  },
  {
    id: "education", label: "Études", icon: "cap", kind: "list", title: (x) => x.title,
    blank: { years: "", title: { fr: "", en: "" }, place: "", text: { fr: "", en: "" } },
    fields: [["title", "Diplôme", "i18n"], ["years", "Années", "text"], ["place", "Établissement", "text"], ["text", "Description", "i18nArea"]],
  },
  {
    id: "languages", label: "Langues", icon: "globe", kind: "list", title: (x) => x.name,
    blank: { code: "", native: "", name: { fr: "", en: "" }, level: 50, label: { fr: "", en: "" } },
    fields: [["name", "Langue", "i18n"], ["code", "Code (ex. fr)", "text"], ["native", "Nom dans la langue", "text"], ["level", "Niveau (0 à 100)", "number"], ["label", "Niveau en mots", "i18n"]],
  },
  {
    id: "testimonials", label: "Avis", icon: "chat", kind: "list", title: (x) => x.name,
    blank: { quote: { fr: "", en: "" }, name: "", role: { fr: "", en: "" }, relation: "colleague", rating: 5 },
    note: "N’ajoute que des avis réels, avec l’accord de la personne.",
    fields: [["name", "Nom", "text"], ["role", "Poste et entreprise", "i18n"], ["relation", "Relation", "select", RELATIONS], ["rating", "Note (1 à 5)", "number"], ["quote", "Avis", "i18nArea"], ["linkedin", "LinkedIn", "url"]],
  },
  { id: "photos", label: "Photos", icon: "frame", kind: "photos" },
];
