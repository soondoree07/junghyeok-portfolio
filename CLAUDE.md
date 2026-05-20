# CLAUDE.md — junghyeok-portfolio 작업 가이드

배정혁(soondoree07) 개인 포트폴리오 사이트. Vite + TypeScript + Tailwind 스택.

## Devlog
이 프로젝트의 `project` 필드명: **`junghyeok-portfolio`** (변종 `portfolio` 금지)
자동 devlog 업데이트는 `~/.claude/commands/devlog업데이트.md` 절차를 따른다.

---

## 사용 가능한 서브에이전트

| 에이전트 | 용도 |
|---|---|
| `engineering-frontend-developer` | 페이지·컴포넌트·인터랙션 구현 |
| `design-ui-designer` | 비주얼 시스템·컴포넌트 디자인 |
| `design-visual-storyteller` | 프로젝트 소개·랜딩 내러티브 |
| `design-image-prompt-engineer` | 이미지/아트워크 생성 프롬프트 |
| `marketing-seo-specialist` | 검색 노출·OG·메타 |
| `marketing-content-creator` | 카피·블로그 톤 |
| `engineering-code-reviewer` (공용) | PR 리뷰 |
| `testing-reality-checker` (공용) | 배포 전 실동작 검증 |

병렬 가능한 작업은 한 메시지 안에서 여러 에이전트 동시 호출.
