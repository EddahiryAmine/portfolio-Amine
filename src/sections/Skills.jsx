import { useState } from "react";
import SplitTitle from "../components/SplitTitle.jsx";
import Reveal from "../components/Reveal.jsx";
import TechLogo from "../components/TechLogo.jsx";
import { CAT_LABEL, LVL_LABEL, TECH, TECH_CATS, techColor, techCtx } from "../data/tech.js";
import { useT } from "../i18n/lang.jsx";
import portrait from "../assets/amine.webp";

const RINGS = [0, 1, 2].map((r) => TECH.filter((t) => t.ring === r));
const DUR = [38, 56, 80]; // secondes par tour

// Lueur qui suit le curseur sur les cartes.
const glow = (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--gx", e.clientX - r.left + "px");
  e.currentTarget.style.setProperty("--gy", e.clientY - r.top + "px");
};

const Meter = ({ lvl, label }) => (
  <span className="meter" role="img" aria-label={label}>{[1, 2, 3, 4, 5].map((n) => <i key={n} className={n <= lvl ? "on" : ""} />)}</span>
);

export default function Skills() {
  const { t: tr, p, lang } = useT();
  const L = LVL_LABEL[lang];
  const [sel, setSel] = useState(TECH[0]);
  const [cat, setCat] = useState("all");
  const list = cat === "all" ? TECH : TECH.filter((t) => t.cat === cat);

  return (
    <section id="competences" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <SplitTitle>{tr("skills.title")}</SplitTitle>
        <p className="lead sk-lead">{tr("skills.lead", { n: TECH.length })}</p>

        <div className="sk-top">
          <Reveal className="orbit" aria-label={tr("skills.orbit")}>
            <div className="core">
              <img src={portrait} alt="" />
            </div>
            {RINGS.map((ring, r) => (
              <div key={r} className={"oring r" + r} style={{ "--n": ring.length, "--dur": DUR[r] + "s" }}>
                {ring.map((t, i) => (
                  <button key={t.name} className={"sat" + (sel.name === t.name ? " on" : "")} style={{ "--i": i, "--c": techColor(t) }}
                    onClick={() => setSel(t)} onPointerEnter={() => setSel(t)} aria-label={t.name}>
                    <span><TechLogo tech={t} size={r === 0 ? 30 : 24} /></span>
                  </button>
                ))}
              </div>
            ))}
          </Reveal>

          <Reveal delay={0.1} className="focus-card" style={{ "--c": techColor(sel) }} aria-live="polite">
            <div className="fc-logo" key={sel.name}><TechLogo tech={sel} size={64} /></div>
            <small className="fc-cat">{p(CAT_LABEL[sel.cat])}</small>
            <h3>{sel.name}</h3>
            <div className="fc-lvl"><Meter lvl={sel.lvl} label={L[sel.lvl]} /><b>{L[sel.lvl]}</b></div>
            <p>{techCtx(sel, lang)}</p>
            <code className="fc-code">{`skills.find(s => s.name === "${sel.name}") // ✓`}</code>
          </Reveal>
        </div>

        <div className="p-filter sk-filter" role="tablist" aria-label={tr("skills.filter")}>
          {TECH_CATS.map(([k, label]) => (
            <button key={k} role="tab" aria-selected={cat === k} className={cat === k ? "on" : ""} onClick={() => setCat(k)}>
              {p(label)}<small>{k === "all" ? TECH.length : TECH.filter((t) => t.cat === k).length}</small>
            </button>
          ))}
        </div>
        <div className="tgrid" key={cat}>
          {list.map((t, i) => (
            <button key={t.name} className={"tcard" + (sel.name === t.name ? " on" : "")} style={{ "--c": techColor(t), "--d": Math.min(i, 20) * 0.03 + "s" }}
              onPointerMove={glow} onClick={() => {
                setSel(t);
                const fc = document.querySelector(".focus-card"), r = fc?.getBoundingClientRect();
                if (r && (r.bottom < 80 || r.top > innerHeight)) fc.scrollIntoView({ behavior: "smooth", block: "center" });
              }}>
              <TechLogo tech={t} size={30} />
              <span className="tc-n">{t.name}</span>
              <Meter lvl={t.lvl} label={L[t.lvl]} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
