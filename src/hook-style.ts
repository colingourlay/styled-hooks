import { useLayoutEffect, useMemo } from 'react';
import { generateClassName } from './naming';
import { addRule } from './style';
import { riffle } from './template';

export function useStyle(strings: TemplateStringsArray, ...inputs: any[]): string {
  const declarationBlock = useMemo(() => riffle(strings, inputs), inputs.join('|'));
  const className = generateClassName(declarationBlock);

  useLayoutEffect(() => addRule(className, declarationBlock), inputs);

  return className;
}
