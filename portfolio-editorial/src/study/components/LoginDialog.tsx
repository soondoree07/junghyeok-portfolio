import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useStudy } from '../StudyContext';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function LoginDialog({ open, onClose }: Props) {
  const { login, notify } = useStudy();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setPending(true);
    const ok = await login(password);
    setPending(false);
    setFailed(!ok);
    if (!ok) return;
    setPassword('');
    notify('로그인했어요. 이제 기록을 고칠 수 있어요.');
    onClose();
  };

  return (
    <dialog ref={dialogRef} className="st-dialog" onClose={onClose}>
      <form onSubmit={submit}>
        <div className="block-label">
          <span>기록 편집 로그인</span>
        </div>
        <label className="st-field">
          <span>비밀번호</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoFocus
            required
          />
        </label>
        {failed && (
          <p className="st-error" role="alert">
            비밀번호가 맞지 않아요. 다시 입력해 주세요. 여러 번 틀리면 15분 뒤에 다시 시도할 수 있어요.
          </p>
        )}
        <div className="st-dialog-actions">
          <button type="button" className="st-btn ghost" onClick={onClose}>
            닫기
          </button>
          <button type="submit" className="st-btn" disabled={pending || password === ''}>
            {pending ? '확인하는 중..' : '로그인하기'}
          </button>
        </div>
      </form>
    </dialog>
  );
}
