import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="mt-6 flex flex-col gap-1 text-xs text-night-muted">
      <p>
        &copy; {new Date().getFullYear()} CSS Per‑Rule One‑Line Formatter. All
        rights reserved.
      </p>
      <p>
        자세한 정보는{" "}
        <a
          href="https://github.com/devjihyun/css-compacter"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-night-accent/70 underline-offset-4"
        >
          GitHub 저장소
        </a>
        에서 확인하세요.
      </p>
    </footer>
  );
};

export default Footer;
