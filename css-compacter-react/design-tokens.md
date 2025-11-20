# Design Tokens (styled-components)

`css-compacter-react`는 TailwindCSS 대신 `styled-components` 기반 테마 시스템을 사용합니다. 모든 UI는 `src/styles/theme.ts`에서 정의한 `AppTheme` 토큰과 `src/styles/globalStyles.ts`의 전역 스타일을 토대로 구현됩니다. 아래 표는 두 테마(dark/light)에서 공유하거나 테마별로 달라지는 핵심 토큰을 정리한 자료입니다.

- **테마 구조**: `ThemeProvider`가 `darkTheme` / `lightTheme`를 주입하며, 둘 모두 `AppTheme` 인터페이스를 구현합니다.
- **변경 범위**: 기존 Tailwind 클래스/유틸리티는 더 이상 사용하지 않으므로 문서 전체에서 Tailwind 전용 명칭을 제거했습니다.

---

## 1. 색상(Color Palette)

`colors` 오브젝트는 다섯 그룹으로 나뉩니다. 두 테마의 값은 아래 표와 같습니다.

| 토큰                | Dark 값   | Light 값  | 용도                                               |
| ------------------- | --------- | --------- | -------------------------------------------------- |
| `background`        | `#0d1117` | `#f6f8ff` | 전체 배경                                         |
| `backgroundOverlay` | rgba(13,17,23,0.95) | rgba(246,248,255,0.95) | 헤더 고정 영역 등 반투명 오버레이                  |
| `card`              | `#161b22` | `#ffffff` | 카드/섹션 기본 배경                               |
| `panel`             | `#1c2128` | `#f1f4ff` | 입력/출력 영역, 옵션 패널                         |
| `panelInset`        | `#1c2128` | `#e7ebff` | 카드 내부 입력 필드 배경                          |
| `border`            | `#30363d` | `#d7dff5` | 카드·인풋·버튼 외곽선                             |
| `borderSubtle`      | rgba(48,54,61,0.7) | rgba(215,223,245,0.8) | 헤더 하단 경계 등 미세한 구분선                    |
| `text`              | `#f0f6fc` | `#0b1220` | 기본 텍스트                                       |
| `muted`             | `#c9d1d9` | `#526086` | 부가 설명, 라벨                                   |
| `hint`              | `#8b949e` | `#6c7a9d` | placeholder, 보조 힌트                             |
| `accent`            | `#2f81f7` | `#3b67ff` | 주요 액션 버튼, 링크, 포커스                      |
| `accentHover`       | `#58a6ff` | `#5c7fff` | 액션 hover                                        |
| `accentSoft`        | rgba(47,129,247,0.28) | rgba(59,103,255,0.24) | 선택 영역, 소프트 하이라이트                      |
| `button`            | `#21262d` | `#e7ecff` | 중립 버튼 기본 배경                               |
| `buttonHover`       | `#30363d` | `#d9e2ff` | 중립 버튼 hover                                   |
| `badgeBg`           | `#0e4429` | `#e3eaff` | 뱃지 배경                                          |
| `badgeText`         | `#3fb950` | `#233a6d` | 뱃지 텍스트                                        |
| `badgeBorder`       | `#238636` | `#97adf3` | 뱃지 외곽선                                       |

> 💡 새로운 색상을 추가해야 할 경우 `AppTheme['colors']`에 명시적으로 추가하고, 두 테마에 동일한 키가 존재하도록 유지하세요.

---

## 2. 타이포그래피(Typography)

| 항목        | 값                                                                                     | 설명 |
| ----------- | --------------------------------------------------------------------------------------- | ---- |
| `fonts.sans`| `'Pretendard', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif` | 기본 UI 폰트 |
| `fonts.mono`| `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace` | 코드/에디터 |

