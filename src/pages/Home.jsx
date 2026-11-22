import { lazy, Suspense, useEffect } from "react";
import Icon from "../components/Icons.jsx";
import Nav from "../components/Nav.jsx";
import Hero from "../components/Hero.jsx";
import QuickContact from "../components/QuickContact.jsx";
import About from "../sections/About.jsx";
import Certifications from "../sections/Certifications.jsx";
import Contact from "../sections/Contact.jsx";
import Education from "../sections/Education.jsx";
import Experience from "../sections/Experience.jsx";
import Projects from "../sections/Projects.jsx";
import { PROFILE } from "../data/content.js";
import { useT } from "../i18n/lang.jsx";

// Sections plus bas dans la page : chargées à part (premier affichage plus léger), préchargées dès que le navigateur est libre.
const loaders = {
  Skills: () => import("../sections/Skills.jsx"), ApiConsole: () => import("../sections/ApiConsole.jsx"), Pipeline: () => import("../sections/Pipeline.jsx"), Approach: () => import("../sections/Approach.jsx"), ArtInterlude: () => import("../sections/ArtInterlude.jsx"),
  Testimonials: () => import("../sections/Testimonials.jsx"), CvSection: () => import("../sections/CvSection.jsx"), Ask: () => import("../sections/Ask.jsx"),
};
const Pipeline = lazy(loaders.Pipeline), Approach = lazy(loaders.Approach);
const Skills = lazy(loaders.Skills), ApiConsole = lazy(loaders.ApiConsole), ArtInterlude = lazy(loaders.ArtInterlude);
const Testimonials = lazy(loaders.Testimonials), CvSection = lazy(loaders.CvSection), Ask = lazy(loaders.Ask);
// Emplacement réservé (garde l'ancre de navigation) le temps que la section arrive.
const Lz = ({ id, h = 600, children }) => <Suspense fallback={<section id={id} style={{ minHeight: h }} aria-hidden="true" />}>{children}</Suspense>;

export default function Home({ ready, onSwitch, theme, onTheme, onPalette }) {
  const { t } = useT();
  useEffect(() => {
    const idle = window.requestIdleCallback || ((f) => setTimeout(f, 1200));
    idle(() => Object.values(loaders).forEach((l) => l()));
  }, []);
  return (
    <main className={"pro" + (ready ? " go" : "")}>
      <div className="stars" aria-hidden="true" />
      <Nav theme={theme} onTheme={onTheme} onSwitch={onSwitch} onPalette={onPalette} />

      <Hero ready={ready} />

      <About />
      <Experience />
      <Projects />
      <Lz id="competences" h={1400}><Skills /></Lz>
      <Lz id="approche" h={700}><Approach onSwitch={onSwitch} /></Lz>
      <Lz id="api" h={700}><ApiConsole /></Lz>
      <Lz id="pipeline" h={600}><Pipeline /></Lz>
      <Lz h={640}><ArtInterlude /></Lz>
      <Certifications />
      <Education />
      <Lz h={0}><Testimonials /></Lz>
      <Lz id="cv" h={700}><CvSection /></Lz>
      <Lz id="ask" h={800}><Ask /></Lz>
      <Contact />
      <footer>
        <span>{PROFILE.name} · {PROFILE.city}</span>
        <button className="egg-hint" onClick={() => dispatchEvent(new Event("hire-amine"))} title={t("egg.hint")}>$ sudo hire amine<span className="caret" /></button>
        <button onClick={onSwitch}>{t("hero.perso")} <Icon name="swap" size={14} /></button>
      </footer>

      <QuickContact />
    </main>
  );
}
