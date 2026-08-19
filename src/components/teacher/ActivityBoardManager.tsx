import React, { useState, useEffect } from 'react';
import { 
  ResearchGroup, 
  ResearchLine, 
  ActivityTask, 
  TaskPriority, 
  UserProfile 
} from '../../types';
import { activityService } from '../../firebase/services/activityService';
import { 
  CheckSquare, 
  Plus, 
  Clock, 
  AlertCircle, 
  User, 
  ExternalLink, 
  MessageSquare, 
  Trash2, 
  CheckCircle2, 
  X,
  Layers
} from 'lucide-react';

interface Props {
  group: ResearchGroup;
  lines: ResearchLine[];
  unitStudents: UserProfile[];
}

export const ActivityBoardManager: React.FC<Props> = ({ group, lines, unitStudents }) => {
  const [tasks, setTasks] = useState<ActivityTask[]>([]);
  const [selectedLineFilter, setSelectedLineFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedbackModalTask, setFeedbackModalTask] = useState<ActivityTask | null>(null);
  const [feedbackText, setFeedbackText] = useState('');

  // Estado do Formulário
  const [targetLineId, setTargetLineId] = useState<string>(lines[0]?.id || '');
  const [targetStudentId, setTargetStudentId] = useState<string>('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [error, setError] = useState<string | null>(null);

  const loadTasks = async () => {
    const data = await activityService.getTasksByGroup(group.id);
    setTasks(data);
  };

  useEffect(() => {
    loadTasks();
  }, [group.id]);

  const handleOpenCreate = () => {
    if (lines.length === 0) {
      alert('Você precisa cadastrar ao menos uma linha de pesquisa antes de criar atividades.');
      return;
    }
    setTargetLineId(lines[0].id);
    setTargetStudentId('');
    setTaskTitle('');
    setTaskDesc('');
    
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    setDueDate(nextWeek.toISOString().split('T')[0]);
    
    setPriority('medium');
    setError(null);
    setIsModalOpen(true);
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!taskTitle || !targetLineId || !dueDate) {
      setError('Preencha o título, a linha de pesquisa e o prazo de entrega.');
      return;
    }

    try {
      const targetLine = lines.find(l => l.id === targetLineId);
      let studentName: string | undefined = undefined;
      if (targetStudentId) {
        const s = unitStudents.find(st => st.uid === targetStudentId);
        studentName = s?.name;
      }

      await activityService.createTask({
        groupId: group.id,
        lineId: targetLineId,
        lineTitle: targetLine ? `Linha ${targetLine.lineNumber}: ${targetLine.title.slice(0, 30)}...` : undefined,
        targetStudentId: targetStudentId || undefined,
        targetStudentName: studentName,
        title: taskTitle,
        description: taskDesc,
        dueDate,
        priority,
      });

      await loadTasks();
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Erro ao criar atividade.');
    }
  };

  const handleOpenFeedback = (task: ActivityTask) => {
    setFeedbackModalTask(task);
    setFeedbackText(task.teacherFeedback || '');
  };

  const handleSaveFeedback = async (approved: boolean) => {
    if (!feedbackModalTask) return;
    await activityService.giveFeedback(
      feedbackModalTask.id, 
      feedbackText, 
      approved ? 'approved' : 'in_progress'
    );
    await loadTasks();
    setFeedbackModalTask(null);
  };

  const handleDeleteTask = async (id: string) => {
    if (confirm('Deseja excluir esta atividade do mural?')) {
      await activityService.deleteTask(id);
      await loadTasks();
    }
  };

  const filteredTasks = tasks.filter(t => selectedLineFilter === 'ALL' || t.lineId === selectedLineFilter);

  const pendingTasks = filteredTasks.filter(t => t.status === 'pending');
  const inProgressTasks = filteredTasks.filter(t => t.status === 'in_progress');
  const completedTasks = filteredTasks.filter(t => t.status === 'completed' || t.status === 'approved');

  const currentModalLine = lines.find(l => l.id === targetLineId);
  const currentLineStudents = currentModalLine 
    ? unitStudents.filter(s => currentModalLine.studentIds.includes(s.uid))
    : [];

  return (
    <div className="space-y-6">
      
      {/* Cabeçalho e Filtro por Linha */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-[#002B5C]" />
            <h2 className="text-sm font-bold text-[#002B5C] uppercase tracking-wider">
              Quadro de Atividades & Tarefas Direcionadas
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Distribua e acompanhe as tarefas de cada linha de pesquisa, prazos e entregas dos alunos
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          {/* Filtro de Linha */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs text-slate-700">
            <Layers className="w-3.5 h-3.5 text-[#002B5C]" />
            <select
              value={selectedLineFilter}
              onChange={(e) => setSelectedLineFilter(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer text-slate-800 font-semibold"
            >
              <option value="ALL">Todas as Linhas</option>
              {lines.map(l => (
                <option key={l.id} value={l.id}>Linha {l.lineNumber}: {l.title.slice(0, 25)}...</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleOpenCreate}
            className="bg-[#002B5C] hover:bg-[#003B71] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all shrink-0 uppercase tracking-wide"
          >
            <Plus className="w-3.5 h-3.5 text-[#70B32D]" />
            <span>Nova Atividade</span>
          </button>
        </div>
      </div>

      {/* Colunas do Quadro de Atividades */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Coluna 1: Pendentes */}
        <div className="bg-slate-50/80 rounded-2xl p-4 space-y-3 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#002B5C]">
                Pendentes
              </h3>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded shadow-2xs">
              {pendingTasks.length}
            </span>
          </div>

          <div className="space-y-3">
            {pendingTasks.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-6">Nenhuma tarefa pendente</p>
            ) : (
              pendingTasks.map(task => renderTaskCardLight(task, handleOpenFeedback, handleDeleteTask))
            )}
          </div>
        </div>

        {/* Coluna 2: Em Andamento */}
        <div className="bg-slate-50/80 rounded-2xl p-4 space-y-3 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#002B5C]"></span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#002B5C]">
                Em Andamento
              </h3>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded shadow-2xs">
              {inProgressTasks.length}
            </span>
          </div>

          <div className="space-y-3">
            {inProgressTasks.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-6">Nenhuma tarefa em andamento</p>
            ) : (
              inProgressTasks.map(task => renderTaskCardLight(task, handleOpenFeedback, handleDeleteTask))
            )}
          </div>
        </div>

        {/* Coluna 3: Entregues e Aprovadas */}
        <div className="bg-slate-50/80 rounded-2xl p-4 space-y-3 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#70B32D]"></span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#528521]">
                Entregues & Aprovadas
              </h3>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded shadow-2xs">
              {completedTasks.length}
            </span>
          </div>

          <div className="space-y-3">
            {completedTasks.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-6">Nenhuma tarefa concluída</p>
            ) : (
              completedTasks.map(task => renderTaskCardLight(task, handleOpenFeedback, handleDeleteTask))
            )}
          </div>
        </div>

      </div>

      {/* Modal Criar Atividade */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="bg-[#002B5C] p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-[#70B32D]" />
                <h3 className="font-bold text-sm text-white uppercase tracking-wider">Nova Atividade Direcionada</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                  Linha de Pesquisa Destino *
                </label>
                <select
                  value={targetLineId}
                  onChange={(e) => {
                    setTargetLineId(e.target.value);
                    setTargetStudentId('');
                  }}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-[#002B5C] focus:bg-white font-medium"
                >
                  {lines.map(l => (
                    <option key={l.id} value={l.id}>
                      Linha {l.lineNumber}: {l.title} ({l.studentIds.length}/3 alunos)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                  Atribuir a Aluno Específico (Opcional)
                </label>
                <select
                  value={targetStudentId}
                  onChange={(e) => setTargetStudentId(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-[#002B5C] focus:bg-white"
                >
                  <option value="">Todos os Alunos da Linha (Equipe)</option>
                  {currentLineStudents.map(st => (
                    <option key={st.uid} value={st.uid}>{st.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                  Título da Atividade *
                </label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="Ex: Leitura e fichamento do artigo sobre sensores MQ-135"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-[#002B5C] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                  Instruções e Critérios de Entrega
                </label>
                <textarea
                  rows={3}
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  placeholder="Descreva o passo a passo esperado, links de modelo ou especificações técnicas..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-[#002B5C] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                    Prazo Limite *
                  </label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-[#002B5C] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                    Prioridade
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-[#002B5C] focus:bg-white font-medium"
                  >
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta / Urgente</option>
                  </select>
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
                  Publicar Atividade
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Modal de Parecer do Professor */}
      {feedbackModalTask && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#002B5C] p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#70B32D]" />
                <h3 className="font-bold text-sm text-white uppercase tracking-wider">Avaliação do Orientador</h3>
              </div>
              <button onClick={() => setFeedbackModalTask(null)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Atividade:</p>
                <p className="text-sm font-bold text-[#002B5C] mt-0.5">{feedbackModalTask.title}</p>
              </div>

              {feedbackModalTask.submissionLink && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                  <p className="text-xs text-[#002B5C] font-bold uppercase tracking-wide mb-1">Link de Entrega do Aluno:</p>
                  <a 
                    href={feedbackModalTask.submissionLink} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1 break-all font-semibold"
                  >
                    <span>{feedbackModalTask.submissionLink}</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>
                  {feedbackModalTask.submissionNotes && (
                    <p className="text-slate-600 mt-2 italic">
                      "{feedbackModalTask.submissionNotes}"
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                  Parecer / Comentários do Orientador
                </label>
                <textarea
                  rows={3}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Escreva suas orientações, elogios ou solicitações de correção..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-[#002B5C] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="border-t border-slate-100 pt-3 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleSaveFeedback(false)}
                  className="bg-amber-100 text-amber-900 border border-amber-300 px-4 py-2 rounded-xl text-xs font-bold hover:bg-amber-200"
                >
                  Solicitar Ajustes
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveFeedback(true)}
                  className="bg-[#70B32D] hover:bg-[#5da523] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 uppercase tracking-wide"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Aprovar Entrega</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

function renderTaskCardLight(
  task: ActivityTask, 
  onFeedback: (t: ActivityTask) => void,
  onDelete: (id: string) => void
) {
  const isOverdue = new Date(task.dueDate).getTime() < new Date().getTime() && task.status !== 'completed' && task.status !== 'approved';

  return (
    <div key={task.id} className="bg-white rounded-xl p-3.5 border border-slate-200 hover:border-[#002B5C] transition-all space-y-2.5 shadow-xs hover:shadow-md">
      
      <div className="flex items-center justify-between text-xs">
        <span className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] ${
          task.priority === 'high' ? 'bg-red-50 text-red-700 border border-red-200' : task.priority === 'medium' ? 'bg-blue-50 text-[#002B5C] border border-blue-200' : 'bg-slate-100 text-slate-600'
        }`}>
          {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
        </span>

        <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 font-bold' : 'text-slate-500'}`}>
          <Clock className="w-3 h-3" />
          {new Date(task.dueDate + 'T12:00:00Z').toLocaleDateString('pt-BR')}
        </span>
      </div>

      <h4 className="text-xs font-bold text-[#002B5C] leading-snug">
        {task.title}
      </h4>

      {task.description && (
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Aluno ou Equipe Destino */}
      <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2">
        <span className="flex items-center gap-1 font-semibold text-[#002B5C]">
          <User className="w-3 h-3 text-[#70B32D]" />
          {task.targetStudentName ? task.targetStudentName.split(' ')[0] : 'Toda a Linha'}
        </span>

        <div className="flex items-center gap-1">
          {task.submissionLink && (
            <a 
              href={task.submissionLink} 
              target="_blank" 
              rel="noreferrer" 
              className="text-blue-600 hover:text-blue-800 p-1"
              title="Abrir link de entrega do aluno"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          <button
            onClick={() => onFeedback(task)}
            className="text-slate-400 hover:text-[#002B5C] p-1"
            title="Parecer do Professor"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-slate-400 hover:text-red-600 p-1"
            title="Excluir"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {task.teacherFeedback && (
        <div className="bg-slate-50 p-2 rounded-lg text-xs text-slate-700 italic border-l-2 border-[#70B32D]">
          "{task.teacherFeedback}"
        </div>
      )}

    </div>
  );
}
