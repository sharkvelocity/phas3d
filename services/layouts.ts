
import { InteractableObjectType, InteractableObject } from '../types';

export const checkOverlap = (rectA: any, rectB: any, margin = -0.01) => {
    return (
        rectA.x < rectB.x + rectB.width + margin &&
        rectA.x + rectA.width + margin > rectB.x &&
        rectA.z < rectB.z + rectB.depth + margin &&
        rectA.z + rectA.depth + margin > rectB.z
    );
};

const ROOM_SPECS: { [key: string]: { minW: number, maxW: number, minD: number, maxD: number } } = {
    'Garage': { minW: 5, maxW: 7, minD: 5, maxD: 7 },
    'Foyer': { minW: 3, maxW: 4, minD: 3, maxD: 5 },
    'LivingRoom': { minW: 7, maxW: 9, minD: 8, maxD: 10 },
    'Kitchen': { minW: 4, maxW: 6, minD: 5, maxD: 7 },
    'Hallway': { minW: 2, maxW: 2.5, minD: 9, maxD: 12 },
    'Bedroom': { minW: 4, maxW: 6, minD: 4, maxD: 6 },
    'Bathroom': { minW: 3, maxW: 4, minD: 3, maxD: 4 },
};

const ROOM_ITEM_MAP: { [key: string]: InteractableObjectType[] } = {
    'Kitchen': [InteractableObjectType.Plate, InteractableObjectType.Cup, InteractableObjectType.Silverware, InteractableObjectType.Radio],
    'LivingRoom': [InteractableObjectType.Book, InteractableObjectType.TVRemote, InteractableObjectType.Radio],
    'Bedroom': [InteractableObjectType.Book, InteractableObjectType.PillBottle],
    'Bathroom': [InteractableObjectType.PillBottle],
};

const getRandomDim = (spec: { minW: number, maxW: number, minD: number, maxD: number }) => {
    return {
        width: spec.minW + Math.random() * (spec.maxW - spec.minW),
        depth: spec.minD + Math.random() * (spec.maxD - spec.minD)
    };
};

