import { KB } from "./knowledge.js";

// Si VITE_ASK_ENDPOINT est défini au build (ex. "/api/ask"), la question part vers une vraie IA via TON serveur.
// La clé API reste sur le serveur, jamais dans le navigateur. Sans endpoint (ou en cas d'erreur),
// l'assistant répond depuis la base locale, dans la langue du site.
const ENDPOINT = import.meta.env.VITE_ASK_ENDPOINT || "";
export const MAX_LEN = 300;

const UNKNOWN = {
  fr: "Je n’ai pas la réponse à ça. Essaie : poste actuel, compétences, projets, certifications ou contact. Pour le reste, écris à Amine : eddahiryamine@gmail.com.",
  en: "I don’t have the answer to that. Try: current role, skills, projects, certifications or contact. For anything else, email Amine: eddahiryamine@gmail.com.",
};

const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

function match(question) {
  const tokens = (norm(question).match(/[a-z0-9#+.\-]+/g) || []).map((t) => t.replace(/^[.\-]+|[.\-]+$/g, ""));
  let best = null, score = 0;
  for (const e of KB) {
    const n = tokens.reduce((acc, t) => acc + (e.k.includes(t) ? 1 : 0), 0);
    if (n > score) { best = e; score = n; }
  }
  return best;
}

export function localAnswer(question, lang = "fr") {
  const best = match(question);
  if (!best) return UNKNOWN[lang] || UNKNOWN.fr;
  return lang === "en" ? best.en || best.a : best.a;
}

// Renvoie { text, ai, act } : act = boutons d'action (déduits de la question, même avec la vraie IA).
export async function ask(question, history = [], lang = "fr") {
  const r = await askText(question, history, lang);
  return { ...r, act: match(String(question))?.act || ["contact"] };
}

async function askText(question, history, lang) {
  const q = String(question).slice(0, MAX_LEN);
  if (ENDPOINT) {
    try {
      const r = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ lang, messages: [...history.slice(-6), { role: "user", content: q }] }),
        signal: AbortSignal.timeout(15000),
      });
      if (r.ok) {
        const j = await r.json();
        if (typeof j.answer === "string" && j.answer.trim()) return { text: j.answer.trim().slice(0, 1200), ai: true };
      }
    } catch { /* on retombe sur la base locale */ }
  }
  return { text: localAnswer(q, lang), ai: false };
}
