// 기록 JSON 내보내기(파일 다운로드)와 가져오기(파일 읽기).
import type { StudyRecords } from '../types';
import { todayInSeoul } from './seoulDate';
import { parseRecords } from './validateRecords';

export function downloadRecords(records: StudyRecords): void {
  const payload = { exportedAt: new Date().toISOString(), ...records };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `study-records-${todayInSeoul()}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

/** 파일을 읽어 기록으로 바꾼다. 형태가 틀리면 null */
export async function readRecordsFile(file: File): Promise<StudyRecords | null> {
  try {
    return parseRecords(JSON.parse(await file.text()));
  } catch {
    return null;
  }
}
