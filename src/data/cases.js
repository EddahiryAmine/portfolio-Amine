// Études de cas (page #projet/<slug>). Textes { fr, en }.
// ⚠️ À relire par Amine : rédigé à partir des descriptions du CV et de LinkedIn. Ajuste les détails techniques,
// et ajoute des captures dans `shots` (import d'images depuis src/assets/) quand tu en as.
//
// Schéma d'architecture : `cols` = colonnes de blocs (de gauche à droite), `edges` = flèches [de, vers, libellé].
// kind d'un bloc : "client" | "service" | "data" | "ext" (change la couleur).

export const CASES = {
  "cnie-check": {
    year: "2025", role: { fr: "Stagiaire développeur mobile · EQDOM", en: "Mobile developer intern · EQDOM" }, duration: { fr: "2 mois", en: "2 months" },
    summary: {
      fr: "Une application mobile qui vérifie qu’une carte d’identité nationale (CNIE) est authentique avant d’ouvrir un dossier client, pour limiter la fraude documentaire.",
      en: "A mobile app that checks that a national ID card (CNIE) is genuine before opening a customer file, to reduce document fraud.",
    },
    problem: {
      fr: "Dans le crédit à la consommation, une fausse pièce d’identité coûte cher. La vérification manuelle est lente et dépend de l’œil de l’agent. EQDOM voulait s’appuyer sur la puce sécurisée de la CNIE et le service officiel Mon eID pour authentifier le client de façon fiable.",
      en: "In consumer credit, a fake ID card is expensive. Manual checks are slow and depend on the agent’s eye. EQDOM wanted to rely on the CNIE’s secure chip and the official Mon eID service to authenticate customers reliably.",
    },
    solution: {
      fr: "Une application React Native qui pilote le SDK natif Mon eID à travers un bridge Kotlin, un backend Spring Boot qui enregistre le résultat de la vérification, et Keycloak pour l’authentification des agents et la gestion des rôles.",
      en: "A React Native app driving the native Mon eID SDK through a Kotlin bridge, a Spring Boot backend that records the verification result, and Keycloak for agent authentication and role management.",
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
        d: { fr: "Le SDK Mon eID s’intègre côté natif. Un module Kotlin exposé à React Native garde une seule base de code pour l’interface tout en accédant au SDK.", en: "The Mon eID SDK integrates on the native side. A Kotlin module exposed to React Native keeps a single UI codebase while reaching the SDK." } },
      { t: { fr: "Keycloak pour les accès", en: "Keycloak for access control" },
        d: { fr: "Les agents se connectent en OpenID Connect ; l’API vérifie le jeton et les rôles. Pas de gestion de mots de passe maison.", en: "Agents sign in with OpenID Connect; the API checks the token and roles. No home-made password handling." } },
      { t: { fr: "Tracer chaque vérification", en: "Log every verification" },
        d: { fr: "Le résultat de chaque contrôle est enregistré côté serveur pour l’audit, jamais seulement sur le téléphone.", en: "Every check result is stored server-side for auditing, never only on the phone." } },
    ],
    learned: {
      fr: "Faire dialoguer JavaScript et code natif, sécuriser une API avec Keycloak de bout en bout, et travailler avec des contraintes réglementaires fortes.",
      en: "Bridging JavaScript and native code, securing an API end to end with Keycloak, and working under strong regulatory constraints.",
    },
    shots: [],
  },

  "dar-vision": {
    year: "2025", role: { fr: "Projet académique · EMSI", en: "Academic project · EMSI" }, duration: { fr: "Projet de semestre", en: "Semester project" },
    summary: {
      fr: "Design d’intérieur par IA : on prend une photo de sa pièce, on choisit un style, et l’application propose un nouvel aménagement réaliste.",
      en: "AI interior design: take a photo of your room, pick a style, and the app proposes a realistic new layout.",
    },
    problem: {
      fr: "Se projeter dans une pièce réaménagée est difficile, et faire appel à un décorateur coûte cher. L’idée : donner un aperçu immédiat d’un style (moderne, scandinave, marocain…) à partir d’une simple photo.",
      en: "Picturing a redesigned room is hard, and hiring a decorator is expensive. The idea: give an instant preview of a style (modern, Scandinavian, Moroccan…) from a single photo.",
    },
    solution: {
      fr: "Un backend en microservices : un service Spring Boot orchestre le parcours, un service Python détecte le type de pièce avec un modèle de deep learning, puis un service de génération transforme la photo avec Stable Diffusion (img2img) dans le style choisi. Les projets et résultats sont stockés dans MongoDB.",
      en: "A microservices backend: a Spring Boot service orchestrates the flow, a Python service detects the room type with a deep learning model, then a generation service transforms the photo with Stable Diffusion (img2img) in the chosen style. Projects and results are stored in MongoDB.",
    },
    arch: {
      cols: [
        [{ id: "ui", label: { fr: "Client web", en: "Web client" }, kind: "client" }],
        [{ id: "core", label: "Spring Boot", kind: "service" }],
        [{ id: "detect", label: { fr: "Détection (Python)", en: "Detection (Python)" }, kind: "service" }, { id: "gen", label: "Stable Diffusion", kind: "service" }],
        [{ id: "mongo", label: "MongoDB", kind: "data" }],
      ],
      edges: [["ui", "core", { fr: "photo + style", en: "photo + style" }], ["core", "detect", { fr: "type de pièce", en: "room type" }], ["core", "gen", "img2img"], ["core", "mongo", { fr: "résultats", en: "results" }]],
    },
    decisions: [
      { t: { fr: "Séparer l’IA du métier", en: "Keep AI apart from business logic" },
        d: { fr: "Les modèles tournent dans des services Python dédiés ; Spring Boot reste l’orchestrateur. On peut changer de modèle sans toucher au reste.", en: "Models run in dedicated Python services; Spring Boot stays the orchestrator. Models can be swapped without touching the rest." } },
      { t: { fr: "img2img plutôt que text2img", en: "img2img rather than text2img" },
        d: { fr: "Partir de la vraie photo garde la structure de la pièce (murs, fenêtres) au lieu d’inventer une pièce entière.", en: "Starting from the real photo keeps the room’s structure (walls, windows) instead of inventing a whole new room." } },
      { t: { fr: "MongoDB pour des résultats souples", en: "MongoDB for flexible results" },
        d: { fr: "Chaque génération porte des métadonnées variables (style, paramètres, images) : un modèle document s’y prête mieux.", en: "Each generation carries varying metadata (style, parameters, images): a document model fits better." } },
    ],
    learned: {
      fr: "Intégrer des modèles d’IA générative dans une vraie architecture logicielle, et gérer des traitements longs côté backend.",
      en: "Integrating generative AI models into a real software architecture, and handling long-running jobs on the backend.",
    },
    shots: [],
  },

  "smartfun-2030": {
    year: "2025", role: { fr: "Projet académique · EMSI", en: "Academic project · EMSI" }, duration: { fr: "Projet de semestre", en: "Semester project" },
    summary: {
      fr: "Une plateforme de gestion d’événements sportifs, pensée pour les grands rendez-vous de 2030 : réservation, billets électroniques envoyés automatiquement et accès sécurisés.",
      en: "A sports event management platform designed for the major events of 2030: booking, automatically delivered e-tickets and secured access.",
    },
    problem: {
      fr: "Un grand événement, c’est des milliers de réservations à traiter sans erreur, des billets à envoyer immédiatement et des accès à protéger selon le rôle (visiteur, organisateur, administrateur).",
      en: "A major event means thousands of bookings to process without errors, tickets to send instantly and access to protect by role (visitor, organizer, admin).",
    },
    solution: {
      fr: "Un frontend Angular, une API REST Spring Boot sécurisée par Spring Security et JWT, et un envoi des billets découplé : l’API publie un message dans RabbitMQ, un workflow n8n génère et envoie le billet par email. Les données sont dans MongoDB.",
      en: "An Angular frontend, a Spring Boot REST API secured with Spring Security and JWT, and decoupled ticket delivery: the API publishes a message to RabbitMQ, and an n8n workflow generates and emails the ticket. Data lives in MongoDB.",
    },
    arch: {
      cols: [
        [{ id: "ng", label: "Angular", kind: "client" }],
        [{ id: "api", label: "API Spring Boot", kind: "service" }],
        [{ id: "mq", label: "RabbitMQ", kind: "ext" }, { id: "db", label: "MongoDB", kind: "data" }],
        [{ id: "n8n", label: "n8n", kind: "service" }],
        [{ id: "mail", label: "Email", kind: "client" }],
      ],
      edges: [["ng", "api", "REST + JWT"], ["api", "db", { fr: "réservations", en: "bookings" }], ["api", "mq", { fr: "événement", en: "event" }], ["mq", "n8n", { fr: "consomme", en: "consumes" }], ["n8n", "mail", { fr: "billet", en: "ticket" }]],
    },
    decisions: [
      { t: { fr: "Envoi des billets asynchrone", en: "Asynchronous ticket delivery" },
        d: { fr: "La réservation répond tout de suite ; l’email part ensuite via la file RabbitMQ. Un pic de réservations ne bloque pas l’API.", en: "Booking responds immediately; the email goes out afterwards through the RabbitMQ queue. A booking spike doesn’t block the API." } },
      { t: { fr: "JWT sans état", en: "Stateless JWT" },
        d: { fr: "Spring Security vérifie un jeton signé à chaque requête : l’API reste sans session et facile à dupliquer.", en: "Spring Security checks a signed token on every request: the API stays sessionless and easy to scale out." } },
      { t: { fr: "n8n pour l’automatisation", en: "n8n for automation" },
        d: { fr: "Le parcours « générer le billet puis l’envoyer » est un workflow visuel, modifiable sans redéployer l’API.", en: "The “generate the ticket, then send it” flow is a visual workflow that can change without redeploying the API." } },
    ],
    learned: {
      fr: "Concevoir une architecture orientée événements, sécuriser une API par rôles, et automatiser un parcours de bout en bout.",
      en: "Designing an event-driven architecture, securing an API by role, and automating a flow end to end.",
    },
    shots: [],
  },
};
