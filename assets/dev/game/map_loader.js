// assets/dev/game/map_loader.js

// This module provides the definitive map manifest for the game.
// It directly sets the list of maps, ensuring consistency.

(function(){
  "use strict";
  window.PP = window.PP || {};
  
  // The definitive map for the game, loaded from a GLB file.
  const MAPS = [
      {
          id: 'main_map',
          title: 'Investigation Site',
          file: 'map.glb'
      },
      {
          id: 'procedural_house',
          title: 'Procedural House',
          file: null
      }
  ];

  // Directly assign the manifest.
  window.PP.mapManifest = MAPS;

  console.log("[map_loader] Map manifest set. Total maps:", window.PP.mapManifest.length);
  
  // Signal that this critical data is ready
  if (window.PP.signalReady) {
    window.PP.signalReady('mapLoader');
  }
})();