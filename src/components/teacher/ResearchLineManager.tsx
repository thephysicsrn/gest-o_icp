import React, { useState } from 'react';
import { ResearchGroup, ResearchLine, UserProfile } from '../../types';
import { groupService } from '../../firebase/services/groupService';
import { 
  Layers, 
  Users, 
  Plus, 
  Edit2, 
  Trash2, 
  AlertCircle, 
  CheckCircle, 
  Info,
  X
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

  const handleOpenCreate = () => {
    if (lines.length >= 5) {
      alert('Limite atingido! Um grupo de pesquisa pode ter no máximo 5 linhas de pesquisa.');
      return;
    }
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
    await groupService.saveGroup({
      id: group.id,
      title: groupTitle,
      description: groupDesc,
      unit: group.unit,
      leaderTeacherId: group.leaderTeacherId,
      leaderTeacherName: group.leaderTeacherName,
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
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-[#002B5C] flex items-center justify-center mx-auto">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#002B5C]">Nenhuma Linha de Pesquisa Cadastrada</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Cadastre até 5 linhas temáticas de pesquisa e vincule até 3 alunos para cada linha para começar a orientar.
            </p>
            <button
              onClick={handleOpenCreate}
              className="bg-[#002B5C] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md"
            >
              Criar Primeira Linha
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {lines.map((line) => (
              <div 
                key={line.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-[#002B5C] transition-all p-5 space-y-4 shadow-xs hover:shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#002B5C] text-white font-bold text-xs px-2.5 py-0.5 rounded-md">
                        Linha 0{line.lineNumber}
                      </span>
                      <span className="text-xs text-[#528521] bg-emerald-50 border border-emerald-200 font-bold px-2 py-0.5 rounded">
                        {line.area}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[#002B5C]">
                      {line.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed max-w-4xl">
                      {line.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-start">
                    <button
                      onClick={() => handleOpenEdit(line)}
                      className="p-2 text-slate-400 hover:text-[#002B5C] hover:bg-slate-100 rounded-xl transition-colors"
                      title="Editar Linha e Alunos"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteLine(line)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-xl transition-colors"
                      title="Excluir Linha"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Alunos Vinculados (Máximo 3) */}
                <div className="border-t border-slate-100 pt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#002B5C] font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#70B32D]" />
                      Alunos Matriculados ({line.studentIds.length}/3)
                    </span>
                    {line.studentIds.length < 3 && (
                      <button
                        onClick={() => handleOpenEdit(line)}
                        className="text-xs text-[#70B32D] hover:underline font-bold"
                      >
                        + Vincular Aluno
                      </button>
                    )}
                  </div>

                  {line.studentIds.length === 0 ? (
                    <p className="text-xs text-slate-500 italic bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      Nenhum aluno vinculado a esta linha ainda. Clique em editar para selecionar até 3 alunos.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {line.studentIds.map((studentId) => {
                        const studentObj = unitStudents.find(s => s.uid === studentId);
                        return (
                          <div 
                            key={studentId}
                            className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl flex items-center gap-2.5"
                          >
                            <div className="w-7 h-7 rounded-lg bg-emerald-100 border border-emerald-200 text-[#528521] flex items-center justify-center text-xs font-bold shrink-0">
                              {studentObj ? studentObj.name.charAt(0) : 'A'}
                            </div>
                            <div className="truncate">
                              <p className="text-xs font-bold text-[#002B5C] truncate">
                                {studentObj ? studentObj.name : 'Aluno Cadastrado'}
                              </p>
                              <p className="text-xs text-slate-500 truncate">
                                {studentObj?.areaOrGrade || studentObj?.matricula || 'SESI'}
                              </p>
                            </div>
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

      {/* Modal Adicionar / Editar Linha */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="bg-[#002B5C] p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#70B32D]" />
                <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                  {editingLine ? `Editar Linha 0${editingLine.lineNumber}` : `Nova Linha de Pesquisa (0${lines.length + 1})`}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-white/70 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveLine} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
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
                  placeholder="Ex: Sensores IoT para Monitoramento da Qualidade da Água"
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
                  <span className="text-xs font-bold text-[#528521]">
                    Limite: 3 Alunos
                  </span>
                </div>

                <div className="space-y-1.5 max-h-44 overflow-y-auto border border-slate-200 rounded-xl p-2 bg-slate-50">
                  {unitStudents.length === 0 ? (
                    <p className="text-xs text-slate-500 p-2 text-center">
                      Nenhum aluno cadastrado nesta unidade escolar.
                    </p>
                  ) : (
                    unitStudents.map((student) => {
                      const isSelected = formData.selectedStudentIds.includes(student.uid);
                      return (
                        <div
                          key={student.uid}
                          onClick={() => toggleStudentSelection(student.uid)}
                          className={`p-2 rounded-lg text-xs cursor-pointer flex items-center justify-between border transition-all ${
                            isSelected 
                              ? 'bg-emerald-50 border-emerald-300 text-[#528521] font-semibold' 
                              : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <div className="truncate mr-2">
                            <p className="truncate text-slate-900 font-medium">{student.name}</p>
                            <p className="text-xs text-slate-500 truncate">{student.areaOrGrade || student.matricula}</p>
                          </div>
                          {isSelected ? (
                            <span className="w-5 h-5 rounded-full bg-[#70B32D] text-white flex items-center justify-center shrink-0">
                              <CheckCircle className="w-3.5 h-3.5" />
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
                  className="bg-[#002B5C] hover:bg-[#003B71] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md"
                >
                  {isSaving ? 'Salvando...' : editingLine ? 'Salvar Alterações' : 'Criar Linha'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
