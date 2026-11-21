import { useEffect, useState } from "react";

// Routage minimal : "" = accueil, "photographie" = page photo.
export function useHashRoute() {
  const [route, setRoute] = useState(location.hash.slice(1));
  useEffect(() => {
    const onChange = () => setRoute(location.hash.slice(1));
    addEventListener("hashchange", onChange);
    return () => removeEventListener("hashchange", onChange);
  }, []);
  return route;
}
