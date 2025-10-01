/**
 * PS5 DualSense Controller Enhancements v1.0
 * - Adds haptic feedback for in-game events.
 * - This module works alongside input_manager.js, which handles button/axis polling.
 */
(function(){
    if (window.PP?.ps5) return;

    const log = (...a) => console.log("[PS5_Enhancements]", ...a);
    const state = {
        gamepad: null,
        gamepadIndex: -1,
    };

    function findDualSense() {
        try {
            const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
            for (let i = 0; i < gamepads.length; i++) {
                const gp = gamepads[i];
                if (gp && gp.id.toLowerCase().includes('dualsense')) {
                    if (state.gamepadIndex !== i) {
                        log(`DualSense controller found at index ${i}.`);
                        state.gamepad = gp;
                        state.gamepadIndex = i;
                    }
                    return;
                }
            }
        } catch(e) {
            console.warn("[PS5_Enhancements] Error while polling for gamepads.", e);
        }
        
        // If we reach here, no dualsense was found or it was disconnected
        if (state.gamepad) {
            log("DualSense controller disconnected.");
            state.gamepad = null;
            state.gamepadIndex = -1;
        }
    }
    
    /**
     * Triggers a haptic pulse on the controller.
     * @param {number} strong - Magnitude of the strong (low-frequency) motor, 0.0 to 1.0.
     * @param {number} weak - Magnitude of the weak (high-frequency) motor, 0.0 to 1.0.
     * @param {number} duration - Duration of the pulse in milliseconds.
     */
    function pulse(strong = 0.8, weak = 0.4, duration = 150) {
        if (!state.gamepad || !state.gamepad.vibrationActuator) return;

        state.gamepad.vibrationActuator.playEffect("dual-rumble", {
            startDelay: 0,
            duration: duration,
            weakMagnitude: weak,
            strongMagnitude: strong,
        }).catch(e => {
            // This can fail if the document isn't focused, so we don't need to spam the console.
        });
    }

    // A more complex effect, like a heartbeat for low sanity
    let heartbeatInterval = null;
    function startHeartbeat() {
        if (heartbeatInterval) return;
        stopHeartbeat(); // Ensure no duplicates
        heartbeatInterval = setInterval(() => {
            pulse(0.9, 0, 80);
            setTimeout(() => pulse(0.5, 0, 60), 120);
        }, 800);
        log("Heartbeat effect started.");
    }
    
    function stopHeartbeat() {
        if (heartbeatInterval) {
            clearInterval(heartbeatInterval);
            heartbeatInterval = null;
            log("Heartbeat effect stopped.");
        }
    }

    // Hook into game events
    function attachEventListeners() {
        // A generic event for a "jumpscare" or significant ghost interaction
        window.addEventListener('pp:ghost:interact', () => pulse(1.0, 1.0, 300));
        
        // When the ghost hunts
        window.addEventListener('pp:ghost:hunt_start', () => pulse(0.8, 0.8, 1000));
        
        // Link heartbeat to sanity
        window.addEventListener('pp:sanity:changed', (e) => {
            const sanity = e.detail?.sanity;
            if (typeof sanity === 'number') {
                if (sanity < 30) {
                    startHeartbeat();
                } else {
                    stopHeartbeat();
                }
            }
        });

        // Player takes damage or a sanity hit
        window.addEventListener('pp:player:hit', () => pulse(1.0, 0.2, 200));
    }


    function init() {
        window.addEventListener("gamepadconnected", findDualSense, { passive: true });
        window.addEventListener("gamepaddisconnected", findDualSense, { passive: true });
        findDualSense(); // Initial check
        attachEventListeners();
        log("Initialized.");
    }
    
    const api = {
        pulse,
    };

    window.PP = window.PP || {};
    window.PP.ps5 = api;

    // Wait for the game to start to initialize
    window.addEventListener('pp:start', init, { once: true });

})();
