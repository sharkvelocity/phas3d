(function(){
  "use strict";
  if (window.PP?.pointerLock) return;

  const PP = (window.PP = window.PP || {});
  const state = {
    canvas: null,
    uiOpenCount: 0,       // how many UIs are asking to keep the mouse free
    wantedLock: false,    // desire to be locked when allowed
    isLocked: false,
  };

  function getCanvas(){ return state.canvas || (state.canvas = document.getElementById("renderCanvas")); }

  function canLock(){ return state.uiOpenCount <= 0; }
  function isLocked(){ return document.pointerLockElement === getCanvas(); }

  function lockNow(){
    const c = getCanvas(); if (!c) return;
    try { c.requestPointerLock?.(); } catch(_){}
  }
  function unlockNow(){
    try { document.exitPointerLock?.(); } catch(_){}
  }

  function ensure(){
    state.isLocked = isLocked();
    if (state.wantedLock && canLock() && !state.isLocked) lockNow();
    if ((!state.wantedLock || !canLock()) && state.isLocked) unlockNow();
  }

  // Public API
  const api = PP.pointerLock = {
    lock(){ state.wantedLock = true; ensure(); },
    unlock(){ state.wantedLock = false; ensure(); },
    hold(reason){ // e.g. UI opened
      state.uiOpenCount = Math.max(1, state.uiOpenCount + 1);
      ensure();
    },
    release(reason){ // e.g. UI closed
      state.uiOpenCount = Math.max(0, state.uiOpenCount - 1);
      ensure();
    },
    isLocked: isLocked
  };

  // Observe native pointer lock changes
  ["pointerlockchange","mozpointerlockchange","webkitpointerlockchange"].forEach(ev=>{
    document.addEventListener(ev, ()=> { state.isLocked = isLocked(); }, false);
  });

  // Auto (re)lock on canvas click when allowed
  document.addEventListener("click", (e)=>{
    if (!getCanvas() || e.target !== getCanvas()) return;
    state.wantedLock = true;
    ensure();
  }, true);

  // Keep behavior after tab switches etc.
  document.addEventListener("visibilitychange", ()=>{
    if (!document.hidden) ensure();
  });

  // Start locked after the Start button is used
  window.addEventListener("pp:start", ()=>{
    state.wantedLock = true;
    setTimeout(ensure, 100); // short delay to allow UI to settle
  }, { once:true });

  // Listen for events from UI modules
  window.addEventListener("pp:notebook:open", ()=> api.hold("notebook"));
  window.addEventListener("pp:notebook:close",()=> api.release("notebook"));
  window.addEventListener("pp:van:open",      ()=> api.hold("van"));
  window.addEventListener("pp:van:close",     ()=> api.release("van"));
  
  console.log("[PointerLockManager] Initialized.");
  
  if (window.PP?.signalReady) {
    window.PP.signalReady('pointerLock');
  }

})();