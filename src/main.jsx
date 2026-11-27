import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { inject } from "@vercel/analytics";
import App from "./App.jsx";
import { LangProvider } from "./i18n/lang.jsx";
import "./styles/global.css";
import "./styles/pro.css";
import "./styles/intro.css";
import "./styles/hero.css";
import "./styles/transition.css";
import "./styles/photography.css";
import "./styles/extra.css";
import "./styles/wow.css";
import "./styles/cases.css";
import "./styles/ios.css";
import "./styles/api.css";
import "./styles/pipeline.css";
import "./styles/approach.css";
import "./styles/feedback.css";

// Polices chargées sans bloquer le premier affichage (le texte apparaît tout de suite, puis la police s'applique).
const fonts = document.createElement("link");
fonts.rel = "stylesheet";
fonts.href = "https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,300;1,6..72,400&family=Inter+Tight:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap";
document.head.appendChild(fonts);
// Les grands titres animés attendent leur police (1,5 s max) pour ne pas « sauter » au chargement.
const root = document.documentElement;
root.classList.add("fonts-wait");
const ready = () => root.classList.remove("fonts-wait");
fonts.onload = () => (document.fonts?.ready || Promise.resolve()).then(ready);
fonts.onerror = ready;
setTimeout(ready, 1500);

// Un mot pour les développeurs qui ouvrent la console.
console.log("%c👋 Salut, dev curieux ! / Hi, curious dev!", "font: 600 15px system-ui; color: #5B8DEF");
console.log("%cEssaie / Try:  sudo hire amine  (Ctrl+K)  ·  ou le code Konami ↑↑↓↓←→←→BA", "font: 13px monospace; color: #8B97A8");

// Statistiques de visites anonymes (Vercel Web Analytics : sans cookies, aucune donnée personnelle).
// Actif uniquement sur le site en ligne ; à activer dans le tableau de bord Vercel (onglet Analytics).
if (location.protocol === "https:" && !/^(localhost|127\.)/.test(location.hostname)) inject({ framework: "react" });

// /admin : espace d'administration, chargé à part (rien n'est inclus dans le site public).
const isAdmin = location.pathname.replace(/\/+$/, "") === "/admin";
const Admin = lazy(() => import("./pages/admin/Admin.jsx"));
if (isAdmin) { import("./styles/admin.css"); import("./styles/admin-wow.css"); import("./styles/admin-fun.css"); }

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {isAdmin
      ? <Suspense fallback={null}><Admin /></Suspense>
      : <LangProvider><App /></LangProvider>}
  </StrictMode>
);
