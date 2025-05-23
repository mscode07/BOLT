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
  status: "pending" | "in-progress" | "completed";
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

// Mock initial data for development purposes
const mockFileStructure: FileNode[] = [
  {
    id: "1",
    name: "src",
    type: "folder",
    path: "/src",
    children: [
      {
        id: "2",
        name: "App.js",
        type: "file",
        content:
          "function App() {\n  return <div>Hello World</div>;\n}\n\nexport default App;",
        language: "javascript",
        path: "/src/App.js",
      },
      {
        id: "3",
        name: "index.js",
        type: "file",
        content:
          "import React from 'react';\nimport ReactDOM from 'react-dom';\nimport App from './App';\n\nReactDOM.render(<App />, document.getElementById('root'));",
        language: "javascript",
        path: "/src/index.js",
      },
    ],
  },
  {
    id: "4",
    name: "package.json",
    type: "file",
    content:
      '{\n  "name": "example-app",\n  "version": "0.1.0",\n  "private": true\n}',
    language: "json",
    path: "/package.json",
  },
];

const mockSteps: Step[] = [
  {
    id: 1,
    title: "Initialize Project",
    description:
      "Set up the basic project structure with React and necessary dependencies.",
    status: "completed",
  },
  {
    id: 2,
    title: "Create Components",
    description:
      "Build the core components for the application based on the requirements.",
    status: "in-progress",
  },
  {
    id: 3,
    title: "Implement Styling",
    description: "Add CSS styling to make the application visually appealing.",
    status: "pending",
  },
  {
    id: 4,
    title: "Add Functionality",
    description: "Implement the core functionality for the application.",
    status: "pending",
  },
];

export const usePromptStore = create<PromptState>((set) => ({
  prompt: null,
  fileStructure: mockFileStructure, // Using mock data for now
  currentFile: null,
  steps: mockSteps, // Using mock steps for now
  currentStepId: 2, // Start with the second step active
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
