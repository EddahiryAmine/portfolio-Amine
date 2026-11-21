import { useT } from "../i18n/lang.jsx";

// Interrupteur Pro / Perso : déclenche la transition entre les deux univers.
export default function ModeSwitch({ perso, onSwitch }) {
  const { lang, t } = useT();
  return (
    <button className={"mode" + (perso ? " is-perso" : "")} onClick={onSwitch} aria-label={perso ? t("ui.toPro") : t("ui.toPerso")}>
      <span>Pro</span>
      <i aria-hidden="true" />
      <span>{lang === "en" ? "Personal" : "Perso"}</span>
    </button>
  );
}
