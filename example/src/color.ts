export function hue2rgb(p: number, q: number, t: number): number {
  if (t < 0) {
    t += 1;
  }

  if (t > 1) {
    t -= 1;
  }

  if (t < 1 / 6) {
    return p + (q - p) * 6 * t;
  }

  if (t < 1 / 2) {
    return q;
  }

  if (t < 2 / 3) {
    return p + (q - p) * (2 / 3 - t) * 6;
  }

  return p;
}

export function hsl2rgb(h: number, s: number, l: number): number[] {
  let r: number;
  let g: number;
  let b: number;

  if (s == 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

export function num2hex(x: number): string {
  const hex = x.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
}

export function rgb2hex(r: number, g: number, b: number): string {
  return `#${num2hex(r)}${num2hex(g)}${num2hex(b)}`;
}

export function hsl2hex(h: number, s: number, l: number): string {
  return rgb2hex.apply(null, hsl2rgb(h, s, l));
}
