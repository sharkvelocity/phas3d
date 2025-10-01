// ./phasma_map_and_ghost.js
// Procedural House generator fully wired with doors + spawn
(function(){
  if(window.ProHouseGenerator) return;

  // NEW: Timeout utility to prevent hangs during asset loading.
  function loadWithTimeout(promise, ms, prefabName) {
      let timeoutId;
      const timeoutPromise = new Promise((_, reject) => {
          timeoutId = setTimeout(() => {
              reject(new Error(`Timeout after ${ms}ms for ${prefabName}`));
          }, ms);
      });

      return Promise.race([promise, timeoutPromise]).finally(() => {
          clearTimeout(timeoutId);
      });
  }

  window.ProHouseGenerator = {
    GRID_WIDTH: 10,
    GRID_DEPTH: 10,
    CELL_SIZE: 10,
    DEBUG_GRID: false,  // turn on for development

    // Room prefabs with metadata
    roomPrefabs: [
      { name:"living_room.glb", size:[2,2], doors:["north","east","south","west"] },
      { name:"kitchen.glb",     size:[2,2], doors:["south","west"] },
      { name:"bedroom.glb",     size:[1,1], doors:["north","east"] },
      { name:"bathroom.glb",    size:[1,1], doors:["west","south"] },
      { name:"hall.glb",        size:[1,1], doors:["north","south","east","west"] }
    ],

    // Direction helper for doors
    _doorOffsets: {
      north: { x:0, z:-0.5, ry:0 },
      south: { x:0, z:0.5,  ry:Math.PI },
      east:  { x:0.5, z:0,  ry:Math.PI/2 },
      west:  { x:-0.5, z:0, ry:-Math.PI/2 }
    },

    // Generate the map
    generateMap: async function(scene){
      if(!scene) throw new Error("Scene required for map generation");

      const grid = Array.from({length:this.GRID_WIDTH}, ()=>Array(this.GRID_DEPTH).fill(null));
      const mapData = { rooms: [], meshes: [], doors: [], spawn: null };

      // --- Debug ground
      if(this.DEBUG_GRID){
        const ground = BABYLON.MeshBuilder.CreateGround("grid", {
          width: this.GRID_WIDTH*this.CELL_SIZE,
          height:this.GRID_DEPTH*this.CELL_SIZE
        }, scene);
        const gridMat = new BABYLON.GridMaterial("gridMat", scene);
        gridMat.majorUnitFrequency = this.CELL_SIZE;
        gridMat.minorUnitVisibility = 0.45;
        gridMat.gridRatio = 1;
        ground.material = gridMat;
      }

      // --- Place van spawn
      const vanX = Math.floor(this.GRID_WIDTH/2);
      const vanZ = this.GRID_DEPTH-2;
      grid[vanX][vanZ] = { type:"van", prefab:"van_room.glb" };
      const vanWorldPos = new BABYLON.Vector3(vanX*this.CELL_SIZE,0,vanZ*this.CELL_SIZE);
      mapData.spawn = vanWorldPos.add(new BABYLON.Vector3(0,1.8,0));
      window.PP_SPAWN_POS = mapData.spawn;

      // --- Grow rooms from van
      const frontier = [[vanX,vanZ]];
      const roomTarget = 15;
      let placed = 0;

      while(placed < roomTarget && frontier.length){
        const [cx,cz] = frontier.shift();
        const dirs = [
          [1,0,"east"],[-1,0,"west"],
          [0,1,"south"],[0,-1,"north"]
        ].sort(()=>Math.random()-0.5);

        for(const [dx,dz,dir] of dirs){
          const nx = cx+dx, nz = cz+dz;
          if(nx<0||nz<0||nx>=this.GRID_WIDTH||nz>=this.GRID_DEPTH) continue;
          if(grid[nx][nz]) continue;

          const prefab = this.roomPrefabs[Math.floor(Math.random()*this.roomPrefabs.length)];
          grid[nx][nz] = { type:"room", prefab:prefab.name };
          frontier.push([nx,nz]);
          placed++;
          if(placed>=roomTarget) break;
        }
      }

      // --- Spawn meshes & doors ---
      let totalToLoad = 0;
      for(let x=0; x<this.GRID_WIDTH; x++){
          for(let z=0; z<this.GRID_DEPTH; z++){
              if(grid[x][z]) totalToLoad++;
          }
      }
      let loadedCount = 0;

      for(let x=0;x<this.GRID_WIDTH;x++){
        for(let z=0;z<this.GRID_DEPTH;z++){
          const cell = grid[x][z];
          if(!cell) continue;

          loadedCount++;
          const percent = 40 + (loadedCount / Math.max(1, totalToLoad)) * 30; // Map loading occupies 40%-70% of the bar
          if (window.showLoading) {
            window.showLoading(true, percent, "Building World...", `Loading asset: ${cell.prefab}`);
          }
          
          const worldPos = new BABYLON.Vector3(x*this.CELL_SIZE,0,z*this.CELL_SIZE);
          try {
            // MODIFICATION: Use the timeout wrapper for robustness.
            const loadingPromise = BABYLON.SceneLoader.ImportMeshAsync(
              "", "./assets/models/map/prefabs/", cell.prefab, scene
            );
            const res = await loadWithTimeout(loadingPromise, 7000, cell.prefab); // 7-second timeout per asset
            
            res.meshes.forEach(m=>{
              m.position.copyFrom(worldPos);
              m.checkCollisions = true;
            });

            mapData.meshes.push(...res.meshes);
            mapData.rooms.push({ x, z, type: cell.type, prefab: cell.prefab });
          } catch(e){
              console.warn(`Could not load prefab (or timed out): ${cell.prefab}`, e);
               if (window.showLoading) {
                  window.showLoading(true, percent, "Building World...", `Failed: ${cell.prefab}. Creating fallback.`);
              }
              // Create a placeholder box on failure
              const box = BABYLON.MeshBuilder.CreateBox(`placeholder_${x}_${z}`, {size: this.CELL_SIZE * 0.95}, scene);
              box.position.copyFrom(worldPos);
              box.position.y = this.CELL_SIZE * 0.5;
              box.checkCollisions = true;
              
              // NEW: Add a visible material to the fallback box
              const fallbackMat = new BABYLON.StandardMaterial(`fallbackMat_${x}_${z}`, scene);
              fallbackMat.diffuseColor = new BABYLON.Color3(0.6, 0.2, 0.2); // Reddish color
              fallbackMat.emissiveColor = new BABYLON.Color3(0.3, 0.1, 0.1);
              box.material = fallbackMat;
              
              mapData.meshes.push(box);
          }


          // --- Create doors for each prefab door
          const prefabMeta = this.roomPrefabs.find(r=>r.name===cell.prefab);
          if(prefabMeta && prefabMeta.doors){
            prefabMeta.doors.forEach(d=>{
              const offset = this._doorOffsets[d];
              if(!offset) return;
              const doorPos = worldPos.add(new BABYLON.Vector3(offset.x*this.CELL_SIZE,0,offset.z*this.CELL_SIZE));
              const doorId = `${cell.prefab}_${d}_${x}_${z}`;
              const hinge = BABYLON.MeshBuilder.CreateBox(doorId+"_hinge", {width:1, height:2, depth:0.1}, scene);
              hinge.position.copyFrom(doorPos);
              hinge.position.y = 1;
              hinge.rotation.y = offset.ry;
              hinge.isVisible = false; // invisible mesh for interaction
              hinge.checkCollisions = true;
              mapData.doors.push({ id: doorId, position: doorPos, rotationY: offset.ry, type:"door", mesh: hinge });
            });
          }
        }
      }

      return mapData;
    }
  };
  
  if (window.PP?.signalReady) {
    window.PP.signalReady('proceduralGenerator');
  }
})();