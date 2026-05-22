[![Build Status](https://github.com/daunjung-dev/korean-romanizer/workflows/CI/badge.svg)](https://github.com/daunjung-dev/korean-romanizer/actions?query=workflow%3ACI)
[![npm version](https://img.shields.io/npm/v/@daun_jung/korean-romanizer.svg)](https://www.npmjs.com/package/@daun_jung/korean-romanizer)
[![MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](https://www.typescriptlang.org/)

# Korean Romanizer

한글을 로마자로 변환하는 TypeScript 라이브러리입니다. 국립국어원 로마자 표기법을 기반으로 구현되었으며, 많은 부분을 커버할 수 있지만 한글의 특성상 단어 사전 데이터가 없으면 100% 구현하기 어려워 완벽하지는 않습니다.

> 이 라이브러리는 [crizin/korean-romanizer](https://github.com/crizin/korean-romanizer) 자바 라이브러리를 TypeScript로 포팅한 버전입니다. 원본 자바 버전과 동일한 기능을 제공하지만, 현대적인 JavaScript/TypeScript 환경에 맞게 최적화되었습니다.

## 특징

- ✨ 경량화된 번들 (약 15KB)
- 🚀 Tree-shaking 지원
- 📦 ESM과 CommonJS 모듈 모두 지원
- 🔄 국립국어원 로마자 표기법 준수
- 💡 모듈, 네임스페이스, 함수 레벨 임포트 모두 지원

## 설치

```bash
npm install @daun_jung/korean-romanizer
```

## 사용 방법

### 함수 직접 임포트 (권장)

```typescript
// 개별 함수 직접 임포트 - 가장 간결하고 우아한 방식
import {
  romanize,
  romanizeWithType,
  romanizeWithAssimilation,
} from "@daun_jung/korean-romanizer";
import { Type, ConsonantAssimilation } from "@daun_jung/korean-romanizer";

// 기본 변환
console.log(romanize("안녕하세요")); // "Annyeonghaseyo"

// 자음 동화 옵션 사용
console.log(
  romanizeWithAssimilation("한라산", ConsonantAssimilation.Progressive)
); // "Hallasan"

// 단어 유형 옵션 사용
console.log(romanizeWithType("김철수", Type.Name)); // "Kim Cheolsu"
```

### 특정 함수만 임포트

각 함수를 별도의 경로에서 가져올 수도 있습니다. 이 방식은 트리쉐이킹과 번들 사이즈 최적화에 도움이 됩니다.

```typescript
// 특정 함수만 필요할 경우
import romanize from "@daun_jung/korean-romanizer/romanize";
import romanizeWithType from "@daun_jung/korean-romanizer/romanizeWithType";
import romanizeWithAssimilation from "@daun_jung/korean-romanizer/romanizeWithAssimilation";

// 타입 임포트
import { Type, ConsonantAssimilation } from "@daun_jung/korean-romanizer";
```

### 네임스페이스 사용 (기존 방식)

```typescript
// 네임스페이스 방식 (하위 호환성 유지)
import { KoreanRomanizer } from "@daun_jung/korean-romanizer";
import { Type, ConsonantAssimilation } from "@daun_jung/korean-romanizer";

// 기본 변환
console.log(KoreanRomanizer.romanize("안녕하세요")); // "Annyeonghaseyo"

// 자음 동화 옵션 사용
console.log(
  KoreanRomanizer.romanizeWithAssimilation(
    "한라산",
    ConsonantAssimilation.Progressive
  )
); // "Hallasan"

// 단어 유형 옵션 사용
console.log(KoreanRomanizer.romanizeWithType("김철수", Type.Name)); // "Kim Cheolsu"
```

### 이름의 모든 영문 표기 변형 가져오기

한국인이 영어로 자기 이름을 적을 때 실제로 쓰는 다양한 표기 (예: 김 → Kim/Gim, 이 → Lee/Yi/Rhee, 정 → Jung/Jeong/Chung, 영 → Young/Yeong)를 배열로 받을 수 있습니다.

```typescript
import { romanizeNameVariants } from "@daun_jung/korean-romanizer";

const variants = romanizeNameVariants("김철수");
// [
//   "Kim Chulsoo",
//   "Kim Cheolsu",
//   "Kim Chul-su",
//   "Gim Cheolsu",
//   ...
// ]
```

#### 옵션 (`NameVariantOptions`)

| 옵션                      | 기본값  | 설명                                              |
| ------------------------- | ------- | ------------------------------------------------- |
| `limit`                   | `100`   | 반환할 최대 변형 개수                             |
| `surnameFirst`            | `true`  | 성-이름 순서 (예: `"Kim Cheolsu"`) 포함           |
| `givenNameFirst`          | `true`  | 이름-성 순서 (예: `"Cheolsu Kim"`) 포함           |
| `joinedGivenName`         | `true`  | 이름을 붙여 쓴 형태 (예: `"Cheolsu"`) 포함        |
| `hyphenatedGivenName`     | `true`  | 하이픈 형태 (예: `"Cheol-su"`) 포함               |
| `spaceSeparatedGivenName` | `false` | 공백 분리 형태 (예: `"Cheol Su"`) 포함            |
| `surnameOverrides`        | `{}`    | 기본 성씨 매핑에 사용자 변형을 추가/덮어쓰기      |
| `syllableOverrides`       | `{}`    | 기본 음절 매핑에 사용자 변형을 추가/덮어쓰기      |

```typescript
romanizeNameVariants("김철수", {
  hyphenatedGivenName: false,
  spaceSeparatedGivenName: true,
  surnameOverrides: { 김: ["Khim"] },
  limit: 20,
});
```

### 옵션

#### 자음 동화 (ConsonantAssimilation)

- `Progressive`: 순행동화
- `Regressive`: 역행동화 (기본값)

#### 단어 유형 (Type)

- `Substantives`: 명사와 같은 실체언
- `Compound`: 복합어
- `District`: 주소, 위치
- `Name`: 사람의 이름
- `NameTypical`: 가장 일반적으로 사용되는 표기법을 따르는 사람의 이름
- `Typical`: 일반 단어 (기본값)

## 개발

### 빌드

```bash
npm run build
```

### 테스트

```bash
npm test
```

## 원본 프로젝트

이 라이브러리는 [@crizin](https://github.com/crizin)이 개발한 [korean-romanizer](https://github.com/crizin/korean-romanizer) 자바 라이브러리를 기반으로 합니다. 훌륭한 원본 라이브러리를 제공해 주신 crizin님께 감사드립니다.

## 라이선스

MIT License
