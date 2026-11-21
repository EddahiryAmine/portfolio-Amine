import { useEffect, useRef } from "react";
import { reducedMotion } from "../hooks/useReducedMotion.js";

// Contenu qui défile en continu et accélère quand on scrolle.
// dir = 1 vers la gauche, -1 vers la droite. Passe du texte (`text`) ou des éléments (children).
export default function Marquee({ text, dir = 1, speed = 0.7, className = "", children }) {
  const ref = useRef(null);
  useEffect(() => {
    let x = 0, last = scrollY, raf;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const el = ref.current;
      if (!el) return; // élément masqué ou démonté (changement de page)
      const d = scrollY - last;
      last = scrollY;
      const w = el.firstChild.offsetWidth;
      if (!reducedMotion()) x -= dir * (speed + Math.abs(d) * 0.9);
      if (w) { if (x <= -w) x += w; if (x > 0) x -= w; }
      el.style.transform = `translate3d(${x}px,0,0)`;
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, [dir, speed]);
  const c = children ?? text;
  return (
    <div className={"mq " + className} aria-hidden="true">
      <div className="mqt" ref={ref}><span>{c}</span><span>{c}</span><span>{c}</span></div>
    </div>
  );
}
