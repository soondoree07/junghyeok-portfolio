// 서울 기준 오늘 날짜. 자정을 넘기거나 탭으로 돌아오면 다시 계산한다.
import { useEffect, useState } from 'react';
import { todayInSeoul } from '../lib/seoulDate';

const CHECK_INTERVAL_MS = 60 * 1000;

export function useToday(): string {
  const [today, setToday] = useState(todayInSeoul);

  useEffect(() => {
    const refresh = () => setToday(todayInSeoul());
    const timer = window.setInterval(refresh, CHECK_INTERVAL_MS);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, []);

  return today;
}
