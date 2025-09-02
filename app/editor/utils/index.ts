import * as fabric from "fabric";
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

// Fabric.js utilities
export class FabricUtils {
  static setFabricObjectProperties(fabricObject: any, element: EditorElement) {
    fabricObject.set({
      left: element.placement.x,
      top: element.placement.y,
      scaleX: element.placement.scaleX,
      scaleY: element.placement.scaleY,
      angle: element.placement.rotation,
      selectable: true,
      hasControls: true,
      hasBorders: true,
    });
  }

  static applyEffect(fabricObject: any, effect: Effect) {
    // Simplified effect application - can be expanded later
    console.log("Applying effect:", effect.type, "to object:", fabricObject);
  }

  static async createVideoElement(
    src: string,
    elementId: string
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.src = src;
      video.crossOrigin = "anonymous";
      video.muted = true;
      video.playsInline = true;

      video.addEventListener("loadedmetadata", () => {
        try {
          const fabricImage = new fabric.Image(video as any, {
            left: 100,
            top: 100,
          });
          resolve(fabricImage);
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

  static async createImageElement(src: string): Promise<any> {
    return new Promise((resolve, reject) => {
      fabric.Image.fromURL(src, {
        crossOrigin: "anonymous",
      })
        .then((img: any) => {
          img.set({
            left: 100,
            top: 100,
          });
          resolve(img);
        })
        .catch(reject);
    });
  }

  static createTextElement(text: string, options: any = {}): any {
    return new fabric.IText(text, {
      left: 100,
      top: 100,
      fontSize: options.fontSize || 40,
      fontFamily: options.fontFamily || "Arial",
      fill: options.color || "#ffffff",
      fontWeight: options.fontWeight || "normal",
      ...options,
    });
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

// Canvas utilities
export const getCanvasCenter = (canvas: any): { x: number; y: number } => {
  return {
    x: (canvas.width || 0) / 2,
    y: (canvas.height || 0) / 2,
  };
};

export const fitObjectToCanvas = (object: any, canvas: any, padding = 50) => {
  const canvasWidth = canvas.width || 0;
  const canvasHeight = canvas.height || 0;

  const objectWidth = object.getScaledWidth();
  const objectHeight = object.getScaledHeight();

  const scaleX = (canvasWidth - padding * 2) / objectWidth;
  const scaleY = (canvasHeight - padding * 2) / objectHeight;
  const scale = Math.min(scaleX, scaleY, 1); // Don't scale up

  object.set({
    scaleX: scale,
    scaleY: scale,
  });

  if (object.center) {
    object.center();
  }
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
