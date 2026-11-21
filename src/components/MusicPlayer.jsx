import { useAmbient } from "../hooks/useAmbient.js";
import { SPOTIFY_EMBED } from "../data/content.js";

// Lecteur d'ambiance : vinyle qui tourne, égaliseur animé, son lo-fi généré dans le navigateur.
export default function MusicPlayer() {
  const { on, toggle } = useAmbient();
  return (
    <div className="player-wrap">
      <div className={"player" + (on ? " on" : "")}>
        <div className="vinyl" aria-hidden="true" />
        <div className="pl-info">
          <b>Ambiance</b>
          <small>{on ? "Lo-fi en cours…" : "Lo-fi généré dans ton navigateur"}</small>
          <div className="eq" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        </div>
        <button className="play" onClick={toggle} aria-pressed={on}>{on ? "Pause" : "Écouter"}</button>
      </div>
      {SPOTIFY_EMBED && (
        <iframe className="spotify" title="Ma playlist" src={SPOTIFY_EMBED} height="152" loading="lazy" allow="encrypted-media" />
      )}
    </div>
  );
}
