"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useEditorStore } from "../store/use-editor";
import { useCanvas } from "../hooks/use-canvas";
import { useKeyboardShortcuts } from "../hooks/use-keyboard-shortcuts";
import { useTimeline } from "../hooks/use-timeline";
import { useResponsiveCanvas } from "../hooks/use-responsive-canvas";
import { useMobile } from "../hooks/use-mobile";
import { Sidebar } from "./sidebar";
import { Timeline } from "./timeline";
import { Navbar } from "./navbar";
import { PropertyPanel } from "./property-panel";
import { ZoomControls } from "./zoom-controls";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

export const VideoEditor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMobile = useMobile();
  const {
    backgroundColor,
    selectedMenuOption,
    setSelectedMenuOption,
    exportSettings,
    propertyPanelSize,
    setPropertyPanelSize,
    canvas,
  } = useEditorStore();
  const {
    initializeCanvas,
    disposeCanvas,
    updateCanvasSize: updateFabricCanvasSize,
  } = useCanvas();

  const [isCanvasInitialized, setIsCanvasInitialized] = useState(false);

  // Use the project's resolution settings for aspect ratio calculation
  const projectWidth = exportSettings.resolution.width;
  const projectHeight = exportSettings.resolution.height;

  const { canvasSize, fitToContainer, zoomIn, zoomOut, resetZoom } =
    useResponsiveCanvas({
      originalWidth: projectWidth,
      originalHeight: projectHeight,
      containerPadding: 20,
      minScale: 0.1,
      maxScale: 3,
    });

  // Custom hooks for functionality
  useKeyboardShortcuts({
    onZoomIn: zoomIn,
    onZoomOut: zoomOut,
    onResetZoom: resetZoom,
  });
  const timeline = useTimeline();

  // Calculate responsive canvas size based on available container space
  const updateCanvasSize = useCallback(() => {
    if (!canvasContainerRef.current) return;

    const container = canvasContainerRef.current;
    const containerRect = container.getBoundingClientRect();

    // Fit canvas to the available container space
    fitToContainer(containerRect.width, containerRect.height);
  }, [fitToContainer]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      // Add debouncing to avoid too frequent updates
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = setTimeout(() => {
        updateCanvasSize();
      }, 150);
    };

    handleResize(); // Initial call
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [updateCanvasSize]);

  // Initialize canvas when component mounts or canvas size changes
  useEffect(() => {
    if (
      canvasRef.current &&
      canvasSize.width &&
      canvasSize.height &&
      !isCanvasInitialized
    ) {
      // Add a small delay to ensure DOM is ready
      const timeoutId = setTimeout(() => {
        if (canvasRef.current && !canvas) {
          initializeCanvas(
            canvasRef.current,
            canvasSize.width,
            canvasSize.height
          );
          setIsCanvasInitialized(true);
        }
      }, 50);

      return () => clearTimeout(timeoutId);
    }
  }, [canvasSize, initializeCanvas, isCanvasInitialized, canvas]);

  // Update fabric canvas size when responsive canvas size changes
  useEffect(() => {
    if (isCanvasInitialized && canvasRef.current && canvas) {
      // Add a small delay to ensure canvas is fully ready
      const timeoutId = setTimeout(() => {
        updateFabricCanvasSize(canvasSize.width, canvasSize.height);
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [canvasSize, isCanvasInitialized, updateFabricCanvasSize, canvas]);

  // Cleanup function to dispose canvas when component unmounts
  useEffect(() => {
    return () => {
      if (isCanvasInitialized) {
        disposeCanvas();
        setIsCanvasInitialized(false);
      }
    };
  }, [disposeCanvas, isCanvasInitialized]);

  const handleOutsideClick = useCallback(() => {
    setSelectedMenuOption(null);
  }, [setSelectedMenuOption]);

  return (
    <div className="h-screen flex flex-col w-full overflow-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex flex-col-reverse md:flex-row flex-1 min-h-0">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Canvas Area - This will take all remaining space */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 flex min-h-0 relative">
            {/* Desktop Resizable Panel Group */}
            {selectedMenuOption && !isMobile ? (
              <ResizablePanelGroup
                direction="horizontal"
                className="min-h-0"
                onLayout={(sizes) => {
                  if (sizes[0]) {
                    setPropertyPanelSize(sizes[0]);
                  }
                }}
              >
                {/* Property Panel - Resizable */}
                <ResizablePanel
                  defaultSize={propertyPanelSize}
                  minSize={15}
                  maxSize={50}
                  className="min-w-[280px]"
                >
                  <PropertyPanel />
                </ResizablePanel>

                {/* Resize Handle */}
                <ResizableHandle withHandle />

                {/* Canvas Container */}
                <ResizablePanel
                  defaultSize={100 - propertyPanelSize}
                  minSize={50}
                  className="relative"
                >
                  <div
                    ref={canvasContainerRef}
                    className="h-full flex items-center justify-center p-4 relative"
                    onClick={handleOutsideClick}
                  >
                    <div className="relative">
                      <canvas
                        ref={canvasRef}
                        width={canvasSize.width}
                        height={canvasSize.height}
                        style={{
                          backgroundColor,
                          maxWidth: "100%",
                          maxHeight: "100%",
                          display: "block",
                        }}
                        className="border border-gray-300 shadow-lg rounded-sm video-editor-canvas"
                      />

                      {/* Canvas overlay for showing actual video resolution info */}
                      <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                        {projectWidth} × {projectHeight} (
                        {(projectWidth / projectHeight).toFixed(2)})
                      </div>

                      {/* Scale indicator */}
                      <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                        {Math.round(canvasSize.scale * 100)}%
                      </div>
                    </div>
                  </div>

                  {/* Zoom Controls */}
                  <ZoomControls
                    scale={canvasSize.scale}
                    onZoomIn={zoomIn}
                    onZoomOut={zoomOut}
                    onResetZoom={resetZoom}
                    className="absolute bottom-4 right-4"
                  />
                </ResizablePanel>
              </ResizablePanelGroup>
            ) : (
              /* Canvas Container when no property panel is shown or on mobile */
              <div
                ref={canvasContainerRef}
                className="flex-1 flex items-center justify-center p-4 min-h-0 relative"
                onClick={handleOutsideClick}
              >
                <div className="relative">
                  <canvas
                    ref={canvasRef}
                    width={canvasSize.width}
                    height={canvasSize.height}
                    style={{
                      backgroundColor,
                      maxWidth: "100%",
                      maxHeight: "100%",
                      display: "block",
                    }}
                    className="border border-gray-300 shadow-lg rounded-sm"
                  />

                  {/* Canvas overlay for showing actual video resolution info */}
                  <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                    {projectWidth} × {projectHeight} (
                    {(projectWidth / projectHeight).toFixed(2)})
                  </div>

                  {/* Scale indicator */}
                  <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                    {Math.round(canvasSize.scale * 100)}%
                  </div>
                </div>

                {/* Zoom Controls */}
                <ZoomControls
                  scale={canvasSize.scale}
                  onZoomIn={zoomIn}
                  onZoomOut={zoomOut}
                  onResetZoom={resetZoom}
                  className="absolute bottom-4 right-4"
                />

                {/* Mobile Property Panel Indicator */}
                {selectedMenuOption && isMobile && (
                  <Button
                    onClick={() => setSelectedMenuOption(selectedMenuOption)}
                    className="absolute top-4 left-4 z-10"
                    size="sm"
                    variant="secondary"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    {selectedMenuOption} Properties
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Timeline - Fixed height */}
          <div className="h-64 border-t overflow-auto">
            <Timeline timeline={timeline} />
          </div>
        </div>
      </div>
    </div>
  );
};
