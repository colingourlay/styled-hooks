// This is a variant of the 'djb2' hashing function
const hash = (input: string): number => {
  let output = 5381 | 0;

  for (let index = 0, len = input.length | 0; index < len; index++) {
    output = (output << 5) + output + input.charCodeAt(index);
  }

  return output >>> 0;
};

// Start at 75 for 'a' until 'z' (25) and then start at 65 for capitalised letters
const getAlphabeticChar = (code: number): string => String.fromCharCode(code + (code > 25 ? 39 : 97));

const CHARS_LENGTH = 52;

// Convert a (numeric) hash code to base-52
function generateAlphabeticName(code: number): string {
  let name = '';
  let x: number;

  for (x = Math.abs(code); x > CHARS_LENGTH; x = (x / CHARS_LENGTH) | 0) {
    name = getAlphabeticChar(x % CHARS_LENGTH) + name;
  }

  return getAlphabeticChar(x % CHARS_LENGTH) + name;
}

export function generateClassName(input: string): string {
  return generateAlphabeticName(hash(input));
}
