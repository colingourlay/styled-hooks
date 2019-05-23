import React, { createContext, useContext } from 'react';

export const ThemeContext = createContext({});

interface Theme {
  [propName: string]: any;
}

function useMergedTheme(theme: Theme | ((outerTheme?: Theme) => Theme), outerTheme?: Theme): Theme {
  if (typeof theme === 'function') {
    return theme(outerTheme);
  }

  return outerTheme ? { ...outerTheme, ...theme } : theme;
}

interface ThemeProviderProps {
  children?: any[];
  theme: Theme | ((outerTheme: Theme) => void);
}

export function ThemeProvider({ children, theme }: ThemeProviderProps) {
  if (!children) {
    return null;
  }

  const themeContext = useMergedTheme(theme, useContext(ThemeContext));

  return <ThemeContext.Provider value={themeContext}>{React.Children.only(children)}</ThemeContext.Provider>;
}

export const ThemeConsumer = ThemeContext.Consumer;

export function useTheme() {
  return useContext(ThemeContext);
}
