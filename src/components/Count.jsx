import { useEffect, useState } from "react";
import { useInView } from "../hooks/useInView.js";
import { reducedMotion } from "../hooks/useReducedMotion.js";

// Compteur animé qui monte jusqu'à `to` à l'apparition.
export default function Count({ to, suffix = "" }) {
  const [ref, seen] = useInView();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!seen) return;
    if (reducedMotion()) { setN(to); return; }
    let raf; const t0 = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - t0) / 1300);
      setN(Math.round(to * (1 - (1 - p) ** 3)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [seen, to]);
  return <span ref={ref}>{n}{suffix}</span>;
}
