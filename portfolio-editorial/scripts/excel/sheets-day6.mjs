// 6일차(속성 3일): 확률·기대값·천장, RAND 시뮬레이션, 스타포스 기대 비용. 검증 시트는 실습 과제라 정답 파일에 없다.
import { ITEMS } from './data.mjs';
import {
  BOX_ROWS, CUMULATIVE_TRIES, PROBABILITY_SETTINGS, SETTINGS, SIMULATION_COUNT, STARFORCE_ROWS, TARGET_RATES,
  seededRandom,
} from './data-crash.mjs';
import { defineSettingNames } from './sheets-day5.mjs';
import { MESO_FORMAT, applyBorders, setWidths, styleHeaderRow } from './style.mjs';

const ASSUMPTION_NOTE = '모든 확률·비용은 학습용 가정 수치예요. 실제 값은 공식 확률 공개 페이지에서 직접 확인해요.';
const probabilitySetting = (name) => PROBABILITY_SETTINGS.find((row) => row[0] === name)[1];
const itemPrice = (itemId) => ITEMS.find((item) => item[0] === itemId)[5];
const round = (value, digits) => Number(value.toFixed(digits));
const boxLast = BOX_ROWS.length + 3;

// ---------- 설정에 확률 파라미터 추가 ----------

export function addProbabilitySettings(workbook) {
  const sheet = workbook.getWorksheet('설정');
  PROBABILITY_SETTINGS.forEach((row) => sheet.addRow(row));
}

export function solveProbabilitySettings(workbook) {
  defineSettingNames(workbook, PROBABILITY_SETTINGS, SETTINGS.length + 2);
  const sheet = workbook.getWorksheet('설정');
  applyBorders(sheet, SETTINGS.length + PROBABILITY_SETTINGS.length + 1, 3);
}

// ---------- 확률 ----------

export function addProbabilitySheet(workbook) {
  const sheet = workbook.addWorksheet('확률');
  sheet.getCell('A1').value = ASSUMPTION_NOTE;
  ['결과', 'item_id', '확률', '가치', '누적하한'].forEach((title, index) => (sheet.getRow(3).getCell(index + 1).value = title));
  BOX_ROWS.forEach((row, index) => row.forEach((value, column) => (sheet.getRow(index + 4).getCell(column + 1).value = value)));
  ['확률 합', '검증', '기대값'].forEach((label, index) => (sheet.getCell(`G${index + 3}`).value = label));
  sheet.getCell('J3').value = '시도 횟수';
  sheet.getCell('K3').value = '누적확률';
  for (let tries = 1; tries <= CUMULATIVE_TRIES; tries += 1) sheet.getCell(`J${tries + 3}`).value = tries;
  sheet.getCell('M3').value = '목표 확률';
  sheet.getCell('N3').value = '필요 횟수';
  TARGET_RATES.forEach((rate, index) => (sheet.getCell(`M${index + 4}`).value = rate));
  ['천장 없는 기대 시도', '천장 있는 기대 시도', '천장 도달 확률'].forEach(
    (label, index) => (sheet.getCell(`M${index + 8}`).value = label),
  );
  for (let row = 4; row <= boxLast; row += 1) sheet.getCell(`C${row}`).numFmt = '0%';
  TARGET_RATES.forEach((_, index) => (sheet.getCell(`M${index + 4}`).numFmt = '0%'));
  setWidths(sheet, [16, 9, 8, 12, 9, 3, 9, 12, 3, 9, 10, 3, 20, 10]);
}

