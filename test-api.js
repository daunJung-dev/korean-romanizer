// ESM 문법을 사용하기 위한 테스트 파일
// 이 파일은 package.json에 "type": "module" 설정이 있을 때만 직접 실행할 수 있습니다.
// 테스트 목적으로만 작성되었습니다.

// 개별 함수 직접 임포트 방식
import {
  romanize,
  romanizeWithType,
  romanizeWithAssimilation,
} from "./dist/esm/index.js";
import { Type, ConsonantAssimilation } from "./dist/esm/index.js";

console.log("직접 함수 임포트 테스트:");
console.log(romanize("안녕하세요")); // "Annyeonghaseyo"
console.log(
  romanizeWithAssimilation("한라산", ConsonantAssimilation.Progressive)
); // "Hallasan"
console.log(romanizeWithType("김철수", Type.Name)); // "Kim Cheolsu"

// 네임스페이스 방식(기존 방식)
import { KoreanRomanizer } from "./dist/esm/index.js";

console.log("\n네임스페이스 방식 테스트:");
console.log(KoreanRomanizer.romanize("안녕하세요")); // "Annyeonghaseyo"
console.log(
  KoreanRomanizer.romanizeWithAssimilation(
    "한라산",
    ConsonantAssimilation.Progressive
  )
); // "Hallasan"
console.log(KoreanRomanizer.romanizeWithType("김철수", Type.Name)); // "Kim Cheolsu"

// CommonJS 환경에서는 다음과 같이 사용:
/*
const { romanize, romanizeWithType, romanizeWithAssimilation } = require('korean-romanizer');
const { Type, ConsonantAssimilation } = require('korean-romanizer');

console.log(romanize('안녕하세요')); // "Annyeonghaseyo"
console.log(romanizeWithAssimilation('한라산', ConsonantAssimilation.Progressive)); // "Hallasan"  
console.log(romanizeWithType('김철수', Type.Name)); // "Kim Cheolsu"

// 특정 함수만 임포트
const romanize = require('korean-romanizer/romanize');
console.log(romanize('안녕하세요')); // "Annyeonghaseyo"
*/
