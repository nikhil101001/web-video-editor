"use client";

import React, { useRef, useCallback, useState, useEffect } from "react";
import { useEditorStore } from "../store/use-editor";
import { formatTimeToMinSecMili } from "../utils";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TimelineProps {
  timeline: {
    seekTo: (time: number) => void;
    getVisibleElements: () => any[];
    getCurrentFrame: () => number;
    getTimeFromFrame: (frame: number) => number;
    currentTimeInMs: number;
    maxTime: number;
    playing: boolean;
    fps: number;
  };
}

export const Timeline: React.FC<TimelineProps> = ({ timeline }) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [zoom, setZoom] = useState(1);

  const {
    currentTimeInMs,
    maxTime,
    playing,
    play,
    pause,
    stop,
    editorElements,
    setCurrentTimeInMs,
  } = useEditorStore();

  const pixelsPerSecond = 100 * zoom;
  const timelineWidth = (maxTime / 1000) * pixelsPerSecond;

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (timelineRef.current) {
        setIsDragging(true);
        const rect = timelineRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - 48; // Account for 48px offset
        const time = (x / timelineWidth) * maxTime;
        const clampedTime = Math.max(0, Math.min(time, maxTime));
        timeline.seekTo(clampedTime);
      }
    },
    [timeline, timelineWidth, maxTime]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging && timelineRef.current) {
        const rect = timelineRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - 48; // Account for 48px offset
        const time = (x / timelineWidth) * maxTime;
        const clampedTime = Math.max(0, Math.min(time, maxTime));
        timeline.seekTo(clampedTime);
      }
    },
    [isDragging, timeline, timelineWidth, maxTime]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const playheadPosition = (currentTimeInMs / maxTime) * timelineWidth;

  const handleZoomIn = () => setZoom((prev) => Math.min(prev * 1.5, 5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev / 1.5, 0.1));

  const renderTimeMarkers = () => {
    const markers = [];
    const interval = 1000; // 1 second intervals
    const markerCount = Math.ceil(maxTime / interval);

    for (let i = 0; i <= markerCount; i++) {
      const time = i * interval;
      const position = (time / maxTime) * timelineWidth;

      markers.push(
        <div
          key={i}
          className="absolute top-0 border-l border-gray-600 h-4"
          style={{ left: position }}
        >
          <span className="absolute top-4 left-1 text-xs text-gray-400 transform -translate-x-1/2">
            {formatTimeToMinSecMili(time)}
          </span>
        </div>
      );
    }

    return markers;
  };

  const renderElements = () => {
    return editorElements.map((element, index) => {
      const startPosition = (element.timeFrame.start / maxTime) * timelineWidth;
      const duration = element.timeFrame.end - element.timeFrame.start;
      const width = (duration / maxTime) * timelineWidth;

      let backgroundColor = "#3b82f6";
      switch (element.type) {
        case "video":
          backgroundColor = "#ef4444";
          break;
        case "image":
          backgroundColor = "#10b981";
          break;
        case "audio":
          backgroundColor = "#f59e0b";
          break;
        case "text":
          backgroundColor = "#8b5cf6";
          break;
      }

      const trackIndex = index;
      const trackTop = 60 + trackIndex * 40;

      return (
        <React.Fragment key={element.id}>
          {/* Track Background */}
          <div
            className="absolute w-full h-8 bg-gray-900/30 border-b border-gray-700/50"
            style={{
              left: -48,
              top: trackTop,
              width: timelineWidth + 48,
            }}
          />

          {/* Track Label */}
          <div
            className="absolute w-8 h-8 flex items-center justify-center text-xs text-gray-400 font-medium bg-gray-800 border border-gray-700 rounded z-10"
            style={{
              left: -40,
              top: trackTop,
            }}
          >
            {trackIndex + 1}
          </div>

          {/* Element */}
          <div
            className="absolute h-8 rounded border-2 flex items-center px-2 text-white text-xs font-medium cursor-pointer hover:border-white transition-colors z-10"
            style={{
              left: startPosition,
              width: Math.max(width, 20),
              backgroundColor,
              top: trackTop,
            }}
            title={element.name}
          >
            <span className="truncate">{element.name}</span>
          </div>
        </React.Fragment>
      );
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Timeline Controls */}
      <div className="h-12 border-b flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={stop}>
            <SkipBack size={16} />
          </Button>

          <Button variant="ghost" size="sm" onClick={playing ? pause : play}>
            {playing ? <Pause size={16} /> : <Play size={16} />}
          </Button>

          <div className="text-sm font-mono">
            {formatTimeToMinSecMili(currentTimeInMs)} /{" "}
            {formatTimeToMinSecMili(maxTime)}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={handleZoomOut}>
            -
          </Button>
          <span className="text-xs text-gray-400">
            {Math.round(zoom * 100)}%
          </span>
          <Button variant="ghost" size="sm" onClick={handleZoomIn}>
            +
          </Button>
        </div>
      </div>

      {/* Timeline Ruler and Elements */}
      <div className="flex-1 relative overflow-auto">
        <div
          ref={timelineRef}
          className="relative h-full bg-gray-850 cursor-pointer pl-12"
          style={{ width: Math.max(timelineWidth + 60, 800) }}
          onMouseDown={handleMouseDown}
        >
          {/* Time markers */}
          <div className="absolute top-0 left-12 right-0 h-8">
            {renderTimeMarkers()}
          </div>

          {/* Playhead */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-blue-600 z-20 pointer-events-none"
            style={{ left: playheadPosition + 48 }}
          >
            <div className="absolute -top-2 -left-[7px] w-4 h-4 bg-blue-600 rotate-45 transform origin-center" />
          </div>

          {/* Elements */}
          <div className="absolute top-8 left-12 right-0 bottom-0">
            {renderElements()}
          </div>
        </div>
      </div>
    </div>
  );
};
