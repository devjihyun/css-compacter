export type UnitConversionMode = '' | 'px2rem' | 'rem2px';

export interface FormatterOptions {
  removeComments: boolean;
  collapseWhitespace: boolean;
  tightenSymbols: boolean;
  trimSemicolon: boolean;
  sortProperties: boolean;
  sortPreset: 'concentric' | 'alphabetical';
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
}

export interface CssOutputProps {
  value: string;
}

export interface ControlsProps {
  state: ControlsState;
  onStateChange: (changes: Partial<ControlsState>) => void;
  onClear: () => void;
  onSwap: () => void;
  onManualFormat: () => void;
  onDownload: () => void;
  onFileImport: (content: string) => void;
}
