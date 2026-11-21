import { useRef, useState } from "react";
import Icon from "../components/Icons.jsx";
import ColorArt from "../components/ColorArt.jsx";
import Exhibition from "../components/Exhibition.jsx";
import LangSwitch from "../components/LangSwitch.jsx";
import Lightbox from "../components/Lightbox.jsx";
import Marquee from "../components/Marquee.jsx";
import ModeSwitch from "../components/ModeSwitch.jsx";
import SpotifyEmbed from "../components/SpotifyEmbed.jsx";
import Tile from "../components/Tile.jsx";
import { PHOTOS, TAG_LABELS } from "../data/photos.js";
import { PROFILE, SPOTIFY } from "../data/content.js";
import { useT } from "../i18n/lang.jsx";
import me1 from "../assets/perso-1.webp";
import me2 from "../assets/perso-2.webp";
import me3 from "../assets/perso-3.webp";

export default function Photography({ onSwitch }) {
  const { t, p, lang } = useT();
  const TITLE = lang === "en" ? "Photography" : "Photographie";
  const FILTERS = [["all", t("perso.all")], ...Object.entries(TAG_LABELS)];
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState("grid"); // "grid" | "expo"
  const [lb, setLb] = useState(null); // { list, i }
  const root = useRef(null);
  const shown = filter === "all" ? PHOTOS : PHOTOS.filter((ph) => ph.tags.includes(filter));
  const track = (e) => { root.current.style.setProperty("--mx", e.clientX + "px"); root.current.style.setProperty("--my", e.clientY + "px"); };
  const toSound = () => {
    document.getElementById("bande-son")?.scrollIntoView({ behavior: "smooth", block: "center" });
    document.querySelector("#bande-son .sp-facade")?.click(); // démarre la chanson
  };

  return (
    <div className="perso" ref={root} onPointerMove={track}>
      <div className="spot" /><div className="grain" />
      <button className="island" onClick={toSound} aria-label={t("perso.soundA", { x: SPOTIFY.title })}>
        <span className="iv" /><span className="it">{SPOTIFY.title}</span><span className="ieq" aria-hidden="true"><i /><i /><i /><i /></span>
      </button>

      <div className="pbar">
        <a className="lg" href="#" onClick={(e) => { e.preventDefault(); onSwitch(e); }}>Amine</a>
        <div className="pbar-r">
          <LangSwitch />
          <ModeSwitch perso onSwitch={onSwitch} />
        </div>
      </div>

      <section className="phero wrap">
        <p className="code">{"// perso.jsx"}</p>
        <h1 aria-label={TITLE} key={TITLE}>{[...TITLE].map((ch, i) => <span key={i} style={{ "--i": i }} aria-hidden="true">{ch}</span>)}</h1>
        <div className="phero-grid">
          <div>
            <p className="lede">{t("perso.lede")}</p>
            <div className="sound" id="bande-son">
              <small>{t("perso.sound")}</small>
              <SpotifyEmbed height={152} />
            </div>
            <a className="insta" href={PROFILE.instagram} target="_blank" rel="noopener noreferrer">
              <span className="ring"><Icon name="insta" size={22} /></span>
              <span><b>{PROFILE.handle}</b><small>{t("perso.insta")}</small></span>
              <Icon name="arrow" size={18} />
            </a>
          </div>
          <div className="stack">
            <div className="s1">
              <img src={me1} alt={t("perso.alt1")} />
              <span className="focus" aria-hidden="true" />
            </div>
            <img className="s2" src={me2} alt={t("perso.alt2")} loading="lazy" />
            <img className="s3" src={me3} alt={t("perso.alt3")} loading="lazy" />
          </div>
        </div>
      </section>

      <Marquee key={lang} className="pm" speed={0.6} text={t("perso.marquee")} />
      <Marquee className="film" speed={0.9} dir={-1}>
        <span className="strip">{PHOTOS.map((ph) => <img key={ph.key} src={ph.src} alt="" loading="lazy" />)}</span>
      </Marquee>

      <section className="wrap gal-sec">
        <div className="gal-head">
          <h2>{t("perso.photos")}</h2>
          <div className="gal-r">
            <span className="count">{t("perso.images", { n: shown.length })}</span>
            <div className="viewsw" role="tablist" aria-label={t("perso.view")}>
              <button role="tab" aria-selected={view === "grid"} className={view === "grid" ? "on" : ""} onClick={() => setView("grid")}><Icon name="grid" size={16} />{t("perso.grid")}</button>
              <button role="tab" aria-selected={view === "expo"} className={view === "expo" ? "on" : ""} onClick={() => setView("expo")}><Icon name="frame" size={16} />{t("perso.expo")}</button>
            </div>
          </div>
        </div>
        <div className="chips" role="tablist" aria-label={t("perso.filter")}>
          {FILTERS.map(([k, label]) => <button key={k} role="tab" aria-selected={filter === k} className={filter === k ? "on" : ""} onClick={() => setFilter(k)}>{p(label)}</button>)}
        </div>
        {view === "grid" ? (
          <div className="gal" key={filter}>
            {shown.map((ph, i) => <Tile key={ph.key} photo={ph} index={i} onOpen={() => setLb({ list: shown, i })} />)}
          </div>
        ) : null}
      </section>
      {view === "expo" && <Exhibition key={filter} photos={shown} onOpen={(i) => setLb({ list: shown, i })} />}

      <ColorArt photos={PHOTOS} onOpen={(i) => setLb({ list: PHOTOS, i })} />

      <footer className="pfoot">
        <span>Amine Eddahiry · Casablanca · <a href={PROFILE.instagram} target="_blank" rel="noopener noreferrer">{PROFILE.handle}</a></span>
        <button onClick={onSwitch}>{t("perso.back")}</button>
      </footer>

      {lb && <Lightbox photos={lb.list} index={lb.i} setIndex={(v) => setLb((s) => {
        const i = typeof v === "function" ? v(s.i) : v;
        return i === null ? null : { ...s, i };
      })} />}
    </div>
  );
}
