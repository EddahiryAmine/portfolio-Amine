import { useMemo, useRef, useState } from "react";
import Icon from "../components/Icons.jsx";
import Reveal from "../components/Reveal.jsx";
import SplitTitle from "../components/SplitTitle.jsx";
import { CERTIFICATIONS, CERT_TOTAL, COMPANY, EDUCATION, EXPERIENCE, LANGUAGES, PROFILE, PROJECTS, ROLE } from "../data/content.js";
import { TECH, LVL_LABEL } from "../data/tech.js";
import { useT } from "../i18n/lang.jsx";

// « API live » : deux vues au choix, Postman (collection) ou Swagger UI (documentation interactive).
// Les réponses sont générées dans le navigateur à partir des données du portfolio : aucune requête réseau.
const HOST = "http://localhost:5000";
const STATUS = { 200: "OK", 403: "Forbidden", 418: "I'm a teapot" };

function endpoints(p, lang) {
  const L = LVL_LABEL[lang], fr = lang !== "en";
  const E = (group, m, path, status, name, human, body) => ({ group, m, path, status, name, human, body });
  return [
    E("profil", "GET", "/api/v1/me", 200, fr ? "Qui est Amine ?" : "Who is Amine?",
      fr ? "Amine est Software Engineer chez Capgemini à Casablanca, certifié Oracle Java SE 17." : "Amine is a Software Engineer at Capgemini in Casablanca, Oracle Certified Java SE 17.",
      () => ({ name: PROFILE.name, role: ROLE, company: COMPANY, city: PROFILE.city, certified: "Oracle Certified Professional, Java SE 17", languages: LANGUAGES.map((l) => ({ code: l.code, level: p(l.label) })), openToFreelance: false })),
    E("profil", "GET", "/api/v1/contact", 200, fr ? "Comment le contacter ?" : "How to contact him?",
      fr ? "Par email, téléphone / WhatsApp, LinkedIn ou GitHub." : "By email, phone / WhatsApp, LinkedIn or GitHub.",
      () => ({ email: PROFILE.email, phone: PROFILE.phone, linkedin: PROFILE.linkedin, github: PROFILE.github })),
    E("parcours", "GET", "/api/v1/experience", 200, fr ? "Son parcours pro" : "His career",
      fr ? `${EXPERIENCE.length} expériences, de BS-Link (2024) à Capgemini (aujourd’hui).` : `${EXPERIENCE.length} experiences, from BS-Link (2024) to Capgemini (today).`,
      () => EXPERIENCE.map((x) => ({ title: p(x.title), company: x.company, period: p(x.date), current: !!x.current, stack: x.tags }))),
    E("parcours", "GET", "/api/v1/education", 200, fr ? "Ses études" : "His education",
      fr ? "Ingénieur MIAGE (EMSI), technicien spécialisé (ISFO), bac sciences physiques." : "MIAGE engineer (EMSI), specialized technician (ISFO), physics baccalaureate.",
      () => EDUCATION.map((e) => ({ years: e.years, degree: p(e.title), school: e.place }))),
    E("projets", "GET", "/api/v1/projects?kind=stage", 200, fr ? "Projets de stage" : "Internship projects",
      fr ? "2 projets réalisés en entreprise (EQDOM et BS-Link)." : "2 projects built in companies (EQDOM and BS-Link).",
      () => PROJECTS.filter((x) => x.kind === "stage").map((x) => ({ slug: x.slug, title: p(x.title), stack: x.tags }))),
    E("projets", "GET", "/api/v1/skills?level=5", 200, fr ? "Ce qu’il utilise chaque jour" : "What he uses daily",
      fr ? "Les technologies utilisées au quotidien chez Capgemini." : "The technologies used daily at Capgemini.",
      () => ({ level: L[5], items: TECH.filter((x) => x.lvl === 5).map((x) => x.name) })),
    E("projets", "GET", "/api/v1/certifications", 200, fr ? "Ses certifications" : "His certifications",
      fr ? `${CERT_TOTAL} certifications, dont Oracle Java SE 17.` : `${CERT_TOTAL} certifications, including Oracle Java SE 17.`,
      () => ({ total: CERT_TOTAL, featured: CERTIFICATIONS.slice(0, 3).map((c) => ({ title: p(c.title), issuer: c.issuer, date: p(c.year) })) })),
    E("fun", "POST", "/api/v1/hire", 403, fr ? "Recruter Amine" : "Hire Amine",
      fr ? "Accès refusé… sauf avec la bonne commande. Indice : sudo (Ctrl+K)." : "Access denied… unless you know the right command. Hint: sudo (Ctrl+K).",
      () => ({ error: "Forbidden", detail: fr ? "Droits insuffisants. Indice : certaines commandes demandent sudo… (Ctrl+K)" : "Insufficient privileges. Hint: some commands need sudo… (Ctrl+K)" })),
    E("fun", "POST", "/api/v1/coffee", 418, fr ? "Lui offrir un café" : "Buy him a coffee",
      fr ? "Code 418 « Je suis une théière » : un clin d’œil des développeurs. Le café, ce sera pour l’entretien." : "Code 418 “I’m a teapot”: a developer in-joke. Coffee will be for the interview.",
      () => ({ error: "I'm a teapot", detail: fr ? "Le café, ce sera pour l’entretien." : "Coffee will be for the interview." })),
  ];
}

