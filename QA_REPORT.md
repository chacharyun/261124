# 합격의 숲 수정본 안내

## 수정 내용
- 공부 완료 직후 완료 상태를 반전시키던 호출 제거, 타이머 및 풀이 수 검증.
- 신규 일간 계획 및 신규 공부/오답/필기/일정 기록에서 예시 데이터 제거. 기존 저장 기록은 유지.
- 날짜 변경 시 기존 일간 계획 보관 및 플래너에서 조회, 한국 시간 기준 날짜 계산.
- 저장 실패 안내 및 읽기 실패 시 원본 덮어쓰기 방지. 기존 localStorage 키 유지.
- 경험치 중복 방지, 복습 보상 과목 연결, 캐릭터 레벨 갱신, 장식 겹침 방지.
- 손필기 좌표 보정, 페이지별 캔버스 너비 저장, 단일 점, 펜 포인터 구분, 페이지 전환 시 실행 취소 이력 분리, 노트 양식 저장.
- 사진만으로 오답 등록 허용, 파일 읽기 오류 안내.

## 검증
- TypeScript 전체 검사: 통과 (`npx tsc --noEmit --incremental false`).
- 복습 날짜 단위 검사 6개 통과. 재실행: `npx tsc lib/spaced-repetition.ts lib/constants.ts lib/types.ts --module commonjs --target es2020 --skipLibCheck --outDir .qa-test` 후 `node tests/review.cjs ../.qa-test/spaced-repetition.js`.
- 프로덕션 빌드: 시도했으나 원본 Windows SWC 바이너리만 있고 Linux용 패키지 다운로드가 DNS 제한으로 실패. 빌드 성공 미확인.
- 브라우저 E2E, 실제 Apple Pencil, Netlify 배포, AI API 및 기기 간 동기화: 미검증. 기존 앱의 실제 저장 방식은 localStorage이며 클라우드 동기화 구현을 완료한 것이 아님. 사진이 많으면 저장 한도에 도달할 수 있음.
- 기존에 사라진 과거 계획은 복구할 수 없음. 기존 저장 데이터는 ZIP에 포함되지 않으며 브라우저에 있음.

## 설치 및 배포
1. 기존 사이트 설정에서 JSON 백업을 내려받으세요. 원본 ZIP도 보관하세요.
2. 수정본을 별도 폴더에 압축 해제하고 Antigravity로 열어 `npm ci`, `npm run dev` 실행.
3. `npm run build` 성공 및 브라우저에서 저장/새로고침/복습/필기/꾸미기 확인 후 기존 Netlify 프로젝트에 배포하세요. 새 주소에서는 기존 브라우저 기록이 자동으로 나타나지 않으므로 백업을 가져오세요.
4. API 키나 비밀 설정은 기존 환경에서 별도로 유지하세요. 이 ZIP은 소스 전체이며 의존성 및 빌드 캐시는 제외했습니다.
