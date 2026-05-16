import { useState, useEffect } from 'react';
import { storage, generateId } from './storage';

function TaskModule({ onProgressUpdate }) {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [formData, setFormData] = useState({
    name: '',
    totalEpisodes: '',
    currentEpisode: '',
    notes: '',
    startDate: '',
    endDate: ''
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
      totalEpisodes: parseInt(formData.totalEpisodes) || 0,
      currentEpisode: parseInt(formData.currentEpisode) || 0,
      notes: formData.notes.trim(),
      startDate: formData.startDate || new Date().toISOString().split('T')[0],
      endDate: formData.endDate || '',
      createdAt: Date.now()
    };
    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    storage.saveTasks(updatedTasks);
    setFormData({ name: '', totalEpisodes: '', currentEpisode: '', notes: '', startDate: '', endDate: '' });
    setShowForm(false);
    updateProgress(updatedTasks);
  };

  const deleteSelected = () => {
    if (selectedIds.size === 0) return;
    const updatedTasks = tasks.filter(t => !selectedIds.has(t.id));
    setTasks(updatedTasks);
    storage.saveTasks(updatedTasks);
    setSelectedIds(new Set());
    updateProgress(updatedTasks);
  };

  const toggleSelect = (id) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === tasks.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(tasks.map(t => t.id)));
    }
  };

  const updateField = (id, field, value) => {
    const updatedTasks = tasks.map(t => {
      if (t.id === id) {
        return { ...t, [field]: value };
      }
      return t;
    });
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

    if (field === 'currentEpisode') {
      const oldTask = tasks.find(t => t.id === id);
      if (oldTask) {
        const today = new Date().toISOString().split('T')[0];
        const diff = numValue - oldTask.currentEpisode;
        if (diff !== 0) {
          storage.addDailyEpisodes(today, id, diff);
        }
      }
    }
  };

  const getProgress = (task) => {
    if (task.totalEpisodes === 0) return '0.0';
    return ((task.currentEpisode / task.totalEpisodes) * 100).toFixed(1);
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
          <div className="flex gap-2">
            {selectedIds.size > 0 && (
              <button
                onClick={deleteSelected}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
              >
                删除选中 ({selectedIds.size})
              </button>
            )}
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium"
            >
              {showForm ? '取消' : '+ 添加任务'}
            </button>
          </div>
        </div>

        {showForm && (
          <div className="mb-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="任务名称 *"
                className="px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <input
                type="number"
                name="totalEpisodes"
                value={formData.totalEpisodes}
                onChange={handleInputChange}
                placeholder="总集数"
                min="0"
                className="px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <input
                type="number"
                name="currentEpisode"
                value={formData.currentEpisode}
                onChange={handleInputChange}
                placeholder="当前集数"
                min="0"
                className="px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <input
                type="text"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="备注"
                className="px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 md:col-span-2"
              />
            </div>
            <button
              onClick={addTask}
              className="mt-3 px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium"
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
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase w-10">
                <input
                  type="checkbox"
                  checked={tasks.length > 0 && selectedIds.size === tasks.length}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                />
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase w-16">序号</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">任务名称</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">进度</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-48">集数</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-40">备注</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-36">开始时间</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-36">结束时间</th>
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
                  <tr key={task.id} className={`hover:bg-gray-50 transition-colors ${selectedIds.has(task.id) ? 'bg-amber-50' : ''}`}>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(task.id)}
                        onChange={() => toggleSelect(task.id)}
                        className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                      />
                    </td>
                    <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={task.name}
                        onChange={(e) => updateField(task.id, 'name', e.target.value)}
                        className="w-full px-2 py-1 border border-transparent hover:border-gray-300 focus:border-amber-400 rounded text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-transparent"
                      />
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
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={task.currentEpisode}
                          onChange={(e) => updateEpisode(task.id, 'currentEpisode', e.target.value)}
                          className="w-16 px-2 py-1 text-center border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                          min="0"
                          max={task.totalEpisodes}
                        />
                        <span className="text-gray-500">/</span>
                        <input
                          type="number"
                          value={task.totalEpisodes}
                          onChange={(e) => updateEpisode(task.id, 'totalEpisodes', e.target.value)}
                          className="w-16 px-2 py-1 text-center border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                          min="0"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={task.notes}
                        onChange={(e) => updateField(task.id, 'notes', e.target.value)}
                        placeholder="-"
                        className="w-full px-2 py-1 border border-transparent hover:border-gray-300 focus:border-amber-400 rounded text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-transparent"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="date"
                        value={task.startDate}
                        onChange={(e) => updateField(task.id, 'startDate', e.target.value)}
                        className="w-full px-2 py-1 border border-transparent hover:border-gray-300 focus:border-amber-400 rounded text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-transparent"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="date"
                        value={task.endDate || ''}
                        onChange={(e) => updateField(task.id, 'endDate', e.target.value)}
                        className="w-full px-2 py-1 border border-transparent hover:border-gray-300 focus:border-amber-400 rounded text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-transparent"
                      />
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
