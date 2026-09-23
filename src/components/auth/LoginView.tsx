import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  ArrowRight,
  Menu,
  X
} from 'lucide-react';
import { ScientificHero } from './components/ScientificHero';
import { ResearchArchitecture } from './components/ResearchArchitecture';
import { BenefitsMatrix } from './components/BenefitsMatrix';
import { ScientificJourney } from './components/ScientificJourney';
import { LabShowcaseAndLogin } from './components/LabShowcaseAndLogin';
import { ScientificGazette } from './components/ScientificGazette';
import { FinalCTA } from './components/FinalCTA';

export const LoginView: React.FC = () => {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogin = async (email: string, pass: string) => {
    if (!email) {
      setError('Informe seu e-mail institucional.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await login(email, pass);
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar acesso institucional.');
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-[#70B32D] selection:text-white relative flex flex-col justify-between">
      
      {/* Luzes Ambientais Suaves e Difusas */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[850px] h-[360px] bg-blue-100/40 blur-[140px] pointer-events-none" />
      <div className="absolute top-[800px] right-10 w-[550px] h-[450px] bg-emerald-100/35 blur-[150px] pointer-events-none" />
      <div className="absolute top-[2200px] left-10 w-[600px] h-[500px] bg-blue-50/50 blur-[160px] pointer-events-none" />

      {/* Topo / Barra de Navegação Flutuante com Glassmorphism */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all duration-300 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
          
          {/* Logotipo e Identificação do Programa */}
          <div className="flex items-center gap-3">
            <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-center transition-transform hover:scale-105 duration-200">
              <img 
                src="/sesi-escola-logo.png" 
                alt="Logotipo SESI Escola" 
                className="h-8 sm:h-9 w-auto object-contain"
              />
            </div>
            <div>
              <p className="text-sm font-extrabold text-[#002B5C] leading-none font-sans">
                ICP — Iniciação Científica Pré - Universitária
              </p>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                Escolas SESI São Gonçalo do Amarante • Macau • Mossoró
              </p>
            </div>
          </div>

          {/* Navegação Rápida para Desktop */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold">
            <button
              onClick={() => scrollToSection('arquitetura')}
              className="px-3 py-1.5 rounded-xl text-slate-600 hover:text-[#002B5C] hover:bg-slate-100 transition-all duration-200 cursor-pointer"
            >
              Arquitetura
            </button>
            <button
              onClick={() => scrollToSection('beneficios')}
              className="px-3 py-1.5 rounded-xl text-slate-600 hover:text-[#002B5C] hover:bg-slate-100 transition-all duration-200 cursor-pointer"
            >
              Benefícios
            </button>
            <button
              onClick={() => scrollToSection('jornada')}
              className="px-3 py-1.5 rounded-xl text-slate-600 hover:text-[#002B5C] hover:bg-slate-100 transition-all duration-200 cursor-pointer"
            >
              Jornada
            </button>
            <button
              onClick={() => scrollToSection('noticias')}
              className="px-3 py-1.5 rounded-xl text-slate-600 hover:text-[#002B5C] hover:bg-slate-100 transition-all duration-200 cursor-pointer"
            >
              Notícias
            </button>
            <button
              onClick={() => scrollToSection('curiosidades')}
              className="px-3 py-1.5 rounded-xl text-slate-600 hover:text-[#002B5C] hover:bg-slate-100 transition-all duration-200 cursor-pointer"
            >
              Curiosidades
            </button>
            <button
              onClick={() => scrollToSection('diario-regras')}
              className="px-3 py-1.5 rounded-xl text-slate-600 hover:text-[#002B5C] hover:bg-slate-100 transition-all duration-200 cursor-pointer"
            >
              Regras do Diário
            </button>

            <button
              onClick={() => scrollToSection('acesso')}
              className="bg-[#002B5C] hover:bg-[#003B71] text-white px-4 py-2 rounded-xl font-bold transition-all duration-200 shadow-xs hover:shadow-md active:scale-95 text-[11px] uppercase tracking-wide ml-2 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Entrar</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#70B32D]" />
            </button>
          </nav>

          {/* Botão de Menu Mobile */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => scrollToSection('acesso')}
              className="bg-[#002B5C] text-white px-3 py-1.5 rounded-xl font-bold text-[11px] uppercase tracking-wide"
            >
              Entrar
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100"
              aria-label="Alternar menu de navegação"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Menu Dropdown Mobile */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white/98 px-4 py-3 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
            <button
              onClick={() => scrollToSection('arquitetura')}
              className="w-full text-left py-2 px-3 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Arquitetura da Pesquisa
            </button>
            <button
              onClick={() => scrollToSection('beneficios')}
              className="w-full text-left py-2 px-3 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Benefícios do Ecossistema
            </button>
            <button
              onClick={() => scrollToSection('jornada')}
              className="w-full text-left py-2 px-3 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Jornada em 7 Etapas
            </button>
            <button
              onClick={() => scrollToSection('acesso')}
              className="w-full text-left py-2 px-3 rounded-lg text-xs font-semibold text-[#002B5C] font-bold hover:bg-blue-50"
            >
              Terminal de Acesso
            </button>
            <button
              onClick={() => scrollToSection('noticias')}
              className="w-full text-left py-2 px-3 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Notícias Científicas
            </button>
            <button
              onClick={() => scrollToSection('curiosidades')}
              className="w-full text-left py-2 px-3 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Curiosidades & Frases
            </button>
            <button
              onClick={() => scrollToSection('diario-regras')}
              className="w-full text-left py-2 px-3 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Regras do Diário de Bordo
            </button>
          </div>
        )}
      </header>

      {/* Conteúdo Principal com Fluxo Contínuo e Espaçamento Generoso */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-24 sm:space-y-32 relative z-10 w-full">
        
        {/* 1. HERO COM VISUALIZAÇÃO 3D E IMPACTO VISUAL */}
        <ScientificHero 
          onAccessClick={() => scrollToSection('acesso')}
          onExploreClick={() => scrollToSection('arquitetura')}
        />

        {/* 2. COMO A PLATAFORMA ORGANIZA A PESQUISA */}
        <ResearchArchitecture />

        {/* 3. BENEFÍCIOS PARA ALUNOS, ORIENTADORES E ESCOLAS */}
        <BenefitsMatrix />

        {/* 4. JORNADA VISUAL EM 7 ETAPAS (DA HIPÓTESE À FEIRA) */}
        <ScientificJourney />

        {/* 5. TERMINAL DE ACESSO & VIVÊNCIA REAL NO LABORATÓRIO */}
        <LabShowcaseAndLogin 
          onLogin={handleLogin}
          loading={loading}
          error={error}
        />

        {/* 6. GIRO CIENTÍFICO, CURIOSIDADES, VOZES E REGRAS DO DIÁRIO */}
        <ScientificGazette 
          onLearnMoreClick={() => scrollToSection('acesso')}
        />

        {/* 7. SEÇÃO FINAL COM CTA IMPACTANTE */}
        <FinalCTA 
          onAccessClick={() => scrollToSection('acesso')}
          onRulesClick={() => scrollToSection('diario-regras')}
        />

      </main>

      {/* Rodapé Institucional SESI RN */}
      <footer className="w-full border-t border-slate-200 bg-white py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 shadow-2xs mt-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-3">
            <div className="flex items-center h-8">
              <img 
                src="/sesi-escola-logo.png" 
                alt="Logotipo SESI Escola" 
                className="h-6 w-auto object-contain"
              />
            </div>
            <div>
              <span className="text-[#002B5C] font-bold text-xs block">
                ICP — Iniciação Científica Pré - Universitária
              </span>
              <span className="text-slate-400 text-[11px]">
                SESI Escola • Unidades São Gonçalo do Amarante, Macau e Mossoró
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-xs">
            <span className="text-slate-600 font-medium">
              Desenvolvido por <strong className="text-[#002B5C]">Mateus Zeca</strong> — Todos os direitos reservados
            </span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="flex items-center gap-1.5 text-slate-600 font-semibold bg-slate-100 px-2.5 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#70B32D]"></span>
              Versão 2.7.2 • Ano Letivo 2026
            </span>
          </div>

        </div>
      </footer>

    </div>
  );
};
