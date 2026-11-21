import { useInView } from "../hooks/useInView.js";

// Fait apparaître son contenu quand il entre à l'écran.
export default function Reveal({ as: T = "div", delay = 0, className = "", style, children, ...rest }) {
  const [ref, seen] = useInView(0.12);
  return (
    <T ref={ref} className={`rv ${seen ? "in" : ""} ${className}`} style={{ "--rd": delay + "s", ...style }} {...rest}>
      {children}
    </T>
  );
}
