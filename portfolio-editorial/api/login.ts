// POST /api/login  { password } → 맞으면 세션 쿠키 발급. 15분에 10번 넘게 틀리면 잠근다
import { createSessionCookie, passwordMatches } from './_lib/auth.js';
import { error, json, readJson } from './_lib/http.js';
import { clearLoginFailures, isLoginLocked, recordLoginFailure } from './_lib/store.js';

export async function POST(request: Request): Promise<Response> {
  const body = (await readJson(request)) as { password?: unknown } | null;
  const password = typeof body?.password === 'string' ? body.password : '';
  try {
    if (await isLoginLocked()) return error('잠시 후 다시 시도해 주세요', 429);
    if (!passwordMatches(password)) {
      await recordLoginFailure();
      return error('비밀번호가 맞지 않아요', 401);
    }
    await clearLoginFailures();
    return json({ ok: true }, 200, { 'Set-Cookie': createSessionCookie() });
  } catch (cause) {
    console.error(cause);
    return error('로그인하지 못했어요', 500);
  }
}
