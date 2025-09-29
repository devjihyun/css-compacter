import React from "react";
import { CssOutputProps } from "../types";

const buttonClass =
  "inline-flex items-center justify-center rounded-xl border border-night-border bg-white px-3 py-1.5 text-xs font-medium text-night-panel transition duration-150 hover:bg-white/90";

const CssOutput: React.FC<CssOutputProps> = ({ value, onSwap }) => {
  return (
    <section className="card-surface flex h-full flex-col gap-4">
      <div className="flex items-center gap-3 text-sm text-night-muted">
        <h2 className="text-base font-semibold text-night-text">출력 CSS ➡️</h2>
        <span className="ml-auto text-xs text-night-hint">
          변환 결과가 여기에 표시됩니다
        </span>
      </div>
      <textarea
        readOnly
        value={value}
        placeholder="포맷된 CSS가 여기에 표시됩니다"
        rows={10}
        className="min-h-[320px] w-full flex-1 resize-y rounded-xl border border-night-border bg-night-panel px-4 py-3 font-mono text-xs text-night-text placeholder:text-night-hint focus:outline-none"
      />
      <div className="mt-auto flex justify-end">
        <button type="button" className={buttonClass} onClick={onSwap}>
          입↔출 교체
        </button>
      </div>
    </section>
  );
};

export default CssOutput;
