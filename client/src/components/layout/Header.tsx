import { Code, Play, ArrowLeft, Github, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { cn } from "../../utils/cn";

interface HeaderProps {
  projectName: string;
  previewVisible: boolean;
  togglePreview: () => void;
}

export default function Header({
  projectName,
  previewVisible,
  togglePreview,
}: HeaderProps) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-12 bg-white dark:bg-dark-100 border-b border-gray-200 dark:border-gray-800 px-4 flex items-center justify-between select-none">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          aria-label="Back to home"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span className="text-sm">Home</span>
        </button>

        <div className="flex items-center">
          <Code className="h-5 w-5 text-primary-600 mr-2" />
          <span
            className="font-medium truncate max-w-[200px]"
            title={projectName}
          >
            {projectName}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {/* <button 
          className={cn(
            "btn px-3 py-1 text-sm h-8",
            previewVisible 
              ? "bg-primary-600 text-white hover:bg-primary-700" 
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-dark-200 dark:text-gray-300 dark:hover:bg-dark-300"
          )}
          onClick={togglePreview}
        >
          <Play className="h-3.5 w-3.5 mr-1" />
          {previewVisible ? 'Hide Preview' : 'Preview'}
        </button> */}

        <button className="btn btn-outline px-3 py-1 text-sm h-8">
          <Save className="h-3.5 w-3.5 mr-1" />
          Save
        </button>

        <button className="btn btn-outline px-3 py-1 text-sm h-8">
          <Github className="h-3.5 w-3.5 mr-1" />
          Export
        </button>

        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-dark-300 transition-colors"
          aria-label={
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
        >
          {theme === "dark" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
              />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
