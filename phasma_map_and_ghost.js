// ./phasma_map_and_ghost.js
// Procedural House generator using primitives and CSG, removing all .glb dependencies for rooms.
(function(){
  if(window.ProHouseGenerator) return;

  const WALL_HEIGHT = 3;
  const WALL_THICKNESS = 0.15;
  const DOOR_WIDTH = 1.2;
  const DOOR_HEIGHT = 2.2;

  // Helper function to create a basic plane for a wall.
  function createWallPlane(name, width, height, scene) {
    const wallPlane = BABYLON.MeshBuilder.CreatePlane(name, {width: width, height: height, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene);
    wallPlane.isVisible = false; // The CSG source mesh should be invisible.
    return wallPlane;
  }
  
  // Helper function to create the box used to cut out a door shape.
  function createDoorCutout(scene) {
      const cutout = BABYLON.MeshBuilder.CreateBox("doorCutout", {width: DOOR_WIDTH, height: DOOR_HEIGHT, depth: WALL_THICKNESS * 2}, scene);
      cutout.position.y = DOOR_HEIGHT / 2; // Aligns bottom of cutout with the floor
      cutout.isVisible = false;
      return cutout;
  }

  window.ProHouseGenerator = {
    GRID_WIDTH: 10,
    GRID_DEPTH: 10,
    CELL_SIZE: 5, // Using a 5-meter grid cell size.
    DEBUG_GRID: false,

    // Room templates now only define size and a descriptive name.
    roomTemplates: [
      { name: "Large Square", size: [2, 2] },
      { name: "Small Square", size: [1, 1] },
      { name: "Hallway N-S", size: [1, 2] },
      { name: "Hallway E-W", size: [2, 1] },
    ],

    // Helper for placing interactive door hinges accurately.
    _doorOffsets: {
      north: { x: 0, z: -0.5, ry: 0 },
      south: { x: 0, z: 0.5,  ry: Math.PI },
      east:  { x: 0.5, z: 0,  ry: Math.PI / 2 },
      west:  { x: -0.5, z: 0, ry: -Math.PI / 2 }
    },

    generateMap: async function(scene){
      if(!scene) throw new Error("Scene required for map generation");

      const grid = Array.from({length:this.GRID_WIDTH}, ()=>Array(this.GRID_DEPTH).fill(null));
      const mapData = { rooms: [], meshes: [], doors: [], spawn: null };

      if(this.DEBUG_GRID){
        const ground = BABYLON.MeshBuilder.CreateGround("grid", { width: this.GRID_WIDTH*this.CELL_SIZE, height:this.GRID_DEPTH*this.CELL_SIZE }, scene);
        const gridMat = new BABYLON.GridMaterial("gridMat", scene);
        gridMat.majorUnitFrequency = this.CELL_SIZE;
        gridMat.gridRatio = 1;
        ground.material = gridMat;
      }

      // --- PASS 1: Place room templates into the grid layout ---
      const vanX = Math.floor(this.GRID_WIDTH/2);
      const vanZ = this.GRID_DEPTH-1;
      grid[vanX][vanZ] = { type:"van" };
      const vanWorldPos = new BABYLON.Vector3(vanX*this.CELL_SIZE, 0, vanZ*this.CELL_SIZE);
      mapData.spawn = vanWorldPos.add(new BABYLON.Vector3(0,1.8,0));
      window.PP_SPAWN_POS = mapData.spawn;

      // Use a simple, deterministic layout to ensure a valid house is always created.
      const startX = vanX;
      const startZ = vanZ - 2;
      if (startX >= 0 && startZ >= 0) grid[startX][startZ] = { template: this.roomTemplates[0], doors: {} }; // Large Room
      if (startX >= 0 && startZ - 1 >= 0) grid[startX][startZ - 1] = { template: this.roomTemplates[1], doors: {} }; // Small Square
      if (startX + 1 < this.GRID_WIDTH && startZ - 1 >= 0) grid[startX + 1][startZ - 1] = { template: this.roomTemplates[2], doors: {} }; // Hall N-S
      if (startX - 1 >= 0 && startZ >= 0) grid[startX - 1][startZ] = { template: this.roomTemplates[3], doors: {} }; // Hall E-W
      
      // --- PASS 2: Analyze the layout and determine where doors are needed ---
      for(let x=0; x<this.GRID_WIDTH; x++){
        for(let z=0; z<this.GRID_DEPTH; z++){
          if(!grid[x][z]?.template) continue;
          // Check East neighbor
          if (x + 1 < this.GRID_WIDTH && grid[x+1][z]?.template) {
            grid[x][z].doors.east = true;
            grid[x+1][z].doors.west = true;
          }
          // Check North neighbor
          if (z > 0 && grid[x][z-1]?.template) {
            grid[x][z].doors.north = true;
            grid[x][z-1].doors.south = true;
          }
        }
      }

      // --- PASS 3: Construct the geometry for each room and place interactive doors ---
      const wallMat = new BABYLON.StandardMaterial("wallMat", scene);
      wallMat.diffuseColor = new BABYLON.Color3(0.8, 0.75, 0.7);
      const floorMat = new BABYLON.StandardMaterial("floorMat", scene);
      floorMat.diffuseColor = new BABYLON.Color3(0.5, 0.4, 0.3);

      for(let x=0; x<this.GRID_WIDTH; x++){
        for(let z=0; z<this.GRID_DEPTH; z++){
          const cell = grid[x][z];
          if(!cell || !cell.template) continue;

          if (window.showLoading) {
            const progress = 40 + ((x * this.GRID_DEPTH + z) / (this.GRID_WIDTH * this.GRID_DEPTH)) * 30;
            window.showLoading(true, progress, "Building World...", `Generating room at (${x},${z})`);
          }

          const roomNode = this.buildRoomFromPrimitives(scene, cell, x, z, wallMat, floorMat);
          mapData.meshes.push(roomNode);

          // Create invisible interactive door triggers where planned
          for(const dir in cell.doors){
            const offset = this._doorOffsets[dir];
            if(!offset) continue;
            
            const worldPos = new BABYLON.Vector3(x*this.CELL_SIZE, 0, z*this.CELL_SIZE);
            const doorPos = worldPos.add(new BABYLON.Vector3(offset.x*this.CELL_SIZE, 0, offset.z*this.CELL_SIZE));
            const doorId = `door_${x}_${z}_${dir}`;
            
            const hinge = BABYLON.MeshBuilder.CreateBox(doorId+"_hinge", {width:DOOR_WIDTH, height:DOOR_HEIGHT, depth:0.2}, scene);
            hinge.position.copyFrom(doorPos);
            hinge.position.y = DOOR_HEIGHT/2;
            hinge.rotation.y = offset.ry;
            hinge.isVisible = false;
            hinge.checkCollisions = true; // Acts as the physical door barrier
            mapData.doors.push({ id: doorId, position: doorPos, rotationY: offset.ry, type:"door", mesh: hinge });
            mapData.meshes.push(hinge);
          }
        }
      }

      return mapData;
    },

    buildRoomFromPrimitives: function(scene, cell, gridX, gridZ, wallMat, floorMat) {
        const { template, doors } = cell;
        const [sizeX, sizeZ] = template.size;
        const worldX = gridX * this.CELL_SIZE;
        const worldZ = gridZ * this.CELL_SIZE;
        const roomWidth = sizeX * this.CELL_SIZE;
        const roomDepth = sizeZ * this.CELL_SIZE;

        const roomRoot = new BABYLON.TransformNode(`room_${gridX}_${gridZ}`, scene);

        // --- Floor & Ceiling ---
        const floor = BABYLON.MeshBuilder.CreateGround(`floor_${gridX}_${gridZ}`, { width: roomWidth, height: roomDepth }, scene);
        floor.position.set(worldX + roomWidth/2, 0, worldZ + roomDepth/2);
        floor.material = floorMat;
        floor.parent = roomRoot;
        floor.checkCollisions = true;

        const ceiling = floor.clone(`ceiling_${gridX}_${gridZ}`);
        ceiling.position.y = WALL_HEIGHT;
        ceiling.rotation.x = Math.PI; // Flip to face down
        ceiling.parent = roomRoot;
        ceiling.checkCollisions = true;
        
        // --- Walls (with potential door cutouts) ---
        const wallDefs = [
            { dir: 'north', hasDoor: doors.north, w: roomWidth, pos: new BABYLON.Vector3(worldX + roomWidth/2, WALL_HEIGHT/2, worldZ + roomDepth), rotY: 0 },
            { dir: 'south', hasDoor: doors.south, w: roomWidth, pos: new BABYLON.Vector3(worldX + roomWidth/2, WALL_HEIGHT/2, worldZ), rotY: Math.PI },
            { dir: 'east', hasDoor: doors.east, w: roomDepth, pos: new BABYLON.Vector3(worldX + roomWidth, WALL_HEIGHT/2, worldZ + roomDepth/2), rotY: -Math.PI/2 },
            { dir: 'west', hasDoor: doors.west, w: roomDepth, pos: new BABYLON.Vector3(worldX, WALL_HEIGHT/2, worldZ + roomDepth/2), rotY: Math.PI/2 },
        ];
        
        wallDefs.forEach((wd, i) => {
            let finalWall;
            const wallPlane = createWallPlane(`wall_plane_${gridX}_${gridZ}_${wd.dir}`, wd.w, WALL_HEIGHT, scene);
            
            if (wd.hasDoor) {
                const wallCSG = BABYLON.CSG.FromMesh(wallPlane);
                const doorCutout = createDoorCutout(scene);
                const doorCSG = BABYLON.CSG.FromMesh(doorCutout);
                
                const wallWithDoorCSG = wallCSG.subtract(doorCSG);
                finalWall = wallWithDoorCSG.toMesh(`wall_${gridX}_${gridZ}_${wd.dir}`, wallMat, scene, true);

                doorCutout.dispose();
            } else {
                finalWall = wallPlane.clone(`wall_${gridX}_${gridZ}_${wd.dir}`);
                finalWall.isVisible = true; // Make the clone visible
            }
            
            finalWall.position = wd.pos;
            finalWall.rotation.y = wd.rotY;
            finalWall.material = wallMat;
            finalWall.parent = roomRoot;
            finalWall.checkCollisions = true;
            
            wallPlane.dispose(); // Dispose the original invisible plane
        });

        return roomRoot;
    }
  };
  
  if (window.PP?.signalReady) {
    window.PP.signalReady('proceduralGenerator');
  }
})();