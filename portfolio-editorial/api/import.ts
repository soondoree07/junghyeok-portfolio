// POST /api/import : 로그인 필요. JSON 가져오기 — 저장된 기록 전체를 보낸 내용으로 바꾼다
import { isAuthed } from './_lib/auth.js';
import { error, json, readJson } from './_lib/http.js';
import { replaceRecords } from './_lib/store.js';
import { parseRecords } from '../src/study/lib/validateRecords.js';

export async function POST(request: Request): Promise<Response> {
  if (!isAuthed(request)) return error('로그인이 필요해요', 401);
  const records = parseRecords(await readJson(request));
  if (!records) return error('기록 형식이 맞지 않아요', 400);
  try {
    await replaceRecords(records);
    return json({ ok: true });
  } catch (cause) {
    console.error(cause);
    return error('기록을 바꾸지 못했어요', 500);
  }
}
