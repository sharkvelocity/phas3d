
// assets/dev/ui/van_ui.js
(function(){
  'use strict';
  if (window.PP?.vanUI) return;

  const log = (...a) => console.log("[VanUI]", ...a);

  const state = {
    isVisible: false,
  };

  function createUI() {
    const existing = document.getElementById('van-ui-modal');
    if (existing) return existing;

    const modal = document.createElement('div');
    modal.id = 'van-ui-modal';
    modal.className = 'ui-overlay ui-modal';
    modal.style.cssText = `
      display: none;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 9998;
      color: #0ff;
      font-family: 'Courier New', monospace;
    `;

    const mapOptions = (window.PP?.mapManifest || [])
      .map(map => `<option value="${map.id}">${map.title}</option>`)
      .join('');

    modal.innerHTML = `
      <div style="width: 90%; max-width: 500px; background: rgba(10, 20, 30, 0.9); border: 1px solid #088; border-radius: 12px; padding: 24px; text-align: center;">
        <h1 style="font-size: 2em; text-shadow: 0 0 8px #0ff; margin-bottom: 24px;">MISSION SETUP</h1>
        
        <div style="margin-bottom: 24px;">
          <label for="map-selector" style="display: block; margin-bottom: 8px; font-size: 1.1em; color: #0aa;">Select Investigation Site:</label>
          <select id="map-selector" style="width: 100%; padding: 10px; background: #000; color: #0ff; border: 1px solid #088; border-radius: 5px; font-size: 1em;">
            ${mapOptions}
          </select>
        </div>

        <button id="start-investigation-btn" style="padding: 12px 24px; font-size: 1.2em; background: #088; color: #fff; border: 2px solid #0ff; border-radius: 8px; cursor: pointer; transition: background-color 0.2s;">
          START INVESTIGATION
        </button>
      </div>
    `;

    document.body.appendChild(modal);

    const startBtn = document.getElementById('start-investigation-btn');
    if (startBtn) {
      startBtn.addEventListener('click', handleStart);
    }

    log("UI created.");
    return modal;
  }

  function handleStart() {
    const mapSelector = document.getElementById('map-selector');
    if (!mapSelector) {
      console.error("[VanUI] Map selector not found!");
      return;
    }
    const selectedMapId = mapSelector.value;
    log(`Starting investigation for map: ${selectedMapId}`);

    // Dispatch an event that bootstrap.js will listen for
    window.dispatchEvent(new CustomEvent('pp:start-investigation', { 
      detail: { mapId: selectedMapId }
    }));
    
    hide();
  }

  function show() {
    const modal = createUI();
    modal.style.display = 'flex';
    state.isVisible = true;
    log("UI shown.");
  }

  function hide() {
    const modal = document.getElementById('van-ui-modal');
    if (modal) {
      modal.style.display = 'none';
    }
    state.isVisible = false;
    log("UI hidden.");
  }

  window.PP = window.PP || {};
  window.PP.vanUI = {
    show,
    hide,
  };

  log("Van UI initialized.");

})();
