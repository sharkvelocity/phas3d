declare const BABYLON: any;
import { VIEWMODEL_LAYER_MASK, UV_EVIDENCE_LAYER_MASK, HANDHELD_CAMERA_ID } from '../constants';
import { GameState, PlacedItem } from '../types';

export interface CameraManagerOptions {
    heldCameraState: { isOn: boolean, isIR: boolean } | null;
    placedCameras: PlacedItem[];
    isGhostNearby: boolean;
    gameState: GameState;
}

const MAX_MONITOR_CAMERAS = 4;

class CameraManager {
    private scene: any;
    private playerCamera: any;
    private viewModelCamera: any;

    private pipCamera: any;
    private pipRenderTarget: any;
    private pipTargetMaterial: any = null;
    private pipSourceNode: any = null;
    
    private monitorRenderCameras: any[] = [];
    private monitorRenderTargets: any[] = [];
    private monitorScreenMaterials: any[] = [];
    private staticScreenMaterial: any;
    
    private nightVisionPostProcessPip: any;
    private nightVisionPostProcessesMonitor: any[] = [];
    private glitchPostProcessPip: any;
    private glitchPostProcessesMonitor: any[] = [];

    constructor(scene: any, playerCamera: any, viewModelCamera: any) {
        this.scene = scene;
        this.playerCamera = playerCamera;
        this.viewModelCamera = viewModelCamera;

        this.registerShaders();
        this.setupCameras();
        this.setupPostProcessing();
        this.setupMaterials();
    }

    private registerShaders() {
        const nightVisionShader = `
            #ifdef GL_ES
            precision highp float;
            #endif

            varying vec2 vUV;
            uniform sampler2D textureSampler;
            uniform float time;
            uniform vec2 screenSize;
            
            void main(void) {
                vec2 uv = vUV;
                vec4 final_color = texture2D(textureSampler, uv);
                
                float luminance = dot(final_color.rgb, vec3(0.2126, 0.7152, 0.0722));
                
                vec3 night_vision_color = vec3(0.1, 1.0, 0.2);
                final_color.rgb = night_vision_color * luminance * 2.0;
                
                float vignette = smoothstep(0.8, 0.4, length(uv - 0.5));
                final_color.rgb *= vignette;
                
                float scanline = sin(uv.y * 400.0 + time) * 0.04;
                final_color.rgb -= scanline;

                float noise = (fract(sin(dot(uv, vec2(12.9898, 78.233)) * 43758.5453) * time) - 0.5) * 0.15;
                final_color.rgb += noise;
                
                gl_FragColor = final_color;
            }
        `;
        BABYLON.Effect.ShadersStore["enhancedNightVisionFragmentShader"] = nightVisionShader;

        const glitchShader = `
            #ifdef GL_ES
            precision highp float;
            #endif

            varying vec2 vUV;
            uniform sampler2D textureSampler;
            uniform float time;
            uniform float intensity;

            float random(vec2 st) {
                return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453));
            }

            void main() {
                if (intensity == 0.0) {
                    gl_FragColor = texture2D(textureSampler, vUV);
                    return;
                }
                
                vec2 uv = vUV;
                vec4 originalColor = texture2D(textureSampler, uv);

                float r_offset = (random(uv + time * 0.1) - 0.5) * 0.02 * intensity;
                float g_offset = (random(uv + time * 0.11) - 0.5) * 0.02 * intensity;
                float b_offset = (random(uv + time * 0.12) - 0.5) * 0.02 * intensity;
                
                float r = texture2D(textureSampler, uv + vec2(r_offset, 0.0)).r;
                float g = texture2D(textureSampler, uv + vec2(g_offset, 0.0)).g;
                float b = texture2D(textureSampler, uv + vec2(b_offset, 0.0)).b;

                if (abs(sin(uv.y * 300.0 + time * 10.0)) < 0.01 * intensity * 5.0) {
                    uv.x += (random(uv.yy * time) - 0.5) * 0.1 * intensity;
                }

                if (random(floor(uv * vec2(40.0, 60.0)) + time) > 0.98 - (intensity * 0.1)) {
                    gl_FragColor = originalColor.gbra;
                } else {
                    gl_FragColor = vec4(r, g, b, originalColor.a);
                }
            }
        `;
        BABYLON.Effect.ShadersStore["glitchFragmentShader"] = glitchShader;
    }

