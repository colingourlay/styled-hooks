import React, { createContext, useContext } from 'react';

interface Theme {
  [propName: string]: any;
}

type ThemeMergeFn = (outerTheme: Theme) => Theme;

interface ThemeProviderProps {
  children?: any[];
  theme: Theme | ThemeMergeFn;
}

const ThemeContext = createContext({});

export function useTheme(): Theme {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children, theme }: ThemeProviderProps) {
  const outerTheme = useTheme();
  const mergedTheme = typeof theme === 'function' ? theme(outerTheme) : { ...outerTheme, ...theme };

  return <ThemeContext.Provider value={mergedTheme}>{React.Children.only(children)}</ThemeContext.Provider>;
}

export const INTERPOLATED_THEME_PROP_PATH_PATTERN = /#{[\w_\.]+}/g;

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
