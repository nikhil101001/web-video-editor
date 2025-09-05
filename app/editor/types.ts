import * as PIXI from "pixi.js";

// Base types
export type EditorElementBase<T extends string, P> = {
  readonly id: string;
  pixiObject?: PIXI.Container;
  name: string;
  readonly type: T;
  placement: Placement;
  timeFrame: TimeFrame;
  properties: P;
};

// Element types
export type VideoEditorElement = EditorElementBase<
  "video",
  {
    src: string;
    elementId: string;
    videoElement?: HTMLVideoElement;
    sprite?: PIXI.Sprite;
    effect: Effect;
    volume: number;
    muted: boolean;
  }
>;

export type ImageEditorElement = EditorElementBase<
  "image",
  {
    src: string;
    elementId: string;
    sprite?: PIXI.Sprite;
    effect: Effect;
  }
>;

export type AudioEditorElement = EditorElementBase<
  "audio",
  {
    src: string;
    elementId: string;
    volume: number;
    muted: boolean;
  }
>;

export type TextEditorElement = EditorElementBase<
  "text",
  {
    text: string;
    fontSize: number;
    fontWeight: number;
    fontFamily: string;
    color: string;
    splittedTexts: fabric.Text[];
  }
>;

export type EditorElement =
  | VideoEditorElement
  | ImageEditorElement
  | AudioEditorElement
  | TextEditorElement;

// Placement and positioning
export type Placement = {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
};

// Time frame
export type TimeFrame = {
  start: number;
  end: number;
};

// Effects
export type EffectBase<T extends string> = {
  type: T;
};

export type ColorEffect =
  | EffectBase<"none">
  | EffectBase<"blackAndWhite">
  | EffectBase<"sepia">
  | EffectBase<"invert">
  | EffectBase<"saturate">
  | EffectBase<"blur">
  | EffectBase<"brightness">
  | EffectBase<"contrast">;

export type Effect = ColorEffect;
export type EffectType = Effect["type"];

// Animations
export type AnimationBase<T, P = {}> = {
  id: string;
  targetId: string;
  duration: number;
  type: T;
  properties: P;
};

export type FadeInAnimation = AnimationBase<"fadeIn">;
export type FadeOutAnimation = AnimationBase<"fadeOut">;
export type BreatheAnimation = AnimationBase<"breathe">;
export type ZoomInAnimation = AnimationBase<"zoomIn">;
export type ZoomOutAnimation = AnimationBase<"zoomOut">;

export type SlideDirection = "left" | "right" | "top" | "bottom";
export type SlideTextType = "none" | "character";
export type SlideInAnimation = AnimationBase<
  "slideIn",
  {
    direction: SlideDirection;
    useClipPath: boolean;
    textType: SlideTextType;
  }
>;

export type SlideOutAnimation = AnimationBase<
  "slideOut",
  {
    direction: SlideDirection;
    useClipPath: boolean;
    textType: SlideTextType;
  }
>;

export type Animation =
  | FadeInAnimation
  | FadeOutAnimation
  | BreatheAnimation
  | ZoomInAnimation
  | ZoomOutAnimation
  | SlideInAnimation
  | SlideOutAnimation;

// Menu options
export type MenuOption =
  | "video"
  | "image"
  | "audio"
  | "text"
  | "effects"
  | "animations"
  | "export"
  | "settings"
  | null;

// video formats
export type VideoFormat =
  | "mp4"
  | "webm"
  | "avi"
  | "mov"
  | "mkv"
  | "flv"
  | "wmv"
  | "gif"
  | "hevc"
  | "3gp"
  | "asf"
  | "m4v"
  | "mpeg"
  | "mpg"
  | "ogv"
  | "ts";

// export quality
export type ExportQuality = "low" | "medium" | "high";

// Export settings
export type ExportSettings = {
  format: VideoFormat;
  quality: ExportQuality;
  fps: number;
  resolution: {
    width: number;
    height: number;
  };
};

// Keyboard shortcuts
export type KeyboardShortcut = {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
};

// History state for undo/redo
export type HistoryState = {
  elements: EditorElement[];
  selectedElement: EditorElement | null;
  currentTime: number;
};

// Project data
export type ProjectData = {
  id: string;
  name: string;
  elements: EditorElement[];
  settings: {
    width: number;
    height: number;
    backgroundColor: string;
    duration: number;
    fps: number;
  };
};
