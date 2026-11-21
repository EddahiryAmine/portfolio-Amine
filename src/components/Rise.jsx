// Fait "monter" son contenu depuis un masque (animation de texte du hero).
export default function Rise({ children, delay = 0 }) {
  return (
    <span className="rise" style={{ "--d": `${delay}s` }}>
      <span>{children}</span>
    </span>
  );
}
