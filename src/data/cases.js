// Études de cas (page #projet/<slug>). Textes { fr, en }.
// highlights = chiffres clés. shots = captures ({ src, cap, kind: "phone" | "browser" }).
// arch.cols = colonnes de blocs (gauche → droite ; empilées sur mobile), arch.edges = flèches [de, vers, libellé].
// Chaque bloc : id, label, kind ("client" | "service" | "data" | "ext"), d = rôle du bloc (affiché au clic).
// flow = requête simulée : étapes { at: id du bloc, t: texte }.
import sfMatchs from "../assets/cases/sf-matchs.jpg";
import sfMatch from "../assets/cases/sf-match.jpg";
import sfCompo from "../assets/cases/sf-compo.jpg";
import sfStade from "../assets/cases/sf-stade.jpg";
import sfPanier from "../assets/cases/sf-panier.jpg";
import sfPaiement from "../assets/cases/sf-paiement.jpg";
import sfTicket from "../assets/cases/sf-ticket.jpg";
import sfEquipes from "../assets/cases/sf-equipes.jpg";
import dvLogin from "../assets/cases/dv-login.jpg";
import dvUpload from "../assets/cases/dv-upload.jpg";
import dvStyle from "../assets/cases/dv-style.jpg";
import dvPerso from "../assets/cases/dv-perso.jpg";
import dvGeneration from "../assets/cases/dv-generation.jpg";

const L = (fr, en) => ({ fr, en });

