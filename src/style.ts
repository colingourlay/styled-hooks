import { useEffect, useLayoutEffect, useMemo } from 'react';
import { generateClassName } from './naming';
import { StyleManager } from './style-manager';
import { riffle, riffleWithCustomProps } from './template';

let manager: StyleManager;
const counts = new Map();

function subscribe(className: string, declarationBlock: string) {
  if (!manager) {
    manager = new StyleManager({ container: document.head });
  }

  if (!counts.has(className)) {
    counts.set(className, 1);
    manager.add(`.${className} {${declarationBlock}}`);
  } else {
    counts.set(className, counts.get(className) + 1);
  }
}

function unsubscribe(className: string, declarationBlock: string) {
  if (!manager || !counts.has(className)) {
    return;
  }

  const count = counts.get(className);
  counts.set(className, counts.get(className) - 1);

  if (count > 1) {
    counts.set(className, count - 1);
  } else {
    counts.delete(className);
    manager.remove(`.${className} {${declarationBlock}}`);
  }
}

export function useStyle(strings: TemplateStringsArray, ...inputs: any[]): string {
  const declarationBlock = useMemo(() => riffle(strings, inputs), inputs.join('|'));
  const className = generateClassName(declarationBlock);

  useLayoutEffect(() => subscribe(className, declarationBlock), inputs);

  useEffect(
    () => () => {
      unsubscribe(className, declarationBlock);
    },
    inputs
  );

  return className;
}

export function useVariableStyle(strings: TemplateStringsArray, ...inputs: any[]): any[] {
  const className = generateClassName(strings.join(''));
  const [declarationBlock, customProps] = useMemo(
    () => riffleWithCustomProps(className, strings, inputs),
    inputs.join('|')
  );

  useLayoutEffect(() => subscribe(className, declarationBlock), className);

  useEffect(
    () => () => {
      unsubscribe(className, declarationBlock);
    },
    className
  );

  return [className, customProps];
}
