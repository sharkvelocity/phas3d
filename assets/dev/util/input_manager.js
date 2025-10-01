/**
 * modular_bindings.js (now input_manager.js) (keyboard + PS5 controller)
 * - Unified input for keyboard and DualSense (PS5) controllers.
 * - Keyboard: WASD/keys as before.
 * - Controller: Maps Phasmophobia-like layout into the same state/slots/events.
 * - Exposes PP.getMovementFlags() and PP.getSpeeds().
 */
(function () {
  if (window.__PP_BINDINGS__) return; window.__PP_BINDINGS__ = true;

  const PP = (window.PP = window.PP || {});
  const C  = (PP.controls = PP.controls || {});
  PP.state = PP.state || {};
  PP.state.controls = PP.state.controls || { forward:false, back:false, left:false, right:false };
  PP.state.selectedSlot = PP.state.selectedSlot || 1;
  PP.state.running = false;

  const Keys = Object.create(null);
  const F = PP.state.controls;

  // ---------- helpers ----------
  const has = (arr, code) => Array.isArray(arr) && arr.includes(code);

  function S(){ 
    return window.SCENE || window.scene || 
           (window.ENGINE && ENGINE.scenes && ENGINE.scenes[0]) || null; 
  }

  function uiBusy() {
    const ae = document.activeElement;
    if (ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA' || ae.isContentEditable)) return true;
    if (document.getElementById('notebook-modal')?.style?.display !== 'none') return true;
    return false;
  }

  function emit(name, detail) {
    try { window.dispatchEvent(new CustomEvent(name, { detail })); } catch {}
  }

  function selectSlot(n) {
    n = Math.max(1, Math.min(3, n|0));
    const prev = PP.state.selectedSlot;
    if (prev === n) {
      emit('pp:slot:confirm', { slot: n });
      return;
    }
    PP.state.selectedSlot = n;
    emit('pp:slot:change', { prev, next: n });

    if (typeof window.selectSlot === 'function') window.selectSlot(n);
    if (typeof window.buildBelt === 'function')  { try { window.buildBelt(null); } catch {} }
    if (typeof window.refreshCameraOverlay === 'function') { try { window.refreshCameraOverlay(); } catch {} }
  }

  const syncHeldLights = () => { if (typeof window.syncHeldLights === 'function') window.syncHeldLights(); };
  const toggleNearestHouseLight = () => { if (typeof window.toggleNearestHouseLight === 'function') window.toggleNearestHouseLight(); };
  const setHousePower = (on) => { if (typeof window.setHousePower === 'function') window.setHousePower(on); };

  function preventIfNeeded(e){
    const block = ['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'];
    if (block.includes(e.code)) e.preventDefault();
  }

  // ---------- Keyboard ----------
  addEventListener('keydown', (e) => {
    Keys[e.code] = true;
    if (uiBusy()) return;
    preventIfNeeded(e);

    const keyMap = C.keys || {};
    if (has(keyMap.forward, e.code)) F.forward = true;
    if (has(keyMap.back,    e.code)) F.back    = true;
    if (has(keyMap.left,    e.code)) F.left    = true;
    if (has(keyMap.right,   e.code)) F.right   = true;
    if (has(keyMap.sprint,  e.code)) PP.state.running = true;

    if (keyMap.slots?.includes(e.code)) {
      const n = parseInt(e.code.replace(/\D/g, ''), 10) || 0;
      if (n >= 1 && n <= 3) {
        emit('pp:belt:select', { slot: n - 1 });
        return;
      }
    }

    if (has(keyMap.notebook, e.code) && typeof window.openNotebook === 'function') window.openNotebook();
    if (has(keyMap.interact, e.code) && typeof window.toggleNearestDoor === 'function') window.toggleNearestDoor();
    if (has(keyMap.use,      e.code)) emit('pp:item:use');
    if (has(keyMap.minimap,  e.code) && typeof window.toggleMinimap === 'function') window.toggleMinimap();
    
    if (has(keyMap.lighter, e.code)) emit('pp:lighter:toggle');
    if (has(keyMap.flash, e.code)) emit('pp:flashlight:toggle');
    if (has(keyMap.uv,    e.code)) emit('pp:uv_light:toggle');
    if (has(keyMap.ir,    e.code)) emit('pp:ir_light:toggle');
    
    if (has(keyMap.lightToggle, e.code)) toggleNearestHouseLight();
    if (has(keyMap.powerToggle, e.code)) setHousePower(!window.housePower);
  }, { capture: true });

  addEventListener('keyup', (e) => {
    Keys[e.code] = false;
    const keyMap = C.keys || {};
    if (has(keyMap.forward, e.code)) F.forward = false;
    if (has(keyMap.back,    e.code)) F.back    = false;
    if (has(keyMap.left,    e.code)) F.left    = false;
    if (has(keyMap.right,   e.code)) F.right   = false;
    if (has(keyMap.sprint,  e.code)) PP.state.running = false;
  }, { capture: true });

  // ---------- PS5 Controller ----------
  const ps5Bindings = {
    stick: { threshold: 0.25 },
    buttons: {
      0: () => { emit('pp:item:use') }, // X
      1: () => { emit('pp:item:drop') },           // Circle
      2: () => { emit('pp:item:pickup') },       // Square
      3: () => { emit('pp:belt:cycle', { direction: 1 }) },  // Triangle cycle
      9: () => { F.crouch = !F.crouch; emit('pp:crouch', { crouch: F.crouch }); },          // R3
      10: () => { F.crouch = !F.crouch; emit('pp:crouch', { crouch: F.crouch }); },         // L3
      4: () => { PP.state.running = true; },                                               // L1 hold = sprint
      6: () => { emit('pp:item:place') },         // L2
      7: () => { if (typeof window.toggleNearestDoor === 'function') window.toggleNearestDoor(); },           // R2
      13: () => { emit('pp:flashlight:toggle'); } // D-pad Down
    }
  };
  const ps5Pressed = new Set();
  function pollController() {
    try {
        const pads = navigator.getGamepads ? navigator.getGamepads() : [];
        const pad = Array.from(pads).find(p => p && p.id.toLowerCase().includes('dualsense'));
        if (pad) {
          const axLH = pad.axes[0] || 0, axLV = pad.axes[1] || 0;
          F.left  = axLH < -ps5Bindings.stick.threshold;
          F.right = axLH >  ps5Bindings.stick.threshold;
          F.forward = axLV < -ps5Bindings.stick.threshold;
          F.back    = axLV >  ps5Bindings.stick.threshold;

          pad.buttons.forEach((btn, i) => {
            if (btn.pressed && !ps5Pressed.has(i) && ps5Bindings.buttons[i]) {
              try { ps5Bindings.buttons[i](); } catch {}
            }
            if (btn.pressed) ps5Pressed.add(i); else ps5Pressed.delete(i);
            
            if (i === 4 && !btn.pressed) PP.state.running = false; // release sprint
          });
        }
    } catch(e) {}
    requestAnimationFrame(pollController);
  }
  
  // ---------- Footsteps ----------
  (function footsteps() {
    let cam, st = { last: null, acc: 0 };
    function init(){
        const s = S(); if (!s || !s.activeCamera) return setTimeout(init, 200);
        cam = s.activeCamera;
        st.last = cam.position.clone();
        tick();
    }
    function tick(){
      const now = cam?.position;
      if (!st.last || !now) { requestAnimationFrame(tick); return; }
      const d = BABYLON.Vector3.Distance(now, st.last);
      st.last.copyFrom(now);

      const moving = F.forward || F.back || F.left || F.right;
      if (moving && cam.parent){ // parent check ensures we are not in free-cam
        st.acc += d;
        const stride = (PP.state.running ? (PP.controls.strideRun || 0.8) : (PP.controls.strideWalk || 1.2));
        if (st.acc >= stride){
          st.acc = 0;
          if (PP.audio?.playStep) { try { PP.audio.playStep(0.42); } catch {} }
        }
      }
      requestAnimationFrame(tick);
    }
    init();
  })();

  // ---------- Exports ----------
  PP.getMovementFlags = () => ({ ...F, running: !!PP.state.running, crouch: !!F.crouch });
  PP.getSpeeds        = () => ({ walk: PP.controls.speedWalk || 0.9, run: PP.controls.speedRun || 1.8 });

  window.addEventListener('pp:start', () => {
    try { if (typeof window.buildBelt === 'function') window.buildBelt(null); } catch {}
    pollController();
  }, { once: true });
  
  if (window.PP?.signalReady) {
    window.PP.signalReady('inputManager');
  }

})();