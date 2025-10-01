// ./assets/dev/effects/effects_sanity_med.js
// Applies infinite stamina 10s + 40% sanity over 30s (cap 100%).
(function(){
  "use strict";

  function clamp(n,a,b){ return Math.max(a, Math.min(b,n)); }

  function applyEffects(){
    // Stamina boost (inform your player controller)
    window.dispatchEvent(new CustomEvent('pp:player:stamina-boost', { detail:{ seconds:10 }}));
    window.toast("Stamina boost applied!", 1200);

    // Sanity regen 40 over 30s → ~1.333/s
    const total = 40, dur = 30, tick = 0.5;
    const perTick = total / (dur / tick);
    let elapsed = 0;

    const id = setInterval(()=>{
      elapsed += tick;
      try {
        if (typeof window.PP?.state?.sanity === 'number'){
            window.PP.state.sanity = clamp(window.PP.state.sanity + perTick, 0, 100);
            
            // Call HUD updater if available
            if (typeof window.updateSanity === "function") {
                window.updateSanity(Math.round(window.PP.state.sanity));
            }
        }
      } catch {}
      if (elapsed >= dur) {
        clearInterval(id);
        window.toast("Sanity restored.", 1500);
      }
    }, tick*1000);
  }

  // Hook from inventory_system: pp:effect:sanity-med
  window.addEventListener('pp:effect:sanity-med', applyEffects);
})();
