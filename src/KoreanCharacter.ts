/**
 * 한글 문자를 음절 단위로 처리하는 라이브러리
 */

export enum ConsonantAssimilation {
  /**
   * 순행동화 설정
   */
  Progressive = 'Progressive',

  /**
   * 역행동화 설정
   */
  Regressive = 'Regressive',
}

/**
 * 단어 유형에 따른 특수 규칙 적용을 위한 옵션
 */
export enum Type {
  /**
   * 명사와 같은 실체언
   */
  Substantives = 'Substantives',

  /**
   * 복합어
   */
  Compound = 'Compound',

  /**
   * 주소, 위치
   */
  District = 'District',

  /**
   * 사람의 이름
   */
  Name = 'Name',

  /**
   * 가장 일반적으로 사용되는 표기법을 따르는 사람의 이름
   */
  NameTypical = 'NameTypical',

  /**
   * 일반 단어
   */
  Typical = 'Typical',
}

/**
 * 한글의 초성
 */
export enum ChosungValue {
  ㄱ = 0,
  ㄲ = 1,
  ㄴ = 2,
  ㄷ = 3,
  ㄸ = 4,
  ㄹ = 5,
  ㅁ = 6,
  ㅂ = 7,
  ㅃ = 8,
  ㅅ = 9,
  ㅆ = 10,
  ㅇ = 11,
  ㅈ = 12,
  ㅉ = 13,
  ㅊ = 14,
  ㅋ = 15,
  ㅌ = 16,
  ㅍ = 17,
  ㅎ = 18,
}

/**
 * 초성 인터페이스
 */
export interface IChosung {
  value: ChosungValue;
  defaultPronunciation: string;
  getPronunciation(
    prevCharacter: KoreanCharacter | null,
    currentCharacter: KoreanCharacter,
    consonantAssimilation: ConsonantAssimilation,
    type: Type
  ): string;
  getComplexPronunciation(
    prevCharacter: KoreanCharacter,
    currentCharacter: KoreanCharacter,
    consonantAssimilation: ConsonantAssimilation,
    type: Type
  ): string;
  isNeedHyphen(prevCharacterPronunciation: string, currentCharacterPronunciation: string): boolean;
}

// 기본 초성 클래스
export class Chosung implements IChosung {
  constructor(
    public value: ChosungValue,
    public defaultPronunciation: string
  ) {}

  getPronunciation(
    prevCharacter: KoreanCharacter | null,
    currentCharacter: KoreanCharacter,
    consonantAssimilation: ConsonantAssimilation,
    type: Type
  ): string {
    if (prevCharacter === null || !prevCharacter.isKoreanCharacter()) {
      return this.defaultPronunciation;
    }
    const complexPronunciation = this.getComplexPronunciation(
      prevCharacter,
      currentCharacter,
      consonantAssimilation,
      type
    );

    const prevPronunciation = prevCharacter.getRomanizedString(
      null,
      currentCharacter,
      consonantAssimilation,
      type
    );

    return this.isNeedHyphen(prevPronunciation, complexPronunciation)
      ? `-${complexPronunciation}`
      : complexPronunciation;
  }

  getComplexPronunciation(
    _prevCharacter: KoreanCharacter,
    _currentCharacter: KoreanCharacter,
    _consonantAssimilation: ConsonantAssimilation,
    _type: Type
  ): string {
    return this.defaultPronunciation;
  }

  isNeedHyphen(
    _prevCharacterPronunciation: string,
    _currentCharacterPronunciation: string
  ): boolean {
    return false;
  }
}

// ㄱ 초성 클래스
export class ChosungG extends Chosung {
  constructor() {
    super(ChosungValue.ㄱ, 'g');
  }

  getComplexPronunciation(
    prevCharacter: KoreanCharacter,
    _currentCharacter: KoreanCharacter,
    _consonantAssimilation: ConsonantAssimilation,
    _type: Type
  ): string {
    const jongsung = prevCharacter.jongsung;

    if (
      jongsung === JongsungValue.ㄺ ||
      jongsung === JongsungValue.ㄻ ||
      jongsung === JongsungValue.ㄼ ||
      jongsung === JongsungValue.ㄽ ||
      jongsung === JongsungValue.ㄾ ||
      jongsung === JongsungValue.ㄿ ||
      jongsung === JongsungValue.ㅀ
    ) {
      return 'kk';
    }
    if (jongsung === JongsungValue.ㅎ) {
      return 'k';
    }

    return this.defaultPronunciation;
  }

  isNeedHyphen(
    prevCharacterPronunciation: string,
    _currentCharacterPronunciation: string
  ): boolean {
    return prevCharacterPronunciation.endsWith('n');
  }
}

// ㄴ 초성 클래스
export class ChosungN extends Chosung {
  constructor() {
    super(ChosungValue.ㄴ, 'n');
  }

  getComplexPronunciation(
    prevCharacter: KoreanCharacter,
    _currentCharacter: KoreanCharacter,
    _consonantAssimilation: ConsonantAssimilation,
    _type: Type
  ): string {
    const jongsung = prevCharacter.jongsung;

    if (jongsung === JongsungValue.ㄹ || jongsung === JongsungValue.ㅀ) {
      return 'l';
    }

    return this.defaultPronunciation;
  }
}

// ㄷ 초성 클래스
export class ChosungD extends Chosung {
  constructor() {
    super(ChosungValue.ㄷ, 'd');
  }

  getComplexPronunciation(
    prevCharacter: KoreanCharacter,
    _currentCharacter: KoreanCharacter,
    _consonantAssimilation: ConsonantAssimilation,
    _type: Type
  ): string {
    const jongsung = prevCharacter.jongsung;

    if (jongsung === JongsungValue.ㄾ) {
      return 'tt';
    }
    if (jongsung === JongsungValue.ㄶ || jongsung === JongsungValue.ㅎ) {
      return 't';
    }

    return this.defaultPronunciation;
  }
}

