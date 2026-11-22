import { useEffect, useRef, useState } from "react";
import Icon from "../components/Icons.jsx";
import Reveal from "../components/Reveal.jsx";
import SplitTitle from "../components/SplitTitle.jsx";
import { ask, MAX_LEN } from "../lib/ask.js";
import { MODES } from "../lib/knowledge.js";
import { PROFILE } from "../data/content.js";
import { useT } from "../i18n/lang.jsx";
import { reducedMotion } from "../hooks/useReducedMotion.js";
import portrait from "../assets/amine.webp";
import cvPdf from "../assets/CV_Amine_Eddahiry.pdf";

const scrollTo = (id) => () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
const openUrl = (u) => () => window.open(u, "_blank", "noopener");

// Boutons proposés sous les réponses (les clés sont utilisées dans knowledge.js, champ act). Libellés : ai.act.* dans strings.js.
const ACTIONS = {
  cv: { icon: "download", run: () => { const a = document.createElement("a"); a.href = cvPdf; a.download = "CV_Amine_Eddahiry.pdf"; a.click(); } },
  email: { icon: "mail", run: () => { location.href = `mailto:${PROFILE.email}`; } },
  whatsapp: { icon: "chat", run: openUrl(PROFILE.whatsapp) },
  linkedin: { icon: "linkedin", run: openUrl(PROFILE.linkedin) },
  github: { icon: "github", run: openUrl(PROFILE.github) },
  contact: { icon: "send", run: scrollTo("contact-form") },
  projets: { icon: "folder", run: scrollTo("projets") },
  parcours: { icon: "branch", run: scrollTo("parcours") },
  competences: { icon: "spark", run: scrollTo("competences") },
  certifs: { icon: "award", run: scrollTo("certifs") },
  formation: { icon: "cap", run: scrollTo("formation") },
  egg: { icon: "spark", run: () => dispatchEvent(new Event("hire-amine")) },
  perso: { icon: "swap", run: () => { location.hash = "photographie"; window.scrollTo(0, 0); } },
};

const canSpeak = typeof window !== "undefined" && "speechSynthesis" in window;

// Affiche un texte caractère par caractère.
function Typed({ text, onTick, onDone }) {
  const [n, setN] = useState(reducedMotion() ? text.length : 0);
  useEffect(() => {
    if (n >= text.length) { onDone?.(); return; }
    const t = setTimeout(() => { setN(Math.min(text.length, n + 2)); onTick?.(); }, 14);
    return () => clearTimeout(t);
  }, [n, text]);
  return <>{text.slice(0, n)}</>;
}

const HELLO_MSG = { role: "assistant", hello: true, done: true, act: [] };

