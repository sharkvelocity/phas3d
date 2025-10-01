
declare module "babylonjs-node-editor/serializationTools" {
import { NodeMaterial } from "babylonjs/Materials/Node/nodeMaterial";
import { GlobalState } from "babylonjs-node-editor/globalState";
import { Nullable } from "babylonjs/types";
import { GraphFrame } from "babylonjs-node-editor/nodeGraphSystem/graphFrame";
export class SerializationTools {
    static UpdateLocations(material: NodeMaterial, globalState: GlobalState, frame?: Nullable<GraphFrame>): void;
    static Serialize(material: NodeMaterial, globalState: GlobalState, frame?: Nullable<GraphFrame>): string;
    static Deserialize(serializationObject: any, globalState: GlobalState): void;
    static AddFrameToMaterial(serializationObject: any, globalState: GlobalState, currentMaterial: NodeMaterial): void;
}

}
declare module "babylonjs-node-editor/portal" {
import * as React from "react";
import { GlobalState } from "babylonjs-node-editor/globalState";
import { PropsWithChildren } from "react";
interface IPortalProps {
    globalState: GlobalState;
}
export class Portal extends React.Component<PropsWithChildren<IPortalProps>> {
    render(): React.ReactPortal;
}
export {};

}
declare module "babylonjs-node-editor/nodeEditor" {
import { NodeMaterial } from "babylonjs/Materials/Node/nodeMaterial";
import { Observable } from "babylonjs/Misc/observable";
import { Color4 } from "babylonjs/Maths/math.color";
/**
 * Interface used to specify creation options for the node editor
 */
export interface INodeEditorOptions {
    nodeMaterial: NodeMaterial;
    hostElement?: HTMLElement;
    customSave?: {
        label: string;
        action: (data: string) => Promise<void>;
    };
    customLoadObservable?: Observable<any>;
    backgroundColor?: Color4;
}
/**
 * Class used to create a node editor
 */
export class NodeEditor {
    private static _CurrentState;
    private static _PopupWindow;
    /**
     * Show the node editor
     * @param options defines the options to use to configure the node editor
     */
    static Show(options: INodeEditorOptions): void;
}

}
declare module "babylonjs-node-editor/index" {
export * from "babylonjs-node-editor/nodeEditor";

}
declare module "babylonjs-node-editor/graphEditor" {
import * as React from "react";
import { NodeMaterialBlock } from "babylonjs/Materials/Node/nodeMaterialBlock";
import { Nullable } from "babylonjs/types";
import { IInspectorOptions } from "babylonjs/Debug/debugLayer";
import "babylonjs-node-editor/main.scss";
import { GraphNode } from "babylonjs-node-editor/nodeGraphSystem/graphNode";
import { IEditorData } from "babylonjs-node-editor/nodeGraphSystem/interfaces/nodeLocationInfo";
import { INodeData } from "babylonjs-node-editor/nodeGraphSystem/interfaces/nodeData";
import { GlobalState } from "babylonjs-node-editor/globalState";
interface IGraphEditorProps {
    globalState: GlobalState;
}
interface IGraphEditorState {
    showPreviewPopUp: boolean;
    message: string;
    isError: boolean;
}
interface IInternalPreviewAreaOptions extends IInspectorOptions {
    popup: boolean;
    original: boolean;
    explorerWidth?: string;
    inspectorWidth?: string;
    embedHostWidth?: string;
}
export class GraphEditor extends React.Component<IGraphEditorProps, IGraphEditorState> {
    private _graphCanvasRef;
    private _diagramContainerRef;
    private _graphCanvas;
    private _historyStack;
    private _previewManager;
    private _mouseLocationX;
    private _mouseLocationY;
    private _onWidgetKeyUpPointer;
    private _previewHost;
    private _popUpWindow;
    appendBlock(dataToAppend: NodeMaterialBlock | INodeData, recursion?: boolean): GraphNode;
    addValueNode(type: string): GraphNode;
    prepareHistoryStack(): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    constructor(props: IGraphEditorProps);
    zoomToFit(): void;
    buildMaterial(): void;
    build(ignoreEditorData?: boolean): void;
    loadGraph(): void;
    showWaitScreen(): void;
    hideWaitScreen(): void;
    reOrganize(editorData?: Nullable<IEditorData>, isImportingAFrame?: boolean): void;
    onWheel: (evt: WheelEvent) => void;
    emitNewBlock(blockType: string, targetX: number, targetY: number): GraphNode | undefined;
    dropNewBlock(event: React.DragEvent<HTMLDivElement>): void;
    handlePopUp: () => void;
    handleClosingPopUp: () => void;
    initiatePreviewArea: (canvas?: HTMLCanvasElement) => void;
    createPopUp: () => void;
    createPreviewMeshControlHostAsync: (options: IInternalPreviewAreaOptions, parentControl: Nullable<HTMLElement>) => Promise<unknown>;
    createPreviewHostAsync: (options: IInternalPreviewAreaOptions, parentControl: Nullable<HTMLElement>) => Promise<unknown>;
    fixPopUpStyles: (document: Document) => void;

}
export {};

}
declare module "babylonjs-node-editor/globalState" {
import { NodeMaterial } from "babylonjs/Materials/Node/nodeMaterial";
import { Observable } from "babylonjs/Misc/observable";
import { LogEntry } from "babylonjs-node-editor/components/log/logComponent";
import { NodeMaterialBlock } from "babylonjs/Materials/Node/nodeMaterialBlock";
import { PreviewType } from "babylonjs-node-editor/components/preview/previewType";
import { Color4 } from "babylonjs/Maths/math.color";
import { NodeMaterialModes } from "babylonjs/Materials/Node/Enums/nodeMaterialModes";
import { GraphNode } from "babylonjs-node-editor/nodeGraphSystem/graphNode";
import { GraphFrame } from "babylonjs-node-editor/nodeGraphSystem/graphFrame";
import { Nullable } from "babylonjs/types";
import { LockObject } from "babylonjs-node-editor/tabs/propertyGrids/lockObject";
import { StateManager } from "babylonjs-node-editor/nodeGraphSystem/stateManager";
import { FilesInput } from "babylonjs/Misc/filesInput";
import { RenderTargetTexture } from "babylonjs/Materials/Textures/renderTargetTexture";
import { NodeMaterialDebugBlock } from "babylonjs/Materials/Node/Blocks/debugBlock";
export class GlobalState {
    hostElement: HTMLElement;
    hostDocument: Document;
    hostWindow: Window;
    stateManager: StateManager;
    onBuiltObservable: Observable<void>;
    onResetRequiredObservable: Observable<boolean>;
    onClearUndoStack: Observable<void>;
    onZoomToFitRequiredObservable: Observable<void>;
    onReOrganizedRequiredObservable: Observable<void>;
    onLogRequiredObservable: Observable<LogEntry>;
    onIsLoadingChanged: Observable<boolean>;
    onLightUpdated: Observable<void>;
    onBackgroundHDRUpdated: Observable<void>;
    onPreviewBackgroundChanged: Observable<void>;
    onBackFaceCullingChanged: Observable<void>;
    onDepthPrePassChanged: Observable<void>;
    onAnimationCommandActivated: Observable<void>;
    onImportFrameObservable: Observable<any>;
    onPopupClosedObservable: Observable<void>;
    onDropEventReceivedObservable: Observable<DragEvent>;
    onGetNodeFromBlock: (block: NodeMaterialBlock) => GraphNode;
    previewType: PreviewType;
    previewFile: File;
    envType: PreviewType;
    envFile: File;
    particleSystemBlendMode: number;
    listOfCustomPreviewFiles: File[];
    rotatePreview: boolean;
    backgroundColor: Color4;
    backFaceCulling: boolean;
    depthPrePass: boolean;
    lockObject: LockObject;
    hemisphericLight: boolean;
    directionalLight0: boolean;
    directionalLight1: boolean;
    backgroundHDR: boolean;
    controlCamera: boolean;
    _mode: NodeMaterialModes;
    _engine: number;
    pointerOverCanvas: boolean;
    filesInput: FilesInput;
    onRefreshPreviewMeshControlComponentRequiredObservable: Observable<void>;
    previewTexture: Nullable<RenderTargetTexture>;
    pickingTexture: Nullable<RenderTargetTexture>;
    onPreviewSceneAfterRenderObservable: Observable<void>;
    onPreviewUpdatedObservable: Observable<NodeMaterial>;
    debugBlocksToRefresh: NodeMaterialDebugBlock[];
    forcedDebugBlock: Nullable<NodeMaterialDebugBlock>;
    /** Gets the mode */
    get mode(): NodeMaterialModes;
    /** Sets the mode */
    set mode(m: NodeMaterialModes);
    /** Gets the engine */
    get engine(): number;
    /** Sets the engine */
    set engine(e: number);
    private _nodeMaterial;
    /**
     * Gets the current node material
     */
    get nodeMaterial(): NodeMaterial;
    /**
     * Sets the current node material
     */
    set nodeMaterial(nodeMaterial: NodeMaterial);
    customSave?: {
        label: string;
        action: (data: string) => Promise<void>;
    };
    constructor();
    storeEditorData(serializationObject: any, frame?: Nullable<GraphFrame>): void;
}

}
declare module "babylonjs-node-editor/blockTools" {
import { DiscardBlock } from "babylonjs/Materials/Node/Blocks/Fragment/discardBlock";
import { BonesBlock } from "babylonjs/Materials/Node/Blocks/Vertex/bonesBlock";
import { InstancesBlock } from "babylonjs/Materials/Node/Blocks/Vertex/instancesBlock";
import { MorphTargetsBlock } from "babylonjs/Materials/Node/Blocks/Vertex/morphTargetsBlock";
import { ImageProcessingBlock } from "babylonjs/Materials/Node/Blocks/Fragment/imageProcessingBlock";
import { ColorMergerBlock } from "babylonjs/Materials/Node/Blocks/colorMergerBlock";
import { VectorMergerBlock } from "babylonjs/Materials/Node/Blocks/vectorMergerBlock";
import { ColorSplitterBlock } from "babylonjs/Materials/Node/Blocks/colorSplitterBlock";
import { VectorSplitterBlock } from "babylonjs/Materials/Node/Blocks/vectorSplitterBlock";
import { RemapBlock } from "babylonjs/Materials/Node/Blocks/remapBlock";
import { TextureBlock } from "babylonjs/Materials/Node/Blocks/Dual/textureBlock";
import { ReflectionTextureBlock } from "babylonjs/Materials/Node/Blocks/Dual/reflectionTextureBlock";
import { LightBlock } from "babylonjs/Materials/Node/Blocks/Dual/lightBlock";
import { FogBlock } from "babylonjs/Materials/Node/Blocks/Dual/fogBlock";
import { VertexOutputBlock } from "babylonjs/Materials/Node/Blocks/Vertex/vertexOutputBlock";
import { FragmentOutputBlock } from "babylonjs/Materials/Node/Blocks/Fragment/fragmentOutputBlock";
import { PrePassOutputBlock } from "babylonjs/Materials/Node/Blocks/Fragment/prePassOutputBlock";
import { NormalizeBlock } from "babylonjs/Materials/Node/Blocks/normalizeBlock";
import { AddBlock } from "babylonjs/Materials/Node/Blocks/addBlock";
import { ModBlock } from "babylonjs/Materials/Node/Blocks/modBlock";
import { ScaleBlock } from "babylonjs/Materials/Node/Blocks/scaleBlock";
import { TrigonometryBlock } from "babylonjs/Materials/Node/Blocks/trigonometryBlock";
import { ConditionalBlock } from "babylonjs/Materials/Node/Blocks/conditionalBlock";
import { ClampBlock } from "babylonjs/Materials/Node/Blocks/clampBlock";
import { CrossBlock } from "babylonjs/Materials/Node/Blocks/crossBlock";
import { DotBlock } from "babylonjs/Materials/Node/Blocks/dotBlock";
import { MultiplyBlock } from "babylonjs/Materials/Node/Blocks/multiplyBlock";
import { TransformBlock } from "babylonjs/Materials/Node/Blocks/transformBlock";
import { NodeMaterialBlockConnectionPointTypes } from "babylonjs/Materials/Node/Enums/nodeMaterialBlockConnectionPointTypes";
import { FresnelBlock } from "babylonjs/Materials/Node/Blocks/fresnelBlock";
import { LerpBlock } from "babylonjs/Materials/Node/Blocks/lerpBlock";
import { NLerpBlock } from "babylonjs/Materials/Node/Blocks/nLerpBlock";
import { DivideBlock } from "babylonjs/Materials/Node/Blocks/divideBlock";
import { SubtractBlock } from "babylonjs/Materials/Node/Blocks/subtractBlock";
import { StepBlock } from "babylonjs/Materials/Node/Blocks/stepBlock";
import { SmoothStepBlock } from "babylonjs/Materials/Node/Blocks/smoothStepBlock";
import { InputBlock } from "babylonjs/Materials/Node/Blocks/Input/inputBlock";
import { OneMinusBlock } from "babylonjs/Materials/Node/Blocks/oneMinusBlock";
import { ViewDirectionBlock } from "babylonjs/Materials/Node/Blocks/viewDirectionBlock";
import { LightInformationBlock } from "babylonjs/Materials/Node/Blocks/Vertex/lightInformationBlock";
import { MaxBlock } from "babylonjs/Materials/Node/Blocks/maxBlock";
import { MinBlock } from "babylonjs/Materials/Node/Blocks/minBlock";
import { PerturbNormalBlock } from "babylonjs/Materials/Node/Blocks/Fragment/perturbNormalBlock";
import { TBNBlock } from "babylonjs/Materials/Node/Blocks/Fragment/TBNBlock";
import { LengthBlock } from "babylonjs/Materials/Node/Blocks/lengthBlock";
import { DistanceBlock } from "babylonjs/Materials/Node/Blocks/distanceBlock";
import { FrontFacingBlock } from "babylonjs/Materials/Node/Blocks/Fragment/frontFacingBlock";
import { MeshAttributeExistsBlock } from "babylonjs/Materials/Node/Blocks/meshAttributeExistsBlock";
import { NegateBlock } from "babylonjs/Materials/Node/Blocks/negateBlock";
import { PowBlock } from "babylonjs/Materials/Node/Blocks/powBlock";
import { Scene } from "babylonjs/scene";
import { RandomNumberBlock } from "babylonjs/Materials/Node/Blocks/randomNumberBlock";
import { ReplaceColorBlock } from "babylonjs/Materials/Node/Blocks/replaceColorBlock";
import { PosterizeBlock } from "babylonjs/Materials/Node/Blocks/posterizeBlock";
import { ArcTan2Block } from "babylonjs/Materials/Node/Blocks/arcTan2Block";
import { ReciprocalBlock } from "babylonjs/Materials/Node/Blocks/reciprocalBlock";
import { GradientBlock } from "babylonjs/Materials/Node/Blocks/gradientBlock";
import { WaveBlock } from "babylonjs/Materials/Node/Blocks/waveBlock";
import { NodeMaterial } from "babylonjs/Materials/Node/nodeMaterial";
import { WorleyNoise3DBlock } from "babylonjs/Materials/Node/Blocks/worleyNoise3DBlock";
import { SimplexPerlin3DBlock } from "babylonjs/Materials/Node/Blocks/simplexPerlin3DBlock";
import { NormalBlendBlock } from "babylonjs/Materials/Node/Blocks/normalBlendBlock";
import { Rotate2dBlock } from "babylonjs/Materials/Node/Blocks/rotate2dBlock";
import { DerivativeBlock } from "babylonjs/Materials/Node/Blocks/Fragment/derivativeBlock";
import { RefractBlock } from "babylonjs/Materials/Node/Blocks/refractBlock";
import { ReflectBlock } from "babylonjs/Materials/Node/Blocks/reflectBlock";
import { DesaturateBlock } from "babylonjs/Materials/Node/Blocks/desaturateBlock";
import { PBRMetallicRoughnessBlock } from "babylonjs/Materials/Node/Blocks/PBR/pbrMetallicRoughnessBlock";
import { SheenBlock } from "babylonjs/Materials/Node/Blocks/PBR/sheenBlock";
import { AnisotropyBlock } from "babylonjs/Materials/Node/Blocks/PBR/anisotropyBlock";
import { ReflectionBlock } from "babylonjs/Materials/Node/Blocks/PBR/reflectionBlock";
import { ClearCoatBlock } from "babylonjs/Materials/Node/Blocks/PBR/clearCoatBlock";
import { RefractionBlock } from "babylonjs/Materials/Node/Blocks/PBR/refractionBlock";
import { SubSurfaceBlock } from "babylonjs/Materials/Node/Blocks/PBR/subSurfaceBlock";
import { CurrentScreenBlock } from "babylonjs/Materials/Node/Blocks/Dual/currentScreenBlock";
import { ParticleTextureBlock } from "babylonjs/Materials/Node/Blocks/Particle/particleTextureBlock";
import { ParticleRampGradientBlock } from "babylonjs/Materials/Node/Blocks/Particle/particleRampGradientBlock";
import { ParticleBlendMultiplyBlock } from "babylonjs/Materials/Node/Blocks/Particle/particleBlendMultiplyBlock";
import { GaussianSplattingBlock } from "babylonjs/Materials/Node/Blocks/GaussianSplatting/gaussianSplattingBlock";
import { GaussianBlock } from "babylonjs/Materials/Node/Blocks/GaussianSplatting/gaussianBlock";
import { SplatReaderBlock } from "babylonjs/Materials/Node/Blocks/GaussianSplatting/splatReaderBlock";
import { FragCoordBlock } from "babylonjs/Materials/Node/Blocks/Fragment/fragCoordBlock";
import { ScreenSizeBlock } from "babylonjs/Materials/Node/Blocks/Fragment/screenSizeBlock";
import { MatrixBuilderBlock } from "babylonjs/Materials/Node/Blocks/matrixBuilderBlock";
import { SceneDepthBlock } from "babylonjs/Materials/Node/Blocks/Dual/sceneDepthBlock";
import { ImageSourceBlock } from "babylonjs/Materials/Node/Blocks/Dual/imageSourceBlock";
import { CloudBlock } from "babylonjs/Materials/Node/Blocks/cloudBlock";
import { VoronoiNoiseBlock } from "babylonjs/Materials/Node/Blocks/voronoiNoiseBlock";
import { ScreenSpaceBlock } from "babylonjs/Materials/Node/Blocks/Fragment/screenSpaceBlock";
import { HeightToNormalBlock } from "babylonjs/Materials/Node/Blocks/Fragment/heightToNormalBlock";
import { TwirlBlock } from "babylonjs/Materials/Node/Blocks/Fragment/twirlBlock";
import { ElbowBlock } from "babylonjs/Materials/Node/Blocks/elbowBlock";
import { ClipPlanesBlock } from "babylonjs/Materials/Node/Blocks/Dual/clipPlanesBlock";
import { FragDepthBlock } from "babylonjs/Materials/Node/Blocks/Fragment/fragDepthBlock";
import { ShadowMapBlock } from "babylonjs/Materials/Node/Blocks/Fragment/shadowMapBlock";
import { TriPlanarBlock } from "babylonjs/Materials/Node/Blocks/triPlanarBlock";
import { MatrixDeterminantBlock } from "babylonjs/Materials/Node/Blocks/matrixDeterminantBlock";
import { MatrixTransposeBlock } from "babylonjs/Materials/Node/Blocks/matrixTransposeBlock";
import { CurveBlock } from "babylonjs/Materials/Node/Blocks/curveBlock";
import { PrePassTextureBlock } from "babylonjs/Materials/Node/Blocks/Input/prePassTextureBlock";
import { NodeMaterialTeleportInBlock } from "babylonjs/Materials/Node/Blocks/Teleport/teleportInBlock";
import { NodeMaterialTeleportOutBlock } from "babylonjs/Materials/Node/Blocks/Teleport/teleportOutBlock";
import { ColorConverterBlock } from "babylonjs/Materials/Node/Blocks/colorConverterBlock";
import { LoopBlock } from "babylonjs/Materials/Node/Blocks/loopBlock";
import { StorageReadBlock } from "babylonjs/Materials/Node/Blocks/storageReadBlock";
import { StorageWriteBlock } from "babylonjs/Materials/Node/Blocks/storageWriteBlock";
import { MatrixSplitterBlock } from "babylonjs/Materials/Node/Blocks/matrixSplitterBlock";
import { NodeMaterialDebugBlock } from "babylonjs/Materials/Node/Blocks/debugBlock";
import { IridescenceBlock } from "babylonjs/Materials/Node/Blocks/PBR/iridescenceBlock";
export class BlockTools {
    static GetBlockFromString(data: string, scene: Scene, nodeMaterial: NodeMaterial): NodeMaterialDebugBlock | MatrixSplitterBlock | StorageWriteBlock | StorageReadBlock | LoopBlock | ColorConverterBlock | NodeMaterialTeleportInBlock | NodeMaterialTeleportOutBlock | HeightToNormalBlock | ElbowBlock | TwirlBlock | VoronoiNoiseBlock | ScreenSpaceBlock | CloudBlock | MatrixBuilderBlock | DesaturateBlock | RefractBlock | ReflectBlock | DerivativeBlock | Rotate2dBlock | NormalBlendBlock | WorleyNoise3DBlock | SimplexPerlin3DBlock | BonesBlock | InstancesBlock | MorphTargetsBlock | DiscardBlock | PrePassTextureBlock | ImageProcessingBlock | ColorMergerBlock | VectorMergerBlock | ColorSplitterBlock | VectorSplitterBlock | TextureBlock | ReflectionTextureBlock | LightBlock | FogBlock | VertexOutputBlock | FragmentOutputBlock | PrePassOutputBlock | AddBlock | ClampBlock | ScaleBlock | CrossBlock | DotBlock | PowBlock | MultiplyBlock | TransformBlock | TrigonometryBlock | RemapBlock | NormalizeBlock | FresnelBlock | LerpBlock | NLerpBlock | DivideBlock | SubtractBlock | ModBlock | StepBlock | SmoothStepBlock | OneMinusBlock | ReciprocalBlock | ViewDirectionBlock | LightInformationBlock | MaxBlock | MinBlock | LengthBlock | DistanceBlock | NegateBlock | PerturbNormalBlock | TBNBlock | RandomNumberBlock | ReplaceColorBlock | PosterizeBlock | ArcTan2Block | GradientBlock | FrontFacingBlock | MeshAttributeExistsBlock | WaveBlock | InputBlock | PBRMetallicRoughnessBlock | SheenBlock | AnisotropyBlock | ReflectionBlock | ClearCoatBlock | RefractionBlock | SubSurfaceBlock | IridescenceBlock | CurrentScreenBlock | ParticleTextureBlock | ParticleRampGradientBlock | ParticleBlendMultiplyBlock | FragCoordBlock | ScreenSizeBlock | SceneDepthBlock | ConditionalBlock | ImageSourceBlock | ClipPlanesBlock | FragDepthBlock | ShadowMapBlock | TriPlanarBlock | MatrixTransposeBlock | MatrixDeterminantBlock | CurveBlock | GaussianSplattingBlock | GaussianBlock | SplatReaderBlock | null;
    static GetColorFromConnectionNodeType(type: NodeMaterialBlockConnectionPointTypes): string;
    static GetConnectionNodeTypeFromString(type: string): NodeMaterialBlockConnectionPointTypes.Float | NodeMaterialBlockConnectionPointTypes.Vector2 | NodeMaterialBlockConnectionPointTypes.Vector3 | NodeMaterialBlockConnectionPointTypes.Vector4 | NodeMaterialBlockConnectionPointTypes.Color3 | NodeMaterialBlockConnectionPointTypes.Color4 | NodeMaterialBlockConnectionPointTypes.Matrix | NodeMaterialBlockConnectionPointTypes.AutoDetect;
    static GetStringFromConnectionNodeType(type: NodeMaterialBlockConnectionPointTypes): "" | "Float" | "Vector2" | "Vector3" | "Vector4" | "Matrix" | "Color3" | "Color4";
}

}
declare module "babylonjs-node-editor/sharedComponents/textureLineComponent" {
import * as React from "react";
import { BaseTexture } from "babylonjs/Materials/Textures/baseTexture";
interface ITextureLineComponentProps {
    texture: BaseTexture;
    width: number;
    height: number;
    globalState?: any;
    hideChannelSelect?: boolean;
}
export interface ITextureLineComponentState {
    displayRed: boolean;
    displayGreen: boolean;
    displayBlue: boolean;
    displayAlpha: boolean;
    face: number;
}
export class TextureLineComponent extends React.Component<ITextureLineComponentProps, ITextureLineComponentState> {
    private _canvasRef;
    constructor(props: ITextureLineComponentProps);
    shouldComponentUpdate(): boolean;
    componentDidMount(): void;
    componentDidUpdate(): void;
    updatePreview(): void;
    static UpdatePreview(previewCanvas: HTMLCanvasElement, texture: BaseTexture, width: number, options: ITextureLineComponentState, onReady?: () => void, globalState?: any): Promise<void>;

}
export {};

}
declare module "babylonjs-node-editor/sharedComponents/checkBoxLineComponent" {
import * as React from "react";
import { Observable } from "babylonjs/Misc/observable";
import { PropertyChangedEvent } from "babylonjs-node-editor/propertyChangedEvent";
export interface ICheckBoxLineComponentProps {
    label: string;
    target?: any;
    propertyName?: string;
    isSelected?: () => boolean;
    onSelect?: (value: boolean) => void;
    onValueChanged?: () => void;
    onPropertyChangedObservable?: Observable<PropertyChangedEvent>;
    disabled?: boolean;
}
export class CheckBoxLineComponent extends React.Component<ICheckBoxLineComponentProps, {
    isSelected: boolean;
    isDisabled?: boolean;
}> {
    private static _UniqueIdSeed;
    private _uniqueId;
    private _localChange;
    constructor(props: ICheckBoxLineComponentProps);
    shouldComponentUpdate(nextProps: ICheckBoxLineComponentProps, nextState: {
        isSelected: boolean;
        isDisabled: boolean;
    }): boolean;
    onChange(): void;



}

}
declare module "babylonjs-node-editor/legacy/legacy" {
export * from "babylonjs-node-editor/index";

}
declare module "babylonjs-node-editor/graphSystem/registerToTypeLedger" {
export const RegisterTypeLedger: () => void;

}
declare module "babylonjs-node-editor/graphSystem/registerToPropertyLedger" {
export const RegisterToPropertyTabManagers: () => void;

}
declare module "babylonjs-node-editor/graphSystem/registerToDisplayLedger" {
export const RegisterToDisplayManagers: () => void;

}
declare module "babylonjs-node-editor/graphSystem/registerNodePortDesign" {
import { StateManager } from "babylonjs-node-editor/nodeGraphSystem/stateManager";
export const RegisterNodePortDesign: (stateManager: StateManager) => void;

}
declare module "babylonjs-node-editor/graphSystem/registerExportData" {
import { StateManager } from "babylonjs-node-editor/nodeGraphSystem/stateManager";
export const RegisterExportData: (stateManager: StateManager) => void;

}
declare module "babylonjs-node-editor/graphSystem/registerElbowSupport" {
import { StateManager } from "babylonjs-node-editor/nodeGraphSystem/stateManager";
export const RegisterElbowSupport: (stateManager: StateManager) => void;

}
declare module "babylonjs-node-editor/graphSystem/registerDefaultInput" {
import { StateManager } from "babylonjs-node-editor/nodeGraphSystem/stateManager";
export const RegisterDefaultInput: (stateManager: StateManager) => void;

}
declare module "babylonjs-node-editor/graphSystem/registerDebugSupport" {
import { StateManager } from "babylonjs-node-editor/nodeGraphSystem/stateManager";
export const RegisterDebugSupport: (stateManager: StateManager) => void;

}
declare module "babylonjs-node-editor/graphSystem/connectionPointPortData" {
import { NodeMaterialBlock } from "babylonjs/Materials/Node/nodeMaterialBlock";
import { NodeMaterialConnectionPoint } from "babylonjs/Materials/Node/nodeMaterialBlockConnectionPoint";
import { NodeMaterialConnectionPointCompatibilityStates } from "babylonjs/Materials/Node/nodeMaterialBlockConnectionPoint";
import { Nullable } from "babylonjs/types";
import { GraphNode } from "babylonjs-node-editor/nodeGraphSystem/graphNode";
import { INodeContainer } from "babylonjs-node-editor/nodeGraphSystem/interfaces/nodeContainer";
import { IPortData } from "babylonjs-node-editor/nodeGraphSystem/interfaces/portData";
import { PortDataDirection } from "babylonjs-node-editor/nodeGraphSystem/interfaces/portData";
export class ConnectionPointPortData implements IPortData {
    private _connectedPort;
    private _nodeContainer;
    data: NodeMaterialConnectionPoint;
    get name(): string;
    get internalName(): string;
    get isExposedOnFrame(): boolean;
    set isExposedOnFrame(value: boolean);
    get exposedPortPosition(): number;
    set exposedPortPosition(value: number);
    get isConnected(): boolean;
    get connectedPort(): Nullable<IPortData>;
    set connectedPort(value: Nullable<IPortData>);
    get direction(): PortDataDirection;
    get ownerData(): NodeMaterialBlock;
    get needDualDirectionValidation(): boolean;
    get hasEndpoints(): boolean;
    get endpoints(): IPortData[];
    constructor(connectionPoint: NodeMaterialConnectionPoint, nodeContainer: INodeContainer);
    updateDisplayName(newName: string): void;
    connectTo(port: IPortData): void;
    canConnectTo(port: IPortData): boolean;
    disconnectFrom(port: IPortData): void;
    checkCompatibilityState(port: IPortData): 0 | NodeMaterialConnectionPointCompatibilityStates.TypeIncompatible | NodeMaterialConnectionPointCompatibilityStates.TargetIncompatible | NodeMaterialConnectionPointCompatibilityStates.HierarchyIssue;
    getCompatibilityIssueMessage(issue: number, targetNode: GraphNode, targetPort: IPortData): string;
}

}
declare module "babylonjs-node-editor/graphSystem/blockNodeData" {
import { NodeMaterialBlock } from "babylonjs/Materials/Node/nodeMaterialBlock";
import { INodeContainer } from "babylonjs-node-editor/nodeGraphSystem/interfaces/nodeContainer";
import { INodeData } from "babylonjs-node-editor/nodeGraphSystem/interfaces/nodeData";
import { IPortData } from "babylonjs-node-editor/nodeGraphSystem/interfaces/portData";
import { NodeMaterialTeleportOutBlock } from "babylonjs/Materials/Node/Blocks/Teleport/teleportOutBlock";
export class BlockNodeData implements INodeData {
    data: NodeMaterialBlock;
    private _inputs;
    private _outputs;
    get uniqueId(): number;
    get name(): string;
    getClassName(): string;
    get isInput(): boolean;
    get inputs(): IPortData[];
    get outputs(): IPortData[];
    get comments(): string;
    set comments(value: string);
    get executionTime(): number;
    getPortByName(name: string): IPortData | null;
    dispose(): void;
    prepareHeaderIcon(iconDiv: HTMLDivElement, img: HTMLImageElement): void;
    get invisibleEndpoints(): NodeMaterialTeleportOutBlock[] | null;
    constructor(data: NodeMaterialBlock, nodeContainer: INodeContainer);
    get canBeActivated(): boolean;
    get isActive(): any;
    setIsActive(value: boolean): void;
}

}
declare module "babylonjs-node-editor/graphSystem/properties/vectorMergerPropertyComponent" {
import * as React from "react";
import { IPropertyComponentProps } from "babylonjs-node-editor/nodeGraphSystem/interfaces/propertyComponentProps";
export class VectorMergerPropertyTabComponent extends React.Component<IPropertyComponentProps> {
    constructor(props: IPropertyComponentProps);

}

}
declare module "babylonjs-node-editor/graphSystem/properties/texturePropertyTabComponent" {
import * as React from "react";
import { ReflectionTextureBlock } from "babylonjs/Materials/Node/Blocks/Dual/reflectionTextureBlock";
import { ReflectionBlock } from "babylonjs/Materials/Node/Blocks/PBR/reflectionBlock";
import { RefractionBlock } from "babylonjs/Materials/Node/Blocks/PBR/refractionBlock";
import { TextureBlock } from "babylonjs/Materials/Node/Blocks/Dual/textureBlock";
import { CurrentScreenBlock } from "babylonjs/Materials/Node/Blocks/Dual/currentScreenBlock";
import { ParticleTextureBlock } from "babylonjs/Materials/Node/Blocks/Particle/particleTextureBlock";
import { IPropertyComponentProps } from "babylonjs-node-editor/nodeGraphSystem/interfaces/propertyComponentProps";
import { TriPlanarBlock } from "babylonjs/Materials/Node/Blocks/triPlanarBlock";
type ReflectionTexture = ReflectionTextureBlock | ReflectionBlock | RefractionBlock;
type AnyTexture = TextureBlock | ReflectionTexture | CurrentScreenBlock | ParticleTextureBlock | TriPlanarBlock;
export class TexturePropertyTabComponent extends React.Component<IPropertyComponentProps, {
    isEmbedded: boolean;
    loadAsCubeTexture: boolean;
    textureIsPrefiltered: boolean;
}> {
    get textureBlock(): AnyTexture;
    constructor(props: IPropertyComponentProps);
    UNSAFE_componentWillUpdate(nextProps: IPropertyComponentProps, nextState: {
        isEmbedded: boolean;
        loadAsCubeTexture: boolean;
    }): void;
    private _generateRandomForCache;
    updateAfterTextureLoad(): void;
    removeTexture(): void;
    _prepareTexture(): void;
    /**
     * Replaces the texture of the node
     * @param file the file of the texture to use
     */
    replaceTexture(file: File): void;
    replaceTextureWithUrl(url: string): void;

}
export {};

}
declare module "babylonjs-node-editor/graphSystem/properties/teleportOutNodePropertyComponent" {
import * as React from "react";
import { IPropertyComponentProps } from "babylonjs-node-editor/nodeGraphSystem/interfaces/propertyComponentProps";
export class TeleportOutPropertyTabComponent extends React.Component<IPropertyComponentProps> {
    private _onUpdateRequiredObserver;
    constructor(props: IPropertyComponentProps);
    componentDidMount(): void;
    componentWillUnmount(): void;

}

}
declare module "babylonjs-node-editor/graphSystem/properties/nodePortPropertyComponent" {
import * as React from "react";
import { StateManager } from "babylonjs-node-editor/nodeGraphSystem/stateManager";
import { NodePort } from "babylonjs-node-editor/nodeGraphSystem/nodePort";
export interface IFrameNodePortPropertyTabComponentProps {
    stateManager: StateManager;
    nodePort: NodePort;
}
export class NodePortPropertyTabComponent extends React.Component<IFrameNodePortPropertyTabComponentProps> {
    constructor(props: IFrameNodePortPropertyTabComponentProps);
    toggleExposeOnFrame(value: boolean): void;

}

}
declare module "babylonjs-node-editor/graphSystem/properties/lightPropertyTabComponent" {
import * as React from "react";
import { IPropertyComponentProps } from "babylonjs-node-editor/nodeGraphSystem/interfaces/propertyComponentProps";
export class LightPropertyTabComponent extends React.Component<IPropertyComponentProps> {

}

}
declare module "babylonjs-node-editor/graphSystem/properties/lightInformationPropertyTabComponent" {
import * as React from "react";
import { IPropertyComponentProps } from "babylonjs-node-editor/nodeGraphSystem/interfaces/propertyComponentProps";
export class LightInformationPropertyTabComponent extends React.Component<IPropertyComponentProps> {

}

}
declare module "babylonjs-node-editor/graphSystem/properties/inputNodePropertyComponent" {
import * as React from "react";
import { GlobalState } from "babylonjs-node-editor/globalState";
import { IPropertyComponentProps } from "babylonjs-node-editor/nodeGraphSystem/interfaces/propertyComponentProps";
export class InputPropertyTabComponent extends React.Component<IPropertyComponentProps> {
    private _onValueChangedObserver;
    constructor(props: IPropertyComponentProps);
    componentDidMount(): void;
    componentWillUnmount(): void;

    setDefaultValue(): void;

}

}
declare module "babylonjs-node-editor/graphSystem/properties/imageSourcePropertyTabComponent" {
import * as React from "react";
import { ImageSourceBlock } from "babylonjs/Materials/Node/Blocks/Dual/imageSourceBlock";
import { IPropertyComponentProps } from "babylonjs-node-editor/nodeGraphSystem/interfaces/propertyComponentProps";
export class ImageSourcePropertyTabComponent extends React.Component<IPropertyComponentProps, {
    isEmbedded: boolean;
}> {
    get imageSourceBlock(): ImageSourceBlock;
    constructor(props: IPropertyComponentProps);
    UNSAFE_componentWillUpdate(nextProps: IPropertyComponentProps, nextState: {
        isEmbedded: boolean;
        loadAsCubeTexture: boolean;
    }): void;
    private _generateRandomForCache;
    updateAfterTextureLoad(): void;
    removeTexture(): void;
    _prepareTexture(): void;
    /**
     * Replaces the texture of the node
     * @param file the file of the texture to use
     */
    replaceTexture(file: File): void;
    replaceTextureWithUrl(url: string): void;

}

}
declare module "babylonjs-node-editor/graphSystem/properties/gradientStepComponent" {
import * as React from "react";
import { GradientBlockColorStep } from "babylonjs/Materials/Node/Blocks/gradientBlock";
import { StateManager } from "babylonjs-node-editor/nodeGraphSystem/stateManager";
interface IGradientStepComponentProps {
    stateManager: StateManager;
    step: GradientBlockColorStep;
    lineIndex: number;
    onDelete: () => void;
    onUpdateStep: () => void;
    onCheckForReOrder: () => void;
    onCopy?: () => void;
}
export class GradientStepComponent extends React.Component<IGradientStepComponentProps, {
    gradient: number;
}> {
    constructor(props: IGradientStepComponentProps);
    updateColor(color: string): void;
    updateStep(gradient: number): void;
    onPointerUp(): void;

}
export {};

}
declare module "babylonjs-node-editor/graphSystem/properties/gradientNodePropertyComponent" {
import * as React from "react";
import { GradientBlockColorStep } from "babylonjs/Materials/Node/Blocks/gradientBlock";
import { IPropertyComponentProps } from "babylonjs-node-editor/nodeGraphSystem/interfaces/propertyComponentProps";
export class GradientPropertyTabComponent extends React.Component<IPropertyComponentProps> {
    private _onValueChangedObserver;
    constructor(props: IPropertyComponentProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    forceRebuild(): void;
    deleteStep(step: GradientBlockColorStep): void;
    copyStep(step: GradientBlockColorStep): void;
    addNewStep(): void;
    checkForReOrder(): void;



}

}
declare module "babylonjs-node-editor/graphSystem/properties/genericNodePropertyComponent" {
import * as React from "react";
import { IPropertyComponentProps } from "babylonjs-node-editor/nodeGraphSystem/interfaces/propertyComponentProps";
export class DefaultPropertyTabComponent extends React.Component<IPropertyComponentProps> {
    constructor(props: IPropertyComponentProps);

}
/**
 * NOTE This is intentionally a function to avoid another wrapper JSX element around the lineContainerComponent, and will ensure
 * the lineContainerComponent gets properly rendered as a child of the Accordion
 * @param props
 * @returns
 */

/**
 * NOTE This is intentionally a function to avoid another wrapper JSX element around the lineContainerComponent, and will ensure
 * the lineContainerComponent gets properly rendered as a child of the Accordion
 * @param props
 * @returns
 */


}
declare module "babylonjs-node-editor/graphSystem/properties/framePropertyComponent" {
import * as React from "react";
import { GlobalState } from "babylonjs-node-editor/globalState";
import { GraphFrame } from "babylonjs-node-editor/nodeGraphSystem/graphFrame";
export interface IFramePropertyTabComponentProps {
    globalState: GlobalState;
    frame: GraphFrame;
}
export class FramePropertyTabComponent extends React.Component<IFramePropertyTabComponentProps> {
    private _onFrameExpandStateChangedObserver;
    constructor(props: IFramePropertyTabComponentProps);
    componentDidMount(): void;
    componentWillUnmount(): void;

}

}
declare module "babylonjs-node-editor/graphSystem/properties/frameNodePortPropertyComponent" {
import * as React from "react";
import { GlobalState } from "babylonjs-node-editor/globalState";
import { StateManager } from "babylonjs-node-editor/nodeGraphSystem/stateManager";
import { GraphFrame } from "babylonjs-node-editor/nodeGraphSystem/graphFrame";
import { FrameNodePort } from "babylonjs-node-editor/nodeGraphSystem/frameNodePort";
export interface IFrameNodePortPropertyTabComponentProps {
    stateManager: StateManager;
    globalState: GlobalState;
    frameNodePort: FrameNodePort;
    frame: GraphFrame;
}
export class FrameNodePortPropertyTabComponent extends React.Component<IFrameNodePortPropertyTabComponentProps, {
    port: FrameNodePort;
}> {
    private _onFramePortPositionChangedObserver;
    private _onSelectionChangedObserver;
    constructor(props: IFrameNodePortPropertyTabComponentProps);
    componentWillUnmount(): void;

}

}
declare module "babylonjs-node-editor/graphSystem/properties/debugNodePropertyTabComponent" {
import * as React from "react";
import { IPropertyComponentProps } from "babylonjs-node-editor/nodeGraphSystem/interfaces/propertyComponentProps";
export class DebugNodePropertyTabComponent extends React.Component<IPropertyComponentProps> {
    refreshAll(): void;

}

}
declare module "babylonjs-node-editor/graphSystem/properties/colorMergerPropertyComponent" {
import * as React from "react";
import { IPropertyComponentProps } from "babylonjs-node-editor/nodeGraphSystem/interfaces/propertyComponentProps";
export class ColorMergerPropertyTabComponent extends React.Component<IPropertyComponentProps> {
    constructor(props: IPropertyComponentProps);

}

}
declare module "babylonjs-node-editor/graphSystem/display/trigonometryDisplayManager" {
import { IDisplayManager } from "babylonjs-node-editor/nodeGraphSystem/interfaces/displayManager";
import { INodeData } from "babylonjs-node-editor/nodeGraphSystem/interfaces/nodeData";
export class TrigonometryDisplayManager implements IDisplayManager {
    getHeaderClass(): string;
    shouldDisplayPortLabels(): boolean;
    getHeaderText(nodeData: INodeData): string;
    getBackgroundColor(): string;
    updatePreviewContent(nodeData: INodeData, contentArea: HTMLDivElement): void;
}

}
declare module "babylonjs-node-editor/graphSystem/display/textureDisplayManager" {
import { IDisplayManager } from "babylonjs-node-editor/nodeGraphSystem/interfaces/displayManager";
import { INodeData } from "babylonjs-node-editor/nodeGraphSystem/interfaces/nodeData";
export class TextureDisplayManager implements IDisplayManager {
    private _previewCanvas;
    private _previewImage;
    getHeaderClass(): string;
    shouldDisplayPortLabels(): boolean;
    getHeaderText(nodeData: INodeData): string;
    getBackgroundColor(nodeData: INodeData): string;
    updatePreviewContent(nodeData: INodeData, contentArea: HTMLDivElement): void;
}

}
declare module "babylonjs-node-editor/graphSystem/display/teleportOutDisplayManager" {
import { IDisplayManager } from "babylonjs-node-editor/nodeGraphSystem/interfaces/displayManager";
import { INodeData } from "babylonjs-node-editor/nodeGraphSystem/interfaces/nodeData";
import { StateManager } from "babylonjs-node-editor/nodeGraphSystem/stateManager";
import { Nullable } from "babylonjs/types";
export class TeleportOutDisplayManager implements IDisplayManager {
    private _hasHighlights;
    getHeaderClass(): string;
    shouldDisplayPortLabels(): boolean;
    getHeaderText(nodeData: INodeData): string;
    getBackgroundColor(nodeData: INodeData): string;
    updatePreviewContent(nodeData: INodeData, contentArea: HTMLDivElement): void;
    onSelectionChanged(nodeData: INodeData, selectedData: Nullable<INodeData>, manager: StateManager): void;
    onDispose(nodeData: INodeData, manager: StateManager): void;
}

}
declare module "babylonjs-node-editor/graphSystem/display/teleportInDisplayManager" {
import { IDisplayManager } from "babylonjs-node-editor/nodeGraphSystem/interfaces/displayManager";
import { INodeData } from "babylonjs-node-editor/nodeGraphSystem/interfaces/nodeData";
import { StateManager } from "babylonjs-node-editor/nodeGraphSystem/stateManager";
import { Nullable } from "babylonjs/types";
export class TeleportInDisplayManager implements IDisplayManager {
    private _hasHighlights;
    getHeaderClass(): string;
    shouldDisplayPortLabels(): boolean;
    getHeaderText(nodeData: INodeData): string;
    getBackgroundColor(nodeData: INodeData): string;
    updatePreviewContent(nodeData: INodeData, contentArea: HTMLDivElement): void;
    onSelectionChanged(nodeData: INodeData, selectedData: Nullable<INodeData>, manager: StateManager): void;
    onDispose(nodeData: INodeData, manager: StateManager): void;
}

}
declare module "babylonjs-node-editor/graphSystem/display/remapDisplayManager" {
import { IDisplayManager } from "babylonjs-node-editor/nodeGraphSystem/interfaces/displayManager";
import { INodeData } from "babylonjs-node-editor/nodeGraphSystem/interfaces/nodeData";
export class RemapDisplayManager implements IDisplayManager {
    getHeaderClass(): string;
    shouldDisplayPortLabels(): boolean;
    getHeaderText(nodeData: INodeData): string;
    getBackgroundColor(): string;
    private _extractInputValue;
    updatePreviewContent(nodeData: INodeData, contentArea: HTMLDivElement): void;
}

}
declare module "babylonjs-node-editor/graphSystem/display/pbrDisplayManager" {
import { IDisplayManager } from "babylonjs-node-editor/nodeGraphSystem/interfaces/displayManager";
import { INodeData } from "babylonjs-node-editor/nodeGraphSystem/interfaces/nodeData";
export class PBRDisplayManager implements IDisplayManager {
    getHeaderClass(): string;
    shouldDisplayPortLabels(): boolean;
    getHeaderText(nodeData: INodeData): string;
    getBackgroundColor(): string;
    updatePreviewContent(nodeData: INodeData, contentArea: HTMLDivElement): void;
}

}
declare module "babylonjs-node-editor/graphSystem/display/outputDisplayManager" {
import { IDisplayManager } from "babylonjs-node-editor/nodeGraphSystem/interfaces/displayManager";
import { INodeData } from "babylonjs-node-editor/nodeGraphSystem/interfaces/nodeData";
export class OutputDisplayManager implements IDisplayManager {
    getHeaderClass(): string;
    shouldDisplayPortLabels(): boolean;
    getHeaderText(nodeData: INodeData): string;
    getBackgroundColor(): string;
    updatePreviewContent(nodeData: INodeData, contentArea: HTMLDivElement): void;
}

}
declare module "babylonjs-node-editor/graphSystem/display/meshAttributeExistsDisplayManager" {
import { IDisplayManager } from "babylonjs-node-editor/nodeGraphSystem/interfaces/displayManager";
import { INodeData } from "babylonjs-node-editor/nodeGraphSystem/interfaces/nodeData";
export class MeshAttributeExistsDisplayManager implements IDisplayManager {
    getHeaderClass(nodeData: INodeData): string;
    shouldDisplayPortLabels(): boolean;
    getHeaderText(nodeData: INodeData): string;
    getBackgroundColor(nodeData: INodeData): string;
    updatePreviewContent(): void;
}

}
declare module "babylonjs-node-editor/graphSystem/display/loopDisplayManager" {
import { IDisplayManager } from "babylonjs-node-editor/nodeGraphSystem/interfaces/displayManager";
import { INodeData } from "babylonjs-node-editor/nodeGraphSystem/interfaces/nodeData";
export class LoopDisplayManager implements IDisplayManager {
    getHeaderClass(): string;
    shouldDisplayPortLabels(): boolean;
    getHeaderText(nodeData: INodeData): string;
    getBackgroundColor(): string;
    updatePreviewContent(nodeData: INodeData, contentArea: HTMLDivElement): void;
}

}
declare module "babylonjs-node-editor/graphSystem/display/inputDisplayManager" {
import { NodeMaterialBlockConnectionPointTypes } from "babylonjs/Materials/Node/Enums/nodeMaterialBlockConnectionPointTypes";
import { IDisplayManager } from "babylonjs-node-editor/nodeGraphSystem/interfaces/displayManager";
import { INodeData } from "babylonjs-node-editor/nodeGraphSystem/interfaces/nodeData";
export class InputDisplayManager implements IDisplayManager {
    getHeaderClass(nodeData: INodeData): string;
    shouldDisplayPortLabels(): boolean;
    getHeaderText(nodeData: INodeData): string;
    static GetBaseType(type: NodeMaterialBlockConnectionPointTypes): string;
    getBackgroundColor(nodeData: INodeData): string;
    updatePreviewContent(nodeData: INodeData, contentArea: HTMLDivElement): void;
}

}
declare module "babylonjs-node-editor/graphSystem/display/imageSourceDisplayManager" {
import { IDisplayManager } from "babylonjs-node-editor/nodeGraphSystem/interfaces/displayManager";
import { INodeData } from "babylonjs-node-editor/nodeGraphSystem/interfaces/nodeData";
export class ImageSourceDisplayManager implements IDisplayManager {
    private _previewCanvas;
    private _previewImage;
    getHeaderClass(): string;
    shouldDisplayPortLabels(): boolean;
    getHeaderText(nodeData: INodeData): string;
    getBackgroundColor(): string;
    updatePreviewContent(nodeData: INodeData, contentArea: HTMLDivElement): void;
}

}
declare module "babylonjs-node-editor/graphSystem/display/gradientDisplayManager" {
import { IDisplayManager } from "babylonjs-node-editor/nodeGraphSystem/interfaces/displayManager";
import { INodeData } from "babylonjs-node-editor/nodeGraphSystem/interfaces/nodeData";
export class GradientDisplayManager implements IDisplayManager {
    getHeaderClass(): string;
    shouldDisplayPortLabels(): boolean;
    getHeaderText(nodeData: INodeData): string;
    getBackgroundColor(nodeData: INodeData): string;
    updatePreviewContent(nodeData: INodeData, contentArea: HTMLDivElement): void;
}

}
declare module "babylonjs-node-editor/graphSystem/display/elbowDisplayManager" {
import { IDisplayManager, VisualContentDescription } from "babylonjs-node-editor/nodeGraphSystem/interfaces/displayManager";
import { INodeData } from "babylonjs-node-editor/nodeGraphSystem/interfaces/nodeData";
export class ElbowDisplayManager implements IDisplayManager {
    getHeaderClass(): string;
    shouldDisplayPortLabels(): boolean;
    getHeaderText(nodeData: INodeData): string;
    getBackgroundColor(nodeData: INodeData): string;
    updatePreviewContent(_nodeData: INodeData, _contentArea: HTMLDivElement): void;
    updateFullVisualContent(data: INodeData, visualContent: VisualContentDescription): void;
}

}
declare module "babylonjs-node-editor/graphSystem/display/discardDisplayManager" {
import { IDisplayManager } from "babylonjs-node-editor/nodeGraphSystem/interfaces/displayManager";
import { INodeData } from "babylonjs-node-editor/nodeGraphSystem/interfaces/nodeData";
export class DiscardDisplayManager implements IDisplayManager {
    getHeaderClass(): string;
    shouldDisplayPortLabels(): boolean;
    getHeaderText(nodeData: INodeData): string;
    getBackgroundColor(): string;
    updatePreviewContent(nodeData: INodeData, contentArea: HTMLDivElement): void;
}

}
declare module "babylonjs-node-editor/graphSystem/display/depthSourceDisplayManager" {
import { IDisplayManager } from "babylonjs-node-editor/nodeGraphSystem/interfaces/displayManager";
import { INodeData } from "babylonjs-node-editor/nodeGraphSystem/interfaces/nodeData";
export class DepthSourceDisplayManager implements IDisplayManager {
    getHeaderClass(): string;
    shouldDisplayPortLabels(): boolean;
    getHeaderText(nodeData: INodeData): string;
    getBackgroundColor(): string;
    updatePreviewContent(): void;
}

}
declare module "babylonjs-node-editor/graphSystem/display/debugDisplayManager" {
import { IDisplayManager, VisualContentDescription } from "babylonjs-node-editor/nodeGraphSystem/interfaces/displayManager";
import { INodeData } from "babylonjs-node-editor/nodeGraphSystem/interfaces/nodeData";
import { Nullable } from "babylonjs/types";
import { StateManager } from "babylonjs-node-editor/nodeGraphSystem/stateManager";
export class DebugDisplayManager implements IDisplayManager {
    private _previewCanvas;
    private _previewImage;
    private _onPreviewSceneAfterRenderObserver;
    getHeaderClass(): string;
    shouldDisplayPortLabels(): boolean;
    getHeaderText(nodeData: INodeData): string;
    getBackgroundColor(): string;
    onSelectionChanged?(data: INodeData, selectedData: Nullable<INodeData>, manager: StateManager): void;
    updatePreviewContent(nodeData: INodeData, contentArea: HTMLDivElement): void;
    updateFullVisualContent(data: INodeData, visualContent: VisualContentDescription): void;
}

}
declare module "babylonjs-node-editor/graphSystem/display/curveDisplayManager" {
import { IDisplayManager } from "babylonjs-node-editor/nodeGraphSystem/interfaces/displayManager";
import { INodeData } from "babylonjs-node-editor/nodeGraphSystem/interfaces/nodeData";
export class CurveDisplayManager implements IDisplayManager {
    getHeaderClass(): string;
    shouldDisplayPortLabels(): boolean;
    getHeaderText(nodeData: INodeData): string;
    getBackgroundColor(): string;
    updatePreviewContent(nodeData: INodeData, contentArea: HTMLDivElement): void;
}

}
declare module "babylonjs-node-editor/graphSystem/display/conditionalDisplayManager" {
import { IDisplayManager } from "babylonjs-node-editor/nodeGraphSystem/interfaces/displayManager";
import { INodeData } from "babylonjs-node-editor/nodeGraphSystem/interfaces/nodeData";
export class ConditionalDisplayManager implements IDisplayManager {
    getHeaderClass(): string;
    shouldDisplayPortLabels(): boolean;
    getHeaderText(nodeData: INodeData): string;
    getBackgroundColor(): string;
    updatePreviewContent(): void;
}

}
declare module "babylonjs-node-editor/graphSystem/display/clampDisplayManager" {
import { IDisplayManager } from "babylonjs-node-editor/nodeGraphSystem/interfaces/displayManager";
import { INodeData } from "babylonjs-node-editor/nodeGraphSystem/interfaces/nodeData";
export class ClampDisplayManager implements IDisplayManager {
    getHeaderClass(): string;
    shouldDisplayPortLabels(): boolean;
    getHeaderText(nodeData: INodeData): string;
    getBackgroundColor(): string;
    updatePreviewContent(nodeData: INodeData, contentArea: HTMLDivElement): void;
}

}
declare module "babylonjs-node-editor/components/propertyTab/propertyTabComponent" {
import * as React from "react";
import { GlobalState } from "babylonjs-node-editor/globalState";
import { Nullable } from "babylonjs/types";
import { InputBlock } from "babylonjs/Materials/Node/Blocks/Input/inputBlock";
import "babylonjs-node-editor/components/propertyTab/propertyTab.scss";
import { GraphNode } from "babylonjs-node-editor/nodeGraphSystem/graphNode";
import { GraphFrame } from "babylonjs-node-editor/nodeGraphSystem/graphFrame";
import { NodePort } from "babylonjs-node-editor/nodeGraphSystem/nodePort";
import { FrameNodePort } from "babylonjs-node-editor/nodeGraphSystem/frameNodePort";
import { LockObject } from "babylonjs-node-editor/tabs/propertyGrids/lockObject";
interface IPropertyTabComponentProps {
    globalState: GlobalState;
    lockObject: LockObject;
}
interface IPropertyTabComponentState {
    currentNode: Nullable<GraphNode>;
    currentFrame: Nullable<GraphFrame>;
    currentFrameNodePort: Nullable<FrameNodePort>;
    currentNodePort: Nullable<NodePort>;
    uploadInProgress: boolean;
}
export class PropertyTabComponent extends React.Component<IPropertyTabComponentProps, IPropertyTabComponentState> {
    private _onBuiltObserver;
    private _modeSelect;
    constructor(props: IPropertyTabComponentProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    processInputBlockUpdate(ib: InputBlock): void;

    load(file: File): void;
    loadFrame(file: File): void;
    save(): void;
    customSave(): void;
    saveToSnippetServer(): void;
    loadFromSnippet(): void;
    changeMode(value: any, force?: boolean, loadDefault?: boolean): boolean;

}
export {};

}
declare module "babylonjs-node-editor/components/propertyTab/inputsPropertyTabComponent" {
import { GlobalState } from "babylonjs-node-editor/globalState";
import { InputBlock } from "babylonjs/Materials/Node/Blocks/Input/inputBlock";
import "babylonjs-node-editor/components/propertyTab/propertyTab.scss";
import { LockObject } from "babylonjs-node-editor/tabs/propertyGrids/lockObject";
interface IInputsPropertyTabComponentProps {
    globalState: GlobalState;
    inputs: InputBlock[];
    lockObject: LockObject;
}
/**
 * NOTE if being used within a PropertyTabComponentBase (which is a wrapper for Accordion), call as a function rather than
 * rendering as a component. This will avoid a wrapper JSX element existing before the lineContainerComponent and will ensure
 * the lineContainerComponent gets properly rendered as a child of the Accordion
 * @param props
 * @returns
 */

export {};

}
declare module "babylonjs-node-editor/components/propertyTab/properties/vector4PropertyTabComponent" {
import * as React from "react";
import { GlobalState } from "babylonjs-node-editor/globalState";
import { InputBlock } from "babylonjs/Materials/Node/Blocks/Input/inputBlock";
import { LockObject } from "babylonjs-node-editor/tabs/propertyGrids/lockObject";
interface IVector4PropertyTabComponentProps {
    globalState: GlobalState;
    inputBlock: InputBlock;
    lockObject: LockObject;
}
export class Vector4PropertyTabComponent extends React.Component<IVector4PropertyTabComponentProps> {

}
export {};

}
declare module "babylonjs-node-editor/components/propertyTab/properties/vector3PropertyTabComponent" {
import * as React from "react";
import { GlobalState } from "babylonjs-node-editor/globalState";
import { InputBlock } from "babylonjs/Materials/Node/Blocks/Input/inputBlock";
import { LockObject } from "babylonjs-node-editor/tabs/propertyGrids/lockObject";
interface IVector3PropertyTabComponentProps {
    globalState: GlobalState;
    inputBlock: InputBlock;
    lockObject: LockObject;
}
export class Vector3PropertyTabComponent extends React.Component<IVector3PropertyTabComponentProps> {

}
export {};

}
declare module "babylonjs-node-editor/components/propertyTab/properties/vector2PropertyTabComponent" {
import * as React from "react";
import { GlobalState } from "babylonjs-node-editor/globalState";
import { InputBlock } from "babylonjs/Materials/Node/Blocks/Input/inputBlock";
import { LockObject } from "babylonjs-node-editor/tabs/propertyGrids/lockObject";
interface IVector2PropertyTabComponentProps {
    globalState: GlobalState;
    inputBlock: InputBlock;
    lockObject: LockObject;
}
export class Vector2PropertyTabComponent extends React.Component<IVector2PropertyTabComponentProps> {

}
export {};

}
declare module "babylonjs-node-editor/components/propertyTab/properties/matrixPropertyTabComponent" {
import * as React from "react";
import { GlobalState } from "babylonjs-node-editor/globalState";
import { InputBlock } from "babylonjs/Materials/Node/Blocks/Input/inputBlock";
import { LockObject } from "babylonjs-node-editor/tabs/propertyGrids/lockObject";
interface IMatrixPropertyTabComponentProps {
    globalState: GlobalState;
    inputBlock: InputBlock;
    lockObject: LockObject;
}
export class MatrixPropertyTabComponent extends React.Component<IMatrixPropertyTabComponentProps> {

}
export {};

}
declare module "babylonjs-node-editor/components/propertyTab/properties/floatPropertyTabComponent" {
import * as React from "react";
import { GlobalState } from "babylonjs-node-editor/globalState";
import { InputBlock } from "babylonjs/Materials/Node/Blocks/Input/inputBlock";
interface IFloatPropertyTabComponentProps {
    globalState: GlobalState;
    inputBlock: InputBlock;
}
export class FloatPropertyTabComponent extends React.Component<IFloatPropertyTabComponentProps> {

}
export {};

}
declare module "babylonjs-node-editor/components/propertyTab/properties/color4PropertyTabComponent" {
import * as React from "react";
import { GlobalState } from "babylonjs-node-editor/globalState";
import { InputBlock } from "babylonjs/Materials/Node/Blocks/Input/inputBlock";
import { LockObject } from "babylonjs-node-editor/tabs/propertyGrids/lockObject";
interface IColor4PropertyTabComponentProps {
    globalState: GlobalState;
    inputBlock: InputBlock;
    lockObject: LockObject;
}
export class Color4PropertyTabComponent extends React.Component<IColor4PropertyTabComponentProps> {

}
export {};

}
declare module "babylonjs-node-editor/components/propertyTab/properties/color3PropertyTabComponent" {
import * as React from "react";
import { GlobalState } from "babylonjs-node-editor/globalState";
import { InputBlock } from "babylonjs/Materials/Node/Blocks/Input/inputBlock";
import { LockObject } from "babylonjs-node-editor/tabs/propertyGrids/lockObject";
interface IColor3PropertyTabComponentProps {
    globalState: GlobalState;
    inputBlock: InputBlock;
    lockObject: LockObject;
}
export class Color3PropertyTabComponent extends React.Component<IColor3PropertyTabComponentProps> {

}
export {};

}
declare module "babylonjs-node-editor/components/preview/previewType" {
export enum PreviewType {
    Sphere = 0,
    Box = 1,
    Torus = 2,
    Cylinder = 3,
    Plane = 4,
    ShaderBall = 5,
    DefaultParticleSystem = 6,
    Bubbles = 7,
    Smoke = 8,
    Rain = 9,
    Explosion = 10,
    Fire = 11,
    Parrot = 12,
    BricksSkull = 13,
    Plants = 14,
    Custom = 15,
    Room = 16
}

}
declare module "babylonjs-node-editor/components/preview/previewMeshControlComponent" {
import * as React from "react";
import { GlobalState } from "babylonjs-node-editor/globalState";
import { PreviewType } from "babylonjs-node-editor/components/preview/previewType";
interface IPreviewMeshControlComponent {
    globalState: GlobalState;
    togglePreviewAreaComponent: () => void;
    onMounted?: () => void;
}
export class PreviewMeshControlComponent extends React.Component<IPreviewMeshControlComponent> {
    private _colorInputRef;
    private _filePickerRef;
    private _envPickerRef;
    private _onResetRequiredObserver;
    private _onDropEventObserver;
    private _onRefreshPreviewMeshControlComponentRequiredObserver;
    constructor(props: IPreviewMeshControlComponent);
    componentWillUnmount(): void;
    componentDidMount(): void;
    changeMeshType(newOne: PreviewType): void;
    useCustomMesh(evt: any): void;
    useCustomEnv(evt: any): void;
    onPopUp(): void;
    changeAnimation(): void;
    changeBackground(value: string): void;
    changeBackgroundClick(): void;

}
export {};

}
declare module "babylonjs-node-editor/components/preview/previewManager" {
import { GlobalState } from "babylonjs-node-editor/globalState";
import "babylonjs/Helpers/sceneHelpers";
import "babylonjs/Rendering/depthRendererSceneComponent";
export class PreviewManager {
    private _nodeMaterial;
    private _onBuildObserver;
    private _onPreviewCommandActivatedObserver;
    private _onAnimationCommandActivatedObserver;
    private _onUpdateRequiredObserver;
    private _onPreviewBackgroundChangedObserver;
    private _onBackFaceCullingChangedObserver;
    private _onDepthPrePassChangedObserver;
    private _onLightUpdatedObserver;
    private _onBackgroundHDRUpdatedObserver;
    private _engine;
    private _scene;
    private _meshes;
    private _camera;
    private _material;
    private _globalState;
    private _currentType;
    private _lightParent;
    private _postprocess;
    private _proceduralTexture;
    private _particleSystem;
    private _layer;
    private _hdrSkyBox;
    private _hdrTexture;
    private _serializeMaterial;
    /**
     * Create a new Preview Manager
     * @param targetCanvas defines the canvas to render to
     * @param globalState defines the global state
     */
    constructor(targetCanvas: HTMLCanvasElement, globalState: GlobalState);
    _initAsync(targetCanvas: HTMLCanvasElement): Promise<void>;
    private _reset;
    private _handleAnimations;
    private _prepareLights;
    private _prepareBackgroundHDR;
    private _prepareScene;
    /**
     * Default Environment URL
     */
    static DefaultEnvironmentURL: string;
    private _refreshPreviewMesh;
    private _loadParticleSystem;
    private _forceCompilationAsync;
    private _updatePreview;
    dispose(): void;
}

}
declare module "babylonjs-node-editor/components/preview/previewAreaComponent" {
import * as React from "react";
import { GlobalState } from "babylonjs-node-editor/globalState";
interface IPreviewAreaComponentProps {
    globalState: GlobalState;
    onMounted?: () => void;
}
export class PreviewAreaComponent extends React.Component<IPreviewAreaComponentProps, {
    isLoading: boolean;
}> {
    private _onIsLoadingChangedObserver;
    private _onResetRequiredObserver;
    private _consoleRef;
    constructor(props: IPreviewAreaComponentProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    changeBackFaceCulling(value: boolean): void;
    changeDepthPrePass(value: boolean): void;
    _onPointerOverCanvas: () => void;
    _onPointerOutCanvas: () => void;
    changeParticleSystemBlendMode(newOne: number): void;
    processPointerMove(e: React.PointerEvent<HTMLCanvasElement>): Promise<void>;
    onKeyUp(e: React.KeyboardEvent<HTMLCanvasElement>): void;

}
export {};

}
declare module "babylonjs-node-editor/components/nodeList/nodeListComponent" {
import * as React from "react";
import { GlobalState } from "babylonjs-node-editor/globalState";
import "babylonjs-node-editor/components/nodeList/nodeList.scss";
interface INodeListComponentProps {
    globalState: GlobalState;
}
export class NodeListComponent extends React.Component<INodeListComponentProps, {
    filter: string;
}> {
    private _onResetRequiredObserver;
    private static _Tooltips;
    private _customFrameList;
    private _customBlockList;
    constructor(props: INodeListComponentProps);
    componentWillUnmount(): void;
    filterContent(filter: string): void;
    loadCustomFrame(file: File): void;
    removeItem(value: string): void;
    loadCustomBlock(file: File): void;
    removeCustomBlock(value: string): void;



}
export {};

}
declare module "babylonjs-node-editor/components/log/logComponent" {
import * as React from "react";
import { GlobalState } from "babylonjs-node-editor/globalState";
import "babylonjs-node-editor/components/log/log.scss";
interface ILogComponentProps {
    globalState: GlobalState;
}
export class LogEntry {
    message: string;
    isError: boolean;
    time: Date;
    constructor(message: string, isError: boolean);
}
export class LogComponent extends React.Component<ILogComponentProps, {
    logs: LogEntry[];
}> {
    private _logConsoleRef;
    constructor(props: ILogComponentProps);
    componentDidMount(): void;
    componentDidUpdate(): void;

}
export {};

}
declare module "babylonjs-node-editor/styleHelper" {
/**
 * Copy all styles from a document to another document or shadow root
 * @param source document to copy styles from
 * @param target document or shadow root to copy styles to
 */
export function CopyStyles(source: Document, target: DocumentOrShadowRoot): void;
/**
 * Merges classNames by array of strings or conditions
 * @param classNames Array of className strings or truthy conditions
 * @returns A concatenated string, suitable for the className attribute
 */
export function MergeClassNames(classNames: ClassNameCondition[]): string;
/**
 * className (replicating React type) or a tuple with the second member being any truthy value ["className", true]
 */
type ClassNameCondition = string | undefined | [string, any];
export {};

}
declare module "babylonjs-node-editor/stringTools" {
export class StringTools {
    private static _SaveAs;
    private static _Click;
    /**
     * Download a string into a file that will be saved locally by the browser
     * @param document
     * @param content defines the string to download locally as a file
     * @param filename
     */
    static DownloadAsFile(document: HTMLDocument, content: string, filename: string): void;
}

}
declare module "babylonjs-node-editor/propertyChangedEvent" {
export class PropertyChangedEvent {
    object: any;
    property: string;
    value: any;
    initialValue: any;
    allowNullValue?: boolean;
}

}
declare module "babylonjs-node-editor/popupHelper" {
/**
 * Create a popup window
 * @param title default title for the popup
 * @param options options for the popup
 * @returns the parent control of the popup
 */
export function CreatePopup(title: string, options: Partial<{
    onParentControlCreateCallback?: (parentControl: HTMLDivElement) => void;
    onWindowCreateCallback?: (newWindow: Window) => void;
    width?: number;
    height?: number;
}>): HTMLDivElement | null;

}
declare module "babylonjs-node-editor/historyStack" {
import { IDisposable } from "babylonjs/scene";
/**
 * Class handling undo / redo operations
 */
export class HistoryStack implements IDisposable {
    private _historyStack;
    private _redoStack;
    private _activeData;
    private readonly _maxHistoryLength;
    private _locked;
    private _dataProvider;
    private _applyUpdate;
    /**
     * Gets or sets a boolean indicating if the stack is enabled
     */
    isEnabled: boolean;
    /**
     * Constructor
     * @param dataProvider defines the data provider function
     * @param applyUpdate defines the code to execute when undo/redo operation is required
     */
    constructor(dataProvider: () => any, applyUpdate: (data: any) => void);
    /**
     * Process key event to handle undo / redo
     * @param evt defines the keyboard event to process
     * @returns true if the event was processed
     */
    processKeyEvent(evt: KeyboardEvent): boolean;
    /**
     * Resets the stack
     */
    reset(): void;
    /**
     * Remove the n-1 element of the stack
     */
    collapseLastTwo(): void;
    private _generateJSONDiff;
    private _applyJSONDiff;
    private _copy;
    /**
     * Stores the current state
     */
    store(): void;
    /**
     * Undo the latest operation
     */
    undo(): void;
    /**
     * Redo the latest undo operation
     */
    redo(): void;
    /**
     * Disposes the stack
     */
    dispose(): void;
}

}
declare module "babylonjs-node-editor/copyCommandToClipboard" {
export function copyCommandToClipboard(strCommand: string): void;
export function getClassNameWithNamespace(obj: any): {
    className: string;
    babylonNamespace: string;
};

}
declare module "babylonjs-node-editor/constToOptionsMaps" {
/**
 * Used by both particleSystem and alphaBlendModes
 */
export const CommonBlendModes: {
    label: string;
    value: number;
}[];
/**
 * Used to populated the blendMode dropdown in our various tools (Node Editor, Inspector, etc.)
 * The below ParticleSystem consts were defined before new Engine alpha blend modes were added, so we have to reference
 * the ParticleSystem.FOO consts explicitly (as the underlying const values are different - they get mapped to engine consts within baseParticleSystem.ts)
 */
export const BlendModeOptions: {
    label: string;
    value: number;
}[];
/**
 * Used to populated the alphaMode dropdown in our various tools (Node Editor, Inspector, etc.)
 */
export const AlphaModeOptions: {
    label: string;
    value: number;
}[];

}
declare module "babylonjs-node-editor/tabs/propertyGrids/lockObject" {
/**
 * Class used to provide lock mechanism
 */
export class LockObject {
    /**
     * Gets or set if the lock is engaged
     */
    lock: boolean;
}

}
declare module "babylonjs-node-editor/tabs/propertyGrids/gui/textBlockPropertyGridComponent" {
import * as React from "react";
import { Observable } from "babylonjs/Misc/observable";
import { PropertyChangedEvent } from "babylonjs-node-editor/propertyChangedEvent";
import { TextBlock } from "babylonjs-gui/2D/controls/textBlock";
import { LockObject } from "babylonjs-node-editor/tabs/propertyGrids/lockObject";
interface ITextBlockPropertyGridComponentProps {
    textBlock: TextBlock;
    lockObject: LockObject;
    onPropertyChangedObservable?: Observable<PropertyChangedEvent>;
}
export class TextBlockPropertyGridComponent extends React.Component<ITextBlockPropertyGridComponentProps> {
    constructor(props: ITextBlockPropertyGridComponentProps);

}
export {};

}
declare module "babylonjs-node-editor/tabs/propertyGrids/gui/stackPanelPropertyGridComponent" {
import * as React from "react";
import { Observable } from "babylonjs/Misc/observable";
import { PropertyChangedEvent } from "babylonjs-node-editor/propertyChangedEvent";
import { LockObject } from "babylonjs-node-editor/tabs/propertyGrids/lockObject";
import { StackPanel } from "babylonjs-gui/2D/controls/stackPanel";
interface IStackPanelPropertyGridComponentProps {
    stackPanel: StackPanel;
    lockObject: LockObject;
    onPropertyChangedObservable?: Observable<PropertyChangedEvent>;
}
export class StackPanelPropertyGridComponent extends React.Component<IStackPanelPropertyGridComponentProps> {
    constructor(props: IStackPanelPropertyGridComponentProps);

}
export {};

}
declare module "babylonjs-node-editor/tabs/propertyGrids/gui/sliderPropertyGridComponent" {
import * as React from "react";
import { Observable } from "babylonjs/Misc/observable";
import { PropertyChangedEvent } from "babylonjs-node-editor/propertyChangedEvent";
import { LockObject } from "babylonjs-node-editor/tabs/propertyGrids/lockObject";
import { Slider } from "babylonjs-gui/2D/controls/sliders/slider";
interface ISliderPropertyGridComponentProps {
    slider: Slider;
    lockObject: LockObject;
    onPropertyChangedObservable?: Observable<PropertyChangedEvent>;
}
export class SliderPropertyGridComponent extends React.Component<ISliderPropertyGridComponentProps> {
    constructor(props: ISliderPropertyGridComponentProps);

}
export {};

}
declare module "babylonjs-node-editor/tabs/propertyGrids/gui/scrollViewerPropertyGridComponent" {
import * as React from "react";
import { Observable } from "babylonjs/Misc/observable";
import { PropertyChangedEvent } from "babylonjs-node-editor/propertyChangedEvent";
import { LockObject } from "babylonjs-node-editor/tabs/propertyGrids/lockObject";
import { ScrollViewer } from "babylonjs-gui/2D/controls/scrollViewers/scrollViewer";
interface IScrollViewerPropertyGridComponentProps {
    scrollViewer: ScrollViewer;
    lockObject: LockObject;
    onPropertyChangedObservable?: Observable<PropertyChangedEvent>;
}
export class ScrollViewerPropertyGridComponent extends React.Component<IScrollViewerPropertyGridComponentProps> {
    constructor(props: IScrollViewerPropertyGridComponentProps);

}
export {};

}
declare module "babylonjs-node-editor/tabs/propertyGrids/gui/rectanglePropertyGridComponent" {
import * as React from "react";
import { Observable } from "babylonjs/Misc/observable";
import { PropertyChangedEvent } from "babylonjs-node-editor/propertyChangedEvent";
import { LockObject } from "babylonjs-node-editor/tabs/propertyGrids/lockObject";
import { Rectangle } from "babylonjs-gui/2D/controls/rectangle";
interface IRectanglePropertyGridComponentProps {
    rectangle: Rectangle;
    lockObject: LockObject;
    onPropertyChangedObservable?: Observable<PropertyChangedEvent>;
}
export class RectanglePropertyGridComponent extends React.Component<IRectanglePropertyGridComponentProps> {
    constructor(props: IRectanglePropertyGridComponentProps);

}
export {};

}
declare module "babylonjs-node-editor/tabs/propertyGrids/gui/radioButtonPropertyGridComponent" {
import * as React from "react";
import { Observable } from "babylonjs/Misc/observable";
import { PropertyChangedEvent } from "babylonjs-node-editor/propertyChangedEvent";
import { LockObject } from "babylonjs-node-editor/tabs/propertyGrids/lockObject";
import { RadioButton } from "babylonjs-gui/2D/controls/radioButton";
interface IRadioButtonPropertyGridComponentProps {
    radioButtons: RadioButton[];
    lockObject: LockObject;
    onPropertyChangedObservable?: Observable<PropertyChangedEvent>;
}
export class RadioButtonPropertyGridComponent extends React.Component<IRadioButtonPropertyGridComponentProps> {
    constructor(props: IRadioButtonPropertyGridComponentProps);

}
export {};

}
declare module "babylonjs-node-editor/tabs/propertyGrids/gui/linePropertyGridComponent" {
import * as React from "react";
import { Observable } from "babylonjs/Misc/observable";
import { PropertyChangedEvent } from "babylonjs-node-editor/propertyChangedEvent";
import { LockObject } from "babylonjs-node-editor/tabs/propertyGrids/lockObject";
import { Line } from "babylonjs-gui/2D/controls/line";
interface ILinePropertyGridComponentProps {
    line: Line;
    lockObject: LockObject;
    onPropertyChangedObservable?: Observable<PropertyChangedEvent>;
}
export class LinePropertyGridComponent extends React.Component<ILinePropertyGridComponentProps> {
    constructor(props: ILinePropertyGridComponentProps);
    onDashChange(value: string): void;

}
export {};

}
declare module "babylonjs-node-editor/tabs/propertyGrids/gui/inputTextPropertyGridComponent" {
import * as React from "react";
import { Observable } from "babylonjs/Misc/observable";
import { PropertyChangedEvent } from "babylonjs-node-editor/propertyChangedEvent";
import { InputText } from "babylonjs-gui/2D/controls/inputText";
import { LockObject } from "babylonjs-node-editor/tabs/propertyGrids/lockObject";
interface IInputTextPropertyGridComponentProps {
    inputText: InputText;
    lockObject: LockObject;
    onPropertyChangedObservable?: Observable<PropertyChangedEvent>;
}
export class InputTextPropertyGridComponent extends React.Component<IInputTextPropertyGridComponentProps> {
    constructor(props: IInputTextPropertyGridComponentProps);

}
export {};

}
declare module "babylonjs-node-editor/tabs/propertyGrids/gui/imagePropertyGridComponent" {
import * as React from "react";
import { Observable } from "babylonjs/Misc/observable";
import { PropertyChangedEvent } from "babylonjs-node-editor/propertyChangedEvent";
import { LockObject } from "babylonjs-node-editor/tabs/propertyGrids/lockObject";
import { Image } from "babylonjs-gui/2D/controls/image";
interface IImagePropertyGridComponentProps {
    image: Image;
    lockObject: LockObject;
    onPropertyChangedObservable?: Observable<PropertyChangedEvent>;
}
export class ImagePropertyGridComponent extends React.Component<IImagePropertyGridComponentProps> {
    constructor(props: IImagePropertyGridComponentProps);

}
export {};

}
declare module "babylonjs-node-editor/tabs/propertyGrids/gui/imageBasedSliderPropertyGridComponent" {
import * as React from "react";
import { Observable } from "babylonjs/Misc/observable";
import { PropertyChangedEvent } from "babylonjs-node-editor/propertyChangedEvent";
import { LockObject } from "babylonjs-node-editor/tabs/propertyGrids/lockObject";
import { ImageBasedSlider } from "babylonjs-gui/2D/controls/sliders/imageBasedSlider";
interface IImageBasedSliderPropertyGridComponentProps {
    imageBasedSlider: ImageBasedSlider;
    lockObject: LockObject;
    onPropertyChangedObservable?: Observable<PropertyChangedEvent>;
}
export class ImageBasedSliderPropertyGridComponent extends React.Component<IImageBasedSliderPropertyGridComponentProps> {
    constructor(props: IImageBasedSliderPropertyGridComponentProps);

}
export {};

}
declare module "babylonjs-node-editor/tabs/propertyGrids/gui/gridPropertyGridComponent" {
import * as React from "react";
import { Observable } from "babylonjs/Misc/observable";
import { PropertyChangedEvent } from "babylonjs-node-editor/propertyChangedEvent";
import { LockObject } from "babylonjs-node-editor/tabs/propertyGrids/lockObject";
import { Grid } from "babylonjs-gui/2D/controls/grid";
interface IGridPropertyGridComponentProps {
    grid: Grid;
    lockObject: LockObject;
    onPropertyChangedObservable?: Observable<PropertyChangedEvent>;
}
export class GridPropertyGridComponent extends React.Component<IGridPropertyGridComponentProps> {
    constructor(props: IGridPropertyGridComponentProps);



}
export {};

}
declare module "babylonjs-node-editor/tabs/propertyGrids/gui/ellipsePropertyGridComponent" {
import * as React from "react";
import { Observable } from "babylonjs/Misc/observable";
import { PropertyChangedEvent } from "babylonjs-node-editor/propertyChangedEvent";
import { LockObject } from "babylonjs-node-editor/tabs/propertyGrids/lockObject";
import { Ellipse } from "babylonjs-gui/2D/controls/ellipse";
interface IEllipsePropertyGridComponentProps {
    ellipse: Ellipse;
    lockObject: LockObject;
    onPropertyChangedObservable?: Observable<PropertyChangedEvent>;
}
export class EllipsePropertyGridComponent extends React.Component<IEllipsePropertyGridComponentProps> {
    constructor(props: IEllipsePropertyGridComponentProps);

}
export {};

}
declare module "babylonjs-node-editor/tabs/propertyGrids/gui/controlPropertyGridComponent" {
import * as React from "react";
import { Observable } from "babylonjs/Misc/observable";
import { PropertyChangedEvent } from "babylonjs-node-editor/propertyChangedEvent";
import { Control } from "babylonjs-gui/2D/controls/control";
import { LockObject } from "babylonjs-node-editor/tabs/propertyGrids/lockObject";
interface IControlPropertyGridComponentProps {
    control: Control;
    lockObject: LockObject;
    onPropertyChangedObservable?: Observable<PropertyChangedEvent>;
}
export class ControlPropertyGridComponent extends React.Component<IControlPropertyGridComponentProps> {
    constructor(props: IControlPropertyGridComponentProps);

}
export {};

}
declare module "babylonjs-node-editor/tabs/propertyGrids/gui/commonControlPropertyGridComponent" {
import * as React from "react";
import { Observable } from "babylonjs/Misc/observable";
import { PropertyChangedEvent } from "babylonjs-node-editor/propertyChangedEvent";
import { Control } from "babylonjs-gui/2D/controls/control";
import { LockObject } from "babylonjs-node-editor/tabs/propertyGrids/lockObject";
interface ICommonControlPropertyGridComponentProps {
    controls?: Control[];
    control?: Control;
    lockObject: LockObject;
    onPropertyChangedObservable?: Observable<PropertyChangedEvent>;
}
export class CommonControlPropertyGridComponent extends React.Component<ICommonControlPropertyGridComponentProps> {
    constructor(props: ICommonControlPropertyGridComponentProps);


}
export {};

}
declare module "babylonjs-node-editor/tabs/propertyGrids/gui/colorPickerPropertyGridComponent" {
import * as React from "react";
import { Observable } from "babylonjs/Misc/observable";
import { PropertyChangedEvent } from "babylonjs-node-editor/propertyChangedEvent";
import { ColorPicker } from "babylonjs-gui/2D/controls/colorpicker";
import { LockObject } from "babylonjs-node-editor/tabs/propertyGrids/lockObject";
interface IColorPickerPropertyGridComponentProps {
    colorPicker: ColorPicker;
    lockObject: LockObject;
    onPropertyChangedObservable?: Observable<PropertyChangedEvent>;
}
export class ColorPickerPropertyGridComponent extends React.Component<IColorPickerPropertyGridComponentProps> {
    constructor(props: IColorPickerPropertyGridComponentProps);

}
export {};

}
declare module "babylonjs-node-editor/tabs/propertyGrids/gui/checkboxPropertyGridComponent" {
import * as React from "react";
import { Observable } from "babylonjs/Misc/observable";
import { PropertyChangedEvent } from "babylonjs-node-editor/propertyChangedEvent";
import { LockObject } from "babylonjs-node-editor/tabs/propertyGrids/lockObject";
import { Checkbox } from "babylonjs-gui/2D/controls/checkbox";
interface ICheckboxPropertyGridComponentProps {
    checkbox: Checkbox;
    lockObject: LockObject;
    onPropertyChangedObservable?: Observable<PropertyChangedEvent>;
}
export class CheckboxPropertyGridComponent extends React.Component<ICheckboxPropertyGridComponentProps> {
    constructor(props: ICheckboxPropertyGridComponentProps);

}
export {};

}
declare module "babylonjs-node-editor/split/splitter" {
import { ControlledSize } from "babylonjs-node-editor/split/splitContext";
/**
 * Splitter component properties
 */
export interface ISplitterProps {
    /**
     * Unique identifier
     */
    id?: string;
    /**
     * Splitter size
     */
    size: number;
    /**
     * Minimum size for the controlled element
     */
    minSize?: number;
    /**
     * Maximum size for the controlled element
     */
    maxSize?: number;
    /**
     * Initial size for the controlled element
     */
    initialSize?: number;
    /**
     * Defines the controlled side
     */
    controlledSide: ControlledSize;
    /**
     * refObject to the splitter element
     */
    refObject?: React.RefObject<HTMLDivElement>;
}
/**
 * Creates a splitter component
 * @param props defines the splitter properties
 * @returns the splitter component
 */
export const Splitter: React.FC<ISplitterProps>;

}
declare module "babylonjs-node-editor/split/splitContext" {
export enum ControlledSize {
    First = 0,
    Second = 1
}
export enum SplitDirection {
    Horizontal = 0,
    Vertical = 1
}
/**
 * Context used to share data with splitters
 */
export interface ISplitContext {
    /**
     * Split direction
     */
    direction: SplitDirection;
    /**
     * Function called by splitters to update the offset
     * @param offset new offet
     * @param source source element
     * @param controlledSide defined controlled element
     */
    drag: (offset: number, source: HTMLElement, controlledSide: ControlledSize) => void;
    /**
     * Function called by splitters to begin dragging
     */
    beginDrag: () => void;
    /**
     * Function called by splitters to end dragging
     */
    endDrag: () => void;
    /**
     * Sync sizes for the elements
     * @param source source element
     * @param controlledSide defined controlled element
     * @param size size of the controlled element
     * @param minSize minimum size for the controlled element
     * @param maxSize maximum size for the controlled element
     */
    sync: (source: HTMLElement, controlledSide: ControlledSize, size?: number, minSize?: number, maxSize?: number) => void;
}
export const SplitContext: import("react").Context<ISplitContext>;

}
declare module "babylonjs-node-editor/split/splitContainer" {
import { PropsWithChildren } from "react";
import { SplitDirection } from "babylonjs-node-editor/split/splitContext";
/**
 * Split container properties
 */
export interface ISplitContainerProps {
    /**
     * Unique identifier
     */
    id?: string;
    /**
     * Split direction
     */
    direction: SplitDirection;
    /**
     * Minimum size for the floating elements
     */
    floatingMinSize?: number;
    /**
     * RefObject to the root div element
     */
    containerRef?: React.RefObject<HTMLDivElement>;
    /**
     * Optional class name
     */
    className?: string;
    /**
     * Pointer down
     * @param event pointer events
     */
    onPointerDown?: (event: React.PointerEvent) => void;
    /**
     * Pointer move
     * @param event pointer events
     */
    onPointerMove?: (event: React.PointerEvent) => void;
    /**
     * Pointer up
     * @param event pointer events
     */
    onPointerUp?: (event: React.PointerEvent) => void;
    /**
     * Drop
     * @param event drag events
     */
    onDrop?: (event: React.DragEvent<HTMLDivElement>) => void;
    /**
     * Drag over
     * @param event drag events
     */
    onDragOver?: (event: React.DragEvent<HTMLDivElement>) => void;
}
/**
 * Creates a split container component
 * @param props defines the split container properties
 * @returns the split container component
 */
export const SplitContainer: React.FC<PropsWithChildren<ISplitContainerProps>>;

}
declare module "babylonjs-node-editor/nodeGraphSystem/typeLedger" {
import { INodeContainer } from "babylonjs-node-editor/nodeGraphSystem/interfaces/nodeContainer";
import { INodeData } from "babylonjs-node-editor/nodeGraphSystem/interfaces/nodeData";
import { IPortData } from "babylonjs-node-editor/nodeGraphSystem/interfaces/portData";
import { NodePort } from "babylonjs-node-editor/nodeGraphSystem/nodePort";
export class TypeLedger {
    static PortDataBuilder: (port: NodePort, nodeContainer: INodeContainer) => IPortData;
    static NodeDataBuilder: (data: any, nodeContainer: INodeContainer) => INodeData;
}

}
declare module "babylonjs-node-editor/nodeGraphSystem/tools" {
import { GraphCanvasComponent } from "babylonjs-node-editor/nodeGraphSystem/graphCanvas";
import { GraphNode } from "babylonjs-node-editor/nodeGraphSystem/graphNode";
import { NodeLink } from "babylonjs-node-editor/nodeGraphSystem/nodeLink";
import { FramePortData } from "babylonjs-node-editor/nodeGraphSystem/types/framePortData";
export const IsFramePortData: (variableToCheck: any) => variableToCheck is FramePortData;
export const RefreshNode: (node: GraphNode, visitedNodes?: Set<GraphNode>, visitedLinks?: Set<NodeLink>, canvas?: GraphCanvasComponent) => void;
export const BuildFloatUI: (container: HTMLDivElement, document: Document, displayName: string, isInteger: boolean, source: any, propertyName: string, onChange: () => void, min?: number, max?: number, visualPropertiesRefresh?: Array<() => void>, additionalClassName?: string) => void;
export function GetListOfAcceptedTypes<T extends Record<string, string | number>>(types: T, allValue: number, autoDetectValue: number, port: {
    acceptedConnectionPointTypes: number[];
    excludedConnectionPointTypes: number[];
    type: number;
}, skips?: number[]): string[];
export function GetConnectionErrorMessage<T extends Record<string, string | number>>(sourceType: number, types: T, allValue: number, autoDetectValue: number, port: {
    acceptedConnectionPointTypes: number[];
    excludedConnectionPointTypes: number[];
    type: number;
}, skips?: number[]): string;

}
declare module "babylonjs-node-editor/nodeGraphSystem/stateManager" {
import { Vector2 } from "babylonjs/Maths/math.vector";
import { Observable } from "babylonjs/Misc/observable";
import { Nullable } from "babylonjs/types";
import { FrameNodePort } from "babylonjs-node-editor/nodeGraphSystem/frameNodePort";
import { GraphFrame } from "babylonjs-node-editor/nodeGraphSystem/graphFrame";
import { GraphNode } from "babylonjs-node-editor/nodeGraphSystem/graphNode";
import { INodeContainer } from "babylonjs-node-editor/nodeGraphSystem/interfaces/nodeContainer";
import { INodeData } from "babylonjs-node-editor/nodeGraphSystem/interfaces/nodeData";
import { IPortData } from "babylonjs-node-editor/nodeGraphSystem/interfaces/portData";
import { ISelectionChangedOptions } from "babylonjs-node-editor/nodeGraphSystem/interfaces/selectionChangedOptions";
import { NodePort } from "babylonjs-node-editor/nodeGraphSystem/nodePort";
import { HistoryStack } from "babylonjs-node-editor/historyStack";
import { Scene } from "babylonjs/scene";
export class StateManager {
    data: any;
    hostDocument: Document;
    lockObject: any;
    modalIsDisplayed: boolean;
    historyStack: HistoryStack;
    onSearchBoxRequiredObservable: Observable<{
        x: number;
        y: number;
    }>;
    onSelectionChangedObservable: Observable<Nullable<ISelectionChangedOptions>>;
    onFrameCreatedObservable: Observable<GraphFrame>;
    onUpdateRequiredObservable: Observable<any>;
    onGraphNodeRemovalObservable: Observable<GraphNode>;
    onSelectionBoxMoved: Observable<ClientRect | DOMRect>;
    onCandidateLinkMoved: Observable<Nullable<Vector2>>;
    onCandidatePortSelectedObservable: Observable<Nullable<FrameNodePort | NodePort>>;
    onNewNodeCreatedObservable: Observable<GraphNode>;
    onRebuildRequiredObservable: Observable<void>;
    onNodeMovedObservable: Observable<GraphNode>;
    onErrorMessageDialogRequiredObservable: Observable<string>;
    onExposePortOnFrameObservable: Observable<GraphNode>;
    onGridSizeChanged: Observable<void>;
    onNewBlockRequiredObservable: Observable<{
        type: string;
        targetX: number;
        targetY: number;
        needRepositioning?: boolean;
        smartAdd?: boolean;
    }>;
    onHighlightNodeObservable: Observable<{
        data: any;
        active: boolean;
    }>;
    onPreviewCommandActivated: Observable<boolean>;
    exportData: (data: any, frame?: Nullable<GraphFrame>) => string;
    isElbowConnectionAllowed: (nodeA: FrameNodePort | NodePort, nodeB: FrameNodePort | NodePort) => boolean;
    isDebugConnectionAllowed: (nodeA: FrameNodePort | NodePort, nodeB: FrameNodePort | NodePort) => boolean;
    applyNodePortDesign: (data: IPortData, element: HTMLElement, imgHost: HTMLImageElement, pip: HTMLDivElement) => boolean;
    getPortColor: (portData: IPortData) => string;
    storeEditorData: (serializationObject: any, frame?: Nullable<GraphFrame>) => void;
    getEditorDataMap: () => {
        [key: number]: number;
    };
    getScene?: () => Scene;
    createDefaultInputData: (rootData: any, portData: IPortData, nodeContainer: INodeContainer) => Nullable<{
        data: INodeData;
        name: string;
    }>;
    private _isRebuildQueued;
    queueRebuildCommand(): void;
}

}
declare module "babylonjs-node-editor/nodeGraphSystem/searchBox" {
import * as React from "react";
import { StateManager } from "babylonjs-node-editor/nodeGraphSystem/stateManager";
import "babylonjs-node-editor/nodeGraphSystem/searchBox.scss";
export interface ISearchBoxComponentProps {
    stateManager: StateManager;
}
/**
 * The search box component.
 */
export class SearchBoxComponent extends React.Component<ISearchBoxComponentProps, {
    isVisible: boolean;
    filter: string;
    selectedIndex: number;
}> {
    private _handleEscKey;
    private _targetX;
    private _targetY;
    private _nodes;
    constructor(props: ISearchBoxComponentProps);
    hide(): void;
    onFilterChange(evt: React.ChangeEvent<HTMLInputElement>): void;
    onNewNodeRequested(name: string): void;
    onKeyDown(evt: React.KeyboardEvent): void;



}

}
declare module "babylonjs-node-editor/nodeGraphSystem/propertyLedger" {
import { ComponentClass } from "react";
import { IPropertyComponentProps } from "babylonjs-node-editor/nodeGraphSystem/interfaces/propertyComponentProps";
export class PropertyLedger {
    static DefaultControl: ComponentClass<IPropertyComponentProps>;
    static RegisteredControls: {
        [key: string]: ComponentClass<IPropertyComponentProps>;
    };
}

}
declare module "babylonjs-node-editor/nodeGraphSystem/nodePort" {
import { Nullable } from "babylonjs/types";
import { Observer } from "babylonjs/Misc/observable";
import { Vector2 } from "babylonjs/Maths/math.vector";
import { GraphNode } from "babylonjs-node-editor/nodeGraphSystem/graphNode";
import { StateManager } from "babylonjs-node-editor/nodeGraphSystem/stateManager";
import { ISelectionChangedOptions } from "babylonjs-node-editor/nodeGraphSystem/interfaces/selectionChangedOptions";
import { FrameNodePort } from "babylonjs-node-editor/nodeGraphSystem/frameNodePort";
import { IDisplayManager } from "babylonjs-node-editor/nodeGraphSystem/interfaces/displayManager";
import { type IPortData } from "babylonjs-node-editor/nodeGraphSystem/interfaces/portData";
export class NodePort {
    portData: IPortData;
    node: GraphNode;
    protected _element: HTMLDivElement;
    protected _portContainer: HTMLElement;
    protected _imgHost: HTMLImageElement;
    protected _pip: HTMLDivElement;
    protected _stateManager: StateManager;
    protected _portLabelElement: Element;
    protected _onCandidateLinkMovedObserver: Nullable<Observer<Nullable<Vector2>>>;
    protected _onSelectionChangedObserver: Nullable<Observer<Nullable<ISelectionChangedOptions>>>;
    protected _exposedOnFrame: boolean;
    protected _portUIcontainer?: HTMLDivElement;
    delegatedPort: Nullable<FrameNodePort>;
    get element(): HTMLDivElement;
    get container(): HTMLElement;
    get portName(): string;
    set portName(newName: string);
    get disabled(): boolean;
    hasLabel(): boolean;
    get exposedOnFrame(): boolean;
    set exposedOnFrame(value: boolean);
    get exposedPortPosition(): number;
    set exposedPortPosition(value: number);
    private _isConnectedToNodeOutsideOfFrame;
    refresh(): void;
    constructor(portContainer: HTMLElement, portData: IPortData, node: GraphNode, stateManager: StateManager, portUIcontainer?: HTMLDivElement);
    dispose(): void;
    static CreatePortElement(portData: IPortData, node: GraphNode, root: HTMLElement, displayManager: Nullable<IDisplayManager>, stateManager: StateManager): NodePort;
}

}
declare module "babylonjs-node-editor/nodeGraphSystem/nodeLink" {
import { Observable } from "babylonjs/Misc/observable";
import { FrameNodePort } from "babylonjs-node-editor/nodeGraphSystem/frameNodePort";
import { NodePort } from "babylonjs-node-editor/nodeGraphSystem/nodePort";
import { GraphNode } from "babylonjs-node-editor/nodeGraphSystem/graphNode";
import { GraphCanvasComponent } from "babylonjs-node-editor/nodeGraphSystem/graphCanvas";
export class NodeLink {
    private _graphCanvas;
    private _portA;
    private _portB?;
    private _nodeA;
    private _nodeB?;
    private _path;
    private _selectionPath;
    private _onSelectionChangedObserver;
    private _isVisible;
    private _isTargetCandidate;
    private _gradient;
    onDisposedObservable: Observable<NodeLink>;
    get isTargetCandidate(): boolean;
    set isTargetCandidate(value: boolean);
    get isVisible(): boolean;
    set isVisible(value: boolean);
    get portA(): FrameNodePort | NodePort;
    get portB(): FrameNodePort | NodePort | undefined;
    get nodeA(): GraphNode;
    get nodeB(): GraphNode | undefined;
    intersectsWith(rect: DOMRect): boolean;
    update(endX?: number, endY?: number, straight?: boolean): void;
    get path(): SVGPathElement;
    get selectionPath(): SVGPathElement;
    constructor(graphCanvas: GraphCanvasComponent, portA: NodePort, nodeA: GraphNode, portB?: NodePort, nodeB?: GraphNode);
    onClick(evt: MouseEvent): void;
    dispose(notify?: boolean): void;
}

}
declare module "babylonjs-node-editor/nodeGraphSystem/nodeLedger" {
export class NodeLedger {
    static RegisteredNodeNames: string[];
    static NameFormatter: (name: string) => string;
}

}
declare module "babylonjs-node-editor/nodeGraphSystem/graphNode" {
import { Nullable } from "babylonjs/types";
import { GraphCanvasComponent } from "babylonjs-node-editor/nodeGraphSystem/graphCanvas";
import { NodePort } from "babylonjs-node-editor/nodeGraphSystem/nodePort";
import { GraphFrame } from "babylonjs-node-editor/nodeGraphSystem/graphFrame";
import { NodeLink } from "babylonjs-node-editor/nodeGraphSystem/nodeLink";
import { StateManager } from "babylonjs-node-editor/nodeGraphSystem/stateManager";
import { INodeData } from "babylonjs-node-editor/nodeGraphSystem/interfaces/nodeData";
import { IPortData } from "babylonjs-node-editor/nodeGraphSystem/interfaces/portData";
import { IEditablePropertyOption } from "babylonjs/Decorators/nodeDecorator";
export class GraphNode {
    content: INodeData;
    private static _IdGenerator;
    private _visual;
    private _headerContainer;
    private _headerIcon;
    private _headerIconImg;
    private _headerCollapseImg;
    private _header;
    private _headerCollapse;
    private _connections;
    private _optionsContainer;
    private _inputsContainer;
    private _outputsContainer;
    private _content;
    private _comments;
    private _executionTime;
    private _selectionBorder;
    private _inputPorts;
    private _outputPorts;
    private _links;
    private _x;
    private _y;
    private _gridAlignedX;
    private _gridAlignedY;
    private _mouseStartPointX;
    private _mouseStartPointY;
    private _stateManager;
    private _onSelectionChangedObserver;
    private _onSelectionBoxMovedObserver;
    private _onFrameCreatedObserver;
    private _onUpdateRequiredObserver;
    private _onHighlightNodeObserver;
    private _ownerCanvas;
    private _displayManager;
    private _isVisible;
    private _enclosingFrameId;
    private _visualPropertiesRefresh;
    private _lastClick;
    addClassToVisual(className: string): void;
    removeClassFromVisual(className: string): void;
    get isCollapsed(): boolean;
    get isVisible(): boolean;
    set isVisible(value: boolean);
    private _upateNodePortNames;
    get outputPorts(): NodePort[];
    get inputPorts(): NodePort[];
    get links(): NodeLink[];
    get gridAlignedX(): number;
    get gridAlignedY(): number;
    get x(): number;
    set x(value: number);
    get y(): number;
    set y(value: number);
    get width(): number;
    get height(): number;
    get id(): number;
    get name(): string;
    get enclosingFrameId(): number;
    set enclosingFrameId(value: number);
    setIsSelected(value: boolean, marqueeSelection: boolean): void;
    get rootElement(): HTMLDivElement;
    constructor(content: INodeData, stateManager: StateManager);
    isOverlappingFrame(frame: GraphFrame): boolean;
    getPortForPortData(portData: IPortData): NodePort | null;
    getPortDataForPortDataContent(data: any): IPortData | null;
    getLinksForPortDataContent(data: any): NodeLink[];
    getLinksForPortData(portData: IPortData): NodeLink[];
    private _refreshFrames;
    _refreshLinks(): void;
    refresh(): void;
    private _expand;
    private _searchMiddle;
    private _onDown;
    cleanAccumulation(useCeil?: boolean): void;
    private _onUp;
    private _onMove;
    renderProperties(): Nullable<JSX.Element>;
    _forceRebuild(source: any, propertyName: string, notifiers?: IEditablePropertyOption["notifiers"]): void;
    private _isCollapsed;
    /**
     * Collapse the node
     */
    collapse(): void;
    /**
     * Expand the node
     */
    expand(): void;
    private _portUICount;
    private _buildInputPorts;
    appendVisual(root: HTMLDivElement, owner: GraphCanvasComponent): void;
    dispose(): void;
}

}
declare module "babylonjs-node-editor/nodeGraphSystem/graphFrame" {
import { GraphNode } from "babylonjs-node-editor/nodeGraphSystem/graphNode";
import { GraphCanvasComponent } from "babylonjs-node-editor/nodeGraphSystem/graphCanvas";
import { Nullable } from "babylonjs/types";
import { Observable } from "babylonjs/Misc/observable";
import { Color3 } from "babylonjs/Maths/math.color";
import { FrameNodePort } from "babylonjs-node-editor/nodeGraphSystem/frameNodePort";
import { IFrameData } from "babylonjs-node-editor/nodeGraphSystem/interfaces/nodeLocationInfo";
export enum FramePortPosition {
    Top = 0,
    Middle = 1,
    Bottom = 2
}
export class GraphFrame {
    private readonly _collapsedWidth;
    private static _FrameCounter;
    private static _FramePortCounter;
    private _name;
    private _color;
    private _x;
    private _y;
    private _gridAlignedX;
    private _gridAlignedY;
    private _width;
    private _height;
    element: HTMLDivElement;
    private _borderElement;
    private _headerElement;
    private _headerTextElement;
    private _headerCollapseElement;
    private _headerCloseElement;
    private _headerFocusElement;
    private _commentsElement;
    private _portContainer;
    private _outputPortContainer;
    private _inputPortContainer;
    private _nodes;
    private _ownerCanvas;
    private _mouseStartPointX;
    private _mouseStartPointY;
    private _onSelectionChangedObserver;
    private _onGraphNodeRemovalObserver;
    private _onExposePortOnFrameObserver;
    private _onNodeLinkDisposedObservers;
    private _isCollapsed;
    private _frameInPorts;
    private _frameOutPorts;
    private _controlledPorts;
    private _exposedInPorts;
    private _exposedOutPorts;
    private _id;
    private _comments;
    private _frameIsResizing;
    private _resizingDirection;
    private _minFrameHeight;
    private _minFrameWidth;
    private _mouseXLimit;
    onExpandStateChanged: Observable<GraphFrame>;
    private readonly _closeSVG;
    private readonly _expandSVG;
    private readonly _collapseSVG;
    private readonly _focusSVG;
    get id(): number;
    get isCollapsed(): boolean;
    private _createInputPort;
    private _markFramePortPositions;
    private _createFramePorts;
    private _removePortFromExposedWithNode;
    private _removePortFromExposedWithLink;
    private _createInputPorts;
    private _createOutputPorts;
    redrawFramePorts(): void;
    set isCollapsed(value: boolean);
    get nodes(): GraphNode[];
    get ports(): FrameNodePort[];
    get name(): string;
    set name(value: string);
    get color(): Color3;
    set color(value: Color3);
    get x(): number;
    set x(value: number);
    get y(): number;
    set y(value: number);
    get width(): number;
    set width(value: number);
    get height(): number;
    set height(value: number);
    get comments(): string;
    set comments(comments: string);
    constructor(candidate: Nullable<HTMLDivElement>, canvas: GraphCanvasComponent, doNotCaptureNodes?: boolean);
    private _isFocused;
    /**
     * Enter/leave focus mode
     */
    switchFocusMode(): void;
    refresh(): void;
    addNode(node: GraphNode): void;
    removeNode(node: GraphNode): void;
    syncNode(node: GraphNode): void;
    cleanAccumulation(): void;
    private _onDown;
    move(newX: number, newY: number, align?: boolean): void;
    private _onUp;
    _moveFrame(offsetX: number, offsetY: number): void;
    private _onMove;
    moveFramePortUp(nodePort: FrameNodePort): void;
    private _movePortUp;
    moveFramePortDown(nodePort: FrameNodePort): void;
    private _movePortDown;
    private _initResizing;
    private _cleanUpResizing;
    private _updateMinHeightWithComments;
    private _isResizingTop;
    private _isResizingRight;
    private _isResizingBottom;
    private _isResizingLeft;
    private _onRightHandlePointerDown;
    private _onRightHandlePointerMove;
    private _moveRightHandle;
    private _onRightHandlePointerUp;
    private _onBottomHandlePointerDown;
    private _onBottomHandlePointerMove;
    private _moveBottomHandle;
    private _onBottomHandlePointerUp;
    private _onLeftHandlePointerDown;
    private _onLeftHandlePointerMove;
    private _moveLeftHandle;
    private _onLeftHandlePointerUp;
    private _onTopHandlePointerDown;
    private _onTopHandlePointerMove;
    private _moveTopHandle;
    private _onTopHandlePointerUp;
    private _onTopRightHandlePointerDown;
    private _onTopRightHandlePointerMove;
    private _moveTopRightHandle;
    private _onTopRightHandlePointerUp;
    private _onBottomRightHandlePointerDown;
    private _onBottomRightHandlePointerMove;
    private _moveBottomRightHandle;
    private _onBottomRightHandlePointerUp;
    private _onBottomLeftHandlePointerDown;
    private _onBottomLeftHandlePointerMove;
    private _moveBottomLeftHandle;
    private _onBottomLeftHandlePointerUp;
    private _onTopLeftHandlePointerDown;
    private _onTopLeftHandlePointerMove;
    private _moveTopLeftHandle;
    private _onTopLeftHandlePointerUp;
    private _expandLeft;
    private _expandTop;
    private _expandRight;
    private _expandBottom;
    dispose(): void;
    private _serializePortData;
    serialize(saveCollapsedState: boolean): IFrameData;
    export(): void;
    adjustPorts(): void;
    static Parse(serializationData: IFrameData, canvas: GraphCanvasComponent, map?: {
        [key: number]: number;
    }): GraphFrame;
}

}
declare module "babylonjs-node-editor/nodeGraphSystem/graphCanvas" {
import * as React from "react";
import { GraphNode } from "babylonjs-node-editor/nodeGraphSystem/graphNode";
import { Nullable } from "babylonjs/types";
import { NodeLink } from "babylonjs-node-editor/nodeGraphSystem/nodeLink";
import { NodePort } from "babylonjs-node-editor/nodeGraphSystem/nodePort";
import { GraphFrame } from "babylonjs-node-editor/nodeGraphSystem/graphFrame";
import { IEditorData, IFrameData } from "babylonjs-node-editor/nodeGraphSystem/interfaces/nodeLocationInfo";
import { StateManager } from "babylonjs-node-editor/nodeGraphSystem/stateManager";
import { INodeData } from "babylonjs-node-editor/nodeGraphSystem/interfaces/nodeData";
import { IPortData } from "babylonjs-node-editor/nodeGraphSystem/interfaces/portData";
import { INodeContainer } from "babylonjs-node-editor/nodeGraphSystem/interfaces/nodeContainer";
export interface IGraphCanvasComponentProps {
    stateManager: StateManager;
    onEmitNewNode: (nodeData: INodeData) => GraphNode;
}
export class GraphCanvasComponent extends React.Component<IGraphCanvasComponentProps> implements INodeContainer {
    static readonly NodeWidth: number;
    private readonly _minZoom;
    private readonly _maxZoom;
    private _hostCanvasRef;
    private _hostCanvas;
    private _graphCanvasRef;
    private _graphCanvas;
    private _selectionContainerRef;
    private _selectionContainer;
    private _frameContainerRef;
    private _frameContainer;
    private _svgCanvasRef;
    private _svgCanvas;
    private _rootContainerRef;
    private _rootContainer;
    private _nodes;
    private _links;
    private _mouseStartPointX;
    private _mouseStartPointY;
    private _dropPointX;
    private _dropPointY;
    private _selectionStartX;
    private _selectionStartY;
    private _candidateLinkedHasMoved;
    private _x;
    private _y;
    private _lastx;
    private _lasty;
    private _zoom;
    private _selectedNodes;
    private _selectedLink;
    private _selectedPort;
    private _candidateLink;
    private _candidatePort;
    private _gridSize;
    private _selectionBox;
    private _selectedFrames;
    private _frameCandidate;
    private _frames;
    private _nodeDataContentList;
    private _altKeyIsPressed;
    private _shiftKeyIsPressed;
    private _multiKeyIsPressed;
    private _oldY;
    _frameIsMoving: boolean;
    _isLoading: boolean;
    _targetLinkCandidate: Nullable<NodeLink>;
    private _copiedNodes;
    private _copiedFrames;
    get gridSize(): number;
    set gridSize(value: number);
    get stateManager(): StateManager;
    get nodes(): GraphNode[];
    get links(): NodeLink[];
    get frames(): GraphFrame[];
    get zoom(): number;
    set zoom(value: number);
    get x(): number;
    set x(value: number);
    get y(): number;
    set y(value: number);
    get selectedNodes(): GraphNode[];
    get selectedLink(): Nullable<NodeLink>;
    get selectedFrames(): GraphFrame[];
    get selectedPort(): Nullable<NodePort>;
    get canvasContainer(): HTMLDivElement;
    get hostCanvas(): HTMLDivElement;
    get svgCanvas(): HTMLElement;
    get selectionContainer(): HTMLDivElement;
    get frameContainer(): HTMLDivElement;
    private _selectedFrameAndNodesConflict;
    constructor(props: IGraphCanvasComponentProps);
    populateConnectedEntriesBeforeRemoval(item: GraphNode, items: GraphNode[], inputs: Nullable<IPortData>[], outputs: Nullable<IPortData>[]): void;
    automaticRewire(inputs: Nullable<IPortData>[], outputs: Nullable<IPortData>[], firstOnly?: boolean): void;
    smartAddOverLink(node: GraphNode, link: NodeLink): void;
    smartAddOverNode(node: GraphNode, source: GraphNode): void;
    deleteSelection(onRemove: (nodeData: INodeData) => void, autoReconnect?: boolean): void;
    handleKeyDown(evt: KeyboardEvent, onRemove: (nodeData: INodeData) => void, mouseLocationX: number, mouseLocationY: number, dataGenerator: (nodeData: INodeData) => any, rootElement: HTMLDivElement): void;
    pasteSelection(copiedNodes: GraphNode[], currentX: number, currentY: number, dataGenerator: (nodeData: INodeData) => any, selectNew?: boolean): GraphNode[];
    reconnectNewNodes(nodeIndex: number, newNodes: GraphNode[], sourceNodes: GraphNode[], done: boolean[]): void;
    getCachedData(): any[];
    removeDataFromCache(data: any): void;
    createNodeFromObject(nodeData: INodeData, onNodeCreated: (data: any) => void, recursion?: boolean): GraphNode;
    getGridPosition(position: number, useCeil?: boolean): number;
    getGridPositionCeil(position: number): number;
    updateTransform(): void;
    onKeyUp(): void;
    findNodeFromData(data: any): GraphNode;
    reset(): void;
    connectPorts(pointA: IPortData, pointB: IPortData): void;
    removeLink(link: NodeLink): void;
    appendNode(nodeData: INodeData): GraphNode;
    distributeGraph(): void;
    componentDidMount(): void;
    onMove(evt: React.PointerEvent): void;
    onDown(evt: React.PointerEvent<HTMLElement>): void;
    onUp(evt: React.PointerEvent): void;
    onWheel(evt: React.WheelEvent): void;
    zoomToFit(): void;
    processCandidatePort(): void;
    connectNodes(nodeA: GraphNode, pointA: IPortData, nodeB: GraphNode, pointB: IPortData): void;
    drop(newNode: GraphNode, targetX: number, targetY: number, offsetX: number, offsetY: number): void;
    processEditorData(editorData: IEditorData): void;
    reOrganize(editorData?: Nullable<IEditorData>, isImportingAFrame?: boolean): void;
    addFrame(frameData: IFrameData): void;

}

}
declare module "babylonjs-node-editor/nodeGraphSystem/frameNodePort" {
import { IDisplayManager } from "babylonjs-node-editor/nodeGraphSystem/interfaces/displayManager";
import { Observable } from "babylonjs/Misc/observable";
import { Nullable } from "babylonjs/types";
import { IPortData } from "babylonjs-node-editor/nodeGraphSystem/interfaces/portData";
import { NodePort } from "babylonjs-node-editor/nodeGraphSystem/nodePort";
import { GraphNode } from "babylonjs-node-editor/nodeGraphSystem/graphNode";
import { FramePortPosition } from "babylonjs-node-editor/nodeGraphSystem/graphFrame";
import { StateManager } from "babylonjs-node-editor/nodeGraphSystem/stateManager";
export class FrameNodePort extends NodePort {
    portData: IPortData;
    node: GraphNode;
    private _parentFrameId;
    private _isInput;
    private _framePortPosition;
    private _framePortId;
    private _onFramePortPositionChangedObservable;
    get parentFrameId(): number;
    get onFramePortPositionChangedObservable(): Observable<FrameNodePort>;
    get isInput(): boolean;
    get framePortId(): number;
    get framePortPosition(): FramePortPosition;
    set framePortPosition(position: FramePortPosition);
    constructor(portContainer: HTMLElement, portData: IPortData, node: GraphNode, stateManager: StateManager, isInput: boolean, framePortId: number, parentFrameId: number);
    static CreateFrameNodePortElement(portData: IPortData, node: GraphNode, root: HTMLElement, displayManager: Nullable<IDisplayManager>, stateManager: StateManager, isInput: boolean, framePortId: number, parentFrameId: number): FrameNodePort;
}

}
declare module "babylonjs-node-editor/nodeGraphSystem/displayLedger" {
export class DisplayLedger {
    static RegisteredControls: {
        [key: string]: any;
    };
}

}
declare module "babylonjs-node-editor/nodeGraphSystem/automaticProperties" {
import { IEditablePropertyOption } from "babylonjs/Decorators/nodeDecorator";
import { StateManager } from "babylonjs-node-editor/nodeGraphSystem/stateManager";
/**
 * Function used to force a rebuild of the node system
 * @param source source object
 * @param stateManager defines the state manager to use
 * @param propertyName name of the property that has been changed
 * @param notifiers list of notifiers to use
 */
export function ForceRebuild(source: any, stateManager: StateManager, propertyName: string, notifiers?: IEditablePropertyOption["notifiers"]): void;

}
declare module "babylonjs-node-editor/nodeGraphSystem/types/framePortData" {
import { GraphFrame } from "babylonjs-node-editor/nodeGraphSystem/graphFrame";
import { FrameNodePort } from "babylonjs-node-editor/nodeGraphSystem/frameNodePort";
export type FramePortData = {
    frame: GraphFrame;
    port: FrameNodePort;
};

}
declare module "babylonjs-node-editor/nodeGraphSystem/interfaces/selectionChangedOptions" {
import { Nullable } from "babylonjs/types";
import { GraphFrame } from "babylonjs-node-editor/nodeGraphSystem/graphFrame";
import { GraphNode } from "babylonjs-node-editor/nodeGraphSystem/graphNode";
import { NodeLink } from "babylonjs-node-editor/nodeGraphSystem/nodeLink";
import { NodePort } from "babylonjs-node-editor/nodeGraphSystem/nodePort";
import { FramePortData } from "babylonjs-node-editor/nodeGraphSystem/types/framePortData";
export interface ISelectionChangedOptions {
    selection: Nullable<GraphNode | NodeLink | GraphFrame | NodePort | FramePortData>;
    forceKeepSelection?: boolean;
    marqueeSelection?: boolean;
}

}
declare module "babylonjs-node-editor/nodeGraphSystem/interfaces/propertyComponentProps" {
import { StateManager } from "babylonjs-node-editor/nodeGraphSystem/stateManager";
import { INodeData } from "babylonjs-node-editor/nodeGraphSystem/interfaces/nodeData";
export interface IPropertyComponentProps {
    stateManager: StateManager;
    nodeData: INodeData;
}

}
declare module "babylonjs-node-editor/nodeGraphSystem/interfaces/portData" {
import { Nullable } from "babylonjs/types";
import { GraphNode } from "babylonjs-node-editor/nodeGraphSystem/graphNode";
export enum PortDataDirection {
    /** Input */
    Input = 0,
    /** Output */
    Output = 1
}
export enum PortDirectValueTypes {
    Float = 0,
    Int = 1
}
export interface IPortDirectValueDefinition {
    /**
     * Gets the source object
     */
    source: any;
    /**
     * Gets the property name used to store the value
     */
    propertyName: string;
    /**
     * Gets or sets the min value accepted for this point if nothing is connected
     */
    valueMin: Nullable<any>;
    /**
     * Gets or sets the max value accepted for this point if nothing is connected
     */
    valueMax: Nullable<any>;
    /**
     * Gets or sets the type of the value
     */
    valueType: PortDirectValueTypes;
}
export interface IPortData {
    data: any;
    name: string;
    internalName: string;
    isExposedOnFrame: boolean;
    exposedPortPosition: number;
    isConnected: boolean;
    direction: PortDataDirection;
    ownerData: any;
    connectedPort: Nullable<IPortData>;
    needDualDirectionValidation: boolean;
    hasEndpoints: boolean;
    endpoints: Nullable<IPortData[]>;
    directValueDefinition?: IPortDirectValueDefinition;
    updateDisplayName: (newName: string) => void;
    canConnectTo: (port: IPortData) => boolean;
    connectTo: (port: IPortData) => void;
    disconnectFrom: (port: IPortData) => void;
    checkCompatibilityState(port: IPortData): number;
    getCompatibilityIssueMessage(issue: number, targetNode: GraphNode, targetPort: IPortData): string;
}

}
declare module "babylonjs-node-editor/nodeGraphSystem/interfaces/nodeLocationInfo" {
export interface INodeLocationInfo {
    blockId: number;
    x: number;
    y: number;
    isCollapsed: boolean;
}
export interface IFrameData {
    x: number;
    y: number;
    width: number;
    height: number;
    color: number[];
    name: string;
    isCollapsed: boolean;
    blocks: number[];
    comments: string;
}
export interface IEditorData {
    locations: INodeLocationInfo[];
    x: number;
    y: number;
    zoom: number;
    frames?: IFrameData[];
    map?: {
        [key: number]: number;
    };
}

}
declare module "babylonjs-node-editor/nodeGraphSystem/interfaces/nodeData" {
import { Nullable } from "babylonjs/types";
import { IPortData } from "babylonjs-node-editor/nodeGraphSystem/interfaces/portData";
export interface INodeData {
    data: any;
    name: string;
    uniqueId: number;
    isInput: boolean;
    comments: string;
    executionTime?: number;
    refreshCallback?: () => void;
    prepareHeaderIcon: (iconDiv: HTMLDivElement, img: HTMLImageElement) => void;
    getClassName: () => string;
    dispose: () => void;
    getPortByName: (name: string) => Nullable<IPortData>;
    inputs: IPortData[];
    outputs: IPortData[];
    invisibleEndpoints?: Nullable<any[]>;
    isConnectedToOutput?: () => boolean;
    isActive?: boolean;
    setIsActive?: (value: boolean) => void;
    canBeActivated?: boolean;
    onInputCountChanged?: () => void;
}

}
declare module "babylonjs-node-editor/nodeGraphSystem/interfaces/nodeContainer" {
import { GraphNode } from "babylonjs-node-editor/nodeGraphSystem/graphNode";
import { INodeData } from "babylonjs-node-editor/nodeGraphSystem/interfaces/nodeData";
export interface INodeContainer {
    nodes: GraphNode[];
    appendNode(data: INodeData): GraphNode;
}

}
declare module "babylonjs-node-editor/nodeGraphSystem/interfaces/displayManager" {
import { Nullable } from "babylonjs/types";
import { StateManager } from "babylonjs-node-editor/nodeGraphSystem/stateManager";
import { INodeData } from "babylonjs-node-editor/nodeGraphSystem/interfaces/nodeData";
import { IPortData } from "babylonjs-node-editor/nodeGraphSystem/interfaces/portData";
export interface VisualContentDescription {
    [key: string]: HTMLElement;
}
export interface IDisplayManager {
    getHeaderClass(data: INodeData): string;
    shouldDisplayPortLabels(data: IPortData): boolean;
    updatePreviewContent(data: INodeData, contentArea: HTMLDivElement): void;
    updateFullVisualContent?(data: INodeData, visualContent: VisualContentDescription): void;
    getBackgroundColor(data: INodeData): string;
    getHeaderText(data: INodeData): string;
    onSelectionChanged?(data: INodeData, selectedData: Nullable<INodeData>, manager: StateManager): void;
    onDispose?(nodeData: INodeData, manager: StateManager): void;
}

}
declare module "babylonjs-node-editor/lines/vector4LineComponent" {
import * as React from "react";
import { Vector4 } from "babylonjs/Maths/math.vector";
import { Observable } from "babylonjs/Misc/observable";
import { PropertyChangedEvent } from "babylonjs-node-editor/propertyChangedEvent";
import { LockObject } from "babylonjs-node-editor/tabs/propertyGrids/lockObject";
interface IVector4LineComponentProps {
    label: string;
    target?: any;
    propertyName?: string;
    step?: number;
    onChange?: (newvalue: Vector4) => void;
    useEuler?: boolean;
    onPropertyChangedObservable?: Observable<PropertyChangedEvent>;
    icon?: string;
    iconLabel?: string;
    value?: Vector4;
    lockObject: LockObject;
}
export class Vector4LineComponent extends React.Component<IVector4LineComponentProps, {
    isExpanded: boolean;
    value: Vector4;
}> {
    static defaultProps: {
        step: number;
    };
    private _localChange;
    constructor(props: IVector4LineComponentProps);
    getCurrentValue(): any;
    shouldComponentUpdate(nextProps: IVector4LineComponentProps, nextState: {
        isExpanded: boolean;
        value: Vector4;
    }): boolean;
    switchExpandState(): void;
    raiseOnPropertyChanged(previousValue: Vector4): void;
    updateVector4(): void;
    updateStateX(value: number): void;
    updateStateY(value: number): void;
    updateStateZ(value: number): void;
    updateStateW(value: number): void;

}
export {};

}
declare module "babylonjs-node-editor/lines/vector3LineComponent" {
import * as React from "react";
import { Vector3 } from "babylonjs/Maths/math.vector";
import { Observable } from "babylonjs/Misc/observable";
import { PropertyChangedEvent } from "babylonjs-node-editor/propertyChangedEvent";
import { LockObject } from "babylonjs-node-editor/tabs/propertyGrids/lockObject";
interface IVector3LineComponentProps {
    label: string;
    target?: any;
    propertyName?: string;
    step?: number;
    onChange?: (newvalue: Vector3) => void;
    useEuler?: boolean;
    onPropertyChangedObservable?: Observable<PropertyChangedEvent>;
    noSlider?: boolean;
    icon?: string;
    iconLabel?: string;
    lockObject: LockObject;
    directValue?: Vector3;
    additionalCommands?: JSX.Element[];
}
export class Vector3LineComponent extends React.Component<IVector3LineComponentProps, {
    isExpanded: boolean;
    value: Vector3;
}> {
    static defaultProps: {
        step: number;
    };
    private _localChange;
    constructor(props: IVector3LineComponentProps);
    getCurrentValue(): any;
    shouldComponentUpdate(nextProps: IVector3LineComponentProps, nextState: {
        isExpanded: boolean;
        value: Vector3;
    }): boolean;
    switchExpandState(): void;
    raiseOnPropertyChanged(previousValue: Vector3): void;
    updateVector3(): void;
    updateStateX(value: number): void;
    updateStateY(value: number): void;
    updateStateZ(value: number): void;
    onCopyClick(): string;



}
export {};

}
declare module "babylonjs-node-editor/lines/vector2LineComponent" {
import * as React from "react";
import { Vector2 } from "babylonjs/Maths/math.vector";
import { Observable } from "babylonjs/Misc/observable";
import { PropertyChangedEvent } from "babylonjs-node-editor/propertyChangedEvent";
import { LockObject } from "babylonjs-node-editor/tabs/propertyGrids/lockObject";
interface IVector2LineComponentProps {
    label: string;
    target: any;
    propertyName: string;
    step?: number;
    onChange?: (newvalue: Vector2) => void;
    onPropertyChangedObservable?: Observable<PropertyChangedEvent>;
    icon?: string;
    iconLabel?: string;
    lockObject: LockObject;
}
export class Vector2LineComponent extends React.Component<IVector2LineComponentProps, {
    isExpanded: boolean;
    value: Vector2;
}> {
    static defaultProps: {
        step: number;
    };
    private _localChange;
    constructor(props: IVector2LineComponentProps);
    shouldComponentUpdate(nextProps: IVector2LineComponentProps, nextState: {
        isExpanded: boolean;
        value: Vector2;
    }): boolean;
    switchExpandState(): void;
    raiseOnPropertyChanged(previousValue: Vector2): void;
    updateStateX(value: number): void;
    updateStateY(value: number): void;

}
export {};

}
declare module "babylonjs-node-editor/lines/valueLineComponent" {
import * as React from "react";
interface IValueLineComponentProps {
    label: string;
    value: number;
    color?: string;
    fractionDigits?: number;
    units?: string;
    icon?: string;
    iconLabel?: string;
}
export class ValueLineComponent extends React.Component<IValueLineComponentProps> {
    constructor(props: IValueLineComponentProps);

}
export {};

}
declare module "babylonjs-node-editor/lines/unitButton" {
interface IUnitButtonProps {
    unit: string;
    locked?: boolean;
    onClick?: (unit: string) => void;
}

export {};

}
declare module "babylonjs-node-editor/lines/textureButtonLineComponent" {
import { BaseTexture } from "babylonjs/Materials/Textures/baseTexture";
import { Scene } from "babylonjs/scene";
import * as React from "react";
interface ITextureButtonLineProps {
    label: string;
    scene: Scene;
    onClick: (file: File) => void;
    onLink: (texture: BaseTexture) => void;
    accept: string;
}
interface ITextureButtonLineState {
    isOpen: boolean;
}
export class TextureButtonLine extends React.Component<ITextureButtonLineProps, ITextureButtonLineState> {
    private static _IdGenerator;
    private _id;
    private _uploadInputRef;
    constructor(props: ITextureButtonLineProps);
    onChange(evt: any): void;

}
export {};

}
declare module "babylonjs-node-editor/lines/textLineComponent" {
import * as React from "react";
interface ITextLineComponentProps {
    label?: string;
    value?: string;
    color?: string;
    underline?: boolean;
    onLink?: () => void;
    url?: string;
    ignoreValue?: boolean;
    additionalClass?: string;
    icon?: string;
    iconLabel?: string;
    tooltip?: string;
    onCopy?: true | (() => string);
}
export class TextLineComponent extends React.Component<ITextLineComponentProps> {
    constructor(props: ITextLineComponentProps);
    onLink(): void;
    copyFn(): (() => string) | undefined;




}
export {};

}
declare module "babylonjs-node-editor/lines/textInputLineComponent" {
import { ReactNode, KeyboardEvent } from "react";
import { Component } from "react";
import { Observable } from "babylonjs/Misc/observable";
import { PropertyChangedEvent } from "babylonjs-node-editor/propertyChangedEvent";
import { LockObject } from "babylonjs-node-editor/tabs/propertyGrids/lockObject";
export interface ITextInputLineComponentProps {
    label?: string;
    lockObject?: LockObject;
    target?: any;
    propertyName?: string;
    value?: string;
    onChange?: (value: string) => void;
    onPropertyChangedObservable?: Observable<PropertyChangedEvent>;
    icon?: string;
    iconLabel?: string;
    noUnderline?: boolean;
    numbersOnly?: boolean;
    delayInput?: boolean;
    arrows?: boolean;
    arrowsIncrement?: (amount: number) => void;
    step?: number;
    numeric?: boolean;
    roundValues?: boolean;
    min?: number;
    max?: number;
    placeholder?: string;
    unit?: ReactNode;
    validator?: (value: string) => boolean;
    multilines?: boolean;
    throttlePropertyChangedNotification?: boolean;
    throttlePropertyChangedNotificationDelay?: number;
    disabled?: boolean;
}
export class TextInputLineComponent extends Component<ITextInputLineComponentProps, {
    value: string;
    dragging: boolean;
}> {
    private _localChange;
    constructor(props: ITextInputLineComponentProps);
    componentWillUnmount(): void;
    shouldComponentUpdate(nextProps: ITextInputLineComponentProps, nextState: {
        value: string;
        dragging: boolean;
    }): boolean;
    raiseOnPropertyChanged(newValue: string, previousValue: string): void;
    getCurrentNumericValue(value: string): number;
    updateValue(value: string, valueToValidate?: string): void;
    incrementValue(amount: number): void;
    onKeyDown(event: KeyboardEvent): void;



}

}
declare module "babylonjs-node-editor/lines/targetsProxy" {
import { PropertyChangedEvent } from "babylonjs-node-editor/propertyChangedEvent";
import { Observable } from "babylonjs/Misc/observable";
export const conflictingValuesPlaceholder = "\u2014";
/**
 *
 * @param targets a list of selected targets
 * @param onPropertyChangedObservable
 * @param getProperty
 * @returns a proxy object that can be passed as a target into the input
 */
export function makeTargetsProxy<Type>(targets: Type[], onPropertyChangedObservable?: Observable<PropertyChangedEvent>, getProperty?: (target: Type, property: keyof Type) => any): any;

}
declare module "babylonjs-node-editor/lines/sliderLineComponent" {
import * as React from "react";
import { Observable } from "babylonjs/Misc/observable";
import { PropertyChangedEvent } from "babylonjs-node-editor/propertyChangedEvent";
import { LockObject } from "babylonjs-node-editor/tabs/propertyGrids/lockObject";
interface ISliderLineComponentProps {
    label: string;
    target?: any;
    propertyName?: string;
    minimum: number;
    maximum: number;
    step: number;
    directValue?: number;
    useEuler?: boolean;
    onChange?: (value: number) => void;
    onInput?: (value: number) => void;
    onPropertyChangedObservable?: Observable<PropertyChangedEvent>;
    decimalCount?: number;
    margin?: boolean;
    icon?: string;
    iconLabel?: string;
    lockObject: LockObject;
    unit?: React.ReactNode;
    allowOverflow?: boolean;
}
export class SliderLineComponent extends React.Component<ISliderLineComponentProps, {
    value: number;
}> {
    private _localChange;
    constructor(props: ISliderLineComponentProps);
    shouldComponentUpdate(nextProps: ISliderLineComponentProps, nextState: {
        value: number;
    }): boolean;
    onChange(newValueString: any): void;
    onInput(newValueString: any): void;
    prepareDataToRead(value: number): number;
    onCopyClick(): void;



}
export {};

}
declare module "babylonjs-node-editor/lines/radioLineComponent" {
import * as React from "react";
import { Observable } from "babylonjs/Misc/observable";
interface IRadioButtonLineComponentProps {
    onSelectionChangedObservable: Observable<RadioButtonLineComponent>;
    label: string;
    isSelected: () => boolean;
    onSelect: () => void;
    icon?: string;
    iconLabel?: string;
}
export class RadioButtonLineComponent extends React.Component<IRadioButtonLineComponentProps, {
    isSelected: boolean;
}> {
    private _onSelectionChangedObserver;
    constructor(props: IRadioButtonLineComponentProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    onChange(): void;

}
export {};

}
declare module "babylonjs-node-editor/lines/optionsLineComponent" {
import * as React from "react";
import { Observable } from "babylonjs/Misc/observable";
import { PropertyChangedEvent } from "babylonjs-node-editor/propertyChangedEvent";
import { IInspectableOptions } from "babylonjs/Misc/iInspectable";
export const Null_Value: number;
export interface IOptionsLineProps {
    label: string;
    target: any;
    propertyName: string;
    options: readonly IInspectableOptions[];
    noDirectUpdate?: boolean;
    onSelect?: (value: number | string) => void;
    extractValue?: (target: any) => number | string;
    onPropertyChangedObservable?: Observable<PropertyChangedEvent>;
    allowNullValue?: boolean;
    icon?: string;
    iconLabel?: string;
    className?: string;
    valuesAreStrings?: boolean;
    defaultIfNull?: number;
}
export class OptionsLine extends React.Component<IOptionsLineProps, {
    value: number | string;
}> {
    private _localChange;
    private _remapValueIn;
    private _remapValueOut;
    private _getValue;
    constructor(props: IOptionsLineProps);
    shouldComponentUpdate(nextProps: IOptionsLineProps, nextState: {
        value: number;
    }): boolean;
    raiseOnPropertyChanged(newValue: number, previousValue: number): void;
    setValue(value: string | number): void;
    updateValue(valueString: string): void;
    onCopyClickStr(): string;
    private _renderFluent;
    private _renderOriginal;

}

}
declare module "babylonjs-node-editor/lines/numericInputComponent" {
import * as React from "react";
import { LockObject } from "babylonjs-node-editor/tabs/propertyGrids/lockObject";
interface INumericInputProps {
    label: string;
    labelTooltip?: string;
    value: number;
    step?: number;
    onChange: (value: number) => void;
    precision?: number;
    icon?: string;
    iconLabel?: string;
    lockObject: LockObject;
}
export class NumericInput extends React.Component<INumericInputProps, {
    value: string;
}> {
    static defaultProps: {
        step: number;
    };
    private _localChange;
    constructor(props: INumericInputProps);
    componentWillUnmount(): void;
    shouldComponentUpdate(nextProps: INumericInputProps, nextState: {
        value: string;
    }): boolean;
    updateValue(valueString: string): void;
    onBlur(): void;
    incrementValue(amount: number): void;
    onKeyDown(evt: React.KeyboardEvent<HTMLInputElement>): void;

}
export {};

}
declare module "babylonjs-node-editor/lines/messageLineComponent" {
import * as React from "react";

interface IMessageLineComponentProps {
    text: string;
    color?: string;
    icon?: any;
}
export class MessageLineComponent extends React.Component<IMessageLineComponentProps> {
    constructor(props: IMessageLineComponentProps);



}
export {};

}
declare module "babylonjs-node-editor/lines/matrixLineComponent" {
import * as React from "react";
import { Vector3, Vector4 } from "babylonjs/Maths/math.vector";
import { Matrix } from "babylonjs/Maths/math.vector";
import { Observable } from "babylonjs/Misc/observable";
import { PropertyChangedEvent } from "babylonjs-node-editor/propertyChangedEvent";
import { LockObject } from "babylonjs-node-editor/tabs/propertyGrids/lockObject";
interface IMatrixLineComponentProps {
    label: string;
    target: any;
    propertyName: string;
    step?: number;
    onChange?: (newValue: Matrix) => void;
    onModeChange?: (mode: number) => void;
    onPropertyChangedObservable?: Observable<PropertyChangedEvent>;
    mode?: number;
    lockObject: LockObject;
}
export class MatrixLineComponent extends React.Component<IMatrixLineComponentProps, {
    value: Matrix;
    mode: number;
    angle: number;
}> {
    private _localChange;
    constructor(props: IMatrixLineComponentProps);
    shouldComponentUpdate(nextProps: IMatrixLineComponentProps, nextState: {
        value: Matrix;
        mode: number;
        angle: number;
    }): boolean;
    raiseOnPropertyChanged(previousValue: Vector3): void;
    updateMatrix(): void;
    updateRow(value: Vector4, row: number): void;
    updateBasedOnMode(value: number): void;

}
export {};

}
declare module "babylonjs-node-editor/lines/linkButtonComponent" {
import * as React from "react";

interface ILinkButtonComponentProps {
    label: string;
    buttonLabel: string;
    url?: string;
    onClick: () => void;
    icon?: any;
    onIconClick?: () => void;
}
export class LinkButtonComponent extends React.Component<ILinkButtonComponentProps> {
    constructor(props: ILinkButtonComponentProps);
    onLink(): void;

}
export {};

}
declare module "babylonjs-node-editor/lines/lineWithFileButtonComponent" {
import * as React from "react";
interface ILineWithFileButtonComponentProps {
    title: string;
    closed?: boolean;
    multiple?: boolean;
    label: string;
    iconImage: any;
    onIconClick: (file: File) => void;
    accept: string;
    uploadName?: string;
}
export class LineWithFileButtonComponent extends React.Component<ILineWithFileButtonComponentProps, {
    isExpanded: boolean;
}> {
    private _uploadRef;
    constructor(props: ILineWithFileButtonComponentProps);
    onChange(evt: any): void;
    switchExpandedState(): void;



}
export {};

}
declare module "babylonjs-node-editor/lines/lineContainerComponent" {
import * as React from "react";
import { ISelectedLineContainer } from "babylonjs-node-editor/lines/iSelectedLineContainer";
interface ILineContainerComponentProps {
    selection?: ISelectedLineContainer;
    title: string;
    children: any[] | any;
    closed?: boolean;
}
export class LineContainerComponent extends React.Component<ILineContainerComponentProps, {
    isExpanded: boolean;
    isHighlighted: boolean;
}> {
    constructor(props: ILineContainerComponentProps);
    switchExpandedState(): void;

    componentDidMount(): void;



}
export {};

}
declare module "babylonjs-node-editor/lines/inputArrowsComponent" {
import * as React from "react";
interface IInputArrowsComponentProps {
    incrementValue: (amount: number) => void;
    setDragging: (dragging: boolean) => void;
}
export class InputArrowsComponent extends React.Component<IInputArrowsComponentProps> {
    private _arrowsRef;
    private _drag;
    private _releaseListener;
    private _lockChangeListener;

}
export {};

}
declare module "babylonjs-node-editor/lines/indentedTextLineComponent" {
import * as React from "react";
interface IIndentedTextLineComponentProps {
    value?: string;
    color?: string;
    underline?: boolean;
    onLink?: () => void;
    url?: string;
    additionalClass?: string;
}
export class IndentedTextLineComponent extends React.Component<IIndentedTextLineComponentProps> {
    constructor(props: IIndentedTextLineComponentProps);
    onLink(): void;


}
export {};

}
declare module "babylonjs-node-editor/lines/iconComponent" {
import * as React from "react";
interface IIconComponentProps {
    icon: string;
    label?: string;
}
export class IconComponent extends React.Component<IIconComponentProps> {

}
export {};

}
declare module "babylonjs-node-editor/lines/iSelectedLineContainer" {
export interface ISelectedLineContainer {
    selectedLineContainerTitles: Array<string>;
    selectedLineContainerTitlesNoFocus: Array<string>;
}

}
declare module "babylonjs-node-editor/lines/hexLineComponent" {
import * as React from "react";
import { Observable } from "babylonjs/Misc/observable";
import { PropertyChangedEvent } from "babylonjs-node-editor/propertyChangedEvent";
import { LockObject } from "babylonjs-node-editor/tabs/propertyGrids/lockObject";
interface IHexLineComponentProps {
    label: string;
    target: any;
    propertyName: string;
    lockObject?: LockObject;
    onChange?: (newValue: number) => void;
    isInteger?: boolean;
    replaySourceReplacement?: string;
    onPropertyChangedObservable?: Observable<PropertyChangedEvent>;
    additionalClass?: string;
    step?: string;
    digits?: number;
    useEuler?: boolean;
    min?: number;
    icon?: string;
    iconLabel?: string;
}
export class HexLineComponent extends React.Component<IHexLineComponentProps, {
    value: string;
}> {
    private _localChange;
    private _store;
    private _propertyChange;
    constructor(props: IHexLineComponentProps);
    componentWillUnmount(): void;
    shouldComponentUpdate(nextProps: IHexLineComponentProps, nextState: {
        value: string;
    }): boolean;
    raiseOnPropertyChanged(newValue: number, previousValue: number): void;
    convertToHexString(valueString: string): string;
    updateValue(valueString: string, raisePropertyChanged: boolean): void;
    lock(): void;
    unlock(): void;
    onCopyClick(): void;

}
export {};

}
declare module "babylonjs-node-editor/lines/floatLineComponent" {
import * as React from "react";
import { Observable } from "babylonjs/Misc/observable";
import { PropertyChangedEvent } from "babylonjs-node-editor/propertyChangedEvent";
import { LockObject } from "babylonjs-node-editor/tabs/propertyGrids/lockObject";
interface IFloatLineComponentProps {
    label: string;
    target: any;
    propertyName: string;
    lockObject: LockObject;
    onChange?: (newValue: number) => void;
    isInteger?: boolean;
    onPropertyChangedObservable?: Observable<PropertyChangedEvent>;
    additionalClass?: string;
    step?: string;
    digits?: number;
    useEuler?: boolean;
    min?: number;
    max?: number;
    smallUI?: boolean;
    onEnter?: (newValue: number) => void;
    icon?: string;
    iconLabel?: string;
    defaultValue?: number;
    arrows?: boolean;
    unit?: React.ReactNode;
    onDragStart?: (newValue: number) => void;
    onDragStop?: (newValue: number) => void;
    disabled?: boolean;
}
export class FloatLineComponent extends React.Component<IFloatLineComponentProps, {
    value: string;
    dragging: boolean;
}> {
    private _localChange;
    private _store;
    constructor(props: IFloatLineComponentProps);
    componentWillUnmount(): void;
    getValueString(value: any, props: IFloatLineComponentProps): string;
    shouldComponentUpdate(nextProps: IFloatLineComponentProps, nextState: {
        value: string;
        dragging: boolean;
    }): boolean;
    raiseOnPropertyChanged(newValue: number, previousValue: number): void;
    updateValue(valueString: string): void;
    lock(): void;
    unlock(): void;
    incrementValue(amount: number, processStep?: boolean): void;
    onKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void;
    onCopyClick(): void;



}
export {};

}
declare module "babylonjs-node-editor/lines/fileMultipleButtonLineComponent" {
import * as React from "react";
interface IFileMultipleButtonLineComponentProps {
    label: string;
    onClick: (event: any) => void;
    accept: string;
    icon?: string;
    iconLabel?: string;
}
export class FileMultipleButtonLineComponent extends React.Component<IFileMultipleButtonLineComponentProps> {
    private static _IdGenerator;
    private _id;
    private _uploadInputRef;
    constructor(props: IFileMultipleButtonLineComponentProps);
    onChange(evt: any): void;

}
export {};

}
declare module "babylonjs-node-editor/lines/fileButtonLineComponent" {
import * as React from "react";
interface IFileButtonLineProps {
    label: string;
    onClick: (file: File) => void;
    accept: string;
    icon?: string;
    iconLabel?: string;
}
export class FileButtonLine extends React.Component<IFileButtonLineProps> {
    private static _IdGenerator;
    private _id;
    private _uploadInputRef;
    constructor(props: IFileButtonLineProps);
    onChange(evt: any): void;



}
export {};

}
declare module "babylonjs-node-editor/lines/draggableLineWithButtonComponent" {
export type DraggableLineWithButtonProps = {
    format: string;
    data: string;
    tooltip: string;
    iconImage: any;
    onIconClick: (value: string) => void;
    iconTitle: string;
    lenSuffixToRemove?: number;
};
export const DraggableLineWithButtonComponent: React.FunctionComponent<DraggableLineWithButtonProps>;

}
declare module "babylonjs-node-editor/lines/draggableLineComponent" {
import { DraggableLineProps } from "babylonjs-node-editor/fluent/primitives/draggable";
type DraggableLineComponentProps = Omit<DraggableLineProps, "label">;
export const DraggableLineComponent: React.FunctionComponent<DraggableLineComponentProps>;
export {};

}
declare module "babylonjs-node-editor/lines/colorPickerComponent" {
import * as React from "react";
import { Color4, Color3 } from "babylonjs/Maths/math.color";
import { LockObject } from "babylonjs-node-editor/tabs/propertyGrids/lockObject";
export interface IColorPickerLineProps {
    value: Color4 | Color3;
    linearHint?: boolean;
    onColorChanged: (newOne: string) => void;
    icon?: string;
    iconLabel?: string;
    shouldPopRight?: boolean;
    lockObject?: LockObject;
}
interface IColorPickerComponentState {
    pickerEnabled: boolean;
    color: Color3 | Color4;
    hex: string;
}
export class ColorPickerLine extends React.Component<IColorPickerLineProps, IColorPickerComponentState> {
    private _floatRef;
    private _floatHostRef;
    constructor(props: IColorPickerLineProps);
    syncPositions(): void;
    shouldComponentUpdate(nextProps: IColorPickerLineProps, nextState: IColorPickerComponentState): boolean;
    getHexString(props?: Readonly<IColorPickerLineProps>): string;
    componentDidUpdate(): void;
    componentDidMount(): void;

}
export {};

}
declare module "babylonjs-node-editor/lines/colorLineComponent" {
import * as React from "react";
import { Observable } from "babylonjs/Misc/observable";
import { Color4 } from "babylonjs/Maths/math.color";
import { PropertyChangedEvent } from "babylonjs-node-editor/propertyChangedEvent";
import { LockObject } from "babylonjs-node-editor/tabs/propertyGrids/lockObject";
export interface IColorLineProps {
    label: string;
    target?: any;
    propertyName: string;
    onPropertyChangedObservable?: Observable<PropertyChangedEvent>;
    onChange?: () => void;
    isLinear?: boolean;
    icon?: string;
    iconLabel?: string;
    disableAlpha?: boolean;
    lockObject: LockObject;
}
interface IColorLineComponentState {
    isExpanded: boolean;
    color: Color4;
}
export class ColorLine extends React.Component<IColorLineProps, IColorLineComponentState> {
    constructor(props: IColorLineProps);
    shouldComponentUpdate(nextProps: IColorLineProps, nextState: IColorLineComponentState): boolean;
    getValue(props?: Readonly<IColorLineProps>): Color4;
    setColorFromString(colorString: string): void;
    setColor(newColor: Color4): void;
    switchExpandState(): void;
    updateStateR(value: number): void;
    updateStateG(value: number): void;
    updateStateB(value: number): void;
    updateStateA(value: number): void;
    private _convertToColor;
    private _toColor3;
    onCopyClick(): void;



}
export {};

}
declare module "babylonjs-node-editor/lines/color4LineComponent" {
import * as React from "react";
import { Observable } from "babylonjs/Misc/observable";
import { PropertyChangedEvent } from "babylonjs-node-editor/propertyChangedEvent";
import { LockObject } from "babylonjs-node-editor/tabs/propertyGrids/lockObject";
export interface IColor4LineComponentProps {
    label: string;
    target?: any;
    propertyName: string;
    onPropertyChangedObservable?: Observable<PropertyChangedEvent>;
    onChange?: () => void;
    isLinear?: boolean;
    icon?: string;
    iconLabel?: string;
    lockObject: LockObject;
}
export class Color4LineComponent extends React.Component<IColor4LineComponentProps> {

}

}
declare module "babylonjs-node-editor/lines/color3LineComponent" {
import * as React from "react";
import { Observable } from "babylonjs/Misc/observable";
import { PropertyChangedEvent } from "babylonjs-node-editor/propertyChangedEvent";
import { LockObject } from "babylonjs-node-editor/tabs/propertyGrids/lockObject";
export interface IColor3LineComponentProps {
    label: string;
    target: any;
    propertyName: string;
    onPropertyChangedObservable?: Observable<PropertyChangedEvent>;
    isLinear?: boolean;
    icon?: string;
    lockObject: LockObject;
    iconLabel?: string;
    onChange?: () => void;
}
export class Color3LineComponent extends React.Component<IColor3LineComponentProps> {

}

}
declare module "babylonjs-node-editor/lines/checkBoxLineComponent" {
import * as React from "react";
import { Observable } from "babylonjs/Misc/observable";
import { PropertyChangedEvent } from "babylonjs-node-editor/propertyChangedEvent";

export interface ICheckBoxLineComponentProps {
    label?: string;
    target?: any;
    propertyName?: string;
    isSelected?: boolean | (() => boolean);
    onSelect?: (value: boolean) => void;
    onValueChanged?: () => void;
    onPropertyChangedObservable?: Observable<PropertyChangedEvent>;
    disabled?: boolean;
    icon?: string;
    iconLabel?: string;
    faIcons?: {
        enabled: any;
        disabled: any;
    };
    large?: boolean;
}
export class CheckBoxLineComponent extends React.Component<ICheckBoxLineComponentProps, {
    isSelected: boolean;
    isDisabled?: boolean;
    isConflict: boolean;
}> {
    private _localChange;
    constructor(props: ICheckBoxLineComponentProps);
    shouldComponentUpdate(nextProps: ICheckBoxLineComponentProps, nextState: {
        isSelected: boolean;
        isDisabled: boolean;
        isConflict: boolean;
    }): boolean;
    onChange(): void;
    onCopyClick(): void;



}

}
declare module "babylonjs-node-editor/lines/buttonLineComponent" {
import * as React from "react";
export interface IButtonLineComponentProps {
    label: string;
    onClick: () => void;
    icon?: string;
    iconLabel?: string;
    isDisabled?: boolean;
}
export class ButtonLineComponent extends React.Component<IButtonLineComponentProps> {
    constructor(props: IButtonLineComponentProps);



}

}
declare module "babylonjs-node-editor/lines/booleanLineComponent" {
import * as React from "react";
export interface IBooleanLineComponentProps {
    label: string;
    value: boolean;
    icon?: string;
    iconLabel?: string;
}
export class BooleanLineComponent extends React.Component<IBooleanLineComponentProps> {
    constructor(props: IBooleanLineComponentProps);



}

}
declare module "babylonjs-node-editor/fluent/primitives/textarea" {
import { FunctionComponent } from "react";
import { PrimitiveProps } from "babylonjs-node-editor/fluent/primitives/primitive";
export type TextareaProps = PrimitiveProps<string> & {
    placeholder?: string;
};
/**
 * This is a texarea box that stops propagation of change/keydown events
 * @param props
 * @returns
 */
export const Textarea: FunctionComponent<TextareaProps>;

}
declare module "babylonjs-node-editor/fluent/primitives/syncedSlider" {
import { FunctionComponent } from "react";
import { PrimitiveProps } from "babylonjs-node-editor/fluent/primitives/primitive";
export type SyncedSliderProps = PrimitiveProps<number> & {
    /** Minimum value for the slider */
    min?: number;
    /** Maximum value for the slider */
    max?: number;
    /** Step size for the slider */
    step?: number;
    /** When true, onChange is only called when the user releases the slider, not during drag */
    notifyOnlyOnRelease?: boolean;
};
/**
 * Component which synchronizes a slider and an input field, allowing the user to change the value using either control
 * @param props
 * @returns SyncedSlider component
 */
export const SyncedSliderInput: FunctionComponent<SyncedSliderProps>;

}
declare module "babylonjs-node-editor/fluent/primitives/switch" {
import { FunctionComponent } from "react";
import { PrimitiveProps } from "babylonjs-node-editor/fluent/primitives/primitive";
export type SwitchProps = PrimitiveProps<boolean>;
/**
 * This is a primitive fluent boolean switch component whose only knowledge is the shared styling across all tools
 * @param props
 * @returns Switch component
 */
export const Switch: FunctionComponent<SwitchProps>;

}
declare module "babylonjs-node-editor/fluent/primitives/spinButton" {
import { FunctionComponent } from "react";
import { PrimitiveProps } from "babylonjs-node-editor/fluent/primitives/primitive";
export type SpinButtonProps = PrimitiveProps<number> & {
    precision?: number;
    step?: number;
    min?: number;
    max?: number;
};
export const SpinButton: FunctionComponent<SpinButtonProps>;

}
declare module "babylonjs-node-editor/fluent/primitives/searchBox" {
import { FunctionComponent } from "react";
type SearchBoxProps = {
    items: string[];
    onItemSelected: (item: string) => void;
    title?: string;
};
/**
 * SearchBox component that displays a popup with search functionality
 * @param props - The component props
 * @returns The search box component
 */
export const SearchBox: FunctionComponent<SearchBoxProps>;
export {};

}
declare module "babylonjs-node-editor/fluent/primitives/searchBar" {
type SearchProps = {
    onChange: (val: string) => void;
    placeholder?: string;
};

export {};

}
declare module "babylonjs-node-editor/fluent/primitives/primitive" {
export type ImmutablePrimitiveProps<ValueT> = {
    /**
     * The value of the property to be displayed and modified.
     */
    value: ValueT;
    /**
     * Optional flag to disable the component, preventing any interaction.
     */
    disabled?: boolean;
    /**
     * Optional class name to apply custom styles to the component.
     */
    className?: string;
    /**
     * Optional title for the component, used for tooltips or accessibility.
     */
    title?: string;
};
export type PrimitiveProps<T> = ImmutablePrimitiveProps<T> & {
    /**
     * Called when the primitive value changes
     */
    onChange: (value: T) => void;
};

}
declare module "babylonjs-node-editor/fluent/primitives/positionedPopover" {
import { FunctionComponent, PropsWithChildren } from "react";
type PositionedPopoverProps = {
    x: number;
    y: number;
    visible: boolean;
    hide: () => void;
};
/**
 * PositionedPopover component that shows a popover at specific coordinates
 * @param props - The component props
 * @returns The positioned popover component
 */
export const PositionedPopover: FunctionComponent<PropsWithChildren<PositionedPopoverProps>>;
export {};

}
declare module "babylonjs-node-editor/fluent/primitives/messageBar" {
import { FunctionComponent } from "react";
type MessageBarProps = {
    message: string;
    title: string;
    docLink?: string;
    intent: "info" | "success" | "warning" | "error";
};
export const MessageBar: FunctionComponent<MessageBarProps>;
export {};

}
declare module "babylonjs-node-editor/fluent/primitives/list" {
import { FunctionComponent, ReactNode } from "react";
/**
 * Represents an item in a list
 */
export type ListItem<T = any> = {
    /** Unique identifier for the item */
    id: number;
    /** The data associated with the item */
    data: T;
    /** Value to use for sorting the list */
    sortBy: number;
};
type ListProps<T = any> = {
    items: ListItem<T>[];
    renderItem: (item: ListItem<T>, index: number) => ReactNode;
    onDelete: (item: ListItem<T>, index: number) => void;
    onAdd: (item?: ListItem<T>) => void;
    addButtonLabel?: string;
};
/**
 * For cases where you may want to add / remove items from a list via a trash can button / copy button, this HOC can be used
 * @returns A React component that renders a list of items with add/delete functionality
 * @param props - The properties for the List component
 */
export const List: FunctionComponent<ListProps<any>>;
export {};

}
declare module "babylonjs-node-editor/fluent/primitives/link" {


}
declare module "babylonjs-node-editor/fluent/primitives/lazyComponent" {

import { ComponentProps, ComponentType, ElementRef } from "react";
type LazyComponentProps = {
    spinnerSize?: any;
    spinnerLabel?: string;
};
/**
 * Creates a lazy component wrapper that only calls the async function to get the underlying component when the lazy component is actually mounted.
 * This allows deferring imports until they are needed. While the underlying component is being loaded, a spinner is displayed.
 * @param getComponentAsync A function that returns a promise resolving to the component.
 * @param defaultProps Options for the loading spinner.
 * @returns A React component that displays a spinner while loading the async component.
 */

export {};

}
declare module "babylonjs-node-editor/fluent/primitives/input" {
import { FunctionComponent } from "react";
import { PrimitiveProps } from "babylonjs-node-editor/fluent/primitives/primitive";
export type InputProps<T extends string | number> = PrimitiveProps<T> & {
    step?: number;
    placeholder?: string;
    min?: number;
    max?: number;
};
export const NumberInput: FunctionComponent<InputProps<number>>;
export const TextInput: FunctionComponent<InputProps<string>>;

}
declare module "babylonjs-node-editor/fluent/primitives/gradient" {
import { FunctionComponent } from "react";
import { PrimitiveProps } from "babylonjs-node-editor/fluent/primitives/primitive";
import { Color3Gradient, ColorGradient as Color4Gradient, FactorGradient } from "babylonjs/Misc/gradients";
import { GradientBlockColorStep } from "babylonjs/Materials/Node/Blocks/gradientBlock";
/**
 * Component wrapper for FactorGradient that provides slider inputs for factor1, factor2, and gradient step
 * @param props - Component props containing FactorGradient value and change handler
 * @returns A React component
 */
export const FactorGradientComponent: FunctionComponent<PrimitiveProps<FactorGradient>>;
/**
 * Component wrapper for Color3Gradient that provides color picker and gradient step slider
 * @param props - Component props containing Color3Gradient value and change handler
 * @returns A React component
 */
export const Color3GradientComponent: FunctionComponent<PrimitiveProps<Color3Gradient>>;
/**
 * Component wrapper for Color4Gradient that provides color pickers for color1, color2, and gradient step slider
 * @param props - Component props containing Color4Gradient value and change handler
 * @returns A React component
 */
export const Color4GradientComponent: FunctionComponent<PrimitiveProps<Color4Gradient>>;
/**
 * Component wrapper for GradientBlockColorStep that provides color picker and step slider
 * @param props - Component props containing GradientBlockColorStep value and change handler
 * @returns A React component
 */
export const ColorStepGradientComponent: FunctionComponent<PrimitiveProps<GradientBlockColorStep>>;

}
declare module "babylonjs-node-editor/fluent/primitives/dropdown" {
import { FunctionComponent } from "react";
import { PrimitiveProps } from "babylonjs-node-editor/fluent/primitives/primitive";
import { Nullable } from "babylonjs/types";
type DropdownOptionValue = string | number;
export type AcceptedDropdownValue = Nullable<DropdownOptionValue> | undefined;
export type DropdownOption = {
    /**
     * Defines the visible part of the option
     */
    label: string;
    /**
     * Defines the value part of the option
     */
    value: DropdownOptionValue;
};
export type DropdownProps<V extends AcceptedDropdownValue> = PrimitiveProps<V> & {
    options: readonly DropdownOption[];
    includeNullAs?: "null" | "undefined";
};
/**
 * Renders a fluent UI dropdown component for the options passed in, and an additional 'Not Defined' option if null is set to true
 * This component can handle both null and undefined values
 * @param props
 * @returns dropdown component
 */
export const Dropdown: FunctionComponent<DropdownProps<AcceptedDropdownValue>>;
export {};

}
declare module "babylonjs-node-editor/fluent/primitives/draggable" {
export type DraggableLineProps = {
    format: string;
    data: string;
    tooltip: string;
    label: string;
    onDelete?: () => void;
};
export const DraggableLine: React.FunctionComponent<DraggableLineProps>;

}
declare module "babylonjs-node-editor/fluent/primitives/comboBox" {
import { FunctionComponent } from "react";
export type ComboBoxProps = {
    label: string;
    value: string[];
    onChange: (value: string) => void;
};
/**
 * Wrapper around a Fluent ComboBox that allows for filtering options
 * @param props
 * @returns
 */
export const ComboBox: FunctionComponent<ComboBoxProps>;

}
declare module "babylonjs-node-editor/fluent/primitives/colorPicker" {
import { FunctionComponent } from "react";
import { Color3, Color4 } from "babylonjs/Maths/math.color";
import { PrimitiveProps } from "babylonjs-node-editor/fluent/primitives/primitive";
export type ColorPickerProps<C extends Color3 | Color4> = {
    isLinearMode?: boolean;
} & PrimitiveProps<C>;
export const ColorPickerPopup: FunctionComponent<ColorPickerProps<Color3 | Color4>>;
type HsvKey = "h" | "s" | "v";
export type InputHexProps = PrimitiveProps<Color3 | Color4> & {
    label?: string;
    linearHex?: boolean;
    isLinearMode?: boolean;
};
/**
 * Component which displays the passed in color's HEX value, either in linearSpace (if linearHex is true) or in gamma space
 * When the hex color is changed by user, component calculates the new Color3/4 value and calls onChange
 *
 * Component uses the isLinearMode boolean to display an informative label regarding linear / gamma space
 * @param props - The properties for the InputHexField component.
 * @returns
 */
export const InputHexField: FunctionComponent<InputHexProps>;
type InputHsvFieldProps = {
    color: Color3 | Color4;
    label: string;
    hsvKey: HsvKey;
    onChange: (color: Color3 | Color4) => void;
    max: number;
    scale?: number;
};
/**
 * In the HSV (Hue, Saturation, Value) color model, Hue (H) ranges from 0 to 360 degrees, representing the color's position on the color wheel.
 * Saturation (S) ranges from 0 to 100%, indicating the intensity or purity of the color, with 0 being shades of gray and 100 being a fully saturated color.
 * Value (V) ranges from 0 to 100%, representing the brightness of the color, with 0 being black and 100 being the brightest.
 * @param props - The properties for the InputHsvField component.
 */
export const InputHsvField: FunctionComponent<InputHsvFieldProps>;
export {};

}
declare module "babylonjs-node-editor/fluent/primitives/checkbox" {
import { FunctionComponent } from "react";
import { PrimitiveProps } from "babylonjs-node-editor/fluent/primitives/primitive";
/**
 * This is a primitive fluent checkbox that can both read and write checked state
 * @param props
 * @returns Checkbox component
 */
export const Checkbox: FunctionComponent<PrimitiveProps<boolean>>;

}
declare module "babylonjs-node-editor/fluent/primitives/button" {
import { FunctionComponent } from "react";

export type ButtonProps = {
    onClick: () => void;
    icon?: any;
    label: string;
    disabled?: boolean;
};
export const Button: FunctionComponent<ButtonProps>;

}
declare module "babylonjs-node-editor/fluent/primitives/accordion" {
import { FunctionComponent, PropsWithChildren } from "react";
export type AccordionSectionProps = {
    title: string;
    collapseByDefault?: boolean;
};
export const AccordionSection: FunctionComponent<PropsWithChildren<AccordionSectionProps>>;
export const Accordion: FunctionComponent<PropsWithChildren>;

}
declare module "babylonjs-node-editor/fluent/hoc/pane" {

import { FunctionComponent, PropsWithChildren } from "react";
export type PaneProps = {
    title: string;
    icon?: any;
};
export const Pane: FunctionComponent<PropsWithChildren<PaneProps>>;

}
declare module "babylonjs-node-editor/fluent/hoc/gradientList" {
import { FunctionComponent } from "react";
import { Color3Gradient, ColorGradient as Color4Gradient, FactorGradient } from "babylonjs/Misc/gradients";
import { Nullable } from "babylonjs/types";
type GradientListProps<T extends FactorGradient | Color3Gradient | Color4Gradient> = {
    label: string;
    gradients: Nullable<Array<T>>;
    addGradient: (step?: T) => void;
    removeGradient: (step: T) => void;
    onChange: (newGradient: T) => void;
};
export const FactorGradientList: FunctionComponent<GradientListProps<FactorGradient>>;
export const Color3GradientList: FunctionComponent<GradientListProps<Color3Gradient>>;
export const Color4GradientList: FunctionComponent<GradientListProps<Color4Gradient>>;
export {};

}
declare module "babylonjs-node-editor/fluent/hoc/fluentToolWrapper" {
import { PropsWithChildren, FunctionComponent } from "react";

export type ToolHostProps = {
    /**
     * Allows host to pass in a theme
     */
    customTheme?: any;
    /**
     * Can be set to true to disable the copy button in the tool's property lines. Default is false (copy enabled)
     */
    disableCopy?: boolean;
    /**
     * Name of the tool displayed in the UX
     */
    toolName: string;
};
export const ToolContext: import("react").Context<{
    readonly useFluent: boolean;
    readonly disableCopy: boolean;
    readonly toolName: string;
}>;
/**
 * For tools which are ready to move over the fluent, wrap the root of the tool (or the panel which you want fluentized) with this component
 * Today we will only enable fluent if the URL has the `newUX` query parameter is truthy
 * @param props
 * @returns
 */
export const FluentToolWrapper: FunctionComponent<PropsWithChildren<ToolHostProps>>;

}
declare module "babylonjs-node-editor/fluent/hoc/fileUploadLine" {
import { FunctionComponent } from "react";
import { ButtonProps } from "babylonjs-node-editor/fluent/primitives/button";
type FileUploadLineProps = Omit<ButtonProps, "onClick"> & {
    onClick: (files: FileList) => void;
    accept: string;
};
export const FileUploadLine: FunctionComponent<FileUploadLineProps>;
export {};

}
declare module "babylonjs-node-editor/fluent/hoc/buttonLine" {
import { FunctionComponent } from "react";
import { ButtonProps } from "babylonjs-node-editor/fluent/primitives/button";
/**
 * Wraps a button with a label in a line container
 * @param props Button props plus a label
 * @returns A button inside a line
 */
export const ButtonLine: FunctionComponent<ButtonProps>;

}
declare module "babylonjs-node-editor/fluent/hoc/propertyLines/vectorPropertyLine" {
import { FunctionComponent } from "react";
import { PrimitiveProps } from "babylonjs-node-editor/fluent/primitives/primitive";
import { PropertyLineProps } from "babylonjs-node-editor/fluent/hoc/propertyLines/propertyLine";
import { Vector3 } from "babylonjs/Maths/math.vector";
import { Quaternion, Vector2, Vector4 } from "babylonjs/Maths/math.vector";
export type TensorPropertyLineProps<V extends Vector2 | Vector3 | Vector4 | Quaternion> = PropertyLineProps<V> & PrimitiveProps<V> & {
    /**
     * If passed, all sliders will use this for the min value
     */
    min?: number;
    /**
     * If passed, all sliders will use this for the max value
     */
    max?: number;
    /**
     * If passed, the UX will use the conversion functions to display/update values
     */
    valueConverter?: {
        /**
         * Will call from(val) before displaying in the UX
         */
        from: (val: number) => number;
        /**
         * Will call to(val) before calling onChange
         */
        to: (val: number) => number;
    };
};
type RotationVectorPropertyLineProps = TensorPropertyLineProps<Vector3> & {
    /**
     * Display angles as degrees instead of radians
     */
    useDegrees?: boolean;
};
export const RotationVectorPropertyLine: FunctionComponent<RotationVectorPropertyLineProps>;
type QuaternionPropertyLineProps = TensorPropertyLineProps<Quaternion> & {
    /**
     * Display angles as degrees instead of radians
     */
    useDegrees?: boolean;
};
export const QuaternionPropertyLine: FunctionComponent<QuaternionPropertyLineProps>;
export const Vector2PropertyLine: FunctionComponent<TensorPropertyLineProps<Vector2>>;
export const Vector3PropertyLine: FunctionComponent<TensorPropertyLineProps<Vector3>>;
export const Vector4PropertyLine: FunctionComponent<TensorPropertyLineProps<Vector4>>;
export {};

}
declare module "babylonjs-node-editor/fluent/hoc/propertyLines/textPropertyLine" {
import { ImmutablePrimitiveProps } from "babylonjs-node-editor/fluent/primitives/primitive";
import { PropertyLineProps } from "babylonjs-node-editor/fluent/hoc/propertyLines/propertyLine";
import { FunctionComponent } from "react";
/**
 * Wraps text in a property line
 * @param props - PropertyLineProps and TextProps
 * @returns property-line wrapped text
 */
export const TextPropertyLine: FunctionComponent<PropertyLineProps<string> & ImmutablePrimitiveProps<string>>;

}
declare module "babylonjs-node-editor/fluent/hoc/propertyLines/textAreaPropertyLine" {
import { PropertyLineProps } from "babylonjs-node-editor/fluent/hoc/propertyLines/propertyLine";
import { FunctionComponent } from "react";
import { TextareaProps } from "babylonjs-node-editor/fluent/primitives/textarea";
/**
 * Wraps textarea in a property line
 * @param props - PropertyLineProps and TextProps
 * @returns property-line wrapped text
 */
export const TextAreaPropertyLine: FunctionComponent<PropertyLineProps<string> & TextareaProps>;

}
declare module "babylonjs-node-editor/fluent/hoc/propertyLines/syncedSliderPropertyLine" {
import { PropertyLineProps } from "babylonjs-node-editor/fluent/hoc/propertyLines/propertyLine";
import { SyncedSliderProps } from "babylonjs-node-editor/fluent/primitives/syncedSlider";
type SyncedSliderPropertyProps = SyncedSliderProps & PropertyLineProps<number>;
/**
 * Renders a simple wrapper around the SyncedSliderInput
 * @param props
 * @returns
 */

export {};

}
declare module "babylonjs-node-editor/fluent/hoc/propertyLines/switchPropertyLine" {
import { PropertyLineProps } from "babylonjs-node-editor/fluent/hoc/propertyLines/propertyLine";
import { FunctionComponent } from "react";
import { SwitchProps } from "babylonjs-node-editor/fluent/primitives/switch";
/**
 * Wraps a switch in a property line
 * @param props - The properties for the switch and property line
 * @returns A React element representing the property line with a switch
 */
export const SwitchPropertyLine: FunctionComponent<PropertyLineProps<boolean> & SwitchProps>;

}
declare module "babylonjs-node-editor/fluent/hoc/propertyLines/stringifiedPropertyLine" {
import { ImmutablePrimitiveProps } from "babylonjs-node-editor/fluent/primitives/primitive";
import { PropertyLineProps } from "babylonjs-node-editor/fluent/hoc/propertyLines/propertyLine";
import { FunctionComponent } from "react";
type StringifiedPropertyLineProps = PropertyLineProps<number> & ImmutablePrimitiveProps<number> & {
    precision?: number;
    units?: string;
};
/**
 * Expects a numerical value and converts it toFixed(if precision is supplied) or toLocaleString
 * Can pass optional units to be appending to the end of the string
 * @param props
 * @returns
 */
export const StringifiedPropertyLine: FunctionComponent<StringifiedPropertyLineProps>;
export {};

}
declare module "babylonjs-node-editor/fluent/hoc/propertyLines/spinButtonPropertyLine" {
import { PropertyLineProps } from "babylonjs-node-editor/fluent/hoc/propertyLines/propertyLine";
import { FunctionComponent } from "react";
import { SpinButtonProps } from "babylonjs-node-editor/fluent/primitives/spinButton";
export const SpinButtonPropertyLine: FunctionComponent<PropertyLineProps<number> & SpinButtonProps>;

}
declare module "babylonjs-node-editor/fluent/hoc/propertyLines/propertyLine" {
import { FunctionComponent, HTMLProps, PropsWithChildren } from "react";
import { PrimitiveProps } from "babylonjs-node-editor/fluent/primitives/primitive";
type BasePropertyLineProps = {
    /**
     * The name of the property to display in the property line.
     */
    label: string;
    /**
     * Optional description for the property, shown on hover of the info icon
     */
    description?: string;
    /**
     * Optional function returning a string to copy to clipboard.
     */
    onCopy?: () => string;
    /**
     * Link to the documentation for this property, available from the info icon either linked from the description (if provided) or default 'docs' text
     */
    docLink?: string;
};
type NullableProperty<ValueT> = {
    nullable: true;
    value: ValueT;
    onChange: (value: ValueT) => void;
    defaultValue?: ValueT;
};
type NonNullableProperty = {
    nullable?: false;
};
type ExpandableProperty = {
    /**
     * If supplied, an 'expand' icon will be shown which, when clicked, renders this component within the property line.
     */
    expandedContent: JSX.Element;
    /**
     * If true, the expanded content will be shown by default.
     */
    expandByDefault?: boolean;
};
type NonExpandableProperty = {
    expandedContent?: undefined;
};
export type PropertyLineProps<ValueT> = BasePropertyLineProps & (NullableProperty<ValueT> | NonNullableProperty) & (ExpandableProperty | NonExpandableProperty);
/**
 * A reusable component that renders a property line with a label and child content, and an optional description, copy button, and expandable section.
 *
 * @param props - The properties for the PropertyLine component.
 * @returns A React element representing the property line.
 *
 */


export const PlaceholderPropertyLine: FunctionComponent<PrimitiveProps<any> & PropertyLineProps<any>>;
export {};

}
declare module "babylonjs-node-editor/fluent/hoc/propertyLines/linkPropertyLine" {
import { ImmutablePrimitiveProps } from "babylonjs-node-editor/fluent/primitives/primitive";
import { PropertyLineProps } from "babylonjs-node-editor/fluent/hoc/propertyLines/propertyLine";
import { FunctionComponent } from "react";
type LinkProps = ImmutablePrimitiveProps<string> & {
    onLink?: () => void;
    url?: string;
};
/**
 * Wraps a link in a property line
 * @param props - PropertyLineProps and LinkProps
 * @returns property-line wrapped link
 */
export const LinkPropertyLine: FunctionComponent<PropertyLineProps<string> & LinkProps>;
export {};

}
declare module "babylonjs-node-editor/fluent/hoc/propertyLines/inputPropertyLine" {
import { PropertyLineProps } from "babylonjs-node-editor/fluent/hoc/propertyLines/propertyLine";
import { FunctionComponent } from "react";
import { InputProps } from "babylonjs-node-editor/fluent/primitives/input";
/**
 * Wraps a text input in a property line
 * @param props - PropertyLineProps and InputProps
 * @returns property-line wrapped input component
 */
export const TextInputPropertyLine: FunctionComponent<InputProps<string> & PropertyLineProps<string>>;
/**
 * Wraps a number input in a property line
 * @param props - PropertyLineProps and InputProps
 * @returns property-line wrapped input component
 */
export const NumberInputPropertyLine: FunctionComponent<InputProps<number> & PropertyLineProps<number>>;

}
declare module "babylonjs-node-editor/fluent/hoc/propertyLines/hexPropertyLine" {
import { PropertyLineProps } from "babylonjs-node-editor/fluent/hoc/propertyLines/propertyLine";
import { FunctionComponent } from "react";
import { InputHexProps } from "babylonjs-node-editor/fluent/primitives/colorPicker";
import { Color3, Color4 } from "babylonjs/Maths/math.color";
/**
 * Wraps a hex input in a property line
 * @param props - PropertyLineProps and InputHexProps
 * @returns property-line wrapped input hex component
 */
export const HexPropertyLine: FunctionComponent<InputHexProps & PropertyLineProps<Color3 | Color4>>;

}
declare module "babylonjs-node-editor/fluent/hoc/propertyLines/dropdownPropertyLine" {
import { AcceptedDropdownValue, DropdownProps } from "babylonjs-node-editor/fluent/primitives/dropdown";
import { PropertyLineProps } from "babylonjs-node-editor/fluent/hoc/propertyLines/propertyLine";
import { FunctionComponent } from "react";
type DropdownPropertyLineProps<V extends AcceptedDropdownValue> = Omit<DropdownProps<V>, "includeNullAs"> & PropertyLineProps<AcceptedDropdownValue>;
/**
 * Dropdown component for number values.
 */
export const NumberDropdownPropertyLine: FunctionComponent<DropdownPropertyLineProps<number>>;
/**
 * Dropdown component for string values
 */
export const StringDropdownPropertyLine: FunctionComponent<DropdownPropertyLineProps<string>>;
export {};

}
declare module "babylonjs-node-editor/fluent/hoc/propertyLines/colorPropertyLine" {
import { FunctionComponent } from "react";
import { PropertyLineProps } from "babylonjs-node-editor/fluent/hoc/propertyLines/propertyLine";
import { Color3 } from "babylonjs/Maths/math.color";
import { Color4 } from "babylonjs/Maths/math.color";
import { ColorPickerProps } from "babylonjs-node-editor/fluent/primitives/colorPicker";
export type ColorPropertyLineProps = ColorPickerProps<Color3 | Color4> & PropertyLineProps<Color3 | Color4>;
export const Color3PropertyLine: FunctionComponent<ColorPickerProps<Color3> & PropertyLineProps<Color3>>;
export const Color4PropertyLine: FunctionComponent<ColorPickerProps<Color4> & PropertyLineProps<Color4>>;

}
declare module "babylonjs-node-editor/fluent/hoc/propertyLines/checkboxPropertyLine" {
import { PrimitiveProps } from "babylonjs-node-editor/fluent/primitives/primitive";
import { PropertyLineProps } from "babylonjs-node-editor/fluent/hoc/propertyLines/propertyLine";
import { FunctionComponent } from "react";
/**
 * Wraps a checkbox in a property line
 * @param props - PropertyLineProps and CheckboxProps
 * @returns property-line wrapped checkbox
 */
export const CheckboxPropertyLine: FunctionComponent<PropertyLineProps<boolean> & PrimitiveProps<boolean>>;

}
declare module "babylonjs-node-editor/fluent/hoc/propertyLines/booleanBadgePropertyLine" {
import { FunctionComponent } from "react";
import { ImmutablePrimitiveProps } from "babylonjs-node-editor/fluent/primitives/primitive";
import { PropertyLineProps } from "babylonjs-node-editor/fluent/hoc/propertyLines/propertyLine";
/**
 * Displays an icon indicating enabled (green check) or disabled (red cross) state
 * @param props - The properties for the PropertyLine, including the boolean value to display.
 * @returns A PropertyLine component with a PresenceBadge indicating the boolean state.
 */
export const BooleanBadgePropertyLine: FunctionComponent<PropertyLineProps<boolean> & ImmutablePrimitiveProps<boolean>>;

}
declare module "babylonjs-node-editor/components/propertyTabComponentBase" {
import { FunctionComponent, PropsWithChildren } from "react";
/**
 * A wrapper component for the property tab that provides a consistent layout and styling.
 * It uses a Pane and an Accordion to organize the content, so its direct children
 * must have 'title' props to be compatible with the Accordion structure.
 * @param props The props to pass to the component.
 * @returns The rendered component.
 */
export const PropertyTabComponentBase: FunctionComponent<PropsWithChildren>;

}
declare module "babylonjs-node-editor/components/classNames" {
export function ClassNames(names: any, styleObject: any): string;
export function JoinClassNames(styleObject: any, ...names: string[]): string;

}
declare module "babylonjs-node-editor/components/Toggle" {
export type ToggleProps = {
    toggled: "on" | "mixed" | "off";
    onToggle?: () => void;
    padded?: boolean;
    color?: "dark" | "light";
};
export const Toggle: React.FC<ToggleProps>;

}
declare module "babylonjs-node-editor/components/TextInputWithSubmit" {
export interface ITextInputProps {
    label?: string;
    placeholder?: string;
    submitValue: (newValue: string) => void;
    validateValue?: (value: string) => boolean;
    cancelSubmit?: () => void;
}
/**
 * This component represents a text input that can be submitted or cancelled on buttons
 * @param props properties
 * @returns TextInputWithSubmit element
 */


}
declare module "babylonjs-node-editor/components/MessageDialog" {
import * as React from "react";
export interface MessageDialogProps {
    message: string;
    isError: boolean;
    onClose?: () => void;
}
export const MessageDialog: React.FC<MessageDialogProps>;

}
declare module "babylonjs-node-editor/components/Label" {
import { ReactChild } from "react";
export type LabelProps = {
    text: string;
    children?: ReactChild;
    color?: "dark" | "light";
};
export const Label: React.FC<LabelProps>;

}
declare module "babylonjs-node-editor/components/Icon" {
export type IconProps = {
    color?: "dark" | "light";
    icon: string;
};
export const Icon: React.FC<IconProps>;

}
declare module "babylonjs-node-editor/components/Button" {
import { PropsWithChildren } from "react";
export type ButtonComponentProps = {
    disabled?: boolean;
    active?: boolean;
    onClick?: () => void;
    color: "light" | "dark";
    size: "default" | "small" | "wide" | "smaller";
    title?: string;
    backgroundColor?: string;
};
export const ButtonComponent: React.FC<PropsWithChildren<ButtonComponentProps>>;

}
declare module "babylonjs-node-editor/components/reactGraphSystem/useGraphContext" {
/**
 * utility hook to assist using the graph context
 * @returns
 */
export const useGraphContext: () => import("babylonjs-node-editor/components/reactGraphSystem/GraphContextManager").IGraphContext;

}
declare module "babylonjs-node-editor/components/reactGraphSystem/NodeRenderer" {
import { ComponentType, PropsWithChildren } from "react";
import { Nullable } from "babylonjs/types";
export type IVisualRecordsType = Record<string, {
    x: number;
    y: number;
}>;
export type IConnectionType = {
    id: string;
    sourceId: string;
    targetId: string;
};
export type ICustomDataType = {
    type: string;
    value: any;
};
export type INodeType = {
    id: string;
    label: string;
    customData?: ICustomDataType;
};
/**
 * props for the node renderer
 */
export interface INodeRendererProps {
    /**
     * array of connections between nodes
     */
    connections: IConnectionType[];
    /**
     * function called when a new connection is created
     */
    updateConnections: (sourceId: string, targetId: string) => void;
    /**
     * function called when a connection is deleted
     */
    deleteLine: (lineId: string) => void;
    /**
     * function called when a node is deleted
     */
    deleteNode: (nodeId: string) => void;
    /**
     * array of all nodes
     */
    nodes: INodeType[];
    /**
     * id of the node to highlight
     */
    highlightedNode?: Nullable<string>;
    /**
     * function to be called if a node is selected
     */
    selectNode?: (nodeId: Nullable<string>) => void;
    /**
     * id of this renderer
     */
    id: string;
    /**
     * optional list of custom components to be rendered inside nodes of
     * a certain type
     */
    customComponents?: Record<string, ComponentType<any>>;
}
/**
 * This component is a bridge between the app logic related to the graph, and the actual rendering
 * of it. It manages the nodes' positions and selection states.
 * @param props
 * @returns
 */


}
declare module "babylonjs-node-editor/components/reactGraphSystem/GraphNodesContainer" {
import { FC, PropsWithChildren } from "react";
export interface IGraphContainerProps {
    onNodeMoved: (id: string, x: number, y: number) => void;
    id: string;
}
/**
 * This component contains all the nodes and handles their dragging
 * @param props properties
 * @returns graph node container element
 */
export const GraphNodesContainer: FC<PropsWithChildren<IGraphContainerProps>>;

}
declare module "babylonjs-node-editor/components/reactGraphSystem/GraphNode" {
import { FC, PropsWithChildren } from "react";
export interface IGraphNodeProps {
    id: string;
    name: string;
    x: number;
    y: number;
    selected?: boolean;
    width?: number;
    height?: number;
    highlighted?: boolean;
    parentContainerId: string;
}
export const SingleGraphNode: FC<PropsWithChildren<IGraphNodeProps>>;

}
declare module "babylonjs-node-editor/components/reactGraphSystem/GraphLinesContainer" {
import { FC, PropsWithChildren } from "react";
/**
 * props for the GraphLineContainer
 */
export interface IGraphLinesContainerProps {
    /**
     * id of the container
     */
    id: string;
}
/**
 * this component handles the dragging of new connections
 * @param props
 * @returns
 */
export const GraphLinesContainer: FC<PropsWithChildren<IGraphLinesContainerProps>>;

}
declare module "babylonjs-node-editor/components/reactGraphSystem/GraphLine" {
import { FC } from "react";
/**
 * props for the GraphLine component
 */
export interface IGraphLineProps {
    /**
     * id of the line. temporary lines can have no id
     */
    id?: string;
    /**
     * starting x pos of the line
     */
    x1: number;
    /**
     * ending x pos of the line
     */
    x2: number;
    /**
     * starting y pos of the line
     */
    y1: number;
    /**
     * ending y pos of the line
     */
    y2: number;
    /**
     * is the line selected
     */
    selected?: boolean;
    /**
     * does the line have a direction
     */
    directional?: boolean;
}
export const MarkerArrowId = "arrow";
/**
 * This component draws a SVG line between two points, with an optional marker
 * indicating direction
 * @param props properties
 * @returns graph line element
 */
export const GraphLine: FC<IGraphLineProps>;

}
declare module "babylonjs-node-editor/components/reactGraphSystem/GraphContextManager" {
/**
 * this context is used to pass callbacks to the graph nodes and connections
 */
export interface IGraphContext {
    onNodesConnected?: (sourceId: string, targetId: string) => void;
    onLineSelected?: (lineId: string) => void;
    onNodeSelected?: (nodeId: string) => void;
}
export const GraphContextManager: import("react").Context<IGraphContext>;

}
declare module "babylonjs-node-editor/components/reactGraphSystem/GraphContainer" {
import { FC, PropsWithChildren } from "react";
export interface IGraphContainerProps {
}
/**
 * This component is just a simple container to keep the nodes and lines containers
 * together
 * @param props
 * @returns
 */
export const GraphContainer: FC<PropsWithChildren<IGraphContainerProps>>;

}
declare module "babylonjs-node-editor/components/reactGraphSystem/GraphConnectorHandle" {
import { FC, PropsWithChildren } from "react";
/**
 * Props for the connector
 */
export interface IGraphConnectorHandlerProps {
    /**
     * id of the parent node
     */
    parentId: string;
    /**
     * x position of the parent node
     */
    parentX: number;
    /**
     * y position of the parent node
     */
    parentY: number;
    /**
     * x position of the connector relative to the parent node
     */
    offsetX?: number;
    /**
     * y position of the connector relative to the parent node
     */
    offsetY?: number;
    /**
     * width of the parent node
     */
    parentWidth: number;
    /**
     * height of the parent node
     */
    parentHeight: number;
    /**
     * id of the container where its parent node is
     */
    parentContainerId: string;
}
/**
 * This component is used to initiate a connection between two nodes. Simply
 * drag the handle in a node and drop it in another node to create a connection.
 * @returns connector element
 */
export const GraphConnectorHandler: FC<PropsWithChildren<IGraphConnectorHandlerProps>>;

}
declare module "babylonjs-node-editor/components/lines/OptionsLineComponent" {
/**
 * This components represents an options menu with optional
 * customizable properties. Option IDs should be unique.
 */
export interface IOption {
    label: string;
    value: string;
    id: string;
}
export interface IOptionsLineComponentProps {
    options: IOption[];
    addOptionPlaceholder?: string;
    onOptionAdded?: (newOption: IOption) => void;
    onOptionSelected: (selectedOptionValue: string) => void;
    selectedOptionValue: string;
    validateNewOptionValue?: (newOptionValue: string) => boolean;
    addOptionText?: string;
}


}
declare module "babylonjs-node-editor/components/lines/NumericInputComponent" {
import * as React from "react";
import { LockObject } from "babylonjs-node-editor/tabs/propertyGrids/lockObject";
interface INumericInputComponentProps {
    label: string;
    labelTooltip?: string;
    value: number;
    step?: number;
    onChange: (value: number) => void;
    precision?: number;
    icon?: string;
    iconLabel?: string;
    lockObject: LockObject;
}
export class NumericInputComponent extends React.Component<INumericInputComponentProps, {
    value: string;
}> {
    static defaultProps: {
        step: number;
    };
    private _localChange;
    constructor(props: INumericInputComponentProps);
    componentWillUnmount(): void;
    shouldComponentUpdate(nextProps: INumericInputComponentProps, nextState: {
        value: string;
    }): boolean;
    updateValue(valueString: string): void;
    onBlur(): void;
    incrementValue(amount: number): void;
    onKeyDown(evt: React.KeyboardEvent<HTMLInputElement>): void;

}
export {};

}
declare module "babylonjs-node-editor/components/lines/FileButtonLineComponent" {
import * as React from "react";
export interface IFileButtonLineComponentProps {
    label: string;
    onClick: (file: File) => void;
    accept: string;
    icon?: string;
    iconLabel?: string;
}
export class FileButtonLineComponent extends React.Component<IFileButtonLineComponentProps> {
    private static _IdGenerator;
    private _id;
    private _uploadInputRef;
    constructor(props: IFileButtonLineComponentProps);
    onChange(evt: any): void;

}

}
declare module "babylonjs-node-editor/components/lines/ColorPickerLineComponent" {
import * as React from "react";
import { Color4, Color3 } from "babylonjs/Maths/math.color";
import { LockObject } from "babylonjs-node-editor/tabs/propertyGrids/lockObject";
export interface IColorPickerLineComponentProps {
    value: Color4 | Color3;
    linearHint?: boolean;
    onColorChanged: (newOne: string) => void;
    icon?: string;
    iconLabel?: string;
    shouldPopRight?: boolean;
    lockObject?: LockObject;
    backgroundColor?: string;
}
interface IColorPickerComponentState {
    pickerEnabled: boolean;
    color: Color3 | Color4;
    hex: string;
}
export class ColorPickerLineComponent extends React.Component<IColorPickerLineComponentProps, IColorPickerComponentState> {
    private _floatRef;
    private _floatHostRef;
    private _coverRef;
    constructor(props: IColorPickerLineComponentProps);
    syncPositions(): void;
    shouldComponentUpdate(nextProps: IColorPickerLineComponentProps, nextState: IColorPickerComponentState): boolean;
    getHexString(props?: Readonly<IColorPickerLineComponentProps>): string;
    componentDidUpdate(): void;
    componentDidMount(): void;

}
export {};

}
declare module "babylonjs-node-editor/components/layout/utils" {
import { Layout, LayoutColumn, LayoutTabsRow } from "babylonjs-node-editor/components/layout/types";
/**
 * Given a column and row number in the layout, return the corresponding column/row
 * @param layout
 * @param column
 * @param row
 * @returns
 */
export const getPosInLayout: (layout: Layout, column: number, row?: number) => LayoutColumn | LayoutTabsRow;
/**
 * Remove a row in position row, column from the layout, and redistribute heights of remaining rows
 * @param layout
 * @param column
 * @param row
 */
export const removeLayoutRowAndRedistributePercentages: (layout: Layout, column: number, row: number) => void;
/**
 * Add a percentage string to a number
 * @param p1 the percentage string
 * @param p2 the number
 * @returns the sum of the percentage string and the number
 */
export const addPercentageStringToNumber: (p1: string, p2: number) => number;
/**
 * Parses a percentage string into a number
 * @param p the percentage string
 * @returns the parsed number
 */
export const parsePercentage: (p: string) => number;

}
declare module "babylonjs-node-editor/components/layout/types" {
import { ReactElement } from "react";
export type LayoutTab = {
    /**
     * Tab id
     */
    id: string;
    /**
     * React component rendered by tab
     */
    component: ReactElement;
    /**
     * Tab title
     */
    title: string;
};
export type LayoutTabsRow = {
    /**
     * row id
     */
    id: string;
    /**
     * row height in its containing column
     */
    height: string;
    /**
     * selected tab in row
     */
    selectedTab: string;
    /**
     * list of tabs contained in row
     */
    tabs: LayoutTab[];
};
export type LayoutColumn = {
    /**
     * column id
     */
    id: string;
    /**
     * column width in the grid
     */
    width: string;
    /**
     * column rows
     */
    rows: LayoutTabsRow[];
};
export type Layout = {
    /**
     * layout columns
     */
    columns?: LayoutColumn[];
};
export type TabDrag = {
    /**
     * row number of the tab being dragged
     */
    rowNumber: number;
    /**
     * column number of the tab being dragged
     */
    columnNumber: number;
    /**
     * the tabs being dragged
     */
    tabs: {
        /**
         * id of tab being dragged
         */
        id: string;
    }[];
};
export enum ElementTypes {
    RESIZE_BAR = "0",
    TAB = "1",
    TAB_GROUP = "2",
    NONE = "2"
}
export enum ResizeDirections {
    ROW = "row",
    COLUMN = "column"
}

}
declare module "babylonjs-node-editor/components/layout/LayoutContext" {
import { Layout } from "babylonjs-node-editor/components/layout/types";
export const LayoutContext: import("react").Context<{
    /**
     * The layout object
     */
    layout: Layout;
    /**
     * Function to set the layout object in the context
     */
    setLayout: (layout: Layout) => void;
}>;

}
declare module "babylonjs-node-editor/components/layout/FlexibleTabsContainer" {
import { FC } from "react";
import { LayoutTab } from "babylonjs-node-editor/components/layout/types";
/**
 * Arguments for the TabsContainer component.
 */
export interface IFlexibleTabsContainerProps {
    /**
     * The tabs to display
     */
    tabs: LayoutTab[];
    /**
     * Row index of component in layout
     */
    rowIndex: number;
    /**
     * Column index of component in layout
     */
    columnIndex: number;
    /**
     * Which tab is selected in the layout
     */
    selectedTab?: string;
}
/**
 * This component contains a set of tabs of which only one is visible at a time.
 * The tabs can also be dragged from and to different containers.
 * @param props properties
 * @returns tabs container element
 */
export const FlexibleTabsContainer: FC<IFlexibleTabsContainerProps>;

}
declare module "babylonjs-node-editor/components/layout/FlexibleTab" {
import { FC } from "react";
import { TabDrag } from "babylonjs-node-editor/components/layout/types";
/**
 * Arguments for the FlexibleTab component.
 */
export interface IFlexibleTabProps {
    /**
     * The tab's title.
     */
    title: string;
    /**
     * If the tab is currently selected or not
     */
    selected: boolean;
    /**
     * What happens when the user clicks on the tab
     */
    onClick: () => void;
    /**
     * The object that will be sent to the drag event
     */
    item: TabDrag;
    /**
     * What happens when the user drops another tab after this one
     */
    onTabDroppedAction: (item: TabDrag) => void;
}
/**
 * A component that renders a tab that the user can click
 * to activate or drag to reorder. It also listens for
 * drop events if the user wants to drop another tab
 * after it.
 * @param props properties
 * @returns FlexibleTab element
 */
export const FlexibleTab: FC<IFlexibleTabProps>;

}
declare module "babylonjs-node-editor/components/layout/FlexibleResizeBar" {
import { FC } from "react";
import { ResizeDirections } from "babylonjs-node-editor/components/layout/types";
/**
 * Arguments for the ResizeBar component.
 */
export interface IFlexibleRowResizerProps {
    /**
     * Row number of the component that is being resized
     */
    rowNumber: number;
    /**
     * Column number of the component being resized
     */
    columnNumber: number;
    /**
     * If the resizing happens in row or column direction
     */
    direction: ResizeDirections;
}
/**
 * The item that will be sent to the drag event
 */
export type ResizeItem = {
    /**
     * If the resizing happens in row or column direction
     */
    direction: ResizeDirections;
    /**
     * The row number of the component that is being resized
     */
    rowNumber: number;
    /**
     * the column number of the component being resized
     */
    columnNumber: number;
};
/**
 * A component that renders a bar that the user can drag to resize.
 * @param props properties
 * @returns resize bar element
 */
export const FlexibleResizeBar: FC<IFlexibleRowResizerProps>;

}
declare module "babylonjs-node-editor/components/layout/FlexibleGridLayout" {
import { FC } from "react";
import { Layout } from "babylonjs-node-editor/components/layout/types";
/**
 * Arguments for the Layout component.
 */
export interface IFlexibleGridLayoutProps {
    /**
     * A definition of the layout which can be changed by the user
     */
    layoutDefinition: Layout;
}
/**
 * This component represents a grid layout that can be resized and rearranged
 * by the user.
 * @param props properties
 * @returns layout element
 */
export const FlexibleGridLayout: FC<IFlexibleGridLayoutProps>;

}
declare module "babylonjs-node-editor/components/layout/FlexibleGridContainer" {
import { FC } from "react";
/**
 * Arguments for the GridContainer component.
 */
export interface IFlexibleGridContainerProps {
}
/**
 * Component responsible for mapping the layout to the actual components
 * @returns GridContainer element
 */
export const FlexibleGridContainer: FC<IFlexibleGridContainerProps>;

}
declare module "babylonjs-node-editor/components/layout/FlexibleDropZone" {
import { FC, PropsWithChildren } from "react";
/**
 * Arguments for the FlexibleDropZone component.
 */
export interface IFlexibleDropZoneProps {
    /**
     * The row number of the component in the layout
     */
    rowNumber: number;
    /**
     * The column number of the component in the layout
     */
    columnNumber: number;
}
/**
 * This component contains the drag and drop zone for the resize bars that
 * allow redefining width and height of layout elements
 * @param props properties
 * @returns drop zone element
 */
export const FlexibleDropZone: FC<PropsWithChildren<IFlexibleDropZoneProps>>;

}
declare module "babylonjs-node-editor/components/layout/FlexibleDragHandler" {
import { FC, PropsWithChildren } from "react";
/**
 * Arguments for the DragHandler component.
 */
export interface IFlexibleDragHandlerProps {
    /**
     * The size of the containing element. Used to calculate the percentage of
     * space occupied by the component
     */
    containerSize: {
        width: number;
        height: number;
    };
}
/**
 * This component receives the drop events and updates the layout accordingly
 * @param props properties
 * @returns DragHandler element
 */
export const FlexibleDragHandler: FC<PropsWithChildren<IFlexibleDragHandlerProps>>;

}
declare module "babylonjs-node-editor/components/layout/FlexibleColumn" {
import { FC, PropsWithChildren } from "react";
/**
 * Arguments for the Column component.
 */
export interface IFlexibleColumnProps {
    /**
     * Width of column
     */
    width: string;
}
/**
 * This component represents a single column in the layout. It receives a width
 * that it occupies and the content to display
 * @param props
 * @returns
 */
export const FlexibleColumn: FC<PropsWithChildren<IFlexibleColumnProps>>;

}
declare module "babylonjs-node-editor/components/layout/DraggableIcon" {
import { FC } from "react";
import { ElementTypes, TabDrag } from "babylonjs-node-editor/components/layout/types";
/**
 * Arguments for the DraggableIcon component.
 */
export interface IDraggableIconProps {
    /**
     * Icon source
     */
    src: string;
    /**
     * Object that will be passed to the drag event
     */
    item: TabDrag;
    /**
     * Type of drag event
     */
    type: ElementTypes;
}
/**
 * An icon that can be dragged by the user
 * @param props properties
 * @returns draggable icon element
 */
export const DraggableIcon: FC<IDraggableIconProps>;

}
declare module "babylonjs-node-editor/components/colorPicker/HexColor" {
import * as React from "react";
import { LockObject } from "babylonjs-node-editor/tabs/propertyGrids/lockObject";
export interface IHexColorProps {
    value: string;
    expectedLength: number;
    onChange: (value: string) => void;
    lockObject: LockObject;
}
export class HexColorComponent extends React.Component<IHexColorProps, {
    hex: string;
}> {
    constructor(props: IHexColorProps);
    shouldComponentUpdate(nextProps: IHexColorProps, nextState: {
        hex: string;
    }): boolean;
    lock(): void;
    unlock(): void;
    updateHexValue(valueString: string): void;

}

}
declare module "babylonjs-node-editor/components/colorPicker/ColorPicker" {
import * as React from "react";
import { Color3, Color4 } from "babylonjs/Maths/math.color";
import { LockObject } from "babylonjs-node-editor/tabs/propertyGrids/lockObject";
/**
 * Interface used to specify creation options for color picker
 */
export interface IColorPickerComponentProps {
    color: Color3 | Color4;
    linearhint?: boolean;
    debugMode?: boolean;
    onColorChanged?: (color: Color3 | Color4) => void;
    lockObject: LockObject;
    backgroundColor?: string;
}
/**
 * Interface used to specify creation options for color picker
 */
export interface IColorPickerState {
    color: Color3;
    alpha: number;
}
/**
 * Class used to create a color picker
 */
export class ColorPickerComponent extends React.Component<IColorPickerComponentProps, IColorPickerState> {
    private _saturationRef;
    private _hueRef;
    private _isSaturationPointerDown;
    private _isHuePointerDown;
    constructor(props: IColorPickerComponentProps);
    shouldComponentUpdate(nextProps: IColorPickerComponentProps, nextState: IColorPickerState): boolean;
    onSaturationPointerDown(evt: React.PointerEvent<HTMLDivElement>): void;
    onSaturationPointerUp(evt: React.PointerEvent<HTMLDivElement>): void;
    onSaturationPointerMove(evt: React.PointerEvent<HTMLDivElement>): void;
    onHuePointerDown(evt: React.PointerEvent<HTMLDivElement>): void;
    onHuePointerUp(evt: React.PointerEvent<HTMLDivElement>): void;
    onHuePointerMove(evt: React.PointerEvent<HTMLDivElement>): void;
    private _evaluateSaturation;
    private _evaluateHue;
    componentDidUpdate(): void;
    raiseOnColorChanged(): void;

}

}
declare module "babylonjs-node-editor/components/colorPicker/ColorComponentEntry" {
import * as React from "react";
import { LockObject } from "babylonjs-node-editor/tabs/propertyGrids/lockObject";
export interface IColorComponentEntryProps {
    value: number;
    label: string;
    max?: number;
    min?: number;
    onChange: (value: number) => void;
    disabled?: boolean;
    lockObject: LockObject;
}
export class ColorComponentComponentEntry extends React.Component<IColorComponentEntryProps> {
    constructor(props: IColorComponentEntryProps);
    updateValue(valueString: string): void;
    lock(): void;
    unlock(): void;

}

}
declare module "babylonjs-node-editor/components/bars/CommandDropdownComponent" {
import * as React from "react";
interface ICommandDropdownComponentProps {
    icon?: string;
    tooltip: string;
    defaultValue?: string;
    items: {
        label: string;
        icon?: string;
        fileButton?: boolean;
        onClick?: () => void;
        onCheck?: (value: boolean) => void;
        storeKey?: string;
        isActive?: boolean;
        defaultValue?: boolean | string;
        subItems?: string[];
    }[];
    toRight?: boolean;
}
export class CommandDropdownComponent extends React.Component<ICommandDropdownComponentProps, {
    isExpanded: boolean;
    activeState: string;
}> {
    constructor(props: ICommandDropdownComponentProps);

}
export {};

}
declare module "babylonjs-node-editor/components/bars/CommandButtonComponent" {
import * as React from "react";
export interface ICommandButtonComponentProps {
    tooltip: string;
    shortcut?: string;
    icon: string;
    iconLabel?: string;
    isActive: boolean;
    onClick: () => void;
    disabled?: boolean;
}
export const CommandButtonComponent: React.FC<ICommandButtonComponentProps>;

}
declare module "babylonjs-node-editor/components/bars/CommandBarComponent" {
import { FC, PropsWithChildren } from "react";
export interface ICommandBarComponentProps {
    onSaveButtonClicked?: () => void;
    onSaveToSnippetButtonClicked?: () => void;
    onLoadFromSnippetButtonClicked?: () => void;
    onHelpButtonClicked?: () => void;
    onGiveFeedbackButtonClicked?: () => void;
    onSelectButtonClicked?: () => void;
    onPanButtonClicked?: () => void;
    onZoomButtonClicked?: () => void;
    onFitButtonClicked?: () => void;
    onArtboardColorChanged?: (newColor: string) => void;
    artboardColor?: string;
    artboardColorPickerColor?: string;
}
export const CommandBarComponent: FC<PropsWithChildren<ICommandBarComponentProps>>;

}
declare module "babylonjs-node-editor/colorPicker/hexColor" {
import * as React from "react";
import { LockObject } from "babylonjs-node-editor/tabs/propertyGrids/lockObject";
export interface IHexColorProps {
    value: string;
    expectedLength: number;
    onChange: (value: string) => void;
    lockObject: LockObject;
}
export class HexColor extends React.Component<IHexColorProps, {
    hex: string;
}> {
    constructor(props: IHexColorProps);
    shouldComponentUpdate(nextProps: IHexColorProps, nextState: {
        hex: string;
    }): boolean;
    lock(): void;
    unlock(): void;
    updateHexValue(valueString: string): void;

}

}
declare module "babylonjs-node-editor/colorPicker/colorPicker" {
import * as React from "react";
import { Color3, Color4 } from "babylonjs/Maths/math.color";
import { LockObject } from "babylonjs-node-editor/tabs/propertyGrids/lockObject";
import "babylonjs-node-editor/colorPicker/colorPicker.scss";
/**
 * Interface used to specify creation options for color picker
 */
export interface IColorPickerProps {
    color: Color3 | Color4;
    linearhint?: boolean;
    debugMode?: boolean;
    onColorChanged?: (color: Color3 | Color4) => void;
    lockObject: LockObject;
}
/**
 * Interface used to specify creation options for color picker
 */
export interface IColorPickerState {
    color: Color3;
    alpha: number;
}
/**
 * Class used to create a color picker
 */
export class ColorPicker extends React.Component<IColorPickerProps, IColorPickerState> {
    private _saturationRef;
    private _hueRef;
    private _isSaturationPointerDown;
    private _isHuePointerDown;
    constructor(props: IColorPickerProps);
    shouldComponentUpdate(nextProps: IColorPickerProps, nextState: IColorPickerState): boolean;
    onSaturationPointerDown(evt: React.PointerEvent<HTMLDivElement>): void;
    onSaturationPointerUp(evt: React.PointerEvent<HTMLDivElement>): void;
    onSaturationPointerMove(evt: React.PointerEvent<HTMLDivElement>): void;
    onHuePointerDown(evt: React.PointerEvent<HTMLDivElement>): void;
    onHuePointerUp(evt: React.PointerEvent<HTMLDivElement>): void;
    onHuePointerMove(evt: React.PointerEvent<HTMLDivElement>): void;
    private _evaluateSaturation;
    private _evaluateHue;
    componentDidUpdate(): void;
    raiseOnColorChanged(): void;

}

}
declare module "babylonjs-node-editor/colorPicker/colorComponentEntry" {
import * as React from "react";
import { LockObject } from "babylonjs-node-editor/tabs/propertyGrids/lockObject";
export interface IColorComponentEntryProps {
    value: number;
    label: string;
    max?: number;
    min?: number;
    onChange: (value: number) => void;
    disabled?: boolean;
    lockObject: LockObject;
}
export class ColorComponentEntry extends React.Component<IColorComponentEntryProps> {
    constructor(props: IColorComponentEntryProps);
    updateValue(valueString: string): void;
    lock(): void;
    unlock(): void;

}

}

declare module "babylonjs-node-editor" {
    export * from "babylonjs-node-editor/legacy/legacy";
}


declare module BABYLON.NodeEditor {
    export class SerializationTools {
        static UpdateLocations(material: BABYLON.NodeMaterial, globalState: GlobalState, frame?: BABYLON.Nullable<BABYLON.NodeEditor.SharedUIComponents.GraphFrame>): void;
        static Serialize(material: BABYLON.NodeMaterial, globalState: GlobalState, frame?: BABYLON.Nullable<BABYLON.NodeEditor.SharedUIComponents.GraphFrame>): string;
        static Deserialize(serializationObject: any, globalState: GlobalState): void;
        static AddFrameToMaterial(serializationObject: any, globalState: GlobalState, currentMaterial: BABYLON.NodeMaterial): void;
    }


    interface IPortalProps {
        globalState: GlobalState;
    }
    export class Portal extends React.Component<React.PropsWithChildren<IPortalProps>> {
        render(): React.ReactPortal;
    }


    /**
     * Interface used to specify creation options for the node editor
     */
    export interface INodeEditorOptions {
        nodeMaterial: BABYLON.NodeMaterial;
        hostElement?: HTMLElement;
        customSave?: {
            label: string;
            action: (data: string) => Promise<void>;
        };
        customLoadObservable?: BABYLON.Observable<any>;
        backgroundColor?: BABYLON.Color4;
    }
    /**
     * Class used to create a node editor
     */
    export class NodeEditor {
        private static _CurrentState;
        private static _PopupWindow;
        /**
         * Show the node editor
         * @param options defines the options to use to configure the node editor
         */
        static Show(options: INodeEditorOptions): void;
    }




    interface IGraphEditorProps {
        globalState: GlobalState;
    }
    interface IGraphEditorState {
        showPreviewPopUp: boolean;
        message: string;
        isError: boolean;
    }
    interface IInternalPreviewAreaOptions extends BABYLON.IInspectorOptions {
        popup: boolean;
        original: boolean;
        explorerWidth?: string;
        inspectorWidth?: string;
        embedHostWidth?: string;
    }
    export class GraphEditor extends React.Component<IGraphEditorProps, IGraphEditorState> {
        private _graphCanvasRef;
        private _diagramContainerRef;
        private _graphCanvas;
        private _historyStack;
        private _previewManager;
        private _mouseLocationX;
        private _mouseLocationY;
        private _onWidgetKeyUpPointer;
        private _previewHost;
        private _popUpWindow;
        appendBlock(dataToAppend: BABYLON.NodeMaterialBlock | BABYLON.NodeEditor.SharedUIComponents.INodeData, recursion?: boolean): BABYLON.NodeEditor.SharedUIComponents.GraphNode;
        addValueNode(type: string): BABYLON.NodeEditor.SharedUIComponents.GraphNode;
        prepareHistoryStack(): void;
        componentDidMount(): void;
        componentWillUnmount(): void;
        constructor(props: IGraphEditorProps);
        zoomToFit(): void;
        buildMaterial(): void;
        build(ignoreEditorData?: boolean): void;
        loadGraph(): void;
        showWaitScreen(): void;
        hideWaitScreen(): void;
        reOrganize(editorData?: BABYLON.Nullable<BABYLON.NodeEditor.SharedUIComponents.IEditorData>, isImportingAFrame?: boolean): void;
        onWheel: (evt: WheelEvent) => void;
        emitNewBlock(blockType: string, targetX: number, targetY: number): BABYLON.NodeEditor.SharedUIComponents.GraphNode | undefined;
        dropNewBlock(event: React.DragEvent<HTMLDivElement>): void;
        handlePopUp: () => void;
        handleClosingPopUp: () => void;
        initiatePreviewArea: (canvas?: HTMLCanvasElement) => void;
        createPopUp: () => void;
        createPreviewMeshControlHostAsync: (options: IInternalPreviewAreaOptions, parentControl: BABYLON.Nullable<HTMLElement>) => Promise<unknown>;
        createPreviewHostAsync: (options: IInternalPreviewAreaOptions, parentControl: BABYLON.Nullable<HTMLElement>) => Promise<unknown>;
        fixPopUpStyles: (document: Document) => void;
        render(): import("react/jsx-runtime").JSX.Element;
    }


    export class GlobalState {
        hostElement: HTMLElement;
        hostDocument: Document;
        hostWindow: Window;
        stateManager: BABYLON.NodeEditor.SharedUIComponents.StateManager;
        onBuiltObservable: BABYLON.Observable<void>;
        onResetRequiredObservable: BABYLON.Observable<boolean>;
        onClearUndoStack: BABYLON.Observable<void>;
        onZoomToFitRequiredObservable: BABYLON.Observable<void>;
        onReOrganizedRequiredObservable: BABYLON.Observable<void>;
        onLogRequiredObservable: BABYLON.Observable<LogEntry>;
        onIsLoadingChanged: BABYLON.Observable<boolean>;
        onLightUpdated: BABYLON.Observable<void>;
        onBackgroundHDRUpdated: BABYLON.Observable<void>;
        onPreviewBackgroundChanged: BABYLON.Observable<void>;
        onBackFaceCullingChanged: BABYLON.Observable<void>;
        onDepthPrePassChanged: BABYLON.Observable<void>;
        onAnimationCommandActivated: BABYLON.Observable<void>;
        onImportFrameObservable: BABYLON.Observable<any>;
        onPopupClosedObservable: BABYLON.Observable<void>;
        onDropEventReceivedObservable: BABYLON.Observable<DragEvent>;
        onGetNodeFromBlock: (block: BABYLON.NodeMaterialBlock) => BABYLON.NodeEditor.SharedUIComponents.GraphNode;
        previewType: PreviewType;
        previewFile: File;
        envType: PreviewType;
        envFile: File;
        particleSystemBlendMode: number;
        listOfCustomPreviewFiles: File[];
        rotatePreview: boolean;
        backgroundColor: BABYLON.Color4;
        backFaceCulling: boolean;
        depthPrePass: boolean;
        lockObject: BABYLON.NodeEditor.SharedUIComponents.LockObject;
        hemisphericLight: boolean;
        directionalLight0: boolean;
        directionalLight1: boolean;
        backgroundHDR: boolean;
        controlCamera: boolean;
        _mode: BABYLON.NodeMaterialModes;
        _engine: number;
        pointerOverCanvas: boolean;
        filesInput: BABYLON.FilesInput;
        onRefreshPreviewMeshControlComponentRequiredObservable: BABYLON.Observable<void>;
        previewTexture: BABYLON.Nullable<BABYLON.RenderTargetTexture>;
        pickingTexture: BABYLON.Nullable<BABYLON.RenderTargetTexture>;
        onPreviewSceneAfterRenderObservable: BABYLON.Observable<void>;
        onPreviewUpdatedObservable: BABYLON.Observable<BABYLON.NodeMaterial>;
        debugBlocksToRefresh: BABYLON.NodeMaterialDebugBlock[];
        forcedDebugBlock: BABYLON.Nullable<BABYLON.NodeMaterialDebugBlock>;
        /** Gets the mode */
        get mode(): BABYLON.NodeMaterialModes;
        /** Sets the mode */
        set mode(m: BABYLON.NodeMaterialModes);
        /** Gets the engine */
        get engine(): number;
        /** Sets the engine */
        set engine(e: number);
        private _nodeMaterial;
        /**
         * Gets the current node material
         */
        get nodeMaterial(): BABYLON.NodeMaterial;
        /**
         * Sets the current node material
         */
        set nodeMaterial(nodeMaterial: BABYLON.NodeMaterial);
        customSave?: {
            label: string;
            action: (data: string) => Promise<void>;
        };
        constructor();
        storeEditorData(serializationObject: any, frame?: BABYLON.Nullable<BABYLON.NodeEditor.SharedUIComponents.GraphFrame>): void;
    }


    export class BlockTools {
        static GetBlockFromString(data: string, scene: BABYLON.Scene, nodeMaterial: BABYLON.NodeMaterial): BABYLON.NodeMaterialDebugBlock | BABYLON.MatrixSplitterBlock | BABYLON.StorageWriteBlock | BABYLON.StorageReadBlock | BABYLON.LoopBlock | BABYLON.ColorConverterBlock | BABYLON.NodeMaterialTeleportInBlock | BABYLON.NodeMaterialTeleportOutBlock | BABYLON.HeightToNormalBlock | BABYLON.ElbowBlock | BABYLON.TwirlBlock | BABYLON.VoronoiNoiseBlock | BABYLON.ScreenSpaceBlock | BABYLON.CloudBlock | BABYLON.MatrixBuilderBlock | BABYLON.DesaturateBlock | BABYLON.RefractBlock | BABYLON.ReflectBlock | BABYLON.DerivativeBlock | BABYLON.Rotate2dBlock | BABYLON.NormalBlendBlock | BABYLON.WorleyNoise3DBlock | BABYLON.SimplexPerlin3DBlock | BABYLON.BonesBlock | BABYLON.InstancesBlock | BABYLON.MorphTargetsBlock | BABYLON.DiscardBlock | BABYLON.PrePassTextureBlock | BABYLON.ImageProcessingBlock | BABYLON.ColorMergerBlock | BABYLON.VectorMergerBlock | BABYLON.ColorSplitterBlock | BABYLON.VectorSplitterBlock | BABYLON.TextureBlock | BABYLON.ReflectionTextureBlock | BABYLON.LightBlock | BABYLON.FogBlock | BABYLON.VertexOutputBlock | BABYLON.FragmentOutputBlock | BABYLON.PrePassOutputBlock | BABYLON.AddBlock | BABYLON.ClampBlock | BABYLON.ScaleBlock | BABYLON.CrossBlock | BABYLON.DotBlock | BABYLON.PowBlock | BABYLON.MultiplyBlock | BABYLON.TransformBlock | BABYLON.TrigonometryBlock | BABYLON.RemapBlock | BABYLON.NormalizeBlock | BABYLON.FresnelBlock | BABYLON.LerpBlock | BABYLON.NLerpBlock | BABYLON.DivideBlock | BABYLON.SubtractBlock | BABYLON.ModBlock | BABYLON.StepBlock | BABYLON.SmoothStepBlock | BABYLON.OneMinusBlock | BABYLON.ReciprocalBlock | BABYLON.ViewDirectionBlock | BABYLON.LightInformationBlock | BABYLON.MaxBlock | BABYLON.MinBlock | BABYLON.LengthBlock | BABYLON.DistanceBlock | BABYLON.NegateBlock | BABYLON.PerturbNormalBlock | BABYLON.TBNBlock | BABYLON.RandomNumberBlock | BABYLON.ReplaceColorBlock | BABYLON.PosterizeBlock | BABYLON.ArcTan2Block | BABYLON.GradientBlock | BABYLON.FrontFacingBlock | BABYLON.MeshAttributeExistsBlock | BABYLON.WaveBlock | BABYLON.InputBlock | BABYLON.PBRMetallicRoughnessBlock | BABYLON.SheenBlock | BABYLON.AnisotropyBlock | BABYLON.ReflectionBlock | BABYLON.ClearCoatBlock | BABYLON.RefractionBlock | BABYLON.SubSurfaceBlock | BABYLON.IridescenceBlock | BABYLON.CurrentScreenBlock | BABYLON.ParticleTextureBlock | BABYLON.ParticleRampGradientBlock | BABYLON.ParticleBlendMultiplyBlock | BABYLON.FragCoordBlock | BABYLON.ScreenSizeBlock | BABYLON.SceneDepthBlock | BABYLON.ConditionalBlock | BABYLON.ImageSourceBlock | BABYLON.ClipPlanesBlock | BABYLON.FragDepthBlock | BABYLON.ShadowMapBlock | BABYLON.TriPlanarBlock | BABYLON.MatrixTransposeBlock | BABYLON.MatrixDeterminantBlock | BABYLON.CurveBlock | BABYLON.GaussianSplattingBlock | BABYLON.GaussianBlock | BABYLON.SplatReaderBlock | null;
        static GetColorFromConnectionNodeType(type: BABYLON.NodeMaterialBlockConnectionPointTypes): string;
        static GetConnectionNodeTypeFromString(type: string): BABYLON.NodeMaterialBlockConnectionPointTypes.Float | BABYLON.NodeMaterialBlockConnectionPointTypes.Vector2 | BABYLON.NodeMaterialBlockConnectionPointTypes.Vector3 | BABYLON.NodeMaterialBlockConnectionPointTypes.Vector4 | BABYLON.NodeMaterialBlockConnectionPointTypes.Color3 | BABYLON.NodeMaterialBlockConnectionPointTypes.Color4 | BABYLON.NodeMaterialBlockConnectionPointTypes.Matrix | BABYLON.NodeMaterialBlockConnectionPointTypes.AutoDetect;
        static GetStringFromConnectionNodeType(type: BABYLON.NodeMaterialBlockConnectionPointTypes): "" | "Float" | "Vector2" | "Vector3" | "Vector4" | "Matrix" | "Color3" | "Color4";
    }


    interface ITextureLineComponentProps {
        texture: BABYLON.BaseTexture;
        width: number;
        height: number;
        globalState?: any;
        hideChannelSelect?: boolean;
    }
    export interface ITextureLineComponentState {
        displayRed: boolean;
        displayGreen: boolean;
        displayBlue: boolean;
        displayAlpha: boolean;
        face: number;
    }
    export class TextureLineComponent extends React.Component<ITextureLineComponentProps, ITextureLineComponentState> {
        private _canvasRef;
        constructor(props: ITextureLineComponentProps);
        shouldComponentUpdate(): boolean;
        componentDidMount(): void;
        componentDidUpdate(): void;
        updatePreview(): void;
        static UpdatePreview(previewCanvas: HTMLCanvasElement, texture: BABYLON.BaseTexture, width: number, options: ITextureLineComponentState, onReady?: () => void, globalState?: any): Promise<void>;
        render(): import("react/jsx-runtime").JSX.Element;
    }


    export interface ICheckBoxLineComponentProps {
        label: string;
        target?: any;
        propertyName?: string;
        isSelected?: () => boolean;
        onSelect?: (value: boolean) => void;
        onValueChanged?: () => void;
        onPropertyChangedObservable?: BABYLON.Observable<BABYLON.NodeEditor.SharedUIComponents.PropertyChangedEvent>;
        disabled?: boolean;
    }
    export class CheckBoxLineComponent extends React.Component<ICheckBoxLineComponentProps, {
        isSelected: boolean;
        isDisabled?: boolean;
    }> {
        private static _UniqueIdSeed;
        private _uniqueId;
        private _localChange;
        constructor(props: ICheckBoxLineComponentProps);
        shouldComponentUpdate(nextProps: ICheckBoxLineComponentProps, nextState: {
            isSelected: boolean;
            isDisabled: boolean;
        }): boolean;
        onChange(): void;
        renderFluent(): import("react/jsx-runtime").JSX.Element;
        renderOriginal(): import("react/jsx-runtime").JSX.Element;
        render(): import("react/jsx-runtime").JSX.Element;
    }


    export const RegisterTypeLedger: () => void;


    export const RegisterToPropertyTabManagers: () => void;


    export const RegisterToDisplayManagers: () => void;


    export const RegisterNodePortDesign: (stateManager: BABYLON.NodeEditor.SharedUIComponents.StateManager) => void;


    export const RegisterExportData: (stateManager: BABYLON.NodeEditor.SharedUIComponents.StateManager) => void;


    export const RegisterElbowSupport: (stateManager: BABYLON.NodeEditor.SharedUIComponents.StateManager) => void;


    export const RegisterDefaultInput: (stateManager: BABYLON.NodeEditor.SharedUIComponents.StateManager) => void;


    export const RegisterDebugSupport: (stateManager: BABYLON.NodeEditor.SharedUIComponents.StateManager) => void;


    export class ConnectionPointPortData implements BABYLON.NodeEditor.SharedUIComponents.IPortData {
        private _connectedPort;
        private _nodeContainer;
        data: BABYLON.NodeMaterialConnectionPoint;
        get name(): string;
        get internalName(): string;
        get isExposedOnFrame(): boolean;
        set isExposedOnFrame(value: boolean);
        get exposedPortPosition(): number;
        set exposedPortPosition(value: number);
        get isConnected(): boolean;
        get connectedPort(): BABYLON.Nullable<BABYLON.NodeEditor.SharedUIComponents.IPortData>;
        set connectedPort(value: BABYLON.Nullable<BABYLON.NodeEditor.SharedUIComponents.IPortData>);
        get direction(): BABYLON.NodeEditor.SharedUIComponents.PortDataDirection;
        get ownerData(): BABYLON.NodeMaterialBlock;
        get needDualDirectionValidation(): boolean;
        get hasEndpoints(): boolean;
        get endpoints(): BABYLON.NodeEditor.SharedUIComponents.IPortData[];
        constructor(connectionPoint: BABYLON.NodeMaterialConnectionPoint, nodeContainer: BABYLON.NodeEditor.SharedUIComponents.INodeContainer);
        updateDisplayName(newName: string): void;
        connectTo(port: BABYLON.NodeEditor.SharedUIComponents.IPortData): void;
        canConnectTo(port: BABYLON.NodeEditor.SharedUIComponents.IPortData): boolean;
        disconnectFrom(port: BABYLON.NodeEditor.SharedUIComponents.IPortData): void;
        checkCompatibilityState(port: BABYLON.NodeEditor.SharedUIComponents.IPortData): 0 | BABYLON.NodeMaterialConnectionPointCompatibilityStates.TypeIncompatible | BABYLON.NodeMaterialConnectionPointCompatibilityStates.TargetIncompatible | BABYLON.NodeMaterialConnectionPointCompatibilityStates.HierarchyIssue;
        getCompatibilityIssueMessage(issue: number, targetNode: BABYLON.NodeEditor.SharedUIComponents.GraphNode, targetPort: BABYLON.NodeEditor.SharedUIComponents.IPortData): string;
    }


    export class BlockNodeData implements BABYLON.NodeEditor.SharedUIComponents.INodeData {
        data: BABYLON.NodeMaterialBlock;
        private _inputs;
        private _outputs;
        get uniqueId(): number;
        get name(): string;
        getClassName(): string;
        get isInput(): boolean;
        get inputs(): BABYLON.NodeEditor.SharedUIComponents.IPortData[];
        get outputs(): BABYLON.NodeEditor.SharedUIComponents.IPortData[];
        get comments(): string;
        set comments(value: string);
        get executionTime(): number;
        getPortByName(name: string): BABYLON.NodeEditor.SharedUIComponents.IPortData | null;
        dispose(): void;
        prepareHeaderIcon(iconDiv: HTMLDivElement, img: HTMLImageElement): void;
        get invisibleEndpoints(): BABYLON.NodeMaterialTeleportOutBlock[] | null;
        constructor(data: BABYLON.NodeMaterialBlock, nodeContainer: BABYLON.NodeEditor.SharedUIComponents.INodeContainer);
        get canBeActivated(): boolean;
        get isActive(): any;
        setIsActive(value: boolean): void;
    }


    export class VectorMergerPropertyTabComponent extends React.Component<BABYLON.NodeEditor.SharedUIComponents.IPropertyComponentProps> {
        constructor(props: BABYLON.NodeEditor.SharedUIComponents.IPropertyComponentProps);
        render(): import("react/jsx-runtime").JSX.Element;
    }


    type ReflectionTexture = BABYLON.ReflectionTextureBlock | BABYLON.ReflectionBlock | BABYLON.RefractionBlock;
    type AnyTexture = BABYLON.TextureBlock | ReflectionTexture | BABYLON.CurrentScreenBlock | BABYLON.ParticleTextureBlock | BABYLON.TriPlanarBlock;
    export class TexturePropertyTabComponent extends React.Component<BABYLON.NodeEditor.SharedUIComponents.IPropertyComponentProps, {
        isEmbedded: boolean;
        loadAsCubeTexture: boolean;
        textureIsPrefiltered: boolean;
    }> {
        get textureBlock(): AnyTexture;
        constructor(props: BABYLON.NodeEditor.SharedUIComponents.IPropertyComponentProps);
        UNSAFE_componentWillUpdate(nextProps: BABYLON.NodeEditor.SharedUIComponents.IPropertyComponentProps, nextState: {
            isEmbedded: boolean;
            loadAsCubeTexture: boolean;
        }): void;
        private _generateRandomForCache;
        updateAfterTextureLoad(): void;
        removeTexture(): void;
        _prepareTexture(): void;
        /**
         * Replaces the texture of the node
         * @param file the file of the texture to use
         */
        replaceTexture(file: File): void;
        replaceTextureWithUrl(url: string): void;
        render(): import("react/jsx-runtime").JSX.Element;
    }


    export class TeleportOutPropertyTabComponent extends React.Component<BABYLON.NodeEditor.SharedUIComponents.IPropertyComponentProps> {
        private _onUpdateRequiredObserver;
        constructor(props: BABYLON.NodeEditor.SharedUIComponents.IPropertyComponentProps);
        componentDidMount(): void;
        componentWillUnmount(): void;
        render(): import("react/jsx-runtime").JSX.Element;
    }


    export interface IFrameNodePortPropertyTabComponentProps {
        stateManager: BABYLON.NodeEditor.SharedUIComponents.StateManager;
        nodePort: BABYLON.NodeEditor.SharedUIComponents.NodePort;
    }
    export class NodePortPropertyTabComponent extends React.Component<IFrameNodePortPropertyTabComponentProps> {
        constructor(props: IFrameNodePortPropertyTabComponentProps);
        toggleExposeOnFrame(value: boolean): void;
        render(): import("react/jsx-runtime").JSX.Element;
    }


    export class LightPropertyTabComponent extends React.Component<BABYLON.NodeEditor.SharedUIComponents.IPropertyComponentProps> {
        render(): import("react/jsx-runtime").JSX.Element;
    }


    export class LightInformationPropertyTabComponent extends React.Component<BABYLON.NodeEditor.SharedUIComponents.IPropertyComponentProps> {
        render(): import("react/jsx-runtime").JSX.Element;
    }


    export class InputPropertyTabComponent extends React.Component<BABYLON.NodeEditor.SharedUIComponents.IPropertyComponentProps> {
        private _onValueChangedObserver;
        constructor(props: BABYLON.NodeEditor.SharedUIComponents.IPropertyComponentProps);
        componentDidMount(): void;
        componentWillUnmount(): void;
        renderValue(globalState: GlobalState): import("react/jsx-runtime").JSX.Element | null;
        setDefaultValue(): void;
        render(): import("react/jsx-runtime").JSX.Element;
    }


    export class ImageSourcePropertyTabComponent extends React.Component<BABYLON.NodeEditor.SharedUIComponents.IPropertyComponentProps, {
        isEmbedded: boolean;
    }> {
        get imageSourceBlock(): BABYLON.ImageSourceBlock;
        constructor(props: BABYLON.NodeEditor.SharedUIComponents.IPropertyComponentProps);
        UNSAFE_componentWillUpdate(nextProps: BABYLON.NodeEditor.SharedUIComponents.IPropertyComponentProps, nextState: {
            isEmbedded: boolean;
            loadAsCubeTexture: boolean;
        }): void;
        private _generateRandomForCache;
        updateAfterTextureLoad(): void;
        removeTexture(): void;
        _prepareTexture(): void;
        /**
         * Replaces the texture of the node
         * @param file the file of the texture to use
         */
        replaceTexture(file: File): void;
        replaceTextureWithUrl(url: string): void;
        render(): import("react/jsx-runtime").JSX.Element;
    }


    interface IGradientStepComponentProps {
        stateManager: BABYLON.NodeEditor.SharedUIComponents.StateManager;
        step: BABYLON.GradientBlockColorStep;
        lineIndex: number;
        onDelete: () => void;
        onUpdateStep: () => void;
        onCheckForReOrder: () => void;
        onCopy?: () => void;
    }
    export class GradientStepComponent extends React.Component<IGradientStepComponentProps, {
        gradient: number;
    }> {
        constructor(props: IGradientStepComponentProps);
        updateColor(color: string): void;
        updateStep(gradient: number): void;
        onPointerUp(): void;
        render(): import("react/jsx-runtime").JSX.Element;
    }


    export class GradientPropertyTabComponent extends React.Component<BABYLON.NodeEditor.SharedUIComponents.IPropertyComponentProps> {
        private _onValueChangedObserver;
        constructor(props: BABYLON.NodeEditor.SharedUIComponents.IPropertyComponentProps);
        componentDidMount(): void;
        componentWillUnmount(): void;
        forceRebuild(): void;
        deleteStep(step: BABYLON.GradientBlockColorStep): void;
        copyStep(step: BABYLON.GradientBlockColorStep): void;
        addNewStep(): void;
        checkForReOrder(): void;
        renderOriginal(): import("react/jsx-runtime").JSX.Element;
        renderFluent(): import("react/jsx-runtime").JSX.Element;
        render(): import("react/jsx-runtime").JSX.Element;
    }


    export class DefaultPropertyTabComponent extends React.Component<BABYLON.NodeEditor.SharedUIComponents.IPropertyComponentProps> {
        constructor(props: BABYLON.NodeEditor.SharedUIComponents.IPropertyComponentProps);
        render(): import("react/jsx-runtime").JSX.Element;
    }
    /**
     * NOTE This is intentionally a function to avoid another wrapper JSX element around the lineContainerComponent, and will ensure
     * the lineContainerComponent gets properly rendered as a child of the Accordion
     * @param props
     * @returns
     */
    export function GetGeneralProperties(props: BABYLON.NodeEditor.SharedUIComponents.IPropertyComponentProps): import("react/jsx-runtime").JSX.Element;
    /**
     * NOTE This is intentionally a function to avoid another wrapper JSX element around the lineContainerComponent, and will ensure
     * the lineContainerComponent gets properly rendered as a child of the Accordion
     * @param props
     * @returns
     */
    export function GetGenericProperties(props: BABYLON.NodeEditor.SharedUIComponents.IPropertyComponentProps): import("react/jsx-runtime").JSX.Element;


    export interface IFramePropertyTabComponentProps {
        globalState: GlobalState;
        frame: BABYLON.NodeEditor.SharedUIComponents.GraphFrame;
    }
    export class FramePropertyTabComponent extends React.Component<IFramePropertyTabComponentProps> {
        private _onFrameExpandStateChangedObserver;
        constructor(props: IFramePropertyTabComponentProps);
        componentDidMount(): void;
        componentWillUnmount(): void;
        render(): import("react/jsx-runtime").JSX.Element;
    }


    export interface IFrameNodePortPropertyTabComponentProps {
        stateManager: BABYLON.NodeEditor.SharedUIComponents.StateManager;
        globalState: GlobalState;
        frameNodePort: BABYLON.NodeEditor.SharedUIComponents.FrameNodePort;
        frame: BABYLON.NodeEditor.SharedUIComponents.GraphFrame;
    }
    export class FrameNodePortPropertyTabComponent extends React.Component<IFrameNodePortPropertyTabComponentProps, {
        port: BABYLON.NodeEditor.SharedUIComponents.FrameNodePort;
    }> {
        private _onFramePortPositionChangedObserver;
        private _onSelectionChangedObserver;
        constructor(props: IFrameNodePortPropertyTabComponentProps);
        componentWillUnmount(): void;
        render(): import("react/jsx-runtime").JSX.Element;
    }


    export class DebugNodePropertyTabComponent extends React.Component<BABYLON.NodeEditor.SharedUIComponents.IPropertyComponentProps> {
        refreshAll(): void;
        render(): import("react/jsx-runtime").JSX.Element;
    }


    export class ColorMergerPropertyTabComponent extends React.Component<BABYLON.NodeEditor.SharedUIComponents.IPropertyComponentProps> {
        constructor(props: BABYLON.NodeEditor.SharedUIComponents.IPropertyComponentProps);
        render(): import("react/jsx-runtime").JSX.Element;
    }


    export class TrigonometryDisplayManager implements BABYLON.NodeEditor.SharedUIComponents.IDisplayManager {
        getHeaderClass(): string;
        shouldDisplayPortLabels(): boolean;
        getHeaderText(nodeData: BABYLON.NodeEditor.SharedUIComponents.INodeData): string;
        getBackgroundColor(): string;
        updatePreviewContent(nodeData: BABYLON.NodeEditor.SharedUIComponents.INodeData, contentArea: HTMLDivElement): void;
    }


    export class TextureDisplayManager implements BABYLON.NodeEditor.SharedUIComponents.IDisplayManager {
        private _previewCanvas;
        private _previewImage;
        getHeaderClass(): string;
        shouldDisplayPortLabels(): boolean;
        getHeaderText(nodeData: BABYLON.NodeEditor.SharedUIComponents.INodeData): string;
        getBackgroundColor(nodeData: BABYLON.NodeEditor.SharedUIComponents.INodeData): string;
        updatePreviewContent(nodeData: BABYLON.NodeEditor.SharedUIComponents.INodeData, contentArea: HTMLDivElement): void;
    }


    export class TeleportOutDisplayManager implements BABYLON.NodeEditor.SharedUIComponents.IDisplayManager {
        private _hasHighlights;
        getHeaderClass(): string;
        shouldDisplayPortLabels(): boolean;
        getHeaderText(nodeData: BABYLON.NodeEditor.SharedUIComponents.INodeData): string;
        getBackgroundColor(nodeData: BABYLON.NodeEditor.SharedUIComponents.INodeData): string;
        updatePreviewContent(nodeData: BABYLON.NodeEditor.SharedUIComponents.INodeData, contentArea: HTMLDivElement): void;
        onSelectionChanged(nodeData: BABYLON.NodeEditor.SharedUIComponents.INodeData, selectedData: BABYLON.Nullable<BABYLON.NodeEditor.SharedUIComponents.INodeData>, manager: BABYLON.NodeEditor.SharedUIComponents.StateManager): void;
        onDispose(nodeData: BABYLON.NodeEditor.SharedUIComponents.INodeData, manager: BABYLON.NodeEditor.SharedUIComponents.StateManager): void;
    }


    export class TeleportInDisplayManager implements BABYLON.NodeEditor.SharedUIComponents.IDisplayManager {
        private _hasHighlights;
        getHeaderClass(): string;
        shouldDisplayPortLabels(): boolean;
        getHeaderText(nodeData: BABYLON.NodeEditor.SharedUIComponents.INodeData): string;
        getBackgroundColor(nodeData: BABYLON.NodeEditor.SharedUIComponents.INodeData): string;
        updatePreviewContent(nodeData: BABYLON.NodeEditor.SharedUIComponents.INodeData, contentArea: HTMLDivElement): void;
        onSelectionChanged(nodeData: BABYLON.NodeEditor.SharedUIComponents.INodeData, selectedData: BABYLON.Nullable<BABYLON.NodeEditor.SharedUIComponents.INodeData>, manager: BABYLON.NodeEditor.SharedUIComponents.StateManager): void;
        onDispose(nodeData: BABYLON.NodeEditor.SharedUIComponents.INodeData, manager: BABYLON.NodeEditor.SharedUIComponents.StateManager): void;
    }


    export class RemapDisplayManager implements BABYLON.NodeEditor.SharedUIComponents.IDisplayManager {
        getHeaderClass(): string;
        shouldDisplayPortLabels(): boolean;
        getHeaderText(nodeData: BABYLON.NodeEditor.SharedUIComponents.INodeData): string;
        getBackgroundColor(): string;
        private _extractInputValue;
        updatePreviewContent(nodeData: BABYLON.NodeEditor.SharedUIComponents.INodeData, contentArea: HTMLDivElement): void;
    }


    export class PBRDisplayManager implements BABYLON.NodeEditor.SharedUIComponents.IDisplayManager {
        getHeaderClass(): string;
        shouldDisplayPortLabels(): boolean;
        getHeaderText(nodeData: BABYLON.NodeEditor.SharedUIComponents.INodeData): string;
        getBackgroundColor(): string;
        updatePreviewContent(nodeData: BABYLON.NodeEditor.SharedUIComponents.INodeData, contentArea: HTMLDivElement): void;
    }


    export class OutputDisplayManager implements BABYLON.NodeEditor.SharedUIComponents.IDisplayManager {
        getHeaderClass(): string;
        shouldDisplayPortLabels(): boolean;
        getHeaderText(nodeData: BABYLON.NodeEditor.SharedUIComponents.INodeData): string;
        getBackgroundColor(): string;
        updatePreviewContent(nodeData: BABYLON.NodeEditor.SharedUIComponents.INodeData, contentArea: HTMLDivElement): void;
    }


    export class MeshAttributeExistsDisplayManager implements BABYLON.NodeEditor.SharedUIComponents.IDisplayManager {
        getHeaderClass(nodeData: BABYLON.NodeEditor.SharedUIComponents.INodeData): string;
        shouldDisplayPortLabels(): boolean;
        getHeaderText(nodeData: BABYLON.NodeEditor.SharedUIComponents.INodeData): string;
        getBackgroundColor(nodeData: BABYLON.NodeEditor.SharedUIComponents.INodeData): string;
        updatePreviewContent(): void;
    }


    export class LoopDisplayManager implements BABYLON.NodeEditor.SharedUIComponents.IDisplayManager {
        getHeaderClass(): string;
        shouldDisplayPortLabels(): boolean;
        getHeaderText(nodeData: BABYLON.NodeEditor.SharedUIComponents.INodeData): string;
        getBackgroundColor(): string;
        updatePreviewContent(nodeData: BABYLON.NodeEditor.SharedUIComponents.INodeData, contentArea: HTMLDivElement): void;
    }


    export class InputDisplayManager implements BABYLON.NodeEditor.SharedUIComponents.IDisplayManager {
        getHeaderClass(nodeData: BABYLON.NodeEditor.SharedUIComponents.INodeData): string;
        shouldDisplayPortLabels(): boolean;
        getHeaderText(nodeData: BABYLON.NodeEditor.SharedUIComponents.INodeData): string;
        static GetBaseType(type: BABYLON.NodeMaterialBlockConnectionPointTypes): string;
        getBackgroundColor(nodeData: BABYLON.NodeEditor.SharedUIComponents.INodeData): string;
        updatePreviewContent(nodeData: BABYLON.NodeEditor.SharedUIComponents.INodeData, contentArea: HTMLDivElement): void;
    }


    export class ImageSourceDisplayManager implements BABYLON.NodeEditor.SharedUIComponents.IDisplayManager {
        private _previewCanvas;
        private _previewImage;
        getHeaderClass(): string;
        shouldDisplayPortLabels(): boolean;
        getHeaderText(nodeData: BABYLON.NodeEditor.SharedUIComponents.INodeData): string;
        getBackgroundColor(): string;
        updatePreviewContent(nodeData: BABYLON.NodeEditor.SharedUIComponents.INodeData, contentArea: HTMLDivElement): void;
    }


    export class GradientDisplayManager implements BABYLON.NodeEditor.SharedUIComponents.IDisplayManager {
        getHeaderClass(): string;
        shouldDisplayPortLabels(): boolean;
        getHeaderText(nodeData: BABYLON.NodeEditor.SharedUIComponents.INodeData): string;
        getBackgroundColor(nodeData: BABYLON.NodeEditor.SharedUIComponents.INodeData): string;
        updatePreviewContent(nodeData: BABYLON.NodeEditor.SharedUIComponents.INodeData, contentArea: HTMLDivElement): void;
    }


    export class ElbowDisplayManager implements BABYLON.NodeEditor.SharedUIComponents.IDisplayManager {
        getHeaderClass(): string;
        shouldDisplayPortLabels(): boolean;
        getHeaderText(nodeData: BABYLON.NodeEditor.SharedUIComponents.INodeData): string;
        getBackgroundColor(nodeData: BABYLON.NodeEditor.SharedUIComponents.INodeData): string;
        updatePreviewContent(_nodeData: BABYLON.NodeEditor.SharedUIComponents.INodeData, _contentArea: HTMLDivElement): void;
        updateFullVisualContent(data: BABYLON.NodeEditor.SharedUIComponents.INodeData, visualContent: BABYLON.NodeEditor.SharedUIComponents.VisualContentDescription): void;
    }


    export class DiscardDisplayManager implements BABYLON.NodeEditor.SharedUIComponents.IDisplayManager {
        getHeaderClass(): string;
        shouldDisplayPortLabels(): boolean;
        getHeaderText(nodeData: BABYLON.NodeEditor.SharedUIComponents.INodeData): string;
        getBackgroundColor(): string;
        updatePreviewContent(nodeData: BABYLON.NodeEditor.SharedUIComponents.INodeData, contentArea: HTMLDivElement): void;
    }


    export class DepthSourceDisplayManager implements BABYLON.NodeEditor.SharedUIComponents.IDisplayManager {
        getHeaderClass(): string;
        shouldDisplayPortLabels(): boolean;
        getHeaderText(nodeData: BABYLON.NodeEditor.SharedUIComponents.INodeData): string;
        getBackgroundColor(): string;
        updatePreviewContent(): void;
    }


    export class DebugDisplayManager implements BABYLON.NodeEditor.SharedUIComponents.IDisplayManager {
        private _previewCanvas;
        private _previewImage;
        private _onPreviewSceneAfterRenderObserver;
        getHeaderClass(): string;
        shouldDisplayPortLabels(): boolean;
        getHeaderText(nodeData: BABYLON.NodeEditor.SharedUIComponents.INodeData): string;
        getBackgroundColor(): string;
        onSelectionChanged?(data: BABYLON.NodeEditor.SharedUIComponents.INodeData, selectedData: BABYLON.Nullable<BABYLON.NodeEditor.SharedUIComponents.INodeData>, manager: BABYLON.NodeEditor.SharedUIComponents.StateManager): void;
        updatePreviewContent(nodeData: BABYLON.NodeEditor.SharedUIComponents.INodeData, contentArea: HTMLDivElement): void;
        updateFullVisualContent(data: BABYLON.NodeEditor.SharedUIComponents.INodeData, visualContent: BABYLON.NodeEditor.SharedUIComponents.VisualContentDescription): void;
    }


    export class CurveDisplayManager implements BABYLON.NodeEditor.SharedUIComponents.IDisplayManager {
        getHeaderClass(): string;
        shouldDisplayPortLabels(): boolean;
        getHeaderText(nodeData: BABYLON.NodeEditor.SharedUIComponents.INodeData): string;
        getBackgroundColor(): string;
        updatePreviewContent(nodeData: BABYLON.NodeEditor.SharedUIComponents.INodeData, contentArea: HTMLDivElement): void;
    }


    export class ConditionalDisplayManager implements BABYLON.NodeEditor.SharedUIComponents.IDisplayManager {
        getHeaderClass(): string;
        shouldDisplayPortLabels(): boolean;
        getHeaderText(nodeData: BABYLON.NodeEditor.SharedUIComponents.INodeData): string;
        getBackgroundColor(): string;
        updatePreviewContent(): void;
    }


    export class ClampDisplayManager implements BABYLON.NodeEditor.SharedUIComponents.IDisplayManager {
        getHeaderClass(): string;
        shouldDisplayPortLabels(): boolean;
        getHeaderText(nodeData: BABYLON.NodeEditor.SharedUIComponents.INodeData): string;
        getBackgroundColor(): string;
        updatePreviewContent(nodeData: BABYLON.NodeEditor.SharedUIComponents.INodeData, contentArea: HTMLDivElement): void;
    }


    interface IPropertyTabComponentProps {
        globalState: GlobalState;
        lockObject: BABYLON.NodeEditor.SharedUIComponents.LockObject;
    }
    interface IPropertyTabComponentState {
        currentNode: BABYLON.Nullable<BABYLON.NodeEditor.SharedUIComponents.GraphNode>;
        currentFrame: BABYLON.Nullable<BABYLON.NodeEditor.SharedUIComponents.GraphFrame>;
        currentFrameNodePort: BABYLON.Nullable<BABYLON.NodeEditor.SharedUIComponents.FrameNodePort>;
        currentNodePort: BABYLON.Nullable<BABYLON.NodeEditor.SharedUIComponents.NodePort>;
        uploadInProgress: boolean;
    }
    export class PropertyTabComponent extends React.Component<IPropertyTabComponentProps, IPropertyTabComponentState> {
        private _onBuiltObserver;
        private _modeSelect;
        constructor(props: IPropertyTabComponentProps);
        componentDidMount(): void;
        componentWillUnmount(): void;
        processInputBlockUpdate(ib: BABYLON.InputBlock): void;
        renderInputBlock(block: BABYLON.InputBlock): import("react/jsx-runtime").JSX.Element | null;
        load(file: File): void;
        loadFrame(file: File): void;
        save(): void;
        customSave(): void;
        saveToSnippetServer(): void;
        loadFromSnippet(): void;
        changeMode(value: any, force?: boolean, loadDefault?: boolean): boolean;
        render(): import("react/jsx-runtime").JSX.Element | null | undefined;
    }


    interface IInputsPropertyTabComponentProps {
        globalState: GlobalState;
        inputs: BABYLON.InputBlock[];
        lockObject: BABYLON.NodeEditor.SharedUIComponents.LockObject;
    }
    /**
     * NOTE if being used within a PropertyTabComponentBase (which is a wrapper for Accordion), call as a function rather than
     * rendering as a component. This will avoid a wrapper JSX element existing before the lineContainerComponent and will ensure
     * the lineContainerComponent gets properly rendered as a child of the Accordion
     * @param props
     * @returns
     */
    export function GetInputProperties(props: IInputsPropertyTabComponentProps): import("react/jsx-runtime").JSX.Element;


    interface IVector4PropertyTabComponentProps {
        globalState: GlobalState;
        inputBlock: BABYLON.InputBlock;
        lockObject: BABYLON.NodeEditor.SharedUIComponents.LockObject;
    }
    export class Vector4PropertyTabComponent extends React.Component<IVector4PropertyTabComponentProps> {
        render(): import("react/jsx-runtime").JSX.Element;
    }


    interface IVector3PropertyTabComponentProps {
        globalState: GlobalState;
        inputBlock: BABYLON.InputBlock;
        lockObject: BABYLON.NodeEditor.SharedUIComponents.LockObject;
    }
    export class Vector3PropertyTabComponent extends React.Component<IVector3PropertyTabComponentProps> {
        render(): import("react/jsx-runtime").JSX.Element;
    }


    interface IVector2PropertyTabComponentProps {
        globalState: GlobalState;
        inputBlock: BABYLON.InputBlock;
        lockObject: BABYLON.NodeEditor.SharedUIComponents.LockObject;
    }
    export class Vector2PropertyTabComponent extends React.Component<IVector2PropertyTabComponentProps> {
        render(): import("react/jsx-runtime").JSX.Element;
    }


    interface IMatrixPropertyTabComponentProps {
        globalState: GlobalState;
        inputBlock: BABYLON.InputBlock;
        lockObject: BABYLON.NodeEditor.SharedUIComponents.LockObject;
    }
    export class MatrixPropertyTabComponent extends React.Component<IMatrixPropertyTabComponentProps> {
        render(): import("react/jsx-runtime").JSX.Element;
    }


    interface IFloatPropertyTabComponentProps {
        globalState: GlobalState;
        inputBlock: BABYLON.InputBlock;
    }
    export class FloatPropertyTabComponent extends React.Component<IFloatPropertyTabComponentProps> {
        render(): import("react/jsx-runtime").JSX.Element;
    }


    interface IColor4PropertyTabComponentProps {
        globalState: GlobalState;
        inputBlock: BABYLON.InputBlock;
        lockObject: BABYLON.NodeEditor.SharedUIComponents.LockObject;
    }
    export class Color4PropertyTabComponent extends React.Component<IColor4PropertyTabComponentProps> {
        render(): import("react/jsx-runtime").JSX.Element;
    }


    interface IColor3PropertyTabComponentProps {
        globalState: GlobalState;
        inputBlock: BABYLON.InputBlock;
        lockObject: BABYLON.NodeEditor.SharedUIComponents.LockObject;
    }
    export class Color3PropertyTabComponent extends React.Component<IColor3PropertyTabComponentProps> {
        render(): import("react/jsx-runtime").JSX.Element;
    }


    export enum PreviewType {
        Sphere = 0,
        Box = 1,
        Torus = 2,
        Cylinder = 3,
        Plane = 4,
        ShaderBall = 5,
        DefaultParticleSystem = 6,
        Bubbles = 7,
        Smoke = 8,
        Rain = 9,
        Explosion = 10,
        Fire = 11,
        Parrot = 12,
        BricksSkull = 13,
        Plants = 14,
        Custom = 15,
        Room = 16
    }


    interface IPreviewMeshControlComponent {
        globalState: GlobalState;
        togglePreviewAreaComponent: () => void;
        onMounted?: () => void;
    }
    export class PreviewMeshControlComponent extends React.Component<IPreviewMeshControlComponent> {
        private _colorInputRef;
        private _filePickerRef;
        private _envPickerRef;
        private _onResetRequiredObserver;
        private _onDropEventObserver;
        private _onRefreshPreviewMeshControlComponentRequiredObserver;
        constructor(props: IPreviewMeshControlComponent);
        componentWillUnmount(): void;
        componentDidMount(): void;
        changeMeshType(newOne: PreviewType): void;
        useCustomMesh(evt: any): void;
        useCustomEnv(evt: any): void;
        onPopUp(): void;
        changeAnimation(): void;
        changeBackground(value: string): void;
        changeBackgroundClick(): void;
        render(): import("react/jsx-runtime").JSX.Element;
    }


    export class PreviewManager {
        private _nodeMaterial;
        private _onBuildObserver;
        private _onPreviewCommandActivatedObserver;
        private _onAnimationCommandActivatedObserver;
        private _onUpdateRequiredObserver;
        private _onPreviewBackgroundChangedObserver;
        private _onBackFaceCullingChangedObserver;
        private _onDepthPrePassChangedObserver;
        private _onLightUpdatedObserver;
        private _onBackgroundHDRUpdatedObserver;
        private _engine;
        private _scene;
        private _meshes;
        private _camera;
        private _material;
        private _globalState;
        private _currentType;
        private _lightParent;
        private _postprocess;
        private _proceduralTexture;
        private _particleSystem;
        private _layer;
        private _hdrSkyBox;
        private _hdrTexture;
        private _serializeMaterial;
        /**
         * Create a new Preview Manager
         * @param targetCanvas defines the canvas to render to
         * @param globalState defines the global state
         */
        constructor(targetCanvas: HTMLCanvasElement, globalState: GlobalState);
        _initAsync(targetCanvas: HTMLCanvasElement): Promise<void>;
        private _reset;
        private _handleAnimations;
        private _prepareLights;
        private _prepareBackgroundHDR;
        private _prepareScene;
        /**
         * Default Environment URL
         */
        static DefaultEnvironmentURL: string;
        private _refreshPreviewMesh;
        private _loadParticleSystem;
        private _forceCompilationAsync;
        private _updatePreview;
        dispose(): void;
    }


    interface IPreviewAreaComponentProps {
        globalState: GlobalState;
        onMounted?: () => void;
    }
    export class PreviewAreaComponent extends React.Component<IPreviewAreaComponentProps, {
        isLoading: boolean;
    }> {
        private _onIsLoadingChangedObserver;
        private _onResetRequiredObserver;
        private _consoleRef;
        constructor(props: IPreviewAreaComponentProps);
        componentDidMount(): void;
        componentWillUnmount(): void;
        changeBackFaceCulling(value: boolean): void;
        changeDepthPrePass(value: boolean): void;
        _onPointerOverCanvas: () => void;
        _onPointerOutCanvas: () => void;
        changeParticleSystemBlendMode(newOne: number): void;
        processPointerMove(e: React.PointerEvent<HTMLCanvasElement>): Promise<void>;
        onKeyUp(e: React.KeyboardEvent<HTMLCanvasElement>): void;
        render(): import("react/jsx-runtime").JSX.Element;
    }


    interface INodeListComponentProps {
        globalState: GlobalState;
    }
    export class NodeListComponent extends React.Component<INodeListComponentProps, {
        filter: string;
    }> {
        private _onResetRequiredObserver;
        private static _Tooltips;
        private _customFrameList;
        private _customBlockList;
        constructor(props: INodeListComponentProps);
        componentWillUnmount(): void;
        filterContent(filter: string): void;
        loadCustomFrame(file: File): void;
        removeItem(value: string): void;
        loadCustomBlock(file: File): void;
        removeCustomBlock(value: string): void;
        renderFluent(blockMenu: JSX.Element[]): import("react/jsx-runtime").JSX.Element;
        renderOriginal(blockMenu: JSX.Element[]): import("react/jsx-runtime").JSX.Element;
        render(): import("react/jsx-runtime").JSX.Element;
    }


    interface ILogComponentProps {
        globalState: GlobalState;
    }
    export class LogEntry {
        message: string;
        isError: boolean;
        time: Date;
        constructor(message: string, isError: boolean);
    }
    export class LogComponent extends React.Component<ILogComponentProps, {
        logs: LogEntry[];
    }> {
        private _logConsoleRef;
        constructor(props: ILogComponentProps);
        componentDidMount(): void;
        componentDidUpdate(): void;
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor.SharedUIComponents {
        /**
     * Copy all styles from a document to another document or shadow root
     * @param source document to copy styles from
     * @param target document or shadow root to copy styles to
     */
    export function CopyStyles(source: Document, target: DocumentOrShadowRoot): void;
    /**
     * Merges classNames by array of strings or conditions
     * @param classNames Array of className strings or truthy conditions
     * @returns A concatenated string, suitable for the className attribute
     */
    export function MergeClassNames(classNames: ClassNameCondition[]): string;
    /**
     * className (replicating React type) or a tuple with the second member being any truthy value ["className", true]
     */
    type ClassNameCondition = string | undefined | [string, any];



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export class StringTools {
        private static _SaveAs;
        private static _Click;
        /**
         * Download a string into a file that will be saved locally by the browser
         * @param document
         * @param content defines the string to download locally as a file
         * @param filename
         */
        static DownloadAsFile(document: HTMLDocument, content: string, filename: string): void;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export class PropertyChangedEvent {
        object: any;
        property: string;
        value: any;
        initialValue: any;
        allowNullValue?: boolean;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        /**
     * Create a popup window
     * @param title default title for the popup
     * @param options options for the popup
     * @returns the parent control of the popup
     */
    export function CreatePopup(title: string, options: Partial<{
        onParentControlCreateCallback?: (parentControl: HTMLDivElement) => void;
        onWindowCreateCallback?: (newWindow: Window) => void;
        width?: number;
        height?: number;
    }>): HTMLDivElement | null;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        /**
     * Class handling undo / redo operations
     */
    export class HistoryStack implements BABYLON.IDisposable {
        private _historyStack;
        private _redoStack;
        private _activeData;
        private readonly _maxHistoryLength;
        private _locked;
        private _dataProvider;
        private _applyUpdate;
        /**
         * Gets or sets a boolean indicating if the stack is enabled
         */
        isEnabled: boolean;
        /**
         * Constructor
         * @param dataProvider defines the data provider function
         * @param applyUpdate defines the code to execute when undo/redo operation is required
         */
        constructor(dataProvider: () => any, applyUpdate: (data: any) => void);
        /**
         * Process key event to handle undo / redo
         * @param evt defines the keyboard event to process
         * @returns true if the event was processed
         */
        processKeyEvent(evt: KeyboardEvent): boolean;
        /**
         * Resets the stack
         */
        reset(): void;
        /**
         * Remove the n-1 element of the stack
         */
        collapseLastTwo(): void;
        private _generateJSONDiff;
        private _applyJSONDiff;
        private _copy;
        /**
         * Stores the current state
         */
        store(): void;
        /**
         * Undo the latest operation
         */
        undo(): void;
        /**
         * Redo the latest undo operation
         */
        redo(): void;
        /**
         * Disposes the stack
         */
        dispose(): void;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export function copyCommandToClipboard(strCommand: string): void;
    export function getClassNameWithNamespace(obj: any): {
        className: string;
        babylonNamespace: string;
    };



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        /**
     * Used by both particleSystem and alphaBlendModes
     */
    export var CommonBlendModes: {
        label: string;
        value: number;
    }[];
    /**
     * Used to populated the blendMode dropdown in our various tools (Node Editor, Inspector, etc.)
     * The below ParticleSystem consts were defined before new Engine alpha blend modes were added, so we have to reference
     * the ParticleSystem.FOO consts explicitly (as the underlying var values are different - they get mapped to engine consts within baseParticleSystem.ts)
     */
    export var BlendModeOptions: {
        label: string;
        value: number;
    }[];
    /**
     * Used to populated the alphaMode dropdown in our various tools (Node Editor, Inspector, etc.)
     */
    export var AlphaModeOptions: {
        label: string;
        value: number;
    }[];



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        /**
     * Class used to provide lock mechanism
     */
    export class LockObject {
        /**
         * Gets or set if the lock is engaged
         */
        lock: boolean;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        interface ITextBlockPropertyGridComponentProps {
        textBlock: BABYLON.GUI.TextBlock;
        lockObject: BABYLON.NodeEditor.SharedUIComponents.LockObject;
        onPropertyChangedObservable?: BABYLON.Observable<BABYLON.NodeEditor.SharedUIComponents.PropertyChangedEvent>;
    }
    export class TextBlockPropertyGridComponent extends React.Component<ITextBlockPropertyGridComponentProps> {
        constructor(props: ITextBlockPropertyGridComponentProps);
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        interface IStackPanelPropertyGridComponentProps {
        stackPanel: BABYLON.GUI.StackPanel;
        lockObject: BABYLON.NodeEditor.SharedUIComponents.LockObject;
        onPropertyChangedObservable?: BABYLON.Observable<BABYLON.NodeEditor.SharedUIComponents.PropertyChangedEvent>;
    }
    export class StackPanelPropertyGridComponent extends React.Component<IStackPanelPropertyGridComponentProps> {
        constructor(props: IStackPanelPropertyGridComponentProps);
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        interface ISliderPropertyGridComponentProps {
        slider: BABYLON.GUI.Slider;
        lockObject: BABYLON.NodeEditor.SharedUIComponents.LockObject;
        onPropertyChangedObservable?: BABYLON.Observable<BABYLON.NodeEditor.SharedUIComponents.PropertyChangedEvent>;
    }
    export class SliderPropertyGridComponent extends React.Component<ISliderPropertyGridComponentProps> {
        constructor(props: ISliderPropertyGridComponentProps);
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        interface IScrollViewerPropertyGridComponentProps {
        scrollViewer: BABYLON.GUI.ScrollViewer;
        lockObject: BABYLON.NodeEditor.SharedUIComponents.LockObject;
        onPropertyChangedObservable?: BABYLON.Observable<BABYLON.NodeEditor.SharedUIComponents.PropertyChangedEvent>;
    }
    export class ScrollViewerPropertyGridComponent extends React.Component<IScrollViewerPropertyGridComponentProps> {
        constructor(props: IScrollViewerPropertyGridComponentProps);
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        interface IRectanglePropertyGridComponentProps {
        rectangle: BABYLON.GUI.Rectangle;
        lockObject: BABYLON.NodeEditor.SharedUIComponents.LockObject;
        onPropertyChangedObservable?: BABYLON.Observable<BABYLON.NodeEditor.SharedUIComponents.PropertyChangedEvent>;
    }
    export class RectanglePropertyGridComponent extends React.Component<IRectanglePropertyGridComponentProps> {
        constructor(props: IRectanglePropertyGridComponentProps);
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        interface IRadioButtonPropertyGridComponentProps {
        radioButtons: BABYLON.GUI.RadioButton[];
        lockObject: BABYLON.NodeEditor.SharedUIComponents.LockObject;
        onPropertyChangedObservable?: BABYLON.Observable<BABYLON.NodeEditor.SharedUIComponents.PropertyChangedEvent>;
    }
    export class RadioButtonPropertyGridComponent extends React.Component<IRadioButtonPropertyGridComponentProps> {
        constructor(props: IRadioButtonPropertyGridComponentProps);
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        interface ILinePropertyGridComponentProps {
        line: BABYLON.GUI.Line;
        lockObject: BABYLON.NodeEditor.SharedUIComponents.LockObject;
        onPropertyChangedObservable?: BABYLON.Observable<BABYLON.NodeEditor.SharedUIComponents.PropertyChangedEvent>;
    }
    export class LinePropertyGridComponent extends React.Component<ILinePropertyGridComponentProps> {
        constructor(props: ILinePropertyGridComponentProps);
        onDashChange(value: string): void;
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        interface IInputTextPropertyGridComponentProps {
        inputText: BABYLON.GUI.InputText;
        lockObject: BABYLON.NodeEditor.SharedUIComponents.LockObject;
        onPropertyChangedObservable?: BABYLON.Observable<BABYLON.NodeEditor.SharedUIComponents.PropertyChangedEvent>;
    }
    export class InputTextPropertyGridComponent extends React.Component<IInputTextPropertyGridComponentProps> {
        constructor(props: IInputTextPropertyGridComponentProps);
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        interface IImagePropertyGridComponentProps {
        image: BABYLON.GUI.Image;
        lockObject: BABYLON.NodeEditor.SharedUIComponents.LockObject;
        onPropertyChangedObservable?: BABYLON.Observable<BABYLON.NodeEditor.SharedUIComponents.PropertyChangedEvent>;
    }
    export class ImagePropertyGridComponent extends React.Component<IImagePropertyGridComponentProps> {
        constructor(props: IImagePropertyGridComponentProps);
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        interface IImageBasedSliderPropertyGridComponentProps {
        imageBasedSlider: BABYLON.GUI.ImageBasedSlider;
        lockObject: BABYLON.NodeEditor.SharedUIComponents.LockObject;
        onPropertyChangedObservable?: BABYLON.Observable<BABYLON.NodeEditor.SharedUIComponents.PropertyChangedEvent>;
    }
    export class ImageBasedSliderPropertyGridComponent extends React.Component<IImageBasedSliderPropertyGridComponentProps> {
        constructor(props: IImageBasedSliderPropertyGridComponentProps);
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        interface IGridPropertyGridComponentProps {
        grid: BABYLON.GUI.Grid;
        lockObject: BABYLON.NodeEditor.SharedUIComponents.LockObject;
        onPropertyChangedObservable?: BABYLON.Observable<BABYLON.NodeEditor.SharedUIComponents.PropertyChangedEvent>;
    }
    export class GridPropertyGridComponent extends React.Component<IGridPropertyGridComponentProps> {
        constructor(props: IGridPropertyGridComponentProps);
        renderRows(): import("react/jsx-runtime").JSX.Element[];
        renderColumns(): import("react/jsx-runtime").JSX.Element[];
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        interface IEllipsePropertyGridComponentProps {
        ellipse: BABYLON.GUI.Ellipse;
        lockObject: BABYLON.NodeEditor.SharedUIComponents.LockObject;
        onPropertyChangedObservable?: BABYLON.Observable<BABYLON.NodeEditor.SharedUIComponents.PropertyChangedEvent>;
    }
    export class EllipsePropertyGridComponent extends React.Component<IEllipsePropertyGridComponentProps> {
        constructor(props: IEllipsePropertyGridComponentProps);
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        interface IControlPropertyGridComponentProps {
        control: BABYLON.GUI.Control;
        lockObject: BABYLON.NodeEditor.SharedUIComponents.LockObject;
        onPropertyChangedObservable?: BABYLON.Observable<BABYLON.NodeEditor.SharedUIComponents.PropertyChangedEvent>;
    }
    export class ControlPropertyGridComponent extends React.Component<IControlPropertyGridComponentProps> {
        constructor(props: IControlPropertyGridComponentProps);
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        interface ICommonControlPropertyGridComponentProps {
        controls?: BABYLON.GUI.Control[];
        control?: BABYLON.GUI.Control;
        lockObject: BABYLON.NodeEditor.SharedUIComponents.LockObject;
        onPropertyChangedObservable?: BABYLON.Observable<BABYLON.NodeEditor.SharedUIComponents.PropertyChangedEvent>;
    }
    export class CommonControlPropertyGridComponent extends React.Component<ICommonControlPropertyGridComponentProps> {
        constructor(props: ICommonControlPropertyGridComponentProps);
        renderGridInformation(control: BABYLON.GUI.Control): import("react/jsx-runtime").JSX.Element | null;
        render(): import("react/jsx-runtime").JSX.Element | undefined;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        interface IColorPickerPropertyGridComponentProps {
        colorPicker: BABYLON.GUI.ColorPicker;
        lockObject: BABYLON.NodeEditor.SharedUIComponents.LockObject;
        onPropertyChangedObservable?: BABYLON.Observable<BABYLON.NodeEditor.SharedUIComponents.PropertyChangedEvent>;
    }
    export class ColorPickerPropertyGridComponent extends React.Component<IColorPickerPropertyGridComponentProps> {
        constructor(props: IColorPickerPropertyGridComponentProps);
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        interface ICheckboxPropertyGridComponentProps {
        checkbox: BABYLON.GUI.Checkbox;
        lockObject: BABYLON.NodeEditor.SharedUIComponents.LockObject;
        onPropertyChangedObservable?: BABYLON.Observable<BABYLON.NodeEditor.SharedUIComponents.PropertyChangedEvent>;
    }
    export class CheckboxPropertyGridComponent extends React.Component<ICheckboxPropertyGridComponentProps> {
        constructor(props: ICheckboxPropertyGridComponentProps);
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        /**
     * Splitter component properties
     */
    export interface ISplitterProps {
        /**
         * Unique identifier
         */
        id?: string;
        /**
         * Splitter size
         */
        size: number;
        /**
         * Minimum size for the controlled element
         */
        minSize?: number;
        /**
         * Maximum size for the controlled element
         */
        maxSize?: number;
        /**
         * Initial size for the controlled element
         */
        initialSize?: number;
        /**
         * Defines the controlled side
         */
        controlledSide: BABYLON.NodeEditor.SharedUIComponents.ControlledSize;
        /**
         * refObject to the splitter element
         */
        refObject?: React.RefObject<HTMLDivElement>;
    }
    /**
     * Creates a splitter component
     * @param props defines the splitter properties
     * @returns the splitter component
     */
    export var Splitter: React.FC<ISplitterProps>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export enum ControlledSize {
        First = 0,
        Second = 1
    }
    export enum SplitDirection {
        Horizontal = 0,
        Vertical = 1
    }
    /**
     * Context used to share data with splitters
     */
    export interface ISplitContext {
        /**
         * Split direction
         */
        direction: SplitDirection;
        /**
         * Function called by splitters to update the offset
         * @param offset new offet
         * @param source source element
         * @param controlledSide defined controlled element
         */
        drag: (offset: number, source: HTMLElement, controlledSide: ControlledSize) => void;
        /**
         * Function called by splitters to begin dragging
         */
        beginDrag: () => void;
        /**
         * Function called by splitters to end dragging
         */
        endDrag: () => void;
        /**
         * Sync sizes for the elements
         * @param source source element
         * @param controlledSide defined controlled element
         * @param size size of the controlled element
         * @param minSize minimum size for the controlled element
         * @param maxSize maximum size for the controlled element
         */
        sync: (source: HTMLElement, controlledSide: ControlledSize, size?: number, minSize?: number, maxSize?: number) => void;
    }
    export var SplitContext: import("react").Context<ISplitContext>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        /**
     * Split container properties
     */
    export interface ISplitContainerProps {
        /**
         * Unique identifier
         */
        id?: string;
        /**
         * Split direction
         */
        direction: BABYLON.NodeEditor.SharedUIComponents.SplitDirection;
        /**
         * Minimum size for the floating elements
         */
        floatingMinSize?: number;
        /**
         * RefObject to the root div element
         */
        containerRef?: React.RefObject<HTMLDivElement>;
        /**
         * Optional class name
         */
        className?: string;
        /**
         * Pointer down
         * @param event pointer events
         */
        onPointerDown?: (event: React.PointerEvent) => void;
        /**
         * Pointer move
         * @param event pointer events
         */
        onPointerMove?: (event: React.PointerEvent) => void;
        /**
         * Pointer up
         * @param event pointer events
         */
        onPointerUp?: (event: React.PointerEvent) => void;
        /**
         * Drop
         * @param event drag events
         */
        onDrop?: (event: React.DragEvent<HTMLDivElement>) => void;
        /**
         * Drag over
         * @param event drag events
         */
        onDragOver?: (event: React.DragEvent<HTMLDivElement>) => void;
    }
    /**
     * Creates a split container component
     * @param props defines the split container properties
     * @returns the split container component
     */
    export var SplitContainer: React.FC<React.PropsWithChildren<ISplitContainerProps>>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export class TypeLedger {
        static PortDataBuilder: (port: BABYLON.NodeEditor.SharedUIComponents.NodePort, nodeContainer: BABYLON.NodeEditor.SharedUIComponents.INodeContainer) => BABYLON.NodeEditor.SharedUIComponents.IPortData;
        static NodeDataBuilder: (data: any, nodeContainer: BABYLON.NodeEditor.SharedUIComponents.INodeContainer) => BABYLON.NodeEditor.SharedUIComponents.INodeData;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export const IsFramePortData: (variableToCheck: any) => variableToCheck is BABYLON.NodeEditor.SharedUIComponents.FramePortData;
    export const RefreshNode: (node: BABYLON.NodeEditor.SharedUIComponents.GraphNode, visitedNodes?: Set<BABYLON.NodeEditor.SharedUIComponents.GraphNode>, visitedLinks?: Set<BABYLON.NodeEditor.SharedUIComponents.NodeLink>, canvas?: BABYLON.NodeEditor.SharedUIComponents.GraphCanvasComponent) => void;
    export const BuildFloatUI: (container: HTMLDivElement, document: Document, displayName: string, isInteger: boolean, source: any, propertyName: string, onChange: () => void, min?: number, max?: number, visualPropertiesRefresh?: Array<() => void>, additionalClassName?: string) => void;
    export function GetListOfAcceptedTypes<T extends Record<string, string | number>>(types: T, allValue: number, autoDetectValue: number, port: {
        acceptedConnectionPointTypes: number[];
        excludedConnectionPointTypes: number[];
        type: number;
    }, skips?: number[]): string[];
    export function GetConnectionErrorMessage<T extends Record<string, string | number>>(sourceType: number, types: T, allValue: number, autoDetectValue: number, port: {
        acceptedConnectionPointTypes: number[];
        excludedConnectionPointTypes: number[];
        type: number;
    }, skips?: number[]): string;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export class StateManager {
        data: any;
        hostDocument: Document;
        lockObject: any;
        modalIsDisplayed: boolean;
        historyStack: BABYLON.NodeEditor.SharedUIComponents.HistoryStack;
        onSearchBoxRequiredObservable: BABYLON.Observable<{
            x: number;
            y: number;
        }>;
        onSelectionChangedObservable: BABYLON.Observable<BABYLON.Nullable<BABYLON.NodeEditor.SharedUIComponents.ISelectionChangedOptions>>;
        onFrameCreatedObservable: BABYLON.Observable<BABYLON.NodeEditor.SharedUIComponents.GraphFrame>;
        onUpdateRequiredObservable: BABYLON.Observable<any>;
        onGraphNodeRemovalObservable: BABYLON.Observable<BABYLON.NodeEditor.SharedUIComponents.GraphNode>;
        onSelectionBoxMoved: BABYLON.Observable<ClientRect | DOMRect>;
        onCandidateLinkMoved: BABYLON.Observable<BABYLON.Nullable<BABYLON.Vector2>>;
        onCandidatePortSelectedObservable: BABYLON.Observable<BABYLON.Nullable<BABYLON.NodeEditor.SharedUIComponents.FrameNodePort | BABYLON.NodeEditor.SharedUIComponents.NodePort>>;
        onNewNodeCreatedObservable: BABYLON.Observable<BABYLON.NodeEditor.SharedUIComponents.GraphNode>;
        onRebuildRequiredObservable: BABYLON.Observable<void>;
        onNodeMovedObservable: BABYLON.Observable<BABYLON.NodeEditor.SharedUIComponents.GraphNode>;
        onErrorMessageDialogRequiredObservable: BABYLON.Observable<string>;
        onExposePortOnFrameObservable: BABYLON.Observable<BABYLON.NodeEditor.SharedUIComponents.GraphNode>;
        onGridSizeChanged: BABYLON.Observable<void>;
        onNewBlockRequiredObservable: BABYLON.Observable<{
            type: string;
            targetX: number;
            targetY: number;
            needRepositioning?: boolean;
            smartAdd?: boolean;
        }>;
        onHighlightNodeObservable: BABYLON.Observable<{
            data: any;
            active: boolean;
        }>;
        onPreviewCommandActivated: BABYLON.Observable<boolean>;
        exportData: (data: any, frame?: BABYLON.Nullable<BABYLON.NodeEditor.SharedUIComponents.GraphFrame>) => string;
        isElbowConnectionAllowed: (nodeA: BABYLON.NodeEditor.SharedUIComponents.FrameNodePort | BABYLON.NodeEditor.SharedUIComponents.NodePort, nodeB: BABYLON.NodeEditor.SharedUIComponents.FrameNodePort | BABYLON.NodeEditor.SharedUIComponents.NodePort) => boolean;
        isDebugConnectionAllowed: (nodeA: BABYLON.NodeEditor.SharedUIComponents.FrameNodePort | BABYLON.NodeEditor.SharedUIComponents.NodePort, nodeB: BABYLON.NodeEditor.SharedUIComponents.FrameNodePort | BABYLON.NodeEditor.SharedUIComponents.NodePort) => boolean;
        applyNodePortDesign: (data: BABYLON.NodeEditor.SharedUIComponents.IPortData, element: HTMLElement, imgHost: HTMLImageElement, pip: HTMLDivElement) => boolean;
        getPortColor: (portData: BABYLON.NodeEditor.SharedUIComponents.IPortData) => string;
        storeEditorData: (serializationObject: any, frame?: BABYLON.Nullable<BABYLON.NodeEditor.SharedUIComponents.GraphFrame>) => void;
        getEditorDataMap: () => {
            [key: number]: number;
        };
        getScene?: () => BABYLON.Scene;
        createDefaultInputData: (rootData: any, portData: BABYLON.NodeEditor.SharedUIComponents.IPortData, nodeContainer: BABYLON.NodeEditor.SharedUIComponents.INodeContainer) => BABYLON.Nullable<{
            data: BABYLON.NodeEditor.SharedUIComponents.INodeData;
            name: string;
        }>;
        private _isRebuildQueued;
        queueRebuildCommand(): void;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export interface ISearchBoxComponentProps {
        stateManager: BABYLON.NodeEditor.SharedUIComponents.StateManager;
    }
    /**
     * The search box component.
     */
    export class SearchBoxComponent extends React.Component<ISearchBoxComponentProps, {
        isVisible: boolean;
        filter: string;
        selectedIndex: number;
    }> {
        private _handleEscKey;
        private _targetX;
        private _targetY;
        private _nodes;
        constructor(props: ISearchBoxComponentProps);
        hide(): void;
        onFilterChange(evt: React.ChangeEvent<HTMLInputElement>): void;
        onNewNodeRequested(name: string): void;
        onKeyDown(evt: React.KeyboardEvent): void;
        renderFluent(): import("react/jsx-runtime").JSX.Element;
        renderOriginal(): import("react/jsx-runtime").JSX.Element | null;
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export class PropertyLedger {
        static DefaultControl: React.ComponentClass<BABYLON.NodeEditor.SharedUIComponents.IPropertyComponentProps>;
        static RegisteredControls: {
            [key: string]: React.ComponentClass<BABYLON.NodeEditor.SharedUIComponents.IPropertyComponentProps>;
        };
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export class NodePort {
        portData: IPortData;
        node: BABYLON.NodeEditor.SharedUIComponents.GraphNode;
        protected _element: HTMLDivElement;
        protected _portContainer: HTMLElement;
        protected _imgHost: HTMLImageElement;
        protected _pip: HTMLDivElement;
        protected _stateManager: BABYLON.NodeEditor.SharedUIComponents.StateManager;
        protected _portLabelElement: Element;
        protected _onCandidateLinkMovedObserver: BABYLON.Nullable<BABYLON.Observer<BABYLON.Nullable<BABYLON.Vector2>>>;
        protected _onSelectionChangedObserver: BABYLON.Nullable<BABYLON.Observer<BABYLON.Nullable<BABYLON.NodeEditor.SharedUIComponents.ISelectionChangedOptions>>>;
        protected _exposedOnFrame: boolean;
        protected _portUIcontainer?: HTMLDivElement;
        delegatedPort: BABYLON.Nullable<BABYLON.NodeEditor.SharedUIComponents.FrameNodePort>;
        get element(): HTMLDivElement;
        get container(): HTMLElement;
        get portName(): string;
        set portName(newName: string);
        get disabled(): boolean;
        hasLabel(): boolean;
        get exposedOnFrame(): boolean;
        set exposedOnFrame(value: boolean);
        get exposedPortPosition(): number;
        set exposedPortPosition(value: number);
        private _isConnectedToNodeOutsideOfFrame;
        refresh(): void;
        constructor(portContainer: HTMLElement, portData: IPortData, node: BABYLON.NodeEditor.SharedUIComponents.GraphNode, stateManager: BABYLON.NodeEditor.SharedUIComponents.StateManager, portUIcontainer?: HTMLDivElement);
        dispose(): void;
        static CreatePortElement(portData: IPortData, node: BABYLON.NodeEditor.SharedUIComponents.GraphNode, root: HTMLElement, displayManager: BABYLON.Nullable<BABYLON.NodeEditor.SharedUIComponents.IDisplayManager>, stateManager: BABYLON.NodeEditor.SharedUIComponents.StateManager): NodePort;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export class NodeLink {
        private _graphCanvas;
        private _portA;
        private _portB?;
        private _nodeA;
        private _nodeB?;
        private _path;
        private _selectionPath;
        private _onSelectionChangedObserver;
        private _isVisible;
        private _isTargetCandidate;
        private _gradient;
        onDisposedObservable: BABYLON.Observable<NodeLink>;
        get isTargetCandidate(): boolean;
        set isTargetCandidate(value: boolean);
        get isVisible(): boolean;
        set isVisible(value: boolean);
        get portA(): BABYLON.NodeEditor.SharedUIComponents.FrameNodePort | BABYLON.NodeEditor.SharedUIComponents.NodePort;
        get portB(): BABYLON.NodeEditor.SharedUIComponents.FrameNodePort | BABYLON.NodeEditor.SharedUIComponents.NodePort | undefined;
        get nodeA(): BABYLON.NodeEditor.SharedUIComponents.GraphNode;
        get nodeB(): BABYLON.NodeEditor.SharedUIComponents.GraphNode | undefined;
        intersectsWith(rect: DOMRect): boolean;
        update(endX?: number, endY?: number, straight?: boolean): void;
        get path(): SVGPathElement;
        get selectionPath(): SVGPathElement;
        constructor(graphCanvas: BABYLON.NodeEditor.SharedUIComponents.GraphCanvasComponent, portA: BABYLON.NodeEditor.SharedUIComponents.NodePort, nodeA: BABYLON.NodeEditor.SharedUIComponents.GraphNode, portB?: BABYLON.NodeEditor.SharedUIComponents.NodePort, nodeB?: BABYLON.NodeEditor.SharedUIComponents.GraphNode);
        onClick(evt: MouseEvent): void;
        dispose(notify?: boolean): void;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export class NodeLedger {
        static RegisteredNodeNames: string[];
        static NameFormatter: (name: string) => string;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export class GraphNode {
        content: BABYLON.NodeEditor.SharedUIComponents.INodeData;
        private static _IdGenerator;
        private _visual;
        private _headerContainer;
        private _headerIcon;
        private _headerIconImg;
        private _headerCollapseImg;
        private _header;
        private _headerCollapse;
        private _connections;
        private _optionsContainer;
        private _inputsContainer;
        private _outputsContainer;
        private _content;
        private _comments;
        private _executionTime;
        private _selectionBorder;
        private _inputPorts;
        private _outputPorts;
        private _links;
        private _x;
        private _y;
        private _gridAlignedX;
        private _gridAlignedY;
        private _mouseStartPointX;
        private _mouseStartPointY;
        private _stateManager;
        private _onSelectionChangedObserver;
        private _onSelectionBoxMovedObserver;
        private _onFrameCreatedObserver;
        private _onUpdateRequiredObserver;
        private _onHighlightNodeObserver;
        private _ownerCanvas;
        private _displayManager;
        private _isVisible;
        private _enclosingFrameId;
        private _visualPropertiesRefresh;
        private _lastClick;
        addClassToVisual(className: string): void;
        removeClassFromVisual(className: string): void;
        get isCollapsed(): boolean;
        get isVisible(): boolean;
        set isVisible(value: boolean);
        private _upateNodePortNames;
        get outputPorts(): BABYLON.NodeEditor.SharedUIComponents.NodePort[];
        get inputPorts(): BABYLON.NodeEditor.SharedUIComponents.NodePort[];
        get links(): BABYLON.NodeEditor.SharedUIComponents.NodeLink[];
        get gridAlignedX(): number;
        get gridAlignedY(): number;
        get x(): number;
        set x(value: number);
        get y(): number;
        set y(value: number);
        get width(): number;
        get height(): number;
        get id(): number;
        get name(): string;
        get enclosingFrameId(): number;
        set enclosingFrameId(value: number);
        setIsSelected(value: boolean, marqueeSelection: boolean): void;
        get rootElement(): HTMLDivElement;
        constructor(content: BABYLON.NodeEditor.SharedUIComponents.INodeData, stateManager: BABYLON.NodeEditor.SharedUIComponents.StateManager);
        isOverlappingFrame(frame: BABYLON.NodeEditor.SharedUIComponents.GraphFrame): boolean;
        getPortForPortData(portData: BABYLON.NodeEditor.SharedUIComponents.IPortData): BABYLON.NodeEditor.SharedUIComponents.NodePort | null;
        getPortDataForPortDataContent(data: any): BABYLON.NodeEditor.SharedUIComponents.IPortData | null;
        getLinksForPortDataContent(data: any): BABYLON.NodeEditor.SharedUIComponents.NodeLink[];
        getLinksForPortData(portData: BABYLON.NodeEditor.SharedUIComponents.IPortData): BABYLON.NodeEditor.SharedUIComponents.NodeLink[];
        private _refreshFrames;
        _refreshLinks(): void;
        refresh(): void;
        private _expand;
        private _searchMiddle;
        private _onDown;
        cleanAccumulation(useCeil?: boolean): void;
        private _onUp;
        private _onMove;
        renderProperties(): BABYLON.Nullable<JSX.Element>;
        _forceRebuild(source: any, propertyName: string, notifiers?: BABYLON.IEditablePropertyOption["notifiers"]): void;
        private _isCollapsed;
        /**
         * Collapse the node
         */
        collapse(): void;
        /**
         * Expand the node
         */
        expand(): void;
        private _portUICount;
        private _buildInputPorts;
        appendVisual(root: HTMLDivElement, owner: BABYLON.NodeEditor.SharedUIComponents.GraphCanvasComponent): void;
        dispose(): void;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export enum FramePortPosition {
        Top = 0,
        Middle = 1,
        Bottom = 2
    }
    export class GraphFrame {
        private readonly _collapsedWidth;
        private static _FrameCounter;
        private static _FramePortCounter;
        private _name;
        private _color;
        private _x;
        private _y;
        private _gridAlignedX;
        private _gridAlignedY;
        private _width;
        private _height;
        element: HTMLDivElement;
        private _borderElement;
        private _headerElement;
        private _headerTextElement;
        private _headerCollapseElement;
        private _headerCloseElement;
        private _headerFocusElement;
        private _commentsElement;
        private _portContainer;
        private _outputPortContainer;
        private _inputPortContainer;
        private _nodes;
        private _ownerCanvas;
        private _mouseStartPointX;
        private _mouseStartPointY;
        private _onSelectionChangedObserver;
        private _onGraphNodeRemovalObserver;
        private _onExposePortOnFrameObserver;
        private _onNodeLinkDisposedObservers;
        private _isCollapsed;
        private _frameInPorts;
        private _frameOutPorts;
        private _controlledPorts;
        private _exposedInPorts;
        private _exposedOutPorts;
        private _id;
        private _comments;
        private _frameIsResizing;
        private _resizingDirection;
        private _minFrameHeight;
        private _minFrameWidth;
        private _mouseXLimit;
        onExpandStateChanged: BABYLON.Observable<GraphFrame>;
        private readonly _closeSVG;
        private readonly _expandSVG;
        private readonly _collapseSVG;
        private readonly _focusSVG;
        get id(): number;
        get isCollapsed(): boolean;
        private _createInputPort;
        private _markFramePortPositions;
        private _createFramePorts;
        private _removePortFromExposedWithNode;
        private _removePortFromExposedWithLink;
        private _createInputPorts;
        private _createOutputPorts;
        redrawFramePorts(): void;
        set isCollapsed(value: boolean);
        get nodes(): BABYLON.NodeEditor.SharedUIComponents.GraphNode[];
        get ports(): BABYLON.NodeEditor.SharedUIComponents.FrameNodePort[];
        get name(): string;
        set name(value: string);
        get color(): BABYLON.Color3;
        set color(value: BABYLON.Color3);
        get x(): number;
        set x(value: number);
        get y(): number;
        set y(value: number);
        get width(): number;
        set width(value: number);
        get height(): number;
        set height(value: number);
        get comments(): string;
        set comments(comments: string);
        constructor(candidate: BABYLON.Nullable<HTMLDivElement>, canvas: BABYLON.NodeEditor.SharedUIComponents.GraphCanvasComponent, doNotCaptureNodes?: boolean);
        private _isFocused;
        /**
         * Enter/leave focus mode
         */
        switchFocusMode(): void;
        refresh(): void;
        addNode(node: BABYLON.NodeEditor.SharedUIComponents.GraphNode): void;
        removeNode(node: BABYLON.NodeEditor.SharedUIComponents.GraphNode): void;
        syncNode(node: BABYLON.NodeEditor.SharedUIComponents.GraphNode): void;
        cleanAccumulation(): void;
        private _onDown;
        move(newX: number, newY: number, align?: boolean): void;
        private _onUp;
        _moveFrame(offsetX: number, offsetY: number): void;
        private _onMove;
        moveFramePortUp(nodePort: BABYLON.NodeEditor.SharedUIComponents.FrameNodePort): void;
        private _movePortUp;
        moveFramePortDown(nodePort: BABYLON.NodeEditor.SharedUIComponents.FrameNodePort): void;
        private _movePortDown;
        private _initResizing;
        private _cleanUpResizing;
        private _updateMinHeightWithComments;
        private _isResizingTop;
        private _isResizingRight;
        private _isResizingBottom;
        private _isResizingLeft;
        private _onRightHandlePointerDown;
        private _onRightHandlePointerMove;
        private _moveRightHandle;
        private _onRightHandlePointerUp;
        private _onBottomHandlePointerDown;
        private _onBottomHandlePointerMove;
        private _moveBottomHandle;
        private _onBottomHandlePointerUp;
        private _onLeftHandlePointerDown;
        private _onLeftHandlePointerMove;
        private _moveLeftHandle;
        private _onLeftHandlePointerUp;
        private _onTopHandlePointerDown;
        private _onTopHandlePointerMove;
        private _moveTopHandle;
        private _onTopHandlePointerUp;
        private _onTopRightHandlePointerDown;
        private _onTopRightHandlePointerMove;
        private _moveTopRightHandle;
        private _onTopRightHandlePointerUp;
        private _onBottomRightHandlePointerDown;
        private _onBottomRightHandlePointerMove;
        private _moveBottomRightHandle;
        private _onBottomRightHandlePointerUp;
        private _onBottomLeftHandlePointerDown;
        private _onBottomLeftHandlePointerMove;
        private _moveBottomLeftHandle;
        private _onBottomLeftHandlePointerUp;
        private _onTopLeftHandlePointerDown;
        private _onTopLeftHandlePointerMove;
        private _moveTopLeftHandle;
        private _onTopLeftHandlePointerUp;
        private _expandLeft;
        private _expandTop;
        private _expandRight;
        private _expandBottom;
        dispose(): void;
        private _serializePortData;
        serialize(saveCollapsedState: boolean): BABYLON.NodeEditor.SharedUIComponents.IFrameData;
        export(): void;
        adjustPorts(): void;
        static Parse(serializationData: BABYLON.NodeEditor.SharedUIComponents.IFrameData, canvas: BABYLON.NodeEditor.SharedUIComponents.GraphCanvasComponent, map?: {
            [key: number]: number;
        }): GraphFrame;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export interface IGraphCanvasComponentProps {
        stateManager: BABYLON.NodeEditor.SharedUIComponents.StateManager;
        onEmitNewNode: (nodeData: BABYLON.NodeEditor.SharedUIComponents.INodeData) => BABYLON.NodeEditor.SharedUIComponents.GraphNode;
    }
    export class GraphCanvasComponent extends React.Component<IGraphCanvasComponentProps> implements BABYLON.NodeEditor.SharedUIComponents.INodeContainer {
        static readonly NodeWidth = 100;
        private readonly _minZoom;
        private readonly _maxZoom;
        private _hostCanvasRef;
        private _hostCanvas;
        private _graphCanvasRef;
        private _graphCanvas;
        private _selectionContainerRef;
        private _selectionContainer;
        private _frameContainerRef;
        private _frameContainer;
        private _svgCanvasRef;
        private _svgCanvas;
        private _rootContainerRef;
        private _rootContainer;
        private _nodes;
        private _links;
        private _mouseStartPointX;
        private _mouseStartPointY;
        private _dropPointX;
        private _dropPointY;
        private _selectionStartX;
        private _selectionStartY;
        private _candidateLinkedHasMoved;
        private _x;
        private _y;
        private _lastx;
        private _lasty;
        private _zoom;
        private _selectedNodes;
        private _selectedLink;
        private _selectedPort;
        private _candidateLink;
        private _candidatePort;
        private _gridSize;
        private _selectionBox;
        private _selectedFrames;
        private _frameCandidate;
        private _frames;
        private _nodeDataContentList;
        private _altKeyIsPressed;
        private _shiftKeyIsPressed;
        private _multiKeyIsPressed;
        private _oldY;
        _frameIsMoving: boolean;
        _isLoading: boolean;
        _targetLinkCandidate: BABYLON.Nullable<BABYLON.NodeEditor.SharedUIComponents.NodeLink>;
        private _copiedNodes;
        private _copiedFrames;
        get gridSize(): number;
        set gridSize(value: number);
        get stateManager(): BABYLON.NodeEditor.SharedUIComponents.StateManager;
        get nodes(): BABYLON.NodeEditor.SharedUIComponents.GraphNode[];
        get links(): BABYLON.NodeEditor.SharedUIComponents.NodeLink[];
        get frames(): BABYLON.NodeEditor.SharedUIComponents.GraphFrame[];
        get zoom(): number;
        set zoom(value: number);
        get x(): number;
        set x(value: number);
        get y(): number;
        set y(value: number);
        get selectedNodes(): BABYLON.NodeEditor.SharedUIComponents.GraphNode[];
        get selectedLink(): BABYLON.Nullable<BABYLON.NodeEditor.SharedUIComponents.NodeLink>;
        get selectedFrames(): BABYLON.NodeEditor.SharedUIComponents.GraphFrame[];
        get selectedPort(): BABYLON.Nullable<BABYLON.NodeEditor.SharedUIComponents.NodePort>;
        get canvasContainer(): HTMLDivElement;
        get hostCanvas(): HTMLDivElement;
        get svgCanvas(): HTMLElement;
        get selectionContainer(): HTMLDivElement;
        get frameContainer(): HTMLDivElement;
        private _selectedFrameAndNodesConflict;
        constructor(props: IGraphCanvasComponentProps);
        populateConnectedEntriesBeforeRemoval(item: BABYLON.NodeEditor.SharedUIComponents.GraphNode, items: BABYLON.NodeEditor.SharedUIComponents.GraphNode[], inputs: BABYLON.Nullable<BABYLON.NodeEditor.SharedUIComponents.IPortData>[], outputs: BABYLON.Nullable<BABYLON.NodeEditor.SharedUIComponents.IPortData>[]): void;
        automaticRewire(inputs: BABYLON.Nullable<BABYLON.NodeEditor.SharedUIComponents.IPortData>[], outputs: BABYLON.Nullable<BABYLON.NodeEditor.SharedUIComponents.IPortData>[], firstOnly?: boolean): void;
        smartAddOverLink(node: BABYLON.NodeEditor.SharedUIComponents.GraphNode, link: BABYLON.NodeEditor.SharedUIComponents.NodeLink): void;
        smartAddOverNode(node: BABYLON.NodeEditor.SharedUIComponents.GraphNode, source: BABYLON.NodeEditor.SharedUIComponents.GraphNode): void;
        deleteSelection(onRemove: (nodeData: BABYLON.NodeEditor.SharedUIComponents.INodeData) => void, autoReconnect?: boolean): void;
        handleKeyDown(evt: KeyboardEvent, onRemove: (nodeData: BABYLON.NodeEditor.SharedUIComponents.INodeData) => void, mouseLocationX: number, mouseLocationY: number, dataGenerator: (nodeData: BABYLON.NodeEditor.SharedUIComponents.INodeData) => any, rootElement: HTMLDivElement): void;
        pasteSelection(copiedNodes: BABYLON.NodeEditor.SharedUIComponents.GraphNode[], currentX: number, currentY: number, dataGenerator: (nodeData: BABYLON.NodeEditor.SharedUIComponents.INodeData) => any, selectNew?: boolean): BABYLON.NodeEditor.SharedUIComponents.GraphNode[];
        reconnectNewNodes(nodeIndex: number, newNodes: BABYLON.NodeEditor.SharedUIComponents.GraphNode[], sourceNodes: BABYLON.NodeEditor.SharedUIComponents.GraphNode[], done: boolean[]): void;
        getCachedData(): any[];
        removeDataFromCache(data: any): void;
        createNodeFromObject(nodeData: BABYLON.NodeEditor.SharedUIComponents.INodeData, onNodeCreated: (data: any) => void, recursion?: boolean): BABYLON.NodeEditor.SharedUIComponents.GraphNode;
        getGridPosition(position: number, useCeil?: boolean): number;
        getGridPositionCeil(position: number): number;
        updateTransform(): void;
        onKeyUp(): void;
        findNodeFromData(data: any): BABYLON.NodeEditor.SharedUIComponents.GraphNode;
        reset(): void;
        connectPorts(pointA: BABYLON.NodeEditor.SharedUIComponents.IPortData, pointB: BABYLON.NodeEditor.SharedUIComponents.IPortData): void;
        removeLink(link: BABYLON.NodeEditor.SharedUIComponents.NodeLink): void;
        appendNode(nodeData: BABYLON.NodeEditor.SharedUIComponents.INodeData): BABYLON.NodeEditor.SharedUIComponents.GraphNode;
        distributeGraph(): void;
        componentDidMount(): void;
        onMove(evt: React.PointerEvent): void;
        onDown(evt: React.PointerEvent<HTMLElement>): void;
        onUp(evt: React.PointerEvent): void;
        onWheel(evt: React.WheelEvent): void;
        zoomToFit(): void;
        processCandidatePort(): void;
        connectNodes(nodeA: BABYLON.NodeEditor.SharedUIComponents.GraphNode, pointA: BABYLON.NodeEditor.SharedUIComponents.IPortData, nodeB: BABYLON.NodeEditor.SharedUIComponents.GraphNode, pointB: BABYLON.NodeEditor.SharedUIComponents.IPortData): void;
        drop(newNode: BABYLON.NodeEditor.SharedUIComponents.GraphNode, targetX: number, targetY: number, offsetX: number, offsetY: number): void;
        processEditorData(editorData: BABYLON.NodeEditor.SharedUIComponents.IEditorData): void;
        reOrganize(editorData?: BABYLON.Nullable<BABYLON.NodeEditor.SharedUIComponents.IEditorData>, isImportingAFrame?: boolean): void;
        addFrame(frameData: BABYLON.NodeEditor.SharedUIComponents.IFrameData): void;
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export class FrameNodePort extends BABYLON.NodeEditor.SharedUIComponents.NodePort {
        portData: BABYLON.NodeEditor.SharedUIComponents.IPortData;
        node: BABYLON.NodeEditor.SharedUIComponents.GraphNode;
        private _parentFrameId;
        private _isInput;
        private _framePortPosition;
        private _framePortId;
        private _onFramePortPositionChangedObservable;
        get parentFrameId(): number;
        get onFramePortPositionChangedObservable(): BABYLON.Observable<FrameNodePort>;
        get isInput(): boolean;
        get framePortId(): number;
        get framePortPosition(): BABYLON.NodeEditor.SharedUIComponents.FramePortPosition;
        set framePortPosition(position: BABYLON.NodeEditor.SharedUIComponents.FramePortPosition);
        constructor(portContainer: HTMLElement, portData: BABYLON.NodeEditor.SharedUIComponents.IPortData, node: BABYLON.NodeEditor.SharedUIComponents.GraphNode, stateManager: BABYLON.NodeEditor.SharedUIComponents.StateManager, isInput: boolean, framePortId: number, parentFrameId: number);
        static CreateFrameNodePortElement(portData: BABYLON.NodeEditor.SharedUIComponents.IPortData, node: BABYLON.NodeEditor.SharedUIComponents.GraphNode, root: HTMLElement, displayManager: BABYLON.Nullable<BABYLON.NodeEditor.SharedUIComponents.IDisplayManager>, stateManager: BABYLON.NodeEditor.SharedUIComponents.StateManager, isInput: boolean, framePortId: number, parentFrameId: number): FrameNodePort;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export class DisplayLedger {
        static RegisteredControls: {
            [key: string]: any;
        };
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        /**
     * Function used to force a rebuild of the node system
     * @param source source object
     * @param stateManager defines the state manager to use
     * @param propertyName name of the property that has been changed
     * @param notifiers list of notifiers to use
     */
    export function ForceRebuild(source: any, stateManager: BABYLON.NodeEditor.SharedUIComponents.StateManager, propertyName: string, notifiers?: BABYLON.IEditablePropertyOption["notifiers"]): void;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export type FramePortData = {
        frame: BABYLON.NodeEditor.SharedUIComponents.GraphFrame;
        port: BABYLON.NodeEditor.SharedUIComponents.FrameNodePort;
    };



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export interface ISelectionChangedOptions {
        selection: BABYLON.Nullable<BABYLON.NodeEditor.SharedUIComponents.GraphNode | BABYLON.NodeEditor.SharedUIComponents.NodeLink | BABYLON.NodeEditor.SharedUIComponents.GraphFrame | BABYLON.NodeEditor.SharedUIComponents.NodePort | BABYLON.NodeEditor.SharedUIComponents.FramePortData>;
        forceKeepSelection?: boolean;
        marqueeSelection?: boolean;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export interface IPropertyComponentProps {
        stateManager: BABYLON.NodeEditor.SharedUIComponents.StateManager;
        nodeData: BABYLON.NodeEditor.SharedUIComponents.INodeData;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export enum PortDataDirection {
        /** Input */
        Input = 0,
        /** Output */
        Output = 1
    }
    export enum PortDirectValueTypes {
        Float = 0,
        Int = 1
    }
    export interface IPortDirectValueDefinition {
        /**
         * Gets the source object
         */
        source: any;
        /**
         * Gets the property name used to store the value
         */
        propertyName: string;
        /**
         * Gets or sets the min value accepted for this point if nothing is connected
         */
        valueMin: BABYLON.Nullable<any>;
        /**
         * Gets or sets the max value accepted for this point if nothing is connected
         */
        valueMax: BABYLON.Nullable<any>;
        /**
         * Gets or sets the type of the value
         */
        valueType: PortDirectValueTypes;
    }
    export interface IPortData {
        data: any;
        name: string;
        internalName: string;
        isExposedOnFrame: boolean;
        exposedPortPosition: number;
        isConnected: boolean;
        direction: PortDataDirection;
        ownerData: any;
        connectedPort: BABYLON.Nullable<IPortData>;
        needDualDirectionValidation: boolean;
        hasEndpoints: boolean;
        endpoints: BABYLON.Nullable<IPortData[]>;
        directValueDefinition?: IPortDirectValueDefinition;
        updateDisplayName: (newName: string) => void;
        canConnectTo: (port: IPortData) => boolean;
        connectTo: (port: IPortData) => void;
        disconnectFrom: (port: IPortData) => void;
        checkCompatibilityState(port: IPortData): number;
        getCompatibilityIssueMessage(issue: number, targetNode: BABYLON.NodeEditor.SharedUIComponents.GraphNode, targetPort: IPortData): string;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export interface INodeLocationInfo {
        blockId: number;
        x: number;
        y: number;
        isCollapsed: boolean;
    }
    export interface IFrameData {
        x: number;
        y: number;
        width: number;
        height: number;
        color: number[];
        name: string;
        isCollapsed: boolean;
        blocks: number[];
        comments: string;
    }
    export interface IEditorData {
        locations: INodeLocationInfo[];
        x: number;
        y: number;
        zoom: number;
        frames?: IFrameData[];
        map?: {
            [key: number]: number;
        };
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export interface INodeData {
        data: any;
        name: string;
        uniqueId: number;
        isInput: boolean;
        comments: string;
        executionTime?: number;
        refreshCallback?: () => void;
        prepareHeaderIcon: (iconDiv: HTMLDivElement, img: HTMLImageElement) => void;
        getClassName: () => string;
        dispose: () => void;
        getPortByName: (name: string) => BABYLON.Nullable<BABYLON.NodeEditor.SharedUIComponents.IPortData>;
        inputs: BABYLON.NodeEditor.SharedUIComponents.IPortData[];
        outputs: BABYLON.NodeEditor.SharedUIComponents.IPortData[];
        invisibleEndpoints?: BABYLON.Nullable<any[]>;
        isConnectedToOutput?: () => boolean;
        isActive?: boolean;
        setIsActive?: (value: boolean) => void;
        canBeActivated?: boolean;
        onInputCountChanged?: () => void;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export interface INodeContainer {
        nodes: BABYLON.NodeEditor.SharedUIComponents.GraphNode[];
        appendNode(data: BABYLON.NodeEditor.SharedUIComponents.INodeData): BABYLON.NodeEditor.SharedUIComponents.GraphNode;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export interface VisualContentDescription {
        [key: string]: HTMLElement;
    }
    export interface IDisplayManager {
        getHeaderClass(data: BABYLON.NodeEditor.SharedUIComponents.INodeData): string;
        shouldDisplayPortLabels(data: BABYLON.NodeEditor.SharedUIComponents.IPortData): boolean;
        updatePreviewContent(data: BABYLON.NodeEditor.SharedUIComponents.INodeData, contentArea: HTMLDivElement): void;
        updateFullVisualContent?(data: BABYLON.NodeEditor.SharedUIComponents.INodeData, visualContent: VisualContentDescription): void;
        getBackgroundColor(data: BABYLON.NodeEditor.SharedUIComponents.INodeData): string;
        getHeaderText(data: BABYLON.NodeEditor.SharedUIComponents.INodeData): string;
        onSelectionChanged?(data: BABYLON.NodeEditor.SharedUIComponents.INodeData, selectedData: BABYLON.Nullable<BABYLON.NodeEditor.SharedUIComponents.INodeData>, manager: BABYLON.NodeEditor.SharedUIComponents.StateManager): void;
        onDispose?(nodeData: BABYLON.NodeEditor.SharedUIComponents.INodeData, manager: BABYLON.NodeEditor.SharedUIComponents.StateManager): void;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        interface IVector4LineComponentProps {
        label: string;
        target?: any;
        propertyName?: string;
        step?: number;
        onChange?: (newvalue: BABYLON.Vector4) => void;
        useEuler?: boolean;
        onPropertyChangedObservable?: BABYLON.Observable<BABYLON.NodeEditor.SharedUIComponents.PropertyChangedEvent>;
        icon?: string;
        iconLabel?: string;
        value?: BABYLON.Vector4;
        lockObject: BABYLON.NodeEditor.SharedUIComponents.LockObject;
    }
    export class Vector4LineComponent extends React.Component<IVector4LineComponentProps, {
        isExpanded: boolean;
        value: BABYLON.Vector4;
    }> {
        static defaultProps: {
            step: number;
        };
        private _localChange;
        constructor(props: IVector4LineComponentProps);
        getCurrentValue(): any;
        shouldComponentUpdate(nextProps: IVector4LineComponentProps, nextState: {
            isExpanded: boolean;
            value: BABYLON.Vector4;
        }): boolean;
        switchExpandState(): void;
        raiseOnPropertyChanged(previousValue: BABYLON.Vector4): void;
        updateVector4(): void;
        updateStateX(value: number): void;
        updateStateY(value: number): void;
        updateStateZ(value: number): void;
        updateStateW(value: number): void;
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        interface IVector3LineComponentProps {
        label: string;
        target?: any;
        propertyName?: string;
        step?: number;
        onChange?: (newvalue: BABYLON.Vector3) => void;
        useEuler?: boolean;
        onPropertyChangedObservable?: BABYLON.Observable<BABYLON.NodeEditor.SharedUIComponents.PropertyChangedEvent>;
        noSlider?: boolean;
        icon?: string;
        iconLabel?: string;
        lockObject: BABYLON.NodeEditor.SharedUIComponents.LockObject;
        directValue?: BABYLON.Vector3;
        additionalCommands?: JSX.Element[];
    }
    export class Vector3LineComponent extends React.Component<IVector3LineComponentProps, {
        isExpanded: boolean;
        value: BABYLON.Vector3;
    }> {
        static defaultProps: {
            step: number;
        };
        private _localChange;
        constructor(props: IVector3LineComponentProps);
        getCurrentValue(): any;
        shouldComponentUpdate(nextProps: IVector3LineComponentProps, nextState: {
            isExpanded: boolean;
            value: BABYLON.Vector3;
        }): boolean;
        switchExpandState(): void;
        raiseOnPropertyChanged(previousValue: BABYLON.Vector3): void;
        updateVector3(): void;
        updateStateX(value: number): void;
        updateStateY(value: number): void;
        updateStateZ(value: number): void;
        onCopyClick(): string;
        renderFluent(): import("react/jsx-runtime").JSX.Element;
        renderOriginal(): import("react/jsx-runtime").JSX.Element;
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        interface IVector2LineComponentProps {
        label: string;
        target: any;
        propertyName: string;
        step?: number;
        onChange?: (newvalue: BABYLON.Vector2) => void;
        onPropertyChangedObservable?: BABYLON.Observable<BABYLON.NodeEditor.SharedUIComponents.PropertyChangedEvent>;
        icon?: string;
        iconLabel?: string;
        lockObject: BABYLON.NodeEditor.SharedUIComponents.LockObject;
    }
    export class Vector2LineComponent extends React.Component<IVector2LineComponentProps, {
        isExpanded: boolean;
        value: BABYLON.Vector2;
    }> {
        static defaultProps: {
            step: number;
        };
        private _localChange;
        constructor(props: IVector2LineComponentProps);
        shouldComponentUpdate(nextProps: IVector2LineComponentProps, nextState: {
            isExpanded: boolean;
            value: BABYLON.Vector2;
        }): boolean;
        switchExpandState(): void;
        raiseOnPropertyChanged(previousValue: BABYLON.Vector2): void;
        updateStateX(value: number): void;
        updateStateY(value: number): void;
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        interface IValueLineComponentProps {
        label: string;
        value: number;
        color?: string;
        fractionDigits?: number;
        units?: string;
        icon?: string;
        iconLabel?: string;
    }
    export class ValueLineComponent extends React.Component<IValueLineComponentProps> {
        constructor(props: IValueLineComponentProps);
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        interface IUnitButtonProps {
        unit: string;
        locked?: boolean;
        onClick?: (unit: string) => void;
    }
    export function UnitButton(props: IUnitButtonProps): import("react/jsx-runtime").JSX.Element;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        interface ITextureButtonLineProps {
        label: string;
        scene: BABYLON.Scene;
        onClick: (file: File) => void;
        onLink: (texture: BABYLON.BaseTexture) => void;
        accept: string;
    }
    interface ITextureButtonLineState {
        isOpen: boolean;
    }
    export class TextureButtonLine extends React.Component<ITextureButtonLineProps, ITextureButtonLineState> {
        private static _IdGenerator;
        private _id;
        private _uploadInputRef;
        constructor(props: ITextureButtonLineProps);
        onChange(evt: any): void;
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        interface ITextLineComponentProps {
        label?: string;
        value?: string;
        color?: string;
        underline?: boolean;
        onLink?: () => void;
        url?: string;
        ignoreValue?: boolean;
        additionalClass?: string;
        icon?: string;
        iconLabel?: string;
        tooltip?: string;
        onCopy?: true | (() => string);
    }
    export class TextLineComponent extends React.Component<ITextLineComponentProps> {
        constructor(props: ITextLineComponentProps);
        onLink(): void;
        copyFn(): (() => string) | undefined;
        renderContent(isLink: boolean, tooltip: string): import("react/jsx-runtime").JSX.Element | null;
        renderOriginal(isLink: boolean, tooltip: string): import("react/jsx-runtime").JSX.Element;
        renderFluent(isLink: boolean, tooltip: string): import("react/jsx-runtime").JSX.Element;
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export interface ITextInputLineComponentProps {
        label?: string;
        lockObject?: BABYLON.NodeEditor.SharedUIComponents.LockObject;
        target?: any;
        propertyName?: string;
        value?: string;
        onChange?: (value: string) => void;
        onPropertyChangedObservable?: BABYLON.Observable<BABYLON.NodeEditor.SharedUIComponents.PropertyChangedEvent>;
        icon?: string;
        iconLabel?: string;
        noUnderline?: boolean;
        numbersOnly?: boolean;
        delayInput?: boolean;
        arrows?: boolean;
        arrowsIncrement?: (amount: number) => void;
        step?: number;
        numeric?: boolean;
        roundValues?: boolean;
        min?: number;
        max?: number;
        placeholder?: string;
        unit?: React.ReactNode;
        validator?: (value: string) => boolean;
        multilines?: boolean;
        throttlePropertyChangedNotification?: boolean;
        throttlePropertyChangedNotificationDelay?: number;
        disabled?: boolean;
    }
    export class TextInputLineComponent extends React.Component<ITextInputLineComponentProps, {
        value: string;
        dragging: boolean;
    }> {
        private _localChange;
        constructor(props: ITextInputLineComponentProps);
        componentWillUnmount(): void;
        shouldComponentUpdate(nextProps: ITextInputLineComponentProps, nextState: {
            value: string;
            dragging: boolean;
        }): boolean;
        raiseOnPropertyChanged(newValue: string, previousValue: string): void;
        getCurrentNumericValue(value: string): number;
        updateValue(value: string, valueToValidate?: string): void;
        incrementValue(amount: number): void;
        onKeyDown(event: React.KeyboardEvent): void;
        renderFluent(value: string, placeholder: string, step: number): import("react/jsx-runtime").JSX.Element;
        renderOriginal(value: string, placeholder: string, step: number): import("react/jsx-runtime").JSX.Element;
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export const conflictingValuesPlaceholder = "\u2014";
    /**
     *
     * @param targets a list of selected targets
     * @param onPropertyChangedObservable
     * @param getProperty
     * @returns a proxy object that can be passed as a target into the input
     */
    export function makeTargetsProxy<Type>(targets: Type[], onPropertyChangedObservable?: BABYLON.Observable<BABYLON.NodeEditor.SharedUIComponents.PropertyChangedEvent>, getProperty?: (target: Type, property: keyof Type) => any): any;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        interface ISliderLineComponentProps {
        label: string;
        target?: any;
        propertyName?: string;
        minimum: number;
        maximum: number;
        step: number;
        directValue?: number;
        useEuler?: boolean;
        onChange?: (value: number) => void;
        onInput?: (value: number) => void;
        onPropertyChangedObservable?: BABYLON.Observable<BABYLON.NodeEditor.SharedUIComponents.PropertyChangedEvent>;
        decimalCount?: number;
        margin?: boolean;
        icon?: string;
        iconLabel?: string;
        lockObject: BABYLON.NodeEditor.SharedUIComponents.LockObject;
        unit?: React.ReactNode;
        allowOverflow?: boolean;
    }
    export class SliderLineComponent extends React.Component<ISliderLineComponentProps, {
        value: number;
    }> {
        private _localChange;
        constructor(props: ISliderLineComponentProps);
        shouldComponentUpdate(nextProps: ISliderLineComponentProps, nextState: {
            value: number;
        }): boolean;
        onChange(newValueString: any): void;
        onInput(newValueString: any): void;
        prepareDataToRead(value: number): number;
        onCopyClick(): void;
        renderFluent(): import("react/jsx-runtime").JSX.Element;
        renderOriginal(): import("react/jsx-runtime").JSX.Element;
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        interface IRadioButtonLineComponentProps {
        onSelectionChangedObservable: BABYLON.Observable<RadioButtonLineComponent>;
        label: string;
        isSelected: () => boolean;
        onSelect: () => void;
        icon?: string;
        iconLabel?: string;
    }
    export class RadioButtonLineComponent extends React.Component<IRadioButtonLineComponentProps, {
        isSelected: boolean;
    }> {
        private _onSelectionChangedObserver;
        constructor(props: IRadioButtonLineComponentProps);
        componentDidMount(): void;
        componentWillUnmount(): void;
        onChange(): void;
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export var Null_Value: number;
    export interface IOptionsLineProps {
        label: string;
        target: any;
        propertyName: string;
        options: readonly BABYLON.IInspectableOptions[];
        noDirectUpdate?: boolean;
        onSelect?: (value: number | string) => void;
        extractValue?: (target: any) => number | string;
        onPropertyChangedObservable?: BABYLON.Observable<BABYLON.NodeEditor.SharedUIComponents.PropertyChangedEvent>;
        allowNullValue?: boolean;
        icon?: string;
        iconLabel?: string;
        className?: string;
        valuesAreStrings?: boolean;
        defaultIfNull?: number;
    }
    export class OptionsLine extends React.Component<IOptionsLineProps, {
        value: number | string;
    }> {
        private _localChange;
        private _remapValueIn;
        private _remapValueOut;
        private _getValue;
        constructor(props: IOptionsLineProps);
        shouldComponentUpdate(nextProps: IOptionsLineProps, nextState: {
            value: number;
        }): boolean;
        raiseOnPropertyChanged(newValue: number, previousValue: number): void;
        setValue(value: string | number): void;
        updateValue(valueString: string): void;
        onCopyClickStr(): string;
        private _renderFluent;
        private _renderOriginal;
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        interface INumericInputProps {
        label: string;
        labelTooltip?: string;
        value: number;
        step?: number;
        onChange: (value: number) => void;
        precision?: number;
        icon?: string;
        iconLabel?: string;
        lockObject: BABYLON.NodeEditor.SharedUIComponents.LockObject;
    }
    export class NumericInput extends React.Component<INumericInputProps, {
        value: string;
    }> {
        static defaultProps: {
            step: number;
        };
        private _localChange;
        constructor(props: INumericInputProps);
        componentWillUnmount(): void;
        shouldComponentUpdate(nextProps: INumericInputProps, nextState: {
            value: string;
        }): boolean;
        updateValue(valueString: string): void;
        onBlur(): void;
        incrementValue(amount: number): void;
        onKeyDown(evt: React.KeyboardEvent<HTMLInputElement>): void;
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        interface IMessageLineComponentProps {
        text: string;
        color?: string;
        icon?: any;
    }
    export class MessageLineComponent extends React.Component<IMessageLineComponentProps> {
        constructor(props: IMessageLineComponentProps);
        renderFluent(): import("react/jsx-runtime").JSX.Element;
        renderOriginal(): import("react/jsx-runtime").JSX.Element;
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        interface IMatrixLineComponentProps {
        label: string;
        target: any;
        propertyName: string;
        step?: number;
        onChange?: (newValue: BABYLON.Matrix) => void;
        onModeChange?: (mode: number) => void;
        onPropertyChangedObservable?: BABYLON.Observable<BABYLON.NodeEditor.SharedUIComponents.PropertyChangedEvent>;
        mode?: number;
        lockObject: BABYLON.NodeEditor.SharedUIComponents.LockObject;
    }
    export class MatrixLineComponent extends React.Component<IMatrixLineComponentProps, {
        value: BABYLON.Matrix;
        mode: number;
        angle: number;
    }> {
        private _localChange;
        constructor(props: IMatrixLineComponentProps);
        shouldComponentUpdate(nextProps: IMatrixLineComponentProps, nextState: {
            value: BABYLON.Matrix;
            mode: number;
            angle: number;
        }): boolean;
        raiseOnPropertyChanged(previousValue: BABYLON.Vector3): void;
        updateMatrix(): void;
        updateRow(value: BABYLON.Vector4, row: number): void;
        updateBasedOnMode(value: number): void;
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        interface ILinkButtonComponentProps {
        label: string;
        buttonLabel: string;
        url?: string;
        onClick: () => void;
        icon?: any;
        onIconClick?: () => void;
    }
    export class LinkButtonComponent extends React.Component<ILinkButtonComponentProps> {
        constructor(props: ILinkButtonComponentProps);
        onLink(): void;
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        interface ILineWithFileButtonComponentProps {
        title: string;
        closed?: boolean;
        multiple?: boolean;
        label: string;
        iconImage: any;
        onIconClick: (file: File) => void;
        accept: string;
        uploadName?: string;
    }
    export class LineWithFileButtonComponent extends React.Component<ILineWithFileButtonComponentProps, {
        isExpanded: boolean;
    }> {
        private _uploadRef;
        constructor(props: ILineWithFileButtonComponentProps);
        onChange(evt: any): void;
        switchExpandedState(): void;
        renderFluent(): import("react/jsx-runtime").JSX.Element;
        renderOriginal(): import("react/jsx-runtime").JSX.Element;
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        interface ILineContainerComponentProps {
        selection?: BABYLON.NodeEditor.SharedUIComponents.ISelectedLineContainer;
        title: string;
        children: any[] | any;
        closed?: boolean;
    }
    export class LineContainerComponent extends React.Component<ILineContainerComponentProps, {
        isExpanded: boolean;
        isHighlighted: boolean;
    }> {
        constructor(props: ILineContainerComponentProps);
        switchExpandedState(): void;
        renderHeader(): import("react/jsx-runtime").JSX.Element;
        componentDidMount(): void;
        renderFluent(): import("react/jsx-runtime").JSX.Element;
        renderOriginal(): import("react/jsx-runtime").JSX.Element;
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        interface IInputArrowsComponentProps {
        incrementValue: (amount: number) => void;
        setDragging: (dragging: boolean) => void;
    }
    export class InputArrowsComponent extends React.Component<IInputArrowsComponentProps> {
        private _arrowsRef;
        private _drag;
        private _releaseListener;
        private _lockChangeListener;
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        interface IIndentedTextLineComponentProps {
        value?: string;
        color?: string;
        underline?: boolean;
        onLink?: () => void;
        url?: string;
        additionalClass?: string;
    }
    export class IndentedTextLineComponent extends React.Component<IIndentedTextLineComponentProps> {
        constructor(props: IIndentedTextLineComponentProps);
        onLink(): void;
        renderContent(): import("react/jsx-runtime").JSX.Element;
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        interface IIconComponentProps {
        icon: string;
        label?: string;
    }
    export class IconComponent extends React.Component<IIconComponentProps> {
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export interface ISelectedLineContainer {
        selectedLineContainerTitles: Array<string>;
        selectedLineContainerTitlesNoFocus: Array<string>;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        interface IHexLineComponentProps {
        label: string;
        target: any;
        propertyName: string;
        lockObject?: BABYLON.NodeEditor.SharedUIComponents.LockObject;
        onChange?: (newValue: number) => void;
        isInteger?: boolean;
        replaySourceReplacement?: string;
        onPropertyChangedObservable?: BABYLON.Observable<BABYLON.NodeEditor.SharedUIComponents.PropertyChangedEvent>;
        additionalClass?: string;
        step?: string;
        digits?: number;
        useEuler?: boolean;
        min?: number;
        icon?: string;
        iconLabel?: string;
    }
    export class HexLineComponent extends React.Component<IHexLineComponentProps, {
        value: string;
    }> {
        private _localChange;
        private _store;
        private _propertyChange;
        constructor(props: IHexLineComponentProps);
        componentWillUnmount(): void;
        shouldComponentUpdate(nextProps: IHexLineComponentProps, nextState: {
            value: string;
        }): boolean;
        raiseOnPropertyChanged(newValue: number, previousValue: number): void;
        convertToHexString(valueString: string): string;
        updateValue(valueString: string, raisePropertyChanged: boolean): void;
        lock(): void;
        unlock(): void;
        onCopyClick(): void;
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        interface IFloatLineComponentProps {
        label: string;
        target: any;
        propertyName: string;
        lockObject: BABYLON.NodeEditor.SharedUIComponents.LockObject;
        onChange?: (newValue: number) => void;
        isInteger?: boolean;
        onPropertyChangedObservable?: BABYLON.Observable<BABYLON.NodeEditor.SharedUIComponents.PropertyChangedEvent>;
        additionalClass?: string;
        step?: string;
        digits?: number;
        useEuler?: boolean;
        min?: number;
        max?: number;
        smallUI?: boolean;
        onEnter?: (newValue: number) => void;
        icon?: string;
        iconLabel?: string;
        defaultValue?: number;
        arrows?: boolean;
        unit?: React.ReactNode;
        onDragStart?: (newValue: number) => void;
        onDragStop?: (newValue: number) => void;
        disabled?: boolean;
    }
    export class FloatLineComponent extends React.Component<IFloatLineComponentProps, {
        value: string;
        dragging: boolean;
    }> {
        private _localChange;
        private _store;
        constructor(props: IFloatLineComponentProps);
        componentWillUnmount(): void;
        getValueString(value: any, props: IFloatLineComponentProps): string;
        shouldComponentUpdate(nextProps: IFloatLineComponentProps, nextState: {
            value: string;
            dragging: boolean;
        }): boolean;
        raiseOnPropertyChanged(newValue: number, previousValue: number): void;
        updateValue(valueString: string): void;
        lock(): void;
        unlock(): void;
        incrementValue(amount: number, processStep?: boolean): void;
        onKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void;
        onCopyClick(): void;
        renderFluent(): import("react/jsx-runtime").JSX.Element;
        renderOriginal(): import("react/jsx-runtime").JSX.Element;
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        interface IFileMultipleButtonLineComponentProps {
        label: string;
        onClick: (event: any) => void;
        accept: string;
        icon?: string;
        iconLabel?: string;
    }
    export class FileMultipleButtonLineComponent extends React.Component<IFileMultipleButtonLineComponentProps> {
        private static _IdGenerator;
        private _id;
        private _uploadInputRef;
        constructor(props: IFileMultipleButtonLineComponentProps);
        onChange(evt: any): void;
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        interface IFileButtonLineProps {
        label: string;
        onClick: (file: File) => void;
        accept: string;
        icon?: string;
        iconLabel?: string;
    }
    export class FileButtonLine extends React.Component<IFileButtonLineProps> {
        private static _IdGenerator;
        private _id;
        private _uploadInputRef;
        constructor(props: IFileButtonLineProps);
        onChange(evt: any): void;
        renderFluent(): import("react/jsx-runtime").JSX.Element;
        renderOriginal(): import("react/jsx-runtime").JSX.Element;
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export type DraggableLineWithButtonProps = {
        format: string;
        data: string;
        tooltip: string;
        iconImage: any;
        onIconClick: (value: string) => void;
        iconTitle: string;
        lenSuffixToRemove?: number;
    };
    export var DraggableLineWithButtonComponent: React.FunctionComponent<DraggableLineWithButtonProps>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        type DraggableLineComponentProps = Omit<BABYLON.NodeEditor.SharedUIComponents.DraggableLineProps, "label">;
    export var DraggableLineComponent: React.FunctionComponent<DraggableLineComponentProps>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export interface IColorPickerLineProps {
        value: BABYLON.Color4 | BABYLON.Color3;
        linearHint?: boolean;
        onColorChanged: (newOne: string) => void;
        icon?: string;
        iconLabel?: string;
        shouldPopRight?: boolean;
        lockObject?: BABYLON.NodeEditor.SharedUIComponents.LockObject;
    }
    interface IColorPickerComponentState {
        pickerEnabled: boolean;
        color: BABYLON.Color3 | BABYLON.Color4;
        hex: string;
    }
    export class ColorPickerLine extends React.Component<IColorPickerLineProps, IColorPickerComponentState> {
        private _floatRef;
        private _floatHostRef;
        constructor(props: IColorPickerLineProps);
        syncPositions(): void;
        shouldComponentUpdate(nextProps: IColorPickerLineProps, nextState: IColorPickerComponentState): boolean;
        getHexString(props?: Readonly<IColorPickerLineProps>): string;
        componentDidUpdate(): void;
        componentDidMount(): void;
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export interface IColorLineProps {
        label: string;
        target?: any;
        propertyName: string;
        onPropertyChangedObservable?: BABYLON.Observable<BABYLON.NodeEditor.SharedUIComponents.PropertyChangedEvent>;
        onChange?: () => void;
        isLinear?: boolean;
        icon?: string;
        iconLabel?: string;
        disableAlpha?: boolean;
        lockObject: BABYLON.NodeEditor.SharedUIComponents.LockObject;
    }
    interface IColorLineComponentState {
        isExpanded: boolean;
        color: BABYLON.Color4;
    }
    export class ColorLine extends React.Component<IColorLineProps, IColorLineComponentState> {
        constructor(props: IColorLineProps);
        shouldComponentUpdate(nextProps: IColorLineProps, nextState: IColorLineComponentState): boolean;
        getValue(props?: Readonly<IColorLineProps>): BABYLON.Color4;
        setColorFromString(colorString: string): void;
        setColor(newColor: BABYLON.Color4): void;
        switchExpandState(): void;
        updateStateR(value: number): void;
        updateStateG(value: number): void;
        updateStateB(value: number): void;
        updateStateA(value: number): void;
        private _convertToColor;
        private _toColor3;
        onCopyClick(): void;
        renderFluent(): import("react/jsx-runtime").JSX.Element;
        renderOriginal(): import("react/jsx-runtime").JSX.Element;
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export interface IColor4LineComponentProps {
        label: string;
        target?: any;
        propertyName: string;
        onPropertyChangedObservable?: BABYLON.Observable<BABYLON.NodeEditor.SharedUIComponents.PropertyChangedEvent>;
        onChange?: () => void;
        isLinear?: boolean;
        icon?: string;
        iconLabel?: string;
        lockObject: BABYLON.NodeEditor.SharedUIComponents.LockObject;
    }
    export class Color4LineComponent extends React.Component<IColor4LineComponentProps> {
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export interface IColor3LineComponentProps {
        label: string;
        target: any;
        propertyName: string;
        onPropertyChangedObservable?: BABYLON.Observable<BABYLON.NodeEditor.SharedUIComponents.PropertyChangedEvent>;
        isLinear?: boolean;
        icon?: string;
        lockObject: BABYLON.NodeEditor.SharedUIComponents.LockObject;
        iconLabel?: string;
        onChange?: () => void;
    }
    export class Color3LineComponent extends React.Component<IColor3LineComponentProps> {
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export interface ICheckBoxLineComponentProps {
        label?: string;
        target?: any;
        propertyName?: string;
        isSelected?: boolean | (() => boolean);
        onSelect?: (value: boolean) => void;
        onValueChanged?: () => void;
        onPropertyChangedObservable?: BABYLON.Observable<BABYLON.NodeEditor.SharedUIComponents.PropertyChangedEvent>;
        disabled?: boolean;
        icon?: string;
        iconLabel?: string;
        faIcons?: {
            enabled: any;
            disabled: any;
        };
        large?: boolean;
    }
    export class CheckBoxLineComponent extends React.Component<ICheckBoxLineComponentProps, {
        isSelected: boolean;
        isDisabled?: boolean;
        isConflict: boolean;
    }> {
        private _localChange;
        constructor(props: ICheckBoxLineComponentProps);
        shouldComponentUpdate(nextProps: ICheckBoxLineComponentProps, nextState: {
            isSelected: boolean;
            isDisabled: boolean;
            isConflict: boolean;
        }): boolean;
        onChange(): void;
        onCopyClick(): void;
        renderOriginal(): import("react/jsx-runtime").JSX.Element;
        renderFluent(): import("react/jsx-runtime").JSX.Element;
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export interface IButtonLineComponentProps {
        label: string;
        onClick: () => void;
        icon?: string;
        iconLabel?: string;
        isDisabled?: boolean;
    }
    export class ButtonLineComponent extends React.Component<IButtonLineComponentProps> {
        constructor(props: IButtonLineComponentProps);
        renderFluent(): import("react/jsx-runtime").JSX.Element;
        renderOriginal(): import("react/jsx-runtime").JSX.Element;
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export interface IBooleanLineComponentProps {
        label: string;
        value: boolean;
        icon?: string;
        iconLabel?: string;
    }
    export class BooleanLineComponent extends React.Component<IBooleanLineComponentProps> {
        constructor(props: IBooleanLineComponentProps);
        renderFluent(): import("react/jsx-runtime").JSX.Element;
        renderOriginal(): import("react/jsx-runtime").JSX.Element;
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export type TextareaProps = BABYLON.NodeEditor.SharedUIComponents.PrimitiveProps<string> & {
        placeholder?: string;
    };
    /**
     * This is a texarea box that stops propagation of change/keydown events
     * @param props
     * @returns
     */
    export var Textarea: React.FunctionComponent<TextareaProps>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export type SyncedSliderProps = BABYLON.NodeEditor.SharedUIComponents.PrimitiveProps<number> & {
        /** Minimum value for the slider */
        min?: number;
        /** Maximum value for the slider */
        max?: number;
        /** Step size for the slider */
        step?: number;
        /** When true, onChange is only called when the user releases the slider, not during drag */
        notifyOnlyOnRelease?: boolean;
    };
    /**
     * Component which synchronizes a slider and an input field, allowing the user to change the value using either control
     * @param props
     * @returns SyncedSlider component
     */
    export var SyncedSliderInput: React.FunctionComponent<SyncedSliderProps>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export type SwitchProps = BABYLON.NodeEditor.SharedUIComponents.PrimitiveProps<boolean>;
    /**
     * This is a primitive fluent boolean switch component whose only knowledge is the shared styling across all tools
     * @param props
     * @returns Switch component
     */
    export var Switch: React.FunctionComponent<SwitchProps>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export type SpinButtonProps = BABYLON.NodeEditor.SharedUIComponents.PrimitiveProps<number> & {
        precision?: number;
        step?: number;
        min?: number;
        max?: number;
    };
    export var SpinButton: React.FunctionComponent<SpinButtonProps>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        type SearchBoxProps = {
        items: string[];
        onItemSelected: (item: string) => void;
        title?: string;
    };
    /**
     * SearchBox component that displays a popup with search functionality
     * @param props - The component props
     * @returns The search box component
     */
    export var SearchBox: React.FunctionComponent<SearchBoxProps>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        type SearchProps = {
        onChange: (val: string) => void;
        placeholder?: string;
    };
    export var SearchBar: import("react").ForwardRefExoticComponent<SearchProps & import("react").RefAttributes<HTMLInputElement>>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export type ImmutablePrimitiveProps<ValueT> = {
        /**
         * The value of the property to be displayed and modified.
         */
        value: ValueT;
        /**
         * Optional flag to disable the component, preventing any interaction.
         */
        disabled?: boolean;
        /**
         * Optional class name to apply custom styles to the component.
         */
        className?: string;
        /**
         * Optional title for the component, used for tooltips or accessibility.
         */
        title?: string;
    };
    export type PrimitiveProps<T> = ImmutablePrimitiveProps<T> & {
        /**
         * Called when the primitive value changes
         */
        onChange: (value: T) => void;
    };



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        type PositionedPopoverProps = {
        x: number;
        y: number;
        visible: boolean;
        hide: () => void;
    };
    /**
     * PositionedPopover component that shows a popover at specific coordinates
     * @param props - The component props
     * @returns The positioned popover component
     */
    export var PositionedPopover: React.FunctionComponent<React.PropsWithChildren<PositionedPopoverProps>>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        type MessageBarProps = {
        message: string;
        title: string;
        docLink?: string;
        intent: "info" | "success" | "warning" | "error";
    };
    export var MessageBar: React.FunctionComponent<MessageBarProps>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        /**
     * Represents an item in a list
     */
    export type ListItem<T = any> = {
        /** Unique identifier for the item */
        id: number;
        /** The data associated with the item */
        data: T;
        /** Value to use for sorting the list */
        sortBy: number;
    };
    type ListProps<T = any> = {
        items: ListItem<T>[];
        renderItem: (item: ListItem<T>, index: number) => React.ReactNode;
        onDelete: (item: ListItem<T>, index: number) => void;
        onAdd: (item?: ListItem<T>) => void;
        addButtonLabel?: string;
    };
    /**
     * For cases where you may want to add / remove items from a list via a trash can button / copy button, this HOC can be used
     * @returns A React component that renders a list of items with add/delete functionality
     * @param props - The properties for the List component
     */
    export var List: React.FunctionComponent<ListProps<any>>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
    


}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        type LazyComponentProps = {
        spinnerSize?: any;
        spinnerLabel?: string;
    };
    /**
     * Creates a lazy component wrapper that only calls the async function to get the underlying component when the lazy component is actually mounted.
     * This allows deferring imports until they are needed. While the underlying component is being loaded, a spinner is displayed.
     * @param getComponentAsync A function that returns a promise resolving to the component.
     * @param defaultProps Options for the loading spinner.
     * @returns A React component that displays a spinner while loading the async component.
     */
    export function MakeLazyComponent<ComponentT extends React.ComponentType<any>>(getComponentAsync: () => Promise<ComponentT>, defaultProps?: LazyComponentProps): import("react").ForwardRefExoticComponent<import("react").PropsWithoutRef<React.ComponentProps<ComponentT> & LazyComponentProps> & import("react").RefAttributes<React.ElementRef<ComponentT | import("@fluentui/react-utilities").ForwardRefComponent<any>>>>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export type InputProps<T extends string | number> = BABYLON.NodeEditor.SharedUIComponents.PrimitiveProps<T> & {
        step?: number;
        placeholder?: string;
        min?: number;
        max?: number;
    };
    export var NumberInput: React.FunctionComponent<InputProps<number>>;
    export var TextInput: React.FunctionComponent<InputProps<string>>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        /**
     * Component wrapper for BABYLON.FactorGradient that provides slider inputs for factor1, factor2, and gradient step
     * @param props - Component props containing BABYLON.FactorGradient value and change handler
     * @returns A React component
     */
    export var FactorGradientComponent: React.FunctionComponent<BABYLON.NodeEditor.SharedUIComponents.PrimitiveProps<BABYLON.FactorGradient>>;
    /**
     * Component wrapper for BABYLON.Color3Gradient that provides color picker and gradient step slider
     * @param props - Component props containing BABYLON.Color3Gradient value and change handler
     * @returns A React component
     */
    export var Color3GradientComponent: React.FunctionComponent<BABYLON.NodeEditor.SharedUIComponents.PrimitiveProps<BABYLON.Color3Gradient>>;
    /**
     * Component wrapper for BABYLON.ColorGradient that provides color pickers for color1, color2, and gradient step slider
     * @param props - Component props containing BABYLON.ColorGradient value and change handler
     * @returns A React component
     */
    export var Color4GradientComponent: React.FunctionComponent<BABYLON.NodeEditor.SharedUIComponents.PrimitiveProps<BABYLON.ColorGradient>>;
    /**
     * Component wrapper for BABYLON.GradientBlockColorStep that provides color picker and step slider
     * @param props - Component props containing BABYLON.GradientBlockColorStep value and change handler
     * @returns A React component
     */
    export var ColorStepGradientComponent: React.FunctionComponent<BABYLON.NodeEditor.SharedUIComponents.PrimitiveProps<BABYLON.GradientBlockColorStep>>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        type DropdownOptionValue = string | number;
    export type AcceptedDropdownValue = BABYLON.Nullable<DropdownOptionValue> | undefined;
    export type DropdownOption = {
        /**
         * Defines the visible part of the option
         */
        label: string;
        /**
         * Defines the value part of the option
         */
        value: DropdownOptionValue;
    };
    export type DropdownProps<V extends AcceptedDropdownValue> = BABYLON.NodeEditor.SharedUIComponents.PrimitiveProps<V> & {
        options: readonly DropdownOption[];
        includeNullAs?: "null" | "undefined";
    };
    /**
     * Renders a fluent UI dropdown component for the options passed in, and an additional 'Not Defined' option if null is set to true
     * This component can handle both null and undefined values
     * @param props
     * @returns dropdown component
     */
    export var Dropdown: React.FunctionComponent<DropdownProps<AcceptedDropdownValue>>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export type DraggableLineProps = {
        format: string;
        data: string;
        tooltip: string;
        label: string;
        onDelete?: () => void;
    };
    export var DraggableLine: React.FunctionComponent<DraggableLineProps>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export type ComboBoxProps = {
        label: string;
        value: string[];
        onChange: (value: string) => void;
    };
    /**
     * Wrapper around a Fluent ComboBox that allows for filtering options
     * @param props
     * @returns
     */
    export var ComboBox: React.FunctionComponent<ComboBoxProps>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export type ColorPickerProps<C extends BABYLON.Color3 | BABYLON.Color4> = {
        isLinearMode?: boolean;
    } & BABYLON.NodeEditor.SharedUIComponents.PrimitiveProps<C>;
    export var ColorPickerPopup: React.FunctionComponent<ColorPickerProps<BABYLON.Color3 | BABYLON.Color4>>;
    type HsvKey = "h" | "s" | "v";
    export type InputHexProps = BABYLON.NodeEditor.SharedUIComponents.PrimitiveProps<BABYLON.Color3 | BABYLON.Color4> & {
        label?: string;
        linearHex?: boolean;
        isLinearMode?: boolean;
    };
    /**
     * Component which displays the passed in color's HEX value, either in linearSpace (if linearHex is true) or in gamma space
     * When the hex color is changed by user, component calculates the new BABYLON.Color3/4 value and calls onChange
     *
     * Component uses the isLinearMode boolean to display an informative label regarding linear / gamma space
     * @param props - The properties for the InputHexField component.
     * @returns
     */
    export var InputHexField: React.FunctionComponent<InputHexProps>;
    type InputHsvFieldProps = {
        color: BABYLON.Color3 | BABYLON.Color4;
        label: string;
        hsvKey: HsvKey;
        onChange: (color: BABYLON.Color3 | BABYLON.Color4) => void;
        max: number;
        scale?: number;
    };
    /**
     * In the HSV (Hue, Saturation, Value) color model, Hue (H) ranges from 0 to 360 degrees, representing the color's position on the color wheel.
     * Saturation (S) ranges from 0 to 100%, indicating the intensity or purity of the color, with 0 being shades of gray and 100 being a fully saturated color.
     * Value (V) ranges from 0 to 100%, representing the brightness of the color, with 0 being black and 100 being the brightest.
     * @param props - The properties for the InputHsvField component.
     */
    export var InputHsvField: React.FunctionComponent<InputHsvFieldProps>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        /**
     * This is a primitive fluent checkbox that can both read and write checked state
     * @param props
     * @returns Checkbox component
     */
    export var Checkbox: React.FunctionComponent<BABYLON.NodeEditor.SharedUIComponents.PrimitiveProps<boolean>>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export type ButtonProps = {
        onClick: () => void;
        icon?: any;
        label: string;
        disabled?: boolean;
    };
    export var Button: React.FunctionComponent<ButtonProps>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export type AccordionSectionProps = {
        title: string;
        collapseByDefault?: boolean;
    };
    export var AccordionSection: React.FunctionComponent<React.PropsWithChildren<AccordionSectionProps>>;
    export var Accordion: React.FunctionComponent<React.PropsWithChildren>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export type PaneProps = {
        title: string;
        icon?: any;
    };
    export var Pane: React.FunctionComponent<React.PropsWithChildren<PaneProps>>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        type GradientListProps<T extends BABYLON.FactorGradient | BABYLON.Color3Gradient | BABYLON.ColorGradient> = {
        label: string;
        gradients: BABYLON.Nullable<Array<T>>;
        addGradient: (step?: T) => void;
        removeGradient: (step: T) => void;
        onChange: (newGradient: T) => void;
    };
    export var FactorGradientList: React.FunctionComponent<GradientListProps<BABYLON.FactorGradient>>;
    export var Color3GradientList: React.FunctionComponent<GradientListProps<BABYLON.Color3Gradient>>;
    export var Color4GradientList: React.FunctionComponent<GradientListProps<BABYLON.ColorGradient>>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export type ToolHostProps = {
        /**
         * Allows host to pass in a theme
         */
        customTheme?: any;
        /**
         * Can be set to true to disable the copy button in the tool's property lines. Default is false (copy enabled)
         */
        disableCopy?: boolean;
        /**
         * Name of the tool displayed in the UX
         */
        toolName: string;
    };
    export var ToolContext: import("react").Context<{
        readonly useFluent: boolean;
        readonly disableCopy: boolean;
        readonly toolName: string;
    }>;
    /**
     * For tools which are ready to move over the fluent, wrap the root of the tool (or the panel which you want fluentized) with this component
     * Today we will only enable fluent if the URL has the `newUX` query parameter is truthy
     * @param props
     * @returns
     */
    export var FluentToolWrapper: React.FunctionComponent<React.PropsWithChildren<ToolHostProps>>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        type FileUploadLineProps = Omit<BABYLON.NodeEditor.SharedUIComponents.ButtonProps, "onClick"> & {
        onClick: (files: FileList) => void;
        accept: string;
    };
    export var FileUploadLine: React.FunctionComponent<FileUploadLineProps>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        /**
     * Wraps a button with a label in a line container
     * @param props Button props plus a label
     * @returns A button inside a line
     */
    export var ButtonLine: React.FunctionComponent<BABYLON.NodeEditor.SharedUIComponents.ButtonProps>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export type TensorPropertyLineProps<V extends BABYLON.Vector2 | BABYLON.Vector3 | BABYLON.Vector4 | BABYLON.Quaternion> = BABYLON.NodeEditor.SharedUIComponents.PropertyLineProps<V> & BABYLON.NodeEditor.SharedUIComponents.PrimitiveProps<V> & {
        /**
         * If passed, all sliders will use this for the min value
         */
        min?: number;
        /**
         * If passed, all sliders will use this for the max value
         */
        max?: number;
        /**
         * If passed, the UX will use the conversion functions to display/update values
         */
        valueConverter?: {
            /**
             * Will call from(val) before displaying in the UX
             */
            from: (val: number) => number;
            /**
             * Will call to(val) before calling onChange
             */
            to: (val: number) => number;
        };
    };
    type RotationVectorPropertyLineProps = TensorPropertyLineProps<BABYLON.Vector3> & {
        /**
         * Display angles as degrees instead of radians
         */
        useDegrees?: boolean;
    };
    export var RotationVectorPropertyLine: React.FunctionComponent<RotationVectorPropertyLineProps>;
    type QuaternionPropertyLineProps = TensorPropertyLineProps<BABYLON.Quaternion> & {
        /**
         * Display angles as degrees instead of radians
         */
        useDegrees?: boolean;
    };
    export var QuaternionPropertyLine: React.FunctionComponent<QuaternionPropertyLineProps>;
    export var Vector2PropertyLine: React.FunctionComponent<TensorPropertyLineProps<BABYLON.Vector2>>;
    export var Vector3PropertyLine: React.FunctionComponent<TensorPropertyLineProps<BABYLON.Vector3>>;
    export var Vector4PropertyLine: React.FunctionComponent<TensorPropertyLineProps<BABYLON.Vector4>>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        /**
     * Wraps text in a property line
     * @param props - BABYLON.NodeEditor.SharedUIComponents.PropertyLineProps and TextProps
     * @returns property-line wrapped text
     */
    export var TextPropertyLine: React.FunctionComponent<BABYLON.NodeEditor.SharedUIComponents.PropertyLineProps<string> & BABYLON.NodeEditor.SharedUIComponents.ImmutablePrimitiveProps<string>>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        /**
     * Wraps textarea in a property line
     * @param props - BABYLON.NodeEditor.SharedUIComponents.PropertyLineProps and TextProps
     * @returns property-line wrapped text
     */
    export var TextAreaPropertyLine: React.FunctionComponent<BABYLON.NodeEditor.SharedUIComponents.PropertyLineProps<string> & BABYLON.NodeEditor.SharedUIComponents.TextareaProps>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        type SyncedSliderPropertyProps = BABYLON.NodeEditor.SharedUIComponents.SyncedSliderProps & BABYLON.NodeEditor.SharedUIComponents.PropertyLineProps<number>;
    /**
     * Renders a simple wrapper around the SyncedSliderInput
     * @param props
     * @returns
     */
    export var SyncedSliderPropertyLine: import("react").ForwardRefExoticComponent<SyncedSliderPropertyProps & import("react").RefAttributes<HTMLDivElement>>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        /**
     * Wraps a switch in a property line
     * @param props - The properties for the switch and property line
     * @returns A React element representing the property line with a switch
     */
    export var SwitchPropertyLine: React.FunctionComponent<BABYLON.NodeEditor.SharedUIComponents.PropertyLineProps<boolean> & BABYLON.NodeEditor.SharedUIComponents.SwitchProps>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        type StringifiedPropertyLineProps = BABYLON.NodeEditor.SharedUIComponents.PropertyLineProps<number> & BABYLON.NodeEditor.SharedUIComponents.ImmutablePrimitiveProps<number> & {
        precision?: number;
        units?: string;
    };
    /**
     * Expects a numerical value and converts it toFixed(if precision is supplied) or toLocaleString
     * Can pass optional units to be appending to the end of the string
     * @param props
     * @returns
     */
    export var StringifiedPropertyLine: React.FunctionComponent<StringifiedPropertyLineProps>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export var SpinButtonPropertyLine: React.FunctionComponent<BABYLON.NodeEditor.SharedUIComponents.PropertyLineProps<number> & BABYLON.NodeEditor.SharedUIComponents.SpinButtonProps>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        type BasePropertyLineProps = {
        /**
         * The name of the property to display in the property line.
         */
        label: string;
        /**
         * Optional description for the property, shown on hover of the info icon
         */
        description?: string;
        /**
         * Optional function returning a string to copy to clipboard.
         */
        onCopy?: () => string;
        /**
         * Link to the documentation for this property, available from the info icon either linked from the description (if provided) or default 'docs' text
         */
        docLink?: string;
    };
    type NullableProperty<ValueT> = {
        nullable: true;
        value: ValueT;
        onChange: (value: ValueT) => void;
        defaultValue?: ValueT;
    };
    type NonNullableProperty = {
        nullable?: false;
    };
    type ExpandableProperty = {
        /**
         * If supplied, an 'expand' icon will be shown which, when clicked, renders this component within the property line.
         */
        expandedContent: JSX.Element;
        /**
         * If true, the expanded content will be shown by default.
         */
        expandByDefault?: boolean;
    };
    type NonExpandableProperty = {
        expandedContent?: undefined;
    };
    export type PropertyLineProps<ValueT> = BasePropertyLineProps & (NullableProperty<ValueT> | NonNullableProperty) & (ExpandableProperty | NonExpandableProperty);
    /**
     * A reusable component that renders a property line with a label and child content, and an optional description, copy button, and expandable section.
     *
     * @param props - The properties for the PropertyLine component.
     * @returns A React element representing the property line.
     *
     */
    export var PropertyLine: import("react").ForwardRefExoticComponent<React.PropsWithChildren<PropertyLineProps<any>> & import("react").RefAttributes<HTMLDivElement>>;
    export var LineContainer: import("react").ForwardRefExoticComponent<Omit<React.PropsWithChildren<React.HTMLProps<HTMLDivElement>>, "ref"> & import("react").RefAttributes<HTMLDivElement>>;
    export var PlaceholderPropertyLine: React.FunctionComponent<BABYLON.NodeEditor.SharedUIComponents.PrimitiveProps<any> & PropertyLineProps<any>>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        type LinkProps = BABYLON.NodeEditor.SharedUIComponents.ImmutablePrimitiveProps<string> & {
        onLink?: () => void;
        url?: string;
    };
    /**
     * Wraps a link in a property line
     * @param props - BABYLON.NodeEditor.SharedUIComponents.PropertyLineProps and LinkProps
     * @returns property-line wrapped link
     */
    export var LinkPropertyLine: React.FunctionComponent<BABYLON.NodeEditor.SharedUIComponents.PropertyLineProps<string> & LinkProps>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        /**
     * Wraps a text input in a property line
     * @param props - BABYLON.NodeEditor.SharedUIComponents.PropertyLineProps and BABYLON.NodeEditor.SharedUIComponents.InputProps
     * @returns property-line wrapped input component
     */
    export var TextInputPropertyLine: React.FunctionComponent<BABYLON.NodeEditor.SharedUIComponents.InputProps<string> & BABYLON.NodeEditor.SharedUIComponents.PropertyLineProps<string>>;
    /**
     * Wraps a number input in a property line
     * @param props - BABYLON.NodeEditor.SharedUIComponents.PropertyLineProps and BABYLON.NodeEditor.SharedUIComponents.InputProps
     * @returns property-line wrapped input component
     */
    export var NumberInputPropertyLine: React.FunctionComponent<BABYLON.NodeEditor.SharedUIComponents.InputProps<number> & BABYLON.NodeEditor.SharedUIComponents.PropertyLineProps<number>>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        /**
     * Wraps a hex input in a property line
     * @param props - BABYLON.NodeEditor.SharedUIComponents.PropertyLineProps and BABYLON.NodeEditor.SharedUIComponents.InputHexProps
     * @returns property-line wrapped input hex component
     */
    export var HexPropertyLine: React.FunctionComponent<BABYLON.NodeEditor.SharedUIComponents.InputHexProps & BABYLON.NodeEditor.SharedUIComponents.PropertyLineProps<BABYLON.Color3 | BABYLON.Color4>>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        type DropdownPropertyLineProps<V extends BABYLON.NodeEditor.SharedUIComponents.AcceptedDropdownValue> = Omit<BABYLON.NodeEditor.SharedUIComponents.DropdownProps<V>, "includeNullAs"> & BABYLON.NodeEditor.SharedUIComponents.PropertyLineProps<BABYLON.NodeEditor.SharedUIComponents.AcceptedDropdownValue>;
    /**
     * Dropdown component for number values.
     */
    export var NumberDropdownPropertyLine: React.FunctionComponent<DropdownPropertyLineProps<number>>;
    /**
     * Dropdown component for string values
     */
    export var StringDropdownPropertyLine: React.FunctionComponent<DropdownPropertyLineProps<string>>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export type ColorPropertyLineProps = BABYLON.NodeEditor.SharedUIComponents.ColorPickerProps<BABYLON.Color3 | BABYLON.Color4> & BABYLON.NodeEditor.SharedUIComponents.PropertyLineProps<BABYLON.Color3 | BABYLON.Color4>;
    export var Color3PropertyLine: React.FunctionComponent<BABYLON.NodeEditor.SharedUIComponents.ColorPickerProps<BABYLON.Color3> & BABYLON.NodeEditor.SharedUIComponents.PropertyLineProps<BABYLON.Color3>>;
    export var Color4PropertyLine: React.FunctionComponent<BABYLON.NodeEditor.SharedUIComponents.ColorPickerProps<BABYLON.Color4> & BABYLON.NodeEditor.SharedUIComponents.PropertyLineProps<BABYLON.Color4>>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        /**
     * Wraps a checkbox in a property line
     * @param props - BABYLON.NodeEditor.SharedUIComponents.PropertyLineProps and CheckboxProps
     * @returns property-line wrapped checkbox
     */
    export var CheckboxPropertyLine: React.FunctionComponent<BABYLON.NodeEditor.SharedUIComponents.PropertyLineProps<boolean> & BABYLON.NodeEditor.SharedUIComponents.PrimitiveProps<boolean>>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        /**
     * Displays an icon indicating enabled (green check) or disabled (red cross) state
     * @param props - The properties for the PropertyLine, including the boolean value to display.
     * @returns A PropertyLine component with a PresenceBadge indicating the boolean state.
     */
    export var BooleanBadgePropertyLine: React.FunctionComponent<BABYLON.NodeEditor.SharedUIComponents.PropertyLineProps<boolean> & BABYLON.NodeEditor.SharedUIComponents.ImmutablePrimitiveProps<boolean>>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        /**
     * A wrapper component for the property tab that provides a consistent layout and styling.
     * It uses a Pane and an Accordion to organize the content, so its direct children
     * must have 'title' props to be compatible with the Accordion structure.
     * @param props The props to pass to the component.
     * @returns The rendered component.
     */
    export var PropertyTabComponentBase: React.FunctionComponent<React.PropsWithChildren>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export function ClassNames(names: any, styleObject: any): string;
    export function JoinClassNames(styleObject: any, ...names: string[]): string;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export type ToggleProps = {
        toggled: "on" | "mixed" | "off";
        onToggle?: () => void;
        padded?: boolean;
        color?: "dark" | "light";
    };
    export var Toggle: React.FC<ToggleProps>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export interface ITextInputProps {
        label?: string;
        placeholder?: string;
        submitValue: (newValue: string) => void;
        validateValue?: (value: string) => boolean;
        cancelSubmit?: () => void;
    }
    /**
     * This component represents a text input that can be submitted or cancelled on buttons
     * @param props properties
     * @returns TextInputWithSubmit element
     */
    export const TextInputWithSubmit: (props: ITextInputProps) => import("react/jsx-runtime").JSX.Element;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export interface MessageDialogProps {
        message: string;
        isError: boolean;
        onClose?: () => void;
    }
    export var MessageDialog: React.FC<MessageDialogProps>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export type LabelProps = {
        text: string;
        children?: React.ReactChild;
        color?: "dark" | "light";
    };
    export var Label: React.FC<LabelProps>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export type IconProps = {
        color?: "dark" | "light";
        icon: string;
    };
    export var Icon: React.FC<IconProps>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export type ButtonComponentProps = {
        disabled?: boolean;
        active?: boolean;
        onClick?: () => void;
        color: "light" | "dark";
        size: "default" | "small" | "wide" | "smaller";
        title?: string;
        backgroundColor?: string;
    };
    export var ButtonComponent: React.FC<React.PropsWithChildren<ButtonComponentProps>>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        /**
     * utility hook to assist using the graph context
     * @returns
     */
    export const useGraphContext: () => IGraphContext;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export type IVisualRecordsType = Record<string, {
        x: number;
        y: number;
    }>;
    export type IConnectionType = {
        id: string;
        sourceId: string;
        targetId: string;
    };
    export type ICustomDataType = {
        type: string;
        value: any;
    };
    export type INodeType = {
        id: string;
        label: string;
        customData?: ICustomDataType;
    };
    /**
     * props for the node renderer
     */
    export interface INodeRendererProps {
        /**
         * array of connections between nodes
         */
        connections: IConnectionType[];
        /**
         * function called when a new connection is created
         */
        updateConnections: (sourceId: string, targetId: string) => void;
        /**
         * function called when a connection is deleted
         */
        deleteLine: (lineId: string) => void;
        /**
         * function called when a node is deleted
         */
        deleteNode: (nodeId: string) => void;
        /**
         * array of all nodes
         */
        nodes: INodeType[];
        /**
         * id of the node to highlight
         */
        highlightedNode?: BABYLON.Nullable<string>;
        /**
         * function to be called if a node is selected
         */
        selectNode?: (nodeId: BABYLON.Nullable<string>) => void;
        /**
         * id of this renderer
         */
        id: string;
        /**
         * optional list of custom components to be rendered inside nodes of
         * a certain type
         */
        customComponents?: Record<string, React.ComponentType<any>>;
    }
    /**
     * This component is a bridge between the app logic related to the graph, and the actual rendering
     * of it. It manages the nodes' positions and selection states.
     * @param props
     * @returns
     */
    export const NodeRenderer: (props: React.PropsWithChildren<INodeRendererProps>) => import("react/jsx-runtime").JSX.Element;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export interface IGraphContainerProps {
        onNodeMoved: (id: string, x: number, y: number) => void;
        id: string;
    }
    /**
     * This component contains all the nodes and handles their dragging
     * @param props properties
     * @returns graph node container element
     */
    export var GraphNodesContainer: React.FC<React.PropsWithChildren<IGraphContainerProps>>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export interface IGraphNodeProps {
        id: string;
        name: string;
        x: number;
        y: number;
        selected?: boolean;
        width?: number;
        height?: number;
        highlighted?: boolean;
        parentContainerId: string;
    }
    export var SingleGraphNode: React.FC<React.PropsWithChildren<IGraphNodeProps>>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        /**
     * props for the GraphLineContainer
     */
    export interface IGraphLinesContainerProps {
        /**
         * id of the container
         */
        id: string;
    }
    /**
     * this component handles the dragging of new connections
     * @param props
     * @returns
     */
    export var GraphLinesContainer: React.FC<React.PropsWithChildren<IGraphLinesContainerProps>>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        /**
     * props for the GraphLine component
     */
    export interface IGraphLineProps {
        /**
         * id of the line. temporary lines can have no id
         */
        id?: string;
        /**
         * starting x pos of the line
         */
        x1: number;
        /**
         * ending x pos of the line
         */
        x2: number;
        /**
         * starting y pos of the line
         */
        y1: number;
        /**
         * ending y pos of the line
         */
        y2: number;
        /**
         * is the line selected
         */
        selected?: boolean;
        /**
         * does the line have a direction
         */
        directional?: boolean;
    }
    export const MarkerArrowId = "arrow";
    /**
     * This component draws a SVG line between two points, with an optional marker
     * indicating direction
     * @param props properties
     * @returns graph line element
     */
    export var GraphLine: React.FC<IGraphLineProps>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        /**
     * this context is used to pass callbacks to the graph nodes and connections
     */
    export interface IGraphContext {
        onNodesConnected?: (sourceId: string, targetId: string) => void;
        onLineSelected?: (lineId: string) => void;
        onNodeSelected?: (nodeId: string) => void;
    }
    export var GraphContextManager: import("react").Context<IGraphContext>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export interface IGraphContainerProps {
    }
    /**
     * This component is just a simple container to keep the nodes and lines containers
     * together
     * @param props
     * @returns
     */
    export var GraphContainer: React.FC<React.PropsWithChildren<IGraphContainerProps>>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        /**
     * Props for the connector
     */
    export interface IGraphConnectorHandlerProps {
        /**
         * id of the parent node
         */
        parentId: string;
        /**
         * x position of the parent node
         */
        parentX: number;
        /**
         * y position of the parent node
         */
        parentY: number;
        /**
         * x position of the connector relative to the parent node
         */
        offsetX?: number;
        /**
         * y position of the connector relative to the parent node
         */
        offsetY?: number;
        /**
         * width of the parent node
         */
        parentWidth: number;
        /**
         * height of the parent node
         */
        parentHeight: number;
        /**
         * id of the container where its parent node is
         */
        parentContainerId: string;
    }
    /**
     * This component is used to initiate a connection between two nodes. Simply
     * drag the handle in a node and drop it in another node to create a connection.
     * @returns connector element
     */
    export var GraphConnectorHandler: React.FC<React.PropsWithChildren<IGraphConnectorHandlerProps>>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        /**
     * This components represents an options menu with optional
     * customizable properties. Option IDs should be unique.
     */
    export interface IOption {
        label: string;
        value: string;
        id: string;
    }
    export interface IOptionsLineComponentProps {
        options: IOption[];
        addOptionPlaceholder?: string;
        onOptionAdded?: (newOption: IOption) => void;
        onOptionSelected: (selectedOptionValue: string) => void;
        selectedOptionValue: string;
        validateNewOptionValue?: (newOptionValue: string) => boolean;
        addOptionText?: string;
    }
    export const OptionsLineComponent: (props: IOptionsLineComponentProps) => import("react/jsx-runtime").JSX.Element;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        interface INumericInputComponentProps {
        label: string;
        labelTooltip?: string;
        value: number;
        step?: number;
        onChange: (value: number) => void;
        precision?: number;
        icon?: string;
        iconLabel?: string;
        lockObject: BABYLON.NodeEditor.SharedUIComponents.LockObject;
    }
    export class NumericInputComponent extends React.Component<INumericInputComponentProps, {
        value: string;
    }> {
        static defaultProps: {
            step: number;
        };
        private _localChange;
        constructor(props: INumericInputComponentProps);
        componentWillUnmount(): void;
        shouldComponentUpdate(nextProps: INumericInputComponentProps, nextState: {
            value: string;
        }): boolean;
        updateValue(valueString: string): void;
        onBlur(): void;
        incrementValue(amount: number): void;
        onKeyDown(evt: React.KeyboardEvent<HTMLInputElement>): void;
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export interface IFileButtonLineComponentProps {
        label: string;
        onClick: (file: File) => void;
        accept: string;
        icon?: string;
        iconLabel?: string;
    }
    export class FileButtonLineComponent extends React.Component<IFileButtonLineComponentProps> {
        private static _IdGenerator;
        private _id;
        private _uploadInputRef;
        constructor(props: IFileButtonLineComponentProps);
        onChange(evt: any): void;
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export interface IColorPickerLineComponentProps {
        value: BABYLON.Color4 | BABYLON.Color3;
        linearHint?: boolean;
        onColorChanged: (newOne: string) => void;
        icon?: string;
        iconLabel?: string;
        shouldPopRight?: boolean;
        lockObject?: BABYLON.NodeEditor.SharedUIComponents.LockObject;
        backgroundColor?: string;
    }
    interface IColorPickerComponentState {
        pickerEnabled: boolean;
        color: BABYLON.Color3 | BABYLON.Color4;
        hex: string;
    }
    export class ColorPickerLineComponent extends React.Component<IColorPickerLineComponentProps, IColorPickerComponentState> {
        private _floatRef;
        private _floatHostRef;
        private _coverRef;
        constructor(props: IColorPickerLineComponentProps);
        syncPositions(): void;
        shouldComponentUpdate(nextProps: IColorPickerLineComponentProps, nextState: IColorPickerComponentState): boolean;
        getHexString(props?: Readonly<IColorPickerLineComponentProps>): string;
        componentDidUpdate(): void;
        componentDidMount(): void;
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        /**
     * Given a column and row number in the layout, return the corresponding column/row
     * @param layout
     * @param column
     * @param row
     * @returns
     */
    export const getPosInLayout: (layout: BABYLON.NodeEditor.SharedUIComponents.Layout, column: number, row?: number) => BABYLON.NodeEditor.SharedUIComponents.LayoutColumn | BABYLON.NodeEditor.SharedUIComponents.LayoutTabsRow;
    /**
     * Remove a row in position row, column from the layout, and redistribute heights of remaining rows
     * @param layout
     * @param column
     * @param row
     */
    export const removeLayoutRowAndRedistributePercentages: (layout: BABYLON.NodeEditor.SharedUIComponents.Layout, column: number, row: number) => void;
    /**
     * Add a percentage string to a number
     * @param p1 the percentage string
     * @param p2 the number
     * @returns the sum of the percentage string and the number
     */
    export const addPercentageStringToNumber: (p1: string, p2: number) => number;
    /**
     * Parses a percentage string into a number
     * @param p the percentage string
     * @returns the parsed number
     */
    export const parsePercentage: (p: string) => number;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export type LayoutTab = {
        /**
         * Tab id
         */
        id: string;
        /**
         * React component rendered by tab
         */
        component: React.ReactElement;
        /**
         * Tab title
         */
        title: string;
    };
    export type LayoutTabsRow = {
        /**
         * row id
         */
        id: string;
        /**
         * row height in its containing column
         */
        height: string;
        /**
         * selected tab in row
         */
        selectedTab: string;
        /**
         * list of tabs contained in row
         */
        tabs: LayoutTab[];
    };
    export type LayoutColumn = {
        /**
         * column id
         */
        id: string;
        /**
         * column width in the grid
         */
        width: string;
        /**
         * column rows
         */
        rows: LayoutTabsRow[];
    };
    export type Layout = {
        /**
         * layout columns
         */
        columns?: LayoutColumn[];
    };
    export type TabDrag = {
        /**
         * row number of the tab being dragged
         */
        rowNumber: number;
        /**
         * column number of the tab being dragged
         */
        columnNumber: number;
        /**
         * the tabs being dragged
         */
        tabs: {
            /**
             * id of tab being dragged
             */
            id: string;
        }[];
    };
    export enum ElementTypes {
        RESIZE_BAR = "0",
        TAB = "1",
        TAB_GROUP = "2",
        NONE = "2"
    }
    export enum ResizeDirections {
        ROW = "row",
        COLUMN = "column"
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export var LayoutContext: import("react").Context<{
        /**
         * The layout object
         */
        layout: BABYLON.NodeEditor.SharedUIComponents.Layout;
        /**
         * Function to set the layout object in the context
         */
        setLayout: (layout: BABYLON.NodeEditor.SharedUIComponents.Layout) => void;
    }>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        /**
     * Arguments for the TabsContainer component.
     */
    export interface IFlexibleTabsContainerProps {
        /**
         * The tabs to display
         */
        tabs: BABYLON.NodeEditor.SharedUIComponents.LayoutTab[];
        /**
         * Row index of component in layout
         */
        rowIndex: number;
        /**
         * Column index of component in layout
         */
        columnIndex: number;
        /**
         * Which tab is selected in the layout
         */
        selectedTab?: string;
    }
    /**
     * This component contains a set of tabs of which only one is visible at a time.
     * The tabs can also be dragged from and to different containers.
     * @param props properties
     * @returns tabs container element
     */
    export var FlexibleTabsContainer: React.FC<IFlexibleTabsContainerProps>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        /**
     * Arguments for the FlexibleTab component.
     */
    export interface IFlexibleTabProps {
        /**
         * The tab's title.
         */
        title: string;
        /**
         * If the tab is currently selected or not
         */
        selected: boolean;
        /**
         * What happens when the user clicks on the tab
         */
        onClick: () => void;
        /**
         * The object that will be sent to the drag event
         */
        item: BABYLON.NodeEditor.SharedUIComponents.TabDrag;
        /**
         * What happens when the user drops another tab after this one
         */
        onTabDroppedAction: (item: BABYLON.NodeEditor.SharedUIComponents.TabDrag) => void;
    }
    /**
     * A component that renders a tab that the user can click
     * to activate or drag to reorder. It also listens for
     * drop events if the user wants to drop another tab
     * after it.
     * @param props properties
     * @returns FlexibleTab element
     */
    export var FlexibleTab: React.FC<IFlexibleTabProps>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        /**
     * Arguments for the ResizeBar component.
     */
    export interface IFlexibleRowResizerProps {
        /**
         * Row number of the component that is being resized
         */
        rowNumber: number;
        /**
         * Column number of the component being resized
         */
        columnNumber: number;
        /**
         * If the resizing happens in row or column direction
         */
        direction: BABYLON.NodeEditor.SharedUIComponents.ResizeDirections;
    }
    /**
     * The item that will be sent to the drag event
     */
    export type ResizeItem = {
        /**
         * If the resizing happens in row or column direction
         */
        direction: BABYLON.NodeEditor.SharedUIComponents.ResizeDirections;
        /**
         * The row number of the component that is being resized
         */
        rowNumber: number;
        /**
         * the column number of the component being resized
         */
        columnNumber: number;
    };
    /**
     * A component that renders a bar that the user can drag to resize.
     * @param props properties
     * @returns resize bar element
     */
    export var FlexibleResizeBar: React.FC<IFlexibleRowResizerProps>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        /**
     * Arguments for the BABYLON.NodeEditor.SharedUIComponents.Layout component.
     */
    export interface IFlexibleGridLayoutProps {
        /**
         * A definition of the layout which can be changed by the user
         */
        layoutDefinition: BABYLON.NodeEditor.SharedUIComponents.Layout;
    }
    /**
     * This component represents a grid layout that can be resized and rearranged
     * by the user.
     * @param props properties
     * @returns layout element
     */
    export var FlexibleGridLayout: React.FC<IFlexibleGridLayoutProps>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        /**
     * Arguments for the GridContainer component.
     */
    export interface IFlexibleGridContainerProps {
    }
    /**
     * Component responsible for mapping the layout to the actual components
     * @returns GridContainer element
     */
    export var FlexibleGridContainer: React.FC<IFlexibleGridContainerProps>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        /**
     * Arguments for the FlexibleDropZone component.
     */
    export interface IFlexibleDropZoneProps {
        /**
         * The row number of the component in the layout
         */
        rowNumber: number;
        /**
         * The column number of the component in the layout
         */
        columnNumber: number;
    }
    /**
     * This component contains the drag and drop zone for the resize bars that
     * allow redefining width and height of layout elements
     * @param props properties
     * @returns drop zone element
     */
    export var FlexibleDropZone: React.FC<React.PropsWithChildren<IFlexibleDropZoneProps>>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        /**
     * Arguments for the DragHandler component.
     */
    export interface IFlexibleDragHandlerProps {
        /**
         * The size of the containing element. Used to calculate the percentage of
         * space occupied by the component
         */
        containerSize: {
            width: number;
            height: number;
        };
    }
    /**
     * This component receives the drop events and updates the layout accordingly
     * @param props properties
     * @returns DragHandler element
     */
    export var FlexibleDragHandler: React.FC<React.PropsWithChildren<IFlexibleDragHandlerProps>>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        /**
     * Arguments for the Column component.
     */
    export interface IFlexibleColumnProps {
        /**
         * Width of column
         */
        width: string;
    }
    /**
     * This component represents a single column in the layout. It receives a width
     * that it occupies and the content to display
     * @param props
     * @returns
     */
    export var FlexibleColumn: React.FC<React.PropsWithChildren<IFlexibleColumnProps>>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        /**
     * Arguments for the DraggableIcon component.
     */
    export interface IDraggableIconProps {
        /**
         * Icon source
         */
        src: string;
        /**
         * Object that will be passed to the drag event
         */
        item: BABYLON.NodeEditor.SharedUIComponents.TabDrag;
        /**
         * Type of drag event
         */
        type: BABYLON.NodeEditor.SharedUIComponents.ElementTypes;
    }
    /**
     * An icon that can be dragged by the user
     * @param props properties
     * @returns draggable icon element
     */
    export var DraggableIcon: React.FC<IDraggableIconProps>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export interface IHexColorProps {
        value: string;
        expectedLength: number;
        onChange: (value: string) => void;
        lockObject: BABYLON.NodeEditor.SharedUIComponents.LockObject;
    }
    export class HexColorComponent extends React.Component<IHexColorProps, {
        hex: string;
    }> {
        constructor(props: IHexColorProps);
        shouldComponentUpdate(nextProps: IHexColorProps, nextState: {
            hex: string;
        }): boolean;
        lock(): void;
        unlock(): void;
        updateHexValue(valueString: string): void;
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        /**
     * Interface used to specify creation options for color picker
     */
    export interface IColorPickerComponentProps {
        color: BABYLON.Color3 | BABYLON.Color4;
        linearhint?: boolean;
        debugMode?: boolean;
        onColorChanged?: (color: BABYLON.Color3 | BABYLON.Color4) => void;
        lockObject: BABYLON.NodeEditor.SharedUIComponents.LockObject;
        backgroundColor?: string;
    }
    /**
     * Interface used to specify creation options for color picker
     */
    export interface IColorPickerState {
        color: BABYLON.Color3;
        alpha: number;
    }
    /**
     * Class used to create a color picker
     */
    export class ColorPickerComponent extends React.Component<IColorPickerComponentProps, IColorPickerState> {
        private _saturationRef;
        private _hueRef;
        private _isSaturationPointerDown;
        private _isHuePointerDown;
        constructor(props: IColorPickerComponentProps);
        shouldComponentUpdate(nextProps: IColorPickerComponentProps, nextState: IColorPickerState): boolean;
        onSaturationPointerDown(evt: React.PointerEvent<HTMLDivElement>): void;
        onSaturationPointerUp(evt: React.PointerEvent<HTMLDivElement>): void;
        onSaturationPointerMove(evt: React.PointerEvent<HTMLDivElement>): void;
        onHuePointerDown(evt: React.PointerEvent<HTMLDivElement>): void;
        onHuePointerUp(evt: React.PointerEvent<HTMLDivElement>): void;
        onHuePointerMove(evt: React.PointerEvent<HTMLDivElement>): void;
        private _evaluateSaturation;
        private _evaluateHue;
        componentDidUpdate(): void;
        raiseOnColorChanged(): void;
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export interface IColorComponentEntryProps {
        value: number;
        label: string;
        max?: number;
        min?: number;
        onChange: (value: number) => void;
        disabled?: boolean;
        lockObject: BABYLON.NodeEditor.SharedUIComponents.LockObject;
    }
    export class ColorComponentComponentEntry extends React.Component<IColorComponentEntryProps> {
        constructor(props: IColorComponentEntryProps);
        updateValue(valueString: string): void;
        lock(): void;
        unlock(): void;
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        interface ICommandDropdownComponentProps {
        icon?: string;
        tooltip: string;
        defaultValue?: string;
        items: {
            label: string;
            icon?: string;
            fileButton?: boolean;
            onClick?: () => void;
            onCheck?: (value: boolean) => void;
            storeKey?: string;
            isActive?: boolean;
            defaultValue?: boolean | string;
            subItems?: string[];
        }[];
        toRight?: boolean;
    }
    export class CommandDropdownComponent extends React.Component<ICommandDropdownComponentProps, {
        isExpanded: boolean;
        activeState: string;
    }> {
        constructor(props: ICommandDropdownComponentProps);
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export interface ICommandButtonComponentProps {
        tooltip: string;
        shortcut?: string;
        icon: string;
        iconLabel?: string;
        isActive: boolean;
        onClick: () => void;
        disabled?: boolean;
    }
    export var CommandButtonComponent: React.FC<ICommandButtonComponentProps>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export interface ICommandBarComponentProps {
        onSaveButtonClicked?: () => void;
        onSaveToSnippetButtonClicked?: () => void;
        onLoadFromSnippetButtonClicked?: () => void;
        onHelpButtonClicked?: () => void;
        onGiveFeedbackButtonClicked?: () => void;
        onSelectButtonClicked?: () => void;
        onPanButtonClicked?: () => void;
        onZoomButtonClicked?: () => void;
        onFitButtonClicked?: () => void;
        onArtboardColorChanged?: (newColor: string) => void;
        artboardColor?: string;
        artboardColorPickerColor?: string;
    }
    export var CommandBarComponent: React.FC<React.PropsWithChildren<ICommandBarComponentProps>>;



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export interface IHexColorProps {
        value: string;
        expectedLength: number;
        onChange: (value: string) => void;
        lockObject: BABYLON.NodeEditor.SharedUIComponents.LockObject;
    }
    export class HexColor extends React.Component<IHexColorProps, {
        hex: string;
    }> {
        constructor(props: IHexColorProps);
        shouldComponentUpdate(nextProps: IHexColorProps, nextState: {
            hex: string;
        }): boolean;
        lock(): void;
        unlock(): void;
        updateHexValue(valueString: string): void;
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        /**
     * Interface used to specify creation options for color picker
     */
    export interface IColorPickerProps {
        color: BABYLON.Color3 | BABYLON.Color4;
        linearhint?: boolean;
        debugMode?: boolean;
        onColorChanged?: (color: BABYLON.Color3 | BABYLON.Color4) => void;
        lockObject: BABYLON.NodeEditor.SharedUIComponents.LockObject;
    }
    /**
     * Interface used to specify creation options for color picker
     */
    export interface IColorPickerState {
        color: BABYLON.Color3;
        alpha: number;
    }
    /**
     * Class used to create a color picker
     */
    export class ColorPicker extends React.Component<IColorPickerProps, IColorPickerState> {
        private _saturationRef;
        private _hueRef;
        private _isSaturationPointerDown;
        private _isHuePointerDown;
        constructor(props: IColorPickerProps);
        shouldComponentUpdate(nextProps: IColorPickerProps, nextState: IColorPickerState): boolean;
        onSaturationPointerDown(evt: React.PointerEvent<HTMLDivElement>): void;
        onSaturationPointerUp(evt: React.PointerEvent<HTMLDivElement>): void;
        onSaturationPointerMove(evt: React.PointerEvent<HTMLDivElement>): void;
        onHuePointerDown(evt: React.PointerEvent<HTMLDivElement>): void;
        onHuePointerUp(evt: React.PointerEvent<HTMLDivElement>): void;
        onHuePointerMove(evt: React.PointerEvent<HTMLDivElement>): void;
        private _evaluateSaturation;
        private _evaluateHue;
        componentDidUpdate(): void;
        raiseOnColorChanged(): void;
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor {


}
declare module BABYLON.NodeEditor.SharedUIComponents {
        export interface IColorComponentEntryProps {
        value: number;
        label: string;
        max?: number;
        min?: number;
        onChange: (value: number) => void;
        disabled?: boolean;
        lockObject: BABYLON.NodeEditor.SharedUIComponents.LockObject;
    }
    export class ColorComponentEntry extends React.Component<IColorComponentEntryProps> {
        constructor(props: IColorComponentEntryProps);
        updateValue(valueString: string): void;
        lock(): void;
        unlock(): void;
        render(): import("react/jsx-runtime").JSX.Element;
    }



}
declare module BABYLON.NodeEditor {


}


