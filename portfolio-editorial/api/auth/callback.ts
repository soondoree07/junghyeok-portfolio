// GET /api/auth/callback?code=...&state=... → 구글에서 돌아온 계정을 확인한다
// - 허용한 계정이면 세션 쿠키를 주고 편집할 수 있게 한다
// - 다른 계정이면 로그인시키지 않고 "보기 전용"으로 안내한다
// 결과는 ?login=editor|viewer|error 로 화면에 알린다
import { createSessionCookie } from '../_lib/auth.js';
import { clearStateCookie, fetchVerifiedEmail, isAllowedEmail, readStateCookie } from '../_lib/google.js';
import { redirect } from '../_lib/http.js';

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const saved = readStateCookie(request);
  const returnTo = saved?.returnTo ?? '#/study/today';
  const code = url.searchParams.get('code');
  const clear = clearStateCookie();

  if (!saved || !code || url.searchParams.get('state') !== saved.state) {
    return redirect(`/?login=error${returnTo}`, [clear]);
  }

  try {
    const email = await fetchVerifiedEmail(request, code);
    if (!isAllowedEmail(email)) return redirect(`/?login=viewer${returnTo}`, [clear]);
    return redirect(`/?login=editor${returnTo}`, [clear, createSessionCookie()]);
  } catch (cause) {
    console.error(cause);
    return redirect(`/?login=error${returnTo}`, [clear]);
  }
}
