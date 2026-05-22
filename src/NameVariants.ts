import { ChosungValue, JongsungValue, JungsungValue, KoreanCharacter } from './KoreanCharacter';

/**
 * 이름 변환 변형 생성 옵션
 */
export interface NameVariantOptions {
  /** 반환할 최대 변형 개수. 기본값: 100 */
  limit?: number;
  /** 성-이름 순서 (한국식) 포함 여부. 기본값: true */
  surnameFirst?: boolean;
  /** 이름-성 순서 (영어식) 포함 여부. 기본값: true */
  givenNameFirst?: boolean;
  /** 이름을 붙여 쓴 형태 (예: "Cheolsu") 포함 여부. 기본값: true */
  joinedGivenName?: boolean;
  /** 이름을 하이픈으로 연결한 형태 (예: "Cheol-su") 포함 여부. 기본값: true */
  hyphenatedGivenName?: boolean;
  /** 이름 음절을 공백으로 분리한 형태 (예: "Cheol Su") 포함 여부. 기본값: false */
  spaceSeparatedGivenName?: boolean;
  /** 사용자 지정 성씨 변형 (기본 매핑 보강용) */
  surnameOverrides?: { [key: string]: string[] };
  /** 사용자 지정 음절 변형 (기본 매핑 보강용) */
  syllableOverrides?: { [key: string]: string[] };
}

const DOUBLE_SURNAMES = new Set([
  '강전',
  '남궁',
  '독고',
  '동방',
  '등정',
  '망절',
  '무본',
  '사공',
  '서문',
  '선우',
  '소봉',
  '어금',
  '장곡',
  '제갈',
  '황목',
  '황보',
]);

/**
 * 한국인이 실제로 사용하는 성씨의 영문 표기 변형 매핑.
 * 표준 로마자 표기법과 다른 관습적 표기를 모두 포함한다.
 */
