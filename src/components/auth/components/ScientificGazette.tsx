import React from 'react';
import { 
  Newspaper, 
  Sparkles, 
  Quote, 
  Lightbulb, 
  BookOpen, 
  ChevronRight, 
  Atom, 
  Flame, 
  Globe2, 
  Compass
} from 'lucide-react';

const NOTICIAS_CIENTIFICAS = [
  {
    id: 1,
    titulo: 'Hidrogênio Verde no Semiárido Potiguar',
    categoria: 'Energias Renováveis',
    data: 'Fev 2026',
    resumo: 'O RN avança em projetos de eletrólise solar e eólica, abrindo novos campos de pesquisa no ensino médio.',
    imagem: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    titulo: 'Telescópio James Webb e a Química Pré-Biótica',
    categoria: 'Astrofísica',
    data: 'Fev 2026',
    resumo: 'Detecção inédita de moléculas de carbono em zonas habitáveis de exoplanetas.',
    imagem: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    titulo: 'Inteligência Artificial e Sensores de Solo',
    categoria: 'Robótica & IoT',
    data: 'Fev 2026',
    resumo: 'Dispositivos de baixo custo com IA embarcada economizam até 40% de água na irrigação.',
    imagem: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    titulo: 'Jovens Criam Bioplástico de Palma na FEBRACE',
    categoria: 'Biotecnologia',
    data: 'Fev 2026',
    resumo: 'Material biodegradável à base de cacto nordestino se decompõe em apenas 21 dias.',
    imagem: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
  }
];

const CURIOSIDADES_CIENTIFICAS = [
  {
    id: 1,
    icone: Atom,
    titulo: 'DNA em Escala Cósmica',
    descricao: 'O DNA de uma única pessoa esticado alcançaria o Sol mais de 300 vezes.',
    area: 'Genética'
  },
  {
    id: 2,
    icone: Flame,
    titulo: 'Fusão Nuclear Solar',
    descricao: 'O Sol converte 4 milhões de toneladas de matéria em pura energia a cada segundo.',
    area: 'Física'
  },
  {
    id: 3,
    icone: Globe2,
    titulo: 'Capital do Sal Marinho',
    descricao: 'Macau e o litoral potiguar produzem mais de 90% do sal consumido no Brasil.',
    area: 'Química Potiguar'
  },
  {
    id: 4,
    icone: Compass,
    titulo: 'Pioneirismo na Computação',
    descricao: 'Ada Lovelace desenvolveu o primeiro algoritmo da história em 1843.',
    area: 'Tecnologia'
  }
];

const FRASES_PESQUISADORES = [
  {
    id: 1,
    autor: 'Marie Curie',
    titulo: 'Nobel de Física e Química',
    frase: 'Nada na vida deve ser temido, somente compreendido.',
  },
  {
    id: 2,
    autor: 'César Lattes',
    titulo: 'Pioneiro da Física no Brasil',
    frase: 'A ciência nasce da coragem de fazer perguntas que ninguém ousou formular.',
  },
  {
    id: 3,
    autor: 'Johanna Döbereiner',
    titulo: 'Cientista Brasileira',
    frase: 'A pesquisa científica só se completa quando transforma a realidade do povo.',
  },
  {
    id: 4,
    autor: 'Albert Einstein',
    titulo: 'Físico Teórico',
    frase: 'A imaginação é a prévia das atrações futuras da vida.',
  }
];

const DICAS_DIARIO = [
  {
    id: 1,
    numero: '01',
    titulo: 'Em Tempo Real',
    descricao: 'Anote medições e parâmetros assim que finalizar cada teste de bancada.'
  },
  {
    id: 2,
    numero: '02',
    titulo: 'Valorize os Erros',
    descricao: 'Hipóteses refutadas demonstram maturidade metodológica para as bancas.'
  },
  {
    id: 3,
    numero: '03',
    titulo: 'Evidências com Fotos',
    descricao: 'Registre imagens das montagens e etapas para comprovar a autoria.'
  },
  {
    id: 4,
    numero: '04',
    titulo: 'Parecer Semanal',
    descricao: 'Alinhe semanalmente com seu orientador para manter o rigor científico.'
  }
];

interface ScientificGazetteProps {
  onLearnMoreClick: () => void;
}