export function solveProbabilitySheet(sheet) {
  const answers = probabilityAnswers();
  let lowerBound = 0;
  BOX_ROWS.forEach(([, itemId, rate], index) => {
    const row = index + 4;
    sheet.getCell(`D${row}`).value = { formula: `_xlfn.XLOOKUP(B${row},아이템!$A:$A,아이템!$F:$F,0)`, result: itemPrice(itemId) };
    sheet.getCell(`D${row}`).numFmt = MESO_FORMAT;
    sheet.getCell(`E${row}`).value = index === 0 ? 0 : { formula: `E${row - 1}+C${row - 1}`, result: round(lowerBound, 4) };
    lowerBound += rate;
  });
  sheet.getCell('H3').value = { formula: `SUM(C4:C${boxLast})`, result: 1 };
  sheet.getCell('H4').value = { formula: 'IF(ABS(H3-1)<0.000000001,"OK","확률 합 오류")', result: 'OK' };
  sheet.getCell('H5').value = { formula: `SUMPRODUCT(C4:C${boxLast},D4:D${boxLast})`, result: answers['box-expected'] };
  sheet.getCell('H5').numFmt = MESO_FORMAT;

  const rate = probabilitySetting('성공확률');
  for (let tries = 1; tries <= CUMULATIVE_TRIES; tries += 1) {
    const cell = sheet.getCell(`K${tries + 3}`);
    cell.value = { formula: `1-(1-성공확률)^J${tries + 3}`, result: round(1 - (1 - rate) ** tries, 6) };
    cell.numFmt = '0.0%';
  }
  TARGET_RATES.forEach((target, index) => {
    sheet.getCell(`N${index + 4}`).value = {
      formula: `ROUNDUP(LN(1-M${index + 4})/LN(1-성공확률),0)`,
      result: Math.ceil(Math.log(1 - target) / Math.log(1 - rate)),
    };
  });
  const ceiling = probabilitySetting('천장');
  sheet.getCell('N8').value = { formula: '1/성공확률', result: round(1 / rate, 4) };
  sheet.getCell('N9').value = { formula: '(1-(1-성공확률)^천장)/성공확률', result: answers['ceiling-expected'] };
  sheet.getCell('N10').value = { formula: '(1-성공확률)^(천장-1)', result: round((1 - rate) ** (ceiling - 1), 4) };
  sheet.getCell('N10').numFmt = '0.0%';
  ['N8', 'N9'].forEach((address) => (sheet.getCell(address).numFmt = '0.00'));
}

// ---------- 시뮬 ----------

export function addSimulationSheet(workbook) {
  const sheet = workbook.addWorksheet('시뮬');
  sheet.addRow(['회차', '난수', '결과', '성공까지 시도', '', '결과', '비율']);
  for (let index = 1; index <= SIMULATION_COUNT; index += 1) sheet.getCell(`A${index + 1}`).value = index;
  BOX_ROWS.forEach(([name], index) => (sheet.getCell(`F${index + 2}`).value = name));
  sheet.getCell('F9').value = '평균 시도';
  sheet.getCell('F10').value = '90백분위';
  setWidths(sheet, [7, 9, 16, 12, 3, 16, 9]);
}

/** 정답 파일의 결과값. 엑셀이 파일을 열면 RAND 로 다시 계산해 값은 바뀐다 */
export function solveSimulationSheet(sheet) {
  const random = seededRandom(6);
  const rate = probabilitySetting('성공확률');
  const ceiling = probabilitySetting('천장');
  const lowerBounds = BOX_ROWS.map((_, index) => BOX_ROWS.slice(0, index).reduce((sum, row) => sum + row[2], 0));
  const results = [];
  const tries = [];
  for (let index = 0; index < SIMULATION_COUNT; index += 1) {
    const row = index + 2;
    const draw = random();
    const resultIndex = lowerBounds.findLastIndex((bound) => draw >= bound);
    const attempts = Math.min(ceiling, Math.ceil(Math.log(1 - random()) / Math.log(1 - rate)) || 1);
    results.push(BOX_ROWS[resultIndex][0]);
    tries.push(attempts);
    sheet.getCell(`B${row}`).value = { formula: 'RAND()', result: round(draw, 6) };
    sheet.getCell(`C${row}`).value = {
      formula: `_xlfn.XLOOKUP(B${row},확률!$E$4:$E$${boxLast},확률!$A$4:$A$${boxLast},,-1)`,
      result: BOX_ROWS[resultIndex][0],
    };
    sheet.getCell(`D${row}`).value = { formula: 'MIN(천장,ROUNDUP(LN(RAND())/LN(1-성공확률),0))', result: attempts };
  }
  const last = SIMULATION_COUNT + 1;
  BOX_ROWS.forEach(([name], index) => {
    const cell = sheet.getCell(`G${index + 2}`);
    cell.value = { formula: `COUNTIF($C$2:$C$${last},F${index + 2})/${SIMULATION_COUNT}`, result: results.filter((value) => value === name).length / SIMULATION_COUNT };
    cell.numFmt = '0.0%';
  });
  const sorted = [...tries].sort((a, b) => a - b);
  sheet.getCell('G9').value = { formula: `AVERAGE(D2:D${last})`, result: round(tries.reduce((a, b) => a + b, 0) / tries.length, 2) };
  sheet.getCell('G10').value = { formula: `_xlfn.PERCENTILE.INC(D2:D${last},0.9)`, result: sorted[Math.floor(0.9 * (sorted.length - 1))] };
  styleHeaderRow(sheet, 4);
}

