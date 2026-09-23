import React from 'react';
import { ArrowRight, Sparkles, BookOpen, MapPin } from 'lucide-react';

interface FinalCTAProps {
  onAccessClick: () => void;
  onRulesClick: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onAccessClick, onRulesClick }) => {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#002B5C] via-[#001D3D] to-[#003B71] text-white p-8 sm:p-12 shadow-xl border border-blue-900/40">
      
      {/* Luzes Suaves de Fundo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#70B32D]/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/20 rounded-full blur-[90px] pointer-events-none" />

      {/* Grade de coordenadas científicas no fundo */}
      <div 
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
        
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-300 border border-white/15">
          <Sparkles className="w-3.5 h-3.5 text-[#70B32D]" />
          <span>Iniciação Científica Pré-Universitária • SESI RN</span>
        </div>

        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
          Pronto para Transformar Hipóteses em Conhecimento Real?
        </h2>

        <p className="text-xs sm:text-base text-slate-200 leading-relaxed max-w-2xl mx-auto font-normal">
          Submeta medições, receba o parecer semanal do seu orientador e estruture seu diário de bordo com padrão reconhecido pela FEBRACE e MOSTRATEC.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onAccessClick}
            className="w-full sm:w-auto bg-[#70B32D] hover:bg-[#86D636] text-[#002B5C] px-8 py-3.5 rounded-2xl font-extrabold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <span>Acessar Terminal Institucional</span>
            <ArrowRight className="w-4 h-4 text-[#002B5C]" />
          </button>

          <button
            onClick={onRulesClick}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <BookOpen className="w-4 h-4 text-emerald-300" />
            <span>Consultar Regras do Diário</span>
          </button>
        </div>

        {/* Polos Ativos */}
        <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-300">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#70B32D]" />
            São Gonçalo do Amarante
          </span>
          <span className="text-white/30">•</span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#70B32D]" />
            Macau
          </span>
          <span className="text-white/30">•</span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#70B32D]" />
            Mossoró
          </span>
        </div>

      </div>

    </section>
  );
};
