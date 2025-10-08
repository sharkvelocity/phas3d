
import { ItemId, Item } from '../types';

export const ITEMS: Item[] = [
    {
        id: ItemId.Flashlight,
        name: 'Flashlight',
        description: 'Provides a directed beam of light.',
        modelUrl: 'https://sharkvelocity.github.io/3d/assets/models/items/flashlight.glb',
    },
    {
        id: ItemId.EMFReader,
        name: 'EMF Reader',
        description: 'Detects paranormal electromagnetic fields.',
        modelUrl: 'https://sharkvelocity.github.io/3d/assets/models/items/EMF.glb',
    },
    {
        id: ItemId.SpiritBox,
        name: 'Spirit Box',
        description: 'Enables communication with certain entities.',
        modelUrl: 'https://sharkvelocity.github.io/3d/assets/models/items/spirit_box.glb',
    },
    {
        id: ItemId.GhostWritingBook,
        name: 'Ghost Writing Book',
        description: 'A surface for entities to leave written clues.',
        modelUrl: 'https://sharkvelocity.github.io/3d/assets/models/items/book_closed.glb',
    },
    {
        id: ItemId.PhotoCamera,
        name: 'Photo Camera',
        description: 'Capture evidence of paranormal events.',
        modelUrl: 'https://sharkvelocity.github.io/3d/assets/models/items/camera.glb',
        uses: 5,
    },
    {
        id: ItemId.UVLight,
        name: 'UV Light',
        description: 'Reveals latent fingerprints and footprints.',
        modelUrl: 'https://sharkvelocity.github.io/3d/assets/models/items/uv.glb',
    },
    {
        id: ItemId.VideoCamera,
        name: 'Video Camera',
        description: 'Monitors rooms for Ghost Orbs. Features IR mode.',
        modelUrl: 'https://sharkvelocity.github.io/3d/assets/models/items/video_camera.glb',
    },
    {
        id: ItemId.Tripod,
        name: 'Tripod',
        description: 'A stand for a video camera.',
        modelUrl: 'https://sharkvelocity.github.io/3d/assets/models/items/tripod.glb',
    },
    {
        id: ItemId.DOTSProjector,
        name: 'D.O.T.S. Projector',
        description: 'Projects a laser grid to reveal ghostly silhouettes.',
        modelUrl: 'https://sharkvelocity.github.io/3d/assets/models/items/DOTS.glb',
    },
    {
        id: ItemId.Thermometer,
        name: 'Thermometer',
        description: 'Measures ambient room temperature.',
        modelUrl: 'https://sharkvelocity.github.io/3d/assets/models/items/thermometer.glb',
    },
    {
        id: ItemId.SmudgeSticks,
        name: 'Smudge Sticks',
        description: 'Deters hunts when burned near an entity.',
        uses: 1,
        requiresLighter: true,
        modelUrl: 'https://sharkvelocity.github.io/3d/assets/models/items/smudge_sticks.glb',
    },
    {
        id: ItemId.Crucifix,
        name: 'Crucifix',
        description: 'Prevents hunts from starting within its effective range.',
        uses: 2,
        modelUrl: 'https://sharkvelocity.github.io/3d/assets/models/items/crucifix.glb',
    },
    {
        id: ItemId.Salt,
        name: 'Salt',
        description: 'Disturbs entities and reveals their footsteps.',
        uses: 3,
        modelUrl: 'https://sharkvelocity.github.io/3d/assets/models/items/salt.glb',
    },
    {
        id: ItemId.SanityMeds,
        name: 'Sanity Medication',
        description: 'Auto-injector that restores a large amount of sanity.',
        uses: 1,
        modelUrl: 'https://sharkvelocity.github.io/3d/assets/models/items/sanity.glb',
    },
    {
        id: ItemId.Lantern,
        name: 'Lantern',
        description: 'Provides a wide, calming radius of light.',
        modelUrl: 'https://sharkvelocity.github.io/3d/assets/models/items/lantern.glb',
    },
    {
        id: ItemId.ParabolicMicrophone,
        name: 'Parabolic Microphone',
        description: 'Detects faint paranormal sounds from a distance.',
        modelUrl: 'https://sharkvelocity.github.io/3d/assets/models/items/parabolic.glb',
    },
];

export const LIGHTER: Item = {
    id: ItemId.Lighter,
    name: 'Lighter',
    description: 'A small flame. Not a great light source, but better than nothing. Doesn\'t take an inventory slot.',
    slotless: true,
    modelUrl: 'https://sharkvelocity.github.io/3d/assets/models/items/lighter.glb',
};