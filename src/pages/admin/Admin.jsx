import { useEffect, useRef, useState } from "react";
import Icon from "../../components/Icons.jsx";
import { SECTIONS } from "./schema.js";
import { Field, Photos, api, label18 } from "./parts.jsx";
import portrait from "../../assets/amine.webp";

// Espace admin (/admin). Toute la sécurité est côté serveur (api/admin.js) : cette page n'est qu'une interface.
const NAME = "Amine";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- Fond animé (aurore + grille + particules) ----------
function Backdrop() {
  return (
    <div className="ax-bg" aria-hidden="true">
      <i className="b1" /><i className="b2" /><i className="b3" />
      <span className="ax-grid" />
      {Array.from({ length: 18 }, (_, k) => <b key={k} style={{ "--x": (k * 53) % 100 + "%", "--d": (k % 7) * 1.3 + "s", "--s": 6 + (k % 5) * 2 + "s" }} />)}
    </div>
  );
}

// ---------- Avatar avec anneau (états : idle, scan, ok, err, lock) ----------
function Avatar({ state, size = 132 }) {
  return (
    <div className={"ax-avatar " + state} style={{ "--sz": size + "px" }}>
      <svg className="ax-ring" viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="60" cy="60" r="56" className="track" />
        <circle cx="60" cy="60" r="56" className="prog" pathLength="100" />
        {Array.from({ length: 36 }, (_, k) => <line key={k} x1="60" y1="2" x2="60" y2={k % 3 ? 6 : 9} transform={`rotate(${k * 10} 60 60)`} className="tick" />)}
      </svg>
      <img src={portrait} alt="" />
      <span className="ax-scan" aria-hidden="true" />
      <span className="ax-badge" aria-hidden="true">
        {state === "ok" ? <svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7" /></svg>
          : state === "err" ? <svg viewBox="0 0 24 24"><path d="M7 7l10 10M17 7 7 17" /></svg>
          : <svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="9" rx="2" /><path className="shackle" d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>}
      </span>
    </div>
  );
}

// ---------- Connexion ----------
function Login({ needCode, onDone, notice }) {
  const [pass, setPass] = useState(""), [code, setCode] = useState(""), [show, setShow] = useState(false);
  const [state, setState] = useState("idle"), [err, setErr] = useState(notice || "");
  const submit = async (e) => {
    e.preventDefault(); if (state === "scan") return;
    setErr(""); setState("scan");
    const [r] = await Promise.all([api("login", { method: "POST", body: { password: pass, code } }), sleep(reduced() ? 0 : 1400)]);
    if (r.ok) { setState("ok"); await sleep(reduced() ? 0 : 900); setPass(""); return onDone(); }
    setState("err"); setPass(""); setCode("");
    setErr(r.status === 429 ? "Trop de tentatives. Réessaie dans 15 minutes." : r.status === 503 ? "Espace admin non configuré." : r.status === 502 ? "Service momentanément indisponible." : "Accès refusé. Vérifie le mot de passe et le code.");
    setTimeout(() => setState("idle"), 1600);
  };
  const time = new Date().getHours(), hello = time < 5 ? "Bonsoir" : time < 18 ? "Bonjour" : "Bonsoir";
  return (
    <div className="ax-stage">
      <Backdrop />
      <form className={"ax-card" + (state === "err" ? " shake" : "")} onSubmit={submit} noValidate>
        <Avatar state={state} />
        <p className="ax-hello">{hello}, {NAME}</p>
        <h1>Espace sécurisé</h1>
        <p className="ax-sub"><span className="ax-dot" />Connexion chiffrée · double authentification</p>
        <label className="ax-input">
          <Icon name="card" size={17} />
          <input type={show ? "text" : "password"} value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Mot de passe" autoComplete="current-password" autoFocus required maxLength={200} aria-label="Mot de passe" disabled={state === "scan" || state === "ok"} />
          <button type="button" className="ax-eye" onClick={() => setShow(!show)} aria-label={show ? "Masquer" : "Afficher"}>{show ? "Masquer" : "Afficher"}</button>
        </label>
        {needCode && (
          <div className="ax-otp" aria-label="Code à 6 chiffres">
            <input inputMode="numeric" autoComplete="one-time-code" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} aria-label="Code à 6 chiffres" disabled={state === "scan" || state === "ok"} />
            {Array.from({ length: 6 }, (_, k) => <span key={k} className={code.length === k ? "cur" : code[k] ? "on" : ""}>{code[k] || ""}</span>)}
          </div>
        )}
        <p className={"ax-err" + (err ? " show" : "")} role="alert">{err || " "}</p>
        <button className="ax-go" disabled={state === "scan" || state === "ok" || !pass || (needCode && code.length < 6)}>
          <span>{state === "scan" ? "Vérification…" : state === "ok" ? "Accès autorisé" : "Déverrouiller"}</span>
          {state === "scan" ? <i className="ax-mini-spin" /> : <Icon name="arrow" size={16} />}
        </button>
        <p className="ax-foot">🔒 Session de 2 h · tentatives limitées · page non indexée</p>
      </form>
    </div>
  );
}