const SURNAME_VARIANTS: { [key: string]: string[] } = {
  김: ['Kim', 'Gim'],
  이: ['Lee', 'Yi', 'Rhee', 'I', 'Yee'],
  박: ['Park', 'Pak', 'Bak', 'Bahk'],
  최: ['Choi', 'Choe', 'Chwe'],
  정: ['Jung', 'Jeong', 'Chung', 'Chong'],
  강: ['Kang', 'Gang'],
  조: ['Cho', 'Jo', 'Joh'],
  윤: ['Yoon', 'Yun', 'Youn'],
  장: ['Jang', 'Chang'],
  임: ['Lim', 'Im', 'Yim', 'Rim'],
  한: ['Han', 'Hahn'],
  오: ['Oh', 'O'],
  서: ['Suh', 'Seo', 'Sur'],
  신: ['Shin', 'Sin', 'Cynn'],
  권: ['Kwon', 'Gwon', 'Kweon'],
  황: ['Hwang', 'Whang'],
  안: ['Ahn', 'An'],
  송: ['Song', 'Soung'],
  류: ['Ryu', 'Yu', 'Yoo', 'Lyu'],
  유: ['Yoo', 'Yu', 'You'],
  홍: ['Hong'],
  전: ['Jeon', 'Jun', 'Chun', 'Cheon'],
  고: ['Ko', 'Go', 'Koh', 'Goh'],
  문: ['Moon', 'Mun'],
  손: ['Son', 'Sohn'],
  양: ['Yang'],
  배: ['Bae', 'Bai', 'Pae'],
  백: ['Baek', 'Paik', 'Back', 'Paek'],
  허: ['Heo', 'Hur', 'Huh', 'Her'],
  남: ['Nam', 'Nahm'],
  심: ['Shim', 'Sim', 'Sym'],
  노: ['Noh', 'No', 'Roh'],
  하: ['Ha', 'Hah'],
  주: ['Joo', 'Ju', 'Chu'],
  구: ['Koo', 'Ku', 'Goo', 'Gu'],
  곽: ['Kwak', 'Gwak', 'Kwack'],
  성: ['Sung', 'Seong'],
  차: ['Cha', 'Char'],
  우: ['Woo', 'Wu', 'U'],
  민: ['Min', 'Mihn'],
  나: ['Na', 'Nah', 'Ra'],
  진: ['Jin', 'Chin'],
  지: ['Ji', 'Jee', 'Chi'],
  엄: ['Eom', 'Um', 'Uhm'],
  원: ['Won', 'Weon'],
  채: ['Chae', 'Chai'],
  천: ['Cheon', 'Chun', 'Chon'],
  방: ['Bang', 'Pang'],
  공: ['Kong', 'Gong'],
  현: ['Hyun', 'Hyeon'],
  함: ['Ham', 'Hahm'],
  변: ['Byun', 'Byeon', 'Pyun'],
  염: ['Yeom', 'Yum', 'Youm'],
  여: ['Yeo', 'Yuh', 'Yo'],
  추: ['Chu', 'Choo'],
  도: ['Do', 'Doh', 'To'],
  소: ['So', 'Soh'],
  석: ['Seok', 'Suk', 'Sok'],
  선: ['Sun', 'Seon'],
  설: ['Seol', 'Sul'],
  마: ['Ma', 'Mah'],
  길: ['Kil', 'Gil', 'Kihl'],
  연: ['Yeon', 'Yun', 'Youn'],
  표: ['Pyo', 'Phyo'],
  명: ['Myung', 'Myeong'],
  기: ['Ki', 'Gi', 'Kee'],
  반: ['Ban', 'Bahn', 'Pan'],
  왕: ['Wang', 'Whang'],
  금: ['Keum', 'Geum', 'Kum'],
  옥: ['Ok', 'Ock'],
  육: ['Yook', 'Yuk', 'Youk'],
  인: ['In', 'Ihn'],
  맹: ['Maeng'],
  제: ['Je', 'Jeh', 'Jea'],
  탁: ['Tak', 'Tark', 'Tahk'],
  국: ['Kook', 'Guk', 'Kuk', 'Gook'],
  편: ['Pyun', 'Pyeon'],
  계: ['Kye', 'Gye'],
  봉: ['Bong'],
  사: ['Sa', 'Sah'],
  부: ['Boo', 'Bu'],
  좌: ['Jwa', 'Joa'],
  화: ['Hwa'],
  운: ['Woon', 'Un'],
  형: ['Hyung', 'Hyeong'],
  남궁: ['Namgoong', 'Namkung', 'Namkoong', 'Namgung'],
  선우: ['Sunwoo', 'Seonwoo', 'Sonu'],
  독고: ['Dokgo', 'Dokko', 'Tokgo'],
  황보: ['Hwangbo'],
  제갈: ['Jegal', 'Chegal'],
  사공: ['Sagong', 'Sakong'],
  서문: ['Seomun', 'Suhmoon'],
  동방: ['Dongbang'],
};

/**
 * 한국인 이름에서 자주 쓰이는 음절별 관습 표기.
 * 표준 로마자 표기법으로는 나오지 않지만 실제로 많이 쓰이는 표기를 포함한다.
 */
