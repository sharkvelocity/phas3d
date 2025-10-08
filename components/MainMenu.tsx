
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// FIX: Import React to resolve React namespace issues for types like React.ReactNode.
import React from 'react';
import { Item, MapData, MenuStep, Weather, ItemId } from '../types';

interface MainMenuProps {
    menuStep: MenuStep;
    onSetMenuStep: (step: MenuStep) => void;
    onSelectMap: (map: MapData) => void;
    onGeneralLoadoutChange: (item: Item, action: 'add' | 'remove') => void;
    onCameraLoadoutChange: (index: number, type: 'camera' | 'tripod') => void;
    onStartInvestigation: () => void;
    isAudioUnlocked: boolean;
    onUnlockAudio: () => void;
    maps: MapData[];
    items: Item[];
    generalItems: (Item | null)[];
    cameraItems: (Item | null)[];
    selectedMap: MapData | null;
    weather: Weather;
}

interface ScreenProps extends MainMenuProps {
    handleInteraction: (callback: () => void) => void;
}

const MenuButton = ({ text, onClick, variant = 'default', textSize = 'text-4xl' }: { text: string, onClick: () => void, variant?: 'default' | 'primary' | 'danger', textSize?: string }) => {
    const baseClasses = `w-full text-white font-bold py-3 px-4 transition-colors duration-200 tracking-wider ${textSize}`;
    const variantClasses = {
        default: "bg-slate-700 hover:bg-slate-600",
        primary: "bg-green-700 hover:bg-green-600",
        danger: "bg-red-800 hover:bg-red-700",
    };
    return (
        <button onClick={onClick} className={`${baseClasses} ${variantClasses[variant]}`}>
            {text}
        </button>
    );
};

const MainScreen = ({ onSetMenuStep, handleInteraction }: ScreenProps) => (
    <div className="flex flex-col items-center justify-center text-center">
        <img src="https://sharkvelocity.github.io/3d/logo.png" alt="PhasmaPhoney" className="w-full max-w-2xl mb-4" />
        <p className="text-gray-400 text-2xl mb-8">Welcome back, I've prepared some jobs for you.</p>
        <div className="w-full max-w-sm space-y-4">
            <MenuButton text="Start" variant="danger" onClick={() => handleInteraction(() => onSetMenuStep('map_select'))} />
            <MenuButton text="Controls" onClick={() => handleInteraction(() => onSetMenuStep('controls'))} />
        </div>
    </div>
);

const MapSelectScreen = ({ maps, onSelectMap, onSetMenuStep, handleInteraction }: ScreenProps) => (
    <div className="flex flex-col items-center w-full">
        <h1 className="text-6xl text-red-500 mb-8 tracking-widest">CHOOSE YOUR ASSIGNMENT</h1>
        <div className="w-full max-w-lg space-y-4 text-2xl">
            {maps.filter(map => !map.name.startsWith("Test")).map(map => (
                <button
                    key={map.id}
                    onClick={() => handleInteraction(() => onSelectMap(map))}
                    className="w-full text-left p-4 rounded transition-colors duration-200 bg-slate-800 hover:bg-slate-700 border border-slate-600"
                >
                    <h2 className="font-bold text-3xl">{map.name.toUpperCase()}</h2>
                    <p className="text-gray-400">{map.description}</p>
                </button>
            ))}
        </div>
        <div className="mt-8 w-full max-w-sm">
            <MenuButton text="< BACK" onClick={() => handleInteraction(() => onSetMenuStep('main'))} />
        </div>
    </div>
);

