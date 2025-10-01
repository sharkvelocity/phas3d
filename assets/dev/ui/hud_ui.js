// hud_ui.js
// Creates and manages the HUD elements like sanity, XYZ coordinates, etc.
(function(){
    "use strict";
    if (window.HUDManager) return;

    function createHUD() {
        if (document.getElementById('hud-container')) return;

        const container = document.createElement('div');
        container.id = 'hud-container';
        Object.assign(container.style, {
            position: 'fixed',
            bottom: '80px', // Above the belt
            left: '10px',
            zIndex: '5000',
            color: '#0ff',
            fontFamily: "'Courier New', monospace",
            textShadow: '0 0 5px #0ff',
            fontSize: '16px',
            background: 'rgba(0, 20, 30, 0.5)',
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid rgba(0, 255, 255, 0.2)'
        });

        container.innerHTML = `
            <div id="hud-sanity">Sanity: --%</div>
            <div id="hud-xyz" style="margin-top: 4px;">XYZ: --, --, --</div>
        `;

        document.body.appendChild(container);
    }

    function updateSanity(value) {
        const el = document.getElementById('hud-sanity');
        if (el) {
            el.textContent = `Sanity: ${Math.round(value)}%`;
        }
    }

    function updateXYZ(vector3) {
        const el = document.getElementById('hud-xyz');
        if (el && vector3) {
            el.textContent = `XYZ: ${vector3.x.toFixed(2)}, ${vector3.y.toFixed(2)}, ${vector3.z.toFixed(2)}`;
        }
    }

    window.HUDManager = {
        updateSanity,
        updateXYZ
    };
    
    // Also expose on global for older modules
    window.updateSanity = updateSanity;

    document.addEventListener('DOMContentLoaded', createHUD);

})();