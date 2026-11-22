import Icon from "../components/Icons.jsx";
import Reveal from "../components/Reveal.jsx";
import SplitTitle from "../components/SplitTitle.jsx";
import { useT } from "../i18n/lang.jsx";

// « Ma façon de travailler » : widgets façon iOS (veille, valeurs, vie perso). Textes : strings.js, clé how.*
export default function Approach({ onSwitch }) {
  const { t } = useT();
  const watch = [".NET 9", "Microservices", "Cloud", "Docker & Kubernetes", "DevSecOps", "Clean Architecture"];
  return (
    <section id="approche" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <SplitTitle>{t("how.title")}</SplitTitle>
        <p className="lead">{t("how.lead")}</p>
        <Reveal className="how">
          <article className="hw hw-watch">
            <span className="hw-ico g4"><Icon name="search" size={20} /></span>
            <h3>{t("how.watchT")}</h3>
            <div className="hw-tags">{watch.map((x) => <span key={x}>{x}</span>)}</div>
          </article>
          <article className="hw hw-values">
            <span className="hw-ico g5"><Icon name="award" size={20} /></span>
            <h3>{t("how.valuesT")}</h3>
            <ul>{t("how.values").map((v) => <li key={v}>{v}</li>)}</ul>
          </article>
          <article className="hw hw-life">
            <span className="hw-ico g6"><Icon name="frame" size={20} /></span>
            <h3>{t("how.lifeT")}</h3>
            <p>{t("how.life")}</p>
            <button className="hw-link" onClick={onSwitch}>{t("how.lifeCta")} <Icon name="arrow" size={14} /></button>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
