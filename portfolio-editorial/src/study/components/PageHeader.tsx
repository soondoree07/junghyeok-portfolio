import type { ReactNode } from 'react';

interface Props {
  kicker: string;
  meta?: string;
  title: string;
  lead?: ReactNode;
}

export function PageHeader({ kicker, meta, title, lead }: Props) {
  return (
    <header className="st-head">
      <div className="detail-kicker">
        <span className="accent">{kicker}</span>
        {meta && <span className="detail-kicker-r">{meta}</span>}
      </div>
      <h1 className="st-title">{title}</h1>
      {lead && <p className="st-lead">{lead}</p>}
    </header>
  );
}
