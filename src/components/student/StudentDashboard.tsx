import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  ResearchGroup, 
  ResearchLine 
} from '../../types';
import { groupService } from '../../firebase/services/groupService';
import { StudentLogbook } from './StudentLogbook';
import { StudentPhotoRecords } from './StudentPhotoRecords';
import { StudentPrivateRoom } from './StudentPrivateRoom';
import { StudentTasks } from './StudentTasks';
import { StudentAttendance } from './StudentAttendance';
import { 
  User, 
  BookOpen, 
  Camera, 
  FolderLock, 
  CheckSquare, 
  Calendar
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [group, setGroup] = useState<ResearchGroup | null>(null);
  const [line, setLine] = useState<ResearchLine | null>(null);
  const [activeTab, setActiveTab] = useState<'logbook' | 'photos' | 'private_room' | 'tasks' | 'attendance'>('logbook');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStudentContext = async () => {
      if (!currentUser) return;
      setIsLoading(true);
      try {
        const { group: fetchedGroup, line: fetchedLine } = await groupService.getStudentGroupAndLine(currentUser.uid);
        
        if (!fetchedGroup) {
          const allGroups = await groupService.getAllGroups();
          const unitGroup = allGroups.find(g => g.unit === currentUser.unit);
          setGroup(unitGroup || null);
        } else {
          setGroup(fetchedGroup);
        }

        setLine(fetchedLine);
      } finally {
        setIsLoading(false);
      }
    };

    loadStudentContext();
  }, [currentUser]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#002B5C] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Banner Principal do Aluno em Azul Escuro SESI */}
      <div className="bg-[#002B5C] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg text-white">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#70B32D]/20 blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-white/10 rounded-lg text-[#70B32D]">
                <User className="w-5 h-5" />
              </span>
              <span className="text-xs uppercase tracking-wider text-blue-200 font-bold">
                Aluno Pesquisador • {currentUser?.unit}
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              {currentUser?.name}
            </h1>
            
            <p className="text-xs sm:text-sm text-blue-100 flex flex-wrap items-center gap-2">
              <span>Matrícula: <strong className="text-white">{currentUser?.matricula}</strong></span>
              <span>•</span>
              <span className="text-blue-200">{currentUser?.areaOrGrade || 'Ensino Médio SESI'}</span>
            </p>
          </div>

          {/* Cartão de Vínculo com a Linha */}
          <div className="bg-white/10 border border-white/20 p-4 rounded-2xl text-xs text-white max-w-sm shrink-0 space-y-1.5 backdrop-blur-md">
            <p className="text-xs uppercase font-bold text-[#70B32D] tracking-wide">
              Linha de Pesquisa Vinculada:
            </p>
            <p className="font-bold text-sm text-white line-clamp-1">
              {line ? `Linha 0${line.lineNumber}: ${line.title}` : 'Aguardando atribuição de linha'}
            </p>
            <p className="text-xs text-blue-200 truncate">
              Orientador: <span className="text-white font-semibold">{group?.leaderTeacherName || 'Professor Líder'}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Abas de Navegação */}
      <div className="bg-white border border-slate-200 p-1.5 rounded-2xl flex flex-wrap gap-1.5 shadow-xs">
        
        <button
          onClick={() => setActiveTab('logbook')}
          className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs transition-all flex items-center justify-center gap-2 ${
            activeTab === 'logbook'
              ? 'bg-[#002B5C] text-white font-bold shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
          }`}
        >
          <BookOpen className={`w-4 h-4 ${activeTab === 'logbook' ? 'text-[#70B32D]' : 'text-slate-400'}`} />
          <span>Diário de Bordo</span>
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
          <span>Fotos & Evidências</span>
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
          onClick={() => setActiveTab('tasks')}
          className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs transition-all flex items-center justify-center gap-2 ${
            activeTab === 'tasks'
              ? 'bg-[#002B5C] text-white font-bold shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
          }`}
        >
          <CheckSquare className={`w-4 h-4 ${activeTab === 'tasks' ? 'text-[#70B32D]' : 'text-slate-400'}`} />
          <span>Minhas Tarefas</span>
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
          <span>Minha Frequência</span>
        </button>

      </div>

      {/* Conteúdo da Aba */}
      <div className="pt-2">
        {currentUser && (
          <>
            {activeTab === 'logbook' && (
              <StudentLogbook
                student={currentUser}
                group={group}
                line={line}
              />
            )}

            {activeTab === 'photos' && (
              <StudentPhotoRecords
                student={currentUser}
                group={group}
                line={line}
              />
            )}

            {activeTab === 'private_room' && (
              <StudentPrivateRoom
                student={currentUser}
                group={group}
                line={line}
              />
            )}

            {activeTab === 'tasks' && (
              <StudentTasks
                student={currentUser}
                group={group}
                line={line}
              />
            )}

            {activeTab === 'attendance' && (
              <StudentAttendance
                student={currentUser}
                group={group}
                line={line}
              />
            )}
          </>
        )}
      </div>

    </div>
  );
};
