import { useEffect, useRef, useState } from "react";
import { SPOTIFY } from "../data/content.js";
import { useT } from "../i18n/lang.jsx";

// Charge l'API officielle d'intégration Spotify une seule fois.
let apiPromise = null;
function loadSpotifyApi() {
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), 8000);
    window.onSpotifyIframeApiReady = (api) => { clearTimeout(timer); resolve(api); };
    const s = document.createElement("script");
    s.src = "https://open.spotify.com/embed/iframe-api/v1";
    s.async = true;
    s.onerror = () => { clearTimeout(timer); apiPromise = null; reject(new Error("load")); };
    document.body.appendChild(s);
  });
  return apiPromise;
}

// Lecteur Spotify : rien n'est chargé avant le clic (vie privée, page légère).
// Au clic, le lecteur se charge et la chanson démarre avec le son.
export default function SpotifyEmbed({ height = 152, auto = false, compact = false }) {
  const { t } = useT();
  const [on, setOn] = useState(auto);
  const [fallback, setFallback] = useState(false);
  const box = useRef(null);

  useEffect(() => {
    if (!on || fallback) return;
    let ctrl = null, alive = true;
    const host = document.createElement("div");
    box.current.appendChild(host);
    loadSpotifyApi()
      .then((api) => {
        if (!alive) return;
        api.createController(host, { uri: `spotify:track:${SPOTIFY.trackId}`, width: "100%", height }, (c) => {
          ctrl = c;
          if (!alive) { c.destroy(); return; }
          c.addListener("ready", () => c.play());
        });
      })
      .catch(() => alive && setFallback(true));
    return () => {
      alive = false;
      try { ctrl?.destroy(); } catch { /* déjà détruit */ }
      if (box.current) box.current.innerHTML = "";
    };
  }, [on, fallback]);

  if (on && fallback) {
    return (
      <iframe className="spotify" title={`${SPOTIFY.title} · ${SPOTIFY.artist} sur Spotify`} width="100%" height={height}
        src={`https://open.spotify.com/embed/track/${encodeURIComponent(SPOTIFY.trackId)}?theme=0`}
        allow="autoplay; encrypted-media; clipboard-write; fullscreen" referrerPolicy="strict-origin-when-cross-origin"
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-presentation" />
    );
  }
  if (on) return <div className="sp-box" ref={box} style={{ minHeight: height }} />;
  return (
    <button className={"sp-facade" + (compact ? " compact" : "")} style={{ minHeight: height }} onClick={() => setOn(true)}>
      <span className="vinyl" aria-hidden="true" />
      <span className="sp-t"><b>{SPOTIFY.title}</b><small>{SPOTIFY.artist}</small><em>{t("sp.tap")}</em></span>
      <span className="sp-play" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24"><path d="M7 4v16l13-8z" fill="currentColor" /></svg></span>
    </button>
  );
}
