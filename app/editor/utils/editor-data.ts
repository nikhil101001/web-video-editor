import { ExportSettings, ProjectData } from "../types";

export const originalWidth = 1920;
export const originalHeight = 1080;
export const backgroundColor = "#111111";
export const initialMaxTime = 30000;
export const initialFPS = 60;
export const defaultMaxHistorySize = 50;

export const defaultExportSettings: ExportSettings = {
  format: "mp4",
  quality: "medium",
  fps: 30,
  resolution: {
    width: 1920,
    height: 1080,
  },
};

export const defaultProjectData: ProjectData = {
  id: `project_${Date.now()}`,
  name: "New Project",
  elements: [],
  settings: {
    width: originalWidth,
    height: originalHeight,
    backgroundColor,
    duration: initialMaxTime,
    fps: initialFPS,
  },
};
