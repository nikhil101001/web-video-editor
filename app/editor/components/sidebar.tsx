"use client";

import React from "react";
import { useEditorStore } from "../store/use-editor";
import {
  Video,
  Image,
  Music,
  Type,
  Wand2,
  Download,
  Settings,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  onClick: () => void;
}

export const Sidebar: React.FC = () => {
  const { selectedMenuOption, setSelectedMenuOption } = useEditorStore();

  const sidebarItems: SidebarItem[] = [
    {
      id: "video",
      label: "Video",
      icon: Video,
      onClick: () =>
        setSelectedMenuOption(selectedMenuOption === "video" ? null : "video"),
    },
    {
      id: "image",
      label: "Image",
      icon: Image,
      onClick: () =>
        setSelectedMenuOption(selectedMenuOption === "image" ? null : "image"),
    },
    {
      id: "audio",
      label: "Audio",
      icon: Music,
      onClick: () =>
        setSelectedMenuOption(selectedMenuOption === "audio" ? null : "audio"),
    },
    {
      id: "text",
      label: "Text",
      icon: Type,
      onClick: () =>
        setSelectedMenuOption(selectedMenuOption === "text" ? null : "text"),
    },
    {
      id: "effects",
      label: "Effects",
      icon: Wand2,
      onClick: () =>
        setSelectedMenuOption(
          selectedMenuOption === "effects" ? null : "effects"
        ),
    },
    {
      id: "animations",
      label: "Animation",
      icon: Layers,
      onClick: () =>
        setSelectedMenuOption(
          selectedMenuOption === "animations" ? null : "animations"
        ),
    },
    {
      id: "export",
      label: "Export",
      icon: Download,
      onClick: () =>
        setSelectedMenuOption(
          selectedMenuOption === "export" ? null : "export"
        ),
    },
  ];

  return (
    <div className="w-20 bg-gray-800 border-r border-gray-700 flex flex-col items-center py-4 space-y-2">
      {sidebarItems.map((item) => {
        const Icon = item.icon;
        const isSelected = selectedMenuOption === item.id;

        return (
          <button
            key={item.id}
            onClick={item.onClick}
            className={cn(
              "w-12 h-12 flex items-center justify-center rounded-lg transition-colors",
              "hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500",
              isSelected
                ? "bg-blue-600 text-white"
                : "bg-gray-750 text-gray-300 hover:text-white"
            )}
            title={item.label}
          >
            <Icon size={20} />
          </button>
        );
      })}
    </div>
  );
};
