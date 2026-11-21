import { useEffect, useState } from "react";
import { reducedMotion } from "../hooks/useReducedMotion.js";

// Écrit un texte caractère par caractère (clin d'œil terminal).
export default function TypeLine({ text, start = 0, speed = 28 }) {
  const [n, setN] = useState(reducedMotion() ? text.length : 0);
  useEffect(() => {
    if (n >= text.length) return;
    const t = setTimeout(() => setN(n + 1), n === 0 ? start : speed);
    return () => clearTimeout(t);
  }, [n, start, speed, text]);
  return <>{text.slice(0, n)}<span className="caret" /></>;
}
