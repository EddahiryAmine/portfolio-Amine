import { useEffect, useState } from "react";
import Icon from "./Icons.jsx";
import { PROFILE } from "../data/content.js";
import { downloadVCard } from "../sections/Contact.jsx";
import { useT } from "../i18n/lang.jsx";

// Bouton flottant : apparaît après le hero et donne accès à tous les moyens de me joindre en un geste.
export default function QuickContact() {
  const { t } = useT();
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => {
      const c = document.getElementById("contact")?.getBoundingClientRect();
      setShow(scrollY > innerHeight * 0.8 && !(c && c.top < innerHeight * 0.6));
    };
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);
  useEffect(() => { if (!show) setOpen(false); }, [show]);
  useEffect(() => {
    if (!open) return;
    const k = (e) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, [open]);

  const items = [
    [t("qc.form"), "send", () => document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth", block: "center" })],
    ["WhatsApp", "chat", () => window.open(PROFILE.whatsapp, "_blank", "noopener")],
    [t("qc.email"), "mail", () => { location.href = `mailto:${PROFILE.email}`; }],
    ["LinkedIn", "linkedin", () => window.open(PROFILE.linkedin, "_blank", "noopener")],
    [t("qc.vcard"), "card", downloadVCard],
  ];

  return (
    <div className={"qc" + (show ? " show" : "") + (open ? " open" : "")}>
      <ul className="qc-list" aria-hidden={!open}>
        {items.map(([label, icon, run], i) => (
          <li key={label} style={{ "--i": items.length - i }}>
            <button tabIndex={open ? 0 : -1} onClick={() => { setOpen(false); run(); }}><span>{label}</span><i><Icon name={icon} size={18} /></i></button>
          </li>
        ))}
      </ul>
      <button className="qc-fab" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? t("qc.close") : t("qc.open")}>
        <span className="qc-ic"><Icon name={open ? "close" : "chat"} size={22} /></span>
        <span className="qc-lab">{t("qc.open")}</span>
      </button>
    </div>
  );
}
