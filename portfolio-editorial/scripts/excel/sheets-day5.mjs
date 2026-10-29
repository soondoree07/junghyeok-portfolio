// 5일차(속성 2일): 이름 정의·ID 키 설계·참조 검사·성장 곡선. 피벗과 차트는 파일로 만들 수 없어 레슨에서 직접 만든다.
import { ITEMS } from './data.mjs';
import {
  CURVE_LEVELS, FIXED_ITEM_ID, MISSING_GROUP, REWARDS, REWARD_GROUPS, REWARD_GROUP_HEADERS, REWARD_HEADERS, SETTINGS,
} from './data-crash.mjs';
import { MESO_FORMAT, applyBorders, setWidths, styleHeaderRow } from './style.mjs';

const LIGHT_RED = { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FFF8CBAD' } };
const settingValue = (name) => SETTINGS.find((row) => row[0] === name)[1];
const itemPrice = (itemId) => ITEMS.find((item) => item[0] === itemId)?.[5] ?? 0;

// ---------- 설정 ----------

export function addSettingsSheet(workbook) {
  const sheet = workbook.addWorksheet('설정');
  sheet.addRow(['이름', '값', '설명']);
  SETTINGS.forEach((row) => sheet.addRow(row));
  setWidths(sheet, [12, 10, 30]);
  return sheet;
}

/** 설정 시트 B열 값에 A열 이름을 붙인다. startRow 부터 rows 개 */
export function defineSettingNames(workbook, rows, startRow) {
  rows.forEach(([name], index) => workbook.definedNames.add(`'설정'!$B$${startRow + index}`, name));
}

export function solveSettings(workbook) {
  defineSettingNames(workbook, SETTINGS, 2);
  const sheet = workbook.getWorksheet('설정');
  styleHeaderRow(sheet, 3);
  applyBorders(sheet, SETTINGS.length + 1, 3);
  const item = workbook.getWorksheet('아이템');
  ITEMS.forEach((row, index) => {
    item.getCell(`H${index + 2}`).value = {
      formula: `ROUNDUP(F${index + 2}/코인가치,0)`,
      result: Math.ceil(row[5] / settingValue('코인가치')),
    };
  });
}

// ---------- 보상그룹·보상 ----------

export function addRewardSheets(workbook) {
  const groups = workbook.addWorksheet('보상그룹');
  groups.addRow([...REWARD_GROUP_HEADERS, '보상수', '총가치']);
  REWARD_GROUPS.forEach((row) => groups.addRow(row));
  setWidths(groups, [10, 14, 8, 14]);
  const rewards = workbook.addWorksheet('보상');
  rewards.addRow([...REWARD_HEADERS, '가치', '검사']);
  REWARDS.forEach((row) => rewards.addRow(row));
  setWidths(rewards, [10, 10, 9, 7, 14, 12]);
}

const rewardCheck = ([, groupId, itemId], groupIds) => {
  if (!ITEMS.some((item) => item[0] === itemId)) return '없는 아이템';
  if (!groupIds.includes(groupId)) return '없는 그룹';
  return '';
};

/** 보상 시트 E·F열과 보상그룹 C·D열 수식. 실습 과제를 반영한 상태(fixed)로도 쓴다 */
function fillRewardFormulas(workbook, rewards, groups) {
  const groupIds = groups.map((row) => row[0]);
  const rewardSheet = workbook.getWorksheet('보상');
  rewards.forEach((reward, index) => {
    const row = index + 2;
    rewardSheet.getCell(`E${row}`).value = {
      formula: `D${row}*_xlfn.XLOOKUP(C${row},아이템!$A:$A,아이템!$F:$F,0)`,
      result: reward[3] * itemPrice(reward[2]),
    };
    rewardSheet.getCell(`E${row}`).numFmt = MESO_FORMAT;
    rewardSheet.getCell(`F${row}`).value = {
      formula: `IF(COUNTIF(아이템!$A:$A,C${row})=0,"없는 아이템",IF(COUNTIF(보상그룹!$A:$A,B${row})=0,"없는 그룹",""))`,
      result: rewardCheck(reward, groupIds),
    };
  });
  styleHeaderRow(rewardSheet, 6);
  applyBorders(rewardSheet, rewards.length + 1, 6);

  const groupSheet = workbook.getWorksheet('보상그룹');
  groups.forEach(([groupId], index) => {
    const row = index + 2;
    const members = rewards.filter((reward) => reward[1] === groupId);
    groupSheet.getCell(`C${row}`).value = { formula: `COUNTIF(보상!$B:$B,A${row})`, result: members.length };
    groupSheet.getCell(`D${row}`).value = {
      formula: `SUMIF(보상!$B:$B,A${row},보상!$E:$E)`,
      result: members.reduce((sum, reward) => sum + reward[3] * itemPrice(reward[2]), 0),
    };
    groupSheet.getCell(`D${row}`).numFmt = MESO_FORMAT;
  });
  styleHeaderRow(groupSheet, 4);
  applyBorders(groupSheet, groups.length + 1, 4);
}

export function solveRewardSheets(workbook) {
  fillRewardFormulas(workbook, REWARDS, REWARD_GROUPS);
  workbook.getWorksheet('보상').addConditionalFormatting({
    ref: `A2:F${REWARDS.length + 1}`,
    rules: [{ type: 'expression', formulae: ['$F2<>""'], style: { fill: LIGHT_RED } }],
  });
}

/** 실습 과제 결과: RW006 의 아이템을 고치고 RG005 그룹을 추가한다 (6일차 시작 파일용) */
export function fixRewardSheets(workbook) {
  const groups = [...REWARD_GROUPS, MISSING_GROUP];
  workbook.getWorksheet('보상그룹').addRow(MISSING_GROUP);
  workbook.getWorksheet('보상').getCell('C7').value = FIXED_ITEM_ID;
  fillRewardFormulas(workbook, fixedRewards(), groups);
}

const fixedRewards = () => REWARDS.map((row) => (row[0] === 'RW006' ? [row[0], row[1], FIXED_ITEM_ID, row[3]] : row));

// ---------- 곡선 ----------

const curveValues = (level) => ({
  linear: settingValue('기본값') * level * 10,
  polynomial: Math.round(settingValue('기본값') * level ** settingValue('지수')),
  exponential: Math.round(settingValue('기본값') * settingValue('성장률') ** level),
});

export function addCurveSheet(workbook) {
  const sheet = workbook.addWorksheet('곡선');
  sheet.addRow(['레벨', '선형', '다항', '지수']);
  CURVE_LEVELS.forEach((level) => sheet.addRow([level]));
  setWidths(sheet, [7, 10, 10, 12]);
}

export function solveCurveSheet(sheet) {
  CURVE_LEVELS.forEach((level, index) => {
    const row = index + 2;
    const values = curveValues(level);
    sheet.getCell(`B${row}`).value = { formula: `기본값*A${row}*10`, result: values.linear };
    sheet.getCell(`C${row}`).value = { formula: `ROUND(기본값*A${row}^지수,0)`, result: values.polynomial };
    sheet.getCell(`D${row}`).value = { formula: `ROUND(기본값*성장률^A${row},0)`, result: values.exponential };
  });
  styleHeaderRow(sheet, 4);
}

export function rewardAnswers() {
  const groupTotal = (rewards, groupId) =>
    rewards.filter((reward) => reward[1] === groupId).reduce((sum, reward) => sum + reward[3] * itemPrice(reward[2]), 0);
  // 레벨 1은 지수가 잠깐 앞서므로, 다항이 앞선 뒤 지수가 다시 추월하는 레벨을 찾는다
  const crossing = CURVE_LEVELS.find((level) => level > 10 && curveValues(level).exponential > curveValues(level).polynomial);
  return {
    'rg004-total': groupTotal(REWARDS, 'RG004'),
    'curve-cross': crossing,
    'rg003-fixed': groupTotal(fixedRewards(), 'RG003'),
  };
}
