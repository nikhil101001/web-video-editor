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
import { Button } from "@/components/ui/button";

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
    <div className="md:w-20 w-full justify-center md:justify-normal border-r flex md:flex-col items-center p-2 gap-2">
      {sidebarItems.map((item) => {
        const Icon = item.icon;
        const isSelected = selectedMenuOption === item.id;

        return (
          <Button
            key={item.id}
            onClick={item.onClick}
            variant="ghost"
            className={cn(
              "w-14 h-12 transition-colors text-foreground cursor-pointer flex flex-col justify-center items-center gap-1 p-2",
              isSelected ? "bg-foreground/20!" : ""
            )}
            title={item.label}
          >
            <Icon size={20} />
            <span className="text-[0.6rem]">{item.label}</span>
          </Button>
        );
      })}
    </div>
  );
};