// Le texte des messages est rendu comme du texte (React l'échappe) : aucun HTML injecté.
export default function Ask() {
  const { t, p, lang } = useT();
  const NAME = lang === "en" ? "Amine AI" : "Amine IA";
  const [msgs, setMsgs] = useState([HELLO_MSG]);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState(MODES[0].id);
  const [voice, setVoice] = useState(false);
  const [talking, setTalking] = useState(-1); // index du message lu à voix haute
  const list = useRef(null), utter = useRef(null);
  const down = () => { const l = list.current; if (l) l.scrollTop = l.scrollHeight; };
  useEffect(down, [msgs, busy]);
  useEffect(() => () => canSpeak && speechSynthesis.cancel(), []);

  const speak = (text, i, l = lang) => {
    if (!canSpeak) return;
    utter.current = null;
    speechSynthesis.cancel();
    if (talking === i) { setTalking(-1); return; }
    const u = new SpeechSynthesisUtterance(text);
    u.lang = l === "en" ? "en-US" : "fr-FR"; u.rate = 1.04;
    const v = speechSynthesis.getVoices().find((x) => x.lang?.startsWith(l));
    if (v) u.voice = v;
    u.onend = u.onerror = () => { if (utter.current === u) setTalking(-1); };
    utter.current = u;
    setTalking(i);
    speechSynthesis.speak(u);
  };

  const send = async (text) => {
    const x = text.trim().slice(0, MAX_LEN);
    if (!x || busy) return;
    const history = msgs.filter((m) => !m.hello).map(({ role, content }) => ({ role, content }));
    setMsgs((m) => [...m.map((y) => ({ ...y, done: true })), { role: "user", content: x, done: true }]);
    setQ(""); setBusy(true);
    const [r] = await Promise.all([ask(x, history, lang), new Promise((ok) => setTimeout(ok, 700))]);
    setBusy(false);
    setMsgs((m) => [...m, { role: "assistant", content: r.text, ai: r.ai, act: r.act, lang }]);
  };

  // Lecture automatique de la dernière réponse si la voix est activée.
  const spoken = useRef(0);
  useEffect(() => {
    const i = msgs.length - 1;
    if (voice && i > spoken.current && msgs[i].role === "assistant") { spoken.current = i; speak(msgs[i].content, i, msgs[i].lang); }
    if (!voice) spoken.current = i;
  }, [msgs, voice]);

  const reset = () => { canSpeak && speechSynthesis.cancel(); setTalking(-1); spoken.current = 0; setMsgs([HELLO_MSG]); };
  const cur = MODES.find((m) => m.id === mode);
  const state = busy ? " think" : talking >= 0 ? " talk" : "";

  return (
    <section id="ask" style={{ paddingTop: 0 }}>
      <div className="wrap ai">
        <Reveal className="ai-persona">
          <div className={"ai-avatar" + state} aria-hidden="true">
            <span className="aura" /><span className="ripple" /><span className="ripple r2" />
            <img src={portrait} alt="" />
            <span className="ai-badge"><Icon name="spark" size={14} />{lang === "en" ? "AI" : "IA"}</span>
          </div>
          <SplitTitle>{NAME}</SplitTitle>
          <p className="lead">{t("ai.lead")}</p>

          <div className="ai-modes" role="tablist" aria-label={t("ai.iam")}>
            <small>{t("ai.iam")}</small>
            {MODES.map((m) => (
              <button key={m.id} role="tab" aria-selected={mode === m.id} className={mode === m.id ? "on" : ""} onClick={() => setMode(m.id)}>
                <Icon name={m.icon} size={15} />{p(m.label)}
              </button>
            ))}
          </div>
          <div className="ai-sugg" key={mode + lang}>
            {p(cur.q).map((s, i) => (
              <button key={s} onClick={() => send(s)} disabled={busy} style={{ "--d": i * 0.06 + "s" }}>
                <span>{s}</span><Icon name="arrow" size={15} />
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.12} className="chat ai-chat">
          <div className="chat-h">
            <span className={"ai-mini" + state}><img src={portrait} alt="" /></span>
            <span className="ai-who"><b>{NAME}</b><small>{busy ? t("ai.thinking") : talking >= 0 ? t("ai.talking") : t("ai.online")}</small></span>
            {talking >= 0 && <span className="wave" aria-hidden="true"><i /><i /><i /><i /><i /></span>}
            <span className="ai-tools">
              {canSpeak && (
                <button onClick={() => { setVoice(!voice); if (voice) { speechSynthesis.cancel(); setTalking(-1); } }} aria-pressed={voice}
                  title={voice ? t("ai.voiceOff") : t("ai.voiceOn")} aria-label={t("ai.voice")}>
                  <Icon name={voice ? "volume" : "mute"} size={17} />
                </button>
              )}
              <button onClick={reset} title={t("ai.reset")} aria-label={t("ai.reset")}><Icon name="refresh" size={17} /></button>
            </span>
          </div>
          <div className="chat-l" ref={list} aria-live="polite">
            {msgs.map((m, i) => {
              const text = m.hello ? t("ai.hello") : m.content;
              return (
                <div key={i} className={"msg-row " + m.role}>
                  {m.role === "assistant" && <img className="msg-av" src={portrait} alt="" />}
                  <div className="msg-col">
                    <div className={"msg " + m.role} lang={m.lang}>
                      {m.role === "assistant" && !m.done ? <Typed text={text} onTick={down} onDone={down} /> : text}
                    </div>
                    {m.role === "assistant" && !m.hello && (
                      <div className="msg-act">
                        {canSpeak && (
                          <button className={"listen" + (talking === i ? " on" : "")} onClick={() => speak(text, i, m.lang)} aria-label={talking === i ? t("ai.stopA") : t("ai.listenA")}>
                            <Icon name={talking === i ? "pause" : "volume"} size={14} />{talking === i ? t("ai.stop") : t("ai.listen")}
                          </button>
                        )}
                        {(m.act || []).map((k) => ACTIONS[k] && (
                          <button key={k} onClick={ACTIONS[k].run}><Icon name={ACTIONS[k].icon} size={14} />{t("ai.act." + k)}</button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {busy && <div className="msg-row assistant"><img className="msg-av" src={portrait} alt="" /><div className="msg assistant dots" aria-label={t("ai.writing")}><i /><i /><i /></div></div>}
          </div>
          <form className="chat-f" onSubmit={(e) => { e.preventDefault(); send(q); }}>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("ai.placeholder")} maxLength={MAX_LEN} aria-label={t("ai.your")} autoComplete="off" />
            <button type="submit" disabled={!q.trim() || busy} aria-label={t("ai.send")}><Icon name="send" size={18} /></button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