export const createRandomLayout = () => {
    const rooms: any[] = [];
    const doors: any[] = [];
    const windows: any[] = [];
    const interactables: InteractableObject[] = [];
    let kitchenIsland: any = undefined;
    let roomIdCounter = 0;

    const garageDims = getRandomDim(ROOM_SPECS.Garage);
    const foyerDims = getRandomDim(ROOM_SPECS.Foyer);
    const livingDims = getRandomDim(ROOM_SPECS.LivingRoom);
    const kitchenDims = getRandomDim(ROOM_SPECS.Kitchen);
    const hallwayDims = getRandomDim(ROOM_SPECS.Hallway);
    const bed1Dims = getRandomDim(ROOM_SPECS.Bedroom);
    const bath1Dims = getRandomDim(ROOM_SPECS.Bathroom);
    const bed2Dims = getRandomDim(ROOM_SPECS.Bedroom);

    const garage = { id: roomIdCounter++, type: 'Garage', floor: 0, x: 0, z: 0, ...garageDims };
    rooms.push(garage);
    const foyer = { id: roomIdCounter++, type: 'Foyer', floor: 0, x: garage.x + garage.width, z: garage.z + (garage.depth - foyerDims.depth) / 2, ...foyerDims };
    rooms.push(foyer);
    const livingRoom = { id: roomIdCounter++, type: 'LivingRoom', floor: 0, x: foyer.x, z: foyer.z + foyer.depth, ...livingDims };
    rooms.push(livingRoom);
    const kitchen = { id: roomIdCounter++, type: 'Kitchen', floor: 0, x: livingRoom.x + livingRoom.width, z: livingRoom.z, ...kitchenDims };
    rooms.push(kitchen);
    const hallway = { id: roomIdCounter++, type: 'Hallway', floor: 0, x: garage.x - hallwayDims.width, z: garage.z, ...hallwayDims };
    rooms.push(hallway);
    const bedroom1 = { id: roomIdCounter++, type: 'Bedroom', floor: 0, x: hallway.x - bed1Dims.width, z: hallway.z, ...bed1Dims };
    rooms.push(bedroom1);
    const bathroom1 = { id: roomIdCounter++, type: 'Bathroom', floor: 0, x: hallway.x - bath1Dims.width, z: bedroom1.z + bedroom1.depth, ...bath1Dims };
    rooms.push(bathroom1);
    const bedroom2 = { id: roomIdCounter++, type: 'Bedroom', floor: 0, x: hallway.x - bed2Dims.width, z: bathroom1.z + bathroom1.depth, ...bed2Dims };
    rooms.push(bedroom2);

    const placedDoors = new Set();
    const doorMinGap = 1.2;
    doors.push({ x: garage.x + garage.width / 2, z: garage.z, isVertical: false, isFrontDoor: true, width: 1.2, floor: 0 });
    doors.push({ x: foyer.x + foyer.width, z: foyer.z + foyer.depth / 2, isVertical: true, isFrontDoor: true, width: 1.2, floor: 0 });
    doors.push({ x: foyer.x + foyer.width / 2, z: livingRoom.z, isVertical: false, width: foyer.width - 0.5, floor: 0 });
    placedDoors.add(`${Math.min(foyer.id, livingRoom.id)}-${Math.max(foyer.id, livingRoom.id)}`);

    for (let i = 0; i < rooms.length; i++) {
        for (let j = i + 1; j < rooms.length; j++) {
            const roomA = rooms[i];
            const roomB = rooms[j];
            const key = `${Math.min(roomA.id, roomB.id)}-${Math.max(roomA.id, roomB.id)}`;
            if (placedDoors.has(key)) continue;

            // Check for shared vertical wall (shared X)
            let sharedWallX = -1;
            if (Math.abs((roomA.x + roomA.width) - roomB.x) < 0.05) sharedWallX = roomB.x;
            else if (Math.abs(roomA.x - (roomB.x + roomB.width)) < 0.05) sharedWallX = roomA.x;
            
            if (sharedWallX > -1) {
                const overlapStart = Math.max(roomA.z, roomB.z);
                const overlapEnd = Math.min(roomA.z + roomA.depth, roomB.z + roomB.depth);
                if (overlapEnd - overlapStart > doorMinGap) {
                    doors.push({ x: sharedWallX, z: overlapStart + (overlapEnd - overlapStart) / 2, floor: 0, isVertical: true, width: 1.2 });
                    placedDoors.add(key);
                    continue; 
                }
            }
            
            // Check for shared horizontal wall (shared Z)
            let sharedWallZ = -1;
            if (Math.abs((roomA.z + roomA.depth) - roomB.z) < 0.05) sharedWallZ = roomB.z;
            else if (Math.abs(roomA.z - (roomB.z + roomB.depth)) < 0.05) sharedWallZ = roomA.z;

            if (sharedWallZ > -1) {
                const overlapStart = Math.max(roomA.x, roomB.x);
                const overlapEnd = Math.min(roomA.x + roomA.width, roomB.x + roomB.width);
                if (overlapEnd - overlapStart > doorMinGap) {
                    doors.push({ x: overlapStart + (overlapEnd - overlapStart) / 2, z: sharedWallZ, floor: 0, isVertical: false, width: 1.2 });
                    placedDoors.add(key);
                }
            }
        }
    }

    rooms.forEach(room => {
        if (room.type === 'Garage' || room.type === 'Hallway') return;
        const walls = [
            { side: 'N', x1: room.x, z1: room.z, x2: room.x + room.width, z2: room.z, isV: false },
            { side: 'S', x1: room.x, z1: room.z + room.depth, x2: room.x + room.width, z2: room.z + room.depth, isV: false },
            { side: 'W', x1: room.x, z1: room.z, x2: room.x, z2: room.z + room.depth, isV: true },
            { side: 'E', x1: room.x + room.width, z1: room.z, x2: room.x + room.width, z2: room.z + room.depth, isV: true },
        ];
        walls.forEach(wall => {
            const midX = (wall.x1 + wall.x2) / 2;
            const midZ = (wall.z1 + wall.z2) / 2;
            const p = {
                x: wall.isV ? wall.x1 + (wall.side === 'E' ? 0.1 : -0.1) : midX,
                z: !wall.isV ? wall.z1 + (wall.side === 'S' ? 0.1 : -0.1) : midZ,
            };
            const isExterior = !rooms.some(r => r.id !== room.id && (p.x > r.x && p.x < r.x + r.width && p.z > r.z && p.z < r.z + r.depth));
            if (isExterior) {
                const wallLen = wall.isV ? room.depth : room.width;
                if (wallLen > 2.5) {
                    windows.push({ x: midX, z: midZ, floor: 0, isVertical: wall.isV, width: 1.5, height: 1.2 });
                }
            }
        });
    });

    let interactableIdCounter = 0;
    rooms.forEach(room => {
        if (room.type === 'Kitchen') {
            const islandW = 2.0, islandD = 1.2;
            if (room.width > islandW + 2 && room.depth > islandD + 2) {
                kitchenIsland = { x: room.x + (room.width - islandW) / 2, z: room.z + (room.depth - islandD) / 2, width: islandW, depth: islandD };
            }
        }
    });

    if (Math.random() < 0.5) { // 50% chance to mirror horizontally
        const allX = rooms.map(r => r.x).concat(rooms.map(r => r.x + r.width));
        const maxXCoord = Math.max(...allX);

        rooms.forEach(r => {
            r.x = maxXCoord - (r.x + r.width);
        });
        doors.forEach(d => {
            d.x = maxXCoord - d.x;
        });
        windows.forEach(w => {
            w.x = maxXCoord - w.x;
        });
        if (kitchenIsland) {
            kitchenIsland.x = maxXCoord - (kitchenIsland.x + kitchenIsland.width);
        }
    }

    let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
    rooms.forEach(r => {
        minX = Math.min(minX, r.x);
        maxX = Math.max(maxX, r.x + r.width);
        minZ = Math.min(minZ, r.z);
        maxZ = Math.max(maxZ, r.z + r.depth);
    });

    return { rooms, doors, windows, houseFootprint: { minX, maxX, minZ, maxZ }, interactables, kitchenIsland };
};
