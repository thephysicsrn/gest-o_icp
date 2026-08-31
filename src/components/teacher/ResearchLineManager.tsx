import React, { useState } from 'react';
import { ResearchGroup, ResearchLine, UserProfile } from '../../types';
import { groupService } from '../../firebase/services/groupService';
import { StudentRegisterModal } from './StudentRegisterModal';
import { 
  Layers, 
  Users, 
  Plus, 
  Edit2, 
  Trash2, 
  AlertCircle, 
  CheckCircle, 
  Info,
  X,
  UserPlus
} from 'lucide-react';

interface Props {
  group: ResearchGroup;
  lines: ResearchLine[];
  unitStudents: UserProfile[];
  onRefresh: () => Promise<void>;
}

export const ResearchLineManager: React.FC<Props> = ({
  group,
  lines,
  unitStudents,
  onRefresh,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingLine, setEditingLine] = useState<ResearchLine | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    area: '',
    description: '',
    selectedStudentIds: [] as string[],
  });
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Edição do Grupo
  const [isEditingGroup, setIsEditingGroup] = useState(false);
  const [groupTitle, setGroupTitle] = useState(group.title);
  const [groupDesc, setGroupDesc] = useState(group.description);

  const [allSystemLines, setAllSystemLines] = useState<ResearchLine[]>([]);
  const [allGroups, setAllGroups] = useState<ResearchGroup[]>([]);

  const loadAllSystemLines = async () => {
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

  const handleOpenCreate = () => {
    if (lines.length >= 5) {
      alert('Limite atingido! Um grupo de pesquisa pode ter no máximo 5 linhas de pesquisa.');
      return;
    }
    loadAllSystemLines();
    setEditingLine(null);
    setFormData({
      title: '',
      area: '',
      description: '',
      selectedStudentIds: [],
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (line: ResearchLine) => {
    loadAllSystemLines();
    setEditingLine(line);
    setFormData({
      title: line.title,
      area: line.area,
      description: line.description,
      selectedStudentIds: [...line.studentIds],
    });
    setError(null);
    setIsModalOpen(true);
  };

  const toggleStudentSelection = (studentId: string) => {
    // Verifica se o aluno já pertence a outra linha de pesquisa (deste grupo ou de outro professor)
    const assignedLine = allSystemLines.find(
      l => l.studentIds.includes(studentId) && l.id !== editingLine?.id
    );

    if (assignedLine) {
      const assignedGroup = allGroups.find(g => g.id === assignedLine.groupId);
      const orientadorText = assignedGroup ? ` do orientador(a) ${assignedGroup.leaderTeacherName}` : '';
      setError(`Este(a) aluno(a) já está matriculado(a) na linha "${assignedLine.title}"${orientadorText}. Um aluno não pode estar em mais de uma linha ao mesmo tempo.`);
      return;
    }

    const isSelected = formData.selectedStudentIds.includes(studentId);
    if (isSelected) {
      setFormData({
        ...formData,
        selectedStudentIds: formData.selectedStudentIds.filter(id => id !== studentId),
      });
    } else {
      if (formData.selectedStudentIds.length >= 3) {
        setError('Limite atingido! Cada linha de pesquisa pode ter no máximo 3 alunos.');
        return;
      }
      setError(null);
      setFormData({
        ...formData,
        selectedStudentIds: [...formData.selectedStudentIds, studentId],
      });
    }
  };

  const handleSaveLine = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title || !formData.area) {
      setError('Título e Área Temática são obrigatórios.');
      return;
    }

    if (formData.selectedStudentIds.length > 3) {
      setError('Máximo de 3 alunos permitidos por linha.');
      return;
    }

    setIsSaving(true);
    try {
      const studentNames = formData.selectedStudentIds.map(id => {
        const s = unitStudents.find(st => st.uid === id);
        return s ? s.name : 'Aluno';
      });

      if (editingLine) {
        await groupService.updateLine(editingLine.id, {
          title: formData.title,
          area: formData.area,
          description: formData.description,
          studentIds: formData.selectedStudentIds,
          studentNames,
        });
      } else {
        await groupService.createLine({
          groupId: group.id,
          lineNumber: lines.length + 1,
          title: formData.title,
          area: formData.area,
          description: formData.description,
          studentIds: formData.selectedStudentIds,
          studentNames,
        });
      }

      await onRefresh();
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar linha de pesquisa.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteLine = async (line: ResearchLine) => {
    if (confirm(`Deseja realmente remover a "${line.title}"? Todos os vínculos de tarefas e sala desta linha serão desvinculados.`)) {
      await groupService.deleteLine(line.id);
      await onRefresh();
    }
  };

  const handleSaveGroupInfo = async () => {
    await groupService.updateGroup(group.id, {
      title: groupTitle,
      description: groupDesc,
    });
    setIsEditingGroup(false);
    await onRefresh();
  };

  return (
    <div className="space-y-6">
      
      {/* Informações do Grupo */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wide bg-blue-50 text-[#002B5C] border border-blue-200 px-2.5 py-0.5 rounded">
                {group.unit}
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                {lines.length}/5 Linhas Cadastradas
              </span>
            </div>
            {isEditingGroup ? (
              <div className="mt-3 space-y-2">
                <input
                  type="text"
                  value={groupTitle}
                  onChange={(e) => setGroupTitle(e.target.value)}
                  className="w-full text-base font-bold px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-[#002B5C] focus:bg-white focus:outline-none"
                />
                <textarea
                  value={groupDesc}
                  onChange={(e) => setGroupDesc(e.target.value)}
                  rows={2}
                  className="w-full text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-[#002B5C] focus:bg-white focus:outline-none"
                />
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handleSaveGroupInfo}
                    className="bg-[#002B5C] hover:bg-[#003B71] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold"
                  >
                    Salvar Informações
                  </button>
                  <button
                    onClick={() => setIsEditingGroup(false)}
                    className="text-slate-500 hover:text-slate-800 px-3 py-1 rounded-lg text-xs font-medium"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-2">
                <h2 className="text-xl font-bold text-[#002B5C] tracking-tight">{group.title}</h2>
                <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
                  {group.description}
                </p>
              </div>
            )}
          </div>

          {!isEditingGroup && (
            <button
              onClick={() => setIsEditingGroup(true)}
              className="text-xs text-[#002B5C] hover:text-[#70B32D] hover:underline flex items-center gap-1 shrink-0 self-start sm:self-center font-bold"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Editar Informações
            </button>
          )}
        </div>

        {/* Faixa de Regras */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 text-slate-600">
            <Info className="w-4 h-4 text-[#002B5C] shrink-0" />
            <span>
              Regras Institucionais: <strong className="text-[#002B5C]">Máximo 5 Linhas de Pesquisa</strong> • <strong className="text-[#528521]">Máximo 3 Alunos</strong> por linha.
            </span>
          </div>

          <button
            onClick={handleOpenCreate}
            disabled={lines.length >= 5}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
              lines.length >= 5
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                : 'bg-[#70B32D] hover:bg-[#5da523] text-white shadow-sm'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar Linha ({lines.length}/5)</span>
          </button>
        </div>
      </div>

      {/* Lista de Linhas de Pesquisa */}
      <div className="space-y-4">
        {lines.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#002B5C] flex items-center justify-center mx-auto">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Nenhuma linha de pesquisa criada ainda</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Crie as linhas temáticas do seu grupo (máximo 5) e vincule até 3 alunos pesquisadores a cada uma.
            </p>
            <button
              onClick={handleOpenCreate}
              className="bg-[#002B5C] hover:bg-[#003B71] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-[#70B32D]" />
              <span>Criar Linha 01</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lines.map((line) => (
              <div 
                key={line.id} 
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 text-[#002B5C] font-black text-xs flex items-center justify-center shrink-0">
                        0{line.lineNumber}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 leading-snug">
                          {line.title}
                        </h4>
                        <span className="text-[11px] font-semibold text-[#528521] uppercase tracking-wide">
                          {line.area}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleOpenEdit(line)}
                        title="Editar Linha"
                        className="p-1.5 text-slate-400 hover:text-[#002B5C] hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteLine(line)}
                        title="Excluir Linha"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {line.description && (
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {line.description}
                    </p>
                  )}
                </div>

                {/* Alunos Vinculados */}
                <div className="border-t border-slate-100 pt-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#002B5C] uppercase tracking-wide flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#528521]" />
                      Alunos Pesquisadores ({line.studentIds.length}/3)
                    </span>
                  </div>

                  {line.studentIds.length === 0 ? (
                    <p className="text-xs text-slate-400 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                      Nenhum aluno vinculado a esta linha.
                    </p>
                  ) : (
                    <div className="space-y-1.5">
                      {line.studentIds.map((studentId) => {
                        const student = unitStudents.find(s => s.uid === studentId);
                        return (
                          <div 
                            key={studentId}
                            className="bg-slate-50 border border-slate-200/80 p-2 rounded-xl text-xs flex items-center justify-between"
                          >
                            <div className="truncate mr-2">
                              <p className="font-semibold text-slate-900 truncate">
                                {student ? student.name : 'Aluno Cadastrado'}
                              </p>
                              <p className="text-[11px] text-slate-500 truncate font-mono">
                                {student?.matricula || student?.email}
                              </p>
                            </div>
                            <span className="text-[10px] bg-emerald-100 text-[#528521] font-bold px-2 py-0.5 rounded-full shrink-0">
                              Ativo
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Criação / Edição de Linha */}
      {isModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="bg-[#002B5C] px-6 py-4 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#70B32D]" />
                <h3 className="text-sm font-bold tracking-wide uppercase">
                  {editingLine ? `Editar Linha 0${editingLine.lineNumber}` : `Criar Nova Linha 0${lines.length + 1}`}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveLine} className="p-6 space-y-4 overflow-y-auto">
              
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                  Título da Linha de Pesquisa *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Desenvolvimento de Bioplásticos a partir de Resíduos Agroindustriais"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-[#002B5C] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                  Área Temática / Subárea *
                </label>
                <input
                  type="text"
                  required
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  placeholder="Ex: Engenharia Elétrica / Inteligência Artificial / Química Verde"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-[#002B5C] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                  Objetivos e Metodologia da Linha
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva a fundamentação, metodologia geral e metas da pesquisa..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-[#002B5C] focus:bg-white focus:outline-none"
                />
              </div>

              {/* Seleção de Alunos (Máximo 3) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide">
                    Vincular Alunos da Unidade ({formData.selectedStudentIds.length}/3)
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-[#528521]">
                      Limite: 3 Alunos
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsStudentModalOpen(true)}
                      className="text-[11px] font-bold text-[#002B5C] hover:text-[#70B32D] flex items-center gap-1 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2 py-0.5 rounded-lg transition-colors cursor-pointer"
                    >
                      <UserPlus className="w-3 h-3 text-[#70B32D]" />
                      <span>+ Cadastrar Aluno</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto border border-slate-200 rounded-xl p-2 bg-slate-50">
                  {unitStudents.length === 0 ? (
                    <div className="text-center py-4 px-2 space-y-2">
                      <p className="text-xs text-slate-500 font-medium">
                        Nenhum aluno cadastrado nesta unidade escolar ({group.unit}).
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsStudentModalOpen(true)}
                        className="bg-[#002B5C] hover:bg-[#003B71] text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <UserPlus className="w-3.5 h-3.5 text-[#70B32D]" />
                        <span>Cadastrar Aluno Nesta Unidade</span>
                      </button>
                    </div>
                  ) : (
                    unitStudents.map((student) => {
                      const isSelected = formData.selectedStudentIds.includes(student.uid);
                      const assignedOtherLine = allSystemLines.find(
                        l => l.studentIds.includes(student.uid) && l.id !== editingLine?.id
                      );
                      const assignedOtherGroup = assignedOtherLine ? allGroups.find(g => g.id === assignedOtherLine.groupId) : null;

                      return (
                        <div
                          key={student.uid}
                          onClick={() => toggleStudentSelection(student.uid)}
                          className={`p-2.5 rounded-xl text-xs flex items-center justify-between border transition-all ${
                            assignedOtherLine
                              ? 'bg-slate-100/70 border-slate-200 text-slate-400 cursor-not-allowed opacity-80'
                              : isSelected 
                              ? 'bg-emerald-50 border-emerald-300 text-[#528521] font-semibold cursor-pointer' 
                              : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer'
                          }`}
                        >
                          <div className="truncate mr-2">
                            <p className="truncate text-slate-900 font-bold">{student.name}</p>
                            <p className="text-[11px] text-slate-500 truncate">
                              {assignedOtherLine ? (
                                <span className="text-amber-700 font-semibold">
                                  Matriculado: {assignedOtherLine.title} {assignedOtherGroup ? `(${assignedOtherGroup.leaderTeacherName.split(' ')[0]})` : ''}
                                </span>
                              ) : (
                                student.areaOrGrade || student.matricula || 'Disponível para vinculação'
                              )}
                            </p>
                          </div>
                          {isSelected ? (
                            <span className="w-5 h-5 rounded-full bg-[#70B32D] text-white flex items-center justify-center shrink-0">
                              <CheckCircle className="w-3.5 h-3.5" />
                            </span>
                          ) : assignedOtherLine ? (
                            <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-bold shrink-0">
                              Em outra linha
                            </span>
                          ) : (
                            <span className="w-5 h-5 rounded-full border border-slate-300 shrink-0" />
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Rodapé do Modal */}
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
                  className="bg-[#002B5C] hover:bg-[#003B71] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  {isSaving ? 'Salvando...' : editingLine ? 'Salvar Alterações' : 'Criar Linha'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Modal de Cadastro Rápido de Aluno */}
      <StudentRegisterModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        unit={group.unit}
        onStudentCreated={(newStudent) => {
          if (formData.selectedStudentIds.length < 3) {
            setFormData(prev => ({
              ...prev,
              selectedStudentIds: [...prev.selectedStudentIds, newStudent.uid],
            }));
          }
        }}
      />

    </div>
  );
};
