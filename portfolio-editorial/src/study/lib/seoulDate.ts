// Asia/Seoul 기준 날짜 계산. 날짜는 전부 'YYYY-MM-DD' 문자열로 다룬다.
// 문자열 → UTC 자정으로 바꿔 계산하면 브라우저 시간대와 무관하게 결과가 같다.

const SEOUL_FORMAT = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Seoul',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export function todayInSeoul(now: Date = new Date()): string {
  return SEOUL_FORMAT.format(now);
}

function toUtc(date: string): number {
  const [year, month, day] = date.split('-').map(Number);
  return Date.UTC(year, month - 1, day);
}

function fromUtc(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

export function addDays(date: string, days: number): string {
  return fromUtc(toUtc(date) + days * DAY_MS);
}

/** b - a (일) */
export function diffDays(a: string, b: string): number {
  return Math.round((toUtc(b) - toUtc(a)) / DAY_MS);
}

export function isWithin(date: string, range: { start: string; end: string }): boolean {
  return date >= range.start && date <= range.end;
}

export function eachDate(start: string, end: string): string[] {
  const dates: string[] = [];
  for (let date = start; date <= end; date = addDays(date, 1)) dates.push(date);
  return dates;
}

export function weekdayOf(date: string): string {
  return WEEKDAYS[new Date(toUtc(date)).getUTCDay()];
}

/** '2026-09-28' → '09.28 (월)' */
export function formatShort(date: string): string {
  return `${date.slice(5, 7)}.${date.slice(8, 10)} (${weekdayOf(date)})`;
}

/** '2026-09-28' → '2026년 9월 28일 월요일' */
export function formatLong(date: string): string {
  const [year, month, day] = date.split('-').map(Number);
  return `${year}년 ${month}월 ${day}일 ${weekdayOf(date)}요일`;
}

export function isValidDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && fromUtc(toUtc(value)) === value;
}
