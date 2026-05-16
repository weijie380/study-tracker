const STORAGE_KEYS = {
  TASKS: 'study_tasks',
  PROGRESS: 'study_progress',
  DAILY_EPISODES: 'daily_episodes'
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
  addDailyEpisodes(date, count) {
    const dailyEpisodes = this.getDailyEpisodes();
    dailyEpisodes[date] = (dailyEpisodes[date] || 0) + count;
    this.saveDailyEpisodes(dailyEpisodes);
    return dailyEpisodes[date];
  }
};

export const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);
