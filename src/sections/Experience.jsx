import SplitTitle from "../components/SplitTitle.jsx";
import Reveal from "../components/Reveal.jsx";
import { EXPERIENCE } from "../data/content.js";
import { useT } from "../i18n/lang.jsx";
import capgemini from "../assets/logos/capgemini.png";
import eqdom from "../assets/logos/eqdom.png";

// Logos des entreprises (clé = champ `logo` dans content.js). Sans logo : monogramme aux couleurs choisies.
const LOGOS = { capgemini, eqdom };

export default function Experience() {
  const { t, p } = useT();
  return (
    <section id="parcours" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <Reveal><SplitTitle>{t("exp.title")}</SplitTitle><p className="cmd">$ git log --oneline --graph</p></Reveal>
        <ol className="tl">
          {EXPERIENCE.map((x, i) => (
            <Reveal as="li" key={i} delay={i * 0.08} className={"tl-item" + (x.current ? " cur" : "")}>
              <span className="tl-logo" style={x.mono ? { background: x.mono.bg, color: x.mono.fg } : undefined}>
                {LOGOS[x.logo] ? <img src={LOGOS[x.logo]} alt={x.company} loading="lazy" /> : <b>{x.mono?.text}</b>}
              </span>
              <article className="tl-card">
                <header className="tl-head">
                  <span>
                    <h3>{p(x.title)}</h3>
                    <small className="tl-where">
                      <b>{x.company}</b> · {p(x.where)}
                    </small>
                  </span>
                  <span className="tl-date">{x.current && <i className="tl-live" />}{p(x.date)}</span>
                </header>
                <p>{p(x.text)}</p>
                <div className="tags">{x.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              </article>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
