import Icon from "../components/Icons.jsx";
import Reveal from "../components/Reveal.jsx";
import SplitTitle from "../components/SplitTitle.jsx";
import { CERTIFICATIONS, CERT_TOTAL, PROFILE } from "../data/content.js";
import { useT } from "../i18n/lang.jsx";

// Badges colorés (monogrammes). Pour de vrais logos, place des images dans src/assets/ et remplace <span className="badge">.
const tilt = (e) => {
  if (e.pointerType === "touch") return;
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--rx", ((e.clientY - r.top) / r.height - 0.5) * -6 + "deg");
  e.currentTarget.style.setProperty("--ry", ((e.clientX - r.left) / r.width - 0.5) * 6 + "deg");
  e.currentTarget.style.setProperty("--gx", e.clientX - r.left + "px");
  e.currentTarget.style.setProperty("--gy", e.clientY - r.top + "px");
};
const untilt = (e) => { e.currentTarget.style.setProperty("--rx", "0deg"); e.currentTarget.style.setProperty("--ry", "0deg"); };

export default function Certifications() {
  const { t, p } = useT();
  return (
    <section id="certifs" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <SplitTitle>Certifications</SplitTitle>
        <div className="certs">
          {CERTIFICATIONS.map((c, i) => (
            <Reveal key={c.mono + i} delay={i * 0.06} className={"cert" + (c.featured ? " feat" : "")} style={{ "--c": c.color }} onPointerMove={tilt} onPointerLeave={untilt}>
              <span className="badge">{c.mono}<em><Icon name="award" size={14} /></em></span>
              <div className="ct">
                <small>{p(c.kind)} · {p(c.year)}</small>
                <h3>{p(c.title)}</h3>
                <span>{c.issuer}{c.id && <code> · ID {c.id}</code>}</span>
              </div>
              {c.featured && <span className="verified">{t("certs.verified")}</span>}
              <a className="cert-proof" href={PROFILE.linkedinCerts} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}><Icon name="linkedin" size={14} />{t("certs.proof")} ↗</a>
            </Reveal>
          ))}
          <Reveal delay={0.4}>
            <a className="cert more" href={PROFILE.linkedinCerts} target="_blank" rel="noopener noreferrer">
              <b>{CERT_TOTAL}</b>
              <span>{t("certs.all")}</span>
              <Icon name="arrow" size={20} />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
