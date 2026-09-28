// GET  /api/records : 누구나. 로그인하지 않았으면 메모·링크를 뺀 공개본
// PUT  /api/records : 로그인 필요. 보낸 날짜·복습 답만 덮어쓴다 (나머지는 그대로)
import { isAuthed } from './_lib/auth.js';
import { error, json, readJson } from './_lib/http.js';
import { mergeRecords, readRecords, toPublicRecords } from './_lib/store.js';
import { parseRecords } from '../src/study/lib/validateRecords.js';

export async function GET(request: Request): Promise<Response> {
  try {
    const authed = isAuthed(request);
    const records = await readRecords();
    return json({ authed, records: authed ? records : toPublicRecords(records) });
  } catch (cause) {
    console.error(cause);
    return error('기록을 불러오지 못했어요', 500);
  }
}

export async function PUT(request: Request): Promise<Response> {
  if (!isAuthed(request)) return error('로그인이 필요해요', 401);
  const patch = parseRecords(await readJson(request));
  if (!patch) return error('기록 형식이 맞지 않아요', 400);
  try {
    await mergeRecords(patch);
    return json({ ok: true });
  } catch (cause) {
    console.error(cause);
    return error('기록을 저장하지 못했어요', 500);
  }
}
