// index.tsx
// This file is now the central entry point for the application,
// responsible for loading all necessary scripts in the correct order.

/**
 * Loads a script dynamically and returns a promise that resolves when it's loaded.
 * @param src The URL of the script to load.
 * @returns A promise that resolves on successful load or rejects on error.
 */
function loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = false; // Important to maintain execution order
        script.onload = () => {
            console.log(`[ScriptLoader] Loaded: ${src}`);
            resolve();
        };
        script.onerror = () => {
            const errorMsg = `[ScriptLoader] FAILED to load: ${src}`;
            console.error(errorMsg);
            reject(new Error(errorMsg));
        };
        document.body.appendChild(script); // Appending to body is generally safer
    });
}

/**
 * Loads a list of scripts sequentially, waiting for each to finish before starting the next.
 * @param urls An array of script URLs to load in order.
 */
async function loadScriptsSequentially(urls: string[]): Promise<void> {
    console.log('[ScriptLoader] Starting sequential script loading...');
    for (const url of urls) {
        try {
            await loadScript(url);
        } catch (error) {
            console.error(error);
            const fallbackOverlay = document.getElementById('fallback-overlay');
            if (fallbackOverlay) {
                fallbackOverlay.style.display = 'flex';
                const p = fallbackOverlay.querySelector('p');
                if (p) p.textContent = `Failed to load a critical game file: ${url}. Please try refreshing.`;
            }
            break;
        }
    }
    console.log('[ScriptLoader] All scripts should be loaded and executed.');
}

// The complete list of scripts required by the application, in order.
const SCRIPTS_TO_LOAD = [
    // External Libraries
    "https://sharkvelocity.github.io/3d/cdn/babylon.js",
    "https://sharkvelocity.github.io/3d/cdn/earcut.min.js",
    "https://sharkvelocity.github.io/3d/cdn/materialsLibrary/babylonjs.materials.min.js",
    "https://sharkvelocity.github.io/3d/cdn/materialsLibrary/babylon.skyMaterial.min.js",
    "https://sharkvelocity.github.io/3d/cdn/meshopt_decoder.js",
    "https://sharkvelocity.github.io/3d/cdn/draco_decoder_gltf.js",
    "https://sharkvelocity.github.io/3d/cdn/loaders/babylonjs.loaders.min.js",
    "https://sharkvelocity.github.io/3d/cdn/gui/babylon.gui.min.js",
    "https://sharkvelocity.github.io/3d/cdn/inspector/babylon.inspector.bundle.js",
    "https://sharkvelocity.github.io/3d/cdn/cannon.js",
    
    // Core Config & Data
    "assets/dev/util/pp_runtime.js",
    "assets/dev/util/modular_settings.js",
    "assets/dev/game/ghost_data.js",
    "assets/dev/game/ghost_logic.js",
    "assets/dev/game/map_loader.js",
    "phasma_map_and_ghost.js",

    // Core Systems
    "assets/dev/util/pointer_lock_manager.js",
    "assets/dev/util/input_manager.js",
    "assets/dev/util/ps5_controller.js",
    "assets/dev/util/env_and_sound.js",
    "assets/models/map/map_manager.js",
    "assets/dev/util/player_rig_controller.js",
    "assets/dev/util/moon.js",

    // UI Systems
    "assets/dev/ui/reticle.js",
    "assets/dev/ui/hud_ui.js",
    "assets/dev/ui/belt_manager.js",
    "assets/dev/ui/notebook_ui.js",
    "assets/dev/ui/van_ui.js",
    "assets/dev/util/minimap_northup_xyz.js",

    // Item & Evidence Systems
    "assets/dev/game/inventory_system.js",
    "assets/dev/systems/salt_system.js",
    "assets/dev/systems/writing_book.js",
    "assets/dev/systems/uv_prints.js",
    "assets/dev/game/lighter.js",
    "assets/dev/game/lantern.js",
    "assets/dev/tools/dots_system.js",
    "assets/dev/tools/emf.js",
    "assets/dev/tools/spirit_box.js",
    "assets/dev/tools/parabolic_mic.js",
    "assets/dev/effects/effects_sanity_med.js",

    // Dev Tools (load before bootstrap, after systems)
    "assets/dev/util/ghost_cam.js",
    "assets/dev/util/devtools.js",
    "assets/dev/tools/ghost_dev.js",
    "assets/dev/tools/logger.js",

    // Map Generation & Patches
    "assets/dev/util/gameplay_patch.js",

    // Game Entry Point (MUST BE LAST)
    "assets/dev/game/bootstrap.js",
];

// Kick off the loading process.
loadScriptsSequentially(SCRIPTS_TO_LOAD);