const LoadoutScreen = ({ selectedMap, items, generalItems, cameraItems, onGeneralLoadoutChange, onCameraLoadoutChange, onSetMenuStep, onStartInvestigation, handleInteraction }: ScreenProps) => {
    if (!selectedMap) return null;

    const nonCameraItems = items.filter(item => item.id !== ItemId.VideoCamera && item.id !== ItemId.Tripod);
    const generalItemCount = generalItems.filter(i => i).length;
    const cameraItemCount = cameraItems.filter(i => i).length;
    const totalItemCount = generalItemCount + cameraItemCount;
    const allLoadoutItems = [...generalItems.filter(i => i), ...cameraItems.filter(i => i)];

    const ActionButton = ({ onClick, children, disabled, selected }: { onClick: () => void, children: React.ReactNode, disabled?: boolean, selected?: boolean }) => (
        <button
            onClick={() => handleInteraction(onClick)}
            disabled={disabled}
            className={`w-full h-12 flex-shrink-0 flex items-center justify-center rounded text-white font-bold text-2xl transition-colors
                ${disabled ? 'bg-slate-800 text-gray-600 cursor-not-allowed' : ''}
                ${!disabled && selected ? 'bg-green-600 hover:bg-green-500' : ''}
                ${!disabled && !selected ? 'bg-slate-600 hover:bg-slate-500' : ''}
            `}
        >
            {children}
        </button>
    );

    return (
        <div className="w-full h-full flex flex-col p-4 bg-slate-900/80 border border-slate-700 rounded-lg text-2xl max-w-6xl">
            <h1 className="text-5xl text-red-500 mb-4 border-b border-slate-700 pb-2 tracking-widest">LOADOUT - {selectedMap.name.toUpperCase()}</h1>
            <div className="flex-grow grid grid-cols-3 gap-6 min-h-0">
                <div className="col-span-2 flex flex-col min-h-0">
                    <h2 className="text-3xl text-gray-400 mb-2">Available Equipment</h2>
                    <div className="flex-grow overflow-y-auto pr-2 space-y-2">
                        
                        <div className="p-2 bg-slate-800 border border-slate-600 rounded">
                             <h3 className="font-bold text-xl mb-2 text-center">Camera Setup</h3>
                             <div className="grid grid-cols-5 gap-x-4 gap-y-2 items-center text-center">
                                 <div className="font-semibold text-gray-300">Camera</div>
                                 { [0, 1, 2, 3].map(i => <ActionButton key={i} onClick={() => onCameraLoadoutChange(i, 'camera')} selected={!!cameraItems[i]} disabled={!cameraItems[i] && totalItemCount >= 3}>{i+1}</ActionButton>) }
                                 
                                 <div className="font-semibold text-gray-300">Tripod</div>
                                 { [0, 1, 2, 3].map(i => <ActionButton key={i} onClick={() => onCameraLoadoutChange(i, 'tripod')} selected={!!cameraItems[i]?.isMounted} disabled={!cameraItems[i]}>{i+1}</ActionButton>) }
                             </div>
                        </div>

                        {nonCameraItems.map(item => {
                            const count = generalItems.filter(i => i?.id === item.id).length;
                            return (
                                <div key={item.id} className="flex items-center gap-2 p-2 bg-slate-700 border border-slate-600 rounded">
                                    <h3 className="font-bold text-xl flex-grow">{item.name} {count > 0 ? `(${count})` : ''}</h3>
                                    <button onClick={() => handleInteraction(() => onGeneralLoadoutChange(item, 'remove'))} disabled={count === 0} className="w-10 h-10 flex-shrink-0 bg-red-700 hover:bg-red-600 rounded text-white font-bold text-2xl disabled:bg-slate-800 disabled:text-gray-600">-</button>
                                    <button onClick={() => handleInteraction(() => onGeneralLoadoutChange(item, 'add'))} disabled={totalItemCount >= 3} className="w-10 h-10 flex-shrink-0 bg-green-700 hover:bg-green-600 rounded text-white font-bold text-2xl disabled:bg-slate-800 disabled:text-gray-600">+</button>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="col-span-1 flex flex-col">
                    <h2 className="text-3xl text-gray-400 mb-2">Mission Manifest (Total: {totalItemCount}/3)</h2>
                    <div className="flex-grow overflow-y-auto space-y-2 pr-1">
                        {allLoadoutItems.length > 0 ? allLoadoutItems.map((item, index) => (
                            <div key={index} className="p-3 bg-slate-800 border border-slate-600 rounded h-12 flex items-center">
                                <p className="text-white">{item?.name}</p>
                            </div>
                        )) : (
                             <div className="p-3 bg-slate-800 border border-slate-600 rounded h-12 flex items-center justify-center">
                                <p className="text-gray-500">- No items selected -</p>
                            </div>
                        )}
                    </div>
                    <div className="mt-auto pt-4 space-y-3">
                         <MenuButton text="DEPLOY" variant="primary" onClick={() => handleInteraction(onStartInvestigation)} textSize="text-3xl" />
                         <MenuButton text="< BACK" onClick={() => handleInteraction(() => onSetMenuStep('map_select'))} textSize="text-3xl" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const ControlsScreen = ({ onSetMenuStep, handleInteraction }: ScreenProps) => (
     <div className="flex flex-col items-center w-full max-w-3xl">
        <h1 className="text-6xl text-red-500 mb-8 tracking-widest">CONTROLS</h1>
        <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-3xl w-full">
            <div className="font-bold text-right">W, A, S, D</div><div className="text-left">Move</div>
            <div className="font-bold text-right">Shift</div><div className="text-left">Sprint</div>
            <div className="font-bold text-right">C</div><div className="text-left">Crouch</div>
            <div className="font-bold text-right">E</div><div className="text-left">Interact / Pick Up Item</div>
            <div className="font-bold text-right">G</div><div className="text-left">Drop Held Item</div>
            <div className="font-bold text-right">L</div><div className="text-left">Toggle Lighter</div>
            <div className="font-bold text-right">T</div><div className="text-left">Toggle Flashlight</div>
            <div className="font-bold text-right">F</div><div className="text-left">Special Action (IR, etc.)</div>
            <div className="font-bold text-right">J</div><div className="text-left">Toggle Journal</div>
            <div className="font-bold text-right">Scroll Wheel</div><div className="text-left">Switch Item</div>
            <div className="font-bold text-right">Left Click</div><div className="text-left">Use / Place Held Item</div>
            <div className="font-bold text-right">Right Click</div><div className="text-left">Alt-Use / Interact Placed</div>
        </div>
        <div className="mt-12 w-full max-w-sm">
            <MenuButton text="< BACK" onClick={() => handleInteraction(() => onSetMenuStep('main'))} />
        </div>
     </div>
);


const MainMenu = (props: MainMenuProps) => {
    const { menuStep } = props;
    
    const handleInteraction = (callback: () => void) => {
        if (!props.isAudioUnlocked) {
            props.onUnlockAudio();
        }
        callback();
    };

    const screenProps: ScreenProps = { ...props, handleInteraction };

    return (
        <div className="absolute inset-0 bg-[#020617] text-gray-200 z-30 flex flex-col justify-center items-center p-4">
            <div style={{ backgroundImage: 'repeating-linear-gradient(0deg, #FFF 0, #FFF 1px, transparent 1px, transparent 3px)' }} className="absolute inset-0 opacity-10 pointer-events-none bg-repeat-y" ></div>
            <div className="absolute inset-0 shadow-[inset_0_0_100px_20px_rgba(0,0,0,0.7)] pointer-events-none"></div>
            
            <div className="w-full h-full flex items-center justify-center">
                { menuStep === 'main' && <MainScreen {...screenProps} /> }
                { menuStep === 'map_select' && <MapSelectScreen {...screenProps} /> }
                { menuStep === 'loadout' && <LoadoutScreen {...screenProps} /> }
                { menuStep === 'controls' && <ControlsScreen {...screenProps} /> }
            </div>
        </div>
    );
};

export default MainMenu;
