import { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import Profile from "./components/Profile";
import Projects from "./components/Projects";
import Stacks from "./components/Stacks";
import Footer from "./components/Footer";

function App() {
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem('theme');
      if (stored) return stored;
    } catch (error) {
      console.error('Failed to access localStorage:', error);
    }

    // Default to dark mode
    return 'dark';
  });

  // Apply theme to document and persist to localStorage
  useEffect(() => {
    try {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      localStorage.setItem('theme', theme);
    } catch (error) {
      console.error('Failed to apply or persist theme:', error);
    }
  }, [theme]);

  // Toggle theme function
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main className="flex-grow px-4 sm:px-6 lg:px-8" style={{ marginTop: "1rem" }}>
        <Profile />
        <div style={{}}>
          <Projects />
        </div>
        <div className="mb-8">
          <Stacks />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
