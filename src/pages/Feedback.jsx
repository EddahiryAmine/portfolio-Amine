import { useEffect, useState } from "react";
import Icon from "../components/Icons.jsx";
import LangSwitch from "../components/LangSwitch.jsx";
import Reveal from "../components/Reveal.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";
import { ReviewCard } from "../sections/Testimonials.jsx";
import { PROFILE } from "../data/content.js";
import { TESTIMONIALS } from "../data/testimonials.js";
import { useT } from "../i18n/lang.jsx";

const RELATIONS = ["colleague", "manager", "mentor", "client", "classmate", "other"];
const EMPTY = { name: "", role: "", email: "", linkedin: "", relation: "colleague", rating: 5, message: "", consent: true };
const back = () => { location.hash = ""; setTimeout(() => document.getElementById("recos")?.scrollIntoView({ block: "start" }), 80); };

// Page « Avis » (#avis) : mur des avis publiés + formulaire. Les avis envoyés arrivent par email à Amine, qui choisit ceux à publier.
export default function Feedback({ theme, onTheme }) {
  const { t } = useT();
  const [f, setF] = useState(EMPTY);
  const [err, setErr] = useState({});
  const [state, setState] = useState(""); // "", "sending", "sent", "mail"
  const [trap, setTrap] = useState("");
  const [hover, setHover] = useState(0);
  useEffect(() => { scrollTo(0, 0); }, []);
  const set = (k) => (e) => { setF({ ...f, [k]: e.target.value }); setErr({ ...err, [k]: "" }); };

  const submit = async (e) => {
    e.preventDefault();
    const x = {};
    if (f.name.trim().length < 2) x.name = "errName";
    if (f.message.trim().length < 20) x.message = "errMsg";
    if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) x.email = "errEmail";
    if (f.linkedin && !/^https:\/\/(www\.)?linkedin\.com\//.test(f.linkedin)) x.linkedin = "errLinkedin";
    setErr(x);
    if (Object.keys(x).length) return;
    setState("sending");
    try {
      const r = await fetch("/api/feedback", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...f, website: trap }), signal: AbortSignal.timeout(12000) });
      if (r.ok) { setState("sent"); setF(EMPTY); return; }
      if (r.status === 429) { setState(""); setErr({ message: "errRate" }); return; }
    } catch { /* plan B */ }
    // Plan B : l'avis part par l'application mail du visiteur.
    const body = `${"★".repeat(f.rating)} (${f.rating}/5)\n\n« ${f.message.trim()} »\n\n— ${f.name.trim()}${f.role ? ", " + f.role : ""}\n${t("fb.rel." + f.relation)}${f.linkedin ? "\n" + f.linkedin : ""}\n${f.consent ? t("fb.consentYes") : t("fb.consentNo")}`;
    location.href = `mailto:${PROFILE.email}?subject=${encodeURIComponent("[Avis portfolio] " + f.name.trim())}&body=${encodeURIComponent(body)}`;
    setState("mail");
  };

  return (
    <main className="fbp">
      <header className="cs-bar">
        <button className="cs-back" onClick={back}><Icon name="arrow" size={16} /><span>Portfolio</span></button>
        <div className="cs-bar-r"><LangSwitch /><ThemeToggle theme={theme} onToggle={onTheme} /></div>
      </header>

      <section className="fb-hero wrap">
        <p className="cs-kick">{t("fb.kicker")}</p>
        <h1>{t("fb.title1")} <em>{t("fb.title2")}</em></h1>
        <p className="cs-sum">{t("fb.lead")}</p>
      </section>

      <section className="wrap fb-wall">
        {TESTIMONIALS.length > 0
          ? <div className="fb-grid">{TESTIMONIALS.map((q, i) => <Reveal key={i} delay={(i % 3) * 0.08}><ReviewCard q={q} /></Reveal>)}</div>
          : (
            <div className="fb-empty">
              <div className="fb-ghosts" aria-hidden="true"><span /><span /><span /></div>
              <b>{t("fb.emptyT")}</b><small>{t("fb.empty")}</small>
            </div>
          )}
      </section>

      <section className="wrap fb-form-wrap" id="laisser-un-avis">
        <Reveal className="fb-card">
          {state === "sent" || state === "mail" ? (
            <div className="fb-done">
              <span className="cf-check" aria-hidden="true"><svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="24" /><path d="M15 27l7 7 15-16" /></svg></span>
              <h2>{t("fb.thanks")}</h2>
              <p>{state === "sent" ? t("fb.sent") : t("fb.mail")}</p>
              <button className="ios-btn primary" onClick={() => setState("")}>{t("fb.again")}</button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <h2>{t("fb.formT")}</h2>
              <p className="fb-hint">{t("fb.formHint")}</p>
              <div className="fb-stars" role="radiogroup" aria-label={t("fb.rating")} onPointerLeave={() => setHover(0)}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button type="button" key={n} role="radio" aria-checked={f.rating === n} aria-label={`${n}/5`} className={(hover || f.rating) >= n ? "on" : ""}
                    onPointerEnter={() => setHover(n)} onClick={() => setF({ ...f, rating: n })}>★</button>
                ))}
                <small>{t("fb.stars")[(hover || f.rating) - 1]}</small>
              </div>
              <div className="fb-rel" role="radiogroup" aria-label={t("fb.relation")}>
                {RELATIONS.map((r) => <button type="button" key={r} role="radio" aria-checked={f.relation === r} className={f.relation === r ? "on" : ""} onClick={() => setF({ ...f, relation: r })}>{t("fb.rel." + r)}</button>)}
              </div>
              <div className="fb-row">
                <label className={"ios-field" + (err.name ? " bad" : "")}><span>{t("fb.name")}</span><input value={f.name} onChange={set("name")} maxLength={80} autoComplete="name" placeholder={t("fb.namePh")} />{err.name && <em>{t("contact." + err.name)}</em>}</label>
                <label className="ios-field"><span>{t("fb.role")}</span><input value={f.role} onChange={set("role")} maxLength={120} placeholder={t("fb.rolePh")} /></label>
              </div>
              <label className={"ios-field" + (err.message ? " bad" : "")}><span>{t("fb.message")}</span>
                <textarea value={f.message} onChange={set("message")} rows={5} maxLength={1200} placeholder={t("fb.messagePh")} />
                {err.message && <em>{err.message === "errMsg" ? t("fb.errMsg") : t("contact.errRate")}</em>}
                <small className="fb-count">{f.message.length} / 1200</small>
              </label>
              <div className="fb-row">
                <label className={"ios-field" + (err.email ? " bad" : "")}><span>{t("fb.email")}</span><input type="email" value={f.email} onChange={set("email")} maxLength={120} autoComplete="email" placeholder={t("fb.emailPh")} />{err.email && <em>{t("contact.errEmail")}</em>}</label>
                <label className={"ios-field" + (err.linkedin ? " bad" : "")}><span>LinkedIn</span><input value={f.linkedin} onChange={set("linkedin")} maxLength={200} placeholder="https://www.linkedin.com/in/…" />{err.linkedin && <em>{t("fb.errLinkedin")}</em>}</label>
              </div>
              <label className="fb-consent">
                <input type="checkbox" checked={f.consent} onChange={(e) => setF({ ...f, consent: e.target.checked })} />
                <span className="ios-switch" aria-hidden="true" />
                <span>{t("fb.consent")}</span>
              </label>
              <input className="cf-trap" tabIndex={-1} autoComplete="off" aria-hidden="true" value={trap} onChange={(e) => setTrap(e.target.value)} name="website" />
              <button type="submit" className="ios-btn fb-send" disabled={state === "sending"}><Icon name="send" size={16} />{state === "sending" ? t("contact.sending") : t("fb.send")}</button>
              <p className="fb-privacy">{t("fb.privacy")}</p>
            </form>
          )}
        </Reveal>
      </section>
    </main>
  );
}
