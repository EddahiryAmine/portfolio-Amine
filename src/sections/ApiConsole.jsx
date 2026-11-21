import { useMemo, useRef, useState } from "react";
import Icon from "../components/Icons.jsx";
import Reveal from "../components/Reveal.jsx";
import SplitTitle from "../components/SplitTitle.jsx";
import { CERTIFICATIONS, CERT_TOTAL, COMPANY, EDUCATION, EXPERIENCE, LANGUAGES, PROFILE, PROJECTS, ROLE } from "../data/content.js";
import { TECH, LVL_LABEL } from "../data/tech.js";
import { useT } from "../i18n/lang.jsx";

// Mini console d'API façon Postman. Les réponses sont générées dans le navigateur à partir des données du portfolio
// (aucune requête réseau) : c'est une démonstration de ce que je construis au quotidien.
function endpoints(p, lang) {
  const L = LVL_LABEL[lang];
  return [
    { m: "GET", path: "/api/v1/me", status: 200, body: () => ({
      name: PROFILE.name, role: ROLE, company: COMPANY, city: PROFILE.city, certified: "Oracle Certified Professional, Java SE 17",
      languages: LANGUAGES.map((l) => ({ code: l.code, level: p(l.label) })), openToFreelance: false,
    }) },
    { m: "GET", path: "/api/v1/experience", status: 200, body: () => EXPERIENCE.map((x) => ({ title: p(x.title), company: p(x.place), period: p(x.date), current: !!x.current, stack: x.tags })) },
    { m: "GET", path: "/api/v1/projects?kind=stage", status: 200, body: () => PROJECTS.filter((x) => x.kind === "stage").map((x) => ({ slug: x.slug, title: p(x.title), stack: x.tags, caseStudy: `#projet/${x.slug}` })) },
    { m: "GET", path: "/api/v1/skills?level=5", status: 200, body: () => ({ level: L[5], items: TECH.filter((x) => x.lvl === 5).map((x) => x.name) }) },
    { m: "GET", path: "/api/v1/certifications", status: 200, body: () => ({ total: CERT_TOTAL, featured: CERTIFICATIONS.slice(0, 3).map((c) => ({ title: p(c.title), issuer: c.issuer, date: p(c.year) })) }) },
    { m: "GET", path: "/api/v1/education", status: 200, body: () => EDUCATION.map((e) => ({ years: e.years, degree: p(e.title), school: e.place })) },
    { m: "GET", path: "/api/v1/contact", status: 200, body: () => ({ email: PROFILE.email, phone: PROFILE.phone, linkedin: PROFILE.linkedin, github: PROFILE.github }) },
    { m: "POST", path: "/api/v1/hire", status: 403, body: () => ({ error: "Forbidden", detail: lang === "en" ? "Insufficient privileges. Hint: some commands need sudo… (Ctrl+K)" : "Droits insuffisants. Indice : certaines commandes demandent sudo… (Ctrl+K)" }) },
    { m: "POST", path: "/api/v1/coffee", status: 418, body: () => ({ error: "I'm a teapot", detail: lang === "en" ? "Amine prefers mint tea. Ask him about it over email." : "Amine préfère le thé à la menthe. Propose-lui par email." }) },
  ];
}

const STATUS = { 200: "OK", 403: "Forbidden", 418: "I'm a teapot" };

// Coloration JSON : découpe le texte en jetons rendus comme des <span> (aucun HTML injecté).
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

export default function ApiConsole() {
  const { t, p, lang } = useT();
  const list = useMemo(() => endpoints(p, lang), [lang]);
  const [sel, setSel] = useState(0);
  const [res, setRes] = useState(null); // { status, ms, size, text }
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState("body");
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);
  const ep = list[sel];
  const curl = `curl -X ${ep.m} http://localhost:5000${ep.path} -H "Accept: application/json"`;

  const send = () => {
    if (busy) return;
    setBusy(true); setRes(null);
    const ms = 38 + Math.round(Math.random() * 90);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const text = JSON.stringify(ep.body(), null, 2);
      setRes({ status: ep.status, ms, size: new Blob([text]).size, text });
      setBusy(false);
    }, ms * 4);
  };
  const copy = async () => { try { await navigator.clipboard.writeText(curl); } catch { /* indisponible */ } setCopied(true); setTimeout(() => setCopied(false), 1400); };

  return (
    <section id="api" style={{ paddingTop: 0 }}>
      <div className="wrap api">
        <Reveal className="api-l">
          <SplitTitle>{t("api.title")}</SplitTitle>
          <p className="lead">{t("api.lead")}</p>
          <ul className="api-eps" aria-label={t("api.endpoints")}>
            {list.map((e, i) => (
              <li key={e.path}>
                <button aria-pressed={sel === i} className={sel === i ? "on" : ""} onClick={() => { setSel(i); setRes(null); }}>
                  <span className={"verb v-" + e.m.toLowerCase()}>{e.m}</span><code>{e.path}</code>
                </button>
              </li>
            ))}
          </ul>
          <p className="api-note"><Icon name="spark" size={14} />{t("api.note")}</p>
        </Reveal>

        <Reveal delay={0.1} className="pm-win">
          <div className="pm-bar">
            <span className={"verb v-" + ep.m.toLowerCase()}>{ep.m}</span>
            <code className="pm-url"><span>http://localhost:5000</span>{ep.path}</code>
            <button className="pm-send" onClick={send} disabled={busy}><Icon name="send" size={15} />{busy ? t("api.sending") : t("api.send")}</button>
          </div>
          <div className="pm-curl"><code>{curl}</code><button onClick={copy} aria-label={t("ui.copy")}>{copied ? "✓" : <Icon name="copy" size={14} />}</button></div>
          <div className="pm-resp">
            <div className="pm-tabs">
              <button className={tab === "body" ? "on" : ""} onClick={() => setTab("body")}>Body</button>
              <button className={tab === "headers" ? "on" : ""} onClick={() => setTab("headers")}>Headers</button>
              {res && <span className={"pm-status " + (res.status < 400 ? "st-ok" : "st-warn")}>{res.status} {STATUS[res.status]} · {res.ms} ms · {res.size} B</span>}
            </div>
            {busy && <div className="pm-load" aria-label={t("api.sending")}><i /></div>}
            {!busy && !res && <p className="pm-empty">{t("api.empty")}</p>}
            {res && tab === "body" && <pre className="pm-json" key={res.ms}><Json text={res.text} /></pre>}
            {res && tab === "headers" && (
              <pre className="pm-json"><code>{`HTTP/1.1 ${res.status} ${STATUS[res.status]}\ncontent-type: application/json; charset=utf-8\ncontent-length: ${res.size}\nx-powered-by: ASP.NET Core\nx-response-time: ${res.ms}ms\ncache-control: no-store`}</code></pre>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
