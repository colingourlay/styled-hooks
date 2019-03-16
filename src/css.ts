import Stylis from '@emotion/stylis';

const UNITS_PATTERN = /^(cap|ch|em|ex|ic|lh|rem|rlh|vh|vw|vmin|vmax|px|cm|mm|Q|in|pc|pt|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx|x|%)/g;

const stylis = new Stylis();

const customPropsRule = (className: string, customProps: {}) =>
  `.${className}{${Object.keys(customProps).reduce((memo: string, key: string) => {
    return memo + `${key}:${customProps[key]};`;
  }, '')}}`;

export function generateCSS(className: string, strings: TemplateStringsArray, values: any[]): string {
  let input = '';

  for (let i = 0, len = strings.length; i < len; i++) {
    input += strings[i] + String(values[i] == null ? '' : values[i]);
  }

  return stylis(`.${className}`, input);
}

export function generateCSSWithCustomProps(
  sharedClassName: string,
  variableClassName: string,
  strings: TemplateStringsArray,
  values: any[]
): any[] {
  let sharedInput = '';
  let customProps = {};
  let nextCustomPropIndex = 0;
  let editedNextString = '';

  for (let i = 0, len = strings.length; i < len; i++) {
    if (editedNextString) {
      sharedInput += editedNextString;
      editedNextString = '';
    } else {
      sharedInput += strings[i];
    }

    if (values[i] != null) {
      const customPropKey = `--${sharedClassName}-${nextCustomPropIndex++}`;

      sharedInput += `var(${customPropKey})`;
      customProps[customPropKey] = String(values[i]);

      if (strings[i + 1]) {
        const [unit] = strings[i + 1].match(UNITS_PATTERN) || [''];

        if (unit) {
          if (!customProps[customPropKey].length) {
            customProps[customPropKey] = '0';
          }

          customProps[customPropKey] += unit;
          editedNextString = strings[i + 1].slice(unit.length);
        }
      }
    }
  }

  const sharedCSS = stylis(`.${sharedClassName}`, sharedInput);
  const variableCSS = customPropsRule(variableClassName, customProps);

  return [sharedCSS, variableCSS];
}
