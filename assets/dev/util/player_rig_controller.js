

/* fp_tp_sync.js — single-rig FP/TP with no rubberbanding (v2.3 - Modular Input)
   - Loads the player model from assets/models/player/ and attaches it to the rig.
   - Hides player model in first-person view.
   - MOVEMENT is now driven by the unified input_manager.js via PP.getMovementFlags().
   - Mouse look for camera control remains handled internally.
   - rigRoot -> yaw -> head -> handNode ; camera attaches to head (FP) or trails (TP)
*/
(function(){
  if (window.__FP_TP_SYNC_V2_3__) return; window.__FP_TP_SYNC_V2_3__ = true;

  const log  = (...a)=>{ try{ console.log("[PlayerRig v2.3]", ...a);}catch(_){} };
  const warn = (...a)=>{ try{ console.warn("[PlayerRig v2.3]", ...a);}catch(_){} };
  const toRad = d => d * Math.PI / 180;
  const clamp = (v,min,max)=> Math.max(min, Math.min(max,v));
  const cfg = ()=> window.PP?.controls;
  const BASE_URL = "https://sharkvelocity.github.io/phas3d/";

  const S = {
    rigRoot:null, yawNode:null, head:null, handNode:null, body:null,
    mode:"fp",
    tpIdx:1, tpDists:[2.6,3.6,4.8,6.0],
    yaw:0, pitch:0,
    velY:0,
    gravity:-9.8, grounded:true,
    running:false,
    movementEnabled: false,
  };

  function scene(){ return window.scene || (BABYLON.Engine && BABYLON.Engine.LastCreatedScene) || null; }
  function cam(){ const s=scene(); return s && s.activeCamera; }

  async function ensureRig(s){
    if (S.rigRoot) return;
    const c = cam();
    const start = window.PP_SPAWN_POS || (c?.position?.clone?.()) || new BABYLON.Vector3(0,1.8,0);

    const rigRoot = new BABYLON.TransformNode("rigRoot", s);
    rigRoot.position.copyFrom(start);

    const yaw = new BABYLON.TransformNode("rigYaw", s);
    yaw.parent = rigRoot;

    const head = new BABYLON.TransformNode("rigHead", s);
    head.parent = yaw;
    head.position.set(0, 1.6, 0);

    const handNode = new BABYLON.TransformNode("handNode", s);
    handNode.parent = head;
    handNode.position.set(0.25, -0.4, 0.7);

    S.rigRoot=rigRoot; S.yawNode=yaw; S.head=head; S.handNode=handNode;
    
    try {
        const result = await BABYLON.SceneLoader.ImportMeshAsync(null, `${BASE_URL}assets/models/player/`, "main_player.glb", s);
        const body = result.meshes[0];
        if (body) {
            body.name = "player_body_root";
            body.parent = rigRoot;
            body.position.set(0, 0, 0);
            body.rotationQuaternion = BABYLON.Quaternion.FromEulerAngles(0, Math.PI, 0);
            S.body = body;
            result.meshes.forEach(m => { m.isPickable = false; });
            log("Player model loaded and attached.");
        }
    } catch (e) {
        warn("Could not load player model. Creating a fallback capsule.", e);
        const body = BABYLON.MeshBuilder.CreateCapsule("player_capsule", {height: 1.7, radius: 0.3}, s);
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

  function clearCameraInputs(s){
    const c = cam(); if (!c) return;
    try{ c.inputs.clear(); }catch(_){}
    c.checkCollisions = true;
    c.applyGravity = false;
    c.inertia = 0;
    c.parent = null;
  }

  function attachFP(s){
    const c=cam(); if(!c) return;
    c.parent = S.head;
    c.position.set(0,0,0);
    c.rotation.set(0,0,0);
    c.fov = 0.9;
    S.mode="fp";
    if (S.body) S.body.setEnabled(false);
  }

  function attachTP(s){
    const c=cam(); if(!c) return;
    c.parent = null;
    const d = S.tpDists[S.tpIdx]||3.6;
    const headWS = S.head.getAbsolutePosition();
    const yaw=S.yaw, cos=Math.cos(yaw), sin=Math.sin(yaw);
    const back = new BABYLON.Vector3(-sin*d, 0.25, -cos*d);
    const pos = headWS.add(back);
    c.position.copyFrom(pos);
    c.setTarget(headWS);
    c.fov=0.9;
    S.mode="tp";
    if (S.body) S.body.setEnabled(true);
  }

  function toggleView(s, cycleOnly){
    if (S.mode==="tp" && cycleOnly){ S.tpIdx=(S.tpIdx+1)%S.tpDists.length; attachTP(s); return; }
    if (S.mode==="fp") attachTP(s); else attachFP(s);
  }

  function hookPointer(s){
    s.onPointerObservable.add((pi)=>{
      if (!S.movementEnabled || pi.type !== BABYLON.PointerEventTypes.POINTERMOVE) return;
      if (!PP.pointerLock?.isLocked()) return;
      
      const ev = pi.event;
      const dx = ev.movementX||0, dy = ev.movementY||0;
      const sens = cfg()?.mouseSens || 0.0022;

      S.yaw   += dx * sens;
      S.pitch  = clamp(S.pitch - dy * sens, -toRad(89), toRad(89));
      S.yaw = (S.yaw + Math.PI*2)%(Math.PI*2);
    });
  }

  function moveRig(dt){
    if (!S.movementEnabled) return;
    
    // Get movement state from the new input manager
    const flags = window.PP.getMovementFlags ? window.PP.getMovementFlags() : { forward:false, back:false, left:false, right:false, running:false };

    const yaw=S.yaw, cos=Math.cos(yaw), sin=Math.sin(yaw);
    const fwd = new BABYLON.Vector3(sin, 0, cos);
    const right= new BABYLON.Vector3(cos, 0, -sin);

    let x=0, z=0;
    if (flags.forward) z += 1;
    if (flags.back) z -= 1;
    if (flags.right) x += 1;
    if (flags.left) x -= 1;

    const speeds = window.PP.getSpeeds ? window.PP.getSpeeds() : { walk: 1.8, run: 3.2 };
    let spd = flags.running ? speeds.run : speeds.walk;

    const dir = new BABYLON.Vector3(0,0,0);
    if (x) dir.addInPlace(right.scale(x));
    if (z) dir.addInPlace(fwd.scale(z));
    if (dir.lengthSquared()>0.0001) dir.normalize();

    const move = dir.scale(spd*dt);
    S.rigRoot.moveWithCollisions(move);

    if (!S.grounded) S.velY += S.gravity * dt;
    
    const gravMove = new BABYLON.Vector3(0, S.velY * dt, 0);
    S.rigRoot.moveWithCollisions(gravMove);
    
    const s = scene();
    const groundRay = new BABYLON.Ray(S.rigRoot.position, new BABYLON.Vector3(0, -1, 0), 1.1);
    const hit = s.pickWithRay(groundRay, (mesh) => mesh.isPickable && mesh.checkCollisions);
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
      const back=new BABYLON.Vector3(-sin*d, 0.25, -cos*d);
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
  
  // Listen for camera toggle events from the input manager
  window.addEventListener('keydown', (e) => {
      const keys = cfg()?.keys?.cameraToggle;
      if (keys && keys.includes(e.code)) {
          toggleView(scene(), e.shiftKey);
      }
  });

  window.PlayerRig = {
    getHeadNode: () => S.head,
    getHandNode: () => S.handNode,
    getRigRoot: () => S.rigRoot,
    getState: () => S,
    enableMovement: (enable) => { S.movementEnabled = !!enable; }
  };
  
  if (window.PP?.signalReady) {
    window.PP.signalReady('playerRig');
  }

})();