const SYLLABLE_VARIANTS: { [key: string]: string[] } = {
  가: ['Ga', 'Ka', 'Gah'],
  각: ['Gak', 'Kak'],
  간: ['Gan', 'Kan'],
  갈: ['Gal', 'Kal'],
  감: ['Gam', 'Kam'],
  강: ['Kang', 'Gang'],
  개: ['Gae', 'Kae'],
  거: ['Geo', 'Guh'],
  건: ['Geon', 'Gun'],
  걸: ['Geol', 'Gul'],
  검: ['Geom', 'Gum'],
  것: ['Geot'],
  게: ['Ge'],
  결: ['Gyeol', 'Kyul'],
  겸: ['Gyeom', 'Kyum'],
  겹: ['Gyeop'],
  경: ['Kyung', 'Kyeong', 'Gyeong', 'Kyoung'],
  계: ['Gye', 'Kye'],
  고: ['Go', 'Ko', 'Koh'],
  곡: ['Gok', 'Kok'],
  곤: ['Gon', 'Kon'],
  골: ['Gol', 'Kol'],
  공: ['Gong', 'Kong'],
  과: ['Gwa', 'Kwa'],
  관: ['Gwan', 'Kwan'],
  광: ['Gwang', 'Kwang'],
  교: ['Gyo', 'Kyo'],
  구: ['Gu', 'Koo', 'Ku', 'Goo'],
  국: ['Kook', 'Guk', 'Kuk', 'Gook'],
  군: ['Gun', 'Kun'],
  궁: ['Gung', 'Koong'],
  권: ['Kwon', 'Gwon'],
  궐: ['Gwol'],
  귀: ['Gwi', 'Kwi'],
  규: ['Gyu', 'Kyu'],
  균: ['Gyun', 'Kyun'],
  근: ['Geun', 'Keun', 'Kun'],
  글: ['Geul'],
  금: ['Geum', 'Keum', 'Kum'],
  급: ['Geup'],
  긍: ['Geung'],
  기: ['Gi', 'Ki', 'Kee'],
  길: ['Gil', 'Kil'],
  김: ['Kim', 'Gim'],
  나: ['Na', 'Nah'],
  난: ['Nan'],
  남: ['Nam', 'Nahm'],
  내: ['Nae', 'Nai'],
  녀: ['Nyeo'],
  념: ['Nyeom'],
  녕: ['Nyeong'],
  노: ['No', 'Noh', 'Ro'],
  녹: ['Nok', 'Rok'],
  논: ['Non'],
  뇌: ['Noe', 'Roi'],
  누: ['Nu', 'Noo'],
  눈: ['Nun'],
  뉴: ['Nyu'],
  다: ['Da', 'Dah', 'Ta'],
  단: ['Dan', 'Tan'],
  달: ['Dal', 'Tal'],
  담: ['Dam', 'Tam'],
  답: ['Dap'],
  당: ['Dang', 'Tang'],
  대: ['Dae', 'Tae', 'Day'],
  덕: ['Deok', 'Duk'],
  도: ['Do', 'Doh', 'To'],
  독: ['Dok'],
  돈: ['Don'],
  돌: ['Dol'],
  동: ['Dong', 'Tong'],
  두: ['Du', 'Doo'],
  득: ['Deuk'],
  등: ['Deung'],
  라: ['Ra', 'Rah', 'La'],
  락: ['Rak', 'Lak'],
  란: ['Ran', 'Lan'],
  람: ['Ram', 'Lam'],
  랑: ['Rang', 'Lang'],
  래: ['Rae', 'Lae'],
  량: ['Ryang'],
  러: ['Reo'],
  레: ['Re', 'Lae'],
  렬: ['Ryeol', 'Yul'],
  렴: ['Ryeom', 'Yeom'],
  령: ['Ryeong', 'Yeong'],
  례: ['Rye', 'Ye'],
  로: ['Ro', 'No', 'Loh'],
  록: ['Rok', 'Nok'],
  론: ['Ron'],
  롱: ['Rong'],
  뢰: ['Roe', 'Roi'],
  료: ['Ryo'],
  룡: ['Ryong', 'Yong'],
  루: ['Ru', 'Roo'],
  류: ['Ryu', 'Yu', 'Yoo'],
  륜: ['Ryun', 'Yun'],
  륭: ['Ryung'],
  륵: ['Reuk'],
  리: ['Ri', 'Lee', 'Li'],
  린: ['Rin', 'Lin'],
  림: ['Rim', 'Lim', 'Im'],
  립: ['Rip', 'Ip'],
  마: ['Ma', 'Mah'],
  막: ['Mak'],
  만: ['Man', 'Mahn'],
  말: ['Mal'],
  망: ['Mang'],
  매: ['Mae', 'Mai'],
  맥: ['Maek'],
  맹: ['Maeng'],
  머: ['Meo', 'Mu'],
  먹: ['Meok'],
  메: ['Me'],
  멸: ['Myeol'],
  명: ['Myung', 'Myeong'],
  모: ['Mo', 'Moh'],
  목: ['Mok'],
  몽: ['Mong'],
  묘: ['Myo'],
  무: ['Mu', 'Moo'],
  묵: ['Muk', 'Mook'],
  문: ['Mun', 'Moon'],
  미: ['Mi', 'Mee', 'Mih'],
  민: ['Min', 'Mihn'],
  밀: ['Mil', 'Mihl'],
  바: ['Ba', 'Pa'],
  박: ['Park', 'Bak', 'Pak', 'Bahk'],
  반: ['Ban', 'Bahn', 'Pan'],
  발: ['Bal', 'Pal'],
  방: ['Bang', 'Pang'],
  배: ['Bae', 'Pae', 'Bai'],
  백: ['Baek', 'Paik', 'Back', 'Paek'],
  버: ['Beo', 'Bu'],
  번: ['Beon', 'Bun'],
  벌: ['Beol'],
  범: ['Beom', 'Bum'],
  법: ['Beop'],
  벽: ['Byeok', 'Byuk'],
  변: ['Byun', 'Byeon', 'Pyun'],
  별: ['Byeol', 'Byul'],
  병: ['Byung', 'Byeong'],
  보: ['Bo', 'Boh', 'Po'],
  복: ['Bok', 'Pok'],
  본: ['Bon', 'Pon'],
  봉: ['Bong', 'Pong'],
  부: ['Bu', 'Boo'],
  북: ['Buk', 'Book'],
  분: ['Bun', 'Boon'],
  비: ['Bi', 'Bee', 'Pi'],
  빈: ['Bin', 'Been'],
  사: ['Sa', 'Sah'],
  삼: ['Sam', 'Sahm'],
  상: ['Sang'],
  새: ['Sae'],
  색: ['Saek'],
  생: ['Saeng'],
  서: ['Seo', 'Suh', 'Sur'],
  석: ['Seok', 'Suk', 'Sok'],
  선: ['Sun', 'Seon'],
  설: ['Seol', 'Sul'],
  섭: ['Seop', 'Sup'],
  성: ['Sung', 'Seong'],
  세: ['Se', 'Sae'],
  소: ['So', 'Soh'],
  손: ['Son', 'Sohn'],
  솔: ['Sol'],
  송: ['Song'],
  쇠: ['Soe'],
  수: ['Soo', 'Su', 'Sue'],
  숙: ['Sook', 'Suk'],
  순: ['Soon', 'Sun'],
  술: ['Sul', 'Sool'],
  숭: ['Soong', 'Sung'],
  슈: ['Syu', 'Shu'],
  슬: ['Seul', 'Sul'],
  승: ['Seung', 'Sung'],
  시: ['Si', 'Shi', 'See'],
  식: ['Sik', 'Shik'],
  신: ['Shin', 'Sin'],
  실: ['Sil'],
  심: ['Shim', 'Sim'],
  아: ['Ah', 'A'],
  악: ['Ak'],
  안: ['An', 'Ahn'],
  암: ['Am'],
  애: ['Ae', 'Ai'],
  액: ['Aek'],
  앵: ['Aeng'],
  야: ['Ya'],
  약: ['Yak'],
  양: ['Yang'],
  어: ['Eo', 'Uh'],
  억: ['Eok', 'Uk'],
  언: ['Eon', 'Un'],
  엄: ['Eom', 'Um', 'Uhm'],
  업: ['Eop'],
  에: ['E'],
  여: ['Yeo', 'Yuh', 'Yo'],
  역: ['Yeok', 'Yuk'],
  연: ['Yeon', 'Yun', 'Youn'],
  열: ['Yeol', 'Yul'],
  염: ['Yeom', 'Yum'],
  엽: ['Yeop'],
  영: ['Young', 'Yeong', 'Yong'],
  예: ['Ye', 'Yae'],
  오: ['O', 'Oh'],
  옥: ['Ok', 'Ock'],
  온: ['On', 'Ohn'],
  옴: ['Om'],
  옹: ['Ong'],
  완: ['Wan'],
  왕: ['Wang'],
  외: ['Oe', 'Wae'],
  요: ['Yo'],
  욱: ['Wook', 'Uk', 'Ook'],
  운: ['Woon', 'Un'],
  울: ['Ul'],
  웅: ['Woong', 'Ung'],
  원: ['Won', 'Weon'],
  월: ['Wol'],
  위: ['Wi', 'Wee'],
  유: ['Yoo', 'Yu', 'You'],
  육: ['Yook', 'Yuk', 'Youk'],
  윤: ['Yoon', 'Yun', 'Youn'],
  율: ['Yul', 'Yool'],
  융: ['Yung'],
  은: ['Eun', 'Un'],
  음: ['Eum', 'Um'],
  의: ['Eui', 'Ui', 'Yi'],
  이: ['I', 'Yi', 'Lee', 'E'],
  익: ['Ik', 'Ick'],
  인: ['In', 'Ihn'],
  일: ['Il', 'Yil', 'Ihl'],
  임: ['Im', 'Lim', 'Yim'],
  입: ['Ip'],
  자: ['Ja', 'Cha'],
  작: ['Jak', 'Chak'],
  잠: ['Jam'],
  장: ['Jang', 'Chang'],
  재: ['Jae', 'Chae', 'Jay'],
  쟁: ['Jaeng'],
  저: ['Jeo'],
  적: ['Jeok', 'Juk'],
  전: ['Jeon', 'Jun', 'Chun', 'Cheon'],
  점: ['Jeom', 'Jum'],
  정: ['Jung', 'Jeong', 'Chung', 'Chong'],
  제: ['Je', 'Jeh', 'Jea'],
  조: ['Jo', 'Cho', 'Joh'],
  종: ['Jong', 'Chong'],
  좌: ['Jwa', 'Joa'],
  주: ['Joo', 'Ju', 'Chu'],
  죽: ['Juk', 'Jook'],
  준: ['Jun', 'Joon', 'June'],
  중: ['Joong', 'Jung', 'Choong'],
  즙: ['Jeup', 'Chup'],
  증: ['Jeung'],
  지: ['Ji', 'Jee', 'Gi'],
  진: ['Jin', 'Chin'],
  집: ['Jip'],
  징: ['Jing'],
  차: ['Cha', 'Char'],
  착: ['Chak'],
  찬: ['Chan', 'Charn'],
  창: ['Chang'],
  채: ['Chae', 'Chai'],
  책: ['Chaek'],
  처: ['Cheo'],
  척: ['Cheok'],
  천: ['Cheon', 'Chun'],
  철: ['Chul', 'Cheol', 'Churl'],
  첨: ['Cheom', 'Chum'],
  청: ['Cheong', 'Chung'],
  체: ['Che'],
  초: ['Cho'],
  총: ['Chong'],
  최: ['Choi', 'Choe', 'Chwe'],
  추: ['Chu', 'Choo'],
  축: ['Chuk'],
  춘: ['Chun', 'Choon'],
  출: ['Chul'],
  충: ['Choong', 'Chung'],
  취: ['Chwi'],
  치: ['Chi', 'Chee'],
  친: ['Chin'],
  칠: ['Chil'],
  카: ['Ka'],
  코: ['Ko', 'Koh'],
  쾌: ['Kwae'],
  쿠: ['Ku', 'Koo'],
  큰: ['Keun'],
  타: ['Ta', 'Tah'],
  탁: ['Tak'],
  탄: ['Tan'],
  탈: ['Tal'],
  탑: ['Tap'],
  탕: ['Tang'],
  태: ['Tae', 'Tai', 'Tay'],
  택: ['Taek'],
  토: ['To'],
  통: ['Tong'],
  투: ['Tu', 'Too'],
  특: ['Teuk'],
  티: ['Ti'],
  파: ['Pa'],
  판: ['Pan'],
  팔: ['Pal'],
  패: ['Pae'],
  편: ['Pyun', 'Pyeon'],
  평: ['Pyung', 'Pyeong'],
  포: ['Po', 'Poh'],
  표: ['Pyo', 'Phyo'],
  풍: ['Poong', 'Pung'],
  필: ['Pil', 'Phil', 'Pill'],
  하: ['Ha', 'Hah'],
  학: ['Hak', 'Hahk'],
  한: ['Han', 'Hahn'],
  함: ['Ham', 'Hahm'],
  항: ['Hang'],
  해: ['Hae', 'Hai'],
  행: ['Haeng'],
  향: ['Hyang'],
  허: ['Heo', 'Hur', 'Huh', 'Her'],
  헌: ['Heon', 'Hun'],
  혁: ['Hyuk', 'Hyeok'],
  현: ['Hyun', 'Hyeon', 'Hyon'],
  혈: ['Hyeol'],
  협: ['Hyeop', 'Hyup'],
  형: ['Hyung', 'Hyeong'],
  혜: ['Hye', 'Hae', 'Hyae'],
  호: ['Ho', 'Hoh'],
  홍: ['Hong'],
  화: ['Hwa'],
  환: ['Hwan', 'Hwahn'],
  활: ['Hwal'],
  황: ['Hwang', 'Whang'],
  회: ['Hoe', 'Hwe', 'Hoi'],
  효: ['Hyo'],
  후: ['Hu', 'Hoo'],
  훈: ['Hoon', 'Hun', 'Whun'],
  휘: ['Hwi', 'Hui'],
  휴: ['Hyu'],
  흥: ['Heung', 'Hong'],
  희: ['Hee', 'Hui', 'Hye'],
};

