import { lazy, Suspense, useEffect, useState } from "react";
import Icon from "../components/Icons.jsx";
import Marquee from "../components/Marquee.jsx";
import Modal from "../components/Modal.jsx";
import Nav from "../components/Nav.jsx";
import Rise from "../components/Rise.jsx";
import SpotifyEmbed from "../components/SpotifyEmbed.jsx";
import TypeLine from "../components/TypeLine.jsx";
import QuickContact from "../components/QuickContact.jsx";
import About from "../sections/About.jsx";
import Certifications from "../sections/Certifications.jsx";
import Contact from "../sections/Contact.jsx";
import Education from "../sections/Education.jsx";
import Experience from "../sections/Experience.jsx";
import Projects from "../sections/Projects.jsx";
import { COMPANY, PROFILE, ROLE, SPOTIFY } from "../data/content.js";
import portrait from "../assets/amine.webp";
import { useT } from "../i18n/lang.jsx";

// Sections plus bas dans la page : chargées à part (premier affichage plus léger), préchargées dès que le navigateur est libre.
const loaders = {
  Skills: () => import("../sections/Skills.jsx"), ApiConsole: () => import("../sections/ApiConsole.jsx"), ArtInterlude: () => import("../sections/ArtInterlude.jsx"),
  Testimonials: () => import("../sections/Testimonials.jsx"), CvSection: () => import("../sections/CvSection.jsx"), Ask: () => import("../sections/Ask.jsx"),
};
const Skills = lazy(loaders.Skills), ApiConsole = lazy(loaders.ApiConsole), ArtInterlude = lazy(loaders.ArtInterlude);
const Testimonials = lazy(loaders.Testimonials), CvSection = lazy(loaders.CvSection), Ask = lazy(loaders.Ask);
// Emplacement réservé (garde l'ancre de navigation) le temps que la section arrive.
const Lz = ({ id, h = 600, children }) => <Suspense fallback={<section id={id} style={{ minHeight: h }} aria-hidden="true" />}>{children}</Suspense>;

export default function Home({ ready, onSwitch, theme, onTheme, onPalette }) {
  const [player, setPlayer] = useState(false);
  const { t } = useT();
  useEffect(() => {
    const idle = window.requestIdleCallback || ((f) => setTimeout(f, 1200));
    idle(() => Object.values(loaders).forEach((l) => l()));
  }, []);
  return (
    <main className={"pro" + (ready ? " go" : "")}>
      <div className="stars" aria-hidden="true" />
      <Nav theme={theme} onTheme={onTheme} onSwitch={onSwitch} onPalette={onPalette} />

      <header className="hero">
        <div className="moon-glow" />
        <Marquee text={`${PROFILE.name} — `} className="m1" speed={0.6} />
        <Marquee text={`${ROLE} .NET — `} className="m2" dir={-1} speed={0.45} />
        <img className="me" src={portrait} alt={t("hero.portrait", { name: PROFILE.name })} />
        <div className="fade" />
        <div className="hline" />
        <div className="bot">
          <div>
            <Rise delay={0.55}>{ROLE} <b>.NET</b></Rise>
            <Rise delay={0.62}>{t("hero.at")} <b>{COMPANY}</b>, Casablanca</Rise>
            <Rise delay={0.69}>{t("hero.certified")} <b>Oracle Java SE 17</b></Rise>
          </div>
          <div className="bot-r">
            <Rise delay={0.76}>
              <button className="np" onClick={() => setPlayer(true)}>
                <span className="np-eq" aria-hidden="true"><i /><i /><i /></span>
                <span><small>{t("hero.loop")}</small>{SPOTIFY.title} · {SPOTIFY.artist}</span>
                <Icon name="music" size={16} />
              </button>
            </Rise>
            <code className="snippet">{ready && <TypeLine start={1400} text={`const amine = { role: "${ROLE}", at: "${COMPANY}" };`} />}</code>
          </div>
        </div>
      </header>

      <About />
      <Experience />
      <Projects />
      <Lz id="competences" h={1400}><Skills /></Lz>
      <Lz id="api" h={700}><ApiConsole /></Lz>
      <Lz h={640}><ArtInterlude /></Lz>
      <Certifications />
      <Education />
      <Lz h={0}><Testimonials /></Lz>
      <Lz id="cv" h={700}><CvSection /></Lz>
      <Lz id="ask" h={800}><Ask /></Lz>
      <Contact />
      <footer>
        <span>{PROFILE.name} · {PROFILE.city}</span>
        <button onClick={onSwitch}>{t("hero.perso")} <Icon name="swap" size={14} /></button>
      </footer>

      <QuickContact />
      {player && (
        <Modal title={t("hero.soundtrack")} onClose={() => setPlayer(false)}>
          <p className="modal-k">{t("hero.soundtrack")}</p>
          <SpotifyEmbed height={152} auto />
          <a className="modal-link" href={SPOTIFY.profile} target="_blank" rel="noopener noreferrer">{t("hero.spotify")}</a>
        </Modal>
      )}
    </main>
  );
}
