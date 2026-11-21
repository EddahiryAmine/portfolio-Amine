import { isDark, techColor } from "../data/tech.js";

// Logo officiel d'une techno (SVG inline, aucune requête externe) ou pastille aux couleurs de la marque.
export default function TechLogo({ tech, size = 28 }) {
  const c = techColor(tech);
  const fill = isDark(c) ? "currentColor" : c;
  if (tech.icon) {
    return (
      <svg className="tlogo" width={size} height={size} viewBox="0 0 24 24" fill={fill} role="img" aria-label={tech.name}>
        <path d={tech.icon.path} />
      </svg>
    );
  }
  return (
    <span className="tmono" style={{ "--c": c, width: size, height: size, fontSize: size * (tech.mono.length > 2 ? 0.34 : 0.44) }} role="img" aria-label={tech.name}>
      {tech.mono}
    </span>
  );
}