const CHOSUNG_VARIANTS: string[][] = (() => {
  const arr: string[][] = new Array(19);
  arr[ChosungValue.ㄱ] = ['g', 'k'];
  arr[ChosungValue.ㄲ] = ['kk', 'gg'];
  arr[ChosungValue.ㄴ] = ['n'];
  arr[ChosungValue.ㄷ] = ['d', 't'];
  arr[ChosungValue.ㄸ] = ['tt'];
  arr[ChosungValue.ㄹ] = ['r', 'l'];
  arr[ChosungValue.ㅁ] = ['m'];
  arr[ChosungValue.ㅂ] = ['b', 'p'];
  arr[ChosungValue.ㅃ] = ['pp'];
  arr[ChosungValue.ㅅ] = ['s'];
  arr[ChosungValue.ㅆ] = ['ss'];
  arr[ChosungValue.ㅇ] = [''];
  arr[ChosungValue.ㅈ] = ['j', 'ch'];
  arr[ChosungValue.ㅉ] = ['jj'];
  arr[ChosungValue.ㅊ] = ['ch'];
  arr[ChosungValue.ㅋ] = ['k'];
  arr[ChosungValue.ㅌ] = ['t'];
  arr[ChosungValue.ㅍ] = ['p', 'ph'];
  arr[ChosungValue.ㅎ] = ['h'];
  return arr;
})();

