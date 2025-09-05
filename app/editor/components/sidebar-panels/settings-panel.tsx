import { Download } from "lucide-react";
import { useEditorStore } from "../../store/editor-store";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ResolutionSelector } from "../resolution-selector";

const SettingsPanel = () => {
  const { exportSettings, setExportSettings, startExport, isExporting } =
    useEditorStore();

  return (
    <div className="p-4">
      <h3 className="text-xs font-semibold mb-4">Project Settings</h3>

      <div className="space-y-6">
        {/* Resolution Settings */}
        <ResolutionSelector />

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

export default SettingsPanel;
