import { create } from "zustand";

interface Prompt {
  text: string;
  timestamp: Date;
}

export interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  content?: string;
  language?: string;
  children?: FileNode[];
  path: string;
}

interface Step {
  id: number;
  title: string;
  description: string;
  status: "completed"; //"pending" | "in-progress" |
  code?: string;
}

interface PromptState {
  prompt: Prompt | null;
  fileStructure: FileNode[];
  currentFile: FileNode | null;
  steps: Step[];
  currentStepId: number | null;
  isGenerating: boolean;

  // Actions
  setPrompt: (text: string) => void;
  setFileStructure: (files: FileNode[]) => void;
  setCurrentFile: (file: FileNode | null) => void;
  setSteps: (steps: Step[]) => void;
  setCurrentStepId: (id: number | null) => void;
  updateFileContent: (id: string, content: string) => void;
  addFile: (parentPath: string, file: Omit<FileNode, "id">) => void;
  deleteFile: (id: string) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  completeStep: (id: number) => void;
  reset: () => void;
}

const FileStructure: FileNode[] = [];

const Steps: Step[] = [];

export const usePromptStore = create<PromptState>((set) => ({
  prompt: null,
  fileStructure: FileStructure,
  currentFile: null,
  steps: Steps,
  currentStepId: 2,
  isGenerating: false,

  setPrompt: (text: string) =>
    set({
      prompt: { text, timestamp: new Date() },
      isGenerating: true,
    }),

  setFileStructure: (files: FileNode[]) => set({ fileStructure: files }),

  setCurrentFile: (file: FileNode | null) => set({ currentFile: file }),

  setSteps: (steps: Step[]) => set({ steps }),

  setCurrentStepId: (id: number | null) => set({ currentStepId: id }),

  updateFileContent: (id: string, content: string) =>
    set((state) => {
      const updateContent = (files: FileNode[]): FileNode[] => {
        return files.map((file) => {
          if (file.id === id) {
            return { ...file, content };
          }
          if (file.children) {
            return { ...file, children: updateContent(file.children) };
          }
          return file;
        });
      };

      return {
        fileStructure: updateContent(state.fileStructure),
        currentFile:
          state.currentFile?.id === id
            ? { ...state.currentFile, content }
            : state.currentFile,
      };
    }),

  addFile: (parentPath: string, newFile: Omit<FileNode, "id">) =>
    set((state) => {
      const fileId = Math.random().toString(36).substring(2, 9);
      const newNode: FileNode = { ...newFile, id: fileId };

      // If adding to root
      if (parentPath === "/") {
        return { fileStructure: [...state.fileStructure, newNode] };
      }

      // Helper to recursively add file to the correct folder
      const addToFolder = (files: FileNode[]): FileNode[] => {
        return files.map((file) => {
          if (file.type === "folder" && file.path === parentPath) {
            return {
              ...file,
              children: [...(file.children || []), newNode],
            };
          }
          if (file.children) {
            return { ...file, children: addToFolder(file.children) };
          }
          return file;
        });
      };

      return { fileStructure: addToFolder(state.fileStructure) };
    }),

  deleteFile: (id: string) =>
    set((state) => {
      // Helper to recursively remove a file
      const removeFile = (files: FileNode[]): FileNode[] => {
        return files.filter((file) => {
          if (file.id === id) return false;
          if (file.children) {
            return { ...file, children: removeFile(file.children) };
          }
          return true;
        });
      };

      return {
        fileStructure: removeFile(state.fileStructure),
        currentFile: state.currentFile?.id === id ? null : state.currentFile,
      };
    }),

  setIsGenerating: (isGenerating: boolean) => set({ isGenerating }),

  completeStep: (id: number) =>
    set((state) => ({
      steps: state.steps.map((step) =>
        step.id === id ? { ...step, status: "completed" } : step
      ),
      currentStepId:
        id < Math.max(...state.steps.map((s) => s.id)) ? id + 1 : id,
    })),

  reset: () =>
    set({
      prompt: null,
      currentFile: null,
      currentStepId: null,
      isGenerating: false,
    }),
}));
