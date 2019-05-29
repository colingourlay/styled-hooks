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

const INTERPOLATED_THEME_PROP_PATH_PATTERN = /#{[\w_\.]+}/g;

function delve(current: any, path: string) {
  const parts = path.split('.');

  for (let i = 0; i < parts.length; i++) {
    current = current ? current[parts[i]] : undefined;
  }

  return current;
}

export function useThemedStringsAndInputs(strings: TemplateStringsArray, inputs: any[]): [string[], any[]] {
  const theme = (useTheme() || {}) as {};
  const themedStrings: string[] = [];
  const themedInputs: any[] = [];

  for (let i = 0, len = strings.length; i < len; i++) {
    const currentString = strings[i];
    let lastOffset = 0;

    currentString.replace(INTERPOLATED_THEME_PROP_PATH_PATTERN, (match: string, offset: number) => {
      const path = match.slice(2, -1).trim();
      const value = delve(theme, path);

      if (typeof value !== 'string' && typeof value !== 'number') {
        throw new Error(`Theme does not have a valid value at: ${path}`);
      }

      themedStrings.push(currentString.slice(lastOffset, offset));
      themedInputs.push(value);
      lastOffset = offset + match.length;

      return match;
    });
    themedStrings.push(currentString.slice(lastOffset, currentString.length));

    const currentInput = inputs[i];

    if (typeof currentInput === 'function') {
      themedInputs.push(currentInput(theme));
    } else if (currentInput != null) {
      themedInputs.push(currentInput);
    }
  }

  return [themedStrings, themedInputs];
}
