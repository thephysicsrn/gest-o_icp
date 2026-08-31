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

  createGroup: async (data: Partial<ResearchGroup>): Promise<ResearchGroup> => {
    return groupService.saveGroup(data);
  },

  updateGroup: async (id: string, data: Partial<ResearchGroup>): Promise<void> => {
    await updateDoc(doc(db, 'groups', id), { ...data, updatedAt: serverTimestamp() });
  },

  deleteGroup: async (id: string): Promise<void> => {
    await deleteDoc(doc(db, 'groups', id));
  },

  deleteGroupWithLines: async (groupId: string): Promise<void> => {
    const linesSnap = await getDocs(query(collection(db, 'lines'), where('groupId', '==', groupId)));
    for (const lDoc of linesSnap.docs) {
      await deleteDoc(doc(db, 'lines', lDoc.id));
    }
    await deleteDoc(doc(db, 'groups', groupId));
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

  transferStudent: async (studentId: string, studentName: string, targetLineId: string | null): Promise<void> => {
    // 1. Remove o aluno de qualquer linha atual onde esteja matriculado
    const allLinesSnap = await getDocs(collection(db, 'lines'));
    for (const lDoc of allLinesSnap.docs) {
      const data = lDoc.data();
      const sIds = (data.studentIds || []) as string[];
      if (sIds.includes(studentId)) {
        const newIds = sIds.filter(id => id !== studentId);
        const sNames = (data.studentNames || []) as string[];
        const newNames = sNames.filter(name => name !== studentName);
        await updateDoc(doc(db, 'lines', lDoc.id), {
          studentIds: newIds,
          studentNames: newNames,
        });
      }
    }

    // 2. Se targetLineId for informado, adiciona na linha de destino
    if (targetLineId) {
      const targetDoc = await getDoc(doc(db, 'lines', targetLineId));
      if (targetDoc.exists()) {
        const data = targetDoc.data();
        const currentIds = (data.studentIds || []) as string[];
        const currentNames = (data.studentNames || []) as string[];
        if (!currentIds.includes(studentId)) {
          if (currentIds.length >= 3) {
            throw new Error('A linha de pesquisa de destino já atingiu a capacidade máxima de 3 alunos.');
          }
          await updateDoc(doc(db, 'lines', targetLineId), {
            studentIds: [...currentIds, studentId],
            studentNames: [...currentNames, studentName],
          });
        }
      }
    }
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
