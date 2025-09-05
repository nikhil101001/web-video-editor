import * as PIXI from "pixi.js";
import {
  EditorElement,
  VideoEditorElement,
  ImageEditorElement,
  AudioEditorElement,
  TextEditorElement,
  Effect,
} from "../types";

// Type guards
export const isVideoElement = (
  element: EditorElement
): element is VideoEditorElement => element.type === "video";

export const isImageElement = (
  element: EditorElement
): element is ImageEditorElement => element.type === "image";

export const isAudioElement = (
  element: EditorElement
): element is AudioEditorElement => element.type === "audio";

export const isTextElement = (
  element: EditorElement
): element is TextEditorElement => element.type === "text";

// Utility functions
export const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const formatTimeToMinSecMili = (timeInMs: number): string => {
  const minutes = Math.floor(timeInMs / 60000);
  const seconds = Math.floor((timeInMs % 60000) / 1000);
  const milliseconds = Math.floor((timeInMs % 1000) / 10);

  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`;
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// PixiJS utilities
export class PixiUtils {
  static setPixiObjectProperties(
    pixiObject: PIXI.Container,
    element: EditorElement
  ) {
    pixiObject.position.set(element.placement.x, element.placement.y);
    pixiObject.scale.set(element.placement.scaleX, element.placement.scaleY);
    pixiObject.rotation = (element.placement.rotation * Math.PI) / 180; // Convert to radians
    pixiObject.eventMode = "static";
    pixiObject.cursor = "pointer";
  }

  static applyEffect(pixiObject: PIXI.Container, effect: Effect) {
    // Simplified effect application - can be expanded with filters later
    console.log("Applying effect:", effect.type, "to object:", pixiObject);
  }

  static async createVideoElement(
    src: string,
    elementId: string
  ): Promise<PIXI.Sprite | null> {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.src = src;
      video.crossOrigin = "anonymous";
      video.muted = true;
      video.playsInline = true;
      video.loop = true;

      video.addEventListener("loadedmetadata", () => {
        try {
          const texture = PIXI.Texture.from(video);
          const sprite = new PIXI.Sprite(texture);

          sprite.x = 100;
          sprite.y = 100;
          sprite.width = Math.min(video.videoWidth, 300);
          sprite.height = Math.min(video.videoHeight, 200);

          resolve(sprite);
        } catch (error) {
          reject(error);
        }
      });

      video.addEventListener("error", (error) => {
        reject(error);
      });

      video.load();
    });
  }

  static async createImageElement(src: string): Promise<PIXI.Sprite | null> {
    try {
      const texture = await PIXI.Assets.load(src);
      const sprite = new PIXI.Sprite(texture);

      sprite.x = 100;
      sprite.y = 100;

      // Scale to reasonable size
      const maxWidth = 300;
      const maxHeight = 200;
      const scale = Math.min(
        maxWidth / texture.width,
        maxHeight / texture.height,
        1
      );
      sprite.scale.set(scale);

      return sprite;
    } catch (error) {
      console.error("Failed to create image element:", error);
      return null;
    }
  }

  static createTextElement(text: string, options: any = {}): PIXI.Text {
    const style = new PIXI.TextStyle({
      fontSize: options.fontSize || 40,
      fontFamily: options.fontFamily || "Arial",
      fill: options.color || "#ffffff",
      fontWeight: options.fontWeight || "normal",
      align: options.align || "center",
      ...options,
    });

    const textObject = new PIXI.Text(text, style);
    textObject.x = options.x || 100;
    textObject.y = options.y || 100;

    return textObject;
  }
}

// File utilities
export const getFileExtension = (filename: string): string => {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
};

export const isVideoFile = (filename: string): boolean => {
  const videoExtensions = ["mp4", "webm", "avi", "mov", "wmv", "flv", "mkv"];
  return videoExtensions.includes(getFileExtension(filename).toLowerCase());
};

export const isImageFile = (filename: string): boolean => {
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"];
  return imageExtensions.includes(getFileExtension(filename).toLowerCase());
};

export const isAudioFile = (filename: string): boolean => {
  const audioExtensions = ["mp3", "wav", "ogg", "aac", "m4a", "flac"];
  return audioExtensions.includes(getFileExtension(filename).toLowerCase());
};

// PixiJS utilities
export const getStageCenter = (
  app: PIXI.Application
): { x: number; y: number } => {
  return {
    x: app.screen.width / 2,
    y: app.screen.height / 2,
  };
};

export const fitObjectToStage = (
  object: PIXI.Container,
  app: PIXI.Application,
  padding = 50
) => {
  const stageWidth = app.screen.width;
  const stageHeight = app.screen.height;
  const bounds = object.getBounds();

  const objectWidth = bounds.width;
  const objectHeight = bounds.height;

  const scaleX = (stageWidth - padding * 2) / objectWidth;
  const scaleY = (stageHeight - padding * 2) / objectHeight;
  const scale = Math.min(scaleX, scaleY, 1); // Don't scale up

  object.scale.set(scale);

  // Center the object
  const center = getStageCenter(app);
  object.position.set(
    center.x - (objectWidth * scale) / 2,
    center.y - (objectHeight * scale) / 2
  );
};

// Animation utilities
export const easeInOut = (t: number): number => {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
};

export const interpolate = (
  start: number,
  end: number,
  progress: number
): number => {
  return start + (end - start) * progress;
};

// Download utilities
export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Local storage utilities
export const saveToLocalStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
  }
};

export const loadFromLocalStorage = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error("Failed to load from localStorage:", error);
    return null;
  }
};

export const removeFromLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Failed to remove from localStorage:", error);
  }
};