// ㄹ 초성 클래스
export class ChosungL extends Chosung {
  constructor() {
    super(ChosungValue.ㄹ, 'r');
  }

  getComplexPronunciation(
    prevCharacter: KoreanCharacter,
    _currentCharacter: KoreanCharacter,
    consonantAssimilation: ConsonantAssimilation,
    _type: Type
  ): string {
    const jongsung = prevCharacter.jongsung;

    if (
      jongsung === JongsungValue.ㄱ ||
      jongsung === JongsungValue.ㄲ ||
      jongsung === JongsungValue.ㄳ ||
      jongsung === JongsungValue.ㄺ ||
      jongsung === JongsungValue.ㄼ ||
      jongsung === JongsungValue.ㄿ ||
      jongsung === JongsungValue.ㅁ ||
      jongsung === JongsungValue.ㅂ ||
      jongsung === JongsungValue.ㅄ ||
      jongsung === JongsungValue.ㅇ ||
      jongsung === JongsungValue.ㅋ ||
      jongsung === JongsungValue.ㅍ
    ) {
      return 'n';
    }
    if (
      jongsung === JongsungValue.ㄴ ||
      jongsung === JongsungValue.ㄷ ||
      jongsung === JongsungValue.ㄵ ||
      jongsung === JongsungValue.ㄶ ||
      jongsung === JongsungValue.ㅅ ||
      jongsung === JongsungValue.ㅆ ||
      jongsung === JongsungValue.ㅈ ||
      jongsung === JongsungValue.ㅊ ||
      jongsung === JongsungValue.ㅎ
    ) {
      if (consonantAssimilation === ConsonantAssimilation.Progressive) {
        return 'n';
      }
      return 'l';
    }
    if (
      jongsung === JongsungValue.ㄹ ||
      jongsung === JongsungValue.ㄻ ||
      jongsung === JongsungValue.ㄽ ||
      jongsung === JongsungValue.ㄾ ||
      jongsung === JongsungValue.ㅀ ||
      jongsung === JongsungValue.ㅌ
    ) {
      return 'l';
    }

    return this.defaultPronunciation;
  }
}

// ㅂ 초성 클래스
export class ChosungB extends Chosung {
  constructor() {
    super(ChosungValue.ㅂ, 'b');
  }

  getComplexPronunciation(
    prevCharacter: KoreanCharacter,
    _currentCharacter: KoreanCharacter,
    _consonantAssimilation: ConsonantAssimilation,
    _type: Type
  ): string {
    const jongsung = prevCharacter.jongsung;

    if (jongsung === JongsungValue.ㄾ) {
      return 'pp';
    }

    return this.defaultPronunciation;
  }
}

// ㅇ 초성 클래스
export class ChosungEmpty extends Chosung {
  constructor() {
    super(ChosungValue.ㅇ, '');
  }

  getComplexPronunciation(
    prevCharacter: KoreanCharacter,
    currentCharacter: KoreanCharacter,
    _consonantAssimilation: ConsonantAssimilation,
    type: Type
  ): string {
    const jongsung = prevCharacter.jongsung;

    if (jongsung === JongsungValue.ㄱ) {
      if (type === Type.Compound && currentCharacter.getJungsungObj().isInducePalatalization()) {
        return 'n';
      }
      return 'g';
    }
    if (jongsung === JongsungValue.ㄺ) {
      return 'g';
    }
    if (jongsung === JongsungValue.ㄲ) {
      return 'kk';
    }
    if (
      jongsung === JongsungValue.ㄳ ||
      jongsung === JongsungValue.ㄽ ||
      jongsung === JongsungValue.ㅄ ||
      jongsung === JongsungValue.ㅅ
    ) {
      return 's';
    }
    if (jongsung === JongsungValue.ㅇ) {
      if (type === Type.Compound && currentCharacter.getJungsungObj().isInducePalatalization()) {
        return 'n';
      }
      return this.defaultPronunciation;
    }
    if (jongsung === JongsungValue.ㄴ || jongsung === JongsungValue.ㄶ) {
      return 'n';
    }
    if (jongsung === JongsungValue.ㄵ || jongsung === JongsungValue.ㅈ) {
      return 'j';
    }
    if (jongsung === JongsungValue.ㄷ) {
      return currentCharacter.getJungsungObj().isInducePalatalization() ? 'j' : 'd';
    }
    if (jongsung === JongsungValue.ㄹ || jongsung === JongsungValue.ㅀ) {
      if (type === Type.Compound && currentCharacter.getJungsungObj().isInducePalatalization()) {
        return 'l';
      }
      return 'r';
    }
    if (jongsung === JongsungValue.ㄻ || jongsung === JongsungValue.ㅁ) {
      return 'm';
    }
    if (jongsung === JongsungValue.ㄼ || jongsung === JongsungValue.ㅂ) {
      return 'b';
    }
    if (jongsung === JongsungValue.ㄾ || jongsung === JongsungValue.ㅌ) {
      return currentCharacter.getJungsungObj().isInducePalatalization() ? 'ch' : 't';
    }
    if (jongsung === JongsungValue.ㄿ || jongsung === JongsungValue.ㅍ) {
      return 'p';
    }
    if (jongsung === JongsungValue.ㅆ) {
      return 'ss';
    }
    if (jongsung === JongsungValue.ㅊ) {
      return 'ch';
    }
    if (jongsung === JongsungValue.ㅋ) {
      return 'k';
    }

    return this.defaultPronunciation;
  }

  isNeedHyphen(prevCharacterPronunciation: string, currentCharacterPronunciation: string): boolean {
    return prevCharacterPronunciation.endsWith('ng') && currentCharacterPronunciation.length === 0;
  }
}

