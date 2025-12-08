import { FormatterOptions } from '../types';

export const stripComments = (css: string): string => css.replace(/\/\*[\s\S]*?\*\//g, '');

export const collapseWhitespace = (css: string): string =>
  css
    .replace(/\s+/g, ' ')
    .replace(/([a-z0-9_-])\s+\(/gi, '$1(') // remove space before opening paren when preceded by identifier
    .replace(/\(\s+/g, '(') // trim space right after opening paren
    .replace(/\s+\)/g, ')') // trim space right before closing paren
    .replace(/\)\s+(?=[;:,)}])/g, ')'); // remove trailing space after closing paren before punctuation

/**
 * Collapse whitespace but keep top-level comments (outside any selector block) untouched.
 * Useful when users want to keep comment formatting while still tightening rules inside blocks.
 */
const collapseWhitespacePreserveTopLevelComments = (css: string): string => {
  let result = '';
  let buffer = '';
  let braceDepth = 0;

  const flushBuffer = () => {
    if (buffer) {
      result += collapseWhitespace(buffer);
      buffer = '';
    }
  };

  for (let i = 0; i < css.length; i += 1) {
    const char = css[i];
    const next = css[i + 1];

    if (char === '/' && next === '*') {
      const end = css.indexOf('*/', i + 2);
      const hasClosing = end !== -1;
      const commentEnd = hasClosing ? end + 2 : css.length;
      const comment = css.slice(i, commentEnd);

      if (braceDepth === 0) {
        flushBuffer();
        result += comment; // keep as-is when outside selectors
      } else {
        buffer += comment; // allow collapse inside selector bodies
      }

      i = commentEnd - 1; // jump to end of comment
      continue;
    }

    if (char === '{') {
      braceDepth += 1;
    } else if (char === '}') {
      braceDepth = Math.max(0, braceDepth - 1);
    }

    buffer += char;
  }

  flushBuffer();
  return result;
};

export const tightenSymbols = (css: string): string =>
  css.replace(/\s*([{}:;,>~+()\[\]=])\s*/g, (match, symbol, offset, str) => {
    if (symbol === ']') {
      // Preserve a descendant combinator if whitespace originally existed after a closing bracket.
      const nextNonSpaceMatch = str.slice(offset + match.length).match(/\S/);
      const nextNonSpace = nextNonSpaceMatch ? nextNonSpaceMatch[0] : '';
      if (/[.#a-zA-Z0-9_-]/.test(nextNonSpace)) {
        return '] ';
      }
    }

    return symbol;
  });

export const trimSemicolonBeforeBrace = (css: string): string => css.replace(/;\s*}/g, '}');

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

type PropertyPattern = string | RegExp;

interface PropertyGroup {
  name: string;
  patterns: PropertyPattern[];
}

const vendorPrefixPattern = /^-(webkit|moz|ms|o)-/i;

// Category-based property order inspired by common style guides (Airbnb, GitHub, Google)
const groupedPropertyOrder: PropertyGroup[] = [
  {
    name: 'positioning',
    patterns: [
      'position',
      'inset',
      'inset-block',
      'inset-inline',
      'top',
      'right',
      'bottom',
      'left',
      'z-index',
      'float',
      'clear',
      'visibility',
      'isolation',
    ],
  },
  {
    name: 'box-model',
    patterns: [
      'display',
      'contain',
      'contain-intrinsic-size',
      'flex-direction',
      'flex-wrap',
      'flex-flow',
      'flex',
      'flex-grow',
      'flex-shrink',
      'flex-basis',
      'justify',
      'align',
      'place',
      'order',
      'grid-template',
      'grid-auto',
      'grid',
      'grid-row',
      'grid-column',
      'gap',
      'row-gap',
      'column-gap',
      'columns',
      'column',
      'box-sizing',
      'width',
      'min-width',
      'max-width',
      'inline-size',
      'min-inline-size',
      'max-inline-size',
      'height',
      'min-height',
      'max-height',
      'block-size',
      'min-block-size',
      'max-block-size',
      'aspect-ratio',
      'object-fit',
      'object-position',
      'overflow',
      'overscroll',
      'scroll-snap',
      'scroll-margin',
      'scroll-padding',
      'scrollbar',
      'margin',
      'padding',
    ],
  },
  {
    name: 'typography',
    patterns: [
      'font',
      'line-height',
      'line-clamp',
      'letter-spacing',
      'word',
      'text',
      'writing',
      'white-space',
      'tab-size',
      'hyphen',
      'hyphenate',
      'quotes',
      'list-style',
      'accent-color',
      'color',
      'caret',
      'vertical-align',
    ],
  },
  {
    name: 'visual',
    patterns: [
      'background',
      'border',
      'outline',
      'box-decoration',
      'box-shadow',
      'opacity',
      'filter',
      'backdrop-filter',
      'mix-blend-mode',
      'background-blend-mode',
      'mask',
      'clip',
      'shape',
      'image',
      'fill',
      'stroke',
    ],
  },
  {
    name: 'interaction',
    patterns: [
      'transform',
      'perspective',
      'backface-visibility',
      'transition',
      'animation',
      'scroll-behavior',
      'cursor',
      'pointer',
      'user-select',
      'touch-action',
      'will-change',
      'appearance',
      'zoom',
      'resize',
      'content',
    ],
  },
];

