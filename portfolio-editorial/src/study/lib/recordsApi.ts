// 서버(api/) 호출 모음. 서버가 없으면(vite dev 등) ServerUnavailableError 를 던진다.
import type { StudyRecords } from '../types';
import { parseRecords } from './validateRecords';

export class ServerUnavailableError extends Error {}
export class UnauthorizedError extends Error {}

export interface RecordsPatch {
  days?: StudyRecords['days'];
  reviews?: StudyRecords['reviews'];
}

async function request(path: string, init?: RequestInit): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(path, {
      ...init,
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });
  } catch {
    throw new ServerUnavailableError('network');
  }
  const isJson = response.headers.get('content-type')?.includes('application/json');
  if (!isJson) throw new ServerUnavailableError(`no api (${response.status})`);
  if (response.status === 401) throw new UnauthorizedError('unauthorized');
  const body = await response.json();
  if (!response.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'request failed');
  return body;
}

export async function fetchRecords(): Promise<{ authed: boolean; records: StudyRecords }> {
  const body = (await request('/api/records')) as { authed?: unknown; records?: unknown };
  const records = parseRecords(body.records);
  if (!records) throw new Error('invalid records');
  return { authed: body.authed === true, records };
}

export async function saveRecordsPatch(patch: RecordsPatch, keepalive = false): Promise<void> {
  await request('/api/records', { method: 'PUT', body: JSON.stringify(patch), keepalive });
}

export async function replaceRecords(records: StudyRecords): Promise<void> {
  await request('/api/import', { method: 'POST', body: JSON.stringify(records) });
}

export async function login(password: string): Promise<void> {
  await request('/api/login', { method: 'POST', body: JSON.stringify({ password }) });
}

export async function logout(): Promise<void> {
  await request('/api/logout', { method: 'POST' });
}
