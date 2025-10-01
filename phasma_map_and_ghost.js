

// phasma_map_and_ghost.js
// Procedural house generator using only primitives and CSG.
(function(){
  "use strict";
  if (window.ProHouseGenerator) return;

  // --- Configuration Constants ---
  const WALL_HEIGHT = 3.0;
  const WALL_THICKNESS = 0.15;
  const DOOR_WIDTH = 1.2;
  const DOOR_HEIGHT = 2.2;
  const CELL_SIZE = 5;

  // --- Private Helper Functions ---

  // Creates the CSG box used to cut a doorway out of a wall.
  function createDoorCutoutBox(scene) {
    const box = BABYLON.MeshBuilder.CreateBox("doorCutout", {
      width: DOOR_WIDTH,
      height: DOOR_HEIGHT,
      depth: WALL_THICKNESS * 2 // Make it thick enough to cut through the wall
    }, scene);
    box.position.y = DOOR_HEIGHT / 2; // Align bottom with the floor
    box.isVisible = false;
    return box;
  }

  // Builds a single room's geometry from scratch based on its grid position and door requirements.
  function buildCellGeometry(scene, roomData, gridPos, materials) {
    const roomNode = new BABYLON.TransformNode(`room_${gridPos.x}_${gridPos.z}`, scene);

    // --- Floor and Ceiling ---
    const floor = BABYLON.MeshBuilder.CreateGround("floor", { width: CELL_SIZE, height: CELL_SIZE }, scene);
    floor.position.y = 0;
    floor.material = materials.floor;
    floor.checkCollisions = true;
    floor.parent = roomNode;

    const ceiling = floor.clone("ceiling");
    ceiling.position.y = WALL_HEIGHT;
    ceiling.rotation.x = Math.PI; // Flip to face down
    ceiling.material = materials.ceiling;
    ceiling.parent = roomNode;

    // --- Walls ---
    const wallDefs = [
      { name: 'north', hasDoor: roomData.doors.north, pos: new BABYLON.Vector3(0, WALL_HEIGHT / 2, CELL_SIZE / 2), rotY: 0, len: CELL_SIZE },
      { name: 'south', hasDoor: roomData.doors.south, pos: new BABYLON.Vector3(0, WALL_HEIGHT / 2, -CELL_SIZE / 2), rotY: Math.PI, len: CELL_SIZE },
      { name: 'east',  hasDoor: roomData.doors.east,  pos: new BABYLON.Vector3(CELL_SIZE / 2, WALL_HEIGHT / 2, 0), rotY: Math.PI / 2, len: CELL_SIZE },
      { name: 'west',  hasDoor: roomData.doors.west,  pos: new BABYLON.Vector3(-CELL_SIZE / 2, WALL_HEIGHT / 2, 0), rotY: -Math.PI / 2, len: CELL_SIZE },
    ];
    
    for (const def of wallDefs) {
      let finalWall;
      if (def.hasDoor) {
        const wallBoxSource = BABYLON.MeshBuilder.CreateBox("csg_wall_source", { width: def.len, height: WALL_HEIGHT, depth: WALL_THICKNESS }, scene);
        wallBoxSource.isVisible = false;

        const doorCutoutBox = createDoorCutoutBox(scene);
        
        const wallCSG = BABYLON.CSG.FromMesh(wallBoxSource);
        const doorCSG = BABYLON.CSG.FromMesh(doorCutoutBox);

        const wallWithDoorCSG = wallCSG.subtract(doorCSG);
        
        finalWall = wallWithDoorCSG.toMesh(`wall_${def.name}`, materials.wall, scene, true);

        wallBoxSource.dispose();
        doorCutoutBox.dispose();
      } else {
        finalWall = BABYLON.MeshBuilder.CreateBox(`wall_${def.name}`, { width: def.len, height: WALL_HEIGHT, depth: WALL_THICKNESS }, scene);
      }
      
      finalWall.position = def.pos;
      finalWall.rotation.y = def.rotY;
      finalWall.material = materials.wall;
      finalWall.checkCollisions = true;
      finalWall.parent = roomNode;
    }

    const worldPos = new BABYLON.Vector3(gridPos.x * CELL_SIZE, 0, gridPos.z * CELL_SIZE);
    roomNode.position = worldPos;
    return roomNode;
  }

  // --- Public Generator Object ---
  window.ProHouseGenerator = {
    GRID_SIZE: 8,

    generateMap: async function(scene) {
      console.log("[ProHouseGenerator] Starting map generation with primitives...");
      const grid = Array.from({ length: this.GRID_SIZE }, () => Array(this.GRID_SIZE).fill(null));
      const mapRoot = new BABYLON.TransformNode("ProceduralMapRoot", scene);

      // --- Pass 1: Define a simple, static layout to ensure it always works ---
      const layout = [ {x:3, z:3}, {x:3, z:4}, {x:4, z:4}, {x:5, z:4} ];
      layout.forEach(p => {
        grid[p.x][p.z] = { doors: { north: false, south: false, east: false, west: false } };
      });
      
      window.PP_SPAWN_POS = new BABYLON.Vector3(3 * CELL_SIZE, 1.8, 6 * CELL_SIZE);

      // --- Pass 2: Plan Doorways by checking neighbors ---
      for (let x = 0; x < this.GRID_SIZE; x++) {
        for (let z = 0; z < this.GRID_SIZE; z++) {
          if (!grid[x][z]) continue;
          if (x + 1 < this.GRID_SIZE && grid[x + 1][z]) { grid[x][z].doors.east = true; grid[x + 1][z].doors.west = true; }
          if (z + 1 < this.GRID_SIZE && grid[x][z + 1]) { grid[x][z].doors.north = true; grid[x][z + 1].doors.south = true; }
        }
      }

      // --- Pass 3: Build Geometry from the Plan ---
      const materials = {
        wall: new BABYLON.StandardMaterial("wallMat", scene),
        floor: new BABYLON.StandardMaterial("floorMat", scene),
        ceiling: new BABYLON.StandardMaterial("ceilingMat", scene)
      };
      materials.wall.diffuseColor = new BABYLON.Color3(0.9, 0.85, 0.8);
      materials.floor.diffuseColor = new BABYLON.Color3(0.6, 0.5, 0.4);
      materials.ceiling.diffuseColor = new BABYLON.Color3(0.95, 0.95, 0.95);

      for (let x = 0; x < this.GRID_SIZE; x++) {
        for (let z = 0; z < this.GRID_SIZE; z++) {
          if (grid[x][z]) {
            const roomNode = buildCellGeometry(scene, grid[x][z], { x, z }, materials);
            roomNode.parent = mapRoot;
          }
        }
      }
      
      console.log("[ProHouseGenerator] Map generation complete.");
      return { root: mapRoot, doors: [] };
    }
  };

  // Signal that this module is ready for bootstrap.js
  if (window.PP?.signalReady) {
    window.PP.signalReady('proceduralGenerator');
  }

})();