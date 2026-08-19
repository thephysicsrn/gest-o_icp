import React, { useState, useEffect } from 'react';
import { 
  ResearchGroup, 
  ResearchLine, 
  LogbookEntry, 
  SupervisorValidationStatus 
} from '../../types';
import { logbookService } from '../../firebase/services/logbookService';
import { 
  BookOpen, 
  Clock, 
  Calendar, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare, 
  Filter, 
  Layers, 
  X, 
  Award
} from 'lucide-react';

interface Props {
  group: ResearchGroup;
  lines: ResearchLine[];
}

export const LogbookReviewManager: React.FC<Props> = ({ group, lines }) => {
  const [entries, setEntries] = useState<LogbookEntry[]>([]);
  const [selectedLineFilter, setSelectedLineFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [reviewingEntry, setReviewingEntry] = useState<LogbookEntry | null>(null);
  const [commentText, setCommentText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const loadEntries = async () => {
    const data = await logbookService.getEntriesByGroup(group.id);
    setEntries(data);
  };

  useEffect(() => {
    loadEntries();
  }, [group.id]);

  const handleOpenReview = (entry: LogbookEntry) => {
    setReviewingEntry(entry);
    setCommentText(entry.supervisorComment || '');
  };

  const handleSaveReview = async (status: SupervisorValidationStatus) => {
    if (!reviewingEntry) return;
    setIsSaving(true);
    try {
      await logbookService.reviewEntry(reviewingEntry.id, status, commentText);
      await loadEntries();
      setReviewingEntry(null);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredEntries = entries.filter((e) => {
    const matchesLine = selectedLineFilter === 'ALL' || e.lineId === selectedLineFilter;
    const matchesStatus = selectedStatusFilter === 'ALL' || e.supervisorStatus === selectedStatusFilter;
    return matchesLine && matchesStatus;
  });

  const pendingCount = entries.filter(e => e.supervisorStatus === 'pending').length;

  return (
    <div className="space-y-6">
      
      {/* Cabeçalho */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#002B5C]" />
            <h2 className="text-sm font-bold text-[#002B5C] uppercase tracking-wider">
              Supervisão de Diários de Bordo Científicos
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Avalie o rigor metodológico, resultados obtidos e dificuldades relatadas pelos pesquisadores
          </p>
        </div>

        {pendingCount > 0 && (
          <div className="bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-xl text-xs text-amber-800 font-semibold flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>{pendingCount} diários aguardando seu parecer</span>
          </div>
        )}
      </div>

      {/* Barra de Filtros */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          
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

          {/* Filtro de Situação */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs text-slate-700">
            <Filter className="w-3.5 h-3.5 text-[#002B5C]" />
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer text-slate-800 font-semibold"
            >
              <option value="ALL">Todos os Pareceres</option>
              <option value="pending">Aguardando Parecer</option>
              <option value="approved">Aprovados</option>
              <option value="needs_revision">Requer Revisão</option>
            </select>
          </div>

        </div>

        <span className="text-xs text-slate-500 font-medium">
          Exibindo {filteredEntries.length} de {entries.length} registros
        </span>
      </div>

      {/* Lista de Registros */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">Nenhum Diário Encontrado</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Assim que os alunos preencherem suas sessões no diário de bordo, elas aparecerão aqui para sua revisão.
            </p>
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <div 
              key={entry.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-[#002B5C] transition-all p-5 space-y-4 shadow-xs hover:shadow-md"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-50 text-[#002B5C] border border-blue-200 font-bold text-[10px] px-2.5 py-0.5 rounded flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(entry.date + 'T12:00:00Z').toLocaleDateString('pt-BR')}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3 text-[#70B32D]" />
                      {entry.hoursWorked}h de pesquisa
                    </span>
                    <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-700 px-2 py-0.5 rounded font-medium">
                      {entry.stage}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-1.5">
                    <User className="w-3.5 h-3.5 text-[#528521]" />
                    <span className="text-sm font-bold text-[#002B5C]">{entry.studentName}</span>
                    <span className="text-xs text-slate-500 font-medium">• {entry.lineTitle}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {entry.supervisorStatus === 'approved' && (
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-[#528521] border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#70B32D]" />
                      Aprovado
                    </span>
                  )}
                  {entry.supervisorStatus === 'needs_revision' && (
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-red-500" />
                      Requer Ajustes
                    </span>
                  )}
                  {entry.supervisorStatus === 'pending' && (
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-600" />
                      Em Análise
                    </span>
                  )}

                  <button
                    onClick={() => handleOpenReview(entry)}
                    className="bg-[#002B5C] hover:bg-[#003B71] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 uppercase tracking-wide"
                  >
                    <MessageSquare className="w-3 h-3 text-[#70B32D]" />
                    <span>Avaliar</span>
                  </button>
                </div>
              </div>

              {/* Seções Científicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                  <p className="font-bold text-[#002B5C] uppercase text-[10px] tracking-wide">
                    1. Objetivos da Sessão:
                  </p>
                  <p className="text-slate-700 leading-relaxed line-clamp-2">{entry.objectives}</p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                  <p className="font-bold text-[#002B5C] uppercase text-[10px] tracking-wide">
                    2. Metodologia / Procedimentos:
                  </p>
                  <p className="text-slate-700 leading-relaxed line-clamp-2">{entry.methodology}</p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                  <p className="font-bold text-[#002B5C] uppercase text-[10px] tracking-wide">
                    3. Atividades Desenvolvidas:
                  </p>
                  <p className="text-slate-700 leading-relaxed line-clamp-2 whitespace-pre-line">{entry.activities}</p>
                </div>

                <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200 space-y-1">
                  <p className="font-bold text-[#528521] uppercase text-[10px] tracking-wide">
                    4. Resultados Obtidos:
                  </p>
                  <p className="text-slate-800 leading-relaxed line-clamp-2">{entry.results}</p>
                </div>
              </div>

              {entry.supervisorComment && (
                <div className="bg-blue-50/80 border border-blue-200 p-3.5 rounded-xl text-xs space-y-1">
                  <p className="font-bold text-[#002B5C] flex items-center gap-1 text-[10px] uppercase tracking-wide">
                    <Award className="w-3.5 h-3.5 text-[#70B32D]" />
                    Parecer do Orientador:
                  </p>
                  <p className="text-slate-700 italic">
                    "{entry.supervisorComment}"
                  </p>
                </div>
              )}

            </div>
          ))
        )}
      </div>

      {/* Modal de Avaliação */}
      {reviewingEntry && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#002B5C] p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#70B32D]" />
                <div>
                  <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                    Avaliação do Diário de Bordo
                  </h3>
                  <p className="text-xs text-blue-200">{reviewingEntry.studentName} • {reviewingEntry.date}</p>
                </div>
              </div>
              <button onClick={() => setReviewingEntry(null)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              
              {/* Conteúdo Completo */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
                <div>
                  <span className="font-bold text-[#002B5C] uppercase text-[10px] block tracking-wide">1. Objetivos:</span>
                  <p className="text-slate-800 mt-0.5 leading-relaxed">{reviewingEntry.objectives}</p>
                </div>
                <div>
                  <span className="font-bold text-[#002B5C] uppercase text-[10px] block tracking-wide">2. Metodologia:</span>
                  <p className="text-slate-800 mt-0.5 leading-relaxed">{reviewingEntry.methodology}</p>
                </div>
                <div>
                  <span className="font-bold text-[#002B5C] uppercase text-[10px] block tracking-wide">3. Atividades:</span>
                  <p className="text-slate-800 mt-0.5 leading-relaxed whitespace-pre-line">{reviewingEntry.activities}</p>
                </div>
                <div>
                  <span className="font-bold text-[#528521] uppercase text-[10px] block tracking-wide">4. Resultados:</span>
                  <p className="text-slate-800 mt-0.5 leading-relaxed">{reviewingEntry.results}</p>
                </div>
                <div>
                  <span className="font-bold text-amber-700 uppercase text-[10px] block tracking-wide">5. Dificuldades:</span>
                  <p className="text-slate-800 mt-0.5 leading-relaxed">{reviewingEntry.difficulties || 'Nenhuma informada.'}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-700 uppercase text-[10px] block tracking-wide">6. Próximos Passos:</span>
                  <p className="text-slate-800 mt-0.5 leading-relaxed">{reviewingEntry.nextSteps || 'Não informados.'}</p>
                </div>
              </div>

              {/* Parecer do Orientador */}
              <div>
                <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1.5">
                  Parecer do Professor Orientador *
                </label>
                <textarea
                  rows={3}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Escreva suas considerações, sugestões bibliográficas e orientações para o aluno..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-[#002B5C] focus:bg-white focus:outline-none"
                />
              </div>

              {/* Ações */}
              <div className="border-t border-slate-100 pt-4 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleSaveReview('needs_revision')}
                  disabled={isSaving}
                  className="bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200 px-4 py-2 rounded-xl text-xs font-bold"
                >
                  Solicitar Revisão
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveReview('approved')}
                  disabled={isSaving}
                  className="bg-[#70B32D] hover:bg-[#5da523] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 uppercase tracking-wide"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Aprovar Registro</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
