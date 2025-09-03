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
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const [timelinePanelSize, setTimelinePanelSize] = useState(25); // Track timeline panel size

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

    // Ensure we have valid dimensions before updating
    if (containerRect.width > 0 && containerRect.height > 0) {
      // Fit canvas to the available container space
      fitToContainer(containerRect.width, containerRect.height);
    }
  }, [fitToContainer]);

  // Handle window resize with improved debouncing
  useEffect(() => {
    const handleResize = () => {
      // Clear previous timeout
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      // Debounce resize updates
      resizeTimeoutRef.current = setTimeout(() => {
        updateCanvasSize();
      }, 100);
    };

    // Initial update with a small delay to ensure DOM is ready
    const initialTimeout = setTimeout(() => {
      updateCanvasSize();
    }, 100);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      clearTimeout(initialTimeout);
    };
  }, [updateCanvasSize]);

  // Initialize canvas only once when conditions are met
  useEffect(() => {
    // Ensure we have all required conditions before initializing
    const shouldInitialize =
      canvasRef.current &&
      canvasSize.width > 0 &&
      canvasSize.height > 0 &&
      !isCanvasInitialized &&
      !canvas;

    if (shouldInitialize) {
      const timeoutId = setTimeout(() => {
        // Double-check conditions haven't changed during timeout
        if (canvasRef.current && !canvas && !isCanvasInitialized) {
          console.log("Initializing canvas with size:", canvasSize);
          try {
            initializeCanvas(
              canvasRef.current,
              canvasSize.width,
              canvasSize.height
            );
            setIsCanvasInitialized(true);
          } catch (error) {
            console.error("Failed to initialize canvas:", error);
            // Reset state to allow retry
            setIsCanvasInitialized(false);
          }
        }
      }, 150);

      return () => clearTimeout(timeoutId);
    }
  }, [
    canvasSize.width,
    canvasSize.height,
    initializeCanvas,
    isCanvasInitialized,
    canvas,
  ]);

  // Update fabric canvas size when responsive canvas size changes (only if canvas is initialized)
  useEffect(() => {
    if (
      isCanvasInitialized &&
      canvas &&
      canvasSize.width > 0 &&
      canvasSize.height > 0
    ) {
      const timeoutId = setTimeout(() => {
        updateFabricCanvasSize(canvasSize.width, canvasSize.height);
      }, 50);

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

  // Canvas component to avoid duplication
  const CanvasComponent = () => (
    <div
      ref={canvasContainerRef}
      className="h-full flex items-center justify-center p-4 relative overflow-hidden bg-foreground/5"
      onClick={handleOutsideClick}
    >
      <div className="relative max-w-full max-h-full">
        {!isCanvasInitialized && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 border border-gray-300 rounded-sm">
            <div className="text-gray-500">Loading canvas...</div>
          </div>
        )}
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          style={{
            backgroundColor,
            width: "100%",
            height: "100%",
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            display: "block",
            opacity: isCanvasInitialized ? 1 : 0,
            transition: "opacity 0.3s ease-in-out",
          }}
          className="shadow-lg video-editor-canvas"
        />
      </div>
    </div>
  );

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
          {selectedMenuOption && isMobile && (
            <Dialog
              open={true}
              onOpenChange={() => setSelectedMenuOption(null)}
            >
              <DialogContent className="max-w-[95vw] max-h-[80vh] overflow-auto">
                <DialogHeader>
                  <DialogTitle className="capitalize">
                    {selectedMenuOption} Properties
                  </DialogTitle>
                </DialogHeader>
                <PropertyPanel />
              </DialogContent>
            </Dialog>
          )}

          {/* Timeline - Resizable */}
          <ResizablePanelGroup
            direction="vertical"
            className="h-full"
            onLayout={(sizes) => {
              if (sizes[1]) {
                setTimelinePanelSize(sizes[1]);
                // Trigger canvas resize when timeline size changes
                setTimeout(() => {
                  updateCanvasSize();
                }, 100);
              }
            }}
          >
            {/* Canvas and Property Panel Area */}
            <ResizablePanel defaultSize={75} minSize={40}>
              <div className="h-full flex min-h-0 relative">
                {/* Desktop Resizable Panel Group */}
                {selectedMenuOption && !isMobile ? (
                  <ResizablePanelGroup
                    direction="horizontal"
                    className="min-h-0 h-full"
                    onLayout={(sizes) => {
                      if (sizes[0]) {
                        setPropertyPanelSize(sizes[0]);
                        // Trigger canvas resize when property panel size changes
                        setTimeout(() => {
                          updateCanvasSize();
                        }, 50);
                      }
                    }}
                  >
                    {/* Property Panel - Resizable */}
                    <ResizablePanel
                      defaultSize={propertyPanelSize}
                      minSize={15}
                      maxSize={50}
                      className="min-w-[280px] h-full"
                    >
                      <PropertyPanel />
                    </ResizablePanel>

                    {/* Resize Handle */}
                    <ResizableHandle
                      withHandle
                      className="hover:bg-blue-500/50 w-0.5 opacity-0 hover:opacity-100 transition-all"
                    />

                    {/* Canvas Container */}
                    <ResizablePanel
                      defaultSize={100 - propertyPanelSize}
                      minSize={50}
                      className="relative"
                    >
                      <CanvasComponent />
                    </ResizablePanel>
                  </ResizablePanelGroup>
                ) : (
                  /* Canvas Container when no property panel is shown or on mobile */
                  <div className="flex-1 min-h-0 relative">
                    <CanvasComponent />
                  </div>
                )}
              </div>
            </ResizablePanel>

            {/* Resize Handle for Timeline */}
            <ResizableHandle
              withHandle
              className="hover:bg-blue-500/50 h-0.5 opacity-0 hover:opacity-100 transition-all"
            />

            {/* Timeline Panel - Resizable */}
            <ResizablePanel defaultSize={25} minSize={15} maxSize={50}>
              <div className="h-full border-t overflow-auto">
                <Timeline timeline={timeline} />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  );
};
