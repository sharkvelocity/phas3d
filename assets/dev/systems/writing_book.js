// writing_book.js
// Ghost book: drop/place, then ghost may write or toss, gated by evidence and Shade behavior.

(function(){
  'use strict';
  if (window.PP_SYSTEMS?.writing_book) return;

  const log = (...a) => console.log("[WritingBook]", ...a);
  const warn = (...a) => console.warn("[WritingBook]", ...a);
  
  const SCENE = ()=> window.scene;

  const state = {
    isPlaced: false,
    isWritten: false,
    position: null,
    cooldown: 0,
    mesh: null,
  };

  // --- Audio ---
  const WritingAudio = (function(){
    let writeClip=null, tossClip=null;
    function getSound(name, url) {
        const s = SCENE();
        if (!s) return null;
        try {
            return new BABYLON.Sound(name, url, s, null, { 
                spatialSound: true, autoplay: false, loop: false, volume: 0.9, 
                refDistance: 2, rolloffFactor: 1.2, maxDistance: 25 
            });
        } catch(e) {
            warn(`Failed to load sound ${url}`, e);
            return null;
        }
    }
    function ensure(){
      if (!writeClip) writeClip = getSound('ghostWriting','./assets/audio/GhostWriting1.mp3');
      if (!tossClip) tossClip = getSound('bookToss','./assets/audio/Toss.wav');
    }
    function playAt(pos, snd){ 
      try{ 
        ensure(); 
        if(snd) {
            snd.setPosition(pos); 
            snd.stop(); 
            snd.play();
        }
      }catch(_){ } 
    }
    return { writeAt:(p)=>playAt(p,writeClip), tossAt:(p)=>playAt(p,tossClip) };
  })();

  // --- Helpers ---
  function getGhostData() {
    return window.PP?.state?.selectedGhost;
  }

  function getGhostPosition() {
    return window.PP?.ghost?.root?.position;
  }

  function aimPointOnGround(maxDist=4){
    const s = SCENE();
    const cam = s?.activeCamera;
    if (!cam) return new BABYLON.Vector3(0, 1, 0);

    const ray = cam.getForwardRay(maxDist);
    const pick = s.pickWithRay(ray, m => m?.isPickable !== false && m.checkCollisions);
    if (pick?.hit) return pick.pickedPoint;
    
    // If no direct hit, cast down from the end of the ray
    const endPoint = cam.position.add(ray.direction.scale(maxDist));
    const downRay = new BABYLON.Ray(endPoint.add(new BABYLON.Vector3(0, 2, 0)), BABYLON.Vector3.Down(), 4);
    const groundPick = s.pickWithRay(downRay, m => m?.isPickable !== false && m.checkCollisions);
    if (groundPick?.hit) return groundPick.pickedPoint;

    return endPoint;
  }

  function isShadeAndPlayerInRoom(){
    const ghostData = getGhostData();
    if (ghostData?.name?.toLowerCase() !== 'shade') return false;
    
    // NOTE: This assumes a `currentRoomName` function and ghost room data are available globally.
    // This part might need further integration with your room system.
    const ghostRoom = window.PP?.ghost?.currentRoom;
    const playerRoom = window.PP?.player?.currentRoom;
    return ghostRoom && playerRoom && ghostRoom === playerRoom;
  }
  
  function ghostHasWritingEvidence(){
    return window.PP?.checkForEvidence('Ghost Writing') || false;
  }

  function placeBook(){
    if (state.isPlaced) return;

    state.isPlaced = true;
    state.isWritten = false;
    state.position = aimPointOnGround(3.8);
    state.cooldown = 2;
    
    // For now, we don't create a mesh to avoid asset loading issues.
    // A visible book mesh would be created here.
    log(`Book placed at ${state.position.x.toFixed(2)}, ${state.position.y.toFixed(2)}, ${state.position.z.toFixed(2)}`);
    
    // Dispatch event for inventory to handle charges
    window.dispatchEvent(new CustomEvent('pp:item:used', { detail: { id: 'book' } }));
  }

  function update(dt) {
    if (state.cooldown > 0) {
      state.cooldown -= dt;
    }

    if (!state.isPlaced || !state.position || state.cooldown > 0 || state.isWritten) return;

    // Check every few seconds randomly
    if (Math.random() > 0.1 * dt) return;

    if (isShadeAndPlayerInRoom()) return;

    const gpos = getGhostPosition();
    if (!gpos) return;

    const near = BABYLON.Vector3.Distance(state.position, gpos) < 3.2;
    if (!near) return;

    if (ghostHasWritingEvidence()){
      if (Math.random() < 0.5){ 
        WritingAudio.writeAt(state.position); 
        state.isWritten = true; 
        state.cooldown = 999; // Prevent further interaction
        log('Ghost wrote in the book!');
        window.PP.foundEvidence('Ghost Writing');
      } else { 
        WritingAudio.tossAt(state.position); 
        state.isPlaced = false; 
        state.cooldown = 5; 
        log('The book was tossed!');
      }
    } else {
      if(Math.random() < 0.7) { // More likely to just toss if no evidence
        WritingAudio.tossAt(state.position); 
        state.isPlaced = false; 
        state.cooldown = 5; 
        log('The book was tossed!');
      }
    }
  }

  function init(scene) {
    scene.onBeforeRenderObservable.add(() => {
        update(scene.getEngine().getDeltaTime() / 1000);
    });
    log("Update loop attached.");
  }
  
  // Expose API
  const api = { init, place: placeBook };
  window.PP_SYSTEMS = window.PP_SYSTEMS || {};
  window.PP_SYSTEMS.writing_book = api;

  // Listen for the generic "use item" event
  window.addEventListener('pp:item:use', () => {
      const inventory = window.PP?.inventory;
      if (!inventory) return;
      
      const activeSlotIndex = window.BeltManager?.state?.activeSlot - 1;
      if (typeof activeSlotIndex !== 'number' || activeSlotIndex < 0) return;
      
      const activeItemId = inventory.slots?.[activeSlotIndex];
      if (activeItemId === 'book') {
          placeBook();
      }
  });

  log("Writing Book System Initialized.");

})();
