import React from "react";

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-20 border-b border-night-border/70 bg-night/95 backdrop-blur-md backdrop-saturate-150">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-5 py-5">
        <h1 className="flex items-center gap-3 text-lg font-semibold text-night-text">
          CSS Per‑Rule One‑Line Formatter
          <span className="rounded-full border border-night-badgeBorder bg-night-badgeBg px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-night-badgeText">
            offline
          </span>
        </h1>
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
