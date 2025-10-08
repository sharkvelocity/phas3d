
declare const BABYLON: any;

export const buildHouse = async (scene: any, layoutData: any, onProgress: (progress: number, message: string) => void) => {
    const { rooms, doors, windows, kitchenIsland } = layoutData;
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    onProgress(0, 'Preparing materials...');
    
    const floorMaterial = new BABYLON.StandardMaterial("floorMat", scene);
    floorMaterial.diffuseTexture = new BABYLON.Texture("https://www.babylonjs-playground.com/textures/floor.png", scene);
    floorMaterial.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    
    const wallMaterial = new BABYLON.StandardMaterial("wallMat", scene);
    wallMaterial.diffuseTexture = new BABYLON.Texture("https://sharkvelocity.github.io/3d/assets/textures/outside_wall.jpg", scene);
    wallMaterial.diffuseTexture.uScale = 4;
    wallMaterial.diffuseTexture.vScale = 2;
    
    const doorFrameMaterial = new BABYLON.StandardMaterial("doorFrameMat", scene);
    doorFrameMaterial.diffuseColor = new BABYLON.Color3(0.4, 0.3, 0.25);
    
    const glassMaterial = new BABYLON.PBRMaterial("glassMat", scene);
    glassMaterial.metallic = 0;
    glassMaterial.roughness = 0;
    glassMaterial.alpha = 0.2;
    glassMaterial.transparencyMode = BABYLON.PBRMaterial.PBRMATERIAL_ALPHABLEND;
    
    const houseContainer = new BABYLON.TransformNode("houseContainer", scene);
    houseContainer.position.y = 0.05; // Elevate house to prevent conflict with ground plane

    const wallHeight = 3.0;
    const wallThickness = 0.15;
    const floorThickness = 0.1;

    const doorPivots = new Map<number, any>();

    onProgress(10, 'Constructing rooms...');
    for (const [index, room] of rooms.entries()) {
        const floor = BABYLON.MeshBuilder.CreateBox(`${room.type}_floor`, { width: room.width, height: floorThickness, depth: room.depth }, scene);
        floor.position = new BABYLON.Vector3(room.x + room.width / 2, 0, room.z + room.depth / 2);
        floor.material = floorMaterial;
        floor.checkCollisions = true;
        floor.parent = houseContainer;

        const wallBases: any[] = [];

        const nWall = BABYLON.MeshBuilder.CreateBox(`wall_N_base_${room.id}`, { width: room.width, height: wallHeight, depth: wallThickness }, scene);
        nWall.position = new BABYLON.Vector3(room.x + room.width / 2, wallHeight / 2, room.z + wallThickness / 2);

        const sWall = BABYLON.MeshBuilder.CreateBox(`wall_S_base_${room.id}`, { width: room.width, height: wallHeight, depth: wallThickness }, scene);
        sWall.position = new BABYLON.Vector3(room.x + room.width / 2, wallHeight / 2, room.z + room.depth - wallThickness / 2);

        const wWall = BABYLON.MeshBuilder.CreateBox(`wall_W_base_${room.id}`, { width: wallThickness, height: wallHeight, depth: room.depth - (2 * wallThickness) }, scene);
        wWall.position = new BABYLON.Vector3(room.x + wallThickness / 2, wallHeight / 2, room.z + room.depth / 2);
        
        const eWall = BABYLON.MeshBuilder.CreateBox(`wall_E_base_${room.id}`, { width: wallThickness, height: wallHeight, depth: room.depth - (2 * wallThickness) }, scene);
        eWall.position = new BABYLON.Vector3(room.x + room.width - wallThickness / 2, wallHeight / 2, room.z + room.depth / 2);
        
        wallBases.push(nWall, sWall, wWall, eWall);

        for (const [wallIndex, wallBase] of wallBases.entries()) {
            let wallCSG = BABYLON.CSG.FromMesh(wallBase);

            doors.forEach((door: any) => {
                const doorWidth = door.width || 1.2;
                const doorHeight = 2.2;
                const doorCutter = BABYLON.MeshBuilder.CreateBox("doorCutter", { width: door.isVertical ? wallThickness * 4 : doorWidth, height: doorHeight, depth: door.isVertical ? doorWidth : wallThickness * 4 }, scene);
                doorCutter.position = new BABYLON.Vector3(door.x, doorHeight / 2, door.z);
                if (wallBase.intersectsMesh(doorCutter, true)) {
                    let doorCutterCSG = BABYLON.CSG.FromMesh(doorCutter);
                    wallCSG = wallCSG.subtract(doorCutterCSG);
                }
                doorCutter.dispose();
            });

            windows.forEach((win: any) => {
                const windowHeight = win.height || 1.2;
                const windowWidth = win.width || 1.5;
                const windowCutter = BABYLON.MeshBuilder.CreateBox("windowCutter", { width: win.isVertical ? wallThickness * 4 : windowWidth, height: windowHeight, depth: win.isVertical ? windowWidth : wallThickness * 4 }, scene);
                windowCutter.position = new BABYLON.Vector3(win.x, 1.5, win.z);
                let winCutterCSG = BABYLON.CSG.FromMesh(windowCutter);
                wallCSG = wallCSG.subtract(winCutterCSG);
                windowCutter.dispose();
            });
            
            const finalWallSegment = wallCSG.toMesh(`final_wall_${room.id}_${wallIndex}`, wallMaterial, scene, false);
            finalWallSegment.checkCollisions = true;
            finalWallSegment.parent = houseContainer;
            wallBase.dispose();
        }

        const roomProgress = 10 + ((index + 1) / rooms.length) * 60;
        onProgress(roomProgress, `Building ${room.type.replace(/([A-Z])/g, ' $1').trim()}...`);
        await delay(20);
    }
    
    onProgress(75, 'Installing windows...');
    for (const win of windows) {
        const windowHeight = win.height || 1.2;
        const windowWidth = win.width || 1.5;
        const frameThickness = 0.1;

        const outerBox = BABYLON.MeshBuilder.CreateBox("outer", { width: win.isVertical ? wallThickness : windowWidth, height: windowHeight, depth: win.isVertical ? windowWidth : wallThickness }, scene);
        const innerBox = BABYLON.MeshBuilder.CreateBox("inner", { width: win.isVertical ? wallThickness + 0.1 : windowWidth - frameThickness, height: windowHeight - frameThickness, depth: win.isVertical ? windowWidth - frameThickness : wallThickness + 0.1 }, scene);
        
        const outerCSG = BABYLON.CSG.FromMesh(outerBox);
        const innerCSG = BABYLON.CSG.FromMesh(innerBox);
        const frameCSG = outerCSG.subtract(innerCSG);

        const frameMesh = frameCSG.toMesh(`windowFrame_${win.x}_${win.z}`, doorFrameMaterial, scene);
        frameMesh.position = new BABYLON.Vector3(win.x, 1.5, win.z);
        frameMesh.parent = houseContainer;
        outerBox.dispose();
        innerBox.dispose();

        const pane = BABYLON.MeshBuilder.CreatePlane("pane", { width: windowWidth - frameThickness, height: windowHeight - frameThickness }, scene);
        pane.position = new BABYLON.Vector3(win.x, 1.5, win.z);
        if (win.isVertical) {
            pane.rotation.y = Math.PI / 2;
        }
        pane.material = glassMaterial;
        pane.parent = houseContainer;
        await delay(10);
    }

    onProgress(85, 'Hanging doors...');
    for (const [index, door] of doors.entries()) {
        const doorHeight = 2.2;
        const doorWidth = door.width || 1.2;
        
        const pivotPosition = door.isVertical 
            ? new BABYLON.Vector3(door.x, 0, door.z - (doorWidth / 2))
            : new BABYLON.Vector3(door.x - (doorWidth / 2), 0, door.z);

        const doorPivot = new BABYLON.TransformNode(`doorPivot_${index}`, scene);
        doorPivot.rotationQuaternion = null; // Use Euler angles for simple rotation animation
        doorPivot.parent = houseContainer;
        doorPivot.position = pivotPosition;
        doorPivots.set(index, doorPivot);
        
        const doorMesh = BABYLON.MeshBuilder.CreateBox(`door_mesh_${index}`, {
            width: door.isVertical ? 0.08 : doorWidth,
            height: doorHeight,
            depth: door.isVertical ? doorWidth : 0.08,
        }, scene);

        const doorMat = new BABYLON.StandardMaterial(`door_mat_${index}`, scene);
        doorMat.diffuseColor = new BABYLON.Color3(0.35, 0.2, 0.15);
        doorMesh.material = doorMat;
        doorMesh.parent = doorPivot;

        doorMesh.position.y = doorHeight / 2;
        if (door.isVertical) {
            doorMesh.position.z = doorWidth / 2;
        } else {
            doorMesh.position.x = doorWidth / 2;
        }

        const metadata = { type: 'door', id: index };
        doorMesh.isPickable = true;
        doorMesh.metadata = metadata;
        doorMesh.checkCollisions = true;

        const frameTop = BABYLON.MeshBuilder.CreateBox(`doorFrameTop_${index}`, { width: door.isVertical ? wallThickness : doorWidth, height: 0.1, depth: door.isVertical ? doorWidth : wallThickness }, scene);
        frameTop.position = new BABYLON.Vector3(door.x, doorHeight + 0.05, door.z);
        frameTop.material = doorFrameMaterial;
        frameTop.checkCollisions = true;
        frameTop.parent = houseContainer;
        
        const frameSide1 = BABYLON.MeshBuilder.CreateBox(`doorFrameSide1_${index}`, { width: door.isVertical ? wallThickness : 0.1, height: doorHeight, depth: door.isVertical ? 0.1 : wallThickness }, scene);
        frameSide1.position = new BABYLON.Vector3(door.x - (door.isVertical ? 0 : doorWidth/2 - 0.05), doorHeight/2, door.z - (door.isVertical ? doorWidth/2 - 0.05 : 0));
        frameSide1.material = doorFrameMaterial;
        frameSide1.checkCollisions = true;
        frameSide1.parent = houseContainer;
        
        const frameSide2 = BABYLON.MeshBuilder.CreateBox(`doorFrameSide2_${index}`, { width: door.isVertical ? wallThickness : 0.1, height: doorHeight, depth: door.isVertical ? 0.1 : wallThickness }, scene);
        frameSide2.position = new BABYLON.Vector3(door.x + (door.isVertical ? 0 : doorWidth/2 - 0.05), doorHeight/2, door.z + (door.isVertical ? doorWidth/2 - 0.05 : 0));
        frameSide2.material = doorFrameMaterial;
        frameSide2.checkCollisions = true;
        frameSide2.parent = houseContainer;
        await delay(10);
    }

    if (kitchenIsland) {
        onProgress(95, 'Installing kitchen island...');
        const island = BABYLON.MeshBuilder.CreateBox("kitchenIsland", { width: kitchenIsland.width, height: 0.9, depth: kitchenIsland.depth }, scene);
        island.position = new BABYLON.Vector3(kitchenIsland.x + kitchenIsland.width / 2, 0.45, kitchenIsland.z + kitchenIsland.depth / 2);
        const islandMat = new BABYLON.StandardMaterial("islandMat", scene);
        islandMat.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.35);
        island.material = islandMat;
        island.checkCollisions = true;
        island.parent = houseContainer;
    }

    onProgress(100, 'House construction complete.');

    return { doorPivots };
};