export const CASES = {
  "dar-vision": {
    year: "2025–2026", role: L("Projet de fin d’année (PFA) · EMSI", "End-of-year project · EMSI"), duration: L("Application mobile + backend + IA", "Mobile app + backend + AI"),
    accent: "#E3A04A",
    highlights: [
      { v: "78 %", l: L("de précision du modèle entraîné", "accuracy of the trained model") },
      { v: "2", l: L("modèles d’IA complémentaires", "complementary AI models") },
      { v: "5", l: L("microservices Spring Boot métier", "business Spring Boot microservices") },
    ],
    summary: L(
      "Une application mobile de design intérieur où l’IA n’est pas seulement utilisée, mais construite : un modèle entraîné comprend la pièce, un second la redessine selon le style et la palette choisis.",
      "An interior design mobile app where AI isn’t just used but built: a trained model understands the room, a second one redesigns it with the chosen style and palette.",
    ),
    problem: L(
      "Les logiciels de design intérieur sont complexes et chers, et la plupart des applications grand public ne génèrent rien automatiquement. Comment permettre à quelqu’un sans compétences en design de visualiser sa propre pièce transformée, de façon réaliste, à partir d’une simple photo ?",
      "Interior design software is complex and expensive, and most consumer apps don’t generate anything automatically. How can someone with no design skills visualize their own room transformed, realistically, from a single photo?",
    ),
    solution: L(
      "Modèle 1 : un EfficientNet-B0 entraîné pour reconnaître 5 types de pièces (salon, chambre, bureau, salle de bain, cuisine) avec 78 % de précision. Modèle 2 : un modèle image-to-image pré-entraîné, intégré au service FastAPI, qui transforme la photo en gardant la structure de la pièce. La prompt est construite automatiquement à partir du type de pièce, du style et de la palette.",
      "Model 1: an EfficientNet-B0 trained to recognize 5 room types (living room, bedroom, office, bathroom, kitchen) with 78% accuracy. Model 2: a pre-trained image-to-image model, integrated into the FastAPI service, that transforms the photo while keeping the room’s structure. The prompt is built automatically from the room type, style and palette.",
    ),
    features: {
      fr: ["Import d’une photo (galerie ou caméra)", "Détection du type de pièce, à confirmer ou corriger", "4 styles : scandinave, moderne, classique, gaming", "Palettes de couleurs prédéfinies", "Prompt personnalisée + mode Rapide ou Qualité", "Résultat avant / après et régénération"],
      en: ["Upload a photo (gallery or camera)", "Room type detection, to confirm or correct", "4 styles: Scandinavian, modern, classic, gaming", "Predefined color palettes", "Custom prompt + Fast or Quality mode", "Before / after result and regeneration"],
    },
    shots: [
      { src: dvLogin, kind: "phone", cap: L("Connexion", "Sign in") },
      { src: dvUpload, kind: "phone", cap: L("Import de la photo", "Photo upload") },
      { src: dvStyle, kind: "phone", cap: L("Choix du style", "Style selection") },
      { src: dvPerso, kind: "phone", cap: L("Prompt et mode de génération", "Prompt and generation mode") },
      { src: dvGeneration, kind: "phone", cap: L("Génération en cours", "Generation in progress") },
    ],
    arch: {
      cols: [
        [{ id: "app", label: L("App Flutter", "Flutter app"), kind: "client", d: L("Application mobile Flutter (Dart) : tout le parcours, de l’import de la photo au résultat.", "Flutter (Dart) mobile app: the whole journey, from photo upload to result.") }],
        [
          { id: "gw", label: "API Gateway", kind: "service", d: L("Spring Cloud Gateway : point d’entrée unique, routage et sécurité.", "Spring Cloud Gateway: single entry point, routing and security.") },
          { id: "eu", label: "Eureka", kind: "ext", d: L("Découverte dynamique des microservices.", "Dynamic microservice discovery.") },
          { id: "cfg", label: "Config Server", kind: "ext", d: L("Configuration centralisée de tous les services.", "Centralized configuration for every service.") },
        ],
        [
          { id: "auth", label: "auth-service", kind: "service", d: L("Comptes, connexion et sécurité des utilisateurs.", "Accounts, sign-in and user security.") },
          { id: "media", label: "media-service", kind: "service", d: L("Stockage des images importées et générées, renvoie leur URL.", "Stores uploaded and generated images, returns their URL.") },
          { id: "room", label: "room-service", kind: "service", d: L("Pièces : type détecté, confiance, type confirmé.", "Rooms: detected type, confidence, confirmed type.") },
          { id: "style", label: "style-catalog", kind: "service", d: L("Catalogue des styles et de leurs mots-clés pour la prompt.", "Catalog of styles and their prompt keywords.") },
          { id: "design", label: "design-service", kind: "service", d: L("Orchestre la génération et dialogue avec le service IA.", "Orchestrates generation and talks to the AI service.") },
        ],
        [
          { id: "ai", label: "FastAPI · IA", kind: "service", d: L("Service Python : EfficientNet-B0 (détection) + modèle image-to-image (génération).", "Python service: EfficientNet-B0 (detection) + image-to-image model (generation).") },
          { id: "n8n", label: "n8n", kind: "ext", d: L("Automatisation des emails de confirmation.", "Confirmation email automation.") },
        ],
        [{ id: "db", label: "MongoDB", kind: "data", d: L("Utilisateurs, métadonnées, résultats et historique ; chaque service a ses collections.", "Users, metadata, results and history; each service owns its collections.") }],
      ],
      edges: [["app", "gw", "REST"], ["gw", "eu", ""], ["gw", "cfg", ""], ["gw", "auth", ""], ["gw", "media", ""], ["gw", "room", ""], ["gw", "style", ""], ["gw", "design", ""],
        ["design", "ai", L("image + prompt", "image + prompt")], ["auth", "n8n", "email"], ["room", "db", ""], ["design", "db", ""]],
    },
    flow: [
      { at: "app", t: L("L’utilisateur importe la photo de sa chambre.", "The user uploads a photo of their bedroom.") },
      { at: "gw", t: L("La Gateway vérifie l’accès et route la requête.", "The Gateway checks access and routes the request.") },
      { at: "media", t: L("media-service enregistre l’image et renvoie son URL.", "media-service stores the image and returns its URL.") },
      { at: "ai", t: L("EfficientNet-B0 détecte « bedroom » avec un score de confiance.", "EfficientNet-B0 detects “bedroom” with a confidence score.") },
      { at: "room", t: L("L’utilisateur confirme ; room-service enregistre le type de pièce.", "The user confirms; room-service saves the room type.") },
      { at: "design", t: L("design-service construit la prompt : pièce + style scandinave + palette.", "design-service builds the prompt: room + Scandinavian style + palette.") },
      { at: "ai", t: L("Le modèle image-to-image génère le nouveau design.", "The image-to-image model generates the new design.") },
      { at: "db", t: L("Le résultat est enregistré dans MongoDB.", "The result is stored in MongoDB.") },
      { at: "app", t: L("Comparaison avant / après dans l’application.", "Before / after comparison in the app.") },
    ],
    decisions: [
      { t: L("Un modèle entraîné par nous", "A model we trained"),
        d: L("EfficientNet-B0 offre un bon compromis précision / légèreté : l’IA comprend le contexte de la photo avant de générer.", "EfficientNet-B0 balances accuracy and lightness: the AI understands the photo’s context before generating.") },
      { t: L("Modèle intégré plutôt qu’API externe", "Integrated model instead of an external API"),
        d: L("Le modèle image-to-image tourne dans notre service FastAPI : contrôle total des paramètres, coûts maîtrisés et images qui restent chez nous.", "The image-to-image model runs in our FastAPI service: full control of parameters, controlled costs and images that stay with us.") },
      { t: L("Images hors de la base", "Images outside the database"),
        d: L("Les fichiers sont gérés par media-service et seules leurs URL sont en base : un modèle de données léger, prêt pour un stockage cloud.", "Files are handled by media-service and only their URLs are stored: a lightweight data model, ready for cloud storage.") },
    ],
    challenges: [
      { t: L("Salon ou bureau ?", "Living room or office?"), d: L("Le modèle confond parfois des pièces proches : l’utilisateur confirme ou corrige le type détecté avant la génération.", "The model sometimes confuses similar rooms: users confirm or correct the detected type before generation.") },
      { t: L("Temps de génération", "Generation time"), d: L("Deux modes (Rapide pour tester, Qualité pour le rendu final) et un écran de progression annulable.", "Two modes (Fast to test, Quality for the final render) and a cancellable progress screen.") },
      { t: L("Garder la vraie pièce", "Keeping the real room"), d: L("L’approche image-to-image conserve murs et fenêtres au lieu d’inventer une pièce entière.", "The image-to-image approach keeps walls and windows instead of inventing a whole new room.") },
    ],
    learned: L(
      "Entraîner et évaluer un modèle d’IA, puis l’intégrer dans une architecture microservices complète pour transformer une idée en application mobile fonctionnelle.",
      "Training and evaluating an AI model, then integrating it into a complete microservices architecture to turn an idea into a working mobile app.",
    ),
  },

  "smartfun-2030": {
    year: "2025", role: L("Projet académique · EMSI", "Academic project · EMSI"), duration: L("Plateforme web en microservices", "Microservices web platform"),
    accent: "#22C55E",
    highlights: [
      { v: "7", l: L("services Spring Boot", "Spring Boot services") },
      { v: "PDF + QR", l: L("ticket envoyé par email après l’achat", "ticket emailed after purchase") },
      { v: "Async", l: L("emails découplés via RabbitMQ", "emails decoupled via RabbitMQ") },
    ],
    summary: L(
      "Une plateforme de billetterie pour la Coupe du Monde 2030 : matchs, stades, équipes et joueurs, panier, paiement simulé et ticket PDF avec QR code envoyé par email.",
      "A ticketing platform for the 2030 World Cup: matches, stadiums, teams and players, cart, simulated payment and a PDF ticket with QR code sent by email.",
    ),
    problem: L(
      "Une billetterie doit encaisser des pics d’achats, protéger les accès selon le rôle et envoyer chaque ticket de façon fiable, même si un service est lent. Le tout en gardant des équipes et des stades à jour pour les fans.",
      "A ticketing system must absorb purchase spikes, protect access by role and deliver every ticket reliably, even when a service is slow, while keeping teams and stadiums up to date for fans.",
    ),
    solution: L(
      "Des microservices Spring Boot (auth, match-stadium, ticket, team) découverts par Eureka, configurés par un Config Server et exposés derrière Spring Cloud Gateway. Ils se parlent en synchrone avec OpenFeign et en asynchrone avec RabbitMQ : email de confirmation à l’inscription, ticket PDF après l’achat. Chaque service a sa propre base MongoDB.",
      "Spring Boot microservices (auth, match-stadium, ticket, team) discovered by Eureka, configured by a Config Server and exposed behind Spring Cloud Gateway. They talk synchronously with OpenFeign and asynchronously with RabbitMQ: a confirmation email on sign-up, a PDF ticket after purchase. Each service owns its MongoDB database.",
    ),
    features: {
      fr: ["Matchs filtrables (phase, statut, pays, stade, équipe)", "Fiches stades avec galerie et carte", "Équipes, compositions et profils joueurs", "Panier, favoris et limite de 5 billets par match", "Paiement simulé et ticket PDF avec QR code", "Inscription avec vérification par email"],
      en: ["Filterable matches (stage, status, country, stadium, team)", "Stadium pages with gallery and map", "Teams, line-ups and player profiles", "Cart, favorites and a 5-ticket limit per match", "Simulated payment and PDF ticket with QR code", "Sign-up with email verification"],
    },
    shots: [
      { src: sfMatchs, kind: "browser", cap: L("Matchs officiels et filtres", "Official matches and filters") },
      { src: sfMatch, kind: "browser", cap: L("Fiche match et choix du billet", "Match page and ticket choice") },
      { src: sfStade, kind: "browser", cap: L("Fiche stade : galerie et carte", "Stadium page: gallery and map") },
      { src: sfCompo, kind: "browser", cap: L("Composition d’équipe", "Team line-up") },
      { src: sfEquipes, kind: "browser", cap: L("Équipes participantes", "Participating teams") },
      { src: sfPanier, kind: "browser", cap: L("Panier", "Cart") },
      { src: sfPaiement, kind: "browser", cap: L("Paiement simulé", "Simulated payment") },
      { src: sfTicket, kind: "browser", cap: L("Ticket PDF avec QR code", "PDF ticket with QR code") },
    ],
    arch: {
      cols: [
        [{ id: "ng", label: "Angular", kind: "client", d: L("Frontend Angular : matchs, stades, équipes, panier et profil.", "Angular front-end: matches, stadiums, teams, cart and profile.") }],
        [
          { id: "gw", label: "API Gateway", kind: "service", d: L("Spring Cloud Gateway (:8080) : routage, vérification du JWT, accès centralisés.", "Spring Cloud Gateway (:8080): routing, JWT checks, centralized access.") },
          { id: "eu", label: "Eureka", kind: "ext", d: L("Eureka Server (:8761) : découverte des services.", "Eureka Server (:8761): service discovery.") },
          { id: "cfg", label: "Config Server", kind: "ext", d: L("Config Server (:8888) : configuration centralisée.", "Config Server (:8888): centralized configuration.") },
        ],
        [
          { id: "auth", label: "auth-server", kind: "service", d: L("(:8081) Inscription, connexion, rôles, JWT.", "(:8081) Sign-up, sign-in, roles, JWT.") },
          { id: "ms", label: "match-stadium", kind: "service", d: L("(:8084) Matchs, stades et places disponibles.", "(:8084) Matches, stadiums and available seats.") },
          { id: "tk", label: "ticket-server", kind: "service", d: L("(:8085) Panier, achat, génération du ticket PDF + QR.", "(:8085) Cart, purchase, PDF + QR ticket generation.") },
          { id: "tm", label: "team-server", kind: "service", d: L("(:8086) Équipes, compositions et joueurs.", "(:8086) Teams, line-ups and players.") },
        ],
        [
          { id: "mq", label: "RabbitMQ", kind: "ext", d: L("File de messages : les emails partent sans bloquer l’achat.", "Message queue: emails go out without blocking the purchase.") },
          { id: "db", label: L("MongoDB / service", "MongoDB / service"), kind: "data", d: L("Une base par service (database-per-service).", "One database per service (database-per-service).") },
        ],
        [{ id: "mail", label: "Email", kind: "client", d: L("Email de vérification à l’inscription, ticket PDF après l’achat.", "Verification email on sign-up, PDF ticket after purchase.") }],
      ],
      edges: [["ng", "gw", "HTTP + JWT"], ["gw", "eu", ""], ["gw", "cfg", ""], ["gw", "auth", ""], ["gw", "ms", ""], ["gw", "tk", ""], ["gw", "tm", ""],
        ["tk", "ms", "OpenFeign"], ["tk", "mq", L("ticket acheté", "ticket bought")], ["auth", "mq", L("inscription", "sign-up")], ["ms", "db", ""], ["mq", "mail", ""]],
    },
    flow: [
      { at: "ng", t: L("Le fan choisit Maroc – Espagne et clique « Acheter ».", "The fan picks Morocco – Spain and clicks “Buy”.") },
      { at: "gw", t: L("La Gateway vérifie le JWT et route vers ticket-server.", "The Gateway checks the JWT and routes to ticket-server.") },
      { at: "tk", t: L("ticket-server vérifie la limite de 5 billets par compte.", "ticket-server checks the 5-ticket limit per account.") },
      { at: "ms", t: L("Via OpenFeign, match-stadium confirme les places restantes.", "Through OpenFeign, match-stadium confirms the remaining seats.") },
      { at: "db", t: L("Le ticket est enregistré dans la base du service.", "The ticket is saved in the service’s database.") },
      { at: "mq", t: L("Un événement « ticket acheté » part dans RabbitMQ.", "A “ticket bought” event is published to RabbitMQ.") },
      { at: "mail", t: L("Le ticket PDF avec QR code arrive par email.", "The PDF ticket with QR code arrives by email.") },
      { at: "ng", t: L("Le ticket apparaît dans « Mes tickets ».", "The ticket shows up in “My tickets”.") },
    ],
    decisions: [
      { t: L("API Gateway Pattern", "API Gateway pattern"),
        d: L("Un seul point d’entrée qui route, vérifie le JWT et centralise les accès : les services restent invisibles de l’extérieur.", "A single entry point that routes, checks the JWT and centralizes access: services stay hidden from the outside.") },
      { t: L("Synchrone quand il faut, asynchrone sinon", "Sync when needed, async otherwise"),
        d: L("OpenFeign pour les appels qui attendent une réponse, RabbitMQ pour les emails : un pic d’achats ne bloque jamais la plateforme.", "OpenFeign for calls that need an answer, RabbitMQ for emails: a purchase spike never blocks the platform.") },
      { t: L("Database-per-service", "Database-per-service"),
        d: L("Chaque service possède sa base MongoDB : faible couplage et évolution indépendante.", "Each service owns its MongoDB database: loose coupling and independent evolution.") },
    ],
    challenges: [
      { t: L("Achat fiable, email découplé", "Reliable purchase, decoupled email"), d: L("L’achat est validé tout de suite ; l’envoi du PDF passe par RabbitMQ et ne peut pas faire échouer la commande.", "The purchase is confirmed immediately; the PDF goes through RabbitMQ and can’t make the order fail.") },
      { t: L("7 services à configurer", "7 services to configure"), d: L("Config Server et Eureka évitent de coder les adresses et paramètres en dur dans chaque service.", "Config Server and Eureka avoid hard-coding addresses and settings in every service.") },
      { t: L("Règles métier", "Business rules"), d: L("Limite de 5 billets par match et par compte, places restantes mises à jour à chaque achat.", "A 5-ticket limit per match and account, remaining seats updated on every purchase.") },
    ],
    learned: L(
      "Concevoir une architecture backend proche des standards professionnels : découverte de services, configuration centralisée, sécurité stateless et communication orientée événements.",
      "Designing a backend architecture close to industry standards: service discovery, centralized configuration, stateless security and event-driven communication.",
    ),
  },

  "cnie-check": {
    year: "2025", role: L("Stagiaire développeur mobile · EQDOM", "Mobile developer intern · EQDOM"), duration: L("Stage de 2 mois", "2-month internship"),
    accent: "#5B8DEF",
    highlights: [
      { v: "CNIE", l: L("vérifiée via le service Mon eID", "verified through the Mon eID service") },
      { v: "Kotlin", l: L("bridge natif vers React Native", "native bridge to React Native") },
      { v: "Keycloak", l: L("authentification et rôles", "authentication and roles") },
    ],
    summary: L(
      "Une application mobile qui vérifie qu’une carte d’identité nationale (CNIE) est authentique avant d’ouvrir un dossier client, pour limiter la fraude documentaire.",
      "A mobile app that checks that a national ID card (CNIE) is genuine before opening a customer file, to reduce document fraud.",
    ),
    problem: L(
      "Dans le crédit à la consommation, une fausse pièce d’identité coûte cher, et la vérification manuelle est lente. L’objectif : s’appuyer sur le service officiel Mon eID pour authentifier le client de façon fiable.",
      "In consumer credit, a fake ID card is expensive and manual checks are slow. The goal: rely on the official Mon eID service to authenticate customers reliably.",
    ),
    solution: L(
      "Une application React Native qui pilote le SDK Mon eID à travers un bridge Kotlin, un backend Spring Boot qui enregistre chaque vérification, et Keycloak pour l’authentification des agents et la gestion des rôles.",
      "A React Native app driving the Mon eID SDK through a Kotlin bridge, a Spring Boot backend that records every verification, and Keycloak for agent authentication and role management.",
    ),
    features: {
      fr: ["Vérification de la CNIE du client", "Connexion sécurisée des agents", "Historique des vérifications côté serveur", "Accès selon le rôle"],
      en: ["Customer ID card verification", "Secured agent sign-in", "Server-side verification history", "Role-based access"],
    },
    shots: [],
    arch: {
      cols: [
        [{ id: "app", label: "React Native", kind: "client", d: L("Application mobile des agents.", "Agents’ mobile app.") }],
        [
          { id: "bridge", label: "Bridge Kotlin", kind: "service", d: L("Module natif qui expose le SDK à React Native.", "Native module exposing the SDK to React Native.") },
          { id: "kc", label: "Keycloak", kind: "ext", d: L("Connexion OpenID Connect et rôles.", "OpenID Connect sign-in and roles.") },
        ],
        [
          { id: "sdk", label: "SDK Mon eID", kind: "ext", d: L("Vérification officielle de la CNIE.", "Official ID card verification.") },
          { id: "api", label: "API Spring Boot", kind: "service", d: L("Enregistre chaque vérification, contrôle les rôles.", "Stores every verification, checks roles.") },
        ],
        [{ id: "db", label: "PostgreSQL", kind: "data", d: L("Historique des vérifications pour l’audit.", "Verification history for auditing.") }],
      ],
      edges: [["app", "bridge", "NativeModule"], ["bridge", "sdk", "CNIE"], ["app", "kc", "OIDC"], ["app", "api", "REST + JWT"], ["api", "kc", L("rôles", "roles")], ["api", "db", "JPA"]],
    },
    flow: [
      { at: "app", t: L("L’agent se connecte et lance une vérification.", "The agent signs in and starts a check.") },
      { at: "kc", t: L("Keycloak authentifie l’agent (OpenID Connect).", "Keycloak authenticates the agent (OpenID Connect).") },
      { at: "bridge", t: L("Le bridge Kotlin appelle le SDK natif.", "The Kotlin bridge calls the native SDK.") },
      { at: "sdk", t: L("Le SDK Mon eID vérifie la CNIE du client.", "The Mon eID SDK verifies the customer’s ID card.") },
      { at: "api", t: L("L’API enregistre le résultat avec les droits de l’agent.", "The API stores the result with the agent’s rights.") },
      { at: "db", t: L("La vérification est tracée pour l’audit.", "The check is logged for auditing.") },
    ],
    decisions: [
      { t: L("Bridge natif plutôt qu’une réécriture", "A native bridge instead of a rewrite"),
        d: L("Le SDK s’intègre côté natif : un module Kotlin exposé à React Native garde une seule base de code pour l’interface.", "The SDK integrates on the native side: a Kotlin module exposed to React Native keeps a single UI codebase.") },
      { t: L("Keycloak pour les accès", "Keycloak for access control"),
        d: L("Connexion OpenID Connect, jeton et rôles vérifiés par l’API : aucune gestion de mots de passe maison.", "OpenID Connect sign-in, token and roles checked by the API: no home-made password handling.") },
      { t: L("Tracer chaque vérification", "Log every verification"),
        d: L("Le résultat de chaque contrôle est enregistré côté serveur pour l’audit.", "Every check result is stored server-side for auditing.") },
    ],
    challenges: [],
    learned: L(
      "Faire dialoguer JavaScript et code natif, et sécuriser une API de bout en bout avec Keycloak dans un contexte réglementé.",
      "Bridging JavaScript and native code, and securing an API end to end with Keycloak in a regulated context.",
    ),
  },
};