const matchesPattern = (property: string, pattern: PropertyPattern): boolean => {
  if (pattern instanceof RegExp) {
    return pattern.test(property);
  }
  const normalized = pattern.toLowerCase();
  return property === normalized || property.startsWith(`${normalized}-`);
};

const resolvePropertyOrder = (property: string) => {
  for (let groupIndex = 0; groupIndex < groupedPropertyOrder.length; groupIndex += 1) {
    const group = groupedPropertyOrder[groupIndex];
    for (let propertyIndex = 0; propertyIndex < group.patterns.length; propertyIndex += 1) {
      const pattern = group.patterns[propertyIndex];
      if (matchesPattern(property, pattern)) {
        return { groupIndex, propertyIndex };
      }
    }
  }
  return null;
};

const extractPropertyName = (declaration: string): string => {
  const [rawProperty] = declaration.split(':');
  if (!rawProperty) {
    return '';
  }
  return rawProperty.trim().replace(vendorPrefixPattern, '').toLowerCase();
};

const splitDeclarations = (block: string): string[] =>
  block
    .split(';')
    .map((declaration) => declaration.trim())
    .filter(Boolean);

const joinDeclarations = (
  declarations: string[],
  trimFinalSemicolon: boolean,
  collapseSpacing: boolean,
  outputMode: FormatterOptions['outputMode'],
): string => {
  if (!declarations.length) {
    return '';
  }

  if (outputMode === 'multi-line') {
    const indent = '  ';
    return declarations
      .map((decl, index) => {
        const isLast = index === declarations.length - 1;
        const suffix = trimFinalSemicolon && isLast ? '' : ';';
        return `${indent}${decl}${suffix}`;
      })
      .join('\n');
  }

  const separator = outputMode === 'single-line' ? ' ' : collapseSpacing ? '' : ' ';

  return declarations
    .map((decl, index) => {
      const isLast = index === declarations.length - 1;
      return trimFinalSemicolon && isLast ? decl : `${decl};`;
    })
    .join(separator);
};

const sortDeclarations = (declarations: string[], preset: FormatterOptions['sortPreset']): string[] => {
  if (!declarations.length) {
    return declarations;
  }

  if (preset === 'none') {
    return declarations;
  }

  if (preset !== 'concentric') {
    return declarations;
  }

  const prepared = declarations.map((declaration, originalIndex) => {
    const property = extractPropertyName(declaration);
    const resolved = resolvePropertyOrder(property);

    return {
      declaration,
      originalIndex,
      groupIndex: resolved?.groupIndex ?? groupedPropertyOrder.length,
      propertyIndex: resolved?.propertyIndex ?? Number.MAX_SAFE_INTEGER,
    };
  });

  return prepared
    .sort((a, b) => {
      if (a.groupIndex !== b.groupIndex) {
        return a.groupIndex - b.groupIndex;
      }
      if (a.propertyIndex !== b.propertyIndex) {
        return a.propertyIndex - b.propertyIndex;
      }
      return a.originalIndex - b.originalIndex;
    })
    .map((item) => item.declaration);
};

