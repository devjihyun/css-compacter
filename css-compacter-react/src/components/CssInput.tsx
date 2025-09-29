import React from 'react';
import { CssInputProps } from '../types';

const CssInput: React.FC<CssInputProps> = ({ value, onChange }) => {
  return (
    <section className="card-surface flex h-full flex-col gap-4">
      <div className="flex items-center gap-3 text-sm text-night-muted">
        <strong className="text-night-text">입력 CSS</strong>
        <span className="ml-auto text-xs text-night-hint">붙여넣기 또는 파일 열기</span>
      </div>
      <textarea
        id="input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="/* 여기에 CSS를 붙여넣으세요 */"
        className="min-h-[320px] w-full resize-y rounded-xl border border-night-border bg-night-panel px-4 py-3 font-mono text-xs text-night-text placeholder:text-night-hint focus:border-night-accent focus:outline-none focus:ring-2 focus:ring-night-accent/40"
      />
    </section>
  );
};

export default CssInput;
