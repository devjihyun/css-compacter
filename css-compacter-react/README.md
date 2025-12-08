# CSS Compacter React

This project is a Vite + React 19 application that provides a CSS formatting tool. It allows users to input CSS code and format it according to various options, including unit conversion and property sorting.

## Project Structure

```
css-compacter-react
├── public
│   └── index.html          # Main HTML file
├── src
│   ├── components          # React components
│   │   ├── Controls.tsx
│   │   ├── CssInput.tsx
│   │   ├── CssOutput.tsx
│   │   ├── Footer.tsx
│   │   └── Header.tsx
│   ├── utils               # Formatting utilities
│   │   └── cssFormatter.ts
│   ├── types               # Shared TypeScript types
│   │   └── index.ts
│   ├── App.tsx             # Main application component
│   ├── index.css           # TailwindCSS entrypoint
│   └── index.tsx           # React entry point
├── package.json            # npm configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project documentation
```

## Setup Instructions

1. Clone the repository:

   ```
   git clone <repository-url>
   cd css-compacter-react
   ```

2. Install dependencies (Node 18+ 권장):

   ```bash
   npm install
   ```

3. 개발 서버 실행:

   ```bash
   npm run dev
   ```

4. 브라우저에서 `http://localhost:5173`(Vite 기본 포트)으로 이동하면 앱을 확인할 수 있습니다.

5. 프로덕션 빌드:

   ```bash
   # config 출력물이 없는 경우 먼저 생성
   npx tsc -b
   npm run build
   # 빌드 결과 미리보기
   npm run preview
   ```

## Usage

- 왼쪽 편집기에 CSS를 입력하거나 `CSS 열기` 버튼으로 `.css` 파일을 불러옵니다.
- 상단 컨트롤의 옵션을 조정하면 실시간(`실시간 변환` 활성화)으로 결과가 재계산됩니다. 비활성화 시 `변환 실행` 버튼으로 수동 변환을 실행할 수 있습니다.
- 단위 변환(px↔rem), 주석 제거, 공백 축소, 기호 간격 정리, 속성 정렬(Concentric / Category) 등의 옵션을 즉시 토글할 수 있습니다.
- `입↔출 교체`는 입력과 출력을 서로 바꾸며, `초기화`는 입력/출력과 옵션을 초기값으로 되돌립니다.
- `.compact.css 저장` 버튼으로 현재 결과를 파일로 다운로드할 수 있습니다.

## Milestone Snapshot

`milestone.md`에 정의한 작업들의 진행 현황 요약입니다.

- 단위 변환 확장: px→vw 변환과 기준 해상도 옵션, px↔rem 병행 UX 개선 준비 중
- 속성 순서 옵션화: Concentric/Category 정렬 프리셋 제공, 사용자 정의 프리셋 저장/불러오기 및 미리보기/툴팁 개선 예정
- 미디어쿼리 개선: 중첩/중복 @media 병합 및 정렬 로직 설계 중
- 아키텍처 전환: React + TS 리팩터링 및 테스트 강화 진행 예정
- UI/UX 개선: 즉시 미리보기와 옵션 패널 확장, 반응형·A11y 개선 진행 예정, 다크/라이트 테마 전환은 완료
- Tailwind UI: Tailwind 도입 및 디자인 토큰 정리 계획 중
- 저장 기능: 다른 이름으로 저장 기능 추가 예정
- 배포: 오프라인(Electron/로컬)·사내 릴리스·웹 배포 전략 준비 중

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.
