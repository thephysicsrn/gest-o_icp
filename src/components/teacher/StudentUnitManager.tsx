import React, { useState } from 'react';
import { UserProfile, ResearchLine, ResearchGroup, SesiUnit } from '../../types';
import { authService } from '../../firebase/services/authService';
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
  UserCheck
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
  const [filterStatus, setFilterStatus] = useState<'all' | 'assigned' | 'unassigned'>('all');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<UserProfile | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Mapeia para saber a qual linha cada aluno pertence
  const getStudentLine = (studentId: string): ResearchLine | undefined => {
    return lines.find(l => l.studentIds.includes(studentId));
  };

  const assignedStudentsCount = unitStudents.filter(s => getStudentLine(s.uid) !== undefined).length;
  const unassignedStudentsCount = unitStudents.length - assignedStudentsCount;

  // Filtragem
  const filteredStudents = unitStudents.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.matricula?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.areaOrGrade?.toLowerCase().includes(searchTerm.toLowerCase());

    const isAssigned = getStudentLine(student.uid) !== undefined;

    if (!matchesSearch) return false;
    if (filterStatus === 'assigned') return isAssigned;
    if (filterStatus === 'unassigned') return !isAssigned;
    return true;
  });

  const handleOpenCreate = () => {
    setEditingStudent(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (student: UserProfile) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const OFFICIAL_SITE_URL = 'https://gestao-icp.vercel.app';

  const getWhatsAppMessage = (student: UserProfile) => {
    const line = getStudentLine(student.uid);
    const lineInfo = line ? `• Linha de Pesquisa: Linha 0${line.lineNumber} - ${line.title}\n• Orientador: ${group.leaderTeacherName}\n` : '';

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
    if (confirm(`Tem certeza que deseja excluir o(a) aluno(a) ${student.name} (${student.email})? Ele(a) será desvinculado(a) de todas as linhas de pesquisa da unidade.`)) {
      await authService.deleteUser(student.uid, student.email);
      await refreshUsers();
      await onRefresh();
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#002B5C] flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">{unitStudents.length}</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Alunos na Unidade
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#528521] flex items-center justify-center shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-[#528521]">{assignedStudentsCount}</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Vinculados a Linhas
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-amber-600">{unassignedStudentsCount}</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Disponíveis / Sem Linha
            </p>
          </div>
        </div>
      </div>

      {/* Barra de Ações e Filtros */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
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
              onClick={() => setFilterStatus('assigned')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterStatus === 'assigned'
                  ? 'bg-white text-[#528521] font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Vinculados ({assignedStudentsCount})
            </button>
            <button
              onClick={() => setFilterStatus('unassigned')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterStatus === 'unassigned'
                  ? 'bg-white text-amber-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sem Linha ({unassignedStudentsCount})
            </button>
          </div>

          <button
            onClick={handleOpenCreate}
            className="bg-[#70B32D] hover:bg-[#5da523] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all shrink-0"
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
            <span>Cadastrar Primeiro Aluno da Unidade</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((student) => {
            const line = getStudentLine(student.uid);
            const initials = student.name
              .split(' ')
              .map(n => n[0])
              .filter((_, i, a) => i === 0 || i === a.length - 1)
              .join('')
              .toUpperCase();

            return (
              <div
                key={student.uid}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Topo do Card */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-[#002B5C] font-bold text-xs flex items-center justify-center shrink-0">
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
                    {line ? (
                      <div className="bg-emerald-50 border border-emerald-200 text-[#528521] p-2 rounded-xl text-xs flex items-center gap-2 font-semibold">
                        <Layers className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">
                          Linha 0{line.lineNumber}: {line.title}
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

                {/* Ações Rápidas */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleShareWhatsApp(student)}
                    className="flex-1 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    onClick={() => handleCopyAccess(student)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all"
                  >
                    {copiedId === student.uid ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>Copiar Acesso</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Cadastro / Edição de Aluno */}
      <StudentRegisterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        unit={unit}
        studentToEdit={editingStudent}
        onStudentCreated={async () => {
          await onRefresh();
        }}
      />

    </div>
  );
};
