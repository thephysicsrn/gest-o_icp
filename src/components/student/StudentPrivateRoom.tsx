import React, { useState, useEffect } from 'react';
import { 
  UserProfile, 
  ResearchGroup, 
  ResearchLine, 
  LineResource 
} from '../../types';
import { resourceService } from '../../firebase/services/resourceService';
import { 
  FolderLock, 
  Lock, 
  Link as LinkIcon, 
  FileText, 
  Download, 
  ExternalLink, 
  ShieldCheck
} from 'lucide-react';

interface Props {
  student: UserProfile;
  group: ResearchGroup | null;
  line: ResearchLine | null;
}

export const StudentPrivateRoom: React.FC<Props> = ({ student, group, line }) => {
  const [resources, setResources] = useState<LineResource[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadResources = async () => {
      if (!line) return;
      setIsLoading(true);
      try {
        const data = await resourceService.getResourcesByLine(line.id);
        setResources(data);
      } finally {
        setIsLoading(false);
      }
    };

    loadResources();
  }, [line]);

  if (!line) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center space-y-3">
        <FolderLock className="w-10 h-10 text-slate-400 mx-auto" />
        <h3 className="text-sm font-bold text-slate-700">Você ainda não está vinculado a uma linha</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Solicite ao seu Professor Líder ({group?.leaderTeacherName || 'Orientador'}) a sua alocação em uma das linhas de pesquisa da sua unidade escolar.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Banner Principal em Azul Escuro SESI */}
      <div className="bg-[#002B5C] rounded-2xl p-5 sm:p-6 text-white shadow-lg space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#70B32D]/20 blur-[80px] pointer-events-none" />

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2 text-xs">
            <span className="p-1 bg-white/10 rounded text-[#70B32D]">
              <Lock className="w-3.5 h-3.5" />
            </span>
            <span className="text-blue-100 font-bold uppercase tracking-wider">
              Sala Virtual Privada • Linha #{line.lineNumber}
            </span>
          </div>
          <span className="bg-[#70B32D] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs uppercase tracking-wide">
            Acesso Exclusivo
          </span>
        </div>

        <div className="relative z-10">
          <h2 className="text-xl font-bold text-white tracking-tight">{line.title}</h2>
          <p className="text-xs text-blue-100 mt-1 max-w-3xl leading-relaxed">
            {line.description}
          </p>
        </div>

        <div className="border-t border-white/20 pt-3 flex flex-wrap items-center justify-between gap-2 text-xs relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-blue-200">Orientador:</span>
            <span className="text-white font-semibold">{group?.leaderTeacherName}</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-200 bg-emerald-500/20 border border-emerald-400/30 px-2.5 py-0.5 rounded-full text-[10px]">
            <ShieldCheck className="w-3 h-3 text-[#70B32D]" />
            <span>Materiais visíveis apenas para sua equipe</span>
          </div>
        </div>
      </div>

      {/* Lista de Materiais */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#002B5C] flex items-center gap-2">
            <FolderLock className="w-3.5 h-3.5 text-[#70B32D]" />
            Materiais e Links Disponibilizados pelo Professor ({resources.length})
          </h3>
        </div>

        {resources.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center space-y-3">
            <FolderLock className="w-10 h-10 text-slate-400 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">Nenhum Material Compartilhado Ainda</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Seu orientador postará arquivos, links de modelos e referências bibliográficas aqui em breve.
            </p>
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
                      {res.type === 'link' ? 'Link Externo' : 'Documento / Arquivo'}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(res.createdAt).toLocaleDateString('pt-BR')}
                    </span>
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
                  <span className="text-xs text-slate-500 truncate">
                    Por: {res.uploadedByName.split(' ')[0]}
                  </span>

                  <a
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#002B5C] hover:bg-[#003B71] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs uppercase tracking-wide"
                  >
                    {res.type === 'link' ? (
                      <>
                        <span>Acessar Link</span>
                        <ExternalLink className="w-3 h-3 text-[#70B32D]" />
                      </>
                    ) : (
                      <>
                        <span>Baixar Arquivo</span>
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

    </div>
  );
};
