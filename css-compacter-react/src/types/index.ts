export type UnitConversionMode = '' | 'px2rem' | 'rem2px';

export interface FormatterOptions {
  removeComments: boolean;
  collapseWhitespace: boolean;
  tightenSymbols: boolean;
  trimSemicolon: boolean;
  outputMode: 'multi-line' | 'single-line' | 'minify';
  sortProperties: boolean;
  sortPreset: 'none' | 'concentric' | 'category';
  unitMode: UnitConversionMode;
  pxBase: number;
  remBase: number;
}

export interface ControlsState extends FormatterOptions {
  autoPreview: boolean;
}

export interface CssInputProps {
  value: string;
  onChange: (value: string) => void;
  onFileImport: (content: string) => void;
  onLoadSample: () => void;
  onClear: () => void;
}

export interface CssOutputProps {
  value: string;
  onSwap: () => void;
  onCopy: () => void;
  onDownload: () => void;
  onManualFormat: () => void;
  autoPreview: boolean;
}

export interface ControlsProps {
  state: ControlsState;
  onStateChange: (changes: Partial<ControlsState>) => void;
}
