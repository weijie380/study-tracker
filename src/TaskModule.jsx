import { useState, useEffect } from 'react';
import { storage, generateId } from './storage';

function TaskModule({ onProgressUpdate }) {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    link: '',
    totalEpisodes: '',
    currentEpisode: '',
    notes: '',
    startDate: ''
  });

  useEffect(() => {
    setTasks(storage.getTasks());
  }, []);

  const updateProgress = (updatedTasks) => {
    const today = new Date().toISOString().split('T')[0];
    const progress = storage.getProgress();
    const totalTasks = updatedTasks.length;
    const completedTasks = updatedTasks.filter(t => {
      const pct = t.totalEpisodes > 0 ? (t.currentEpisode / t.totalEpisodes) * 100 : 0;
      return pct >= 100;
    }).length;
    progress[today] = { completed: completedTasks, total: totalTasks, timestamp: Date.now() };
    storage.saveProgress(progress);
    onProgressUpdate?.(progress[today]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addTask = () => {
    if (!formData.name.trim()) return;
    const task = {
      id: generateId(),
      name: formData.name.trim(),
      link: formData.link.trim(),
      totalEpisodes: parseInt(formData.totalEpisodes) || 0,
      currentEpisode: parseInt(formData.currentEpisode) || 0,
      notes: formData.notes.trim(),
      startDate: formData.startDate || new Date().toISOString().split('T')[0],
      createdAt: Date.now()
    };
    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    storage.saveTasks(updatedTasks);
    setFormData({ name: '', link: '', totalEpisodes: '', currentEpisode: '', notes: '', startDate: '' });
    setShowForm(false);
    updateProgress(updatedTasks);
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter(t => t.id !== id);
    setTasks(updatedTasks);
    storage.saveTasks(updatedTasks);
    updateProgress(updatedTasks);
  };

  const updateEpisode = (id, field, value) => {
    const numValue = parseInt(value) || 0;
    const updatedTasks = tasks.map(t => {
      if (t.id === id) {
        const updated = { ...t, [field]: numValue };
        if (field === 'currentEpisode' && numValue > updated.totalEpisodes) {
          updated.currentEpisode = updated.totalEpisodes;
        }
        return updated;
      }
      return t;
    });
    setTasks(updatedTasks);
    storage.saveTasks(updatedTasks);
    updateProgress(updatedTasks);
  };

  const getProgress = (task) => {
    if (task.totalEpisodes === 0) return 0;
    return Math.round((task.currentEpisode / task.totalEpisodes) * 100);
  };

  const getProgressColor = (pct) => {
    if (pct >= 100) return 'bg-green-500';
    if (pct >= 50) return 'bg-blue-500';
    if (pct > 0) return 'bg-yellow-500';
    return 'bg-gray-300';
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="text-3xl">📚</span>
            学习任务
          </h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            {showForm ? '取消' : '+ 添加任务'}
          </button>
        </div>

        {showForm && (
          <div className="mb-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="任务名称 *"
                className="px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleInputChange}
                placeholder="链接地址"
                className="px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="number"
                name="totalEpisodes"
                value={formData.totalEpisodes}
                onChange={handleInputChange}
                placeholder="总集数"
                min="0"
                className="px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="number"
                name="currentEpisode"
                value={formData.currentEpisode}
                onChange={handleInputChange}
                placeholder="当前集数"
                min="0"
                className="px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="text"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="备注"
                className="px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              onClick={addTask}
              className="mt-3 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              确认添加
            </button>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">任务名称</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">链接</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">进度</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">集数</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">备注</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">开始时间</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tasks.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                  暂无任务，点击"添加任务"开始吧！
                </td>
              </tr>
            ) : (
              tasks.map((task, index) => {
                const progress = getProgress(task);
                return (
                  <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-800">{task.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      {task.link ? (
                        <a
                          href={task.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline text-sm truncate block max-w-xs"
                        >
                          {task.link}
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${getProgressColor(progress)}`}
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-700 w-10">{progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={task.currentEpisode}
                          onChange={(e) => updateEpisode(task.id, 'currentEpisode', e.target.value)}
                          className="w-12 px-2 py-1 text-center border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                          min="0"
                          max={task.totalEpisodes}
                        />
                        <span className="text-gray-500">/</span>
                        <input
                          type="number"
                          value={task.totalEpisodes}
                          onChange={(e) => updateEpisode(task.id, 'totalEpisodes', e.target.value)}
                          className="w-12 px-2 py-1 text-center border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                          min="0"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-600">{task.notes || '-'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-500">{task.startDate}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        ️
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TaskModule;