    private setupCameras() {
        this.pipCamera = new BABYLON.UniversalCamera("pipCamera", BABYLON.Vector3.Zero(), this.scene);
        this.pipCamera.layerMask = ~(VIEWMODEL_LAYER_MASK | UV_EVIDENCE_LAYER_MASK);
        this.pipCamera.minZ = 0.1;
        this.pipRenderTarget = new BABYLON.RenderTargetTexture("pipRtt", 512, this.scene);
        this.pipRenderTarget.activeCamera = this.pipCamera;
        this.scene.customRenderTargets.push(this.pipRenderTarget);

        for (let i = 0; i < MAX_MONITOR_CAMERAS; i++) {
            const camera = new BABYLON.UniversalCamera(`monitorRenderCamera_${i}`, BABYLON.Vector3.Zero(), this.scene);
            camera.layerMask = ~(VIEWMODEL_LAYER_MASK | UV_EVIDENCE_LAYER_MASK);
            camera.minZ = 0.1;
            this.monitorRenderCameras.push(camera);

            const renderTarget = new BABYLON.RenderTargetTexture(`monitorTexture_${i}`, 512, this.scene);
            renderTarget.activeCamera = camera;
            this.monitorRenderTargets.push(renderTarget);
            this.scene.customRenderTargets.push(renderTarget);
        }
    }
    
    private setupPostProcessing() {
        this.nightVisionPostProcessPip = new BABYLON.PostProcess("PipNightVision", "enhancedNightVision", ["time", "screenSize"], null, 1.0, this.pipCamera);
        this.nightVisionPostProcessPip.onApply = (effect: any) => {
            effect.setFloat('time', performance.now() / 1000);
            effect.setVector2('screenSize', new BABYLON.Vector2(this.nightVisionPostProcessPip.width, this.nightVisionPostProcessPip.height));
        };
        
        this.glitchPostProcessPip = new BABYLON.PostProcess("PipGlitch", "glitch", ["time", "intensity"], null, 1.0, this.pipCamera);
        this.glitchPostProcessPip.onApply = (effect: any) => {
            effect.setFloat('time', performance.now() / 1000);
            effect.setFloat('intensity', 0.0);
        };
        this.pipCamera.attachPostProcess(this.glitchPostProcessPip);

        for (let i = 0; i < MAX_MONITOR_CAMERAS; i++) {
            const camera = this.monitorRenderCameras[i];
            
            const nv_pp = new BABYLON.PostProcess(`MonitorNightVision_${i}`, "enhancedNightVision", ["time", "screenSize"], null, 1.0, camera);
            nv_pp.onApply = (effect: any) => {
                effect.setFloat('time', performance.now() / 1000);
                effect.setVector2('screenSize', new BABYLON.Vector2(nv_pp.width, nv_pp.height));
            };
            this.nightVisionPostProcessesMonitor.push(nv_pp);

            const glitch_pp = new BABYLON.PostProcess(`MonitorGlitch_${i}`, "glitch", ["time", "intensity"], null, 1.0, camera);
            glitch_pp.onApply = (effect: any) => {
                effect.setFloat('time', performance.now() / 1000);
                effect.setFloat('intensity', 0.0);
            };
            this.glitchPostProcessesMonitor.push(glitch_pp);
            camera.attachPostProcess(glitch_pp);
        }
    }

    private setupMaterials() {
        this.staticScreenMaterial = new BABYLON.StandardMaterial("screenStaticMat", this.scene);
        this.staticScreenMaterial.emissiveColor = new BABYLON.Color3(0.1, 0.2, 0.1); // Dark green glow
        this.staticScreenMaterial.disableLighting = true;

        for (let i = 0; i < MAX_MONITOR_CAMERAS; i++) {
            const material = new BABYLON.StandardMaterial(`monitorScreenMat_${i}`, this.scene);
            material.emissiveTexture = this.monitorRenderTargets[i];
            material.disableLighting = true;
            this.monitorScreenMaterials.push(material);
        }
    }

    public setPipTargetMaterial(material: any) {
        if (this.pipTargetMaterial && this.pipTargetMaterial.emissiveTexture) {
            this.pipTargetMaterial.emissiveTexture = null;
            this.pipTargetMaterial.emissiveColor = BABYLON.Color3.Black();
        }
        this.pipTargetMaterial = material;
    }

    public setPipSourceNode(node: any) {
        this.pipSourceNode = node;
        if (!node && this.pipCamera) {
            this.pipCamera.parent = null;
        }
    }
    
