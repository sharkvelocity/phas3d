// assets/dev/systems/uv_prints.js
(function(){
  "use strict";
  window.PP = window.PP || {};
  PP.systems = PP.systems || {};
  const BASE_URL = "https://sharkvelocity.github.io/phas3d/";
  
  const UV_SYSTEM = {
    _scene: null,
    _uvActive: false,
    _allPrints: [],
    _texture: null,
    LIFETIME_MS: 120 * 1000, // 2 minutes
  };

  UV_SYSTEM.init = function(scene) {
    this._scene = scene;
    this._texture = new BABYLON.Texture(`${BASE_URL}assets/textures/uv_texture.png`, scene);
    
    window.addEventListener('pp:uv_light:toggle', () => {
      this._uvActive = !this._uvActive;
      window.toast(`UV Light ${this._uvActive ? 'ON' : 'OFF'}`, 1000);
      this.updatePrintVisibility();
    });

    // Clean up disposed prints from our tracking array periodically
    scene.onBeforeRenderObservable.add(() => {
      if (Math.random() < 0.01) { // Low-frequency check
        this._allPrints = this._allPrints.filter(p => p && !p.isDisposed());
      }
    });
  };

  UV_SYSTEM.updatePrintVisibility = function() {
    for (const print of this._allPrints) {
      if (print && print.material && !print.isDisposed()) {
        print.material.alpha = this._uvActive ? 1.0 : 0.0;
      }
    }
  };

  /**
   * Called by ghost logic to place a print.
   * @param {BABYLON.AbstractMesh} targetMesh The mesh to place the decal on.
   * @param {BABYLON.Vector3} hitPoint World position for the center of the decal.
   * @param {BABYLON.Vector3} hitNormal Normal of the surface at the hit point.
   */
  UV_SYSTEM.trigger = function(targetMesh, hitPoint, hitNormal) {
    if (!targetMesh || !this._scene || !hitPoint || !hitNormal) return;

    // Check if this is a valid piece of evidence for the current ghost
    if (!window.PP.checkForEvidence('Ultraviolet')) {
      return;
    }

    const size = new BABYLON.Vector3(0.4, 0.4, 0.2); // width, height, depth of decal projection
    const printDecal = BABYLON.MeshBuilder.CreateDecal("uvPrint", targetMesh, {
      position: hitPoint,
      normal: hitNormal,
      size: size,
      angle: Math.random() * Math.PI * 2 // Random rotation
    });

    const mat = new BABYLON.StandardMaterial("uvPrintMat", this._scene);
    mat.diffuseTexture = this._texture;
    mat.emissiveTexture = this._texture;
    mat.emissiveColor = new BABYLON.Color3(0.8, 1, 0.8);
    mat.useAlphaFromDiffuseTexture = true;
    mat.specularColor = new BABYLON.Color3(0, 0, 0);
    mat.backFaceCulling = false;
    mat.alpha = this._uvActive ? 1.0 : 0.0; // Initially visible only if UV is on
    mat.zOffset = -2; // Prevent z-fighting

    printDecal.material = mat;
    printDecal.isPickable = false;

    this._allPrints.push(printDecal);

    setTimeout(() => {
      try { 
        if(printDecal && !printDecal.isDisposed()) {
            printDecal.dispose(false, true); // Dispose mesh and its material
        }
      } catch(e) {}
    }, this.LIFETIME_MS);
    
    // Announce evidence found (only once is better, but this is simple)
    window.PP.foundEvidence('Ultraviolet');
    window.toast("You have found evidence: Ultraviolet", 2000);
  };

  PP.systems.uv_prints = UV_SYSTEM;
})();