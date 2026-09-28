// GET /api/auth/google?return=#/study/today → 구글 로그인 화면으로 보낸다
import { redirect } from '../_lib/http.js';
import { safeReturnTo, startLogin } from '../_lib/google.js';

export function GET(request: Request): Response {
  const returnTo = safeReturnTo(new URL(request.url).searchParams.get('return'));
  try {
    const { location, cookie } = startLogin(request, returnTo);
    return redirect(location, [cookie]);
  } catch (cause) {
    console.error(cause);
    return redirect(`/?login=error${returnTo}`);
  }
}
