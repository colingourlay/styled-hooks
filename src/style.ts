import { useEffect, useLayoutEffect, useMemo } from 'react';
import { generateClassName } from './class-name';
import { generateCSS, generateCSSWithCustomProps } from './css';
import { subscribe, unsubscribe } from './style-manager';
import { useTheme } from './theme';

interface GlobalCSS {
  supports: Function;
}

declare var CSS: GlobalCSS;

export const IS_BROWSER_ENVIRONMENT_THAT_SUPPORTS_CSS_CUSTOM_PROPERTIES =
  window['CSS'] && CSS.supports && CSS.supports(`--custom: var(--properties)`);

export function useStyleWithoutCustomProps(strings: TemplateStringsArray, ...inputs: any[]): string {
  const joinedArgs = strings.concat(inputs).join('');
  const className = useMemo(() => generateClassName(joinedArgs), [joinedArgs]);
  const css = useMemo(() => generateCSS(className, strings, inputs), [className]);

  useLayoutEffect(() => subscribe(css), [className]);
  useEffect(() => () => unsubscribe(css), [className]);

  return className;
}

export function useStyleWithCustomProps(strings: TemplateStringsArray, ...inputs: any[]): string {
  const joinedStrings = strings.join('');
  const joinedInputs = inputs.join('');
  const sharedClassName = useMemo(() => generateClassName(joinedStrings), [joinedStrings]);
  const variableClassName = useMemo(() => generateClassName(joinedInputs), [joinedInputs]);
  const [sharedCSS, variableCSS] = useMemo(
    () => generateCSSWithCustomProps(sharedClassName, variableClassName, strings, inputs),
    [variableClassName]
  );

  useLayoutEffect(() => subscribe(sharedCSS));
  useLayoutEffect(() => subscribe(variableCSS), [variableClassName]);

  useEffect(() => () => unsubscribe(sharedCSS));
  useEffect(() => () => unsubscribe(variableCSS), [variableClassName]);

  return `${sharedClassName} ${variableClassName}`;
}

export function useStyle(strings: TemplateStringsArray, ...inputs: any[]): string {
  return (inputs.length > 0 && IS_BROWSER_ENVIRONMENT_THAT_SUPPORTS_CSS_CUSTOM_PROPERTIES
    ? useStyleWithCustomProps
    : useStyleWithoutCustomProps)(strings as TemplateStringsArray, ...inputs);
}

const THEMED_STYLE_VARIABLE_PATTERN = /#{[\w_\.]+}/g;

function delve(current: any, path: string) {
  const parts = path.split('.');

  for (let i = 0; i < parts.length; i++) {
    current = current ? current[parts[i]] : undefined;
  }

  return current;
}

export function useThemedStyle(strings: TemplateStringsArray, ...inputs: any[]): string {
  const theme = (useTheme() || {}) as {};
  const themedStrings: string[] = [];
  const themedInputs: any[] = [];

  for (let i = 0, len = strings.length; i < len; i++) {
    const currentString = strings[i];
    let lastOffset = 0;

    currentString.replace(THEMED_STYLE_VARIABLE_PATTERN, (match: string, offset: number) => {
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

  return useStyle.call(null, themedStrings, ...themedInputs);
}
