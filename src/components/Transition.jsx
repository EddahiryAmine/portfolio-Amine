import { useEffect, useState } from "react";
import TypeLine from "./TypeLine.jsx";
import { reducedMotion } from "../hooks/useReducedMotion.js";

const LINES = {
  perso: "$ git checkout perso",
  pro: "$ git checkout pro",
};

// Étapes : le cercle grandit depuis le bouton, une ligne de terminal s'écrit,
// la page change derrière, puis le rideau se retire.
export default function Transition({ to, x, y, onMid, onDone }) {
  const [step, setStep] = useState("in"); // in -> hold -> out
  useEffect(() => {
    const fast = reducedMotion();
    const t1 = setTimeout(() => setStep("hold"), fast ? 0 : 650);
    const t2 = setTimeout(() => { onMid(); setStep("out"); }, fast ? 100 : 1850);
    const t3 = setTimeout(onDone, fast ? 200 : 2650);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);
  return (
    <div className={`trans to-${to} ${step}`} style={{ "--x": x + "px", "--y": y + "px" }} aria-hidden="true">
      <div className="trans-term">
        {step !== "in" && <TypeLine text={LINES[to]} speed={34} />}
      </div>
    </div>
  );
}
