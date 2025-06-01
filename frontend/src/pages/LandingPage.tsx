import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePromptStore } from "../store/promptStore";
import { Code, Sparkles, Moon, Sun } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { cn } from "../utils/cn";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { parseBoltArtifact } from "../ParseResponse";

export default function LandingPage() {
  const [promptText, setPromptText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setPrompt, setIsGenerating, setFileStructure, setSteps } =
    usePromptStore();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handlePromptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (promptText.trim()) {
      setIsLoading(true);
      setIsGenerating(true);
      try {
        const response = await axios.post(`${BACKEND_URL}/template`, {
          prompt: promptText,
        });
        let artifactString: string;

        console.log(response.data, "This is the response");

        if (typeof response.data === "object" && response.data) {
          if (typeof response.data.genratedCode === "string") {
            artifactString = response.data.genratedCode;
          } else if (
            response.data.data &&
            typeof response.data.data.genratedCode === "string"
          ) {
            artifactString = response.data.data.genratedCode;
          } else {
            throw new Error(
              "Invalid response structure: 'code' field not found in response.data"
            );
          }

          if (
            !artifactString.includes("<boltArtifact") &&
            !artifactString.includes("<BoltArtifact")
          ) {
            throw new Error(
              "Extracted artifact string does not contain <boltArtifact>"
            );
          }
        } else if (typeof response.data === "string") {
          const artifactMatch = response.data.match(
            /<boltArtifact[^>]*>[\s\S]*<\/boltArtifact>/
          );
          if (!artifactMatch) {
            throw new Error("No <boltArtifact> found in response string");
          }
          artifactString = artifactMatch[0];
        } else {
          throw new Error(
            "Invalid response type: response.data must be a string or object"
          );
        }

        //console.log("Extracted artifactString:", artifactString);

        const artifactMatch = artifactString.match(
          /<boltArtifact[^>]*>[\s\S]*<\/boltArtifact>/
        );
        if (!artifactMatch) {
          throw new Error(
            "Failed to clean artifactString: No <boltArtifact> found"
          );
        }
        const cleanedArtifactString = artifactMatch[0];
        //console.log("Cleaned artifactString:", cleanedArtifactString);

        const code = response.data;
        setPrompt(promptText);
        const { files, steps } = parseBoltArtifact(cleanedArtifactString);
        // console.log("Files stucture is here", files);
        // console.log("Steps are  here", steps);

        setFileStructure(files);
        setSteps(steps);
        navigate("/editor", { state: { promptText, code } }); //?, { state: { promptText, data } }
      } catch (error) {
        console.error("Error submitting prompt:", error);
        setIsGenerating(false);
        setIsLoading(false);
      } finally {
        setIsGenerating(false);
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full py-4 px-6 flex justify-between items-center bg-white dark:bg-dark-200 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-2">
          <Code className="h-6 w-6 text-primary-600" />
          <span className="text-xl font-semibold">WebCraft</span>
        </div>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-100 transition-colors"
          aria-label={
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl w-full space-y-8 text-center">
          <div className="space-y-2 animate-slide-up">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white">
              Create beautiful websites with AI
            </h1>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
              Turn your ideas into code with our AI-powered website generator.
              Just describe what you want, and we'll build it for you.
            </p>
          </div>

          <form
            onSubmit={handlePromptSubmit}
            className="mt-8 animate-slide-up"
            style={{ animationDelay: "100ms" }}
          >
            <div className="flex flex-col space-y-4">
              <div className="relative">
                <textarea
                  className={cn(
                    "input min-h-32 p-4 text-base",
                    isLoading && "opacity-70"
                  )}
                  placeholder="Describe the website you want to create..."
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  disabled={isLoading}
                  required
                />
                <div className="absolute right-3 bottom-3 text-gray-400 text-sm">
                  {promptText.length} characters
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !promptText.trim()}
                className={cn(
                  "btn btn-primary py-3 px-6 text-base font-medium rounded-md flex items-center justify-center",
                  isLoading && "animate-pulse"
                )}
              >
                {isLoading ? (
                  <>
                    <span className="mr-2">Generating</span>
                    <div className="flex space-x-1">
                      <span
                        className="h-2 w-2 bg-white rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></span>
                      <span
                        className="h-2 w-2 bg-white rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></span>
                      <span
                        className="h-2 w-2 bg-white rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></span>
                    </div>
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate Website
                  </>
                )}
              </button>
            </div>
          </form>

          <div
            className="mt-12 grid gap-8 sm:grid-cols-3 animate-fade-in"
            style={{ animationDelay: "200ms" }}
          >
            {/* {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white dark:bg-dark-100 rounded-lg shadow-md"
              >
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 mb-4 mx-auto">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))} */}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-6 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 dark:text-gray-400">
        <p>© 2025 WebCraft. All rights reserved.</p>
      </footer>
    </div>
  );
}

// Features data
const features = [
  {
    title: "AI-Powered",
    description:
      "Our advanced AI interprets your descriptions and generates professional code",
    icon: <Sparkles className="h-6 w-6" />,
  },
  {
    title: "Code Editor",
    description:
      "Professional editor interface with syntax highlighting and autocompletion",
    icon: <Code className="h-6 w-6" />,
  },
  {
    title: "Step-by-Step",
    description: "Follow guided steps to customize and perfect your website",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    ),
  },
];
