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
import { ActivityTask, TaskStatus } from '../../types';

const toTask = (data: any, id: string): ActivityTask => ({
  id,
  groupId: data.groupId ?? '',
  lineId: data.lineId ?? '',
  lineTitle: data.lineTitle,
  targetStudentId: data.targetStudentId,
  targetStudentName: data.targetStudentName,
  title: data.title ?? '',
  description: data.description ?? '',
  dueDate: data.dueDate ?? '',
  priority: data.priority ?? 'medium',
  status: data.status ?? 'pending',
  submissionLink: data.submissionLink,
  submissionNotes: data.submissionNotes,
  teacherFeedback: data.teacherFeedback,
  createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt ?? new Date().toISOString()),
  updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt,
});

export const activityService = {
  getTasksByGroup: async (groupId: string): Promise<ActivityTask[]> => {
    const q = query(collection(db, 'tasks'), where('groupId', '==', groupId));
    const snap = await getDocs(q);
    return snap.docs.map(d => toTask(d.data(), d.id)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  getTasksByStudent: async (studentId: string, _groupId?: string): Promise<ActivityTask[]> => {
    const q = query(collection(db, 'tasks'), where('targetStudentId', '==', studentId));
    const snap = await getDocs(q);
    return snap.docs.map(d => toTask(d.data(), d.id));
  },

  getTasksForStudent: async (studentId: string, _groupId?: string): Promise<ActivityTask[]> => {
    return activityService.getTasksByStudent(studentId, _groupId);
  },

  getTasksByLine: async (lineId: string): Promise<ActivityTask[]> => {
    const q = query(collection(db, 'tasks'), where('lineId', '==', lineId));
    const snap = await getDocs(q);
    return snap.docs.map(d => toTask(d.data(), d.id));
  },

  saveTask: async (data: Partial<ActivityTask>): Promise<ActivityTask> => {
    const { id, createdAt, updatedAt, ...cleanData } = data;
    const ref = await addDoc(collection(db, 'tasks'), {
      ...cleanData,
      status: cleanData.status || 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    const snap = await getDoc(ref);
    return toTask(snap.data()!, ref.id);
  },

  createTask: async (data: Partial<ActivityTask>): Promise<ActivityTask> => {
    return activityService.saveTask(data);
  },

  updateTask: async (id: string, data: Partial<ActivityTask>): Promise<void> => {
    await updateDoc(doc(db, 'tasks', id), { ...data, updatedAt: serverTimestamp() });
  },

  updateTaskStatus: async (
    id: string,
    status: TaskStatus,
    submissionOrNotes?: { link?: string; notes?: string } | string,
    maybeLink?: string
  ): Promise<void> => {
    const updates: Partial<ActivityTask> = { status };
    if (submissionOrNotes && typeof submissionOrNotes === 'object') {
      if (submissionOrNotes.notes !== undefined) updates.submissionNotes = submissionOrNotes.notes;
      if (submissionOrNotes.link !== undefined) updates.submissionLink = submissionOrNotes.link;
    } else if (typeof submissionOrNotes === 'string') {
      updates.submissionNotes = submissionOrNotes;
      if (maybeLink !== undefined) updates.submissionLink = maybeLink;
    }
    await activityService.updateTask(id, updates);
  },

  giveFeedback: async (id: string, feedbackOrGroupId: string, feedback?: string): Promise<void> => {
    const fb = feedback !== undefined ? feedback : feedbackOrGroupId;
    await activityService.updateTask(id, { teacherFeedback: fb });
  },

  deleteTask: async (id: string): Promise<void> => {
    await deleteDoc(doc(db, 'tasks', id));
  },
};
