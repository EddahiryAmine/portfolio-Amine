// Études de cas (page #projet/<slug>). Textes { fr, en }.
// highlights = chiffres clés (en haut de page et sur la carte). features = ce que fait l'application.
// Schéma : `cols` = colonnes de blocs (gauche → droite), `edges` = flèches [de, vers, libellé].
// kind d'un bloc : "client" | "service" | "data" | "ext".
// Captures : importe des images depuis src/assets/ et ajoute-les dans `shots`.

export const CASES = {
  "dar-vision": {
    year: "2025", role: { fr: "Projet de fin d’année (PFA)", en: "End-of-year project" }, duration: { fr: "Projet de bout en bout", en: "End-to-end project" },
    accent: "#E3A04A",
    highlights: [
      { v: "78 %", l: { fr: "de précision du modèle maison", en: "accuracy of the in-house model" } },
      { v: "2", l: { fr: "modèles d’IA complémentaires", en: "complementary AI models" } },
      { v: "5", l: { fr: "types de pièces reconnus", en: "room types recognized" } },
    ],
    summary: {
      fr: "Une application mobile de design intérieur où l’IA n’est pas seulement utilisée, mais construite : un modèle entraîné from scratch comprend la pièce, un second la redessine.",
      en: "An interior design mobile app where AI isn’t just used but built: a model trained from scratch understands the room, a second one redesigns it.",
    },
    problem: {
      fr: "Se projeter dans une pièce réaménagée est difficile. Pour proposer un design crédible, il faut d’abord comprendre ce qu’on regarde (salon, chambre, bureau, salle de bain, cuisine), puis transformer l’image sans perdre la structure réelle de la pièce.",
      en: "Picturing a redesigned room is hard. To propose a credible design, you first need to understand what you’re looking at (living room, bedroom, office, bathroom, kitchen), then transform the image without losing the room’s real structure.",
    },
    solution: {
      fr: "Modèle 1 : un EfficientNet-B0 conçu et entraîné from scratch détecte le type de pièce (78 % de précision). Modèle 2 : un modèle image-to-image pré-entraîné génère le nouveau design, piloté par une prompt construite dynamiquement à partir du type de pièce, du style et de la palette choisis.",
      en: "Model 1: an EfficientNet-B0 designed and trained from scratch detects the room type (78% accuracy). Model 2: a pre-trained image-to-image model generates the new design, driven by a prompt built dynamically from the room type, the chosen style and the color palette.",
    },
    features: {
      fr: ["Import d’une photo de pièce", "Détection automatique du type de pièce", "Choix du style et de la palette de couleurs", "Personnalisation par prompt textuelle", "Génération de designs réalistes", "Comparaison avant / après et régénération"],
      en: ["Upload a photo of a room", "Automatic room type detection", "Pick a style and a color palette", "Customize with a text prompt", "Realistic design generation", "Before / after comparison and regeneration"],
    },
    arch: {
      cols: [
        [{ id: "app", label: { fr: "App Flutter", en: "Flutter app" }, kind: "client" }],
        [{ id: "core", label: "Spring Boot", kind: "service" }],
        [{ id: "cls", label: "FastAPI · EfficientNet", kind: "service" }, { id: "gen", label: "FastAPI · img2img", kind: "service" }, { id: "n8n", label: "n8n", kind: "ext" }],
        [{ id: "db", label: "MongoDB", kind: "data" }],
      ],
      edges: [["app", "core", { fr: "photo + style", en: "photo + style" }], ["core", "cls", { fr: "type de pièce", en: "room type" }], ["core", "gen", "prompt"], ["core", "n8n", "notifications"], ["core", "db", { fr: "projets", en: "projects" }]],
    },
    decisions: [
      { t: { fr: "Un modèle entraîné from scratch", en: "A model trained from scratch" },
        d: { fr: "Plutôt qu’une API toute faite, un EfficientNet-B0 conçu, entraîné et évalué par nous : l’IA comprend le contexte réel de l’image avant de générer.", en: "Instead of an off-the-shelf API, an EfficientNet-B0 we designed, trained and evaluated: the AI understands the image’s real context before generating." } },
      { t: { fr: "Une prompt construite dynamiquement", en: "A dynamically built prompt" },
        d: { fr: "Type de pièce détecté + style + palette assemblés automatiquement : l’utilisateur n’a pas besoin de savoir écrire une prompt.", en: "Detected room type + style + palette assembled automatically: users don’t need to know how to write a prompt." } },
      { t: { fr: "L’IA isolée en microservices Python", en: "AI isolated in Python microservices" },
        d: { fr: "Les modèles tournent derrière FastAPI, Spring Boot orchestre : on peut remplacer un modèle sans toucher au reste.", en: "Models run behind FastAPI while Spring Boot orchestrates: a model can be replaced without touching the rest." } },
    ],
    learned: {
      fr: "Concevoir et entraîner un modèle d’IA personnalisé, puis l’intégrer dans une architecture distribuée pour transformer une idée en application fonctionnelle.",
      en: "Designing and training a custom AI model, then integrating it into a distributed architecture to turn an idea into a working app.",
    },
    shots: [],
  },

  "smartfun-2030": {
    year: "2025", role: { fr: "Projet académique", en: "Academic project" }, duration: { fr: "Architecture microservices", en: "Microservices architecture" },
    accent: "#5B8DEF",
    highlights: [
      { v: "API Gateway", l: { fr: "point d’entrée unique et sécurisé", en: "single, secured entry point" } },
      { v: "Async", l: { fr: "emails et tickets via RabbitMQ", en: "emails and tickets via RabbitMQ" } },
      { v: "1 base", l: { fr: "MongoDB par service", en: "MongoDB per service" } },
    ],
    summary: {
      fr: "Une plateforme de billetterie d’événements sportifs pensée comme un système de production : découplée, sécurisée et orientée événements.",
      en: "A sports event ticketing platform designed like a production system: decoupled, secured and event-driven.",
    },
    problem: {
      fr: "Une billetterie doit encaisser des pics d’achats, protéger les accès selon le rôle et envoyer chaque ticket de façon fiable, même si un service est lent. Un monolithe y répond mal.",
      en: "A ticketing system must absorb purchase spikes, protect access by role and deliver every ticket reliably, even when a service is slow. A monolith handles this poorly.",
    },
    solution: {
      fr: "Des microservices Spring Boot découverts par Eureka, exposés derrière Spring Cloud Gateway (routage + sécurité JWT), qui se parlent en synchrone avec OpenFeign et en asynchrone avec RabbitMQ. À l’inscription, un email de confirmation part automatiquement ; après l’achat, le ticket est généré et envoyé par email.",
      en: "Spring Boot microservices discovered through Eureka, exposed behind Spring Cloud Gateway (routing + JWT security), talking synchronously with OpenFeign and asynchronously with RabbitMQ. A confirmation email goes out on sign-up; after purchase, the ticket is generated and emailed.",
    },
    features: {
      fr: ["Catalogue d’événements sportifs", "Inscription avec email de confirmation", "Achat de billets en ligne", "Ticket généré et envoyé par email", "Rôles et accès sécurisés (JWT)", "Interface Angular moderne et réactive"],
      en: ["Sports events catalog", "Sign-up with confirmation email", "Online ticket purchase", "Ticket generated and emailed", "Secured roles and access (JWT)", "Modern, reactive Angular interface"],
    },
    arch: {
      cols: [
        [{ id: "ng", label: "Angular", kind: "client" }],
        [{ id: "gw", label: "API Gateway", kind: "service" }, { id: "eu", label: "Eureka", kind: "ext" }],
        [{ id: "svc", label: { fr: "Services métier", en: "Business services" }, kind: "service" }, { id: "mq", label: "RabbitMQ", kind: "ext" }],
        [{ id: "db", label: { fr: "MongoDB / service", en: "MongoDB / service" }, kind: "data" }, { id: "mail", label: { fr: "Service email", en: "Email service" }, kind: "service" }],
      ],
      edges: [["ng", "gw", "HTTPS + JWT"], ["gw", "svc", { fr: "routage", en: "routing" }], ["gw", "eu", "discovery"], ["svc", "db", ""], ["svc", "mq", { fr: "événements", en: "events" }], ["mq", "mail", { fr: "ticket", en: "ticket" }]],
    },
    decisions: [
      { t: { fr: "API Gateway Pattern", en: "API Gateway pattern" },
        d: { fr: "Un seul point d’entrée qui route, vérifie le JWT et centralise les accès : les services restent simples et invisibles de l’extérieur.", en: "A single entry point that routes, checks the JWT and centralizes access: services stay simple and hidden from the outside." } },
      { t: { fr: "Synchrone quand il faut, asynchrone sinon", en: "Sync when needed, async otherwise" },
        d: { fr: "OpenFeign pour les appels qui attendent une réponse, RabbitMQ pour les emails et tickets : un pic d’achats ne bloque jamais la plateforme.", en: "OpenFeign for calls that need an answer, RabbitMQ for emails and tickets: a purchase spike never blocks the platform." } },
      { t: { fr: "Database-per-service", en: "Database-per-service" },
        d: { fr: "Chaque service possède sa base MongoDB : faible couplage, forte cohésion et évolution indépendante.", en: "Each service owns its MongoDB database: loose coupling, high cohesion and independent evolution." } },
    ],
    learned: {
      fr: "Concevoir une architecture backend proche des standards professionnels : découverte de services, sécurité stateless, communication orientée événements.",
      en: "Designing a backend architecture close to industry standards: service discovery, stateless security, event-driven communication.",
    },
    shots: [],
  },

  "cnie-check": {
    year: "2025", role: { fr: "Stagiaire développeur mobile · EQDOM", en: "Mobile developer intern · EQDOM" }, duration: { fr: "2 mois", en: "2 months" },
    accent: "#7FD99A",
    highlights: [
      { v: "CNIE", l: { fr: "vérifiée via le service Mon eID", en: "verified through the Mon eID service" } },
      { v: "Kotlin", l: { fr: "bridge natif vers React Native", en: "native bridge to React Native" } },
      { v: "Keycloak", l: { fr: "authentification et rôles", en: "authentication and roles" } },
    ],
    summary: {
      fr: "Une application mobile qui vérifie qu’une carte d’identité nationale (CNIE) est authentique avant d’ouvrir un dossier client, pour limiter la fraude documentaire.",
      en: "A mobile app that checks that a national ID card (CNIE) is genuine before opening a customer file, to reduce document fraud.",
    },
    problem: {
      fr: "Dans le crédit à la consommation, une fausse pièce d’identité coûte cher, et la vérification manuelle est lente. L’objectif : s’appuyer sur le service officiel Mon eID pour authentifier le client de façon fiable.",
      en: "In consumer credit, a fake ID card is expensive and manual checks are slow. The goal: rely on the official Mon eID service to authenticate customers reliably.",
    },
    solution: {
      fr: "Une application React Native qui pilote le SDK Mon eID à travers un bridge Kotlin, un backend Spring Boot qui enregistre chaque vérification, et Keycloak pour l’authentification des agents et la gestion des rôles.",
      en: "A React Native app driving the Mon eID SDK through a Kotlin bridge, a Spring Boot backend that records every verification, and Keycloak for agent authentication and role management.",
    },
    features: {
      fr: ["Vérification de la CNIE du client", "Connexion sécurisée des agents", "Historique des vérifications côté serveur", "Accès selon le rôle"],
      en: ["Customer ID card verification", "Secured agent sign-in", "Server-side verification history", "Role-based access"],
    },
    arch: {
      cols: [
        [{ id: "app", label: "App React Native", kind: "client" }],
        [{ id: "bridge", label: "Bridge Kotlin", kind: "service" }, { id: "kc", label: "Keycloak", kind: "ext" }],
        [{ id: "sdk", label: "SDK Mon eID", kind: "ext" }, { id: "api", label: "API Spring Boot", kind: "service" }],
        [{ id: "db", label: "PostgreSQL", kind: "data" }],
      ],
      edges: [["app", "bridge", "NativeModule"], ["bridge", "sdk", "CNIE"], ["app", "kc", "OIDC"], ["app", "api", "REST + JWT"], ["api", "kc", { fr: "rôles", en: "roles" }], ["api", "db", "JPA"]],
    },
    decisions: [
      { t: { fr: "Bridge natif plutôt qu’une réécriture", en: "A native bridge instead of a rewrite" },
        d: { fr: "Le SDK s’intègre côté natif : un module Kotlin exposé à React Native garde une seule base de code pour l’interface.", en: "The SDK integrates on the native side: a Kotlin module exposed to React Native keeps a single UI codebase." } },
      { t: { fr: "Keycloak pour les accès", en: "Keycloak for access control" },
        d: { fr: "Connexion OpenID Connect, jeton et rôles vérifiés par l’API : aucune gestion de mots de passe maison.", en: "OpenID Connect sign-in, token and roles checked by the API: no home-made password handling." } },
      { t: { fr: "Tracer chaque vérification", en: "Log every verification" },
        d: { fr: "Le résultat de chaque contrôle est enregistré côté serveur pour l’audit.", en: "Every check result is stored server-side for auditing." } },
    ],
    learned: {
      fr: "Faire dialoguer JavaScript et code natif, et sécuriser une API de bout en bout avec Keycloak dans un contexte réglementé.",
      en: "Bridging JavaScript and native code, and securing an API end to end with Keycloak in a regulated context.",
    },
    shots: [],
  },
};
