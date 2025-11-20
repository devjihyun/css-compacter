import React, { ChangeEvent } from "react";
import styled from "styled-components";
import { ControlsProps, ControlsState } from "../types";

const Controls: React.FC<ControlsProps> = ({ state, onStateChange }) => {
  const handleBooleanChange =
    (key: keyof ControlsState) => (event: ChangeEvent<HTMLInputElement>) => {
      const { checked } = event.target;
      onStateChange({ [key]: checked });
    };

  const handleUnitModeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onStateChange({
      unitMode: event.target.value as ControlsState["unitMode"],
    });
  };

  const handleSortPresetChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onStateChange({
      sortPreset: event.target.value as ControlsState["sortPreset"],
      sortProperties: event.target.value !== "none",
    });
  };

  const handleUnitBaseChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const numericValue = Number.parseFloat(value) || 0;
    const baseKey: keyof ControlsState =
      state.unitMode === "rem2px" ? "remBase" : "pxBase";
    onStateChange({ [baseKey]: Math.max(numericValue, 1) });
  };

  const handleOutputModeChange = (mode: ControlsState["outputMode"]) => {
    onStateChange({ outputMode: mode });
  };

  const handleModeChange = (isAuto: boolean) => {
    onStateChange({ autoPreview: isAuto });
  };

  const {
    autoPreview,
    removeComments,
    collapseWhitespace,
    tightenSymbols,
    trimSemicolon,
    outputMode,
    sortProperties,
    sortPreset,
    unitMode,
    pxBase,
    remBase,
  } = state;

  return (
    <Container aria-label="변환 옵션">
      <ModeGroup>
        <ModeLabel htmlFor="modeToggle">실시간 변환</ModeLabel>
        <ModeToggle role="group" id="modeToggle" aria-label="실시간 변환 선택">
          <ToggleButton
            type="button"
            aria-pressed={autoPreview}
            $active={autoPreview}
            onClick={() => handleModeChange(true)}
          >
            On
          </ToggleButton>
          <ToggleButton
            type="button"
            aria-pressed={!autoPreview}
            $active={!autoPreview}
            onClick={() => handleModeChange(false)}
          >
            Off
          </ToggleButton>
        </ModeToggle>
      </ModeGroup>
      <SectionGrid>
        <Section>
          <SectionTitle>전처리 옵션</SectionTitle>
          <OptionGroup>
            <OptionLabel title="주석 /* ... */ 제거">
              <Checkbox
                type="checkbox"
                id="optComments"
                checked={removeComments}
                onChange={handleBooleanChange("removeComments")}
              />
              주석 제거
            </OptionLabel>
            <OptionLabel title="여러 공백/개행을 하나로 축소">
              <Checkbox
                type="checkbox"
                id="optWhitespace"
                checked={collapseWhitespace}
                onChange={handleBooleanChange("collapseWhitespace")}
              />
              공백 축소
            </OptionLabel>
            <OptionLabel title="기호 주변 공백 제거: { } : ; , 등">
              <Checkbox
                type="checkbox"
                id="optTightSymbols"
                checked={tightenSymbols}
                onChange={handleBooleanChange("tightenSymbols")}
              />
              기호 붙여쓰기
            </OptionLabel>
            <OptionLabel title="블록 끝 ;} 중 ; 제거">
              <Checkbox
                type="checkbox"
                id="optTrimSemicolon"
                checked={trimSemicolon}
                onChange={handleBooleanChange("trimSemicolon")}
              />
              마지막 세미콜론 제거
            </OptionLabel>
            <OptionHint>
              · 공백 축소: 연속 공백/개행을 한 칸으로 정리{"\n"}· 기호 붙여쓰기:{" "}
              {`{ } : ; ,`} 주변 공백을 없애 압축
            </OptionHint>
          </OptionGroup>
        </Section>

        <Section>
          <SectionTitle>출력 형태</SectionTitle>
          <OptionGroup>
            <RadioGroup role="radiogroup" aria-label="출력 형태">
              <RadioLabel>
                <RadioInput
                  type="radio"
                  name="outputMode"
                  value="multi-line"
                  checked={outputMode === "multi-line"}
                  onChange={() => handleOutputModeChange("multi-line")}
                />
                Multi-Line
              </RadioLabel>
              <RadioLabel>
                <RadioInput
                  type="radio"
                  name="outputMode"
                  value="single-line"
                  checked={outputMode === "single-line"}
                  onChange={() => handleOutputModeChange("single-line")}
                />
                Single-Line
              </RadioLabel>
              <RadioLabel>
                <RadioInput
                  type="radio"
                  name="outputMode"
                  value="minify"
                  checked={outputMode === "minify"}
                  onChange={() => handleOutputModeChange("minify")}
                />
                Minify
              </RadioLabel>
            </RadioGroup>
          </OptionGroup>
        </Section>

        <Section>
          <SectionTitle>단위 변환</SectionTitle>
          <OptionGroup title="단위 변환 (배타)">
            <FieldRow>
              <FieldLabel htmlFor="unitMode">변환</FieldLabel>
              <UnitControls>
                <Select
                  id="unitMode"
                  value={unitMode}
                  onChange={handleUnitModeChange}
                >
                  <option value="">변환 안 함</option>
                  <option value="px2rem">px → rem</option>
                  <option value="rem2px">rem → px</option>
                </Select>
                <NumberInput
                  type="number"
                  id="unitBase"
                  aria-label="기준 값"
                  value={unitMode === "rem2px" ? remBase : pxBase}
                  min="1"
                  onChange={handleUnitBaseChange}
                  disabled={unitMode === ""}
                />
                <Suffix>px</Suffix>
              </UnitControls>
            </FieldRow>
          </OptionGroup>
        </Section>

        <Section>
          <SectionTitle>속성 정렬</SectionTitle>
          <OptionGroup title="CSS 속성 정렬">
            <FieldRow>
              <FieldLabel htmlFor="sortPreset">정렬 기준</FieldLabel>
              <Select
                id="sortPreset"
                value={sortProperties ? sortPreset : "none"}
                onChange={handleSortPresetChange}
              >
                <option value="none">정렬 안 함</option>
                <option value="concentric">범주 기반 (추천)</option>
              </Select>
            </FieldRow>
          </OptionGroup>
        </Section>
      </SectionGrid>
    </Container>
  );
};

