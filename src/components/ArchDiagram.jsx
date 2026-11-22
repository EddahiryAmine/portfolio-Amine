import { useEffect, useState } from "react";
import Icon from "./Icons.jsx";
import { useT } from "../i18n/lang.jsx";
import { useInView } from "../hooks/useInView.js";
import { reducedMotion } from "../hooks/useReducedMotion.js";

// Schéma d'architecture interactif.
// - Ordinateur : SVG en colonnes. Téléphone : mêmes blocs empilés verticalement (aucun débordement).
// - Clic sur un bloc : son rôle s'affiche. Bouton « Simuler une requête » : la requête traverse le système étape par étape.
const BW = 150, BH = 48, COLW = 232, ROWH = 74, PAD = 20, STEP_MS = 2100;

const useNarrow = () => {
  const q = "(max-width: 760px)";
  const [n, setN] = useState(() => matchMedia(q).matches);
  useEffect(() => { const m = matchMedia(q), on = () => setN(m.matches); m.addEventListener("change", on); return () => m.removeEventListener("change", on); }, []);
  return n;
};

export default function ArchDiagram({ arch, flow = [], label }) {
  const { t, p } = useT();
  const [ref, seen] = useInView(0.2);
  const narrow = useNarrow();
  const [sel, setSel] = useState(null);
  const [step, setStep] = useState(-1); // -1 = pas de simulation
  const nodes = arch.cols.flat(), byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const playing = step >= 0;
  const cur = playing ? flow[step]?.at : sel;
  const visited = new Set(playing ? flow.slice(0, step + 1).map((s) => s.at) : []);

  useEffect(() => {
    if (!playing) return;
    if (step >= flow.length) { setStep(-1); return; }
    const id = setTimeout(() => setStep(step + 1), reducedMotion() ? 3000 : STEP_MS);
    return () => clearTimeout(id);
  }, [step, playing]);

  const pick = (id) => { setStep(-1); setSel(sel === id ? null : id); };
  const state = (id) => (id === cur ? " on" : playing ? (visited.has(id) ? " seen" : " dim") : sel && sel !== id ? " dim" : "");
  const info = playing ? flow[step] : null;
  const panel = info
    ? { title: `${t("cs.step")} ${step + 1}/${flow.length} · ${p(byId[info.at]?.label)}`, text: p(info.t) }
    : sel ? { title: p(byId[sel].label), text: p(byId[sel].d) } : null;

  // --- Version téléphone : rangées empilées
  let body;
  if (narrow) {
    body = (
      <div className="archm">
        {arch.cols.map((col, ci) => (
          <div key={ci} className="archm-row">
            {ci > 0 && <span className="archm-arrow" aria-hidden="true">↓</span>}
            <div className="archm-nodes">
              {col.map((n) => (
                <button key={n.id} className={"archm-node k-" + n.kind + state(n.id)} onClick={() => pick(n.id)} aria-pressed={cur === n.id}>{p(n.label)}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  } else {
    // --- Version ordinateur : SVG
    const rows = Math.max(...arch.cols.map((c) => c.length));
    const W = PAD * 2 + (arch.cols.length - 1) * COLW + BW, H = PAD * 2 + rows * ROWH - (ROWH - BH);
    const pos = {};
    arch.cols.forEach((col, ci) => {
      const top = (H - (col.length * ROWH - (ROWH - BH))) / 2;
      col.forEach((n, ri) => { pos[n.id] = { ...n, x: PAD + ci * COLW, y: top + ri * ROWH, ci }; });
    });
    const path = (a, b) => {
      if (a.ci === b.ci) {
        const x = a.x + BW / 2, y1 = a.y < b.y ? a.y + BH : a.y, y2 = a.y < b.y ? b.y : b.y + BH;
        return [`M${x},${y1} L${x},${y2}`, x + 6, (y1 + y2) / 2, "start"];
      }
      const fwd = b.ci > a.ci, x1 = fwd ? a.x + BW : a.x, x2 = fwd ? b.x : b.x + BW;
      const y1 = a.y + BH / 2, y2 = b.y + BH / 2, mx = (x1 + x2) / 2;
      return [`M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`, mx, (y1 + y2) / 2 - 7, "middle"];
    };
    body = (
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
        <defs>
          <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" className="arch-head" /></marker>
        </defs>
        {arch.edges.map(([from, to, lab], i) => {
          const [d, lx, ly, anchor] = path(pos[from], pos[to]);
          const hot = cur && (from === cur || to === cur);
          return (
            <g key={i} className={"arch-edge" + (hot ? " hot" : "")} style={{ "--i": i }}>
              <path d={d} className="arch-line" markerEnd="url(#arr)" />
              <path d={d} className="arch-flow" />
              {p(lab) && <text x={lx} y={ly} textAnchor={anchor} className="arch-lab">{p(lab)}</text>}
            </g>
          );
        })}
        {Object.values(pos).map((n, i) => (
          <g key={n.id} className={"arch-node k-" + n.kind + state(n.id)} style={{ "--i": i }} transform={`translate(${n.x},${n.y})`}
            onClick={() => pick(n.id)} role="button" tabIndex={0} aria-label={p(n.label)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && pick(n.id)}>
            <rect width={BW} height={BH} rx="13" />
            <text x={BW / 2} y={BH / 2 + 4.5} textAnchor="middle">{p(n.label)}</text>
          </g>
        ))}
      </svg>
    );
  }

  return (
    <div className={"arch" + (seen ? " in" : "") + (playing ? " playing" : "")} ref={ref}>
      <div className="arch-bar">
        <small>{t("cs.archHint")}</small>
        {flow.length > 0 && (
          <button className="arch-play" onClick={() => { setSel(null); setStep(playing ? -1 : 0); }}>
            <Icon name={playing ? "pause" : "play"} size={14} />{playing ? t("cs.stop") : t("cs.simulate")}
          </button>
        )}
      </div>
      <div className="arch-canvas">{body}</div>
      {playing && <div className="arch-prog" aria-hidden="true">{flow.map((_, i) => <i key={i} className={i <= step ? "on" : ""} />)}</div>}
      <div className={"arch-info" + (panel ? " show" : "")} aria-live="polite">
        {panel ? (<><b>{panel.title}</b><p>{panel.text}</p></>) : <p className="arch-empty">{t("cs.archEmpty")}</p>}
      </div>
    </div>
  );
}
