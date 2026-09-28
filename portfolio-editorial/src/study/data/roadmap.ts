// 장기 로드맵과 목표·지원 일정. 로드맵 페이지와 개요 페이지가 함께 쓴다.
import type { RoadmapPhase } from '../types';

export const CAREER_GOAL = {
  target: '넥슨코리아 메이플스토리 PC 게임 기획자',
  graduation: '2028년 2월 졸업 예정',
  applications: [
    { when: '2027 하반기', what: '넥토리얼 (채용형 인턴)' },
    { when: '2028 봄', what: '메이플스토리 집중채용' },
  ],
};

export const ROADMAP: RoadmapPhase[] = [
  {
    id: 'tools',
    start: '2026-09-01',
    end: '2026-11-30',
    label: '2026.09 — 11',
    title: '툴 학습',
    items: ['엑셀, 파워포인트, 워드', '피그마, 포토샵, 일러스트레이터', '툴별 미니 과제와 통합 역기획'],
  },
  {
    id: 'patch',
    start: '2026-12-01',
    end: '2027-02-28',
    label: '2026.12 — 2027 초',
    title: '패치 분석',
    items: ['메이플스토리 PC 최근 1~2년 패치 정리', '업데이트 방향과 의도 분석'],
  },
  {
    id: 'reverse',
    start: '2027-03-01',
    end: '2027-06-30',
    label: '2027 상반기',
    title: '역기획서 2개',
    items: ['시스템 1개, 콘텐츠·이벤트 1개 역기획', '수치 분석과 개선안 포함'],
  },
  {
    id: 'new',
    start: '2027-07-01',
    end: '2027-08-31',
    label: '2027 여름',
    title: '신규 기획서와 구현 방향',
    items: ['신규 기획서 1개', '신규 기획을 직접 작게 구현할 방향 결정'],
  },
  {
    id: 'apply',
    start: '2027-09-01',
    end: '2028-05-31',
    label: '2027 하반기 — 2028 봄',
    title: '포트폴리오 완성과 지원',
    items: ['포트폴리오 완성', '넥토리얼 지원 (2027 하반기)', '메이플 집중채용 지원 (2028 봄)'],
  },
];

export const AI_DISCLOSURE_RULES = [
  '사용한 AI 툴 이름을 적어요',
  '어느 단계에서 썼는지 적어요 (자료 조사, 초안, 이미지 생성 등)',
  '직접 작업한 범위와 AI가 만든 범위를 나눠 적어요',
];
