import { useEffect, useState } from "react";
import { extractPalette } from "../lib/palette.js";
import { useInView } from "../hooks/useInView.js";
import { useT } from "../i18n/lang.jsx";

// Œuvre générée à partir de mes photos : chaque colonne est une photo réduite à ses couleurs dominantes.
// Survol = la photo se dévoile ; clic = elle s'ouvre dans la visionneuse.
export default function ColorArt({ photos, onOpen }) {
  const { t, p } = useT();
  const [ref, seen] = useInView(0.1);
  const [pals, setPals] = useState({});
  const [hover, setHover] = useState(null);
  useEffect(() => {
    if (!seen) return;
    let live = true;
    photos.forEach((ph) => extractPalette(ph.src, 6).then((pal) => live && setPals((s) => ({ ...s, [ph.key]: pal }))));
    return () => { live = false; };
  }, [seen, photos]);

  return (
    <section className="wrap cart-sec" ref={ref}>
      <div className="cart-head">
        <div>
          <p className="code">{"// palette.js"}</p>
          <h2>{t("cart.title")}</h2>
        </div>
        <p className="cart-txt">{t("cart.txt")} <b>{t("cart.hint")}</b></p>
      </div>
      <div className={"cart" + (seen ? " in" : "")} onPointerLeave={() => setHover(null)}>
        {photos.map((ph, i) => {
          const pal = pals[ph.key] || [];
          const sum = pal.reduce((a, c) => a + c.share, 0) || 1;
          const title = p(ph.title);
          return (
            <button key={ph.key} className={"cart-col" + (hover === i ? " on" : "")} style={{ "--i": i }} onPointerEnter={() => setHover(i)} onFocus={() => setHover(i)}
              onClick={() => onOpen(i)} aria-label={t("cart.open", { x: title })}>
              {pal.length ? pal.map((c) => <i key={c.hex} style={{ background: c.hex, flexGrow: c.share / sum }} />) : <i className="ph" />}
              <img src={ph.src} alt="" loading="lazy" />
              <span className="cart-lab">{String(i + 1).padStart(2, "0")} · {title}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
