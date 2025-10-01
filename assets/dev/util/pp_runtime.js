/* assets/dev/util/pp_runtime.js
   Minimal runtime helpers. No engine creation here.
   Safe global export (won't crash on read-only getters).
*/
(function(){
  "use strict";
  if (window.PP?.runtime) return;

  const PP = (window.PP = window.PP || {});
  PP.globals = PP.globals || {};

  function trySet(obj, key, value){
    try { obj[key] = value; } catch { /* read-only getter – ignore */ }
  }

  PP.runtime = {
    exportGlobals(engine, scene, camera){
      // namespace copy
      PP.globals.engine = engine;
      PP.globals.scene  = scene;
      PP.globals.camera = camera;

      // best-effort global names
      trySet(window, "engine", engine);
      trySet(window, "scene",  scene);
      trySet(window, "camera", camera);

      // also stash underscored fallbacks for tools that check them
      trySet(window,"__ENGINE", engine);
      trySet(window,"__SCENE",  scene);
      trySet(window,"__camera", camera);
    }
  };
  
  // --- Promise-based Ready Signaling System ---
  PP.readySignals = {};
  PP._resolveReady = {};

  PP.signalReady = function(name) {
    if (PP._resolveReady[name]) {
        PP._resolveReady[name]();
    } else {
        // If signalReady is called before waitFor, create a pre-resolved promise
        PP.readySignals[name] = Promise.resolve();
    }
    console.log(`[Runtime] Signal '${name}' is ready.`);
  };

  PP.waitFor = function(names) {
    if (!Array.isArray(names)) {
        names = [names];
    }
    const promises = names.map(name => {
        if (!PP.readySignals[name]) {
            // If waitFor is called first, create a pending promise to be resolved later
            PP.readySignals[name] = new Promise(resolve => {
                PP._resolveReady[name] = resolve;
            });
        }
        return PP.readySignals[name];
    });
    return Promise.all(promises);
  };
  
})();