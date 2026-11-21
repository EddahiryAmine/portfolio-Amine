// Contenu du portfolio. Les textes traduits s'écrivent { fr: "…", en: "…" }.
export const PROFILE = {
  name: "Amine Eddahiry",
  email: "eddahiryamine@gmail.com",
  phone: "+212 724546394",
  city: "Casablanca",
  linkedin: "https://www.linkedin.com/in/eddahiry-amine/",
  linkedinCerts: "https://www.linkedin.com/in/eddahiry-amine/details/certifications/",
  instagram: "https://www.instagram.com/edd_amine_/",
  handle: "@edd_amine_",
  whatsapp: "https://wa.me/212724546394",
  github: "https://github.com/EddahiryAmine",
  githubHandle: "EddahiryAmine",
};

export const ROLE = "Software Engineer";
export const COMPANY = "Capgemini";

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

// Langues parlées. level : 0 à 100 (pour la jauge).
export const LANGUAGES = [
  { code: "ar", native: "العربية", name: { fr: "Arabe", en: "Arabic" }, level: 100, label: { fr: "Langue maternelle", en: "Native" } },
  { code: "fr", native: "Français", name: { fr: "Français", en: "French" }, level: 90, label: { fr: "Avancé", en: "Advanced" } },
  { code: "en", native: "English", name: { fr: "Anglais", en: "English" }, level: 75, label: { fr: "Professionnel", en: "Professional" } },
];

export const EXPERIENCE = [
  { title: "Software Engineer", place: "Capgemini, Casablanca", date: { fr: "Depuis sept. 2026", en: "Since Sep. 2026" }, current: true,
    text: { fr: "Développement et maintenance d’API REST en .NET, conception de fonctionnalités backend, documentation Swagger et tests Postman.",
      en: "Building and maintaining .NET REST APIs, designing backend features, Swagger documentation and Postman testing." },
    tags: ["C#", ".NET", "API REST", "Swagger", "Postman", "Oracle", "Azure DevOps"] },
  { title: "Software Engineer Intern (PFE)", place: { fr: "Capgemini · client Randstad France", en: "Capgemini · client Randstad France" }, date: { fr: "Mars à août 2026", en: "Mar. to Aug. 2026" },
    text: { fr: "Applications web en TMA, backend et frontend en .NET, Oracle Database, en Agile via Azure DevOps. Projet de fin d’études soutenu avec succès.",
      en: "Web application maintenance (TMA), .NET backend and frontend, Oracle Database, Agile with Azure DevOps. Final-year project successfully defended." },
    tags: [".NET", "C#", "VB.NET", "Oracle", "Agile/Scrum"] },
  { title: { fr: "Stagiaire développeur mobile", en: "Mobile Developer Intern" }, place: { fr: "EQDOM, Casablanca · sur site", en: "EQDOM, Casablanca · on-site" }, date: { fr: "Juil. à août 2025", en: "Jul. to Aug. 2025" },
    text: { fr: "Application mobile de détection des CNIE frauduleuses : intégration du SDK Mon eID via un bridge Kotlin pour authentifier les clients par leur CNIE, accès gérés par Keycloak.",
      en: "Mobile app detecting fraudulent national ID cards (CNIE): integrated the Mon eID SDK through a Kotlin bridge to authenticate customers by their ID, with access managed by Keycloak." },
    tags: ["Spring Boot", "React Native", "Kotlin", "Keycloak", "PostgreSQL"] },
  { title: { fr: "Stagiaire développeur backend", en: "Backend Developer Intern" }, place: { fr: "BS-Link · à distance", en: "BS-Link · remote" }, date: { fr: "Juil. à août 2024", en: "Jul. to Aug. 2024" },
    text: { fr: "Application web .NET de suivi des demandes d’achat dans un contexte ERP, inspirée d’une fonctionnalité de Dynamics.",
      en: ".NET web application to track purchase requests in an ERP context, inspired by a Dynamics feature." },
    tags: [".NET", "Dynamics 365 Business Central", "SQL Server"] },
];

