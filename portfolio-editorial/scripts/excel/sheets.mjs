// 시트 만들기. add* 는 시작 파일에 들어갈 원본(값만), solve* 는 정답 파일에서 덧붙일 서식·수식.
// 수식 셀은 { formula, result } 로 넣어 엑셀이 다시 계산하기 전에도 결과가 보이게 한다.
// 수식 문자열은 영문 함수명·쉼표 구분으로 쓴다 (한국어판 엑셀에서도 파일 안에서는 이 형식).
import {
  ATTENDANCE, ATTENDANCE_HEADERS, DROPS, DROP_HEADERS, ITEMS, ITEM_HEADERS, LEVELS, MULTIPLIERS, WEEKEND_BONUS,
} from './data.mjs';
import { MESO_FORMAT, applyBorders, freezeHeaderAndId, setWidths, styleHeaderRow } from './style.mjs';

const round = (value, digits = 0) => Number(value.toFixed(digits));

// ---------- 1일차: 아이템 시트 ----------

export function addItemSheet(workbook) {
  const sheet = workbook.addWorksheet('아이템');
  sheet.addRow(ITEM_HEADERS);
  ITEMS.forEach((item) => sheet.addRow(item));
  return sheet;
}

export function solveItemSheet(sheet) {
  styleHeaderRow(sheet, ITEM_HEADERS.length);
  for (let row = 2; row <= ITEMS.length + 1; row += 1) sheet.getCell(`F${row}`).numFmt = MESO_FORMAT;
  applyBorders(sheet, ITEMS.length + 1, ITEM_HEADERS.length);
  setWidths(sheet, [10, 18, 8, 8, 10, 14, 10]);
}

/** 이동·선택 단축키 연습용: 12행이 비어 있어 Ctrl+Shift+↓ 가 거기서 멈춘다 */
export function addShortcutSheet(workbook) {
  const sheet = workbook.addWorksheet('단축키연습');
  sheet.addRow(['번호', '값']);
  for (let index = 1; index <= 30; index += 1) {
    if (index === 11) sheet.addRow([]);
    sheet.addRow([index, index * 10]);
  }
  return sheet;
}

export function itemAnswers() {
  return {
    'price-sum': ITEMS.reduce((sum, item) => sum + item[5], 0),
    'epic-count': ITEMS.filter((item) => item[3] === '에픽').length,
  };
}

// ---------- 2일차: 드롭 시트 ----------

export function addDropSheet(workbook) {
  const sheet = workbook.addWorksheet('드롭');
  sheet.addRow(DROP_HEADERS);
  DROPS.forEach((drop) => sheet.addRow(drop));
  return sheet;
}

export function solveDropSheet(sheet) {
  sheet.getCell('G1').value = '평균수량';
  sheet.getCell('H1').value = '기대드롭';
  DROPS.forEach((drop, index) => {
    const row = index + 2;
    const average = (drop[4] + drop[5]) / 2;
    sheet.getCell(`G${row}`).value = { formula: `(E${row}+F${row})/2`, result: average };
    sheet.getCell(`H${row}`).value = { formula: `D${row}*G${row}`, result: round(drop[3] * average, 4) };
    sheet.getCell(`D${row}`).numFmt = '0%';
    sheet.getCell(`H${row}`).numFmt = '0.000';
  });
  const last = DROPS.length + 1;
  const total = dropAnswers()['expected-total'];
  sheet.getCell(`G${last + 1}`).value = '합계';
  sheet.getCell(`H${last + 1}`).value = { formula: `SUBTOTAL(109,H2:H${last})`, result: total };
  sheet.getCell(`H${last + 1}`).numFmt = '0.000';
  sheet.getCell(`H${last + 1}`).font = { bold: true };
  styleHeaderRow(sheet, 8);
  applyBorders(sheet, last, 8);
  setWidths(sheet, [9, 14, 9, 10, 10, 10, 10, 10]);
  sheet.autoFilter = `A1:H${last}`;
  freezeHeaderAndId(sheet);
}

