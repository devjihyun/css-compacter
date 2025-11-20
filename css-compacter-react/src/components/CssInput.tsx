import React, { ChangeEvent, useRef } from "react";
import styled from "styled-components";
import { CssInputProps } from "../types";
import { panelContainerStyles, codeAreaStyles } from "./panelStyles";

const CssInput: React.FC<CssInputProps> = ({
  value,
  onChange,
  onFileImport,
  onLoadSample,
  onClear,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  const triggerFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <Container>
      <PanelHeader>
        <TitleGroup>
          <PanelIcon aria-hidden>📝</PanelIcon>
          <Title>입력 CSS</Title>
        </TitleGroup>
        <HeaderActions>
          <HiddenFileInput
            ref={fileInputRef}
            type="file"
            accept=".css"
            onChange={handleFileChange}
          />
          <SecondaryButton type="button" onClick={onLoadSample}>
            샘플 불러오기
          </SecondaryButton>
          <SecondaryButton type="button" onClick={triggerFileDialog}>
            CSS 열기
          </SecondaryButton>
          <SecondaryButton type="button" onClick={onClear}>
            초기화
          </SecondaryButton>
        </HeaderActions>
      </PanelHeader>
      <Editor
        id="input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="/* 여기에 CSS를 붙여넣으세요 */"
      />
    </Container>
  );
};

export default CssInput;

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

const Title = styled.strong`
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.95rem;
  font-weight: 600;
`;

const HeaderActions = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-left: auto;
  font-size: 0.8rem;
`;

const HintText = styled.span`
  color: ${({ theme }) => theme.colors.hint};
`;

const SecondaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.35rem ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.md};
  border: none;
  background: ${({ theme }) => theme.colors.button};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: background ${({ theme }) => theme.transitions.base};

  &:hover {
    background: ${({ theme }) => theme.colors.buttonHover};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const Editor = styled.textarea`
  ${codeAreaStyles};
`;
