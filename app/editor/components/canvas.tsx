"use client";

import React, { forwardRef } from "react";
import { backgroundColor as defaultBackgroundColor } from "../utils/editor-data";

interface CanvasProps {
  width: number;
  height: number;
  backgroundColor?: string;
}

export const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>(
  ({ width, height, backgroundColor = defaultBackgroundColor }, ref) => {
    return (
      <canvas
        ref={ref}
        width={width}
        height={height}
        style={{
          backgroundColor,
          maxWidth: "100%",
          maxHeight: "100%",
        }}
      />
    );
  }
);

Canvas.displayName = "Canvas";
