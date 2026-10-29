// 엑셀 4~6일차(속성 과정)에서 처음 나오는 함수의 뜻. functionGlossary.ts 의 엑셀 사전에 합쳐진다.
import type { FunctionGlossary } from './functionGlossary';

export const EXCEL_CRASH_FUNCTIONS: FunctionGlossary = {
  COUNTIF: {
    syntax: 'COUNTIF(찾을범위, 조건)',
    meaning: '조건에 맞는 칸의 개수예요.',
    example: '=COUNTIF(F:F,"보스") → 획득처가 보스인 행 수',
  },
  SUMIF: {
    syntax: 'SUMIF(찾을범위, 조건, 합계범위)',
    meaning: '조건에 맞는 행의 값만 더해요. 합계 범위가 맨 뒤예요.',
    example: '=SUMIF(D:D,"IT001",E:E) → IT001 수량 합계',
  },
  SUMIFS: {
    syntax: 'SUMIFS(합계범위, 범위1, 조건1, 범위2, 조건2, ...)',
    meaning: '조건을 모두 만족하는 행만 더해요. 합계 범위가 맨 앞이에요.',
    example: '=SUMIFS(E:E,D:D,"IT001",F:F,"보스") → IT001을 보스로 얻은 수량',
  },
  AVERAGEIF: {
    syntax: 'AVERAGEIF(찾을범위, 조건, 평균범위)',
    meaning: '조건에 맞는 행의 평균이에요. 맞는 행이 없으면 #DIV/0!이 나요.',
    example: '=AVERAGEIF(F:F,"사냥",E:E) → 사냥 로그의 평균 수량',
  },
  XLOOKUP: {
    syntax: 'XLOOKUP(찾을값, 찾을범위, 가져올범위, 없을때값, 일치모드)',
    meaning: '찾을범위에서 값을 찾아 같은 행의 가져올범위 값을 돌려줘요. 일치모드 -1은 같은 값이 없으면 바로 아래 값이에요.',
    example: '=XLOOKUP("IT001",A:A,B:B,"없음") → 예시 주문서 A',
  },
  VLOOKUP: {
    syntax: 'VLOOKUP(찾을값, 표, 열번호, FALSE)',
    meaning: 'XLOOKUP의 옛날 방식이에요. 찾는 열이 표의 맨 왼쪽이어야 하고, 열을 끼워 넣으면 깨져요.',
    example: '=VLOOKUP("IT001",A:G,2,FALSE) → 예시 주문서 A',
  },
  INDEX: {
    syntax: 'INDEX(범위, 행번호)',
    meaning: '범위에서 몇 번째 칸의 값을 돌려줘요. 보통 MATCH와 같이 써요.',
    example: '=INDEX(B2:B21,3) → B4 값',
  },
  MATCH: {
    syntax: 'MATCH(찾을값, 찾을범위, 0)',
    meaning: '찾을값이 범위에서 몇 번째에 있는지 알려줘요. 0은 정확히 같은 값이에요.',
    example: '=MATCH("IT003",A2:A21,0) → 3',
  },
  TEXT: {
    syntax: 'TEXT(값, "서식")',
    meaning: '숫자나 날짜를 원하는 모양의 글자로 바꿔요. "aaa"는 요일 한 글자예요.',
    example: '=TEXT(DATE(2026,10,1),"aaa") → 목',
  },
  WEEKDAY: {
    syntax: 'WEEKDAY(날짜, 2)',
    meaning: '요일을 숫자로 돌려줘요. 두 번째 인수 2면 월요일 1 … 일요일 7이에요.',
    example: '=WEEKDAY(DATE(2026,10,3),2) → 6 (토요일)',
  },
  ROUNDUP: {
    syntax: 'ROUNDUP(숫자, 자릿수)',
    meaning: '무조건 올림이에요. 가격·필요 수량 계산에 써요.',
    example: '=ROUNDUP(4.29,0) → 5',
  },
  ROUNDDOWN: {
    syntax: 'ROUNDDOWN(숫자, 자릿수)',
    meaning: '무조건 내림이에요.',
    example: '=ROUNDDOWN(4.99,0) → 4',
  },
  ABS: {
    syntax: 'ABS(숫자)',
    meaning: '절댓값이에요. 음수면 부호를 떼요. 두 값의 차이를 볼 때 써요.',
    example: '=ABS(-0.2) → 0.2',
  },
  SUMPRODUCT: {
    syntax: 'SUMPRODUCT(범위1, 범위2)',
    meaning: '두 범위를 칸끼리 곱해서 모두 더해요. 기대값 계산에 써요.',
    example: '=SUMPRODUCT({0.5,0.5},{100,300}) → 200',
  },
  LN: {
    syntax: 'LN(숫자)',
    meaning: '자연로그예요. 목표 확률에 필요한 횟수를 거꾸로 구할 때 써요.',
    example: '=LN(0.1)/LN(0.97) → 75.6',
  },
  RAND: {
    syntax: 'RAND()',
    meaning: '0 이상 1 미만의 난수예요. 다시 계산할 때마다 바뀌어요.',
    example: '=RAND() → 0.3812… (매번 다름)',
  },
  'PERCENTILE.INC': {
    syntax: 'PERCENTILE.INC(범위, 비율)',
    meaning: '범위에서 아래부터 그 비율 위치에 있는 값이에요. 0.9면 상위 10% 경계예요.',
    example: '=PERCENTILE.INC(D2:D1001,0.9) → 불운한 10%의 시도 횟수',
  },
};
