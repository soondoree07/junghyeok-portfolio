// 레슨 코드에 나오는 함수의 뜻. 코드 속 함수 이름에 마우스를 올리거나 누르면 이 내용이 말풍선으로 뜬다.
// 새 레슨에서 처음 쓰는 함수는 여기에 먼저 추가한다 (없으면 밑줄 없이 그냥 보인다).
import type { ToolId } from '../types';

export interface FunctionEntry {
  /** 쓰는 법 */
  syntax: string;
  /** 한 줄 뜻 */
  meaning: string;
  /** 예시 수식과 결과 */
  example: string;
}

export type FunctionGlossary = Record<string, FunctionEntry>;

const EXCEL_FUNCTIONS: FunctionGlossary = {
  SUM: {
    syntax: 'SUM(범위)',
    meaning: '범위 안의 숫자를 모두 더해요. 필터로 숨긴 행도 더해요.',
    example: '=SUM(A2:A4) → A2~A4 합계',
  },
  AVERAGE: {
    syntax: 'AVERAGE(범위)',
    meaning: '범위 안 숫자의 평균이에요. 빈 칸은 빼고 계산해요.',
    example: '=AVERAGE(10,20,30) → 20',
  },
  MAX: {
    syntax: 'MAX(범위)',
    meaning: '범위에서 가장 큰 값이에요.',
    example: '=MAX(3,9,5) → 9',
  },
  MIN: {
    syntax: 'MIN(범위)',
    meaning: '범위에서 가장 작은 값이에요.',
    example: '=MIN(3,9,5) → 3',
  },
  SUBTOTAL: {
    syntax: 'SUBTOTAL(함수 번호, 범위)',
    meaning: '필터로 숨긴 행을 빼고 계산해요. 번호 109는 합계, 101은 평균이에요.',
    example: '=SUBTOTAL(109,A2:A21) → 보이는 행만 합계',
  },
  IF: {
    syntax: 'IF(조건, 참일 때 값, 거짓일 때 값)',
    meaning: '조건이 맞으면 앞의 값, 아니면 뒤의 값을 보여줘요.',
    example: '=IF(C2>=5,"많음","적음") → C2가 7이면 많음',
  },
  IFS: {
    syntax: 'IFS(조건1, 값1, 조건2, 값2, ..., TRUE, 기본값)',
    meaning: '조건을 왼쪽부터 검사해 처음 맞는 조건의 값을 보여줘요. 좁은 조건을 앞에 둬요.',
    example: '=IFS(A2>=180,"상위",A2>=150,"중위",TRUE,"하위") → 160이면 중위',
  },
  AND: {
    syntax: 'AND(조건1, 조건2, ...)',
    meaning: '조건이 모두 맞아야 TRUE예요. "~이면서"일 때 써요.',
    example: '=AND(A2>=1,A2<=3) → A2가 2면 TRUE',
  },
  OR: {
    syntax: 'OR(조건1, 조건2, ...)',
    meaning: '조건 중 하나라도 맞으면 TRUE예요. "~이거나"일 때 써요.',
    example: '=OR(A2=6,A2=7) → A2가 7이면 TRUE',
  },
  MOD: {
    syntax: 'MOD(숫자, 나눌 수)',
    meaning: '나눗셈의 나머지예요. 7로 나누면 요일처럼 반복되는 값을 구할 수 있어요.',
    example: '=MOD(13,7) → 6 (13 = 7×1 + 6)',
  },
  ROUND: {
    syntax: 'ROUND(숫자, 자릿수)',
    meaning: '반올림해요. 자릿수 0은 정수, 2는 소수 둘째 자리, -1은 10 단위예요.',
    example: '=ROUND(1312.5,0) → 1313',
  },
};

const GLOSSARIES: Partial<Record<ToolId, FunctionGlossary>> = {
  excel: EXCEL_FUNCTIONS,
};

export function getFunctionGlossary(tool: ToolId): FunctionGlossary {
  return GLOSSARIES[tool] ?? {};
}
