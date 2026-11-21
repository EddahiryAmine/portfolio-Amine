import { useRef } from "react";
import Art from "./Art.jsx";
import { useInView } from "../hooks/useInView.js";
import { reducedMotion } from "../hooks/useReducedMotion.js";
import { TAG_LABELS } from "../data/photos.js";
import { usePalette } from "../lib/palette.js";
import { useT } from "../i18n/lang.jsx";

// Carte photo : se "développe" à l'apparition (flou et noir et blanc -> net), inclinaison 3D, cadre de viseur.
export default function Tile({ photo, index, onOpen }) {
  const [vis, seen] = useInView(0.15);
  const inner = useRef(null);
  const pal = usePalette(photo.src, seen, 4);
  const { t, p } = useT();
  const title = p(photo.title);
  const move = (e) => {
    if (reducedMotion() || e.pointerType === "touch") return;
    const r = inner.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
    inner.current.style.transform = `perspective(900px) rotateY(${px * 8}deg) rotateX(${-py * 8}deg) scale(1.02)`;
  };
  return (
    <button ref={vis} className={"tile" + (seen ? " dev" : "")} style={{ "--dd": (index % 5) * 0.14 + "s" }} onClick={onOpen}
      aria-label={t("perso.open", { x: title })} onPointerMove={move} onPointerLeave={() => (inner.current.style.transform = "")}>
      <div className="tile-in" ref={inner}>
        <Art photo={photo} alt={title} />
        <span className="vf" aria-hidden="true" />
      </div>
      <span className="cap"><b>{title}</b><small>{photo.exif || photo.tags.map((x) => p(TAG_LABELS[x])).filter(Boolean)[0] || ""}</small>
        {pal.length > 0 && <span className="tile-pal" aria-hidden="true">{pal.map((c) => <i key={c.hex} style={{ background: c.hex }} />)}</span>}
      </span>
    </button>
  );
}
