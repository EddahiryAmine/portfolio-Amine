import { useEffect, useRef } from "react";
import { reducedMotion } from "../hooks/useReducedMotion.js";

// Curseur personnalisé (souris uniquement) : point précis + anneau qui suit en douceur.
export default function Cursor() {
  const dot = useRef(null), ring = useRef(null);
  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches || reducedMotion()) return;
    const root = document.documentElement;
    let x = -100, y = -100, rx = -100, ry = -100, raf;
    const move = (e) => {
      x = e.clientX; y = e.clientY;
      root.classList.add("has-cursor");
      dot.current.style.transform = `translate(${x}px, ${y}px)`;
      ring.current.classList.toggle("big", !!e.target.closest?.("a, button, [role=option], input, label, .tile"));
    };
    const loop = () => {
      rx += (x - rx) * 0.17; ry += (y - ry) * 0.17;
      ring.current.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = requestAnimationFrame(loop);
    };
    addEventListener("pointermove", move);
    loop();
    return () => { removeEventListener("pointermove", move); cancelAnimationFrame(raf); root.classList.remove("has-cursor"); };
  }, []);
  return (<><div ref={ring} className="cur-ring" aria-hidden="true" /><div ref={dot} className="cur-dot" aria-hidden="true" /></>);
}
