// 구글 로그인(OAuth 2.0 인가 코드 방식) 도우미.
// 필요한 환경변수: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, STUDY_ALLOWED_EMAIL(편집을 허용할 구글 계정)
import { randomBytes } from 'node:crypto';

const AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_ISSUERS = ['https://accounts.google.com', 'accounts.google.com'];

const STATE_COOKIE = 'study_oauth';
const STATE_SECONDS = 10 * 60;
/** 로그인 뒤 돌아갈 화면. 해시 라우트만 허용해 다른 사이트로 튀지 않게 한다 */
const RETURN_PATTERN = /^#\/[a-z0-9\-/]*$/i;

function requireEnv(name: 'GOOGLE_CLIENT_ID' | 'GOOGLE_CLIENT_SECRET' | 'STUDY_ALLOWED_EMAIL'): string {
  const value = process.env[name];
  if (!value) throw new Error(`환경변수 ${name} 가 없습니다`);
  return value;
}

export function callbackUrl(request: Request): string {
  return new URL('/api/auth/callback', request.url).toString();
}

export function safeReturnTo(value: string | null | undefined): string {
  return value && RETURN_PATTERN.test(value) ? value : '#/study/today';
}

/** 구글 로그인 화면 주소와, 돌아왔을 때 대조할 state 쿠키 */
export function startLogin(request: Request, returnTo: string): { location: string; cookie: string } {
  const state = randomBytes(24).toString('base64url');
  const params = new URLSearchParams({
    client_id: requireEnv('GOOGLE_CLIENT_ID'),
    redirect_uri: callbackUrl(request),
    response_type: 'code',
    scope: 'openid email',
    state,
    prompt: 'select_account',
  });
  const value = `${state}.${Buffer.from(returnTo).toString('base64url')}`;
  return {
    location: `${AUTH_URL}?${params}`,
    // 구글에서 돌아오는 요청(다른 사이트에서 온 이동)에도 실려야 해서 Lax
    cookie: `${STATE_COOKIE}=${value}; Path=/api/auth; HttpOnly; Secure; SameSite=Lax; Max-Age=${STATE_SECONDS}`,
  };
}

export function clearStateCookie(): string {
  return `${STATE_COOKIE}=; Path=/api/auth; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

export function readStateCookie(request: Request): { state: string; returnTo: string } | null {
  const header = request.headers.get('cookie') ?? '';
  const raw = header
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${STATE_COOKIE}=`))
    ?.slice(STATE_COOKIE.length + 1);
  if (!raw) return null;
  const [state, encodedReturn] = raw.split('.');
  if (!state || !encodedReturn) return null;
  return { state, returnTo: safeReturnTo(Buffer.from(encodedReturn, 'base64url').toString()) };
}

interface IdTokenClaims {
  iss?: string;
  aud?: string;
  exp?: number;
  email?: string;
  email_verified?: boolean;
}

/**
 * 인가 코드를 토큰으로 바꾸고 로그인한 구글 계정 이메일을 돌려준다.
 * id_token 은 TLS 로 구글 토큰 엔드포인트에서 직접 받은 것이라 서명 검증 대신 발급자·대상·만료를 확인한다
 * (OpenID Connect Core 3.1.3.7).
 */
export async function fetchVerifiedEmail(request: Request, code: string): Promise<string> {
  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: requireEnv('GOOGLE_CLIENT_ID'),
      client_secret: requireEnv('GOOGLE_CLIENT_SECRET'),
      redirect_uri: callbackUrl(request),
      grant_type: 'authorization_code',
    }),
  });
  if (!response.ok) throw new Error(`토큰 교환 실패 (${response.status})`);
  const { id_token: idToken } = (await response.json()) as { id_token?: string };
  const payload = idToken?.split('.')[1];
  if (!payload) throw new Error('id_token 이 없습니다');
  const claims = JSON.parse(Buffer.from(payload, 'base64url').toString()) as IdTokenClaims;

  const valid =
    GOOGLE_ISSUERS.includes(claims.iss ?? '') &&
    claims.aud === requireEnv('GOOGLE_CLIENT_ID') &&
    (claims.exp ?? 0) > Date.now() / 1000 &&
    claims.email_verified === true &&
    typeof claims.email === 'string';
  if (!valid) throw new Error('id_token 검증 실패');
  return claims.email!.toLowerCase();
}

export function isAllowedEmail(email: string): boolean {
  const allowed = requireEnv('STUDY_ALLOWED_EMAIL')
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  return allowed.includes(email);
}
