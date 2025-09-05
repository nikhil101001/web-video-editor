"use client";

import { useState } from "react";
import { useEditorStore } from "../store/editor-store";
import {
  VIDEO_RESOLUTIONS,
  ASPECT_RATIOS,
  AspectRatioKey,
} from "../utils/editor-data";

interface ResolutionSelectorProps {
  className?: string;
}

export const ResolutionSelector = ({
  className = "",
}: ResolutionSelectorProps) => {
  const { exportSettings, setResolution } = useEditorStore();
  const [selectedAspectRatio, setSelectedAspectRatio] =
    useState<AspectRatioKey>("16:9");

  const currentResolution = exportSettings.resolution;
  const currentAspectRatio = currentResolution.width / currentResolution.height;

  // Find the closest matching aspect ratio
  const closestAspectRatio = ASPECT_RATIOS.reduce((closest, ar) => {
    const currentDiff = Math.abs(currentAspectRatio - ar.ratio);
    const closestDiff = Math.abs(currentAspectRatio - closest.ratio);
    return currentDiff < closestDiff ? ar : closest;
  });

  const handleAspectRatioChange = (aspectRatioKey: AspectRatioKey) => {
    setSelectedAspectRatio(aspectRatioKey);
    // Set to the default resolution for this aspect ratio (usually the highest quality one)
    const resolutions = VIDEO_RESOLUTIONS[aspectRatioKey];
    if (resolutions && resolutions.length > 0) {
      const defaultResolution = resolutions[0]; // First one is usually the highest quality
      setResolution(defaultResolution.width, defaultResolution.height);
    }
  };

  const handleResolutionChange = (width: number, height: number) => {
    setResolution(width, height);
  };

  const availableResolutions =
    VIDEO_RESOLUTIONS[selectedAspectRatio] ||
    VIDEO_RESOLUTIONS[closestAspectRatio.value];

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="text-sm font-medium text-gray-300">Video Resolution</div>

      {/* Current Resolution Display */}
      <div className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
        Current: {currentResolution.width} × {currentResolution.height}
        <span className="ml-2">({currentAspectRatio.toFixed(2)})</span>
      </div>

      {/* Aspect Ratio Selector */}
      <div>
        <label className="text-xs text-gray-400 block mb-1">Aspect Ratio</label>
        <select
          value={selectedAspectRatio}
          onChange={(e) =>
            handleAspectRatioChange(e.target.value as AspectRatioKey)
          }
          className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white focus:border-blue-500 focus:outline-none"
        >
          {ASPECT_RATIOS.map((ar) => (
            <option key={ar.value} value={ar.value}>
              {ar.label}
            </option>
          ))}
        </select>
      </div>

      {/* Resolution Presets */}
      <div>
        <label className="text-xs text-gray-400 block mb-1">
          Resolution Presets
        </label>
        <div className="grid grid-cols-1 gap-1">
          {availableResolutions.map((resolution) => {
            const isSelected =
              resolution.width === currentResolution.width &&
              resolution.height === currentResolution.height;

            return (
              <button
                key={`${resolution.width}x${resolution.height}`}
                onClick={() =>
                  handleResolutionChange(resolution.width, resolution.height)
                }
                className={`text-left px-2 py-1 rounded text-xs transition-colors ${
                  isSelected
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                <div className="font-medium">{resolution.name}</div>
                <div className="text-gray-400">
                  {resolution.width} × {resolution.height}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Resolution Input */}
      <div>
        <label className="text-xs text-gray-400 block mb-1">
          Custom Resolution
        </label>
        <div className="flex gap-1">
          <input
            type="number"
            placeholder="Width"
            min="1"
            max="7680"
            className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-white focus:border-blue-500 focus:outline-none"
            onChange={(e) => {
              const width = parseInt(e.target.value);
              if (width && currentResolution.height) {
                setResolution(width, currentResolution.height);
              }
            }}
          />
          <span className="text-gray-400 self-center">×</span>
          <input
            type="number"
            placeholder="Height"
            min="1"
            max="4320"
            className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-white focus:border-blue-500 focus:outline-none"
            onChange={(e) => {
              const height = parseInt(e.target.value);
              if (height && currentResolution.width) {
                setResolution(currentResolution.width, height);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};
