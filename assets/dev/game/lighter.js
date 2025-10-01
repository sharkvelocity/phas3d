// lighter.js
// Player-attached lighter with flame effect and ghost interaction

(function(){
  'use strict';
  if (window.LIGHTER) return;

  const log = (...a) => console.log("[Lighter]", ...a);

  const lighter = (window.LIGHTER = {
    mesh: null,
    flameEffect: null,
    light: null,
    isOn: false,
    _isInitialized: false,
  });

  lighter.init = function(scene){
    if (!scene || lighter._isInitialized) return;
    
    const playerRig = window.PlayerRig;
    const handNode = playerRig?.getHandNode();

    if (!handNode) {
        console.warn("[Lighter] HandNode not available on PlayerRig. Deferring init.");
        setTimeout(() => lighter.init(scene), 200);
        return;
    }
    
    log("Initializing...");

    // Create a simple mesh for the lighter body (a flattened box)
    const body = BABYLON.MeshBuilder.CreateBox("lighterBody", {width: 0.04, height: 0.06, depth: 0.015}, scene);
    
    // Create a small point light for the flame
    lighter.light = new BABYLON.PointLight("lighterLight", BABYLON.Vector3.Zero(), scene);
    lighter.light.diffuse = new BABYLON.Color3(1, 0.7, 0.2);
    lighter.light.intensity = 0; // Off by default
    lighter.light.range = 2.5;

    // Create a flame particle system
    const flamePS = new BABYLON.ParticleSystem("lighterFlamePS", 500, scene);
    flamePS.particleTexture = new BABYLON.Texture("./assets/textures/flare.png", scene);
    
    // Emitter will be the lighter's root mesh
    flamePS.minEmitBox = new BABYLON.Vector3(-0.005, 0.03, -0.005);
    flamePS.maxEmitBox = new BABYLON.Vector3(0.005, 0.03, 0.005);
    
    flamePS.color1 = new BABYLON.Color4(1, 0.5, 0, 1.0);
    flamePS.color2 = new BABYLON.Color4(1, 0.8, 0.3, 1.0);
    flamePS.colorDead = new BABYLON.Color4(0.1, 0, 0, 0.0);

    flamePS.minSize = 0.04;
    flamePS.maxSize = 0.08;
    flamePS.minLifeTime = 0.1;
    flamePS.maxLifeTime = 0.3;
    flamePS.emitRate = 200;
    flamePS.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
    flamePS.gravity = new BABYLON.Vector3(0, 0.7, 0);
    flamePS.direction1 = new BABYLON.Vector3(0, 0.8, 0);
    flamePS.direction2 = new BABYLON.Vector3(0, 0.8, 0);
    flamePS.minAngularSpeed = 0;
    flamePS.maxAngularSpeed = Math.PI;
    flamePS.minEmitPower = 0.5;
    flamePS.maxEmitPower = 1.0;
    flamePS.updateSpeed = 0.007;
    
    lighter.flameEffect = flamePS;
    
    // Aggregate mesh
    const rootMesh = new BABYLON.TransformNode("lighterRoot", scene);
    body.parent = rootMesh;
    lighter.light.parent = rootMesh;
    flamePS.emitter = rootMesh;
    
    lighter.light.position.y = 0.04; // Light just above the body
    
    lighter.mesh = rootMesh;

    // Attach to player hand
    lighter.mesh.parent = handNode;
    lighter.mesh.position.set(0, 0, 0.05); // Position relative to handNode
    lighter.mesh.rotation.set(Math.PI / 2, 0, 0); // Orient it upright

    lighter.mesh.isPickable = false;
    lighter.mesh.getChildMeshes().forEach(m => m.isPickable = false);
    
    // Start off
    lighter.toggle(false);

    scene.onBeforeRenderObservable.add(() => lighter.update(scene.getEngine().getDeltaTime() / 1000));
    
    lighter._isInitialized = true;
    log("Initialized successfully.");
  };

  lighter.toggle = function(state){
    const shouldBeOn = state ?? !lighter.isOn;
    if (shouldBeOn === lighter.isOn && lighter._isInitialized) return;

    lighter.isOn = shouldBeOn;
    
    if (lighter.light) lighter.light.intensity = lighter.isOn ? 2.0 : 0;
    
    if (lighter.flameEffect) {
        if (lighter.isOn) lighter.flameEffect.start();
        else lighter.flameEffect.stop();
    }
    
    if (lighter.mesh) {
        lighter.mesh.setEnabled(lighter.isOn);
    }
  };

  lighter.update = function(dt){
    if (!lighter.isOn) return;
    
    const ghostData = window.PP?.state?.selectedGhost;
    const ghostRoot = window.PP?.ghost?.root || window.GhostLogic?.ghost;
    const rigRoot = window.PlayerRig?.getRigRoot();

    if (!ghostData || !ghostRoot || !rigRoot) return;

    const distance = BABYLON.Vector3.Distance(ghostRoot.position, rigRoot.position);

    // If any ghost (except Shade) is close and lighter is on, it may blow out the fire
    if (distance < 3 && ghostData.name !== 'Shade' && Math.random() < (0.2 * dt)) {
      lighter.toggle(false);
      window.toast("Your lighter was extinguished!", 1500);
      
      if(window.PP?.tools?.emf?.trigger) {
        window.PP.tools.emf.trigger(rigRoot.position, 2);
      }
    }
  };
  
  // Event listeners to ensure lighter and belt items are mutually exclusive
  window.addEventListener('pp:belt:equip', () => {
    if (lighter.isOn) {
        lighter.toggle(false);
    }
  });

})();