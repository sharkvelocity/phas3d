
import { Weather } from '../types';

declare const BABYLON: any;

const audioRoot = "https://sharkvelocity.github.io/3d/assets/audio/";

class SoundManager {
    private scene: any;
    private weather: Weather;
    private lightningCallback: () => void;
    private thunderSounds: any[] = [];
    private thunderInterval: number | null = null;
    public outdoorAmbient?: any;
    private doorSlamSounds: any[] = [];
    public doorLockSound?: any;
    public doorUnlockSound?: any;
    public doorRattleSound?: any;
    public spiritBoxSound?: any;
    private whisperSound?: any;
    public radioSound?: any;
    private gameOverSound?: any;
    private indoorFootsteps: any[] = [];
    private outdoorFootsteps: any[] = [];
    private isInside: boolean = false;
    private soundPromises: Promise<void>[] = [];

    constructor(scene: any, weather: Weather, lightningCallback: () => void) {
        this.scene = scene;
        this.weather = weather;
        this.lightningCallback = lightningCallback;
        this.loadSounds();
    }
    
    public async waitForReady() {
        await Promise.all(this.soundPromises);
    }

    private loadSounds() {
        const SOUND_LOAD_TIMEOUT = 10000; // 10-second timeout for each sound file

        const createSound = (name: string, url: string, options: any, assignTo: (s: any) => void) => {
            const promise = new Promise<void>((resolve) => {
                let timedOut = false;
                const timeoutId = setTimeout(() => {
                    timedOut = true;
                    console.warn(`[SoundManager] Loading sound "${name}" timed out.`);
                    resolve(); // Resolve on timeout to not block loading screen.
                }, SOUND_LOAD_TIMEOUT);

                const onReady = (loadedSound: any) => {
                    clearTimeout(timeoutId);
                    if (!timedOut) {
                        console.log(`[SoundManager] Successfully loaded sound "${name}"`);
                    }
                    if (assignTo) assignTo(loadedSound);
                    resolve();
                };

                const onError = () => {
                    clearTimeout(timeoutId);
                     if (!timedOut) {
                        console.warn(`[SoundManager] Failed to load sound: ${name} from ${url}.`);
                    }
                    resolve(); // Resolve on error to not block.
                };

                new BABYLON.Sound(name, url, this.scene, onReady, { ...options, errorCallback: onError });
            });
            this.soundPromises.push(promise);
        };

        const createAmbientSound = (name: string, url: string, options: any) => {
             const promise = new Promise<void>((resolve) => {
                let timedOut = false;
                const timeoutId = setTimeout(() => {
                    timedOut = true;
                    console.warn(`[SoundManager] Loading ambient sound "${name}" timed out.`);
                    resolve(); // Resolve on timeout.
                }, SOUND_LOAD_TIMEOUT);
                
                const onReady = (loadedSound: any) => {
                    clearTimeout(timeoutId);
                    if (!timedOut) {
                        console.log(`[SoundManager] Successfully loaded ambient sound "${name}"`);
                    }
                    this.outdoorAmbient = loadedSound;
                    if (this.outdoorAmbient && typeof this.outdoorAmbient.isDisposed === 'function' && !this.outdoorAmbient.isDisposed() && !this.outdoorAmbient.isPlaying) {
                        this.outdoorAmbient.play();
                    }
                    resolve();
                };

                const onError = () => {
                    clearTimeout(timeoutId);
                    if (!timedOut) {
                        console.warn(`[SoundManager] Failed to load ambient sound: ${name} from ${url}.`);
                    }
                    resolve();
                };
                
                new BABYLON.Sound(name, url, this.scene, onReady, { ...options, errorCallback: onError });
            });
            this.soundPromises.push(promise);
        };
        
        const defaultOptions = { autoplay: false };
        createSound("door_slam1", `${audioRoot}doorSlam1.mp3`, { ...defaultOptions, volume: 0.6 }, s => this.doorSlamSounds.push(s));
        createSound("door_slam2", `${audioRoot}doorSlam2.mp3`, { ...defaultOptions, volume: 0.6 }, s => this.doorSlamSounds.push(s));
        createSound("door_lock", `${audioRoot}door_lock.mp3`, { ...defaultOptions, volume: 0.5 }, s => this.doorLockSound = s);
        createSound("door_unlock", `${audioRoot}door_unlock.mp3`, { ...defaultOptions, volume: 0.5 }, s => this.doorUnlockSound = s);
        createSound("door_rattle", `${audioRoot}door_rattle.mp3`, { ...defaultOptions, volume: 0.7 }, s => this.doorRattleSound = s);
        createSound("spiritbox_sound", `${audioRoot}spiritbox.mp3`, { loop: true, autoplay: false, volume: 0.4 }, s => { this.spiritBoxSound = s; });
        createSound("whisper", `${audioRoot}whisper.mp3`, { ...defaultOptions, volume: 0.9 }, s => this.whisperSound = s);
        createSound("radio", `${audioRoot}radio.mp3`, { loop: true, autoplay: false, volume: 0.3, spatialSound: true, distanceModel: "linear" }, s => this.radioSound = s);
        createSound("gameOver", `${audioRoot}gameKilled.mp3`, { ...defaultOptions, volume: 0.7 }, s => this.gameOverSound = s);
        createSound("step1", `${audioRoot}step1.mp3`, { ...defaultOptions, volume: 0.2 }, s => this.indoorFootsteps.push(s));
        createSound("step2", `${audioRoot}step2.mp3`, { ...defaultOptions, volume: 0.2 }, s => this.indoorFootsteps.push(s));
        createSound("step3", `${audioRoot}step3.mp3`, { ...defaultOptions, volume: 0.2 }, s => this.indoorFootsteps.push(s));
        createSound("gravel1", `${audioRoot}footstep_gravel.mp3`, { ...defaultOptions, volume: 0.25 }, s => this.outdoorFootsteps.push(s));
        createSound("gravel2", `${audioRoot}footstep_gravel_2.mp3`, { ...defaultOptions, volume: 0.25 }, s => this.outdoorFootsteps.push(s));

        switch (this.weather) {
            case Weather.BloodMoon:
                createAmbientSound("rain_sound_bm", `${audioRoot}rainstorm.mp3`, { loop: true, autoplay: false, volume: 0.3 });
                const thunderNames = ['thunder.mp3', 'thunder_loud.mp3', 'thunder_rumble.mp3'];
                thunderNames.forEach(name => createSound(name, `${audioRoot}${name}`, { autoplay: false, volume: 0.4 }, (s) => this.thunderSounds.push(s)));
                this.scheduleRandomStormEffect();
                break;
            case Weather.Rain:
                createAmbientSound("rain_sound", `${audioRoot}rainstorm.mp3`, { loop: true, autoplay: false, volume: 0.3 });
                break;
            case Weather.Snow:
                createAmbientSound("snow_sound", `${audioRoot}snow.mp3`, { loop: true, autoplay: false, volume: 0.2 });
                break;
            case Weather.Fog:
                createAmbientSound("fog_sound", `${audioRoot}clearWeather.mp3`, { loop: true, autoplay: false, volume: 0.1 });
                break;
            case Weather.Calm:
                createAmbientSound("calm_sound", `${audioRoot}clearWeather.mp3`, { loop: true, autoplay: false, volume: 0.15 });
                break;
        }
    }

