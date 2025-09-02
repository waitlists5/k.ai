import { useState, useEffect } from 'react';
import { storage } from '../utils/storage';

export const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => storage.getTheme());

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    storage.saveTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return { theme, toggleTheme };
};