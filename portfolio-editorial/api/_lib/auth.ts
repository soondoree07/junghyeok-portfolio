// 세션 쿠키. 구글 로그인(google.ts)으로 허용 계정이 확인되면 발급한다.
// 쿠키 값은 `만료시각.서명` 이고 서명은 STUDY_SESSION_SECRET 으로 만든다.
// 필요한 환경변수: STUDY_SESSION_SECRET (32자 이상 임의 문자열)
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

const COOKIE_NAME = 'study_session';
const SESSION_SECONDS = 60 * 60 * 24 * 30;

function sessionSecret(): string {
  const value = process.env.STUDY_SESSION_SECRET;
  if (!value) throw new Error('환경변수 STUDY_SESSION_SECRET 가 없습니다');
  return value;
}

function sameText(a: string, b: string): boolean {
  // 길이 차이로 새지 않게 해시끼리 비교한다
  const digestA = createHash('sha256').update(a).digest();
  const digestB = createHash('sha256').update(b).digest();
  return timingSafeEqual(digestA, digestB);
}

function sign(expiresAt: number): string {
  return createHmac('sha256', sessionSecret()).update(String(expiresAt)).digest('base64url');
}

function cookieAttributes(maxAge: number): string {
  return `Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;
}

export function createSessionCookie(): string {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  return `${COOKIE_NAME}=${expiresAt}.${sign(expiresAt)}; ${cookieAttributes(SESSION_SECONDS)}`;
}

export function clearSessionCookie(): string {
  return `${COOKIE_NAME}=; ${cookieAttributes(0)}`;
}

function readCookie(request: Request, name: string): string | null {
  const header = request.headers.get('cookie') ?? '';
  for (const part of header.split(';')) {
    const [key, ...rest] = part.trim().split('=');
    if (key === name) return rest.join('=');
  }
  return null;
}

export function isAuthed(request: Request): boolean {
  const token = readCookie(request, COOKIE_NAME);
  if (!token) return false;
  const [expires, signature] = token.split('.');
  const expiresAt = Number(expires);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now() / 1000 || !signature) return false;
  return sameText(signature, sign(expiresAt));
}
