import TaskModule from './TaskModule';
import ProgressModule from './ProgressModule';

function App() {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">📖 学习计划追踪器</h1>
          <p className="text-white/80">记录你的学习之旅</p>
        </header>

        <div className="space-y-6">
          <TaskModule />
          <ProgressModule />
        </div>
      </div>
    </div>
  );
}

export default App;
