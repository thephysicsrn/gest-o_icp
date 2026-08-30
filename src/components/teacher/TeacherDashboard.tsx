import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  ResearchGroup, 
  ResearchLine 
} from '../../types';
import { groupService } from '../../firebase/services/groupService';
import { ResearchLineManager } from './ResearchLineManager';
import { StudentUnitManager } from './StudentUnitManager';
import { AttendanceManager } from './AttendanceManager';
import { ActivityBoardManager } from './ActivityBoardManager';
import { PrivateRoomManager } from './PrivateRoomManager';
import { LogbookReviewManager } from './LogbookReviewManager';
import { TeacherPhotoGallery } from './TeacherPhotoGallery';
import { 
  GraduationCap, 
  Layers, 
  Users,
  Calendar, 
  CheckSquare, 
  FolderLock, 
  BookOpen, 
  Camera, 
  Plus
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const { currentUser, allUsers } = useAuth();
  const [group, setGroup] = useState<ResearchGroup | null>(null);
  const [lines, setLines] = useState<ResearchLine[]>([]);
  const [activeTab, setActiveTab] = useState<'lines' | 'students' | 'attendance' | 'activities' | 'private_room' | 'logbooks' | 'photos'>('lines');
  const [isLoading, setIsLoading] = useState(true);

  // Modal de criação de grupo se o professor ainda não tiver um grupo
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [newGroupTitle, setNewGroupTitle] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');

  const loadTeacherData = async () => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      let teacherGroup = await groupService.getGroupByLeader(currentUser.uid);
      
      // Se não encontrar por UID, busca pela unidade
      if (!teacherGroup) {
        const allGroups = await groupService.getAllGroups();
        teacherGroup = allGroups.find(g => g.unit === currentUser.unit) || null;
      }

      setGroup(teacherGroup);

      if (teacherGroup) {
        const groupLines = await groupService.getLinesByGroup(teacherGroup.id);
        setLines(groupLines);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTeacherData();
  }, [currentUser]);

  const unitStudents = allUsers.filter(
    u => u.role === 'student' && (currentUser ? u.unit === currentUser.unit : true)
  );

  const handleCreateNewGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newGroupTitle) return;

    const created = await groupService.saveGroup({
      title: newGroupTitle,
      description: newGroupDesc || 'Grupo de pesquisa dedicado à iniciação científica no ensino médio.',
      unit: currentUser.unit,
      leaderTeacherId: currentUser.uid,
      leaderTeacherName: currentUser.name,
    });

    setGroup(created);
    setIsCreatingGroup(false);
    await loadTeacherData();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#002B5C] border-t-transparent"></div>
      </div>
    );
  }

  // Professor sem grupo cadastrado
  if (!group) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4 shadow-xl">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 text-[#002B5C] flex items-center justify-center mx-auto">
          <GraduationCap className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-[#002B5C] font-sans">
          Bem-vindo, {currentUser?.name}!
        </h2>
        <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
          Você ainda não possui um Grupo de Pesquisa vinculado à sua unidade <strong>({currentUser?.unit})</strong>. Crie seu grupo para cadastrar até 5 linhas de pesquisa e orientar seus alunos.
        </p>

        {isCreatingGroup ? (
          <form onSubmit={handleCreateNewGroup} className="text-left space-y-3 pt-3">
            <div>
              <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                Nome do Grupo de Pesquisa *
              </label>
              <input
                type="text"
                required
                value={newGroupTitle}
                onChange={(e) => setNewGroupTitle(e.target.value)}
                placeholder="Ex: Robótica e Automação Sustentável SESI"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-[#002B5C] focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                Objetivos Gerais do Grupo
              </label>
              <textarea
                rows={3}
                value={newGroupDesc}
                onChange={(e) => setNewGroupDesc(e.target.value)}
                placeholder="Breve descrição dos objetivos acadêmicos e científicos..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-[#002B5C] focus:bg-white focus:outline-none"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreatingGroup(false)}
                className="px-4 py-2 text-xs text-slate-500 hover:text-slate-800"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-[#002B5C] hover:bg-[#003B71] text-white px-5 py-2 rounded-xl text-xs font-bold"
              >
                Criar Grupo de Pesquisa
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsCreatingGroup(true)}
            className="bg-[#002B5C] hover:bg-[#003B71] text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-[#70B32D]" />
            <span>Cadastrar Meu Grupo de Pesquisa</span>
          </button>
        )}
      </div>
    );
  }

  const totalEnrolledStudents = lines.reduce((acc, curr) => acc + curr.studentIds.length, 0);

  return (
    <div className="space-y-6">
      
      {/* Banner Principal do Professor */}
      <div className="bg-[#002B5C] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#70B32D]/20 blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-white/10 rounded-lg text-[#70B32D]">
                <GraduationCap className="w-5 h-5" />
              </span>
              <span className="text-xs uppercase tracking-wider text-blue-200 font-bold">
                Professor Pesquisador Líder • {currentUser?.unit}
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              {group.title}
            </h1>
            
            <p className="text-xs sm:text-sm text-blue-100 max-w-3xl leading-relaxed">
              {group.description}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 bg-white/10 border border-white/20 p-3 rounded-2xl text-xs text-white backdrop-blur-md">
            <div className="text-center px-3 border-r border-white/20">
              <p className="text-2xl font-black text-[#70B32D]">{lines.length}/5</p>
              <p className="text-[10px] text-blue-200 uppercase tracking-wider font-bold">Linhas</p>
            </div>
            <div className="text-center px-3">
              <p className="text-2xl font-black text-white">{totalEnrolledStudents}</p>
              <p className="text-[10px] text-blue-200 uppercase tracking-wider font-bold">Alunos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Abas de Navegação */}
      <div className="bg-white border border-slate-200 p-1.5 rounded-2xl flex flex-wrap gap-1.5 shadow-xs">
        <button
          onClick={() => setActiveTab('lines')}
          className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs transition-all flex items-center justify-center gap-2 ${
            activeTab === 'lines'
              ? 'bg-[#002B5C] text-white font-bold shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
          }`}
        >
          <Layers className={`w-4 h-4 ${activeTab === 'lines' ? 'text-[#70B32D]' : 'text-slate-400'}`} />
          <span>Linhas ({lines.length}/5)</span>
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs transition-all flex items-center justify-center gap-2 ${
            activeTab === 'students'
              ? 'bg-[#002B5C] text-white font-bold shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
          }`}
        >
          <Users className={`w-4 h-4 ${activeTab === 'students' ? 'text-[#70B32D]' : 'text-slate-400'}`} />
          <span>Alunos da Unidade ({unitStudents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('attendance')}
          className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs transition-all flex items-center justify-center gap-2 ${
            activeTab === 'attendance'
              ? 'bg-[#002B5C] text-white font-bold shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
          }`}
        >
          <Calendar className={`w-4 h-4 ${activeTab === 'attendance' ? 'text-[#70B32D]' : 'text-slate-400'}`} />
          <span>Reuniões & Frequência</span>
        </button>

        <button
          onClick={() => setActiveTab('activities')}
          className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs transition-all flex items-center justify-center gap-2 ${
            activeTab === 'activities'
              ? 'bg-[#002B5C] text-white font-bold shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
          }`}
        >
          <CheckSquare className={`w-4 h-4 ${activeTab === 'activities' ? 'text-[#70B32D]' : 'text-slate-400'}`} />
          <span>Quadro de Tarefas</span>
        </button>

        <button
          onClick={() => setActiveTab('private_room')}
          className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs transition-all flex items-center justify-center gap-2 ${
            activeTab === 'private_room'
              ? 'bg-[#002B5C] text-white font-bold shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
          }`}
        >
          <FolderLock className={`w-4 h-4 ${activeTab === 'private_room' ? 'text-[#70B32D]' : 'text-slate-400'}`} />
          <span>Sala Particular</span>
        </button>

        <button
          onClick={() => setActiveTab('logbooks')}
          className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs transition-all flex items-center justify-center gap-2 ${
            activeTab === 'logbooks'
              ? 'bg-[#002B5C] text-white font-bold shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
          }`}
        >
          <BookOpen className={`w-4 h-4 ${activeTab === 'logbooks' ? 'text-[#70B32D]' : 'text-slate-400'}`} />
          <span>Diários de Bordo</span>
        </button>

        <button
          onClick={() => setActiveTab('photos')}
          className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs transition-all flex items-center justify-center gap-2 ${
            activeTab === 'photos'
              ? 'bg-[#002B5C] text-white font-bold shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
          }`}
        >
          <Camera className={`w-4 h-4 ${activeTab === 'photos' ? 'text-[#70B32D]' : 'text-slate-400'}`} />
          <span>Galeria de Fotos</span>
        </button>
      </div>

      {/* Conteúdo da Aba Ativa */}
      <div className="pt-2">
        {activeTab === 'lines' && (
          <ResearchLineManager
            group={group}
            lines={lines}
            unitStudents={unitStudents}
            onRefresh={loadTeacherData}
          />
        )}

        {activeTab === 'students' && currentUser && (
          <StudentUnitManager
            group={group}
            lines={lines}
            unitStudents={unitStudents}
            unit={currentUser.unit}
            onRefresh={loadTeacherData}
          />
        )}

        {activeTab === 'attendance' && (
          <AttendanceManager
            group={group}
            lines={lines}
            unitStudents={unitStudents}
          />
        )}

        {activeTab === 'activities' && (
          <ActivityBoardManager
            group={group}
            lines={lines}
            unitStudents={unitStudents}
          />
        )}

        {activeTab === 'private_room' && currentUser && (
          <PrivateRoomManager
            group={group}
            lines={lines}
            unitStudents={unitStudents}
            teacher={currentUser}
          />
        )}

        {activeTab === 'logbooks' && (
          <LogbookReviewManager
            group={group}
            lines={lines}
          />
        )}

        {activeTab === 'photos' && (
          <TeacherPhotoGallery
            group={group}
            lines={lines}
          />
        )}
      </div>

    </div>
  );
};
