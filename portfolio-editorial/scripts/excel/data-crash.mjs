// 엑셀 속성 과정(4~6일차) 실습 파일에 들어가는 가상 데이터. 원래 4~15일차 내용을 3일로 압축했다.
// 이름·수치·확률은 모두 학습용 가정 값이다 (실제 게임 수치 아님).
import { ITEMS } from './data.mjs';

// ---------- 4일차: 획득 로그 ----------

export const LOG_HEADERS = ['로그번호', '날짜', '캐릭터ID', 'item_id', '수량', '획득처'];
export const LOG_SOURCES = ['출석', '사냥', '코인샵', '보스'];
export const LOG_COUNT = 60;
/** 로그 날짜는 이벤트 시작일부터 14일 동안 (2026-10-01은 목요일) */
export const EVENT_START = { year: 2026, month: 10, day: 1 };

/** 실행할 때마다 같은 값이 나오도록 고정 시드 난수를 쓴다 */
export function seededRandom(seed) {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) % 2147483648;
    return state / 2147483648;
  };
}

export const LOGS = (() => {
  const random = seededRandom(20261029);
  const pick = (count) => Math.floor(random() * count);
  return Array.from({ length: LOG_COUNT }, (_, index) => {
    const dayOffset = index % 14;
    return [
      index + 1,
      dayOffset,
      pick(10) + 1,
      ITEMS[pick(ITEMS.length)][0],
      pick(5) + 1,
      LOG_SOURCES[pick(LOG_SOURCES.length)],
    ];
  });
})();

/** 레벨 구간표: 하한 레벨 이상이면 그 등급 (근사 일치 연습) */
export const LEVEL_TIERS = [[1, 'D'], [60, 'C'], [100, 'B'], [140, 'A'], [200, 'S']];
export const LEVEL_TESTS = [59, 60, 139, 250];

/** 코인 1개의 메소 가치 */
export const COIN_VALUE = 350;

// ---------- 5일차: 설정·보상 테이블·성장 곡선 ----------

/** 설정 시트: 이름, 값, 설명. 이름 정의 연습용 */
export const SETTINGS = [
  ['주말배율', 2, '출석 주말 보너스 배율'],
  ['코인가치', COIN_VALUE, '코인 1개의 메소 가치'],
  ['기본값', 100, '성장 곡선 기본값'],
  ['지수', 2, '다항 곡선의 지수'],
  ['성장률', 1.2, '지수 곡선의 레벨당 배율'],
];

export const REWARD_GROUP_HEADERS = ['group_id', '그룹명'];
export const REWARD_GROUPS = [
  ['RG001', '출석 7일차'],
  ['RG002', '출석 14일차'],
  ['RG003', '코인샵'],
  ['RG004', '보스 처치'],
];
/** 실습 과제에서 추가하는 그룹 */
export const MISSING_GROUP = ['RG005', '이벤트 상자'];

export const REWARD_HEADERS = ['reward_id', 'group_id', 'item_id', '수량'];
/** RW006 의 IT021(없는 아이템)과 RW011 의 RG005(없는 그룹)는 일부러 넣은 오류 */
export const REWARDS = [
  ['RW001', 'RG001', 'IT002', 1],
  ['RW002', 'RG001', 'IT009', 20],
  ['RW003', 'RG002', 'IT012', 1],
  ['RW004', 'RG002', 'IT004', 3],
  ['RW005', 'RG003', 'IT001', 2],
  ['RW006', 'RG003', 'IT021', 1],
  ['RW007', 'RG003', 'IT016', 10],
  ['RW008', 'RG004', 'IT007', 1],
  ['RW009', 'RG004', 'IT011', 5],
  ['RW010', 'RG004', 'IT015', 1],
  ['RW011', 'RG005', 'IT003', 5],
  ['RW012', 'RG001', 'IT017', 10],
];
/** 실습 과제에서 RW006 의 item_id 를 이것으로 고친다 */
export const FIXED_ITEM_ID = 'IT018';

export const CURVE_LEVELS = Array.from({ length: 50 }, (_, index) => index + 1);

// ---------- 6일차: 확률·시뮬레이션·스타포스 ----------

/** 설정 시트에 이어 붙이는 확률 파라미터 */
export const PROBABILITY_SETTINGS = [
  ['성공확률', 0.03, '1회 시도 성공 확률'],
  ['천장', 100, '이 횟수째에는 반드시 성공'],
  ['교체비용', 300000, '스타포스 파괴 시 장비 교체 비용(메소)'],
];

/** 이벤트 상자 확률표: 결과(아이템명), item_id, 확률 */
export const BOX_ROWS = [
  ['회복 물약(소)', 'IT009', 0.4],
  ['이동 주문서', 'IT016', 0.25],
  ['예시 강화석', 'IT011', 0.2],
  ['예시 큐브 조각', 'IT012', 0.1],
  ['예시 반지', 'IT007', 0.04],
  ['예시 무기 상자', 'IT020', 0.01],
];

export const CUMULATIVE_TRIES = 200;
export const TARGET_RATES = [0.5, 0.9, 0.99];
export const SIMULATION_COUNT = 1000;

/** 스타포스: 단계, 성공확률, 파괴확률, 1회비용 (모두 가정 수치) */
export const STARFORCE_ROWS = [
  [10, 0.5, 0, 20000],
  [11, 0.45, 0, 25000],
  [12, 0.4, 0.02, 30000],
  [13, 0.35, 0.03, 35000],
  [14, 0.3, 0.04, 40000],
];
