import { useT } from "../i18n/lang.jsx";
import { useInView } from "../hooks/useInView.js";

// Schéma d'architecture en SVG : blocs en colonnes, flèches animées (le flux de données circule).
const BW = 150, BH = 52, COLW = 250, ROWH = 100, PAD = 24;

export default function ArchDiagram({ arch, label }) {
  const { p } = useT();
  const [ref, seen] = useInView(0.25);
  const rows = Math.max(...arch.cols.map((c) => c.length));
  const W = PAD * 2 + (arch.cols.length - 1) * COLW + BW, H = PAD * 2 + rows * ROWH - (ROWH - BH);
  const pos = {};
  arch.cols.forEach((col, ci) => {
    const top = (H - (col.length * ROWH - (ROWH - BH))) / 2;
    col.forEach((n, ri) => { pos[n.id] = { ...n, x: PAD + ci * COLW, y: top + ri * ROWH, ci }; });
  });

  const path = (a, b) => {
    if (a.ci === b.ci) { // même colonne : flèche verticale
      const x = a.x + BW / 2, y1 = a.y < b.y ? a.y + BH : a.y, y2 = a.y < b.y ? b.y : b.y + BH;
      return [`M${x},${y1} L${x},${y2}`, x + 6, (y1 + y2) / 2, "start"];
    }
    const fwd = b.ci > a.ci;
    const x1 = fwd ? a.x + BW : a.x, x2 = fwd ? b.x : b.x + BW;
    const y1 = a.y + BH / 2, y2 = b.y + BH / 2, mx = (x1 + x2) / 2;
    return [`M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`, mx, (y1 + y2) / 2 - 8, "middle"];
  };

  return (
    <div className={"arch" + (seen ? " in" : "")} ref={ref}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} style={{ minWidth: Math.min(W, 640) }}>
        <defs>
          <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" className="arch-head" />
          </marker>
        </defs>
        {arch.edges.map(([from, to, lab], i) => {
          const [d, lx, ly, anchor] = path(pos[from], pos[to]);
          const text = p(lab);
          return (
            <g key={i} className="arch-edge" style={{ "--i": i }}>
              <path d={d} className="arch-line" markerEnd="url(#arr)" />
              <path d={d} className="arch-flow" />
              {text && <text x={lx} y={ly} textAnchor={anchor} className="arch-lab">{text}</text>}
            </g>
          );
        })}
        {Object.values(pos).map((n, i) => (
          <g key={n.id} className={"arch-node k-" + n.kind} style={{ "--i": i }} transform={`translate(${n.x},${n.y})`}>
            <rect width={BW} height={BH} rx="14" />
            <text x={BW / 2} y={BH / 2 + 5} textAnchor="middle">{p(n.label)}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}
