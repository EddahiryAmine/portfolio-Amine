import { useEffect, useRef, useState } from "react";
import { useT } from "../i18n/lang.jsx";
import { reducedMotion } from "../hooks/useReducedMotion.js";

// Carrousel 3D (coverflow) : capture active au centre, voisines en perspective.
// Défile seul (pause au survol), au glisser, aux flèches ou au clavier. Clic au centre = plein écran.
export default function Coverflow({ shots, onOpen }) {
  const { t, p } = useT();
  const [i, setI] = useState(0);
  const [hold, setHold] = useState(false);
  const x0 = useRef(null);
  const n = shots.length, kind = shots[0]?.kind || "browser";
  const go = (d) => setI((v) => (v + d + n) % n);

  useEffect(() => {
    if (hold || reducedMotion() || n < 2) return;
    const id = setTimeout(() => go(1), 3800);
    return () => clearTimeout(id);
  }, [i, hold, n]);

  return (
    <div className={"cf3 " + kind} onPointerEnter={() => setHold(true)} onPointerLeave={() => setHold(false)}
      onTouchStart={(e) => { x0.current = e.touches[0].clientX; setHold(true); }}
      onTouchEnd={(e) => { const d = e.changedTouches[0].clientX - x0.current; if (Math.abs(d) > 40) go(d < 0 ? 1 : -1); }}
      onKeyDown={(e) => { if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); }} tabIndex={0} aria-roledescription="carousel">
      <div className="cf3-stage">
        {shots.map((s, k) => {
          let d = k - i;
          if (d > n / 2) d -= n;
          if (d < -n / 2) d += n;
          const a = Math.abs(d);
          return (
            <button key={k} className={"cf3-item" + (d === 0 ? " on" : "")} style={{ "--d": d, "--ab": a, zIndex: 10 - a, opacity: a > 2 ? 0 : 1, pointerEvents: a > 2 ? "none" : "auto" }}
              onClick={() => (d === 0 ? onOpen(k) : setI(k))} aria-label={p(s.cap)} tabIndex={a > 2 ? -1 : 0}>
              {kind === "phone" ? <span className="fr-notch" /> : <span className="fr-bar"><i /><i /><i /></span>}
              <img src={s.src} alt={p(s.cap)} loading="lazy" draggable="false" />
              <span className="cf3-shine" aria-hidden="true" />
            </button>
          );
        })}
      </div>
      <div className="cf3-ui">
        <button onClick={() => go(-1)} aria-label={t("lb.prev")}>‹</button>
        <span className="cf3-cap" aria-live="polite"><b>{p(shots[i].cap)}</b><small>{i + 1} / {n}</small></span>
        <button onClick={() => go(1)} aria-label={t("lb.next")}>›</button>
      </div>
      <div className="cf3-dots">{shots.map((_, k) => <i key={k} className={k === i ? "on" : ""} onClick={() => setI(k)} />)}</div>
    </div>
  );
}
