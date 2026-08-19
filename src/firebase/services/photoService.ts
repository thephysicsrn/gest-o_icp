import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config';
import { PhotoRecord } from '../../types';

const toPhoto = (data: any, id: string): PhotoRecord => ({
  id,
  studentId: data.studentId ?? '',
  studentName: data.studentName ?? '',
  lineId: data.lineId ?? '',
  lineTitle: data.lineTitle ?? '',
  groupId: data.groupId ?? '',
  imageUrl: data.imageUrl ?? '',
  caption: data.caption ?? '',
  date: data.date ?? '',
  stage: data.stage ?? '',
  tags: data.tags ?? [],
  createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt ?? new Date().toISOString()),
});

export const photoService = {
  getPhotosByStudent: async (studentId: string): Promise<PhotoRecord[]> => {
    const q = query(collection(db, 'photos'), where('studentId', '==', studentId));
    const snap = await getDocs(q);
    return snap.docs.map(d => toPhoto(d.data(), d.id)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  getPhotosByGroup: async (groupId: string): Promise<PhotoRecord[]> => {
    const q = query(collection(db, 'photos'), where('groupId', '==', groupId));
    const snap = await getDocs(q);
    return snap.docs.map(d => toPhoto(d.data(), d.id)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  savePhoto: async (data: Omit<PhotoRecord, 'id' | 'createdAt'>): Promise<PhotoRecord> => {
    const ref = await addDoc(collection(db, 'photos'), {
      ...data,
      createdAt: serverTimestamp(),
    });
    const snap = await getDoc(ref);
    return toPhoto(snap.data()!, ref.id);
  },

  createPhoto: async (data: Omit<PhotoRecord, 'id' | 'createdAt'>): Promise<PhotoRecord> => {
    return photoService.savePhoto(data);
  },

  deletePhoto: async (id: string): Promise<void> => {
    await deleteDoc(doc(db, 'photos', id));
  },
};
