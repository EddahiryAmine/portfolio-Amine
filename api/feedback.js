// Fonction serverless (Vercel) : reçoit un avis laissé sur le portfolio et l'envoie à Amine par email (Resend).
// Les avis ne sont PAS publiés automatiquement : Amine choisit ceux à afficher (src/data/testimonials.js).
// Variables : RESEND_API_KEY (obligatoire), CONTACT_TO, CONTACT_FROM (facultatives, comme api/contact.js).

const hits = new Map();
const TO = process.env.CONTACT_TO || "eddahiryamine@gmail.com";
const FROM = process.env.CONTACT_FROM || "Portfolio <onboarding@resend.dev>";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const RELATIONS = ["colleague", "manager", "mentor", "client", "classmate", "other"];
const clean = (v, max) => String(v ?? "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method" });
  if (!process.env.RESEND_API_KEY) return res.status(503).json({ error: "disabled" });

  const b = req.body || {};
  if (b.website) return res.status(200).json({ ok: true }); // champ piège : robot

  const name = clean(b.name, 80), role = clean(b.role, 120), email = clean(b.email, 120), message = clean(b.message, 1200);
  const linkedin = clean(b.linkedin, 200), relation = RELATIONS.includes(b.relation) ? b.relation : "other";
  const rating = Math.min(5, Math.max(1, parseInt(b.rating, 10) || 5)), consent = b.consent === true;
  if (name.length < 2 || message.length < 20 || (email && !EMAIL.test(email)) || (linkedin && !/^https:\/\/(www\.)?linkedin\.com\//.test(linkedin))) {
    return res.status(400).json({ error: "input" });
  }

  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "?";
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 3600000);
  if (list.length >= 3) return res.status(429).json({ error: "rate" });
  hits.set(ip, [...list, now]);

  const text = [
    `Nouvel avis sur ton portfolio ${"★".repeat(rating)}${"☆".repeat(5 - rating)}`, "",
    `« ${message} »`, "",
    `— ${name}${role ? ", " + role : ""}`,
    `Relation : ${relation}`, email && `Email : ${email}`, linkedin && `LinkedIn : ${linkedin}`,
    `Publication autorisée : ${consent ? "OUI" : "NON (ne pas publier)"}`, "",
    "Pour le publier : ajoute-le dans src/data/testimonials.js puis redéploie.",
  ].filter(Boolean).join("\n");

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${process.env.RESEND_API_KEY}`, "content-type": "application/json" },
      body: JSON.stringify({ from: FROM, to: [TO], ...(email ? { reply_to: email } : {}), subject: `[Avis portfolio] ${name} · ${rating}/5`, text }),
      signal: AbortSignal.timeout(10000),
    });
    if (!r.ok) return res.status(502).json({ error: "upstream" });
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(502).json({ error: "upstream" });
  }
}
