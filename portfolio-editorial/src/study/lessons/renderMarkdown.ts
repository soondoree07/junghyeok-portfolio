// 레슨 마크다운 → HTML.
// - 코드 블록: 복사 버튼을 붙인다 (버튼 동작은 LessonMarkdown 이 이벤트 위임으로 처리)
// - 인용 블록: 첫 줄이 **체크포인트** / **버전 차이 주의** / **팁** 이면 강조 상자로 바꾼다
// - 바깥 링크는 새 탭으로 연다
// 레슨 파일은 사이트 주인이 직접 쓰는 내용이라 HTML 태그(<kbd> 등)를 그대로 허용한다.
import { Marked, type Tokens } from 'marked';

const CALLOUTS: { label: string; className: string }[] = [
  { label: '체크포인트', className: 'checkpoint' },
  { label: '버전 차이 주의', className: 'version' },
  { label: '팁', className: 'tip' },
];

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const lessonMarked = new Marked({
  gfm: true,
  renderer: {
    code({ text, lang }: Tokens.Code) {
      const language = lang && lang !== 'text' ? `<span class="ls-code-lang">${escapeHtml(lang)}</span>` : '';
      return (
        `<div class="ls-code">${language}` +
        `<button type="button" class="ls-copy" data-copy>복사</button>` +
        `<pre><code>${escapeHtml(text)}</code></pre></div>`
      );
    },
    blockquote({ tokens }: Tokens.Blockquote) {
      const body = this.parser.parse(tokens);
      const callout = CALLOUTS.find((item) => body.startsWith(`<p><strong>${item.label}</strong>`));
      return `<blockquote class="ls-callout ${callout?.className ?? ''}">${body}</blockquote>`;
    },
    link({ href, title, tokens }: Tokens.Link) {
      const text = this.parser.parseInline(tokens);
      const external = /^https?:\/\//.test(href);
      const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
      const target = external ? ' target="_blank" rel="noreferrer"' : '';
      return `<a href="${escapeHtml(href)}"${titleAttr}${target}>${text}</a>`;
    },
    table(token: Tokens.Table) {
      const header = token.header.map((cell) => `<th>${this.parser.parseInline(cell.tokens)}</th>`).join('');
      const rows = token.rows
        .map((row) => `<tr>${row.map((cell) => `<td>${this.parser.parseInline(cell.tokens)}</td>`).join('')}</tr>`)
        .join('');
      return `<div class="ls-table"><table><thead><tr>${header}</tr></thead><tbody>${rows}</tbody></table></div>`;
    },
  },
});

export function renderMarkdown(markdown: string): string {
  return lessonMarked.parse(markdown, { async: false });
}
