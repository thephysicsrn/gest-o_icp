import React, { useState, useEffect } from 'react';
import { 
  UserProfile, 
  ResearchGroup, 
  ResearchLine, 
  PhotoRecord 
} from '../../types';
import { photoService } from '../../firebase/services/photoService';
import { 
  Camera, 
  Plus, 
  Trash2, 
  ZoomIn, 
  Image as ImageIcon, 
  AlertCircle, 
  X,
  Upload
} from 'lucide-react';

interface Props {
  student: UserProfile;
  group: ResearchGroup | null;
  line: ResearchLine | null;
}

const SAMPLE_SCIENTIFIC_PHOTOS = [
  { label: 'Circuito IoT / Protoboard', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Calibração em Laboratório', url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Reunião de Orientação SESI', url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Coleta de Amostras em Campo', url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1000&q=80' },
];

export const StudentPhotoRecords: React.FC<Props> = ({ student, group, line }) => {
  const [photos, setPhotos] = useState<PhotoRecord[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePhoto, setActivePhoto] = useState<PhotoRecord | null>(null);

  // Estado do Formulário
  const [imageUrl, setImageUrl] = useState(SAMPLE_SCIENTIFIC_PHOTOS[0].url);
  const [caption, setCaption] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [stage, setStage] = useState('Metodologia e Prototipagem');
  const [tagsInput, setTagsInput] = useState('Bancada, Experimento, SESI');
  const [error, setError] = useState<string | null>(null);

  const loadPhotos = async () => {
    const data = await photoService.getPhotosByStudent(student.uid);
    setPhotos(data);
  };

  useEffect(() => {
    loadPhotos();
  }, [student.uid]);

  const handleOpenCreate = () => {
    setImageUrl(SAMPLE_SCIENTIFIC_PHOTOS[0].url);
    setCaption('');
    setDate(new Date().toISOString().split('T')[0]);
    setStage('Metodologia e Prototipagem');
    setTagsInput('Bancada, Experimento, SESI');
    setError(null);
    setIsModalOpen(true);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!imageUrl || !caption) {
      setError('Por favor, informe uma imagem e a legenda explicativa do experimento.');
      return;
    }

    try {
      const tags = tagsInput
        .split(',')
        .map(t => t.trim().replace(/^#/, ''))
        .filter(Boolean);

      await photoService.createPhoto({
        studentId: student.uid,
        studentName: student.name,
        lineId: line ? line.id : 'line-default',
        lineTitle: line ? line.title : 'Linha de Pesquisa',
        groupId: group ? group.id : 'group-default',
        imageUrl,
        caption,
        date,
        stage,
        tags,
      });

      await loadPhotos();
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar registro fotográfico.');
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Deseja excluir este registro fotográfico?')) {
      await photoService.deletePhoto(id);
      await loadPhotos();
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Cabeçalho */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-[#002B5C]" />
            <h2 className="text-sm font-bold text-[#002B5C] uppercase tracking-wider">
              Registros Fotográficos e Evidências Experimentais
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Documentação visual das etapas práticas, circuitos, montagens e ensaios do projeto
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-[#002B5C] hover:bg-[#003B71] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all shrink-0 uppercase tracking-wide"
        >
          <Plus className="w-3.5 h-3.5 text-[#70B32D]" />
          <span>Novo Registro Fotográfico</span>
        </button>
      </div>

      {/* Grade de Fotos */}
      {photos.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center space-y-3">
          <Camera className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">Nenhuma Foto Registrada</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Fotografe sua bancada de testes, circuitos e etapas da pesquisa para enriquecer seu diário de bordo e relatório.
          </p>
          <button
            onClick={handleOpenCreate}
            className="bg-[#002B5C] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md uppercase tracking-wide"
          >
            Adicionar Primeira Foto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {photos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setActivePhoto(photo)}
              className="bg-white rounded-2xl border border-slate-200 hover:border-[#002B5C] transition-all overflow-hidden cursor-pointer group flex flex-col justify-between shadow-xs hover:shadow-md"
            >
              <div className="relative aspect-video overflow-hidden bg-slate-100">
                <img
                  src={photo.imageUrl}
                  alt={photo.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                  <span className="text-white text-xs font-semibold flex items-center gap-1">
                    <ZoomIn className="w-3.5 h-3.5 text-[#70B32D]" />
                    Ampliar
                  </span>
                  <button
                    onClick={(e) => handleDelete(photo.id, e)}
                    className="p-1 text-white/80 hover:text-red-400 rounded-lg hover:bg-white/20 transition-all"
                    title="Excluir Foto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-sm border border-slate-200 text-slate-800 px-2 py-0.5 rounded-md text-[10px] font-bold shadow-xs">
                  {new Date(photo.date + 'T12:00:00Z').toLocaleDateString('pt-BR')}
                </div>
              </div>

              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="bg-blue-50 border border-blue-200 text-[#002B5C] text-[10px] px-2 py-0.5 rounded font-bold">
                    {photo.stage}
                  </span>
                </div>

                <p className="text-xs text-slate-800 font-medium line-clamp-2 leading-relaxed">
                  {photo.caption}
                </p>

                {photo.tags && photo.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {photo.tags.map((tag, idx) => (
                      <span key={idx} className="bg-emerald-50 text-[#528521] border border-emerald-200 text-[10px] px-2 py-0.5 rounded font-semibold">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Nova Foto */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#002B5C] p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#70B32D]" />
                <h3 className="font-bold text-sm text-white uppercase tracking-wider">Novo Registro Fotográfico</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePhoto} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Upload e Prévia da Imagem */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide">
                  Foto do Experimento
                </label>
                
                <div className="aspect-video rounded-xl bg-slate-100 border border-slate-200 overflow-hidden relative flex items-center justify-center">
                  {imageUrl ? (
                    <img src={imageUrl} alt="Prévia" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-12 h-12 text-slate-400" />
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all border border-slate-200">
                    <Upload className="w-3.5 h-3.5 text-[#002B5C]" />
                    <span>Enviar do Computador</span>
                    <input type="file" accept="image/*" onChange={handleImageFileUpload} className="hidden" />
                  </label>
                  <span className="text-[11px] text-slate-500">ou selecione amostra:</span>
                </div>

                {/* Amostras */}
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  {SAMPLE_SCIENTIFIC_PHOTOS.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setImageUrl(sample.url)}
                      className={`p-1.5 text-left rounded-lg text-[10px] border transition-all truncate ${
                        imageUrl === sample.url ? 'border-[#002B5C] bg-blue-50 text-[#002B5C] font-bold' : 'border-slate-200 bg-slate-50 text-slate-600'
                      }`}
                    >
                      {sample.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                  Legenda Explicativa do Experimento *
                </label>
                <textarea
                  rows={2}
                  required
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Ex: Montagem do circuito divisor de tensão na bancada do laboratório..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-[#002B5C] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                    Data do Experimento *
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
                    Etapa da Pesquisa
                  </label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-[#002B5C] focus:bg-white font-medium"
                  >
                    <option value="Metodologia e Prototipagem">Metodologia e Prototipagem</option>
                    <option value="Experimentação e Coleta">Experimentação e Coleta</option>
                    <option value="Análise de Resultados">Análise de Resultados</option>
                    <option value="Reunião de Orientação">Reunião de Orientação</option>
                    <option value="Apresentação em Feira">Apresentação em Feira</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                  Etiquetas / Palavras-chave
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Ex: ESP32, FEBRACE, Circuito, Medição"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-[#002B5C] focus:bg-white"
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
                  Salvar Registro
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Modal Zoom */}
      {activePhoto && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#002B5C] p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#70B32D]" />
                <h3 className="font-bold text-sm text-white uppercase tracking-wider">Visualizador de Evidência</h3>
              </div>
              <button onClick={() => setActivePhoto(null)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="max-h-[55vh] rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200">
                <img
                  src={activePhoto.imageUrl}
                  alt={activePhoto.caption}
                  className="max-h-[55vh] w-auto object-contain"
                />
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <p className="text-xs font-bold text-slate-800 leading-relaxed">
                  Legenda: <span className="font-normal text-slate-700">{activePhoto.caption}</span>
                </p>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 pt-2 border-t border-slate-200">
                  <span>Data: <strong className="text-[#002B5C]">{new Date(activePhoto.date + 'T12:00:00Z').toLocaleDateString('pt-BR')}</strong> • Etapa: <strong className="text-[#002B5C]">{activePhoto.stage}</strong></span>
                  <div className="flex flex-wrap gap-1">
                    {activePhoto.tags.map((tag, idx) => (
                      <span key={idx} className="bg-emerald-50 text-[#528521] border border-emerald-200 text-[10px] px-2 py-0.5 rounded font-bold">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