// kind : "stage" | "academique" | "perso" (sert au filtre). repo : lien GitHub (facultatif).
export const PROJECTS = [
  { slug: "cnie-check", title: { fr: "Détection des CNIE frauduleuses", en: "Fraudulent ID Card Detection" }, status: { fr: "Stage · EQDOM · 2025", en: "Internship · EQDOM · 2025" }, kind: "stage",
    text: { fr: "Application mobile qui vérifie l’identité des clients à partir de leur CNIE grâce au SDK Mon eID, intégré dans React Native via un bridge Kotlin. Backend Spring Boot, authentification et rôles gérés par Keycloak.",
      en: "Mobile app that verifies customers’ identity from their national ID card using the Mon eID SDK, integrated into React Native through a Kotlin bridge. Spring Boot backend, authentication and roles managed by Keycloak." },
    tags: ["React Native", "Kotlin", "Spring Boot", "Keycloak", "PostgreSQL"] },
  { slug: "achats-erp", title: { fr: "Suivi des demandes d’achat", en: "Purchase Request Tracking" }, status: { fr: "Stage · BS-Link · 2024", en: "Internship · BS-Link · 2024" }, kind: "stage",
    text: { fr: "Application web .NET de suivi des demandes d’achat dans un contexte ERP, inspirée d’une fonctionnalité de Dynamics 365 Business Central : création, validation et suivi de l’état de chaque demande.",
      en: ".NET web app to track purchase requests in an ERP context, inspired by a Dynamics 365 Business Central feature: creating, approving and following the status of each request." },
    tags: [".NET", "C#", "SQL Server", "Dynamics 365 BC"] },
  { slug: "dar-vision", title: "Dar Vision", status: { fr: "Projet académique", en: "Academic project" }, kind: "academique",
    text: { fr: "Design d’intérieur par IA : l’utilisateur téléverse une photo de pièce, un modèle la détecte, puis génère un nouveau design dans le style choisi grâce à Stable Diffusion, orchestré par un backend en microservices.",
      en: "AI interior design: the user uploads a photo of a room, a model detects it, then generates a new design in the chosen style with Stable Diffusion, orchestrated by a microservices backend." },
    tags: ["Spring Boot", "Python", "Deep Learning", "Stable Diffusion", "MongoDB"] },
  { slug: "smartfun-2030", title: "SmartFun 2030", status: { fr: "Projet académique", en: "Academic project" }, kind: "academique",
    text: { fr: "Plateforme de gestion d’événements sportifs basée sur des API REST sécurisées, avec envoi automatique des billets électroniques par email et gestion des accès utilisateurs.",
      en: "Sports event management platform built on secured REST APIs, with automatic e-ticket delivery by email and user access management." },
    tags: ["Spring Boot", "Angular", "Spring Security", "JWT", "RabbitMQ", "n8n", "MongoDB"] },
  { slug: "emsi-study-space", title: "EMSI Study Space", status: { fr: "Projet académique", en: "Academic project" }, kind: "academique",
    repo: "https://github.com/EddahiryAmine/EmsiStudySpace",
    text: { fr: "Plateforme web pour les étudiants de l’EMSI, en ASP.NET Core MVC : comptes et connexion avec ASP.NET Identity, couche de services, base de données gérée par Entity Framework Core et ses migrations.",
      en: "Web platform for EMSI students in ASP.NET Core MVC: accounts and sign-in with ASP.NET Identity, a service layer, and a database managed with Entity Framework Core migrations." },
    tags: ["C#", "ASP.NET Core MVC", ".NET 8", "Identity", "EF Core"] },
  { slug: "job-portal", title: "Job Portal", status: { fr: "Projet de fin d’année (PFA)", en: "End-of-year project" }, kind: "academique",
    repo: "https://github.com/EddahiryAmine/ProjetPFA",
    text: { fr: "Portail d’offres d’emploi avec une API Laravel côté serveur et une interface React stylée avec Tailwind CSS.",
      en: "Job board with a Laravel API on the server side and a React interface styled with Tailwind CSS." },
    tags: ["Laravel", "PHP", "React", "Tailwind CSS"] },
  { slug: "portfolio", title: { fr: "Ce portfolio", en: "This portfolio" }, status: { fr: "Projet perso", en: "Personal project" }, kind: "perso",
    text: { fr: "Le site que tu regardes : deux univers (pro et perso), assistant Amine IA, deux langues, palette de commandes Ctrl+K, thème clair/sombre et en-têtes de sécurité stricts.",
      en: "The site you’re looking at: two worlds (pro and personal), the Amine AI assistant, two languages, a Ctrl+K command palette, light/dark theme and strict security headers." },
    tags: ["React", "Vite", "CSS", "Vercel"] },
];

export const PROJECT_KINDS = [
  ["all", { fr: "Tous", en: "All" }], ["stage", { fr: "Stages", en: "Internships" }], ["academique", { fr: "Académiques", en: "Academic" }], ["perso", { fr: "Perso", en: "Personal" }],
];

export const CERTIFICATIONS = [
  { title: "Oracle Certified Professional, Java SE 17 Developer", issuer: "Oracle", year: { fr: "Janv. 2026", en: "Jan. 2026" }, mono: "Oracle", color: "#C74634", kind: { fr: "Certification professionnelle", en: "Professional certification" }, featured: true },
  { title: { fr: "Apprentissage automatique avec Python", en: "Machine Learning with Python" }, issuer: "IBM", year: { fr: "Déc. 2025", en: "Dec. 2025" }, mono: "IBM", color: "#0F62FE", kind: { fr: "Certificat", en: "Certificate" }, id: "04JT1A94JN4G" },
  { title: "Advanced React", issuer: "Meta · Coursera", year: "2025", mono: "Meta", color: "#0866FF", kind: { fr: "Certificat", en: "Certificate" } },
  { title: "Introduction to Java and Object-Oriented Programming", issuer: "University of Pennsylvania", year: "2025", mono: "Penn", color: "#011F5B", kind: { fr: "Certificat", en: "Certificate" } },
  { title: "Containers with Docker, Kubernetes & OpenShift", issuer: "IBM · Coursera", year: "2024", mono: "IBM", color: "#0F62FE", kind: { fr: "Certificat", en: "Certificate" } },
  { title: { fr: "Villes africaines : environnement et développement durable", en: "African Cities: Environment and Sustainable Development" }, issuer: "EPFL", year: { fr: "Mai 2024", en: "May 2024" }, mono: "EPFL", color: "#E2001A", kind: { fr: "Certificat", en: "Certificate" }, id: "LKSF9M682BAR" },
];
export const CERT_TOTAL = 21;

export const EDUCATION = [
  { years: "2023—26", title: { fr: "Cycle ingénieur MIAGE", en: "Engineering degree, MIAGE" }, place: "EMSI, Casablanca",
    text: { fr: "Ingénierie informatique et réseaux. PFE chez Capgemini, soutenu avec succès.", en: "Computer and network engineering. Final-year project at Capgemini, successfully defended." } },
  { years: "2021—23", title: { fr: "Technicien spécialisé", en: "Specialized Technician diploma" }, place: "ISFO, Casablanca",
    text: { fr: "Développement digital, option Web Full Stack.", en: "Digital development, Full Stack Web track." } },
  { years: "2021", title: { fr: "Baccalauréat", en: "Baccalaureate" }, place: "Lycée Ibn Al Khatib, Casablanca",
    text: { fr: "Sciences physiques, option française.", en: "Physical sciences, French track." } },
];
