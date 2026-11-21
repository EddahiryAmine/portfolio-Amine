import { useEffect, useRef, useState } from "react";

// Petite ambiance lo-fi générée dans le navigateur (Web Audio) : aucune musique protégée,
// aucun fichier à charger. Accords doux + notes aléatoires + écho.
const CHORDS = [[57, 60, 64, 67], [53, 57, 60, 64], [48, 52, 55, 59], [55, 59, 62, 65]];
const freq = (m) => 440 * 2 ** ((m - 69) / 12);

export function useAmbient() {
  const engine = useRef(null);
  const [on, setOn] = useState(false);

  const start = () => {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const c = new AC();
    const master = c.createGain();
    master.gain.setValueAtTime(0, c.currentTime);
    master.gain.linearRampToValueAtTime(0.55, c.currentTime + 2);
    const lp = c.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 1300;
    const delay = c.createDelay();
    delay.delayTime.value = 0.36;
    const fb = c.createGain();
    fb.gain.value = 0.38;
    const wet = c.createGain();
    wet.gain.value = 0.45;
    lp.connect(master); lp.connect(delay);
    delay.connect(fb); fb.connect(delay); delay.connect(wet); wet.connect(master);
    master.connect(c.destination);

    const note = (m, t, dur, vol, type = "triangle") => {
      const o = c.createOscillator(), g = c.createGain();
      o.type = type; o.frequency.value = freq(m);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol, t + 0.06);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(lp);
      o.start(t); o.stop(t + dur + 0.1);
    };

    let step = 0;
    const bar = () => {
      const t = c.currentTime + 0.05;
      const chord = CHORDS[step % CHORDS.length];
      chord.forEach((m) => note(m - 12, t, 3.8, 0.05));
      note(chord[0] - 24, t, 3.6, 0.1, "sine");
      for (let i = 0; i < 8; i++) if (Math.random() < 0.7) note(chord[(i * 3 + step) % 4] + 12, t + i * 0.5, 1.3, 0.035);
      step++;
    };
    bar();
    engine.current = { c, master, id: setInterval(bar, 4000) };
    setOn(true);
  };

  const stop = () => {
    const e = engine.current;
    if (!e) return;
    clearInterval(e.id);
    e.master.gain.cancelScheduledValues(e.c.currentTime);
    e.master.gain.linearRampToValueAtTime(0, e.c.currentTime + 0.8);
    setTimeout(() => e.c.close(), 1000);
    engine.current = null;
    setOn(false);
  };

  useEffect(() => stop, []); // coupe le son en quittant la page
  return { on, toggle: () => (on ? stop() : start()) };
}
