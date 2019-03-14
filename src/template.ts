export function riffle(strings: TemplateStringsArray, values: any[]): string {
  let result = '';

  for (let i = 0, len = strings.length; i < len; i++) {
    result += strings[i] + String(values[i] == null ? '' : values[i]);
  }

  return result;
}

export function riffleWithCustomProps(className: string, strings: TemplateStringsArray, values: any[]): any[] {
  let result = '';
  let props = {};
  let nextPropIndex = 0;

  for (let i = 0, len = strings.length; i < len; i++) {
    result += strings[i];

    if (values[i] != null) {
      const propName = `--${className}__${nextPropIndex++}`;

      result += `var(${propName})`;
      props[propName] = String(values[i]);
    }
  }

  return [result, props];
}
