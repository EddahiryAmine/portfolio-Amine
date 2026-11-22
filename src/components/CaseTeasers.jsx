import Icon from "./Icons.jsx";
import Reveal from "./Reveal.jsx";
import { CASES } from "../data/cases.js";
import { PROJECTS } from "../data/content.js";
import { useT } from "../i18n/lang.jsx";

// Cartes compactes en tête de la section Projets : aperçu, type, titre, résumé court, stack, flèche.
export default function CaseTeasers() {
  const { t, p } = useT();
  return (
    <div className="ct-wrap">
      <div className="ct-head"><b>{t("cs.featured")}</b><small>{t("cs.featuredSub")}</small></div>
      <div className="ct-grid">
        {Object.entries(CASES).map(([slug, c], i) => {
          const proj = PROJECTS.find((x) => x.slug === slug);
          const shots = c.shots.slice(0, c.shots[0]?.kind === "phone" ? 3 : 1);
          return (
            <Reveal key={slug} delay={i * 0.08}>
              <a className="ct-card2" href={`#projet/${slug}`} style={{ "--acc": c.accent }}>
                <span className={"ct2-img " + (shots[0]?.kind || "none")} aria-hidden="true">
                  {shots.length ? shots.map((s, k) => <img key={k} src={s.src} alt="" loading="lazy" />) : <span className="ct2-glyph">{proj.tags.slice(0, 2).join(" · ")}</span>}
                </span>
                <span className="ct2-body">
                  <span className="ct2-type">{p(c.type)}</span>
                  <b className="ct2-title">{p(proj.title)}</b>
                  <span className="ct2-sum">{p(c.teaser)}</span>
                  <span className="ct2-foot">
                    <span className="ct2-tags">{proj.tags.slice(0, 3).join(" · ")}</span>
                    <span className="ct2-go" aria-label={t("cs.read")}><Icon name="arrow" size={16} /></span>
                  </span>
                </span>
              </a>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
