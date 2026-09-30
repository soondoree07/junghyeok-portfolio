// 학습 기록 상태와 저장·인증 동작을 한곳에 모은다. 페이지는 useStudy() 로만 접근한다.
//
// 저장 모드
// - server : api/ 가 응답한다. 읽기는 누구나, 쓰기는 로그인한 뒤에만
// - local  : 로컬 개발(vite dev)에서 api/ 가 없을 때. 브라우저 저장소에 바로 쓴다
// - offline: 배포 환경인데 서버에 닿지 못했을 때. 마지막 사본을 읽기 전용으로 보여준다
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { DayRecord, QuizAnswer, ReviewResult, StudyRecords } from './types';
import * as api from './lib/recordsApi';
import { emptyRecords, readCache, writeCache } from './lib/localCache';
import { emptyDayRecord } from './lib/progress';
import { getPostponedDates } from './lib/postpone';
import { pullForward } from './lib/pullForward';
import { applyPostponedDates } from './data';
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
  /** 레슨 문제 답 저장. key 는 `${date}|${questionId}` */
  answerQuiz: (key: string, answer: Omit<QuizAnswer, 'answeredOn'>) => void;
  /** 오늘을 미루거나(true) 미룬 것을 되돌린다(false) */
  setTodayPostponed: (postponed: boolean) => void;
  /** 가장 최근 미룬 날을 채워 다음 공부를 오늘로 당겨온다. 성공하면 true */
  pullNextDay: () => Promise<boolean>;
  importRecords: (records: StudyRecords) => Promise<boolean>;
  logout: () => Promise<void>;
  notify: (message: string) => void;
}

const StudyContext = createContext<StudyStore | null>(null);

const SAVE_FAILED = '저장하지 못했어요. 인터넷 연결을 확인하면 다음 입력 때 다시 저장할게요.';

/** 구글 로그인에서 돌아왔을 때 주소의 ?login= 결과를 안내 문구로 바꾼다 */
const LOGIN_RESULT: Record<string, string> = {
  editor: '로그인했어요. 이제 기록을 고칠 수 있어요.',
  viewer: '보기 전용 계정이에요. 기록은 주인 계정만 고칠 수 있어요.',
  error: '로그인하지 못했어요. 잠시 후 다시 시도해 주세요.',
};

function takeLoginResult(): string | undefined {
  const params = new URLSearchParams(window.location.search);
  const result = params.get('login');
  if (!result) return undefined;
  params.delete('login');
  const search = params.toString();
  window.history.replaceState(null, '', `${window.location.pathname}${search ? `?${search}` : ''}${window.location.hash}`);
  return LOGIN_RESULT[result];
}

export function StudyProvider({ notify, children }: { notify: (message: string) => void; children: ReactNode }) {
  const today = useToday();
  const [records, setRecords] = useState<StudyRecords>(() => readCache() ?? emptyRecords());
  const [mode, setMode] = useState<Mode>('loading');
  const [authed, setAuthed] = useState(false);
  const recordsRef = useRef(records);
  const { enqueue, discardPending } = useSaveQueue(() => notify(SAVE_FAILED));

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
    const loginMessage = takeLoginResult();
    if (loginMessage) notify(loginMessage);
  }, [load, notify]);

  // 화면이 일정을 읽기 전에 미룬 날을 반영한다 (같은 목록이면 다시 계산하지 않는다)
  applyPostponedDates(getPostponedDates(records));

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

  const answerQuiz = useCallback(
    (key: string, answer: Omit<QuizAnswer, 'answeredOn'>) => {
      if (!canEdit) return;
      const entry: QuizAnswer = { ...answer, answeredOn: today };
      const current = recordsRef.current;
      applyRecords({ ...current, quiz: { ...current.quiz, [key]: entry } });
      if (mode === 'server') enqueue({ quiz: { [key]: entry } });
    },
    [applyRecords, canEdit, enqueue, mode, today],
  );

  const setTodayPostponed = useCallback(
    (postponed: boolean) => {
      if (!canEdit) return;
      const current = recordsRef.current;
      const change = { [today]: postponed };
      applyRecords({ ...current, postponed: { ...current.postponed, ...change } });
      if (mode === 'server') enqueue({ postponed: change });
    },
    [applyRecords, canEdit, enqueue, mode, today],
  );

  const importRecords = useCallback(
    async (next: StudyRecords) => {
      if (!canEdit) return false;
      try {
        if (mode === 'server') {
          discardPending();
          await api.replaceRecords(next);
        }
        applyRecords(next);
        return true;
      } catch {
        return false;
      }
    },
    [applyRecords, canEdit, discardPending, mode],
  );

  const pullNextDay = useCallback(async () => {
    const next = pullForward(recordsRef.current, today);
    return next ? importRecords(next) : false;
  }, [importRecords, today]);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } finally {
      await load();
    }
  }, [load]);

  const store = useMemo<StudyStore>(
    () => ({
      records, mode, authed, canEdit, today, updateDay, answerReview, answerQuiz, setTodayPostponed, pullNextDay, importRecords,
      logout, notify,
    }),
    [
      records, mode, authed, canEdit, today, updateDay, answerReview, answerQuiz, setTodayPostponed, pullNextDay, importRecords,
      logout, notify,
    ],
  );

  return <StudyContext.Provider value={store}>{children}</StudyContext.Provider>;
}

export function useStudy(): StudyStore {
  const store = useContext(StudyContext);
  if (!store) throw new Error('useStudy 는 StudyProvider 안에서만 쓸 수 있어요');
  return store;
}
