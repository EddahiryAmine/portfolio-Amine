import { useEffect, useState } from "react";
import { HELLO } from "../data/content.js";
import { reducedMotion } from "../hooks/useReducedMotion.js";
import { useT } from "../i18n/lang.jsx";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/{}#$%&*";
const latin = (s) => /^[\u0000-ɏ]+$/.test(s);

// Écran de démarrage : "Hello" décodé dans plusieurs langues, journal de boot, progression.
export default function Intro({ phase, setPhase }) {
  const { t } = useT();
  const LOG = t("intro.log");
  const [i, setI] = useState(0);
  const [txt, setTxt] = useState(HELLO[0][0]);
  const last = HELLO.length - 1;

  useEffect(() => {
    if (phase) return;
    if (reducedMotion()) { setPhase(2); return; }
    const target = HELLO[i][0];
    let f = 0;
    const id = setInterval(() => {
      f++;
      if (f >= 9 || !latin(target)) { setTxt(target); clearInterval(id); return; }
      setTxt([...target].map((c, k) => (k < (f / 9) * target.length ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join(""));
    }, 30);
    const t = setTimeout(() => (i < last ? setI(i + 1) : setPhase(1)), i === 0 ? 950 : i === last ? 1100 : 330);
    return () => { clearInterval(id); clearTimeout(t); };
  }, [i, phase]);

  useEffect(() => {
    if (phase !== 1) return;
    const t = setTimeout(() => setPhase(2), 1000);
    return () => clearTimeout(t);
  }, [phase]);

  if (phase === 2) return null;
  const pct = Math.round((i / last) * 100);
  const lines = LOG.slice(0, Math.max(1, Math.ceil(((i + 1) / HELLO.length) * LOG.length)));
  return (
    <div className={"intro" + (phase ? " out" : "")} role="status" aria-label={t("intro.welcome")}>
      <pre className="boot" aria-hidden="true">{lines.map((l) => <span key={l} className={l.startsWith("[") ? "okl" : ""}>{l}{"\n"}</span>)}</pre>
      <h1 className={i === last ? "fin" : ""} lang={HELLO[i][1]}>{txt}</h1>
      <div className="ibar" aria-hidden="true">
        <span>lang: {HELLO[i][1]}</span>
        <i style={{ transform: `scaleX(${pct / 100})` }} />
        <span>{String(pct).padStart(3, "0")}%</span>
      </div>
      <button className="skip" onClick={() => setPhase(1)}>{t("intro.skip")}</button>
    </div>
  );
}