const JUNGSUNG_VARIANTS: string[][] = (() => {
  const arr: string[][] = new Array(21);
  arr[JungsungValue.ㅏ] = ['a', 'ah'];
  arr[JungsungValue.ㅐ] = ['ae', 'ai'];
  arr[JungsungValue.ㅑ] = ['ya'];
  arr[JungsungValue.ㅒ] = ['yae'];
  arr[JungsungValue.ㅓ] = ['eo', 'u', 'uh'];
  arr[JungsungValue.ㅔ] = ['e'];
  arr[JungsungValue.ㅕ] = ['yeo', 'yu', 'yo'];
  arr[JungsungValue.ㅖ] = ['ye'];
  arr[JungsungValue.ㅗ] = ['o', 'oh'];
  arr[JungsungValue.ㅘ] = ['wa'];
  arr[JungsungValue.ㅙ] = ['wae'];
  arr[JungsungValue.ㅚ] = ['oe', 'we'];
  arr[JungsungValue.ㅛ] = ['yo'];
  arr[JungsungValue.ㅜ] = ['u', 'oo', 'woo'];
  arr[JungsungValue.ㅝ] = ['wo'];
  arr[JungsungValue.ㅞ] = ['we'];
  arr[JungsungValue.ㅟ] = ['wi'];
  arr[JungsungValue.ㅠ] = ['yu', 'yoo', 'you'];
  arr[JungsungValue.ㅡ] = ['eu', 'u'];
  arr[JungsungValue.ㅢ] = ['ui', 'yi'];
  arr[JungsungValue.ㅣ] = ['i', 'ee'];
  return arr;
})();

