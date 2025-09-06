import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ImportItem {
  id: string;
  name: string;
  size: number;
  type: string; // e.g., 'video/mp4', 'image/jpeg'
  url: string; // Object URL or reference for the file
  // Add more metadata as needed, e.g., lastModified, etc.
}

interface ImportStore {
  imports: ImportItem[];
  addImport: (item: Omit<ImportItem, 'id'>) => void;
  removeImport: (id: string) => void;
  clearImports: () => void;
}

export const useImportStore = create<ImportStore>()(
  persist(
    (set, get) => ({
      imports: [],
      addImport: (item) =>
        set((state) => ({
          imports: [...state.imports, { ...item, id: Date.now().toString() }],
        })),
      removeImport: (id) =>
        set((state) => ({
          imports: state.imports.filter((imp) => imp.id !== id),
        })),
      clearImports: () => set({ imports: [] }),
    }),
    {
      name: 'import-store', // Key for localStorage
    }
  )
);
