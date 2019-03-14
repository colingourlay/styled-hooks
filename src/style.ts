import { StyleSheet } from './sheet';

let sheet;
const rules = new Set();

export function addRule(className: string, declarationBlock: string) {
  if (!sheet) {
    sheet = new StyleSheet({ container: document.head });
  }

  if (!rules.has(className)) {
    rules.add(className);
    sheet.insert(`.${className} {${declarationBlock}}`);
  }
}
