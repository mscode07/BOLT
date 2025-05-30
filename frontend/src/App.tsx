import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import EditorPage from "./pages/EditorPage";
import LandingPage from "./pages/LandingPage";

/**
 * Root React component that sets up application theming and client-side routing.
 *
 * Wraps the routing structure in a theme context and defines routes for the landing and editor pages.
 */
function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/editor" element={<EditorPage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
