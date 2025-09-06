import { create } from "zustand";
import * as PIXI from "pixi.js";
import {
  EditorElement,
  MenuOption,
  Animation,
  ExportSettings,
  HistoryState,
  ProjectData,
  Effect,
} from "../types";
import {
  backgroundColor,
  defaultExportSettings,
  defaultMaxHistorySize,
  defaultProjectData,
  initialFPS,
  initialMaxTime,
  originalHeight,
  originalWidth,
} from "../utils/editor-data";

interface EditorState {
  // PixiJS Application
  pixiApp: PIXI.Application | null;

  // editor settings
  canvasWidth: number;
  canvasHeight: number;
  backgroundColor: string;
  resolution: { width: number; height: number };

  // Elements
  editorElements: EditorElement[];
  selectedElement: EditorElement | null;

  // Resources
  videos: string[];
  images: string[];
  audios: string[];

  // Timeline
  currentTimeInMs: number;
  maxTime: number;
  playing: boolean;
  fps: number;

  // UI State
  selectedMenuOption: MenuOption;
  propertyPanelSize: number;

  // Animation
  animations: Animation[];

  // Export
  exportSettings: ExportSettings;
  isExporting: boolean;

  // History for undo/redo
  history: HistoryState[];
  historyIndex: number;
  maxHistorySize: number;

  // Project
  projectData: ProjectData | null;
  isDirty: boolean;
}

interface EditorActions {
  // PixiJS actions
  setPixiApp: (app: PIXI.Application | null) => void;
  setBackgroundColor: (color: string) => void;

  // Element actions
  addElement: (element: EditorElement) => void;
  updateElement: (id: string, updates: Partial<EditorElement>) => void;
  removeElement: (id: string) => void;
  setSelectedElement: (element: EditorElement | null) => void;
  duplicateElement: (id: string) => void;

  // Timeline actions
  setCurrentTimeInMs: (time: number) => void;
  setMaxTime: (time: number) => void;
  setPlaying: (playing: boolean) => void;
  play: () => void;
  pause: () => void;
  stop: () => void;

  // UI actions
  setSelectedMenuOption: (option: MenuOption) => void;
  setPropertyPanelSize: (size: number) => void;

  // Animation actions
  addAnimation: (animation: Animation) => void;
  removeAnimation: (id: string) => void;
  updateAnimation: (id: string, updates: Partial<Animation>) => void;

  // Effect actions
  updateEffect: (elementId: string, effect: Effect) => void;

  // History actions
  undo: () => void;
  redo: () => void;
  saveToHistory: () => void;

  // Export actions
  setExportSettings: (settings: Partial<ExportSettings>) => void;
  setResolution: (width: number, height: number) => void;
  startExport: () => void;
  stopExport: () => void;

  // Project actions
  createProject: (
    name: string,
    width?: number,
    height?: number,
    bgColor?: string,
    duration?: number,
    fps?: number
  ) => void;
  createDefaultProject: (name: string) => void;
  loadProject: (project: ProjectData) => void;
  updateProjectData: (updates: Partial<ProjectData>) => void;
  saveProject: () => void;

  // Resource actions
  addVideo: (src: string) => void;
  addImage: (src: string) => void;
  addAudio: (src: string) => void;

  // Utility actions
  refreshElements: () => void;
  clearAll: () => void;
}

const initialState: EditorState = {
  pixiApp: null,
  backgroundColor: backgroundColor,
  editorElements: [],
  selectedElement: null,
  videos: [],
  images: [],
  audios: [],
  currentTimeInMs: 0,
  maxTime: initialMaxTime, // 30 seconds
  playing: false,
  fps: initialFPS,
  selectedMenuOption: null,
  propertyPanelSize: 25, // Default to 25% width
  animations: [],
  exportSettings: defaultExportSettings,
  isExporting: false,
  history: [],
  historyIndex: -1,
  maxHistorySize: defaultMaxHistorySize,
  projectData: defaultProjectData,
  isDirty: false,
};

