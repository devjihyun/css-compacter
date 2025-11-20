import React from "react";
import styled from "styled-components";
import { CssOutputProps } from "../types";
import { panelContainerStyles, codeAreaStyles } from "./panelStyles";

const CssOutput: React.FC<CssOutputProps> = ({
  value,
  onSwap,
  onCopy,
  onDownload,
  onManualFormat,
  autoPreview,
}) => {
  return (
    <Container>
      <PanelHeader>
        <TitleGroup>
          <PanelIcon aria-hidden>📦</PanelIcon>
          <Title>출력 CSS</Title>
        </TitleGroup>

        <PrimaryActions>
          <TextButton type="button" onClick={onSwap}>
            입력과 교체
          </TextButton>
          <IconButton
            type="button"
            onClick={onCopy}
            title="📋 Copy"
            aria-label="Copy formatted CSS"
          >
            📋
          </IconButton>
          <IconButton
            type="button"
            onClick={onDownload}
            title="💾 Save"
            aria-label="Download formatted CSS"
          >
            💾
          </IconButton>
          {!autoPreview && (
            <RunButton
              type="button"
              onClick={onManualFormat}
              title="수동 실행: ⌘+Enter (Mac) / Ctrl+Enter (Windows)"
            >
              Run (⌘⏎)
            </RunButton>
          )}
        </PrimaryActions>
      </PanelHeader>

      <OutputArea
        readOnly
        value={value}
        placeholder="포맷된 CSS가 여기에 표시됩니다"
      />
    </Container>
  );
};

export default CssOutput;

const Container = styled.section`
  ${panelContainerStyles};
`;

const PanelHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  min-height: 3rem;
`;

const TitleGroup = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  min-height: 1.5rem;
`;

const PanelIcon = styled.span`
  font-size: 1.1rem;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const PrimaryActions = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-wrap: wrap;
`;

const BaseButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.4rem ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: background ${({ theme }) => theme.transitions.base},
    color ${({ theme }) => theme.transitions.base};

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }
`;

const IconButton = styled(BaseButton)`
  width: 2rem;
  height: 1.8rem;
  padding: 0;
  font-size: 0.85rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.button};
  color: ${({ theme }) => theme.colors.text};

  &:hover {
    background: ${({ theme }) => theme.colors.buttonHover};
  }
`;

const SecondaryActions = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const TextButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  color: ${({ theme }) => theme.colors.hint};
  font-size: 0.78rem;
  cursor: pointer;
  transition: color ${({ theme }) => theme.transitions.base};

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }
`;

const OutputArea = styled.textarea`
  ${codeAreaStyles};
`;

const RunButton = styled(BaseButton)`
  border: none;
  padding: 0.4rem 1rem;
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => (theme.mode === "dark" ? "#050b16" : "#0b1220")};
  font-size: 0.78rem;

  &:hover {
    filter: brightness(1.05);
  }
`;
