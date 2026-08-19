import React, { useState, useEffect } from 'react';
import { 
  UserProfile, 
  ResearchGroup, 
  ResearchLine, 
  ActivityTask 
} from '../../types';
import { activityService } from '../../firebase/services/activityService';
import { 
  CheckSquare, 
  Clock, 
  CheckCircle2, 
  ExternalLink, 
  MessageSquare, 
  Send, 
  X, 
  Link as LinkIcon 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  student: UserProfile;
  group: ResearchGroup | null;
  line: ResearchLine | null;
}

export const StudentTasks: React.FC<Props> = ({ student, group, line }) => {
  const [tasks, setTasks] = useState<ActivityTask[]>([]);
  const [submissionModalTask, setSubmissionModalTask] = useState<ActivityTask | null>(null);
  const [submissionLink, setSubmissionLink] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadTasks = async () => {
    if (!line) {
      if (group) {
        const groupTasks = await activityService.getTasksByGroup(group.id);
        setTasks(groupTasks);
      }
      return;
    }
    const data = await activityService.getTasksForStudent(student.uid, line.id);
    setTasks(data);
  };

  useEffect(() => {
    loadTasks();
  }, [student.uid, line, group]);

  const handleOpenSubmission = (task: ActivityTask) => {
    setSubmissionModalTask(task);
    setSubmissionLink(task.submissionLink || '');
    setSubmissionNotes(task.submissionNotes || '');
  };

  const handleSubmitTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionModalTask) return;

    setIsSubmitting(true);
    try {
      await activityService.updateTaskStatus(
        submissionModalTask.id,
        'completed',
        { link: submissionLink, notes: submissionNotes }
      );

      try {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.8 },
          colors: ['#002B5C', '#70B32D', '#10B981']
        });
      } catch {}

      await loadTasks();
      setSubmissionModalTask(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Cabeçalho */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-[#002B5C]" />
            <h2 className="text-sm font-bold text-[#002B5C] uppercase tracking-wider">
              Minhas Tarefas & Entregas Direcionadas
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Acompanhe suas metas de pesquisa, envie links de relatórios e confira o parecer do seu orientador
          </p>
        </div>
      </div>

      {/* Lista de Tarefas */}
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center space-y-3">
            <CheckSquare className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">Nenhuma Atividade Atribuída</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Quando seu professor publicar tarefas no mural da sua linha de pesquisa, elas aparecerão aqui.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasks.map((task) => {
              const isOverdue = new Date(task.dueDate).getTime() < new Date().getTime() && task.status !== 'completed' && task.status !== 'approved';

              return (
                <div
                  key={task.id}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-[#002B5C] transition-all p-5 flex flex-col justify-between space-y-4 shadow-xs hover:shadow-md"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] ${
                        task.priority === 'high' ? 'bg-red-50 text-red-700 border border-red-200' : task.priority === 'medium' ? 'bg-blue-50 text-[#002B5C] border border-blue-200' : 'bg-slate-100 text-slate-600'
                      }`}>
                        Prioridade: {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
                      </span>

                      <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 font-bold' : 'text-slate-500'}`}>
                        <Clock className="w-3 h-3" />
                        Prazo: {new Date(task.dueDate + 'T12:00:00Z').toLocaleDateString('pt-BR')}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-[#002B5C] leading-snug">
                      {task.title}
                    </h4>

                    {task.description && (
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {task.description}
                      </p>
                    )}
                  </div>

                  {/* Parecer do Professor */}
                  {task.teacherFeedback && (
                    <div className="bg-blue-50/80 border border-blue-200 p-3 rounded-xl text-xs space-y-1">
                      <p className="font-bold text-[#002B5C] flex items-center gap-1 text-[10px] uppercase tracking-wide">
                        <MessageSquare className="w-3 h-3 text-[#70B32D]" />
                        Parecer do Orientador:
                      </p>
                      <p className="text-slate-700 italic">
                        "{task.teacherFeedback}"
                      </p>
                    </div>
                  )}

                  {/* Situação e Botão de Envio */}
                  <div className="border-t border-slate-100 pt-3 flex items-center justify-between gap-2">
                    <div>
                      {task.status === 'approved' && (
                        <span className="text-[10px] font-bold bg-emerald-50 text-[#528521] border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-[#70B32D]" />
                          Aprovada
                        </span>
                      )}
                      {task.status === 'completed' && (
                        <span className="text-[10px] font-bold bg-blue-50 text-[#002B5C] border border-blue-200 px-2.5 py-0.5 rounded-full">
                          Entregue (Em Análise)
                        </span>
                      )}
                      {task.status === 'in_progress' && (
                        <span className="text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full">
                          Em Andamento
                        </span>
                      )}
                      {task.status === 'pending' && (
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-0.5 rounded-full">
                          Pendente
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleOpenSubmission(task)}
                      className="bg-[#002B5C] hover:bg-[#003B71] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs uppercase tracking-wide"
                    >
                      <Send className="w-3 h-3 text-[#70B32D]" />
                      <span>{task.submissionLink ? 'Atualizar Entrega' : 'Enviar Entrega'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de Envio da Atividade */}
      {submissionModalTask && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#002B5C] p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-[#70B32D]" />
                <h3 className="font-bold text-sm text-white uppercase tracking-wider">Enviar Entrega da Atividade</h3>
              </div>
              <button onClick={() => setSubmissionModalTask(null)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitTask} className="p-5 space-y-4">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Atividade:</p>
                <p className="text-sm font-bold text-[#002B5C] mt-0.5">{submissionModalTask.title}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                  Link do Arquivo / Documento / Relatório *
                </label>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="url"
                    required
                    value={submissionLink}
                    onChange={(e) => setSubmissionLink(e.target.value)}
                    placeholder="https://drive.google.com/... ou link do relatório"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-[#002B5C] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                  Notas de Entrega / Dúvidas ao Professor
                </label>
                <textarea
                  rows={3}
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  placeholder="Escreva como você realizou a atividade e o que o professor deve avaliar..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-[#002B5C] focus:bg-white"
                />
              </div>

              <div className="border-t border-slate-100 pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSubmissionModalTask(null)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-500 hover:text-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#70B32D] hover:bg-[#5da523] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 uppercase tracking-wide"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Enviando...' : 'Confirmar Entrega'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
