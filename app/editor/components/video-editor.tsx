"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useEditorStore } from "../store/editor-store";
import { useEditor } from "../hooks/use-editor";
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
  const isMobile = useMobile();

  const {
    backgroundColor,
    selectedMenuOption,
    setSelectedMenuOption,
    propertyPanelSize,
    setPropertyPanelSize,
    pixiApp,
  } = useEditorStore();

  const { initializeEditor, disposeEditor, updateCanvasSize } = useEditor();
  const [isCanvasInitialized, setIsCanvasInitialized] = useState(false);
  const [timelinePanelSize, setTimelinePanelSize] = useState(25);

  // Use the project's resolution settings for aspect ratio calculation
  const projectWidth = exportSettings.resolution.width;
  const projectHeight = exportSettings.resolution.height;
  const aspectRatio = projectWidth / projectHeight;

  // Initialize canvas size and handle responsive behavior
  const { canvasSize } = useResponsiveCanvas({
    originalWidth: projectWidth,
    originalHeight: projectHeight,
    containerPadding: 40,
  });

  // Initialize PIXI editor on mount
  useEffect(() => {
    if (!canvasRef.current) return;

    const initEditor = async () => {
      const success = await initializeEditor(canvasRef.current, {
        width: canvasSize.width,
        height: canvasSize.height,
        backgroundColor,
      });

      if (success) {
        setIsCanvasInitialized(true);
      }
    };

    initEditor();

    return () => {
      disposeEditor();
      setIsCanvasInitialized(false);
    };
  }, [canvasSize, backgroundColor, initializeEditor, disposeEditor]);

  // Handle canvas resizing with debouncing
  const debouncedResize = useCallback(() => {
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }

    resizeTimeoutRef.current = setTimeout(() => {
      if (
        isCanvasInitialized &&
        canvasSize.width > 0 &&
        canvasSize.height > 0
      ) {
        updateCanvasSize(canvasSize.width, canvasSize.height);
      }
    }, 100);
  }, [isCanvasInitialized, canvasSize, updateCanvasSize]);

  useEffect(() => {
    debouncedResize();
  }, [debouncedResize]);

  // Cleanup resize timeout on unmount
  useEffect(() => {
    return () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, []);

  // Initialize keyboard shortcuts
  useKeyboardShortcuts();

  // Timeline controls
  const {
    playing: isPlaying,
    currentTimeInMs: currentTime,
    seekTo,
  } = useTimeline();

  const handleTimelineResize = useCallback((size: number) => {
    const newTimelineSize = size || 25;
    setTimelinePanelSize(Math.max(15, Math.min(newTimelineSize, 50)));
  }, []);

  const handlePropertyPanelResize = useCallback(
    (size: number) => {
      const newPropertyPanelSize = size || propertyPanelSize;
      setPropertyPanelSize(Math.max(15, Math.min(newPropertyPanelSize, 50)));
    },
    [propertyPanelSize, setPropertyPanelSize]
  );

  if (isMobile) {
    return (
      <div className="h-screen w-full bg-gray-900 flex flex-col overflow-hidden">
        <Navbar />

        <div className="flex-1 flex flex-col min-h-0">
          {/* Mobile Canvas Area */}
          <div className="flex-1 p-4 min-h-0">
            <div
              ref={canvasContainerRef}
              className="w-full h-full bg-black rounded-lg overflow-hidden flex items-center justify-center"
              style={{
                backgroundColor,
              }}
            >
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-full"
                style={{
                  width: `${canvasSize.width}px`,
                  height: `${canvasSize.height}px`,
                }}
              />
            </div>
          </div>

          {/* Mobile Timeline */}
          <div className="h-32 border-t border-gray-700">
            <Timeline
              timeline={{
                seekTo,
                getVisibleElements: () => [],
                getCurrentFrame: () => Math.floor(currentTime / (1000 / 30)),
                getTimeFromFrame: (frame: number) => frame * (1000 / 30),
                currentTimeInMs: currentTime,
                maxTime,
                playing: isPlaying,
                fps: 30,
              }}
            />
          </div>
        </div>

        {/* Mobile Sidebar Modal */}
        <Dialog
          open={selectedMenuOption !== null}
          onOpenChange={() => setSelectedMenuOption(null)}
        >
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>
                {selectedMenuOption
                  ? selectedMenuOption.charAt(0).toUpperCase() +
                    selectedMenuOption.slice(1)
                  : "Options"}
              </DialogTitle>
            </DialogHeader>
            <div className="max-h-96 overflow-y-auto">
              <Sidebar />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-gray-900 flex flex-col overflow-hidden">
      <Navbar />

      <div className="flex-1 flex min-h-0">
        <ResizablePanelGroup direction="vertical" className="flex-1">
          {/* Main Content Area */}
          <ResizablePanel defaultSize={75} minSize={50} maxSize={85}>
            <ResizablePanelGroup direction="horizontal">
              {/* Sidebar */}
              <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                <Sidebar />
              </ResizablePanel>

              <ResizableHandle />

              {/* Canvas Area */}
              <ResizablePanel defaultSize={60} minSize={40}>
                <div className="h-full p-4 flex items-center justify-center">
                  <div
                    ref={canvasContainerRef}
                    className="relative bg-black rounded-lg overflow-hidden flex items-center justify-center shadow-2xl"
                    style={{
                      backgroundColor,
                      width: `${canvasSize.width}px`,
                      height: `${canvasSize.height}px`,
                    }}
                  >
                    <canvas
                      ref={canvasRef}
                      className="w-full h-full"
                      style={{
                        width: `${canvasSize.width}px`,
                        height: `${canvasSize.height}px`,
                      }}
                    />
                  </div>
                </div>
              </ResizablePanel>

              <ResizableHandle />

              {/* Property Panel */}
              <ResizablePanel
                defaultSize={propertyPanelSize}
                minSize={15}
                maxSize={35}
                onResize={handlePropertyPanelResize}
              >
                <PropertyPanel />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>

          <ResizableHandle />

          {/* Timeline */}
          <ResizablePanel
            defaultSize={timelinePanelSize}
            minSize={15}
            maxSize={50}
            onResize={handleTimelineResize}
          >
            <Timeline
              timeline={{
                seekTo,
                getVisibleElements: () => [],
                getCurrentFrame: () => Math.floor(currentTime / (1000 / 30)),
                getTimeFromFrame: (frame: number) => frame * (1000 / 30),
                currentTimeInMs: currentTime,
                maxTime,
                playing: isPlaying,
                fps: 30,
              }}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};
