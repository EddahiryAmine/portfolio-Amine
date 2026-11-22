import { useEffect, useState } from "react";
import Icon from "../components/Icons.jsx";
import Reveal from "../components/Reveal.jsx";
import SplitTitle from "../components/SplitTitle.jsx";
import { useT } from "../i18n/lang.jsx";
import { useInView } from "../hooks/useInView.js";
import { reducedMotion } from "../hooks/useReducedMotion.js";

// « Ma façon de travailler » : widgets façon iOS sur l'IA, le vibe coding, le prompting, la veille, les valeurs.
// Textes dans src/i18n/strings.js (clé how.*) : à ajuster librement.
function TypedPrompt({ text }) {
  const [ref, seen] = useInView(0.4);
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!seen) return;
    if (reducedMotion()) { setN(text.length); return; }
    if (n >= text.length) { const id = setTimeout(() => setN(0), 4500); return () => clearTimeout(id); }
    const id = setTimeout(() => setN(n + 1), 24);
    return () => clearTimeout(id);
  }, [seen, n, text]);
  return <pre ref={ref} className="how-prompt"><span className="hp-u">›</span> {text.slice(0, n)}<span className="caret" /></pre>;
}

export default function Approach({ onSwitch }) {
  const { t } = useT();
  const watch = ["LLM", t("how.agents"), "RAG", ".NET 9", "Microservices", "Cloud", "DevSecOps"];
  return (
    <section id="approche" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <SplitTitle>{t("how.title")}</SplitTitle>
        <p className="lead">{t("how.lead")}</p>
        <Reveal className="how">
          <article className="hw hw-ai">
            <span className="hw-ico g1"><Icon name="spark" size={20} /></span>
            <h3>{t("how.aiT")}</h3>
            <p>{t("how.ai")}</p>
            <div className="hw-flow">{["Prompt", "Code", t("how.review"), "Tests"].map((x, i) => <span key={x} style={{ "--i": i }}>{x}</span>)}</div>
          </article>
          <article className="hw hw-vibe">
            <span className="hw-ico g2"><Icon name="music" size={20} /></span>
            <h3>Vibe coding</h3>
            <p>{t("how.vibe")}</p>
            <span className="hw-chip">{t("how.vibeChip")}</span>
          </article>
          <article className="hw hw-prompt">
            <span className="hw-ico g3"><Icon name="file" size={20} /></span>
            <h3>Prompt engineering</h3>
            <TypedPrompt text={t("how.promptEx")} />
          </article>
          <article className="hw hw-watch">
            <span className="hw-ico g4"><Icon name="search" size={20} /></span>
            <h3>{t("how.watchT")}</h3>
            <div className="hw-tags">{watch.map((x) => <span key={x}>{x}</span>)}</div>
          </article>
          <article className="hw hw-values">
            <span className="hw-ico g5"><Icon name="award" size={20} /></span>
            <h3>{t("how.valuesT")}</h3>
            <ul>{t("how.values").map((v) => <li key={v}>{v}</li>)}</ul>
          </article>
          <article className="hw hw-life">
            <span className="hw-ico g6"><Icon name="frame" size={20} /></span>
            <h3>{t("how.lifeT")}</h3>
            <p>{t("how.life")}</p>
            <button className="hw-link" onClick={onSwitch}>{t("how.lifeCta")} <Icon name="arrow" size={14} /></button>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
