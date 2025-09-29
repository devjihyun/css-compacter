export type UnitConversionMode = '' | 'px2rem' | 'rem2px';

export interface FormatterOptions {
  removeComments: boolean;
  collapseWhitespace: boolean;
  tightenSymbols: boolean;
  trimSemicolon: boolean;
  sortProperties: boolean;
  sortPreset: 'none' | 'concentric' | 'alphabetical';
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
}

export interface CssOutputProps {
  value: string;
  onSwap: () => void;
}

export interface ControlsProps {
  state: ControlsState;
  onStateChange: (changes: Partial<ControlsState>) => void;
  onManualFormat: () => void;
}
