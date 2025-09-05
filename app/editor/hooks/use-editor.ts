"use client";

import { useCallback } from "react";
import * as PIXI from "pixi.js";
import { useEditorStore } from "../store/editor-store";

export interface PixiEditorConfig {
  width: number;
  height: number;
  backgroundColor: string;
}

export const useEditor = () => {
  const { pixiApp, setPixiApp } = useEditorStore();

  const initializeEditor = useCallback(
    async (
      canvas: HTMLCanvasElement,
      config: PixiEditorConfig
    ): Promise<boolean> => {
      try {
        // Dispose existing app if it exists
        if (pixiApp) {
          pixiApp.destroy(true, { children: true, texture: true });
        }

        // Create new PIXI Application
        const app = new PIXI.Application();

        // Initialize the application
        await app.init({
          canvas,
          width: config.width,
          height: config.height,
          backgroundColor: config.backgroundColor,
          antialias: true,
          autoDensity: true,
          resolution: window.devicePixelRatio || 1,
        });

        // Set up the main stage
        app.stage.eventMode = "static";
        app.stage.hitArea = new PIXI.Rectangle(
          0,
          0,
          config.width,
          config.height
        );

        // Store the app instance
        setPixiApp(app);

        return true;
      } catch (error) {
        console.error("Failed to initialize PixiJS editor:", error);
        return false;
      }
    },
    [pixiApp, setPixiApp]
  );

  const disposeEditor = useCallback(() => {
    if (pixiApp) {
      pixiApp.destroy(true, { children: true, texture: true });
      setPixiApp(null);
    }
  }, [pixiApp, setPixiApp]);

  const updateCanvasSize = useCallback(
    (width: number, height: number) => {
      if (pixiApp) {
        pixiApp.renderer.resize(width, height);

        // Update stage hit area
        pixiApp.stage.hitArea = new PIXI.Rectangle(0, 0, width, height);
      }
    },
    [pixiApp]
  );

  const addVideoLayer = useCallback(
    (
      videoElement: HTMLVideoElement,
      options: {
        x?: number;
        y?: number;
        width?: number;
        height?: number;
      } = {}
    ) => {
      if (!pixiApp) return null;

      try {
        const texture = PIXI.Texture.from(videoElement);
        const sprite = new PIXI.Sprite(texture);

        // Set position and size
        sprite.x = options.x || 0;
        sprite.y = options.y || 0;
        if (options.width) sprite.width = options.width;
        if (options.height) sprite.height = options.height;

        // Add to stage
        pixiApp.stage.addChild(sprite);

        return sprite;
      } catch (error) {
        console.error("Failed to add video layer:", error);
        return null;
      }
    },
    [pixiApp]
  );

  const addImageLayer = useCallback(
    (
      imageUrl: string,
      options: {
        x?: number;
        y?: number;
        width?: number;
        height?: number;
      } = {}
    ) => {
      if (!pixiApp) return null;

      try {
        const sprite = PIXI.Sprite.from(imageUrl);

        // Set position and size
        sprite.x = options.x || 0;
        sprite.y = options.y || 0;
        if (options.width) sprite.width = options.width;
        if (options.height) sprite.height = options.height;

        // Add to stage
        pixiApp.stage.addChild(sprite);

        return sprite;
      } catch (error) {
        console.error("Failed to add image layer:", error);
        return null;
      }
    },
    [pixiApp]
  );

  const addTextLayer = useCallback(
    (
      text: string,
      style: Partial<PIXI.TextStyle> = {},
      options: {
        x?: number;
        y?: number;
      } = {}
    ) => {
      if (!pixiApp) return null;

      try {
        const defaultStyle = new PIXI.TextStyle({
          fontFamily: "Arial",
          fontSize: 24,
          fill: "#ffffff",
          align: "center",
          ...style,
        });

        const textObject = new PIXI.Text(text, defaultStyle);

        // Set position
        textObject.x = options.x || 0;
        textObject.y = options.y || 0;

        // Add to stage
        pixiApp.stage.addChild(textObject);

        return textObject;
      } catch (error) {
        console.error("Failed to add text layer:", error);
        return null;
      }
    },
    [pixiApp]
  );

  const clearStage = useCallback(() => {
    if (pixiApp) {
      pixiApp.stage.removeChildren();
    }
  }, [pixiApp]);

  return {
    pixiApp,
    initializeEditor,
    disposeEditor,
    updateCanvasSize,
    addVideoLayer,
    addImageLayer,
    addTextLayer,
    clearStage,
  };
};
