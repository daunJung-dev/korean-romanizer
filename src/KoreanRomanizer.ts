import {
  KoreanCharacter,
  ConsonantAssimilation,
  Type,
} from "./KoreanCharacter";

/**
 * 한글을 로마자로 변환하는 TypeScript 라이브러리.
 * 국립국어원 로마자 표기법을 기반으로 구현되었으며, 많은 부분을 커버할 수 있지만
 * 한글의 특성상 단어 사전 데이터가 없으면 100% 구현하기 어려워 완벽하지는 않습니다.
 */
export namespace KoreanRomanizer {
  const DOUBLE_SURNAME_REGEX =
    /^(\s*)(강전|남궁|독고|동방|등정|망절|무본|사공|서문|선우|소봉|어금|장곡|제갈|황목|황보)(.{1,10})$/;
  const DISTRICT_POSTFIX_REGEX =
    /^(.{1,20}?)(특별자치도|특별자치시|특별시|광역시|대로|구|군|도|동|리|면|시|읍|가|길|로)(\s*)$/;
  const DISTRICT_POSTFIXES_WITH_NUMBERS1 =
    /^(.{0,20}?)(\d+)(\s*)(가길|가|번길|로|단지|동)(\s*)$/;
  const DISTRICT_POSTFIXES_WITH_NUMBERS2 =
    /^(.{0,20}?)(대?로)\s*(\d+[가번]?)(길)(\s*)$/;

  const TYPICAL_SURNAME_MAP: { [key: string]: string } = {
    가: "Ka",
    간: "Kan",
    갈: "Kal",
    감: "Kam",
    강: "Kang",
    강전: "Kangjun",
    견: "Kyun",
    경: "Kyung",
    계: "Kye",
    고: "Ko",
    공: "Kong",
    곽: "Kwak",
    구: "Koo",
    국: "Kook",
    군: "Kun",
    궁: "Koong",
    궉: "Kwok",
    권: "Kwon",
    근: "Keun",
    금: "Keum",
    기: "Ki",
    길: "Kil",
    김: "Kim",
    노: "Noh",
    두: "Doo",
    란: "Lan",
    뢰: "Loi",
    루: "Lu",
    망절: "Mangjul",
    명: "Myung",
    문: "Moon",
    박: "Park",
    변: "Byun",
    부: "Boo",
    선: "Sun",
    선우: "Sunwoo",
    성: "Sung",
    순: "Soon",
    신: "Shin",
    심: "Shim",
    아: "Ah",
    어금: "Eokum",
    오: "Oh",
    우: "Woo",
    운: "Woon",
    유: "Yoo",
    윤: "Yoon",
    이: "Lee",
    임: "Lim",
    정: "Jung",
    조: "Cho",
    주: "Joo",
    준: "June",
    즙: "Chup",
    최: "Choi",
    편: "Pyun",
    평: "Pyung",
    풍: "Poong",
    현: "Hyun",
    형: "Hyung",
    흥: "Hong",
  };

  /**
   * 로마자 변환 옵션 인터페이스
   */
  export interface RomanizeOptions {
    type?: Type;
    consonantAssimilation?: ConsonantAssimilation;
  }

  /**
   * 문자열을 로마자로 변환합니다.
   *
   * @param input 로마자로 변환할 문자열
   * @param options 로마자 변환 옵션 (type과 consonantAssimilation)
   * @returns 로마자로 변환된 문자열
   * @throws input이 null인 경우 오류 발생
   */
  export function romanize(
    input: string,
    options?: RomanizeOptions | Type | ConsonantAssimilation
  ): string {
    if (input === null) {
      throw new Error("String should not be null.");
    }

    if (input.trim().length === 0) {
      return "";
    }

    // 옵션 파라미터 처리
    let type: Type = Type.Typical;
    let consonantAssimilation: ConsonantAssimilation =
      ConsonantAssimilation.Regressive;

    if (options !== undefined) {
      if (typeof options === "object") {
        // RomanizeOptions 객체인 경우
        type = options.type || Type.Typical;
        consonantAssimilation =
          options.consonantAssimilation || ConsonantAssimilation.Regressive;
      } else if (Object.values(Type).includes(options as Type)) {
        // Type enum 값인 경우
        type = options as Type;
      } else if (
        Object.values(ConsonantAssimilation).includes(
          options as ConsonantAssimilation
        )
      ) {
        // ConsonantAssimilation enum 값인 경우
        consonantAssimilation = options as ConsonantAssimilation;
      }
    }

    // 공백으로 구분된 부분을 처리
    if (
      input.indexOf(" ") > 0 &&
      (type === Type.Name || type === Type.NameTypical)
    ) {
      const parts = input.split(" ");
      let result = "";
      for (let i = 0; i < parts.length; i++) {
        if (i > 0) result += " ";
        result += romanize(parts[i], { type, consonantAssimilation });
      }
      return result;
    }

    let normalizedInput = input;
    switch (type) {
      case Type.Name:
      case Type.NameTypical:
        normalizedInput = normalizeName(input, type);
        break;
      case Type.District:
        normalizedInput = normalizeDistrict(input);
        break;
      case Type.Typical:
        // 기본값으로 처리 - 커버리지를 위해 추가
        break;
    }

    let result = "";
    let prevCharacter: KoreanCharacter | null = null;
    let currentCharacter: KoreanCharacter | null = null;
    let nextCharacter: KoreanCharacter | null = null;

    const chars = normalizedInput.split("");
    for (let i = 0; i < chars.length; i++) {
      const currentChar = chars[i];
      prevCharacter = currentCharacter;
      currentCharacter = new KoreanCharacter(currentChar);
      nextCharacter =
        i < chars.length - 1 ? new KoreanCharacter(chars[i + 1]) : null;

      if (currentCharacter.isKoreanCharacter()) {
        let romanized = currentCharacter.getRomanizedString(
          prevCharacter,
          nextCharacter,
          consonantAssimilation,
          type
        );

        if (prevCharacter === null || !prevCharacter.isKoreanCharacter()) {
          if (
            type === Type.District &&
            prevCharacter !== null &&
            (prevCharacter.toString() === "-" ||
              !isNaN(Number(prevCharacter.toString())))
          ) {
            result += romanized;
          } else {
            result += romanized.charAt(0).toUpperCase() + romanized.slice(1);
          }
        } else {
          result += romanized;
        }
      } else {
        result += currentChar;
      }
    }
    return result;
  }

