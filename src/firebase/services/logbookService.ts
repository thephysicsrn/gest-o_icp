import { LogbookEntry, SupervisorValidationStatus, ResearchStage } from '../../types';
import { STORAGE_KEYS, getFromStorage, saveToStorage } from './storageHelper';
import { INITIAL_LOGBOOKS } from '../seedData';

export const logbookService = {
  getEntriesByStudent: async (studentId: string): Promise<LogbookEntry[]> => {
    const logbooks = getFromStorage<LogbookEntry[]>(STORAGE_KEYS.LOGBOOKS, INITIAL_LOGBOOKS);
    return logbooks
      .filter(l => l.studentId === studentId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  getEntriesByGroup: async (groupId: string): Promise<LogbookEntry[]> => {
    const logbooks = getFromStorage<LogbookEntry[]>(STORAGE_KEYS.LOGBOOKS, INITIAL_LOGBOOKS);
    return logbooks
      .filter(l => l.groupId === groupId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  getEntriesByLine: async (lineId: string): Promise<LogbookEntry[]> => {
    const logbooks = getFromStorage<LogbookEntry[]>(STORAGE_KEYS.LOGBOOKS, INITIAL_LOGBOOKS);
    return logbooks
      .filter(l => l.lineId === lineId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  createEntry: async (entryData: {
    studentId: string;
    studentName: string;
    lineId: string;
    lineTitle: string;
    groupId: string;
    date: string;
    hoursWorked: number;
    stage: ResearchStage;
    objectives: string;
    methodology: string;
    activities: string;
    results: string;
    difficulties: string;
    nextSteps: string;
  }): Promise<LogbookEntry> => {
    const logbooks = getFromStorage<LogbookEntry[]>(STORAGE_KEYS.LOGBOOKS, INITIAL_LOGBOOKS);

    const newEntry: LogbookEntry = {
      id: `log-${Date.now()}`,
      ...entryData,
      supervisorStatus: 'pending',
      createdAt: new Date().toISOString()
    };

    logbooks.unshift(newEntry);
    saveToStorage(STORAGE_KEYS.LOGBOOKS, logbooks);
    return newEntry;
  },

  updateEntry: async (
    id: string, 
    updates: Partial<LogbookEntry>
  ): Promise<LogbookEntry> => {
    const logbooks = getFromStorage<LogbookEntry[]>(STORAGE_KEYS.LOGBOOKS, INITIAL_LOGBOOKS);
    const index = logbooks.findIndex(l => l.id === id);
    if (index === -1) throw new Error('Entrada do diário de bordo não encontrada.');

    logbooks[index] = { ...logbooks[index], ...updates };
    saveToStorage(STORAGE_KEYS.LOGBOOKS, logbooks);
    return logbooks[index];
  },

  reviewEntry: async (
    id: string, 
    status: SupervisorValidationStatus, 
    comment: string
  ): Promise<LogbookEntry> => {
    const logbooks = getFromStorage<LogbookEntry[]>(STORAGE_KEYS.LOGBOOKS, INITIAL_LOGBOOKS);
    const index = logbooks.findIndex(l => l.id === id);
    if (index === -1) throw new Error('Entrada não encontrada.');

    logbooks[index].supervisorStatus = status;
    logbooks[index].supervisorComment = comment;
    logbooks[index].supervisorReviewedAt = new Date().toISOString();

    saveToStorage(STORAGE_KEYS.LOGBOOKS, logbooks);
    return logbooks[index];
  },

  deleteEntry: async (id: string): Promise<void> => {
    let logbooks = getFromStorage<LogbookEntry[]>(STORAGE_KEYS.LOGBOOKS, INITIAL_LOGBOOKS);
    logbooks = logbooks.filter(l => l.id !== id);
    saveToStorage(STORAGE_KEYS.LOGBOOKS, logbooks);
  }
};
