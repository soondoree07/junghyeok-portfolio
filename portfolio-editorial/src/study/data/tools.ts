// 학습 툴 목록. 순서가 곧 학습 순서다.
import type { ToolId, ToolInfo } from '../types';

export const TOOLS: ToolInfo[] = [
  { id: 'excel', name: '엑셀', short: 'XLS', color: '#2E5D3A', summary: '수식·확률·보상 테이블을 숫자로 설계해요' },
  { id: 'ppt', name: '파워포인트', short: 'PPT', color: '#C4572A', summary: '순서도와 UI 설계로 기획서 템플릿을 만들어요' },
  { id: 'word', name: '워드', short: 'DOC', color: '#2B4C7E', summary: '스타일과 목차로 시스템 명세서를 써요' },
  { id: 'figma', name: '피그마', short: 'FIG', color: '#6B4E9B', summary: '컴포넌트와 프로토타입으로 이벤트 UI를 그려요' },
  { id: 'photoshop', name: '포토샵', short: 'PSD', color: '#1F5F7A', summary: '상태별 버튼, 9-슬라이스 창, 배너를 만들어요' },
  { id: 'illustrator', name: '일러스트레이터', short: 'AI', color: '#B7791F', summary: '패스와 그리드로 아이콘 세트와 로고를 만들어요' },
  { id: 'integration', name: '통합', short: 'ALL', color: '#15171A', summary: '툴을 모두 써서 이벤트 1개를 역기획해요' },
];

export const TOOL_IDS = TOOLS.map((tool) => tool.id);

export function getTool(id: ToolId): ToolInfo {
  const tool = TOOLS.find((item) => item.id === id);
  if (!tool) throw new Error(`알 수 없는 툴: ${id}`);
  return tool;
}

export function isToolId(value: string): value is ToolId {
  return (TOOL_IDS as string[]).includes(value);
}
