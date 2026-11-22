import Icon from "../components/Icons.jsx";
import Reveal from "../components/Reveal.jsx";
import SplitTitle from "../components/SplitTitle.jsx";
import { TESTIMONIALS } from "../data/testimonials.js";
import { useT } from "../i18n/lang.jsx";

// Une carte d'avis (réutilisée sur la page #avis).
export function ReviewCard({ q }) {
  const { t, p } = useT();
  const initials = q.name.split(" ").map((w) => w[0]).slice(0, 2).join("");
  return (
    <figure className="rv-card">
      <span className="rv-stars" aria-label={`${q.rating || 5}/5`}>{"★★★★★".slice(0, q.rating || 5)}<i>{"★★★★★".slice(q.rating || 5)}</i></span>
      <blockquote>{p(q.quote)}</blockquote>
      <figcaption>
        <span className="rv-av">{initials}</span>
        <span><b>{q.name}</b><small>{p(q.role)}</small></span>
        {q.relation && <em>{t("fb.rel." + q.relation)}</em>}
        {q.linkedin && <a href={q.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Icon name="linkedin" size={16} /></a>}
      </figcaption>
    </figure>
  );
}

// Section d'accueil : défilé d'avis s'il y en a, sinon une invitation à en laisser un.
export default function Testimonials() {
  const { t } = useT();
  const n = TESTIMONIALS.length;
  return (
    <section id="recos" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <SplitTitle>{t("reco.title")}</SplitTitle>
      </div>
      {n > 0 ? (
        <div className="rv-marquee" aria-label={t("reco.title")}>
          <div className="rv-track">{[...TESTIMONIALS, ...TESTIMONIALS].map((q, i) => <ReviewCard key={i} q={q} />)}</div>
        </div>
      ) : null}
      <div className="wrap">
        <Reveal className={"rv-invite" + (n ? " small" : "")}>
          <span className="rv-bubbles" aria-hidden="true"><i>💬</i><i>⭐</i><i>🤝</i></span>
          <span className="rv-invite-t">
            <b>{t("reco.inviteT")}</b>
            <small>{t("reco.invite")}</small>
          </span>
          <a className="ios-btn primary" href="#avis">{t("reco.cta")}<Icon name="arrow" size={15} /></a>
        </Reveal>
      </div>
    </section>
  );
}
