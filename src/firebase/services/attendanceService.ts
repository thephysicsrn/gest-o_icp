import { MeetingAttendance, AttendanceRecord } from '../../types';
import { STORAGE_KEYS, getFromStorage, saveToStorage } from './storageHelper';
import { INITIAL_MEETINGS } from '../seedData';

export const attendanceService = {
  getMeetingsByGroup: async (groupId: string): Promise<MeetingAttendance[]> => {
    const meetings = getFromStorage<MeetingAttendance[]>(STORAGE_KEYS.MEETINGS, INITIAL_MEETINGS);
    return meetings
      .filter(m => m.groupId === groupId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  getMeetingsByLine: async (lineId: string): Promise<MeetingAttendance[]> => {
    const meetings = getFromStorage<MeetingAttendance[]>(STORAGE_KEYS.MEETINGS, INITIAL_MEETINGS);
    return meetings
      .filter(m => m.lineId === lineId || !m.lineId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  createMeeting: async (meetingData: {
    groupId: string;
    lineId?: string;
    lineTitle?: string;
    date: string;
    time?: string;
    title: string;
    agenda: string;
    summary?: string;
    records: AttendanceRecord[];
  }): Promise<MeetingAttendance> => {
    const meetings = getFromStorage<MeetingAttendance[]>(STORAGE_KEYS.MEETINGS, INITIAL_MEETINGS);

    const newMeeting: MeetingAttendance = {
      id: `meet-${Date.now()}`,
      groupId: meetingData.groupId,
      lineId: meetingData.lineId,
      lineTitle: meetingData.lineTitle,
      date: meetingData.date,
      time: meetingData.time || '14:00 - 16:00',
      title: meetingData.title,
      agenda: meetingData.agenda,
      summary: meetingData.summary || '',
      records: meetingData.records,
      createdAt: new Date().toISOString()
    };

    meetings.unshift(newMeeting);
    saveToStorage(STORAGE_KEYS.MEETINGS, meetings);
    return newMeeting;
  },

  updateMeeting: async (
    meetingId: string, 
    updates: Partial<MeetingAttendance>
  ): Promise<MeetingAttendance> => {
    const meetings = getFromStorage<MeetingAttendance[]>(STORAGE_KEYS.MEETINGS, INITIAL_MEETINGS);
    const index = meetings.findIndex(m => m.id === meetingId);
    if (index === -1) throw new Error('Reunião não encontrada.');

    meetings[index] = { ...meetings[index], ...updates };
    saveToStorage(STORAGE_KEYS.MEETINGS, meetings);
    return meetings[index];
  },

  deleteMeeting: async (meetingId: string): Promise<void> => {
    let meetings = getFromStorage<MeetingAttendance[]>(STORAGE_KEYS.MEETINGS, INITIAL_MEETINGS);
    meetings = meetings.filter(m => m.id !== meetingId);
    saveToStorage(STORAGE_KEYS.MEETINGS, meetings);
  },

  getStudentAttendanceStats: async (studentId: string): Promise<{
    totalMeetings: number;
    presentCount: number;
    justifiedCount: number;
    absentCount: number;
    percentage: number;
    history: {
      meetingId: string;
      date: string;
      title: string;
      status: 'present' | 'absent_justified' | 'absent';
      note?: string;
    }[];
  }> => {
    const meetings = getFromStorage<MeetingAttendance[]>(STORAGE_KEYS.MEETINGS, INITIAL_MEETINGS);
    
    let total = 0;
    let present = 0;
    let justified = 0;
    let absent = 0;
    const history: any[] = [];

    meetings.forEach(m => {
      const studentRecord = m.records.find(r => r.studentId === studentId);
      if (studentRecord) {
        total++;
        if (studentRecord.status === 'present') present++;
        else if (studentRecord.status === 'absent_justified') justified++;
        else absent++;

        history.push({
          meetingId: m.id,
          date: m.date,
          title: m.title,
          status: studentRecord.status,
          note: studentRecord.note
        });
      }
    });

    const effectivePresent = present + (justified * 0.5); // Justificativas ponderadas
    const percentage = total > 0 ? Math.round(((present + justified) / total) * 100) : 100;

    return {
      totalMeetings: total,
      presentCount: present,
      justifiedCount: justified,
      absentCount: absent,
      percentage,
      history: history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    };
  }
};
