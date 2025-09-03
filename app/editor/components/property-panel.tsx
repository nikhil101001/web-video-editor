"use client";

import { useEditorStore } from "../store/use-editor";
import VideoPanel from "./sidebar-panels/video-panel";
import ImagePanel from "./sidebar-panels/image-panel";
import AudioPanel from "./sidebar-panels/audio-panel";
import TextPanel from "./sidebar-panels/text-panel";
import EffectsPanel from "./sidebar-panels/effects-panel";
import AnimationsPanel from "./sidebar-panels/animation-panel";
import ExportPanel from "./sidebar-panels/export-panel";

export const PropertyPanel: React.FC = () => {
  const { selectedMenuOption } = useEditorStore();

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
    <div>
      <div className="h-full flex flex-col flex-shrink-0">
        {/* Panel Content */}
        <div className="flex-1 overflow-auto property-panel-content">
          {renderPanel()}
        </div>
      </div>
    </div>
  );
};
