"use client";

import { useState, useCallback, useRef, useEffect } from "react";

export interface ResizableState {
  width: number;
  height: number;
  isResizing: boolean;
}

export interface UseResizableOptions {
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  initialWidth?: number;
  initialHeight?: number;
  onResize?: (width: number, height: number) => void;
}

export const useResizable = ({
  minWidth = 200,
  maxWidth = 800,
  minHeight = 100,
  maxHeight = 600,
  initialWidth = 300,
  initialHeight = 200,
  onResize,
}: UseResizableOptions = {}) => {
  const [state, setState] = useState<ResizableState>({
    width: initialWidth,
    height: initialHeight,
    isResizing: false,
  });

  const startPos = useRef({ x: 0, y: 0 });
  const startSize = useRef({ width: 0, height: 0 });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, direction: "horizontal" | "vertical" | "both") => {
      e.preventDefault();

      startPos.current = { x: e.clientX, y: e.clientY };
      startSize.current = { width: state.width, height: state.height };

      setState((prev) => ({ ...prev, isResizing: true }));

      const handleMouseMove = (e: MouseEvent) => {
        const deltaX = e.clientX - startPos.current.x;
        const deltaY = e.clientY - startPos.current.y;

        let newWidth = state.width;
        let newHeight = state.height;

        if (direction === "horizontal" || direction === "both") {
          newWidth = Math.max(
            minWidth,
            Math.min(maxWidth, startSize.current.width + deltaX)
          );
        }

        if (direction === "vertical" || direction === "both") {
          newHeight = Math.max(
            minHeight,
            Math.min(maxHeight, startSize.current.height + deltaY)
          );
        }

        setState((prev) => ({
          ...prev,
          width: newWidth,
          height: newHeight,
        }));

        onResize?.(newWidth, newHeight);
      };

      const handleMouseUp = () => {
        setState((prev) => ({ ...prev, isResizing: false }));
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [
      state.width,
      state.height,
      minWidth,
      maxWidth,
      minHeight,
      maxHeight,
      onResize,
    ]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent, direction: "horizontal" | "vertical" | "both") => {
      e.preventDefault();

      const touch = e.touches[0];
      startPos.current = { x: touch.clientX, y: touch.clientY };
      startSize.current = { width: state.width, height: state.height };

      setState((prev) => ({ ...prev, isResizing: true }));

      const handleTouchMove = (e: TouchEvent) => {
        const touch = e.touches[0];
        const deltaX = touch.clientX - startPos.current.x;
        const deltaY = touch.clientY - startPos.current.y;

        let newWidth = state.width;
        let newHeight = state.height;

        if (direction === "horizontal" || direction === "both") {
          newWidth = Math.max(
            minWidth,
            Math.min(maxWidth, startSize.current.width + deltaX)
          );
        }

        if (direction === "vertical" || direction === "both") {
          newHeight = Math.max(
            minHeight,
            Math.min(maxHeight, startSize.current.height + deltaY)
          );
        }

        setState((prev) => ({
          ...prev,
          width: newWidth,
          height: newHeight,
        }));

        onResize?.(newWidth, newHeight);
      };

      const handleTouchEnd = () => {
        setState((prev) => ({ ...prev, isResizing: false }));
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };

      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleTouchEnd);
    },
    [
      state.width,
      state.height,
      minWidth,
      maxWidth,
      minHeight,
      maxHeight,
      onResize,
    ]
  );

  const resize = useCallback(
    (width: number, height: number) => {
      const newWidth = Math.max(minWidth, Math.min(maxWidth, width));
      const newHeight = Math.max(minHeight, Math.min(maxHeight, height));

      setState((prev) => ({
        ...prev,
        width: newWidth,
        height: newHeight,
      }));

      onResize?.(newWidth, newHeight);
    },
    [minWidth, maxWidth, minHeight, maxHeight, onResize]
  );

  return {
    ...state,
    handleMouseDown,
    handleTouchStart,
    resize,
  };
};
