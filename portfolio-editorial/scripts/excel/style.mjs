// 실습 파일 공통 서식. 정답 파일에서 "이렇게 정리하면 된다"를 보여주는 모양.

const THIN = { style: 'thin', color: { argb: 'FF15171A' } };
export const ALL_BORDERS = { top: THIN, left: THIN, bottom: THIN, right: THIN };

/** 메소 단위 표시 형식 (값은 숫자 그대로) */
export const MESO_FORMAT = '#,##0"메소"';

export function styleHeaderRow(sheet, columnCount) {
  const row = sheet.getRow(1);
  for (let column = 1; column <= columnCount; column += 1) {
    const cell = row.getCell(column);
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2E5D3A' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
  }
}

export function applyBorders(sheet, lastRow, lastColumn) {
  for (let row = 1; row <= lastRow; row += 1) {
    for (let column = 1; column <= lastColumn; column += 1) {
      sheet.getRow(row).getCell(column).border = ALL_BORDERS;
    }
  }
}

export function setWidths(sheet, widths) {
  widths.forEach((width, index) => {
    sheet.getColumn(index + 1).width = width;
  });
}

/** 첫 행과 A열 고정 */
export function freezeHeaderAndId(sheet) {
  sheet.views = [{ state: 'frozen', xSplit: 1, ySplit: 1 }];
}

/** 파일을 연 사람이 무엇을 할지 바로 알도록 첫 시트 옆에 안내 시트를 둔다 */
export function addGuideSheet(workbook, lines) {
  const sheet = workbook.addWorksheet('안내');
  lines.forEach((line, index) => {
    sheet.getCell(`A${index + 1}`).value = line;
  });
  sheet.getColumn(1).width = 90;
  sheet.getCell('A1').font = { bold: true, size: 13 };
  return sheet;
}
