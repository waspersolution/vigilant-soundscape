
import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      // Try to get the theme from localStorage
      const savedConfig = localStorage.getItem('dashboardConfig');
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        return config.theme || 'system';
      }
    } catch (error) {
      console.error("Error loading theme from localStorage:", error);
    }
    return 'system';
  });

  // Update theme in localStorage when it changes
  const updateTheme = (newTheme: Theme) => {
    try {
      // Update localStorage
      const savedConfig = localStorage.getItem('dashboardConfig');
      const config = savedConfig ? JSON.parse(savedConfig) : {};
      config.theme = newTheme;
      localStorage.setItem('dashboardConfig', JSON.stringify(config));
      
      // Update state
      setTheme(newTheme);
    } catch (error) {
      console.error("Error saving theme to localStorage:", error);
      setTheme(newTheme);
    }
  };

  // Apply theme to document when it changes
  useEffect(() => {
    const applyTheme = () => {
      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        document.documentElement.classList.toggle('dark', systemTheme === 'dark');
      } else {
        document.documentElement.classList.toggle('dark', theme === 'dark');
      }
    };

    // Apply immediately
    applyTheme();
    
    // Force a re-render to ensure UI components update
    document.body.style.display = 'none';
    setTimeout(() => {
      document.body.style.display = '';
    }, 0);
  }, [theme]);

  // Listen for system theme changes if using 'system' setting
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = () => {
        document.documentElement.classList.toggle('dark', mediaQuery.matches);
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
