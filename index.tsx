// This file acts as the main entry point and script loader for the game.
// It ensures all game modules are loaded in the correct sequence before starting the game.

// FIX: Define a more specific type for the global PP object to satisfy TypeScript.
// Properties are marked as optional to allow for progressive initialization across different scripts.
// This resolves multiple errors related to property access and initialization.
declare global {
  interface Window {
    PP: {
      // From settings
      controls?: any;
      ghost?: any;
      weatherMods?: any;
      rules?: any;
      state?: any;

      // From runtime
      globals?: {
          engine?: any;
          scene?: any;
          camera?: any;
      };
      runtime?: {
          exportGlobals: (engine: any, scene: any, camera: any) => void;
      };
      readySignals?: { [key: string]: Promise<void> };
      _resolveReady?: { [key: string]: () => void };
      signalReady?: (name: string) => void;
      waitFor?: (names: string | string[]) => Promise<any[]>;
      
      // From other files
      GHOST_DATA?: any;
      ALL_EVIDENCE?: string[];
      cfg?: any;
      storage?: any;
      mapManifest?: any;
      mapManager?: any;
      inventory?: any;
      tools?: any;
      spiritBox?: any;
      vanUI?: any;
      ps5?: any;
      pointerLock?: any;
      getMovementFlags?: () => any;
      getSpeeds?: () => any;
      gameHasRenderedFirstFrame?: boolean;
      audio?: any;
      rig?: any;
      
      // Allow other properties to be added by various modules
      [key: string]: any;
    };
  }
}

/**
 * Initializes the global PP settings object.
 * This logic was moved from modular_settings.js to fix a loading error.
 */
function initializeSettings() {
  // FIX: Cast to Window['PP'] to inform TypeScript of the object's full potential shape, resolving assignment errors.
  window.PP = (window.PP || {}) as Window['PP'];

  /* ------------ Controls (keys & movement tuning) ------------ */
  window.PP.controls = {
    keys: {
      // Movement
      forward:   ['KeyW','ArrowUp'],
      back:      ['KeyS','ArrowDown'],
      left:      ['KeyA','ArrowLeft'],
      right:     ['KeyD','ArrowRight'],
      sprint:    ['ShiftLeft','ShiftRight'],
      // Belt slots: exactly 1–3 (lighter is separate on Digit4)
      slots:     ['Digit1','Digit2','Digit3'],
      lighter:   ['Digit4'],
      // Core actions
      use:       ['Space'],   // “Use” active item
      interact:  ['KeyE'],    // Doors & ground/placed tools (e.g., Spirit Box on floor)
      notebook:  ['KeyN'],
      minimap:   ['KeyM'],
      // Lighting / environment
      flash:       ['KeyF'],  // flashlight (held/headgear)
      uv:          ['KeyU'],
      ir:          ['KeyI'],
      lightToggle: ['KeyL'],  // nearest house light
      powerToggle: ['KeyP'],  // house breaker
      // Camera
      cameraToggle: ['KeyV']  // FP <-> TP
    },
    // Movement tuning
    speedWalk:  1.80,
    speedRun:   3.20,
    // Camera feel (used by rig if present)
    mouseSens:       0.0022,
    touchLookSens:   0.0025,
    allowFly: false,
    godMode:  false
  };

  /* ------------ Ghost / Hunt / Sanity tuning ------------ */
  window.PP.ghost = {
    // Sanity drain per second
    baseSanityDrain: 0.6 / 60,
    nearSanityDrain: 1.2 / 60,
    nearDistance:    7.0,
    // Hunt pacing
    huntSanityThreshold: 65,
    huntCooldownMin:     22,
    huntCooldownMax:     40,
    huntChanceBelow40:   0.85,
    huntChanceAbove40:   0.55,
    // Ghost locomotion
    speed:             1.4,
    stepIntervalWalk:  0.55,
    stepIntervalHunt:  0.48,
    footAudible:       18,
    // Twins behavior
    twinsSeparationMin: 10.0,
    twinsSeparationMax: 12.0,
    // Crucifix
    crucifixBaseRadius:  3.0,
    crucifixDemonRadius: 5.0
  };

  /* ------------ Weather modifiers (sanity/hunt multipliers) ------------ */
  window.PP.weatherMods = {
    Clear:     { sanity: 1.00, huntChance: 1.00, huntPace: 1.00 },
    Rainstorm: { sanity: 1.00, huntChance: 1.00, huntPace: 1.00 },
    Snow:      { sanity: 0.95, huntChance: 1.00, huntPace: 1.00 },
    Bloodmoon: { sanity: 1.25, huntChance: 1.40, huntPace: 1.20 }
  };

  /* ------------ Placeables / rules ------------ */
  window.PP.rules = {
    crucifixBaseRadius:  3.0,
    crucifixDemonRadius: 5.0
  };

  /* ------------ Lightweight shared state (initialized here) ------------ */
  window.PP.state = window.PP.state || {
    running: false,
    sanity: 100,
    controls: { forward:false, back:false, left:false, right:false },
    selectedSlot: 0   // 0=none, 1..3 (belt). Lighter is separate.
  };
  
  console.log("[Settings] Global PP config initialized.");
}

/**
 * Initializes the global PP runtime helpers.
 * This logic was moved from pp_runtime.js to fix a loading error.
 */
