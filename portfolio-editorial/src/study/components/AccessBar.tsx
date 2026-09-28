// 저장 상태·로그인·JSON 내보내기/가져오기. 학습 섹션 모든 페이지 아래에 붙는다.
import { useRef, useState, type ChangeEvent } from 'react';
import { useStudy } from '../StudyContext';
import { downloadRecords, readRecordsFile } from '../lib/exportImport';
import { LoginDialog } from './LoginDialog';

const MODE_TEXT = {
  loading: '기록을 불러오는 중..',
  server: '',
  local: '로컬 개발 모드예요. 기록은 이 브라우저에만 저장돼요.',
  offline: '서버에 연결하지 못했어요. 마지막으로 불러온 기록을 보여드려요.',
} as const;

export function AccessBar() {
  const { mode, authed, canEdit, records, importRecords, logout, notify } = useStudy();
  const [loginOpen, setLoginOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const onImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const next = await readRecordsFile(file);
    if (!next) {
      notify('파일 형식이 맞지 않아요. 이 사이트에서 내보낸 JSON 파일을 골라 주세요.');
      return;
    }
    const days = Object.keys(next.days).length;
    if (!window.confirm(`지금 기록을 파일 내용(${days}일치)으로 바꿀까요? 바꾸면 되돌릴 수 없어요.`)) return;
    const ok = await importRecords(next);
    notify(ok ? '기록을 가져왔어요.' : '가져오지 못했어요. 잠시 후 다시 시도해 주세요.');
  };

  const statusText =
    mode === 'server' ? (authed ? '로그인했어요. 기록을 고칠 수 있어요.' : '보기 전용이에요. 기록은 주인만 고칠 수 있어요.') : MODE_TEXT[mode];

  return (
    <div className="st-access">
      <span className="st-access-status">
        <span className={`st-access-dot ${canEdit ? 'on' : ''}`} />
        {statusText}
      </span>
      <div className="st-access-actions">
        <button type="button" className="st-link" onClick={() => downloadRecords(records)}>
          JSON 내보내기
        </button>
        {canEdit && (
          <>
            <button type="button" className="st-link" onClick={() => fileRef.current?.click()}>
              JSON 가져오기
            </button>
            <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={onImport} />
          </>
        )}
        {mode === 'server' &&
          (authed ? (
            <button type="button" className="st-link" onClick={() => void logout()}>
              로그아웃
            </button>
          ) : (
            <button type="button" className="st-link" onClick={() => setLoginOpen(true)}>
              로그인
            </button>
          ))}
      </div>
      <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}
