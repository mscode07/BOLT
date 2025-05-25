import { useEffect, useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import { usePromptStore } from "../../store/promptStore";
import { FileNode } from "../../store/promptStore";
import { useLocation } from "react-router-dom";

const location = useLocation();
const { data } = location.state || {};
console.log(data, "This is the data from the landing page");

interface EditorProps {
  file: FileNode;
  theme: "vs-dark" | "vs";
}

export default function Editor({ file, theme }: EditorProps) {
  const { updateFileContent } = usePromptStore();
  const [value, setValue] = useState(file.content || "");

  useEffect(() => {
    setValue(file.content || "");
  }, [file]);

  const getLanguage = () => {
    if (file.language) return file.language;

    const extension = file.name.split(".").pop()?.toLowerCase() || "";

    switch (extension) {
      case "js":
        return "javascript";
      case "jsx":
        return "javascript";
      case "ts":
        return "typescript";
      case "tsx":
        return "typescript";
      case "html":
        return "html";
      case "css":
        return "css";
      case "json":
        return "json";
      case "md":
        return "markdown";
      default:
        return "plaintext";
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    const newValue = value || "";
    setValue(newValue);

    // Debounce update to store
    const timeoutId = setTimeout(() => {
      updateFileContent(file.id, newValue);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-9 px-4 flex items-center bg-gray-100 dark:bg-dark-100 border-b border-gray-200 dark:border-gray-800">
        <span className="text-sm font-medium truncate">{file.name}</span>
      </div>

      <div className="h-[calc(100%-2.25rem)]">
        <MonacoEditor
          height="100%"
          language={getLanguage()}
          value={value}
          theme={theme}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            fontSize: 14,
            wordWrap: "on",
            lineNumbers: "on",
            automaticLayout: true,
            padding: { top: 10 },
            scrollbar: {
              useShadows: false,
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
            },
          }}
        />
      </div>
    </div>
  );
}
