import React, { ChangeEvent } from "react";
import { CssInputProps } from "../types";

const buttonClass =
  "inline-flex items-center justify-center rounded-xl border border-night-border bg-white px-3 py-1.5 text-xs font-medium text-night-panel transition duration-150 hover:bg-white/90";

const CssInput: React.FC<CssInputProps> = ({
  value,
  onChange,
  onFileImport,
}) => {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const [file] = Array.from(event.target.files ?? []);
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onFileImport(reader.result);
      }
    };
    reader.readAsText(file, "utf-8");
    event.target.value = "";
  };

  return (
    <section className="card-surface flex h-full flex-col gap-4">
      <div className="flex items-center gap-3 text-sm text-night-muted">
        <strong className="text-night-text">입력 CSS ⬅️</strong>
        <span className="ml-auto text-xs text-night-hint">
          붙여넣기 또는 파일 열기
        </span>
        <label className={`${buttonClass} cursor-pointer`}>
          <input
            type="file"
            accept=".css"
            className="hidden"
            onChange={handleFileChange}
          />
          CSS 열기
        </label>
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
