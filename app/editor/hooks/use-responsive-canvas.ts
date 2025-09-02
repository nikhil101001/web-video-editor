"use client";

import { useState, useEffect, useCallback } from "react";

interface CanvasSize {
  width: number;
  height: number;
  scale: number;
}

interface UseResponsiveCanvasOptions {
  originalWidth: number;
  originalHeight: number;
  containerPadding?: number;
  minScale?: number;
  maxScale?: number;
}

export const useResponsiveCanvas = ({
  originalWidth,
  originalHeight,
  containerPadding = 40,
  minScale = 0.1,
  maxScale = 2,
}: UseResponsiveCanvasOptions) => {
  const [canvasSize, setCanvasSize] = useState<CanvasSize>({
    width: originalWidth,
    height: originalHeight,
    scale: 1,
  });

  const [containerSize, setContainerSize] = useState({
    width: 0,
    height: 0,
  });

  const calculateCanvasSize = useCallback(
    (containerWidth: number, containerHeight: number) => {
      const availableWidth = containerWidth - containerPadding * 2;
      const availableHeight = containerHeight - containerPadding * 2;

      // Calculate scale to fit within container while maintaining aspect ratio
      const scaleX = availableWidth / originalWidth;
      const scaleY = availableHeight / originalHeight;
      let scale = Math.min(scaleX, scaleY);

      // Clamp scale to min/max values
      scale = Math.max(minScale, Math.min(maxScale, scale));

      const width = originalWidth * scale;
      const height = originalHeight * scale;

      return { width, height, scale };
    },
    [originalWidth, originalHeight, containerPadding, minScale, maxScale]
  );

  const updateCanvasSize = useCallback(
    (containerWidth: number, containerHeight: number) => {
      const newSize = calculateCanvasSize(containerWidth, containerHeight);
      setCanvasSize(newSize);
      setContainerSize({ width: containerWidth, height: containerHeight });
    },
    [calculateCanvasSize]
  );

  const fitToContainer = useCallback(
    (containerWidth: number, containerHeight: number) => {
      updateCanvasSize(containerWidth, containerHeight);
    },
    [updateCanvasSize]
  );

  const setZoom = useCallback(
    (newScale: number) => {
      const clampedScale = Math.max(minScale, Math.min(maxScale, newScale));
      const width = originalWidth * clampedScale;
      const height = originalHeight * clampedScale;

      setCanvasSize({ width, height, scale: clampedScale });
    },
    [originalWidth, originalHeight, minScale, maxScale]
  );

  const zoomIn = useCallback(() => {
    setZoom(canvasSize.scale * 1.2);
  }, [canvasSize.scale, setZoom]);

  const zoomOut = useCallback(() => {
    setZoom(canvasSize.scale / 1.2);
  }, [canvasSize.scale, setZoom]);

  const resetZoom = useCallback(() => {
    if (containerSize.width && containerSize.height) {
      updateCanvasSize(containerSize.width, containerSize.height);
    }
  }, [containerSize, updateCanvasSize]);

  return {
    canvasSize,
    containerSize,
    fitToContainer,
    setZoom,
    zoomIn,
    zoomOut,
    resetZoom,
    updateCanvasSize,
  };
};