- 기본 본문은 0.9rem(Controls) / 0.85rem(에디터) 등 컴포넌트별로 명시.
- 전역 `GlobalStyle`에서 `textarea` 기본 폰트 크기를 0.85rem으로 정의.
- 굵기/크기 스케일은 Tailwind의 단위 대신 각 컴포넌트에서 직접 지정합니다 (`Title` 1.125rem, 버튼 0.95rem 등).

---

## 3. 여백, 곡률, 그림자(Layout & Radii & Shadow)

### Spacing (`theme.spacing`)

| 토큰  | 값      | 대표 사용처                      |
| ----- | ------- | --------------------------------- |
| `xs`  | `0.25rem` | 푸터 텍스트 간 간격               |
| `sm`  | `0.5rem`  | 버튼 아이콘/텍스트 간격, 인풋 라벨 |
| `md`  | `0.75rem` | 옵션 라벨 간격                   |
| `lg`  | `1rem`    | 카드 내부 패딩, 주요 레이아웃 간격 |
| `xl`  | `1.25rem` | 헤더/카드 패딩                   |
| `2xl` | `1.5rem`  | 메인 영역 gap, 에디터 카드 간격   |

### Radii (`theme.radii`)

- `md`: `0.5rem` (체크박스, 소형 요소)
- `lg`: `0.75rem` (버튼, 옵션 그룹)
- `xl`: `1rem` (카드, 텍스트에어리어)
- `pill`: `999px` (뱃지, 토글)

### Shadow (`theme.shadows`)

- `card`: `0 6px 24px rgba(0, 0, 0, 0.25)` — 모든 카드형 섹션 공통

---

## 4. 전환 및 상호작용(Transitions & Interaction)

- `transitions.base`: `0.2s ease-in-out` — 버튼 호버, 배경 색상 전환 등 대부분의 애니메이션에 사용.
- 포커스 스타일: 각 컴포넌트에서 `outline: 2px solid theme.colors.accent` / `outline-offset: 2px~3px` 활용.
- Clipboard/Download 등 액션 버튼은 `button`/`accent` 컬러 조합으로 시각적 위계를 표현.

---

## 5. 컴포넌트 적용 가이드

| 컴포넌트        | 주요 토큰 & 스타일링                                                                     |
| --------------- | ----------------------------------------------------------------------------------------- |
| **Header**      | `backgroundOverlay`, `borderSubtle`, `spacing.xl`, `button`/`buttonHover`, `badge*`       |
| **Controls**    | 카드(`card`, `border`, `shadow.card`), 옵션 그룹(`panel`, `radii.lg`), 체크박스(`radii.md`)|
| **CssInput**    | 업로드 버튼(`button`), 에디터 배경(`panel`), 패딩(`spacing.lg`)                           |
| **CssOutput**   | 액션 그룹(`button`, `accent`), 텍스트에어리어(`panel`, `radii.xl`)                       |
| **Footer**      | 보조 텍스트(`muted`), 링크(`accent`, `accentHover`)                                      |

> 각 컴포넌트는 styled-components 내부에서 토큰을 직접 참조합니다. 새로운 UI를 추가할 때는 동일한 토큰을 재사용하거나 `AppTheme`에 새 항목을 추가한 후 여기 문서를 업데이트하세요.

---

## 6. 문서 유지 원칙

1. **단일 소스**: `AppTheme` 인터페이스가 진실의 단일 소스입니다. 토큰을 수정할 때는 이 파일과 문서를 동기화하세요.
2. **테마 동등성**: 모든 색상/토큰은 두 테마에 동일한 키를 가진 상태를 유지해야 합니다.
3. **전역 스타일**: `GlobalStyle`에 변경이 발생하면, 이 문서의 관련 섹션(예: 타이포그래피, 상호작용)도 함께 업데이트합니다.
4. **레이아웃**: Tailwind 유틸리티 대신 `spacing`, `radii` 값을 직접 사용하므로 구체적인 rem 값으로 기록합니다.

필요 시 이 문서를 기반으로 피그마 라이브러리나 디자인 시스템 문서에도 동일한 토큰을 반영해 주세요.