    private scheduleRandomStormEffect() {
        if (this.thunderInterval) window.clearTimeout(this.thunderInterval);

        const playStormEffect = () => {
            if (this.thunderSounds.length > 0 && !this.isInside) {
                this.lightningCallback(); // Trigger visual flash
                setTimeout(() => {
                    const sound = this.thunderSounds[Math.floor(Math.random() * this.thunderSounds.length)];
                    if (sound && typeof sound.isDisposed === 'function' && !sound.isDisposed()) sound.play();
                }, Math.random() * 1500 + 500);
            }
            const delay = Math.random() * 30000 + 15000;
            this.thunderInterval = window.setTimeout(playStormEffect, delay);
        };
        playStormEffect();
    }

    public setMuted(muted: boolean) {
        if (BABYLON.Engine.audioEngine) {
            BABYLON.Engine.audioEngine.setGlobalVolume(muted ? 0 : 1);
        }
    }

    public playDoorSlam() {
        if (this.doorSlamSounds.length > 0) {
            const sound = this.doorSlamSounds[Math.floor(Math.random() * this.doorSlamSounds.length)];
            if (sound && typeof sound.isDisposed === 'function' && !sound.isDisposed() && !sound.isPlaying) sound.play();
        }
    }

    public playDoorLock() { this.doorLockSound?.play(); }
    public playDoorUnlock() { this.doorUnlockSound?.play(); }
    public playDoorRattle() { this.doorRattleSound?.play(); }

    public playWhisper() {
        if (this.whisperSound && typeof this.whisperSound.isDisposed === 'function' && !this.whisperSound.isDisposed() && !this.whisperSound.isPlaying) {
            this.whisperSound.play(0);
        }
    }

    public playFootstep(isInside: boolean) {
        const sounds = isInside ? this.indoorFootsteps : this.outdoorFootsteps;
        if (sounds.length > 0) {
            const sound = sounds[Math.floor(Math.random() * sounds.length)];
            if (sound && typeof sound.isDisposed === 'function' && !sound.isDisposed() && !sound.isPlaying) sound.play();
        }
    }

    public playGameOver() {
        if (this.gameOverSound && typeof this.gameOverSound.isDisposed === 'function' && !this.gameOverSound.isDisposed() && !this.gameOverSound.isPlaying) this.gameOverSound.play();
    }

    public update(isInside: boolean) {
        if (this.isInside === isInside) return;
        this.isInside = isInside;

        if (isInside) {
            this.outdoorAmbient?.setVolume(0.05);
            if (this.weather === Weather.BloodMoon) this.thunderSounds.forEach(s => s.setVolume(0.1));
        } else {
            let vol = 0.15;
            if (this.weather === Weather.Rain || this.weather === Weather.BloodMoon) vol = 0.3;
            else if (this.weather === Weather.Snow) vol = 0.2;
            else if (this.weather === Weather.Fog) vol = 0.1;
            this.outdoorAmbient?.setVolume(vol);
            if (this.weather === Weather.BloodMoon) this.thunderSounds.forEach(s => s.setVolume(0.4));
        }
    }

    public dispose() {
        if (this.thunderInterval) window.clearTimeout(this.thunderInterval);
        this.outdoorAmbient?.dispose();
        this.thunderSounds.forEach(s => s?.dispose());
        this.doorSlamSounds.forEach(s => s?.dispose());
        this.doorLockSound?.dispose();
        this.doorUnlockSound?.dispose();
        this.doorRattleSound?.dispose();
        this.spiritBoxSound?.dispose();
        this.whisperSound?.dispose();
        this.radioSound?.dispose();
        this.gameOverSound?.dispose();
        this.indoorFootsteps.forEach(s => s?.dispose());
        this.outdoorFootsteps.forEach(s => s?.dispose());
    }
}

export default SoundManager;