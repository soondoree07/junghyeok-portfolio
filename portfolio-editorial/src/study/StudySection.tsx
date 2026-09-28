// 학습 섹션 진입점. 라우트에 맞는 페이지를 고르고 공통 탭·접근 막대를 붙인다.
import type { Route } from './routes';
import { AccessBar } from './components/AccessBar';
import { StudyNav } from './components/StudyNav';
import { DayPage } from './pages/DayPage';
import { LogPage } from './pages/LogPage';
import { OverviewPage } from './pages/OverviewPage';
import { ReviewPage } from './pages/ReviewPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { ToolPage } from './pages/ToolPage';
import './study.css';
import './study-widgets.css';

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
    case 'review':
      return <ReviewPage />;
    case 'log':
      return <LogPage />;
    default:
      return <OverviewPage />;
  }
}

export function StudySection({ route }: { route: Route }) {
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
