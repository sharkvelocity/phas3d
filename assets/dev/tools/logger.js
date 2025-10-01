/**
 * logger.js — Simulation logger for PhasmaPhoney
 * Records player, camera, and ghost events.
 * Save with Alt+S.
 */
(function(){
    if(window.SimLog) return;

    window.SimLog = {
        events: [],
        enabled: true,
        record: function(type, data){ 
            if(!this.enabled) return;
            this.events.push({ time: performance.now(), type, data }); 
        },
        exportJSON: function(){ return JSON.stringify(this.events,null,2); },
        saveToFile: function(filename="sim_log.json"){
            try{
                const blob = new Blob([this.exportJSON()], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = filename;
                a.click();
                URL.revokeObjectURL(url);
                console.log("[SimLog] Saved", this.events.length, "events");
            }catch(e){ console.warn("[SimLog] Save failed", e); }
        }
    };

    // ---------- Hooks ----------
    const recordPlayer = ()=> {
        const rigRoot = window.PlayerRig?.getRigRoot();
        if(rigRoot) SimLog.record("playerTick", { pos: {x: rigRoot.position.x, y: rigRoot.position.y, z: rigRoot.position.z} });
    };
    const recordCamera = ()=> {
        const cam = window.camera;
        if(cam) SimLog.record("cameraTick", { pos: {x: cam.globalPosition.x, y: cam.globalPosition.y, z: cam.globalPosition.z}, rot: {x: cam.rotation.x, y: cam.rotation.y, z: cam.rotation.z} });
    };
    
    function startLogging() {
        const scene = window.scene;
        if (scene) {
            scene.onBeforeRenderObservable.add(()=>{
                recordPlayer();
                recordCamera();
            });
            console.log("[SimLog] Player and camera tick logging attached.");
        } else {
            console.warn("[SimLog] Scene not ready for logging hooks.");
        }
    }
    
    // Example: hook into a custom event for ghost attacks
    window.addEventListener("pp:ghost:attack", (e) => {
        SimLog.record("ghostAttack", { ghost: e.detail?.ghostType, target: e.detail?.target });
    });

    // ---------- Keyboard Shortcut: Alt+S ----------
    window.addEventListener("keydown",(e)=>{
        if(e.altKey && e.code==="KeyS"){
            e.preventDefault();
            SimLog.saveToFile();
        }
    });
    
    window.addEventListener("pp:start", startLogging, { once: true });

    console.log("[SimLog] Initialized — Alt+S to save log");
})();
