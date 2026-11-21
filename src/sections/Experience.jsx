import SplitTitle from "../components/SplitTitle.jsx";
import Reveal from "../components/Reveal.jsx";
import { EXPERIENCE } from "../data/content.js";
import { useT } from "../i18n/lang.jsx";

// Hash décoratif façon git, stable pour un titre donné.
const hash = (s) => { let h = 7; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h.toString(16).padStart(8, "0").slice(0, 7); };

export default function Experience() {
  const { t, p } = useT();
  return (
    <section id="parcours" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <Reveal><SplitTitle>{t("exp.title")}</SplitTitle><p className="cmd">$ git log --oneline --graph</p></Reveal>
        <ol className="log">
          {EXPERIENCE.map((x, i) => (
            <Reveal as="li" key={i} delay={i * 0.08} className={x.current ? "cur" : ""}>
              <span className="node" />
              <div className="meta"><code>{hash((x.title.fr ?? x.title) + (x.date.fr ?? x.date))}</code>{x.current && <em className="head">HEAD → main</em>}<small>{p(x.date)}</small></div>
              <h3>{p(x.title)}</h3>
              <small className="where">{p(x.place)}</small>
              <p>{p(x.text)}</p>
              <div className="tags">{x.tags.map((t) => <span key={t}>{t}</span>)}</div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
