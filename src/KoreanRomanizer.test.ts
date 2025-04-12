import {
  KoreanRomanizer,
  Type,
  ConsonantAssimilation,
} from "./KoreanRomanizer";
import { KoreanCharacter } from "./KoreanCharacter";

describe("KoreanRomanizer", () => {
  describe("KoreanCharacter", () => {
    it("한글이 아닌 문자를 처리한다", () => {
      const c = new KoreanCharacter(" ");
      expect(c.isKoreanCharacter()).toBeFalsy();
      expect(c.toString()).toBe(" ");
      expect(
        c.getRomanizedString(
          null,
          null,
          ConsonantAssimilation.Regressive,
          Type.Typical
        )
      ).toBe(" ");
    });
  });

  describe("exception", () => {
    it("null이나 빈 문자열을 처리한다", () => {
      expect(() => KoreanRomanizer.romanize(null as unknown as string)).toThrow(
        "String should not be null."
      );
      expect(KoreanRomanizer.romanize("")).toBe("");
    });
  });

  describe("testByConsonantAssimilation", () => {
    it("자음 동화를 처리한다", () => {
      expect(
        KoreanRomanizer.romanize("백로", ConsonantAssimilation.Regressive)
      ).toBe("Baengno");
      expect(
        KoreanRomanizer.romanize("백로", ConsonantAssimilation.Progressive)
      ).toBe("Baengno");
      expect(
        KoreanRomanizer.romanize("디귿리을", ConsonantAssimilation.Regressive)
      ).toBe("Digeullieul");
      expect(
        KoreanRomanizer.romanize("디귿리을", ConsonantAssimilation.Progressive)
      ).toBe("Digeunnieul");
      expect(
        KoreanRomanizer.romanize("압록강", ConsonantAssimilation.Regressive)
      ).toBe("Amnokgang");
      expect(
        KoreanRomanizer.romanize("압록강", ConsonantAssimilation.Progressive)
      ).toBe("Amnokgang");
      expect(
        KoreanRomanizer.romanize("왕십리", ConsonantAssimilation.Regressive)
      ).toBe("Wangsimni");
      expect(
        KoreanRomanizer.romanize("왕십리", ConsonantAssimilation.Progressive)
      ).toBe("Wangsimni");
      expect(
        KoreanRomanizer.romanize("협력", ConsonantAssimilation.Regressive)
      ).toBe("Hyeomnyeok");
      expect(
        KoreanRomanizer.romanize("협력", ConsonantAssimilation.Progressive)
      ).toBe("Hyeomnyeok");
      expect(
        KoreanRomanizer.romanize("설날", ConsonantAssimilation.Regressive)
      ).toBe("Seollal");
      expect(
        KoreanRomanizer.romanize("설날", ConsonantAssimilation.Progressive)
      ).toBe("Seollal");
      expect(
        KoreanRomanizer.romanize("생산량", ConsonantAssimilation.Regressive)
      ).toBe("Saengsallyang");
      expect(
        KoreanRomanizer.romanize("생산량", ConsonantAssimilation.Progressive)
      ).toBe("Saengsannyang");
      expect(
        KoreanRomanizer.romanize("신라면", ConsonantAssimilation.Regressive)
      ).toBe("Sillamyeon");
      expect(
        KoreanRomanizer.romanize("신라면", ConsonantAssimilation.Progressive)
      ).toBe("Sinnamyeon");
      expect(
        KoreanRomanizer.romanize("원심력", ConsonantAssimilation.Regressive)
      ).toBe("Wonsimnyeok");
      expect(
        KoreanRomanizer.romanize("원심력", ConsonantAssimilation.Progressive)
      ).toBe("Wonsimnyeok");
      expect(
        KoreanRomanizer.romanize("망라", ConsonantAssimilation.Regressive)
      ).toBe("Mangna");
      expect(
        KoreanRomanizer.romanize("망라", ConsonantAssimilation.Progressive)
      ).toBe("Mangna");
    });
  });

  describe("testByType", () => {
    it("단어 유형에 따라 처리한다", () => {
      expect(KoreanRomanizer.romanize("각하", Type.Typical)).toBe("Gaka");
      expect(KoreanRomanizer.romanize("각하", Type.Substantives)).toBe("Gakha");
      expect(KoreanRomanizer.romanize("맏항", Type.Typical)).toBe("Matang");
      expect(KoreanRomanizer.romanize("맏항", Type.Substantives)).toBe(
        "Mathang"
      );
      expect(KoreanRomanizer.romanize("법학", Type.Typical)).toBe("Beopak");
      expect(KoreanRomanizer.romanize("법학", Type.Substantives)).toBe(
        "Beophak"
      );
      expect(KoreanRomanizer.romanize("색연필", Type.Typical)).toBe(
        "Saegyeonpil"
      );
      expect(KoreanRomanizer.romanize("색연필", Type.Compound)).toBe(
        "Saengnyeonpil"
      );
      expect(KoreanRomanizer.romanize("콩엿", Type.Typical)).toBe("Kong-yeot");
      expect(KoreanRomanizer.romanize("콩엿", Type.Compound)).toBe("Kongnyeot");
      expect(KoreanRomanizer.romanize("종로2가", Type.Typical)).toBe(
        "Jongno2Ga"
      );
      expect(KoreanRomanizer.romanize("종로2가", Type.District)).toBe(
        "Jongno 2-ga"
      );
      expect(KoreanRomanizer.romanize("성남대로2번길", Type.Typical)).toBe(
        "Seongnamdaero2Beon-gil"
      );
      expect(KoreanRomanizer.romanize("성남대로2번길", Type.District)).toBe(
        "Seongnam-daero 2beon-gil"
      );
      expect(KoreanRomanizer.romanize("이지은", Type.Typical)).toBe("Ijieun");
      expect(KoreanRomanizer.romanize("이지은", Type.Name)).toBe("I Jieun");
      expect(KoreanRomanizer.romanize("제갈공명", Type.Typical)).toBe(
        "Jegalgongmyeong"
      );
      expect(KoreanRomanizer.romanize("제갈공명", Type.Name)).toBe(
        "Jegal Gongmyeong"
      );
      expect(KoreanRomanizer.romanize("박화요비", Type.Typical)).toBe(
        "Bakwayobi"
      );
      expect(KoreanRomanizer.romanize("박화요비", Type.Name)).toBe(
        "Bak Hwayobi"
      );
    });
  });

  describe("testMisc", () => {
    it("기타 케이스를 처리한다", () => {
      expect(KoreanRomanizer.romanize("않다")).toBe("Anta");
    });
  });

  describe("testName", () => {
    it("이름을 처리한다", () => {
      expect(KoreanRomanizer.romanize("김수현", Type.Name)).toBe("Gim Suhyeon");
      expect(KoreanRomanizer.romanize("김수현", Type.NameTypical)).toBe(
        "Kim Suhyeon"
      );
      expect(KoreanRomanizer.romanize("이세돌", Type.Name)).toBe("I Sedol");
      expect(KoreanRomanizer.romanize("이세돌", Type.NameTypical)).toBe(
        "Lee Sedol"
      );
      expect(KoreanRomanizer.romanize("박보검", Type.Name)).toBe("Bak Bogeom");
      expect(KoreanRomanizer.romanize("박보검", Type.NameTypical)).toBe(
        "Park Bogeom"
      );
      expect(KoreanRomanizer.romanize("최시원", Type.Name)).toBe("Choe Siwon");
      expect(KoreanRomanizer.romanize("최시원", Type.NameTypical)).toBe(
        "Choi Siwon"
      );
      expect(KoreanRomanizer.romanize("선우은숙", Type.Name)).toBe(
        "Seonu Eunsuk"
      );
      expect(KoreanRomanizer.romanize("선우은숙", Type.NameTypical)).toBe(
        "Sunwoo Eunsuk"
      );
    });
  });

  describe("testLongText", () => {
    it("긴 텍스트를 처리한다", () => {
      const koreanText =
        "여름장이란 애시당초에 글러서, 해는 아직 중천에 있건만 장판은 벌써 쓸쓸하고 더운 햇발이 벌여놓은 전 휘장 밑으로 등줄기를 훅훅 볶는다.";
      const romanizedText =
        "Yeoreumjang-iran Aesidangchoe Geulleoseo, Haeneun Ajik Jungcheone Itgeonman Jangpaneun Beolsseo Sseulsseulhago Deoun Haetbari Beoryeonoeun Jeon Hwijang Mitteuro Deungjulgireul Hukuk Bongneunda.";
      expect(KoreanRomanizer.romanize(koreanText)).toBe(romanizedText);
    });
  });
});
