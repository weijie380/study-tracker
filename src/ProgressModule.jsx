import { useState, useEffect } from 'react';
import { storage } from './storage';

function ProgressModule() {
  const [tasks, setTasks] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedTasks = storage.getTasks();
    setTasks(savedTasks);

    const dailyEpisodes = storage.getDailyEpisodes();
    const historyData = Object.entries(dailyEpisodes)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .slice(0, 7)
      .map(([date, taskEpisodes]) => {
        const total = Object.values(taskEpisodes).reduce((sum, count) => sum + count, 0);
        return { date, taskEpisodes, total };
      });
    setHistory(historyData);
  }, []);

  const getOverallProgress = () => {
    if (tasks.length === 0) return '0.0';
    const totalProgress = tasks.reduce((sum, task) => {
      if (task.totalEpisodes === 0) return sum;
      return sum + (task.currentEpisode / task.totalEpisodes) * 100;
    }, 0);
    return (totalProgress / tasks.length).toFixed(1);
  };

  const overallProgress = getOverallProgress();

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

  const getTaskName = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    return task ? task.name : '未知任务';
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span className="text-3xl">📊</span>
        今日学习进度
        <span className="text-sm font-normal text-gray-500 ml-2">
          {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })}
        </span>
      </h2>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">总体完成进度</span>
          <span className={`text-2xl font-bold ${getProgressColor(overallProgress)}`}>
            {overallProgress}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className={`h-4 rounded-full transition-all duration-500 ${getProgressBarColor(overallProgress)}`}
            style={{ width: `${overallProgress}%` }}
          ></div>
        </div>
        <div className="flex justify-end mt-2 text-sm text-gray-500">
          <span>总任务数: {tasks.length}</span>
        </div>
      </div>

      {tasks.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">各任务进度</h3>
          <div className="space-y-3">
            {tasks.map(task => {
              const taskProgress = task.totalEpisodes > 0 
                ? ((task.currentEpisode / task.totalEpisodes) * 100).toFixed(1)
                : '0.0';
              return (
                <div key={task.id} className="flex items-center gap-3">
                  <span className="text-gray-700 font-medium w-32 truncate">{task.name}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${getProgressBarColor(taskProgress)}`}
                      style={{ width: `${taskProgress}%` }}
                    ></div>
                  </div>
                  <span className={`font-medium w-12 text-right text-sm ${getProgressColor(taskProgress)}`}>
                    {taskProgress}%
                  </span>
                  <span className="text-gray-500 text-sm w-16 text-right">
                    {task.currentEpisode}/{task.totalEpisodes}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {history.length > 1 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">最近 7 天记录</h3>
          <div className="space-y-3">
            {history.slice(1).map(item => {
              const maxEpisodes = Math.max(...history.map(h => h.total), 1);
              const pct = (item.total / maxEpisodes) * 100;
              return (
                <div key={item.date} className="text-sm">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-gray-500 w-24">{item.date.slice(5)}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-amber-500"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                    <span className="font-medium w-12 text-right text-amber-600">
                      {item.total} 集
                    </span>
                  </div>
                  {Object.keys(item.taskEpisodes).length > 0 && (
                    <div className="ml-28 space-y-1">
                      {Object.entries(item.taskEpisodes).map(([taskId, episodes]) => (
                        <div key={taskId} className="flex justify-between text-xs text-gray-500">
                          <span className="truncate flex-1">{getTaskName(taskId)}</span>
                          <span className="ml-2">{episodes} 集</span>
                        </div>
                      ))}
                    </div>
                  )}
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
