import React, { useState, useEffect } from 'react';
import { UserProfile, ResearchLine, ResearchGroup, SesiUnit } from '../../types';
import { authService } from '../../firebase/services/authService';
import { groupService } from '../../firebase/services/groupService';
import { useAuth } from '../../context/AuthContext';
import { StudentRegisterModal } from './StudentRegisterModal';
import { 
  Users, 
  UserPlus, 
  Search, 
  Edit2, 
  Trash2, 
  Copy, 
  Check, 
  MessageSquare, 
  GraduationCap, 
  Layers, 
  CheckCircle, 
  AlertCircle,
  Phone,
  Mail, 
  UserCheck,
  ShieldAlert
} from 'lucide-react';

interface Props {
  group: ResearchGroup;
  lines: ResearchLine[];
  unitStudents: UserProfile[];
  unit: SesiUnit;
  onRefresh: () => Promise<void>;
}

export const StudentUnitManager: React.FC<Props> = ({
  group,
  lines,
  unitStudents,
  unit,
  onRefresh,
}) => {
  const { refreshUsers } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'my_students' | 'unassigned' | 'other_groups'>('all');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<UserProfile | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [allSystemLines, setAllSystemLines] = useState<ResearchLine[]>([]);
  const [allGroups, setAllGroups] = useState<ResearchGroup[]>([]);

  const loadSystemInfo = async () => {
    try {
      const [sysLines, sysGroups] = await Promise.all([
        groupService.getAllLines(),
        groupService.getAllGroups(),
      ]);
      setAllSystemLines(sysLines);
      setAllGroups(sysGroups);
    } catch {
      // Ignora erro de rede
    }
  };

  useEffect(() => {
    loadSystemInfo();
  }, [group.id]);

  // Linha deste professor
  const getMyStudentLine = (studentId: string): ResearchLine | undefined => {
    return lines.find(l => l.studentIds.includes(studentId));
  };

  // Linha de outro professor
  const getOtherStudentLineInfo = (studentId: string): { line: ResearchLine; group: ResearchGroup | undefined } | null => {
    const line = allSystemLines.find(l => l.studentIds.includes(studentId) && l.groupId !== group.id);
    if (!line) return null;
    const grp = allGroups.find(g => g.id === line.groupId);
    return { line, group: grp };
  };

  const myStudentsCount = unitStudents.filter(s => getMyStudentLine(s.uid) !== undefined).length;
  const otherStudentsCount = unitStudents.filter(s => getOtherStudentLineInfo(s.uid) !== null).length;
  const unassignedStudentsCount = unitStudents.filter(s => getMyStudentLine(s.uid) === undefined && getOtherStudentLineInfo(s.uid) === null).length;

  // Filtragem
  const filteredStudents = unitStudents.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.matricula?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.areaOrGrade?.toLowerCase().includes(searchTerm.toLowerCase());

    const isMine = getMyStudentLine(student.uid) !== undefined;
    const isOther = getOtherStudentLineInfo(student.uid) !== null;
    const isUnassigned = !isMine && !isOther;

    if (!matchesSearch) return false;
    if (filterStatus === 'my_students') return isMine;
    if (filterStatus === 'unassigned') return isUnassigned;
    if (filterStatus === 'other_groups') return isOther;
    return true;
  });

  const handleOpenCreate = () => {
    setEditingStudent(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (student: UserProfile) => {
    // Não permite editar aluno de outro orientador
    const otherInfo = getOtherStudentLineInfo(student.uid);
    if (otherInfo) {
      alert(`Este aluno está matriculado no grupo do Prof. ${otherInfo.group?.leaderTeacherName || 'outro orientador'} e só pode ser editado pelo respectivo orientador.`);
      return;
    }
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const OFFICIAL_SITE_URL = 'https://gestao-icp.vercel.app';

  const getWhatsAppMessage = (student: UserProfile) => {
    const myLine = getMyStudentLine(student.uid);
    const otherInfo = getOtherStudentLineInfo(student.uid);
    
    let lineInfo = '';
    if (myLine) {
      lineInfo = `• Linha de Pesquisa: Linha 0${myLine.lineNumber} - ${myLine.title}\n• Orientador(a): ${group.leaderTeacherName}\n`;
    } else if (otherInfo) {
      lineInfo = `• Linha de Pesquisa: Linha 0${otherInfo.line.lineNumber} - ${otherInfo.line.title}\n• Orientador(a): ${otherInfo.group?.leaderTeacherName}\n`;
    }

    return `Olá, ${student.name}!\n\nSeu cadastro no Sistema de Iniciação Científica (ICP) das Escolas SESI RN está ativo como *Aluno(a) Pesquisador(a)*.\n\n🌐 *Portal de Acesso:*\n${OFFICIAL_SITE_URL}\n\n📌 *Seus Dados de Acesso:*\n• E-mail: ${student.email}\n• Senha Inicial: sesi@aluno2026\n• Matrícula SESI: ${student.matricula}\n• Série/Turma: ${student.areaOrGrade || 'Ensino Médio'}\n• Polo SESI: ${unit}\n${lineInfo}\nAcesse a plataforma para acompanhar suas atividades e preencher o Diário de Bordo!\n\nAtenciosamente,\nEquipe SESI ICP`;
  };

  const handleCopyAccess = (student: UserProfile) => {
    const text = getWhatsAppMessage(student);
    navigator.clipboard.writeText(text);
    setCopiedId(student.uid);
    setTimeout(() => setCopiedId(null), 3000);
  };

  const handleShareWhatsApp = (student: UserProfile) => {
    const text = encodeURIComponent(getWhatsAppMessage(student));
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleDeleteStudent = async (student: UserProfile) => {
    const otherInfo = getOtherStudentLineInfo(student.uid);
    if (otherInfo) {
      alert(`Ação não permitida! Este aluno está matriculado no grupo do Prof. ${otherInfo.group?.leaderTeacherName || 'outro orientador'}.`);
      return;
    }

    if (confirm(`Tem certeza que deseja excluir o(a) aluno(a) ${student.name} (${student.email})? Ele(a) será desvinculado(a) das linhas de pesquisa.`)) {
      await authService.deleteUser(student.uid, student.email);
      await refreshUsers();
      await onRefresh();
      loadSystemInfo();
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#002B5C] flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-black text-slate-900">{unitStudents.length}</p>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              Total na Unidade
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#528521] flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-black text-[#528521]">{myStudentsCount}</p>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              Meus Alunos
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-black text-amber-600">{unassignedStudentsCount}</p>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              Sem Linha / Livres
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-black text-slate-700">{otherStudentsCount}</p>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              Outros Grupos
            </p>
          </div>
        </div>
      </div>

      {/* Barra de Ações e Filtros */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Barra de Busca */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, e-mail, matrícula ou turma..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-[#002B5C] focus:bg-white focus:outline-none"
          />
        </div>

        {/* Filtros e Botão de Novo Aluno */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 text-xs">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterStatus === 'all'
                  ? 'bg-white text-[#002B5C] font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos ({unitStudents.length})
            </button>
            <button
              onClick={() => setFilterStatus('my_students')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterStatus === 'my_students'
                  ? 'bg-white text-[#528521] font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Meus ({myStudentsCount})
            </button>
            <button
              onClick={() => setFilterStatus('unassigned')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterStatus === 'unassigned'
                  ? 'bg-white text-amber-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Livres ({unassignedStudentsCount})
            </button>
            <button
              onClick={() => setFilterStatus('other_groups')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterStatus === 'other_groups'
                  ? 'bg-white text-slate-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Outros ({otherStudentsCount})
            </button>
          </div>

          <button
            onClick={handleOpenCreate}
            className="bg-[#70B32D] hover:bg-[#5da523] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all shrink-0 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Cadastrar Aluno</span>
          </button>
        </div>
      </div>

      {/* Lista de Alunos */}
      {filteredStudents.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#002B5C] flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">
            {searchTerm || filterStatus !== 'all' 
              ? 'Nenhum aluno encontrado para os filtros selecionados.' 
              : 'Nenhum aluno cadastrado nesta unidade escolar ainda.'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Cadastre os alunos do Ensino Médio da sua unidade ({unit}) para compor as equipes de iniciação científica e vincular às suas linhas de pesquisa.
          </p>
          <button
            onClick={handleOpenCreate}
            className="bg-[#002B5C] hover:bg-[#003B71] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm inline-flex items-center gap-1.5 mt-2"
          >
            <UserPlus className="w-4 h-4 text-[#70B32D]" />
            <span>Cadastrar Aluno Nesta Unidade</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((student) => {
            const myLine = getMyStudentLine(student.uid);
            const otherInfo = getOtherStudentLineInfo(student.uid);
            const isOther = otherInfo !== null;

            const initials = student.name
              .split(' ')
              .map(n => n[0])
              .filter((_, i, a) => i === 0 || i === a.length - 1)
              .join('')
              .toUpperCase();

            return (
              <div
                key={student.uid}
                className={`bg-white rounded-2xl border p-5 shadow-xs transition-all flex flex-col justify-between space-y-4 ${
                  myLine 
                    ? 'border-emerald-200 ring-1 ring-emerald-100' 
                    : isOther
                    ? 'border-slate-200 bg-slate-50/40'
                    : 'border-slate-200'
                }`}
              >
                <div className="space-y-3">
                  {/* Topo do Card */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 border ${
                        myLine
                          ? 'bg-emerald-50 border-emerald-200 text-[#528521]'
                          : isOther
                          ? 'bg-slate-100 border-slate-200 text-slate-500'
                          : 'bg-blue-50 border-blue-100 text-[#002B5C]'
                      }`}>
                        {initials}
                      </div>
                      <div className="truncate">
                        <h4 className="text-xs font-bold text-slate-900 truncate" title={student.name}>
                          {student.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 font-mono">
                          {student.matricula || 'Sem matrícula'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {isOther ? (
                        <span 
                          title={`Aluno orientado por ${otherInfo?.group?.leaderTeacherName || 'outro professor'}`}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-semibold flex items-center gap-1"
                        >
                          <ShieldAlert className="w-3 h-3 text-slate-400" />
                          Outro Orientador
                        </span>
                      ) : (
                        <>
                          <button
                            onClick={() => handleOpenEdit(student)}
                            title="Editar Aluno"
                            className="p-1.5 text-slate-400 hover:text-[#002B5C] hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(student)}
                            title="Excluir Aluno"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Informações detalhadas */}
                  <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-1.5 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate text-slate-700 font-medium" title={student.email}>
                        {student.email}
                      </span>
                    </div>
                    {student.areaOrGrade && (
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="text-slate-600 font-medium">
                          {student.areaOrGrade}
                        </span>
                      </div>
                    )}
                    {student.phone && (
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="text-slate-600 font-medium">
                          {student.phone}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Status de Alocação da Linha */}
                  <div>
                    {myLine ? (
                      <div className="bg-emerald-50 border border-emerald-200 text-[#528521] p-2 rounded-xl text-xs flex items-center gap-2 font-semibold">
                        <Layers className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">
                          Minha Linha 0{myLine.lineNumber}: {myLine.title}
                        </span>
                      </div>
                    ) : otherInfo ? (
                      <div className="bg-blue-50/70 border border-blue-200/70 text-[#002B5C] p-2 rounded-xl text-xs flex items-center gap-2 font-semibold">
                        <Layers className="w-3.5 h-3.5 shrink-0 text-[#002B5C]" />
                        <span className="truncate">
                          Linha 0{otherInfo.line.lineNumber} • Orientador: {otherInfo.group?.leaderTeacherName || 'Outro Orientador'}
                        </span>
                      </div>
                    ) : (
                      <div className="bg-amber-50 border border-amber-200 text-amber-700 p-2 rounded-xl text-xs flex items-center gap-1.5 font-semibold">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>Disponível • Sem linha vinculada</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Ações de Compartilhamento */}
                <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => handleShareWhatsApp(student)}
                    className="flex-1 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] py-1.5 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    onClick={() => handleCopyAccess(student)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1.5 rounded-xl transition-all"
                    title="Copiar dados de acesso"
                  >
                    {copiedId === student.uid ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Cadastro / Edição de Aluno */}
      {isModalOpen && (
        <StudentRegisterModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingStudent(null);
          }}
          unit={unit}
          onStudentCreated={async () => {
            await refreshUsers();
            await onRefresh();
            loadSystemInfo();
          }}
          studentToEdit={editingStudent}
        />
      )}

    </div>
  );
};
