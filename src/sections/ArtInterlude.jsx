import ParticleArt from "../components/ParticleArt.jsx";
import { useT } from "../i18n/lang.jsx";

// Interlude artistique entre deux sections : le code comme matière.
export default function ArtInterlude() {
  const { t } = useT();
  return (
    <section className="art-int" aria-label={t("art.label")}>
      <div className="art-meta wrap">
        <span>{t("art.n")}</span>
        <span>{t("art.tech")}</span>
      </div>
      <ParticleArt sub={t("art.sub")} label={t("art.aria", { w: "Amine" })} />
      <p className="art-hint wrap"><b>{t("art.hint1")}</b> {t("art.hint2")} · <b>{t("art.hint3")}</b> {t("art.hint4")} · {t("art.hint5")}</p>
    </section>
  );
}
