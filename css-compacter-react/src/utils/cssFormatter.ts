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
      const hadTrailingWhitespace = /\s$/.test(match);
      const nextNonSpaceMatch = str.slice(offset + match.length).match(/\S/);
      const nextNonSpace = nextNonSpaceMatch ? nextNonSpaceMatch[0] : '';
      if (hadTrailingWhitespace && /[.#a-zA-Z0-9_-]/.test(nextNonSpace)) {
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

// Category-based property order inspired by Concentric/Rhodes Mill (box model centric)
const groupedPropertyOrder: PropertyGroup[] = [
  {
    name: 'layout-position',
    patterns: [
      'display',
      'contain',
      'contain-intrinsic-size',
      'position',
      'inset',
      'inset-block',
      'inset-inline',
      'top',
      'right',
      'bottom',
      'left',
      'float',
      'clear',
      'isolation',
      'z-index',
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
    ],
  },
  {
    name: 'visibility-layer',
    patterns: [
      'visibility',
      'opacity',
      'z-index',
    ],
  },
  {
    name: 'box-layer',
    patterns: [
      'margin',
      'outline',
      'border',
      'background',
      'padding',
    ],
  },
  {
    name: 'sizing-overflow',
    patterns: [
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
      'scroll-behavior',
      'scroll-snap',
      'scroll-margin',
      'scroll-padding',
      'scrollbar',
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
    name: 'visual-interaction',
    patterns: [
      'box-decoration',
      'box-shadow',
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
      'transform',
      'perspective',
      'backface-visibility',
      'transition',
      'animation',
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

// Alternative category grouping (Positioning/Display-Bbox/Border-BG/Typography/Interaction/Etc)
const categoryPropertyOrder: PropertyGroup[] = [
  {
    name: 'positioning',
    patterns: ['position', 'top', 'right', 'bottom', 'left', 'z-index'],
  },
  {
    name: 'display-box',
    patterns: [
      'display',
      'float',
      'clear',
      'flex',
      'flex-direction',
      'flex-wrap',
      'flex-flow',
      'flex-grow',
      'flex-shrink',
      'flex-basis',
      'justify',
      'align',
      'place',
      'order',
      'grid',
      'grid-template',
      'grid-auto',
      'grid-row',
      'grid-column',
      'gap',
      'row-gap',
      'column-gap',
      'width',
      'min-width',
      'max-width',
      'height',
      'min-height',
      'max-height',
      'inline-size',
      'block-size',
      'margin',
      'padding',
      'box-sizing',
      'overflow',
      'overflow-x',
      'overflow-y',
    ],
  },
  {
    name: 'border-background',
    patterns: [
      'border',
      'border-top',
      'border-right',
      'border-bottom',
      'border-left',
      'border-radius',
      'outline',
      'background',
      'box-shadow',
    ],
  },
  {
    name: 'typography',
    patterns: ['font', 'line-height', 'text', 'color'],
  },
  {
    name: 'interaction',
    patterns: ['cursor', 'transition', 'transform', 'animation'],
  },
  {
    name: 'etc',
    patterns: ['content', 'list-style', 'appearance'],
  },
];

interface MatchResult {
  matched: boolean;
  specificity: number; // higher means more specific (exact > regex > prefix)
}

const matchPattern = (property: string, pattern: PropertyPattern): MatchResult => {
  if (pattern instanceof RegExp) {
    return { matched: pattern.test(property), specificity: 2 };
  }
  const normalized = pattern.toLowerCase();
  if (property === normalized) {
    return { matched: true, specificity: 3 };
  }
  if (property.startsWith(`${normalized}-`)) {
    return { matched: true, specificity: 1 };
  }
  return { matched: false, specificity: 0 };
};

const resolvePropertyOrder = (property: string, groups: PropertyGroup[] = groupedPropertyOrder) => {
  let best:
    | { groupIndex: number; propertyIndex: number; specificity: number }
    | null = null;

  for (let groupIndex = 0; groupIndex < groups.length; groupIndex += 1) {
    const group = groups[groupIndex];
    for (let propertyIndex = 0; propertyIndex < group.patterns.length; propertyIndex += 1) {
      const pattern = group.patterns[propertyIndex];
      const { matched, specificity } = matchPattern(property, pattern);
      if (!matched) continue;
      if (
        !best ||
        specificity > best.specificity ||
        (specificity === best.specificity && propertyIndex < best.propertyIndex)
      ) {
        best = { groupIndex, propertyIndex, specificity };
      }
    }
  }
  return best;
};

const extractPropertyName = (declaration: string): string => {
  const [rawProperty] = declaration.split(':');
  if (!rawProperty) {
    return '';
  }
  return rawProperty.trim().replace(vendorPrefixPattern, '').toLowerCase();
};

// Split declarations while respecting strings, comments, nested braces/paren/bracket so
// data URIs or nested rules do not get split mid-value.
const splitDeclarations = (block: string): string[] => {
  const declarations: string[] = [];
  let current = '';
  let inString: '"' | "'" | null = null;
  let inComment = false;
  let depthCurly = 0;
  let depthParen = 0;
  let depthBracket = 0;

  const pushCurrent = () => {
    const trimmed = current.trim();
    if (trimmed) declarations.push(trimmed);
    current = '';
  };

  for (let i = 0; i < block.length; i += 1) {
    const char = block[i];
    const next = block[i + 1];
    const prev = block[i - 1];

    // comment start/end
    if (!inString && !inComment && char === '/' && next === '*') {
      inComment = true;
      current += '/*';
      i += 1;
      continue;
    }
    if (inComment && char === '*' && next === '/') {
      inComment = false;
      current += '*/';
      i += 1;
      continue;
    }
    if (inComment) {
      current += char;
      continue;
    }

    // string toggling (ignore escaped quotes)
    if (inString) {
      current += char;
      if (char === inString && prev !== '\\') {
        inString = null;
      }
      continue;
    } else if (char === '"' || char === "'") {
      inString = char;
      current += char;
      continue;
    }

    // nesting
    if (char === '{') depthCurly += 1;
    if (char === '}') depthCurly = Math.max(0, depthCurly - 1);
    if (char === '(') depthParen += 1;
    if (char === ')') depthParen = Math.max(0, depthParen - 1);
    if (char === '[') depthBracket += 1;
    if (char === ']') depthBracket = Math.max(0, depthBracket - 1);

    if (
      char === ';' &&
      depthCurly === 0 &&
      depthParen === 0 &&
      depthBracket === 0
    ) {
      pushCurrent();
      continue;
    }

    current += char;
  }

  pushCurrent();
  return declarations;
};

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

const getGroupsForPreset = (preset: FormatterOptions['sortPreset']) => {
  if (preset === 'category') return categoryPropertyOrder;
  return groupedPropertyOrder;
};

const sortDeclarations = (declarations: string[], preset: FormatterOptions['sortPreset']): string[] => {
  if (!declarations.length) {
    return declarations;
  }

  if (preset === 'none') {
    return declarations;
  }

  if (preset !== 'concentric' && preset !== 'category') {
    return declarations;
  }

  const groups = getGroupsForPreset(preset);

  const prepared = declarations.map((declaration, originalIndex) => {
    const property = extractPropertyName(declaration);
    const resolved = resolvePropertyOrder(property, groups);

    return {
      declaration,
      originalIndex,
      groupIndex: resolved?.groupIndex ?? groups.length,
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

// Split top-level blocks while respecting strings/comments to avoid breaking nested rules.
const splitBlocks = (css: string): string[] => {
  const blocks: string[] = [];
  let current = '';
  let depth = 0;
  let inString: '"' | "'" | null = null;
  let inComment = false;

  for (let i = 0; i < css.length; i += 1) {
    const char = css[i];
    const next = css[i + 1];
    const prev = css[i - 1];

    // comment start/end
    if (!inString && !inComment && char === '/' && next === '*') {
      inComment = true;
      current += '/*';
      i += 1;
      continue;
    }
    if (inComment && char === '*' && next === '/') {
      inComment = false;
      current += '*/';
      i += 1;
      continue;
    }
    if (inComment) {
      current += char;
      continue;
    }

    // string toggling (ignore escaped quotes)
    if (inString) {
      current += char;
      if (char === inString && prev !== '\\') {
        inString = null;
      }
      continue;
    } else if (char === '"' || char === "'") {
      inString = char;
      current += char;
      continue;
    }

    if (char === '{') depth += 1;
    if (char === '}') depth = Math.max(0, depth - 1);

    current += char;

    if (depth === 0 && char === '}') {
      const trimmed = current.slice(0, -1).trim(); // drop the closing brace
      if (trimmed) blocks.push(trimmed);
      current = '';
    }
  }

  const trailing = current.trim();
  if (trailing) blocks.push(trailing);
  return blocks;
};

const formatBlocks = (css: string, options: FormatterOptions): string => {
  const collapseSpacing = options.outputMode === 'minify' ? true : options.collapseWhitespace;
  const tightenBraces = options.outputMode === 'minify' ? true : options.tightenSymbols;
  const blockJoiner = options.outputMode === 'minify' ? '' : '\n';

  const blocks = splitBlocks(css);

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
