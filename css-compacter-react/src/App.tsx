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

const App: React.FC = () => {
  const [inputCss, setInputCss] = useState<string>('');
  const [outputCss, setOutputCss] = useState<string>('');
  const [controls, setControls] = useState<ControlsState>(() => createDefaultControls());

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

  return (
    <div className="min-h-screen bg-night">
      <Header />
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-5 py-8">
        <Controls
          state={controls}
          onStateChange={handleControlChange}
          onClear={handleClear}
          onSwap={handleSwap}
          onManualFormat={handleManualFormat}
          onDownload={handleDownload}
          onFileImport={handleFileImport}
        />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <CssInput value={inputCss} onChange={handleCssChange} />
          <CssOutput value={outputCss} />
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default App;