// ---------- 스타포스 ----------

const STARFORCE_HEADERS = ['단계', '성공확률', '파괴확률', '1회비용', '실패확률', '기대시도', '기대파괴', '단계비용', '누적비용'];

export function addStarforceSheet(workbook) {
  const sheet = workbook.addWorksheet('스타포스');
  sheet.getCell('A1').value = `${ASSUMPTION_NOTE} 파괴되면 교체비용을 내고 같은 단계에서 다시 시도한다고 가정해요.`;
  STARFORCE_HEADERS.forEach((title, index) => (sheet.getRow(3).getCell(index + 1).value = title));
  STARFORCE_ROWS.forEach((row, index) => row.forEach((value, column) => (sheet.getRow(index + 4).getCell(column + 1).value = value)));
  for (let row = 4; row < STARFORCE_ROWS.length + 4; row += 1) {
    ['B', 'C'].forEach((column) => (sheet.getCell(`${column}${row}`).numFmt = '0%'));
    sheet.getCell(`D${row}`).numFmt = MESO_FORMAT;
  }
  setWidths(sheet, [7, 9, 9, 13, 9, 9, 9, 14, 14]);
}

function starforceRows() {
  let cumulative = 0;
  return STARFORCE_ROWS.map(([stage, success, destroy, cost]) => {
    const tries = 1 / success;
    const destroyed = tries * destroy;
    const stageCost = Math.round(tries * cost + destroyed * probabilitySetting('교체비용'));
    cumulative += stageCost;
    return { stage, fail: round(1 - success - destroy, 4), tries: round(tries, 4), destroyed: round(destroyed, 4), stageCost, cumulative };
  });
}

export function solveStarforceSheet(sheet) {
  starforceRows().forEach((values, index) => {
    const row = index + 4;
    sheet.getCell(`E${row}`).value = { formula: `1-B${row}-C${row}`, result: values.fail };
    sheet.getCell(`F${row}`).value = { formula: `1/B${row}`, result: values.tries };
    sheet.getCell(`G${row}`).value = { formula: `F${row}*C${row}`, result: values.destroyed };
    sheet.getCell(`H${row}`).value = { formula: `ROUND(F${row}*D${row}+G${row}*교체비용,0)`, result: values.stageCost };
    sheet.getCell(`I${row}`).value = { formula: `SUM($H$4:H${row})`, result: values.cumulative };
    sheet.getCell(`E${row}`).numFmt = '0%';
    ['F', 'G'].forEach((column) => (sheet.getCell(`${column}${row}`).numFmt = '0.00'));
    ['H', 'I'].forEach((column) => (sheet.getCell(`${column}${row}`).numFmt = MESO_FORMAT));
  });
}

export function probabilityAnswers() {
  const rate = probabilitySetting('성공확률');
  const rows = starforceRows();
  return {
    'box-expected': round(BOX_ROWS.reduce((sum, [, itemId, chance]) => sum + chance * itemPrice(itemId), 0), 4),
    'tries-90': Math.ceil(Math.log(0.1) / Math.log(1 - rate)),
    'ceiling-expected': round((1 - (1 - rate) ** probabilitySetting('천장')) / rate, 4),
    'starforce-total': rows[rows.length - 1].cumulative,
  };
}
