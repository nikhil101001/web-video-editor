import { useCallback } from "react";
import * as fabric from "fabric";
import { useEditorStore } from "../store/use-editor";
import { FabricUtils } from "../utils";

/**
 * Hook for managing the canvas and fabric objects
 */
export const useCanvas = () => {
  const {
    canvas,
    setCanvas,
    editorElements,
    selectedElement,
    setSelectedElement,
    backgroundColor,
    refreshElements,
  } = useEditorStore();

  const initializeCanvas = useCallback(
    (canvasElement: HTMLCanvasElement, width: number, height: number) => {
      try {
        // Check if canvas is already initialized
        if (canvas) {
          console.warn("Canvas already initialized, disposing first");
          canvas.dispose();
          setCanvas(null);
        }

        // Check if the canvas element already has a fabric canvas
        if ((canvasElement as any).__fabric) {
          console.warn(
            "Canvas element already has fabric instance, disposing first"
          );
          (canvasElement as any).__fabric.dispose();
        }

        // Validate dimensions
        if (width <= 0 || height <= 0) {
          console.error("Invalid canvas dimensions:", { width, height });
          return null;
        }

        const fabricCanvas = new fabric.Canvas(canvasElement, {
          backgroundColor,
          height,
          width,
          selection: true,
          preserveObjectStacking: true,
          controlsAboveOverlay: true,
        });

        // Wait for canvas to be fully initialized
        setTimeout(() => {
          if (fabricCanvas.lowerCanvasEl && fabricCanvas.upperCanvasEl) {
            fabricCanvas.calcOffset();
          }
        }, 50);

        // Set default object properties
        fabric.FabricObject.prototype.set({
          cornerColor: "#FFF",
          cornerStyle: "circle",
          borderColor: "#3b82f6",
          borderScaleFactor: 1.5,
          transparentCorners: false,
          borderOpacityWhenMoving: 0.5,
          cornerStrokeColor: "#3b82f6",
          cornerSize: 10,
          hasControls: true,
          hasBorders: true,
          selectable: true,
          lockUniScaling: false,
        });

        // Handle selection events
        fabricCanvas.on("selection:created", (e) => {
          const activeObject = e.selected?.[0];
          if (activeObject) {
            const element = editorElements.find(
              (el) => el.fabricObject === activeObject
            );
            if (element) {
              setSelectedElement(element);
            }
          }
        });

        fabricCanvas.on("selection:updated", (e) => {
          const activeObject = e.selected?.[0];
          if (activeObject) {
            const element = editorElements.find(
              (el) => el.fabricObject === activeObject
            );
            if (element) {
              setSelectedElement(element);
            }
          }
        });

        fabricCanvas.on("selection:cleared", () => {
          setSelectedElement(null);
        });

        // Handle object modification
        fabricCanvas.on("object:modified", (e) => {
          const modifiedObject = e.target;
          const element = editorElements.find(
            (el) => el.fabricObject === modifiedObject
          );
          if (element && modifiedObject) {
            // Update element placement based on fabric object
            const newPlacement = {
              x: modifiedObject.left || 0,
              y: modifiedObject.top || 0,
              width: (modifiedObject.width || 0) * (modifiedObject.scaleX || 1),
              height:
                (modifiedObject.height || 0) * (modifiedObject.scaleY || 1),
              rotation: modifiedObject.angle || 0,
              scaleX: modifiedObject.scaleX || 1,
              scaleY: modifiedObject.scaleY || 1,
            };

            console.log("Object modified:", element.id, newPlacement);
          }
        });

        setCanvas(fabricCanvas);
        return fabricCanvas;
      } catch (error) {
        console.error("Error initializing canvas:", error);
        return null;
      }
    },
    [backgroundColor, editorElements, setCanvas, setSelectedElement]
  );

  const addObjectToCanvas = useCallback(
    (fabricObject: any, element: any) => {
      if (!canvas) return;

      FabricUtils.setFabricObjectProperties(fabricObject, element);
      canvas.add(fabricObject);
      canvas.renderAll();
    },
    [canvas]
  );

  const removeObjectFromCanvas = useCallback(
    (fabricObject: any) => {
      if (!canvas) return;

      canvas.remove(fabricObject);
      canvas.renderAll();
    },
    [canvas]
  );

  const clearCanvas = useCallback(() => {
    if (!canvas) return;

    canvas.clear();
    canvas.renderAll();
  }, [canvas]);

  const updateCanvasSize = useCallback(
    (width: number, height: number) => {
      if (!canvas) return;

      try {
        // Check if canvas is properly initialized with lower canvas element
        if (!canvas.lowerCanvasEl) {
          console.warn("Canvas lower element not ready, skipping size update");
          return;
        }

        canvas.setWidth(width);
        canvas.setHeight(height);
        canvas.renderAll();
      } catch (error) {
        console.error("Error updating canvas size:", error);
        // Try to reinitialize canvas if it's in a broken state
        if (canvas.lowerCanvasEl && canvas.upperCanvasEl) {
          canvas.calcOffset();
        }
      }
    },
    [canvas]
  );

  const centerObject = useCallback(
    (fabricObject: any) => {
      if (!canvas) return;

      fabricObject.center();
      canvas.renderAll();
    },
    [canvas]
  );

  const disposeCanvas = useCallback(() => {
    if (canvas) {
      canvas.dispose();
      setCanvas(null);
    }
  }, [canvas, setCanvas]);

  return {
    initializeCanvas,
    addObjectToCanvas,
    removeObjectFromCanvas,
    clearCanvas,
    updateCanvasSize,
    centerObject,
    disposeCanvas,
    canvas,
  };
};
