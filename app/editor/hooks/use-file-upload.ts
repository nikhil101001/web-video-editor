import { useCallback, useState } from "react";
import { useEditorStore } from "../store/use-editor";
import { isVideoFile, isImageFile, isAudioFile, generateId } from "../utils";
import { EditorElement } from "../types";

interface UseFileUploadOptions {
  onSuccess?: (files: File[]) => void;
  onError?: (error: string) => void;
  acceptedTypes?: string[];
}

export const useFileUpload = (options: UseFileUploadOptions = {}) => {
  const [uploading, setUploading] = useState(false);
  const { addElement, addVideo, addImage, addAudio } = useEditorStore();

  const validateFile = useCallback(
    (file: File): boolean => {
      const { acceptedTypes } = options;

      if (acceptedTypes && acceptedTypes.length > 0) {
        return acceptedTypes.some((type) => file.type.startsWith(type));
      }

      return (
        isVideoFile(file.name) ||
        isImageFile(file.name) ||
        isAudioFile(file.name)
      );
    },
    [options]
  );

  const createElementFromFile = useCallback(
    (file: File, url: string): EditorElement | null => {
      const id = generateId();
      const name = file.name;

      const baseElement = {
        id,
        name,
        placement: {
          x: 100,
          y: 100,
          width: 300,
          height: 200,
          rotation: 0,
          scaleX: 1,
          scaleY: 1,
        },
        timeFrame: {
          start: 0,
          end: 5000, // 5 seconds default
        },
      };

      if (isVideoFile(file.name)) {
        return {
          ...baseElement,
          type: "video" as const,
          properties: {
            src: url,
            elementId: id,
            effect: { type: "none" as const },
            volume: 1,
            muted: false,
          },
        };
      }

      if (isImageFile(file.name)) {
        return {
          ...baseElement,
          type: "image" as const,
          properties: {
            src: url,
            elementId: id,
            effect: { type: "none" as const },
          },
        };
      }

      if (isAudioFile(file.name)) {
        return {
          ...baseElement,
          type: "audio" as const,
          placement: {
            ...baseElement.placement,
            height: 50, // Audio elements are shorter
          },
          properties: {
            src: url,
            elementId: id,
            volume: 1,
            muted: false,
          },
        };
      }

      return null;
    },
    []
  );

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      setUploading(true);

      try {
        const fileArray = Array.from(files);
        const validFiles = fileArray.filter(validateFile);

        if (validFiles.length === 0) {
          throw new Error("No valid files selected");
        }

        for (const file of validFiles) {
          const url = URL.createObjectURL(file);

          // Add to appropriate library
          if (isVideoFile(file.name)) {
            addVideo(url);
          } else if (isImageFile(file.name)) {
            addImage(url);
          } else if (isAudioFile(file.name)) {
            addAudio(url);
          }

          // Create element and add to timeline
          const element = createElementFromFile(file, url);
          if (element) {
            addElement(element);
          }
        }

        options.onSuccess?.(validFiles);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Upload failed";
        options.onError?.(message);
      } finally {
        setUploading(false);
      }
    },
    [
      validateFile,
      createElementFromFile,
      addElement,
      addVideo,
      addImage,
      addAudio,
      options,
    ]
  );

  const uploadFromInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files && files.length > 0) {
        uploadFiles(files);
      }
      // Reset input to allow uploading the same file again
      event.target.value = "";
    },
    [uploadFiles]
  );

  const uploadFromDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();

      const files = event.dataTransfer.files;
      if (files && files.length > 0) {
        uploadFiles(files);
      }
    },
    [uploadFiles]
  );

  const createDropHandlers = useCallback(() => {
    const handleDragOver = (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
    };

    const handleDragEnter = (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
    };

    const handleDragLeave = (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
    };

    return {
      onDrop: uploadFromDrop,
      onDragOver: handleDragOver,
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
    };
  }, [uploadFromDrop]);

  return {
    uploading,
    uploadFiles,
    uploadFromInput,
    uploadFromDrop,
    createDropHandlers,
    validateFile,
  };
};
