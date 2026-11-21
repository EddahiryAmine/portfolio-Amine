import { useRef, useState } from "react";
import Count from "../components/Count.jsx";
import Icon from "../components/Icons.jsx";
import Magnet from "../components/Magnet.jsx";
import Modal from "../components/Modal.jsx";
import Reveal from "../components/Reveal.jsx";
import SplitTitle from "../components/SplitTitle.jsx";
import { CERT_TOTAL, EXPERIENCE, PROJECTS } from "../data/content.js";
import { TECH } from "../data/tech.js";
import { useT } from "../i18n/lang.jsx";
import { reducedMotion } from "../hooks/useReducedMotion.js";
import cvPdf from "../assets/CV_Amine_Eddahiry.pdf";
import cvImg from "../assets/cv-preview.webp";

const STATS = [EXPERIENCE.length, CERT_TOTAL, PROJECTS.length, TECH.length];

// Étiquettes qui flottent devant le CV, à des profondeurs différentes (parallaxe 3D).
const FLOATERS = [["Capgemini", "f1"], ["Java SE 17 ✓", "f2"], [".NET · C#", "f3"], ["MIAGE · EMSI", "f4"]];

export default function CvSection() {
  const { t } = useT();
  const card = useRef(null);
  const [zoom, setZoom] = useState(false);
  const labels = t("cv.stats");

  // Inclinaison 3D + reflet holographique qui suivent le curseur.
  const move = (e) => {
    if (reducedMotion() || e.pointerType === "touch") return;
    const el = card.current, r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", (0.5 - py) * 18 + "deg");
    el.style.setProperty("--ry", (px - 0.5) * 22 + "deg");
    el.style.setProperty("--px", px * 100 + "%");
    el.style.setProperty("--py", py * 100 + "%");
    el.classList.add("live");
  };
  const leave = () => {
    const el = card.current;
    el.classList.remove("live");
    ["--rx", "--ry"].forEach((p) => el.style.setProperty(p, "0deg"));
  };

  return (
    <section id="cv" style={{ paddingTop: 0 }}>
      <div className="wrap cv2">
        <Reveal className="cv2-l">
          <SplitTitle>{t("cv.title")}</SplitTitle>
          <p className="lead">{t("cv.lead")}</p>
          <div className="cv-stats">
            {STATS.map((n, i) => <div key={i}><b><Count to={n} /></b><small>{labels[i]}</small></div>)}
          </div>
          <div className="cv-btns">
            <Magnet className="btn solid" href={cvPdf} download="CV_Amine_Eddahiry.pdf"><Icon name="download" size={18} />{t("cv.download")}</Magnet>
            <Magnet as="button" className="btn ghost" onClick={() => setZoom(true)}><Icon name="search" size={16} />{t("cv.preview")}</Magnet>
            <Magnet className="btn ghost" href={cvPdf} target="_blank" rel="noopener">{t("cv.pdf")}<Icon name="arrow" size={16} /></Magnet>
          </div>
          {t("cv.note") && <p className="cv-note"><Icon name="globe" size={14} />{t("cv.note")}</p>}
        </Reveal>

        <Reveal delay={0.15} className="holo-wrap">
          <div className="holo-stage" onPointerMove={move} onPointerLeave={leave}>
            <button className="holo" ref={card} onClick={() => setZoom(true)} aria-label={t("cv.zoom")}>
              <span className="holo-face">
                <img src={cvImg} alt={t("cv.alt")} loading="lazy" />
                <span className="holo-foil" aria-hidden="true" />
                <span className="holo-glare" aria-hidden="true" />
                <span className="scan" aria-hidden="true" />
              </span>
              <span className="seal" aria-hidden="true">
                <svg viewBox="0 0 100 100"><defs><path id="sealc" d="M50 50m-36 0a36 36 0 1 1 72 0a36 36 0 1 1-72 0" /></defs>
                  <text><textPath href="#sealc">ORACLE CERTIFIED · JAVA SE 17 · 2026 · </textPath></text></svg>
                <b>OCP</b>
              </span>
              {FLOATERS.map(([x, c]) => <span key={c} className={"floater " + c} aria-hidden="true">{x}</span>)}
            </button>
          </div>
        </Reveal>
      </div>

      {zoom && (
        <Modal title={t("cv.title")} onClose={() => setZoom(false)}>
          <div className="cv-zoom">
            <img src={cvImg} alt={t("cv.alt")} />
            <div className="cv-zoom-b">
              <a className="btn solid" href={cvPdf} download="CV_Amine_Eddahiry.pdf"><Icon name="download" size={18} />{t("cv.dl")}</a>
              <a className="btn ghost" href={cvPdf} target="_blank" rel="noopener">{t("cv.open")}<Icon name="arrow" size={16} /></a>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}
