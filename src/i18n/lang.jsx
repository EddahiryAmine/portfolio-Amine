import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { STR } from "./strings.js";
import { reducedMotion } from "../hooks/useReducedMotion.js";

// Langue du site (fr | en). Mémorisée dans le navigateur du visiteur.
// Par défaut : la langue du navigateur (français ou arabe -> fr, sinon en).
export const LANGS = ["fr", "en"];
const KEY = "lang";

const initial = () => {
  try { const s = localStorage.getItem(KEY); if (LANGS.includes(s)) return s; } catch { /* stockage indisponible */ }
  const n = (navigator.languages?.[0] || navigator.language || "fr").toLowerCase();
  return n.startsWith("fr") || n.startsWith("ar") ? "fr" : "en";
};

const Ctx = createContext({ lang: "fr", setLang: () => {} });

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(initial);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  // Changement avec un fondu (View Transitions) quand le navigateur le permet.
  const setLang = useCallback((next) => {
    if (next === lang || !LANGS.includes(next)) return;
    const apply = () => {
      try { localStorage.setItem(KEY, next); } catch { /* stockage indisponible */ }
      setLangState(next);
    };
    if (document.startViewTransition && !reducedMotion()) {
      document.documentElement.classList.add("lang-swap");
      const vt = document.startViewTransition(apply);
      vt.finished.finally(() => document.documentElement.classList.remove("lang-swap"));
    } else apply();
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang }), [lang, setLang]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

const get = (obj, path) => path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);

// t("cle.sous_cle", { n: 3 }) -> texte traduit ; p(valeur) -> choisit la langue dans { fr, en }.
export function useT() {
  const { lang, setLang } = useContext(Ctx);
  return useMemo(() => {
    const t = (key, vars) => {
      let s = get(STR[lang], key) ?? get(STR.fr, key) ?? key;
      if (vars && typeof s === "string") s = s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
      return s;
    };
    const p = (v) => (v && typeof v === "object" && !Array.isArray(v) && "fr" in v ? v[lang] ?? v.fr : v);
    return { lang, setLang, t, p };
  }, [lang, setLang]);
}
