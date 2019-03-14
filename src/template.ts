export function riffle(strings: TemplateStringsArray, values: any[]): string {
  let result = '';

  for (let i = 0, len = strings.length; i < len; i++) {
    result += strings[i] + String(values[i] == null ? '' : values[i]);
  }

  return result;
}
