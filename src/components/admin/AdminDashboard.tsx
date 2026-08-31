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
  Send,
  Lock,
  ShieldAlert,
  Eye,
  EyeOff,
  ArrowRightLeft,
  Plus,
  Edit2,
  FolderPlus,
  HelpCircle,
  UserCheck,
  GripVertical,
  MoveRight,
  Sparkles
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { allUsers, reloadUsers, currentUser } = useAuth();
  const [activeAdminTab, setActiveAdminTab] = useState<'users' | 'groups' | 'transfers' | 'settings'>('groups');
  const [groups, setGroups] = useState<ResearchGroup[]>([]);
  const [lines, setLines] = useState<ResearchLine[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<string>('TODAS');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | UserRole>('ALL');

  // Estado do Modal de Usuário
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

  // Estado do Modal de Grupo de Pesquisa
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ResearchGroup | null>(null);
  const [groupFormData, setGroupFormData] = useState({
    title: '',
    description: '',
    unit: 'SESI SÃO GONÇALO DO AMARANTE' as SesiUnit,
    leaderTeacherId: '',
  });
  const [groupModalError, setGroupModalError] = useState<string | null>(null);
  const [isSavingGroup, setIsSavingGroup] = useState(false);

  // Estado do Modal de Linha de Pesquisa
  const [isLineModalOpen, setIsLineModalOpen] = useState(false);
  const [editingLine, setEditingLine] = useState<ResearchLine | null>(null);
  const [targetGroupForLine, setTargetGroupForLine] = useState<ResearchGroup | null>(null);
  const [lineFormData, setLineFormData] = useState({
    title: '',
    area: '',
    description: '',
  });
  const [lineModalError, setLineModalError] = useState<string | null>(null);
  const [isSavingLine, setIsSavingLine] = useState(false);

  // Estado de Transferência de Aluno
  const [transferringStudent, setTransferringStudent] = useState<UserProfile | null>(null);
  const [selectedTargetLineId, setSelectedTargetLineId] = useState<string>('UNASSIGN');
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferToast, setTransferToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Estado de Drag and Drop e Transferência Rápida de Linha
  const [draggedLineId, setDraggedLineId] = useState<string | null>(null);
  const [draggedSourceGroupId, setDraggedSourceGroupId] = useState<string | null>(null);
  const [dragOverGroupId, setDragOverGroupId] = useState<string | null>(null);
  
  // Modal Rápido de Mover Linha
  const [movingLineItem, setMovingLineItem] = useState<{ line: ResearchLine; sourceGroup: ResearchGroup } | null>(null);
  const [selectedMoveTargetGroupId, setSelectedMoveTargetGroupId] = useState<string>('');
  const [isMovingLineModalSaving, setIsMovingLineModalSaving] = useState(false);

  // Credenciais Geradas e Notificação de E-mail
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

  // Modal de Proteção por Senha Mestra
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

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

  const loadData = async () => {
    const fetchedGroups = await groupService.getAllGroups();
    const fetchedLines = await groupService.getAllLines();
    setGroups(fetchedGroups);
    setLines(fetchedLines);
  };

  useEffect(() => {
    loadData();
  }, []);

  const teachersList = allUsers.filter(u => u.role === 'teacher');
  const studentsList = allUsers.filter(u => u.role === 'student');

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

  // Alunos Filtrados para Transferência
  const filteredStudents = studentsList.filter((student) => {
    const matchesUnit = selectedUnit === 'TODAS' || student.unit === selectedUnit;
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.matricula?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesUnit && matchesSearch;
  });

  // Grupos Filtrados
  const filteredGroups = groups.filter((group) => {
    const matchesUnit = selectedUnit === 'TODAS' || group.unit === selectedUnit;
    const matchesSearch = 
      group.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.leaderTeacherName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesUnit && matchesSearch;
  });

  const handleOpenEmailSettings = () => {
    setEnteredPassword('');
    setPasswordError(null);
    setShowPassword(false);
    setIsPasswordModalOpen(true);
  };

  const handleVerifyPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const validPasswords = ['sesi@master2026', 'sesi@admin2026', 'admin@icp2026', 'sesi2026', 'sesi@123456'];
    if (validPasswords.includes(enteredPassword.trim())) {
      setIsPasswordModalOpen(false);
      setEmailConfigStatus(null);
      const currentConfig = await emailService.getEmailjsConfig();
      if (currentConfig) {
        setEmailjsForm(currentConfig);
      }
      setIsEmailSettingsOpen(true);
    } else {
      setPasswordError('Senha de segurança incorreta. Acesso restrito ao desenvolvedor / TI.');
    }
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

  const handleDeleteUser = async (user: UserProfile) => {
    if (confirm(`Tem certeza que deseja excluir o usuário "${user.name}" (${user.email})? Esta ação não pode ser desfeita.`)) {
      try {
        await authService.deleteUser(user.uid, user.email);
        await reloadUsers();
        await loadData();
      } catch (err: any) {
        alert('Erro ao excluir usuário: ' + err.message);
      }
    }
  };

  const OFFICIAL_SITE_URL = 'https://gestao-icp.vercel.app';

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
      setModalError(err.message || 'Erro ao processar solicitação.');
    }
  };

  // ==========================================
  // FUNÇÕES DE GESTÃO DE GRUPOS
  // ==========================================
  const handleOpenCreateGroup = () => {
    setEditingGroup(null);
    setGroupFormData({
      title: '',
      description: '',
      unit: 'SESI SÃO GONÇALO DO AMARANTE',
      leaderTeacherId: teachersList[0]?.uid || '',
    });
    setGroupModalError(null);
    setIsGroupModalOpen(true);
  };

  const handleOpenEditGroup = (group: ResearchGroup) => {
    setEditingGroup(group);
    setGroupFormData({
      title: group.title,
      description: group.description,
      unit: group.unit,
      leaderTeacherId: group.leaderTeacherId,
    });
    setGroupModalError(null);
    setIsGroupModalOpen(true);
  };

  const handleSaveGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setGroupModalError(null);

    if (!groupFormData.title) {
      setGroupModalError('O título do grupo de pesquisa é obrigatório.');
      return;
    }

    const selectedTeacher = teachersList.find(t => t.uid === groupFormData.leaderTeacherId);
    if (!selectedTeacher) {
      setGroupModalError('Selecione um professor orientador líder válido.');
      return;
    }

    setIsSavingGroup(true);
    try {
      if (editingGroup) {
        await groupService.updateGroup(editingGroup.id, {
          title: groupFormData.title.trim(),
          description: groupFormData.description.trim(),
          unit: groupFormData.unit,
          leaderTeacherId: selectedTeacher.uid,
          leaderTeacherName: selectedTeacher.name,
        });
      } else {
        await groupService.createGroup({
          title: groupFormData.title.trim(),
          description: groupFormData.description.trim() || 'Grupo de pesquisa institucional de iniciação científica SESI ICP.',
          unit: groupFormData.unit,
          leaderTeacherId: selectedTeacher.uid,
          leaderTeacherName: selectedTeacher.name,
        });
      }

      await loadData();
      setIsGroupModalOpen(false);
    } catch (err: any) {
      setGroupModalError(err.message || 'Erro ao salvar grupo de pesquisa.');
    } finally {
      setIsSavingGroup(false);
    }
  };

  const handleDeleteGroup = async (group: ResearchGroup) => {
    if (confirm(`Atenção: Deseja realmente excluir o grupo "${group.title}" e todas as suas linhas de pesquisa? Esta ação é irreversível.`)) {
      try {
        await groupService.deleteGroupWithLines(group.id);
        await loadData();
      } catch (err: any) {
        alert('Erro ao excluir grupo: ' + err.message);
      }
    }
  };

  // ==========================================
  // FUNÇÕES DE GESTÃO DE LINHAS DE PESQUISA
  // ==========================================
  const handleOpenCreateLine = (group: ResearchGroup) => {
    const groupLines = lines.filter(l => l.groupId === group.id);
    if (groupLines.length >= 5) {
      alert('Limite atingido! Cada grupo pode ter no máximo 5 linhas de pesquisa.');
      return;
    }
    setTargetGroupForLine(group);
    setEditingLine(null);
    setLineFormData({
      title: '',
      area: '',
      description: '',
    });
    setLineModalError(null);
    setIsLineModalOpen(true);
  };

  const handleOpenEditLine = (group: ResearchGroup, line: ResearchLine) => {
    setTargetGroupForLine(group);
    setEditingLine(line);
    setLineFormData({
      title: line.title,
      area: line.area,
      description: line.description,
    });
    setLineModalError(null);
    setIsLineModalOpen(true);
  };

  const handleSaveLine = async (e: React.FormEvent) => {
    e.preventDefault();
    setLineModalError(null);

    if (!targetGroupForLine) return;
    if (!lineFormData.title || !lineFormData.area) {
      setLineModalError('Título e Área Temática são obrigatórios.');
      return;
    }

    setIsSavingLine(true);
    try {
      if (editingLine) {
        await groupService.updateLine(editingLine.id, {
          title: lineFormData.title.trim(),
          area: lineFormData.area.trim(),
          description: lineFormData.description.trim(),
        });
      } else {
        const groupLines = lines.filter(l => l.groupId === targetGroupForLine.id);
        await groupService.createLine({
          groupId: targetGroupForLine.id,
          lineNumber: groupLines.length + 1,
          title: lineFormData.title.trim(),
          area: lineFormData.area.trim(),
          description: lineFormData.description.trim(),
          studentIds: [],
          studentNames: [],
        });
      }

      await loadData();
      setIsLineModalOpen(false);
    } catch (err: any) {
      setLineModalError(err.message || 'Erro ao salvar linha de pesquisa.');
    } finally {
      setIsSavingLine(false);
    }
  };

  const handleDeleteLine = async (line: ResearchLine) => {
    if (confirm(`Deseja realmente remover a linha "${line.title}"? Os alunos vinculados ficarão sem linha.`)) {
      try {
        await groupService.deleteLine(line.id);
        await loadData();
      } catch (err: any) {
        alert('Erro ao excluir linha: ' + err.message);
      }
    }
  };

  // ==========================================
  // DRAG AND DROP & TRANSFERÊNCIA DE LINHAS
  // ==========================================
  const handleDragStart = (e: React.DragEvent, line: ResearchLine, group: ResearchGroup) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ lineId: line.id, sourceGroupId: group.id }));
    setDraggedLineId(line.id);
    setDraggedSourceGroupId(group.id);
  };

  const handleDragEnd = () => {
    setDraggedLineId(null);
    setDraggedSourceGroupId(null);
    setDragOverGroupId(null);
  };

  const handleDragOver = (e: React.DragEvent, targetGroupId: string) => {
    e.preventDefault();
    if (dragOverGroupId !== targetGroupId) {
      setDragOverGroupId(targetGroupId);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setDragOverGroupId(null);
  };

  const handleDropLineOnGroup = async (e: React.DragEvent, targetGroup: ResearchGroup) => {
    e.preventDefault();
    setDragOverGroupId(null);

    try {
      const dataStr = e.dataTransfer.getData('application/json');
      if (!dataStr) return;
      const { lineId, sourceGroupId } = JSON.parse(dataStr);

      if (sourceGroupId === targetGroup.id) {
        return; // Mesmo grupo
      }

      const targetGroupLines = lines.filter(l => l.groupId === targetGroup.id);
      if (targetGroupLines.length >= 5) {
        setTransferToast({
          message: `O grupo "${targetGroup.title}" já atingiu a capacidade máxima de 5 linhas.`,
          type: 'error',
        });
        setTimeout(() => setTransferToast(null), 4500);
        return;
      }

      const draggedLineObj = lines.find(l => l.id === lineId);
      await groupService.moveLineToGroup(lineId, targetGroup.id);
      await loadData();

      setTransferToast({
        message: `✨ Linha "${draggedLineObj?.title || 'Pesquisa'}" transferida com sucesso para o grupo do(a) Prof. ${targetGroup.leaderTeacherName}!`,
        type: 'success',
      });
      setTimeout(() => setTransferToast(null), 4500);
    } catch (err: any) {
      setTransferToast({
        message: 'Erro ao transferir linha: ' + err.message,
        type: 'error',
      });
      setTimeout(() => setTransferToast(null), 5000);
    } finally {
      setDraggedLineId(null);
      setDraggedSourceGroupId(null);
    }
  };

  const handleOpenMoveLineModal = (group: ResearchGroup, line: ResearchLine) => {
    setMovingLineItem({ line, sourceGroup: group });
    const availableGroups = groups.filter(g => g.id !== group.id);
    setSelectedMoveTargetGroupId(availableGroups[0]?.id || '');
  };

  const handleExecuteMoveLineModal = async () => {
    if (!movingLineItem || !selectedMoveTargetGroupId) return;
    setIsMovingLineModalSaving(true);
    try {
      const destGroup = groups.find(g => g.id === selectedMoveTargetGroupId);
      if (!destGroup) throw new Error('Grupo de destino não encontrado.');

      await groupService.moveLineToGroup(movingLineItem.line.id, selectedMoveTargetGroupId);
      await loadData();

      setTransferToast({
        message: `✨ Linha "${movingLineItem.line.title}" transferida com sucesso para o grupo do(a) Prof. ${destGroup.leaderTeacherName}!`,
        type: 'success',
      });
      setTimeout(() => setTransferToast(null), 4500);
      setMovingLineItem(null);
    } catch (err: any) {
      setTransferToast({
        message: 'Erro ao transferir linha: ' + err.message,
        type: 'error',
      });
      setTimeout(() => setTransferToast(null), 5000);
    } finally {
      setIsMovingLineModalSaving(false);
    }
  };

  // ==========================================
  // FUNÇÕES DE TRANSFERÊNCIA DE ALUNOS
  // ==========================================
  const getStudentCurrentAllocation = (studentId: string) => {
    const line = lines.find(l => l.studentIds.includes(studentId));
    if (!line) return null;
    const group = groups.find(g => g.id === line.groupId);
    return { line, group };
  };

  const handleOpenTransferModal = (student: UserProfile) => {
    setTransferringStudent(student);
    const alloc = getStudentCurrentAllocation(student.uid);
    setSelectedTargetLineId(alloc ? alloc.line.id : 'UNASSIGN');
  };

  const handleExecuteTransfer = async () => {
    if (!transferringStudent) return;
    setIsTransferring(true);
    try {
      const targetLineId = selectedTargetLineId === 'UNASSIGN' ? null : selectedTargetLineId;
      await groupService.transferStudent(transferringStudent.uid, transferringStudent.name, targetLineId);
      await loadData();
      setTransferToast({
        message: targetLineId 
          ? `Aluno(a) ${transferringStudent.name} transferido(a) com sucesso!` 
          : `Aluno(a) ${transferringStudent.name} desvinculado(a) e definido(a) como Livre com sucesso!`,
        type: 'success',
      });
      setTimeout(() => setTransferToast(null), 4000);
      setTransferringStudent(null);
    } catch (err: any) {
      setTransferToast({
        message: 'Erro na transferência: ' + err.message,
        type: 'error',
      });
      setTimeout(() => setTransferToast(null), 5000);
    } finally {
      setIsTransferring(false);
    }
  };

  const totalTeachers = allUsers.filter(u => u.role === 'teacher').length;
  const totalStudents = allUsers.filter(u => u.role === 'student').length;
  const assignedStudentsCount = studentsList.filter(s => getStudentCurrentAllocation(s.uid) !== null).length;
  const unassignedStudentsCount = totalStudents - assignedStudentsCount;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      
      {/* Toast Notification */}
      {transferToast && (
        <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl border shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200 ${
          transferToast.type === 'success' 
            ? 'bg-emerald-950 text-white border-emerald-600 ring-2 ring-emerald-500/50' 
            : 'bg-rose-950 text-white border-rose-600 ring-2 ring-rose-500/50'
        }`}>
          {transferToast.type === 'success' ? <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" /> : <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
          <span className="text-xs font-bold leading-snug">{transferToast.message}</span>
          <button onClick={() => setTransferToast(null)} className="p-1 hover:bg-white/20 rounded-lg cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Banner Institucional */}
      <div className="bg-gradient-to-r from-[#002B5C] via-[#003B71] to-[#001D3D] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2">
            <span className="bg-[#70B32D] text-[#002B5C] text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider shadow-xs">
              Módulo de Governança
            </span>
            <span className="text-xs text-blue-200 font-semibold">Coordenação Geral SESI RN</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Painel de Gestão & Administração ICP
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/90 max-w-2xl leading-relaxed">
            Controle total de usuários, criação e renomeação de grupos de pesquisa, linhas temáticas e transferência com recurso de <strong>arrastar/deslizar linhas</strong> entre grupos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10">
          <button
            onClick={handleOpenCreateModal}
            className="bg-[#70B32D] hover:bg-[#5da523] text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Novo Usuário</span>
          </button>

          <button
            onClick={handleOpenCreateGroup}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <FolderPlus className="w-4 h-4 text-[#70B32D]" />
            <span>+ Criar Grupo</span>
          </button>

          <button
            onClick={handleOpenEmailSettings}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 p-2.5 rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer"
            title="Configurações de TI / Email"
          >
            <Settings className="w-4 h-4 text-blue-200" />
          </button>
        </div>
      </div>

      {/* Cards de Métricas Globais */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Professores</p>
              <p className="text-2xl sm:text-3xl font-black text-[#002B5C] mt-1">{totalTeachers}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#002B5C] flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2.5 text-[11px] text-slate-500 flex items-center gap-1.5 border-t border-slate-100 pt-2">
            <span className="w-2 h-2 rounded-full bg-[#70B32D]"></span>
            <span>Orientadores Ativos</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Alunos Totais</p>
              <p className="text-2xl sm:text-3xl font-black text-[#528521] mt-1">{totalStudents}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#528521] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2.5 text-[11px] text-slate-500 flex items-center gap-1.5 border-t border-slate-100 pt-2">
            <span>{assignedStudentsCount} Alocados • {unassignedStudentsCount} Livres</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Grupos de Pesquisa</p>
              <p className="text-2xl sm:text-3xl font-black text-[#002B5C] mt-1">{groups.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#002B5C] flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2.5 text-[11px] text-slate-500 flex items-center gap-1.5 border-t border-slate-100 pt-2">
            <span>Ativos nas Unidades</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Linhas Temáticas</p>
              <p className="text-2xl sm:text-3xl font-black text-[#528521] mt-1">{lines.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#528521] flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2.5 text-[11px] text-slate-500 flex items-center gap-1.5 border-t border-slate-100 pt-2">
            <span>Até 5 por Grupo</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl shadow-xs col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Polos SESI RN</p>
              <p className="text-2xl sm:text-3xl font-black text-slate-800 mt-1">3</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2.5 text-[11px] text-slate-500 flex items-center gap-1.5 border-t border-slate-100 pt-2">
            <span>SGA • Mossoró • Macau</span>
          </div>
        </div>
      </div>

      {/* Navegação de Abas do Administrador */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveAdminTab('groups')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            activeAdminTab === 'groups'
              ? 'bg-[#002B5C] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4 text-[#70B32D]" />
          <span>Gestão de Grupos & Linhas ({groups.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('users')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            activeAdminTab === 'users'
              ? 'bg-[#002B5C] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Gestão de Usuários ({allUsers.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('transfers')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            activeAdminTab === 'transfers'
              ? 'bg-[#002B5C] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4 text-[#70B32D]" />
          <span>Alocação & Transferência de Alunos</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('settings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            activeAdminTab === 'settings'
              ? 'bg-[#002B5C] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Configurações & TI</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* ABA 1: GESTÃO DE GRUPOS & LINHAS (COM ARRASTAR / DESLIZAR LINHAS) */}
      {/* ========================================================================= */}
      {activeAdminTab === 'groups' && (
        <div className="space-y-6">
          {/* Instruções de Drag and Drop Interativo */}
          <div className="bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-200/80 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#002B5C] text-white flex items-center justify-center shrink-0 shadow-xs">
                <ArrowRightLeft className="w-4 h-4 text-[#70B32D]" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-[#002B5C]">
                  Transferência Visual de Linhas de Pesquisa
                </h4>
                <p className="text-[11px] text-slate-600">
                  Você pode <strong>clicar e arrastar/deslizar</strong> qualquer card de linha de um grupo para o outro, ou clicar no botão de transferir <strong>(⇄)</strong>.
                </p>
              </div>
            </div>

            <button
              onClick={handleOpenCreateGroup}
              className="bg-[#002B5C] hover:bg-[#003B71] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 text-[#70B32D]" />
              <span>+ Criar Novo Grupo</span>
            </button>
          </div>

          {filteredGroups.length === 0 ? (
            <div className="text-center py-12 px-4 bg-white rounded-3xl border border-dashed border-slate-200 space-y-3">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-[#002B5C]">Nenhum Grupo de Pesquisa Encontrado</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Crie o primeiro grupo de pesquisa para vincular aos professores orientadores e alunos.
              </p>
              <button
                onClick={handleOpenCreateGroup}
                className="bg-[#70B32D] hover:bg-[#5da523] text-white px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Criar Grupo Agora</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredGroups.map((group) => {
                const groupLines = lines.filter(l => l.groupId === group.id);
                const totalStudentsInGroup = groupLines.reduce((acc, curr) => acc + curr.studentIds.length, 0);
                const isDragOver = dragOverGroupId === group.id;
                const isSourceGroup = draggedSourceGroupId === group.id;
                const isGroupFull = groupLines.length >= 5;

                return (
                  <div 
                    key={group.id} 
                    onDragOver={(e) => handleDragOver(e, group.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDropLineOnGroup(e, group)}
                    className={`bg-white rounded-3xl border transition-all duration-200 overflow-hidden ${
                      isDragOver && !isSourceGroup && !isGroupFull
                        ? 'border-emerald-500 ring-4 ring-emerald-500/20 shadow-2xl scale-[1.01] bg-emerald-50/30'
                        : isDragOver && isGroupFull
                        ? 'border-rose-500 ring-4 ring-rose-500/20 shadow-2xl bg-rose-50/30'
                        : 'border-slate-200 shadow-xs hover:shadow-md'
                    }`}
                  >
                    
                    {/* Cabeçalho do Grupo */}
                    <div className="p-5 sm:p-6 bg-slate-50/90 border-b border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="bg-blue-100 text-[#002B5C] font-bold px-2.5 py-0.5 rounded-md text-[10px] uppercase tracking-wide">
                            {group.unit}
                          </span>
                          <span className={`font-bold px-2.5 py-0.5 rounded-md text-[10px] ${
                            isGroupFull ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-[#528521]'
                          }`}>
                            {groupLines.length}/5 Linhas {isGroupFull ? '(Capacidade Máxima)' : ''}
                          </span>
                          <span className="bg-slate-200 text-slate-700 font-bold px-2.5 py-0.5 rounded-md text-[10px]">
                            {totalStudentsInGroup} Alunos Vinculados
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-extrabold text-[#002B5C]">
                          {group.title}
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {group.description || 'Sem descrição cadastrada.'}
                        </p>
                        <p className="text-xs text-slate-500 font-medium pt-1">
                          Orientador Líder: <strong className="text-[#002B5C]">{group.leaderTeacherName}</strong>
                        </p>
                      </div>

                      {/* Botões de Ação do Grupo */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleOpenCreateLine(group)}
                          disabled={groupLines.length >= 5}
                          className="bg-emerald-50 hover:bg-emerald-100 text-[#528521] border border-emerald-200 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Adicionar Linha</span>
                        </button>
                        <button
                          onClick={() => handleOpenEditGroup(group)}
                          className="bg-blue-50 hover:bg-blue-100 text-[#002B5C] border border-blue-200 p-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                          title="Renomear / Editar Grupo"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteGroup(group)}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 p-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                          title="Excluir Grupo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Banner de Dropzone Ativo */}
                    {isDragOver && !isSourceGroup && (
                      <div className={`p-3 text-center text-xs font-bold flex items-center justify-center gap-2 border-b animate-pulse ${
                        isGroupFull ? 'bg-rose-100 text-rose-800 border-rose-200' : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      }`}>
                        {isGroupFull ? (
                          <>
                            <AlertCircle className="w-4 h-4 text-rose-600" />
                            <span>Este grupo já está lotado com 5 linhas. Remova ou transfira uma linha antes.</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 text-emerald-600" />
                            <span>Solte aqui para transferir a linha para o grupo do(a) Prof. {group.leaderTeacherName}!</span>
                          </>
                        )}
                      </div>
                    )}

                    {/* Lista de Linhas de Pesquisa do Grupo */}
                    <div className="p-5 sm:p-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-[#002B5C]" />
                          Linhas de Pesquisa deste Grupo ({groupLines.length})
                        </h4>
                        <span className="text-[11px] text-slate-400 font-medium">
                          Arraste para outro grupo para transferir
                        </span>
                      </div>

                      {groupLines.length === 0 ? (
                        <div className={`p-8 rounded-2xl border-2 border-dashed text-center space-y-2 transition-all ${
                          isDragOver 
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-800 scale-[1.02]' 
                            : 'bg-slate-50 border-slate-200 text-slate-500'
                        }`}>
                          <Layers className="w-8 h-8 mx-auto opacity-40 text-[#002B5C]" />
                          <p className="text-xs font-bold text-slate-700">
                            Nenhuma linha de pesquisa neste grupo ainda.
                          </p>
                          <p className="text-[11px] text-slate-500">
                            <strong>Arraste e solte uma linha de outro grupo aqui</strong> ou clique no botão "+ Adicionar Linha".
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                          {groupLines.map((line) => {
                            const isBeingDragged = draggedLineId === line.id;

                            return (
                              <div 
                                key={line.id} 
                                draggable={true}
                                onDragStart={(e) => handleDragStart(e, line, group)}
                                onDragEnd={handleDragEnd}
                                className={`p-4 rounded-2xl border bg-white transition-all flex flex-col justify-between space-y-3 shadow-xs hover:shadow-md cursor-grab active:cursor-grabbing relative group/line ${
                                  isBeingDragged
                                    ? 'opacity-40 border-dashed border-[#002B5C] scale-95'
                                    : 'border-slate-200 hover:border-[#002B5C]'
                                }`}
                              >
                                <div>
                                  <div className="flex items-center justify-between gap-1 mb-1.5">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-slate-300 group-hover/line:text-slate-600 transition-colors" title="Arraste para mover para outro grupo">
                                        <GripVertical className="w-4 h-4" />
                                      </span>
                                      <span className="bg-[#002B5C] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-2xs">
                                        Linha 0{line.lineNumber}
                                      </span>
                                    </div>
                                    <span className="text-[10px] font-bold text-[#528521] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                      {line.studentIds.length}/3 Alunos
                                    </span>
                                  </div>
                                  <h5 className="text-xs font-bold text-[#002B5C] leading-snug">
                                    {line.title}
                                  </h5>
                                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                                    Área: {line.area}
                                  </p>
                                </div>

                                {/* Alunos na Linha */}
                                <div className="space-y-1 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                  <p className="font-bold text-slate-600 text-[10px] uppercase">Alunos Vinculados:</p>
                                  {line.studentNames.length === 0 ? (
                                    <p className="text-slate-400 italic text-[10px]">Nenhum aluno matriculado</p>
                                  ) : (
                                    line.studentNames.map((name, idx) => (
                                      <p key={idx} className="text-slate-700 font-medium truncate flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#70B32D] shrink-0"></span>
                                        <span className="truncate">{name}</span>
                                      </p>
                                    ))
                                  )}
                                </div>

                                {/* Ações da Linha */}
                                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenMoveLineModal(group, line)}
                                    className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-[#002B5C] border border-blue-200 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                                    title="Mover esta linha para outro Grupo de Pesquisa"
                                  >
                                    <ArrowRightLeft className="w-3 h-3 text-[#70B32D]" />
                                    <span>Mover</span>
                                  </button>

                                  <div className="flex items-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() => handleOpenEditLine(group, line)}
                                      className="p-1.5 text-slate-500 hover:text-[#002B5C] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                      title="Renomear Linha / Alterar Metodologia"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteLine(line)}
                                      className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                      title="Excluir Linha"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 2: GESTÃO DE USUÁRIOS */}
      {/* ========================================================================= */}
      {activeAdminTab === 'users' && (
        <div className="space-y-4">
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
              <button
                onClick={handleOpenCreateModal}
                className="bg-[#70B32D] hover:bg-[#5da523] text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Cadastrar Usuário</span>
              </button>
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
                          className="p-1.5 text-slate-400 hover:text-[#002B5C] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Editar Usuário"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 3: ALOCAÇÃO & TRANSFERÊNCIA DE ALUNOS */}
      {/* ========================================================================= */}
      {activeAdminTab === 'transfers' && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-[#002B5C] uppercase tracking-wider flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-[#70B32D]" />
                Alocação & Transferência de Alunos entre Linhas e Grupos
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Mude qualquer aluno de orientador/linha ou deixe-o livre com 1 clique.
              </p>
            </div>

            {/* Campo de Busca */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar aluno por nome ou matrícula..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#002B5C] focus:bg-white"
              />
            </div>
          </div>

          {/* Tabela de Alunos e Transferência */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5">Aluno Pesquisador</th>
                    <th className="px-4 py-3.5">Unidade Escolar</th>
                    <th className="px-4 py-3.5">Alocação Atual</th>
                    <th className="px-4 py-3.5">Orientador Responsável</th>
                    <th className="px-4 py-3.5 text-right">Ação de Governança</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((student) => {
                    const alloc = getStudentCurrentAllocation(student.uid);

                    return (
                      <tr key={student.uid} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-5 py-3.5">
                          <div>
                            <p className="font-bold text-[#002B5C]">{student.name}</p>
                            <p className="text-[11px] text-slate-500">{student.email} • Matrícula: {student.matricula || '—'}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-xs text-slate-700 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded font-medium">
                            {student.unit.replace('SESI ', '')}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          {alloc ? (
                            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-[#528521] border border-emerald-200 flex items-center gap-1.5 w-fit">
                              <Layers className="w-3.5 h-3.5" />
                              Linha 0{alloc.line.lineNumber}: {alloc.line.title}
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1.5 w-fit">
                              <AlertCircle className="w-3.5 h-3.5" />
                              Livre (Sem Linha de Pesquisa)
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-slate-700 font-medium">
                          {alloc ? alloc.group?.leaderTeacherName : '—'}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <button
                            onClick={() => handleOpenTransferModal(student)}
                            className="bg-blue-50 hover:bg-[#002B5C] text-[#002B5C] hover:text-white border border-blue-200 hover:border-[#002B5C] px-3 py-1.5 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
                          >
                            <ArrowRightLeft className="w-3.5 h-3.5" />
                            <span>Transferir / Alocar</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 4: CONFIGURAÇÕES & TI */}
      {/* ========================================================================= */}
      {activeAdminTab === 'settings' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#002B5C] flex items-center justify-center">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#002B5C] uppercase tracking-wider">
                  Configurações do Sistema & Integração de E-mail
                </h3>
                <p className="text-xs text-slate-500">
                  Gerencie as chaves do EmailJS e serviços de comunicação em lote
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                <h4 className="text-xs font-bold text-[#002B5C] flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#70B32D]" />
                  Disparo Automático de Credenciais (EmailJS)
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Permite configurar o Service ID, Template ID e Public Key para envio de senhas institucionais.
                </p>
                <button
                  onClick={handleOpenEmailSettings}
                  className="bg-[#002B5C] hover:bg-[#003B71] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 mt-2 cursor-pointer shadow-xs"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Configurar Credenciais do EmailJS</span>
                </button>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                <h4 className="text-xs font-bold text-[#002B5C] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#70B32D]" />
                  Banco de Dados & Autenticação
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Conectado à nuvem Google Firebase (Firestore + Firebase Auth) com proteção isolada por perfil.
                </p>
                <div className="flex items-center gap-2 pt-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs font-bold text-emerald-800">Serviços Online e Operacionais</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: MOVER LINHA DE PESQUISA PARA OUTRO GRUPO */}
      {/* ========================================================================= */}
      {movingLineItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#002B5C] p-5 flex items-center justify-between text-white">
              <div className="flex items-center gap-2.5">
                <ArrowRightLeft className="w-5 h-5 text-[#70B32D]" />
                <div>
                  <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                    Mover Linha para Outro Grupo
                  </h3>
                  <p className="text-xs text-blue-200">{movingLineItem.line.title}</p>
                </div>
              </div>
              <button onClick={() => setMovingLineItem(null)} className="text-white/70 hover:text-white p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5">
                <p><strong className="text-[#002B5C]">Grupo Atual:</strong> {movingLineItem.sourceGroup.title}</p>
                <p><strong className="text-[#002B5C]">Orientador Atual:</strong> {movingLineItem.sourceGroup.leaderTeacherName}</p>
                <p><strong className="text-[#002B5C]">Alunos Vinculados ({movingLineItem.line.studentNames.length}):</strong> {movingLineItem.line.studentNames.join(', ') || 'Nenhum'}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1.5">
                  Selecione o Grupo de Pesquisa de Destino:
                </label>
                <select
                  value={selectedMoveTargetGroupId}
                  onChange={(e) => setSelectedMoveTargetGroupId(e.target.value)}
                  className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#002B5C] focus:bg-white font-medium cursor-pointer"
                >
                  {groups.filter(g => g.id !== movingLineItem.sourceGroup.id).map(g => {
                    const gLines = lines.filter(l => l.groupId === g.id);
                    const isFull = gLines.length >= 5;
                    return (
                      <option key={g.id} value={g.id} disabled={isFull}>
                        [{g.unit.replace('SESI ', '')}] {g.title} — Prof. {g.leaderTeacherName} ({gLines.length}/5 Linhas) {isFull ? '(LOTADO)' : ''}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setMovingLineItem(null)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={isMovingLineModalSaving || !selectedMoveTargetGroupId}
                  onClick={handleExecuteMoveLineModal}
                  className="bg-[#002B5C] hover:bg-[#003B71] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5 text-[#70B32D]" />
                  <span>{isMovingLineModalSaving ? 'Transferindo...' : 'Confirmar Transferência de Grupo'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CRIAR / EDITAR GRUPO DE PESQUISA */}
      {/* ========================================================================= */}
      {isGroupModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#002B5C] p-5 flex items-center justify-between text-white">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-[#70B32D]" />
                <div>
                  <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                    {editingGroup ? 'Editar Grupo de Pesquisa' : 'Criar Novo Grupo de Pesquisa'}
                  </h3>
                  <p className="text-xs text-blue-200">Administração Geral SESI ICP</p>
                </div>
              </div>
              <button onClick={() => setIsGroupModalOpen(false)} className="text-white/70 hover:text-white p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGroup} className="p-6 space-y-4">
              {groupModalError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{groupModalError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                  Título do Grupo de Pesquisa *
                </label>
                <input
                  type="text"
                  required
                  value={groupFormData.title}
                  onChange={(e) => setGroupFormData({ ...groupFormData, title: e.target.value })}
                  placeholder="Ex: Ciências da Natureza e suas Aplicações"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#002B5C] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                  Unidade Escolar SESI *
                </label>
                <select
                  value={groupFormData.unit}
                  onChange={(e) => setGroupFormData({ ...groupFormData, unit: e.target.value as SesiUnit })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#002B5C] focus:bg-white cursor-pointer font-medium"
                >
                  {SESI_UNITS.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                  Professor Orientador / Líder *
                </label>
                <select
                  required
                  value={groupFormData.leaderTeacherId}
                  onChange={(e) => setGroupFormData({ ...groupFormData, leaderTeacherId: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#002B5C] focus:bg-white cursor-pointer font-medium"
                >
                  <option value="">Selecione o Professor Líder...</option>
                  {teachersList.map(teacher => (
                    <option key={teacher.uid} value={teacher.uid}>
                      {teacher.name} ({teacher.unit.replace('SESI ', '')}) — {teacher.email}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                  Descrição & Metodologia Geral
                </label>
                <textarea
                  rows={3}
                  value={groupFormData.description}
                  onChange={(e) => setGroupFormData({ ...groupFormData, description: e.target.value })}
                  placeholder="Descreva a fundamentação, escopo e metas gerais das pesquisas desenvolvidas pelo grupo..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#002B5C] focus:bg-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsGroupModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSavingGroup}
                  className="bg-[#002B5C] hover:bg-[#003B71] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSavingGroup ? 'Salvando...' : editingGroup ? 'Salvar Alterações' : 'Criar Grupo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CRIAR / EDITAR LINHA DE PESQUISA */}
      {/* ========================================================================= */}
      {isLineModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#002B5C] p-5 flex items-center justify-between text-white">
              <div className="flex items-center gap-2.5">
                <Layers className="w-5 h-5 text-[#70B32D]" />
                <div>
                  <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                    {editingLine ? 'Editar Linha de Pesquisa' : 'Nova Linha de Pesquisa'}
                  </h3>
                  <p className="text-xs text-blue-200">
                    Grupo: {targetGroupForLine?.title}
                  </p>
                </div>
              </div>
              <button onClick={() => setIsLineModalOpen(false)} className="text-white/70 hover:text-white p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLine} className="p-6 space-y-4">
              {lineModalError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{lineModalError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                  Título da Linha de Pesquisa *
                </label>
                <input
                  type="text"
                  required
                  value={lineFormData.title}
                  onChange={(e) => setLineFormData({ ...lineFormData, title: e.target.value })}
                  placeholder="Ex: G1 - Metodologias ativas para o ensino de Criptografia"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#002B5C] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                  Área Temática / Subárea *
                </label>
                <input
                  type="text"
                  required
                  value={lineFormData.area}
                  onChange={(e) => setLineFormData({ ...lineFormData, area: e.target.value })}
                  placeholder="Ex: Teoria dos números / Inteligência Artificial / Robótica"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#002B5C] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                  Objetivos e Metodologia da Linha
                </label>
                <textarea
                  rows={3}
                  value={lineFormData.description}
                  onChange={(e) => setLineFormData({ ...lineFormData, description: e.target.value })}
                  placeholder="Descreva a fundamentação, metodologia e metas da linha temática..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#002B5C] focus:bg-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLineModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSavingLine}
                  className="bg-[#002B5C] hover:bg-[#003B71] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSavingLine ? 'Salvando...' : editingLine ? 'Salvar Alterações' : 'Criar Linha'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: TRANSFERIR / ALOCAR ALUNO */}
      {/* ========================================================================= */}
      {transferringStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#002B5C] p-5 flex items-center justify-between text-white">
              <div className="flex items-center gap-2.5">
                <ArrowRightLeft className="w-5 h-5 text-[#70B32D]" />
                <div>
                  <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                    Alocar / Transferir Aluno
                  </h3>
                  <p className="text-xs text-blue-200">{transferringStudent.name}</p>
                </div>
              </div>
              <button onClick={() => setTransferringStudent(null)} className="text-white/70 hover:text-white p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                <p><strong className="text-[#002B5C]">E-mail:</strong> {transferringStudent.email}</p>
                <p><strong className="text-[#002B5C]">Unidade Atual:</strong> {transferringStudent.unit}</p>
                <p><strong className="text-[#002B5C]">Matrícula:</strong> {transferringStudent.matricula || '—'}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1.5">
                  Selecione o Grupo e Linha de Pesquisa de Destino:
                </label>
                <select
                  value={selectedTargetLineId}
                  onChange={(e) => setSelectedTargetLineId(e.target.value)}
                  className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#002B5C] focus:bg-white font-medium cursor-pointer"
                >
                  <option value="UNASSIGN">❌ Deixar Sem Linha (Aluno Livre / Desvinculado)</option>
                  {groups.map(group => {
                    const groupLines = lines.filter(l => l.groupId === group.id);
                    return (
                      <optgroup key={group.id} label={`🏛️ [${group.unit.replace('SESI ', '')}] ${group.title} (Prof. ${group.leaderTeacherName})`}>
                        {groupLines.map(line => {
                          const isFull = line.studentIds.length >= 3 && !line.studentIds.includes(transferringStudent.uid);
                          return (
                            <option key={line.id} value={line.id} disabled={isFull}>
                              Linha 0{line.lineNumber}: {line.title} — ({line.studentIds.length}/3 alunos) {isFull ? '(LOTADA)' : ''}
                            </option>
                          );
                        })}
                      </optgroup>
                    );
                  })}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setTransferringStudent(null)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={isTransferring}
                  onClick={handleExecuteTransfer}
                  className="bg-[#002B5C] hover:bg-[#003B71] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5 text-[#70B32D]" />
                  <span>{isTransferring ? 'Transferindo...' : 'Confirmar Transferência'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CRIAR / EDITAR USUÁRIO */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            
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
                  <p className="text-xs text-blue-200">Credencial oficial do SESI ICP</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
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
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setCreatedCredentials(null);
                    }}
                    className="w-full bg-[#002B5C] hover:bg-[#003B71] text-white py-2.5 rounded-xl font-bold text-xs shadow-md cursor-pointer"
                  >
                    Concluir
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveUser} className="p-6 space-y-4 text-left">
                {modalError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{modalError}</span>
                  </div>
                )}
                {modalSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
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
                    placeholder="Ex: João da Silva"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#002B5C] focus:bg-white"
                  />
                </div>

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
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#002B5C] focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                      Papel / Perfil *
                    </label>
                    <select
                      value={modalFormData.role}
                      onChange={(e) => setModalFormData({ ...modalFormData, role: e.target.value as UserRole })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#002B5C] focus:bg-white font-medium cursor-pointer"
                    >
                      <option value="teacher">Professor Líder</option>
                      <option value="student">Aluno Pesquisador</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                      Unidade Escolar SESI *
                    </label>
                    <select
                      value={modalFormData.unit}
                      onChange={(e) => setModalFormData({ ...modalFormData, unit: e.target.value as SesiUnit })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#002B5C] focus:bg-white font-medium cursor-pointer"
                    >
                      {SESI_UNITS.map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                      Matrícula
                    </label>
                    <input
                      type="text"
                      value={modalFormData.matricula}
                      onChange={(e) => setModalFormData({ ...modalFormData, matricula: e.target.value })}
                      placeholder="Ex: SESI-1234"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#002B5C] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                      {modalFormData.role === 'student' ? 'Série / Turma' : 'Área de Atuação'}
                    </label>
                    <input
                      type="text"
                      value={modalFormData.areaOrGrade}
                      onChange={(e) => setModalFormData({ ...modalFormData, areaOrGrade: e.target.value })}
                      placeholder={modalFormData.role === 'student' ? 'Ex: 2º Ano Ensino Médio' : 'Ex: Robótica / Matemática'}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#002B5C] focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                    Senha de Acesso {editingUser && '(Deixe em branco para manter a atual)'}
                  </label>
                  <input
                    type="password"
                    value={modalFormData.password}
                    onChange={(e) => setModalFormData({ ...modalFormData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#002B5C] focus:bg-white"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-[#002B5C] hover:bg-[#003B71] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md cursor-pointer"
                  >
                    {editingUser ? 'Salvar Alterações' : 'Cadastrar Usuário'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: SENHA MESTRA PARA CONFIGURAÇÕES */}
      {/* ========================================================================= */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#002B5C] p-5 flex items-center justify-between text-white">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-5 h-5 text-[#70B32D]" />
                <div>
                  <h3 className="font-bold text-sm text-white uppercase tracking-wider">Acesso de Desenvolvedor / TI</h3>
                  <p className="text-xs text-blue-200">Autenticação Mestra</p>
                </div>
              </div>
              <button onClick={() => setIsPasswordModalOpen(false)} className="text-white/70 hover:text-white p-1 rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleVerifyPassword} className="p-6 space-y-4">
              {passwordError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                  Senha Mestra de Segurança
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={enteredPassword}
                    onChange={(e) => setEnteredPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#002B5C] focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#002B5C] hover:bg-[#003B71] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  Acessar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CONFIGURAÇÃO DO EMAILJS */}
      {/* ========================================================================= */}
      {isEmailSettingsOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#002B5C] p-5 flex items-center justify-between text-white">
              <div className="flex items-center gap-2.5">
                <Mail className="w-5 h-5 text-[#70B32D]" />
                <div>
                  <h3 className="font-bold text-sm text-white uppercase tracking-wider">Configuração do EmailJS</h3>
                  <p className="text-xs text-blue-200">Disparo Automático de Credenciais</p>
                </div>
              </div>
              <button onClick={() => setIsEmailSettingsOpen(false)} className="text-white/70 hover:text-white p-1 rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEmailConfig} className="p-6 space-y-4">
              {emailConfigStatus && (
                <div className="p-3 bg-blue-50 border border-blue-200 text-[#002B5C] text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-[#70B32D]" />
                  <span>{emailConfigStatus}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                  Service ID *
                </label>
                <input
                  type="text"
                  required
                  value={emailjsForm.serviceId}
                  onChange={(e) => setEmailjsForm({ ...emailjsForm, serviceId: e.target.value })}
                  placeholder="Ex: service_sesi_icp"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#002B5C] focus:bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                  Template ID *
                </label>
                <input
                  type="text"
                  required
                  value={emailjsForm.templateId}
                  onChange={(e) => setEmailjsForm({ ...emailjsForm, templateId: e.target.value })}
                  placeholder="Ex: template_icp_welcome"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#002B5C] focus:bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                  Public Key (User ID) *
                </label>
                <input
                  type="text"
                  required
                  value={emailjsForm.publicKey}
                  onChange={(e) => setEmailjsForm({ ...emailjsForm, publicKey: e.target.value })}
                  placeholder="Ex: user_xyz123456789"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#002B5C] focus:bg-white font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  disabled={isTestingEmail}
                  onClick={handleTestEmailjs}
                  className="bg-emerald-50 hover:bg-emerald-100 text-[#528521] border border-emerald-200 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isTestingEmail ? 'Testando...' : 'Enviar E-mail de Teste'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEmailSettingsOpen(false)}
                    className="px-3 py-2 rounded-xl text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    Fechar
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingConfig}
                    className="bg-[#002B5C] hover:bg-[#003B71] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md cursor-pointer"
                  >
                    {isSavingConfig ? 'Salvando...' : 'Salvar Configurações'}
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
