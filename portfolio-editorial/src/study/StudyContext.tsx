// 학습 기록 상태와 저장·인증 동작을 한곳에 모은다. 페이지는 useStudy() 로만 접근한다.
//
// 저장 모드
// - server : api/ 가 응답한다. 읽기는 누구나, 쓰기는 로그인한 뒤에만
// - local  : 로컬 개발(vite dev)에서 api/ 가 없을 때. 브라우저 저장소에 바로 쓴다
// - offline: 배포 환경인데 서버에 닿지 못했을 때. 마지막 사본을 읽기 전용으로 보여준다
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { DayRecord, ReviewResult, StudyRecords } from './types';
import * as api from './lib/recordsApi';
import { emptyRecords, readCache, writeCache } from './lib/localCache';
import { emptyDayRecord } from './lib/progress';
import { useSaveQueue } from './hooks/useSaveQueue';
import { useToday } from './hooks/useToday';

type Mode = 'loading' | 'server' | 'local' | 'offline';

interface StudyStore {
  records: StudyRecords;
  mode: Mode;
  authed: boolean;
  canEdit: boolean;
  today: string;
  updateDay: (date: string, change: (record: DayRecord) => DayRecord) => void;
  answerReview: (keys: string[], result: ReviewResult) => void;
  importRecords: (records: StudyRecords) => Promise<boolean>;
  login: (password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  notify: (message: string) => void;
}

const StudyContext = createContext<StudyStore | null>(null);

const SAVE_FAILED = '저장하지 못했어요. 인터넷 연결을 확인하면 다음 입력 때 다시 저장할게요.';

export function StudyProvider({ notify, children }: { notify: (message: string) => void; children: ReactNode }) {
  const today = useToday();
  const [records, setRecords] = useState<StudyRecords>(() => readCache() ?? emptyRecords());
  const [mode, setMode] = useState<Mode>('loading');
  const [authed, setAuthed] = useState(false);
  const recordsRef = useRef(records);
  const enqueue = useSaveQueue(() => notify(SAVE_FAILED));

  const applyRecords = useCallback((next: StudyRecords) => {
    recordsRef.current = next;
    setRecords(next);
    writeCache(next);
  }, []);

  const load = useCallback(async () => {
    try {
      const result = await api.fetchRecords();
      setAuthed(result.authed);
      setMode('server');
      applyRecords(result.records);
    } catch (error) {
      const noServer = error instanceof api.ServerUnavailableError;
      setMode(noServer && import.meta.env.DEV ? 'local' : 'offline');
    }
  }, [applyRecords]);

  useEffect(() => {
    void load();
  }, [load]);

  const canEdit = mode === 'local' || (mode === 'server' && authed);

  const updateDay = useCallback(
    (date: string, change: (record: DayRecord) => DayRecord) => {
      if (!canEdit) return;
      const current = recordsRef.current;
      const nextDay = change(current.days[date] ?? emptyDayRecord());
      applyRecords({ ...current, days: { ...current.days, [date]: nextDay } });
      if (mode === 'server') enqueue({ days: { [date]: nextDay } });
    },
    [applyRecords, canEdit, enqueue, mode],
  );

  const answerReview = useCallback(
    (keys: string[], result: ReviewResult) => {
      if (!canEdit || keys.length === 0) return;
      const answers = Object.fromEntries(keys.map((key) => [key, { result, answeredOn: today }]));
      const current = recordsRef.current;
      applyRecords({ ...current, reviews: { ...current.reviews, ...answers } });
      if (mode === 'server') enqueue({ reviews: answers });
    },
    [applyRecords, canEdit, enqueue, mode, today],
  );

  const importRecords = useCallback(
    async (next: StudyRecords) => {
      if (!canEdit) return false;
      try {
        if (mode === 'server') await api.replaceRecords(next);
        applyRecords(next);
        return true;
      } catch {
        return false;
      }
    },
    [applyRecords, canEdit, mode],
  );

  const login = useCallback(
    async (password: string) => {
      try {
        await api.login(password);
        await load();
        return true;
      } catch {
        return false;
      }
    },
    [load],
  );

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } finally {
      await load();
    }
  }, [load]);

  const store = useMemo<StudyStore>(
    () => ({ records, mode, authed, canEdit, today, updateDay, answerReview, importRecords, login, logout, notify }),
    [records, mode, authed, canEdit, today, updateDay, answerReview, importRecords, login, logout, notify],
  );

  return <StudyContext.Provider value={store}>{children}</StudyContext.Provider>;
}

export function useStudy(): StudyStore {
  const store = useContext(StudyContext);
  if (!store) throw new Error('useStudy 는 StudyProvider 안에서만 쓸 수 있어요');
  return store;
}
