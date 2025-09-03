import { useCallback, useEffect, useRef } from "react";
import { useEditorStore } from "../store/use-editor";

interface KeyboardShortcutsOptions {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetZoom?: () => void;
}

/**
 * Hook for handling keyboard shortcuts in the editor
 */
export const useKeyboardShortcuts = (
  options: KeyboardShortcutsOptions = {}
) => {
  const {
    undo,
    redo,
    play,
    pause,
    stop,
    duplicateElement,
    removeElement,
    selectedElement,
    playing,
  } = useEditorStore();

  const { onZoomIn, onZoomOut, onResetZoom } = options;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Prevent shortcuts when typing in input fields
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const { ctrlKey, metaKey, shiftKey, key } = event;
      const isModifierPressed = ctrlKey || metaKey;

      switch (key.toLowerCase()) {
        case "z":
          if (isModifierPressed && shiftKey) {
            event.preventDefault();
            redo();
          } else if (isModifierPressed) {
            event.preventDefault();
            undo();
          }
          break;

        case "y":
          if (isModifierPressed) {
            event.preventDefault();
            redo();
          }
          break;

        case "d":
          if (isModifierPressed && selectedElement) {
            event.preventDefault();
            duplicateElement(selectedElement.id);
          }
          break;

        case "delete":
        case "backspace":
          if (selectedElement) {
            event.preventDefault();
            removeElement(selectedElement.id);
          }
          break;

        case " ":
          event.preventDefault();
          if (playing) {
            pause();
          } else {
            play();
          }
          break;

        case "escape":
          event.preventDefault();
          stop();
          break;

        case "+":
        case "=":
          if (isModifierPressed && onZoomIn) {
            event.preventDefault();
            onZoomIn();
          }
          break;

        case "-":
          if (isModifierPressed && onZoomOut) {
            event.preventDefault();
            onZoomOut();
          }
          break;

        case "0":
          if (isModifierPressed && onResetZoom) {
            event.preventDefault();
            onResetZoom();
          }
          break;

        default:
          break;
      }
    },
    [
      undo,
      redo,
      play,
      pause,
      stop,
      duplicateElement,
      removeElement,
      selectedElement,
      playing,
      onZoomIn,
      onZoomOut,
      onResetZoom,
    ]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return { handleKeyDown };
};
