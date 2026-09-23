import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  ArrowRight, 
  AlertCircle, 
  FlaskConical
} from 'lucide-react';

interface LabShowcaseAndLoginProps {
  onLogin: (email: string, pass: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const LabShowcaseAndLogin: React.FC<LabShowcaseAndLoginProps> = ({
  onLogin,
  loading,
  error
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<0 | 1>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <section id="acesso" className="pt-2 scroll-mt-24 space-y-6">
      
      {/* Cabeçalho da Seção */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <span className="text-xs font-bold text-[#70B32D] uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            Portal Acadêmico Homologado
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#002B5C] mt-0.5">
            Terminal de Acesso Institucional
          </h2>
        </div>
        <p className="text-xs text-slate-500 font-medium">
          Acesso exclusivo para bolsistas, orientadores e coordenação SESI RN
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* LADO ESQUERDO: Showcase Fotográfico Real dos Alunos no Laboratório */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-sm flex flex-col justify-between space-y-5">
          
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#70B32D] uppercase tracking-wider flex items-center gap-1.5">
                <FlaskConical className="w-4 h-4" />
                Vivência Científica nas Escolas SESI
              </span>
              <span className="text-[11px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded">
                Ano Letivo 2026
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Estudantes desenvolvendo pesquisas aplicadas com rigor metodológico, registros diários e orientação acadêmica.
            </p>
          </div>

          {/* Imagem Principal em Destaque */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 aspect-[16/10] bg-slate-100 group shadow-inner">
            <img 
              src={selectedPhotoIndex === 0 ? '/alunos-laboratorio-1.jpg' : '/alunos-laboratorio-2.jpg'}
              alt="Alunos no laboratório do SESI"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* Overlay com Informações Científicas */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-5 sm:p-6 text-white">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="bg-[#70B32D] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide shadow-xs">
                  {selectedPhotoIndex === 0 ? 'Prática Laboratorial' : 'Registro Metodológico'}
                </span>
                <span className="text-xs text-slate-200 font-medium">Bancada Experimental</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                {selectedPhotoIndex === 0 ? 'Bancada Experimental e Ensaio Químico/Físico' : 'Futuras Cientistas e Diário de Bordo'}
              </h3>
              <p className="text-xs text-slate-200 mt-1 line-clamp-1">
                {selectedPhotoIndex === 0 ? 'Alunos do SESI executando coleta de dados e testagem de hipóteses.' : 'Anotação rigorosa de procedimentos no padrão oficial FEBRACE.'}
              </p>
            </div>
          </div>

          {/* Miniaturas Seletoras */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={() => setSelectedPhotoIndex(0)}
              className={`text-left p-3 rounded-2xl border transition-all duration-200 flex items-center gap-3 ${
                selectedPhotoIndex === 0
                  ? 'border-[#002B5C] bg-blue-50/70 shadow-xs ring-2 ring-[#002B5C]'
                  : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-600'
              }`}
            >
              <img 
                src="/alunos-laboratorio-1.jpg" 
                alt="Prática Laboratorial" 
                className="w-12 h-10 object-cover rounded-lg shrink-0 border border-slate-200" 
              />
              <div className="truncate">
                <p className="text-xs font-bold text-[#002B5C] truncate">Prática em Bancada</p>
                <p className="text-[10px] text-slate-500 truncate">Ensaios e Testes</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedPhotoIndex(1)}
              className={`text-left p-3 rounded-2xl border transition-all duration-200 flex items-center gap-3 ${
                selectedPhotoIndex === 1
                  ? 'border-[#002B5C] bg-blue-50/70 shadow-xs ring-2 ring-[#002B5C]'
                  : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-600'
              }`}
            >
              <img 
                src="/alunos-laboratorio-2.jpg" 
                alt="Diário de Bordo" 
                className="w-12 h-10 object-cover rounded-lg shrink-0 border border-slate-200" 
              />
              <div className="truncate">
                <p className="text-xs font-bold text-[#002B5C] truncate">Registro Metodológico</p>
                <p className="text-[10px] text-slate-500 truncate">Diário de Bordo</p>
              </div>
            </button>
          </div>

        </div>

        {/* LADO DIREITO: Formulário de Autenticação Institucional */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-7 flex flex-col justify-between space-y-6">
          
          <div>
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#002B5C]">
                  Acesso ao Sistema
                </h3>
                <p className="text-xs text-slate-500">
                  Informe suas credenciais SESI RN
                </p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#002B5C] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-[#70B32D]" />
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Formulário de Acesso */}
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-[#002B5C] mb-1.5">
                  E-mail Institucional
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="usuario@sesi.org.br"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#002B5C] focus:bg-white transition-all shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002B5C] mb-1.5">
                  Senha de Acesso
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#002B5C] focus:bg-white transition-all shadow-2xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#002B5C] hover:bg-[#003B71] text-white py-3 rounded-xl font-bold text-xs shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed mt-2"
              >
                <span>{loading ? 'Validando Acesso...' : 'Entrar no Sistema'}</span>
                <ArrowRight className="w-4 h-4 text-[#70B32D]" />
              </button>
            </form>
          </div>

          {/* Informações de Segurança e Perfis */}
          <div className="border-t border-slate-100 pt-4 space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-[11px]">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#70B32D]" />
                Autenticação criptografada
              </span>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                Ano 2026
              </span>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>Perfis: Aluno Bolsista • Orientador • Coordenação</span>
              <span className="text-[#002B5C] font-semibold">SESI RN</span>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};
