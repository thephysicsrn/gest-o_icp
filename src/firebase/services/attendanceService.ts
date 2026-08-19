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
import { MeetingAttendance, AttendanceRecord } from '../../types';

const toMeeting = (data: any, id: string): MeetingAttendance => ({
  id,
  groupId: data.groupId ?? '',
  lineId: data.lineId,
  lineTitle: data.lineTitle,
  date: data.date ?? '',
  time: data.time,
  title: data.title ?? '',
  agenda: data.agenda ?? '',
  summary: data.summary,
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
    const ref = await addDoc(collection(db, 'meetings'), {
      ...data,
      createdAt: serverTimestamp(),
    });
    const snap = await getDoc(ref);
    return toMeeting(snap.data()!, ref.id);
  },

  createMeeting: async (data: Omit<MeetingAttendance, 'id' | 'createdAt'>): Promise<MeetingAttendance> => {
    return attendanceService.saveMeeting(data);
  },

  updateMeeting: async (id: string, data: Partial<MeetingAttendance>): Promise<void> => {
    await updateDoc(doc(db, 'meetings', id), data);
  },

  updateAttendanceRecords: async (meetingId: string, records: AttendanceRecord[]): Promise<void> => {
    await updateDoc(doc(db, 'meetings', meetingId), { records });
  },

  deleteMeeting: async (id: string): Promise<void> => {
    await deleteDoc(doc(db, 'meetings', id));
  },
};