// ---------- Séquence « Bienvenue » / « À bientôt » (plein écran, façon vidéo) ----------
function Cinematic({ kind, onEnd }) {
  const canvas = useRef(null);
  useEffect(() => {
    if (reduced()) { const t = setTimeout(onEnd, 900); return () => clearTimeout(t); }
    const c = canvas.current, x = c.getContext("2d"), dpr = Math.min(2, devicePixelRatio || 1);
    const W = (c.width = innerWidth * dpr), H = (c.height = innerHeight * dpr);
    const welcome = kind === "welcome", cx = W / 2, cy = H * 0.42;
    const P = Array.from({ length: 220 }, () => {
      const a = Math.random() * Math.PI * 2, sp = (welcome ? 2 : 0.6) + Math.random() * (welcome ? 9 : 3);
      return { a, r: welcome ? 0 : 260 * dpr + Math.random() * 300 * dpr, sp, s: (1 + Math.random() * 2.2) * dpr, h: welcome ? 205 + Math.random() * 60 : 15 + Math.random() * 30 };
    });
    let raf, t0 = performance.now();
    const tick = (now) => {
      const t = (now - t0) / 1000;
      x.fillStyle = welcome ? "rgba(4,6,14,0.22)" : "rgba(4,6,14,0.28)"; x.fillRect(0, 0, W, H);
      for (const p of P) {
        p.r += welcome ? p.sp * dpr * Math.max(0.15, 1.6 - t) : -p.sp * dpr * 0.9;
        if (!welcome && p.r < 0) p.r = 0;
        const px = cx + Math.cos(p.a + t * 0.3) * p.r, py = cy + Math.sin(p.a + t * 0.3) * p.r;
        x.fillStyle = `hsla(${p.h},90%,${welcome ? 70 : 60}%,${welcome ? Math.max(0, 1 - t / 3) : Math.min(1, p.r / (200 * dpr))})`;
        x.beginPath(); x.arc(px, py, p.s, 0, 7); x.fill();
      }
      if (t < 3.6) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const end = setTimeout(onEnd, welcome ? 3300 : 3000);
    return () => { cancelAnimationFrame(raf); clearTimeout(end); };
  }, []);
  const welcome = kind === "welcome";
  const word = welcome ? NAME : "À bientôt";
  return (
    <div className={"ax-cine " + kind} onClick={onEnd} role="status" aria-live="polite">
      <canvas ref={canvas} aria-hidden="true" />
      <div className="ax-cine-in">
        <Avatar state={welcome ? "ok" : "lock"} size={150} />
        <small>{welcome ? "Identité vérifiée · accès autorisé" : "Session fermée · données protégées"}</small>
        <h2>{welcome && <em>Bienvenue,&nbsp;</em>}{[...word].map((ch, i) => <span key={i} style={{ "--i": i }}>{ch === " " ? " " : ch}</span>)}</h2>
        <p>{welcome ? "Tout est prêt. Bonne session." : `Merci ${NAME}, à la prochaine.`}</p>
        <i className="ax-cine-bar" />
      </div>
      <span className="ax-skip">Toucher pour passer</span>
    </div>
  );
}

// ---------- Suivi de publication (GitHub → Vercel → en ligne) ----------
function Tracker({ job, onClose }) {
  const steps = ["Enregistré sur GitHub", "Construction du site", "Mise en ligne", "En ligne ✓"];
  return (
    <div className={"ax-track" + (job.step >= 3 ? " done" : "") + (job.error ? " err" : "")} role="status">
      <div className="ax-track-h"><b>{job.error ? "Publication interrompue" : job.step >= 3 ? "Ton site est à jour" : "Publication en cours…"}</b><button onClick={onClose} aria-label="Fermer">×</button></div>
      <ol>{steps.map((s, i) => <li key={s} className={i < job.step ? "ok" : i === job.step ? "cur" : ""}><span>{i < job.step || job.step >= 3 ? "✓" : i + 1}</span>{s}</li>)}</ol>
      <p>{job.error || (job.step >= 3 ? "Les visiteurs voient déjà tes modifications." : job.slow ? "Ça prend un peu plus longtemps que d’habitude…" : "Environ 1 minute. Tu peux continuer à travailler.")}</p>
      {job.step >= 3 && <a href="/" target="_blank" rel="noopener">Voir le site ↗</a>}
    </div>
  );
}

// ---------- Accueil du tableau de bord ----------
function Home({ data, go, lastPublish }) {
  const s = data.site;
  const stats = [
    ["Expériences", s.experience.length, "branch", "experience"], ["Projets", s.projects.length, "folder", "projects"],
    ["Certifications", s.certifications.length, "award", "certifications"], ["Photos", Object.keys(data.photos).length, "frame", "photos"],
    ["Langues", s.languages.length, "globe", "languages"], ["Avis", s.testimonials.length, "chat", "testimonials"],
  ];
  const h = new Date().getHours(), hello = h < 5 ? "Bonsoir" : h < 18 ? "Bonjour" : "Bonsoir";
  return (
    <div className="ax-home">
      <section className="ax-hero-card">
        <img src={portrait} alt="" />
        <div>
          <small>{new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}</small>
          <h2>{hello}, {NAME} 👋</h2>
          <p>Ton portfolio en un coup d’œil. Modifie une section, puis appuie sur <b>Publier</b>.</p>
          <div className="ax-pills"><span><i className="ax-dot" />Site en ligne</span><span>🔐 Session sécurisée</span>{lastPublish && <span>Dernière publication : {lastPublish}</span>}</div>
        </div>
      </section>
      <div className="ax-stats">
        {stats.map(([l, n, ic, id], i) => (
          <button key={id} className="ax-stat" style={{ "--i": i }} onClick={() => go(id)}>
            <span className={"ax-ico anim-" + ic}><Icon name={ic} size={20} /></span>
            <b>{n}</b><small>{l}</small><span className="ax-stat-go">Modifier →</span>
          </button>
        ))}
      </div>
      <section className="ax-how">
        <h3>Comment publier</h3>
        <ol>
          <li><span>1</span>Modifie une section (le badge passe à « Non publié »).</li>
          <li><span>2</span>Appuie sur <b>Publier</b> en haut à droite.</li>
          <li><span>3</span>Suis la progression : le site est à jour en ≈ 1 minute.</li>
        </ol>
      </section>
    </div>
  );
}

// ---------- Sécurité : changement du mot de passe ----------
function strength(p) {
  let s = 0; if (p.length >= 12) s++; if (p.length >= 16) s++; if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++; if (/\d/.test(p)) s++; if (/[^A-Za-z0-9]/.test(p)) s++;
  return Math.min(4, s);
}
function Security({ needCode, flash, onTrack }) {
  const [f, setF] = useState({ current: "", next: "", again: "", code: "" }), [busy, setBusy] = useState(false), [show, setShow] = useState(false);
  const st = strength(f.next), labels = ["Trop faible", "Faible", "Correct", "Fort", "Excellent"];
  const set = (k) => (e) => setF({ ...f, [k]: k === "code" ? e.target.value.replace(/\D/g, "").slice(0, 6) : e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    if (f.next.length < 12) return flash("Le nouveau mot de passe doit faire au moins 12 caractères.", true);
    if (f.next !== f.again) return flash("Les deux nouveaux mots de passe sont différents.", true);
    setBusy(true);
    const r = await api("password", { method: "POST", body: { current: f.current, next: f.next, code: f.code } });
    setBusy(false);
    if (r.ok) { setF({ current: "", next: "", again: "", code: "" }); flash("Mot de passe changé. Utilise le nouveau dès ta prochaine connexion."); onTrack(r.data.commit); return; }
    flash(r.status === 401 ? "Ancien mot de passe ou code incorrect." : r.status === 429 ? "Trop de tentatives, réessaie plus tard." : r.data.error === "same" ? "Choisis un mot de passe différent de l’actuel." : "Échec du changement.", true);
  };
  return (
    <div className="ax-sec">
      <form className="adm-card ax-sec-card" onSubmit={submit}>
        <div className="ax-sec-h"><span className="ax-ico anim-card big"><Icon name="card" size={22} /></span><div><h3>Changer le mot de passe</h3><p>Ton ancien mot de passe et le code à 6 chiffres sont demandés.</p></div></div>
        <label className="adm-field"><span>Mot de passe actuel</span><input type={show ? "text" : "password"} value={f.current} onChange={set("current")} autoComplete="current-password" required /></label>
        <label className="adm-field"><span>Nouveau mot de passe</span><input type={show ? "text" : "password"} value={f.next} onChange={set("next")} autoComplete="new-password" required minLength={12} /></label>
        <div className={"ax-meter s" + st}><i /><i /><i /><i /><small>{f.next ? labels[st] : "12 caractères minimum, mélange lettres, chiffres et symboles"}</small></div>
        <label className="adm-field"><span>Confirme le nouveau mot de passe</span><input type={show ? "text" : "password"} value={f.again} onChange={set("again")} autoComplete="new-password" required /></label>
        {needCode && <label className="adm-field"><span>Code à 6 chiffres</span><input inputMode="numeric" value={f.code} onChange={set("code")} autoComplete="one-time-code" required /></label>}
        <label className="adm-bool"><input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} /><span className="ios-switch" aria-hidden="true" /><span>Afficher les mots de passe</span></label>
        <button className="ios-btn adm-primary" disabled={busy}>{busy ? "Enregistrement…" : "Changer le mot de passe"}</button>
      </form>
      <div className="adm-card ax-sec-card ax-sec-info">
        <h3>Protections actives</h3>
        <ul>
          <li><span>🔑</span>Mot de passe haché (scrypt), jamais stocké en clair</li>
          <li><span>📱</span>Double authentification par code à 6 chiffres</li>
          <li><span>🍪</span>Session signée, cookie sécurisé, expiration 2 h</li>
          <li><span>🛑</span>Blocage après 5 essais ratés</li>
          <li><span>🧱</span>Requêtes externes refusées, données vérifiées</li>
          <li><span>🙈</span>Page invisible pour Google</li>
        </ul>
      </div>
    </div>
  );
}

// ---------- Tableau de bord ----------
const NAV = [{ id: "home", label: "Accueil", icon: "grid" }, ...SECTIONS, { id: "security", label: "Sécurité", icon: "card" }];

export default function Admin() {
  const [state, setState] = useState("loading"); // loading | login | welcome | ready | goodbye | error
  const [needCode, setNeedCode] = useState(false);
  const [data, setData] = useState(null);
  const [orig, setOrig] = useState("");
  const [tab, setTab] = useState("home");
  const [open, setOpen] = useState(0);
  const [msg, setMsg] = useState(null);
  const [saving, setSaving] = useState(false);
  const [job, setJob] = useState(null);
  const [lastPublish, setLastPublish] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    document.title = "Admin · Portfolio";
    const m = document.createElement("meta"); m.name = "robots"; m.content = "noindex, nofollow"; document.head.appendChild(m);
    check();
    return () => m.remove();
  }, []);
  const flash = (text, err) => { setMsg({ text, err }); setTimeout(() => setMsg(null), 5000); };
  async function check() {
    const r = await api("session");
    if (r.status === 503 || r.status === 404) { setState("error"); return; }
    setNeedCode(!!r.data.needCode);
    if (r.data.authenticated) { await load(); setState("ready"); } else setState("login");
  }
  async function load() {
    const r = await api("data");
    if (r.status === 401) { setState("login"); return false; }
    if (!r.ok) { setState("error"); return false; }
    setData(r.data); setOrig(JSON.stringify([r.data.site, r.data.photos]));
    return true;
  }
  const afterLogin = async () => { setNotice(""); const ok = await load(); if (ok) setState("welcome"); };
  const dirty = data && JSON.stringify([data.site, data.photos]) !== orig;
  useEffect(() => {
    const warn = (e) => { if (dirty) { e.preventDefault(); e.returnValue = ""; } };
    addEventListener("beforeunload", warn); return () => removeEventListener("beforeunload", warn);
  }, [dirty]);

  // Suit la mise en ligne : attend que la version déployée corresponde au commit publié.
  async function track(commit) {
    setJob({ step: 1, commit });
    const t0 = Date.now();
    for (;;) {
      await sleep(5000);
      const r = await api("version");
      const elapsed = Date.now() - t0;
      if (r.ok && r.data.commit && commit && r.data.commit === commit) { setJob({ step: 3, commit }); setLastPublish(new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })); return; }
      if (r.ok && !r.data.commit && elapsed > 75000) { setJob({ step: 3, commit }); return; } // version non exposée : on estime
      if (elapsed > 30000) setJob((j) => ({ ...j, step: 2, slow: elapsed > 150000 }));
      if (elapsed > 300000) { setJob((j) => ({ ...j, error: "La mise en ligne n’a pas été confirmée. Vérifie l’onglet Deployments de Vercel." })); return; }
    }
  }
  const save = async () => {
    setSaving(true);
    const r = await api("save", { method: "POST", body: { site: data.site, photos: data.photos, siteSha: data.siteSha, photosSha: data.photosSha } });
    setSaving(false);
    if (r.ok) { await load(); track(r.data.commit); return; }
    if (r.status === 409) return flash("Le contenu a changé entre-temps. Recharge la page puis refais tes modifications.", true);
    if (r.status === 401) { setNotice("Session expirée, reconnecte-toi."); setState("login"); return; }
    flash(r.data.detail ? `Refusé : ${r.data.detail}` : "Échec de la publication.", true);
  };
  const logout = async () => { await api("logout", { method: "POST" }); setState("goodbye"); };

  if (state === "loading") return <div className="ax-stage"><Backdrop /><div className="adm-spin" aria-label="Chargement" /></div>;
  if (state === "error") return <div className="ax-stage"><Backdrop /><div className="ax-card"><h1>Espace admin</h1><p className="ax-sub">Indisponible pour le moment (configuration ou service).</p><a className="ax-go" href="/">Retour au site</a></div></div>;
  if (state === "login") return <Login needCode={needCode} onDone={afterLogin} notice={notice} />;
  if (state === "goodbye") return <Cinematic kind="goodbye" onEnd={() => { setData(null); setTab("home"); setState("login"); }} />;

  const sec = NAV.find((s) => s.id === tab);
  const site = data.site;
  const setSite = (s) => setData({ ...data, site: s });
  const list = sec.kind === "list" ? site[sec.id] : null;
  const setItem = (i, item) => { const l = [...list]; l[i] = item; setSite({ ...site, [sec.id]: l }); };
  const move = (i, d) => { const l = [...list]; const j = i + d; if (j < 0 || j >= l.length) return; [l[i], l[j]] = [l[j], l[i]]; setSite({ ...site, [sec.id]: l }); setOpen(j); };
  const go = (id) => { setTab(id); setOpen(0); };

  return (
    <>
      <div className={"adm ax-dash" + (state === "welcome" ? " behind" : "")}>
        <aside className="adm-side">
          <div className="adm-brand"><img src={portrait} alt="" /><span><b>{NAME}</b><small>Administrateur</small></span></div>
          <nav>{NAV.map((s, i) => (
            <button key={s.id} className={tab === s.id ? "on" : ""} onClick={() => go(s.id)} style={{ "--i": i }}>
              <span className={"ax-ico anim-" + s.icon}><Icon name={s.icon} size={17} /></span>{s.label}
              {s.id !== "home" && s.id !== "security" && s.kind === "list" && <small>{site[s.id].length}</small>}
            </button>
          ))}</nav>
          <div className="adm-side-foot"><a href="/" target="_blank" rel="noopener">Voir le site ↗</a><button onClick={logout}><Icon name="close" size={14} /> Se déconnecter</button></div>
        </aside>
        <main className="adm-main" key={tab}>
          <header className="adm-top">
            <h1><span className={"ax-ico anim-" + sec.icon}><Icon name={sec.icon} size={20} /></span>{sec.label}</h1>
            <span className={"adm-status" + (dirty ? " dirty" : "")}>{dirty ? "● Non publié" : "✓ À jour"}</span>
            <button className={"ios-btn adm-primary ax-publish" + (dirty ? " pulse" : "")} onClick={save} disabled={!dirty || saving}>{saving ? "Envoi…" : "Publier"}</button>
          </header>
          {sec.note && <p className="adm-note">{sec.note}</p>}

          {tab === "home" && <Home data={data} go={go} lastPublish={lastPublish} />}
          {tab === "security" && <Security needCode={needCode} flash={flash} onTrack={() => {}} />}

          {sec.kind === "object" && (
            <div className="adm-card adm-grid2 ax-in">
              {sec.fields.map((def) => {
                const root = def[0].startsWith("$"), key = root ? def[0].slice(1) : def[0];
                const value = root ? site[key] : site.profile[key];
                return <Field key={def[0]} def={def} value={value} onChange={(v) => setSite(root ? { ...site, [key]: v } : { ...site, profile: { ...site.profile, [key]: v } })} />;
              })}
            </div>
          )}

          {sec.kind === "list" && (
            <>
              {list.map((item, i) => (
                <div key={i} className={"adm-card adm-item ax-in" + (open === i ? " open" : "")} style={{ "--i": i }}>
                  <button className="adm-item-h" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
                    <span className="adm-n">{i + 1}</span><b>{label18(sec.title(item))}</b><span className="adm-chev">⌄</span>
                  </button>
                  {open === i && (
                    <div className="adm-item-b">
                      <div className="adm-grid2">{sec.fields.map((def) => <Field key={def[0]} def={def} value={item[def[0]]} onChange={(v) => { const n = { ...item }; if (v === undefined) delete n[def[0]]; else n[def[0]] = v; setItem(i, n); }} />)}</div>
                      <div className="adm-row-btns">
                        <button className="ios-btn adm-ghost" onClick={() => move(i, -1)} disabled={i === 0}>↑ Monter</button>
                        <button className="ios-btn adm-ghost" onClick={() => move(i, 1)} disabled={i === list.length - 1}>↓ Descendre</button>
                        <button className="ios-btn adm-danger" onClick={() => { setSite({ ...site, [sec.id]: list.filter((_, k) => k !== i) }); setOpen(-1); }}>Supprimer</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <button className="adm-add" onClick={() => { setSite({ ...site, [sec.id]: [...list, structuredClone(sec.blank)] }); setOpen(list.length); }}>+ Ajouter</button>
            </>
          )}

          {sec.kind === "photos" && <Photos photos={data.photos} setPhotos={(p) => setData({ ...data, photos: p })} files={data.files} flash={flash} reload={async () => { await load(); }} onPublished={track} />}
        </main>
        {msg && <div className={"adm-toast" + (msg.err ? " err" : "")} role="status">{msg.text}</div>}
        {job && <Tracker job={job} onClose={() => setJob(null)} />}
      </div>
      {state === "welcome" && <Cinematic kind="welcome" onEnd={() => setState("ready")} />}
    </>
  );
}
