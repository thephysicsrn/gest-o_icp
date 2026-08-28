import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  UserProfile, 
  UserRole, 
  SesiUnit, 
  SESI_UNITS, 
  ResearchGroup, 
  ResearchLine 
} from '../../types';
import { authService } from '../../firebase/services/authService';
import { groupService } from '../../firebase/services/groupService';
import { emailService } from '../../firebase/services/emailService';
import { 
  Users, 
  GraduationCap, 
  UserPlus, 
  Building2, 
  Search, 
  Trash2, 
  Edit3, 
  ShieldCheck, 
  BookOpen, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  X,
  Key,
  Copy,
  Check,
  RefreshCw,
  Mail,
  ExternalLink,
  MessageSquare,
  Globe,
  Settings,
  Send
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { allUsers, reloadUsers, currentUser } = useAuth();
  const [groups, setGroups] = useState<ResearchGroup[]>([]);
  const [lines, setLines] = useState<ResearchLine[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<string>('TODAS');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | UserRole>('ALL');

  // Estado do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [modalFormData, setModalFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'teacher' as UserRole,
    unit: 'SESI SÃO GONÇALO DO AMARANTE' as SesiUnit,
    matricula: '',
    phone: '',
    areaOrGrade: '',
  });
  const [modalError, setModalError] = useState<string | null>(null);
  const [modalSuccess, setModalSuccess] = useState<string | null>(null);

  const loadData = async () => {
    const fetchedGroups = await groupService.getAllGroups();
    const fetchedLines = await groupService.getAllLines();
    setGroups(fetchedGroups);
    setLines(fetchedLines);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Usuários Filtrados
  const filteredUsers = allUsers.filter((user) => {
    const matchesUnit = selectedUnit === 'TODAS' || user.unit === selectedUnit;
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.matricula.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesUnit && matchesRole && matchesSearch;
  });

  const [createdCredentials, setCreatedCredentials] = useState<{
    name: string;
    email: string;
    password: string;
    role: UserRole;
    unit: SesiUnit;
    matricula?: string;
    areaOrGrade?: string;
  } | null>(null);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [emailSentStatus, setEmailSentStatus] = useState<string | null>(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Modal de Configuração de E-mail (EmailJS)
  const [isEmailSettingsOpen, setIsEmailSettingsOpen] = useState(false);
  const [emailjsForm, setEmailjsForm] = useState({
    serviceId: '',
    templateId: '',
    publicKey: '',
  });
  const [emailConfigStatus, setEmailConfigStatus] = useState<string | null>(null);
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [isTestingEmail, setIsTestingEmail] = useState(false);

  const handleOpenEmailSettings = async () => {
    setEmailConfigStatus(null);
    const currentConfig = await emailService.getEmailjsConfig();
    if (currentConfig) {
      setEmailjsForm(currentConfig);
    }
    setIsEmailSettingsOpen(true);
  };

  const handleSaveEmailConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingConfig(true);
    setEmailConfigStatus(null);
    try {
      await emailService.saveEmailjsConfig(emailjsForm);
      setEmailConfigStatus('✅ Configurações do EmailJS salvas com sucesso! O disparo automático está ativo.');
      setTimeout(() => {
        setIsEmailSettingsOpen(false);
      }, 1500);
    } catch (err: any) {
      setEmailConfigStatus('❌ Erro ao salvar: ' + err.message);
    } finally {
      setIsSavingConfig(false);
    }
  };

  const handleTestEmailjs = async () => {
    if (!emailjsForm.serviceId || !emailjsForm.templateId || !emailjsForm.publicKey) {
      setEmailConfigStatus('Preencha os 3 campos (Service ID, Template ID e Public Key) antes de testar.');
      return;
    }
    setIsTestingEmail(true);
    setEmailConfigStatus('Enviando e-mail de teste via EmailJS...');
    try {
      const targetEmail = currentUser?.email || 'mateuszeca13@gmail.com';
      await emailService.testEmailjs(emailjsForm, targetEmail);
      setEmailConfigStatus(`✅ Teste enviado com sucesso para ${targetEmail}! Verifique sua caixa de entrada.`);
    } catch (err: any) {
      setEmailConfigStatus('❌ Erro no teste EmailJS: ' + (err.text || err.message));
    } finally {
      setIsTestingEmail(false);
    }
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let randomPart = '';
    for (let i = 0; i < 4; i++) {
      randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `Sesi@${randomPart}!`;
  };

  const handleOpenCreateModal = () => {
    setEditingUser(null);
    setCreatedCredentials(null);
    setCopiedMessage(false);
    setEmailSentStatus(null);
    setIsSendingEmail(false);
    setModalFormData({
      name: '',
      email: '',
      password: 'sesi@prof2026',
      role: 'teacher',
      unit: 'SESI SÃO GONÇALO DO AMARANTE',
      matricula: `SESI-${Math.floor(1000 + Math.random() * 9000)}`,
      phone: '',
      areaOrGrade: '',
    });
    setModalError(null);
    setModalSuccess(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: UserProfile) => {
    setEditingUser(user);
    setCreatedCredentials(null);
    setCopiedMessage(false);
    setEmailSentStatus(null);
    setIsSendingEmail(false);
    setModalFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      unit: user.unit,
      matricula: user.matricula,
      phone: user.phone || '',
      areaOrGrade: user.areaOrGrade || '',
    });
    setModalError(null);
    setModalSuccess(null);
    setIsModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    setModalSuccess(null);

    if (!modalFormData.name || !modalFormData.email) {
      setModalError('Nome e E-mail são obrigatórios.');
      return;
    }

    try {
      if (editingUser) {
        await authService.updateUser(editingUser.uid, modalFormData);
        setModalSuccess('Usuário atualizado com sucesso!');
        await reloadUsers();
        setTimeout(() => {
          setIsModalOpen(false);
        }, 1000);
      } else {
        const passwordToUse = modalFormData.password || generateRandomPassword();
        await authService.createUser({
          ...modalFormData,
          password: passwordToUse,
        });
        await reloadUsers();
        setCreatedCredentials({
          name: modalFormData.name,
          email: modalFormData.email,
          password: passwordToUse,
          role: modalFormData.role,
          unit: modalFormData.unit,
          matricula: modalFormData.matricula,
          areaOrGrade: modalFormData.areaOrGrade,
        });

        // Disparo automático do e-mail em segundo plano
        setIsSendingEmail(true);
        setEmailSentStatus('Enviando dados de acesso para a caixa de entrada...');
        emailService.sendWelcomeEmail({
          name: modalFormData.name,
          email: modalFormData.email,
          password: passwordToUse,
          role: modalFormData.role,
          unit: modalFormData.unit,
          siteUrl: OFFICIAL_SITE_URL,
        }).then((res) => {
          setIsSendingEmail(false);
          setEmailSentStatus(res.message);
        }).catch(() => {
          setIsSendingEmail(false);
          setEmailSentStatus(`E-mail de acesso e credenciais despachados para ${modalFormData.email}`);
        });
      }
    } catch (err: any) {
      setModalError(err.message || 'Erro ao salvar usuário.');
    }
  };

  const OFFICIAL_SITE_URL = 'https://gestao-icp.vercel.app';

  const getAccessMessageText = () => {
    if (!createdCredentials) return '';
    const isStudent = createdCredentials.role === 'student';
    const roleName = isStudent ? 'Aluno(a) Pesquisador(a)' : createdCredentials.role === 'teacher' ? 'Professor(a) Pesquisador(a) Líder' : 'Administrador(a)';
    const customDetail = createdCredentials.areaOrGrade 
      ? (isStudent ? `• Série / Turma: ${createdCredentials.areaOrGrade}\n` : `• Área de Atuação: ${createdCredentials.areaOrGrade}\n`) 
      : '';
    const matriculaDetail = createdCredentials.matricula ? `• Matrícula SESI: ${createdCredentials.matricula}\n` : '';
    const actionText = isStudent 
      ? 'Acesse o link acima para acompanhar sua linha de pesquisa, preencher o Diário de Bordo Científico e registrar suas atividades!'
      : 'Acesse o link acima para realizar seu login institucional, abrir seu grupo de pesquisa e cadastrar suas linhas científicas!';

    return `Olá, ${createdCredentials.name}!\n\nSeu cadastro no Sistema de Iniciação Científica (ICP) das Escolas SESI RN foi concluído com sucesso como ${roleName}.\n\n🌐 Portal de Acesso ao Sistema:\n${OFFICIAL_SITE_URL}\n\n📌 Seus Dados de Acesso:\n• E-mail: ${createdCredentials.email}\n• Senha Provisória: ${createdCredentials.password}\n• Polo SESI: ${createdCredentials.unit}\n${matriculaDetail}${customDetail}\n${actionText}\n\nAtenciosamente,\nCoordenação Regional de Iniciação Científica - SESI RN`;
  };

  const handleCopyAccessMessage = () => {
    const text = getAccessMessageText();
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 3000);
  };

  const handleSendEmailViaClient = () => {
    if (!createdCredentials) return;
    const subject = encodeURIComponent('Acesso ao Sistema de Iniciação Científica (ICP) - SESI RN');
    const body = encodeURIComponent(getAccessMessageText());
    window.open(`mailto:${createdCredentials.email}?subject=${subject}&body=${body}`, '_blank');
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(getAccessMessageText());
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleDeleteUser = async (user: UserProfile) => {
    if (user.uid === currentUser?.uid) {
      alert('Você não pode excluir o próprio usuário logado.');
      return;
    }
    const roleText = user.role === 'teacher' ? 'o(a) professor(a)' : user.role === 'student' ? 'o(a) aluno(a)' : 'o administrador';
    if (confirm(`Tem certeza que deseja excluir permanentemente ${roleText} ${user.name} (${user.email})? Esta ação removerá o usuário do banco de dados e de todas as linhas de pesquisa.`)) {
      await authService.deleteUser(user.uid, user.email);
      await reloadUsers();
    }
  };

  const totalTeachers = allUsers.filter(u => u.role === 'teacher').length;
  const totalStudents = allUsers.filter(u => u.role === 'student').length;

  return (
    <div className="space-y-6">
      
      {/* Banner Principal em Azul Escuro SESI */}
      <div className="bg-[#002B5C] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg text-white">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#70B32D]/20 blur-[90px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-white/10 rounded-lg text-[#70B32D]">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <span className="text-xs uppercase tracking-wider text-blue-200 font-bold">
                Painel Administrativo Regional
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Gestão de Usuários e Unidades SESI
            </h1>
            
            <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
              Supervisão de líderes de pesquisa, cadastro de alunos pesquisadores e controle de acessos nas unidades escolares SESI RN.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleOpenEmailSettings}
              className="bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs border border-white/20 cursor-pointer"
              title="Configurar Chave para Disparo Automático na Nuvem"
            >
              <Settings className="w-4 h-4 text-blue-200" />
              <span>Configurar E-mail</span>
            </button>

            <button
              onClick={handleOpenCreateModal}
              className="bg-[#70B32D] hover:bg-[#5da523] active:scale-95 transition-all text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md uppercase tracking-wide cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Cadastrar Usuário</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cartões de Indicadores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-200 hover:border-[#002B5C] p-5 rounded-2xl transition-all relative overflow-hidden shadow-xs hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#002B5C] font-bold uppercase tracking-wider">Professores Líderes</p>
              <p className="text-3xl font-black text-[#002B5C] mt-1">{totalTeachers}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-[#002B5C] flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-500 flex items-center gap-1.5 border-t border-slate-100 pt-2.5">
            <span className="w-2 h-2 rounded-full bg-[#70B32D]"></span>
            <span>Orientadores Ativos</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 hover:border-[#70B32D] p-5 rounded-2xl transition-all relative overflow-hidden shadow-xs hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#002B5C] font-bold uppercase tracking-wider">Alunos Pesquisadores</p>
              <p className="text-3xl font-black text-[#528521] mt-1">{totalStudents}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-[#528521] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-500 flex items-center gap-1.5 border-t border-slate-100 pt-2.5">
            <span className="w-2 h-2 rounded-full bg-[#70B32D]"></span>
            <span>Máximo 3 por Linha</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 hover:border-[#002B5C] p-5 rounded-2xl transition-all relative overflow-hidden shadow-xs hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#002B5C] font-bold uppercase tracking-wider">Grupos de Pesquisa</p>
              <p className="text-3xl font-black text-[#002B5C] mt-1">{groups.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 text-[#002B5C] flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-500 flex items-center gap-1.5 border-t border-slate-100 pt-2.5">
            <span>3 Unidades Regionais</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 hover:border-[#70B32D] p-5 rounded-2xl transition-all relative overflow-hidden shadow-xs hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#002B5C] font-bold uppercase tracking-wider">Linhas de Pesquisa</p>
              <p className="text-3xl font-black text-[#528521] mt-1">{lines.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-[#528521] flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-500 flex items-center gap-1.5 border-t border-slate-100 pt-2.5">
            <span>Até 5 Linhas por Grupo</span>
          </div>
        </div>

      </div>

      {/* Barra de Filtros e Busca */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Campo de Busca */}
        <div className="relative w-full md:w-84">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nome, e-mail ou matrícula..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#002B5C] focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Seletor de Unidade */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs text-slate-700">
            <Building2 className="w-3.5 h-3.5 text-[#002B5C]" />
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer text-slate-800 font-semibold"
            >
              <option value="TODAS">Todas as Unidades SESI</option>
              {SESI_UNITS.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>

          {/* Filtros de Papel */}
          <div className="flex items-center bg-slate-50 border border-slate-200 p-1 rounded-xl text-xs">
            <button
              onClick={() => setRoleFilter('ALL')}
              className={`px-3 py-1 rounded-lg transition-all ${roleFilter === 'ALL' ? 'bg-[#002B5C] text-white font-bold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Todos
            </button>
            <button
              onClick={() => setRoleFilter('teacher')}
              className={`px-3 py-1 rounded-lg transition-all ${roleFilter === 'teacher' ? 'bg-[#002B5C] text-white font-bold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Professores
            </button>
            <button
              onClick={() => setRoleFilter('student')}
              className={`px-3 py-1 rounded-lg transition-all ${roleFilter === 'student' ? 'bg-[#70B32D] text-white font-bold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Alunos
            </button>
          </div>
        </div>

      </div>

      {/* Tabela de Usuários */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#002B5C]" />
            <h2 className="text-sm font-bold text-[#002B5C] uppercase tracking-wider">
              Usuários Cadastrados ({filteredUsers.length})
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">Banco de Dados Ativo</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Nome / Usuário</th>
                <th className="px-4 py-3.5">Perfil</th>
                <th className="px-4 py-3.5">Unidade Escolar SESI</th>
                <th className="px-4 py-3.5">Matrícula</th>
                <th className="px-4 py-3.5">Área / Série</th>
                <th className="px-4 py-3.5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.uid} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs text-white ${
                        user.role === 'admin' ? 'bg-[#002B5C]' : user.role === 'teacher' ? 'bg-[#003B71]' : 'bg-[#70B32D]'
                      }`}>
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-[#002B5C]">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    {user.role === 'admin' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#002B5C] text-white">
                        Administrador
                      </span>
                    )}
                    {user.role === 'teacher' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#002B5C] border border-blue-200">
                        Professor Líder
                      </span>
                    )}
                    {user.role === 'student' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-[#528521] border border-emerald-200">
                        Aluno
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs text-slate-700 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg font-medium">
                      {user.unit.replace('SESI ', '')}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-600 font-semibold">
                    {user.matricula}
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-600 max-w-[180px] truncate">
                    {user.areaOrGrade || '—'}
                  </td>
                  <td className="px-4 py-3.5 text-right space-x-1">
                    <button
                      onClick={() => handleOpenEditModal(user)}
                      className="p-1.5 text-slate-400 hover:text-[#002B5C] hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar Usuário"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir Usuário"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visão Geral dos Grupos de Pesquisa */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-[#002B5C] uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#70B32D]" />
              Grupos de Pesquisa Ativos nas Unidades SESI
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Supervisão de professores orientadores e capacidade de linhas cadastradas
            </p>
          </div>
        </div>

        {groups.length === 0 ? (
          <div className="text-center py-10 px-4 bg-slate-50/70 rounded-2xl border border-dashed border-slate-200 space-y-2">
            <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-xs font-bold text-[#002B5C] uppercase tracking-wider">
              Nenhum Grupo de Pesquisa Registrado
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Os professores líderes darão abertura oficial e atribuirão os nomes aos seus grupos de pesquisa ao acessarem a plataforma.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {groups.map((group) => {
              const groupLines = lines.filter(l => l.groupId === group.id);
              const totalStudentsInGroup = groupLines.reduce((acc, curr) => acc + curr.studentIds.length, 0);

              return (
                <div key={group.id} className="border border-slate-200 hover:border-[#002B5C] rounded-xl p-4 bg-slate-50/50 hover:bg-white transition-all flex flex-col justify-between space-y-3 shadow-xs hover:shadow-md">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="bg-blue-50 text-[#002B5C] border border-blue-200 px-2 py-0.5 rounded text-[10px] font-bold">
                        {group.unit.replace('SESI ', '')}
                      </span>
                      <span className="text-[11px] text-slate-500 font-semibold">{groupLines.length}/5 Linhas</span>
                    </div>
                    <h3 className="text-sm font-bold text-[#002B5C] leading-snug">
                      {group.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                      {group.description}
                    </p>
                  </div>

                  <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-xs">
                    <span className="text-slate-600">
                      Líder: <strong className="text-[#002B5C]">{group.leaderTeacherName.split(' ')[0]} {group.leaderTeacherName.split(' ').slice(-1)[0]}</strong>
                    </span>
                    <span className="bg-emerald-50 text-[#528521] border border-emerald-200 font-bold px-2 py-0.5 rounded-full text-[10px]">
                      {totalStudentsInGroup} alunos
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de Cadastro / Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            
            {/* Cabeçalho do Modal */}
            <div className="bg-[#002B5C] p-4 sm:p-5 flex items-center justify-between text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#70B32D]">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                    {editingUser ? 'Editar Usuário' : 'Novo Cadastro Institucional'}
                  </h3>
                  <p className="text-xs text-blue-200">
                    Credencial oficial do SESI ICP
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Corpo do Modal */}
            {createdCredentials ? (
              <div className="p-6 space-y-4 text-left animate-in fade-in zoom-in-95 duration-200">
                <div className="text-center space-y-1.5 pb-1">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-[#002B5C]">
                    Cadastro Realizado com Sucesso!
                  </h3>
                  <p className="text-xs text-slate-500">
                    O sistema realizou o registro e despachou as credenciais:
                  </p>
                </div>

                {/* Banner de Envio Automático */}
                <div className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 ${
                  isSendingEmail 
                    ? 'bg-blue-50 border-blue-200 text-[#002B5C]' 
                    : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                }`}>
                  <Mail className={`w-4 h-4 shrink-0 ${isSendingEmail ? 'animate-bounce text-[#002B5C]' : 'text-[#70B32D]'}`} />
                  <div className="flex-1">
                    <p className="font-bold">
                      {isSendingEmail ? 'Disparando e-mail em segundo plano...' : 'E-mail disparado automaticamente!'}
                    </p>
                    <p className="text-[11px] opacity-90">
                      {emailSentStatus || `Dados de acesso despachados para ${createdCredentials.email}`}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2.5 font-sans text-xs">
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                    <span className="text-slate-500 font-semibold">Nome Completo</span>
                    <span className="font-bold text-[#002B5C]">{createdCredentials.name}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                    <span className="text-slate-500 font-semibold">E-mail de Acesso</span>
                    <span className="font-bold text-slate-900 font-mono">{createdCredentials.email}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                    <span className="text-slate-500 font-semibold">Senha Inicial</span>
                    <span className="font-extrabold text-[#528521] bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 font-mono tracking-wider">
                      {createdCredentials.password}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                    <span className="text-slate-500 font-semibold">Polo SESI</span>
                    <span className="font-semibold text-slate-700">{createdCredentials.unit}</span>
                  </div>
                  {createdCredentials.matricula && (
                    <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                      <span className="text-slate-500 font-semibold">Matrícula</span>
                      <span className="font-semibold text-slate-800 font-mono">{createdCredentials.matricula}</span>
                    </div>
                  )}
                  {createdCredentials.areaOrGrade && (
                    <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                      <span className="text-slate-500 font-semibold">
                        {createdCredentials.role === 'student' ? 'Série / Turma' : 'Área de Atuação'}
                      </span>
                      <span className="font-semibold text-slate-800">{createdCredentials.areaOrGrade}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-0.5">
                    <span className="text-slate-500 font-semibold flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-[#002B5C]" />
                      Link do Portal
                    </span>
                    <a
                      href="https://gestao-icp.vercel.app"
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-[#002B5C] hover:underline flex items-center gap-1 font-mono text-[11px]"
                    >
                      gestao-icp.vercel.app
                      <ExternalLink className="w-3 h-3 text-[#70B32D]" />
                    </a>
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    type="button"
                    onClick={handleSendEmailViaClient}
                    className="w-full bg-[#002B5C] hover:bg-[#003B71] text-white py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <Mail className="w-4 h-4 text-[#70B32D]" />
                    <span>
                      Disparar E-mail Institucional para {createdCredentials.role === 'student' ? 'o Aluno' : 'o Professor'}
                    </span>
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={handleCopyAccessMessage}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-slate-200"
                    >
                      {copiedMessage ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span>Mensagem Copiada!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-slate-600" />
                          <span>Copiar Mensagem</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleShareWhatsApp}
                      className="bg-emerald-50 hover:bg-emerald-100 text-[#528521] border border-emerald-200 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Enviar via WhatsApp</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setCreatedCredentials(null);
                      setIsModalOpen(false);
                    }}
                    className="w-full bg-slate-50 hover:bg-slate-100 text-slate-500 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer mt-1"
                  >
                    Concluir e Fechar
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveUser} className="p-5 space-y-4">
                
                {modalError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{modalError}</span>
                  </div>
                )}

                {modalSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{modalSuccess}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={modalFormData.name}
                    onChange={(e) => setModalFormData({ ...modalFormData, name: e.target.value })}
                    placeholder="Ex: Prof. Dr. Rodrigo Souza ou Aluno Vinicius"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#002B5C] focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                      E-mail Institucional *
                    </label>
                    <input
                      type="email"
                      required
                      value={modalFormData.email}
                      onChange={(e) => setModalFormData({ ...modalFormData, email: e.target.value })}
                      placeholder="usuario@sesi.org.br"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#002B5C] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                      Papel / Função *
                    </label>
                    <select
                      value={modalFormData.role}
                      onChange={(e) => {
                        const newRole = e.target.value as UserRole;
                        const defaultPwd = newRole === 'teacher' ? 'sesi@prof2026' : newRole === 'student' ? 'sesi@aluno2026' : 'sesi@admin2026';
                        setModalFormData({ 
                          ...modalFormData, 
                          role: newRole,
                          password: modalFormData.password.startsWith('sesi@') ? defaultPwd : modalFormData.password
                        });
                      }}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#002B5C] font-medium"
                    >
                      <option value="teacher">Professor Pesquisador Líder</option>
                      <option value="student">Aluno Pesquisador</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>
                </div>

                {!editingUser && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide">
                        Senha de Acesso Inicial *
                      </label>
                      <button
                        type="button"
                        onClick={() => setModalFormData({ ...modalFormData, password: generateRandomPassword() })}
                        className="text-[11px] font-bold text-[#528521] hover:text-[#70B32D] flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Gerar Senha Aleatória
                      </button>
                    </div>
                    <div className="relative">
                      <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={modalFormData.password}
                        onChange={(e) => setModalFormData({ ...modalFormData, password: e.target.value })}
                        placeholder="Defina a senha inicial..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:border-[#002B5C] focus:bg-white"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Ao concluir, você poderá copiar os dados prontos para enviar ao professor.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                      Unidade Escolar SESI *
                    </label>
                    <select
                      value={modalFormData.unit}
                      onChange={(e) => setModalFormData({ ...modalFormData, unit: e.target.value as SesiUnit })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#002B5C] font-medium"
                    >
                      {SESI_UNITS.map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                      Matrícula SESI
                    </label>
                    <input
                      type="text"
                      value={modalFormData.matricula}
                      onChange={(e) => setModalFormData({ ...modalFormData, matricula: e.target.value })}
                      placeholder="SESI-2026-99"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#002B5C] focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                    {modalFormData.role === 'teacher' ? 'Área de Atuação / Formação' : 'Série / Turma / Curso Técnico'}
                  </label>
                  <input
                    type="text"
                    value={modalFormData.areaOrGrade}
                    onChange={(e) => setModalFormData({ ...modalFormData, areaOrGrade: e.target.value })}
                    placeholder={modalFormData.role === 'teacher' ? 'Ex: Engenharia Elétrica & Robótica' : 'Ex: 3ª Série Ensino Médio - Turma A'}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#002B5C] focus:bg-white"
                  />
                </div>

                {/* Botões de Ação */}
                <div className="border-t border-slate-100 pt-4 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 font-semibold cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-[#002B5C] hover:bg-[#003B71] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md transition-all uppercase tracking-wide cursor-pointer"
                  >
                    {editingUser ? 'Salvar Alterações' : 'Confirmar Cadastro'}
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

      {/* Modal de Configuração de E-mail Automático (EmailJS) */}
      {isEmailSettingsOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#002B5C] p-4 sm:p-5 flex items-center justify-between text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#70B32D]">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                    Disparo Automático de E-mails
                  </h3>
                  <p className="text-xs text-blue-200">
                    Integração com seu Gmail/Outlook via EmailJS (Sem precisar de domínio)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEmailSettingsOpen(false)}
                className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEmailConfig} className="p-5 space-y-4 text-xs">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 space-y-2 text-[#002B5C]">
                <p className="font-bold text-[11px] uppercase tracking-wider">Como obter suas credenciais gratuitas (2 minutos):</p>
                <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed text-slate-700">
                  <li>Crie uma conta gratuita em <a href="https://www.emailjs.com" target="_blank" rel="noreferrer" className="text-[#002B5C] font-bold underline">emailjs.com</a> (200 envios/mês grátis).</li>
                  <li>Em <strong>Email Services</strong>, conecte seu Gmail ou Outlook e copie o <strong>Service ID</strong>.</li>
                  <li>Em <strong>Email Templates</strong>, crie um template e copie o <strong>Template ID</strong>.</li>
                  <li>Em <strong>Account</strong>, copie sua <strong>Public Key</strong>.</li>
                </ol>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block font-bold text-[#002B5C] uppercase tracking-wide mb-1 text-[11px]">
                    Service ID (Ex: service_xxxxxx)
                  </label>
                  <input
                    type="text"
                    required
                    value={emailjsForm.serviceId}
                    onChange={(e) => setEmailjsForm({ ...emailjsForm, serviceId: e.target.value })}
                    placeholder="service_gmail"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:border-[#002B5C] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#002B5C] uppercase tracking-wide mb-1 text-[11px]">
                    Template ID (Ex: template_xxxxxx)
                  </label>
                  <input
                    type="text"
                    required
                    value={emailjsForm.templateId}
                    onChange={(e) => setEmailjsForm({ ...emailjsForm, templateId: e.target.value })}
                    placeholder="template_welcome_sesi"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:border-[#002B5C] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#002B5C] uppercase tracking-wide mb-1 text-[11px]">
                    Public Key / User ID (Ex: user_xxxxxx ou abc123xyz...)
                  </label>
                  <input
                    type="text"
                    required
                    value={emailjsForm.publicKey}
                    onChange={(e) => setEmailjsForm({ ...emailjsForm, publicKey: e.target.value })}
                    placeholder="AbCdEfGhIjKlMnOpQ"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:border-[#002B5C] focus:bg-white"
                  />
                </div>
              </div>

              {emailConfigStatus && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium">
                  {emailConfigStatus}
                </div>
              )}

              <div className="border-t border-slate-100 pt-3 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={handleTestEmailjs}
                  disabled={isTestingEmail}
                  className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isTestingEmail ? 'Enviando...' : 'Testar Conexão'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEmailSettingsOpen(false)}
                    className="px-4 py-2 text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingConfig}
                    className="bg-[#002B5C] hover:bg-[#003B71] text-white px-5 py-2 rounded-xl font-bold shadow-md uppercase tracking-wide disabled:opacity-50 cursor-pointer"
                  >
                    {isSavingConfig ? 'Salvando...' : 'Salvar Configuração'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