// ㅈ 초성 클래스
export class ChosungJ extends Chosung {
  constructor() {
    super(ChosungValue.ㅈ, 'j');
  }

  getComplexPronunciation(
    prevCharacter: KoreanCharacter,
    _currentCharacter: KoreanCharacter,
    _consonantAssimilation: ConsonantAssimilation,
    _type: Type
  ): string {
    const jongsung = prevCharacter.jongsung;

    if (jongsung === JongsungValue.ㅎ) {
      return 'ch';
    }

    return this.defaultPronunciation;
  }
}

// ㅌ 초성 클래스
export class ChosungT extends Chosung {
  constructor() {
    super(ChosungValue.ㅌ, 't');
  }

  getComplexPronunciation(
    prevCharacter: KoreanCharacter,
    currentCharacter: KoreanCharacter,
    _consonantAssimilation: ConsonantAssimilation,
    _type: Type
  ): string {
    const jongsung = prevCharacter.jongsung;

    if (jongsung === JongsungValue.ㅈ || jongsung === JongsungValue.ㅊ) {
      return currentCharacter.getJungsungObj().isInducePalatalization() ? 'ch' : 't';
    }

    return this.defaultPronunciation;
  }

  isNeedHyphen(
    prevCharacterPronunciation: string,
    _currentCharacterPronunciation: string
  ): boolean {
    return prevCharacterPronunciation.endsWith('t');
  }
}

// ㅍ 초성 클래스
export class ChosungP extends Chosung {
  constructor() {
    super(ChosungValue.ㅍ, 'p');
  }

  isNeedHyphen(
    prevCharacterPronunciation: string,
    _currentCharacterPronunciation: string
  ): boolean {
    return prevCharacterPronunciation.endsWith('p');
  }
}

// ㅎ 초성 클래스
export class ChosungH extends Chosung {
  constructor() {
    super(ChosungValue.ㅎ, 'h');
  }

  getComplexPronunciation(
    prevCharacter: KoreanCharacter,
    currentCharacter: KoreanCharacter,
    _consonantAssimilation: ConsonantAssimilation,
    type: Type
  ): string {
    const jongsung = prevCharacter.jongsung;

    if (jongsung === JongsungValue.ㄱ) {
      if (type === Type.Substantives) {
        return this.defaultPronunciation;
      }
      return '';
    }
    if (jongsung === JongsungValue.ㄲ) {
      return 'kk';
    }
    if (jongsung === JongsungValue.ㄷ) {
      if (type === Type.Substantives) {
        return this.defaultPronunciation;
      }
      return currentCharacter.getJungsungObj().isInducePalatalization() ? 'ch' : 't';
    }
    if (
      jongsung === JongsungValue.ㄾ ||
      jongsung === JongsungValue.ㅅ ||
      jongsung === JongsungValue.ㅆ ||
      jongsung === JongsungValue.ㅈ ||
      jongsung === JongsungValue.ㅊ ||
      jongsung === JongsungValue.ㅌ
    ) {
      return currentCharacter.getJungsungObj().isInducePalatalization() ? 'ch' : 't';
    }
    if (jongsung === JongsungValue.ㄺ) {
      return 'k';
    }
    if (jongsung === JongsungValue.ㄼ) {
      return 'p';
    }
    if (jongsung === JongsungValue.ㄽ) {
      return 's';
    }
    if (jongsung === JongsungValue.ㅀ) {
      return 'r';
    }
    if (jongsung === JongsungValue.ㅂ) {
      if (type === Type.Substantives) {
        return this.defaultPronunciation;
      }
      return 'p';
    }

    return this.defaultPronunciation;
  }

  isNeedHyphen(prevCharacterPronunciation: string, currentCharacterPronunciation: string): boolean {
    return (
      currentCharacterPronunciation.length > 0 &&
      prevCharacterPronunciation.endsWith(String(currentCharacterPronunciation.charAt(0)))
    );
  }
}

/**
 * 한글의 중성
 */
export enum JungsungValue {
  ㅏ = 0,
  ㅐ = 1,
  ㅑ = 2,
  ㅒ = 3,
  ㅓ = 4,
  ㅔ = 5,
  ㅕ = 6,
  ㅖ = 7,
  ㅗ = 8,
  ㅘ = 9,
  ㅙ = 10,
  ㅚ = 11,
  ㅛ = 12,
  ㅜ = 13,
  ㅝ = 14,
  ㅞ = 15,
  ㅟ = 16,
  ㅠ = 17,
  ㅡ = 18,
  ㅢ = 19,
  ㅣ = 20,
}

/**
 * 중성 인터페이스
 */
export interface IJungsung {
  value: JungsungValue;
  defaultPronunciation: string;
  inducePalatalization: boolean;
  getPronunciation(
    prevCharacter: KoreanCharacter | null,
    currentCharacter: KoreanCharacter
  ): string;
  isInducePalatalization(): boolean;
}

// 중성 클래스
export class Jungsung implements IJungsung {
  constructor(
    public value: JungsungValue,
    public defaultPronunciation: string,
    public inducePalatalization: boolean
  ) {}

  getPronunciation(
    prevCharacter: KoreanCharacter | null,
    currentCharacter: KoreanCharacter
  ): string {
    let insertHyphen = false;

    if (
      prevCharacter?.isKoreanCharacter() &&
      prevCharacter.jongsung === JongsungValue.NONE &&
      currentCharacter.chosung === ChosungValue.ㅇ
    ) {
      const lastChar = prevCharacter
        .getJungsungObj()
        .defaultPronunciation.charAt(
          prevCharacter.getJungsungObj().defaultPronunciation.length - 1
        );

      const firstChar = this.defaultPronunciation.charAt(0);

      if (lastChar === 'a') {
        if (firstChar === 'a' || firstChar === 'e') {
          insertHyphen = true;
        }
      } else if (lastChar === 'e') {
        if (firstChar === 'a' || firstChar === 'e' || firstChar === 'o' || firstChar === 'u') {
          insertHyphen = true;
        }
      }
    }

    return insertHyphen ? `-${this.defaultPronunciation}` : this.defaultPronunciation;
  }

