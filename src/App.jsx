import { useRef } from 'react';
import TaskModule from './TaskModule';
import ProgressModule from './ProgressModule';
import { storage } from './storage';

function App() {
  const fileInputRef = useRef(null);

  const handleExport = () => {
    const data = {
      tasks: storage.getTasks(),
      dailyEpisodes: storage.getDailyEpisodes(),
      progress: storage.getProgress(),
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `study-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.tasks) storage.saveTasks(data.tasks);
        if (data.dailyEpisodes) storage.saveDailyEpisodes(data.dailyEpisodes);
        if (data.progress) storage.saveProgress(data.progress);
        alert('导入成功！页面将刷新以显示导入的数据。');
        window.location.reload();
      } catch {
        alert('文件格式错误，请选择有效的备份文件。');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2"> 学习计划追踪器</h1>
          <div className="flex justify-center gap-3 mt-4">
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors text-sm font-medium backdrop-blur"
            >
              导出数据
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors text-sm font-medium backdrop-blur"
            >
              导入数据
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </div>
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
