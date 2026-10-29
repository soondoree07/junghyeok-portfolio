// 4일차(속성 1일): 조건 집계·조회·텍스트·날짜·입력 규칙. add* 는 시작 파일, solve* 는 정답 파일.
import { ITEMS } from './data.mjs';
import { COIN_VALUE, EVENT_START, LEVEL_TESTS, LEVEL_TIERS, LOGS, LOG_HEADERS, LOG_SOURCES } from './data-crash.mjs';
import { MESO_FORMAT, applyBorders, freezeHeaderAndId, setWidths, styleHeaderRow } from './style.mjs';

const KOREAN_WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const LIGHT_YELLOW = { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FFFFF2CC' } };
const LIGHT_RED = { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FFF8CBAD' } };

const logDate = (dayOffset) => new Date(Date.UTC(EVENT_START.year, EVENT_START.month - 1, EVENT_START.day + dayOffset));
const itemById = (itemId) => ITEMS.find((item) => item[0] === itemId);
const lastLogRow = LOGS.length + 1;

// ---------- 로그 ----------

export function addLogSheet(workbook) {
  const sheet = workbook.addWorksheet('로그');
  sheet.addRow(LOG_HEADERS);
  LOGS.forEach(([number, dayOffset, characterId, itemId, amount, source]) => {
    sheet.addRow([number, logDate(dayOffset), characterId, itemId, amount, source]);
  });
  for (let row = 2; row <= lastLogRow; row += 1) sheet.getCell(`B${row}`).numFmt = 'yyyy-mm-dd';
  setWidths(sheet, [9, 12, 9, 9, 7, 9]);
  return sheet;
}

export function solveLogSheet(sheet) {
  ['아이템명', '판매가', '메소환산', '요일', '주말여부'].forEach((title, index) => {
    sheet.getRow(1).getCell(7 + index).value = title;
  });
  LOGS.forEach(([, dayOffset, , itemId, amount], index) => {
    const row = index + 2;
    const item = itemById(itemId);
    const weekday = logDate(dayOffset).getUTCDay();
    sheet.getCell(`G${row}`).value = { formula: `_xlfn.XLOOKUP(D${row},아이템!$A:$A,아이템!$B:$B,"없음")`, result: item[1] };
    sheet.getCell(`H${row}`).value = { formula: `_xlfn.XLOOKUP(D${row},아이템!$A:$A,아이템!$F:$F,0)`, result: item[5] };
    sheet.getCell(`I${row}`).value = { formula: `E${row}*H${row}`, result: amount * item[5] };
    sheet.getCell(`J${row}`).value = { formula: `TEXT(B${row},"aaa")`, result: KOREAN_WEEKDAYS[weekday] };
    sheet.getCell(`K${row}`).value = {
      formula: `IF(WEEKDAY(B${row},2)>=6,"주말","평일")`,
      result: weekday === 0 || weekday === 6 ? '주말' : '평일',
    };
    sheet.getCell(`H${row}`).numFmt = MESO_FORMAT;
    sheet.getCell(`I${row}`).numFmt = MESO_FORMAT;
    sheet.getCell(`F${row}`).dataValidation = {
      type: 'list',
      allowBlank: false,
      formulae: [`"${LOG_SOURCES.join(',')}"`],
      showErrorMessage: true,
      errorStyle: 'stop',
      errorTitle: '획득처 확인',
      error: '목록에 있는 획득처를 골라 주세요',
    };
  });
  sheet.addConditionalFormatting({
    ref: `A2:K${lastLogRow}`,
    rules: [{ type: 'expression', formulae: ['$F2="보스"'], style: { fill: LIGHT_YELLOW } }],
  });
  styleHeaderRow(sheet, 11);
  applyBorders(sheet, lastLogRow, 11);
  setWidths(sheet, [9, 12, 9, 9, 7, 9, 16, 12, 14, 7, 9]);
  freezeHeaderAndId(sheet);
}

// ---------- 집계 ----------

const SUMMARY_HEADERS = ['item_id', '획득횟수', '수량합계', ...LOG_SOURCES];

export function addSummarySheet(workbook) {
  const sheet = workbook.addWorksheet('집계');
  sheet.addRow(SUMMARY_HEADERS);
  ITEMS.forEach(([itemId]) => sheet.addRow([itemId]));
  sheet.getCell('I1').value = '로그 전체 수량';
  sheet.getCell('I2').value = '집계 합계';
  sheet.getCell('I3').value = '검산';
  return sheet;
}

export function solveSummarySheet(sheet) {
  const answers = summaryAnswers();
  ITEMS.forEach(([itemId], index) => {
    const row = index + 2;
    const rows = LOGS.filter((log) => log[3] === itemId);
    sheet.getCell(`B${row}`).value = { formula: `COUNTIF(로그!$D:$D,A${row})`, result: rows.length };
    sheet.getCell(`C${row}`).value = {
      formula: `SUMIF(로그!$D:$D,A${row},로그!$E:$E)`,
      result: rows.reduce((sum, log) => sum + log[4], 0),
    };
    LOG_SOURCES.forEach((source, sourceIndex) => {
      const cell = sheet.getRow(row).getCell(4 + sourceIndex);
      const column = cell.address.replace(/\d+/, '');
      cell.value = {
        formula: `SUMIFS(로그!$E:$E,로그!$D:$D,$A${row},로그!$F:$F,${column}$1)`,
        result: rows.filter((log) => log[5] === source).reduce((sum, log) => sum + log[4], 0),
      };
    });
  });
  const last = ITEMS.length + 1;
  sheet.getCell('J1').value = { formula: 'SUM(로그!$E:$E)', result: answers['log-total'] };
  sheet.getCell('J2').value = { formula: `SUM(C2:C${last})`, result: answers['log-total'] };
  sheet.getCell('J3').value = { formula: 'IF(J1=J2,"OK","확인 필요")', result: 'OK' };
  styleHeaderRow(sheet, SUMMARY_HEADERS.length);
  applyBorders(sheet, last, SUMMARY_HEADERS.length);
  setWidths(sheet, [9, 9, 9, 7, 7, 7, 7, 3, 14, 10]);
}

// ---------- 레벨구간 ----------

export function addLevelTierSheet(workbook) {
  const sheet = workbook.addWorksheet('레벨구간');
  sheet.addRow(['하한레벨', '등급', '', '레벨', '판정등급']);
  LEVEL_TIERS.forEach(([level, grade], index) => {
    sheet.getCell(`A${index + 2}`).value = level;
    sheet.getCell(`B${index + 2}`).value = grade;
  });
  LEVEL_TESTS.forEach((level, index) => (sheet.getCell(`D${index + 2}`).value = level));
  return sheet;
}

const tierOf = (level) => [...LEVEL_TIERS].reverse().find(([floor]) => level >= floor)[1];

export function solveLevelTierSheet(sheet) {
  const last = LEVEL_TIERS.length + 1;
  LEVEL_TESTS.forEach((level, index) => {
    const row = index + 2;
    sheet.getCell(`E${row}`).value = {
      formula: `_xlfn.XLOOKUP(D${row},$A$2:$A$${last},$B$2:$B$${last},"",-1)`,
      result: tierOf(level),
    };
  });
  styleHeaderRow(sheet, 5);
}

// ---------- 아이템: 필요 코인·중복 검사 ----------

export function solveItemCoins(sheet) {
  sheet.getCell('H1').value = '필요코인';
  ITEMS.forEach((item, index) => {
    const row = index + 2;
    sheet.getCell(`H${row}`).value = { formula: `ROUNDUP(F${row}/${COIN_VALUE},0)`, result: Math.ceil(item[5] / COIN_VALUE) };
  });
  sheet.addConditionalFormatting({
    ref: `A2:A${ITEMS.length + 1}`,
    rules: [{ type: 'expression', formulae: ['COUNTIF($A:$A,$A2)>1'], style: { fill: LIGHT_RED } }],
  });
  styleHeaderRow(sheet, 8);
  sheet.getColumn(8).width = 10;
}

export function summaryAnswers() {
  const total = (rows) => rows.reduce((sum, log) => sum + log[4], 0);
  const meso = LOGS.reduce((sum, log) => sum + log[4] * itemById(log[3])[5], 0);
  return {
    'log-total': total(LOGS),
    'boss-total': total(LOGS.filter((log) => log[5] === '보스')),
    'meso-total': meso,
    'weekend-rows': LOGS.filter((log) => [0, 6].includes(logDate(log[1]).getUTCDay())).length,
  };
}
