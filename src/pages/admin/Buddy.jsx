// Personnage animé de la page de connexion (dessin SVG original).
// mood : idle | look | cover | peek | think | happy | sad   ·   look : { x, y } entre -1 et 1 (direction du regard)
export default function Buddy({ mood = "idle", look = { x: 0, y: 0 } }) {
  const lx = Math.max(-1, Math.min(1, look.x)), ly = Math.max(-1, Math.min(1, look.y));
  const px = mood === "look" ? 0 : lx * 4.5, py = mood === "look" ? 4.5 : mood === "think" ? -4 : ly * 3.5;
  const mouth = {
    idle: "M88 132 Q100 142 112 132", look: "M92 134 Q100 139 108 134", cover: "M91 135 Q100 131 109 135",
    peek: "M90 133 Q100 141 110 133", think: "M92 136 L108 133", happy: "M84 128 Q100 152 116 128 Z", sad: "M88 140 Q100 129 112 140",
  }[mood];
  return (
    <svg className={"bd bd-" + mood} viewBox="0 0 200 190" role="img" aria-label="Personnage">
      {/* Tête */}
      <g className="bd-head">
        <path d="M58 82 C52 40 82 28 100 30 C124 30 150 44 142 86 C150 82 156 92 150 100 L48 100 C42 92 50 80 58 82 Z" className="bd-hair" />
        <ellipse cx="100" cy="112" rx="44" ry="42" className="bd-face" />
        <path d="M64 92 C72 70 128 66 138 92 C126 80 110 76 100 84 C90 76 76 80 64 92 Z" className="bd-hair" />
        <circle cx="76" cy="124" r="7" className="bd-cheek" /><circle cx="124" cy="124" r="7" className="bd-cheek" />
        {/* Yeux */}
        <g className="bd-eyes">
          <ellipse cx="84" cy="110" rx="10" ry="11" className="bd-eye" />
          <ellipse cx="116" cy="110" rx="10" ry="11" className="bd-eye" />
          <circle cx={84 + px} cy={111 + py} r="5" className="bd-pupil" />
          <circle cx={116 + px} cy={111 + py} r="5" className="bd-pupil" />
          <circle cx={86 + px} cy={108 + py} r="1.6" className="bd-shine" />
          <circle cx={118 + px} cy={108 + py} r="1.6" className="bd-shine" />
          <rect x="72" y="97" width="56" height="13" className="bd-lid" />
        </g>
        <path d={mood === "sad" ? "M74 96 L92 99 M108 99 L126 96" : mood === "think" ? "M74 96 L92 94 M108 92 L126 97" : "M74 95 L92 94 M108 94 L126 95"} className="bd-brow" />
        <path d={mouth} className={"bd-mouth" + (mood === "happy" ? " open" : "")} />
        {mood === "sad" && <path d="M128 118 q4 8 0 12 q-4 -4 0 -12" className="bd-tear" />}
        {mood === "think" && <g className="bd-dots"><circle cx="150" cy="70" r="3" /><circle cx="160" cy="58" r="4" /><circle cx="172" cy="44" r="5" /></g>}
      </g>
      {/* Bras gauche + main */}
      <g className="bd-arm bd-arm-l">
        <path d="M58 168 C40 150 38 128 52 112" className="bd-sleeve" />
        <circle cx="52" cy="110" r="13" className="bd-hand" /><path d="M47 101v7M53 99v8M59 101v7" className="bd-finger" />
      </g>
      {/* Bras droit + main */}
      <g className="bd-arm bd-arm-r">
        <path d="M142 168 C160 150 162 128 148 112" className="bd-sleeve" />
        <circle cx="148" cy="110" r="13" className="bd-hand" /><path d="M141 101v7M147 99v8M153 101v7" className="bd-finger" />
      </g>
    </svg>
  );
}
