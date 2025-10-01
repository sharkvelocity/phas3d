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
      // FIX: Made state a required property.
      state: any;

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
      // FIX: Made GHOST_DATA and ALL_EVIDENCE required to match TS inference from JS files.
      GHOST_DATA: any;
      ALL_EVIDENCE: string[];
      // FIX: Made cfg a required property.
      cfg: any;
      // FIX: Made storage a required property.
      storage: any;
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
    // FIX: Added missing global properties to the Window interface.
    scene?: any;
    BABYLON?: any;
    PlayerRig?: any;
    PP_SPAWN_POS?: any;
    GHOST_DEV_FORCE_VISIBLE?: boolean;
  }
}

/**
 * Initializes the global PP settings object.
 * This logic was moved from modular_settings.js to fix a loading error.
 */
function initializeSettings() {
  // FIX: Cast to Window['PP'] to inform TypeScript of the object's full potential shape, resolving assignment errors.
  // FIX: Provide default values for required properties GHOST_DATA and ALL_EVIDENCE.
  // FIX: Add `cfg`, `state`, and `storage` to the initial object to satisfy TypeScript's inferred global type for PP, which requires these properties.
  // FIX: Use `null` for GHOST_DATA to satisfy the inferred type, which expects a complex object, not `{}`.
  window.PP = (window.PP || { GHOST_DATA: null, ALL_EVIDENCE: [], cfg: {}, state: {}, storage: {} }) as Window['PP'];

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
    // FIX: Provide default values for required properties.
    // FIX: Add `cfg`, `state`, and `storage` to the initial object to satisfy TypeScript's inferred global type for PP, which requires these properties.
    // FIX: Use `null` for GHOST_DATA to satisfy the inferred type, which expects a complex object, not `{}`.
    const PP = (window.PP = (window.PP || { GHOST_DATA: null, ALL_EVIDENCE: [], cfg: {}, state: {}, storage: {} }) as Window['PP']);
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

/**
 * Initializes the Player Rig Controller.
 * This logic was moved from player_rig_controller.js to fix a loading error.
 */
function initializePlayerRigController() {
    /* fp_tp_sync.js — single-rig FP/TP with no rubberbanding (v2.3 - Modular Input)
       - Loads the player model from assets/models/player/ and attaches it to the rig.
       - Hides player model in first-person view.
       - MOVEMENT is now driven by the unified input_manager.js via PP.getMovementFlags().
       - Mouse look for camera control remains handled internally.
       - rigRoot -> yaw -> head -> handNode ; camera attaches to head (FP) or trails (TP)
    */
    (function(){
      if ((window as any).__FP_TP_SYNC_V2_3__) return; (window as any).__FP_TP_SYNC_V2_3__ = true;
    
      const log  = (...a: any[])=>{ try{ console.log("[PlayerRig v2.3]", ...a);}catch(_){} };
      const warn = (...a: any[])=>{ try{ console.warn("[PlayerRig v2.3]", ...a);}catch(_){} };
      const toRad = (d: number) => d * Math.PI / 180;
      const clamp = (v: number,min: number,max: number)=> Math.max(min, Math.min(max,v));
      const cfg = ()=> window.PP?.controls;
      const BASE_URL = "https://sharkvelocity.github.io/3d/";
    
      const S = {
        rigRoot:null as any, yawNode:null as any, head:null as any, handNode:null as any, body:null as any,
        mode:"fp",
        tpIdx:1, tpDists:[2.6,3.6,4.8,6.0],
        yaw:0, pitch:0,
        velY:0,
        gravity:-9.8, grounded:true,
        running:false,
        movementEnabled: false,
      };
    
      // FIX: Use window.scene which is now typed on the Window interface.
      function scene(){ return window.scene || (window.BABYLON && window.BABYLON.Engine.LastCreatedScene) || null; }
      function cam(){ const s=scene(); return s && s.activeCamera; }
    
      async function ensureRig(s: any){
        if (S.rigRoot) return;
        const c = cam();
        // FIX: Remove `(window as any)` casts
        const start = window.PP_SPAWN_POS || (c?.position?.clone?.()) || new window.BABYLON.Vector3(0,1.8,0);
    
        const rigRoot = new window.BABYLON.TransformNode("rigRoot", s);
        rigRoot.position.copyFrom(start);
    
        const yaw = new window.BABYLON.TransformNode("rigYaw", s);
        yaw.parent = rigRoot;
    
        const head = new window.BABYLON.TransformNode("rigHead", s);
        head.parent = yaw;
        head.position.set(0, 1.6, 0);
    
        const handNode = new window.BABYLON.TransformNode("handNode", s);
        handNode.parent = head;
        handNode.position.set(0.25, -0.4, 0.7);
    
        S.rigRoot=rigRoot; S.yawNode=yaw; S.head=head; S.handNode=handNode;
        
        try {
            // FIX: Remove `(window as any)` cast
            const result = await window.BABYLON.SceneLoader.ImportMeshAsync(null, `${BASE_URL}assets/models/player/`, "main_player.glb", s);
            const body = result.meshes[0];
            if (body) {
                body.name = "player_body_root";
                body.parent = rigRoot;
                body.position.set(0, 0, 0);
                // FIX: Remove `(window as any)` cast
                body.rotationQuaternion = window.BABYLON.Quaternion.FromEulerAngles(0, Math.PI, 0);
                S.body = body;
                result.meshes.forEach((m: any) => { m.isPickable = false; });
                log("Player model loaded and attached.");
            }
        } catch (e) {
            warn("Could not load player model. Creating a fallback capsule.", e);
            // FIX: Remove `(window as any)` cast
            const body = window.BABYLON.MeshBuilder.CreateCapsule("player_capsule", {height: 1.7, radius: 0.3}, s);
            body.isPickable = false;
            body.parent = rigRoot;
            body.position.set(0, 1.7/2, 0);
            S.body = body;
        }
    
        if (c?.rotation){
          S.pitch = c.rotation.x||0;
          S.yaw   = c.rotation.y||0;
        }
        yaw.rotation.y = S.yaw;
      }
    
      function clearCameraInputs(s: any){
        const c = cam(); if (!c) return;
        try{ c.inputs.clear(); }catch(_){}
        c.checkCollisions = true;
        c.applyGravity = false;
        c.inertia = 0;
        c.parent = null;
      }
    
      function attachFP(s: any){
        const c=cam(); if(!c) return;
        c.parent = S.head;
        c.position.set(0,0,0);
        c.rotation.set(0,0,0);
        c.fov = 0.9;
        S.mode="fp";
        if (S.body) S.body.setEnabled(false);
      }
    
      function attachTP(s: any){
        const c=cam(); if(!c) return;
        c.parent = null;
        const d = S.tpDists[S.tpIdx]||3.6;
        const headWS = S.head.getAbsolutePosition();
        const yaw=S.yaw, cos=Math.cos(yaw), sin=Math.sin(yaw);
        // FIX: Remove `(window as any)` cast
        const back = new window.BABYLON.Vector3(-sin*d, 0.25, -cos*d);
        const pos = headWS.add(back);
        c.position.copyFrom(pos);
        c.setTarget(headWS);
        c.fov=0.9;
        S.mode="tp";
        if (S.body) S.body.setEnabled(true);
      }
    
      function toggleView(s: any, cycleOnly: boolean){
        if (S.mode==="tp" && cycleOnly){ S.tpIdx=(S.tpIdx+1)%S.tpDists.length; attachTP(s); return; }
        if (S.mode==="fp") attachTP(s); else attachFP(s);
      }
    
      function hookPointer(s: any){
        s.onPointerObservable.add((pi: any)=>{
          // FIX: Remove `(window as any)` cast
          if (!S.movementEnabled || pi.type !== window.BABYLON.PointerEventTypes.POINTERMOVE) return;
          if (!window.PP.pointerLock?.isLocked()) return;
          
          const ev = pi.event;
          const dx = ev.movementX||0, dy = ev.movementY||0;
          const sens = cfg()?.mouseSens || 0.0022;
    
          S.yaw   += dx * sens;
          S.pitch  = clamp(S.pitch - dy * sens, -toRad(89), toRad(89));
          S.yaw = (S.yaw + Math.PI*2)%(Math.PI*2);
        });
      }
    
      function moveRig(dt: number){
        if (!S.movementEnabled) return;
        
        const flags = window.PP.getMovementFlags ? window.PP.getMovementFlags() : { forward:false, back:false, left:false, right:false, running:false };
    
        const yaw=S.yaw, cos=Math.cos(yaw), sin=Math.sin(yaw);
        // FIX: Remove `(window as any)` cast
        const fwd = new window.BABYLON.Vector3(sin, 0, cos);
        const right= new window.BABYLON.Vector3(cos, 0, -sin);
    
        let x=0, z=0;
        if (flags.forward) z += 1;
        if (flags.back) z -= 1;
        if (flags.right) x += 1;
        if (flags.left) x -= 1;
    
        const speeds = window.PP.getSpeeds ? window.PP.getSpeeds() : { walk: 1.8, run: 3.2 };
        let spd = flags.running ? speeds.run : speeds.walk;
    
        // FIX: Remove `(window as any)` cast
        const dir = new window.BABYLON.Vector3(0,0,0);
        if (x) dir.addInPlace(right.scale(x));
        if (z) dir.addInPlace(fwd.scale(z));
        if (dir.lengthSquared()>0.0001) dir.normalize();
    
        const move = dir.scale(spd*dt);
        S.rigRoot.moveWithCollisions(move);
    
        if (!S.grounded) S.velY += S.gravity * dt;
        
        // FIX: Remove `(window as any)` cast
        const gravMove = new window.BABYLON.Vector3(0, S.velY * dt, 0);
        S.rigRoot.moveWithCollisions(gravMove);
        
        const s = scene();
        // FIX: Remove `(window as any)` casts
        const groundRay = new window.BABYLON.Ray(S.rigRoot.position, new window.BABYLON.Vector3(0, -1, 0), 1.1);
        const hit = s.pickWithRay(groundRay, (mesh: any) => mesh.isPickable && mesh.checkCollisions);
        if (hit && hit.hit) {
            S.velY = 0;
            S.grounded = true;
        } else {
            S.grounded = false;
        }
      }
      
      function applyRigToNodes(){
        S.yawNode.rotation.y = S.yaw;
        S.head.rotation.x = S.pitch;
    
        const c=cam(); if(!c) return;
        if (S.mode==="fp"){
          if (c.parent !== S.head) attachFP(scene());
          c.rotation.set(0,0,0);
          c.position.set(0,0,0);
        } else {
          if (c.parent) c.parent=null;
          const d=S.tpDists[S.tpIdx]||3.6;
          const headWS=S.head.getAbsolutePosition();
          const yaw=S.yaw, cos=Math.cos(yaw), sin=Math.sin(yaw);
          // FIX: Remove `(window as any)` cast
          const back=new window.BABYLON.Vector3(-sin*d, 0.25, -cos*d);
          const pos=headWS.add(back);
          c.position.copyFrom(pos);
          c.setTarget(headWS);
        }
      }
    
      function loop(){
        const s=scene(); if(!s||!cam()) { return; }
        const dt = Math.min(0.05, s.getEngine().getDeltaTime()/1000);
        moveRig(dt);
        applyRigToNodes();
      }
      
      async function start() {
        const s = scene();
        if (!s) { setTimeout(start, 100); return; }
        if (S.running) return;
        S.running = true;
    
        await ensureRig(s);
        clearCameraInputs(s);
        hookPointer(s);
        attachFP(s);
        log("online (FP default)");
    
        s.onBeforeRenderObservable.add(loop);
      }
      
      window.addEventListener('pp:start', start, { once: true });
      
      window.addEventListener('keydown', (e) => {
          const keys = cfg()?.keys?.cameraToggle;
          if (keys && keys.includes(e.code)) {
              toggleView(scene(), e.shiftKey);
          }
      });
    
      // FIX: Remove `(window as any)` cast
      window.PlayerRig = {
        getHeadNode: () => S.head,
        getHandNode: () => S.handNode,
        getRigRoot: () => S.rigRoot,
        getState: () => S,
        enableMovement: (enable: boolean) => { S.movementEnabled = !!enable; }
      };
      
      if (window.PP?.signalReady) {
        window.PP.signalReady('playerRig');
      }
    
    })();
    console.log("[Loader] Player Rig Controller inlined and initialized.");
}

/**
 * Initializes the global ghost data from an inlined object.
 * This logic was moved from ghost_data.js to fix a loading error.
 */
function initializeGhostData() {
    window.PP.GHOST_DATA = {"Spirit":{"name":"Spirit (EMF Level 5, Spirit Box, Ghost Writing)","evidence":["EMF Level 5","Spirit Box","Ghost Writing"],"hunt_sanity":null,"speed_min_mps":null,"speed_max_mps":null,"notes":"Will wait 180s after being incensed before attempting to hunt again, instead of the standard 90s","movement":{"model":"default","roam_speed":1.4,"chase_speed":2.6,"los_speedup":false}},"Wraith":{"name":"Wraith (EMF Level 5, Spirit Box, DOTS Projector)","evidence":["EMF Level 5","Spirit Box","DOTS Projector"],"hunt_sanity":null,"speed_min_mps":null,"speed_max_mps":null,"notes":"Will not be slowed down by tier 3 salt during a hunt","movement":{"model":"default","roam_speed":1.4,"chase_speed":2.6,"los_speedup":false}},"Phantom":{"name":"Phantom (Spirit Box, Ultraviolet, DOTS Projector)","evidence":["Spirit Box","Ultraviolet","DOTS Projector"],"hunt_sanity":null,"speed_min_mps":null,"speed_max_mps":null,"notes":"Less visible during hunts","movement":{"model":"default","roam_speed":1.4,"chase_speed":2.6,"los_speedup":false}},"Poltergeist":{"name":"Poltergeist (Spirit Box, Ghost Writing, Ultraviolet)","evidence":["Spirit Box","Ghost Writing","Ultraviolet"],"hunt_sanity":null,"speed_min_mps":null,"speed_max_mps":null,"notes":"During hunts, Poltergeists will throw an item every 0.5s with an increased force","movement":{"model":"default","roam_speed":1.4,"chase_speed":2.6,"los_speedup":false}},"Banshee":{"name":"Banshee (Ultraviolet, DOTS Projector, Ghost Orbs)","evidence":["Ultraviolet","DOTS Projector","Ghost Orbs"],"hunt_sanity":50,"speed_min_mps":null,"speed_max_mps":null,"notes":"Hunts based on target's sanity instead of average sanity","movement":{"model":"default","roam_speed":1.4,"chase_speed":2.6,"los_speedup":false}},"Jinn":{"name":"Jinn (EMF Level 5, Ultraviolet, Freezing)","evidence":["EMF Level 5","Ultraviolet","Freezing"],"hunt_sanity":null,"speed_min_mps":2.5,"speed_max_mps":2.5,"notes":"With the breaker on, the Jinn will speed up during a hunt if a player is in LOS and further than 3m away","movement":{"model":"distance_scaled_far","roam_speed":2.5,"chase_speed":2.5,"los_speedup":false,"near_speed":1.7,"far_speed":2.5,"far_distance":6.0}},"Mare":{"name":"Mare (Spirit Box, Ghost Writing, Ghost Orbs)","evidence":["Spirit Box","Ghost Writing","Ghost Orbs"],"hunt_sanity":60,"speed_min_mps":null,"speed_max_mps":null,"notes":"Won't hunt until 40% average sanity when light switch in its current room is in the on position (regardless of breaker state), 60% average sanity if light switch is in the off position or if the lights are broken (regard","movement":{"model":"default","roam_speed":1.4,"chase_speed":2.6,"los_speedup":false}},"Revenant":{"name":"Revenant (Ghost Writing, Ghost Orbs, Freezing)","evidence":["Ghost Writing","Ghost Orbs","Freezing"],"hunt_sanity":null,"speed_min_mps":3.0,"speed_max_mps":3.0,"notes":"During a hunt, a Revenant will be slow (1.0m/s) until it detects a player (voice, active electronic equipment, or LOS) where it will immediately speed up to 3.0m/s and remain at that speed until it reaches the players la","movement":{"model":"revenant","roam_speed":3.0,"chase_speed":3.0,"los_speedup":true,"no_los_speed":1.1,"los_speed":3.0}},"Shade":{"name":"Shade (EMF Level 5, Ghost Writing, Freezing)","evidence":["EMF Level 5","Ghost Writing","Freezing"],"hunt_sanity":35,"speed_min_mps":null,"speed_max_mps":null,"notes":"Will not hunt if in the same room as a player","movement":{"model":"default","roam_speed":1.4,"chase_speed":2.6,"los_speedup":false}},"Demon":{"name":"Demon (Ghost Writing, Ultraviolet, Freezing)","evidence":["Ghost Writing","Ultraviolet","Freezing"],"hunt_sanity":70,"speed_min_mps":null,"speed_max_mps":null,"notes":"Can hunt 60s after being smudged instead of the standard 90s","movement":{"model":"default","roam_speed":1.4,"chase_speed":2.6,"los_speedup":false}},"Yurei":{"name":"Yurei (DOTS Projector, Ghost Orbs, Freezing)","evidence":["DOTS Projector","Ghost Orbs","Freezing"],"hunt_sanity":null,"speed_min_mps":null,"speed_max_mps":null,"notes":"Only ghost that can close or interact with an exit door outside of a hunt/event","movement":{"model":"default","roam_speed":1.4,"chase_speed":2.6,"los_speedup":false}},"Oni":{"name":"Oni (EMF Level 5, DOTS Projector, Freezing)","evidence":["EMF Level 5","DOTS Projector","Freezing"],"hunt_sanity":null,"speed_min_mps":null,"speed_max_mps":null,"notes":"Blinks more frequently during hunts, making them more visible","movement":{"model":"default","roam_speed":1.4,"chase_speed":2.6,"los_speedup":false}},"Yokai":{"name":"Yokai (Spirit Box, DOTS Projector, Ghost Orbs)","evidence":["Spirit Box","DOTS Projector","Ghost Orbs"],"hunt_sanity":80,"speed_min_mps":null,"speed_max_mps":null,"notes":"Hearing/detection distance is 2.5m and less during hunts","movement":{"model":"default","roam_speed":1.4,"chase_speed":2.6,"los_speedup":false}},"Hantu":{"name":"Hantu (Ultraviolet, Ghost Orbs, Freezing)","evidence":["Ultraviolet","Ghost Orbs","Freezing"],"hunt_sanity":null,"speed_min_mps":null,"speed_max_mps":null,"notes":"Will have visible freezing breath during hunts when the breaker is off/broken","movement":{"model":"temperature_scaled","roam_speed":1.4,"chase_speed":2.6,"los_speedup":false,"warm_speed":1.4,"cold_speed":2.7}},"Goryo":{"name":"Goryo (EMF Level 5, Ultraviolet, DOTS Projector)","evidence":["EMF Level 5","Ultraviolet","DOTS Projector"],"hunt_sanity":null,"speed_min_mps":null,"speed_max_mps":null,"notes":"DOTS only appear on video camera and will not show if a player is in the same room (DOTS state can start outside of room and enter a player's room)","movement":{"model":"default","roam_speed":1.4,"chase_speed":2.6,"los_speedup":false}},"Myling":{"name":"Myling (EMF Level 5, Ghost Writing, Ultraviolet)","evidence":["EMF Level 5","Ghost Writing","Ultraviolet"],"hunt_sanity":null,"speed_min_mps":null,"speed_max_mps":null,"notes":"Footsteps and vocals cannot be heard more than 12m away during hunts (normal is 20m)","movement":{"model":"default","roam_speed":1.4,"chase_speed":2.6,"los_speedup":false}},"Onryo":{"name":"Onryo (Spirit Box, Ghost Orbs, Freezing)","evidence":["Spirit Box","Ghost Orbs","Freezing"],"hunt_sanity":60,"speed_min_mps":null,"speed_max_mps":null,"notes":"Will attempt to hunt at any sanity after extinguishing every 3rd flame","movement":{"model":"default","roam_speed":1.4,"chase_speed":2.6,"los_speedup":false}},"The Twins":{"name":"The Twins (EMF Level 5, Spirit Box, Freezing)","evidence":["EMF Level 5","Spirit Box","Freezing"],"hunt_sanity":null,"speed_min_mps":1.5,"speed_max_mps":1.5,"notes":"Ghost speed during hunts will be either 1.5m/s or 1.9m/s","movement":{"model":"twins","roam_speed":1.5,"chase_speed":1.5,"los_speedup":false,"primary_speed":1.7,"secondary_speed":1.2,"alternate_events":true}},"Raiju":{"name":"Raiju (EMF Level 5, DOTS Projector, Ghost Orbs)","evidence":["EMF Level 5","DOTS Projector","Ghost Orbs"],"hunt_sanity":65,"speed_min_mps":2.5,"speed_max_mps":2.5,"notes":"During events and hunts, causes electronic disturbance at a 15m range instead of 10m","movement":{"model":"electronics_scaled","roam_speed":2.5,"chase_speed":2.5,"los_speedup":false,"no_elec_speed":1.7,"elec_speed":2.9,"elec_radius":8.0}},"Obake":{"name":"Obake (EMF Level 5, Ultraviolet, Ghost Orbs)","evidence":["EMF Level 5","Ultraviolet","Ghost Orbs"],"hunt_sanity":null,"speed_min_mps":null,"speed_max_mps":null,"notes":"Special 6 fingered fingerprints ( Open 'Guides' tab )","movement":{"model":"default","roam_speed":1.4,"chase_speed":2.6,"los_speedup":false}},"The Mimic":{"name":"The Mimic (Spirit Box, Ultraviolet, Freezing)","evidence":["Spirit Box","Ultraviolet","Freezing"],"hunt_sanity":null,"speed_min_mps":null,"speed_max_mps":null,"notes":"Mimics a different ghost every 30 - 120 seconds, taking on all behaviors, tells, and abilities of that ghost (excluding evidence), leading to inconsistent behavior. Will always present Ghost Orbs as a fourth, fake evidence.","movement":{"model":"default","roam_speed":1.4,"chase_speed":2.6,"los_speedup":false}},"Moroi":{"name":"Moroi (Spirit Box, Ghost Writing, Freezing)","evidence":["Spirit Box","Ghost Writing","Freezing"],"hunt_sanity":null,"speed_min_mps":3.71,"speed_max_mps":3.71,"notes":"Incense blindness duration during hunts is increased from 5s to 7s","movement":{"model":"sanity_scaled","roam_speed":3.71,"chase_speed":3.71,"los_speedup":false,"min_speed":1.5,"max_speed":3.5}},"Deogen":{"name":"Deogen (Spirit Box, Ghost Writing, DOTS Projector)","evidence":["Spirit Box","Ghost Writing","DOTS Projector"],"hunt_sanity":40,"speed_min_mps":3.0,"speed_max_mps":3.0,"notes":"Very fast hunt speed, but will slow down as it nears the targeted player","movement":{"model":"distance_scaled","roam_speed":3.0,"chase_speed":3.0,"los_speedup":false,"min_speed":0.4,"max_speed":3.0,"distance_slow_radius":2.5}},"Thaye":{"name":"Thaye (Ghost Writing, DOTS Projector, Ghost Orbs)","evidence":["Ghost Writing","DOTS Projector","Ghost Orbs"],"hunt_sanity":75,"speed_min_mps":2.75,"speed_max_mps":2.75,"notes":"Hunts at 75% at its youngest, 15% at its oldest","movement":{"model":"age_scaled","roam_speed":2.75,"chase_speed":2.75,"los_speedup":false,"young_speed":2.75,"old_speed":1.0,"aging_minutes":20}}};

    // Derive the list of all possible evidence types directly from the ghost data
    // This ensures the journal and game logic are always in sync.
    const allEvidence = new Set<string>();
    Object.values(window.PP.GHOST_DATA).forEach((ghost: any) => {
      if (ghost.evidence) {
        ghost.evidence.forEach((ev: string) => allEvidence.add(ev));
      }
    });
    window.PP.ALL_EVIDENCE = Array.from(allEvidence).sort();
    console.log("[Loader] Ghost Data inlined and initialized.");
}

/**
 * Initializes the core ghost logic.
 * This logic was moved from ghost_logic.js to fix a loading error.
 */
function initializeGhostLogic() {
    if (window.PP?.ghost?.logic) return;

    const log = (...a: any[]) => console.log("[GhostLogic]", ...a);
    const warn = (...a: any[]) => console.warn("[GhostLogic]", ...a);
    
    const BASE_URL = "https://sharkvelocity.github.io/3d/assets/ghosts/";

    const GhostLogic = {
        _scene: null as any,
        _isInitialized: false,
        
        data: null as any,
        root: null as any,
        modelRoot: null as any,
        
        init: function(scene: any) {
          if (this._isInitialized || !scene) return;
          this._scene = scene;
          
          this.root = new window.BABYLON.TransformNode("GhostRoot", scene);
          this.root.position.set(0, -100, 0);
          
          this.setModel('ghost.glb');
          
          scene.onBeforeRenderObservable.add(() => this.update(scene.getEngine().getDeltaTime() / 1000));
          
          this._isInitialized = true;
          log("Initialized.");
        },
        
        setModel: async function(fileName: string) {
          if (!this.root || !this._scene) {
            warn("Cannot set model, logic not initialized properly.");
            return;
          }
          
          if (this.modelRoot) {
            this.modelRoot.dispose();
            this.modelRoot = null;
          }
          
          const fullUrl = BASE_URL + fileName;
          log(`Loading ghost model from: ${fullUrl}`);
          
          try {
            const result = await window.BABYLON.SceneLoader.ImportMeshAsync(null, "", fullUrl, this._scene);
            const loadedRoot = result.meshes[0];
            
            if (!loadedRoot) {
                throw new Error("No meshes found in the loaded GLB file.");
            }
            
            loadedRoot.name = "ghostModelRoot";
            loadedRoot.parent = this.root;
            loadedRoot.position.set(0, 0, 0);
            
            this.modelRoot = loadedRoot;
            log("Ghost model loaded successfully.");
            
            this.setVisible(window.GHOST_DEV_FORCE_VISIBLE || false);

          } catch (error) {
            warn(`Failed to load ghost model: ${fullUrl}`, error);
          }
        },
        
        setScale: function(scale: number) {
          if (this.modelRoot) {
            this.modelRoot.scaling.setAll(scale);
          }
        },
        
        setVisible: function(isVisible: boolean) {
          const shouldBeVisible = window.GHOST_DEV_FORCE_VISIBLE || isVisible;
          
          if (this.modelRoot) {
            this.modelRoot.getChildMeshes(false).forEach((m: any) => m.setEnabled(shouldBeVisible));
            this.modelRoot.setEnabled(shouldBeVisible);
          }
        },
        
        update: function(dt: number) {
          if (!this.root || !this.data) return;
          // Future AI and movement logic would go here.
        }
    };
    
    // Ensure window.PP.ghost exists before assigning to it
    // FIX: Add `state` and `storage` to the initial object to satisfy TypeScript's inferred global type for PP, which requires these properties.
    // FIX: Use `null` for GHOST_DATA to satisfy the inferred type, which expects a complex object, not `{}`.
    window.PP = (window.PP || { GHOST_DATA: null, ALL_EVIDENCE: [], cfg: {}, state: {}, storage: {} }) as Window['PP'];
    window.PP.ghost = Object.assign(window.PP.ghost || {}, GhostLogic);
    window.PP.ghost.logic = true;
    
    if (window.PP?.signalReady) {
        window.PP.signalReady('ghostLogic');
    }

    console.log("[Loader] Ghost Logic inlined and initialized.");
}

const SCRIPT_BASE_URL = "https://sharkvelocity.github.io/phas3d/";

const scriptsToLoad = [
  // IMPORTANT: Assumes Babylon.js is loaded from a CDN in index.html

  // 1. Foundational Settings & Runtime (Inlined)

  // 2. Core Game Systems
  SCRIPT_BASE_URL + 'assets/dev/util/input_manager.js',
  SCRIPT_BASE_URL + 'assets/dev/util/pointer_lock_manager.js',
  SCRIPT_BASE_URL + 'assets/dev/util/env_and_sound.js',

  // 3. World and Map Loading
  SCRIPT_BASE_URL + 'assets/dev/game/map_loader.js',
  SCRIPT_BASE_URL + 'assets/models/map/map_manager.js',
  SCRIPT_BASE_URL + 'phasma_map_and_ghost.js', // Procedural Generator

  // 4. Gameplay Logic, Items, and Tools
  SCRIPT_BASE_URL + 'assets/dev/game/inventory_system.js',
  SCRIPT_BASE_URL + 'assets/dev/systems/salt_system.js',
  SCRIPT_BASE_URL + 'assets/dev/systems/writing_book.js',
  SCRIPT_BASE_URL + 'assets/dev/systems/uv_prints.js',
  SCRIPT_BASE_URL + 'assets/dev/game/lighter.js',
  SCRIPT_BASE_URL + 'assets/dev/game/lantern.js',
  SCRIPT_BASE_URL + 'assets/dev/tools/dots_system.js',
  SCRIPT_BASE_URL + 'assets/dev/tools/emf.js',
  SCRIPT_BASE_URL + 'assets/dev/tools/parabolic_mic.js',
  SCRIPT_BASE_URL + 'assets/dev/tools/spirit_box.js',

  // 5. UI Systems
  SCRIPT_BASE_URL + 'assets/dev/ui/belt_manager.js',
  SCRIPT_BASE_URL + 'assets/dev/ui/hud_ui.js',
  SCRIPT_BASE_URL + 'assets/dev/ui/notebook_ui.js',
  SCRIPT_BASE_URL + 'assets/dev/ui/reticle.js',
  SCRIPT_BASE_URL + 'assets/dev/ui/van_ui.js',

  // 6. Effects and Utilities
  SCRIPT_BASE_URL + 'assets/dev/effects/effects_sanity_med.js',
  SCRIPT_BASE_URL + 'assets/dev/util/ghost_cam.js',
  SCRIPT_BASE_URL + 'assets/dev/util/minimap_northup_xyz.js',
  SCRIPT_BASE_URL + 'assets/dev/util/moon.js',
  SCRIPT_BASE_URL + 'assets/dev/util/gameplay_patch.js',
  SCRIPT_BASE_URL + 'assets/dev/util/ps5_controller.js',

  // 7. Developer Tools (Load these near the end)
  SCRIPT_BASE_URL + 'assets/dev/tools/devtools.js',
  SCRIPT_BASE_URL + 'assets/dev/tools/ghost_dev.js',
  SCRIPT_BASE_URL + 'assets/dev/tools/logger.js',

  // 8. Bootstrap (The final script to start the game)
  SCRIPT_BASE_URL + 'assets/dev/game/bootstrap.js'
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
  initializePlayerRigController(); // Initialize player rig immediately
  initializeGhostData(); // Initialize ghost data immediately
  initializeGhostLogic(); // Initialize ghost logic immediately
  
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