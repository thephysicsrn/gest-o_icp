import React, { useState, useEffect } from 'react';
import { 
  UserProfile, 
  ResearchGroup, 
  ResearchLine, 
  MeetingAttendance 
} from '../../types';
import { attendanceService } from '../../firebase/services/attendanceService';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Percent
} from 'lucide-react';

interface Props {
  student: UserProfile;
  group: ResearchGroup | null;
  line: ResearchLine | null;
}

export const StudentAttendance: React.FC<Props> = ({ student, group }) => {
  const [meetings, setMeetings] = useState<MeetingAttendance[]>([]);

  useEffect(() => {
    const loadMeetings = async () => {
      if (!group) return;
      const data = await attendanceService.getMeetingsByGroup(group.id);
      setMeetings(data);
    };

    loadMeetings();
  }, [group]);

  // Filtrar reuniões onde o aluno possui registro
  const studentMeetings = meetings.filter(m => m.records.some(r => r.studentId === student.uid));
  
  const presentCount = studentMeetings.filter(m => {
    const rec = m.records.find(r => r.studentId === student.uid);
    return rec?.status === 'present';
  }).length;

  const justifiedCount = studentMeetings.filter(m => {
    const rec = m.records.find(r => r.studentId === student.uid);
    return rec?.status === 'absent_justified';
  }).length;

  const absentCount = studentMeetings.filter(m => {
    const rec = m.records.find(r => r.studentId === student.uid);
    return rec?.status === 'absent';
  }).length;

  const total = studentMeetings.length;
  const attendanceRate = total > 0 ? Math.round(((presentCount + justifiedCount) / total) * 100) : 100;

  return (
    <div className="space-y-6">
      
      {/* Cabeçalho */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#002B5C]" />
            <h2 className="text-sm font-bold text-[#002B5C] uppercase tracking-wider">
              Histórico Individual de Frequência
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Registro oficial de assiduidade nos encontros e reuniões periódicas do grupo de pesquisa
          </p>
        </div>
      </div>

      {/* Cartões de Indicadores */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs text-[#002B5C] font-bold uppercase tracking-wider">Assiduidade Geral</p>
          <p className={`text-3xl font-black mt-1 ${
            attendanceRate >= 85 ? 'text-[#528521]' : attendanceRate >= 70 ? 'text-amber-600' : 'text-red-600'
          }`}>
            {attendanceRate}%
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {attendanceRate >= 85 ? 'Excelente frequência' : 'Atenção às faltas'}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs text-[#002B5C] font-bold uppercase tracking-wider">Presenças</p>
          <p className="text-3xl font-black text-[#528521] mt-1">{presentCount}</p>
          <p className="text-xs text-slate-500 mt-1">Encontros participados</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs text-[#002B5C] font-bold uppercase tracking-wider">Justificadas</p>
          <p className="text-3xl font-black text-amber-600 mt-1">{justifiedCount}</p>
          <p className="text-xs text-slate-500 mt-1">Com justificativa aceita</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs text-[#002B5C] font-bold uppercase tracking-wider">Faltas</p>
          <p className="text-3xl font-black text-red-600 mt-1">{absentCount}</p>
          <p className="text-xs text-slate-500 mt-1">Não justificadas</p>
        </div>

      </div>

      {/* Histórico de Reuniões */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#002B5C]">
          Histórico de Reuniões ({studentMeetings.length})
        </h3>

        {studentMeetings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center space-y-3">
            <Calendar className="w-10 h-10 text-slate-400 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">Nenhuma Reunião Registrada</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              As frequências lançadas pelo seu professor nas reuniões aparecerão listadas aqui.
            </p>
          </div>
        ) : (
          studentMeetings.map((meeting) => {
            const studentRecord = meeting.records.find(r => r.studentId === student.uid);

            return (
              <div 
                key={meeting.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-[#002B5C] transition-all p-5 space-y-3 shadow-xs hover:shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-50 text-[#002B5C] border border-blue-200 font-bold text-[10px] px-2.5 py-0.5 rounded flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#002B5C]" />
                        {new Date(meeting.date + 'T12:00:00Z').toLocaleDateString('pt-BR')}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3 text-[#70B32D]" />
                        {meeting.time}
                      </span>
                      {meeting.lineTitle && (
                        <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-700 px-2 py-0.5 rounded font-medium">
                          {meeting.lineTitle}
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-[#002B5C] mt-1.5">
                      {meeting.title}
                    </h4>
                  </div>

                  <div className="shrink-0 self-end sm:self-center">
                    {studentRecord?.status === 'present' && (
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-[#528521] border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#70B32D]" />
                        Presente
                      </span>
                    )}
                    {studentRecord?.status === 'absent_justified' && (
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-amber-600" />
                        Falta Justificada
                      </span>
                    )}
                    {studentRecord?.status === 'absent' && (
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-red-600" />
                        Ausente
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-xs space-y-1">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Pauta Tratada:</p>
                  <p className="text-slate-700 leading-relaxed">{meeting.agenda}</p>
                </div>

                {studentRecord?.note && (
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                    <span className="text-xs text-[#002B5C] uppercase block mb-0.5 font-bold">Observação do Professor:</span>
                    <span className="text-slate-700 italic">{studentRecord.note}</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