// Coloration JSON (jetons rendus en <span>, aucun HTML injecté).
function Json({ text }) {
  const parts = [];
  const re = /("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false|null)\b|(-?\d+(?:\.\d+)?)/g;
  let last = 0, m, k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1]) parts.push(<span key={k++} className={m[2] ? "j-key" : "j-str"}>{m[1]}</span>, m[2] || "");
    else if (m[3]) parts.push(<span key={k++} className="j-bool">{m[3]}</span>);
    else parts.push(<span key={k++} className="j-num">{m[4]}</span>);
    last = re.lastIndex;
  }
  parts.push(text.slice(last));
  return <code>{parts}</code>;
}

// Appel simulé avec une latence réaliste.
function useCall() {
  const [res, setRes] = useState(null), [busy, setBusy] = useState(false), timer = useRef(0);
  const run = (ep) => {
    setBusy(true); setRes(null); clearTimeout(timer.current);
    const ms = 38 + Math.round(Math.random() * 90);
    timer.current = setTimeout(() => { const text = JSON.stringify(ep.body(), null, 2); setRes({ ep, status: ep.status, ms, size: new Blob([text]).size, text }); setBusy(false); }, ms * 4);
  };
  return { res, busy, run, reset: () => setRes(null) };
}

function Postman({ list }) {
  const { t } = useT();
  const [sel, setSel] = useState(0);
  const [tab, setTab] = useState("body");
  const { res, busy, run, reset } = useCall();
  const ep = list[sel];
  const groups = [...new Set(list.map((e) => e.group))];
  return (
    <div className="pmx">
      <div className="pmx-top"><span className="pmx-logo" aria-hidden="true" /><b>Postman</b><span className="pmx-ws">{t("api.workspace")}</span></div>
      <div className="pmx-body">
        <aside className="pmx-side" aria-label={t("api.collection")}>
          <small>{t("api.collections")}</small>
          <div className="pmx-col"><Icon name="folder" size={14} /><b>Amine API</b></div>
          {groups.map((g) => (
            <div key={g} className="pmx-group">
              <span className="pmx-folder">{t("api.g." + g)}</span>
              {list.map((e, i) => e.group === g && (
                <button key={e.path} className={"pmx-req" + (i === sel ? " on" : "")} onClick={() => { setSel(i); reset(); }}>
                  <span className={"vb v-" + e.m.toLowerCase()}>{e.m}</span><span>{e.name}</span>
                </button>
              ))}
            </div>
          ))}
        </aside>
        <div className="pmx-main">
          <div className="pmx-tab"><span className={"vb v-" + ep.m.toLowerCase()}>{ep.m}</span>{ep.name}</div>
          <div className="pmx-url">
            <span className={"pmx-method v-" + ep.m.toLowerCase()}>{ep.m}</span>
            <code><span>{HOST}</span>{ep.path}</code>
            <button className="pmx-send" onClick={() => run(ep)} disabled={busy}>{busy ? t("api.sending") : t("api.send")}<Icon name="send" size={14} /></button>
          </div>
          <div className="pmx-sub"><span className="on">Params</span><span>Authorization</span><span>Headers (2)</span><span>Body</span></div>
          <div className="pmx-res">
            <div className="pmx-res-bar">
              <b>{t("api.response")}</b>
              {res && <span className={"pmx-status " + (res.status < 400 ? "ok" : "warn")}>{res.status} {STATUS[res.status]}</span>}
              {res && <span className="pmx-meta">{res.ms} ms · {res.size} B</span>}
            </div>
            {busy && <div className="pm-load"><i /></div>}
            {!busy && !res && <div className="pmx-empty"><span>👆</span>{t("api.empty")}</div>}
            {res && (
              <>
                <p className="pmx-human"><b>{t("api.plain")}</b> {res.ep.human}</p>
                <div className="pmx-tabs2">
                  <button className={tab === "body" ? "on" : ""} onClick={() => setTab("body")}>Pretty</button>
                  <button className={tab === "headers" ? "on" : ""} onClick={() => setTab("headers")}>Headers</button>
                </div>
                <pre className="pm-json" key={res.ms}>{tab === "body" ? <Json text={res.text} /> : <code>{`content-type: application/json; charset=utf-8\ncontent-length: ${res.size}\nx-powered-by: ASP.NET Core\nx-response-time: ${res.ms}ms`}</code>}</pre>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Swagger({ list }) {
  const { t } = useT();
  const [open, setOpen] = useState(0);
  const [tried, setTried] = useState({});
  const { res, busy, run } = useCall();
  const groups = [...new Set(list.map((e) => e.group))];
  return (
    <div className="swx">
      <div className="swx-top"><span className="swx-logo" aria-hidden="true">{"{ }"}</span><b>Swagger</b><small>supported by SMARTBEAR</small></div>
      <div className="swx-info">
        <h3>Amine API <span className="swx-ver">1.0.0</span><span className="swx-oas">OAS 3.0</span></h3>
        <p>{t("api.swDesc")}</p>
        <label className="swx-server">Servers <select aria-label="Server" defaultValue={HOST}><option>{HOST}</option></select></label>
      </div>
      {groups.map((g) => (
        <div key={g} className="swx-tag">
          <h4>{t("api.g." + g)}</h4>
          {list.map((e, i) => e.group === g && (
            <div key={e.path} className={"swx-op m-" + e.m.toLowerCase() + (open === i ? " open" : "")}>
              <button className="swx-sum" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
                <span className="swx-m">{e.m}</span><code>{e.path}</code><span className="swx-s">{e.name}</span><span className="swx-chev">⌄</span>
              </button>
              {open === i && (
                <div className="swx-det">
                  <div className="swx-row"><b>Parameters</b>
                    {!tried[i] ? <button className="swx-try" onClick={() => setTried({ ...tried, [i]: true })}>Try it out</button>
                      : <button className="swx-cancel" onClick={() => setTried({ ...tried, [i]: false })}>Cancel</button>}
                  </div>
                  <p className="swx-np">{e.path.includes("?") ? e.path.split("?")[1] : "No parameters"}</p>
                  {tried[i] && <button className="swx-exec" onClick={() => run(e)} disabled={busy}>{busy ? "…" : "Execute"}</button>}
                  {tried[i] && res && res.ep === e && (
                    <div className="swx-out">
                      <b>Curl</b><pre><code>{`curl -X '${e.m}' '${HOST}${e.path}' -H 'accept: application/json'`}</code></pre>
                      <b>Server response</b>
                      <div className="swx-code"><span>Code</span><span>Details</span></div>
                      <div className="swx-code"><span className={res.status < 400 ? "c-ok" : "c-err"}>{res.status}</span>
                        <div><small>Response body</small><pre className="pm-json"><Json text={res.text} /></pre><p className="pmx-human"><b>{t("api.plain")}</b> {e.human}</p></div></div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function ApiConsole() {
  const { t, p, lang } = useT();
  const list = useMemo(() => endpoints(p, lang), [lang]);
  const [view, setView] = useState("postman");
  return (
    <section id="api" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <Reveal className="api-head">
          <SplitTitle>{t("api.title")}</SplitTitle>
          <p className="lead">{t("api.lead")}</p>
          <ol className="api-steps">
            <li><span>1</span>{t("api.s1")}</li><li><span>2</span>{t("api.s2")}</li><li><span>3</span>{t("api.s3")}</li>
          </ol>
          <div className="p-filter api-switch" role="tablist" aria-label={t("api.view")}>
            <button role="tab" aria-selected={view === "postman"} className={view === "postman" ? "on" : ""} onClick={() => setView("postman")}><span className="dot pm" />Postman</button>
            <button role="tab" aria-selected={view === "swagger"} className={view === "swagger" ? "on" : ""} onClick={() => setView("swagger")}><span className="dot sw" />Swagger</button>
          </div>
        </Reveal>
        <Reveal delay={0.08} key={view}>{view === "postman" ? <Postman list={list} /> : <Swagger list={list} />}</Reveal>
        <p className="api-note"><Icon name="spark" size={14} />{t("api.note")}</p>
      </div>
    </section>
  );
}
