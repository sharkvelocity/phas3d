import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useEffect, useRef, useState } from 'react';
import { ItemId, GameState, Item, Coordinates, Ghost } from '../types';
import { LIGHTER } from '../data/items';
import Journal from './Journal';

const iconRoot = "https://sharkvelocity.github.io/3d/assets/icons/";

const iconMap: { [key in ItemId]?: string } = {
    [ItemId.Flashlight]: 'flashlight.png',
    [ItemId.EMFReader]: 'emf.png',
    [ItemId.SpiritBox]: 'spirit_box.png',
    [ItemId.GhostWritingBook]: 'notebook.png',
    [ItemId.PhotoCamera]: 'camera.png',
    [ItemId.VideoCamera]: 'video_camera.png',
    [ItemId.UVLight]: 'uv.png',
    [ItemId.Thermometer]: 'thermometer.png',
    [ItemId.Lighter]: 'lighter.png',
    [ItemId.ParabolicMicrophone]: 'Parabolic.png',
    [ItemId.DOTSProjector]: 'dots.png',
    [ItemId.SanityMeds]: 'sanity.png',
    [ItemId.SmudgeSticks]: 'smudge.png',
    [ItemId.Salt]: 'salt.png',
};

const BrainIcon = (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor" {...props}>
        {/* FIX: Completed the SVG path data. */}
        <path d="M12 2C9.25 2 7 4.25 7 7c0 1.43.57 2.73 1.5 3.69V18c0 1.1.9 2 2 2h3c1.1 0 2-.9 2-2v-7.31c.93-.96 1.5-2.26 1.5-3.69 0-2.75-2.25-5-5-5zm-1 15v-1.1c.33.07.66.1 1 .1s.67-.03 1-.1V17h-2zm3-3.82c-.63.5-1.43.82-2 .82s-1.37-.32-2-.82V12h4v1.18zM12 4c1.65 0 3 1.35 3 3s-1.35 3-3 3-3-1.35-3-3 1.35-3 3-3z"/>
    </svg>
);

// FIX: Added HUDProps interface to define component props.
interface HUDProps {
    sanity: number;
    stamina: number;
    inventory: (Item | null)[];
    equippedItem: Item | null;
    equippedItemIndex: number | null;
    emfLevel: number;
    playerCoordinates: Coordinates | null;
    isInteractable: boolean;
    isAudioUnlocked: boolean;
    isMuted: boolean;
    onToggleMute: () => void;
    currentRoom: string;
    isLighterOn: boolean;
    parabolicReading: number;
    gameState: GameState;
    ghosts: Ghost[];
    actualGhost: Ghost | null;
    onClose: () => void;
    onGuessMade: (message: string) => void;
    items: Item[];
    onSetInventory: React.Dispatch<React.SetStateAction<(Item | null)[]>>;
    truckInventory: (Item | null)[];
    onSetTruckInventory: React.Dispatch<React.SetStateAction<(Item | null)[]>>;
    monitorView: 'off' | 'menu';
    onMonitorInteraction: () => void;
}

