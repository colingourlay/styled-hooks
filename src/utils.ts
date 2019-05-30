import { generateCSS } from './css';
import { subscribe } from './style-manager';

export function injectGlobal(strings: TemplateStringsArray, ...inputs: any[]): void {
  return subscribe(generateCSS(null, strings, inputs));
}
