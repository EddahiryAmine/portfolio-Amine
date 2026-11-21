import { useEffect, useState } from "react";

const fmt = new Intl.DateTimeFormat("fr-FR", { timeZone: "Africa/Casablanca", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });

// Heure en direct à Casablanca.
export default function Clock() {
  const [t, setT] = useState(() => fmt.format(new Date()));
  useEffect(() => {
    const id = setInterval(() => setT(fmt.format(new Date())), 1000);
    return () => clearInterval(id);
  }, []);
  return <time className="clock">{t}</time>;
}