  /**
   * 이름 문자열을 정규화합니다.
   *
   * @param input 정규화할 이름 문자열
   * @param type 단어의 유형
   * @returns 정규화된 이름 문자열
   */
  function normalizeName(input: string, type: Type): string {
    const matcher = DOUBLE_SURNAME_REGEX.exec(input);

    if (type === Type.NameTypical) {
      if (matcher && matcher.length > 3) {
        return (
          matcher[1] +
          (TYPICAL_SURNAME_MAP[matcher[2]] || matcher[2]) +
          " " +
          matcher[3]
        );
      } else {
        const typicalSurname = TYPICAL_SURNAME_MAP[input.charAt(0)];
        if (typicalSurname) {
          return typicalSurname + " " + input.substring(1);
        } else {
          return input.charAt(0) + " " + input.substring(1);
        }
      }
    } else {
      if (matcher && matcher.length > 3) {
        return matcher[1] + matcher[2] + " " + matcher[3];
      } else {
        return input.charAt(0) + " " + input.substring(1);
      }
    }
  }

  /**
   * 지역명 문자열을 정규화합니다.
   *
   * @param input 정규화할 지역명 문자열
   * @returns 정규화된 지역명 문자열
   */
  function normalizeDistrict(input: string): string {
    let matcher = DISTRICT_POSTFIXES_WITH_NUMBERS2.exec(input);

    if (matcher) {
      return (
        matcher[1] +
        "-" +
        matcher[2] +
        " " +
        matcher[3] +
        "-" +
        matcher[4] +
        matcher[5]
      );
    } else {
      matcher = DISTRICT_POSTFIXES_WITH_NUMBERS1.exec(input);
      if (matcher) {
        return (
          matcher[1] +
          (matcher[1].endsWith(" ") ? "" : " ") +
          matcher[2] +
          "-" +
          matcher[4] +
          matcher[5]
        );
      } else {
        matcher = DISTRICT_POSTFIX_REGEX.exec(input);
        if (matcher) {
          return matcher[1] + "-" + matcher[2] + matcher[3];
        }
      }
    }

    return input;
  }

  /**
   * 타입을 지정하여 문자열을 로마자로 변환합니다.
   *
   * @param input 로마자로 변환할 문자열
   * @param type 단어의 유형
   * @returns 타입에 따라 변환된 로마자 문자열
   */
  export function romanizeWithType(input: string, type: Type): string {
    if (input === null) {
      throw new Error("String should not be null.");
    }

    if (input.trim().length === 0) {
      return "";
    }

    // 공백으로 구분된 부분을 처리
    if (input.indexOf(" ") > 0) {
      const parts = input.split(" ");
      const result: string[] = [];

      for (let i = 0; i < parts.length; i++) {
        // 특별처리: 이름 타입일 경우 첫 번째 또는 두 번째 요소만 이름으로 처리하고 나머지는 일반 타입으로 처리
        if ((type === Type.Name || type === Type.NameTypical) && i <= 1) {
          result.push(romanizeWithType(parts[i], type));
        } else if (type === Type.District) {
          // 지역명은 모든 부분을 지역명으로 처리
          result.push(romanize(parts[i], { type: Type.District }));
        } else {
          // 그 외의 경우 일반 타입으로 처리
          result.push(romanize(parts[i], { type: Type.Typical }));
        }
      }

      return result.join(" ");
    }

    return romanize(input, { type });
  }

  /**
   * 자음 동화 규칙이 적용된 문자열을 로마자로 변환합니다.
   *
   * @param input 로마자로 변환할 문자열
   * @param consonantAssimilation 자음 동화 유형
   * @returns 자음 동화가 적용된 로마자 문자열
   */
  export function romanizeWithAssimilation(
    input: string,
    consonantAssimilation: ConsonantAssimilation
  ): string {
    return romanize(input, { consonantAssimilation });
  }
}

export { ConsonantAssimilation, Type };
