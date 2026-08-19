import React, { useState, useEffect } from 'react';
import { 
  ResearchGroup, 
  ResearchLine, 
  LineResource, 
  ResourceType,
  UserProfile 
} from '../../types';
import { resourceService } from '../../firebase/services/resourceService';
import { 
  Lock, 
  Plus, 
  Link as LinkIcon, 
  FileText, 
  Download, 
  ExternalLink, 
  Trash2, 
  AlertCircle, 
  X,
  Users,
  FolderLock
} from 'lucide-react';

interface Props {
  group: ResearchGroup;
  lines: ResearchLine[];
  unitStudents: UserProfile[];
  teacher: UserProfile;
}

export const PrivateRoomManager: React.FC<Props> = ({ 
  group, 
  lines, 
  unitStudents, 
  teacher 
}) => {
  const [selectedLineId, setSelectedLineId] = useState<string>(lines[0]?.id || '');
  const [resources, setResources] = useState<LineResource[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estado do Formulário
  const [resType, setResType] = useState<ResourceType>('link');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const selectedLine = lines.find(l => l.id === selectedLineId) || lines[0];

  const loadResources = async () => {
    if (!selectedLineId) return;
    const data = await resourceService.getResourcesByLine(selectedLineId);
    setResources(data);
  };

  useEffect(() => {
    if (lines.length > 0 && !selectedLineId) {
      setSelectedLineId(lines[0].id);
    }
  }, [lines]);

  useEffect(() => {
    if (selectedLineId) {
      loadResources();
    }
  }, [selectedLineId]);

  const handleOpenCreate = () => {
    if (!selectedLine) {
      alert('Nenhuma linha de pesquisa selecionada.');
      return;
    }
    setResType('link');
    setTitle('');
    setUrl('');
    setFileName('');
    setFileSize('');
    setDescription('');
    setError(null);
    setIsModalOpen(true);
  };

  const handleFileUploadSim = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);
      setTitle(file.name.replace(/\.[^/.]+$/, ""));
      setUrl(URL.createObjectURL(file));
    }
  };

  const handleSaveResource = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title || (!url && resType === 'link')) {
      setError('Informe o título e o link/arquivo do material.');
      return;
    }

    try {
      await resourceService.createResource({
        groupId: group.id,
        lineId: selectedLine.id,
        lineTitle: `Linha ${selectedLine.lineNumber}: ${selectedLine.title}`,
        type: resType,
        title,
        url: url || '#',
        fileName: resType === 'file' ? fileName || 'Documento.pdf' : undefined,
        fileSize: resType === 'file' ? fileSize || '1.2 MB' : undefined,
        fileType: resType === 'file' ? 'application/pdf' : undefined,
        description,
        uploadedBy: teacher.uid,
        uploadedByName: teacher.name,
      });

      await loadResources();
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Erro ao adicionar material.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Deseja remover este material da sala particular da linha?')) {
      await resourceService.deleteResource(id);
      await loadResources();
    }
  };

  const lineStudents = selectedLine 
    ? unitStudents.filter(s => selectedLine.studentIds.includes(s.uid))
    : [];

  return (
    <div className="space-y-6">
      
      {/* Cabeçalho e Seletor de Linha */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <FolderLock className="w-4 h-4 text-[#002B5C]" />
            <h2 className="text-sm font-bold text-[#002B5C] uppercase tracking-wider">
              Sala Particular da Linha de Pesquisa
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Ambiente privado de compartilhamento de artigos, bases de dados e arquivos com isolamento de acesso
          </p>
        </div>

        {lines.length > 0 && (
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={selectedLineId}
              onChange={(e) => setSelectedLineId(e.target.value)}
              className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs text-slate-800 focus:border-[#002B5C] focus:outline-none font-semibold"
            >
              {lines.map(l => (
                <option key={l.id} value={l.id}>
                  Linha {l.lineNumber}: {l.title.slice(0, 30)}...
                </option>
              ))}
            </select>

            <button
              onClick={handleOpenCreate}
              className="bg-[#002B5C] hover:bg-[#003B71] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shrink-0 uppercase tracking-wide"
            >
              <Plus className="w-3.5 h-3.5 text-[#70B32D]" />
              <span>Compartilhar Material</span>
            </button>
          </div>
        )}
      </div>

      {/* Banner de Isolamento de Acesso */}
      {selectedLine && (
        <div className="bg-[#002B5C] rounded-2xl p-5 sm:p-6 text-white shadow-lg space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#70B32D]/20 blur-[80px] pointer-events-none" />

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2 text-xs">
              <span className="p-1 bg-white/10 rounded text-[#70B32D]">
                <Lock className="w-3.5 h-3.5" />
              </span>
              <span className="text-blue-100 font-bold uppercase tracking-wider">
                Isolamento de Acesso Ativo • Linha #{selectedLine.lineNumber}
              </span>
            </div>
            <span className="bg-[#70B32D] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs uppercase tracking-wide">
              Sala Privada
            </span>
          </div>

          <div className="relative z-10">
            <h3 className="text-base font-bold text-white tracking-tight">{selectedLine.title}</h3>
            <p className="text-xs text-blue-100 mt-1 max-w-2xl leading-relaxed">
              Apenas você (Orientador) e os <strong>{lineStudents.length} alunos matriculados</strong> nesta linha podem visualizar e baixar os materiais desta sala.
            </p>
          </div>

          <div className="border-t border-white/20 pt-3 flex flex-wrap items-center gap-2 text-xs relative z-10">
            <span className="text-blue-200 font-semibold flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-[#70B32D]" />
              Acesso Autorizado:
            </span>
            <span className="bg-white/10 px-2 py-0.5 rounded-lg text-white text-xs font-semibold">
              {teacher.name} (Orientador)
            </span>
            {lineStudents.map(st => (
              <span key={st.uid} className="bg-emerald-500/20 border border-emerald-400/30 px-2 py-0.5 rounded-lg text-emerald-200 text-xs font-semibold">
                {st.name} (Aluno)
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Grade de Materiais */}
      <div className="space-y-4">
        {resources.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center space-y-3">
            <FolderLock className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">Nenhum Material Compartilhado</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Disponibilize links de artigos em PDF, bases de dados e códigos exclusivos para os alunos desta linha.
            </p>
            <button
              onClick={handleOpenCreate}
              className="bg-[#002B5C] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md uppercase tracking-wide"
            >
              Adicionar Primeiro Material
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map((res) => (
              <div 
                key={res.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-[#002B5C] transition-all p-5 flex flex-col justify-between space-y-3 shadow-xs hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                      res.type === 'link' ? 'bg-blue-50 text-[#002B5C] border border-blue-200' : 'bg-emerald-50 text-[#528521] border border-emerald-200'
                    }`}>
                      {res.type === 'link' ? <LinkIcon className="w-3 h-3 text-[#002B5C]" /> : <FileText className="w-3 h-3 text-[#70B32D]" />}
                      {res.type === 'link' ? 'Link Externo' : 'Arquivo / Documento'}
                    </span>

                    <button
                      onClick={() => handleDelete(res.id)}
                      className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                      title="Excluir Material"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="text-sm font-bold text-[#002B5C] leading-snug">
                    {res.title}
                  </h4>

                  {res.description && (
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed line-clamp-2">
                      {res.description}
                    </p>
                  )}

                  {res.fileName && (
                    <div className="mt-2 bg-slate-50 p-2 rounded-lg border border-slate-200 flex items-center justify-between text-xs text-slate-700">
                      <span className="truncate mr-2">{res.fileName}</span>
                      <span className="text-slate-500 shrink-0 font-semibold">{res.fileSize}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs">
                  <span className="text-xs text-slate-500 font-medium">
                    {new Date(res.createdAt).toLocaleDateString('pt-BR')}
                  </span>

                  <a
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#002B5C] hover:bg-[#003B71] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs uppercase tracking-wide"
                  >
                    {res.type === 'link' ? (
                      <>
                        <span>Acessar</span>
                        <ExternalLink className="w-3 h-3 text-[#70B32D]" />
                      </>
                    ) : (
                      <>
                        <span>Baixar</span>
                        <Download className="w-3 h-3 text-[#70B32D]" />
                      </>
                    )}
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Adicionar Material */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#002B5C] p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <FolderLock className="w-4 h-4 text-[#70B32D]" />
                <h3 className="font-bold text-sm text-white uppercase tracking-wider">Compartilhar na Sala Privada</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveResource} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Tipo de Material */}
              <div>
                <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1.5">
                  Tipo de Material
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setResType('link')}
                    className={`py-2 rounded-xl font-bold border flex items-center justify-center gap-1.5 transition-all ${
                      resType === 'link' ? 'bg-[#002B5C] text-white border-[#002B5C] shadow-sm' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <LinkIcon className={`w-3.5 h-3.5 ${resType === 'link' ? 'text-[#70B32D]' : 'text-slate-400'}`} />
                    <span>Link Web / Documentos</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setResType('file')}
                    className={`py-2 rounded-xl font-bold border flex items-center justify-center gap-1.5 transition-all ${
                      resType === 'file' ? 'bg-[#002B5C] text-white border-[#002B5C] shadow-sm' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <FileText className={`w-3.5 h-3.5 ${resType === 'file' ? 'text-[#70B32D]' : 'text-slate-400'}`} />
                    <span>Enviar Arquivo</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                  Título do Material *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Artigo de Referência sobre Sensores Ambientais"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-[#002B5C] focus:bg-white focus:outline-none"
                />
              </div>

              {resType === 'link' ? (
                <div>
                  <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                    Endereço Web / Link *
                  </label>
                  <input
                    type="url"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://scielo.br/... ou link do documento"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-[#002B5C] focus:bg-white focus:outline-none"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                    Selecionar Arquivo do Computador
                  </label>
                  <input
                    type="file"
                    onChange={handleFileUploadSim}
                    className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:bg-blue-50 file:text-[#002B5C] file:font-semibold"
                  />
                  {fileName && (
                    <p className="text-xs text-[#528521] font-semibold">
                      ✓ {fileName} ({fileSize})
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                  Descrição / Orientações (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Orientações sobre como utilizar este documento na pesquisa..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-[#002B5C] focus:bg-white focus:outline-none"
                />
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
                  Publicar na Sala
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