const JONGSUNG_VARIANTS: string[][] = (() => {
  const arr: string[][] = new Array(28);
  arr[JongsungValue.NONE] = [''];
  arr[JongsungValue.ㄱ] = ['k', 'g'];
  arr[JongsungValue.ㄲ] = ['k'];
  arr[JongsungValue.ㄳ] = ['k'];
  arr[JongsungValue.ㄴ] = ['n'];
  arr[JongsungValue.ㄵ] = ['n'];
  arr[JongsungValue.ㄶ] = ['n'];
  arr[JongsungValue.ㄷ] = ['t'];
  arr[JongsungValue.ㄹ] = ['l', 'r'];
  arr[JongsungValue.ㄺ] = ['k'];
  arr[JongsungValue.ㄻ] = ['m'];
  arr[JongsungValue.ㄼ] = ['l'];
  arr[JongsungValue.ㄽ] = ['l'];
  arr[JongsungValue.ㄾ] = ['l'];
  arr[JongsungValue.ㄿ] = ['l'];
  arr[JongsungValue.ㅀ] = ['l'];
  arr[JongsungValue.ㅁ] = ['m'];
  arr[JongsungValue.ㅂ] = ['p', 'b'];
  arr[JongsungValue.ㅄ] = ['p'];
  arr[JongsungValue.ㅅ] = ['t'];
  arr[JongsungValue.ㅆ] = ['t'];
  arr[JongsungValue.ㅇ] = ['ng'];
  arr[JongsungValue.ㅈ] = ['t'];
  arr[JongsungValue.ㅊ] = ['t'];
  arr[JongsungValue.ㅋ] = ['k'];
  arr[JongsungValue.ㅌ] = ['t'];
  arr[JongsungValue.ㅍ] = ['p'];
  arr[JongsungValue.ㅎ] = [''];
  return arr;
})();

