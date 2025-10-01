
(function(){
  "use strict";
  if (window.PP?.ghost?.logic) return;

  const log = (...a) => console.log("[GhostLogic]", ...a);
  const warn = (...a) => console.warn("[GhostLogic]", ...a);
  
  const BASE_URL = "https://sharkvelocity.github.io/phas3d/assets/ghosts/";

  const GhostLogic = {
    _scene: null,
    _isInitialized: false,
    
    data: null,      // To hold the selected ghost's data (name, evidence, etc.)
    root: null,      // The main TransformNode for positioning
    modelRoot: null, // The root of the loaded GLB model
    
    init: function(scene) {
      if (this._isInitialized || !scene) return;
      this._scene = scene;
      
      this.root = new BABYLON.TransformNode("GhostRoot", scene);
      this.root.position.set(0, -100, 0); // Start hidden away
      
      // Load the default model immediately on initialization
      this.setModel('ghost.glb');
      
      scene.onBeforeRenderObservable.add(() => this.update(scene.getEngine().getDeltaTime() / 1000));
      
      this._isInitialized = true;
      log("Initialized.");
    },
    
    setModel: async function(fileName) {
      if (!this.root || !this._scene) {
        warn("Cannot set model, logic not initialized properly.");
        return;
      }
      
      // Clean up the old model if one exists
      if (this.modelRoot) {
        this.modelRoot.dispose();
        this.modelRoot = null;
      }
      
      const fullUrl = BASE_URL + fileName;
      log(`Loading ghost model from: ${fullUrl}`);
      
      try {
        const result = await BABYLON.SceneLoader.ImportMeshAsync(null, "", fullUrl, this._scene);
        const loadedRoot = result.meshes[0];
        
        if (!loadedRoot) {
            throw new Error("No meshes found in the loaded GLB file.");
        }
        
        loadedRoot.name = "ghostModelRoot";
        loadedRoot.parent = this.root;
        loadedRoot.position.set(0, 0, 0);
        
        this.modelRoot = loadedRoot;
        log("Ghost model loaded successfully.");
        
        // Ensure visibility is correctly set based on dev tools or game state
        this.setVisible(window.GHOST_DEV_FORCE_VISIBLE || false);

      } catch (error) {
        warn(`Failed to load ghost model: ${fullUrl}`, error);
      }
    },
    
    setScale: function(scale) {
      if (this.modelRoot) {
        this.modelRoot.scaling.setAll(scale);
      }
    },
    
    setVisible: function(isVisible) {
      const shouldBeVisible = window.GHOST_DEV_FORCE_VISIBLE || isVisible;
      
      if (this.modelRoot) {
        // This ensures all parts of the model are affected
        this.modelRoot.getChildMeshes(false).forEach(m => m.setEnabled(shouldBeVisible));
        this.modelRoot.setEnabled(shouldBeVisible);
      }
    },
    
    update: function(dt) {
      if (!this.root || !this.data) return;
      // Future AI and movement logic would go here.
    }
  };
  
  window.PP = window.PP || {};
  // Expose the logic on the global namespace for other scripts to use
  window.PP.ghost = Object.assign(window.PP.ghost || {}, GhostLogic);
  window.PP.ghost.logic = true; // Mark as loaded
  
  if (window.PP?.signalReady) {
    window.PP.signalReady('ghostLogic');
  }

})();