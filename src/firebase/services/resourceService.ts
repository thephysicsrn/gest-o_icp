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
import { LineResource } from '../../types';

const toResource = (data: any, id: string): LineResource => ({
  id,
  groupId: data.groupId ?? '',
  lineId: data.lineId ?? '',
  lineTitle: data.lineTitle,
  type: data.type ?? 'link',
  title: data.title ?? '',
  url: data.url ?? '',
  fileName: data.fileName,
  fileSize: data.fileSize,
  fileType: data.fileType,
  description: data.description,
  uploadedBy: data.uploadedBy ?? '',
  uploadedByName: data.uploadedByName ?? '',
  createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt ?? new Date().toISOString()),
});

export const resourceService = {
  getResourcesByLine: async (lineId: string): Promise<LineResource[]> => {
    const q = query(collection(db, 'resources'), where('lineId', '==', lineId));
    const snap = await getDocs(q);
    return snap.docs.map(d => toResource(d.data(), d.id)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  saveResource: async (data: Omit<LineResource, 'id' | 'createdAt'>): Promise<LineResource> => {
    const ref = await addDoc(collection(db, 'resources'), {
      ...data,
      createdAt: serverTimestamp(),
    });
    const snap = await getDoc(ref);
    return toResource(snap.data()!, ref.id);
  },

  createResource: async (data: Omit<LineResource, 'id' | 'createdAt'>): Promise<LineResource> => {
    return resourceService.saveResource(data);
  },

  updateResource: async (id: string, data: Partial<LineResource>): Promise<void> => {
    await updateDoc(doc(db, 'resources', id), data);
  },

  deleteResource: async (id: string): Promise<void> => {
    await deleteDoc(doc(db, 'resources', id));
  },
};
