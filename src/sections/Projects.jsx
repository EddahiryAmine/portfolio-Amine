import { useState } from "react";
import Icon from "../components/Icons.jsx";
import SplitTitle from "../components/SplitTitle.jsx";
import Reveal from "../components/Reveal.jsx";
import GitHubActivity from "../components/GitHubActivity.jsx";
import { PROJECTS, PROJECT_KINDS } from "../data/content.js";
import { CASES } from "../data/cases.js";
import { useT } from "../i18n/lang.jsx";

// Fenêtres de terminal avec une lueur qui suit le curseur.
const glow = (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--gx", e.clientX - r.left + "px");
  e.currentTarget.style.setProperty("--gy", e.clientY - r.top + "px");
};

export default function Projects() {
  const { t, p } = useT();
  const [kind, setKind] = useState("all");
  const list = kind === "all" ? PROJECTS : PROJECTS.filter((x) => x.kind === kind);
  return (
    <section id="projets" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <SplitTitle>{t("proj.title")}</SplitTitle>
        <div className="p-filter" role="tablist" aria-label={t("proj.filter")}>
          {PROJECT_KINDS.map(([k, label]) => (
            <button key={k} role="tab" aria-selected={kind === k} className={kind === k ? "on" : ""} onClick={() => setKind(k)}>
              {p(label)}<small>{k === "all" ? PROJECTS.length : PROJECTS.filter((x) => x.kind === k).length}</small>
            </button>
          ))}
        </div>
        <div className="term-grid">
          {list.map((pr, i) => (
            <Reveal as="article" key={pr.slug} delay={(i % 2) * 0.12} className="term" onPointerMove={glow}>
              <div className="tbar"><i /><i /><i /><span>~/projets/{pr.slug}</span></div>
              <div className="tbody">
                <h3>{p(pr.title)}</h3>
                <p>{p(pr.text)}</p>
                <div className="tags">{pr.tags.map((t) => <span key={t}>{t}</span>)}</div>
                <div className="t-foot">
                  <code className="st"><b>✓</b> {p(pr.status)}</code>
                  {CASES[pr.slug] && (
                    <a className="t-repo t-case" href={`#projet/${pr.slug}`}><Icon name="file" size={16} />{t("cs.open")} →</a>
                  )}
                  {pr.repo && (
                    <a className="t-repo" href={pr.repo} target="_blank" rel="noopener noreferrer" aria-label={t("proj.codeOf", { x: p(pr.title) })}>
                      <Icon name="github" size={16} />{t("proj.code")}
                    </a>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <GitHubActivity />
      </div>
    </section>
  );
}
