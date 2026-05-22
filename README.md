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

#### 소개

`romanizeNameVariants`는 한 명의 한국인이 본인의 한글 이름을 영문으로 표기할 때 **실제로 선택할 만한 표기들을 한꺼번에 배열로 반환**하는 함수입니다.

국립국어원의 표준 로마자 표기법은 한 가지 정답만 제시하지만, 여권·명함·SNS·논문 저자명 등 현실에서는 같은 이름이라도 다양한 관습적 표기가 공존합니다.

- 성씨: 김 → **Kim** / Gim, 이 → **Lee** / Yi / Rhee, 박 → **Park** / Pak / Bak, 최 → **Choi** / Choe, 정 → **Jung** / Jeong / Chung, 윤 → **Yoon** / Yun, 조 → **Cho** / Jo, 한 → **Han** / Hahn
- 이름 음절: 영 → **Young** / Yeong, 현 → **Hyun** / Hyeon, 철 → **Chul** / Cheol, 준 → **Jun** / Joon, 수 → **Soo** / Su, 우 → **Woo** / Wu

이 함수는 위와 같은 변형들을 **성-이름 순서 / 이름-성 순서**, **붙여 쓰기 / 하이픈 / 공백 분리** 형태와 곱집합으로 조합해, 한 사람이 살면서 "내 이름의 영어 표기"라고 골라볼 만한 거의 모든 후보를 만들어 냅니다. 사용자 검색·매칭(예: 외부 DB에서 같은 사람을 다른 표기로 찾기), 자기소개 페이지에서 표기 선택지 제시, 한영 명단 정규화 등에 활용할 수 있습니다.

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

#### 한계

이 함수는 발음학적 규칙과 관습적 표기 데이터를 결합한 **휴리스틱**이며, 다음과 같은 본질적·실용적 한계가 있습니다.

- **완전성 보장 불가.** 한국인이 영문 표기를 고르는 방식에는 가족·지역·세대에 따른 관습, 출입국 사무소·구청 담당자의 표기 관행, 본인의 미적 취향 등 무수한 변수가 영향을 주기 때문에, 어떤 알고리즘도 "모든" 표기를 망라할 수 없습니다. 따라서 이 함수가 반환하지 않는 표기를 실제로 사용하는 사람도 있을 수 있습니다 (예: 윤 → `Yune`, 박 → `Bahk`, 이 → `Lhee` 등 매우 희소한 표기).
- **데이터 커버리지.** 내장 매핑은 대표 성씨 약 85개와 자주 쓰이는 음절 약 280개를 다룹니다. 등록되지 않은 음절은 초성·중성·종성 조합 규칙으로 절차적으로 변형을 만들지만, 관습 표기(예: 영 → `Young`, 경 → `Kyung`)는 사전에 등록되어 있지 않으면 생성되지 않습니다. 누락된 변형은 `surnameOverrides`/`syllableOverrides`로 보강할 수 있습니다.
- **음절 단위 처리.** 변형은 음절별로 독립 생성되어 조합되므로, 표준 로마자 표기법의 **자음 동화·연음·구개음화** 같은 음절 간 발음 변동은 반영되지 않습니다. 예컨대 "한라"는 `Halla`로 표기되는 것이 표준이지만, 이 함수는 음절별 변형(`Han` + `Ra/La` 등)을 곱집합으로 만듭니다. 발음 규칙이 적용된 단일 표기가 필요하면 `romanize` / `romanizeWithType(Type.Name)` 을 사용하세요.
- **조합 폭발.** 음절 수가 늘어나면 변형 수가 지수적으로 증가합니다. 3음절 이름은 보통 수십~수백 개, 5음절 이상이면 수천 개 이상이 생성될 수 있습니다. `limit` 기본값(100)이 잘려 들어가므로, 큰 값을 줄 때는 메모리·성능을 고려하세요.
- **결과 순서.** 출력은 `surnameFirst → givenNameFirst` 순으로, 각 영역 안에서는 성씨/음절 매핑 배열의 등록 순서대로 생성됩니다. 같은 이름이라도 "가장 일반적인 표기"가 첫 번째로 나오도록 보장하지는 않습니다. 가장 흔한 단일 표기가 필요하면 `romanizeWithType(name, Type.NameTypical)`을 사용하세요.
- **입력 제약.** 입력은 공백을 제외하면 **모두 한글 음절**이어야 하며, 최소 2자 이상이어야 합니다 (성 1자 + 이름 최소 1자). 한자·로마자 혼용 입력은 예외를 던집니다. 자모 단독(ㄱ, ㅏ 등)이나 옛한글은 지원하지 않습니다.
- **복성 판별.** 복성(남궁·선우·제갈 등)은 내장된 사전 목록에 있을 때만 두 글자 성으로 인식됩니다. 사전에 없는 두 글자 성을 가진 사람은 첫 글자만 성으로 처리되므로, 필요하면 `surnameOverrides`로 명시해 주세요.

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
