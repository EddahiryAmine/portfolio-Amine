import Reveal from "./Reveal.jsx";
import { CASES } from "../data/cases.js";
import { PROJECTS } from "../data/content.js";
import { useT } from "../i18n/lang.jsx";

// Grandes cartes en tête de la section Projets : donnent envie d'ouvrir les études de cas.
const glow = (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--gx", e.clientX - r.left + "px");
  e.currentTarget.style.setProperty("--gy", e.clientY - r.top + "px");
};

export default function CaseTeasers() {
  const { t, p } = useT();
  return (
    <div className="ct-wrap">
      <div className="ct-head"><b>{t("cs.featured")}</b><small>{t("cs.featuredSub")}</small></div>
      <div className="ct-grid">
        {Object.entries(CASES).map(([slug, c], i) => {
          const proj = PROJECTS.find((x) => x.slug === slug);
          const h = c.highlights[0];
          return (
            <Reveal key={slug} delay={i * 0.1}>
              <a className="ct-card" href={`#projet/${slug}`} style={{ "--acc": c.accent }} onPointerMove={glow}>
                <span className="ct-n">N° {String(i + 1).padStart(2, "0")}</span>
                <span className="ct-big">{h.v}</span>
                <small className="ct-hl">{p(h.l)}</small>
                <h3>{p(proj.title)}</h3>
                <p>{p(c.summary)}</p>
                <span className="ct-tags">{proj.tags.slice(0, 4).map((x) => <i key={x}>{x}</i>)}</span>
                <span className="ct-go">{t("cs.read")} <span aria-hidden="true">→</span></span>
              </a>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
