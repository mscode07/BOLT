import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import EditorPage from './pages/EditorPage';
import { ThemeProvider } from './contexts/ThemeContext';

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