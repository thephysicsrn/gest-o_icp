import React, { useState } from 'react';
import { 
  GitBranch, 
  Lightbulb, 
  BookMarked, 
  Wrench, 
  FlaskConical, 
  BarChart3, 
  FileText, 
  Award,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';

interface StageDetail {
  number: string;
  stageName: string;
  icon: any;
  headline: string;
  description: string;
  deliverables: string[];
}

const SCIENTIFIC_STAGES: StageDetail[] = [
  {
    number: '01',
    stageName: 'Planejamento e Hipótese',
    icon: Lightbulb,
    headline: 'A pergunta que move a descoberta',
    description: 'Definição do problema real a ser investigado, identificação de lacunas no conhecimento e formulação de hipóteses falseáveis.',
    deliverables: ['Problema delimitado', 'Hipótese formal', 'Cronograma inicial']
  },
  {
    number: '02',
    stageName: 'Revisão Bibliográfica',
    icon: BookMarked,
    headline: 'O estado da arte na literatura',
    description: 'Pesquisa em bases acadêmicas reconhecidas (SciELO, Periódicos CAPES, Google Acadêmico) para fundamentar teoricamente o trabalho.',
    deliverables: ['Fichamento de artigos', 'Matriz de referências', 'Justificativa científica']
  },
  {
    number: '03',
    stageName: 'Metodologia e Prototipagem',
    icon: Wrench,
    headline: 'Desenho experimental rigoroso',
    description: 'Planejamento detalhado dos ensaios de bancada, escolha de reagentes químicos, vidrarias, circuitos ou softwares a serem empregados.',
    deliverables: ['Protocolo laboratorial', 'Lista de insumos', 'Procedimentos de segurança']
  },
  {
    number: '04',
    stageName: 'Experimentação e Coleta',
    icon: FlaskConical,
    headline: 'Ensaios práticos e dados reais',
    description: 'Execução prática no laboratório do SESI com medições controladas em triplicata, registro no diário de bordo e fotos de evidência.',
    deliverables: ['Tabelas de dados brutos', 'Fotos de bancada', 'Horas registradas']
  },
  {
    number: '05',
    stageName: 'Análise e Discussão',
    icon: BarChart3,
    headline: 'Interpretação e validação estatística',
    description: 'Transformação dos dados em gráficos e confronto dos resultados obtidos com os achados da literatura científica existente.',
    deliverables: ['Gráficos analíticos', 'Discussão teórica', 'Confirmação/refutação']
  },
  {
    number: '06',
    stageName: 'Redação do Relatório Final',
    icon: FileText,
    headline: 'Comunicação científica com padrão formal',
    description: 'Escrita do artigo e diário de bordo completo seguindo as normas ABNT e o modelo oficial adotado pelas mostras de ciências.',
    deliverables: ['Resumo & Abstract', 'Metodologia escrita', 'Exportação em PDF']
  },
  {
    number: '07',
    stageName: 'Preparação para Feiras',
    icon: Award,
    headline: 'Apresentação pública e bancas',
    description: 'Confecção de banner científico, ensaios de oratória para bancas de avaliação e submissão na FEBRACE, MOSTRATEC e feiras regionais.',
    deliverables: ['Pôster acadêmico', 'Arguição simulada', 'Submissão oficial']
  }
];

export const ScientificJourney: React.FC = () => {
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const current = SCIENTIFIC_STAGES[activeStageIndex];
  const IconComp = current.icon;

  return (
    <section id="jornada" className="space-y-8 scroll-mt-24">
      
      {/* Título da Seção */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-bold text-[#70B32D] uppercase tracking-wider flex items-center gap-1.5">
            <GitBranch className="w-4 h-4" />
            Ciclo Metodológico Completo
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#002B5C] tracking-tight mt-1">
            Jornada Visual da Iniciação Científica
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md font-medium">
          As 7 etapas estruturadas da plataforma ICP, da concepção da hipótese à apresentação em grandes bancas.
        </p>
      </div>

      {/* Navegação Sequencial das Etapas em Linha Horizontal no Desktop */}
      <div className="relative">
        
        {/* Linha Conectora de Fundo */}
        <div className="hidden lg:block absolute top-1/2 left-4 right-4 h-0.5 bg-slate-200 -translate-y-1/2 z-0"></div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 relative z-10">
          {SCIENTIFIC_STAGES.map((stage, idx) => {
            const isCurrent = idx === activeStageIndex;
            const isCompleted = idx < activeStageIndex;
            return (
              <button
                key={stage.number}
                onClick={() => setActiveStageIndex(idx)}
                className={`p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between h-24 ${
                  isCurrent
                    ? 'border-[#002B5C] bg-[#002B5C] text-white shadow-md ring-2 ring-blue-100 scale-102'
                    : isCompleted
                    ? 'border-emerald-200 bg-emerald-50/60 text-slate-700 hover:bg-emerald-50'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-[10px] font-mono font-extrabold px-1.5 py-0.5 rounded ${
                    isCurrent 
                      ? 'bg-white/20 text-white' 
                      : isCompleted 
                      ? 'bg-emerald-100 text-[#528521]' 
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {stage.number}
                  </span>
                  {isCompleted && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#70B32D]" />
                  )}
                </div>

                <p className={`text-[11px] font-bold leading-tight line-clamp-2 ${
                  isCurrent ? 'text-white' : 'text-[#002B5C]'
                }`}>
                  {stage.stageName}
                </p>
              </button>
            );
          })}
        </div>

      </div>

      {/* Card em Destaque com o Detalhamento da Etapa Selecionada */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-4 text-left">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#70B32D] bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                ETAPA {current.number} DE 07
              </span>
              <span className="text-xs text-slate-400 font-medium">Ciclo Oficial ICP SESI</span>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-bold text-[#002B5C]">
                {current.stageName}
              </h3>
              <p className="text-xs font-semibold text-[#528521]">
                — {current.headline}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {current.description}
            </p>

            <div className="pt-2 space-y-2">
              <p className="text-[11px] font-bold text-[#002B5C] uppercase tracking-wide">
                Entregas & Evidências Desta Fase:
              </p>
              <div className="flex flex-wrap gap-2">
                {current.deliverables.map((item, idx) => (
                  <span 
                    key={idx}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#002B5C] bg-slate-50 border border-slate-200 px-3 py-1 rounded-xl"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#70B32D]" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="w-full max-w-[320px] bg-gradient-to-br from-blue-50 to-emerald-50/50 border border-slate-200 rounded-3xl p-6 text-center space-y-4 shadow-inner">
              <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-sm mx-auto flex items-center justify-center text-[#002B5C]">
                <IconComp className="w-8 h-8 text-[#002B5C]" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#002B5C]">
                  Rigor Metodológico no SESI
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Cada etapa concluída exige anotação detalhada no diário de bordo digital.
                </p>
              </div>

              {/* Botão de Próxima Etapa */}
              <button
                onClick={() => setActiveStageIndex((prev) => (prev + 1) % SCIENTIFIC_STAGES.length)}
                className="w-full py-2 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-[#002B5C] flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Avançar para Etapa Seguinte</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#70B32D]" />
              </button>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};
