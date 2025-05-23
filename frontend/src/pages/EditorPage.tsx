import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePromptStore } from "../store/promptStore";
import Editor from "../components/editor/Editor";
import StepsSidebar from "../components/steps/StepsSidebar";
import FileExplorer from "../components/files/FileExplorer";
import Header from "../components/layout/Header";
import Statusbar from "../components/layout/Statusbar";
import { useTheme } from "../contexts/ThemeContext";
import axios from "axios";
import { BACKEND_URL } from "../congig";

export default function EditorPage() {
  const {
    prompt,
    currentFile,
    setCurrentFile,
    fileStructure,
    sdteps,
    currentStepId,
    isGenerating,
  } = usePromptStore();

  const navigate = useNavigate();
  const { theme } = useTheme();
  const [previewVisible, setPreviewVisible] = useState(false);

  // If no prompt is set, redirect to landing page
  useEffect(() => {
    if (!prompt) {
      navigate("/");
    }
  }, [prompt, navigate]);

  // When file structure changes, select the first file by default if none is selected
  useEffect(() => {
    if (!currentFile && fileStructure.length > 0) {
      // Find the first file (not folder)
      const findFirstFile = (
        nodes: typeof fileStructure
      ): typeof currentFile => {
        for (const node of nodes) {
          if (node.type === "file") {
            return node;
          } else if (node.children?.length) {
            const file = findFirstFile(node.children);
            if (file) return file;
          }
        }
        return null;
      };

      const firstFile = findFirstFile(fileStructure);
      if (firstFile) {
        setCurrentFile(firstFile);
      }
    }
  }, [fileStructure, currentFile, setCurrentFile]);

  // Get current step
  const currentStep =
    steps.find((step) => step.id === currentStepId) || steps[0];

  async function init() {
    const response = await axios.post(`${BACKEND_URL}/template`, {
      prompt: prompt?.text,
    });
    console.log(response.data, "This is the init response.");
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-dark-200 text-gray-900 dark:text-gray-100">
      <Header
        projectName={prompt?.text.slice(0, 30) || "Untitled Project"}
        previewVisible={previewVisible}
        togglePreview={() => setPreviewVisible(!previewVisible)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Steps Sidebar */}
        <StepsSidebar
          steps={steps}
          currentStepId={currentStepId}
          isLoading={isGenerating}
        />

        <div className="flex-1 flex overflow-hidden">
          {/* File Explorer */}
          <FileExplorer files={fileStructure} currentFileId={currentFile?.id} />

          {/* Editor Area */}
          <div className="flex-1 flex flex-col overflow-hidden relative">
            {currentFile ? (
              <Editor
                file={currentFile}
                theme={theme === "dark" ? "vs-dark" : "vs"}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-dark-300">
                {fileStructure.length > 0 ? (
                  <p>Select a file to edit</p>
                ) : (
                  <p>No files available yet</p>
                )}
              </div>
            )}

            {/* Preview Panel (conditionally rendered) */}
            {previewVisible && (
              <div className="absolute inset-0 bg-white p-4 overflow-auto animate-fade-in z-10">
                <div className="p-2 bg-gray-100 rounded mb-4 flex justify-between items-center">
                  <span className="text-sm font-medium">Preview</span>
                  <button
                    onClick={() => setPreviewVisible(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <div className="border rounded-md h-[calc(100%-3rem)] overflow-auto">
                  {/* This would be an iframe in a real implementation */}
                  <div className="p-4">
                    <p className="text-center text-gray-500 italic">
                      Preview would be rendered here
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Statusbar currentFile={currentFile} currentStep={currentStep} />
    </div>
  );
}
