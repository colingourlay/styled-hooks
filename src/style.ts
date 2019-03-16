import { useEffect, useLayoutEffect, useMemo } from 'react';
import { generateClassName } from './naming';
import { subscribe, unsubscribe } from './style-manager';
import { generateCSS, generateCSSWithCustomProps } from './css';

interface GlobalCSS {
  supports: Function;
}

declare var CSS: GlobalCSS;

const IS_BROWSER_ENVIRONMENT_THAT_SUPPORTS_CSS_CUSTOM_PROPERTIES =
  CSS && CSS.supports && CSS.supports(`--custom: var(--properties)`);

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
  return (IS_BROWSER_ENVIRONMENT_THAT_SUPPORTS_CSS_CUSTOM_PROPERTIES
    ? useStyleWithCustomProps
    : useStyleWithoutCustomProps)(strings, ...inputs);
}
