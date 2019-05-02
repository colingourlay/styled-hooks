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

function deepKeys(obj: {}): string[] {
  function getKeys(obj) {
    return Object.keys(obj).reduce((memo, key) => {
      const value = obj[key];

      return memo.concat(value === Object(value) ? getKeys(value).map(nestedKey => `${key}.${nestedKey}`) : [key]);
    }, []);
  }

  return getKeys(obj);
}

const PERIODS_PATTERN = /\./g;

function countPeriods(string: string): number {
  return (string.match(PERIODS_PATTERN) || []).length;
}

function themeKeysOrder(a, b) {
  return (b.length << countPeriods(b)) - (a.length << countPeriods(a));
}

type LooseTemplateStringsArray = string[] | TemplateStringsArray;

export function useThemedStyle(strings: TemplateStringsArray, ...inputs: any[]): string {
  const theme = (useTheme() || {}) as {};
  const themeKeys = deepKeys(theme).sort(themeKeysOrder);
  let argsForUseStyle: [LooseTemplateStringsArray, ...any[]];

  if (themeKeys.length) {
    const themedStrings: string[] = [];
    const themedInputs: any[] = [];
    const themeInterpolationPattern = new RegExp(`\\$${themeKeys.join('|\\$')}`, 'g');

    for (let i = 0, len = strings.length; i < len; i++) {
      const currentString = strings[i];
      let lastOffset = 0;

      currentString.replace(themeInterpolationPattern, (match: string, offset: number) => {
        themedStrings.push(currentString.slice(lastOffset, offset));
        themedInputs.push(theme[match.slice(1)]);
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

    argsForUseStyle = [themedStrings, ...themedInputs];
  } else {
    argsForUseStyle = [strings, ...inputs];
  }

  return useStyle.apply(null, argsForUseStyle);
}
