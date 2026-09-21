import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  deleteField,
  query,
  where,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config';
import { sanitizeFirestoreData } from '../firestoreHelper';
import { MeetingAttendance, AttendanceRecord } from '../../types';

const toMeeting = (data: any, id: string): MeetingAttendance => ({
  id,
  groupId: data.groupId ?? '',
  lineId: data.lineId || undefined,
  lineTitle: data.lineTitle || undefined,
  date: data.date ?? '',
  time: data.time || '',
  title: data.title ?? '',
  agenda: data.agenda ?? '',
  summary: data.summary || '',
  records: data.records ?? [],
  createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt ?? new Date().toISOString()),
});

export const attendanceService = {
  getMeetingsByGroup: async (groupId: string): Promise<MeetingAttendance[]> => {
    const q = query(collection(db, 'meetings'), where('groupId', '==', groupId));
    const snap = await getDocs(q);
    return snap.docs.map(d => toMeeting(d.data(), d.id)).sort((a, b) => b.date.localeCompare(a.date));
  },

  saveMeeting: async (data: Omit<MeetingAttendance, 'id' | 'createdAt'>): Promise<MeetingAttendance> => {
    const rawData: Record<string, any> = {
      ...data,
      createdAt: serverTimestamp(),
    };

    // Remove campos opcionais vazios ou undefined para que o Firestore nunca rejeite o addDoc
    if (!rawData.lineId) {
      delete rawData.lineId;
      delete rawData.lineTitle;
    }
    if (!rawData.summary) {
      delete rawData.summary;
    }

    const sanitized = sanitizeFirestoreData(rawData);
    const ref = await addDoc(collection(db, 'meetings'), sanitized);
    const snap = await getDoc(ref);
    return toMeeting(snap.data()!, ref.id);
  },

  createMeeting: async (data: Omit<MeetingAttendance, 'id' | 'createdAt'>): Promise<MeetingAttendance> => {
    return attendanceService.saveMeeting(data);
  },

  updateMeeting: async (id: string, data: Partial<MeetingAttendance>): Promise<void> => {
    const { id: _, createdAt: __, ...updates } = data as any;

    // Se lineId for explicitamente vazio ou nulo, remove do Firestore usando deleteField()
    if (updates.lineId === '' || updates.lineId === null) {
      updates.lineId = deleteField();
      updates.lineTitle = deleteField();
    } else if (updates.lineId === undefined) {
      delete updates.lineId;
      delete updates.lineTitle;
    }

    if (updates.summary === undefined) {
      delete updates.summary;
    }

    const sanitized = sanitizeFirestoreData(updates);
    await updateDoc(doc(db, 'meetings', id), sanitized);
  },

  updateAttendanceRecords: async (meetingId: string, records: AttendanceRecord[]): Promise<void> => {
    const sanitized = sanitizeFirestoreData({ records });
    await updateDoc(doc(db, 'meetings', meetingId), sanitized);
  },

  deleteMeeting: async (id: string): Promise<void> => {
    await deleteDoc(doc(db, 'meetings', id));
  },
};