const extractLeadingComments = (text: string): { comments: string[]; remainder: string } => {
  const comments: string[] = [];
  let remainder = text;

  const commentPattern = /^\s*\/\*[\s\S]*?\*\/\s*/;
  while (true) {
    const match = remainder.match(commentPattern);
    if (!match) break;
    const comment = match[0].trim();
    comments.push(comment);
    remainder = remainder.slice(match[0].length);
  }

  return { comments, remainder };
};

const formatBlocks = (css: string, options: FormatterOptions): string => {
  const collapseSpacing = options.outputMode === 'minify' ? true : options.collapseWhitespace;
  const tightenBraces = options.outputMode === 'minify' ? true : options.tightenSymbols;
  const blockJoiner = options.outputMode === 'minify' ? '' : '\n';

  const blocks = css
    .split('}')
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks
    .map((block) => {
      const { comments, remainder } = extractLeadingComments(block);

      if (!remainder) {
        return comments.join('\n');
      }

      const [rawSelector, ...bodyParts] = remainder.split('{');
      if (!bodyParts.length) {
        return [...comments, `${rawSelector.trim()} }`].filter(Boolean).join('\n');
      }

      const selector = rawSelector.trim();
      const body = bodyParts.join('{').trim();

      const declarations = splitDeclarations(body);
      const finalDeclarations = options.sortProperties
        ? sortDeclarations(declarations, options.sortPreset)
        : declarations;

      const declarationString = joinDeclarations(
        finalDeclarations,
        options.trimSemicolon,
        collapseSpacing,
        options.outputMode,
      ).trim();
      if (!declarationString) {
        const emptyBlock = collapseSpacing ? `${selector}{}` : `${selector} { }`;
        return [...comments, emptyBlock].filter(Boolean).join('\n');
      }

      const braceSpace = tightenBraces ? '' : ' ';

      const formattedBlock = (() => {
        if (options.outputMode === 'multi-line') {
          return `${selector}${braceSpace}{\n${declarationString}\n}`;
        }

        if (options.outputMode === 'single-line') {
          const innerSpace = options.tightenSymbols ? '' : ' ';
          const trailingSpace = options.tightenSymbols ? '' : ' ';
          return `${selector}${braceSpace}{${innerSpace}${declarationString}${trailingSpace}}`;
        }

        if (options.outputMode === 'minify') {
          return `${selector}{${declarationString}}`;
        }

        if (options.collapseWhitespace) {
          return `${selector}{${declarationString}}`;
        }

        return `${selector} { ${declarationString} }`;
      })();

      return [...comments, formattedBlock].filter(Boolean).join('\n');
    })
    .join(blockJoiner);
};

export const formatCss = (input: string, options: FormatterOptions): string => {
  let css = input.trim();
  if (!css) {
    return '';
  }

  const shouldCollapseWhitespace = options.collapseWhitespace || options.outputMode === 'minify';
  const shouldTightenSymbols = options.tightenSymbols || options.outputMode === 'minify';
  const attributeDescendantCombos =
    shouldTightenSymbols || options.outputMode === 'minify'
      ? null
      : new Set(
          Array.from(input.matchAll(/(\[[^\]]+\])\s+([.#][\w-]+)/g)).map(
            ([, attr, next]) => `${attr}>>${next}`,
          ),
        );

  if (options.removeComments) css = stripComments(css);
  if (options.unitMode === 'px2rem') {
    css = pxToRem(css, options.pxBase);
  } else if (options.unitMode === 'rem2px') {
    css = remToPx(css, options.remBase);
  }
  if (shouldCollapseWhitespace) {
    css = options.removeComments
      ? collapseWhitespace(css)
      : collapseWhitespacePreserveTopLevelComments(css);
  }
  if (shouldTightenSymbols) css = tightenSymbols(css);
  if (options.trimSemicolon) css = trimSemicolonBeforeBrace(css);

  const restoreDescendantSpacing = (text: string): string => {
    if (shouldTightenSymbols || !attributeDescendantCombos?.size) return text;
    return text.replace(
      /(\[[^\]]+\])\s*([.#][\w-]+)/g,
      (match, attr, next) =>
        attributeDescendantCombos.has(`${attr}>>${next}`) ? `${attr} ${next}` : match,
    );
  };

  const formatted = formatBlocks(css, options).trim();
  const restored = restoreDescendantSpacing(formatted);

  if (options.outputMode === 'single-line') {
    return restored
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .join('\n');
  }

  return restored;
};
