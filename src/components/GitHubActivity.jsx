import Icon from "./Icons.jsx";
import Reveal from "./Reveal.jsx";
import GH from "../data/github.json";
import { PROFILE, PROJECTS } from "../data/content.js";
import { useT } from "../i18n/lang.jsx";

// Activité GitHub, générée au build par scripts/github-data.mjs (aucune requête depuis le navigateur).
// Le calendrier n'apparaît que s'il y a assez d'activité publique : mon code pro vit sur Azure DevOps (privé).
const LANG_COLORS = { JavaScript: "#F1E05A", TypeScript: "#3178C6", "C#": "#9B4F96", Java: "#E76F00", PHP: "#777BB4", Python: "#3572A5", Kotlin: "#A97BFF", Dart: "#00B4AB" };
const MIN_CALENDAR = 60;

export default function GitHubActivity() {
  const { t, p, lang } = useT();
  const featured = PROJECTS.filter((x) => x.repo);
  const showCal = GH.days?.length && GH.contributions >= MIN_CALENDAR;
  const weeks = [];
  if (showCal) for (let i = 0; i < GH.days.length; i += 7) weeks.push(GH.days.slice(i, i + 7));
  const fmt = new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "fr-FR", { day: "numeric", month: "long", year: "numeric" });

  return (
    <Reveal className="gh">
      <div className="gh-head">
        <span className="gh-id"><Icon name="github" size={22} /><b>@{GH.user || PROFILE.githubHandle}</b></span>
        <span className="gh-stats">
          <span><b>{GH.repos}</b> {t("gh.repos")}</span>
          {showCal ? <span><b>{GH.contributions}</b> {t("gh.contrib")}</span> : null}
        </span>
      </div>

      {GH.languages?.length > 0 && (
        <div className="gh-langs">
          <small>{t("gh.langs")}</small>
          <div className="gh-bar">{GH.languages.map((l) => <i key={l.name} style={{ flexGrow: l.pct, background: LANG_COLORS[l.name] || "#8B949E" }} title={`${l.name} ${l.pct}%`} />)}</div>
          <ul>{GH.languages.map((l) => <li key={l.name}><i style={{ background: LANG_COLORS[l.name] || "#8B949E" }} />{l.name} <span>{l.pct}%</span></li>)}</ul>
        </div>
      )}

      {showCal ? (
        <div className="gh-cal" aria-label={t("gh.calendar")}>
          {weeks.map((w, i) => <span key={i}>{w.map((d) => <i key={d.date} className={"l" + d.level} title={`${d.count} · ${d.date}`} />)}</span>)}
        </div>
      ) : (
        <p className="gh-note">{t("gh.private")}</p>
      )}

      <div className="gh-repos">
        {featured.map((x) => (
          <a key={x.slug} href={x.repo} target="_blank" rel="noopener noreferrer">
            <Icon name="folder" size={16} /><b>{x.repo.split("/").pop()}</b><span>{p(x.title)}</span><Icon name="arrow" size={14} />
          </a>
        ))}
      </div>
      <div className="gh-foot">
        {GH.updated && <small>{t("gh.updated", { d: fmt.format(new Date(GH.updated)) })}</small>}
        <a href={PROFILE.github} target="_blank" rel="noopener noreferrer">{t("proj.all")} ↗</a>
      </div>
    </Reveal>
  );
}
