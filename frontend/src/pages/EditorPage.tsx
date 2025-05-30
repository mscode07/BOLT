import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Editor from "../components/editor/Editor";
import FileExplorer from "../components/files/FileExplorer";
import Header from "../components/layout/Header";
import Statusbar from "../components/layout/Statusbar";
import StepsSidebar from "../components/steps/StepsSidebar";
import { useTheme } from "../contexts/ThemeContext";
import { usePromptStore } from "../store/promptStore";

/**
 * Renders the main code editor page with file navigation, step tracking, and preview functionality.
 *
 * Displays the project header, steps sidebar, file explorer, code editor, and an optional preview panel. Redirects to the home page if no prompt is present. Automatically selects the first file in the file structure if none is selected.
 */
export default function EditorPage() {
  const {
    prompt,
    currentFile,
    setCurrentFile,
    fileStructure,
    steps,
    currentStepId,
    isGenerating,
  } = usePromptStore();

  const location = useLocation();
  const { code } = location.state || {};
  // console.log(code.genratedCode, "This is the data");

  const navigate = useNavigate();
  const { theme } = useTheme();
  const [previewVisible, setPreviewVisible] = useState(false);

  useEffect(() => {
    if (!prompt) {
      navigate("/");
    }
  }, [prompt, navigate]);

  useEffect(() => {
    9;
    if (!currentFile && fileStructure.length > 0) {
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
  return (
    <div className="h-screen flex flex-col bg-white dark:bg-dark-200 text-gray-900 dark:text-gray-100">
      <Header
        projectName={code?.genratedCode?.slice(0, 30) || "Untitled Project"}
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
