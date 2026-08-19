import React, { useState, useEffect } from 'react';
import { 
  ResearchGroup, 
  ResearchLine, 
  MeetingAttendance, 
  AttendanceRecord, 
  AttendanceStatus,
  UserProfile 
} from '../../types';
import { attendanceService } from '../../firebase/services/attendanceService';
import { 
  Calendar, 
  Plus, 
  Clock, 
  AlertCircle, 
  Trash2, 
  Edit3, 
  X,
  Percent
} from 'lucide-react';

interface Props {
  group: ResearchGroup;
  lines: ResearchLine[];
  unitStudents: UserProfile[];
}

export const AttendanceManager: React.FC<Props> = ({ group, lines, unitStudents }) => {
  const [meetings, setMeetings] = useState<MeetingAttendance[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<MeetingAttendance | null>(null);

  // Estado do Formulário
  const [meetingDate, setMeetingDate] = useState(new Date().toISOString().split('T')[0]);
  const [meetingTime, setMeetingTime] = useState('14:00 - 16:00');
  const [meetingTitle, setMeetingTitle] = useState('');
  const [selectedLineId, setSelectedLineId] = useState<string>('ALL');
  const [agenda, setAgenda] = useState('');
  const [summary, setSummary] = useState('');
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadMeetings = async () => {
    const data = await attendanceService.getMeetingsByGroup(group.id);
    setMeetings(data);
  };

  useEffect(() => {
    loadMeetings();
  }, [group.id]);

  const allGroupStudentIds = Array.from(new Set(lines.flatMap(l => l.studentIds)));
  const allGroupStudents = unitStudents.filter(s => allGroupStudentIds.includes(s.uid));

  const handleOpenCreate = () => {
    setEditingMeeting(null);
    setMeetingDate(new Date().toISOString().split('T')[0]);
    setMeetingTime('14:00 - 16:00');
    setMeetingTitle('');
    setSelectedLineId('ALL');
    setAgenda('');
    setSummary('');
    
    const initialRecords: AttendanceRecord[] = allGroupStudents.map(student => ({
      studentId: student.uid,
      studentName: student.name,
      status: 'present',
      note: ''
    }));
    setRecords(initialRecords);
    setError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (meeting: MeetingAttendance) => {
    setEditingMeeting(meeting);
    setMeetingDate(meeting.date);
    setMeetingTime(meeting.time || '14:00 - 16:00');
    setMeetingTitle(meeting.title);
    setSelectedLineId(meeting.lineId || 'ALL');
    setAgenda(meeting.agenda);
    setSummary(meeting.summary || '');
    setRecords(meeting.records);
    setError(null);
    setIsModalOpen(true);
  };

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setRecords(prev => prev.map(rec => {
      if (rec.studentId === studentId) {
        return { ...rec, status };
      }
      return rec;
    }));
  };

  const handleNoteChange = (studentId: string, note: string) => {
    setRecords(prev => prev.map(rec => {
      if (rec.studentId === studentId) {
        return { ...rec, note };
      }
      return rec;
    }));
  };

  const handleSaveMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!meetingTitle || !meetingDate || !agenda) {
      setError('Preencha o título, a data e a pauta da reunião.');
      return;
    }

    try {
      let lineTitle: string | undefined = undefined;
      if (selectedLineId !== 'ALL') {
        const found = lines.find(l => l.id === selectedLineId);
        lineTitle = found ? found.title : undefined;
      }

      if (editingMeeting) {
        await attendanceService.updateMeeting(editingMeeting.id, {
          date: meetingDate,
          time: meetingTime,
          title: meetingTitle,
          lineId: selectedLineId === 'ALL' ? undefined : selectedLineId,
          lineTitle,
          agenda,
          summary,
          records,
        });
      } else {
        await attendanceService.createMeeting({
          groupId: group.id,
          lineId: selectedLineId === 'ALL' ? undefined : selectedLineId,
          lineTitle,
          date: meetingDate,
          time: meetingTime,
          title: meetingTitle,
          agenda,
          summary,
          records,
        });
      }

      await loadMeetings();
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar chamada de frequência.');
    }
  };

  const handleDeleteMeeting = async (id: string) => {
    if (confirm('Deseja excluir este registro de reunião e frequência?')) {
      await attendanceService.deleteMeeting(id);
      await loadMeetings();
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Cabeçalho */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#002B5C]" />
            <h2 className="text-sm font-bold text-[#002B5C] uppercase tracking-wider">
              Controle de Frequência & Reuniões Periódicas
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Registro sistemático de reuniões pré-estabelecidas, pautas tratadas e chamada de presença dos alunos
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-[#002B5C] hover:bg-[#003B71] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all shrink-0 uppercase tracking-wide"
        >
          <Plus className="w-3.5 h-3.5 text-[#70B32D]" />
          <span>Registrar Reunião & Chamada</span>
        </button>
      </div>

      {/* Estatísticas de Frequência Geral */}
      {allGroupStudents.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#002B5C] flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5 text-[#70B32D]" />
              Assiduidade Geral dos Alunos ({meetings.length} Reuniões Registradas)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {allGroupStudents.map((student) => {
              const studentMeetings = meetings.filter(m => m.records.some(r => r.studentId === student.uid));
              const presentCount = studentMeetings.filter(m => {
                const rec = m.records.find(r => r.studentId === student.uid);
                return rec?.status === 'present';
              }).length;
              const justifiedCount = studentMeetings.filter(m => {
                const rec = m.records.find(r => r.studentId === student.uid);
                return rec?.status === 'absent_justified';
              }).length;
              
              const total = studentMeetings.length;
              const percent = total > 0 ? Math.round(((presentCount + justifiedCount) / total) * 100) : 100;

              return (
                <div key={student.uid} className="bg-slate-50 border border-slate-200 hover:border-[#70B32D] p-3.5 rounded-xl transition-all">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs font-bold text-[#002B5C] truncate">{student.name}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      percent >= 85 ? 'bg-emerald-50 text-[#528521] border-emerald-200' : percent >= 70 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {percent}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        percent >= 85 ? 'bg-[#70B32D]' : percent >= 70 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2 flex justify-between font-medium">
                    <span>{presentCount} Presenças</span>
                    <span>{justifiedCount} Justificadas</span>
                    <span>{total - presentCount - justifiedCount} Faltas</span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Lista de Reuniões */}
      <div className="space-y-4">
        {meetings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center space-y-3">
            <Calendar className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">Nenhuma Reunião Registrada</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Clique em "Registrar Reunião & Chamada" para lançar a frequência do encontro.
            </p>
          </div>
        ) : (
          meetings.map((meeting) => (
            <div key={meeting.id} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs hover:shadow-md transition-all">
              
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
                  <h3 className="text-base font-bold text-[#002B5C] mt-1.5 tracking-tight">
                    {meeting.title}
                  </h3>
                </div>

                <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => handleOpenEdit(meeting)}
                    className="p-1.5 text-slate-400 hover:text-[#002B5C] hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar Chamada"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteMeeting(meeting.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Excluir Registro"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Pauta & Síntese */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <p className="font-bold text-[#002B5C] uppercase tracking-wide text-[10px] mb-1">
                    Pauta Estabelecida:
                  </p>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                    {meeting.agenda}
                  </p>
                </div>
                {meeting.summary && (
                  <div className="bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-200">
                    <p className="font-bold text-[#528521] uppercase tracking-wide text-[10px] mb-1">
                      Síntese & Encaminhamentos:
                    </p>
                    <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                      {meeting.summary}
                    </p>
                  </div>
                )}
              </div>

              {/* Tabela de Chamada */}
              <div className="border-t border-slate-100 pt-3">
                <p className="text-xs text-[#002B5C] font-bold uppercase tracking-wide mb-2.5">
                  Chamada dos Alunos ({meeting.records.length})
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {meeting.records.map((rec) => (
                    <div key={rec.studentId} className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl flex items-center justify-between text-xs">
                      <div className="truncate mr-2">
                        <p className="font-semibold text-slate-800 truncate">{rec.studentName}</p>
                        {rec.note && <p className="text-[11px] text-slate-500 italic truncate">{rec.note}</p>}
                      </div>
                      <div className="shrink-0">
                        {rec.status === 'present' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-[#528521] border border-emerald-200">
                            Presente
                          </span>
                        )}
                        {rec.status === 'absent_justified' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            Justificada
                          </span>
                        )}
                        {rec.status === 'absent' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                            Falta
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      {/* Modal de Reunião */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="bg-[#002B5C] p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#70B32D]" />
                <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                  {editingMeeting ? 'Editar Chamada & Reunião' : 'Lançar Nova Reunião & Chamada'}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMeeting} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                    Data da Reunião *
                  </label>
                  <input
                    type="date"
                    required
                    value={meetingDate}
                    onChange={(e) => setMeetingDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-[#002B5C] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                    Horário
                  </label>
                  <input
                    type="text"
                    value={meetingTime}
                    onChange={(e) => setMeetingTime(e.target.value)}
                    placeholder="14:00 - 16:00"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-[#002B5C] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                    Linha de Pesquisa
                  </label>
                  <select
                    value={selectedLineId}
                    onChange={(e) => setSelectedLineId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-[#002B5C] focus:bg-white font-medium"
                  >
                    <option value="ALL">Reunião Geral do Grupo</option>
                    {lines.map(l => (
                      <option key={l.id} value={l.id}>Linha {l.lineNumber}: {l.title.slice(0, 25)}...</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                  Título da Reunião / Pauta Principal *
                </label>
                <input
                  type="text"
                  required
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  placeholder="Ex: Reunião Semanal de Alinhamento Metodológico"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-[#002B5C] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                  Pauta e Objetivos Discutidos *
                </label>
                <textarea
                  rows={2}
                  required
                  value={agenda}
                  onChange={(e) => setAgenda(e.target.value)}
                  placeholder="Descreva os tópicos apresentados, testes executados e metas da semana..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-[#002B5C] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                  Resumo / Encaminhamentos
                </label>
                <textarea
                  rows={2}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Resultados alcançados, orientações dadas aos pesquisadores..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-[#002B5C] focus:bg-white"
                />
              </div>

              {/* Chamada */}
              <div className="border-t border-slate-100 pt-3">
                <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-2">
                  Chamada de Presença ({records.length})
                </label>

                <div className="space-y-2.5">
                  {records.map((rec) => (
                    <div key={rec.studentId} className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">{rec.studentName}</span>
                        
                        <div className="flex items-center gap-1.5 text-xs">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(rec.studentId, 'present')}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                              rec.status === 'present' ? 'bg-emerald-100 text-[#528521] border border-emerald-300' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            Presente
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(rec.studentId, 'absent_justified')}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                              rec.status === 'absent_justified' ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            Justificada
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(rec.studentId, 'absent')}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                              rec.status === 'absent' ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            Falta
                          </button>
                        </div>
                      </div>

                      <input
                        type="text"
                        value={rec.note || ''}
                        onChange={(e) => handleNoteChange(rec.studentId, e.target.value)}
                        placeholder="Observação (ex: Apresentou protótipo, atestado médico...)"
                        className="w-full text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#002B5C]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-500 hover:text-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#002B5C] hover:bg-[#003B71] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md uppercase tracking-wide"
                >
                  Salvar Chamada
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
