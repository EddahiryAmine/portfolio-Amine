import { useEffect, useState } from "react";
import Icon from "../components/Icons.jsx";
import Reveal from "../components/Reveal.jsx";
import SplitTitle from "../components/SplitTitle.jsx";
import { TESTIMONIALS } from "../data/testimonials.js";
import { useT } from "../i18n/lang.jsx";
import { reducedMotion } from "../hooks/useReducedMotion.js";

// Carrousel de recommandations. N'apparaît que si src/data/testimonials.js contient au moins une citation.
export default function Testimonials() {
  const { t, p } = useT();
  const [i, setI] = useState(0);
  const [pause, setPause] = useState(false);
  const n = TESTIMONIALS.length;
  useEffect(() => {
    if (n < 2 || pause || reducedMotion()) return;
    const id = setTimeout(() => setI((i + 1) % n), 7000);
    return () => clearTimeout(id);
  }, [i, n, pause]);
  if (!n) return null;
  const q = TESTIMONIALS[i];
  const initials = q.name.split(" ").map((w) => w[0]).slice(0, 2).join("");

  return (
    <section id="recos" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <SplitTitle>{t("reco.title")}</SplitTitle>
        <Reveal className="reco" onPointerEnter={() => setPause(true)} onPointerLeave={() => setPause(false)}>
          <span className="reco-q" aria-hidden="true">“</span>
          <blockquote key={i}>
            <p>{p(q.quote)}</p>
            <footer>
              <span className="reco-av">{initials}</span>
              <span><b>{q.name}</b><small>{p(q.role)}</small></span>
              {q.linkedin && <a href={q.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Icon name="linkedin" size={18} /></a>}
            </footer>
          </blockquote>
          {n > 1 && (
            <div className="reco-nav">
              <button onClick={() => setI((i + n - 1) % n)} aria-label={t("lb.prev")}>←</button>
              <span>{TESTIMONIALS.map((_, k) => <i key={k} className={k === i ? "on" : ""} />)}</span>
              <button onClick={() => setI((i + 1) % n)} aria-label={t("lb.next")}>→</button>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
