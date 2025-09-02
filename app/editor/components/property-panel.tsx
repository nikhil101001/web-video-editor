"use client";

import React, { useState } from "react";
import { useEditorStore } from "../store/use-editor";
import {
  X,
  Upload,
  Plus,
  Trash2,
  Settings,
  Palette,
  Layers,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const VideoPanel: React.FC = () => {
  const { addVideo, videos } = useEditorStore();
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const url = URL.createObjectURL(file);
        addVideo(url);
      });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files) {
      Array.from(files).forEach((file) => {
        if (file.type.startsWith("video/")) {
          const url = URL.createObjectURL(file);
          addVideo(url);
        }
      });
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Video Library</h3>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20"
            : "border-gray-300 dark:border-gray-600"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Drag and drop video files here, or click to browse
        </p>
        <input
          type="file"
          multiple
          accept="video/*"
          onChange={handleFileUpload}
          className="hidden"
          id="video-upload"
        />
        <Button asChild variant="outline" size="sm">
          <label htmlFor="video-upload" className="cursor-pointer">
            Browse Files
          </label>
        </Button>
      </div>

      {/* Video List */}
      {videos.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Uploaded Videos</h4>
          <div className="space-y-2">
            {videos.map((video, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-800 rounded"
              >
                <span className="text-sm truncate">Video {index + 1}</span>
                <Button variant="ghost" size="sm">
                  <Plus size={16} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ImagePanel: React.FC = () => {
  const { addImage, images } = useEditorStore();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const url = URL.createObjectURL(file);
        addImage(url);
      });
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Image Library</h3>

      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Upload image files
        </p>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
          id="image-upload"
        />
        <Button asChild variant="outline" size="sm">
          <label htmlFor="image-upload" className="cursor-pointer">
            Browse Images
          </label>
        </Button>
      </div>

      {images.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Uploaded Images</h4>
          <div className="grid grid-cols-2 gap-2">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`Image ${index + 1}`}
                  className="w-full h-20 object-cover rounded cursor-pointer"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100"
                >
                  <Plus size={14} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const AudioPanel: React.FC = () => {
  const { addAudio, audios } = useEditorStore();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const url = URL.createObjectURL(file);
        addAudio(url);
      });
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Audio Library</h3>

      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Upload audio files
        </p>
        <input
          type="file"
          multiple
          accept="audio/*"
          onChange={handleFileUpload}
          className="hidden"
          id="audio-upload"
        />
        <Button asChild variant="outline" size="sm">
          <label htmlFor="audio-upload" className="cursor-pointer">
            Browse Audio
          </label>
        </Button>
      </div>

      {audios.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Uploaded Audio</h4>
          <div className="space-y-2">
            {audios.map((audio, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-800 rounded"
              >
                <span className="text-sm truncate">Audio {index + 1}</span>
                <Button variant="ghost" size="sm">
                  <Plus size={16} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const TextPanel: React.FC = () => {
  const [text, setText] = useState("Enter your text here");
  const [fontSize, setFontSize] = useState(40);
  const [color, setColor] = useState("#ffffff");

  const handleAddText = () => {
    // This will be implemented to add text to canvas
    console.log("Adding text:", { text, fontSize, color });
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Add Text</h3>

      <div className="space-y-4">
        <div>
          <Label htmlFor="text-input">Text</Label>
          <Input
            id="text-input"
            value={text}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setText(e.target.value)
            }
            placeholder="Enter your text"
          />
        </div>

        <div>
          <Label htmlFor="font-size">Font Size</Label>
          <Input
            id="font-size"
            type="number"
            value={fontSize}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFontSize(Number(e.target.value))
            }
            min={12}
            max={200}
          />
        </div>

        <div>
          <Label htmlFor="text-color">Color</Label>
          <Input
            id="text-color"
            type="color"
            value={color}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setColor(e.target.value)
            }
          />
        </div>

        <Button onClick={handleAddText} className="w-full">
          <Plus size={16} className="mr-2" />
          Add Text
        </Button>
      </div>
    </div>
  );
};

const EffectsPanel: React.FC = () => {
  const effects = [
    { id: "none", name: "None" },
    { id: "blackAndWhite", name: "Black & White" },
    { id: "sepia", name: "Sepia" },
    { id: "invert", name: "Invert" },
    { id: "blur", name: "Blur" },
    { id: "brightness", name: "Brightness" },
    { id: "contrast", name: "Contrast" },
    { id: "saturate", name: "Saturate" },
  ];

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Effects</h3>

      <div className="grid grid-cols-2 gap-2">
        {effects.map((effect) => (
          <Button
            key={effect.id}
            variant="outline"
            size="sm"
            className="h-16 flex flex-col items-center justify-center"
            onClick={() => console.log("Apply effect:", effect.id)}
          >
            <Palette size={20} className="mb-1" />
            <span className="text-xs">{effect.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

const AnimationsPanel: React.FC = () => {
  const animations = [
    { id: "fadeIn", name: "Fade In" },
    { id: "fadeOut", name: "Fade Out" },
    { id: "slideIn", name: "Slide In" },
    { id: "zoomIn", name: "Zoom In" },
    { id: "zoomOut", name: "Zoom Out" },
  ];

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Animations</h3>

      <div className="space-y-2">
        {animations.map((animation) => (
          <Button
            key={animation.id}
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => console.log("Apply animation:", animation.id)}
          >
            <Layers size={16} className="mr-2" />
            {animation.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

const ExportPanel: React.FC = () => {
  const { exportSettings, setExportSettings, startExport, isExporting } =
    useEditorStore();

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Export Video</h3>

      <div className="space-y-4">
        <div>
          <Label htmlFor="format">Format</Label>
          <select
            id="format"
            value={exportSettings.format}
            onChange={(e) =>
              setExportSettings({ format: e.target.value as any })
            }
            className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-background"
          >
            <option value="mp4">MP4</option>
            <option value="webm">WebM</option>
            <option value="avi">AVI</option>
          </select>
        </div>

        <div>
          <Label htmlFor="quality">Quality</Label>
          <select
            id="quality"
            value={exportSettings.quality}
            onChange={(e) =>
              setExportSettings({ quality: e.target.value as any })
            }
            className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-background"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <Label htmlFor="fps">FPS</Label>
          <Input
            id="fps"
            type="number"
            value={exportSettings.fps}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setExportSettings({ fps: Number(e.target.value) })
            }
            min={15}
            max={60}
          />
        </div>

        <Button onClick={startExport} className="w-full" disabled={isExporting}>
          <Download size={16} className="mr-2" />
          {isExporting ? "Exporting..." : "Export Video"}
        </Button>
      </div>
    </div>
  );
};

export const PropertyPanel: React.FC = () => {
  const { selectedMenuOption, setSelectedMenuOption } = useEditorStore();

  const renderPanel = () => {
    switch (selectedMenuOption) {
      case "video":
        return <VideoPanel />;
      case "image":
        return <ImagePanel />;
      case "audio":
        return <AudioPanel />;
      case "text":
        return <TextPanel />;
      case "effects":
        return <EffectsPanel />;
      case "animations":
        return <AnimationsPanel />;
      case "export":
        return <ExportPanel />;
      default:
        return (
          <div className="p-4 text-center text-gray-500">
            Select a tool to get started
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <h2 className="text-lg font-semibold capitalize">
          {selectedMenuOption || "Properties"}
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedMenuOption(null)}
        >
          <X size={16} />
        </Button>
      </div>

      <div className="flex-1 overflow-auto">{renderPanel()}</div>
    </div>
  );
};
