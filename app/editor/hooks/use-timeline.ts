import { useCallback, useEffect, useRef } from "react";
import { useEditorStore } from "../store/editor-store";

/**
 * Hook for managing the timeline and playback
 */
export const useTimeline = () => {
  const {
    currentTimeInMs,
    maxTime,
    playing,
    fps,
    setCurrentTimeInMs,
    setPlaying,
    editorElements,
  } = useEditorStore();

  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const updateTimeline = useCallback(
    (timestamp: number) => {
      if (!playing) return;

      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      const newTime = currentTimeInMs + deltaTime;

      if (newTime >= maxTime) {
        setCurrentTimeInMs(maxTime);
        setPlaying(false);
      } else {
        setCurrentTimeInMs(newTime);
        animationFrameRef.current = requestAnimationFrame(updateTimeline);
      }
    },
    [playing, currentTimeInMs, maxTime, setCurrentTimeInMs, setPlaying]
  );

  useEffect(() => {
    if (playing) {
      lastTimeRef.current = performance.now();
      animationFrameRef.current = requestAnimationFrame(updateTimeline);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [playing, updateTimeline]);

  const seekTo = useCallback(
    (timeInMs: number) => {
      const clampedTime = Math.max(0, Math.min(timeInMs, maxTime));
      setCurrentTimeInMs(clampedTime);
    },
    [maxTime, setCurrentTimeInMs]
  );

  const getVisibleElements = useCallback(() => {
    return editorElements.filter((element) => {
      const { start, end } = element.timeFrame;
      return currentTimeInMs >= start && currentTimeInMs <= end;
    });
  }, [editorElements, currentTimeInMs]);

  const getCurrentFrame = useCallback(() => {
    return Math.floor((currentTimeInMs / 1000) * fps);
  }, [currentTimeInMs, fps]);

  const getTimeFromFrame = useCallback(
    (frame: number) => {
      return (frame / fps) * 1000;
    },
    [fps]
  );

  return {
    seekTo,
    getVisibleElements,
    getCurrentFrame,
    getTimeFromFrame,
    currentTimeInMs,
    maxTime,
    playing,
    fps,
  };
};
