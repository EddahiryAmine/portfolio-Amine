import { useEffect, useRef, useState } from "react";
import Icon from "./Icons.jsx";
import { PROFILE } from "../data/content.js";
import { useT } from "../i18n/lang.jsx";
import { reducedMotion } from "../hooks/useReducedMotion.js";
import cvPdf from "../assets/CV_Amine_Eddahiry.pdf";

// Easter egg : "sudo hire amine" (palette Ctrl+K) ou le code Konami. Terminal qui "recrute" Amine, puis confettis.
export default function HireMe({ onClose }) {
  const { t } = useT();
  const lines = t("egg.lines");
  const [n, setN] = useState(reducedMotion() ? lines.length : 0);
  const cv = useRef(null);
  const done = n >= lines.length;

  useEffect(() => {
    if (done) return;
    const id = setTimeout(() => setN(n + 1), n === 0 ? 350 : 520);
    return () => clearTimeout(id);
  }, [n, done]);
  useEffect(() => {
    const k = (e) => e.key === "Escape" && onClose();
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, []);

  // Confettis sur canvas quand le "recrutement" aboutit.
  useEffect(() => {
    if (!done || reducedMotion()) return;
    const c = cv.current, x = c.getContext("2d"), dpr = Math.min(2, devicePixelRatio || 1);
    c.width = innerWidth * dpr; c.height = innerHeight * dpr; x.scale(dpr, dpr);
    const colors = ["#B7C5E3", "#E3A04A", "#D6457F", "#7FD99A", "#F6F2EC", "#5B8DEF"];
    const P = Array.from({ length: 180 }, () => ({
      x: innerWidth / 2, y: innerHeight * 0.45, vx: (Math.random() - 0.5) * 16, vy: -Math.random() * 15 - 4,
      r: Math.random() * 6 + 3, c: colors[(Math.random() * colors.length) | 0], a: Math.random() * 6, va: (Math.random() - 0.5) * 0.3,
    }));
    let raf, frames = 0;
    const tick = () => {
      x.clearRect(0, 0, innerWidth, innerHeight);
      for (const q of P) {
        q.vy += 0.32; q.vx *= 0.99; q.x += q.vx; q.y += q.vy; q.a += q.va;
        x.save(); x.translate(q.x, q.y); x.rotate(q.a); x.fillStyle = q.c; x.fillRect(-q.r / 2, -q.r / 4, q.r, q.r / 2); x.restore();
      }
      if (++frames < 260) raf = requestAnimationFrame(tick); else x.clearRect(0, 0, innerWidth, innerHeight);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [done]);

  return (
    <div className="egg" role="dialog" aria-modal="true" aria-label="sudo hire amine" onClick={onClose}>
      <canvas ref={cv} className="egg-cv" aria-hidden="true" />
      <div className="egg-term" onClick={(e) => e.stopPropagation()}>
        <div className="tbar"><i /><i /><i /><span>recruiter@portfolio: ~</span></div>
        <pre>
          <span className="egg-cmd">$ sudo hire amine</span>{"\n"}
          {lines.slice(0, n).map((l, i) => <span key={i} className={l.startsWith("✓") ? "ok" : l.startsWith("[") ? "dim" : ""}>{l}{"\n"}</span>)}
          {!done && <span className="caret" />}
        </pre>
        {done && (
          <div className="egg-cta">
            <a className="btn solid" href={`mailto:${PROFILE.email}?subject=${encodeURIComponent("sudo hire amine")}`}><Icon name="mail" size={17} />{t("egg.mail")}</a>
            <a className="btn ghost" href={cvPdf} download="CV_Amine_Eddahiry.pdf"><Icon name="download" size={17} />{t("pal.cv")}</a>
            <button className="egg-x" onClick={onClose}>{t("ui.close")}</button>
          </div>
        )}
      </div>
    </div>
  );
}
