import { useEffect, useLayoutEffect, useMemo } from 'react';
import Stylis from '@emotion/stylis';
import { generateClassName } from './naming';
import { subscribe, unsubscribe } from './style-manager';
import { riffle, riffleWithCustomProps } from './template';

interface GlobalCSS {
  supports: Function;
}

declare var CSS: GlobalCSS;

const IS_BROWSER_ENVIRONMENT_THAT_SUPPORTS_CSS_CUSTOM_PROPERTIES =
  CSS && CSS.supports && CSS.supports(`--custom: var(--properties)`);

const stylis = new Stylis();

export function useStyleWithoutCustomProps(strings: TemplateStringsArray, ...inputs: any[]): string {
  const className = generateClassName(strings.concat(inputs).join(''));
  const css = useMemo(() => stylis(`.${className}`, riffle(strings, inputs)), [className]);

  useLayoutEffect(() => subscribe(css), [className]);
  useEffect(() => () => unsubscribe(css), [className]);

  return className;
}

export function useStyleWithCustomProps(strings: TemplateStringsArray, ...inputs: any[]): string {
  const className = generateClassName(strings.join(''));
  const customPropsClassName = generateClassName(inputs.join(''));
  const [css, customPropsCSS] = useMemo(
    () =>
      riffleWithCustomProps(className, strings, inputs).map((arg, index) => {
        if (index === 0) {
          return stylis(`.${className}`, arg);
        }

        return `.${customPropsClassName}{${Object.keys(arg).reduce((memo: string, propKey: string) => {
          return memo + `${propKey}: ${arg[propKey]};`;
        }, '')}}`;
      }),
    [customPropsClassName]
  );

  useLayoutEffect(() => subscribe(css));
  useEffect(() => () => unsubscribe(css));

  useLayoutEffect(() => subscribe(customPropsCSS), [customPropsClassName]);
  useEffect(() => () => unsubscribe(customPropsCSS), [customPropsClassName]);

  return `${className}${customPropsClassName ? ` ${customPropsClassName}` : ''}`;
}

export function useStyle(strings: TemplateStringsArray, ...inputs: any[]): string {
  return (IS_BROWSER_ENVIRONMENT_THAT_SUPPORTS_CSS_CUSTOM_PROPERTIES
    ? useStyleWithCustomProps
    : useStyleWithoutCustomProps)(strings, ...inputs);
}
