"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ResizeHandleProps {
  direction: "horizontal" | "vertical" | "both";
  onMouseDown: (
    e: React.MouseEvent,
    direction: "horizontal" | "vertical" | "both"
  ) => void;
  onTouchStart?: (
    e: React.TouchEvent,
    direction: "horizontal" | "vertical" | "both"
  ) => void;
  className?: string;
  isResizing?: boolean;
}

export const ResizeHandle: React.FC<ResizeHandleProps> = ({
  direction,
  onMouseDown,
  onTouchStart,
  className,
  isResizing = false,
}) => {
  const baseClasses =
    "absolute bg-blue-500 opacity-0 hover:opacity-100 transition-opacity cursor-resize touch-none";

  const directionClasses = {
    horizontal: "top-0 right-0 w-1 h-full cursor-col-resize",
    vertical: "bottom-0 left-0 w-full h-1 cursor-row-resize",
    both: "bottom-0 right-0 w-3 h-3 cursor-nw-resize",
  };

  return (
    <div
      className={cn(
        baseClasses,
        directionClasses[direction],
        isResizing && "opacity-100",
        className
      )}
      onMouseDown={(e) => onMouseDown(e, direction)}
      onTouchStart={(e) => onTouchStart?.(e, direction)}
    />
  );
};

interface ResizablePanelProps {
  children: React.ReactNode;
  width?: number;
  height?: number;
  onMouseDown?: (
    e: React.MouseEvent,
    direction: "horizontal" | "vertical" | "both"
  ) => void;
  onTouchStart?: (
    e: React.TouchEvent,
    direction: "horizontal" | "vertical" | "both"
  ) => void;
  isResizing?: boolean;
  className?: string;
  enableHorizontalResize?: boolean;
  enableVerticalResize?: boolean;
}

export const ResizablePanel: React.FC<ResizablePanelProps> = ({
  children,
  width,
  height,
  onMouseDown,
  onTouchStart,
  isResizing = false,
  className,
  enableHorizontalResize = false,
  enableVerticalResize = false,
}) => {
  return (
    <div
      className={cn("relative", className)}
      style={{
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined,
      }}
    >
      {children}

      {enableHorizontalResize && onMouseDown && (
        <ResizeHandle
          direction="horizontal"
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          isResizing={isResizing}
        />
      )}

      {enableVerticalResize && onMouseDown && (
        <ResizeHandle
          direction="vertical"
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          isResizing={isResizing}
        />
      )}

      {enableHorizontalResize && enableVerticalResize && onMouseDown && (
        <ResizeHandle
          direction="both"
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          isResizing={isResizing}
        />
      )}
    </div>
  );
};
