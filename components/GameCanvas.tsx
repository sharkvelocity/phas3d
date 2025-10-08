
import { jsx as _jsx } from "react/jsx-runtime";
// FIX: Import React to resolve React namespace issues.
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Weather, ItemId, GameState, PlayerStatus, Coordinates, Item, PlacedItem, MapData, Ghost } from '../types';
import { createRandomLayout } from '../services/layouts';
import SoundManager from '../services/SoundManager';
import { buildHouse } from '../services/HouseBuilder';
import CameraManager, { CameraManagerOptions } from '../services/CameraManager';
import { GHOST_ORB_LAYER_MASK, VIEWMODEL_LAYER_MASK, UV_EVIDENCE_LAYER_MASK } from '../constants';

declare const BABYLON: any;
declare const CANNON: any;

const loadModelWithTimeout = (
    url: string,
    scene: any,
    timeout: number,
    onProgress?: (event: any) => void
): Promise<any> => {
    console.log(`[AssetLoader] Requesting model: ${url}`);
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject(new Error(`Model loading timed out after ${timeout / 1000}s: ${url}`));
        }, timeout);

        BABYLON.SceneLoader.ImportMeshAsync(null, url, "", scene, onProgress, ".glb")
        .then((result: any) => {
            clearTimeout(timeoutId);
            console.log(`[AssetLoader] Successfully loaded model: ${url}`);
            resolve(result);
        })
        .catch((error: any) => {
            clearTimeout(timeoutId);
            console.error(`[AssetLoader] Failed to load model: ${url}`, error);
            reject(error);
        });
    });
};


interface GameCanvasProps {
    onPlayerStatusUpdate: (status: PlayerStatus) => void;
    onPlayerPositionUpdate: (coords: Coordinates) => void;
    onInteractableFocusChange: (isFocused: boolean) => void;
    onRoomChange: (roomType: string) => void;
    onEmfUpdate: (level: number) => void;
    onParabolicUpdate: (reading: number) => void;
    onParanormalEvent: (severity: 'low' | 'medium' | 'high') => void;
    isPaused: boolean;
    selectedMap: MapData | null;
    gameState: GameState;
    onSetGameState: (state: GameState) => void;
    isAudioUnlocked: boolean;
    isMuted: boolean;
    weather: Weather;
    activeGhost: Ghost | null;
    inventory: (Item | null)[];
    equippedItem: Item | null;
    equippedItemIndex: number | null;
    onSwitchItem: (index: number | null) => void;
    placedItems: PlacedItem[];
    onPlaceItem: (itemId: ItemId, position: any, rotation: any, isDrop: boolean) => void;
    onUpdatePlacedItem: (item: PlacedItem) => void;
    onPickUpItem: (instanceId: number) => void;
    onMountCamera: (tripodInstanceId: number) => void;
    onDetachCamera: (cameraInstanceId: number) => void;
    sanity: number;
    stamina: number;
    setStamina: React.Dispatch<React.SetStateAction<number>>;
    playerStatus: PlayerStatus;
    heldCameraState: { isOn: boolean, isIR: boolean } | null;
    onUpdateHeldCameraState: (state: { isOn: boolean, isIR: boolean }) => void;
    isLighterOn: boolean;
    onLighterStateChange: (isOn: boolean) => void;
    isSpiritBoxOn: boolean;
    onSpiritBoxToggle: () => void;
    isSmudging: boolean;
    onUseSmudgeSticks: () => void;
    onUseSanityMeds: () => void;
    onUsePhotoCamera: () => void;
    onTransitionComplete: () => void;
    onLoadingUpdate: (progress: number, message: string) => void;
    currentRoom: string;
    onMonitorInteraction: () => void;
    monitorView: 'off' | 'menu';
    placedCameras: PlacedItem[];
}