  isInducePalatalization(): boolean {
    return this.inducePalatalization;
  }
}

/**
 * 한글의 종성
 */
export enum JongsungValue {
  NONE = 0,
  ㄱ = 1,
  ㄲ = 2,
  ㄳ = 3,
  ㄴ = 4,
  ㄵ = 5,
  ㄶ = 6,
  ㄷ = 7,
  ㄹ = 8,
  ㄺ = 9,
  ㄻ = 10,
  ㄼ = 11,
  ㄽ = 12,
  ㄾ = 13,
  ㄿ = 14,
  ㅀ = 15,
  ㅁ = 16,
  ㅂ = 17,
  ㅄ = 18,
  ㅅ = 19,
  ㅆ = 20,
  ㅇ = 21,
  ㅈ = 22,
  ㅊ = 23,
  ㅋ = 24,
  ㅌ = 25,
  ㅍ = 26,
  ㅎ = 27,
}

/**
 * 종성 인터페이스
 */
export interface IJongsung {
  value: JongsungValue;
  defaultPronunciation: string;
  getPronunciation(
    nextCharacter: KoreanCharacter | null,
    consonantAssimilation: ConsonantAssimilation,
    type: Type
  ): string;
  getComplexPronunciation(
    nextCharacter: KoreanCharacter,
    consonantAssimilation: ConsonantAssimilation,
    type: Type
  ): string;
}

// 종성 클래스
export class Jongsung implements IJongsung {
  constructor(
    public value: JongsungValue,
    public defaultPronunciation: string
  ) {}

  getPronunciation(
    nextCharacter: KoreanCharacter | null,
    consonantAssimilation: ConsonantAssimilation,
    type: Type
  ): string {
    return nextCharacter === null || !nextCharacter.isKoreanCharacter()
      ? this.defaultPronunciation
      : this.getComplexPronunciation(nextCharacter, consonantAssimilation, type);
  }

  getComplexPronunciation(
    _nextCharacter: KoreanCharacter,
    _consonantAssimilation: ConsonantAssimilation,
    _type: Type
  ): string {
    return this.defaultPronunciation;
  }
}

// ㄱ 종성 클래스
export class JongsungG extends Jongsung {
  constructor() {
    super(JongsungValue.ㄱ, 'k');
  }

  getComplexPronunciation(
    nextCharacter: KoreanCharacter,
    _consonantAssimilation: ConsonantAssimilation,
    type: Type
  ): string {
    const chosung = nextCharacter.chosung;

    if (chosung === ChosungValue.ㄲ || chosung === ChosungValue.ㅋ) {
      return '';
    }
    if (chosung === ChosungValue.ㅇ) {
      if (type === Type.Compound && nextCharacter.getJungsungObj().isInducePalatalization()) {
        return 'ng';
      }
      return '';
    }
    if (chosung === ChosungValue.ㄴ || chosung === ChosungValue.ㅁ || chosung === ChosungValue.ㄹ) {
      return 'ng';
    }

    return this.defaultPronunciation;
  }
}

// ㄲ 종성 클래스
export class JongsungGG extends Jongsung {
  constructor() {
    super(JongsungValue.ㄲ, 'k');
  }

  getComplexPronunciation(
    nextCharacter: KoreanCharacter,
    _consonantAssimilation: ConsonantAssimilation,
    _type: Type
  ): string {
    const chosung = nextCharacter.chosung;

    if (
      chosung === ChosungValue.ㄲ ||
      chosung === ChosungValue.ㅋ ||
      chosung === ChosungValue.ㅇ ||
      chosung === ChosungValue.ㅎ
    ) {
      return '';
    }
    if (chosung === ChosungValue.ㄴ || chosung === ChosungValue.ㅁ || chosung === ChosungValue.ㄹ) {
      return 'ng';
    }

    return this.defaultPronunciation;
  }
}

// ㄳ 종성 클래스
export class JongsungGS extends Jongsung {
  constructor() {
    super(JongsungValue.ㄳ, 'k');
  }

  getComplexPronunciation(
    nextCharacter: KoreanCharacter,
    _consonantAssimilation: ConsonantAssimilation,
    _type: Type
  ): string {
    const chosung = nextCharacter.chosung;

    if (chosung === ChosungValue.ㄲ || chosung === ChosungValue.ㅋ) {
      return '';
    }
    if (chosung === ChosungValue.ㄴ || chosung === ChosungValue.ㅁ || chosung === ChosungValue.ㄹ) {
      return 'ng';
    }

    return this.defaultPronunciation;
  }
}

// ㄴ 종성 클래스
export class JongsungN extends Jongsung {
  constructor() {
    super(JongsungValue.ㄴ, 'n');
  }

  getComplexPronunciation(
    nextCharacter: KoreanCharacter,
    consonantAssimilation: ConsonantAssimilation,
    _type: Type
  ): string {
    const chosung = nextCharacter.chosung;

    if (chosung === ChosungValue.ㄹ) {
      return consonantAssimilation === ConsonantAssimilation.Regressive ? 'l' : 'n';
    }
    if (chosung === ChosungValue.ㅇ) {
      return '';
    }

    return this.defaultPronunciation;
  }
}

// ㄵ 종성 클래스
export class JongsungNJ extends Jongsung {
  constructor() {
    super(JongsungValue.ㄵ, 'n');
  }

  getComplexPronunciation(
    nextCharacter: KoreanCharacter,
    consonantAssimilation: ConsonantAssimilation,
    _type: Type
  ): string {
    const chosung = nextCharacter.chosung;

    if (chosung === ChosungValue.ㄹ) {
      return consonantAssimilation === ConsonantAssimilation.Regressive ? 'l' : 'n';
    }

    return this.defaultPronunciation;
  }
}

