import { useState, useEffect } from 'react';
import { storage, generateId } from './storage';

function TaskModule({ onProgressUpdate }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    setTasks(storage.getTasks());
  }, []);

  const updateProgress = (updatedTasks) => {
    const completedCount = updatedTasks.filter(t => t.completed).length;
    const totalCount = updatedTasks.length;
    const today = new Date().toISOString().split('T')[0];
    const progress = storage.getProgress();
    progress[today] = { completed: completedCount, total: totalCount, timestamp: Date.now() };
    storage.saveProgress(progress);
    onProgressUpdate?.(progress[today]);
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    const task = { id: generateId(), text: newTask.trim(), completed: false, createdAt: Date.now() };
    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    storage.saveTasks(updatedTasks);
    setNewTask('');
    updateProgress(updatedTasks);
  };

  const toggleTask = (id) => {
    const updatedTasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    setTasks(updatedTasks);
    storage.saveTasks(updatedTasks);
    updateProgress(updatedTasks);
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter(t => t.id !== id);
    setTasks(updatedTasks);
    storage.saveTasks(updatedTasks);
    updateProgress(updatedTasks);
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  const saveEdit = (id) => {
    if (!editText.trim()) return;
    const updatedTasks = tasks.map(t => t.id === id ? { ...t, text: editText.trim() } : t);
    setTasks(updatedTasks);
    storage.saveTasks(updatedTasks);
    setEditingId(null);
    setEditText('');
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span className="text-3xl">📚</span>
        学习任务
      </h2>
      
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
          placeholder="添加新的学习任务..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={addTask}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
        >
          添加
        </button>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {tasks.length === 0 ? (
          <p className="text-gray-500 text-center py-8">暂无任务，添加一个吧！</p>
        ) : (
          tasks.map(task => (
            <div
              key={task.id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                task.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:border-purple-300'
              }`}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
              />
              {editingId === task.id ? (
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && saveEdit(task.id)}
                  className="flex-1 px-2 py-1 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  autoFocus
                />
              ) : (
                <span
                  className={`flex-1 cursor-pointer ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}
                  onDoubleClick={() => startEdit(task)}
                >
                  {task.text}
                </span>
              )}
              {editingId === task.id ? (
                <button
                  onClick={() => saveEdit(task.id)}
                  className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                >
                  保存
                </button>
              ) : (
                <>
                  <button
                    onClick={() => startEdit(task)}
                    className="text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    🗑️
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TaskModule;
