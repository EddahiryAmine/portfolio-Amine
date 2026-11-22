import { useEffect, useRef, useState } from "react";
import Icon from "../components/Icons.jsx";
import Reveal from "../components/Reveal.jsx";
import SplitTitle from "../components/SplitTitle.jsx";
import { useT } from "../i18n/lang.jsx";
import { useInView } from "../hooks/useInView.js";
import { reducedMotion } from "../hooks/useReducedMotion.js";

// Terminal + pipeline GitLab CI simulés : du commit à la mise en ligne, expliqué en langage simple.
// Chaque étape : commande tapée, sortie, étape du pipeline concernée, phrase « en clair ».
const STAGES = ["build", "test", "quality", "deploy"];

function steps(t) {
  return [
    { cmd: "git checkout -b feature/api-tickets", out: ["Switched to a new branch 'feature/api-tickets'"], plain: t("pipe.p1") },
    { cmd: 'git commit -m "feat: endpoint d\'achat de tickets"', out: ["[feature/api-tickets 3f2a9c1] feat: endpoint d'achat de tickets", " 4 files changed"], plain: t("pipe.p2") },
    { cmd: "git push origin feature/api-tickets", out: ["remote: To create a merge request, visit:", "remote:   https://gitlab.com/amine/api/-/merge_requests/new", "Pipeline #1042 created ✓"], plain: t("pipe.p3") },
    { stage: "build", out: ["$ dotnet restore && dotnet build -c Release", "Build succeeded. 0 Warning(s) 0 Error(s)"], plain: t("pipe.p4") },
    { stage: "test", out: ["$ dotnet test --no-build", "Passed! All tests are green ✓"], plain: t("pipe.p5") },
    { stage: "quality", out: ["$ sonar-scanner", "Quality Gate: PASSED ✓ (coverage, bugs, code smells)"], plain: t("pipe.p6") },
    { stage: "deploy", out: ["$ deploy --env recette", "Application déployée en recette ✓"], plain: t("pipe.p7") },
  ];
}

export default function Pipeline() {
  const { t } = useT();
  const S = steps(t);
  const [ref, seen] = useInView(0.35);
  const [k, setK] = useState(-1); // étape en cours (-1 = pas lancé)
  const [typed, setTyped] = useState(0); // caractères tapés de la commande courante
  const [lines, setLines] = useState([]);
  const started = useRef(false), term = useRef(null);
  const run = () => { setLines([]); setTyped(0); setK(0); };

  useEffect(() => { if (seen && !started.current) { started.current = true; run(); } }, [seen]);
  useEffect(() => { const el = term.current; if (el) el.scrollTop = el.scrollHeight; }, [lines, typed]);
  useEffect(() => {
    if (k < 0 || k >= S.length) return;
    const st = S[k], fast = reducedMotion();
    if (st.cmd && typed < st.cmd.length) {
      const id = setTimeout(() => setTyped(fast ? st.cmd.length : typed + 1), 28);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => {
      setLines((l) => [...l, ...(st.cmd ? [{ c: "cmd", s: st.cmd }] : []), ...st.out.map((s) => ({ c: s.includes("✓") ? "ok" : "out", s }))]);
      setTyped(0); setK(k + 1);
    }, fast ? 300 : st.stage ? 1500 : 650);
    return () => clearTimeout(id);
  }, [k, typed]);

  const done = k >= S.length;
  const curStage = k >= 0 && k < S.length ? S[k].stage : null;
  const stageState = (s) => {
    const idx = S.findIndex((x) => x.stage === s);
    if (k < 3) return "idle";
    if (k > idx) return "passed";
    if (k === idx) return "running";
    return "pending";
  };
  const plain = k < 0 ? t("pipe.intro") : done ? t("pipe.done") : S[k].plain;
  const cur = k >= 0 && k < S.length ? S[k] : null;

  return (
    <section id="pipeline" style={{ paddingTop: 0 }} ref={ref}>
      <div className="wrap">
        <Reveal>
          <SplitTitle>{t("pipe.title")}</SplitTitle>
          <p className="lead">{t("pipe.lead")}</p>
        </Reveal>
        <div className="pipe">
          <div className="pipe-term">
            <div className="tbar"><i /><i /><i /><span>amine@dev: ~/api</span></div>
            <pre ref={term} aria-live="polite">
              {lines.map((l, i) => <span key={i} className={"pl-" + l.c}>{l.c === "cmd" ? <><b>$</b> {l.s}</> : l.s}{"\n"}</span>)}
              {cur?.cmd && <span className="pl-cmd"><b>$</b> {cur.cmd.slice(0, typed)}<span className="caret" /></span>}
              {!cur?.cmd && !done && k >= 0 && <span className="pl-out dim">{t("pipe.running")}<span className="caret" /></span>}
              {done && <span className="pl-cmd"><b>$</b> <span className="caret" /></span>}
            </pre>
          </div>
          <div className="pipe-gl">
            <div className="gl-head">
              <span className="gl-logo" aria-hidden="true" />
              <b>Pipeline #1042</b>
              <span className={"gl-badge " + (done ? "passed" : k >= 3 ? "running" : "idle")}>{done ? "passed" : k >= 3 ? "running" : k >= 0 ? "created" : "—"}</span>
            </div>
            <div className="gl-stages">
              {STAGES.map((s, i) => (
                <div key={s} className={"gl-stage " + stageState(s) + (curStage === s ? " cur" : "")}>
                  <small>{t("pipe.s." + s)}</small>
                  <span className="gl-job">
                    <span className="gl-ico" aria-hidden="true">{stageState(s) === "passed" ? "✓" : stageState(s) === "running" ? "" : "•"}</span>
                    {s}
                  </span>
                  {i < STAGES.length - 1 && <span className="gl-link" aria-hidden="true" />}
                </div>
              ))}
            </div>
            <div className="gl-plain" key={k}>
              <span className="gl-step">{k < 0 ? "→" : done ? "✓" : `${Math.min(k + 1, S.length)}/${S.length}`}</span>
              <p>{plain}</p>
            </div>
            <button className="ios-btn gl-run" onClick={run}><Icon name={done ? "refresh" : "play"} size={15} />{done ? t("pipe.replay") : t("pipe.run")}</button>
          </div>
        </div>
      </div>
    </section>
  );
}
