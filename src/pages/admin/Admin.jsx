import { useEffect, useMemo, useRef, useState } from "react";
import Icon from "../../components/Icons.jsx";
import { PHOTO_TAGS, SECTIONS } from "./schema.js";

// Espace admin (/admin). Toute la sécurité est côté serveur (api/admin.js) : cette page n'est qu'une interface.
const PHOTO_URLS = import.meta.glob("../../assets/photos/*.{jpg,jpeg,png,webp,avif}", { eager: true, query: "?url", import: "default" });
const localPhoto = (key) => Object.entries(PHOTO_URLS).find(([p]) => p.split("/").pop().replace(/\.[^.]+$/, "") === key)?.[1];

async function api(action, { method = "GET", body } = {}) {
  const r = await fetch(`/api/admin?action=${action}`, {
    method, credentials: "same-origin", headers: body ? { "content-type": "application/json" } : undefined, body: body ? JSON.stringify(body) : undefined,
  });
  let data = {};
  try { data = await r.json(); } catch { /* réponse vide */ }
  return { status: r.status, ok: r.ok, data };
}

const asI18n = (v) => (v && typeof v === "object" && !Array.isArray(v) ? v : { fr: v ?? "", en: v ?? "" });
const label18 = (v) => (typeof v === "object" && v ? v.fr || v.en : v) || "Sans titre";

// ---------- Champ de formulaire selon son type ----------
function Field({ def, value, onChange }) {
  const [key, label, type, options] = def;
  const id = useMemo(() => "f" + Math.random().toString(36).slice(2), []);
  if (type === "bool") {
    return (
      <label className="adm-bool">
        <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} /><span className="ios-switch" aria-hidden="true" /><span>{label}</span>
      </label>
    );
  }
  if (type === "i18n" || type === "i18nArea") {
    const v = asI18n(value), Tag = type === "i18nArea" ? "textarea" : "input";
    return (
      <div className="adm-field">
        <span>{label}</span>
        <div className="adm-i18n">
          {["fr", "en"].map((l) => (
            <label key={l}><b>{l.toUpperCase()}</b><Tag rows={type === "i18nArea" ? 4 : undefined} value={v[l] || ""} onChange={(e) => onChange({ ...v, [l]: e.target.value })} maxLength={5000} /></label>
          ))}
        </div>
      </div>
    );
  }
  if (type === "tags") {
    const list = Array.isArray(value) ? value : [];
    return (
      <div className="adm-field">
        <span>{label}</span>
        <div className="adm-tags">
          {list.map((t, i) => <span key={t + i}>{t}<button type="button" onClick={() => onChange(list.filter((_, k) => k !== i))} aria-label={`Retirer ${t}`}>×</button></span>)}
          <input placeholder="Ajouter + Entrée" onKeyDown={(e) => { if (e.key === "Enter" && e.currentTarget.value.trim()) { e.preventDefault(); onChange([...list, e.currentTarget.value.trim()]); e.currentTarget.value = ""; } }} />
        </div>
      </div>
    );
  }
  if (type === "select") {
    return (
      <label className="adm-field" htmlFor={id}><span>{label}</span>
        <select id={id} value={value ?? ""} onChange={(e) => onChange(e.target.value || undefined)}>{options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
      </label>
    );
  }
  const bad = type === "url" && value && !/^(https:\/\/|mailto:)/.test(value);
  return (
    <label className={"adm-field" + (bad ? " bad" : "")} htmlFor={id}><span>{label}</span>
      {type === "textarea" ? <textarea id={id} rows={4} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
        : <input id={id} type={type === "number" ? "number" : type === "color" ? "color" : "text"} value={value ?? ""} placeholder={type === "url" ? "https://…" : ""}
          onChange={(e) => onChange(type === "number" ? (e.target.value === "" ? 0 : Number(e.target.value)) : e.target.value || (type === "url" ? undefined : ""))} />}
      {bad && <em>Le lien doit commencer par https://</em>}
    </label>
  );
}

// ---------- Connexion ----------
function Login({ needCode, onDone }) {
  const [pass, setPass] = useState(""), [code, setCode] = useState(""), [err, setErr] = useState(""), [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setErr("");
    const r = await api("login", { method: "POST", body: { password: pass, code } });
    setBusy(false); setPass("");
    if (r.ok) return onDone();
    setErr(r.status === 429 ? "Trop de tentatives. Réessaie dans 15 minutes." : r.status === 503 ? "L’espace admin n’est pas encore configuré (variables Vercel)." : "Identifiants incorrects.");
  };
  return (
    <div className="adm-login">
      <form className="adm-login-card" onSubmit={submit}>
        <span className="adm-lock" aria-hidden="true"><Icon name="card" size={26} /></span>
        <h1>Espace admin</h1>
        <p>Accès réservé.</p>
        <label className="adm-field"><span>Mot de passe</span><input type="password" value={pass} onChange={(e) => setPass(e.target.value)} autoComplete="current-password" autoFocus required maxLength={200} /></label>
        {needCode && <label className="adm-field"><span>Code à 6 chiffres</span><input inputMode="numeric" pattern="\d{6}" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} autoComplete="one-time-code" required /></label>}
        {err && <p className="adm-err" role="alert">{err}</p>}
        <button className="ios-btn adm-primary" disabled={busy}>{busy ? "Vérification…" : "Se connecter"}</button>
      </form>
    </div>
  );
}