export const useEditorStore = create<EditorState & EditorActions>()(
  (set, get) => ({
    ...initialState,

    // PixiJS actions
    setPixiApp: (pixiApp) => {
      set({ pixiApp });
      if (pixiApp) {
        pixiApp.stage.eventMode = "static";
      }
    },

    setBackgroundColor: (backgroundColor) => {
      set({ backgroundColor, isDirty: true });
      const { pixiApp } = get();
      if (pixiApp) {
        pixiApp.renderer.background.color = backgroundColor;
      }
    },

    // Element actions
    addElement: (element) => {
      set((state) => ({
        editorElements: [...state.editorElements, element],
        isDirty: true,
      }));
      get().saveToHistory();
    },

    updateElement: (id, updates) => {
      set((state) => ({
        editorElements: state.editorElements.map((el) =>
          el.id === id ? ({ ...el, ...updates } as EditorElement) : el
        ),
        isDirty: true,
      }));
      get().refreshElements();
    },

    removeElement: (id) => {
      set((state) => ({
        editorElements: state.editorElements.filter((el) => el.id !== id),
        selectedElement:
          state.selectedElement?.id === id ? null : state.selectedElement,
        isDirty: true,
      }));
      get().saveToHistory();
    },

    setSelectedElement: (element) => {
      set({ selectedElement: element });
    },

    duplicateElement: (id) => {
      const { editorElements } = get();
      const element = editorElements.find((el) => el.id === id);
      if (element) {
        const duplicated = {
          ...element,
          id: `${element.id}_copy_${Date.now()}`,
          placement: {
            ...element.placement,
            x: element.placement.x + 20,
            y: element.placement.y + 20,
          },
        };
        get().addElement(duplicated);
      }
    },

    // Timeline actions
    setCurrentTimeInMs: (currentTimeInMs) => {
      set({ currentTimeInMs });
    },

    setMaxTime: (maxTime) => {
      set({ maxTime, isDirty: true });
    },

    setPlaying: (playing) => {
      set({ playing });
    },

    play: () => {
      set({ playing: true });
    },

    pause: () => {
      set({ playing: false });
    },

    stop: () => {
      set({ playing: false, currentTimeInMs: 0 });
    },

    // UI actions
    setSelectedMenuOption: (selectedMenuOption) => {
      set({ selectedMenuOption });
    },

    setPropertyPanelSize: (propertyPanelSize) => {
      set({ propertyPanelSize });
    },

    // Animation actions
    addAnimation: (animation) => {
      set((state) => ({
        animations: [...state.animations, animation],
        isDirty: true,
      }));
    },

    removeAnimation: (id) => {
      set((state) => ({
        animations: state.animations.filter((anim) => anim.id !== id),
        isDirty: true,
      }));
    },

    updateAnimation: (id, updates) => {
      set((state) => ({
        animations: state.animations.map((anim) =>
          anim.id === id ? ({ ...anim, ...updates } as Animation) : anim
        ),
        isDirty: true,
      }));
    },

    // Effect actions
    updateEffect: (elementId, effect) => {
      const element = get().editorElements.find((el) => el.id === elementId);
      if (element) {
        get().updateElement(elementId, {
          properties: {
            ...element.properties,
            effect,
          } as any,
        });
      }
    },

    // History actions
    saveToHistory: () => {
      const {
        editorElements,
        selectedElement,
        currentTimeInMs,
        history,
        historyIndex,
        maxHistorySize,
      } = get();
      const newState: HistoryState = {
        elements: [...editorElements],
        selectedElement,
        currentTime: currentTimeInMs,
      };

      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newState);

      if (newHistory.length > maxHistorySize) {
        newHistory.shift();
      }

      set({
        history: newHistory,
        historyIndex: newHistory.length - 1,
      });
    },

    undo: () => {
      const { history, historyIndex } = get();
      if (historyIndex > 0) {
        const previousState = history[historyIndex - 1];
        set({
          editorElements: previousState.elements,
          selectedElement: previousState.selectedElement,
          currentTimeInMs: previousState.currentTime,
          historyIndex: historyIndex - 1,
          isDirty: true,
        });
        get().refreshElements();
      }
    },

    redo: () => {
      const { history, historyIndex } = get();
      if (historyIndex < history.length - 1) {
        const nextState = history[historyIndex + 1];
        set({
          editorElements: nextState.elements,
          selectedElement: nextState.selectedElement,
          currentTimeInMs: nextState.currentTime,
          historyIndex: historyIndex + 1,
          isDirty: true,
        });
        get().refreshElements();
      }
    },

    // Export actions
    setExportSettings: (settings) => {
      set((state) => ({
        exportSettings: { ...state.exportSettings, ...settings },
        aspectRatio: settings.resolution
          ? settings.resolution.width / settings.resolution.height
          : state.aspectRatio,
      }));
    },

    setResolution: (width, height) => {
      set((state) => ({
        exportSettings: {
          ...state.exportSettings,
          resolution: { width, height },
        },
        aspectRatio: width / height,
      }));
    },

    startExport: () => {
      set({ isExporting: true });
    },

    stopExport: () => {
      set({ isExporting: false });
    },

    // Project actions
    createProject: (name, width, height, bgColor, duration, fps) => {
      const project: ProjectData = {
        id: `project_${Date.now()}`,
        name,
        elements: [],
        settings: {
          width: width || originalWidth,
          height: height || originalHeight,
          backgroundColor: bgColor || backgroundColor,
          duration: duration || initialMaxTime,
          fps: fps || initialFPS,
        },
      };
      set({ projectData: project, isDirty: false });
    },

    createDefaultProject: (name) => {
      const project: ProjectData = {
        id: `project_${Date.now()}`,
        name,
        elements: [],
        settings: {
          width: originalWidth,
          height: originalHeight,
          backgroundColor: backgroundColor,
          duration: initialMaxTime,
          fps: initialFPS,
        },
      };
      set({ projectData: project, isDirty: false });
    },

    loadProject: (project) => {
      set({
        projectData: project,
        editorElements: project.elements,
        backgroundColor: project.settings.backgroundColor,
        maxTime: project.settings.duration,
        fps: project.settings.fps,
        isDirty: false,
      });
    },

    saveProject: () => {
      const { projectData, editorElements, backgroundColor, maxTime, fps } =
        get();
      if (projectData) {
        const updatedProject: ProjectData = {
          ...projectData,
          elements: editorElements,
          settings: {
            ...projectData.settings,
            backgroundColor,
            duration: maxTime,
            fps,
          },
        };
        set({ projectData: updatedProject, isDirty: false });
      }
    },

    updateProjectData: (updates) => {
      const project = get().projectData;
      if (!project) return;
      const updatedProject: ProjectData = { ...project, ...updates };
      set({ projectData: updatedProject, isDirty: true });
    },

    // Resource actions
    addVideo: (src) => {
      set((state) => ({
        videos: [...state.videos, src],
      }));
    },

    addImage: (src) => {
      set((state) => ({
        images: [...state.images, src],
      }));
    },

    addAudio: (src) => {
      set((state) => ({
        audios: [...state.audios, src],
      }));
    },

    // Utility actions
    refreshElements: () => {
      const { pixiApp, editorElements } = get();
      if (!pixiApp) return;

      // Clear the stage
      pixiApp.stage.removeChildren();

      // Re-add all elements
      editorElements.forEach((element) => {
        if (element.pixiObject) {
          pixiApp.stage.addChild(element.pixiObject);
        }
      });
    },

    clearAll: () => {
      set({
        ...initialState,
        pixiApp: get().pixiApp, // Keep the PixiJS app reference
      });
      get().refreshElements();
    },
  })
);

// Selectors for commonly used derived state
export const useEditorElements = () =>
  useEditorStore((state) => state.editorElements);
export const useSelectedElement = () =>
  useEditorStore((state) => state.selectedElement);
export const usePixiApp = () => useEditorStore((state) => state.pixiApp);
export const useCurrentTime = () =>
  useEditorStore((state) => state.currentTimeInMs);
export const useIsPlaying = () => useEditorStore((state) => state.playing);
export const useCanUndo = () =>
  useEditorStore((state) => state.historyIndex > 0);
export const useCanRedo = () =>
  useEditorStore((state) => state.historyIndex < state.history.length - 1);
