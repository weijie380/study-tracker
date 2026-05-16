import { useState, useCallback } from 'react';
import TaskModule from './TaskModule';
import ProgressModule from './ProgressModule';
import QuoteModule from './QuoteModule';

function App() {
  const [todayProgress, setTodayProgress] = useState(null);

  const handleProgressUpdate = useCallback((progress) => {
    setTodayProgress(progress);
  }, []);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">📖 学习计划追踪器</h1>
          <p className="text-white/80">记录你的学习之旅</p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <TaskModule onProgressUpdate={handleProgressUpdate} />
          <ProgressModule />
        </div>

        <div className="mt-6">
          <QuoteModule />
        </div>
      </div>
    </div>
  );
}

export default App;
