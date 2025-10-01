// salt_system.js
// Disturbable salt lines that: (1) always play 3 step sounds when disturbed,
// (2) spawn UV footprints only if the ghost has UV evidence,
// (3) do NOTHING for Wraiths (they don't disturb the salt).

(function(){
  'use strict';
  // This module has been refactored to use the centralized PP (PhasmaPhoney) state and helpers.
  if (window.PP_SYSTEMS?.salt) return;

  const log = (...a) => console.log("[SaltSystem]", ...a);
  const warn = (...a) => console.warn("[SaltSystem]", ...a);
  
  const SCENE = ()=> window.scene;

  // ---------------- Audio ----------------
  const StepAudio = (function(){
    let s1=null, s2=null, s3=null;

    function getSound(name, url) {
        const scene = SCENE();
        if (!scene) return null;
        try {
            return new BABYLON.Sound(name, url, scene, null, {
                spatialSound: true, autoplay: false, loop: false, volume: 0.9, 
                refDistance: 2, rolloffFactor: 1.2, maxDistance: 25
            });
        } catch(e) {
            warn(`Failed to load sound: ${url}`, e);
            return null;
        }
    }

    function ensureSounds(){
      if (!s1) s1 = getSound('salt_step1', './assets/audio/step1.mp3');
      if (!s2) s2 = getSound('salt_step2', './assets/audio/step2.mp3');
      if (!s3) s3 = getSound('salt_step3', './assets/audio/step3.mp3');
    }

    function setPosAndPlay(sound, pos){
      if (!sound || !pos) return;
      try { sound.setPosition(pos); sound.stop(); sound.play(); } catch(_) {}
    }

    return {
      playTripletAt(pos){
        ensureSounds();
        setPosAndPlay(s1, pos);
        setTimeout(()=> setPosAndPlay(s2, pos), 230);
        setTimeout(()=> setPosAndPlay(s3, pos), 480);
      }
    };
  })();

  // ---------------- Helpers ----------------
  function ghostType(){
    return window.PP?.state?.selectedGhost?.name?.toLowerCase() || '';
  }

  function ghostHasUvEvidence(){
    // Use the global helper for consistency, checking the definitive evidence name.
    return window.PP?.checkForEvidence('Ultraviolet') || false;
  }
  
  function getGhostPosition() {
    // Get position from the authoritative ghost root node.
    return window.PP?.ghost?.root?.position;
  }

  function aimPoint(maxDist=3.8){
    const s=SCENE(); const cam = s?.activeCamera;
    if (!cam) return new BABYLON.Vector3(0,0,0);
    const ray = cam.getForwardRay(maxDist);
    const pick = s.pickWithRay(ray, m=>m && m.isPickable!==false);
    if (pick?.hit) return pick.pickedPoint.clone();
    
    const ahead = cam.position.add(ray.direction.scale(maxDist));
    
    // Attempt to snap to ground if we didn't hit anything
    const groundRay = new BABYLON.Ray(ahead.add(new BABYLON.Vector3(0, 2, 0)), BABYLON.Vector3.Down(), 4);
    const groundPick = s.pickWithRay(groundRay, m => m.isPickable !== false && m.checkCollisions);
    if (groundPick?.hit) return groundPick.pickedPoint;

    return ahead;
  }

  // ---------------- Salt placement ----------------
  const SALT_LINES = [];
  function placeSaltLine(){
    const s=SCENE(); if (!s) return;
    const center = aimPoint(3.8);
    const fwd = s.activeCamera.getForwardRay().direction;
    const yaw = Math.atan2(fwd.z, fwd.x);
    const half = 0.60;
    
    // Place salt line slightly above the ground to avoid z-fighting
    center.y += 0.01;

    const a = center.subtract(new BABYLON.Vector3(Math.sin(yaw) * half, 0, Math.cos(yaw) * half));
    const b = center.add(new BABYLON.Vector3(Math.sin(yaw) * half, 0, Math.cos(yaw) * half));
    
    const mesh = BABYLON.MeshBuilder.CreateTube('salt_line', {path:[a,b], radius:0.04, tessellation:8}, s);
    const mat = new BABYLON.StandardMaterial('salt_mat', s);
    mat.diffuseColor = new BABYLON.Color3(0.95,0.95,0.95);
    mat.specularColor = new BABYLON.Color3(0.1,0.1,0.1);
    mat.emissiveColor = new BABYLON.Color3(0.05,0.05,0.05);
    mesh.material = mat;
    mesh.isPickable = false;

    const mid = a.add(b).scale(0.5);
    SALT_LINES.push({mesh, a, b, mid, disturbed:false, yaw});
    
    // Dispatch an event so the inventory system can decrement charges
    window.dispatchEvent(new CustomEvent('pp:item:used', { detail: { id: 'salt' } }));
  }

  // ---------------- Disturbance detection ----------------
  let lastGhostPos = new BABYLON.Vector3(Infinity, Infinity, Infinity);

  function pointToSegDistanceXZ(p, a, b){
    const l2 = BABYLON.Vector3.DistanceSquared(a, b);
    if (l2 === 0) return BABYLON.Vector3.Distance(p, a);
    const t = Math.max(0, Math.min(1, BABYLON.Vector3.Dot(p.subtract(a), b.subtract(a)) / l2));
    const projection = a.add(b.subtract(a).scale(t));
    return BABYLON.Vector3.Distance(new BABYLON.Vector3(p.x, 0, p.z), new BABYLON.Vector3(projection.x, 0, projection.z));
  }

  function disturbCheck(ghostPos){
    if (!ghostPos) return;
    
    // Wraith: does not disturb the salt at all -> return early
    if (ghostType() === 'wraith') return;

    for (const s of SALT_LINES){
      if (s.disturbed) continue;
      const d = pointToSegDistanceXZ(ghostPos, s.a, s.b);
      
      if (d < 0.25){
        s.disturbed = true;
        s.mesh.setEnabled(false); // Hide the salt pile
        setTimeout(() => s.mesh.dispose(), 1000); // Clean up later

        // 1) ALWAYS play the three step sounds
        StepAudio.playTripletAt(s.mid);

        // 2) Spawn UV footprints only if ghost has UV evidence
        if (ghostHasUvEvidence() && window.UVPrints){
          const dirYaw = (function(){
            const dx = ghostPos.x - lastGhostPos.x, dz = ghostPos.z - lastGhostPos.z;
            if (dx*dx + dz*dz > 1e-4) return Math.atan2(dx, dz);
            return s.yaw + Math.PI / 2; // Perpendicular to salt line
          })();

          UVPrints.addStepPair(s.mid, dirYaw);
          const step2Pos = s.mid.add(new BABYLON.Vector3(Math.sin(dirYaw), 0, Math.cos(dirYaw)).scale(0.5));
          UVPrints.addStepPair(step2Pos, dirYaw);
          
          window.PP.foundEvidence('Ultraviolet');
        }
      }
    }
  }

  function init(scene) {
    scene.onBeforeRenderObservable.add(()=>{
      const gpos = getGhostPosition();
      if(gpos) {
          disturbCheck(gpos);
          lastGhostPos.copyFrom(gpos);
      }
    });
    log("Update loop attached.");
  }
  
  // Expose API
  const api = { init, place: placeSaltLine };
  window.PP_SYSTEMS = window.PP_SYSTEMS || {};
  window.PP_SYSTEMS.salt = api;

  // Listen for the generic "use item" event when salt is equipped
  window.addEventListener('pp:item:use', () => {
      const inventory = window.PP?.inventory;
      if (!inventory) return;
      
      const activeSlotIndex = window.BeltManager?.state?.activeSlot - 1;
      if (typeof activeSlotIndex !== 'number' || activeSlotIndex < 0) return;
      
      const activeItemId = inventory.slots?.[activeSlotIndex];
      if (activeItemId === 'salt') {
          placeSaltLine();
      }
  });

  log("Salt System Initialized.");

})();
