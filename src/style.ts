import { useLayoutEffect, useMemo } from 'react';
import { generateClassName } from './naming';
import { StyleSheet } from './sheet';
import { riffle } from './template';

let sheet: StyleSheet;
const rules = new Set();

function addRule(className: string, declarationBlock: string) {
  if (!sheet) {
    sheet = new StyleSheet({ container: document.head });
  }

  if (!rules.has(className)) {
    rules.add(className);
    sheet.insert(`.${className} {${declarationBlock}}`);
  }
}

export function useStyle(strings: TemplateStringsArray, ...inputs: any[]): string {
  const declarationBlock = useMemo(() => riffle(strings, inputs), inputs.join('|'));
  const className = generateClassName(declarationBlock);

  useLayoutEffect(() => addRule(className, declarationBlock), inputs);

  return className;
}
