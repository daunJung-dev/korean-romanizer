import { KoreanCharacter } from './KoreanCharacter';
import { ConsonantAssimilation, KoreanRomanizer, Type } from './KoreanRomanizer';

describe('KoreanRomanizer', () => {
  describe('KoreanCharacter', () => {
    it('한글이 아닌 문자를 처리한다', () => {
      const c = new KoreanCharacter(' ');
      expect(c.isKoreanCharacter()).toBeFalsy();
      expect(c.toString()).toBe(' ');
      expect(c.getRomanizedString(null, null, ConsonantAssimilation.Regressive, Type.Typical)).toBe(
        ' '
      );
    });
  });

  describe('exception', () => {
    it('null이나 빈 문자열을 처리한다', () => {
      expect(() => KoreanRomanizer.romanize(null as unknown as string)).toThrow(
        'String should not be null.'
      );
      expect(KoreanRomanizer.romanize('')).toBe('');
    });
  });

  describe('testByConsonantAssimilation', () => {
    it('자음 동화를 처리한다', () => {
      expect(KoreanRomanizer.romanize('백로', ConsonantAssimilation.Regressive)).toBe('Baengno');
      expect(KoreanRomanizer.romanize('백로', ConsonantAssimilation.Progressive)).toBe('Baengno');
      expect(KoreanRomanizer.romanize('디귿리을', ConsonantAssimilation.Regressive)).toBe(
        'Digeullieul'
      );
      expect(KoreanRomanizer.romanize('디귿리을', ConsonantAssimilation.Progressive)).toBe(
        'Digeunnieul'
      );
      expect(KoreanRomanizer.romanize('압록강', ConsonantAssimilation.Regressive)).toBe(
        'Amnokgang'
      );
      expect(KoreanRomanizer.romanize('압록강', ConsonantAssimilation.Progressive)).toBe(
        'Amnokgang'
      );
      expect(KoreanRomanizer.romanize('왕십리', ConsonantAssimilation.Regressive)).toBe(
        'Wangsimni'
      );
      expect(KoreanRomanizer.romanize('왕십리', ConsonantAssimilation.Progressive)).toBe(
        'Wangsimni'
      );
      expect(KoreanRomanizer.romanize('협력', ConsonantAssimilation.Regressive)).toBe('Hyeomnyeok');
      expect(KoreanRomanizer.romanize('협력', ConsonantAssimilation.Progressive)).toBe(
        'Hyeomnyeok'
      );
      expect(KoreanRomanizer.romanize('설날', ConsonantAssimilation.Regressive)).toBe('Seollal');
      expect(KoreanRomanizer.romanize('설날', ConsonantAssimilation.Progressive)).toBe('Seollal');
      expect(KoreanRomanizer.romanize('생산량', ConsonantAssimilation.Regressive)).toBe(
        'Saengsallyang'
      );
      expect(KoreanRomanizer.romanize('생산량', ConsonantAssimilation.Progressive)).toBe(
        'Saengsannyang'
      );
      expect(KoreanRomanizer.romanize('신라면', ConsonantAssimilation.Regressive)).toBe(
        'Sillamyeon'
      );
      expect(KoreanRomanizer.romanize('신라면', ConsonantAssimilation.Progressive)).toBe(
        'Sinnamyeon'
      );
      expect(KoreanRomanizer.romanize('원심력', ConsonantAssimilation.Regressive)).toBe(
        'Wonsimnyeok'
      );
      expect(KoreanRomanizer.romanize('원심력', ConsonantAssimilation.Progressive)).toBe(
        'Wonsimnyeok'
      );
      expect(KoreanRomanizer.romanize('망라', ConsonantAssimilation.Regressive)).toBe('Mangna');
      expect(KoreanRomanizer.romanize('망라', ConsonantAssimilation.Progressive)).toBe('Mangna');
    });
  });

  describe('testByType', () => {
    it('단어 유형에 따라 처리한다', () => {
      expect(KoreanRomanizer.romanize('각하', Type.Typical)).toBe('Gaka');
      expect(KoreanRomanizer.romanize('각하', Type.Substantives)).toBe('Gakha');
      expect(KoreanRomanizer.romanize('맏항', Type.Typical)).toBe('Matang');
      expect(KoreanRomanizer.romanize('맏항', Type.Substantives)).toBe('Mathang');
      expect(KoreanRomanizer.romanize('법학', Type.Typical)).toBe('Beopak');
      expect(KoreanRomanizer.romanize('법학', Type.Substantives)).toBe('Beophak');
      expect(KoreanRomanizer.romanize('색연필', Type.Typical)).toBe('Saegyeonpil');
      expect(KoreanRomanizer.romanize('색연필', Type.Compound)).toBe('Saengnyeonpil');
      expect(KoreanRomanizer.romanize('콩엿', Type.Typical)).toBe('Kong-yeot');
      expect(KoreanRomanizer.romanize('콩엿', Type.Compound)).toBe('Kongnyeot');
      expect(KoreanRomanizer.romanize('종로2가', Type.Typical)).toBe('Jongno2Ga');
      expect(KoreanRomanizer.romanize('종로2가', Type.District)).toBe('Jongno 2-ga');
      expect(KoreanRomanizer.romanize('성남대로2번길', Type.Typical)).toBe(
        'Seongnamdaero2Beon-gil'
      );
      expect(KoreanRomanizer.romanize('성남대로2번길', Type.District)).toBe(
        'Seongnam-daero 2beon-gil'
      );
      expect(KoreanRomanizer.romanize('이지은', Type.Typical)).toBe('Ijieun');
      expect(KoreanRomanizer.romanize('이지은', Type.Name)).toBe('I Jieun');
      expect(KoreanRomanizer.romanize('제갈공명', Type.Typical)).toBe('Jegalgongmyeong');
      expect(KoreanRomanizer.romanize('제갈공명', Type.Name)).toBe('Jegal Gongmyeong');
      expect(KoreanRomanizer.romanize('박화요비', Type.Typical)).toBe('Bakwayobi');
      expect(KoreanRomanizer.romanize('박화요비', Type.Name)).toBe('Bak Hwayobi');
    });
  });

  describe('testMisc', () => {
    it('기타 케이스를 처리한다', () => {
      expect(KoreanRomanizer.romanize('않다')).toBe('Anta');
    });
  });

  describe('testName', () => {
    it('이름을 처리한다', () => {
      expect(KoreanRomanizer.romanize('김수현', Type.Name)).toBe('Gim Suhyeon');
      expect(KoreanRomanizer.romanize('김수현', Type.NameTypical)).toBe('Kim Suhyeon');
      expect(KoreanRomanizer.romanize('이세돌', Type.Name)).toBe('I Sedol');
      expect(KoreanRomanizer.romanize('이세돌', Type.NameTypical)).toBe('Lee Sedol');
      expect(KoreanRomanizer.romanize('박보검', Type.Name)).toBe('Bak Bogeom');
      expect(KoreanRomanizer.romanize('박보검', Type.NameTypical)).toBe('Park Bogeom');
      expect(KoreanRomanizer.romanize('최시원', Type.Name)).toBe('Choe Siwon');
      expect(KoreanRomanizer.romanize('최시원', Type.NameTypical)).toBe('Choi Siwon');
      expect(KoreanRomanizer.romanize('선우은숙', Type.Name)).toBe('Seonu Eunsuk');
      expect(KoreanRomanizer.romanize('선우은숙', Type.NameTypical)).toBe('Sunwoo Eunsuk');
    });
  });

  describe('romanizeNameVariants', () => {
    it('흔한 단성 이름의 다양한 표기를 모두 포함한다', () => {
      const variants = KoreanRomanizer.romanizeNameVariants('김철수', { limit: 200 });
      expect(variants).toContain('Kim Chulsoo');
      expect(variants).toContain('Kim Cheolsu');
      expect(variants).toContain('Gim Cheolsu');
      expect(variants).toContain('Kim Chul-su');
      // 이름 우선 순서도 포함
      expect(variants).toContain('Chulsoo Kim');
    });

    it('이/박/최 등 관습 표기를 포함한다', () => {
      const lee = KoreanRomanizer.romanizeNameVariants('이지은', { limit: 200 });
      expect(lee).toContain('Lee Jieun');
      expect(lee).toContain('Yi Jieun');
      expect(lee).toContain('Rhee Jieun');

      const park = KoreanRomanizer.romanizeNameVariants('박보검', { limit: 200 });
      expect(park).toContain('Park Bogeom');
      expect(park).toContain('Bak Bogeom');

      const choi = KoreanRomanizer.romanizeNameVariants('최시원', { limit: 200 });
      expect(choi).toContain('Choi Siwon');
      expect(choi).toContain('Choe Siwon');
    });

    it('복성을 처리한다', () => {
      const variants = KoreanRomanizer.romanizeNameVariants('남궁민수', { limit: 200 });
      expect(variants.some((v) => v.startsWith('Namgoong'))).toBe(true);
      expect(variants.some((v) => v.startsWith('Namkung'))).toBe(true);

      const sunwoo = KoreanRomanizer.romanizeNameVariants('선우은숙', { limit: 200 });
      expect(sunwoo.some((v) => v.startsWith('Sunwoo'))).toBe(true);
    });

    it('하이픈 형태와 붙여 쓴 형태를 모두 제공한다', () => {
      const variants = KoreanRomanizer.romanizeNameVariants('김철수', { limit: 200 });
      expect(variants).toContain('Kim Chul-su');
      expect(variants).toContain('Kim Chulsu');
    });

    it('옵션으로 형태와 순서를 제어할 수 있다', () => {
      const onlyJoined = KoreanRomanizer.romanizeNameVariants('김철수', {
        joinedGivenName: true,
        hyphenatedGivenName: false,
        spaceSeparatedGivenName: false,
        givenNameFirst: false,
        limit: 200,
      });
      expect(onlyJoined.every((v) => !v.includes('-'))).toBe(true);
      expect(onlyJoined.every((v) => v.startsWith('Kim') || v.startsWith('Gim'))).toBe(true);

      const spaced = KoreanRomanizer.romanizeNameVariants('김철수', {
        joinedGivenName: false,
        hyphenatedGivenName: false,
        spaceSeparatedGivenName: true,
        givenNameFirst: false,
        limit: 200,
      });
      expect(spaced.some((v) => /^Kim Chul Su$/.test(v) || /^Kim Cheol Su$/.test(v))).toBe(true);
    });

    it('limit을 적용하고 중복을 제거한다', () => {
      const variants = KoreanRomanizer.romanizeNameVariants('김철수', { limit: 5 });
      expect(variants).toHaveLength(5);
      expect(new Set(variants.map((v) => v.toLowerCase())).size).toBe(5);
    });

    it('사용자 지정 오버라이드를 받는다', () => {
      const variants = KoreanRomanizer.romanizeNameVariants('김철수', {
        surnameOverrides: { 김: ['Khim'] },
        syllableOverrides: { 철: ['Tchul'] },
        limit: 200,
      });
      expect(variants.some((v) => v.startsWith('Khim '))).toBe(true);
      expect(variants.some((v) => v.includes('Tchul'))).toBe(true);
    });

    it('잘못된 입력을 거부한다', () => {
      expect(() => KoreanRomanizer.romanizeNameVariants('Kim')).toThrow();
      expect(() => KoreanRomanizer.romanizeNameVariants('가')).toThrow();
      expect(KoreanRomanizer.romanizeNameVariants('')).toEqual([]);
    });
  });

  describe('testLongText', () => {
    it('긴 텍스트를 처리한다', () => {
      const koreanText =
        '여름장이란 애시당초에 글러서, 해는 아직 중천에 있건만 장판은 벌써 쓸쓸하고 더운 햇발이 벌여놓은 전 휘장 밑으로 등줄기를 훅훅 볶는다.';
      const romanizedText =
        'Yeoreumjang-iran Aesidangchoe Geulleoseo, Haeneun Ajik Jungcheone Itgeonman Jangpaneun Beolsseo Sseulsseulhago Deoun Haetbari Beoryeonoeun Jeon Hwijang Mitteuro Deungjulgireul Hukuk Bongneunda.';
      expect(KoreanRomanizer.romanize(koreanText)).toBe(romanizedText);
    });
  });
});
