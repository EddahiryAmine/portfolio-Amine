import { useEffect, useMemo, useRef, useState } from "react";
import Icon from "./Icons.jsx";
import { useT } from "../i18n/lang.jsx";

// Palette de commandes (Ctrl/⌘ + K) : naviguer au clavier, comme dans un IDE.
export default function CommandPalette({ open, setOpen, actions }) {
  const { t } = useT();
  const [q, setQ] = useState(""), [i, setI] = useState(0), input = useRef(null);
  const list = useMemo(() => actions.filter((a) => (!a.secret || q.trim().toLowerCase().startsWith("sudo")) && a.label.toLowerCase().includes(q.trim().toLowerCase())), [actions, q]);
  useEffect(() => { if (open) { setQ(""); setI(0); setTimeout(() => input.current?.focus(), 30); } }, [open]);
  useEffect(() => {
    const key = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen((o) => !o); }
      else if (open && e.key === "Escape") setOpen(false);
    };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, [open]);
  if (!open) return null;
  const run = (a) => { setOpen(false); setTimeout(a.run, 120); };
  const onKey = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setI((i + 1) % Math.max(1, list.length)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setI((i + list.length - 1) % Math.max(1, list.length)); }
    if (e.key === "Enter" && list[i]) run(list[i]);
  };
  return (
    <div className="pal" onClick={() => setOpen(false)} role="dialog" aria-modal="true" aria-label={t("pal.title")}>
      <div className="pal-in" onClick={(e) => e.stopPropagation()}>
        <label className="pal-s"><Icon name="search" size={18} /><input ref={input} value={q} onChange={(e) => { setQ(e.target.value); setI(0); }} onKeyDown={onKey} placeholder={t("pal.placeholder")} maxLength={40} aria-label={t("pal.search")} /><kbd>{t("pal.esc")}</kbd></label>
        <ul role="listbox">
          {list.map((a, n) => (
            <li key={a.label} role="option" aria-selected={n === i} className={n === i ? "on" : ""} onMouseEnter={() => setI(n)} onClick={() => run(a)}>
              <Icon name={a.icon} size={18} /><span>{a.label}</span>{a.hint && <kbd>{a.hint}</kbd>}
            </li>
          ))}
          {!list.length && <li className="none">{t("pal.none")}</li>}
        </ul>
        {!q.trim().toLowerCase().startsWith("sudo") && <p className="pal-tip">{t("pal.tip")} <code>sudo</code>…</p>}
      </div>
    </div>
  );
}
