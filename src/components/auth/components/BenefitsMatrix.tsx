import React, { useState } from 'react';
import { 
  GraduationCap, 
  Compass, 
  Building2, 
  CheckCircle2, 
  Sparkles, 
  Award, 
  Clock, 
  ShieldCheck,
  TrendingUp,
  FileCheck
} from 'lucide-react';

export const BenefitsMatrix: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | 'institution'>('student');

  const roleData = {
    student: {
      tag: 'Para Jovens Pesquisadores',
      title: 'Autonomia, autoria e rigor na bancada',
      description: 'Construa uma trajetória científica sólida desde o ensino médio com ferramentas feitas sob medida para a investigação aplicada.',
      benefits: [
        {
          title: 'Diário de Bordo Padronizado',
          desc: 'Esqueça anotações soltas. Registre hipóteses, metodologia e dados no padrão homologado por feiras nacionais.',
          icon: FileCheck
        },
        {
          title: 'Comprovação Real de Autoria',
          desc: 'Anexe fotos datadas das etapas experimentais e comprove o avanço contínuo do seu projeto.',
          icon: ShieldCheck
        },
        {
          title: 'Mentoria Direta com Orientador',
          desc: 'Receba orientações semanais, pareceres técnicos e recomendações de bibliografia diretamente no sistema.',
          icon: GraduationCap
        },
        {
          title: 'Portfólio Científico em PDF',
          desc: 'Exporte relatórios formais com formatação institucional para submeter em feiras e congressos.',
          icon: Award
        }
      ]
    },
    teacher: {
      tag: 'Para Professores Orientadores',
      title: 'Gestão de bancadas sem sobrecarga burocrática',
      description: 'Acompanhe múltiplos grupos e linhas de pesquisa com clareza, mantendo o controle pedagógico e metodológico em tempo real.',
      benefits: [
        {
          title: 'Painel Centralizado de Linhas',
          desc: 'Visualize o andamento de até 5 linhas temáticas por grupo com resumo de horas e status dos testes.',
          icon: Compass
        },
        {
          title: 'Ciclo Ágil de Pareceres',
          desc: 'Aprove registros ou solicite ajustes com comentários pontuais que ficam salvos no histórico acadêmico.',
          icon: CheckCircle2
        },
        {
          title: 'Controle de Frequência e Atas',
          desc: 'Registre presenças, faltas justificadas e sínteses dos encontros laboratoriais de forma organizada.',
          icon: Clock
        },
        {
          title: 'Gestão de Tarefas e Prazos',
          desc: 'Atribua metas específicas para cada bolsista ou linha inteira com acompanhamento de prazos de entrega.',
          icon: TrendingUp
        }
      ]
    },
    institution: {
      tag: 'Para as Escolas e Gestão SESI RN',
      title: 'Rastreabilidade e indicadores de inovação escolar',
      description: 'Consolide a cultura científica nos polos potiguares com relatórios institucionais e conformidade metodológica.',
      benefits: [
        {
          title: 'Padrão Unificado entre Polos',
          desc: 'Mesmo padrão de excelência nas unidades de São Gonçalo do Amarante, Macau e Mossoró.',
          icon: Building2
        },
        {
          title: 'Alinhamento com FEBRACE & MOSTRATEC',
          desc: 'Projetos construídos desde o primeiro dia com os critérios das principais mostras científicas do país.',
          icon: Award
        },
        {
          title: 'Histórico Institucional de Produção',
          desc: 'Repositório permanente de ideias, ensaios, relatórios e patentes desenvolvidos pelos estudantes potiguares.',
          icon: ShieldCheck
        },
        {
          title: 'Fomento a Vocação Científica',
          desc: 'Estímulo direto ao ingresso em engenharias, ciências exatas, biotecnologia e inovação tecnológica.',
          icon: Sparkles
        }
      ]
    }
  };

  const current = roleData[selectedRole];

  return (
    <section id="beneficios" className="space-y-8 scroll-mt-24">
      
      {/* Título da Seção */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-bold text-[#70B32D] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            Impacto no Ecossistema
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#002B5C] tracking-tight mt-1">
            Benefícios para a Comunidade de Pesquisa
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md font-medium">
          Uma plataforma que atende com precisão às necessidades pedagógicas de alunos, orientadores e gestores educacionais.
        </p>
      </div>

      {/* Seletor Dinâmico de Três Vias */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        <button
          onClick={() => setSelectedRole('student')}
          className={`p-4 rounded-2xl border text-left transition-all duration-300 flex items-center gap-3.5 ${
            selectedRole === 'student'
              ? 'border-[#002B5C] bg-white shadow-md ring-1 ring-[#002B5C]'
              : 'border-slate-200 bg-white/60 hover:bg-white text-slate-600'
          }`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            selectedRole === 'student' ? 'bg-[#002B5C] text-white' : 'bg-slate-100 text-slate-500'
          }`}>
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-extrabold text-[#002B5C]">Estudantes</p>
            <p className="text-[11px] text-slate-500">Jovens Pesquisadores</p>
          </div>
        </button>

        <button
          onClick={() => setSelectedRole('teacher')}
          className={`p-4 rounded-2xl border text-left transition-all duration-300 flex items-center gap-3.5 ${
            selectedRole === 'teacher'
              ? 'border-[#70B32D] bg-white shadow-md ring-1 ring-[#70B32D]'
              : 'border-slate-200 bg-white/60 hover:bg-white text-slate-600'
          }`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            selectedRole === 'teacher' ? 'bg-[#70B32D] text-white' : 'bg-slate-100 text-slate-500'
          }`}>
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-extrabold text-[#002B5C]">Orientadores</p>
            <p className="text-[11px] text-slate-500">Professores Mestres & Doutores</p>
          </div>
        </button>

        <button
          onClick={() => setSelectedRole('institution')}
          className={`p-4 rounded-2xl border text-left transition-all duration-300 flex items-center gap-3.5 ${
            selectedRole === 'institution'
              ? 'border-[#005696] bg-white shadow-md ring-1 ring-[#005696]'
              : 'border-slate-200 bg-white/60 hover:bg-white text-slate-600'
          }`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            selectedRole === 'institution' ? 'bg-[#005696] text-white' : 'bg-slate-100 text-slate-500'
          }`}>
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-extrabold text-[#002B5C]">Instituição</p>
            <p className="text-[11px] text-slate-500">Escolas SESI RN</p>
          </div>
        </button>

      </div>

      {/* Painel com Grade de Benefícios Específicos */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-[#528521] uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
            {current.tag}
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-[#002B5C]">
            {current.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            {current.description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {current.benefits.map((b, idx) => {
            const IconComp = b.icon;
            return (
              <div 
                key={idx}
                className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-[#002B5C] hover:bg-white transition-all duration-200 space-y-2 group shadow-2xs hover:shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#002B5C] group-hover:bg-[#002B5C] group-hover:text-white transition-colors flex items-center justify-center shrink-0">
                    <IconComp className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-[#002B5C]">
                    {b.title}
                  </h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-11">
                  {b.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>

    </section>
  );
};
