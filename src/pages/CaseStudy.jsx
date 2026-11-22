import { useEffect, useRef, useState } from "react";
import Coverflow from "../components/Coverflow.jsx";
import ArchDiagram from "../components/ArchDiagram.jsx";
import Icon from "../components/Icons.jsx";
import LangSwitch from "../components/LangSwitch.jsx";
import Reveal from "../components/Reveal.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";
import { CASES } from "../data/cases.js";
import { PROJECTS } from "../data/content.js";
import { useT } from "../i18n/lang.jsx";

const SLUGS = Object.keys(CASES);
const back = () => { location.hash = ""; setTimeout(() => document.querySelector(".ct-wrap")?.scrollIntoView({ block: "center" }), 80); };

// Capture dans un cadre de téléphone ou de navigateur.
function Frame({ shot, onClick, big }) {
  const { p } = useT();
  const img = <img src={shot.src} alt={p(shot.cap)} loading={big ? "eager" : "lazy"} />;
  return shot.kind === "phone"
    ? <button className={"fr-phone" + (big ? " big" : "")} onClick={onClick} aria-label={p(shot.cap)}><span className="fr-notch" />{img}</button>
    : <button className={"fr-browser" + (big ? " big" : "")} onClick={onClick} aria-label={p(shot.cap)}><span className="fr-bar"><i /><i /><i /></span>{img}</button>;
}