export const ScientificGazette: React.FC<ScientificGazetteProps> = ({ onLearnMoreClick }) => {
  return (
    <div className="space-y-16">
      
      {/* 1. NOTÍCIAS CIENTÍFICAS ATUAIS */}
      <section id="noticias" className="space-y-6 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <span className="text-xs font-bold text-[#70B32D] uppercase tracking-wider flex items-center gap-1.5">
              <Newspaper className="w-4 h-4" />
              Giro Científico
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#002B5C] mt-0.5">
              Notícias da Ciência & Inovação
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Descobertas recentes e pesquisas em destaque
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {NOTICIAS_CIENTIFICAS.map((noticia) => (
            <div 
              key={noticia.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-[#002B5C] transition-all duration-300 overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-1 flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                  <img 
                    src={noticia.imagem} 
                    alt={noticia.titulo} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 bg-[#002B5C]/90 backdrop-blur-xs text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                    {noticia.categoria}
                  </div>
                </div>

                <div className="p-4 space-y-1.5">
                  <span className="text-[10px] font-semibold text-slate-400">{noticia.data}</span>
                  <h3 className="text-xs font-bold text-[#002B5C] leading-snug group-hover:text-[#003B71] transition-colors">
                    {noticia.titulo}
                  </h3>
                  <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
                    {noticia.resumo}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button 
                  onClick={onLearnMoreClick}
                  className="text-[11px] text-[#002B5C] font-bold hover:text-[#70B32D] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Ver impacto no portal</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#70B32D]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. CURIOSIDADES CIENTÍFICAS */}
      <section id="curiosidades" className="space-y-6 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <span className="text-xs font-bold text-[#70B32D] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              Mundo do Saber
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#002B5C] mt-0.5">
              Curiosidades Científicas
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Fatos fascinantes que alimentam a curiosidade investigativa
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CURIOSIDADES_CIENTIFICAS.map((curiosidade) => {
            const IconComponent = curiosidade.icone;
            return (
              <div 
                key={curiosidade.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-[#70B32D] transition-all duration-300 shadow-xs hover:shadow-lg hover:-translate-y-1 space-y-2.5 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-[#528521] flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-[#002B5C] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                    {curiosidade.area}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-[#002B5C] leading-snug">
                  {curiosidade.titulo}
                </h3>

                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {curiosidade.descricao}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. FRASES DE PESQUISADORES */}
      <section id="frases" className="space-y-6 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <span className="text-xs font-bold text-[#70B32D] uppercase tracking-wider flex items-center gap-1.5">
              <Quote className="w-4 h-4" />
              Vozes da Ciência
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#002B5C] mt-0.5">
              Pensamento de Grandes Pesquisadores
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Inspiração teórica para jovens cientistas
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FRASES_PESQUISADORES.map((item) => (
            <div 
              key={item.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-[#002B5C] transition-all duration-300 shadow-xs hover:shadow-lg hover:-translate-y-1 flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2">
                <Quote className="w-5 h-5 text-[#70B32D] opacity-80" />
                <p className="text-xs text-slate-700 italic leading-relaxed">
                  "{item.frase}"
                </p>
              </div>

              <div className="border-t border-slate-100 pt-2.5">
                <p className="text-xs font-bold text-[#002B5C]">{item.autor}</p>
                <p className="text-[10px] text-[#528521] font-semibold">{item.titulo}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. DIÁRIO DE BORDO & MÉTODO */}
      <section id="diario-regras" className="space-y-6 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <span className="text-xs font-bold text-[#70B32D] uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4" />
              Rigor Acadêmico
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#002B5C] mt-0.5">
              4 Regras de Ouro do Diário de Bordo SESI
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Diretrizes indispensáveis para a aprovação nas bancas
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DICAS_DIARIO.map((dica) => (
            <div 
              key={dica.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-[#002B5C] transition-all duration-300 shadow-xs hover:shadow-lg hover:-translate-y-1 space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-base font-extrabold text-[#70B32D]">
                  {dica.numero}
                </span>
                <BookOpen className="w-4 h-4 text-slate-400 group-hover:text-[#002B5C] transition-colors" />
              </div>
              <h3 className="text-xs font-bold text-[#002B5C]">
                {dica.titulo}
              </h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {dica.descricao}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
