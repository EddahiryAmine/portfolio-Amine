import Clock from "../components/Clock.jsx";
import Count from "../components/Count.jsx";
import Reveal from "../components/Reveal.jsx";
import SpotifyEmbed from "../components/SpotifyEmbed.jsx";
import { CERT_TOTAL, LANGUAGES } from "../data/content.js";
import { useT } from "../i18n/lang.jsx";
import { useInView } from "../hooks/useInView.js";
import about1 from "../assets/about-1.webp";
import about2 from "../assets/about-2.webp";

// Tuile Langues : jauges circulaires qui se remplissent à l'apparition.
function Languages() {
  const { t, p } = useT();
  const [ref, seen] = useInView(0.3);
  return (
    <div className={"b b-lang" + (seen ? " in" : "")} ref={ref}>
      <small className="b-lab">{t("about.langs")}</small>
      <div className="langs">
        {LANGUAGES.map((l, i) => (
          <div className="lang" key={l.code} style={{ "--v": l.level, "--d": i * 0.15 + "s" }}>
            <span className="ring-g" aria-hidden="true">
              <svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="19" /><circle className="fill" cx="22" cy="22" r="19" pathLength="100" /></svg>
              <b lang={l.code}>{l.code.toUpperCase()}</b>
            </span>
            <span className="lang-t">
              <strong>{p(l.name)}</strong>
              <em lang={l.code}>{l.native}</em>
              <small>{p(l.label)}</small>
            </span>
          </div>
        ))}
      </div>
      <p className="lang-sub">{t("about.langsSub")}</p>
    </div>
  );
}

// "Bento" façon iOS : des tuiles de tailles différentes, 100 % côté pro.
export default function About() {
  const { t } = useT();
  return (
    <section id="about">
      <div className="wrap">
        <Reveal className="bento">
          <div className="b b-text">
            <p className="about">
              {t("about.lead")}{" "}
              <em>{t("about.leadEm")}</em>
            </p>
          </div>
          <div className="b b-photo"><img src={about1} alt={t("about.photoAlt")} loading="lazy" /><span>{t("about.photoCap")}</span></div>
          <div className="b b-stat"><b><Count to={4} /></b><small>{t("about.exp")}</small></div>
          <div className="b b-cert"><b>Java SE 17</b><small>{t("about.certPro")}</small></div>
          <div className="b b-clock"><small>Casablanca</small><b><Clock /></b><span className="live"><i />{t("about.live")}</span></div>
          <div className="b b-pres"><img src={about2} alt={t("about.presAlt")} loading="lazy" /><span>{t("about.pres")}</span></div>
          <div className="b b-stat2"><b><Count to={CERT_TOTAL} /></b><small>{t("about.certs")}</small></div>
          <div className="b b-music">
            <small className="b-lab">{t("about.music")}</small>
            <SpotifyEmbed height={80} compact />
            <p>{t("about.musicTxt")}</p>
          </div>
          <Languages />
        </Reveal>
      </div>
    </section>
  );
}