// ㄶ 종성 클래스
export class JongsungNH extends Jongsung {
  constructor() {
    super(JongsungValue.ㄶ, 'n');
  }

  getComplexPronunciation(
    nextCharacter: KoreanCharacter,
    consonantAssimilation: ConsonantAssimilation,
    type: Type
  ): string {
    // Java에서는 ㄴ의 로직을 재사용함
    return new JongsungN().getComplexPronunciation(nextCharacter, consonantAssimilation, type);
  }
}

// ㄷ 종성 클래스
export class JongsungD extends Jongsung {
  constructor() {
    super(JongsungValue.ㄷ, 't');
  }

  getComplexPronunciation(
    nextCharacter: KoreanCharacter,
    consonantAssimilation: ConsonantAssimilation,
    type: Type
  ): string {
    const chosung = nextCharacter.chosung;

    if (chosung === ChosungValue.ㄴ || chosung === ChosungValue.ㅁ) {
      return 'n';
    }
    if (
      chosung === ChosungValue.ㄸ ||
      chosung === ChosungValue.ㅇ ||
      chosung === ChosungValue.ㅌ ||
      chosung === ChosungValue.ㅎ
    ) {
      if (type === Type.Substantives) {
        return this.defaultPronunciation;
      }
      return '';
    }
    if (chosung === ChosungValue.ㄹ) {
      return consonantAssimilation === ConsonantAssimilation.Regressive ? 'l' : 'n';
    }

    return this.defaultPronunciation;
  }
}

// ㄹ 종성 클래스
export class JongsungL extends Jongsung {
  constructor() {
    super(JongsungValue.ㄹ, 'l');
  }

  getComplexPronunciation(
    nextCharacter: KoreanCharacter,
    _consonantAssimilation: ConsonantAssimilation,
    type: Type
  ): string {
    const chosung = nextCharacter.chosung;

    if (chosung === ChosungValue.ㅇ) {
      if (type === Type.Compound && nextCharacter.getJungsungObj().isInducePalatalization()) {
        return this.defaultPronunciation;
      }
      return '';
    }

    return this.defaultPronunciation;
  }
}

// 종성 팩토리 클래스
export class JongsungMap {
  private static instances: Map<JongsungValue, IJongsung> = new Map();

  static getJongsung(value: JongsungValue): IJongsung {
    if (!JongsungMap.instances.has(value)) {
      switch (value) {
        case JongsungValue.ㄱ:
          JongsungMap.instances.set(value, new JongsungG());
          break;
        case JongsungValue.ㄲ:
          JongsungMap.instances.set(value, new JongsungGG());
          break;
        case JongsungValue.ㄳ:
          JongsungMap.instances.set(value, new JongsungGS());
          break;
        case JongsungValue.ㄴ:
          JongsungMap.instances.set(value, new JongsungN());
          break;
        case JongsungValue.ㄵ:
          JongsungMap.instances.set(value, new JongsungNJ());
          break;
        case JongsungValue.ㄶ:
          JongsungMap.instances.set(value, new JongsungNH());
          break;
        case JongsungValue.ㄷ:
          JongsungMap.instances.set(value, new JongsungD());
          break;
        case JongsungValue.ㄹ:
          JongsungMap.instances.set(value, new JongsungL());
          break;
        case JongsungValue.ㄺ:
          JongsungMap.instances.set(value, new JongsungLG());
          break;
        case JongsungValue.ㄻ:
          JongsungMap.instances.set(value, new JongsungLM());
          break;
        case JongsungValue.ㄼ:
          JongsungMap.instances.set(value, new JongsungLB());
          break;
        case JongsungValue.ㄿ:
          JongsungMap.instances.set(value, new JongsungLP());
          break;
        case JongsungValue.ㅀ:
          JongsungMap.instances.set(value, new JongsungLH());
          break;
        case JongsungValue.ㅁ:
          JongsungMap.instances.set(value, new JongsungM());
          break;
        case JongsungValue.ㅂ:
          JongsungMap.instances.set(value, new JongsungB());
          break;
        case JongsungValue.ㅄ:
          JongsungMap.instances.set(value, new JongsungBS());
          break;
        case JongsungValue.ㅅ:
          JongsungMap.instances.set(value, new JongsungS());
          break;
        case JongsungValue.ㅆ:
          JongsungMap.instances.set(value, new JongsungS()); // ㅅ과 동일 로직
          break;
        case JongsungValue.ㅎ:
          JongsungMap.instances.set(value, new JongsungH());
          break;
        default:
          JongsungMap.instances.set(
            value,
            new Jongsung(value, jongsungDefaultPronunciations[value])
          );
          break;
      }
    }
    return JongsungMap.instances.get(value)!;
  }
}

// 초성, 중성, 종성 객체 매핑
export class ChosungMap {
  private static instances: Map<ChosungValue, IChosung> = new Map();

  static getChosung(value: ChosungValue): IChosung {
    if (!ChosungMap.instances.has(value)) {
      switch (value) {
        case ChosungValue.ㄱ:
          ChosungMap.instances.set(value, new ChosungG());
          break;
        case ChosungValue.ㄴ:
          ChosungMap.instances.set(value, new ChosungN());
          break;
        case ChosungValue.ㄷ:
          ChosungMap.instances.set(value, new ChosungD());
          break;
        case ChosungValue.ㄹ:
          ChosungMap.instances.set(value, new ChosungL());
          break;
        case ChosungValue.ㅂ:
          ChosungMap.instances.set(value, new ChosungB());
          break;
        case ChosungValue.ㅇ:
          ChosungMap.instances.set(value, new ChosungEmpty());
          break;
        case ChosungValue.ㅈ:
          ChosungMap.instances.set(value, new ChosungJ());
          break;
        case ChosungValue.ㅌ:
          ChosungMap.instances.set(value, new ChosungT());
          break;
        case ChosungValue.ㅍ:
          ChosungMap.instances.set(value, new ChosungP());
          break;
        case ChosungValue.ㅎ:
          ChosungMap.instances.set(value, new ChosungH());
          break;
        default:
          ChosungMap.instances.set(value, new Chosung(value, chosungDefaultPronunciations[value]));
          break;
      }
    }
    return ChosungMap.instances.get(value)!;
  }
}

