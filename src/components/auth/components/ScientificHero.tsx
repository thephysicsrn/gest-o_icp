import React from 'react';
import { 
  ArrowRight, 
  Sparkle, 
  BookOpen, 
  CheckCircle2, 
  MapPin, 
  FlaskConical, 
  Compass, 
  Layers
} from 'lucide-react';
import { ScienceCanvas3D } from './ScienceCanvas3D';

interface ScientificHeroProps {
  onAccessClick: () => void;
  onExploreClick: () => void;
}

export const ScientificHero: React.FC<ScientificHeroProps> = ({
  onAccessClick,
  onExploreClick
}) => {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-sm p-6 sm:p-10 lg:p-12">
      {/* Luzes de ambientação científica com profundidade */}
      <div className="absolute -top-24 -left-20 w-96 h-96 bg-blue-100/50 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 -right-24 w-[420px] h-[420px] bg-emerald-100/45 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-slate-100/70 rounded-full blur-[90px] pointer-events-none" />

      {/* Grade sutil de laboratório no fundo */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#002B5C 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        
        {/* Coluna da Esquerda: Comunicação Editorial de Alto Impacto */}
        <div className="lg:col-span-6 space-y-6 text-left">
          
          {/* Badge de Rigor Acadêmico */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/80 border border-blue-200/70 text-[#002B5C] text-xs font-semibold backdrop-blur-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#70B32D] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#70B32D]"></span>
            </span>
            <span className="tracking-wide">ICP • Iniciação Científica Pré-Universitária</span>
            <span className="text-slate-300">|</span>
            <span className="text-[#528521] font-bold">SESI RN 2026</span>
          </div>

          {/* Título de Grande Força */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#002B5C] tracking-tight leading-[1.08] font-sans">
              A Pesquisa Escolar Conduzida com{' '}
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#002B5C] via-[#005696] to-[#70B32D]">
                Rigor, Dados
              </span>{' '}
              e Método Científico<span className="text-[#70B32D]">.</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              Conecte estudantes pesquisadores a orientadores mestres e doutores. Registre hipóteses, 
              acompanhe medições em laboratório no padrão oficial <strong className="text-[#002B5C] font-semibold">FEBRACE & MOSTRATEC</strong> e construa diários de bordo com validação contínua.
            </p>
          </div>

          {/* Chamadas de Ação (CTAs) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
            <button
              onClick={onAccessClick}
              className="bg-[#002B5C] hover:bg-[#003B71] text-white px-7 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2.5 active:scale-95 group"
            >
              <span>Acessar Terminal de Pesquisa</span>
              <ArrowRight className="w-4 h-4 text-[#70B32D] group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onExploreClick}
              className="px-6 py-3.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-[#002B5C] hover:border-[#002B5C]/30 font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 active:scale-95"
            >
              <Compass className="w-4 h-4 text-slate-500" />
              <span>Ver Arquitetura da Pesquisa</span>
            </button>
          </div>

          {/* Pílulas de Validação Científica */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-600 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#70B32D]" />
              Diário de Bordo Oficial
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#70B32D]" />
              Mentoria Semanal 1:1
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#70B32D]" />
              Exportação em PDF Homologada
            </span>
          </div>

        </div>

        {/* Coluna da Direita: Cenário 3D Interativo Integrado ao Card Científico */}
        <div className="lg:col-span-6 relative flex flex-col items-center justify-center">
          
          {/* Card com Efeito Glassmorphism & Visualização 3D de Fundo */}
          <div className="relative w-full max-w-[500px] bg-slate-50/70 border border-slate-200/90 rounded-3xl p-4 sm:p-6 backdrop-blur-md shadow-lg overflow-hidden group">
            
            {/* Header do Módulo Científico */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/70 relative z-20">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#70B32D]"></div>
                <span className="ml-2 text-[11px] font-bold text-[#002B5C] font-mono tracking-tight">
                  LAB-3D // MODELO DE CONEXÕES CIENTÍFICAS
                </span>
              </div>
              <span className="text-[10px] font-bold text-[#528521] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                TEMPO REAL
              </span>
            </div>

            {/* Visualização 3D Central */}
            <div className="relative z-10 my-2">
              <ScienceCanvas3D className="h-[280px] sm:h-[320px]" />
            </div>

            {/* Elemento Sobreposto com a Jovem Cientista SESI e Telemetria */}
            <div className="relative z-20 bg-white/95 border border-slate-200 rounded-2xl p-3.5 shadow-sm backdrop-blur-sm flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-slate-200 bg-white shrink-0">
                  <img 
                    src="/cientista-animada.gif" 
                    alt="Cientista SESI" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#70B32D] ring-2 ring-white"></div>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#002B5C]">
                    Vivência Científica SESI RN
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Ensaios, hipóteses e bancada experimental
                  </p>
                </div>
              </div>

              <div className="text-right border-l border-slate-100 pl-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Padrão</span>
                <span className="text-xs font-extrabold text-[#70B32D]">FEBRACE</span>
              </div>
            </div>

            {/* Badges Flutuantes Decorativos */}
            <div className="absolute top-16 left-4 z-20 bg-white/90 border border-slate-200 shadow-sm rounded-xl px-2.5 py-1 text-[10px] font-bold text-[#002B5C] flex items-center gap-1.5 backdrop-blur-xs">
              <BookOpen className="w-3.5 h-3.5 text-[#70B32D]" />
              <span>Diário de Bordo 2026</span>
            </div>

            <div className="absolute bottom-20 right-4 z-20 bg-white/90 border border-slate-200 shadow-sm rounded-xl px-2.5 py-1 text-[10px] font-bold text-[#528521] flex items-center gap-1.5 backdrop-blur-xs">
              <FlaskConical className="w-3.5 h-3.5 text-[#005696]" />
              <span>Dados & Ensaios</span>
            </div>

          </div>

        </div>

      </div>

      {/* Faixa Factual de Polos e Indicadores Científicos do SESI RN */}
      <div className="mt-8 pt-6 border-t border-slate-200/80 grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
        
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-[#70B32D]" />
            <span>3 Polos Potiguares</span>
          </div>
          <p className="text-xs font-bold text-[#002B5C]">
            São Gonçalo • Macau • Mossoró
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-[#005696]" />
            <span>Estrutura de Pesquisa</span>
          </div>
          <p className="text-xs font-bold text-[#002B5C]">
            Até 5 Linhas de Investigação por Grupo
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5 text-[#70B32D]" />
            <span>Metodologia Rigorosa</span>
          </div>
          <p className="text-xs font-bold text-[#002B5C]">
            6 Campos Formais no Diário de Bordo
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
            <Sparkle className="w-3.5 h-3.5 text-amber-500" />
            <span>Homologação</span>
          </div>
          <p className="text-xs font-bold text-[#002B5C]">
            Parecer Semanal & Exportação em PDF
          </p>
        </div>

      </div>

    </section>
  );
};
