export enum GameState {
    MainMenu,
    Loading,
    Playing,
    Journal,
    GameOver,
}

export enum EvidenceType {
    EMF5 = "EMF Level 5",
    SpiritBox = "Spirit Box",
    Fingerprints = "Fingerprints",
    GhostOrb = "Ghost Orb",
    GhostWriting = "Ghost Writing",
    FreezingTemps = "Freezing Temperatures",
    DOTS = "D.O.T.S. Projector"
}

export enum Weather {
    Calm,
    Rain,
    Snow,
    BloodMoon,
    Fog
}

export enum ItemId {
    Lighter = 'lighter',
    Flashlight = 'flashlight',
    EMFReader = 'emf_reader',
    SpiritBox = 'spirit_box',
    GhostWritingBook = 'ghost_writing_book',
    PhotoCamera = 'photo_camera',
    UVLight = 'uv_light',
    VideoCamera = 'video_camera',
    DOTSProjector = 'dots_projector',
    Thermometer = 'thermometer',
    SmudgeSticks = 'smudge_sticks',
    Crucifix = 'crucifix',
    Salt = 'salt',
    Lantern = 'lantern',
    ParabolicMicrophone = 'parabolic_microphone',
    MusicBox = 'music_box',
    SanityMeds = 'sanity_meds',
    Tripod = 'tripod',
}

export interface Item {
    id: ItemId;
    name: string;
    description: string;
    slotless?: boolean;
    uses?: number;
    currentUses?: number;
    modelUrl?: string;
    requiresLighter?: boolean;
    isMounted?: boolean;
}

export interface PlacedItem extends Item {
    position: { x: number, y: number, z: number };
    rotation: { x: number, y: number, z: number };
    instanceId: number;
    isOn?: boolean;
    isIR?: boolean;
    isMountedOnTripod?: boolean;
    isPickable?: boolean;
    wasDropped?: boolean;
}

export interface Ghost {
    name: string;
    evidence: EvidenceType[];
    strength: string;
    weakness: string;
    description: string;
    canWander: boolean;
}

export interface MapData {
    id: string;
    name: string;
    description: string;
    modelUrl?: string;
}

export interface PlayerStatus {
    isNearGhost: boolean;
    isInDark: boolean;
}

export interface Coordinates {
    x: number;
    y: number;
    z: number;
}

export enum InteractableObjectType {
    Plate = 'plate',
    Cup = 'cup',
    Book = 'book',
    TVRemote = 'tv_remote',
    PillBottle = 'pill_bottle',
    Silverware = 'silverware',
    Radio = 'radio',
}

export interface InteractableObject {
    id: number;
    roomId: number;
    type: InteractableObjectType;
    position: { x: number; y: number; z: number; };
}

export type MenuStep = 'main' | 'map_select' | 'loadout' | 'controls';