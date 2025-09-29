import React, { ChangeEvent } from 'react';
import { ControlsProps, ControlsState } from '../types';

const toggleClasses =
  'h-4 w-4 rounded border-night-border bg-night-panel text-night-accent focus:ring-2 focus:ring-night-accent/60 focus:ring-offset-0';
const radioClasses =
  'h-4 w-4 rounded-full border-night-border bg-night-panel text-night-accent focus:ring-2 focus:ring-night-accent/60 focus:ring-offset-0';
const buttonBase =
  'inline-flex items-center justify-center rounded-xl border border-night-border px-4 py-2 text-sm font-medium text-night-text transition duration-150 hover:bg-night-buttonHover';

const Controls: React.FC<ControlsProps> = ({
  state,
  onStateChange,
  onClear,
  onSwap,
  onManualFormat,
  onDownload,
  onFileImport,
}) => {
  const handleBooleanChange = (key: keyof ControlsState) => (event: ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    onStateChange({ [key]: checked });
  };

  const handleUnitModeChange = (event: ChangeEvent<HTMLInputElement>) => {
    onStateChange({ unitMode: event.target.value as ControlsState['unitMode'] });
  };

  const handleNumberChange = (key: keyof ControlsState) => (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const numericValue = Number.parseFloat(value) || 0;
    onStateChange({ [key]: Math.max(numericValue, 1) });
  };

  const handleSortPresetChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onStateChange({ sortPreset: event.target.value as ControlsState['sortPreset'] });
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const [file] = Array.from(event.target.files ?? []);
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onFileImport(reader.result);
      }
    };
    reader.readAsText(file, 'utf-8');
    event.target.value = '';
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
      <div className="flex flex-wrap items-center gap-3 text-sm text-night-muted">
        <label className="flex items-center gap-2 text-night-text">
          <input
            type="checkbox"
            id="autoPreview"
            checked={autoPreview}
            onChange={handleBooleanChange('autoPreview')}
            className={toggleClasses}
          />
          실시간 변환
        </label>
        <label className="flex items-center gap-2" title="주석 /* ... */ 제거">
          <input
            type="checkbox"
            id="optComments"
            checked={removeComments}
            onChange={handleBooleanChange('removeComments')}
            className={toggleClasses}
          />
          주석 제거
        </label>
        <label className="flex items-center gap-2" title="여러 공백/개행을 하나로 축소">
          <input
            type="checkbox"
            id="optWhitespace"
            checked={collapseWhitespace}
            onChange={handleBooleanChange('collapseWhitespace')}
            className={toggleClasses}
          />
          공백 축소
        </label>
        <label className="flex items-center gap-2" title="기호 주변 공백 제거: { } : ; , 등">
          <input
            type="checkbox"
            id="optTightSymbols"
            checked={tightenSymbols}
            onChange={handleBooleanChange('tightenSymbols')}
            className={toggleClasses}
          />
          기호 공백 제거
        </label>
        <label className="flex items-center gap-2" title="블록 끝 ;} 중 ; 제거">
          <input
            type="checkbox"
            id="optTrimSemicolon"
            checked={trimSemicolon}
            onChange={handleBooleanChange('trimSemicolon')}
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

      <div className="flex flex-wrap items-center gap-3 text-sm text-night-muted">
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-night-border bg-night-panel px-3 py-2" title="단위 변환 (배타)">
          <label className="flex items-center gap-2 text-night-text">
            <input
              type="radio"
              name="unitMode"
              id="modeNone"
              value=""
              checked={unitMode === ''}
              onChange={handleUnitModeChange}
              className={radioClasses}
            />
            변환 안 함
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="unitMode"
              id="modePx2Rem"
              value="px2rem"
              checked={unitMode === 'px2rem'}
              onChange={handleUnitModeChange}
              className={radioClasses}
            />
            px → rem
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              id="pxBase"
              value={pxBase}
              min="1"
              onChange={handleNumberChange('pxBase')}
              className="h-9 w-16 rounded-lg border border-night-border bg-night-panel px-2 text-center text-night-text focus:border-night-accent focus:outline-none focus:ring-2 focus:ring-night-accent/40"
            />
            <span className="text-night-hint">px</span>
          </div>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="unitMode"
              id="modeRem2Px"
              value="rem2px"
              checked={unitMode === 'rem2px'}
              onChange={handleUnitModeChange}
              className={radioClasses}
            />
            rem → px
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              id="remBase"
              value={remBase}
              min="1"
              onChange={handleNumberChange('remBase')}
              className="h-9 w-16 rounded-lg border border-night-border bg-night-panel px-2 text-center text-night-text focus:border-night-accent focus:outline-none focus:ring-2 focus:ring-night-accent/40"
            />
            <span className="text-night-hint">px</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-night-border bg-night-panel px-3 py-2" title="CSS 속성 정렬">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              id="optSortProps"
              checked={sortProperties}
              onChange={handleBooleanChange('sortProperties')}
              className={toggleClasses}
            />
            속성 정렬
          </label>
          <select
            id="sortPreset"
            value={sortPreset}
            onChange={handleSortPresetChange}
            className="h-9 rounded-lg border border-night-border bg-night-panel px-3 text-night-text focus:border-night-accent focus:outline-none focus:ring-2 focus:ring-night-accent/40"
          >
            <option value="concentric">Concentric-like (추천)</option>
            <option value="alphabetical">알파벳 순</option>
          </select>
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-3">
          <button
            type="button"
            className={`${buttonBase} bg-transparent`}
            id="btnSwap"
            title="입력과 출력을 교체"
            onClick={onSwap}
          >
            입↔출 교체
          </button>
          <button type="button" className={`${buttonBase} bg-transparent`} id="btnClear" onClick={onClear}>
            초기화
          </button>
          <label className={`${buttonBase} cursor-pointer bg-night-button`}>
            <input type="file" id="fileIn" accept=".css" className="hidden" onChange={handleFileChange} />
            CSS 열기
          </label>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl border border-transparent bg-night-accent px-4 py-2 text-sm font-semibold text-slate-950 transition duration-150 hover:brightness-110"
            id="btnDownload"
            onClick={onDownload}
          >
            .compact.css 저장
          </button>
        </div>
      </div>
    </section>
  );
};

export default Controls;
