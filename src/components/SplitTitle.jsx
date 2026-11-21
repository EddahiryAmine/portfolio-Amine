import { useInView } from "../hooks/useInView.js";

// Titre dont les lettres montent une à une à l'apparition.
export default function SplitTitle({ as: T = "h2", children, className = "" }) {
  const [ref, seen] = useInView(0.3);
  const text = String(children);
  let n = 0;
  return (
    <T ref={ref} className={`split ${seen ? "in" : ""} ${className}`} aria-label={text}>
      {text.split(" ").map((w, wi) => (
        <span className="w" key={wi} aria-hidden="true">
          {[...w].map((c) => <span key={n} style={{ "--i": n++ }}>{c}</span>)}
        </span>
      ))}
    </T>
  );
}
