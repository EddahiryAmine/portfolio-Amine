import { useEffect, useRef, useState } from "react";
import Icon from "./Icons.jsx";
import { TAG_LABELS } from "../data/photos.js";
import { useT } from "../i18n/lang.jsx";
import { inkOn, usePalette } from "../lib/palette.js";
import { reducedMotion } from "../hooks/useReducedMotion.js";

const SLIDE_MS = 4500;

// Visionneuse immersive : fond d'ambiance tiré de la photo, palette de couleurs (clic = copier le code),
// diaporama, miniatures. Clavier : flèches, Espace (diaporama), Échap. Glissement du doigt sur mobile.
export default function Lightbox({ photos, index, setIndex }) {
  const n = photos.length, p = photos[index], x0 = useRef(null), thumbs = useRef(null);
  const [play, setPlay] = useState(false);
  const [copied, setCopied] = useState("");
  const pal = usePalette(p.src);
  const { t, p: tp } = useT();
  const next = () => setIndex((index + 1) % n), prev = () => setIndex((index + n - 1) % n);

  useEffect(() => {
    const key = (e) => {
      if (e.key === "Escape") setIndex(null);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === " ") { e.preventDefault(); setPlay((v) => !v); }
    };
    addEventListener("keydown", key);
    document.body.style.overflow = "hidden";
    return () => { removeEventListener("keydown", key); document.body.style.overflow = ""; };
  }, [index, n]);
  useEffect(() => {
    if (!play) return;
    const t = setTimeout(next, SLIDE_MS);
    return () => clearTimeout(t);
  }, [play, index]);
  useEffect(() => {
    thumbs.current?.querySelector(".on")?.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", inline: "center", block: "nearest" });
  }, [index]);

  const copy = async (hex) => {
    try { await navigator.clipboard.writeText(hex); } catch { /* indisponible */ }
    setCopied(hex); setTimeout(() => setCopied(""), 1400);
  };
  const stop = (fn) => (e) => { e.stopPropagation(); fn(); };
  const tags = p.tags.map((x) => tp(TAG_LABELS[x])).filter(Boolean);
  const title = tp(p.title);

  return (
    <div className="lb lb2" role="dialog" aria-modal="true" aria-label={title} onClick={() => setIndex(null)}
      onTouchStart={(e) => (x0.current = e.touches[0].clientX)}
      onTouchEnd={(e) => { const d = e.changedTouches[0].clientX - x0.current; if (Math.abs(d) > 50) (d < 0 ? next : prev)(); }}>
      <div className="lb-amb" style={{ backgroundImage: `url(${p.src})` }} key={"a" + p.key} aria-hidden="true" />
      <div className="lb-top" onClick={(e) => e.stopPropagation()}>
        <span className="lb-n">{String(index + 1).padStart(2, "0")} <small>/ {String(n).padStart(2, "0")}</small></span>
        <button className={"lb-play" + (play ? " on" : "")} onClick={() => setPlay(!play)} aria-label={play ? t("lb.pauseA") : t("lb.playA")}>
          <Icon name={play ? "pause" : "play"} size={15} />{play ? t("lb.pause") : t("lb.play")}
        </button>
        <button className="lb-x" onClick={() => setIndex(null)} aria-label={t("ui.close")}><Icon name="close" size={22} /></button>
      </div>
      {play && <span className="lb-prog" key={"p" + index} style={{ animationDuration: SLIDE_MS + "ms" }} />}

      <button className="n pv" aria-label={t("lb.prev")} onClick={stop(prev)}>‹</button>
      <figure className="lb-fig" onClick={(e) => e.stopPropagation()}>
        <img key={p.key} src={p.src} alt={title} />
        <figcaption>
          <div>
            <h3>{title}</h3>
            <small>{[...tags, p.exif].filter(Boolean).join(" · ")}</small>
          </div>
          {pal.length > 0 && (
            <div className="lb-pal" aria-label={t("lb.palette")}>
              {pal.map((c) => (
                <button key={c.hex} style={{ background: c.hex, color: inkOn(c.hex), flexGrow: Math.max(0.6, c.share * 6) }} onClick={() => copy(c.hex)} title={t("lb.copyHex", { x: c.hex })}>
                  <span>{copied === c.hex ? t("ui.copied") : c.hex}</span>
                </button>
              ))}
            </div>
          )}
        </figcaption>
      </figure>
      <button className="n nx" aria-label={t("lb.next")} onClick={stop(next)}>›</button>

      <div className="lb-thumbs" ref={thumbs} onClick={(e) => e.stopPropagation()}>
        {photos.map((ph, i) => (
          <button key={ph.key} className={i === index ? "on" : ""} onClick={() => setIndex(i)} aria-label={tp(ph.title)}><img src={ph.src} alt="" loading="lazy" /></button>
        ))}
      </div>
    </div>
  );
}
