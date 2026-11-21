// Fonction serverless (Vercel) : envoie les messages du formulaire de contact par email, via Resend (https://resend.com).
// Configuration sur Vercel : variable RESEND_API_KEY (obligatoire). Facultatif : CONTACT_TO (destinataire),
// CONTACT_FROM (expéditeur ; par défaut l'adresse de test de Resend, qui ne peut écrire qu'à l'email du compte Resend).
// Garde-fous : champ piège anti-robots, tailles limitées, 5 messages / 10 min / IP, texte brut uniquement.

const hits = new Map();
const TO = process.env.CONTACT_TO || "eddahiryamine@gmail.com";
const FROM = process.env.CONTACT_FROM || "Portfolio <onboarding@resend.dev>";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const clean = (v, max) => String(v ?? "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method" });
  if (!process.env.RESEND_API_KEY) return res.status(503).json({ error: "disabled" }); // le site propose alors l'envoi par l'app mail

  const b = req.body || {};
  if (b.website) return res.status(200).json({ ok: true }); // champ piège rempli : robot, on ignore en silence

  const name = clean(b.name, 80), email = clean(b.email, 120), subject = clean(b.subject, 60), message = clean(b.message, 1500);
  if (name.length < 2 || !EMAIL.test(email) || message.length < 10) return res.status(400).json({ error: "input" });

  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "?";
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 600000);
  if (list.length >= 5) return res.status(429).json({ error: "rate" });
  hits.set(ip, [...list, now]);

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${process.env.RESEND_API_KEY}`, "content-type": "application/json" },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        reply_to: email, // "Répondre" dans Gmail écrit directement au visiteur
        subject: `[Portfolio] ${subject || "Message"} · ${name}`,
        text: `${message}\n\n— ${name} <${email}>\nEnvoyé depuis amine-eddahiry.vercel.app`,
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!r.ok) return res.status(502).json({ error: "upstream" });
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(502).json({ error: "upstream" });
  }
}