export default Controls;

const Container = styled.section`
  border-radius: ${({ theme }) => theme.radii.xl};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.card};
  box-shadow: ${({ theme }) => theme.shadows.card};
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const SectionGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.muted};
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const SectionTitle = styled.h2`
  margin: 0;
  width: 100%;
  font-size: 1.05rem;
  font-weight: 650;
  color: ${({ theme }) => theme.colors.text};
`;

const OptionGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.panel};
  padding: 0.75rem 1rem;
  color: ${({ theme }) => theme.colors.text};
`;

const OptionLabel = styled.label`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: 0.9rem;
  line-height: 1.4;
  text-align: left;
`;

const ModeGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ModeLabel = styled.label`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.hint};
  min-width: 4.5rem;
`;

const ModeToggle = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 0.2rem;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.panelInset};
  border: 1px solid ${({ theme }) => theme.colors.border};
  gap: 0.25rem;
  width: fit-content;
`;

interface ToggleButtonProps {
  $active: boolean;
}

const ToggleButton = styled.button<ToggleButtonProps>`
  min-width: 2.25rem;
  padding: 0.25rem ${({ theme }) => theme.spacing.xs};
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
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: background ${({ theme }) => theme.transitions.base},
    color ${({ theme }) => theme.transitions.base};

  &:hover {
    background: ${({ $active, theme }) =>
      $active ? theme.colors.accentHover : theme.colors.button};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.panelInset};
  accent-color: ${({ theme }) => theme.colors.accent};
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }
`;

const FieldRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.9rem;
  flex-wrap: wrap;
`;

const FieldLabel = styled.label`
  min-width: 4.5rem;
  color: ${({ theme }) => theme.colors.hint};
  flex-shrink: 0;
`;

const Select = styled.select`
  flex: 1;
  min-width: 8rem;
  height: 2.25rem;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.panelInset};
  color: ${({ theme }) => theme.colors.text};
  padding: 0 ${({ theme }) => theme.spacing.md};
  transition: border-color ${({ theme }) => theme.transitions.base};

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }
`;

const UnitControls = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  flex: 1;
  flex-wrap: wrap;
`;

const NumberInput = styled.input`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4.5rem;
  height: 2.25rem;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.panelInset};
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  padding: 0 ${({ theme }) => theme.spacing.sm};
  transition: border-color ${({ theme }) => theme.transitions.base};

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Suffix = styled.span`
  color: ${({ theme }) => theme.colors.hint};
  font-size: 0.85rem;
`;

const RadioGroup = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const RadioLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: 0.9rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
`;

const RadioInput = styled.input`
  width: 16px;
  height: 16px;
  accent-color: ${({ theme }) => theme.colors.accent};
  cursor: pointer;
`;

const OptionHint = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.hint};
  font-size: 0.78rem;
  line-height: 1.4;
  white-space: pre-line;
`;