// Visionneuse plein écran des captures (flèches, Échap, glisser).
function Viewer({ shots, i, setI }) {
  const { t, p } = useT();
  const n = shots.length, x0 = useRef(0);
  const go = (d) => setI((i + d + n) % n);
  useEffect(() => {
    const k = (e) => { if (e.key === "Escape") setI(null); if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); };
    addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => { removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [i]);
  return (
    <div className="csv" role="dialog" aria-modal="true" aria-label={p(shots[i].cap)} onClick={() => setI(null)}
      onTouchStart={(e) => (x0.current = e.touches[0].clientX)} onTouchEnd={(e) => { const d = e.changedTouches[0].clientX - x0.current; if (Math.abs(d) > 50) go(d < 0 ? 1 : -1); }}>
      <button className="csv-x" aria-label={t("ui.close")}><Icon name="close" size={22} /></button>
      {n > 1 && <button className="csv-n pv" onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label={t("lb.prev")}>‹</button>}
      <figure onClick={(e) => e.stopPropagation()}>
        <img key={i} src={shots[i].src} alt={p(shots[i].cap)} className={shots[i].kind} />
        <figcaption>{p(shots[i].cap)} <small>{i + 1} / {n}</small></figcaption>
      </figure>
      {n > 1 && <button className="csv-n nx" onClick={(e) => { e.stopPropagation(); go(1); }} aria-label={t("lb.next")}>›</button>}
    </div>
  );
}

// Page « étude de cas » : hero illustré, onglets collants, galerie, architecture interactive, choix, défis.
export default function CaseStudy({ slug, theme, onTheme }) {
  const { t, p } = useT();
  const c = CASES[slug], proj = PROJECTS.find((x) => x.slug === slug);
  const [view, setView] = useState(null);
  const [active, setActive] = useState("");
  useEffect(() => { scrollTo(0, 0); setView(null); }, [slug]);
  useEffect(() => {
    const k = (e) => e.key === "Escape" && !document.querySelector(".csv") && back();
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, []);

  const secs = c ? [
    ["problem", true], ["solution", true], ["features", true], ["shots", c.shots.length > 0],
    ["architecture", true], ["decisions", true], ["challenges", c.challenges.length > 0], ["learned", true],
  ].filter(([, ok]) => ok).map(([k]) => k) : [];

  // Onglet actif selon la section visible.
  useEffect(() => {
    if (!c) return;
    const els = secs.map((k) => document.getElementById("cs-" + k)).filter(Boolean);
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id.slice(3))), { rootMargin: "-40% 0px -55% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [slug, secs.length]);
  useEffect(() => { document.querySelector(".cs-tabs .on")?.scrollIntoView({ inline: "center", block: "nearest" }); }, [active]);

  if (!c || !proj) {
    return (
      <main className="cs cs-missing">
        <p>{t("cs.missing")}</p>
        <button className="btn solid" onClick={back}>{t("cs.back")}</button>
      </main>
    );
  }
  const n = SLUGS.indexOf(slug), next = SLUGS[(n + 1) % SLUGS.length], nextProj = PROJECTS.find((x) => x.slug === next), nextCase = CASES[next];
  const num = (k) => String(secs.indexOf(k) + 1).padStart(2, "0");
  const head = (k) => <h2 className="cs-h"><span>{num(k)}</span>{t("cs." + k)}</h2>;
  const jump = (k) => document.getElementById("cs-" + k)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <main className="cs" style={{ "--acc": c.accent }}>
      <header className="cs-bar">
        <button className="cs-back" onClick={back}><Icon name="arrow" size={16} /><span>{t("cs.back")}</span></button>
        <div className="cs-bar-r"><LangSwitch /><ThemeToggle theme={theme} onToggle={onTheme} /></div>
      </header>

      <section className="cs-hero wrap">
        <div className="cs-hero-t">
          <p className="cs-kick">{t("cs.kicker")} · N° {String(n + 1).padStart(2, "0")}</p>
          <h1>{p(proj.title)}</h1>
          <p className="cs-sum">{p(c.summary)}</p>
          <dl className="cs-meta">
            <div><dt>{t("cs.role")}</dt><dd>{p(c.role)}</dd></div>
            <div><dt>{t("cs.year")}</dt><dd>{c.year}</dd></div>
            <div><dt>{t("cs.type")}</dt><dd>{p(c.duration)}</dd></div>
            {proj.repo && <div><dt>Code</dt><dd><a href={proj.repo} target="_blank" rel="noopener noreferrer"><Icon name="github" size={15} /> GitHub ↗</a></dd></div>}
          </dl>
          <div className="tags">{proj.tags.map((x) => <span key={x}>{x}</span>)}</div>
        </div>
        {c.shots.length > 0 && (
          <div className={"cs-cover " + c.shots[0].kind}>
            {c.shots.slice(0, c.shots[0].kind === "phone" ? 3 : 1).map((s, i) => <Frame key={i} shot={s} big onClick={() => setView(i)} />)}
          </div>
        )}
      </section>

      <div className="wrap cs-hl">
        {c.highlights.map((h, i) => <div key={i} style={{ "--d": i * 0.12 + "s" }}><b>{h.v}</b><small>{p(h.l)}</small></div>)}
      </div>

      <nav className="cs-tabs" aria-label={t("cs.toc")}>
        <div className="cs-tabs-in">
          {secs.map((k) => <button key={k} className={active === k ? "on" : ""} onClick={() => jump(k)}><span>{num(k)}</span>{t("cs." + k)}</button>)}
        </div>
      </nav>

      <div className="wrap cs-body">
        <section id="cs-problem" className="cs-sec cs-split">
          {head("problem")}
          <Reveal as="p" className="cs-big">{p(c.problem)}</Reveal>
        </section>
        <section id="cs-solution" className="cs-sec cs-split">
          {head("solution")}
          <Reveal as="p" className="cs-big">{p(c.solution)}</Reveal>
        </section>
        <section id="cs-features" className="cs-sec">
          {head("features")}
          <ul className="cs-feat">{p(c.features).map((x, i) => <Reveal as="li" key={x} delay={(i % 3) * 0.06}><span>✓</span>{x}</Reveal>)}</ul>
        </section>
        {c.shots.length > 0 && (
          <section id="cs-shots" className="cs-sec">
            {head("shots")}
            <Coverflow shots={c.shots} onOpen={setView} />
            <p className="cs-swipe">{t("cs.swipe")}</p>
          </section>
        )}
        <section id="cs-architecture" className="cs-sec">
          {head("architecture")}
          <ArchDiagram arch={c.arch} flow={c.flow} label={t("cs.archLabel", { x: p(proj.title) })} />
          <p className="cs-legend"><i className="k-client" />{t("cs.kClient")}<i className="k-service" />{t("cs.kService")}<i className="k-data" />{t("cs.kData")}<i className="k-ext" />{t("cs.kExt")}</p>
        </section>
        <section id="cs-decisions" className="cs-sec">
          {head("decisions")}
          <div className="cs-dec">
            {c.decisions.map((d, i) => (
              <Reveal key={i} delay={i * 0.08} className="cs-card"><b>{String(i + 1).padStart(2, "0")}</b><h3>{p(d.t)}</h3><p>{p(d.d)}</p></Reveal>
            ))}
          </div>
        </section>
        {c.challenges.length > 0 && (
          <section id="cs-challenges" className="cs-sec">
            {head("challenges")}
            <div className="cs-chal">
              {c.challenges.map((d, i) => (
                <Reveal key={i} delay={i * 0.08} className="cs-chal-i"><span className="cs-chal-q">{p(d.t)}</span><span className="cs-chal-a">→ {p(d.d)}</span></Reveal>
              ))}
            </div>
          </section>
        )}
        <section id="cs-learned" className="cs-sec cs-split">
          {head("learned")}
          <Reveal as="p" className="cs-big">{p(c.learned)}</Reveal>
        </section>
      </div>

      <footer className="cs-next wrap">
        <button onClick={back}>← {t("cs.allProjects")}</button>
        <a href={`#projet/${next}`} style={{ "--acc": nextCase.accent }}>
          {nextCase.shots[0] && <img src={nextCase.shots[0].src} alt="" loading="lazy" className={nextCase.shots[0].kind} />}
          <span><small>{t("cs.next")}</small><b>{p(nextProj.title)} →</b></span>
        </a>
      </footer>

      {view !== null && <Viewer shots={c.shots} i={view} setI={setView} />}
    </main>
  );
}
