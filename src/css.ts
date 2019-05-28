import Stylis from '@emotion/stylis';

const stylis = new Stylis();

const customPropsRule = (className: string, customProps: {}) =>
  `.${className}{${Object.keys(customProps).reduce((memo: string, key: string) => {
    return memo + `${key}:${customProps[key]};`;
  }, '')}}`;

export function generateCSS(className: string | null, strings: TemplateStringsArray, values: any[]): string {
  let input = '';

  for (let i = 0, len = strings.length; i < len; i++) {
    input += strings[i] + String(values[i] == null ? '' : values[i]);
  }

  return stylis(className ? `.${className}` : '', input);
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
    }
  }

  const sharedCSS = stylis(`.${sharedClassName}`, sharedInput);
  const variableCSS = customPropsRule(variableClassName, customProps);

  return [sharedCSS, variableCSS];
}
