import { useEffect, useState } from "react";
import Clock from "../components/Clock.jsx";
import Icon from "../components/Icons.jsx";
import Magnet from "../components/Magnet.jsx";
import Reveal from "../components/Reveal.jsx";
import { COMPANY, PROFILE, ROLE } from "../data/content.js";
import { useT } from "../i18n/lang.jsx";

const CARDS = [
  ["Email", PROFILE.email, `mailto:${PROFILE.email}`, "mail"],
  ["WhatsApp", PROFILE.phone, PROFILE.whatsapp, "chat"],
  ["LinkedIn", "eddahiry-amine", PROFILE.linkedin, "linkedin"],
  ["GitHub", PROFILE.githubHandle, PROFILE.github, "github"],
];
const DRAFT = "contact-draft";
const EMPTY = { name: "", email: "", subject: 0, message: "" };

// Fiche contact (.vcf) : un clic et Amine est dans le répertoire du téléphone.
export function downloadVCard() {
  const v = [
    "BEGIN:VCARD", "VERSION:3.0", "N:Eddahiry;Amine;;;", `FN:${PROFILE.name}`, `TITLE:${ROLE}`, `ORG:${COMPANY}`,
    `EMAIL;TYPE=INTERNET:${PROFILE.email}`, `TEL;TYPE=CELL:${PROFILE.phone.replace(/\s/g, "")}`,
    `URL:${PROFILE.linkedin}`, `X-SOCIALPROFILE;TYPE=github:${PROFILE.github}`, `ADR;TYPE=WORK:;;;${PROFILE.city};;;Maroc`, "END:VCARD",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([v], { type: "text/vcard;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url; a.download = "Amine_Eddahiry.vcf"; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const load = () => {
  try {
    const d = { ...EMPTY, ...JSON.parse(localStorage.getItem(DRAFT) || "{}") };
    if (typeof d.subject !== "number") d.subject = 0;
    return d;
  } catch { return EMPTY; }
};

// Formulaire sans serveur : le message est préparé puis ouvert dans l'application mail ou WhatsApp du visiteur.
// Rien n'est stocké ni envoyé par le site (le brouillon reste dans le navigateur du visiteur).
function ContactForm() {
  const { t } = useT();
  const subjects = t("contact.subjects");
  const [f, setF] = useState(load);
  const [err, setErr] = useState({});
  const [sent, setSent] = useState("");
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [trap, setTrap] = useState(""); // champ piège invisible (anti-robots)
  useEffect(() => { try { localStorage.setItem(DRAFT, JSON.stringify(f)); } catch { /* stockage indisponible */ } }, [f]);
  const set = (k) => (e) => { setF({ ...f, [k]: e.target.value }); setErr({ ...err, [k]: "" }); };

  const submit = async (channel) => {
    if (sending) return;
    const e = {};
    if (f.name.trim().length < 2) e.name = "errName";
    if (channel === "email" && !f.email.trim()) e.email = "errEmailReq";
    else if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "errEmail";
    if (f.message.trim().length < 10) e.message = "errMsg";
    setErr(e);
    if (Object.keys(e).length) return;
    const subj = subjects[f.subject] || subjects[0];
    const sign = `${f.name.trim()}${f.email ? " · " + f.email.trim() : ""}`;
    if (channel === "email") {
      // 1) Envoi direct par le serveur : le message arrive dans ma boîte, sans dépendre de l'app mail du visiteur.
      setSending(true);
      try {
        const r = await fetch("/api/contact", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ name: f.name, email: f.email, subject: subj, message: f.message, website: trap }),
          signal: AbortSignal.timeout(12000),
        });
        if (r.ok) { setSent("api"); setF(EMPTY); return; }
        if (r.status === 429) { setErr({ message: "errRate" }); return; }
      } catch { /* serveur indisponible : on passe au plan B */ } finally { setSending(false); }
      // 2) Plan B : ouvrir l'app mail du visiteur avec le message prêt.
      const subject = `[Portfolio] ${subj} · ${f.name.trim()}`;
      const body = `${t("contact.hi")}\n\n${f.message.trim()}\n\n${sign}`;
      location.href = `mailto:${PROFILE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    } else {
      const text = `${t("contact.hiWa")} (${subj})\n\n${f.message.trim()}\n\n${sign}`;
      window.open(`${PROFILE.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    }
    setSent(channel);
  };

  if (sent) {
    return (
      <div className="cf cf-done" id="contact-form">
        <span className="cf-check" aria-hidden="true"><svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="24" /><path d="M15 27l7 7 15-16" /></svg></span>
        <h3>{sent === "api" ? t("contact.doneApiT") : t("contact.doneT")}</h3>
        {sent === "api"
          ? <p>{t("contact.doneApi")}</p>
          : <p>{sent === "email" ? t("contact.doneEmail") : t("contact.doneWa")} {t("contact.doneEnd1")} <b>{t("contact.doneSend")}</b>. {t("contact.doneEnd2")}</p>}
        {sent === "email" && (
          <div className="cf-fallback">
            <small>{t("contact.noApp")}</small>
            <div>
              <button type="button" onClick={() => navigator.clipboard?.writeText(PROFILE.email).then(() => setCopied(true)).catch(() => {})}>
                <Icon name="copy" size={15} />{copied ? t("ui.copied") : PROFILE.email}
              </button>
              <a href={PROFILE.whatsapp} target="_blank" rel="noopener noreferrer"><Icon name="chat" size={15} />WhatsApp</a>
            </div>
          </div>
        )}
        <button className="pill light" onClick={() => { setSent(""); setF(EMPTY); setCopied(false); }}>{t("contact.again")}</button>
      </div>
    );
  }

  return (
    <form className="cf" id="contact-form" onSubmit={(e) => { e.preventDefault(); submit("email"); }} noValidate>
      <div className="cf-head"><b>{t("contact.form")}</b><small>{t("contact.reply")}</small></div>
      <div className="cf-subj" role="radiogroup" aria-label={t("contact.subject")}>
        {subjects.map((s, i) => (
          <button type="button" key={s} role="radio" aria-checked={f.subject === i} className={f.subject === i ? "on" : ""} onClick={() => setF({ ...f, subject: i })}>{s}</button>
        ))}
      </div>
      <div className="cf-row">
        <label className={"fl" + (err.name ? " bad" : "")}>
          <input value={f.name} onChange={set("name")} placeholder=" " maxLength={80} autoComplete="name" required />
          <span>{t("contact.name")}</span>{err.name && <em>{t("contact." + err.name)}</em>}
        </label>
        <label className={"fl" + (err.email ? " bad" : "")}>
          <input type="email" value={f.email} onChange={set("email")} placeholder=" " maxLength={120} autoComplete="email" />
          <span>{t("contact.email")}</span>{err.email && <em>{t("contact." + err.email)}</em>}
        </label>
      </div>
      <label className={"fl" + (err.message ? " bad" : "")}>
        <textarea value={f.message} onChange={set("message")} placeholder=" " rows={5} maxLength={1500} required />
        <span>{t("contact.message")}</span>{err.message && <em>{t("contact." + err.message)}</em>}
        <small className="cf-count">{f.message.length} / 1500</small>
      </label>
      <input className="cf-trap" tabIndex={-1} autoComplete="off" aria-hidden="true" value={trap} onChange={(e) => setTrap(e.target.value)} name="website" />
      <div className="cf-send">
        <button type="submit" className="cf-btn" disabled={sending}><Icon name="send" size={18} />{sending ? t("contact.sending") : t("contact.sendEmail")}</button>
        <button type="button" className="cf-btn wa" onClick={() => submit("whatsapp")}><Icon name="chat" size={18} />{t("contact.sendWa")}</button>
      </div>
    </form>
  );
}

export default function Contact() {
  const { t } = useT();
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(PROFILE.email); } catch { /* presse-papiers indisponible */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <section className="contact" id="contact">
      <div className="aur" aria-hidden="true"><i /><i /><i /></div>
      <div className="wrap">
        <Reveal>
          <span className="status"><i />{t("contact.status")} · <Clock /> {t("contact.at")} {PROFILE.city}</span>
          <h2>{t("contact.h1")}<br /><em>{t("contact.h2")}</em></h2>
          <div className="mail-row">
            <a className="big" href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
            <button className="copy" onClick={copy}><Icon name="copy" size={16} />{copied ? t("ui.copied") : t("ui.copy")}</button>
          </div>
        </Reveal>
        <div className="c-split">
          <Reveal><ContactForm /></Reveal>
          <div className="c-side">
            <div className="c-grid c-grid2">
              {CARDS.map(([label, value, href, icon], i) => (
                <Reveal key={label} delay={i * 0.08}>
                  <Magnet className="c-card" href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                    <Icon name={icon} size={24} />
                    <small>{label}</small>
                    <b>{value}</b>
                    <span className="go"><Icon name="arrow" size={18} /></span>
                  </Magnet>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.3}>
              <button className="vcard" onClick={downloadVCard}>
                <span className="vc-ic"><Icon name="card" size={22} /></span>
                <span><b>{t("contact.vcard")}</b><small>{t("contact.vcardSub")}</small></span>
                <Icon name="download" size={18} />
              </button>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
