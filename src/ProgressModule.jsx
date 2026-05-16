import { useState, useEffect } from 'react';
import { storage } from './storage';

function ProgressModule() {
  const [progress, setProgress] = useState({ completed: 0, total: 0 });
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const allProgress = storage.getProgress();
    const today = new Date().toISOString().split('T')[0];
    setProgress(allProgress[today] || { completed: 0, total: 0 });

    const historyData = Object.entries(allProgress)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .slice(0, 7)
      .map(([date, data]) => ({ date, ...data }));
    setHistory(historyData);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const allProgress = storage.getProgress();
      const today = new Date().toISOString().split('T')[0];
      setProgress(allProgress[today] || { completed: 0, total: 0 });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const percentage = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;

  const getProgressColor = (pct) => {
    if (pct >= 80) return 'text-green-600';
    if (pct >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressBarColor = (pct) => {
    if (pct >= 80) return 'bg-green-500';
    if (pct >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span className="text-3xl">📊</span>
        今日学习进度
      </h2>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">完成进度</span>
          <span className={`text-2xl font-bold ${getProgressColor(percentage)}`}>
            {percentage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className={`h-4 rounded-full transition-all duration-500 ${getProgressBarColor(percentage)}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-500">
          <span>已完成: {progress.completed}</span>
          <span>总任务: {progress.total}</span>
        </div>
      </div>

      {history.length > 1 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">最近 7 天记录</h3>
          <div className="space-y-2">
            {history.slice(1).map(item => {
              const pct = item.total > 0 ? Math.round((item.completed / item.total) * 100) : 0;
              return (
                <div key={item.date} className="flex items-center gap-3 text-sm">
                  <span className="text-gray-500 w-24">{item.date.slice(5)}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getProgressBarColor(pct)}`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                  <span className={`font-medium w-12 text-right ${getProgressColor(pct)}`}>
                    {pct}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProgressModule;
