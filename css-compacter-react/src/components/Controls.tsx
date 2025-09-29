import React, { ChangeEvent } from "react";
import { ControlsProps, ControlsState } from "../types";

const toggleClasses =
  "h-4 w-4 rounded border-night-border bg-night-panel text-night-accent focus:ring-2 focus:ring-night-accent/60 focus:ring-offset-0";
const buttonBase =
  "inline-flex items-center justify-center rounded-xl border border-night-border px-4 py-2 text-sm font-medium text-night-text transition duration-150 hover:bg-night-buttonHover";
const optionGroupClass =
  "flex flex-col gap-2 rounded-xl border border-night-border bg-night-panel px-4 py-3 text-night-text";
const sectionTitleClass = "w-full text-night-text text-base font-semibold";

const Controls: React.FC<ControlsProps> = ({
  state,
  onStateChange,
  onManualFormat,
}) => {
  const handleBooleanChange =
    (key: keyof ControlsState) => (event: ChangeEvent<HTMLInputElement>) => {
      const { checked } = event.target;
      onStateChange({ [key]: checked });
    };

  const handleUnitModeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onStateChange({
      unitMode: event.target.value as ControlsState["unitMode"],
    });
  };

  const handleSortPresetChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onStateChange({
      sortPreset: event.target.value as ControlsState["sortPreset"],
      sortProperties: event.target.value !== "none",
    });
  };

  const handleUnitBaseChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const numericValue = Number.parseFloat(value) || 0;
    const baseKey: keyof ControlsState = state.unitMode === "rem2px" ? "remBase" : "pxBase";
    onStateChange({ [baseKey]: Math.max(numericValue, 1) });
  };

  const {
    autoPreview,
    removeComments,
    collapseWhitespace,
    tightenSymbols,
    trimSemicolon,
    sortProperties,
    sortPreset,
    unitMode,
    pxBase,
    remBase,
  } = state;

  return (
    <section className="card-surface space-y-4" aria-label="변환 옵션">
      <div className="grid gap-4 text-sm text-night-muted lg:grid-cols-3">
        <div className="space-y-3">
          <h2 className={sectionTitleClass}>일반 설정</h2>
          <div className={optionGroupClass}>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                id="autoPreview"
                checked={autoPreview}
                onChange={handleBooleanChange("autoPreview")}
                className={toggleClasses}
              />
              실시간 변환
            </label>
            <label
              className="flex items-center gap-2"
              title="주석 /* ... */ 제거"
            >
              <input
                type="checkbox"
                id="optComments"
                checked={removeComments}
                onChange={handleBooleanChange("removeComments")}
                className={toggleClasses}
              />
              주석 제거
            </label>
            <label
              className="flex items-center gap-2"
              title="여러 공백/개행을 하나로 축소"
            >
              <input
                type="checkbox"
                id="optWhitespace"
                checked={collapseWhitespace}
                onChange={handleBooleanChange("collapseWhitespace")}
                className={toggleClasses}
              />
              공백 축소
            </label>
            <label
              className="flex items-center gap-2"
              title="기호 주변 공백 제거: { } : ; , 등"
            >
              <input
                type="checkbox"
                id="optTightSymbols"
                checked={tightenSymbols}
                onChange={handleBooleanChange("tightenSymbols")}
                className={toggleClasses}
              />
              기호 공백 제거
            </label>
            <label
              className="flex items-center gap-2"
              title="블록 끝 ;} 중 ; 제거"
            >
              <input
                type="checkbox"
                id="optTrimSemicolon"
                checked={trimSemicolon}
                onChange={handleBooleanChange("trimSemicolon")}
                className={toggleClasses}
              />
              마지막 세미콜론 제거
            </label>
            {!autoPreview && (
              <button
                type="button"
                onClick={onManualFormat}
                className={`${buttonBase} bg-night-button text-night-text`}
              >
                변환 실행
              </button>
            )}
          </div>
        </div>
        <div className="space-y-3">
          <h2 className={sectionTitleClass}>단위 변환</h2>
          <div className={optionGroupClass} title="단위 변환 (배타)">
            <label className="flex items-center gap-3 text-sm">
              <span className="w-16 text-night-muted">변환</span>
              <select
                id="unitMode"
                value={unitMode}
                onChange={handleUnitModeChange}
                className="h-9 flex-1 rounded-lg border border-night-border bg-night-panel px-3 text-night-text focus:border-night-accent focus:outline-none focus:ring-2 focus:ring-night-accent/40"
              >
                <option value="">변환 안 함</option>
                <option value="px2rem">px → rem</option>
                <option value="rem2px">rem → px</option>
              </select>
            </label>
            <label className="flex items-center gap-3 text-sm">
              <span className="w-16 text-night-muted">기준 값</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="unitBase"
                  value={unitMode === "rem2px" ? remBase : pxBase}
                  min="1"
                  onChange={handleUnitBaseChange}
                  className="h-9 w-20 rounded-lg border border-night-border bg-night-panel px-2 text-center text-night-text focus:border-night-accent focus:outline-none focus:ring-2 focus:ring-night-accent/40"
                  disabled={unitMode === ""}
                />
                <span className="text-night-hint">px</span>
              </div>
            </label>
          </div>
        </div>
        <div className="space-y-3">
          <h2 className={sectionTitleClass}>속성 정렬</h2>
          <div className={optionGroupClass} title="CSS 속성 정렬">
            <label className="flex items-center gap-3 text-sm">
              <span className="w-20 text-night-muted">정렬 기준</span>
              <select
                id="sortPreset"
                value={sortProperties ? sortPreset : "none"}
                onChange={handleSortPresetChange}
                className="h-9 flex-1 rounded-lg border border-night-border bg-night-panel px-3 text-night-text focus:border-night-accent focus:outline-none focus:ring-2 focus:ring-night-accent/40"
              >
                <option value="none">정렬 안 함</option>
                <option value="concentric">Concentric-like (추천)</option>
                <option value="alphabetical">알파벳 순</option>
              </select>
            </label>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Controls;
