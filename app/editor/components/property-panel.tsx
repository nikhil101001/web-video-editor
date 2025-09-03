"use client";

import { useEditorStore } from "../store/use-editor";
import VideoPanel from "./sidebar-panels/video-panel";
import ImagePanel from "./sidebar-panels/image-panel";
import AudioPanel from "./sidebar-panels/audio-panel";
import TextPanel from "./sidebar-panels/text-panel";
import EffectsPanel from "./sidebar-panels/effects-panel";
import AnimationsPanel from "./sidebar-panels/animation-panel";
import ExportPanel from "./sidebar-panels/export-panel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMobile } from "../hooks/use-mobile";

export const PropertyPanel: React.FC = () => {
  const { selectedMenuOption, setSelectedMenuOption } = useEditorStore();
  const isMobile = useMobile();

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
      <div className="h-full flex flex-col md:border flex-shrink-0">
        {/* Panel Content */}
        <div className="flex-1 overflow-auto property-panel-content">
          {renderPanel()}
        </div>
      </div>

      {/* Mobile Dialog for Property Panel */}

      {selectedMenuOption && isMobile && (
        <Dialog open={true} onOpenChange={() => setSelectedMenuOption(null)}>
          <DialogContent className="max-w-[95vw] max-h-[80vh] overflow-auto">
            <DialogHeader>
              <DialogTitle className="capitalize">
                {selectedMenuOption} Properties
              </DialogTitle>
            </DialogHeader>
            <PropertyPanel />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