const GameCanvas = (props: GameCanvasProps) => {
    const { onPlayerStatusUpdate, onPlayerPositionUpdate, onInteractableFocusChange, isPaused, selectedMap, gameState, onSetGameState } = props;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const flashlightRef = useRef<any>(null);
    const uvLightRef = useRef<any>(null);
    const [isFlashlightOn, setIsFlashlightOn] = useState(false);
    const [isUvLightOn, setIsUvLightOn] = useState(false);
    const [isCrouching, setIsCrouching] = useState(false);
    const isPointerLockedRef = useRef(false);
    const [isHunting, setIsHunting] = useState(false);
    const [radioStates, setRadioStates] = useState<{ [key: number]: boolean }>({});
    const sceneRef = useRef<any>(null);
    const playerCameraRef = useRef<any>(null);
    const viewModelCameraRef = useRef<any>(null);
    const menuCameraRef = useRef<any>(null);
    const menuContainerRef = useRef<any>(null);
    const placedMeshesRef = useRef(new Map<number, any>());
    const cameraMonitorScreenMeshesRef = useRef<any[]>([]);
    const [viewingCameraIndex, setViewingCameraIndex] = useState(-1);
    const dotsProjectorsRef = useRef(new Map());
    const ghostMeshRef = useRef<any>(null);
    const ghostPositionRef = useRef<any>(new BABYLON.Vector3(Infinity, Infinity, Infinity));
    const ghostTargetPositionRef = useRef<any>(null);
    const ghostSilhouetteRef = useRef<any>(null);
    const silhouetteTimerRef = useRef<any>(null);
    const inputMapRef = useRef<{ [key: string]: boolean }>({});
    const soundManagerRef = useRef<SoundManager | null>(null);
    const equippedItemMeshRef = useRef<any>(null);
    const interactableMeshesRef = useRef(new Map());
    const houseLayoutRef = useRef<any>(null);
    const currentRoomIdRef = useRef<number | null>(null);
    const uvEvidenceMeshesRef = useRef<any[]>([]);
    const uvEvidenceMaterialRef = useRef<any>(null);
    const lighterEffectsRef = useRef<{ light: any, particles: any } | null>(null);
    const placedLanternEffectsRef = useRef(new Map());
    const smudgeSmokeRef = useRef<any>(null);
    const tooltipTextRef = useRef<any>(null);
    const ghostOrbSystemRef = useRef<any>(null);
    const ghostOrbEmitterRef = useRef<any>(null);
    const playerBreathSystemRef = useRef<any>(null);
    const hantuBreathSystemRef = useRef<any>(null);
    const breathIntervalRef = useRef<number | null>(null);
    const [isBreakerOn, setIsBreakerOn] = useState(true);
    const [lightSwitchStates, setLightSwitchStates] = useState<{ [key: string]: boolean }>({});
    const lightFixturesRef = useRef(new Map());
    const lastPositionUpdateTimeRef = useRef(0);
    const doorPivotsRef = useRef(new Map());
    const doorStatesRef = useRef(new Map());
    const lastInteractableCheckTimeRef = useRef(0);
    const lastRoomCheckTimeRef = useRef(0);
    const isCrouchingRef = useRef(isCrouching);
    const cameraManagerRef = useRef<CameraManager | null>(null);
    const pipSourceNodeRef = useRef<any>(null);
    const placedCameraNodesRef = useRef(new Map<number, any>());
    const gameContainerRef = useRef<any>(null);

    isCrouchingRef.current = isCrouching;

    const propsRef = useRef(props);
    propsRef.current = props;

    const prevGameStateRef = useRef<GameState | undefined>(undefined);
    useEffect(() => {
        prevGameStateRef.current = gameState;
    }, [gameState]);
    const prevGameState = prevGameStateRef.current;

    const setupMenuScene = useCallback(async (scene: any) => {
        scene.collisionsEnabled = false;
    
        if (menuContainerRef.current) {
            menuContainerRef.current.dispose(false, true);
        }
        const menuContainer = new BABYLON.TransformNode("menuContainer", scene);
        menuContainerRef.current = menuContainer;

        const ambientLight = new BABYLON.HemisphericLight("ambientLight", new BABYLON.Vector3(0, 1, 0), scene);
        ambientLight.intensity = 0.2;
        ambientLight.parent = menuContainer;
    
        const pointLight = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(0, 1.5, -11.2), scene);
        pointLight.intensity = 0.8;
        pointLight.diffuse = new BABYLON.Color3(0.8, 0.8, 1.0);
        pointLight.parent = menuContainer;
        
        const table = BABYLON.MeshBuilder.CreateBox("menuTable", { width: 2.5, height: 0.9, depth: 1.2 }, scene);
        table.position = new BABYLON.Vector3(0, 0.45, -12.3);
        const tableMaterial = new BABYLON.StandardMaterial("tableMat", scene);
        tableMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2);
        table.material = tableMaterial;
        table.parent = menuContainer;
        
        try {
            const monitorResult = await BABYLON.SceneLoader.ImportMeshAsync("", "https://sharkvelocity.github.io/3d/assets/models/items/monitor.glb", "", scene);
            if (!monitorResult || !monitorResult.meshes || monitorResult.meshes.length === 0) {
                throw new Error("Menu monitor model loaded with no meshes.");
            }
            const monitorMesh = monitorResult.meshes[0];
            monitorMesh.position = new BABYLON.Vector3(0, 0.9, -12.2);
            monitorMesh.rotation.y = Math.PI;
            monitorMesh.parent = menuContainer;

            const screenMesh = monitorResult.meshes.find((m: any) => m.name === "screen");
            if (screenMesh) {
                const offScreenMat = new BABYLON.StandardMaterial("offScreenMat", scene);
                offScreenMat.diffuseColor = BABYLON.Color3.Black();
                offScreenMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
                screenMesh.material = offScreenMat;
                screenMesh.isPickable = false;
            } else {
                console.error("Could not find a mesh named 'screen' in the monitor model.");
            }
        } catch (error) {
            console.error("Could not set up the main menu monitor.", error);
        }
    }, []);

    // Main engine and scene setup, runs only once
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, audioEngine: true }, true);
        const scene = new BABYLON.Scene(engine);
        
        const gravityVector = new BABYLON.Vector3(0, -9.81, 0);
        const physicsPlugin = new BABYLON.CannonJSPlugin();
        scene.enablePhysics(gravityVector, physicsPlugin);
        
        sceneRef.current = scene;

        const setupPlayerCamera = (scene: any, canvas: HTMLCanvasElement) => {
            const camera = new BABYLON.UniversalCamera("playerCamera", new BABYLON.Vector3(1, 1.8, -15.81), scene);
            camera.setTarget(new BABYLON.Vector3(0, 1.8, 0));
            camera.speed = 3.5;
            camera.angularSensibility = 2500;
            camera.inertia = 0;
            camera.attachControl(canvas, true);
            camera.inputs.remove(camera.inputs.attached.keyboard);
            camera.checkCollisions = true;
            camera.ellipsoid = new BABYLON.Vector3(0.5, 0.9, 0.5);
            camera.applyGravity = true;
            camera.stepHeight = 0.5;
            camera.minZ = 0.1;
            camera.fov = 1.0;
            camera.layerMask = ~(GHOST_ORB_LAYER_MASK | UV_EVIDENCE_LAYER_MASK | VIEWMODEL_LAYER_MASK);
            playerCameraRef.current = camera;

            // Create a second camera for the viewmodel (held items)
            const viewModelCam = new BABYLON.FreeCamera("viewModelCamera", BABYLON.Vector3.Zero(), scene);
            viewModelCam.layerMask = VIEWMODEL_LAYER_MASK; // This camera only sees the viewmodel layer
            viewModelCam.parent = camera; // Link it to the main camera
            viewModelCam.minZ = 0.01; // Render it very close
            viewModelCameraRef.current = viewModelCam;
        };

        const setupMenuCamera = (scene: any) => {
            const camera = new BABYLON.TargetCamera("menuCamera", new BABYLON.Vector3(0.05, 1.3, -11.4), scene);
            camera.setTarget(new BABYLON.Vector3(0, 1.3, -12.2));
            menuCameraRef.current = camera;
            scene.activeCamera = camera;
        };
        
        const handlePointerLockChange = () => {
            isPointerLockedRef.current = document.pointerLockElement === canvas;
        };
        document.addEventListener('pointerlockchange', handlePointerLockChange, false);

        const handleClick = () => {
            if (propsRef.current.gameState === GameState.Playing && !propsRef.current.isPaused && !isPointerLockedRef.current) {
                canvas.requestPointerLock();
            }
        };
        canvas.addEventListener('click', handleClick);

        const handleMouseDown = (evt: MouseEvent) => {
            if (propsRef.current.isPaused || !isPointerLockedRef.current || evt.button !== 0) return;
        
            const scene = sceneRef.current;
            const camera = playerCameraRef.current;
            if (!scene || !camera) return;

            // Left click is now for USING or PLACING the held item. Picking up is handled by 'E' key.
            const equippedItem = propsRef.current.equippedItem;
            if (!equippedItem) return;
            
            const placeableItems = [ItemId.GhostWritingBook, ItemId.DOTSProjector, ItemId.Crucifix, ItemId.Tripod, ItemId.Lantern, ItemId.Salt, ItemId.VideoCamera];

            if (placeableItems.includes(equippedItem.id)) {
                const placePos = camera.position.add(camera.getForwardRay(1).direction);
                const groundRay = new BABYLON.Ray(placePos, new BABYLON.Vector3(0, -1, 0), 2);
                const groundPick = scene.pickWithRay(groundRay, (mesh: any) => mesh.checkCollisions);
                const finalY = groundPick?.hit ? groundPick.pickedPoint.y + 0.05 : 0.05;
                const finalRotation = { x: 0, y: camera.rotation.y, z: 0 };
                propsRef.current.onPlaceItem(equippedItem.id, { x: placePos.x, y: finalY, z: placePos.z }, finalRotation, false);
            } else {
                switch (equippedItem.id) {
                    case ItemId.PhotoCamera:
                        propsRef.current.onUsePhotoCamera();
                        break;
                    case ItemId.SanityMeds:
                        propsRef.current.onUseSanityMeds();
                        break;
                    case ItemId.SmudgeSticks:
                        // No lighter check needed, assume auto-use
                        propsRef.current.onUseSmudgeSticks();
                        break;
                }
            }
        };

        const handleRightClick = (evt: MouseEvent) => {
            evt.preventDefault();
            if (propsRef.current.isPaused || !isPointerLockedRef.current) return;

            const scene = sceneRef.current;
            if (!scene) return;

            // Right click first checks for interacting with a PLACED item.
            const ray = playerCameraRef.current.getForwardRay(1.5);
            const pickResultPlaced = scene.pickWithRay(ray, (mesh: any) => mesh.isPickable && mesh.metadata?.type === 'pickup' && mesh.metadata?.instanceId !== undefined);
            
            if (pickResultPlaced && pickResultPlaced.hit) {
                const instanceId = pickResultPlaced.pickedMesh.metadata.instanceId;
                const placedItem = propsRef.current.placedItems.find(p => p.instanceId === instanceId);
                if (placedItem && (placedItem.id === ItemId.DOTSProjector || placedItem.id === ItemId.Lantern || placedItem.id === ItemId.VideoCamera)) {
                    propsRef.current.onUpdatePlacedItem({ ...placedItem, isOn: !placedItem.isOn });
                    return; // Interaction complete
                }
            }

            // If not interacting with a placed item, perform secondary use of HELD item.
            const equippedItem = propsRef.current.equippedItem;
            if (!equippedItem) return;
        
            switch (equippedItem.id) {
                case ItemId.SpiritBox:
                    propsRef.current.onSpiritBoxToggle();
                    break;
                case ItemId.VideoCamera:
                    if (propsRef.current.heldCameraState) {
                        propsRef.current.onUpdateHeldCameraState({ ...propsRef.current.heldCameraState, isOn: !propsRef.current.heldCameraState.isOn });
                    }
                    break;
            }
        };

        const handleWheel = (evt: WheelEvent) => {
            if (propsRef.current.isPaused || !isPointerLockedRef.current) return;
            evt.preventDefault();
            const direction = Math.sign(evt.deltaY);
            const inventorySize = 4;
            let currentIndex = propsRef.current.equippedItemIndex ?? (direction > 0 ? -1 : 0);
            
            if (direction > 0) { // scroll down
                currentIndex = (currentIndex + 1) % inventorySize;
            } else { // scroll up
                currentIndex = (currentIndex - 1 + inventorySize) % inventorySize;
            }
            propsRef.current.onSwitchItem(currentIndex);
        };

        canvas.addEventListener("mousedown", handleMouseDown);
        canvas.addEventListener("wheel", handleWheel);
        canvas.addEventListener("contextmenu", handleRightClick);

        const initialize = async () => {
            setupPlayerCamera(scene, canvas);
            setupMenuCamera(scene);
            cameraManagerRef.current = new CameraManager(scene, playerCameraRef.current, viewModelCameraRef.current);
            await setupMenuScene(scene);
            
            // When using multiple cameras, we need to manage the depth buffer clearing manually.
            // This ensures the viewmodel camera renders on top of the world camera's view.
            scene.onBeforeCameraRenderObservable.add((cam: any) => {
                if (cam === viewModelCameraRef.current) {
                    // Clear the depth buffer before rendering the viewmodel
                    scene.getEngine().clear(null, false, true, false);
                }
            });

            scene.activeCameras.push(playerCameraRef.current, viewModelCameraRef.current);
            
            engine.runRenderLoop(() => {
                if (!scene.isDisposed) {
                    scene.render();
                }
            });
            window.addEventListener('resize', () => engine.resize());
        };

        initialize().catch(error => {
            console.error("Game canvas initialization failed:", error);
        });

        return () => {
            canvas.removeEventListener("click", handleClick);
            canvas.removeEventListener("mousedown", handleMouseDown);
            canvas.removeEventListener("wheel", handleWheel);
            canvas.removeEventListener("contextmenu", handleRightClick);
            document.removeEventListener('pointerlockchange', handlePointerLockChange, false);
            cameraManagerRef.current?.dispose();
            soundManagerRef.current?.dispose();
            soundManagerRef.current = null;
            scene.dispose();
            engine.dispose();
        };
    }, [setupMenuScene]);

    useEffect(() => {
        if (props.isAudioUnlocked && BABYLON.Engine.audioEngine) {
            if (BABYLON.Engine.audioEngine.isUnlocked === false) {
                BABYLON.Engine.audioEngine.unlock();
            }
        }
    }, [props.isAudioUnlocked]);

    useEffect(() => {
        soundManagerRef.current?.setMuted(props.isMuted);
    }, [props.isMuted]);

    useEffect(() => {
        const scene = sceneRef.current;
        if (!scene || gameState !== GameState.Playing) return;

        let lastFootstepTime = 0;
        const footstepInterval = 400;
        const runningFootstepInterval = 280;

        const gameLoop = () => {
            if (propsRef.current.isPaused) return;
            const camera = playerCameraRef.current;
            if (!camera) return;

            const deltaTime = scene.getEngine().getDeltaTime() / 1000.0;
            const targetY = isCrouchingRef.current ? 1.0 : 1.8;
            camera.position.y = BABYLON.Scalar.Lerp(camera.position.y, targetY, 0.1);
            camera.ellipsoid.y = isCrouchingRef.current ? 0.5 : 0.9;

            const isMovingForward = inputMapRef.current["w"] || inputMapRef.current["W"] || inputMapRef.current["ArrowUp"];
            const canSprint = isMovingForward && !isCrouchingRef.current;
            const isSprinting = inputMapRef.current["Shift"] && canSprint && propsRef.current.stamina > 0;

            if (isSprinting) {
                propsRef.current.setStamina(s => Math.max(0, s - 10 * deltaTime));
            } else if (propsRef.current.stamina < 100) {
                propsRef.current.setStamina(s => Math.min(100, s + 5 * deltaTime));
            }

            const baseSpeed = isCrouchingRef.current ? 1.5 : 3.5;
            const currentSpeed = isSprinting ? baseSpeed * 1.6 : baseSpeed;
            
            let input = new BABYLON.Vector3();
            if (inputMapRef.current["w"] || inputMapRef.current["W"] || inputMapRef.current["ArrowUp"]) input.z = 1;
            if (inputMapRef.current["s"] || inputMapRef.current["S"] || inputMapRef.current["ArrowDown"]) input.z = -1;
            if (inputMapRef.current["a"] || inputMapRef.current["A"] || inputMapRef.current["ArrowLeft"]) input.x = -1;
            if (inputMapRef.current["d"] || inputMapRef.current["D"] || inputMapRef.current["ArrowRight"]) input.x = 1;

            if (input.length() > 0) {
                input.normalize();
                const moveDirection = camera.getDirection(input).scale(currentSpeed * deltaTime);
                camera._collideWithWorld(moveDirection);
                const now = Date.now();
                const currentFootstepInterval = isSprinting ? runningFootstepInterval : footstepInterval;
                if (now - lastFootstepTime > currentFootstepInterval) {
                    soundManagerRef.current?.playFootstep(propsRef.current.currentRoom !== 'Outside');
                    lastFootstepTime = now;
                }
            }

            if (flashlightRef.current) {
                flashlightRef.current.position = camera.globalPosition;
                flashlightRef.current.direction = camera.getForwardRay().direction;
            }
            if (uvLightRef.current) {
                uvLightRef.current.position = camera.globalPosition;
                uvLightRef.current.direction = camera.getForwardRay().direction;
            }

            if (ghostMeshRef.current && ghostTargetPositionRef.current) {
                ghostPositionRef.current = BABYLON.Vector3.Lerp(ghostPositionRef.current, ghostTargetPositionRef.current, 0.02);
                ghostMeshRef.current.position = ghostPositionRef.current;
            }
            
            const now = performance.now();
            if (now - lastRoomCheckTimeRef.current > 200) {
                lastRoomCheckTimeRef.current = now;
                let foundRoomId = null;
                let foundRoomType = 'Outside';
                if (houseLayoutRef.current) {
                    for (const room of houseLayoutRef.current.rooms) {
                        if (camera.position.x >= room.x && camera.position.x <= room.x + room.width &&
                            camera.position.z >= room.z && camera.position.z <= room.z + room.depth) {
                            foundRoomId = room.id;
                            foundRoomType = room.type;
                            break;
                        }
                    }
                }
                if (foundRoomId !== currentRoomIdRef.current) {
                    currentRoomIdRef.current = foundRoomId;
                    propsRef.current.onRoomChange(foundRoomType);
                }
                const isInside = foundRoomId !== null;
                soundManagerRef.current?.update(isInside);
            }

            if (now - lastPositionUpdateTimeRef.current > 100) {
                lastPositionUpdateTimeRef.current = now;
                onPlayerPositionUpdate({ x: camera.position.x, y: camera.position.y, z: camera.position.z });
            }

            if (now - lastInteractableCheckTimeRef.current > 100) {
                lastInteractableCheckTimeRef.current = now;
                let isLookingAtInteractable = false;
                const ray = camera.getForwardRay(1.5);
                const pickResult = scene.pickWithRay(ray, (mesh: any) => mesh.isPickable && (mesh.metadata?.type === 'pickup' || mesh.metadata?.type === 'door' || mesh.metadata?.action === 'open_manifest'));
                isLookingAtInteractable = !!(pickResult && pickResult.hit);
                onInteractableFocusChange(isLookingAtInteractable);
            }

            // ENHANCE: Add a safety net to teleport the player back if they fall through the map.
            if (camera.position.y < -50) {
                camera.position = new BABYLON.Vector3(1, 1.8, -15.81); // Reset to starting position
            }
        };
        scene.onBeforeRenderObservable.add(gameLoop);
        return () => {
            if (scene && !scene.isDisposed) {
                scene.onBeforeRenderObservable.removeCallback(gameLoop);
            }
        };
    }, [gameState, onPlayerStatusUpdate, onPlayerPositionUpdate, onInteractableFocusChange]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey) {
                e.preventDefault();
            }
            inputMapRef.current[e.key] = true;
            if (propsRef.current.isPaused) {
                if(e.key === 'Escape'){
                     propsRef.current.onMonitorInteraction();
                }
                return;
            }

            if (e.key === 't' || e.key === 'T') setIsFlashlightOn(prev => !prev);
            if (e.key === 'c' || e.key === 'C') setIsCrouching(prev => !prev);
            
            if (e.key === 'l' || e.key === 'L') {
                propsRef.current.onLighterStateChange(!propsRef.current.isLighterOn);
            }
            
            if (e.key === 'g' || e.key === 'G') {
                const equippedItem = propsRef.current.equippedItem;
                if (equippedItem) {
                    const camera = playerCameraRef.current;
                    const placePos = camera.position.add(camera.getForwardRay(1).direction);
                    const groundRay = new BABYLON.Ray(placePos, new BABYLON.Vector3(0, -1, 0), 2);
                    const groundPick = sceneRef.current.pickWithRay(groundRay, (mesh: any) => mesh.checkCollisions);
                    const finalY = groundPick?.hit ? groundPick.pickedPoint.y + 0.05 : 0.05;
                    const finalRotation = { x: 0, y: camera.rotation.y, z: 0 };
                    propsRef.current.onPlaceItem(equippedItem.id, { x: placePos.x, y: finalY, z: placePos.z }, finalRotation, true);
                }
            }
            
            if (e.key === 'e' || e.key === 'E') {
                const scene = sceneRef.current;
                const camera = playerCameraRef.current;
                if (!scene || !camera) return;

                const ray = camera.getForwardRay(1.5);
                const pickResult = scene.pickWithRay(ray, (mesh: any) => mesh.isPickable && (mesh.metadata?.type === 'pickup' || mesh.metadata?.type === 'door' || mesh.metadata?.action === 'open_manifest'));
        
                if (pickResult && pickResult.hit) {
                    let pickedMesh = pickResult.pickedMesh;
                    let metadata = null;
                    while (pickedMesh) {
                        if (pickedMesh.metadata) {
                            metadata = pickedMesh.metadata;
                            break;
                        }
                        pickedMesh = pickedMesh.parent;
                    }
        
                    if (metadata) {
                        if (metadata.type === 'pickup' && metadata.instanceId !== undefined) {
                            propsRef.current.onPickUpItem(metadata.instanceId);
                        } else if (metadata.action === 'open_manifest') {
                            propsRef.current.onMonitorInteraction();
                        } else if (metadata.type === 'door') {
                            const doorId = metadata.id;
                            const doorPivot = doorPivotsRef.current.get(doorId);
                            const doorState = doorStatesRef.current.get(doorId);
                            if (doorPivot && doorState) {
                                doorState.isOpen = !doorState.isOpen;
                                const targetRotation = doorState.isOpen ? Math.PI / 2 : 0;
                                
                                const ease = new BABYLON.SineEase();
                                ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
                        
                                const anim = new BABYLON.Animation(
                                    `door_anim_${doorId}_${Date.now()}`,
                                    'rotation.y',
                                    30,
                                    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
                                    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
                                );
                                anim.setKeys([
                                    { frame: 0, value: doorPivot.rotation.y },
                                    { frame: 15, value: targetRotation }
                                ]);
                                anim.setEasingFunction(ease);
                                
                                scene.beginDirectAnimation(doorPivot, [anim], 0, 15, false);
                            }
                        }
                    }
                }
            }

            if (e.key === 'f' || e.key === 'F') { // Secondary use
                const equippedItem = propsRef.current.equippedItem;
                if (!equippedItem) return;
                switch (equippedItem.id) {
                    case ItemId.VideoCamera:
                        if (propsRef.current.heldCameraState?.isOn) {
                            propsRef.current.onUpdateHeldCameraState({ ...propsRef.current.heldCameraState, isIR: !propsRef.current.heldCameraState.isIR });
                        }
                        break;
                    case ItemId.UVLight:
                        setIsUvLightOn(prev => !prev);
                        break;
                }
            }

            if (e.key === 'j' || e.key === 'J') {
                if (propsRef.current.gameState === GameState.Playing) onSetGameState(GameState.Journal);
                else if (propsRef.current.gameState === GameState.Journal) onSetGameState(GameState.Playing);
            }
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            inputMapRef.current[e.key] = false;
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    useEffect(() => {
        const scene = sceneRef.current;
        if (!scene) return;
        
        const { onLoadingUpdate, onTransitionComplete, selectedMap, weather, activeGhost } = propsRef.current;

        const clearGameAssets = () => {
             if (gameContainerRef.current) {
                gameContainerRef.current.dispose(false, true); // Dispose container and all children
            }
            // Clear refs
            placedMeshesRef.current.clear();
            placedCameraNodesRef.current.clear();
            cameraMonitorScreenMeshesRef.current = [];
            dotsProjectorsRef.current.clear();
            interactableMeshesRef.current.clear();
            uvEvidenceMeshesRef.current = [];
            placedLanternEffectsRef.current.clear();
            lightFixturesRef.current.clear();
            doorPivotsRef.current.clear();
            doorStatesRef.current.clear();
            houseLayoutRef.current = null;
        }

        const loadGameAssets = async () => {
            if (!selectedMap || !activeGhost) return;
            
            if (menuContainerRef.current) {
                menuContainerRef.current.dispose(false, true);
                menuContainerRef.current = null;
            }

            clearGameAssets();
            
            const gameContainer = new BABYLON.TransformNode("gameContainer", scene);
            gameContainerRef.current = gameContainer;

            if (soundManagerRef.current) {
                soundManagerRef.current.dispose();
            }
            onLoadingUpdate(0, "Initializing audio...");
            soundManagerRef.current = new SoundManager(scene, weather, () => {});
            await soundManagerRef.current.waitForReady();
            
            const ambientLight = new BABYLON.HemisphericLight("gameAmbient", new BABYLON.Vector3(0, 1, 0), scene);
            ambientLight.intensity = 0.7;
            ambientLight.parent = gameContainer;

            onLoadingUpdate(5, "Setting up operations tent...");
            const table = BABYLON.MeshBuilder.CreateBox("ops_table", { width: 3.2, height: 0.9, depth: 1.2 }, scene);
            table.position = new BABYLON.Vector3(1.2, 0.45, -14.3);
            const tableMaterial = new BABYLON.StandardMaterial("opsTableMat", scene);
            tableMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);
            table.material = tableMaterial;
            table.parent = gameContainer;
            table.checkCollisions = true;

            onLoadingUpdate(20, "Setting up monitoring station...");
            
            try {
                onLoadingUpdate(30, "Loading equipment...");
                const monitorResult = await loadModelWithTimeout("https://sharkvelocity.github.io/3d/assets/models/items/monitor.glb", scene, 15000);
                
                if (!monitorResult || !monitorResult.meshes || monitorResult.meshes.length === 0) {
                    throw new Error("Monitor model could not be loaded or is empty.");
                }
                const monitorRoot = monitorResult.meshes[0];
                monitorRoot.isVisible = false; // This is our template

                cameraMonitorScreenMeshesRef.current = [];

                const monitorBaseY = 0.9;
                const monitorBaseZ = -14.4;
                const monitorPositions = [
                    { x: 0.2, scale: 0.35, isManifest: false, camIndex: 0 },
                    { x: 0.6, scale: 0.35, isManifest: false, camIndex: 1 },
                    { x: 1.2, scale: 0.8, isManifest: true, camIndex: -1 },
                    { x: 1.8, scale: 0.35, isManifest: false, camIndex: 2 },
                    { x: 2.2, scale: 0.35, isManifest: false, camIndex: 3 },
                ];

                for (const [i, config] of monitorPositions.entries()) {
                    const newRoot = monitorRoot.clone(`monitor_inst_${i}`, gameContainer);
                    if (!newRoot) continue;

                    newRoot.position = new BABYLON.Vector3(config.x, monitorBaseY, monitorBaseZ);
                    newRoot.rotation.y = Math.PI;
                    newRoot.scaling.setAll(config.scale);
                    newRoot.isVisible = true;
                    newRoot.isPickable = false;

                    newRoot.getChildMeshes().forEach((m: any) => {
                        m.isVisible = true;
                        m.isPickable = false;
                    });

                    const screenMesh = newRoot.getChildMeshes(false, (m: any) => m.name.includes("screen"))[0];
                    if (!screenMesh) continue;

                    if (config.isManifest) {
                        screenMesh.isPickable = true;
                        screenMesh.metadata = { action: 'open_manifest' };
                        const offScreenMat = new BABYLON.StandardMaterial("manifestOffScreenMat", scene);
                        offScreenMat.diffuseColor = BABYLON.Color3.Black();
                        offScreenMat.emissiveColor = new BABYLON.Color3(0.01, 0.02, 0.01);
                        screenMesh.material = offScreenMat;
                    } else { // Camera monitor
                        cameraMonitorScreenMeshesRef.current[config.camIndex] = screenMesh;

                        const labelPlane = BABYLON.MeshBuilder.CreatePlane(`labelPlane_${config.camIndex}`, { width: 0.3, height: 0.1 }, scene);
                        labelPlane.parent = newRoot;
                        labelPlane.position = new BABYLON.Vector3(0, -0.2, -0.01);
                        labelPlane.isPickable = false;

                        const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(labelPlane);
                        const textBlock = new BABYLON.GUI.TextBlock();
                        textBlock.text = `CAM ${config.camIndex + 1}`;
                        textBlock.color = "white";
                        textBlock.fontSize = 96;
                        textBlock.fontFamily = "VT323";
                        advancedTexture.addControl(textBlock);
                    }
                }

            } catch(e) {
                console.error("Failed to load monitoring equipment:", e);
                onLoadingUpdate(100, "Error: Failed to load critical assets.");
                return;
            }

            let houseData;
            if (selectedMap.name === 'ProHouse') {
                onLoadingUpdate(40, "Generating procedural layout...");
                houseLayoutRef.current = createRandomLayout();
                onLoadingUpdate(50, "Constructing house...");
                const { doorPivots } = await buildHouse(scene, houseLayoutRef.current, (p, m) => onLoadingUpdate(50 + p * 0.45, m));
                doorPivotsRef.current = doorPivots;

                const ground = BABYLON.MeshBuilder.CreateGround("proHouseGround", {width: 100, height: 100}, scene);
                const groundMat = new BABYLON.StandardMaterial("groundMat", scene);
                groundMat.diffuseTexture = new BABYLON.Texture("https://www.babylonjs-playground.com/textures/grass.png", scene);
                groundMat.diffuseTexture.uScale = 20;
                groundMat.diffuseTexture.vScale = 20;
                ground.material = groundMat;
                ground.checkCollisions = true;
                ground.parent = gameContainer;

            } else if (selectedMap.modelUrl) {
                onLoadingUpdate(40, "Loading investigation area...");
                try {
                    const result = await loadModelWithTimeout(selectedMap.modelUrl, scene, 30000, (evt) => {
                        if (evt.lengthComputable) {
                            const progress = (evt.loaded / evt.total) * 55; // This step covers from 40% to 95%
                            onLoadingUpdate(40 + progress, "Loading investigation area...");
                        }
                    });
                    const mapRoot = result.meshes[0];
                    // FIX: Ensure map scale is normalized and collisions are enabled on all meshes.
                    mapRoot.scaling.setAll(1);
                    mapRoot.parent = gameContainer;
                    mapRoot.checkCollisions = true;
                    mapRoot.getChildMeshes(true).forEach((m: any) => {
                        m.checkCollisions = true;
                    });
                } catch (e) {
                    console.error(`Failed to load map model: ${selectedMap.modelUrl}`, e);
                    onLoadingUpdate(100, "Error: Failed to load map.");
                    return;
                }
            }

            if(doorPivotsRef.current) {
                doorPivotsRef.current.forEach((pivot, id) => {
                    doorStatesRef.current.set(id, { isOpen: false });
                });
            }
            
            playerCameraRef.current.position = new BABYLON.Vector3(1, 1.8, -15.81);
            onLoadingUpdate(95, "Finalizing scene...");
            scene.collisionsEnabled = true;

            onLoadingUpdate(100, "Ready for investigation.");
            setTimeout(() => {
                scene.activeCamera = playerCameraRef.current;
                onTransitionComplete();
            }, 500);
        };
        
        if (gameState === GameState.Loading && prevGameState !== GameState.Loading) {
            loadGameAssets();
        } else if (gameState === GameState.Playing && prevGameState === GameState.Loading) {
            if (playerCameraRef.current) {
                scene.activeCamera = playerCameraRef.current;
            }
        } else if (gameState === GameState.MainMenu && sceneRef.current) {
            if (menuCameraRef.current) {
                scene.activeCamera = menuCameraRef.current;
            }
            clearGameAssets();
            if (!menuContainerRef.current) {
                setupMenuScene(scene);
            }
        }

    }, [gameState, setupMenuScene]);

    useEffect(() => {
        const scene = sceneRef.current;
        if (!scene) return;
        
        const existingMeshIds = new Set(placedMeshesRef.current.keys());

        props.placedItems.forEach(async item => {
            if (!existingMeshIds.has(item.instanceId)) {
                try {
                    if (!item.modelUrl) return;
                    const result = await BABYLON.SceneLoader.ImportMeshAsync(null, item.modelUrl, "", scene, undefined, ".glb");
                    const rootMesh = result.meshes[0];
                    
                    if (!rootMesh) {
                        console.error(`Failed to load mesh for item: ${item.name}`);
                        return;
                    }

                    rootMesh.position = new BABYLON.Vector3(item.position.x, item.position.y, item.position.z);
                    rootMesh.rotation = new BABYLON.Vector3(item.rotation.x, item.rotation.y, item.rotation.z);
                    
                    rootMesh.metadata = { type: 'pickup', instanceId: item.instanceId };
                    rootMesh.getChildMeshes().forEach((m: any) => {
                        m.isPickable = true;
                        m.metadata = { type: 'pickup', instanceId: item.instanceId };
                    });

                    placedMeshesRef.current.set(item.instanceId, rootMesh);
                    
                    if (item.id === ItemId.VideoCamera) {
                        const cameraNode = new BABYLON.TransformNode(`camera_node_${item.instanceId}`, scene);
                        cameraNode.parent = rootMesh;
                        cameraNode.position = new BABYLON.Vector3(0, 0.1, 0); // Offset for lens
                        placedCameraNodesRef.current.set(item.instanceId, cameraNode);
                    }

                } catch (error) {
                    console.error(`Error loading item model ${item.name}:`, error);
                }
            } else {
                 const mesh = placedMeshesRef.current.get(item.instanceId);
                 if (mesh) {
                     // update state for existing items
                 }
            }
            existingMeshIds.delete(item.instanceId);
        });
        
        existingMeshIds.forEach(idToRemove => {
            const mesh = placedMeshesRef.current.get(idToRemove);
            if (mesh) mesh.dispose();
            placedMeshesRef.current.delete(idToRemove);

            if (placedCameraNodesRef.current.has(idToRemove)) {
                placedCameraNodesRef.current.get(idToRemove).dispose();
                placedCameraNodesRef.current.delete(idToRemove);
            }
        });

    }, [props.placedItems]);
    
    useEffect(() => {
        if (cameraManagerRef.current) {
            cameraManagerRef.current.update({
                heldCameraState: props.heldCameraState,
                placedCameras: props.placedCameras,
                isGhostNearby: props.playerStatus.isNearGhost,
                gameState: props.gameState,
            }, cameraMonitorScreenMeshesRef.current, placedCameraNodesRef.current);
        }
    }, [props.heldCameraState, props.placedCameras, props.playerStatus.isNearGhost, props.gameState]);


    useEffect(() => {
        const equippedItem = propsRef.current.equippedItem;

        if (equippedItemMeshRef.current) {
            equippedItemMeshRef.current.dispose();
            equippedItemMeshRef.current = null;
        }
        
        if (cameraManagerRef.current) {
            cameraManagerRef.current.setPipTargetMaterial(null);
            cameraManagerRef.current.setPipSourceNode(null);
        }

        if (equippedItem?.modelUrl && viewModelCameraRef.current) {
            BABYLON.SceneLoader.ImportMeshAsync(null, equippedItem.modelUrl, "", sceneRef.current, undefined, ".glb")
                .then((result: any) => {
                    if (equippedItemMeshRef.current) {
                        equippedItemMeshRef.current.dispose();
                    }
                    const root = result.meshes[0];
                    if (!root) {
                        console.error("Equipped item model loaded, but root mesh is missing.", equippedItem.modelUrl);
                        return;
                    }
                    
                    equippedItemMeshRef.current = root;
                    root.parent = viewModelCameraRef.current;

                    root.position = new BABYLON.Vector3(0.2, -0.25, 0.5);
                    root.rotation = new BABYLON.Vector3(0, 0, 0);
                    root.scaling.setAll(1);
                    
                    root.layerMask = VIEWMODEL_LAYER_MASK;
                    root.getChildMeshes(true).forEach((m: any) => m.layerMask = VIEWMODEL_LAYER_MASK);

                    if (equippedItem.id === ItemId.VideoCamera) {
                        const lensMaterial = root.getChildMeshes(false, (m: any) => m.material?.name === "lens")[0]?.material;
                        if (lensMaterial && cameraManagerRef.current) {
                            cameraManagerRef.current.setPipTargetMaterial(lensMaterial);
                            
                            const pipSource = new BABYLON.TransformNode("pip_source", sceneRef.current);
                            pipSource.parent = root;
                            pipSource.position = new BABYLON.Vector3(0, 0, 0.1); // Adjust as needed
                            cameraManagerRef.current.setPipSourceNode(pipSource);
                            pipSourceNodeRef.current = pipSource;
                        }
                    }
                })
                .catch(error => {
                    console.error(`Failed to load equipped item model: ${equippedItem.modelUrl}`, error);
                });
        }

        return () => {
            if (equippedItemMeshRef.current) {
                equippedItemMeshRef.current.dispose();
                equippedItemMeshRef.current = null;
            }
        };
    }, [props.equippedItem?.id, props.equippedItem?.modelUrl]);

    return (_jsx("div", { className: "w-full h-full relative", children: _jsx("canvas", { ref: canvasRef, className: "w-full h-full outline-none" }) }));
};

export default GameCanvas;