const MAX_PROCEDURAL_PER_SYLLABLE = 4;

/**
 * 한 음절을 조합 규칙으로 풀어 발음 변형을 만든다.
 * (사전 매핑이 없는 음절을 위한 폴백)
 */
function generateProceduralVariants(syllable: string): string[] {
  const char = new KoreanCharacter(syllable);
  if (!char.isKoreanCharacter()) {
    return [syllable];
  }

  const chosungs = CHOSUNG_VARIANTS[char.chosung] ?? [''];
  const jungsungs = JUNGSUNG_VARIANTS[char.jungsung] ?? [''];
  const jongsungs = JONGSUNG_VARIANTS[char.jongsung] ?? [''];

  const out: string[] = [];
  const seen = new Set<string>();
  for (const c of chosungs) {
    for (const v of jungsungs) {
      for (const j of jongsungs) {
        const combined = capitalize(c + v + j);
        if (!seen.has(combined)) {
          seen.add(combined);
          out.push(combined);
          if (out.length >= MAX_PROCEDURAL_PER_SYLLABLE) {
            return out;
          }
        }
      }
    }
  }
  return out;
}

function capitalize(s: string): string {
  if (s.length === 0) {
    return s;
  }
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

function getSyllableVariants(syllable: string, overrides?: { [key: string]: string[] }): string[] {
  const override = overrides?.[syllable];
  const baseline = SYLLABLE_VARIANTS[syllable];
  const procedural = baseline ? [] : generateProceduralVariants(syllable);
  const merged = uniqueCaseInsensitive([...(override ?? []), ...(baseline ?? []), ...procedural]);
  return merged.map(capitalize);
}

function getSurnameVariants(surname: string, overrides?: { [key: string]: string[] }): string[] {
  const override = overrides?.[surname];
  const baseline = SURNAME_VARIANTS[surname];

  if (override || baseline) {
    return uniqueCaseInsensitive([...(override ?? []), ...(baseline ?? [])]).map(capitalize);
  }

  if (surname.length === 1) {
    return getSyllableVariants(surname, overrides);
  }

  const perSyllable = surname
    .split('')
    .map((s) => getSyllableVariants(s, overrides).map((v) => v.toLowerCase()));
  return cartesianJoin(perSyllable).map(capitalize);
}

function cartesianJoin(lists: string[][]): string[] {
  if (lists.length === 0) {
    return [''];
  }
  let acc: string[] = [''];
  for (const list of lists) {
    const next: string[] = [];
    for (const a of acc) {
      for (const item of list) {
        next.push(a + item);
      }
    }
    acc = next;
  }
  return acc;
}

function uniqueCaseInsensitive(values: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const v of values) {
    const key = v.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      out.push(v);
    }
  }
  return out;
}

interface ParsedName {
  surname: string;
  givenSyllables: string[];
}

function parseName(input: string): ParsedName | null {
  const cleaned = input.replace(/\s+/g, '');
  if (cleaned.length < 2) {
    return null;
  }
  for (let i = 0; i < cleaned.length; i++) {
    if (!KoreanCharacter.isKoreanCharacter(cleaned.charAt(i))) {
      return null;
    }
  }

  if (cleaned.length >= 3) {
    const possibleDouble = cleaned.substring(0, 2);
    if (DOUBLE_SURNAMES.has(possibleDouble) || SURNAME_VARIANTS[possibleDouble]) {
      return {
        surname: possibleDouble,
        givenSyllables: cleaned.substring(2).split(''),
      };
    }
  }

  return {
    surname: cleaned.charAt(0),
    givenSyllables: cleaned.substring(1).split(''),
  };
}

