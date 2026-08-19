import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Building2, 
  GraduationCap, 
  ShieldCheck, 
  User, 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle,
  Newspaper,
  Sparkles,
  Quote,
  Lightbulb,
  BookOpen,
  Atom,
  Flame,
  Globe2,
  Compass,
  ArrowDown,
  ChevronRight,
  FlaskConical,
  Award,
  CheckCircle2,
  Users,
  Sparkle
} from 'lucide-react';

// Notícias Científicas com texto enxuto e direto
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

// Curiosidades Científicas Rápidas
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

// Frases Marcantes de Cientistas
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

// Dicas do Diário de Bordo
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

export const LoginView: React.FC = () => {
  const { login, allUsers, switchUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<0 | 1>(0);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Informe seu e-mail institucional.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar acesso institucional.');
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const teachers = allUsers.filter(u => u.role === 'teacher');
  const students = allUsers.filter(u => u.role === 'student');
  const admin = allUsers.find(u => u.role === 'admin');

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-[#70B32D] selection:text-white relative flex flex-col justify-between">
      
      {/* Luzes Ambientais Suaves */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-blue-100/40 blur-[140px] pointer-events-none" />
      <div className="absolute top-[900px] right-10 w-[500px] h-[400px] bg-emerald-100/30 blur-[150px] pointer-events-none" />

      {/* Topo / Barra de Navegação Flutuante */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all duration-300 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Logotipo e Nome do Programa */}
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

          {/* Navegação Rápida */}
          <nav className="flex items-center gap-1 sm:gap-1.5 text-xs font-semibold">
            <button
              onClick={() => scrollToSection('acesso')}
              className="px-3 py-1.5 rounded-xl text-[#002B5C] hover:bg-blue-50 transition-all duration-200"
            >
              Acesso
            </button>
            <button
              onClick={() => scrollToSection('vivencia')}
              className="px-3 py-1.5 rounded-xl text-slate-600 hover:text-[#002B5C] hover:bg-slate-100 transition-all duration-200"
            >
              Vivência
            </button>
            <button
              onClick={() => scrollToSection('noticias')}
              className="px-3 py-1.5 rounded-xl text-slate-600 hover:text-[#002B5C] hover:bg-slate-100 transition-all duration-200"
            >
              Notícias
            </button>
            <button
              onClick={() => scrollToSection('curiosidades')}
              className="px-3 py-1.5 rounded-xl text-slate-600 hover:text-[#002B5C] hover:bg-slate-100 transition-all duration-200"
            >
              Curiosidades
            </button>
            <button
              onClick={() => scrollToSection('frases')}
              className="px-3 py-1.5 rounded-xl text-slate-600 hover:text-[#002B5C] hover:bg-slate-100 transition-all duration-200"
            >
              Frases
            </button>
            <button
              onClick={() => scrollToSection('diario')}
              className="px-3 py-1.5 rounded-xl text-slate-600 hover:text-[#002B5C] hover:bg-slate-100 transition-all duration-200"
            >
              Diário de Bordo
            </button>

            <button
              onClick={() => scrollToSection('acesso')}
              className="bg-[#002B5C] hover:bg-[#003B71] text-white px-4 py-1.5 rounded-xl font-bold transition-all duration-200 shadow-xs hover:shadow-md active:scale-95 text-[11px] uppercase tracking-wide ml-1"
            >
              Entrar
            </button>
          </nav>

        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL ORGANIZADO */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-24 relative z-10">
        
        {/* ========================================================================= */}
        {/* SEÇÃO HERO INSPIRADA NO HUMBLEOPS COM ANIMAÇÃO GIF DA JOVEM CIENTISTA */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 relative overflow-hidden">
          
          {/* Círculo com Brilho Suave ao Fundo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-100/50 rounded-full blur-[80px] pointer-events-none animate-pulse-glow" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Lado Esquerdo: Tipografia de Grande Impacto */}
            <div className="lg:col-span-5 space-y-4 text-left">
              <div className="inline-flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold text-[#528521] border border-emerald-200">
                <Sparkle className="w-3.5 h-3.5 text-[#70B32D]" />
                <span>ICP • Iniciação Científica Pré - Universitária</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#002B5C] tracking-tight leading-[1.1]">
                Os Próximos 10 Anos da Ciência Começam na Escola<span className="text-[#70B32D]">.</span>
              </h1>
              
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                Desenvolva o pensamento científico, conduza experimentos em laboratório e construa o seu diário de bordo oficial.
              </p>

              {/* Botão de Destaque */}
              <div className="pt-2">
                <button
                  onClick={() => scrollToSection('acesso')}
                  className="bg-[#002B5C] hover:bg-[#003B71] text-white px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 active:scale-95"
                >
                  <span>Acessar Plataforma</span>
                  <ArrowRight className="w-4 h-4 text-[#70B32D]" />
                </button>
              </div>
            </div>

            {/* Centro: GIF Animado da Jovem Cientista SESI com Micro-elementos Flutuantes */}
            <div className="lg:col-span-4 flex items-center justify-center relative py-4">
              
              <div className="relative max-w-[280px] sm:max-w-[320px] transition-transform duration-500 hover:scale-105 animate-float-slow">
                
                {/* Badge Flutuante 1: Método FEBRACE */}
                <div className="absolute -top-3 -left-4 bg-white/95 backdrop-blur-sm border border-emerald-200 shadow-md px-2.5 py-1 rounded-full text-[10px] font-bold text-[#528521] flex items-center gap-1.5 z-20 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-[#70B32D]"></span>
                  <span>FEBRACE & MOSTRATEC</span>
                </div>

                {/* Imagem GIF Animada */}
                <div className="rounded-3xl overflow-hidden border border-slate-100/80 shadow-xs bg-white">
                  <img 
                    src="/cientista-animada.gif" 
                    alt="GIF animado da jovem estudante vestida de cientista"
                    className="w-full h-auto object-contain drop-shadow-sm"
                  />
                </div>

                {/* Badge Flutuante 2: Diário de Bordo */}
                <div className="absolute -bottom-3 -right-3 bg-white/95 backdrop-blur-sm border border-blue-200 shadow-md px-3 py-1 rounded-full text-[10px] font-bold text-[#002B5C] flex items-center gap-1.5 z-20">
                  <BookOpen className="w-3.5 h-3.5 text-[#70B32D]" />
                  <span>Diário de Bordo 2026</span>
                </div>

              </div>

            </div>

            {/* Lado Direito: Bloco Editorial com Linha Divisória */}
            <div className="lg:col-span-3 lg:border-l lg:border-slate-200 lg:pl-6 space-y-4 text-left">
              <div>
                <p className="text-xs font-bold text-[#002B5C] uppercase tracking-wide">
                  Pesquisa Escolar de Alto Impacto
                </p>
                <p className="text-xs font-bold text-[#70B32D] mt-0.5">
                  — Padrão Nacional FEBRACE & MOSTRATEC.
                </p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Substitua anotações dispersas por uma plataforma estruturada. Registre cada medição, receba o parecer semanal do orientador e gere seu relatório em PDF com validade científica.
              </p>

              {/* Unidades Escolares */}
              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400">Polos SESI RN:</span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[11px] font-bold text-[#002B5C] bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg">São Gonçalo</span>
                  <span className="text-[11px] font-bold text-[#002B5C] bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg">Macau</span>
                  <span className="text-[11px] font-bold text-[#002B5C] bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg">Mossoró</span>
                </div>
              </div>
            </div>

          </div>

        </section>

        {/* ========================================================================= */}
        {/* SEÇÃO 2: TERMINAL DE ACESSO & GALERIA DE FOTOS REAIS */}
        {/* ========================================================================= */}
        <section id="acesso" className="pt-2 scroll-mt-24 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <span className="text-xs font-bold text-[#70B32D] uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Ambiente Acadêmico
              </span>
              <h2 className="text-2xl font-extrabold text-[#002B5C] mt-0.5">
                Terminal de Acesso Institucional
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Entre com sua conta escolar ou teste em 1 clique
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* LADO ESQUERDO: Showcase Fotográfico dos Alunos no Laboratório */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-4">
              
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#70B32D] uppercase tracking-wider flex items-center gap-1.5">
                    <FlaskConical className="w-4 h-4" />
                    Vivência Científica nas Escolas SESI
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
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
                
                {/* Overlay Informativo */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-5 text-white">
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

              {/* Miniaturas Interativas */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedPhotoIndex(0)}
                  className={`text-left p-2.5 rounded-2xl border transition-all duration-200 flex items-center gap-3 ${
                    selectedPhotoIndex === 0
                      ? 'border-[#002B5C] bg-blue-50/70 shadow-xs ring-1 ring-[#002B5C]'
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
                  className={`text-left p-2.5 rounded-2xl border transition-all duration-200 flex items-center gap-3 ${
                    selectedPhotoIndex === 1
                      ? 'border-[#002B5C] bg-blue-50/70 shadow-xs ring-1 ring-[#002B5C]'
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

            {/* LADO DIREITO: Formulário de Login & Demonstração Rápida */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-7 flex flex-col justify-between space-y-5">
              
              <div>
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-[#002B5C]">
                      Entrar no Sistema
                    </h2>
                    <p className="text-xs text-slate-500">
                      Informe seu e-mail institucional
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#002B5C] flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-[#70B32D]" />
                  </div>
                </div>

                {error && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Formulário */}
                <form onSubmit={handleLogin} className="space-y-3 mt-4">
                  <div>
                    <label className="block text-xs font-bold text-[#002B5C] mb-1">
                      E-mail Institucional
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="usuario@sesi.org.br"
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#002B5C] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#002B5C] mb-1">
                      Senha de Acesso
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#002B5C] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#002B5C] hover:bg-[#003B71] text-white py-2.5 rounded-xl font-bold text-xs shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 mt-1"
                  >
                    <span>{loading ? 'Validando...' : 'Entrar no Sistema'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#70B32D]" />
                  </button>
                </form>
              </div>

              {/* Demonstração em 1 Clique */}
              <div className="border-t border-slate-100 pt-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#002B5C] flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#70B32D]" />
                    Acesso Rápido para Demonstração:
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-50 text-[#528521] px-2 py-0.5 rounded border border-emerald-200">
                    1 Clique
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {admin && (
                    <button
                      type="button"
                      onClick={() => switchUser(admin)}
                      className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-[#002B5C] transition-all text-center group"
                      title={admin.name}
                    >
                      <div className="w-6 h-6 rounded-lg bg-[#002B5C] text-white mx-auto flex items-center justify-center mb-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#70B32D]" />
                      </div>
                      <p className="text-[11px] font-bold text-[#002B5C] truncate">Admin</p>
                      <p className="text-[9px] text-slate-400 truncate">Regional</p>
                    </button>
                  )}

                  {teachers[0] && (
                    <button
                      type="button"
                      onClick={() => switchUser(teachers[0])}
                      className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-[#002B5C] transition-all text-center group"
                      title={teachers[0].name}
                    >
                      <div className="w-6 h-6 rounded-lg bg-blue-100 text-[#002B5C] mx-auto flex items-center justify-center mb-1">
                        <GraduationCap className="w-3.5 h-3.5" />
                      </div>
                      <p className="text-[11px] font-bold text-[#002B5C] truncate">Professor</p>
                      <p className="text-[9px] text-slate-400 truncate">Prof. Carlos</p>
                    </button>
                  )}

                  {students[0] && (
                    <button
                      type="button"
                      onClick={() => switchUser(students[0])}
                      className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-[#70B32D] transition-all text-center group"
                      title={students[0].name}
                    >
                      <div className="w-6 h-6 rounded-lg bg-emerald-100 text-[#528521] mx-auto flex items-center justify-center mb-1">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <p className="text-[11px] font-bold text-[#528521] truncate">Aluno</p>
                      <p className="text-[9px] text-slate-400 truncate">Arthur V.</p>
                    </button>
                  )}
                </div>
              </div>

            </div>

          </div>

        </section>

        {/* ========================================================================= */}
        {/* SEÇÃO 3: VIVÊNCIA CIENTÍFICA REAL NO SESI */}
        {/* ========================================================================= */}
        <section id="vivencia" className="space-y-6 scroll-mt-24">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <span className="text-xs font-bold text-[#70B32D] uppercase tracking-wider flex items-center gap-1.5">
                <FlaskConical className="w-4 h-4" />
                Metodologia & Prática
              </span>
              <h2 className="text-2xl font-extrabold text-[#002B5C] mt-0.5">
                Jovens Cientistas em Ação
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Pesquisa aplicada, anotação no diário e experimentação
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            
            {/* Foto 2: Futuras Cientistas no Diário de Bordo */}
            <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-md group">
              <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
                <img 
                  src="/alunos-laboratorio-2.jpg" 
                  alt="Alunas realizando anotações no diário de bordo"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="bg-[#002B5C] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md border border-blue-300/40 uppercase tracking-wide">
                    Registro Metodológico
                  </span>
                  <span className="text-xs text-emerald-300 font-bold">Futuras Cientistas</span>
                </div>
                <h3 className="text-sm font-bold text-white leading-snug">
                  Documentação Rigorosa no Diário de Bordo
                </h3>
                <p className="text-xs text-slate-200 mt-1">
                  Estudantes anotando hipóteses, medições e resultados em tempo real no laboratório.
                </p>
              </div>
            </div>

            {/* Painel de Destaques da Formação SESI */}
            <div className="space-y-4">
              
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-[#002B5C] transition-all duration-300 hover:shadow-md flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-[#002B5C] flex items-center justify-center shrink-0">
                  <FlaskConical className="w-5 h-5 text-[#002B5C]" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-[#002B5C]">
                    100% Experimentação Prática
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Alunos aprendem operando vidrarias, circuitos eletrônicos, sensores IoT e ferramentas laboratoriais reais.
                  </p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-[#70B32D] transition-all duration-300 hover:shadow-md flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-[#528521] flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5 text-[#70B32D]" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-[#002B5C]">
                    Padrão de Feiras Científicas (FEBRACE / MOSTRATEC)
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Estrutura de diário de bordo com 6 etapas formais pronta para submissão e exportação oficial em PDF.
                  </p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-[#002B5C] transition-all duration-300 hover:shadow-md flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-[#002B5C] flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5 text-[#002B5C]" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-[#002B5C]">
                    Mentoria Direta com Professores Mestres e Doutores
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Reuniões periódicas, acompanhamento de frequência e parecer semanal individual para cada linha de pesquisa.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </section>

        {/* ========================================================================= */}
        {/* SEÇÃO 4: NOTÍCIAS CIENTÍFICAS ATUAIS */}
        {/* ========================================================================= */}
        <section id="noticias" className="space-y-6 scroll-mt-24">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <span className="text-xs font-bold text-[#70B32D] uppercase tracking-wider flex items-center gap-1.5">
                <Newspaper className="w-4 h-4" />
                Giro Científico
              </span>
              <h2 className="text-2xl font-extrabold text-[#002B5C] mt-0.5">
                Notícias Científicas Atuais
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Inovação e descobertas recentes
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {NOTICIAS_CIENTIFICAS.map((noticia) => (
              <div 
                key={noticia.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-[#002B5C] transition-all duration-300 overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-1.5 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                    <img 
                      src={noticia.imagem} 
                      alt={noticia.titulo} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 bg-[#002B5C]/90 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold">
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
                    onClick={() => scrollToSection('acesso')}
                    className="text-[11px] text-[#002B5C] font-bold hover:text-[#70B32D] flex items-center gap-1 transition-colors"
                  >
                    <span>Saiba mais no portal</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </section>

        {/* ========================================================================= */}
        {/* SEÇÃO 5: CURIOSIDADES CIENTÍFICAS */}
        {/* ========================================================================= */}
        <section id="curiosidades" className="space-y-6 scroll-mt-24">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <span className="text-xs font-bold text-[#70B32D] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Mundo do Saber
              </span>
              <h2 className="text-2xl font-extrabold text-[#002B5C] mt-0.5">
                Curiosidades Científicas
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Fatos que expandem o conhecimento
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CURIOSIDADES_CIENTIFICAS.map((curiosidade) => {
              const IconComponent = curiosidade.icone;
              return (
                <div 
                  key={curiosidade.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-[#70B32D] transition-all duration-300 shadow-xs hover:shadow-lg hover:-translate-y-1.5 space-y-2.5 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-[#528521] flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-[#002B5C] bg-blue-50 px-2 py-0.5 rounded-full">
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

        {/* ========================================================================= */}
        {/* SEÇÃO 6: FRASES DE PESQUISADORES */}
        {/* ========================================================================= */}
        <section id="frases" className="space-y-6 scroll-mt-24">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <span className="text-xs font-bold text-[#70B32D] uppercase tracking-wider flex items-center gap-1.5">
                <Quote className="w-4 h-4" />
                Vozes da Ciência
              </span>
              <h2 className="text-2xl font-extrabold text-[#002B5C] mt-0.5">
                Frases de Grandes Pesquisadores
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Pensamentos inspiradores
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FRASES_PESQUISADORES.map((item) => (
              <div 
                key={item.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-[#002B5C] transition-all duration-300 shadow-xs hover:shadow-lg hover:-translate-y-1.5 flex flex-col justify-between space-y-3 group"
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

        {/* ========================================================================= */}
        {/* SEÇÃO 7: DIÁRIO DE BORDO & MÉTODO */}
        {/* ========================================================================= */}
        <section id="diario" className="space-y-6 scroll-mt-24">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <span className="text-xs font-bold text-[#70B32D] uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4" />
                Método Científico
              </span>
              <h2 className="text-2xl font-extrabold text-[#002B5C] mt-0.5">
                4 Regras do Diário de Bordo SESI
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Boas práticas para jovens pesquisadores
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DICAS_DIARIO.map((dica) => (
              <div 
                key={dica.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-[#002B5C] transition-all duration-300 shadow-xs hover:shadow-lg hover:-translate-y-1.5 space-y-2 group"
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

      </main>

      {/* Rodapé Institucional */}
      <footer className="w-full border-t border-slate-200 bg-white py-6 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 shadow-xs mt-16">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="flex items-center h-7">
              <img 
                src="/sesi-escola-logo.png" 
                alt="Logotipo SESI Escola" 
                className="h-5 w-auto object-contain"
              />
            </div>
            <span className="text-[#002B5C] font-bold text-xs">
              ICP — Iniciação Científica Pré - Universitária • SESI RN
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs">
            <span className="text-slate-600 font-medium">
              Desenvolvido por <strong className="text-[#002B5C]">Mateus Zeca</strong> — Todos os direitos reservados
            </span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="flex items-center gap-1.5 text-slate-600 font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#70B32D]"></span>
              Versão 2.6.0
            </span>
          </div>

        </div>
      </footer>

    </div>
  );
};
