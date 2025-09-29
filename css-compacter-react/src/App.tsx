import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Controls from './components/Controls';
import CssInput from './components/CssInput';
import CssOutput from './components/CssOutput';
import Footer from './components/Footer';
import { ControlsState } from './types';
import { formatCss } from './utils/cssFormatter';

const createDefaultControls = (): ControlsState => ({
  autoPreview: true,
  removeComments: true,
  collapseWhitespace: true,
  tightenSymbols: true,
  trimSemicolon: true,
  sortProperties: false,
  sortPreset: 'concentric',
  unitMode: '',
  pxBase: 16,
  remBase: 16,
});

const secondaryButtonClass =
  'inline-flex items-center justify-center rounded-xl border border-night-border bg-night-button px-4 py-2 text-sm font-medium text-night-text transition duration-150 hover:bg-night-buttonHover';

type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [inputCss, setInputCss] = useState<string>('');
  const [outputCss, setOutputCss] = useState<string>('');
  const [controls, setControls] = useState<ControlsState>(() => createDefaultControls());
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') {
      return 'dark';
    }

    const stored = window.localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') {
      if (typeof document !== 'undefined') {
        document.documentElement.dataset.theme = stored;
      }
      return stored;
    }

    const prefersLight = window.matchMedia?.('(prefers-color-scheme: light)').matches;
    const resolved = prefersLight ? 'light' : 'dark';
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.theme = resolved;
    }
    return resolved;
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.theme = theme;
    }
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('theme', theme);
    }
  }, [theme]);

  useEffect(() => {
    if (!controls.autoPreview) {
      return;
    }
    setOutputCss(formatCss(inputCss, controls));
  }, [controls, inputCss]);

  const handleCssChange = (css: string) => {
    setInputCss(css);
    if (controls.autoPreview) {
      setOutputCss(formatCss(css, controls));
    }
  };

  const handleManualFormat = () => {
    const formatted = formatCss(inputCss, controls);
    setOutputCss(formatted);
  };

  const handleClear = () => {
    setInputCss('');
    setOutputCss('');
    setControls(createDefaultControls());
  };

  const handleSwap = () => {
    setInputCss(outputCss);
    if (controls.autoPreview) {
      setOutputCss(formatCss(outputCss, controls));
    } else {
      setOutputCss(inputCss);
    }
  };

  const handleDownload = () => {
    const cssToDownload = controls.autoPreview ? outputCss : formatCss(inputCss, controls);
    if (!cssToDownload) {
      return;
    }

    if (!controls.autoPreview) {
      setOutputCss(cssToDownload);
    }

    const blob = new Blob([cssToDownload], { type: 'text/css;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'styles.compact.css';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleFileImport = (content: string) => {
    setInputCss(content);
    if (controls.autoPreview) {
      setOutputCss(formatCss(content, controls));
    }
  };

  const handleControlChange = (changes: Partial<ControlsState>) => {
    setControls((prev) => ({ ...prev, ...changes }));
  };

  const handleThemeToggle = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="min-h-screen bg-night text-night-text transition-colors duration-300">
      <Header theme={theme} onToggleTheme={handleThemeToggle} />
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-5 py-8">
        <Controls
          state={controls}
          onStateChange={handleControlChange}
          onManualFormat={handleManualFormat}
        />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mt-2.5">
          <CssInput value={inputCss} onChange={handleCssChange} onFileImport={handleFileImport} />
          <CssOutput value={outputCss} onSwap={handleSwap} />
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            className={secondaryButtonClass}
            id="btnClear"
            onClick={handleClear}
          >
            초기화
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl border border-transparent bg-night-accent px-4 py-2 text-sm font-semibold text-slate-950 transition duration-150 hover:brightness-110"
            id="btnDownload"
            onClick={handleDownload}
          >
            .compact.css 저장
          </button>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default App;
