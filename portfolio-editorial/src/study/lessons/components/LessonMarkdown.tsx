// 레슨 본문 표시. 코드 블록의 복사 버튼과 함수 뜻 말풍선은 여기서 한 번에 처리한다 (이벤트 위임).
import { useMemo, type MouseEvent } from 'react';
import { useStudy } from '../../StudyContext';
import type { ToolId } from '../../types';
import { getFunctionGlossary } from '../functionGlossary';
import { renderMarkdown } from '../renderMarkdown';
import { FunctionTip, useFunctionTip } from './FunctionTip';

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function LessonMarkdown({ markdown, tool }: { markdown: string; tool: ToolId }) {
  const { notify } = useStudy();
  const glossary = getFunctionGlossary(tool);
  const html = useMemo(() => renderMarkdown(markdown, glossary), [markdown, glossary]);
  const { tip, handlers } = useFunctionTip(glossary);

  const copyCode = async (event: MouseEvent<HTMLDivElement>) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-copy]');
    const code = button?.parentElement?.querySelector('code');
    if (!button || !code) return;
    const ok = await copyText(code.textContent ?? '');
    notify(ok ? '복사했어요. 엑셀 셀에 붙여 넣으세요.' : '복사하지 못했어요. 코드를 길게 눌러 직접 복사해 주세요.');
    if (!ok) return;
    button.textContent = '복사됨';
    window.setTimeout(() => (button.textContent = '복사'), 1500);
  };

  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    handlers.onClick(event);
    void copyCode(event);
  };

  return (
    <>
      <div
        className="ls-md"
        onClick={onClick}
        onMouseOver={handlers.onMouseOver}
        onMouseOut={handlers.onMouseOut}
        onKeyDown={handlers.onKeyDown}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {tip && <FunctionTip tip={tip} />}
    </>
  );
}
