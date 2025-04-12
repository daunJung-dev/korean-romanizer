# 배포 가이드

이 문서는 `korean-romanizer-ts` 라이브러리를 npm에 배포하는 방법을 설명합니다.

## 사전 준비

### 1. npm 계정 설정

먼저 npm 계정이 필요합니다. 계정이 없다면 [npm 웹사이트](https://www.npmjs.com/)에서 가입하세요.

```bash
# npm 로그인
npm login
```

### 2. GitHub Secrets 설정

GitHub에서 자동 배포를 위해 npm 토큰을 설정해야 합니다:

1. npm 토큰 생성:

   - npm 웹사이트에 로그인
   - 프로필 > Access Tokens > Generate New Token
   - 'Publish' 권한이 있는 토큰 생성

2. GitHub Secrets 설정:
   - GitHub 저장소 > Settings > Secrets and variables > Actions
   - `New repository secret` 클릭
   - 이름: `NPM_TOKEN`, 값: 생성한 npm 토큰

## 수동 배포

자동 배포가 설정되어 있지만, 수동으로 배포해야 할 경우:

```bash
# 버전 업데이트
npm version patch  # 또는 minor, major

# 빌드 및 배포
npm run build
npm publish
```

## GitHub Actions 배포

저장소는 두 가지 GitHub Actions 워크플로우를 포함하고 있습니다:

1. **CI (Continuous Integration)**

   - 모든 push와 pull request에서 자동으로 실행
   - 코드가 빌드되고 테스트가 통과하는지 확인

2. **Publish to NPM**
   - GitHub Release가 생성되거나 수동으로 트리거될 때 실행
   - 패키지를 빌드하고 npm에 자동 배포

### 새 버전 배포 방법

1. **코드 변경사항 커밋 및 푸시**

2. **GitHub Release 생성**

   - GitHub 저장소 > Releases > Draft a new release
   - 태그 버전 생성 (예: v1.0.1)
   - Release 제목과 설명 작성
   - "Publish release" 클릭

3. **워크플로우 모니터링**
   - GitHub Actions 탭에서 배포 진행 상황 확인
   - 성공적으로 완료되면 새 버전이 npm에 게시됨

## 배포 체크리스트

- [ ] 코드 테스트 통과 확인
- [ ] package.json의 버전 번호 업데이트 확인
- [ ] CHANGELOG.md 업데이트 (있는 경우)
- [ ] README.md 최신 상태 확인

## 문제 해결

배포 중 문제가 발생하면:

1. GitHub Actions 로그 확인
2. npm 계정 권한 확인
3. NPM_TOKEN의 유효성 검증
4. package.json의 name, version 필드가 올바른지 확인

## 관련 문서

- [npm 배포 문서](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [GitHub Actions 문서](https://docs.github.com/en/actions)
