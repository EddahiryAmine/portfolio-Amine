import { useRef } from "react";
import { reducedMotion } from "../hooks/useReducedMotion.js";

// Élément "aimanté" : suit légèrement le curseur.
export default function Magnet({ as: T = "a", strength = 0.22, className = "", children, ...rest }) {
  const ref = useRef(null);
  const move = (e) => {
    if (reducedMotion() || e.pointerType === "touch") return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * strength}px, ${(e.clientY - r.top - r.height / 2) * strength}px)`;
  };
  return (
    <T ref={ref} className={"mag " + className} onPointerMove={move} onPointerLeave={() => (ref.current.style.transform = "")} {...rest}>
      {children}
    </T>
  );
}
