import { formatPercent, type Progress } from '../lib/progress';

interface Props {
  progress: Progress;
  label?: string;
  color?: string;
  size?: 'sm' | 'lg';
}

export function ProgressBar({ progress, label, color, size = 'sm' }: Props) {
  const percent = formatPercent(progress.ratio);
  return (
    <div className={`st-progress ${size}`}>
      {label && (
        <div className="st-progress-head">
          <span>{label}</span>
          <span className="st-progress-num">
            {progress.done} / {progress.total}일 · {percent}
          </span>
        </div>
      )}
      <div
        className="st-progress-track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={progress.total}
        aria-valuenow={progress.done}
        aria-label={label}
      >
        <div className="st-progress-fill" style={{ width: percent, background: color }} />
      </div>
    </div>
  );
}
