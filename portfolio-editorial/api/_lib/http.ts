// 응답·요청 본문 도우미. 폴더 이름이 _ 로 시작해 Vercel 라우트로 노출되지 않는다.

const MAX_BODY_BYTES = 1024 * 1024;

export function json(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers },
  });
}

export function error(message: string, status: number): Response {
  return json({ error: message }, status);
}

/** 본문을 JSON 으로 읽는다. 너무 크거나 JSON 이 아니면 null */
export async function readJson(request: Request): Promise<unknown | null> {
  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
