import { FormatterOptions } from '../types';

export const stripComments = (css: string): string => css.replace(/\/\*[\s\S]*?\*\//g, '');

export const collapseWhitespace = (css: string): string => css.replace(/\s+/g, ' ');

export const tightenSymbols = (css: string): string =>
  css.replace(/\s*([{}:;,>~+()\[\]=])\s*/g, '$1');

export const trimSemicolonBeforeBrace = (css: string): string => css.replace(/;}/g, '}');

export const pxToRem = (css: string, base: number = 16, precision: number = 3): string =>
  css.replace(/(-?\d*\.?\d+)px\b/g, (m, num) => {
    const n = parseFloat(num);
    if (!Number.isFinite(n)) return m;
    if (Math.abs(n) < 1e-8) return '0';
    const converted = n / base;
    return formatNumeric(converted, precision) + 'rem';
  });

export const remToPx = (css: string, base: number = 16, precision: number = 3): string =>
  css.replace(/(-?\d*\.?\d+)rem\b/g, (m, num) => {
    const n = parseFloat(num);
    if (!Number.isFinite(n)) return m;
    const converted = n * base;
    return formatNumeric(converted, precision) + 'px';
  });

const formatNumeric = (value: number, precision: number): string => {
  const fixed = value.toFixed(precision);
  return fixed.replace(/\.0+$/, '').replace(/\.(\d*?)0+$/, '.$1');
};

const splitDeclarations = (block: string): string[] =>
  block
    .split(';')
    .map((declaration) => declaration.trim())
    .filter(Boolean);

const joinDeclarations = (declarations: string[]): string =>
  declarations.length ? `${declarations.map((decl) => `${decl};`).join(' ')}` : '';

const sortDeclarations = (declarations: string[], preset: FormatterOptions['sortPreset']): string[] => {
  if (!declarations.length) {
    return declarations;
  }

  if (preset === 'alphabetical') {
    return [...declarations].sort((a, b) => a.localeCompare(b));
  }

  // Basic concentric-like ordering: position -> box -> typography -> visual -> misc
  const groups: Array<RegExp> = [
    /^(position|top|right|bottom|left|z-index)\b/i,
    /^(display|flex|grid|align|justify|float|clear|overflow)\b/i,
    /^(margin|padding|width|height|min-|max-|box-sizing)\b/i,
    /^(font|line-height|text|letter-spacing|word|color)\b/i,
    /^(background|border|outline|box-shadow|opacity)\b/i,
  ];

  const buckets: string[][] = groups.map(() => []);
  const rest: string[] = [];

  declarations.forEach((decl) => {
    const targetIndex = groups.findIndex((regex) => regex.test(decl));
    if (targetIndex === -1) {
      rest.push(decl);
    } else {
      buckets[targetIndex].push(decl);
    }
  });

  buckets.forEach((bucket, index) => {
    buckets[index] = bucket.sort((a, b) => a.localeCompare(b));
  });

  return [...buckets.flat(), ...rest.sort((a, b) => a.localeCompare(b))];
};

const formatBlocks = (css: string, options: FormatterOptions): string => {
  const blocks = css
    .split('}')
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks
    .map((block) => {
      const [rawSelector, ...bodyParts] = block.split('{');
      if (!bodyParts.length) {
        return `${rawSelector.trim()} }`;
      }

      const selector = rawSelector.trim();
      const body = bodyParts.join('{').trim();

      const declarations = splitDeclarations(body);
      const finalDeclarations = options.sortProperties
        ? sortDeclarations(declarations, options.sortPreset)
        : declarations;

      const declarationString = joinDeclarations(finalDeclarations).trim();
      if (!declarationString) {
        return `${selector} { }`;
      }

      return `${selector} { ${declarationString} }`;
    })
    .join('\n');
};

export const formatCss = (input: string, options: FormatterOptions): string => {
  let css = input.trim();
  if (!css) {
    return '';
  }

  if (options.removeComments) css = stripComments(css);
  if (options.collapseWhitespace) css = collapseWhitespace(css);
  if (options.tightenSymbols) css = tightenSymbols(css);
  if (options.trimSemicolon) css = trimSemicolonBeforeBrace(css);

  if (options.unitMode === 'px2rem') {
    css = pxToRem(css, options.pxBase);
  } else if (options.unitMode === 'rem2px') {
    css = remToPx(css, options.remBase);
  }

  css = tightenSymbols(css.replace(/\s*{\s*/g, ' { ').replace(/\s*}\s*/g, ' } '));
  css = css.replace(/\s*;\s*/g, '; ').replace(/\s+/g, ' ');

  return formatBlocks(css, options)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join('\n');
};
