import { ConsonantAssimilation, KoreanRomanizer, Type } from './KoreanRomanizer';

// KoreanRomanizer 네임스페이스의 함수들을 직접 export
export const romanize = KoreanRomanizer.romanize;
export const romanizeWithType = KoreanRomanizer.romanizeWithType;
export const romanizeWithAssimilation = KoreanRomanizer.romanizeWithAssimilation;

// 타입과 기존 네임스페이스 export
export { KoreanRomanizer, ConsonantAssimilation, Type };

// 기본 export를 유지 (하위 호환성)
export default KoreanRomanizer;
