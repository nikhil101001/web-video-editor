import { Plus, Upload } from "lucide-react";
import { useEditorStore } from "../../store/use-editor";
import { Button } from "@/components/ui/button";

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
      <h3 className="text-xs font-semibold mb-4">Audio Library</h3>

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

export default AudioPanel;
