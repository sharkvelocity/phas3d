
(function(){
"use strict";
if(window.PP && window.PP.mapManager) return;
window.PP = window.PP || {};
const BASE_URL = "https://sharkvelocity.github.io/phas3d/";

let currentMapRoot = null;
const log  = (...a)=>{ try{ console.log("[mapManager]", ...a); }catch{} };
const warn = (...a)=>{ try{ console.warn("[mapManager]", ...a); }catch{} };

async function loadMap(mapData) {
    const scene = window.scene;
    if (!scene) {
        warn("Scene is not available for map loading.");
        return;
    }

    // Clean up the previous map if it exists
    if (currentMapRoot) {
        log("Disposing of previous map...");
        currentMapRoot.dispose();
        currentMapRoot = null;
    }

    if (!mapData || !mapData.file) {
        warn("Invalid map data provided.", mapData);
        throw new Error("Invalid map data. Cannot load map.");
    }

    const mapUrl = `${BASE_URL}assets/models/map/${mapData.file}`;
    log(`Loading map: ${mapUrl}`);

    try {
        const result = await BABYLON.SceneLoader.ImportMeshAsync(null, "", mapUrl, scene);
        
        // Create a root node to parent all map meshes for easy management
        currentMapRoot = new BABYLON.TransformNode(`mapRoot_${mapData.file}`, scene);

        result.meshes.forEach(mesh => {
            mesh.parent = currentMapRoot;
            
            // A simple heuristic to avoid enabling collisions on small detail meshes like foliage
            const name = mesh.name.toLowerCase();
            if (!name.includes("plant") && !name.includes("leaf") && !name.includes("grass")) {
               mesh.checkCollisions = true;
            }
            
            mesh.receiveShadows = true;

            // Example of how you would add casters to a shadow generator if one exists
            // if (window.shadowGenerator) {
            //     window.shadowGenerator.addShadowCaster(mesh);
            // }
        });

        log(`Map '${mapData.title}' loaded and processed successfully.`);

    } catch (error) {
        warn(`Failed to load map file: ${mapUrl}`, error);
        // Re-throw the error so the loader in bootstrap.js can catch it
        throw error;
    }
}

PP.mapManager = {
    loadMap
};

log("Map Manager initialized.");
})();