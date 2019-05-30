import { useEffect, useLayoutEffect, useMemo } from 'react';
import { generateCSS, generateCSSWithCustomProps } from './css';
import { generateClassName } from './naming';
import { subscribe, unsubscribe } from './style-manager';
import { INTERPOLATED_THEME_PROP_PATH_PATTERN, useThemedStringsAndInputs } from './theme';

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

export function useStyleBase(strings: TemplateStringsArray, ...inputs: any[]): string {
  return (inputs.length > 0 && IS_BROWSER_ENVIRONMENT_THAT_SUPPORTS_CSS_CUSTOM_PROPERTIES
    ? useStyleWithCustomProps
    : useStyleWithoutCustomProps)(strings, ...inputs);
}

export function useThemelessStyle(strings: TemplateStringsArray, ...inputs: any[]): string {
  if (inputs.find(input => typeof input === 'function')) {
    throw new Error('Functions are unacceptable useThemelessStyle inputs as no theme context is available');
  }

  if (strings.find(string => string.match(INTERPOLATED_THEME_PROP_PATH_PATTERN) !== null)) {
    throw new Error(
      'Interpolated theme props are unacceptable useThemelessStyle content as no theme context is available'
    );
  }

  return useStyleBase.call(null, strings, ...inputs);
}

export function useStyle(strings: TemplateStringsArray, ...inputs: any[]): string {
  const [themedStrings, themedInputs] = useThemedStringsAndInputs(strings, inputs);

  return useStyleBase.call(null, themedStrings, ...themedInputs);
}
