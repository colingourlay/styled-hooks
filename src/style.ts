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

// Creates a single CSS rules containing Custom Properties for each input and returns className & Custom Property values
export function useStyle(strings: TemplateStringsArray, ...inputs: any[]): any[] {
  const className = generateClassName(strings.join(''));
  const [css, customProps] = useMemo(
    () =>
      riffleWithCustomProps(className, strings, inputs).map((arg, index) =>
        index === 0 ? stylis(`.${className}`, arg) : arg
      ),
    inputs.join('|')
  );

  useLayoutEffect(() => subscribe(css), className);
  useEffect(() => () => unsubscribe(css), className);

  return [className, customProps];
}

// Creates CSS rules for every unique set of inputs and returns a className
export function useUnstableStyle(strings: TemplateStringsArray, ...inputs: any[]): string {
  const className = generateClassName(strings.concat(inputs).join(''));
  const css = useMemo(() => stylis(`.${className}`, riffle(strings, inputs)), inputs.join('|'));

  useLayoutEffect(() => subscribe(css), inputs);
  useEffect(() => () => unsubscribe(css), inputs);

  return className;
}