// ---------- Photos ----------
async function prepareImage(file) {
  const img = await createImageBitmap(file);
  const max = 1800, s = Math.min(1, max / Math.max(img.width, img.height));
  const c = document.createElement("canvas"); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
  c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
  const blob = await new Promise((r) => c.toBlob(r, "image/jpeg", 0.85));
  const b64 = await new Promise((r) => { const fr = new FileReader(); fr.onload = () => r(String(fr.result).split(",")[1]); fr.readAsDataURL(blob); });
  return { b64, ratio: +(img.width / img.height).toFixed(3), preview: URL.createObjectURL(blob), kb: Math.round(blob.size / 1024) };
}

function Photos({ photos, setPhotos, files, flash, reload }) {
  const [draft, setDraft] = useState(null), [busy, setBusy] = useState(""), input = useRef(null);
  const pick = async (f) => { if (!f) return; if (!/^image\//.test(f.type)) return flash("Choisis une image.", true); setDraft({ ...(await prepareImage(f)), fr: "", en: "", tags: [] }); };
  const upload = async () => {
    if (!draft.fr.trim()) return flash("Ajoute un titre.", true);
    setBusy("add");
    const r = await api("photo-add", { method: "POST", body: { image: draft.b64, title: { fr: draft.fr, en: draft.en }, tags: draft.tags, ratio: draft.ratio } });
    setBusy("");
    if (!r.ok) return flash(r.data.error === "too_large" ? "Image trop lourde." : "Échec de l’envoi.", true);
    flash("Photo ajoutée. Elle apparaîtra sur le site après la mise en ligne (≈ 1 min).");
    setDraft(null); reload();
  };
  const remove = async (key) => {
    if (busy && !busy.startsWith("confirm-")) return;
    if (busy !== "confirm-" + key) { setBusy("confirm-" + key); setTimeout(() => setBusy((b) => (b === "confirm-" + key ? "" : b)), 3000); return; }
    setBusy("del");
    const r = await api("photo-delete", { method: "POST", body: { key } });
    setBusy("");
    if (!r.ok) return flash("Échec de la suppression.", true);
    flash("Photo supprimée. Le site sera mis à jour dans ≈ 1 min."); reload();
  };
  const keys = Object.keys(photos);
  return (
    <div>
      <div className={"adm-drop" + (draft ? " has" : "")} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); pick(e.dataTransfer.files[0]); }}>
        {!draft ? (
          <button type="button" onClick={() => input.current.click()}><Icon name="download" size={22} /><b>Ajouter une photo</b><small>Glisse une image ici ou clique (elle sera optimisée automatiquement)</small></button>
        ) : (
          <div className="adm-draft">
            <img src={draft.preview} alt="" />
            <div>
              <label className="adm-field"><span>Titre (FR)</span><input value={draft.fr} onChange={(e) => setDraft({ ...draft, fr: e.target.value })} maxLength={120} /></label>
              <label className="adm-field"><span>Titre (EN)</span><input value={draft.en} onChange={(e) => setDraft({ ...draft, en: e.target.value })} maxLength={120} /></label>
              <div className="adm-chips">{PHOTO_TAGS.map(([k, l]) => <button type="button" key={k} className={draft.tags.includes(k) ? "on" : ""} onClick={() => setDraft({ ...draft, tags: draft.tags.includes(k) ? draft.tags.filter((t) => t !== k) : [...draft.tags, k] })}>{l}</button>)}</div>
              <small className="adm-muted">{draft.kb} Ko · format {draft.ratio > 1 ? "paysage" : "portrait"}</small>
              <div className="adm-row-btns"><button type="button" className="ios-btn adm-primary" onClick={upload} disabled={busy === "add"}>{busy === "add" ? "Envoi…" : "Publier la photo"}</button><button type="button" className="ios-btn adm-ghost" onClick={() => setDraft(null)}>Annuler</button></div>
            </div>
          </div>
        )}
        <input ref={input} type="file" accept="image/*" hidden onChange={(e) => pick(e.target.files[0])} />
      </div>
      <p className="adm-muted">{keys.length} photos. Titres et tags modifiables ci-dessous (bouton « Publier » en haut).</p>
      <div className="adm-pgrid">
        {keys.map((k) => {
          const v = photos[k], src = localPhoto(k);
          return (
            <div key={k} className="adm-pcard">
              <div className="adm-pimg">{src ? <img src={src} alt="" loading="lazy" /> : <span>{files.some((f) => f.startsWith(k + ".")) ? "Nouvelle (après mise en ligne)" : "—"}</span>}</div>
              <input value={v.title || ""} onChange={(e) => setPhotos({ ...photos, [k]: { ...v, title: e.target.value } })} aria-label="Titre FR" placeholder="Titre FR" />
              <input value={v.title_en || ""} onChange={(e) => setPhotos({ ...photos, [k]: { ...v, title_en: e.target.value } })} aria-label="Titre EN" placeholder="Titre EN" />
              <div className="adm-chips sm">{PHOTO_TAGS.map(([t, l]) => <button type="button" key={t} className={(v.tags || []).includes(t) ? "on" : ""} onClick={() => setPhotos({ ...photos, [k]: { ...v, tags: (v.tags || []).includes(t) ? v.tags.filter((x) => x !== t) : [...(v.tags || []), t] } })}>{l}</button>)}</div>
              <button type="button" className={"adm-del" + (busy === "confirm-" + k ? " confirm" : "")} onClick={() => remove(k)}>{busy === "confirm-" + k ? "Confirmer la suppression" : "Supprimer"}</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------- Tableau de bord ----------
export default function Admin() {
  const [state, setState] = useState("loading"); // loading | login | ready | error
  const [needCode, setNeedCode] = useState(false);
  const [data, setData] = useState(null); // { site, photos, siteSha, photosSha, files }
  const [orig, setOrig] = useState("");
  const [tab, setTab] = useState("profile");
  const [open, setOpen] = useState(0);
  const [msg, setMsg] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    document.title = "Admin · Portfolio";
    const m = document.createElement("meta"); m.name = "robots"; m.content = "noindex, nofollow"; document.head.appendChild(m);
    check();
    return () => m.remove();
  }, []);
  const flash = (text, err) => { setMsg({ text, err }); setTimeout(() => setMsg(null), 5000); };
  async function check() {
    const r = await api("session");
    if (r.status === 503 || (r.status === 404)) { setState("error"); return; }
    setNeedCode(!!r.data.needCode);
    if (r.data.authenticated) load(); else setState("login");
  }
  async function load() {
    setState("loading");
    const r = await api("data");
    if (r.status === 401) return setState("login");
    if (!r.ok) { setState("error"); return; }
    setData(r.data); setOrig(JSON.stringify([r.data.site, r.data.photos])); setState("ready");
  }
  const dirty = data && JSON.stringify([data.site, data.photos]) !== orig;
  useEffect(() => {
    const warn = (e) => { if (dirty) { e.preventDefault(); e.returnValue = ""; } };
    addEventListener("beforeunload", warn); return () => removeEventListener("beforeunload", warn);
  }, [dirty]);

  const save = async () => {
    setSaving(true);
    const r = await api("save", { method: "POST", body: { site: data.site, photos: data.photos, siteSha: data.siteSha, photosSha: data.photosSha } });
    setSaving(false);
    if (r.ok) { flash("Publié ! Le site sera à jour dans environ 1 minute."); load(); return; }
    if (r.status === 409) return flash("Le contenu a changé entre-temps. Recharge la page puis refais tes modifications.", true);
    if (r.status === 401) { setState("login"); return; }
    flash(r.data.detail ? `Refusé : ${r.data.detail}` : "Échec de la publication.", true);
  };
  const logout = async () => { await api("logout", { method: "POST" }); setData(null); setState("login"); };

  if (state === "loading") return <div className="adm-login"><div className="adm-spin" aria-label="Chargement" /></div>;
  if (state === "error") return <div className="adm-login"><div className="adm-login-card"><h1>Espace admin</h1><p>Indisponible. L’espace admin fonctionne une fois en ligne et configuré (voir README, section Admin).</p><a className="ios-btn adm-ghost" href="/">Retour au site</a></div></div>;
  if (state === "login") return <Login needCode={needCode} onDone={load} />;

  const sec = SECTIONS.find((s) => s.id === tab);
  const site = data.site;
  const setSite = (s) => setData({ ...data, site: s });
  const list = sec.kind === "list" ? site[sec.id] : null;
  const setItem = (i, item) => { const l = [...list]; l[i] = item; setSite({ ...site, [sec.id]: l }); };
  const move = (i, d) => { const l = [...list]; const j = i + d; if (j < 0 || j >= l.length) return; [l[i], l[j]] = [l[j], l[i]]; setSite({ ...site, [sec.id]: l }); setOpen(j); };

  return (
    <div className="adm">
      <aside className="adm-side">
        <div className="adm-brand"><span>A</span><b>Admin</b></div>
        <nav>{SECTIONS.map((s) => <button key={s.id} className={tab === s.id ? "on" : ""} onClick={() => { setTab(s.id); setOpen(0); }}><Icon name={s.icon} size={17} />{s.label}</button>)}</nav>
        <div className="adm-side-foot"><a href="/" target="_blank" rel="noopener">Voir le site ↗</a><button onClick={logout}>Se déconnecter</button></div>
      </aside>
      <main className="adm-main">
        <header className="adm-top">
          <h1>{sec.label}</h1>
          <span className={"adm-status" + (dirty ? " dirty" : "")}>{dirty ? "Modifications non publiées" : "À jour"}</span>
          <button className="ios-btn adm-primary" onClick={save} disabled={!dirty || saving}>{saving ? "Publication…" : "Publier"}</button>
        </header>
        {sec.note && <p className="adm-note">{sec.note}</p>}

        {sec.kind === "object" && (
          <div className="adm-card adm-grid2">
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
              <div key={i} className={"adm-card adm-item" + (open === i ? " open" : "")}>
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

        {sec.kind === "photos" && <Photos photos={data.photos} setPhotos={(p) => setData({ ...data, photos: p })} files={data.files} flash={flash} reload={load} />}
      </main>
      {msg && <div className={"adm-toast" + (msg.err ? " err" : "")} role="status">{msg.text}</div>}
    </div>
  );
}
