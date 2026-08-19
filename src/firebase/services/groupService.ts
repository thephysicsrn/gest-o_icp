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
import { ResearchGroup, ResearchLine } from '../../types';

const toGroup = (data: any, id: string): ResearchGroup => ({
  id,
  title: data.title ?? '',
  description: data.description ?? '',
  unit: data.unit,
  leaderTeacherId: data.leaderTeacherId ?? '',
  leaderTeacherName: data.leaderTeacherName ?? '',
  createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt ?? new Date().toISOString()),
  updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt,
});

const toLine = (data: any, id: string): ResearchLine => ({
  id,
  groupId: data.groupId ?? '',
  lineNumber: data.lineNumber ?? 1,
  title: data.title ?? '',
  area: data.area ?? '',
  description: data.description ?? '',
  studentIds: data.studentIds ?? [],
  studentNames: data.studentNames ?? [],
  createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt ?? new Date().toISOString()),
});

export const groupService = {
  getAllGroups: async (): Promise<ResearchGroup[]> => {
    const snap = await getDocs(collection(db, 'groups'));
    return snap.docs.map(d => toGroup(d.data(), d.id));
  },

  getAllLines: async (): Promise<ResearchLine[]> => {
    const snap = await getDocs(collection(db, 'lines'));
    return snap.docs.map(d => toLine(d.data(), d.id));
  },

  getGroupByLeader: async (teacherId: string): Promise<ResearchGroup | null> => {
    const q = query(collection(db, 'groups'), where('leaderTeacherId', '==', teacherId));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0];
    return toGroup(d.data(), d.id);
  },

  saveGroup: async (data: Partial<ResearchGroup>): Promise<ResearchGroup> => {
    const { id, createdAt, updatedAt, ...cleanData } = data;
    const ref = await addDoc(collection(db, 'groups'), {
      ...cleanData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    const snap = await getDoc(ref);
    return toGroup(snap.data()!, ref.id);
  },

  updateGroup: async (id: string, data: Partial<ResearchGroup>): Promise<void> => {
    await updateDoc(doc(db, 'groups', id), { ...data, updatedAt: serverTimestamp() });
  },

  deleteGroup: async (id: string): Promise<void> => {
    await deleteDoc(doc(db, 'groups', id));
  },

  getLinesByGroup: async (groupId: string): Promise<ResearchLine[]> => {
    const q = query(collection(db, 'lines'), where('groupId', '==', groupId));
    const snap = await getDocs(q);
    return snap.docs.map(d => toLine(d.data(), d.id)).sort((a, b) => a.lineNumber - b.lineNumber);
  },

  saveLine: async (data: Partial<ResearchLine>): Promise<ResearchLine> => {
    const { id, createdAt, ...cleanData } = data;
    const ref = await addDoc(collection(db, 'lines'), {
      ...cleanData,
      createdAt: serverTimestamp(),
    });
    const snap = await getDoc(ref);
    return toLine(snap.data()!, ref.id);
  },

  createLine: async (data: Partial<ResearchLine>): Promise<ResearchLine> => {
    return groupService.saveLine(data);
  },

  updateLine: async (id: string, data: Partial<ResearchLine>): Promise<void> => {
    await updateDoc(doc(db, 'lines', id), data);
  },

  deleteLine: async (id: string): Promise<void> => {
    await deleteDoc(doc(db, 'lines', id));
  },

  getStudentGroupAndLine: async (studentId: string): Promise<{ group: ResearchGroup | null; line: ResearchLine | null }> => {
    const q = query(collection(db, 'lines'), where('studentIds', 'array-contains', studentId));
    const snap = await getDocs(q);
    if (snap.empty) return { group: null, line: null };
    const line = toLine(snap.docs[0].data(), snap.docs[0].id);
    const groupSnap = await getDoc(doc(db, 'groups', line.groupId));
    const group = groupSnap.exists() ? toGroup(groupSnap.data(), groupSnap.id) : null;
    return { group, line };
  },
};
