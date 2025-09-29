import React from "react";

interface HeaderProps {
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

const toggleButtonClass =
  "inline-flex items-center gap-2 rounded-xl border border-night-border bg-night-button px-3 py-2 text-sm font-medium text-night-text transition duration-150 hover:bg-night-buttonHover";

const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme }) => {
  const isDark = theme === "dark";
  const toggleLabel = isDark ? "라이트 모드" : "다크 모드";
  const toggleIcon = isDark ? "🌞" : "🌙";

  return (
    <header className="sticky top-0 z-20 border-b border-night-border/70 bg-night/95 backdrop-blur-md backdrop-saturate-150 transition-colors duration-300">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-5 py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <h1 className="flex items-center gap-3 text-lg font-semibold text-night-text">
            CSS Per‑Rule One‑Line Formatter
            <span className="rounded-full border border-night-badgeBorder bg-night-badgeBg px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-night-badgeText">
              offline
            </span>
          </h1>
          <button
            type="button"
            className={toggleButtonClass}
            onClick={onToggleTheme}
            aria-pressed={!isDark}
            title="테마 전환"
          >
            <span aria-hidden>{toggleIcon}</span>
            {toggleLabel}
          </button>
        </div>
        <p className="text-sm text-night-muted">
          셀렉터 <span className="font-mono">{"{ ... }"}</span> 블록을{" "}
          <strong>한 줄</strong>씩 정리 +<strong> 단위 변환(px↔rem)</strong> +{" "}
          <strong>속성 우선순위 정렬</strong>.
        </p>
      </div>
    </header>
  );
};

export default Header;
