interface Props {
  toast: string;
}

export function Toast({ toast }: Props) {
  return (
    <div className={`toast ${toast ? 'on' : ''}`} role="status" aria-live="polite">
      <span className="t-dot" />
      <span>{toast || ''}</span>
    </div>
  );
}
