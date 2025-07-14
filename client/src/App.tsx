import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import EditorPage from "./pages/EditorPage";
import LandingPage from "./pages/LandingPage";
import { SigninPage } from "./pages/SigninPage";

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/editor" element={<EditorPage />} />
        <Route path="/login" element={<SigninPage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
