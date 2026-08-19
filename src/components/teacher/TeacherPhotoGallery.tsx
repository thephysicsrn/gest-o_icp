import React, { useState, useEffect } from 'react';
import { ResearchGroup, ResearchLine, PhotoRecord } from '../../types';
import { photoService } from '../../firebase/services/photoService';
import { 
  Camera, 
  Layers, 
  User, 
  X, 
  ZoomIn
} from 'lucide-react';

interface Props {
  group: ResearchGroup;
  lines: ResearchLine[];
}

export const TeacherPhotoGallery: React.FC<Props> = ({ group, lines }) => {
  const [photos, setPhotos] = useState<PhotoRecord[]>([]);
  const [selectedLineFilter, setSelectedLineFilter] = useState<string>('ALL');
  const [activePhoto, setActivePhoto] = useState<PhotoRecord | null>(null);

  const loadPhotos = async () => {
    const data = await photoService.getPhotosByGroup(group.id);
    setPhotos(data);
  };

  useEffect(() => {
    loadPhotos();
  }, [group.id]);

  const filteredPhotos = photos.filter(
    p => selectedLineFilter === 'ALL' || p.lineId === selectedLineFilter
  );

  return (
    <div className="space-y-6">
      
      {/* Cabeçalho */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-[#002B5C]" />
            <h2 className="text-sm font-bold text-[#002B5C] uppercase tracking-wider">
              Galeria de Evidências Fotográficas
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Acompanhamento visual de montagens de bancada, protótipos, ensaios laboratoriais e reuniões
          </p>
        </div>

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
      </div>

      {/* Grade de Fotos */}
      {filteredPhotos.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center space-y-3">
          <Camera className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">Nenhum Registro Fotográfico</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Quando os alunos pesquisadores registrarem fotos de seus experimentos no painel do aluno, elas serão exibidas aqui.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPhotos.map((photo) => (
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <span className="text-white text-xs font-semibold flex items-center gap-1">
                    <ZoomIn className="w-3.5 h-3.5 text-[#70B32D]" />
                    Ampliar Imagem
                  </span>
                </div>
                <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-sm border border-slate-200 text-slate-800 px-2 py-0.5 rounded-md text-[10px] font-bold shadow-xs">
                  {new Date(photo.date + 'T12:00:00Z').toLocaleDateString('pt-BR')}
                </div>
              </div>

              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-[#002B5C] flex items-center gap-1">
                    <User className="w-3 h-3 text-[#70B32D]" />
                    {photo.studentName}
                  </span>
                  <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-medium text-slate-700">
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

      {/* Modal de Zoom da Foto */}
      {activePhoto && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#002B5C] p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#70B32D]" />
                <div>
                  <h3 className="font-bold text-sm text-white uppercase tracking-wider">Evidência do Experimento</h3>
                  <p className="text-xs text-blue-200">
                    {activePhoto.studentName} • {new Date(activePhoto.date + 'T12:00:00Z').toLocaleDateString('pt-BR')}
                  </p>
                </div>
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
                  <span>Etapa: <strong className="text-[#002B5C]">{activePhoto.stage}</strong></span>
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
