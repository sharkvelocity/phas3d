
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { GameState, Weather, ItemId, PlayerStatus, Coordinates, Item, MenuStep, MapData, Ghost, PlacedItem } from './types';
import { GHOSTS } from './data/ghosts';
import { MAPS } from './data/maps';
import { WEATHER_TYPES } from './data/weather';
import { ITEMS, LIGHTER } from './data/items';
import GameCanvas from './components/GameCanvas';
import HUD from './components/HUD';
import MainMenu from './components/MainMenu';
import LoadingScreen from './components/LoadingScreen';

const App = () => {
    const [gameState, setGameState] = useState(GameState.MainMenu);
    const [menuStep, setMenuStep] = useState<MenuStep>('main');
    const [selectedMap, setSelectedMap] = useState<MapData | null>(null);
    const [selectedGhost, setSelectedGhost] = useState<Ghost | null>(null);
    const [currentWeather, setCurrentWeather] = useState(Weather.Calm);
    const [sanity, setSanity] = useState(100);
    const [stamina, setStamina] = useState(100);
    
    // New state management: `loadout...` for menu, `carriedInventory` for in-game
    const [loadoutGeneral, setLoadoutGeneral] = useState<(Item | null)[]>([]);
    const [loadoutCameras, setLoadoutCameras] = useState<(Item | null)[]>(Array(4).fill(null));
    const [carriedInventory, setCarriedInventory] = useState<(Item | null)[]>([]);
    const [truckInventory, setTruckInventory] = useState<(Item | null)[]>([]);

    const [equippedItemIndex, setEquippedItemIndex] = useState<number | null>(null);
    const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);
    const [placedItemInstanceCounter, setPlacedItemInstanceCounter] = useState(0);
    const [collectedEvidence, setCollectedEvidence] = useState(new Set());
    const [isLoading, setIsLoading] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState({ progress: 0, message: "Initializing..." });
    const [isGameActive, setIsGameActive] = useState(false);
    const [playerStatus, setPlayerStatus] = useState<PlayerStatus>({ isNearGhost: false, isInDark: false });
    const [emfLevel, setEmfLevel] = useState(0);
    const [playerCoordinates, setPlayerCoordinates] = useState<Coordinates | null>(null);
    const [endGameMessage, setEndGameMessage] = useState<string | null>(null);
    const [isLookingAtInteractable, setIsLookingAtInteractable] = useState(false);
    const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [heldCameraState, setHeldCameraState] = useState<{ isOn: boolean, isIR: boolean } | null>(null);
    const [currentRoom, setCurrentRoom] = useState('Outside');
    const [isLighterOn, setIsLighterOn] = useState(false);
    const [parabolicReading, setParabolicReading] = useState(0);
    const [isSmudging, setIsSmudging] = useState(false);
    const [isSpiritBoxOn, setIsSpiritBoxOn] = useState(false);
    const [monitorView, setMonitorView] = useState<'off' | 'menu'>('off');

    const equippedItem = equippedItemIndex !== null
        ? (equippedItemIndex === 3 ? LIGHTER : (carriedInventory[equippedItemIndex] || null))
        : null;

    const placedCameras = useMemo(() => placedItems.filter(p => p.id === ItemId.VideoCamera), [placedItems]);

    const handleSwitchItem = useCallback((index: number | null) => {
        const newIndex = equippedItemIndex === index ? null : index;
        setEquippedItemIndex(newIndex);
        const newEquippedItem = newIndex !== null
            ? (newIndex === 3 ? LIGHTER : carriedInventory[newIndex])
            : null;

        if (newEquippedItem?.id === ItemId.VideoCamera) {
            setHeldCameraState({ isOn: false, isIR: false });
        } else {
            setHeldCameraState(null);
        }
        
        if (newIndex !== 3 && isLighterOn) {
            setIsLighterOn(false);
        }
        
        if (newEquippedItem?.id !== ItemId.SpiritBox && isSpiritBoxOn) {
            setIsSpiritBoxOn(false);
        }
    }, [carriedInventory, equippedItemIndex, isLighterOn, isSpiritBoxOn]);

    const handleUpdateHeldCameraState = useCallback((newState: { isOn: boolean, isIR: boolean }) => {
        setHeldCameraState(newState);
    }, []);

    const resetGame = useCallback(() => {
        setGameState(GameState.MainMenu);
        setMenuStep('main');
        setIsGameActive(false);
        setSelectedMap(null);
        setSelectedGhost(null);
        setCurrentWeather(Weather.Calm);
        setSanity(100);
        setStamina(100);
        setLoadoutGeneral([]);
        setLoadoutCameras(Array(4).fill(null));
        setCarriedInventory([]);
        setTruckInventory([]);
        setEquippedItemIndex(null);
        setPlacedItems([]);
        setPlacedItemInstanceCounter(0);
        setCollectedEvidence(new Set());
        setEmfLevel(0);
        setPlayerCoordinates(null);
        setEndGameMessage(null);
        setHeldCameraState(null);
        setCurrentRoom('Outside');
        setIsLighterOn(false);
        setParabolicReading(0);
        setIsSmudging(false);
        setIsSpiritBoxOn(false);
        setMonitorView('off');
    }, []);

    const handleGuessMade = useCallback((message: string) => {
        setGameState(GameState.GameOver);
        setEndGameMessage(message);
        setTimeout(() => {
            resetGame();
        }, 6000);
    }, [resetGame]);

    const selectMapAndProceed = useCallback((map: MapData) => {
        const randomGhost = GHOSTS[Math.floor(Math.random() * GHOSTS.length)];
        setSelectedGhost(randomGhost);
        const randomWeather = WEATHER_TYPES[Math.floor(Math.random() * WEATHER_TYPES.length)];
        setCurrentWeather(randomWeather);
        setSelectedMap(map);
        setMenuStep('loadout');
    }, []);

    const startInvestigation = useCallback(() => {
        if (!selectedMap) return;

        setMenuStep('main');
        setSanity(100);
        setStamina(100);
        setCollectedEvidence(new Set());
        setEmfLevel(0);
        setHeldCameraState(null);
        setCurrentRoom('Outside');
        setIsLighterOn(false);
        setParabolicReading(0);
        setIsSmudging(false);
        setIsSpiritBoxOn(false);
        setMonitorView('off');

        const allSelectedItems = [
            ...loadoutGeneral.filter((i): i is Item => !!i),
            ...loadoutCameras.filter((i): i is Item => !!i)
        ];
        
        const initialCarried = allSelectedItems.slice(0, 3);
        while (initialCarried.length < 3) initialCarried.push(null);
        
        const remainingSelectedInTruck = allSelectedItems.slice(3);
        
        const allSelectedIds = new Set(allSelectedItems.map(item => item.id));
        const unselectedItems = ITEMS.filter(item => !allSelectedIds.has(item.id));

        setCarriedInventory(initialCarried);
        setTruckInventory([...remainingSelectedInTruck, ...unselectedItems]);
        setPlacedItems([]);

        if (initialCarried.length > 0 && initialCarried[0]) {
            setEquippedItemIndex(0);
            if (initialCarried[0].id === ItemId.VideoCamera) {
                setHeldCameraState({ isOn: false, isIR: false });
            }
        } else {
            setEquippedItemIndex(null);
        }
        
        setLoadingProgress({ progress: 0, message: 'Initializing...' });
        setGameState(GameState.Loading);
    }, [selectedMap, loadoutGeneral, loadoutCameras]);

    const handleGeneralLoadoutChange = useCallback((item: Item, action: 'add' | 'remove') => {
        if (action === 'add') {
            const generalItemCount = loadoutGeneral.filter(i => i).length;
            const cameraItemCount = loadoutCameras.filter(i => i).length;
            if (generalItemCount + cameraItemCount >= 3) {
                return; // Enforce 3-item total limit
            }
            const newItem: Item = { ...item };
            if (item.uses) {
                newItem.currentUses = item.uses;
            }
            setLoadoutGeneral(prev => [...prev, newItem]);
        } else { // 'remove' action
            const itemIndexToRemove = loadoutGeneral.map(i => i?.id).lastIndexOf(item.id);
            if (itemIndexToRemove > -1) {
                const newInv = [...loadoutGeneral];
                newInv.splice(itemIndexToRemove, 1);
                setLoadoutGeneral(newInv);
            }
        }
    }, [loadoutGeneral, loadoutCameras]);
    
    const handleCameraLoadoutChange = useCallback((index: number, type: 'camera' | 'tripod') => {
        setLoadoutCameras(prev => {
            const newCameras = [...prev];
            const currentCam = newCameras[index];
    
            if (type === 'camera') {
                if (currentCam) {
                    newCameras[index] = null; // remove camera
                } else {
                    const cameraItem = ITEMS.find(i => i.id === ItemId.VideoCamera);
                    if (cameraItem) {
                        newCameras[index] = { ...cameraItem, isMounted: false };
                    }
                }
            } else if (type === 'tripod') {
                if (currentCam) {
                    const isNowMounted = !currentCam.isMounted;
                    const updatedCam = { ...currentCam, isMounted: isNowMounted };
                    
                    if (isNowMounted) {
                        updatedCam.name = "Mounted Camera";
                        updatedCam.modelUrl = "https://sharkvelocity.github.io/3d/assets/models/items/video_tripod.glb";
                    } else {
                        const originalCamera = ITEMS.find(i => i.id === ItemId.VideoCamera)!;
                        updatedCam.name = originalCamera.name;
                        updatedCam.modelUrl = originalCamera.modelUrl;
                    }
                    newCameras[index] = updatedCam;
                }
            }
            return newCameras;
        });
    }, []);

    const handleUseSmudgeSticks = useCallback(() => {
        if (isSmudging) return;
        const itemIndex = carriedInventory.findIndex(item => item?.id === ItemId.SmudgeSticks);
        if (itemIndex === -1) return;

        setIsSmudging(true);
        setTimeout(() => setIsSmudging(false), 5000); 

        setCarriedInventory(prev => {
            const newInv = [...prev];
            newInv[itemIndex] = null;
            return newInv;
        });
        if (equippedItemIndex === itemIndex) {
            setEquippedItemIndex(null);
        }
    }, [carriedInventory, equippedItemIndex, isSmudging]);

    const handleUseSanityMeds = useCallback(() => {
        const itemIndex = carriedInventory.findIndex(item => item?.id === ItemId.SanityMeds);
        if (itemIndex === -1) return;

        setSanity(prev => Math.min(100, prev + 40));

        setCarriedInventory(prev => {
            const newInv = [...prev];
            newInv[itemIndex] = null;
            return newInv;
        });
        if (equippedItemIndex === itemIndex) {
            setEquippedItemIndex(null);
        }
    }, [carriedInventory, equippedItemIndex]);

    const handleUsePhotoCamera = useCallback(() => {
        const itemIndex = carriedInventory.findIndex(item => item?.id === ItemId.PhotoCamera);
        if (itemIndex === -1) return;
    
        const cameraItem = carriedInventory[itemIndex];
        if (!cameraItem || cameraItem.currentUses === undefined) return;
        
        const newUses = cameraItem.currentUses - 1;
    
        if (newUses > 0) {
            setCarriedInventory(prev => prev.map((item, index) => index === itemIndex ? { ...item!, currentUses: newUses } : item));
        } else {
            setCarriedInventory(prev => {
                const newInv = [...prev];
                newInv[itemIndex] = null;
                return newInv;
            });
            if (equippedItemIndex === itemIndex) {
                setEquippedItemIndex(null);
            }
        }
    }, [carriedInventory, equippedItemIndex]);

    const handleUpdatePlacedItem = useCallback((updatedItem: PlacedItem) => {
        setPlacedItems(prev => prev.map(item => item.instanceId === updatedItem.instanceId ? updatedItem : item));
    }, []);

    const handlePlaceOrDropItem = useCallback((itemId: ItemId, position: Coordinates, rotation: Coordinates, isDrop: boolean) => {
        const itemIndex = carriedInventory.findIndex(item => item?.id === itemId);
        if (itemIndex === -1) return;

        const itemInInventory = carriedInventory[itemIndex];
        if (!itemInInventory) return;

        const isConsumableUse = !isDrop && itemInInventory.uses && itemInInventory.currentUses !== undefined;

        if (isConsumableUse) {
            const newPlacedItem: PlacedItem = {
                ...itemInInventory,
                position,
                rotation,
                instanceId: placedItemInstanceCounter,
                isPickable: itemInInventory.id !== ItemId.Salt, // Placed salt is not pickable
            };
            setPlacedItems(prev => [...prev, newPlacedItem]);
            setPlacedItemInstanceCounter(prev => prev + 1);

            const newUses = itemInInventory.currentUses! - 1;
            if (newUses > 0) {
                setCarriedInventory(prev => prev.map((item, index) => index === itemIndex ? { ...item!, currentUses: newUses } : item));
            } else {
                setCarriedInventory(prev => {
                    const newInv = [...prev];
                    newInv[itemIndex] = null;
                    return newInv;
                });
                if (equippedItemIndex === itemIndex) {
                    setEquippedItemIndex(null);
                }
            }
        } else { // This handles dropping non-consumables, or dropping consumables without using them.
            const newPlacedItem: PlacedItem = {
                ...itemInInventory,
                position,
                rotation,
                instanceId: placedItemInstanceCounter,
                isPickable: true, // Dropped items are always pickable
            };
            
            if (itemInInventory.currentUses !== undefined) {
                newPlacedItem.currentUses = itemInInventory.currentUses;
            }

            if (isDrop) {
                newPlacedItem.wasDropped = true;
            }

            if (itemInInventory.id === ItemId.VideoCamera) {
                newPlacedItem.isOn = true;
                newPlacedItem.isIR = heldCameraState?.isIR ?? false;
                newPlacedItem.isMountedOnTripod = itemInInventory.isMounted;
                setHeldCameraState(null);
            } else if (itemInInventory.id === ItemId.SpiritBox) {
                newPlacedItem.isOn = isSpiritBoxOn;
                setIsSpiritBoxOn(false);
            } else {
                newPlacedItem.isOn = false;
            }

            setPlacedItems(prev => [...prev, newPlacedItem]);
            setPlacedItemInstanceCounter(prev => prev + 1);

            setCarriedInventory(prev => {
                const newInv = [...prev];
                newInv[itemIndex] = null;
                return newInv;
            });
            if (equippedItemIndex === itemIndex) {
                setEquippedItemIndex(null);
            }
        }
    }, [carriedInventory, equippedItemIndex, placedItemInstanceCounter, heldCameraState, isSpiritBoxOn]);

    const handlePickUpItem = useCallback((instanceId: number) => {
        if (carriedInventory.filter(i => i).length >= 3) return;

        const itemToPickUp = placedItems.find(p => p.instanceId === instanceId);
        if (!itemToPickUp || itemToPickUp.isPickable === false) return;
        
        const inventoryItem: Item = {
            id: itemToPickUp.id,
            name: itemToPickUp.name,
            description: itemToPickUp.description,
            slotless: itemToPickUp.slotless,
            uses: itemToPickUp.uses,
            modelUrl: ITEMS.find(i => i.id === itemToPickUp.id)?.modelUrl
        };
        
        if (itemToPickUp.currentUses !== undefined) {
            inventoryItem.currentUses = itemToPickUp.currentUses;
        }

        if (itemToPickUp.id === ItemId.VideoCamera) {
            inventoryItem.isMounted = itemToPickUp.isMountedOnTripod;
            if(inventoryItem.isMounted){
                inventoryItem.name = "Mounted Camera";
                inventoryItem.modelUrl = "https://sharkvelocity.github.io/3d/assets/models/items/video_tripod.glb";
            }
        }

        if (itemToPickUp.id === ItemId.SpiritBox) {
            setIsSpiritBoxOn(itemToPickUp.isOn ?? false);
        }

        setCarriedInventory(prev => {
            const newInv = [...prev];
            const emptySlotIndex = newInv.findIndex(slot => slot === null);
            if (emptySlotIndex !== -1) {
                newInv[emptySlotIndex] = inventoryItem;
            } else {
                newInv.push(inventoryItem);
            }
            return newInv;
        });

        setPlacedItems(prev => prev.filter(p => p.instanceId !== instanceId));
    }, [carriedInventory, placedItems]);

    const handleMountCamera = useCallback((tripodInstanceId: number) => {
        const cameraIndex = carriedInventory.findIndex(item => item?.id === ItemId.VideoCamera && !item.isMounted);
        if (cameraIndex === -1) return;

        const cameraItem = carriedInventory[cameraIndex];
        if (!cameraItem) return;

        const tripodToMountOn = placedItems.find(p => p.instanceId === tripodInstanceId);
        if (!tripodToMountOn) return;

        const newMountedCamera: PlacedItem = {
            ...cameraItem,
            position: tripodToMountOn.position,
            rotation: tripodToMountOn.rotation,
            instanceId: placedItemInstanceCounter,
            isMountedOnTripod: true,
            isOn: false,
            isIR: false,
        };

        setPlacedItemInstanceCounter(prev => prev + 1);
        setPlacedItems(prev => [...prev.filter(p => p.instanceId !== tripodInstanceId), newMountedCamera]);
        
        setCarriedInventory(prev => {
            const newInv = [...prev];
            newInv[cameraIndex] = null;
            return newInv;
        });

        if (equippedItemIndex === cameraIndex) {
            setEquippedItemIndex(null);
            setHeldCameraState(null);
        }
    }, [carriedInventory, placedItems, equippedItemIndex, placedItemInstanceCounter]);

    const handleDetachCamera = useCallback((cameraInstanceId: number) => {
        if (carriedInventory.filter(i => i).length >= 3) return;

        const cameraToDetach = placedItems.find(p => p.instanceId === cameraInstanceId);
        if (!cameraToDetach || !cameraToDetach.isMountedOnTripod) return;

        const tripodItemData = ITEMS.find(i => i.id === ItemId.Tripod);
        if (!tripodItemData) return;

        const newPlacedTripod: PlacedItem = {
            ...tripodItemData,
            position: cameraToDetach.position,
            rotation: cameraToDetach.rotation,
            instanceId: placedItemInstanceCounter,
        };

        const cameraItemData = ITEMS.find(i => i.id === ItemId.VideoCamera);
        if (!cameraItemData) return;

        const newInventoryCamera: Item = { ...cameraItemData };

        setPlacedItemInstanceCounter(prev => prev + 1);
        setPlacedItems(prev => [...prev.filter(p => p.instanceId !== cameraInstanceId), newPlacedTripod]);

        setCarriedInventory(prev => {
            const newInv = [...prev];
            const emptySlotIndex = newInv.findIndex(slot => slot === null);
            if (emptySlotIndex !== -1) {
                newInv[emptySlotIndex] = newInventoryCamera;
            } else {
                newInv.push(newInventoryCamera);
            }
            return newInv;
        });
    }, [carriedInventory, placedItems, placedItemInstanceCounter]);

    const handlePlayerPositionUpdate = useCallback((coords: Coordinates) => {
        setPlayerCoordinates(coords);
    }, []);

    const handleParanormalEvent = useCallback((severity: 'low' | 'medium' | 'high') => {
        if (gameState !== GameState.Playing) return;

        let sanityDrain = 0;
        switch (severity) {
            case 'low': sanityDrain = 5; break;
            case 'medium': sanityDrain = 10; break;
            case 'high': sanityDrain = 15; break;
        }

        if (selectedGhost?.name === 'Yurei') {
            sanityDrain *= 1.5;
        }
        setSanity(prev => Math.max(0, prev - sanityDrain));
    }, [selectedGhost, gameState]);

    const handleMonitorInteraction = useCallback(() => {
        setMonitorView(prev => (prev === 'off' ? 'menu' : 'off'));
    }, []);

    useEffect(() => {
        if (gameState !== GameState.Playing) return;

        const sanityInterval = setInterval(() => {
            setSanity(prevSanity => {
                if (prevSanity <= 0) return 0;

                let drainRate = 0;
                let isNearSafeLight = false;

                if (playerCoordinates) {
                    for (const item of placedItems) {
                        if (item.id === ItemId.Lantern && item.isOn) {
                            const distance = Math.sqrt(
                                Math.pow(playerCoordinates.x - item.position.x, 2) +
                                Math.pow(playerCoordinates.z - item.position.z, 2)
                            );
                            if (distance < 3) {
                                isNearSafeLight = true;
                                break;
                            }
                        }
                    }
                }

                if (playerStatus.isInDark && !isLighterOn && !isNearSafeLight && currentRoom !== 'Outside') {
                    drainRate += 0.1;
                }

                if (playerStatus.isNearGhost) {
                    drainRate += 0.2;
                }

                if (selectedGhost?.name === 'Yurei' && playerStatus.isNearGhost) {
                    drainRate *= 1.5;
                }
                
                if (currentWeather === Weather.BloodMoon) {
                    drainRate *= 2;
                }

                return Math.max(0, prevSanity - drainRate);
            });
        }, 2000);

        return () => clearInterval(sanityInterval);
    }, [gameState, playerStatus, selectedGhost, currentWeather, isLighterOn, placedItems, playerCoordinates, currentRoom]);
    
    const handleTransitionComplete = useCallback(() => {
        setIsLoading(false);
        setGameState(GameState.Playing);
        setIsGameActive(true);
    }, []);

    const handleLoadingUpdate = useCallback((progress: number, message: string) => {
        setLoadingProgress({ progress, message });
    }, []);

    const handleUnlockAudio = useCallback(() => {
        if (!isAudioUnlocked) {
            setIsMuted(false);
            setIsAudioUnlocked(true);
        }
    }, [isAudioUnlocked]);

    const EndGameScreen = () => (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col justify-center items-center z-40">
            <h2 className="text-4xl font-bold text-yellow-300 text-center max-w-3xl">{endGameMessage}</h2>
            <p className="mt-4 text-xl text-gray-400">Returning to main menu...</p>
        </div>
    );

    return (
        <div className="w-screen h-screen bg-black">
            {gameState === GameState.Loading && <LoadingScreen progress={loadingProgress.progress} message={loadingProgress.message} />}
            {endGameMessage && <EndGameScreen />}
            {gameState === GameState.MainMenu && (
                <MainMenu
                    menuStep={menuStep}
                    onSetMenuStep={setMenuStep}
                    onSelectMap={selectMapAndProceed}
                    onGeneralLoadoutChange={handleGeneralLoadoutChange}
                    onCameraLoadoutChange={handleCameraLoadoutChange}
                    onStartInvestigation={startInvestigation}
                    isAudioUnlocked={isAudioUnlocked}
                    onUnlockAudio={handleUnlockAudio}
                    maps={MAPS}
                    items={ITEMS}
                    generalItems={loadoutGeneral}
                    cameraItems={loadoutCameras}
                    selectedMap={selectedMap}
                    weather={currentWeather}
                />
            )}
            <GameCanvas
                activeGhost={selectedGhost}
                weather={currentWeather}
                selectedMap={selectedMap}
                isPaused={gameState !== GameState.Playing || monitorView !== 'off'}
                gameState={gameState}
                onSetGameState={setGameState}
                equippedItem={equippedItem}
                equippedItemIndex={equippedItemIndex}
                inventory={carriedInventory}
                sanity={sanity}
                stamina={stamina}
                setStamina={setStamina}
                placedItems={placedItems}
                onSwitchItem={handleSwitchItem}
                onPlayerStatusUpdate={setPlayerStatus}
                playerStatus={playerStatus}
                onEmfUpdate={setEmfLevel}
                onPlaceItem={handlePlaceOrDropItem}
                onUpdatePlacedItem={handleUpdatePlacedItem}
                onPickUpItem={handlePickUpItem}
                onPlayerPositionUpdate={handlePlayerPositionUpdate}
                onInteractableFocusChange={setIsLookingAtInteractable}
                heldCameraState={heldCameraState}
                onUpdateHeldCameraState={handleUpdateHeldCameraState}
                onRoomChange={setCurrentRoom}
                currentRoom={currentRoom}
                isLighterOn={isLighterOn}
                onLighterStateChange={setIsLighterOn}
                isSpiritBoxOn={isSpiritBoxOn}
                onSpiritBoxToggle={() => setIsSpiritBoxOn(prev => !prev)}
                onParabolicUpdate={setParabolicReading}
                isSmudging={isSmudging}
                onUseSmudgeSticks={handleUseSmudgeSticks}
                onUseSanityMeds={handleUseSanityMeds}
                onUsePhotoCamera={handleUsePhotoCamera}
                onParanormalEvent={handleParanormalEvent}
                onMountCamera={handleMountCamera}
                onDetachCamera={handleDetachCamera}
                onTransitionComplete={handleTransitionComplete}
                onLoadingUpdate={handleLoadingUpdate}
                isAudioUnlocked={isAudioUnlocked}
                isMuted={isMuted}
                onMonitorInteraction={handleMonitorInteraction}
                monitorView={monitorView}
                placedCameras={placedCameras}
            />
            {isGameActive && (
                <HUD
                    sanity={sanity}
                    stamina={stamina}
                    inventory={carriedInventory}
                    equippedItem={equippedItem}
                    equippedItemIndex={equippedItemIndex}
                    emfLevel={emfLevel}
                    playerCoordinates={playerCoordinates}
                    isInteractable={isLookingAtInteractable}
                    isAudioUnlocked={isAudioUnlocked}
                    isMuted={isMuted}
                    onToggleMute={() => setIsMuted(prev => !prev)}
                    currentRoom={currentRoom}
                    isLighterOn={isLighterOn}
                    parabolicReading={parabolicReading}
                    gameState={gameState}
                    ghosts={GHOSTS}
                    actualGhost={selectedGhost}
                    onClose={() => setGameState(GameState.Playing)}
                    onGuessMade={handleGuessMade}
                    items={ITEMS}
                    onSetInventory={setCarriedInventory}
                    truckInventory={truckInventory}
                    // FIX: Corrected typo from 'setSetTruckInventory' to 'setTruckInventory'.
                    onSetTruckInventory={setTruckInventory}
                    monitorView={monitorView}
                    onMonitorInteraction={handleMonitorInteraction}
                />
            )}
        </div>
    );
};

export default App;