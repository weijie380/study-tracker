const STORAGE_KEYS = {
  TASKS: 'study_tasks',
  PROGRESS: 'study_progress',
  DAILY_EPISODES: 'daily_episodes'
};

const listeners = {};

export const storageEvents = {
  on(event, callback) {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(callback);
    return () => {
      listeners[event] = listeners[event].filter(cb => cb !== callback);
    };
  },
  emit(event, data) {
    (listeners[event] || []).forEach(cb => cb(data));
  }
};

export const storage = {
  getTasks() {
    const data = localStorage.getItem(STORAGE_KEYS.TASKS);
    return data ? JSON.parse(data) : [];
  },
  saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  },
  getProgress() {
    const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    return data ? JSON.parse(data) : {};
  },
  saveProgress(progress) {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
  },
  getDailyEpisodes() {
    const data = localStorage.getItem(STORAGE_KEYS.DAILY_EPISODES);
    return data ? JSON.parse(data) : {};
  },
  saveDailyEpisodes(dailyEpisodes) {
    localStorage.setItem(STORAGE_KEYS.DAILY_EPISODES, JSON.stringify(dailyEpisodes));
  },
  addDailyEpisodes(date, taskId, count) {
    const dailyEpisodes = this.getDailyEpisodes();
    if (!dailyEpisodes[date]) {
      dailyEpisodes[date] = {};
    }
    dailyEpisodes[date][taskId] = (dailyEpisodes[date][taskId] || 0) + count;
    this.saveDailyEpisodes(dailyEpisodes);
    storageEvents.emit('dailyEpisodesUpdated', { date, taskId, count });
    return dailyEpisodes[date];
  },
  getTodayEpisodesByTask() {
    const today = new Date().toISOString().split('T')[0];
    const dailyEpisodes = this.getDailyEpisodes();
    return dailyEpisodes[today] || {};
  },
  getTodayTotalEpisodes() {
    const todayEpisodes = this.getTodayEpisodesByTask();
    return Object.values(todayEpisodes).reduce((sum, count) => sum + count, 0);
  }
};

export const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);
