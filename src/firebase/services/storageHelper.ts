import { 
  INITIAL_USERS, 
  INITIAL_GROUPS, 
  INITIAL_LINES, 
  INITIAL_MEETINGS, 
  INITIAL_TASKS, 
  INITIAL_RESOURCES, 
  INITIAL_LOGBOOKS, 
  INITIAL_PHOTOS 
} from '../seedData';

const STORAGE_KEYS = {
  USERS: 'sesi_icp_users',
  GROUPS: 'sesi_icp_groups',
  LINES: 'sesi_icp_lines',
  MEETINGS: 'sesi_icp_meetings',
  TASKS: 'sesi_icp_tasks',
  RESOURCES: 'sesi_icp_resources',
  LOGBOOKS: 'sesi_icp_logbooks',
  PHOTOS: 'sesi_icp_photos',
  CURRENT_USER: 'sesi_icp_current_user',
};

// Initialize localStorage with seed data if empty
export const initLocalStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.GROUPS)) {
    localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(INITIAL_GROUPS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.LINES)) {
    localStorage.setItem(STORAGE_KEYS.LINES, JSON.stringify(INITIAL_LINES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.MEETINGS)) {
    localStorage.setItem(STORAGE_KEYS.MEETINGS, JSON.stringify(INITIAL_MEETINGS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TASKS)) {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.RESOURCES)) {
    localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(INITIAL_RESOURCES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.LOGBOOKS)) {
    localStorage.setItem(STORAGE_KEYS.LOGBOOKS, JSON.stringify(INITIAL_LOGBOOKS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PHOTOS)) {
    localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(INITIAL_PHOTOS));
  }
};

export const getFromStorage = <T>(key: string, defaultVal: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch {
    return defaultVal;
  }
};

export const saveToStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Erro ao salvar no storage (${key}):`, error);
  }
};

export const resetDataToSeed = () => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
  localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(INITIAL_GROUPS));
  localStorage.setItem(STORAGE_KEYS.LINES, JSON.stringify(INITIAL_LINES));
  localStorage.setItem(STORAGE_KEYS.MEETINGS, JSON.stringify(INITIAL_MEETINGS));
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
  localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(INITIAL_RESOURCES));
  localStorage.setItem(STORAGE_KEYS.LOGBOOKS, JSON.stringify(INITIAL_LOGBOOKS));
  localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(INITIAL_PHOTOS));
  window.location.reload();
};

export { STORAGE_KEYS };