// FIX: Reconstructed the HUD component as it was missing from the file.
const HUD = ({
    sanity,
    stamina,
    inventory,
    equippedItem,
    equippedItemIndex,
    emfLevel,
    playerCoordinates,
    isInteractable,
    isAudioUnlocked,
    isMuted,
    onToggleMute,
    currentRoom,
    isLighterOn,
    parabolicReading,
    gameState,
    ghosts,
    actualGhost,
    onClose,
    onGuessMade,
    items,
    onSetInventory,
    truckInventory,
    onSetTruckInventory,
    monitorView,
    onMonitorInteraction,
}: HUDProps) => {
    const [showTooltip, setShowTooltip] = useState(false);
    // FIX: Replaced `NodeJS.Timeout` with `ReturnType<typeof setTimeout>` to use the correct browser-compatible type.
    const tooltipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (equippedItem && equippedItem.name) {
            setShowTooltip(true);
            if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
            tooltipTimeoutRef.current = setTimeout(() => {
                setShowTooltip(false);
            }, 2000);
        } else {
            setShowTooltip(false);
        }
        return () => {
            if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
        };
    }, [equippedItem]);

    const renderInventory = () => {
        const slots = [0, 1, 2];
        const lighterSlot = 3;

        return (
            <div className="flex items-center gap-2">
                {slots.map(index => {
                    const item = inventory[index];
                    const isEquipped = equippedItemIndex === index;
                    return (
                        <div key={index} className={`w-16 h-16 border-2 flex items-center justify-center transition-all duration-200 ${isEquipped ? 'bg-yellow-400/30 border-yellow-400' : 'bg-black/50 border-gray-600'}`}>
                            {item && iconMap[item.id] && (
                                <img src={`${iconRoot}${iconMap[item.id]}`} alt={item.name} className="w-12 h-12" />
                            )}
                        </div>
                    );
                })}
                <div className={`w-16 h-16 border-2 flex items-center justify-center transition-all duration-200 ${equippedItemIndex === lighterSlot ? 'bg-yellow-400/30 border-yellow-400' : 'bg-black/50 border-gray-600'}`}>
                    {iconMap[ItemId.Lighter] && <img src={`${iconRoot}${iconMap[ItemId.Lighter]}`} alt="Lighter" className="w-12 h-12" />}
                </div>
            </div>
        );
    };

    const renderMonitorView = () => {
        if (monitorView === 'off' || !actualGhost) return null;

        const handleSwap = (clickedItem: Item, from: 'truck' | 'carried', index: number) => {
            if (from === 'truck') {
                // Moving from truck to carried
                const emptySlotIndex = inventory.findIndex(i => i === null);
                if (emptySlotIndex !== -1) {
                    // Remove from truck
                    const newTruckInv = [...truckInventory];
                    newTruckInv.splice(index, 1);
                    onSetTruckInventory(newTruckInv);
                    // Add to carried
                    const newCarriedInv = [...inventory];
                    newCarriedInv[emptySlotIndex] = clickedItem;
                    onSetInventory(newCarriedInv);
                }
            } else { // from === 'carried'
                // Moving from carried to truck
                // Remove from carried
                const newCarriedInv = [...inventory];
                newCarriedInv[index] = null;
                onSetInventory(newCarriedInv);
                // Add to truck
                onSetTruckInventory(prev => [...prev, clickedItem]);
            }
        };

        const InventorySlot = ({ item, onClick, type }: { item: Item | null, onClick: () => void, type: 'carried' | 'truck' }) => (
            <button
                onClick={onClick}
                disabled={!item}
                className={`h-20 w-full flex items-center justify-center p-2 rounded transition-colors duration-200 text-left
                    ${item ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-800 border-2 border-dashed border-slate-700'}
                    ${type === 'carried' ? 'border-blue-500 border-2' : ''}
                `}
            >
                {item ? (
                    <div className="flex items-center gap-3">
                        {iconMap[item.id] && <img src={`${iconRoot}${iconMap[item.id]}`} alt={item.name} className="w-10 h-10" />}
                        <span className="text-lg">{item.name}</span>
                    </div>
                ) : <span className="text-slate-600 text-lg">Empty</span>}
            </button>
        );

        if (monitorView === 'menu') {
            return (
                <div className="absolute inset-0 z-20 flex justify-center items-center pointer-events-auto bg-black/70">
                    <div className="bg-slate-900/90 border-2 border-slate-700 p-6 rounded-lg w-full max-w-4xl text-white font-mono space-y-4 max-h-[80vh] flex flex-col">
                        <div className="flex justify-between items-center">
                            <h2 className="text-4xl text-red-500">EQUIPMENT MANIFEST</h2>
                            <button onClick={() => onMonitorInteraction()} className="p-2 px-4 text-3xl bg-red-700 hover:bg-red-600 rounded transition-colors">
                                EXIT
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-6 flex-grow min-h-0">
                            {/* Carried Items */}
                            <div className="flex flex-col">
                                <h3 className="text-2xl text-center text-blue-400 mb-3">CARRIED</h3>
                                <div className="space-y-3">
                                    {[0, 1, 2].map(index => {
                                        const item = inventory[index];
                                        return <InventorySlot key={`carried-${index}`} item={item} type="carried" onClick={() => item && handleSwap(item, 'carried', index)} />;
                                    })}
                                </div>
                            </div>

                            {/* Truck Storage */}
                            <div className="flex flex-col min-h-0">
                                <h3 className="text-2xl text-center text-gray-400 mb-3">TRUCK STORAGE</h3>
                                <div className="space-y-2 overflow-y-auto pr-2 flex-grow bg-black/20 p-2 rounded">
                                    {truckInventory.filter(i => i).length > 0 ? truckInventory.map((item, index) => (
                                        item && <InventorySlot key={`truck-${item.id}-${index}`} item={item} type="truck" onClick={() => item && handleSwap(item, 'truck', index)} />
                                    )) : (
                                        <div className="h-full flex items-center justify-center text-slate-500">Storage is empty.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    }

    if (gameState === GameState.Journal && actualGhost) {
        return <Journal ghosts={ghosts} actualGhost={actualGhost} onClose={onClose} onGuessMade={onGuessMade} />;
    }
    
    return (
        <_Fragment>
            <div className="absolute inset-0 pointer-events-none z-10 text-white p-4 flex flex-col justify-between">
                <div className="flex items-start gap-4">
                    <div className="flex items-center gap-2 bg-black/50 p-2 rounded">
                        <BrainIcon className="text-blue-300" />
                        <span className="text-3xl font-bold">{Math.round(sanity)}%</span>
                    </div>
                    <div className="w-40 h-8 bg-black/50 rounded overflow-hidden border-2 border-gray-600 mt-1">
                        <div className="bg-green-500 h-full transition-all duration-300" style={{ width: `${stamina}%` }}></div>
                    </div>
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className={`w-2 h-2 rounded-full transition-colors duration-200 ${isInteractable ? 'bg-yellow-400' : 'bg-white/50'}`}></div>
                </div>

                <div className="absolute bottom-4 left-4 text-lg bg-black/50 p-2 rounded">
                    {playerCoordinates && (
                        <p>Coords: {playerCoordinates.x.toFixed(2)}, {playerCoordinates.y.toFixed(2)}, {playerCoordinates.z.toFixed(2)}</p>
                    )}
                    <p>EMF: {emfLevel}</p>
                    {parabolicReading > 0 && <p>Parabolic: {parabolicReading.toFixed(2)}</p>}
                </div>

                <div className="absolute bottom-4 right-4 flex flex-col items-end">
                    {showTooltip && equippedItem && <div className="bg-black/70 p-2 rounded mb-2 text-xl">{equippedItem.name}</div>}
                    {renderInventory()}
                </div>
            </div>
            {renderMonitorView()}
            {gameState === GameState.Playing && (
                 <div className="absolute top-4 right-4 flex flex-col items-end gap-2 z-20">
                     <div className="bg-black/50 p-2 rounded text-xl">
                        <span>Room: {currentRoom}</span>
                    </div>
                    <button onClick={onToggleMute} className="w-14 h-14 text-sm bg-black/50 rounded-full flex items-center justify-center pointer-events-auto">
                        {isMuted ? 'MUTED' : 'MUTE'}
                    </button>
                 </div>
            )}
        </_Fragment>
    );
};

// FIX: Added a default export for the HUD component to resolve the import error.
export default HUD;