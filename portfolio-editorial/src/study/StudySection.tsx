// 학습 섹션 진입점. 라우트에 맞는 페이지를 고르고 공통 탭·접근 막대를 붙인다.
// 공부 화면에 있는 동안만 <html data-study-theme="glass"> 를 붙여 글래스 테마를 켠다 (홈은 옛 디자인 유지).
import { useEffect } from 'react';
import type { Route } from './routes';
import { AccessBar } from './components/AccessBar';
import { StudyNav } from './components/StudyNav';
import { DayPage } from './pages/DayPage';
import { LogPage } from './pages/LogPage';
import { OverviewPage } from './pages/OverviewPage';
import { ReviewPage } from './pages/ReviewPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { ToolPage } from './pages/ToolPage';
import { LessonPage } from './lessons/LessonPage';
import './study.css';
import './study-widgets.css';
import './theme/glass-base.css';
import './theme/glass-controls.css';
import './theme/glass-pages.css';
import './theme/glass-lesson.css';
import './theme/glass-responsive.css';

const THEME = 'glass';

function useStudyTheme() {
  useEffect(() => {
    document.documentElement.dataset.studyTheme = THEME;
    return () => {
      delete document.documentElement.dataset.studyTheme;
    };
  }, []);
}

function StudyPage({ route }: { route: Route }) {
  switch (route.name) {
    case 'roadmap':
      return <RoadmapPage />;
    case 'today':
      return <DayPage />;
    case 'day':
      return <DayPage date={route.date} />;
    case 'tool':
      return <ToolPage toolId={route.tool} />;
    case 'lesson':
      return <LessonPage key={`${route.tool}-${route.day}`} tool={route.tool} dayIndex={route.day} />;
    case 'review':
      return <ReviewPage />;
    case 'log':
      return <LogPage />;
    default:
      return <OverviewPage />;
  }
}

export function StudySection({ route }: { route: Route }) {
  useStudyTheme();
  return (
    <div className="st">
      <StudyNav route={route} />
      <div className="st-page">
        <StudyPage route={route} />
      </div>
      <AccessBar />
    </div>
  );
}
