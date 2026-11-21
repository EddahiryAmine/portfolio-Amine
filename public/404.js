// Page 404 : "404" dessiné par des particules qui fuient le curseur puis reviennent.
(function () {
  var en = !/^(fr|ar)/i.test(navigator.language || "fr");
  try { var s = localStorage.getItem("lang"); if (s) en = s === "en"; } catch (e) { /* stockage indisponible */ }
  document.documentElement.lang = en ? "en" : "fr";
  if (en) {
    document.getElementById("msg").textContent = "This page got lost in the night. Move your mouse over the particles.";
    document.getElementById("home").textContent = "← Back to the portfolio";
  }
  document.getElementById("path").textContent = "GET " + location.pathname;

  var c = document.getElementById("c"), x = c.getContext("2d"), W, H, P = [], m = { x: -9999, y: -9999 };
  var still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var COLORS = ["#B7C5E3", "#DCE3F1", "#8FA2CC", "#E3A04A", "#D6457F"];

  function build() {
    var d = Math.min(2, devicePixelRatio || 1);
    W = innerWidth; H = innerHeight; c.width = W * d; c.height = H * d; x.setTransform(d, 0, 0, d, 0, 0);
    var o = document.createElement("canvas").getContext("2d"); o.canvas.width = W; o.canvas.height = H;
    var size = Math.min(W * 0.42, H * 0.55);
    o.fillStyle = "#fff"; o.textAlign = "center"; o.textBaseline = "middle";
    o.font = "italic 300 " + size + "px Newsreader, Georgia, serif"; o.fillText("404", W / 2, H * 0.44);
    var data = o.getImageData(0, 0, W, H).data, step = W < 600 ? 4 : 6, old = P; P = [];
    for (var y = 0; y < H; y += step) for (var i = 0; i < W; i += step) {
      if (data[(y * W + i) * 4 + 3] > 128) {
        var q = old[P.length];
        P.push({ hx: i, hy: y, x: q ? q.x : Math.random() * W, y: q ? q.y : Math.random() * H, vx: 0, vy: 0, r: Math.random() * 1.3 + 0.7, c: COLORS[(Math.random() * COLORS.length) | 0] });
      }
    }
    if (still) { x.clearRect(0, 0, W, H); P.forEach(function (p) { x.fillStyle = p.c; x.fillRect(p.hx, p.hy, p.r * 1.6, p.r * 1.6); }); }
  }
  function tick() {
    x.fillStyle = "rgba(9,12,20,0.3)"; x.fillRect(0, 0, W, H);
    x.globalCompositeOperation = "lighter";
    for (var k = 0; k < P.length; k++) {
      var p = P[k], dx = p.x - m.x, dy = p.y - m.y, d2 = dx * dx + dy * dy;
      if (d2 < 12000) { var f = (12000 - d2) / 12000 * 3.4, dd = Math.sqrt(d2) || 1; p.vx += dx / dd * f; p.vy += dy / dd * f; }
      p.vx += (p.hx - p.x) * 0.04; p.vy += (p.hy - p.y) * 0.04; p.vx *= 0.86; p.vy *= 0.86; p.x += p.vx; p.y += p.vy;
      x.fillStyle = p.c; x.fillRect(p.x, p.y, p.r * 1.5, p.r * 1.5);
    }
    x.globalCompositeOperation = "source-over";
    requestAnimationFrame(tick);
  }
  addEventListener("pointermove", function (e) { m.x = e.clientX; m.y = e.clientY; });
  addEventListener("pointerleave", function () { m.x = m.y = -9999; });
  addEventListener("pointerdown", function (e) {
    for (var k = 0; k < P.length; k++) { var p = P[k], dx = p.x - e.clientX, dy = p.y - e.clientY, d = Math.sqrt(dx * dx + dy * dy) || 1, f = 1400 / (d + 40); p.vx += dx / d * f; p.vy += dy / d * f; }
  });
  var t; addEventListener("resize", function () { clearTimeout(t); t = setTimeout(build, 200); });
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(function () { build(); if (!still) tick(); });
})();
