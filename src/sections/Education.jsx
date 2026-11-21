import SplitTitle from "../components/SplitTitle.jsx";
import { EDUCATION } from "../data/content.js";
import { useInView } from "../hooks/useInView.js";
import { useT } from "../i18n/lang.jsx";

// Frise : la ligne se dessine, les années en contour se remplissent au survol.
export default function Education() {
  const { t, p } = useT();
  const [ref, seen] = useInView(0.25);
  return (
    <section id="formation" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <SplitTitle>{t("edu.title")}</SplitTitle>
        <p className="cmd">$ cat education.log</p>
        <div ref={ref} className={"edu" + (seen ? " in" : "")}>
          <span className="edu-rail" aria-hidden="true" />
          {EDUCATION.map((e, i) => (
            <article className="edu-card" key={e.years} style={{ "--i": i }}>
              <span className="edu-dot" aria-hidden="true" />
              <span className="edu-y">{e.years}</span>
              <h3>{p(e.title)}</h3>
              <small>{e.place}</small>
              <p>{p(e.text)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