// 나머지 클래스 매핑 구현...

// 기본 발음 매핑
const chosungDefaultPronunciations: { [key in ChosungValue]: string } = {
  [ChosungValue.ㄱ]: 'g',
  [ChosungValue.ㄲ]: 'kk',
  [ChosungValue.ㄴ]: 'n',
  [ChosungValue.ㄷ]: 'd',
  [ChosungValue.ㄸ]: 'tt',
  [ChosungValue.ㄹ]: 'r',
  [ChosungValue.ㅁ]: 'm',
  [ChosungValue.ㅂ]: 'b',
  [ChosungValue.ㅃ]: 'pp',
  [ChosungValue.ㅅ]: 's',
  [ChosungValue.ㅆ]: 'ss',
  [ChosungValue.ㅇ]: '',
  [ChosungValue.ㅈ]: 'j',
  [ChosungValue.ㅉ]: 'jj',
  [ChosungValue.ㅊ]: 'ch',
  [ChosungValue.ㅋ]: 'k',
  [ChosungValue.ㅌ]: 't',
  [ChosungValue.ㅍ]: 'p',
  [ChosungValue.ㅎ]: 'h',
};

const jungsungDefaultPronunciations: { [key in JungsungValue]: string } = {
  [JungsungValue.ㅏ]: 'a',
  [JungsungValue.ㅐ]: 'ae',
  [JungsungValue.ㅑ]: 'ya',
  [JungsungValue.ㅒ]: 'yae',
  [JungsungValue.ㅓ]: 'eo',
  [JungsungValue.ㅔ]: 'e',
  [JungsungValue.ㅕ]: 'yeo',
  [JungsungValue.ㅖ]: 'ye',
  [JungsungValue.ㅗ]: 'o',
  [JungsungValue.ㅘ]: 'wa',
  [JungsungValue.ㅙ]: 'wae',
  [JungsungValue.ㅚ]: 'oe',
  [JungsungValue.ㅛ]: 'yo',
  [JungsungValue.ㅜ]: 'u',
  [JungsungValue.ㅝ]: 'wo',
  [JungsungValue.ㅞ]: 'we',
  [JungsungValue.ㅟ]: 'wi',
  [JungsungValue.ㅠ]: 'yu',
  [JungsungValue.ㅡ]: 'eu',
  [JungsungValue.ㅢ]: 'ui',
  [JungsungValue.ㅣ]: 'i',
};

const jungsungPalatalization: { [key in JungsungValue]: boolean } = {
  [JungsungValue.ㅏ]: false,
  [JungsungValue.ㅐ]: false,
  [JungsungValue.ㅑ]: true,
  [JungsungValue.ㅒ]: true,
  [JungsungValue.ㅓ]: false,
  [JungsungValue.ㅔ]: false,
  [JungsungValue.ㅕ]: true,
  [JungsungValue.ㅖ]: true,
  [JungsungValue.ㅗ]: false,
  [JungsungValue.ㅘ]: false,
  [JungsungValue.ㅙ]: false,
  [JungsungValue.ㅚ]: false,
  [JungsungValue.ㅛ]: true,
  [JungsungValue.ㅜ]: false,
  [JungsungValue.ㅝ]: false,
  [JungsungValue.ㅞ]: false,
  [JungsungValue.ㅟ]: false,
  [JungsungValue.ㅠ]: true,
  [JungsungValue.ㅡ]: false,
  [JungsungValue.ㅢ]: false,
  [JungsungValue.ㅣ]: true,
};

const jongsungDefaultPronunciations: { [key in JongsungValue]: string } = {
  [JongsungValue.NONE]: '',
  [JongsungValue.ㄱ]: 'k',
  [JongsungValue.ㄲ]: 'k',
  [JongsungValue.ㄳ]: 'k',
  [JongsungValue.ㄴ]: 'n',
  [JongsungValue.ㄵ]: 'n',
  [JongsungValue.ㄶ]: 'n',
  [JongsungValue.ㄷ]: 't',
  [JongsungValue.ㄹ]: 'l',
  [JongsungValue.ㄺ]: 'k',
  [JongsungValue.ㄻ]: 'm',
  [JongsungValue.ㄼ]: 'l',
  [JongsungValue.ㄽ]: 'l',
  [JongsungValue.ㄾ]: 'l',
  [JongsungValue.ㄿ]: 'l',
  [JongsungValue.ㅀ]: 'l',
  [JongsungValue.ㅁ]: 'm',
  [JongsungValue.ㅂ]: 'p',
  [JongsungValue.ㅄ]: 'p',
  [JongsungValue.ㅅ]: 't',
  [JongsungValue.ㅆ]: 't',
  [JongsungValue.ㅇ]: 'ng',
  [JongsungValue.ㅈ]: 't',
  [JongsungValue.ㅊ]: 't',
  [JongsungValue.ㅋ]: 'k',
  [JongsungValue.ㅌ]: 't',
  [JongsungValue.ㅍ]: 'p',
  [JongsungValue.ㅎ]: 't',
};

export class KoreanCharacter {
  private static readonly KOREAN_LOWER_VALUE = 0xac00;
  private static readonly KOREAN_UPPER_VALUE = 0xd7a3;

