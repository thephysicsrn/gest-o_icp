import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config';
import { LogbookEntry, SupervisorValidationStatus } from '../../types';

const toEntry = (data: any, id: string): LogbookEntry => ({
  id,
  studentId: data.studentId ?? '',
  studentName: data.studentName ?? '',
  lineId: data.lineId ?? '',
  lineTitle: data.lineTitle ?? '',
  groupId: data.groupId ?? '',
  date: data.date ?? '',
  hoursWorked: data.hoursWorked ?? 0,
  stage: data.stage,
  objectives: data.objectives ?? '',
  methodology: data.methodology ?? '',
  activities: data.activities ?? '',
  results: data.results ?? '',
  difficulties: data.difficulties ?? '',
  nextSteps: data.nextSteps ?? '',
  supervisorStatus: data.supervisorStatus ?? 'pending',
  supervisorComment: data.supervisorComment,
  supervisorReviewedAt: data.supervisorReviewedAt instanceof Timestamp ? data.supervisorReviewedAt.toDate().toISOString() : data.supervisorReviewedAt,
  createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt ?? new Date().toISOString()),
});

export const logbookService = {
  getEntriesByStudent: async (studentId: string): Promise<LogbookEntry[]> => {
    const q = query(collection(db, 'logbooks'), where('studentId', '==', studentId));
    const snap = await getDocs(q);
    return snap.docs.map(d => toEntry(d.data(), d.id)).sort((a, b) => b.date.localeCompare(a.date));
  },

  getEntriesByGroup: async (groupId: string): Promise<LogbookEntry[]> => {
    const q = query(collection(db, 'logbooks'), where('groupId', '==', groupId));
    const snap = await getDocs(q);
    return snap.docs.map(d => toEntry(d.data(), d.id)).sort((a, b) => b.date.localeCompare(a.date));
  },

  getEntriesByLine: async (lineId: string): Promise<LogbookEntry[]> => {
    const q = query(collection(db, 'logbooks'), where('lineId', '==', lineId));
    const snap = await getDocs(q);
    return snap.docs.map(d => toEntry(d.data(), d.id)).sort((a, b) => b.date.localeCompare(a.date));
  },

  saveEntry: async (data: Partial<LogbookEntry>): Promise<LogbookEntry> => {
    const { id, createdAt, ...cleanData } = data;
    const ref = await addDoc(collection(db, 'logbooks'), {
      ...cleanData,
      supervisorStatus: cleanData.supervisorStatus || 'pending',
      createdAt: serverTimestamp(),
    });
    const snap = await getDoc(ref);
    return toEntry(snap.data()!, ref.id);
  },

  createEntry: async (data: Partial<LogbookEntry>): Promise<LogbookEntry> => {
    return logbookService.saveEntry(data);
  },

  updateEntry: async (id: string, data: Partial<LogbookEntry>): Promise<void> => {
    await updateDoc(doc(db, 'logbooks', id), data);
  },

  reviewEntry: async (id: string, status: SupervisorValidationStatus, comment?: string): Promise<void> => {
    await logbookService.updateEntry(id, {
      supervisorStatus: status,
      supervisorComment: comment,
      supervisorReviewedAt: new Date().toISOString(),
    });
  },

  deleteEntry: async (id: string): Promise<void> => {
    await deleteDoc(doc(db, 'logbooks', id));
  },
};
