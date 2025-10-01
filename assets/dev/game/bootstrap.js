
(function(){
"use strict";

const log = (...a) => console.log("[Bootstrap]", ...a);
const warn = (...a) => console.warn("[Bootstrap]", ...a);

let engine, scene, camera;

const state = {
    isStarted: false,
    selectedGhost: null,
    foundEvidence: new Set(),
};
window.PP = window.PP || {};
// Merge with existing state to preserve values from modular_settings.js
window.PP.state = Object.assign(window.PP.state || {}, state);
window.PP.gameHasRenderedFirstFrame = false;

function showLoading(show, percent, text, subText) {
    const loadingOverlay = document.getElementById('loading-overlay');
    const loadingBar = document.getElementById('loading-bar');
    const loadingText = document.getElementById('loading-text');
    const loadingSubText = document.getElementById('loading-sub-text');

    if (!loadingOverlay || !loadingBar || !loadingText || !loadingSubText) return;

    if (show) {
        loadingOverlay.style.display = 'flex';
        setTimeout(()=> loadingOverlay.style.opacity = '1', 10);
        if (percent !== undefined) {
             loadingBar.style.width = `${percent}%`;
        }
        if (text) {
             loadingText.textContent = text;
        }
        if (subText !== undefined) {
            loadingSubText.textContent = subText;
        }
    } else {
        loadingOverlay.style.opacity = '0';
        setTimeout(()=> loadingOverlay.style.display = 'none', 500);
    }
}
window.showLoading = showLoading;

async function setupEngine() {
    log("1. Setting up engine and scene...");
    
    const canvas = document.getElementById('renderCanvas');
    if (!canvas) {
        throw new Error("renderCanvas element not found in the DOM!");
    }
    
    engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
    scene = new BABYLON.Scene(engine);
    scene.collisionsEnabled = true;
    scene.gravity = new BABYLON.Vector3(0, -9.81, 0);

    camera = new BABYLON.FreeCamera("mainCam", new BABYLON.Vector3(0, 1.8, -5), scene);
    camera.attachControl(canvas, false); // Attach control later if needed
    scene.activeCamera = camera;

    const hemi = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene);
    hemi.intensity = 0.8;
    scene.clearColor = new BABYLON.Color4(0.0, 0.0, 0.0, 1.0);

    // SMOKE TEST: Add simple, highly visible geometry to confirm rendering works.
    const debugGround = BABYLON.MeshBuilder.CreateGround("debugGround", {width: 20, height: 20}, scene);
    debugGround.isPickable = false;
    const debugSphere = BABYLON.MeshBuilder.CreateSphere("debugSphere", {diameter: 1}, scene);
    debugSphere.position.y = 1;
    debugSphere.isPickable = false;
    const debugMat = new BABYLON.StandardMaterial("debugMat", scene);
    debugMat.diffuseColor = new BABYLON.Color3(1.0, 0.0, 1.0); // Bright magenta
    debugGround.material = debugMat;
    debugSphere.material = debugMat;

    window.engine = engine;
    window.scene = scene;
    window.camera = camera;
    
    PP.runtime?.exportGlobals(engine, scene, camera);

    window.addEventListener('resize', () => engine.resize());
    
    // START RENDER LOOP IMMEDIATELY FOR THE SMOKE TEST
    engine.runRenderLoop(() => {
        if (scene && scene.activeCamera) {
            scene.render();
        }
    });
    
    log("Engine and scene OK. Render loop started for smoke test.");
}

async function loadSelectedMap(mapId) {
    const mapData = PP.mapManifest.find(m => m.id === mapId);
    if (!mapData) {
        throw new Error(`Map with id "${mapId}" not found in manifest.`);
    }

    log(`Loading map: ${mapData.title}`);
    if (mapData.id === 'procedural_house' && window.ProHouseGenerator) {
        await window.ProHouseGenerator.generateMap(scene);
        log("Procedural map generated.");
    } else if (mapData.file && window.PP.mapManager && typeof window.PP.mapManager.loadMap === 'function') {
        await window.PP.mapManager.loadMap(mapData);
        log("Static map loaded.");
    } else {
        throw new Error(`Map '${mapData.title}' has no valid loader defined.`);
    }
}

async function setupMapAndWeather(mapId) {
    log("3. Loading map and initializing weather...");
    showLoading(true, 40, "Building World...", "Generating map layout...");
    
    await loadSelectedMap(mapId);

    showLoading(true, 70, "Building World...", "Initializing weather systems...");
    if(window.EnvAndSound && typeof window.EnvAndSound.firstInteractionBoot === 'function') {
        window.EnvAndSound.firstInteractionBoot();
        const weathers = ["Clear", "Rainstorm", "Snow", "Bloodmoon"];
        const choice = weathers[Math.floor(Math.random() * weathers.length)];
        window.EnvAndSound.setWeather(choice, { intensity: 0.5 + Math.random() * 0.5 });
        log(`Initial weather set to: ${choice}`);
    } else {
        warn("EnvAndSound system not found.");
    }

    if (typeof window.applyDoorsConfig === 'function') {
        window.applyDoorsConfig(scene);
        log("Door configurations applied.");
    }
}

function setupGameplaySystems() {
    log("4. Initializing gameplay systems...");
    showLoading(true, 75, "Waking Entities...", "Initializing ghost logic...");

    // Init ghost logic FIRST, so PP.ghost object with methods exists
    if (PP.ghost?.init) {
        PP.ghost.init(scene);
        log("Initialized ghost logic.");
    } else {
        warn("Ghost logic module not found for initialization.");
    }

    // Now select ghost DATA and assign it to the ghost logic object
    showLoading(true, 80, "Waking Entities...", "Selecting a ghost...");
    const ghostNames = Object.keys(PP.GHOST_DATA || {});
    if (ghostNames.length > 0) {
        const randomGhostName = ghostNames[Math.floor(Math.random() * ghostNames.length)];
        PP.state.selectedGhost = PP.GHOST_DATA[randomGhostName];
        log(`Selected Ghost: ${PP.state.selectedGhost.name}`);
        if (window.PP.ghost) {
            window.PP.ghost.data = PP.state.selectedGhost;
        }
    } else {
        warn("GHOST_DATA is empty! Cannot select a ghost.");
    }
    
    showLoading(true, 85, "Waking Entities...", "Initializing tools and systems...");
    if (PP.inventory?.models?.init) {
        PP.inventory.models.init(scene);
        log("Initialized item models.");
    }
    
    Object.values(PP.tools || {}).forEach(tool => {
        if (typeof tool.init === 'function') {
            try {
                tool.init(scene);
            } catch (e) {
                warn(`Error initializing a tool:`, e);
            }
        }
    });
    
    ['salt', 'writing_book', 'uv_prints', 'lantern', 'lighter'].forEach(sysName => {
        const sys = window.PP_SYSTEMS?.[sysName] || window[sysName.toUpperCase()];
        if(sys && typeof sys.init === 'function') {
             try {
                sys.init(scene);
             } catch(e){
                warn(`Error initializing system ${sysName}:`, e);
             }
        }
    });
}

async function startGame(mapId) {
    if (PP.state.isStarted) return;
    log(`Starting game content loading for map: ${mapId}`);
    
    showLoading(true, 25, "Creating Player...", "");
    
    await setupMapAndWeather(mapId);
    setupGameplaySystems();
    
    showLoading(true, 90, "Finalizing...");
    
    PP.state.isStarted = true;
    window.__PP_ALREADY_STARTED__ = true;
    window.dispatchEvent(new CustomEvent('pp:start'));
    log("Game start event dispatched!");

    if(window.PlayerRig) {
        log("Enabling player movement.");
        window.PlayerRig.enableMovement(true);
    }
    
    PP.pointerLock?.lock();
    
    setTimeout(() => {
        showLoading(false);
    }, 500);
}

function setupGlobalHelpers() {
    window.PP.checkForEvidence = (evidenceKey) => {
        if (!PP.state.selectedGhost) return false;
        return PP.state.selectedGhost.evidence.includes(evidenceKey);
    };

    window.PP.foundEvidence = (evidenceKey) => {
        PP.state.foundEvidence.add(evidenceKey);
        log(`Evidence found: ${evidenceKey}. Total: ${PP.state.foundEvidence.size}/3`);
        window.dispatchEvent(new CustomEvent('pp:evidence:found', { detail: { evidence: evidenceKey }}));
    };

    window.addEventListener('pp:belt:equip', (e) => {
        const { item, slot } = e.detail;
        if (!item) return;
        window.dispatchEvent(new CustomEvent('pp:belt:unequip_all', { detail: { except: item.id } }));
        window.dispatchEvent(new CustomEvent(`pp:tool:equip:${item.id}`));
    });

     window.addEventListener('pp:belt:unequip', (e) => {
        const { item, slot } = e.detail;
        if (!item) return;
        window.dispatchEvent(new CustomEvent(`pp:tool:unequip:${item.id}`));
    });
}

async function initialize() {
    setupGlobalHelpers();
    
    const fallbackBtn = document.getElementById('fallback-refresh-btn');
    if (fallbackBtn) {
        fallbackBtn.addEventListener('click', () => window.location.reload());
    }
    
    const fallbackTimer = setTimeout(() => {
        if (!window.PP.gameHasRenderedFirstFrame) {
            console.error("Fallback Triggered: Game failed to render a frame within 15 seconds.");
            showLoading(false);
            const fallbackOverlay = document.getElementById('fallback-overlay');
            if (fallbackOverlay) fallbackOverlay.style.display = 'flex';
        }
    }, 15000);

    try {
        log("Waiting for critical systems to be ready...");
        showLoading(true, 5, "Initializing...", "Waiting for systems...");
        await PP.waitFor([
            'playerRig',
            'ghostLogic',
            'mapLoader',
            'proceduralGenerator',
            'inputManager',
            'envAndSound',
            'pointerLock'
        ]);
        log("All systems ready. Proceeding with engine setup.");

        showLoading(true, 10, "Initializing Engine...", "Setting up Babylon.js");
        await setupEngine();
        
        // This is the gatekeeper. The rest of the game only loads if a frame renders.
        scene.onAfterRenderObservable.addOnce(async () => {
            try {
                log("First frame rendered successfully (Smoke Test Passed).");
                window.PP.gameHasRenderedFirstFrame = true;
                clearTimeout(fallbackTimer);
                
                // Clean up the debug geometry now that we know the engine works.
                scene.getMeshByName("debugGround")?.dispose();
                scene.getMeshByName("debugSphere")?.dispose();
                scene.getMaterialByName("debugMat")?.dispose();
                
                // Now, load the actual game assets.
                showLoading(true, 20, "Loading Game...", "Smoke test passed.");
                await startGame('procedural_house');
            } catch(error) {
                console.error("CRITICAL FAILURE DURING GAME START:", error);
                clearTimeout(fallbackTimer);
                showLoading(false);
                const fallbackOverlay = document.getElementById('fallback-overlay');
                if (fallbackOverlay) fallbackOverlay.style.display = 'flex';
            }
        });

    } catch(error) {
        console.error("CRITICAL FAILURE DURING INITIALIZATION:", error);
        clearTimeout(fallbackTimer);
        showLoading(false);
        const fallbackOverlay = document.getElementById('fallback-overlay');
        if (fallbackOverlay) fallbackOverlay.style.display = 'flex';
    }
}

// Since this script is guaranteed to run last, we can now safely initialize directly.
initialize();

})();