    private applyAntiClipping(camera: any) {
        const camGlobalPos = camera.globalPosition.clone();
        const forwardDirection = camera.getForwardRay().direction;
        
        const offset = 0.2; // How far back to check for walls
        const rayOrigin = camGlobalPos.add(forwardDirection.scale(0.01));
        const ray = new BABYLON.Ray(rayOrigin, forwardDirection.scale(-1), offset);
        
        const predicate = (mesh: any) => !!(mesh.checkCollisions && mesh.metadata?.type !== 'pickup' && (mesh.layerMask & VIEWMODEL_LAYER_MASK) === 0);
        const hit = this.scene.pickWithRay(ray, predicate);

        if (hit && hit.hit && hit.pickedPoint) {
            const newGlobalPos = hit.pickedPoint.add(forwardDirection.scale(0.02)); // Epsilon to push it just off the surface
            
            if (camera.parent) {
                const parentWorldMatrix = camera.parent.getWorldMatrix();
                const invParentMatrix = parentWorldMatrix.clone().invert();
                const newLocalPos = BABYLON.Vector3.TransformCoordinates(newGlobalPos, invParentMatrix);
                camera.position.copyFrom(newLocalPos);
            } else {
                camera.position.copyFrom(newGlobalPos);
            }
        }
    }

    public update(options: CameraManagerOptions, monitorScreenMeshes: any[], placedCameraNodes: Map<number, any>) {
        const { heldCameraState, placedCameras, isGhostNearby, gameState } = options;

        if (gameState === GameState.MainMenu || gameState === GameState.Loading) {
            return; 
        }

        if (this.scene.activeCameras[0] !== this.playerCamera || this.scene.activeCameras[1] !== this.viewModelCamera) {
            this.scene.activeCameras = [this.playerCamera, this.viewModelCamera];
        }

        // --- Handheld PiP Camera to Texture Logic ---
        const isPipActive = heldCameraState?.isOn ?? false;
        
        if (isPipActive && this.pipTargetMaterial && this.pipSourceNode) {
            this.pipCamera.parent = this.pipSourceNode;
            this.pipCamera.position.setAll(0);
            this.pipCamera.rotation.setAll(0);
            this.applyAntiClipping(this.pipCamera);
            
            this.pipTargetMaterial.emissiveTexture = this.pipRenderTarget;
            this.pipTargetMaterial.emissiveColor = BABYLON.Color3.White();
            
            if (heldCameraState?.isIR) this.pipCamera.attachPostProcess(this.nightVisionPostProcessPip);
            else this.pipCamera.detachPostProcess(this.nightVisionPostProcessPip);
            
            this.glitchPostProcessPip.onApply = (effect: any) => {
                effect.setFloat('time', performance.now() / 1000);
                effect.setFloat('intensity', isGhostNearby ? 0.6 : 0.0);
            };
        } else {
            this.pipCamera.parent = null;
            if (this.pipTargetMaterial) {
                this.pipTargetMaterial.emissiveTexture = null;
                this.pipTargetMaterial.emissiveColor = new BABYLON.Color3(0.05, 0.05, 0.05);
            }
        }
        
        // --- Multi-Monitor Camera Feeds ---
        for (let i = 0; i < MAX_MONITOR_CAMERAS; i++) {
            const screenMesh = monitorScreenMeshes[i];
            const camData = placedCameras[i];
            const renderCamera = this.monitorRenderCameras[i];
            
            if (screenMesh && camData && camData.isOn) {
                const cameraNode = placedCameraNodes.get(camData.instanceId);
                if (cameraNode) {
                    renderCamera.parent = cameraNode;
                    renderCamera.position.setAll(0);
                    renderCamera.rotation.setAll(0);
                    this.applyAntiClipping(renderCamera);
                }

                if (screenMesh.material !== this.monitorScreenMaterials[i]) {
                   screenMesh.material = this.monitorScreenMaterials[i];
                }
               
                if (camData.isIR) renderCamera.attachPostProcess(this.nightVisionPostProcessesMonitor[i]);
                else renderCamera.detachPostProcess(this.nightVisionPostProcessesMonitor[i]);
               
                this.glitchPostProcessesMonitor[i].onApply = (effect: any) => {
                   effect.setFloat('time', performance.now() / 1000);
                   effect.setFloat('intensity', isGhostNearby ? 0.6 : 0.0);
                };

            } else if (screenMesh) {
                if (screenMesh.material !== this.staticScreenMaterial) {
                    screenMesh.material = this.staticScreenMaterial;
                }
            }
        }
    }
    
    public dispose() {
        this.pipCamera?.dispose();
        this.pipRenderTarget?.dispose();
        this.nightVisionPostProcessPip?.dispose();
        this.glitchPostProcessPip?.dispose();
        this.staticScreenMaterial?.dispose();

        for (let i = 0; i < MAX_MONITOR_CAMERAS; i++) {
            this.monitorRenderCameras[i]?.dispose();
            this.monitorRenderTargets[i]?.dispose();
            this.monitorScreenMaterials[i]?.dispose();
            this.nightVisionPostProcessesMonitor[i]?.dispose();
            this.glitchPostProcessesMonitor[i]?.dispose();
        }
    }
}

export default CameraManager;