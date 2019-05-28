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

const DELIMITER_PATTERN = /:|;/;

export function generateCSSWithCustomProps(
  sharedClassName: string,
  variableClassName: string,
  strings: TemplateStringsArray,
  values: any[]
): any[] {
  let sharedInput = '';
  let customProps = {};
  let nextCustomPropIndex = 0;

  for (let i = 0, len = strings.length; i < len; i++) {
    sharedInput += strings[i];

    if (values[i] != null) {
      // Try to not create custom properties where they'd be syntactically incorrect
      if (String(values[i]).match(DELIMITER_PATTERN) || sharedInput.lastIndexOf(':') < sharedInput.lastIndexOf(';')) {
        sharedInput += values[i];
        continue;
      }

      const customPropKey = `--${sharedClassName}-${nextCustomPropIndex++}`;

      sharedInput += `var(${customPropKey})`;
      customProps[customPropKey] = String(values[i]);
    }
  }

  const sharedCSS = stylis(`.${sharedClassName}`, sharedInput);
  const variableCSS = customPropsRule(variableClassName, customProps);

  return [sharedCSS, variableCSS];
}
