"use client";

import React from "react";
import { useEditorStore, useCanUndo, useCanRedo } from "../store/editor-store";
import { Undo2, Redo2, Play, Pause, Square, Save, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Input } from "@/components/ui/input";
import { redirect } from "next/navigation";

interface NavbarProps {
  projectId?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ projectId }) => {
  const {
    undo,
    redo,
    play,
    pause,
    stop,
    playing,
    saveProject,
    projectData,
    updateProjectData,
  } = useEditorStore();

  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  const handleSave = () => {
    saveProject();
  };

  return (
    <div className="min-h-16 h-16 flex items-center justify-between px-4 border-b">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-foreground"
          onClick={() => redirect("/")}
        >
          <Home size={18} />
        </Button>

        <div className="flex items-center space-x-2">
          <Input
            className="text-lg font-semibold text-foreground max-w-48 border-none"
            value={projectData?.name || "Untitled Project"}
            onChange={(e) => {
              updateProjectData({ name: e.target.value });
            }}
          />
        </div>
      </div>

      {/* Center Section - Playback Controls */}
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={undo}
          disabled={!canUndo}
          className="disabled:text-gray-500 text-foreground"
        >
          <Undo2 size={18} />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={redo}
          disabled={!canRedo}
          className="text-foreground disabled:text-gray-500"
        >
          <Redo2 size={18} />
        </Button>

        <div className="w-px h-6 bg-gray-700 mx-2" />

        <Button
          variant="ghost"
          size="sm"
          onClick={playing ? pause : play}
          className="text-foreground"
        >
          {playing ? <Pause size={20} /> : <Play size={20} />}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={stop}
          className="text-foreground"
        >
          <Square size={18} />
        </Button>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSave}
          className="text-foreground"
        >
          <Save size={18} />
        </Button>

        <ModeToggle />
      </div>
    </div>
  );
};
