import { ExportSettings, ProjectData } from "../types";

export const originalWidth = 1920;
export const originalHeight = 1080;
export const backgroundColor = "#000000";
export const initialMaxTime = 30000;
export const initialFPS = 60;
export const defaultMaxHistorySize = 50;

// Common video resolutions and aspect ratios
export const VIDEO_RESOLUTIONS = {
  "16:9": [
    { name: "4K UHD", width: 3840, height: 2160 },
    { name: "1440p QHD", width: 2560, height: 1440 },
    { name: "1080p FHD", width: 1920, height: 1080 },
    { name: "720p HD", width: 1280, height: 720 },
    { name: "480p SD", width: 854, height: 480 },
  ],
  "9:16": [
    { name: "4K Vertical", width: 2160, height: 3840 },
    { name: "1440p Vertical", width: 1440, height: 2560 },
    { name: "1080p Vertical", width: 1080, height: 1920 },
    { name: "720p Vertical", width: 720, height: 1280 },
  ],
  "1:1": [
    { name: "4K Square", width: 2160, height: 2160 },
    { name: "1440p Square", width: 1440, height: 1440 },
    { name: "1080p Square", width: 1080, height: 1080 },
    { name: "720p Square", width: 720, height: 720 },
  ],
  "4:3": [
    { name: "1024x768", width: 1024, height: 768 },
    { name: "800x600", width: 800, height: 600 },
    { name: "640x480", width: 640, height: 480 },
  ],
  "21:9": [
    { name: "3440x1440", width: 3440, height: 1440 },
    { name: "2560x1080", width: 2560, height: 1080 },
  ],
} as const;

export type AspectRatioKey = keyof typeof VIDEO_RESOLUTIONS;

export const ASPECT_RATIOS: {
  label: string;
  value: AspectRatioKey;
  ratio: number;
}[] = [
  { label: "16:9 (Landscape)", value: "16:9", ratio: 16 / 9 },
  { label: "9:16 (Portrait)", value: "9:16", ratio: 9 / 16 },
  { label: "1:1 (Square)", value: "1:1", ratio: 1 },
  { label: "4:3 (Classic)", value: "4:3", ratio: 4 / 3 },
  { label: "21:9 (Ultrawide)", value: "21:9", ratio: 21 / 9 },
];

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
