# Design Tokens

> Tailwind `extend` 설정과 UI 구현에서 재사용되는 핵심 디자인 토큰 정리입니다. 기본 Tailwind 스케일(여백, 글꼴 크기 등)은 그대로 활용하고, 아래 토큰은 override/추가 정의된 값만 명시합니다.

## 색상(Color)

| 토큰 | 값 | 용도 |
| --- | --- | --- |
| `night.DEFAULT` | `#0b1220` | 전체 배경, page base |
| `night.card` | `#121a2b` | 카드/섹션 배경 (`card-surface`) |
| `night.panel` | `#0e1526` | 입력/출력 패널, 옵션 패널 배경 |
| `night.border` | `#1c2742` | 카드/입력 테두리, 버튼 외곽선 |
| `night.text` | `#e6ecff` | 기본 텍스트 색상 |
| `night.muted` | `#9bb0d3` | 보조 텍스트, 라벨 |
| `night.hint` | `#a8b6d8` | placeholder, 설명 텍스트 |
| `night.accent` | `#6aa4ff` | 주요 액션 버튼, 링크 색상 |
| `night.button` | `#111a2e` | 중립 버튼 배경 |
| `night.buttonHover` | `#15203a` | 중립 버튼 hover 상태 |
| `night.badgeBg` | `#0e3a7a` | 뱃지/라벨 배경 |
| `night.badgeText` | `#cfe3ff` | 뱃지/라벨 텍스트 |
| `night.badgeBorder` | `#1f58b9` | 뱃지/라벨 테두리 |

## 타이포그래피(Typography)

- **기본 폰트 패밀리 (`font-sans`)**: `ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif`
- **모노스페이스 (`font-mono`)**: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace`
- **기본 글자 색상**: `text-night-text`
- **보조 글자 색상**: `text-night-muted`
- **힌트/placeholder**: `text-night-hint`
- Tailwind 기본 글꼴 크기/라인 높이를 유지하며, 섹션 타이틀은 `text-base font-semibold`, 일반 본문은 `text-sm`, 코드 영역은 `text-xs`를 사용.

## 레이아웃 & 스페이싱

- 카드 컴포넌트(`card-surface`): `rounded-2xl`, `border border-night-border`, `p-5`
- 옵션 패널/버튼: `rounded-xl`, `px-4 py-2` 또는 `px-3 py-1.5`
- 입력/출력 영역: `min-h-[320px]`, `rounded-xl`, `border-night-border`, `px-4 py-3`
- 전역 여백: `main` 컨테이너 `gap-6`, `px-5`, `py-8`; 섹션 간 기본 `gap-4`

## 효과(Elevation & Interaction)

- 그림자: `shadow-card = 0 6px 24px rgba(0, 0, 0, 0.25)`
- 전환: 버튼/링크 `transition duration-150`
- 포커스 링: `focus:ring-2 focus:ring-night-accent/40 (또는 /60)`
- 비활성 상태: Tailwind `opacity-50` 및 `cursor-not-allowed` (필요 시 적용)

## 컴포넌트 가이드

- **Primary Button**: `bg-night-accent text-slate-950`, `hover:brightness-110`, `rounded-xl`, `px-4 py-2`
- **Secondary Button**: `border border-night-border bg-night-button text-night-text`, `hover:bg-night-buttonHover`
- **Toggle/Checkbox**: `h-4 w-4`, `rounded`(checkbox) / `rounded-full`(radio), `border-night-border`, `bg-night-panel`
- **Card Header**: `text-base font-semibold text-night-text`, 보조 설명은 `text-xs text-night-hint`

## 향후 확장 메모

- 라이트 모드 도입 시, 동일 토큰 이름으로 색상 세트 추가 필요
- Tailwind `@apply` 사용 컴포넌트(예: `card-surface`)는 디자인 시스템 문서에 반영
- 새 옵션(단위 변환 기준, diff 뷰 등) 추가 시, 동일 토큰을 활용하여 일관성 유지
- 라이트/다크 테마는 `data-theme` 속성 기반 CSS 변수로 전환되며 동일 토큰 네이밍 유지
