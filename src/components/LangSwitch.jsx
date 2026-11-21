import { useT } from "../i18n/lang.jsx";

// Sélecteur FR / EN : pastille qui glisse sous la langue active.
export default function LangSwitch({ className = "" }) {
  const { lang, setLang, t } = useT();
  return (
    <div className={"lsw " + className + (lang === "en" ? " is-en" : "")} role="group" aria-label={t("ui.langLabel")}>
      <span className="lsw-ind" aria-hidden="true" />
      <button onClick={() => setLang("fr")} aria-pressed={lang === "fr"} lang="fr" title="Français">FR</button>
      <button onClick={() => setLang("en")} aria-pressed={lang === "en"} lang="en" title="English">EN</button>
    </div>
  );
}
