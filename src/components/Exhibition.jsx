import { useEffect, useRef, useState } from "react";
import { TAG_LABELS } from "../data/photos.js";
import { usePalette } from "../lib/palette.js";
import { useInView } from "../hooks/useInView.js";
import { useT } from "../i18n/lang.jsx";

// Une œuvre accrochée : passe-partout, spot de lumière et cartel de musée.
function Frame({ ph, i, onOpen }) {
  const { t, p, lang } = useT();
  const [ref, seen] = useInView(0.2);
  const pal = usePalette(ph.src, seen);
  const tags = ph.tags.map((x) => p(TAG_LABELS[x])).filter(Boolean);
  const title = p(ph.title);
  return (
    <article ref={ref} className={"ex-item" + (seen ? " lit" : "")} style={{ "--w": ph.ratio > 1 ? "min(68vw, 640px)" : "min(56vw, 380px)" }}>
      <span className="ex-spot" aria-hidden="true" />
      <button className="ex-frame" onClick={onOpen} aria-label={t("ex.zoom", { x: title })}>
        <img src={ph.src} alt={title} loading="lazy" style={{ aspectRatio: ph.ratio }} />
      </button>
      <div className="ex-card">
        <small>{lang === "en" ? "No." : "N°"} {String(i + 1).padStart(2, "0")}</small>
        <b>{title}</b>
        <span>{tags.join(", ") || t("ex.photo")}</span>
        {pal.length > 0 && <span className="ex-dots">{pal.map((c) => <i key={c.hex} style={{ background: c.hex }} title={c.hex} />)}</span>}
      </div>
    </article>
  );
}

// Mode exposition : un mur de galerie qui défile horizontalement (molette, flèches, glisser).
export default function Exhibition({ photos, onOpen }) {
  const { t } = useT();
  const wall = useRef(null);
  const [pos, setPos] = useState(0);
  useEffect(() => {
    const el = wall.current;
    const wheel = (e) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const max = el.scrollWidth - el.clientWidth;
      if ((e.deltaY > 0 && el.scrollLeft < max - 2) || (e.deltaY < 0 && el.scrollLeft > 2)) { e.preventDefault(); el.scrollLeft += e.deltaY; }
    };
    const scroll = () => setPos(el.scrollLeft / Math.max(1, el.scrollWidth - el.clientWidth));
    el.addEventListener("wheel", wheel, { passive: false });
    el.addEventListener("scroll", scroll, { passive: true });
    return () => { el.removeEventListener("wheel", wheel); el.removeEventListener("scroll", scroll); };
  }, []);
  const by = (d) => wall.current.scrollBy({ left: d * wall.current.clientWidth * 0.6, behavior: "smooth" });

  return (
    <div className="ex">
      <div className="ex-wall" ref={wall} tabIndex={0} aria-label={t("ex.wall")}
        onKeyDown={(e) => { if (e.key === "ArrowRight") by(1); if (e.key === "ArrowLeft") by(-1); }}>
        <div className="ex-intro">
          <small>{t("ex.k")}</small>
          <h3>{t("ex.t1")}<br /><em>{t("ex.t2")}</em></h3>
          <p>{t("ex.p", { n: photos.length })}</p>
        </div>
        {photos.map((ph, i) => <Frame key={ph.key} ph={ph} i={i} onOpen={() => onOpen(i)} />)}
        <div className="ex-end"><small>{t("ex.endK")}</small><b>{t("ex.end")}</b></div>
      </div>
      <div className="ex-ctrl">
        <button onClick={() => by(-1)} aria-label={t("ex.prev")}>←</button>
        <span className="ex-bar"><i style={{ transform: `scaleX(${Math.max(0.04, pos)})` }} /></span>
        <button onClick={() => by(1)} aria-label={t("ex.next")}>→</button>
      </div>
    </div>
  );
}