/**
 * 한국인이 영어로 변환할 만한 모든 방식으로 이름의 표기 변형을 생성한다.
 *
 * 표준 로마자 표기법뿐 아니라 실제로 쓰이는 관습적 표기(예: 김 → Kim/Gim,
 * 이 → Lee/Yi/Rhee, 정 → Jung/Jeong/Chung, 영 → Young/Yeong)를 포함하며,
 * 성-이름 순서와 이름-성 순서, 붙여 쓰기/하이픈/공백 분리 등 다양한 형태를
 * 조합해서 돌려준다.
 *
 * @param name 한글 이름 (예: "김철수", "남궁민수")
 * @param options 변형 생성 옵션
 * @returns 영문 표기 변형 배열 (중복 제거됨)
 * @throws 입력이 null이거나 한글이 아닌 경우 오류 발생
 */
export function romanizeNameVariants(name: string, options?: NameVariantOptions): string[] {
  if (name === null || name === undefined) {
    throw new Error('Name should not be null.');
  }
  if (name.trim().length === 0) {
    return [];
  }

  const {
    limit = 100,
    surnameFirst = true,
    givenNameFirst = true,
    joinedGivenName = true,
    hyphenatedGivenName = true,
    spaceSeparatedGivenName = false,
    surnameOverrides,
    syllableOverrides,
  } = options ?? {};

  const parsed = parseName(name);
  if (parsed === null) {
    throw new Error('Input must contain only Korean characters and be at least 2 characters long.');
  }

  const { surname, givenSyllables } = parsed;
  const surnameOptions = getSurnameVariants(surname, surnameOverrides);

  if (givenSyllables.length === 0) {
    return surnameOptions.slice(0, limit);
  }

  const givenSyllableOptions = givenSyllables.map((s) => getSyllableVariants(s, syllableOverrides));

  const givenJoinedForms: string[] = [];
  if (joinedGivenName) {
    const lowered = givenSyllableOptions.map((opts, idx) =>
      opts.map((v) => (idx === 0 ? capitalize(v) : v.toLowerCase()))
    );
    for (const combo of cartesianJoin(lowered)) {
      givenJoinedForms.push(combo);
    }
  }
  if (hyphenatedGivenName && givenSyllables.length > 1) {
    const parts = givenSyllableOptions.map((opts, idx) =>
      opts.map((v) => (idx === 0 ? capitalize(v) : v.toLowerCase()))
    );
    let acc: string[] = [''];
    for (let i = 0; i < parts.length; i++) {
      const next: string[] = [];
      for (const a of acc) {
        for (const item of parts[i]) {
          next.push(i === 0 ? item : `${a}-${item}`);
        }
      }
      acc = next;
    }
    for (const combo of acc) {
      givenJoinedForms.push(combo);
    }
  }
  if (spaceSeparatedGivenName && givenSyllables.length > 1) {
    const capitalized = givenSyllableOptions.map((opts) => opts.map(capitalize));
    let acc: string[] = [''];
    for (let i = 0; i < capitalized.length; i++) {
      const next: string[] = [];
      for (const a of acc) {
        for (const item of capitalized[i]) {
          next.push(i === 0 ? item : `${a} ${item}`);
        }
      }
      acc = next;
    }
    for (const combo of acc) {
      givenJoinedForms.push(combo);
    }
  }

  const uniqueGiven = uniqueCaseInsensitive(givenJoinedForms);
  const uniqueSurnames = uniqueCaseInsensitive(surnameOptions);

  const out: string[] = [];
  const seen = new Set<string>();
  const push = (value: string) => {
    const key = value.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      out.push(value);
    }
  };

  if (surnameFirst) {
    for (const s of uniqueSurnames) {
      for (const g of uniqueGiven) {
        push(`${s} ${g}`);
        if (out.length >= limit) return out;
      }
    }
  }
  if (givenNameFirst) {
    for (const g of uniqueGiven) {
      for (const s of uniqueSurnames) {
        push(`${g} ${s}`);
        if (out.length >= limit) return out;
      }
    }
  }

  return out;
}