function initializeRuntime() {
    // FIX: Cast to Window['PP'] to fix assignment and subsequent property access errors.
    const PP = (window.PP = (window.PP || {}) as Window['PP']);
    if (PP.runtime) return;

    PP.globals = PP.globals || {};

    function trySet(obj: any, key: string, value: any) {
        try { obj[key] = value; } catch { /* read-only getter – ignore */ }
    }

    PP.runtime = {
        exportGlobals(engine: any, scene: any, camera: any) {
            PP.globals.engine = engine;
            PP.globals.scene  = scene;
            PP.globals.camera = camera;
            
            trySet(window, "engine", engine);
            trySet(window, "scene",  scene);
            trySet(window, "camera", camera);
            
            trySet(window,"__ENGINE", engine);
            trySet(window,"__SCENE",  scene);
            trySet(window,"__camera", camera);
        }
    };
    
    PP.readySignals = {};
    PP._resolveReady = {};

    PP.signalReady = function(name: string) {
        if (PP._resolveReady[name]) {
            PP._resolveReady[name]();
        } else {
            PP.readySignals[name] = Promise.resolve();
        }
        console.log(`[Runtime] Signal '${name}' is ready.`);
    };

    PP.waitFor = function(names: string | string[]) {
        if (!Array.isArray(names)) {
            names = [names];
        }
        const promises = names.map(name => {
            if (!PP.readySignals[name]) {
                PP.readySignals[name] = new Promise<void>(resolve => {
                    PP._resolveReady[name] = resolve;
                });
            }
            return PP.readySignals[name];
        });
        return Promise.all(promises);
    };
    
    console.log("[Runtime] Global PP runtime helpers initialized.");
}


const scriptsToLoad = [
  // IMPORTANT: Assumes Babylon.js is loaded from a CDN in index.html

  // 1. Foundational Settings & Runtime
  // 'assets/dev/util/modular_settings.js', // Inlined into this file to fix load error
  // 'assets/dev/util/pp_runtime.js',      // Inlined into this file to fix load error

  // 2. Core Game Systems
  'assets/dev/util/player_rig_controller.js',
  'assets/dev/game/ghost_data.js',
  'assets/dev/game/ghost_logic.js',
  'assets/dev/util/input_manager.js',
  'assets/dev/util/pointer_lock_manager.js',
  'assets/dev/util/env_and_sound.js',

  // 3. World and Map Loading
  'assets/dev/game/map_loader.js',
  'assets/models/map/map_manager.js',
  'phasma_map_and_ghost.js', // Procedural Generator

  // 4. Gameplay Logic, Items, and Tools
  'assets/dev/game/inventory_system.js',
  'assets/dev/systems/salt_system.js',
  'assets/dev/systems/writing_book.js',
  'assets/dev/systems/uv_prints.js',
  'assets/dev/game/lighter.js',
  'assets/dev/game/lantern.js',
  'assets/dev/tools/dots_system.js',
  'assets/dev/tools/emf.js',
  'assets/dev/tools/parabolic_mic.js',
  'assets/dev/tools/spirit_box.js',

  // 5. UI Systems
  'assets/dev/ui/belt_manager.js',
  'assets/dev/ui/hud_ui.js',
  'assets/dev/ui/notebook_ui.js',
  'assets/dev/ui/reticle.js',
  'assets/dev/ui/van_ui.js',

  // 6. Effects and Utilities
  'assets/dev/effects/effects_sanity_med.js',
  'assets/dev/util/ghost_cam.js',
  'assets/dev/util/minimap_northup_xyz.js',
  'assets/dev/util/moon.js',
  'assets/dev/util/gameplay_patch.js',
  'assets/dev/util/ps5_controller.js',

  // 7. Developer Tools (Load these near the end)
  'assets/dev/tools/devtools.js',
  'assets/dev/tools/ghost_dev.js',
  'assets/dev/tools/logger.js',

  // 8. Bootstrap (The final script to start the game)
  'assets/dev/game/bootstrap.js'
];

/**
 * Loads a script dynamically and returns a promise that resolves when it's loaded.
 * @param {string} src The source URL of the script.
 * @returns {Promise<HTMLScriptElement>}
 */
function loadScript(src: string): Promise<HTMLScriptElement> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = false; // Ensure scripts are executed in the order they are appended
    script.onload = () => {
        console.log(`[Loader] Loaded: ${src}`);
        resolve(script);
    };
    script.onerror = () => reject(new Error(`[Loader] Script load error for ${src}`));
    document.body.appendChild(script);
  });
}

/**
 * Main function to load all game scripts sequentially.
 */
async function main() {
  initializeSettings(); // Initialize settings first
  initializeRuntime(); // Initialize runtime helpers next
  console.log('[Loader] Starting sequential script loading...');
  for (const src of scriptsToLoad) {
    try {
      await loadScript(src);
    } catch (error) {
      console.error(error);
      const loadingText = document.getElementById('loading-text');
      if (loadingText) {
          loadingText.textContent = 'A critical file failed to load. Please check the console.';
      }
      // Stop loading if a script fails
      return; 
    }
  }
  console.log('[Loader] All scripts loaded successfully. Bootstrap will now run.');
}

// Start the loading process once the DOM is ready.
document.addEventListener('DOMContentLoaded', main);

// FIX: Add an empty export to make this file a module, which is required for `declare global`.
export {};