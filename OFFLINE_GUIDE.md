# 오프라인 실행 가이드 (정적 웹앱)

이 문서는 네트워크가 차단된 환경에서 `css-compacter-react`를 실행하기 위한 절차를 정리합니다. 외부 API 의존성이 없도록 설계되어 있어 정적 파일만으로 동작합니다.

## 필요 조건
- Node 18+ / npm (빌드 및 `npx` 실행용)
- Python 3 (권장 로컬 서버) 또는 `npx serve`, `npx http-server` 중 하나

## 빌드
```bash
npm install
npm run build   # dist/ 생성
```

## 실행 옵션
1) **권장: Python 내장 서버**
```bash
cd dist
python3 -m http.server 4173   # 포트는 자유롭게 변경 가능 (예: 8000)
# 브라우저에서 http://localhost:4173 (또는 지정한 포트)
```

2) **serve (SPA fallback 포함)**
```bash
npx serve dist --listen 4173 --single
# dist가 아닌 프로젝트 루트에서 실행할 때도 --single을 반드시 켜주세요.
# 예: npx serve . --listen 4173 --single
```

3) **http-server**
```bash
npx http-server dist -p 4173
```

4) **파일 직접 열기 (권장 X)**
- `dist/index.html` 더블클릭. 대부분 동작하지만 브라우저 CORS 설정에 따라 제한이 있을 수 있습니다.

## 자주 묻는 질문 / 트러블슈팅
- **404가 뜸**: 실행 위치가 `dist/`인지 확인하거나 `serve` 실행 시 `--single` 옵션(SPA fallback)을 켭니다.
- **포트 충돌**: 다른 포트를 지정하세요. 예) `python3 -m http.server 8080` 혹은 `--listen 8080`.
- **Python 명령이 없음**: macOS 기본 `python`은 없을 수 있으니 `python3`를 사용하세요.
- **자산 경로 깨짐**: `vite.config.ts`의 `base: "./"`로 상대 경로가 설정돼 있습니다. `dist/`를 통째로 이동해도 경로가 유지됩니다.
