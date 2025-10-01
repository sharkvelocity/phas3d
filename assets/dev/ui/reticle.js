// ./assets/dev/ui/reticle.js
// Center reticle with aim-detect highlight and simple API.

(function () {
  "use strict";

  // --- defaults (you can override via window.RETICLE_OPTS before this script) ---
  let RETICLE_OPTS = Object.assign({
    visible: true,
    style: "cross",   // "cross" | "dot" | "circle-dot"
    size: 18,         // overall size in px
    thickness: 2,     // line stroke width
    gap: 4,           // gap from center for cross
    color: "rgba(0, 255, 255, 0.8)",
    hitColor: "rgba(0, 255, 0, 1)",
    opacity: 1,
    maxAimDistance: 3.0 // meters
  }, (window.RETICLE_OPTS || {}));

  let WRAP, SVG;

  function injectCSS() {
    if (document.getElementById("reticle-style")) return;
    const css = `
      #reticle{
        position:fixed; left:50%; top:50%; transform:translate(-50%,-50%);
        z-index:6500; pointer-events:none; opacity:${RETICLE_OPTS.opacity};
        transition: transform 120ms ease, opacity 120ms ease;
      }
      #reticle svg { display:block; filter: drop-shadow(0 0 2px rgba(0,0,0,0.7)); }
    `;
    const s = document.createElement("style");
    s.id = "reticle-style";
    s.textContent = css;
    document.head.appendChild(s);
  }

  function makeCrossSVG({ size, thickness, gap, color }) {
    const s = size, g = gap, half = s / 2, len = half - g;
    return `<svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
      <line x1="${half}" y1="${half - g - len}" x2="${half}" y2="${half - g}" stroke="${color}" stroke-width="${thickness}" stroke-linecap="round" />
      <line x1="${half}" y1="${half + g}"       x2="${half}" y2="${half + g + len}" stroke="${color}" stroke-width="${thickness}" stroke-linecap="round" />
      <line x1="${half - g - len}" y1="${half}" x2="${half - g}" y2="${half}" stroke="${color}" stroke-width="${thickness}" stroke-linecap="round" />
      <line x1="${half + g}"       y1="${half}" x2="${half + g + len}" y2="${half}" stroke="${color}" stroke-width="${thickness}" stroke-linecap="round" />
    </svg>`;
  }

  function makeDotSVG({ size, thickness, color, withCircle }) {
    const s = size, cx = s / 2, cy = s/2;
    let content = `<circle cx="${cx}" cy="${cy}" r="${Math.max(1, thickness)}" fill="${color}" />`;
    if (withCircle) {
      content = `<circle cx="${cx}" cy="${cy}" r="${(s / 2) - thickness}" fill="none" stroke="${color}" stroke-width="${thickness}" />` + content;
    }
    return `<svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">${content}</svg>`;
  }

  function buildSVG(opts) {
    if (opts.style === "dot")        return makeDotSVG(opts);
    if (opts.style === "circle-dot") return makeDotSVG(Object.assign({}, opts, { withCircle: true }));
    return makeCrossSVG(opts);
  }

  function mount() {
    injectCSS();
    WRAP = document.getElementById("reticle");
    if (!WRAP) {
      WRAP = document.createElement("div");
      WRAP.id = "reticle";
      document.body.appendChild(WRAP);
    }
    WRAP.innerHTML = buildSVG(RETICLE_OPTS);
    SVG = WRAP.firstElementChild;
    setReticleVisible(!!RETICLE_OPTS.visible);
  }

  function setReticleVisible(v) {
    if (WRAP) WRAP.style.display = v ? "block" : "none";
  }
  function setReticleColor(c) {
    if(!SVG) return;
    SVG.querySelectorAll("line,circle").forEach(el => {
      if (el.getAttribute("fill") !== "none") el.setAttribute("fill", c);
      else el.setAttribute("stroke", c);
    });
  }
  function reticleFlash(ms = 140, color = RETICLE_OPTS.hitColor) {
    if (!WRAP) return;
    const prevColor = RETICLE_OPTS.color;
    setReticleColor(color);
    WRAP.style.transform = "translate(-50%,-50%) scale(1.25)";
    setTimeout(() => {
      setReticleColor(prevColor);
      WRAP.style.transform = "translate(-50%,-50%) scale(1)";
    }, ms);
  }
  function reticleSetStyle(newOpts) {
    RETICLE_OPTS = Object.assign(RETICLE_OPTS, newOpts || {});
    mount();
  }

  window.setReticleVisible = setReticleVisible;
  window.setReticleColor   = setReticleColor;
  window.reticleFlash      = reticleFlash;
  window.reticleSetStyle   = reticleSetStyle;

  function startAimCheck() {
    const scene = window.scene || BABYLON.Engine?.LastCreatedScene;
    if (!scene) { setTimeout(startAimCheck, 100); return; }
    let last = 0;
    scene.onBeforeRenderObservable.add(() => {
      if(!RETICLE_OPTS.visible) return;
      const now = performance.now();
      if (now - last < 80) return; // ~12.5 fps check
      last = now;
      try {
        const cam = window.camera; if (!cam) return;
        const ray = scene.createPickingRay(scene.getEngine().getRenderWidth() / 2, scene.getEngine().getRenderHeight() / 2, null, cam);
        ray.length = RETICLE_OPTS.maxAimDistance;
        const hit = scene.pickWithRay(ray, m => m && m.isPickable !== false);
        setReticleColor(hit?.hit ? RETICLE_OPTS.hitColor : RETICLE_OPTS.color);
      } catch (_) {}
    });
  }

  // optional: Alt+R toggles visibility
  window.addEventListener("keydown", (e) => {
    if ((e.key === "r" || e.key === "R") && e.altKey) {
      RETICLE_OPTS.visible = !RETICLE_OPTS.visible;
      setReticleVisible(RETICLE_OPTS.visible);
    }
  });

  document.addEventListener("DOMContentLoaded", () => { mount(); startAimCheck(); });
})();
