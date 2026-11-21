import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Icon from "./Icons.jsx";
import ModeSwitch from "./ModeSwitch.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import LangSwitch from "./LangSwitch.jsx";
import { NAV } from "../data/content.js";
import { useT } from "../i18n/lang.jsx";

const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

// Navbar vivante : progression, pastille qui suit la section active, verre dépoli, dock iPhone sur mobile.
export default function Nav({ theme, onTheme, onSwitch, onPalette }) {
  const { t, lang } = useT();
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const bar = useRef(null), links = useRef(null), ind = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      if (!bar.current) return; // barre masquée (changement de page)
      // Recherché à chaque fois : certaines sections arrivent après coup (chargement à la demande).
      const els = NAV.map(([id]) => document.getElementById(id)).filter(Boolean);
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.current.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
      setScrolled(scrollY > innerHeight * 0.6);
      let cur = "";
      els.forEach((el) => { if (el.getBoundingClientRect().top < innerHeight * 0.45) cur = el.id; });
      setActive(cur);
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  useLayoutEffect(() => {
    const a = links.current.querySelector(".on"), i = ind.current;
    if (!a) { i.style.opacity = 0; return; }
    i.style.opacity = 1;
    i.style.width = a.offsetWidth + "px";
    i.style.height = a.offsetHeight + "px";
    i.style.transform = `translate(${a.offsetLeft}px, ${a.offsetTop}px)`;
  }, [active, scrolled, lang]);

  return (
    <header className={"nav" + (scrolled ? " sc" : "")}>
      <div className="nav-in">
        <button className="lg" onClick={() => scrollTo({ top: 0, behavior: "smooth" })} aria-label={t("ui.backTop")}>Amine<i /></button>
        <nav className="links" ref={links} aria-label={t("ui.mainNav")}>
          <span className="ind" ref={ind} />
          {NAV.map(([id, icon]) => (
            <button key={id} className={active === id ? "on" : ""} onClick={() => go(id)}>
              <Icon name={icon} size={18} /><span>{t("nav." + id)}</span>
            </button>
          ))}
        </nav>
        <div className="nav-r">
          <button className="kbar" onClick={onPalette} aria-label={t("ui.palette")}><Icon name="search" size={15} /><kbd>Ctrl K</kbd></button>
          <LangSwitch />
          <ThemeToggle theme={theme} onToggle={onTheme} />
          <ModeSwitch onSwitch={onSwitch} />
        </div>
      </div>
      <div className="prog" ref={bar} />
    </header>
  );
}
