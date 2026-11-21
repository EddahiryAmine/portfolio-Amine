import Icon from "./Icons.jsx";
import { useT } from "../i18n/lang.jsx";

export default function ThemeToggle({ theme, onToggle }) {
  const { t } = useT();
  return (
    <button className="tt" onClick={onToggle} aria-label={theme === "dark" ? t("ui.themeToLight") : t("ui.themeToDark")}>
      <span className="ti sun"><Icon name="sun" size={18} /></span>
      <span className="ti moon"><Icon name="moon" size={18} /></span>
    </button>
  );
}
