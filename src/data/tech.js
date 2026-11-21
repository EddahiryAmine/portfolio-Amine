import {
  siDotnet, siOpenjdk, siSpringboot, siOracle, siReact, siAngular, siTypescript, siJavascript, siPython, siDocker, siKubernetes,
  siGitlab, siGit, siGithub, siPostgresql, siMongodb, siMysql, siRabbitmq, siApachekafka, siKeycloak, siSwagger, siPostman,
  siSonarqube, siFlutter, siFastapi, siDjango, siLaravel, siPhp, siJsonwebtokens, siJira, siFigma, siKotlin, siTailwindcss,
  siScikitlearn, siOpenid, siSpringsecurity, siPandas,
} from "simple-icons";

// Mes technologies. lvl : 5 = au quotidien, 4 = maîtrisé, 3 = pratiqué, 2 = notions. Ajuste librement.
// icon : logo officiel (simple-icons). mono + color : pastille quand le logo n'existe pas.
// ring : 0, 1 ou 2 = anneau de l'orbite (0 = le plus proche). Sans ring, la techno n'apparaît que dans la grille.
export const TECH = [
  { name: "C#", mono: "C#", color: "#9B4F96", cat: "back", lvl: 5, ring: 0, ctx: "Mon langage principal chez Capgemini : API REST, services backend." },
  { name: ".NET", icon: siDotnet, cat: "back", lvl: 5, ring: 0, ctx: "API REST, applications web en TMA, ASP.NET Core MVC, EF Core." },
  { name: "Java", icon: siOpenjdk, color: "#E76F00", cat: "back", lvl: 4, ring: 0, ctx: "Oracle Certified Professional Java SE 17. Projets académiques en Spring." },
  { name: "Spring Boot", icon: siSpringboot, cat: "back", lvl: 4, ring: 0, ctx: "Backend du stage EQDOM, Dar Vision (microservices) et SmartFun 2030." },
  { name: "Oracle", icon: siOracle, cat: "data", lvl: 5, ring: 0, ctx: "Base de données au quotidien chez Capgemini. DBA 1 et 2, SQL Tuning." },
  { name: "React", icon: siReact, cat: "front", lvl: 4, ring: 1, ctx: "Certificat Meta Advanced React. Ce portfolio, le Job Portal." },
  { name: "React Native", icon: siReact, color: "#61DAFB", cat: "front", lvl: 4, ctx: "Application mobile de détection des CNIE frauduleuses chez EQDOM." },
  { name: "Angular", icon: siAngular, cat: "front", lvl: 3, ring: 1, ctx: "Frontend de SmartFun 2030." },
  { name: "TypeScript", icon: siTypescript, cat: "front", lvl: 4, ring: 1, ctx: "Angular et projets React typés." },
  { name: "JavaScript", icon: siJavascript, cat: "front", lvl: 4, ctx: "Front web, outillage, ce portfolio." },
  { name: "Python", icon: siPython, cat: "data", lvl: 4, ring: 1, ctx: "Machine Learning (certificat IBM), deep learning pour Dar Vision, FastAPI." },
  { name: "Docker", icon: siDocker, cat: "devops", lvl: 4, ring: 1, ctx: "Conteneurisation des microservices. Certificat IBM Docker, Kubernetes et OpenShift." },
  { name: "PostgreSQL", icon: siPostgresql, cat: "data", lvl: 4, ring: 1, ctx: "Base de données du stage EQDOM." },
  { name: "MongoDB", icon: siMongodb, cat: "data", lvl: 4, ring: 1, ctx: "Dar Vision et SmartFun 2030." },
  { name: "Azure DevOps", mono: "Az", color: "#0078D7", cat: "devops", lvl: 5, ring: 2, ctx: "Boards, repos et sprints Agile au quotidien chez Capgemini." },
  { name: "Swagger", icon: siSwagger, cat: "tools", lvl: 5, ring: 2, ctx: "Documentation de toutes mes API REST." },
  { name: "Postman", icon: siPostman, cat: "tools", lvl: 5, ring: 2, ctx: "Tests et vérification des endpoints." },
  { name: "Keycloak", icon: siKeycloak, cat: "sec", lvl: 4, ring: 2, ctx: "Gestion des accès et des rôles chez EQDOM." },
  { name: "Git", icon: siGit, cat: "devops", lvl: 5, ring: 2, ctx: "Versionnage au quotidien." },
  { name: "GitLab CI/CD", icon: siGitlab, cat: "devops", lvl: 4, ring: 2, ctx: "Pipelines d’intégration et de déploiement continus." },
  { name: "Kafka", icon: siApachekafka, cat: "devops", lvl: 3, ring: 2, ctx: "Messagerie événementielle entre services." },
  { name: "RabbitMQ", icon: siRabbitmq, cat: "devops", lvl: 3, ring: 2, ctx: "Files de messages dans SmartFun 2030." },
  { name: "SQL Server", mono: "SQL", color: "#CC2927", cat: "data", lvl: 4, ctx: "Stage BS-Link (ERP Dynamics 365 Business Central)." },
  { name: "MySQL", icon: siMysql, cat: "data", lvl: 3, ctx: "Projets web (Laravel)." },
  { name: "scikit-learn", icon: siScikitlearn, cat: "data", lvl: 3, ctx: "Modèles de Machine Learning (certificat IBM)." },
  { name: "pandas", icon: siPandas, cat: "data", lvl: 3, ctx: "Préparation et analyse de données." },
  { name: "Kubernetes", icon: siKubernetes, cat: "devops", lvl: 2, ctx: "Certificat IBM Docker, Kubernetes et OpenShift." },
  { name: "SonarQube", icon: siSonarqube, cat: "devops", lvl: 3, ctx: "Qualité et dette technique du code." },
  { name: "GitHub", icon: siGithub, cat: "devops", lvl: 4, ctx: "Mes dépôts : github.com/EddahiryAmine." },
  { name: "Spring Security", icon: siSpringsecurity, cat: "sec", lvl: 4, ctx: "Sécurisation des API de SmartFun 2030." },
  { name: "JWT", icon: siJsonwebtokens, cat: "sec", lvl: 4, ctx: "Authentification sans état des API REST." },
  { name: "OpenID", icon: siOpenid, cat: "sec", lvl: 3, ctx: "Authentification fédérée avec Keycloak." },
  { name: "FastAPI", icon: siFastapi, cat: "back", lvl: 3, ctx: "Petites API Python." },
  { name: "Django", icon: siDjango, cat: "back", lvl: 2, ctx: "Applications web Python." },
  { name: "Laravel", icon: siLaravel, cat: "back", lvl: 3, ctx: "API du Job Portal (PFA)." },
  { name: "PHP", icon: siPhp, cat: "back", lvl: 3, ctx: "Job Portal et projets web." },
  { name: "Kotlin", icon: siKotlin, cat: "front", lvl: 2, ctx: "Bridge natif du SDK Mon eID chez EQDOM." },
  { name: "Flutter", icon: siFlutter, cat: "front", lvl: 2, ctx: "Applications mobiles multiplateformes." },
  { name: "Tailwind CSS", icon: siTailwindcss, cat: "front", lvl: 3, ctx: "Interface du Job Portal." },
  { name: "Jira", icon: siJira, cat: "tools", lvl: 4, ctx: "Suivi des tickets en Scrum." },
  { name: "ServiceNow", mono: "SN", color: "#62D84E", cat: "tools", lvl: 3, ctx: "Gestion des incidents en TMA." },
  { name: "Figma", icon: siFigma, cat: "tools", lvl: 3, ctx: "Maquettes et prototypes." },
];