  private readonly char: string;
  private readonly code: number;
  private readonly isHangul: boolean;

  public readonly chosung: ChosungValue;
  public readonly jungsung: JungsungValue;
  public readonly jongsung: JongsungValue;

  private chosungObj: IChosung | null = null;
  private jungsungObj: IJungsung | null = null;
  private jongsungObj: IJongsung | null = null;

  constructor(char: string) {
    this.char = char;
    this.code = char.charCodeAt(0);
    this.isHangul =
      this.code >= KoreanCharacter.KOREAN_LOWER_VALUE &&
      this.code <= KoreanCharacter.KOREAN_UPPER_VALUE;

    if (this.isHangul) {
      const base = this.code - KoreanCharacter.KOREAN_LOWER_VALUE;
      this.jongsung = (base % 28) as JongsungValue;
      this.jungsung = (Math.floor((base - this.jongsung) / 28) % 21) as JungsungValue;
      this.chosung = Math.floor((base - this.jongsung) / 28 / 21) as ChosungValue;
    } else {
      this.chosung = -1 as unknown as ChosungValue;
      this.jungsung = -1 as unknown as JungsungValue;
      this.jongsung = -1 as unknown as JongsungValue;
    }
  }

  public isKoreanCharacter(): boolean {
    return this.isHangul;
  }

  public toString(): string {
    return this.char;
  }

  public getChosungObj(): IChosung {
    if (this.chosungObj === null) {
      this.chosungObj = ChosungMap.getChosung(this.chosung);
    }
    return this.chosungObj;
  }

  public getJungsungObj(): IJungsung {
    if (this.jungsungObj === null) {
      this.jungsungObj = new Jungsung(
        this.jungsung,
        jungsungDefaultPronunciations[this.jungsung],
        jungsungPalatalization[this.jungsung]
      );
    }
    return this.jungsungObj;
  }

  public getJongsungObj(): IJongsung {
    if (this.jongsungObj === null) {
      // JongsungMap을 사용하여 특별한 종성 객체를 가져옴
      this.jongsungObj = JongsungMap.getJongsung(this.jongsung);
    }
    return this.jongsungObj;
  }

  public getRomanizedString(
    prevCharacter: KoreanCharacter | null,
    nextCharacter: KoreanCharacter | null,
    consonantAssimilation: ConsonantAssimilation,
    type: Type
  ): string {
    if (!this.isHangul) {
      return this.char;
    }

    if (type === Type.Name || type === Type.NameTypical) {
      prevCharacter = null;
      nextCharacter = null;
    }

    const chosung = this.getChosungObj().getPronunciation(
      prevCharacter,
      this,
      consonantAssimilation,
      type
    );

    const jungsung = this.getJungsungObj().getPronunciation(prevCharacter, this);

    const jongsung = this.getJongsungObj().getPronunciation(
      nextCharacter,
      consonantAssimilation,
      type
    );

    return chosung + jungsung + jongsung;
  }

  public static isKoreanCharacter(character: string): boolean {
    if (character.length !== 1) {
      return false;
    }
    const charCode = character.charCodeAt(0);
    return (
      charCode >= KoreanCharacter.KOREAN_LOWER_VALUE &&
      charCode <= KoreanCharacter.KOREAN_UPPER_VALUE
    );
  }
}

// ㄺ 종성 클래스
export class JongsungLG extends Jongsung {
  constructor() {
    super(JongsungValue.ㄺ, 'k');
  }

  getComplexPronunciation(
    nextCharacter: KoreanCharacter,
    _consonantAssimilation: ConsonantAssimilation,
    _type: Type
  ): string {
    const chosung = nextCharacter.chosung;

    if (
      chosung === ChosungValue.ㄱ ||
      chosung === ChosungValue.ㄲ ||
      chosung === ChosungValue.ㅇ ||
      chosung === ChosungValue.ㅎ
    ) {
      return 'l'; // 'ㄹ'로 발음
    }
    if (chosung === ChosungValue.ㄴ || chosung === ChosungValue.ㄹ || chosung === ChosungValue.ㅁ) {
      return 'ng';
    }

    return this.defaultPronunciation;
  }
}

// ㄻ 종성 클래스
export class JongsungLM extends Jongsung {
  constructor() {
    super(JongsungValue.ㄻ, 'm');
  }

  getComplexPronunciation(
    nextCharacter: KoreanCharacter,
    _consonantAssimilation: ConsonantAssimilation,
    _type: Type
  ): string {
    const chosung = nextCharacter.chosung;

    if (chosung === ChosungValue.ㄹ || chosung === ChosungValue.ㅁ || chosung === ChosungValue.ㅇ) {
      return 'l';
    }

    return this.defaultPronunciation;
  }
}

// ㄼ 종성 클래스
export class JongsungLB extends Jongsung {
  constructor() {
    super(JongsungValue.ㄼ, 'l');
  }

  getComplexPronunciation(
    nextCharacter: KoreanCharacter,
    _consonantAssimilation: ConsonantAssimilation,
    _type: Type
  ): string {
    const chosung = nextCharacter.chosung;

    if (chosung === ChosungValue.ㄴ || chosung === ChosungValue.ㄹ) {
      return 'm';
    }
    if (
      chosung === ChosungValue.ㄷ ||
      chosung === ChosungValue.ㄸ ||
      chosung === ChosungValue.ㅂ ||
      chosung === ChosungValue.ㅅ ||
      chosung === ChosungValue.ㅆ ||
      chosung === ChosungValue.ㅈ ||
      chosung === ChosungValue.ㅉ ||
      chosung === ChosungValue.ㅊ ||
      chosung === ChosungValue.ㅋ ||
      chosung === ChosungValue.ㅌ ||
      chosung === ChosungValue.ㅎ
    ) {
      return 'p';
    }
    if (chosung === ChosungValue.ㅃ) {
      return '';
    }

    return this.defaultPronunciation;
  }
}

