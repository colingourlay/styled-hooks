export function riffle(strings: TemplateStringsArray, values: any[]): string {
  let result = '';

  for (let i = 0, len = strings.length; i < len; i++) {
    result += strings[i] + String(values[i] == null ? '' : values[i]);
  }

  return result;
}

const UNITS_PATTERN = /^(cap|ch|em|ex|ic|lh|rem|rlh|vh|vw|vmin|vmax|px|cm|mm|Q|in|pc|pt|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx|x|%)/g;

export function riffleWithCustomProps(className: string, strings: TemplateStringsArray, values: any[]): any[] {
  let result = '';
  let props = {};
  let nextPropIndex = 0;
  let editedNextString = '';

  for (let i = 0, len = strings.length; i < len; i++) {
    if (editedNextString) {
      result += editedNextString;
      editedNextString = '';
    } else {
      result += strings[i];
    }

    if (values[i] != null) {
      const propName = `--${className}_${nextPropIndex++}`;

      result += `var(${propName})`;
      props[propName] = String(values[i]);

      if (strings[i + 1]) {
        const [unit] = strings[i + 1].match(UNITS_PATTERN) || [''];

        if (unit) {
          if (!props[propName].length) {
            props[propName] = '0';
          }

          props[propName] += unit;
          editedNextString = strings[i + 1].slice(unit.length);
        }
      }
    }
  }

  return [result, props];
}
