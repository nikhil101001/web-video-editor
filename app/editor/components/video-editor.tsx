"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useEditorStore } from "../store/use-editor";
import { useCanvas } from "../hooks/use-canvas";
import { useKeyboardShortcuts } from "../hooks/use-keyboard-shortcuts";
import { useTimeline } from "../hooks/use-timeline";
import { Sidebar } from "./sidebar";
import { Timeline } from "./timeline";
import { Navbar } from "./navbar";
import { Canvas } from "./canvas";
import { PropertyPanel } from "./property-panel";
import { originalHeight, originalWidth } from "../utils/editor-data";

export const VideoEditor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    backgroundColor,
    selectedMenuOption,
    setSelectedMenuOption,
    aspectRatio,
  } = useEditorStore();
  const { initializeCanvas, disposeCanvas } = useCanvas();

  const [canvasSize, setCanvasSize] = useState({
    width: originalWidth,
    height: originalHeight,
  });
  const [isCanvasInitialized, setIsCanvasInitialized] = useState(false);

  // Custom hooks for functionality
  useKeyboardShortcuts();
  const timeline = useTimeline();

  // Calculate responsive canvas size
  useEffect(() => {
    const updateCanvasSize = () => {
      const containerWidth = window.innerWidth - 400; // Account for sidebars
      const containerHeight = window.innerHeight - 200; // Account for timeline and navbar

      const aspectRatio = 16 / 9; // Default aspect ratio
      let width = containerWidth;
      let height = width / aspectRatio;

      if (height > containerHeight) {
        height = containerHeight;
        width = height * aspectRatio;
      }

      setCanvasSize({ width, height });
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    return () => window.removeEventListener("resize", updateCanvasSize);
  }, []);

  // Initialize canvas when component mounts
  useEffect(() => {
    if (
      canvasRef.current &&
      canvasSize.width &&
      canvasSize.height &&
      !isCanvasInitialized
    ) {
      initializeCanvas(canvasRef.current, canvasSize.width, canvasSize.height);
      setIsCanvasInitialized(true);
    }

    // Cleanup function to dispose canvas when component unmounts
    return () => {
      if (isCanvasInitialized) {
        disposeCanvas();
        setIsCanvasInitialized(false);
      }
    };
  }, [canvasSize, initializeCanvas, disposeCanvas, isCanvasInitialized]);

  const handleClosePanel = useCallback(() => {
    setSelectedMenuOption(null);
  }, [setSelectedMenuOption]);

  return (
    <div className="h-screen flex flex-col text-white overflow-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col">
          <div
            className="flex-1 flex items-center justify-center p-4 bg-gray-800"
            onClick={handleClosePanel}
          >
            <Canvas
              ref={canvasRef}
              width={canvasSize.width}
              height={canvasSize.height}
              backgroundColor={backgroundColor}
            />
          </div>

          {/* Timeline */}
          <div className="h-64 border-t border-gray-700">
            <Timeline timeline={timeline} />
          </div>
        </div>

        {/* Right Panel */}
        {selectedMenuOption && (
          <div className="w-80 bg-gray-800 border-l border-gray-700">
            <PropertyPanel />
          </div>
        )}
      </div>
    </div>
  );
};
