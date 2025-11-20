import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import Header from "./components/Header";
import Controls from "./components/Controls";
import CssInput from "./components/CssInput";
import CssOutput from "./components/CssOutput";
import Footer from "./components/Footer";
import { ControlsState } from "./types";
import { formatCss } from "./utils/cssFormatter";
import { sampleCss } from "./utils/sampleCss";
import { GlobalStyle } from "./styles/globalStyles";
import { darkTheme, lightTheme } from "./styles/theme";

const createDefaultControls = (): ControlsState => ({
  autoPreview: true,
  removeComments: true,
  collapseWhitespace: true,
  tightenSymbols: true,
  trimSemicolon: true,
  outputMode: "multi-line",
  sortProperties: false,
  sortPreset: "concentric",
  unitMode: "",
  pxBase: 16,
  remBase: 16,
});

type ThemeMode = "light" | "dark";

const fallbackCopyToClipboard = (text: string) => {
  if (typeof document === "undefined") {
    return;
  }
  const temp = document.createElement("textarea");
  temp.value = text;
  temp.style.position = "fixed";
  temp.style.opacity = "0";
  document.body.appendChild(temp);
  temp.select();
  document.execCommand("copy");
  temp.remove();
};

const App: React.FC = () => {
  const [inputCss, setInputCss] = useState<string>("");
  const [outputCss, setOutputCss] = useState<string>("");
  const [controls, setControls] = useState<ControlsState>(() =>
    createDefaultControls()
  );
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") {
      return "dark";
    }

    const stored = window.localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") {
      return stored;
    }

    const prefersLight = window.matchMedia?.(
      "(prefers-color-scheme: light)"
    ).matches;
    return prefersLight ? "light" : "dark";
  });

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.dataset.theme = themeMode;
    }
    if (typeof window !== "undefined") {
      window.localStorage.setItem("theme", themeMode);
    }
  }, [themeMode]);

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

  const handleManualFormat = useCallback(() => {
    const formatted = formatCss(inputCss, controls);
    setOutputCss(formatted);
  }, [controls, inputCss]);

  const handleClear = () => {
    setInputCss("");
    setOutputCss("");
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

  const resolveLatestCss = (): string => {
    if (controls.autoPreview) {
      return outputCss;
    }
    const formatted = formatCss(inputCss, controls);
    setOutputCss(formatted);
    return formatted;
  };

  const handleCopyOutput = () => {
    const cssToCopy = resolveLatestCss();
    if (!cssToCopy) {
      return;
    }

    if (typeof navigator !== "undefined" && navigator?.clipboard) {
      navigator.clipboard
        .writeText(cssToCopy)
        .catch(() => fallbackCopyToClipboard(cssToCopy));
    } else {
      fallbackCopyToClipboard(cssToCopy);
    }
  };

  const handleDownload = () => {
    const cssToDownload = resolveLatestCss();
    if (!cssToDownload) {
      return;
    }

    const blob = new Blob([cssToDownload], { type: "text/css;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "styles.compact.css";
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

  const handleLoadSample = () => {
    setInputCss(sampleCss);
    if (controls.autoPreview) {
      setOutputCss(formatCss(sampleCss, controls));
    } else {
      setOutputCss("");
    }
  };

  const handleControlChange = (changes: Partial<ControlsState>) => {
    setControls((prev) => ({ ...prev, ...changes }));
  };

  const handleThemeToggle = () => {
    setThemeMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const theme = useMemo(
    () => (themeMode === "dark" ? darkTheme : lightTheme),
    [themeMode]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isRunShortcut =
        (event.metaKey || event.ctrlKey) && event.key === "Enter";
      if (!isRunShortcut || controls.autoPreview) {
        return;
      }
      event.preventDefault();
      handleManualFormat();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [controls.autoPreview, handleManualFormat]);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AppShell>
        <Header theme={themeMode} onToggleTheme={handleThemeToggle} />
        <Main>
          <Layout>
            <Sidebar>
              <Controls state={controls} onStateChange={handleControlChange} />
            </Sidebar>
            <EditorsArea>
              <EditorsGrid>
                <CssInput
                  value={inputCss}
                  onChange={handleCssChange}
                  onFileImport={handleFileImport}
                  onLoadSample={handleLoadSample}
                  onClear={handleClear}
                />
                <CssOutput
                  value={outputCss}
                  onSwap={handleSwap}
                  onCopy={handleCopyOutput}
                  onDownload={handleDownload}
                  onManualFormat={handleManualFormat}
                  autoPreview={controls.autoPreview}
                />
              </EditorsGrid>
            </EditorsArea>
          </Layout>
        </Main>
        <Footer />
      </AppShell>
    </ThemeProvider>
  );
};

export default App;

const AppShell = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  transition: background ${({ theme }) => theme.transitions.base},
    color ${({ theme }) => theme.transitions.base};
`;

const Main = styled.main`
  flex: 1;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
  padding-top: calc(${({ theme }) => theme.spacing.xl} + 2rem);
`;

const Layout = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));

  @media (min-width: 1024px) {
    grid-template-columns: 320px 1fr;
    align-items: start;
  }
`;

const Sidebar = styled.aside`
  position: sticky;
  top: 6.5rem;
  align-self: start;
`;

const EditorsArea = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const EditorsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: stretch;
  grid-auto-rows: minmax(0, 1fr);

  @media (min-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;
