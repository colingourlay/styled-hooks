import { useEffect, useLayoutEffect, useMemo } from 'react';
import Stylis from '@emotion/stylis';
import { generateClassName } from './naming';
import { StyleManager } from './style-manager';
import { riffle, riffleWithCustomProps } from './template';

let manager: StyleManager;
const counts = new Map();
const stylis = new Stylis();

function subscribe(css: string) {
  if (!manager) {
    manager = new StyleManager({ container: document.head });
  }

  if (!counts.has(css)) {
    counts.set(css, 1);
    manager.add(css);
  } else {
    counts.set(css, counts.get(css) + 1);
  }
}

function unsubscribe(css: string) {
  if (!manager || !counts.has(css)) {
    return;
  }

  const count = counts.get(css);

  if (count > 1) {
    counts.set(css, count - 1);
  } else {
    counts.delete(css);
    manager.remove(css);
  }
}

export function useUnstableStyle(strings: TemplateStringsArray, ...inputs: any[]): string {
  const className = generateClassName(strings.concat(inputs).join(''));
  const css = useMemo(() => stylis(`.${className}`, riffle(strings, inputs)), inputs.join('|'));

  useLayoutEffect(() => subscribe(css), inputs);
  useEffect(() => () => unsubscribe(css), inputs);

  return className;
}

interface GlobalCSS {
  supports: Function;
}

declare var CSS: GlobalCSS;

const BROWSER_SUPPORTS_CSS_CUSTOM_PROPERTIES = CSS && CSS.supports && CSS.supports(`--custom: var(--properties)`);

export function useStyle(strings: TemplateStringsArray, ...inputs: any[]): string {
  if (!BROWSER_SUPPORTS_CSS_CUSTOM_PROPERTIES) {
    return useUnstableStyle(strings, ...inputs);
  }

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
    customPropsClassName
  );

  useLayoutEffect(() => subscribe(css), className);
  useLayoutEffect(() => subscribe(customPropsCSS), customPropsClassName);
  useEffect(() => () => unsubscribe(css), className);
  useEffect(() => () => unsubscribe(customPropsCSS), customPropsClassName);

  return `${className} ${customPropsClassName}`;
}
