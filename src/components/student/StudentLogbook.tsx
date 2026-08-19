import React, { useState, useEffect } from 'react';
import { 
  UserProfile, 
  ResearchGroup, 
  ResearchLine, 
  LogbookEntry, 
  ResearchStage 
} from '../../types';
import { logbookService } from '../../firebase/services/logbookService';
import { exportLogbookToPDF } from '../../utils/pdfExport';
import { 
  BookOpen, 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Award, 
  Trash2, 
  Edit3, 
  X,
  FileDown,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  student: UserProfile;
  group: ResearchGroup | null;
  line: ResearchLine | null;
}

const RESEARCH_STAGES: ResearchStage[] = [
  'Planejamento e Hipótese',
  'Revisão Bibliográfica',
  'Metodologia e Prototipagem',
  'Experimentação e Coleta de Dados',
  'Análise e Discussão de Resultados',
  'Redação do Artigo / Relatório Final',
  'Preparação para Feira Científica'
];

export const StudentLogbook: React.FC<Props> = ({ student, group, line }) => {
  const [entries, setEntries] = useState<LogbookEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<LogbookEntry | null>(null);

  // Estado do Formulário
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [hoursWorked, setHoursWorked] = useState<number>(3.0);
  const [stage, setStage] = useState<ResearchStage>('Metodologia e Prototipagem');
  const [objectives, setObjectives] = useState('');
  const [methodology, setMethodology] = useState('');
  const [activities, setActivities] = useState('');
  const [results, setResults] = useState('');
  const [difficulties, setDifficulties] = useState('');
  const [nextSteps, setNextSteps] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadEntries = async () => {
    const data = await logbookService.getEntriesByStudent(student.uid);
    setEntries(data);
  };

  useEffect(() => {
    loadEntries();
  }, [student.uid]);

  const handleOpenCreate = () => {
    setEditingEntry(null);
    setDate(new Date().toISOString().split('T')[0]);
    setHoursWorked(3.0);
    setStage('Metodologia e Prototipagem');
    setObjectives('');
    setMethodology('');
    setActivities('');
    setResults('');
    setDifficulties('');
    setNextSteps('');
    setError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (entry: LogbookEntry) => {
    setEditingEntry(entry);
    setDate(entry.date);
    setHoursWorked(entry.hoursWorked);
    setStage(entry.stage);
    setObjectives(entry.objectives);
    setMethodology(entry.methodology);
    setActivities(entry.activities);
    setResults(entry.results);
    setDifficulties(entry.difficulties);
    setNextSteps(entry.nextSteps);
    setError(null);
    setIsModalOpen(true);
  };

  const handleSaveEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!objectives || !methodology || !activities || !results) {
      setError('Por favor, preencha todos os campos científicos obrigatórios.');
      return;
    }

    setIsSaving(true);
    try {
      if (editingEntry) {
        await logbookService.updateEntry(editingEntry.id, {
          date,
          hoursWorked,
          stage,
          objectives,
          methodology,
          activities,
          results,
          difficulties,
          nextSteps,
          supervisorStatus: 'pending',
        });
      } else {
        await logbookService.createEntry({
          studentId: student.uid,
          studentName: student.name,
          lineId: line ? line.id : 'line-default',
          lineTitle: line ? `Linha ${line.lineNumber}: ${line.title}` : 'Pesquisa Científica',
          groupId: group ? group.id : 'group-default',
          date,
          hoursWorked,
          stage,
          objectives,
          methodology,
          activities,
          results,
          difficulties,
          nextSteps,
        });

        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.8 },
            colors: ['#002B5C', '#70B32D', '#10B981']
          });
        } catch {}
      }

      await loadEntries();
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar registro no diário de bordo.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Deseja excluir este registro do diário de bordo?')) {
      await logbookService.deleteEntry(id);
      await loadEntries();
    }
  };

  const handleExportPDF = () => {
    exportLogbookToPDF(entries, student, group, line);
  };

  const totalHours = entries.reduce((acc, curr) => acc + curr.hoursWorked, 0);
  const approvedCount = entries.filter(e => e.supervisorStatus === 'approved').length;

  return (
    <div className="space-y-6">
      
      {/* Cabeçalho */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#002B5C]" />
            <h2 className="text-sm font-bold text-[#002B5C] uppercase tracking-wider">
              Diário de Bordo da Iniciação Científica
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Padrão oficial de pesquisa pré-universitária para feiras científicas (FEBRACE, MOSTRATEC)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={handleExportPDF}
            className="bg-slate-50 hover:bg-slate-100 text-[#002B5C] border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs uppercase tracking-wide"
            title="Exportar Diário de Bordo em PDF no padrão oficial"
          >
            <FileDown className="w-3.5 h-3.5 text-[#70B32D]" />
            <span>Exportar em PDF</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="bg-[#002B5C] hover:bg-[#003B71] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all shrink-0 uppercase tracking-wide"
          >
            <Plus className="w-3.5 h-3.5 text-[#70B32D]" />
            <span>Novo Registro</span>
          </button>
        </div>
      </div>

      {/* Cartões de Indicadores */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs text-[#002B5C] font-bold uppercase tracking-wider">Total de Registros</p>
          <p className="text-3xl font-black text-[#002B5C] mt-1">{entries.length}</p>
          <p className="text-xs text-slate-500 mt-1">Sessões documentadas</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs text-[#002B5C] font-bold uppercase tracking-wider">Carga Horária Acumulada</p>
          <p className="text-3xl font-black text-[#002B5C] mt-1">{totalHours}h</p>
          <p className="text-xs text-slate-500 mt-1">Dedicação à pesquisa</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs text-[#002B5C] font-bold uppercase tracking-wider">Validação do Orientador</p>
          <p className="text-3xl font-black text-[#528521] mt-1">{approvedCount}/{entries.length}</p>
          <p className="text-xs text-slate-500 mt-1">Registros aprovados</p>
        </div>
      </div>

      {/* Faixa de Dicas Científicas */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-700">
        <Info className="w-4 h-4 text-[#002B5C] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-[#002B5C] text-xs uppercase tracking-wide">Diretrizes de Redação Científica:</p>
          <p className="text-slate-600 leading-relaxed">
            Seja detalhista nos procedimentos, registre parâmetros numéricos, tentativas que não deram certo e como você superou as dificuldades. Isso demonstra maturidade metodológica para as bancas avaliadoras.
          </p>
        </div>
      </div>

      {/* Lista de Registros */}
      <div className="space-y-4">
        {entries.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">Seu Diário de Bordo está Vazio</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Clique em "Novo Registro" para documentar sua primeira sessão de pesquisa.
            </p>
            <button
              onClick={handleOpenCreate}
              className="bg-[#002B5C] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md uppercase tracking-wide"
            >
              Criar Primeiro Registro
            </button>
          </div>
        ) : (
          entries.map((entry, index) => (
            <div 
              key={entry.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-[#002B5C] transition-all p-5 space-y-4 shadow-xs hover:shadow-md"
            >
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#002B5C] text-white font-bold text-[10px] px-2.5 py-0.5 rounded">
                      Registro #0{entries.length - index}
                    </span>
                    <span className="text-xs text-slate-700 font-semibold flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#002B5C]" />
                      {new Date(entry.date + 'T12:00:00Z').toLocaleDateString('pt-BR')}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#70B32D]" />
                      {entry.hoursWorked}h
                    </span>
                    <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-700 px-2 py-0.5 rounded font-medium">
                      {entry.stage}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {entry.supervisorStatus === 'approved' && (
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-[#528521] border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#70B32D]" />
                      Aprovado pelo Orientador
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
                    onClick={() => handleOpenEdit(entry)}
                    className="p-1.5 text-slate-400 hover:text-[#002B5C] hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar Registro"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Seções do Diário */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                  <p className="font-bold text-[#002B5C] uppercase text-[10px] tracking-wide">
                    1. Objetivos da Sessão:
                  </p>
                  <p className="text-slate-700 leading-relaxed">{entry.objectives}</p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                  <p className="font-bold text-[#002B5C] uppercase text-[10px] tracking-wide">
                    2. Metodologia / Procedimentos:
                  </p>
                  <p className="text-slate-700 leading-relaxed">{entry.methodology}</p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                  <p className="font-bold text-[#002B5C] uppercase text-[10px] tracking-wide">
                    3. Atividades Realizadas:
                  </p>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-line">{entry.activities}</p>
                </div>

                <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200 space-y-1">
                  <p className="font-bold text-[#528521] uppercase text-[10px] tracking-wide">
                    4. Resultados Obtidos:
                  </p>
                  <p className="text-slate-800 leading-relaxed">{entry.results}</p>
                </div>

                {entry.difficulties && (
                  <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-200 space-y-1">
                    <p className="font-bold text-amber-800 uppercase text-[10px] tracking-wide">
                      5. Dificuldades Encontradas:
                    </p>
                    <p className="text-slate-700 leading-relaxed">{entry.difficulties}</p>
                  </div>
                )}

                {entry.nextSteps && (
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                    <p className="font-bold text-slate-500 uppercase text-[10px] tracking-wide">
                      6. Próximos Passos:
                    </p>
                    <p className="text-slate-700 leading-relaxed">{entry.nextSteps}</p>
                  </div>
                )}

              </div>

              {/* Parecer do Orientador */}
              {entry.supervisorComment && (
                <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-xl text-xs space-y-1">
                  <p className="font-bold text-[#002B5C] flex items-center gap-1 text-[10px] uppercase tracking-wide">
                    <Award className="w-3.5 h-3.5 text-[#70B32D]" />
                    Parecer do Professor Orientador:
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

      {/* Modal Novo / Editar Registro */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="bg-[#002B5C] p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#70B32D]" />
                <div>
                  <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                    {editingEntry ? 'Editar Registro de Diário' : 'Novo Registro no Diário de Bordo'}
                  </h3>
                  <p className="text-xs text-blue-200">Padrão Científico Pré-Universitário</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEntry} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                    Data da Sessão *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-[#002B5C] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                    Carga Horária (h) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="12"
                    required
                    value={hoursWorked}
                    onChange={(e) => setHoursWorked(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-[#002B5C] focus:bg-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                    Etapa da Pesquisa *
                  </label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value as ResearchStage)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-[#002B5C] focus:bg-white font-medium"
                  >
                    {RESEARCH_STAGES.map(stg => (
                      <option key={stg} value={stg}>{stg}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                  1. Objetivos da Sessão *
                </label>
                <input
                  type="text"
                  required
                  value={objectives}
                  onChange={(e) => setObjectives(e.target.value)}
                  placeholder="O que você planejou alcançar nesta sessão de pesquisa?"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-[#002B5C] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                  2. Metodologia / Equipamentos Utilizados *
                </label>
                <textarea
                  rows={2}
                  required
                  value={methodology}
                  onChange={(e) => setMethodology(e.target.value)}
                  placeholder="Quais materiais, sensores, fórmulas, artigos ou softwares foram aplicados?"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-[#002B5C] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                  3. Atividades Realizadas no Dia *
                </label>
                <textarea
                  rows={3}
                  required
                  value={activities}
                  onChange={(e) => setActivities(e.target.value)}
                  placeholder="Descreva o passo a passo cronológico das ações executadas..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-[#002B5C] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#528521] uppercase tracking-wide mb-1">
                  4. Resultados Obtidos / Dados Medidos *
                </label>
                <textarea
                  rows={2}
                  required
                  value={results}
                  onChange={(e) => setResults(e.target.value)}
                  placeholder="O que funcionou? Quais valores foram observados ou que conclusões parciais foram tiradas?"
                  className="w-full px-3.5 py-2 bg-emerald-50/50 border border-emerald-300 rounded-xl text-xs text-slate-900 focus:border-[#70B32D] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                    5. Dificuldades Encontradas
                  </label>
                  <textarea
                    rows={2}
                    value={difficulties}
                    onChange={(e) => setDifficulties(e.target.value)}
                    placeholder="Erros, falhas de circuito, falta de materiais..."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-[#002B5C] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                    6. Próximos Passos
                  </label>
                  <textarea
                    rows={2}
                    value={nextSteps}
                    onChange={(e) => setNextSteps(e.target.value)}
                    placeholder="O que precisa ser feito na próxima sessão de pesquisa?"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-[#002B5C] focus:bg-white"
                  />
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
                  disabled={isSaving}
                  className="bg-[#002B5C] hover:bg-[#003B71] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md uppercase tracking-wide"
                >
                  {isSaving ? 'Salvando...' : editingEntry ? 'Salvar Alterações' : 'Salvar no Diário'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
