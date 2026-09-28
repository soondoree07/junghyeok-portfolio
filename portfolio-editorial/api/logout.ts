// POST /api/logout → 세션 쿠키 삭제
import { clearSessionCookie } from './_lib/auth.js';
import { json } from './_lib/http.js';

export function POST(): Response {
  return json({ ok: true }, 200, { 'Set-Cookie': clearSessionCookie() });
}
