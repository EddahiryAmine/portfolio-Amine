// Avis publiés : champ "testimonials" de site.json, éditable depuis /admin.
// N'ajoute que des avis réels, avec l'accord de la personne.
import SITE from "./site.json";
export const TESTIMONIALS = SITE.testimonials || [];
