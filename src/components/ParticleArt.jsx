import { useEffect, useRef } from "react";
import { reducedMotion } from "../hooks/useReducedMotion.js";

// Œuvre générative : des milliers de particules dessinent un mot. Le curseur (ou le doigt) les disperse,
// un clic les fait exploser, puis elles reviennent à leur place. Animation coupée hors de l'écran.
export default function ParticleArt({ word = "Amine", sub = "code · lumière · détail", label = "" }) {
  const cv = useRef(null);
  useEffect(() => {
    const canvas = cv.current, ctx = canvas.getContext("2d");
    const still = reducedMotion();
    let W = 0, H = 0, dpr = 1, P = [], raf = 0, running = false;
    const mouse = { x: -9999, y: -9999 };
    const COLORS = ["#B7C5E3", "#DCE3F1", "#8FA2CC", "#E3A04A", "#D6457F", "#7FD99A"];

    const build = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(2, devicePixelRatio || 1);
      W = r.width; H = r.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Dessine le texte hors écran puis échantillonne ses pixels.
      const off = document.createElement("canvas"), o = off.getContext("2d");
      off.width = W; off.height = H;
      const size = Math.min(W / (word.length * 0.56), H * 0.62);
      o.fillStyle = "#fff"; o.textAlign = "center"; o.textBaseline = "middle";
      o.font = `italic 300 ${size}px Newsreader, Georgia, serif`;
      o.fillText(word, W / 2, H * 0.44);
      o.font = `400 ${Math.max(12, size * 0.11)}px "JetBrains Mono", monospace`;
      o.fillText(sub, W / 2, H * 0.44 + size * 0.56);
      const data = o.getImageData(0, 0, W, H).data;
      const step = W < 600 ? 4 : 5;
      const next = [];
      for (let y = 0; y < H; y += step) for (let x = 0; x < W; x += step) {
        if (data[(y * W + x) * 4 + 3] > 128) {
          const old = P[next.length];
          next.push({
            hx: x, hy: y,
            x: old ? old.x : Math.random() * W, y: old ? old.y : Math.random() * H,
            vx: 0, vy: 0, r: Math.random() * 1.2 + 0.6,
            c: COLORS[(x / W * 3 + Math.random() * 1.4) | 0] || COLORS[0],
            t: Math.random() * Math.PI * 2,
          });
        }
      }
      P = next;
      if (still) { P.forEach((p) => { p.x = p.hx; p.y = p.hy; }); draw(); }
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of P) { ctx.fillStyle = p.c; ctx.fillRect(p.x, p.y, p.r * 1.6, p.r * 1.6); }
    };

    const tick = () => {
      ctx.fillStyle = "rgba(9, 12, 20, 0.28)"; // traînée lumineuse
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";
      for (const p of P) {
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
        if (d2 < 9000) { const f = (9000 - d2) / 9000 * 3.2, d = Math.sqrt(d2) || 1; p.vx += dx / d * f; p.vy += dy / d * f; }
        p.t += 0.02;
        p.vx += (p.hx + Math.cos(p.t) * 0.8 - p.x) * 0.045;
        p.vy += (p.hy + Math.sin(p.t) * 0.8 - p.y) * 0.045;
        p.vx *= 0.86; p.vy *= 0.86;
        p.x += p.vx; p.y += p.vy;
        ctx.fillStyle = p.c;
        ctx.fillRect(p.x, p.y, p.r * 1.5, p.r * 1.5);
      }
      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(tick);
    };

    const pos = (e) => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; };
    const leave = () => { mouse.x = mouse.y = -9999; };
    const boom = (e) => {
      pos(e);
      for (const p of P) { const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.sqrt(dx * dx + dy * dy) || 1; const f = 1400 / (d + 40); p.vx += dx / d * f; p.vy += dy / d * f; }
    };

    let built = false;
    const io = new IntersectionObserver(([en]) => {
      if (en.isIntersecting && !built) { built = true; (document.fonts?.ready || Promise.resolve()).then(build); }
      if (still) return;
      if (en.isIntersecting && !running) { running = true; raf = requestAnimationFrame(tick); }
      else if (!en.isIntersecting && running) { running = false; cancelAnimationFrame(raf); }
    }, { threshold: 0.05 });
    io.observe(canvas);
    let rt;
    const resize = () => { clearTimeout(rt); rt = setTimeout(() => built && build(), 200); };
    addEventListener("resize", resize);
    canvas.addEventListener("pointermove", pos);
    canvas.addEventListener("pointerleave", leave);
    canvas.addEventListener("pointerdown", boom);
    return () => {
      io.disconnect(); cancelAnimationFrame(raf); removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", pos); canvas.removeEventListener("pointerleave", leave); canvas.removeEventListener("pointerdown", boom);
    };
  }, [word, sub]);
  return <canvas ref={cv} className="part-cv" role="img" aria-label={label || word} />;
}
