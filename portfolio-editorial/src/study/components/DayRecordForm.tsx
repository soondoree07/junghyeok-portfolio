// 공부 시간·메모·산출물 링크 입력과 완료 처리.
import { useState, type FormEvent } from 'react';
import { LIMITS } from '../lib/validateRecords';
import { emptyDayRecord, formatMinutes } from '../lib/progress';
import { useStudy } from '../StudyContext';
import type { DayRecord } from '../types';

const QUICK_MINUTES = [-30, 30, 60];

function clampMinutes(minutes: number): number {
  return Math.min(LIMITS.minutes, Math.max(0, Math.round(minutes)));
}

function normalizeLink(value: string): string {
  const trimmed = value.trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export function DayRecordForm({ date }: { date: string }) {
  const { records, canEdit, updateDay, notify } = useStudy();
  const record = records.days[date] ?? emptyDayRecord();
  const [linkDraft, setLinkDraft] = useState('');

  const change = (patch: Partial<DayRecord>) => updateDay(date, (current) => ({ ...current, ...patch }));

  const addLink = (event: FormEvent) => {
    event.preventDefault();
    if (!linkDraft.trim()) return;
    if (record.links.length >= LIMITS.links) {
      notify(`링크는 ${LIMITS.links}개까지 넣을 수 있어요. 안 쓰는 링크를 지우고 다시 넣어 주세요.`);
      return;
    }
    change({ links: [...record.links, normalizeLink(linkDraft).slice(0, LIMITS.linkLength)] });
    setLinkDraft('');
  };

  const toggleComplete = () => {
    const completed = !record.completed;
    change({ completed, completedAt: completed ? new Date().toISOString() : undefined });
    notify(completed ? '공부를 완료했어요. 수고했어요.' : '완료를 취소했어요.');
  };

  if (!canEdit) {
    return (
      <div className="block st-record readonly">
        <div className="block-label">
          <span>기록</span>
        </div>
        <p className="st-record-summary">
          공부 시간 {formatMinutes(record.minutes)} · {record.completed ? '완료' : '진행 전이거나 진행 중'}
        </p>
      </div>
    );
  }

  return (
    <div className="block st-record">
      <div className="block-label">
        <span>기록</span>
        <span className="st-muted-label">입력하면 바로 저장돼요</span>
      </div>

      <div className="st-field">
        <span>실제 공부 시간 · {formatMinutes(record.minutes)}</span>
        <div className="st-minutes">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            max={LIMITS.minutes}
            step={10}
            value={record.minutes}
            onChange={(event) => change({ minutes: clampMinutes(Number(event.target.value)) })}
            aria-label="공부 시간(분)"
          />
          <span className="st-unit">분</span>
          {QUICK_MINUTES.map((delta) => (
            <button
              key={delta}
              type="button"
              className="st-chip"
              onClick={() => change({ minutes: clampMinutes(record.minutes + delta) })}
            >
              {delta > 0 ? '+' : '−'}
              {formatMinutes(Math.abs(delta))}
            </button>
          ))}
        </div>
      </div>

      <label className="st-field">
        <span>메모</span>
        <textarea
          rows={5}
          maxLength={LIMITS.memo}
          value={record.memo}
          placeholder="막힌 부분, 새로 안 것, 내일 이어서 할 것"
          onChange={(event) => change({ memo: event.target.value })}
        />
      </label>

      <form className="st-field" onSubmit={addLink}>
        <span>산출물 링크</span>
        {record.links.length > 0 && (
          <ul className="st-links">
            {record.links.map((link, index) => (
              <li key={`${index}-${link}`}>
                <a href={link} target="_blank" rel="noreferrer">
                  {link}
                </a>
                <button
                  type="button"
                  className="st-link"
                  onClick={() => change({ links: record.links.filter((_, i) => i !== index) })}
                >
                  지우기
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="st-link-input">
          <input
            type="text"
            inputMode="url"
            value={linkDraft}
            placeholder="드라이브, 피그마 링크"
            onChange={(event) => setLinkDraft(event.target.value)}
          />
          <button type="submit" className="st-btn ghost" disabled={!linkDraft.trim()}>
            추가하기
          </button>
        </div>
      </form>

      <button type="button" className={`st-btn wide ${record.completed ? 'done' : ''}`} onClick={toggleComplete}>
        {record.completed ? '완료했어요 · 완료 취소하기' : '공부 완료하기'}
      </button>
    </div>
  );
}
