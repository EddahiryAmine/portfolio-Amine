import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import CommandPalette from "./components/CommandPalette.jsx";
import Cursor from "./components/Cursor.jsx";
import Intro from "./components/Intro.jsx";
import Transition from "./components/Transition.jsx";
import Home from "./pages/Home.jsx";
import { useHashRoute } from "./hooks/useHashRoute.js";
import { useTheme } from "./hooks/useTheme.js";
import { NAV, PROFILE, PROJECTS } from "./data/content.js";
import { CASES } from "./data/cases.js";
import cvPdf from "./assets/CV_Amine_Eddahiry.pdf";
import { useT } from "./i18n/lang.jsx";
import { downloadVCard } from "./sections/Contact.jsx";

// Pages secondaires chargées à la demande (le premier affichage reste léger), préchargées quand le navigateur est libre.
const loadPhoto = () => import("./pages/Photography.jsx");
const Photography = lazy(loadPhoto);
const CaseStudy = lazy(() => import("./pages/CaseStudy.jsx"));
const HireMe = lazy(() => import("./components/HireMe.jsx"));
if (typeof window !== "undefined") (window.requestIdleCallback || ((f) => setTimeout(f, 2500)))(() => loadPhoto());

const PROJECTS_BY_SLUG = Object.fromEntries(PROJECTS.map((x) => [x.slug, x]));
const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

// Routes (hash) : "" = accueil, "photographie" = côté perso, "projet/<slug>" = étude de cas.
// phase : 0 = intro, 1 = intro qui se retire, 2 = site visible
export default function App() {
  const route = useHashRoute();
  const isPerso = route === "photographie";
  const caseSlug = route.startsWith("projet/") ? route.slice(7) : null;
  const { theme, toggle } = useTheme();
  const { t, p, lang, setLang } = useT();
  const [phase, setPhase] = useState(caseSlug ? 2 : 0);
  const [trans, setTrans] = useState(null); // { to: "perso" | "pro", x, y }
  const [palette, setPalette] = useState(false);
  const [hire, setHire] = useState(false);

  useEffect(() => {
    document.body.style.overflow = (phase < 2 && !isPerso && !caseSlug) || trans || hire ? "hidden" : "";
  }, [phase, isPerso, caseSlug, trans, hire]);

  // Easter egg déclenchable de partout (pied de page, Amine IA…) via un événement.
  useEffect(() => {
    const on = () => setHire(true);
    addEventListener("hire-amine", on);
    return () => removeEventListener("hire-amine", on);
  }, []);

  // Code Konami -> easter egg.
  useEffect(() => {
    let k = 0;
    const on = (e) => { k = e.key === KONAMI[k] || e.key.toLowerCase() === KONAMI[k] ? k + 1 : e.key === KONAMI[0] ? 1 : 0; if (k === KONAMI.length) { k = 0; setHire(true); } };
    addEventListener("keydown", on);
    return () => removeEventListener("keydown", on);
  }, []);

  // Lance la transition Pro <-> Perso depuis le point cliqué.
  const switchMode = (e) => {
    if (trans) return;
    const r = e?.currentTarget?.getBoundingClientRect?.();
    setTrans({ to: isPerso ? "pro" : "perso", x: r ? r.left + r.width / 2 : innerWidth / 2, y: r ? r.top + r.height / 2 : 40 });
  };
  const onMid = () => { location.hash = trans.to === "perso" ? "photographie" : ""; scrollTo(0, 0); };

  const actions = useMemo(() => {
    const away = isPerso || caseSlug;
    const goTo = (id) => () => { if (away) location.hash = ""; setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), away ? 250 : 0); };
    return [
      ...NAV.map(([id, icon]) => ({ label: t("pal.goto", { x: t("nav." + id) }), icon, run: goTo(id) })),
      ...Object.keys(CASES).map((slug) => ({ label: `${t("cs.open")} : ${p(PROJECTS_BY_SLUG[slug]?.title)}`, icon: "file", run: () => { location.hash = "projet/" + slug; } })),
      { label: t("pal.lang"), icon: "globe", hint: lang === "fr" ? "EN" : "FR", run: () => setLang(lang === "fr" ? "en" : "fr") },
      { label: t("pal.theme"), icon: theme === "dark" ? "sun" : "moon", run: () => toggle() },
      { label: isPerso ? t("ui.toPro") : t("ui.toPerso"), icon: "swap", run: () => switchMode() },
      { label: t("pal.cv"), icon: "download", run: () => { const a = document.createElement("a"); a.href = cvPdf; a.download = "CV_Amine_Eddahiry.pdf"; a.click(); } },
      { label: t("pal.github"), icon: "github", hint: PROFILE.githubHandle, run: () => window.open(PROFILE.github, "_blank", "noopener") },
      { label: t("pal.linkedin"), icon: "linkedin", run: () => window.open(PROFILE.linkedin, "_blank", "noopener") },
      { label: t("pal.email"), icon: "copy", hint: PROFILE.email, run: () => navigator.clipboard?.writeText(PROFILE.email).catch(() => {}) },
      { label: t("pal.vcard"), icon: "card", run: downloadVCard },
      { label: "sudo hire amine", icon: "spark", hint: "🥚", secret: true, run: () => setHire(true) },
    ];
  }, [isPerso, caseSlug, theme, trans, lang]);

  let page;
  if (caseSlug) page = <CaseStudy slug={caseSlug} theme={theme} onTheme={toggle} />;
  else if (isPerso) page = <Photography onSwitch={switchMode} />;
  else page = <Home ready={phase >= 1} onSwitch={switchMode} theme={theme} onTheme={toggle} onPalette={() => setPalette(true)} />;

  return (
    <>
      <Cursor />
      <Suspense fallback={<div className="page-load" aria-hidden="true" />}>{page}</Suspense>
      {!isPerso && !caseSlug && <Intro phase={phase} setPhase={setPhase} />}
      {trans && <Transition {...trans} onMid={onMid} onDone={() => setTrans(null)} />}
      <CommandPalette open={palette} setOpen={setPalette} actions={actions} />
      {hire && <Suspense fallback={null}><HireMe onClose={() => setHire(false)} /></Suspense>}
    </>
  );
}
