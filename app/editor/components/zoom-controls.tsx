"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface ZoomControlsProps {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  className?: string;
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({
  scale,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  className = "",
}) => {
  const zoomPercentage = Math.round(scale * 100);

  return (
    <div
      className={`flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg p-2 ${className}`}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={onZoomOut}
        disabled={scale <= 0.1}
        className="h-8 w-8 p-0"
      >
        -
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={onResetZoom}
        className="h-8 px-3 text-xs"
      >
        {zoomPercentage}%
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={onZoomIn}
        disabled={scale >= 2}
        className="h-8 w-8 p-0"
      >
        +
      </Button>
    </div>
  );
};
