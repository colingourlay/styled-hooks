import Stylis from '@emotion/stylis';
import _insertRulePlugin from 'stylis-rule-sheet';

function sheetForTag(tag: HTMLStyleElement): CSSStyleSheet {
  if (!tag.sheet) {
    // This weirdness brough./style-manageru by firefox
    for (let i = 0; i < document.styleSheets.length; i++) {
      if (document.styleSheets[i].ownerNode === tag) {
        // @ts-ignore
        return document.styleSheets[i];
      }
    }
  }

  // @ts-ignore
  return tag.sheet;
}

interface StyleElementOptions {
  nonce?: string;
  container: HTMLElement;
  isSpeedy?: boolean;
}

function createStyleElement(options: { nonce: string | void }): HTMLStyleElement {
  let tag = document.createElement('style');

  if (options.nonce !== undefined) {
    tag.setAttribute('nonce', options.nonce);
  }

  tag.appendChild(document.createTextNode(''));

  return tag;
}

// let parsingRules = [];

// const returnRulesPlugin = (context: number) => {
//   if (context === -2) {
//     const parsedRules = parsingRules;

//     parsingRules = [];

//     return parsedRules;
//   }
// };

// const parseRulesPlugin = _insertRulePlugin((rule: never) => {
//   parsingRules.push(rule);
// });

// const splitter = new Stylis({
//   global: false,
//   cascade: true,
//   keyframe: false,
//   prefix: false,
//   compress: false,
//   semicolon: true
// } as {});

// splitter.use([parseRulesPlugin, returnRulesPlugin]);

// function cssToRules(css: string): string[] {
//   return splitter('', css);
// }

class StyleManager {
  isSpeedy: boolean;
  ctr: number;
  tags: HTMLStyleElement[];
  container: HTMLElement;
  nonce: string | void;
  before: Element | null;

  constructor(options: StyleElementOptions) {
    this.isSpeedy = !!options.isSpeedy;
    this.tags = [];
    this.ctr = 0;
    this.nonce = options.nonce;
    this.container = options.container;
    this.before = null;
  }

  add(rule: string) {
    if (this.ctr % (this.isSpeedy ? 65000 : 1) === 0) {
      let tag = createStyleElement(this);
      let before: Node | null;

      if (this.tags.length === 0) {
        before = this.before;
      } else {
        before = this.tags[this.tags.length - 1].nextSibling;
      }

      this.container.insertBefore(tag, before);
      this.tags.push(tag);
    }

    const tag = this.tags[this.tags.length - 1];

    if (this.isSpeedy) {
      const sheet = sheetForTag(tag);

      try {
        let isImportRule = rule.charCodeAt(1) === 105 && rule.charCodeAt(0) === 64;

        sheet.insertRule(rule, isImportRule ? 0 : sheet.cssRules.length);
      } catch (e) {}
    } else {
      tag.appendChild(document.createTextNode(rule));
    }

    this.ctr++;
  }

  remove(rule: string) {
    tags: for (let tI = 0, tL = this.tags.length; tI < tL; tI++) {
      const tag = this.tags[tI];

      if (this.isSpeedy) {
        const sheet = sheetForTag(tag);

        for (let rI = 0, rL = sheet.cssRules.length; rI < rL; rI++) {
          if (sheet.cssRules[rI].toString() === rule) {
            sheet.deleteRule(rI);
            break tags;
          }
        }
      } else if (tag.textContent === rule) {
        this.tags.splice(tI, 1);
        this.container.removeChild(tag);
        break;
      }
    }
  }
}

// const manager = new StyleManager({ container: document.head, isSpeedy: true });
const manager = new StyleManager({ container: document.head, isSpeedy: false });
const counts = new Map();

export function subscribe(css: string) {
  if (!counts.has(css)) {
    counts.set(css, 1);
    // cssToRules(css).map((rule: string) => manager.add(rule));
    manager.add(css);
  } else {
    counts.set(css, counts.get(css) + 1);
  }
}

export function unsubscribe(css: string) {
  if (!counts.has(css)) {
    return;
  }

  const count = counts.get(css);

  if (count > 1) {
    counts.set(css, count - 1);
  } else {
    counts.delete(css);
    // cssToRules(css).map((rule: string) => manager.remove(rule));
    manager.remove(css);
  }
}
