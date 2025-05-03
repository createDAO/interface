import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';

type Theme = 'light' | 'dark';

// Helper function to get initial theme (runs client-side only)
// Ensures React state matches the theme set by the _document.tsx script during hydration
const getInitialClientTheme = (): Theme => {
  // Return default during SSR/build, the script handles initial browser state
  if (typeof window === 'undefined') {
    return 'light';
  }
  try {
    const persistedColorPreference = window.localStorage.getItem('theme');
    const hasPersistedPreference = typeof persistedColorPreference === 'string';

    if (hasPersistedPreference) {
      return persistedColorPreference === 'dark' ? 'dark' : 'light';
    }

    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const hasMediaQueryPreference = typeof mql.matches === 'boolean';

    if (hasMediaQueryPreference) {
      return mql.matches ? 'dark' : 'light';
    }
  } catch (e) {
    // Handle potential errors accessing localStorage or matchMedia
    console.error("Error getting initial theme:", e);
  }
  // Default fallback
  return 'light';
};


interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light', // Default for context, overridden by provider
  toggleTheme: () => { },
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Initialize state SYNCHRONOUSLY with the correct client-side theme
  const [theme, setTheme] = useState<Theme>(getInitialClientTheme);

  // Apply theme class on initial mount and whenever theme state changes
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Memoize toggleTheme to prevent unnecessary context updates
  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem('theme', newTheme);
        // Apply class immediately on toggle as well
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
      } catch (e) {
        console.error("Error setting theme in localStorage:", e);
      }
      return newTheme;
    });
  }, []);

  // No longer need the useEffect that reads localStorage initially

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};