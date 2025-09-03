import { useState } from "react";
import { useEditorStore } from "../../store/use-editor";
import { Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      <h3 className="text-xs font-semibold mb-4">Video Library</h3>

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

export default VideoPanel;