export const TECH_CATS = [
  ["all", { fr: "Tout", en: "All" }], ["back", "Backend"], ["front", { fr: "Front et mobile", en: "Front & mobile" }], ["data", { fr: "Données et IA", en: "Data & AI" }],
  ["devops", "DevOps"], ["sec", { fr: "Sécurité", en: "Security" }], ["tools", { fr: "Outils", en: "Tools" }],
];
export const CAT_LABEL = Object.fromEntries(TECH_CATS);
export const LVL_LABEL = {
  fr: { 5: "Au quotidien", 4: "Maîtrisé", 3: "Pratiqué", 2: "Notions" },
  en: { 5: "Daily use", 4: "Proficient", 3: "Practiced", 2: "Basics" },
};

// Descriptions en anglais (clé = nom de la techno).
export const CTX_EN = {
  "C#": "My main language at Capgemini: REST APIs and backend services.",
  ".NET": "REST APIs, web application maintenance, ASP.NET Core MVC, EF Core.",
  "Java": "Oracle Certified Professional Java SE 17. Academic projects with Spring.",
  "Spring Boot": "Backend of the EQDOM internship, Dar Vision (microservices) and SmartFun 2030.",
  "Oracle": "My everyday database at Capgemini. DBA 1 & 2, SQL Tuning.",
  "React": "Meta Advanced React certificate. This portfolio, the Job Portal.",
  "React Native": "Fraudulent ID card detection mobile app at EQDOM.",
  "Angular": "SmartFun 2030 frontend.",
  "TypeScript": "Angular and typed React projects.",
  "JavaScript": "Web front-ends, tooling, this portfolio.",
  "Python": "Machine Learning (IBM certificate), deep learning for Dar Vision, FastAPI.",
  "Docker": "Containerizing microservices. IBM Docker, Kubernetes & OpenShift certificate.",
  "PostgreSQL": "Database of the EQDOM internship.",
  "MongoDB": "Dar Vision and SmartFun 2030.",
  "Azure DevOps": "Boards, repos and Agile sprints every day at Capgemini.",
  "Swagger": "Documentation for all my REST APIs.",
  "Postman": "Testing and validating endpoints.",
  "Keycloak": "Access and role management at EQDOM.",
  "Git": "Version control, every day.",
  "GitLab CI/CD": "Continuous integration and deployment pipelines.",
  "Kafka": "Event-driven messaging between services.",
  "RabbitMQ": "Message queues in SmartFun 2030.",
  "SQL Server": "BS-Link internship (Dynamics 365 Business Central ERP).",
  "MySQL": "Web projects (Laravel).",
  "scikit-learn": "Machine Learning models (IBM certificate).",
  "pandas": "Data preparation and analysis.",
  "Kubernetes": "IBM Docker, Kubernetes & OpenShift certificate.",
  "SonarQube": "Code quality and technical debt.",
  "GitHub": "My repositories: github.com/EddahiryAmine.",
  "Spring Security": "Securing the SmartFun 2030 APIs.",
  "JWT": "Stateless authentication for REST APIs.",
  "OpenID": "Federated authentication with Keycloak.",
  "FastAPI": "Small Python APIs.",
  "Django": "Python web applications.",
  "Laravel": "Job Portal API (end-of-year project).",
  "PHP": "Job Portal and web projects.",
  "Kotlin": "Native bridge for the Mon eID SDK at EQDOM.",
  "Flutter": "Cross-platform mobile apps.",
  "Tailwind CSS": "Job Portal interface.",
  "Jira": "Ticket tracking in Scrum.",
  "ServiceNow": "Incident management in application maintenance.",
  "Figma": "Mock-ups and prototypes.",
};
export const techCtx = (t, lang) => (lang === "en" && CTX_EN[t.name]) || t.ctx;

// Couleur de marque, lisible sur fond clair comme sombre.
export const techColor = (t) => t.color || (t.icon ? "#" + t.icon.hex : "#888");
export const isDark = (hex) => {
  const n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 60;
};
