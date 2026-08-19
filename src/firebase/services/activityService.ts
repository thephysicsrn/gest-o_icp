import { ActivityTask, TaskStatus, TaskPriority } from '../../types';
import { STORAGE_KEYS, getFromStorage, saveToStorage } from './storageHelper';
import { INITIAL_TASKS } from '../seedData';

export const activityService = {
  getTasksByGroup: async (groupId: string): Promise<ActivityTask[]> => {
    const tasks = getFromStorage<ActivityTask[]>(STORAGE_KEYS.TASKS, INITIAL_TASKS);
    return tasks
      .filter(t => t.groupId === groupId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getTasksByLine: async (lineId: string): Promise<ActivityTask[]> => {
    const tasks = getFromStorage<ActivityTask[]>(STORAGE_KEYS.TASKS, INITIAL_TASKS);
    return tasks
      .filter(t => t.lineId === lineId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getTasksForStudent: async (studentId: string, lineId: string): Promise<ActivityTask[]> => {
    const tasks = getFromStorage<ActivityTask[]>(STORAGE_KEYS.TASKS, INITIAL_TASKS);
    return tasks
      .filter(t => t.lineId === lineId && (!t.targetStudentId || t.targetStudentId === studentId))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  createTask: async (taskData: {
    groupId: string;
    lineId: string;
    lineTitle?: string;
    targetStudentId?: string;
    targetStudentName?: string;
    title: string;
    description: string;
    dueDate: string;
    priority: TaskPriority;
  }): Promise<ActivityTask> => {
    const tasks = getFromStorage<ActivityTask[]>(STORAGE_KEYS.TASKS, INITIAL_TASKS);

    const newTask: ActivityTask = {
      id: `task-${Date.now()}`,
      groupId: taskData.groupId,
      lineId: taskData.lineId,
      lineTitle: taskData.lineTitle,
      targetStudentId: taskData.targetStudentId,
      targetStudentName: taskData.targetStudentName,
      title: taskData.title,
      description: taskData.description,
      dueDate: taskData.dueDate,
      priority: taskData.priority,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    tasks.unshift(newTask);
    saveToStorage(STORAGE_KEYS.TASKS, tasks);
    return newTask;
  },

  updateTaskStatus: async (
    taskId: string, 
    status: TaskStatus, 
    submission?: { link?: string; notes?: string }
  ): Promise<ActivityTask> => {
    const tasks = getFromStorage<ActivityTask[]>(STORAGE_KEYS.TASKS, INITIAL_TASKS);
    const index = tasks.findIndex(t => t.id === taskId);
    if (index === -1) throw new Error('Tarefa não encontrada.');

    tasks[index].status = status;
    tasks[index].updatedAt = new Date().toISOString();
    
    if (submission) {
      if (submission.link !== undefined) tasks[index].submissionLink = submission.link;
      if (submission.notes !== undefined) tasks[index].submissionNotes = submission.notes;
    }

    saveToStorage(STORAGE_KEYS.TASKS, tasks);
    return tasks[index];
  },

  giveFeedback: async (
    taskId: string, 
    feedback: string, 
    newStatus?: TaskStatus
  ): Promise<ActivityTask> => {
    const tasks = getFromStorage<ActivityTask[]>(STORAGE_KEYS.TASKS, INITIAL_TASKS);
    const index = tasks.findIndex(t => t.id === taskId);
    if (index === -1) throw new Error('Tarefa não encontrada.');

    tasks[index].teacherFeedback = feedback;
    if (newStatus) tasks[index].status = newStatus;
    tasks[index].updatedAt = new Date().toISOString();

    saveToStorage(STORAGE_KEYS.TASKS, tasks);
    return tasks[index];
  },

  deleteTask: async (taskId: string): Promise<void> => {
    let tasks = getFromStorage<ActivityTask[]>(STORAGE_KEYS.TASKS, INITIAL_TASKS);
    tasks = tasks.filter(t => t.id !== taskId);
    saveToStorage(STORAGE_KEYS.TASKS, tasks);
  }
};
