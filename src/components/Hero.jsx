import { useRef } from "react";
import Icon from "./Icons.jsx";
import Marquee from "./Marquee.jsx";
import Rise from "./Rise.jsx";
import { COMPANY, PROFILE, ROLE } from "../data/content.js";
import { useT } from "../i18n/lang.jsx";
import { reducedMotion } from "../hooks/useReducedMotion.js";
import portrait from "../assets/amine.webp";
import capLogo from "../assets/logos/capgemini.png";

const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

// Hero : grand nom en défilement, portrait avec halo et léger relief qui suit la souris,
// message + boutons façon iOS, et pile de notifications façon écran verrouillé d'iPhone.
export default function Hero({ ready }) {
  const { t } = useT();
  const root = useRef(null);
  const move = (e) => {
    if (reducedMotion() || e.pointerType === "touch") return;
    const r = root.current.getBoundingClientRect();
    root.current.style.setProperty("--px", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    root.current.style.setProperty("--py", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  };
  const notes = [
    { app: "Capgemini", icon: <img src={capLogo} alt="" />, title: t("hero.n1t"), text: t("hero.n1"), when: t("hero.now") },
    { app: "Oracle", bg: "#C74634", icon: <span className="hn-ico">O</span>, title: "Java SE 17", text: t("hero.n2"), when: "2026" },
    { app: "GitHub", bg: "#181717", icon: <span className="hn-ico"><Icon name="github" size={20} /></span>, title: t("hero.n3t"), text: t("hero.n3"), when: t("hero.new") },
  ];

  return (
    <header className="hero hero2" ref={root} onPointerMove={move}>
      <div className="moon-glow" />
      <Marquee text={`${PROFILE.name} — `} className="m1" speed={0.6} />
      <Marquee text={`${ROLE} .NET — `} className="m2" dir={-1} speed={0.45} />
      <div className="me-wrap">
        <span className="me-halo" aria-hidden="true" />
        <img className="me" src={portrait} alt={t("hero.portrait", { name: PROFILE.name })} />
      </div>
      <div className="fade" />

      <div className="h2-left">
        <Rise delay={0.5}><span className="h2-pill"><i />{ROLE} · {COMPANY}</span></Rise>
        <Rise delay={0.58}><p className="h2-title">{t("hero.title1")} <em>{t("hero.title2")}</em></p></Rise>
        <Rise delay={0.66}>
          <span className="h2-ctas">
            <button className="ios-btn primary" onClick={() => go("projets")}>{t("hero.ctaProjects")}<Icon name="arrow" size={15} /></button>
            <button className="ios-btn glass" onClick={() => go("contact")}><Icon name="mail" size={15} />{t("hero.ctaContact")}</button>
          </span>
        </Rise>
      </div>

      <div className={"h2-notes" + (ready ? " in" : "")} aria-label={t("hero.notesLabel")}>
        {notes.map((n, i) => (
          <div key={n.app} className="hn" style={{ "--i": i }}>
            <span className="hn-app" style={n.bg ? { background: n.bg } : undefined}>{n.icon}</span>
            <span className="hn-body">
              <span className="hn-top"><b>{n.app}</b><small>{n.when}</small></span>
              <strong>{n.title}</strong>
              <span>{n.text}</span>
            </span>
          </div>
        ))}
      </div>

      <button className="h2-scroll" onClick={() => go("about")} aria-label={t("hero.scroll")}><span /></button>
    </header>
  );
}
