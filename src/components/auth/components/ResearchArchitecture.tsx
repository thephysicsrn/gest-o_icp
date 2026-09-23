import React, { useState } from 'react';
import { 
  Users, 
  Layers, 
  BookOpen, 
  FileCheck2, 
  FileDown, 
  CheckCircle, 
  ShieldCheck
} from 'lucide-react';

export const ResearchArchitecture: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'estrutura' | 'diario' | 'validacao'>('estrutura');

  return (
    <section id="arquitetura" className="space-y-8 scroll-mt-24">
      
      {/* Cabeçalho da Seção com Identidade de Pesquisa */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-bold text-[#70B32D] uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4" />
            Engenharia da Pesquisa Escolar
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#002B5C] tracking-tight mt-1">
            Como a Plataforma Organiza a Iniciação Científica
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md font-medium">
          Uma infraestrutura digital desenvolvida para substituir anotações dispersas por um processo metodológico auditável e homologado.
        </p>
      </div>

      {/* Navegação Interativa entre os Pilares */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200 w-fit">
        <button
          onClick={() => setActiveTab('estrutura')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
            activeTab === 'estrutura'
              ? 'bg-white text-[#002B5C] shadow-sm'
              : 'text-slate-600 hover:text-[#002B5C]'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-[#70B32D]" />
          <span>1. Grupos & Linhas</span>
        </button>

        <button
          onClick={() => setActiveTab('diario')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
            activeTab === 'diario'
              ? 'bg-white text-[#002B5C] shadow-sm'
              : 'text-slate-600 hover:text-[#002B5C]'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-[#005696]" />
          <span>2. Diário de Bordo Oficial</span>
        </button>

        <button
          onClick={() => setActiveTab('validacao')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
            activeTab === 'validacao'
              ? 'bg-white text-[#002B5C] shadow-sm'
              : 'text-slate-600 hover:text-[#002B5C]'
          }`}
        >
          <FileCheck2 className="w-3.5 h-3.5 text-[#70B32D]" />
          <span>3. Pareceres & Homologação</span>
        </button>
      </div>

      {/* Conteúdo Dinâmico com Design de Alta Precisão */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        
        {activeTab === 'estrutura' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4 text-left">
              <span className="text-[11px] font-bold text-[#528521] uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
                Estrutura Hierárquica Acadêmica
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#002B5C]">
                Grupos Temáticos e Linhas de Investigação Específicas
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Cada unidade escolar do SESI RN possui grupos de pesquisa liderados por professores orientadores. 
                Os grupos se ramificam em até <strong className="text-[#002B5C]">5 linhas de investigação</strong> com até <strong className="text-[#002B5C]">3 alunos pesquisadores</strong> por linha, permitindo mentoria atenta e divisão clara de responsabilidades.
              </p>

              <div className="space-y-2.5 pt-2">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-[#002B5C] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold">01</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#002B5C]">Liderança Docente</h4>
                    <p className="text-xs text-slate-600">Professores especialistas conduzem a fundamentação teórica e as diretrizes do laboratório.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-[#528521] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold">02</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#002B5C]">Equipes Enxutas e Focadas</h4>
                    <p className="text-xs text-slate-600">Máximo de 3 estudantes por linha para assegurar protagonismo real a cada integrante.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold">03</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#002B5C]">Registro de Frequência e Encontros</h4>
                    <p className="text-xs text-slate-600">Pautas, atas de reuniões e presenças justificadas arquivadas no sistema.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Diagrama Visual da Estrutura */}
            <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 pb-2 border-b border-slate-200">
                <span>MODELO DE DADOS INSTITUCIONAL</span>
                <span className="text-[#70B32D]">POLOS SESI RN</span>
              </div>

              {/* Nível 1: Grupo */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#002B5C] text-white flex items-center justify-center font-bold text-xs">
                    GP
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#002B5C]">Grupo de Pesquisa Escolar</p>
                    <p className="text-[11px] text-slate-500">Liderado por Professor Orientador</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-blue-50 text-[#002B5C] px-2 py-0.5 rounded">
                  Polo SESI
                </span>
              </div>

              {/* Linhas Conectoras */}
              <div className="flex justify-center -my-2">
                <div className="w-0.5 h-6 bg-slate-300"></div>
              </div>

              {/* Nível 2: Linhas de Pesquisa */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded-xl border border-emerald-200 shadow-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#528521] bg-emerald-50 px-2 py-0.5 rounded">
                      Linha 01
                    </span>
                    <span className="text-[10px] text-slate-400">Até 3 alunos</span>
                  </div>
                  <p className="text-xs font-bold text-[#002B5C]">Energias Renováveis & H2V</p>
                  <p className="text-[10px] text-slate-500">Ensaios de eletrólise solar</p>
                </div>

                <div className="bg-white p-3 rounded-xl border border-blue-200 shadow-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#002B5C] bg-blue-50 px-2 py-0.5 rounded">
                      Linha 02
                    </span>
                    <span className="text-[10px] text-slate-400">Até 3 alunos</span>
                  </div>
                  <p className="text-xs font-bold text-[#002B5C]">Automação e Sensores IoT</p>
                  <p className="text-[10px] text-slate-500">Irrigação inteligente no semiárido</p>
                </div>
              </div>

              {/* Nível 3: Evidências e Produção */}
              <div className="bg-emerald-50/70 border border-emerald-200 p-3 rounded-xl flex items-center justify-between text-xs text-[#528521]">
                <span className="font-bold flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4 text-[#70B32D]" />
                  Diários de Bordo Homologados & Fotos de Bancada
                </span>
                <span className="text-[10px] font-semibold text-slate-500">Padrão FEBRACE</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'diario' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4 text-left">
              <span className="text-[11px] font-bold text-[#005696] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-200 inline-block">
                Padrão Científico Nacional
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#002B5C]">
                Diário de Bordo Digital com 6 Campos Formais
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                O diário de bordo é o documento central de qualquer projeto de iniciação científica. 
                Na plataforma, cada registro conta com campos específicos para manter a consistência metodológica exigida pelas bancas avaliadoras.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold text-[#70B32D] uppercase">Campo 01</span>
                  <p className="text-xs font-bold text-[#002B5C]">Horas de Bancada</p>
                  <p className="text-[11px] text-slate-500">Contabilização do esforço prático investido.</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold text-[#70B32D] uppercase">Campo 02</span>
                  <p className="text-xs font-bold text-[#002B5C]">Etapa da Investigação</p>
                  <p className="text-[11px] text-slate-500">Fase metodológica correspondente.</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold text-[#70B32D] uppercase">Campo 03</span>
                  <p className="text-xs font-bold text-[#002B5C]">Metodologia & Testes</p>
                  <p className="text-[11px] text-slate-500">Parâmetros técnicos e ensaios realizados.</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold text-[#70B32D] uppercase">Campo 04</span>
                  <p className="text-xs font-bold text-[#002B5C]">Resultados & Dificuldades</p>
                  <p className="text-[11px] text-slate-500">Registro honesto de falhas e aprendizados.</p>
                </div>
              </div>
            </div>

            {/* Simulação de um Diário Real */}
            <div className="lg:col-span-6 bg-slate-900 text-white rounded-2xl p-5 sm:p-6 space-y-4 shadow-lg">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#70B32D] animate-ping"></div>
                  <span className="font-mono text-emerald-400 text-[11px]">DIÁRIO_DE_BORDO_REGISTRO #042</span>
                </div>
                <span className="text-slate-400 text-[10px] font-mono">FEV/2026</span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                  <span className="text-slate-400 text-[10px] block uppercase">Objetivo da Sessão:</span>
                  <p className="text-slate-200 mt-0.5">Calibração do sensor fotoquímico e medição da densidade de corrente.</p>
                </div>

                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                  <span className="text-slate-400 text-[10px] block uppercase">Resultados Observados:</span>
                  <p className="text-slate-200 mt-0.5">Variação linear confirmada entre 25°C e 40°C. Estabilidade registrada em 3 réplicas.</p>
                </div>

                <div className="flex items-center justify-between bg-emerald-950/60 border border-emerald-600/40 p-3 rounded-xl text-emerald-300">
                  <span className="flex items-center gap-1.5 text-[11px] font-bold">
                    <CheckCircle className="w-3.5 h-3.5 text-[#70B32D]" />
                    Parecer do Orientador: Homologado
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">4.5h registradas</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'validacao' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4 text-left">
              <span className="text-[11px] font-bold text-[#528521] uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
                Validação Contínua
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#002B5C]">
                Ciclo de Pareceres e Exportação Direta em PDF
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Cada diário submetido pelos alunos passa pela avaliação do professor orientador, que pode aprovar ou solicitar revisões com anotações pontuais. Ao final do ciclo, a plataforma compila todos os dados no modelo oficial de relatório para feiras.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50">
                  <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-[#002B5C]">1. Submissão pelo Aluno</p>
                    <p className="text-[11px] text-slate-500">Registro dos dados com fotos de evidência anexadas.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-[#002B5C]">2. Parecer Técnico do Orientador</p>
                    <p className="text-[11px] text-slate-500">Aprovação ou devolução com comentários metodológicos.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl border border-emerald-200 bg-emerald-50/60">
                  <span className="w-3 h-3 rounded-full bg-[#70B32D]"></span>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-[#002B5C]">3. Exportação Homologada em PDF</p>
                    <p className="text-[11px] text-[#528521]">Geração do documento oficial com cabeçalho institucional SESI.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card com Prévia do PDF Oficial */}
            <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-md flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <FileDown className="w-4 h-4 text-[#002B5C]" />
                  <span className="text-xs font-bold text-[#002B5C]">Relatório Oficial Gerado pelo Sistema</span>
                </div>
                <span className="text-[10px] font-bold text-[#528521] bg-emerald-50 px-2 py-0.5 rounded">
                  PDF / ABNT
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2 text-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>DOCUMENTO HOMOLOGADO</span>
                  <span>ICP-SESI-RN-2026</span>
                </div>
                <h4 className="font-bold text-[#002B5C]">Caderno de Registros e Ensaios Experimentais</h4>
                <p className="text-slate-600 text-[11px]">
                  Contém histórico completo de entradas, horas computadas, fotos de comprovação e pareceres finais assinados digitalmente pelos orientadores.
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                <span className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#70B32D]" />
                  Válido para FEBRACE, MOSTRATEC e feiras regionais
                </span>
              </div>
            </div>
          </div>
        )}

      </div>

    </section>
  );
};
