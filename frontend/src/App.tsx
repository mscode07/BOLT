import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import EditorPage from "./pages/EditorPage";
import LandingPage from "./pages/LandingPage";

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
