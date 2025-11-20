import React from "react";
import styled from "styled-components";

interface HeaderProps {
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme }) => {
  const isDark = theme === "dark";
  return (
    <HeaderBar>
      <HeaderInner>
        <TitleColumn>
          <Title>
            CSS Per‑Rule One‑Line Formatter
            <StatusBadge>offline</StatusBadge>
          </Title>
          <Description>
            셀렉터 <InlineCode>{"{ ... }"}</InlineCode> 블록을{" "}
            <strong>한 줄</strong>씩 정리 +<strong> 단위 변환(px↔rem)</strong> +{" "}
            <strong>속성 우선순위 정렬</strong>.
          </Description>
        </TitleColumn>
        <ThemeSwitch>
          <ThemeSegment role="group" aria-label="테마 선택">
            <SegmentButton
              type="button"
              $active={!isDark}
              aria-pressed={!isDark}
              onClick={() => {
                if (isDark) onToggleTheme();
              }}
            >
              Light
            </SegmentButton>
            <SegmentButton
              type="button"
              $active={isDark}
              aria-pressed={isDark}
              onClick={() => {
                if (!isDark) onToggleTheme();
              }}
            >
              Dark
            </SegmentButton>
          </ThemeSegment>
        </ThemeSwitch>
      </HeaderInner>
    </HeaderBar>
  );
};

export default Header;

const HeaderBar = styled.header`
  position: sticky;
  top: 0;
  z-index: 20;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderSubtle};
  background: ${({ theme }) => theme.colors.backgroundOverlay};
  backdrop-filter: blur(18px) saturate(150%);
  transition: background ${({ theme }) => theme.transitions.base},
    border-color ${({ theme }) => theme.transitions.base};
`;

const HeaderInner = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: 1440px;
  padding: ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
  }
`;

const TitleColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text};
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  border-radius: ${({ theme }) => theme.radii.pill};
  border: 1px solid ${({ theme }) => theme.colors.badgeBorder};
  background: ${({ theme }) => theme.colors.badgeBg};
  color: ${({ theme }) => theme.colors.badgeText};
  padding: 0.15rem ${({ theme }) => theme.spacing.sm};
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const Description = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.muted};
  max-width: 48rem;
`;

const InlineCode = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
`;

const ThemeSwitch = styled.div`
  align-self: flex-start;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ThemeLabel = styled.span`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.hint};
`;

const ThemeSegment = styled.div`
  display: inline-flex;
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.panelInset};
  padding: 0.25rem;
  gap: 0.25rem;
`;

interface SegmentProps {
  $active: boolean;
}

const SegmentButton = styled.button<SegmentProps>`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.35rem 0.75rem;
  border-radius: ${({ theme }) => theme.radii.md};
  border: none;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.accent : "transparent"};
  color: ${({ $active, theme }) =>
    $active
      ? theme.mode === "dark"
        ? "#050b16"
        : "#0b1220"
      : theme.colors.text};
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 200ms ease, color 200ms ease;

  &:hover {
    background: ${({ $active, theme }) =>
      $active ? theme.colors.accentHover : theme.colors.button};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }
`;