// ㄿ 종성 클래스
export class JongsungLP extends Jongsung {
  constructor() {
    super(JongsungValue.ㄿ, 'l');
  }

  getComplexPronunciation(
    nextCharacter: KoreanCharacter,
    _consonantAssimilation: ConsonantAssimilation,
    _type: Type
  ): string {
    const chosung = nextCharacter.chosung;

    if (chosung === ChosungValue.ㄴ || chosung === ChosungValue.ㄹ) {
      return 'm';
    }
    if (
      chosung === ChosungValue.ㄷ ||
      chosung === ChosungValue.ㄸ ||
      chosung === ChosungValue.ㅂ ||
      chosung === ChosungValue.ㅅ ||
      chosung === ChosungValue.ㅆ ||
      chosung === ChosungValue.ㅈ ||
      chosung === ChosungValue.ㅉ ||
      chosung === ChosungValue.ㅊ ||
      chosung === ChosungValue.ㅋ ||
      chosung === ChosungValue.ㅌ ||
      chosung === ChosungValue.ㅎ
    ) {
      return 'p';
    }
    if (chosung === ChosungValue.ㅃ || chosung === ChosungValue.ㅍ) {
      return '';
    }

    return this.defaultPronunciation;
  }
}

// ㅀ 종성 클래스
export class JongsungLH extends Jongsung {
  constructor() {
    super(JongsungValue.ㅀ, 'l');
  }

  getComplexPronunciation(
    nextCharacter: KoreanCharacter,
    _consonantAssimilation: ConsonantAssimilation,
    type: Type
  ): string {
    const chosung = nextCharacter.chosung;

    if (chosung === ChosungValue.ㅎ) {
      return '';
    }
    if (chosung === ChosungValue.ㅇ) {
      if (type === Type.Compound && nextCharacter.getJungsungObj().isInducePalatalization()) {
        return this.defaultPronunciation;
      }
      return '';
    }

    return this.defaultPronunciation;
  }
}

// ㅁ 종성 클래스
export class JongsungM extends Jongsung {
  constructor() {
    super(JongsungValue.ㅁ, 'm');
  }

  getComplexPronunciation(
    nextCharacter: KoreanCharacter,
    _consonantAssimilation: ConsonantAssimilation,
    _type: Type
  ): string {
    const chosung = nextCharacter.chosung;

    if (chosung === ChosungValue.ㅇ) {
      return '';
    }

    return this.defaultPronunciation;
  }
}

// ㅂ 종성 클래스
export class JongsungB extends Jongsung {
  constructor() {
    super(JongsungValue.ㅂ, 'p');
  }

  getComplexPronunciation(
    nextCharacter: KoreanCharacter,
    _consonantAssimilation: ConsonantAssimilation,
    type: Type
  ): string {
    const chosung = nextCharacter.chosung;

    if (chosung === ChosungValue.ㄴ || chosung === ChosungValue.ㄹ || chosung === ChosungValue.ㅁ) {
      return 'm';
    }
    if (chosung === ChosungValue.ㅃ || chosung === ChosungValue.ㅇ) {
      return '';
    }
    if (chosung === ChosungValue.ㅎ) {
      if (type === Type.Substantives) {
        return this.defaultPronunciation;
      }
      return '';
    }

    return this.defaultPronunciation;
  }
}

// ㅄ 종성 클래스
export class JongsungBS extends Jongsung {
  constructor() {
    super(JongsungValue.ㅄ, 'p');
  }

  getComplexPronunciation(
    nextCharacter: KoreanCharacter,
    _consonantAssimilation: ConsonantAssimilation,
    _type: Type
  ): string {
    const chosung = nextCharacter.chosung;

    if (chosung === ChosungValue.ㄴ || chosung === ChosungValue.ㄹ || chosung === ChosungValue.ㅁ) {
      return 'm';
    }
    if (chosung === ChosungValue.ㅃ) {
      return '';
    }

    return this.defaultPronunciation;
  }
}

// ㅅ 종성 클래스 (ㄷ과 동일한 로직)
export class JongsungS extends Jongsung {
  constructor() {
    super(JongsungValue.ㅅ, 't');
  }

  getComplexPronunciation(
    nextCharacter: KoreanCharacter,
    consonantAssimilation: ConsonantAssimilation,
    type: Type
  ): string {
    // Java에서는 ㄷ의 로직을 재사용함
    return new JongsungD().getComplexPronunciation(nextCharacter, consonantAssimilation, type);
  }
}

// ㅎ 종성 클래스
export class JongsungH extends Jongsung {
  constructor() {
    super(JongsungValue.ㅎ, 't');
  }

  getComplexPronunciation(
    nextCharacter: KoreanCharacter,
    consonantAssimilation: ConsonantAssimilation,
    _type: Type
  ): string {
    const chosung = nextCharacter.chosung;

    if (
      chosung === ChosungValue.ㄱ ||
      chosung === ChosungValue.ㄲ ||
      chosung === ChosungValue.ㄷ ||
      chosung === ChosungValue.ㄸ ||
      chosung === ChosungValue.ㅇ ||
      chosung === ChosungValue.ㅈ ||
      chosung === ChosungValue.ㅉ ||
      chosung === ChosungValue.ㅊ ||
      chosung === ChosungValue.ㅋ ||
      chosung === ChosungValue.ㅌ ||
      chosung === ChosungValue.ㅍ ||
      chosung === ChosungValue.ㅎ
    ) {
      return '';
    }
    if (chosung === ChosungValue.ㄴ || chosung === ChosungValue.ㅁ) {
      return 'n';
    }
    if (chosung === ChosungValue.ㄹ) {
      return consonantAssimilation === ConsonantAssimilation.Regressive ? 'l' : 'n';
    }

    return this.defaultPronunciation;
  }
}
