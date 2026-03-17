import { createContext, useEffect, useState } from 'react';
import { getStoredTheme, setStoredTheme } from '../utils/storage';

export const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => getStoredTheme() || 'light');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    setStoredTheme(theme);
  }, [theme]);

  const value = {
    theme,
    toggleTheme: () => setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light')),
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