export function dropAnswers() {
  const expected = (drop) => drop[3] * ((drop[4] + drop[5]) / 2);
  return {
    'expected-total': round(DROPS.reduce((sum, drop) => sum + expected(drop), 0), 4),
    'monster3-total': round(
      DROPS.filter((drop) => drop[1] === '예시 몬스터 3').reduce((sum, drop) => sum + expected(drop), 0),
      4,
    ),
  };
}

// ---------- 3일차: 출석·배율표 시트 ----------

const isWeekend = (day) => day % 7 === 6 || day % 7 === 0;
const rewardType = (day) => (day === 14 ? '최종' : day % 7 === 0 ? '주간' : day <= 3 ? '초반' : '일반');

export function addAttendanceSheet(workbook) {
  const sheet = workbook.addWorksheet('출석');
  sheet.addRow(ATTENDANCE_HEADERS);
  ATTENDANCE.forEach((row) => sheet.addRow(row));
  sheet.getCell('H1').value = '주말 보너스 배율';
  sheet.getCell('I1').value = WEEKEND_BONUS;
  return sheet;
}

export function solveAttendanceSheet(sheet) {
  ATTENDANCE.forEach(([day, , amount], index) => {
    const row = index + 2;
    sheet.getCell(`D${row}`).value = {
      formula: `IF(OR(MOD(A${row},7)=6,MOD(A${row},7)=0),"주말","평일")`,
      result: isWeekend(day) ? '주말' : '평일',
    };
    sheet.getCell(`E${row}`).value = {
      formula: `IF(D${row}="주말",C${row}*$I$1,C${row})`,
      result: isWeekend(day) ? amount * WEEKEND_BONUS : amount,
    };
    sheet.getCell(`F${row}`).value = {
      // 2019 이후 추가된 함수(IFS, XLOOKUP 등)는 파일 안에 _xlfn. 접두사로 저장해야 #NAME? 이 나지 않는다
      formula: `_xlfn.IFS(A${row}=14,"최종",MOD(A${row},7)=0,"주간",AND(A${row}>=1,A${row}<=3),"초반",TRUE,"일반")`,
      result: rewardType(day),
    };
  });
  styleHeaderRow(sheet, ATTENDANCE_HEADERS.length);
  applyBorders(sheet, ATTENDANCE.length + 1, ATTENDANCE_HEADERS.length);
  setWidths(sheet, [8, 10, 8, 10, 12, 10, 4, 18, 6]);
}

export function addMultiplierSheet(workbook) {
  const sheet = workbook.addWorksheet('배율표');
  sheet.getCell('A1').value = '레벨 × 이벤트 배율 보상 (=레벨×배율×10, 반올림)';
  sheet.getCell('A2').value = '레벨＼배율';
  MULTIPLIERS.forEach((multiplier, index) => (sheet.getRow(2).getCell(index + 2).value = multiplier));
  LEVELS.forEach((level, index) => (sheet.getCell(`A${index + 3}`).value = level));
  return sheet;
}

export function solveMultiplierSheet(sheet) {
  LEVELS.forEach((level, rowIndex) => {
    MULTIPLIERS.forEach((multiplier, columnIndex) => {
      const cell = sheet.getRow(rowIndex + 3).getCell(columnIndex + 2);
      const column = cell.address.replace(/\d+/, '');
      cell.value = { formula: `ROUND($A${rowIndex + 3}*${column}$2*10,0)`, result: Math.round(level * multiplier * 10) };
    });
  });
  applyBorders(sheet, LEVELS.length + 2, MULTIPLIERS.length + 1);
  sheet.getColumn(1).width = 12;
}

export function attendanceAnswers() {
  return {
    'bonus-total': ATTENDANCE.reduce((sum, [day, , amount]) => sum + (isWeekend(day) ? amount * WEEKEND_BONUS : amount), 0),
    'matrix-170-2': Math.round(170 * 2 * 10),
  };
}
