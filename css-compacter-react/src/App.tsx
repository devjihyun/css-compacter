import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ControlsState } from "./types";
import { formatCss } from "./utils/cssFormatter";
import { sampleCss } from "./utils/sampleCss";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Switch } from "./components/ui/switch";
import { Label } from "./components/ui/label";
import { Textarea } from "./components/ui/textarea";
import { Input } from "./components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "./components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./components/ui/tooltip";

type ThemeMode = "light" | "dark";

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

const App: React.FC = () => {
  const [inputCss, setInputCss] = useState<string>("");
  const [outputCss, setOutputCss] = useState<string>("");
  const [controls, setControls] = useState<ControlsState>(() =>
    createDefaultControls()
  );
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "light";
    const stored = window.localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia?.("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    const next = themeMode === "dark" ? "dark" : "light";
    root.classList.remove("light", "dark");
    root.classList.add(next);
    window.localStorage.setItem("theme", next);
  }, [themeMode]);

  const handleThemeToggle = () => {
    setThemeMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleControlChange = (changes: Partial<ControlsState>) => {
    setControls((prev) => ({ ...prev, ...changes }));
  };

  const handleCssChange = (value: string) => {
    setInputCss(value);
    if (controls.autoPreview) {
      setOutputCss(formatCss(value, controls));
    }
  };

  const handleManualFormat = useCallback(() => {
    const formatted = formatCss(inputCss, controls);
    setOutputCss(formatted);
  }, [controls, inputCss]);

  useEffect(() => {
    if (!controls.autoPreview) return;
    setOutputCss(formatCss(inputCss, controls));
  }, [controls, inputCss]);

  const handleClear = () => {
    setInputCss("");
    setOutputCss("");
    setControls(createDefaultControls());
  };

  const handleSwap = () => {
    setInputCss(outputCss);
    const nextOutput = controls.autoPreview
      ? formatCss(outputCss, controls)
      : inputCss;
    setOutputCss(nextOutput);
  };

  const resolveLatestCss = (): string => {
    if (controls.autoPreview) return outputCss;
    const formatted = formatCss(inputCss, controls);
    setOutputCss(formatted);
    return formatted;
  };

  const handleCopyOutput = () => {
    const cssToCopy = resolveLatestCss();
    if (!cssToCopy) return;
    navigator.clipboard?.writeText(cssToCopy);
  };

  const handleDownload = () => {
    const cssToDownload = resolveLatestCss();
    if (!cssToDownload) return;
    const blob = new Blob([cssToDownload], { type: "text/css;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "styles.compact.css";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const [file] = Array.from(event.target.files ?? []);
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        handleCssChange(reader.result);
      }
    };
    reader.readAsText(file, "utf-8");
    event.target.value = "";
  };

  const handleLoadSample = () => {
    handleCssChange(sampleCss);
  };

  const handleOutputModeChange = (mode: string) => {
    const nextMode = mode as ControlsState["outputMode"];
    handleControlChange({ outputMode: nextMode });
  };

  const handleUnitBaseChange = (value: string) => {
    const numericValue = Number.parseFloat(value) || 0;
    const baseKey: keyof ControlsState =
      controls.unitMode === "rem2px" ? "remBase" : "pxBase";
    handleControlChange({
      [baseKey]: Math.max(numericValue, 1),
    } as Partial<ControlsState>);
  };

  const outputModeLabel = useMemo(() => {
    if (controls.outputMode === "single-line") return "Single-Line";
    if (controls.outputMode === "minify") return "Minify";
    return "Multi-Line";
  }, [controls.outputMode]);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background text-foreground">
        <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
          <div className="container mx-auto flex items-center justify-between px-4 py-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                CSS Compacter
              </p>
              <h1 className="text-xl font-semibold leading-tight">
                포맷 · 압축 · 변환
              </h1>
              <p className="text-sm text-muted-foreground">
                Multi-Line / Single-Line / Minify 출력을 한 곳에서.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Label className="text-sm text-muted-foreground">테마</Label>
              <Button variant="outline" size="sm" onClick={handleThemeToggle}>
                {themeMode === "dark" ? "🌙 Dark" : "☀️ Light"}
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6 space-y-6">
          <div className="grid gap-6 lg:grid-cols-[360px_1fr] xl:grid-cols-[380px_1fr]">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  변환 옵션
                  <div className="flex items-center gap-2">
                    <Label className="text-xs text-muted-foreground">
                      실시간 변환
                    </Label>
                    <Switch
                      checked={controls.autoPreview}
                      onCheckedChange={(checked) =>
                        handleControlChange({ autoPreview: checked })
                      }
                      aria-label="실시간 변환"
                    />
                  </div>
                </CardTitle>
                <CardDescription>
                  전처리, 출력 형태, 단위 변환, 정렬 옵션을 한번에 관리하세요.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold">전처리</p>
                      <p className="text-xs text-muted-foreground">
                        주석/공백/기호/세미콜론 다듬기
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3 rounded-lg border bg-muted/40 p-3">
                    {[
                      {
                        key: "removeComments",
                        label: "주석 제거",
                        hint: "/* ... */ 를 삭제합니다.",
                        checked: controls.removeComments,
                      },
                      {
                        key: "collapseWhitespace",
                        label: "공백 축소",
                        hint: "스페이스·개행을 한 칸으로 정리",
                        checked: controls.collapseWhitespace,
                      },
                      {
                        key: "tightenSymbols",
                        label: "기호 붙여쓰기",
                        hint: "{ } : ; , 주변 공백 제거",
                        checked: controls.tightenSymbols,
                      },
                      {
                        key: "trimSemicolon",
                        label: "마지막 세미콜론 제거",
                        hint: "블록 끝 ;} 에서 ; 제거",
                        checked: controls.trimSemicolon,
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between gap-3"
                      >
                        <div>
                          <p className="text-sm font-medium">{item.label}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.hint}
                          </p>
                        </div>
                        <Switch
                          checked={item.checked}
                          onCheckedChange={(checked) =>
                            handleControlChange({
                              [item.key]: checked,
                            } as Partial<ControlsState>)
                          }
                          aria-label={item.label}
                        />
                      </div>
                    ))}
                  </div>
                </section>

                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold">출력 형태</p>
                      <p className="text-xs text-muted-foreground">
                        Multi-Line / Single-Line / Minify
                      </p>
                    </div>
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                      {outputModeLabel}
                    </span>
                  </div>
                  <Tabs
                    value={controls.outputMode}
                    onValueChange={handleOutputModeChange}
                  >
                    <TabsList className="grid grid-cols-3">
                      <TabsTrigger value="multi-line">Multi-Line</TabsTrigger>
                      <TabsTrigger value="single-line">Single-Line</TabsTrigger>
                      <TabsTrigger value="minify">Minify</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </section>

                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold">단위 변환</p>
                      <p className="text-xs text-muted-foreground">
                        px ↔ rem (단일 선택)
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-2">
                        <Label className="text-xs text-muted-foreground">
                          변환
                        </Label>
                        <Select
                          value={controls.unitMode}
                          onValueChange={(value) =>
                            handleControlChange({
                              unitMode: value as ControlsState["unitMode"],
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="변환 안 함" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="">변환 안 함</SelectItem>
                              <SelectItem value="px2rem">px → rem</SelectItem>
                              <SelectItem value="rem2px">rem → px</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label className="text-xs text-muted-foreground">
                          기준 값
                        </Label>
                        <Input
                          type="number"
                          min={1}
                          value={
                            controls.unitMode === "rem2px"
                              ? controls.remBase
                              : controls.pxBase
                          }
                          onChange={(e) => handleUnitBaseChange(e.target.value)}
                          disabled={controls.unitMode === ""}
                          className="h-10"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                <section className="space-y-3">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">속성 정렬</p>
                    <p className="text-xs text-muted-foreground">
                      없음 / Concentric
                    </p>
                  </div>
                  <Select
                    value={
                      controls.sortProperties ? controls.sortPreset : "none"
                    }
                    onValueChange={(value) =>
                      handleControlChange({
                        sortPreset: value as ControlsState["sortPreset"],
                        sortProperties: value !== "none",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="정렬 안 함" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">정렬 안 함</SelectItem>
                      <SelectItem value="concentric">Concentric</SelectItem>
                    </SelectContent>
                  </Select>
                </section>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between">
                    입력 CSS
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleLoadSample}
                      >
                        샘플 불러오기
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        CSS 열기
                      </Button>
                      <Button
                        variant="secondaryStrong"
                        size="sm"
                        onClick={handleClear}
                      >
                        초기화
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".css"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </div>
                  </CardTitle>
                  <CardDescription>
                    편집 후 옵션을 조정해 즉시 결과를 확인하세요.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Textarea
                    value={inputCss}
                    onChange={(e) => handleCssChange(e.target.value)}
                    placeholder="여기에 CSS를 붙여넣으세요."
                    className="min-h-[320px]"
                  />
                  {!controls.autoPreview && (
                    <div className="flex justify-end">
                      <Button onClick={handleManualFormat} variant="default">
                        변환 실행
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between">
                    출력 CSS
                    <div className="flex flex-wrap items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleSwap}
                          >
                            입력과 교체
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>입력/출력 스왑</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleCopyOutput}
                          >
                            복사
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>클립보드 복사</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleDownload}
                          >
                            다운로드
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>.compact.css 저장</TooltipContent>
                      </Tooltip>
                      {!controls.autoPreview && (
                        <Button size="sm" onClick={handleManualFormat}>
                          수동 변환
                        </Button>
                      )}
                    </div>
                  </CardTitle>
                  <CardDescription>
                    현재 설정에 맞춰 변환된 결과입니다.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Textarea
                    value={outputCss}
                    readOnly
                    placeholder="포맷된 CSS가 여기에 표시됩니다."
                    className="min-h-[320px]"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
};

export default App;
