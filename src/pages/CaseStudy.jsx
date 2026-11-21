import { useEffect } from "react";
import ArchDiagram from "../components/ArchDiagram.jsx";
import Icon from "../components/Icons.jsx";
import LangSwitch from "../components/LangSwitch.jsx";
import Reveal from "../components/Reveal.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";
import { CASES } from "../data/cases.js";
import { PROJECTS } from "../data/content.js";
import { useT } from "../i18n/lang.jsx";

const SLUGS = Object.keys(CASES);
const back = () => { location.hash = ""; setTimeout(() => document.getElementById("projets")?.scrollIntoView(), 60); };

// Page "étude de cas" d'un projet : problème, solution, architecture, choix techniques, apprentissages.
export default function CaseStudy({ slug, theme, onTheme }) {
  const { t, p } = useT();
  const c = CASES[slug], proj = PROJECTS.find((x) => x.slug === slug);
  useEffect(() => { scrollTo(0, 0); }, [slug]);
  useEffect(() => {
    const k = (e) => e.key === "Escape" && back();
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, []);

  if (!c || !proj) {
    return (
      <main className="cs cs-missing">
        <p>{t("cs.missing")}</p>
        <button className="btn solid" onClick={back}>{t("cs.back")}</button>
      </main>
    );
  }
  const n = SLUGS.indexOf(slug), next = SLUGS[(n + 1) % SLUGS.length], nextProj = PROJECTS.find((x) => x.slug === next);
  const sec = (i, key) => <span className="cs-num">{String(i).padStart(2, "0")} · {t("cs." + key)}</span>;

  return (
    <main className="cs" style={{ "--acc": c.accent }}>
      <header className="cs-bar">
        <button className="cs-back" onClick={back}><Icon name="arrow" size={16} />{t("cs.back")}</button>
        <div className="cs-bar-r"><LangSwitch /><ThemeToggle theme={theme} onToggle={onTheme} /></div>
      </header>

      <section className="cs-hero wrap">
        <p className="cs-kick">{t("cs.kicker")} · N° {String(n + 1).padStart(2, "0")}</p>
        <h1>{p(proj.title)}</h1>
        <p className="cs-sum">{p(c.summary)}</p>
        <dl className="cs-meta">
          <div><dt>{t("cs.role")}</dt><dd>{p(c.role)}</dd></div>
          <div><dt>{t("cs.duration")}</dt><dd>{p(c.duration)}</dd></div>
          <div><dt>{t("cs.year")}</dt><dd>{c.year}</dd></div>
          {proj.repo && <div><dt>Code</dt><dd><a href={proj.repo} target="_blank" rel="noopener noreferrer"><Icon name="github" size={15} /> GitHub ↗</a></dd></div>}
        </dl>
        <div className="tags">{proj.tags.map((x) => <span key={x}>{x}</span>)}</div>
        <div className="cs-hl">
          {c.highlights.map((h, i) => <div key={i} style={{ "--d": i * 0.12 + "s" }}><b>{h.v}</b><small>{p(h.l)}</small></div>)}
        </div>
      </section>

      <div className="wrap cs-body">
        <Reveal as="section" className="cs-sec">{sec(1, "problem")}<p className="cs-big">{p(c.problem)}</p></Reveal>
        <Reveal as="section" className="cs-sec">{sec(2, "solution")}<p className="cs-big">{p(c.solution)}</p></Reveal>
        <section className="cs-sec">
          {sec(3, "features")}
          <ul className="cs-feat">{p(c.features).map((x, i) => <Reveal as="li" key={x} delay={i * 0.05}><span>✓</span>{x}</Reveal>)}</ul>
        </section>
        <Reveal as="section" className="cs-sec cs-arch">
          {sec(4, "architecture")}
          <ArchDiagram arch={c.arch} label={t("cs.archLabel", { x: p(proj.title) })} />
          <p className="cs-legend"><i className="k-client" />{t("cs.kClient")}<i className="k-service" />{t("cs.kService")}<i className="k-data" />{t("cs.kData")}<i className="k-ext" />{t("cs.kExt")}</p>
        </Reveal>
        <section className="cs-sec">
          {sec(5, "decisions")}
          <div className="cs-dec">
            {c.decisions.map((d, i) => (
              <Reveal key={i} delay={i * 0.08} className="cs-card">
                <b>{String(i + 1).padStart(2, "0")}</b>
                <h3>{p(d.t)}</h3>
                <p>{p(d.d)}</p>
              </Reveal>
            ))}
          </div>
        </section>
        {c.shots.length > 0 && (
          <section className="cs-sec">{sec(6, "shots")}<div className="cs-shots">{c.shots.map((s, i) => <img key={i} src={s} alt="" loading="lazy" />)}</div></section>
        )}
        <Reveal as="section" className="cs-sec">{sec(c.shots.length ? 7 : 6, "learned")}<p className="cs-big">{p(c.learned)}</p></Reveal>
      </div>

      <footer className="cs-next wrap">
        <button onClick={back}>← {t("cs.allProjects")}</button>
        <a href={`#projet/${next}`}><small>{t("cs.next")}</small><b>{p(nextProj.title)} →</b></a>
      </footer>
    </main>
  );
}
