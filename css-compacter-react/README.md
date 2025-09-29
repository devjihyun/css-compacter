# CSS Compacter React

This project is a React application that provides a CSS formatting tool. It allows users to input CSS code and format it according to various options, including unit conversion and property sorting.

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
   npm start
   ```

   `react-scripts`가 OpenSSL 3와 호환되지 않는 문제를 우회하기 위해 스크립트에 `NODE_OPTIONS=--openssl-legacy-provider`가 이미 포함되어 있습니다. 별도의 설정 없이 Node 18에서도 실행됩니다.

4. 브라우저에서 `http://localhost:3000`으로 이동하면 앱을 확인할 수 있습니다.

## Usage

- 왼쪽 편집기에 CSS를 입력하거나 `CSS 열기` 버튼으로 `.css` 파일을 불러옵니다.
- 상단 컨트롤의 옵션을 조정하면 실시간(`실시간 변환` 활성화)으로 결과가 재계산됩니다. 비활성화 시 `변환 실행` 버튼으로 수동 변환을 실행할 수 있습니다.
- 단위 변환(px↔rem), 주석 제거, 공백 축소, 기호 간격 정리, 속성 정렬(Concentric / 알파벳) 등의 옵션을 즉시 토글할 수 있습니다.
- `입↔출 교체`는 입력과 출력을 서로 바꾸며, `초기화`는 입력/출력과 옵션을 초기값으로 되돌립니다.
- `.compact.css 저장` 버튼으로 현재 결과를 파일로 다운로드할 수 있습니다.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.
