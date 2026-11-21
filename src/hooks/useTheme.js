import { useState } from "react";
import { reducedMotion } from "./useReducedMotion.js";

const initial = () => {
  let t = document.documentElement.dataset.theme;
  if (!t) { try { t = localStorage.getItem("theme"); } catch { /* stockage indisponible */ } }
  if (t !== "light" && t !== "dark") t = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  document.documentElement.dataset.theme = t;
  return t;
};

// Thème clair/sombre avec un rideau circulaire (View Transitions) depuis le bouton cliqué.
export function useTheme() {
  const [theme, setTheme] = useState(initial);
  const toggle = (e) => {
    const next = theme === "dark" ? "light" : "dark";
    const apply = () => {
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem("theme", next); } catch { /* stockage indisponible */ }
      setTheme(next);
    };
    const r = e?.currentTarget?.getBoundingClientRect?.();
    document.documentElement.style.setProperty("--tx", (r ? r.left + r.width / 2 : innerWidth - 40) + "px");
    document.documentElement.style.setProperty("--ty", (r ? r.top + r.height / 2 : 30) + "px");
    if (!document.startViewTransition || reducedMotion()) apply();
    else document.startViewTransition(apply);
  };
  return { theme, toggle };
}
