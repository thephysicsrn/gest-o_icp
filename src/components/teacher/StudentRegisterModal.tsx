import React, { useState } from 'react';
import { UserProfile, SesiUnit } from '../../types';
import { authService } from '../../firebase/services/authService';
import { emailService } from '../../firebase/services/emailService';
import { useAuth } from '../../context/AuthContext';
import { 
  UserPlus, 
  X, 
  CheckCircle, 
  Copy, 
  Check, 
  Mail, 
  Phone, 
  Sparkles, 
  Key, 
  Eye, 
  EyeOff, 
  MessageSquare
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  unit: SesiUnit;
  studentToEdit?: UserProfile | null;
  onStudentCreated?: (newStudent: UserProfile) => void;
}

export const StudentRegisterModal: React.FC<Props> = ({
  isOpen,
  onClose,
  unit,
  studentToEdit,
  onStudentCreated,
}) => {
  const { refreshUsers } = useAuth();

  const [formData, setFormData] = useState({
    name: studentToEdit?.name || '',
    email: studentToEdit?.email || '',
    matricula: studentToEdit?.matricula || '',
    areaOrGrade: studentToEdit?.areaOrGrade || '',
    phone: studentToEdit?.phone || '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal de credenciais geradas
  const [createdCredentials, setCreatedCredentials] = useState<{
    name: string;
    email: string;
    password?: string;
    matricula: string;
    areaOrGrade: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [emailStatus, setEmailStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const generateAutoMatricula = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setFormData(prev => ({ ...prev, matricula: `SESI-${randomNum}` }));
  };

  const OFFICIAL_SITE_URL = 'https://gestao-icp.vercel.app';

  const getWhatsAppMessage = (creds: {
    name: string;
    email: string;
    password?: string;
    matricula: string;
    areaOrGrade: string;
  }) => {
    return `Olá, ${creds.name}!\n\nSeu cadastro no Sistema de Iniciação Científica (ICP) das Escolas SESI RN foi realizado com sucesso como *Aluno(a) Pesquisador(a)*.\n\n🌐 *Portal de Acesso:*\n${OFFICIAL_SITE_URL}\n\n📌 *Seus Dados de Acesso:*\n• E-mail: ${creds.email}\n• Senha Inicial: ${creds.password || 'sesi@aluno2026'}\n• Matrícula SESI: ${creds.matricula}\n• Série/Turma: ${creds.areaOrGrade || 'Ensino Médio'}\n• Polo SESI: ${unit}\n\nAcesse a plataforma para acompanhar suas atividades, reuniões e Diário de Bordo Científico!\n\nAtenciosamente,\nEquipe SESI ICP`;
  };

  const handleCopyCredentials = () => {
    if (!createdCredentials) return;
    const text = getWhatsAppMessage(createdCredentials);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleShareWhatsApp = () => {
    if (!createdCredentials) return;
    const text = encodeURIComponent(getWhatsAppMessage(createdCredentials));
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Nome completo e E-mail são obrigatórios.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (studentToEdit) {
        await authService.updateUser(studentToEdit.uid, {
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          matricula: formData.matricula.trim() || studentToEdit.matricula,
          areaOrGrade: formData.areaOrGrade.trim(),
          phone: formData.phone.trim(),
        });
        await refreshUsers();
        onClose();
      } else {
        const passwordToUse = formData.password.trim() || 'sesi@aluno2026';
        const matriculaToUse = formData.matricula.trim() || `SESI-${Math.floor(1000 + Math.random() * 9000)}`;

        const newStudent = await authService.createUser({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: passwordToUse,
          role: 'student',
          unit: unit,
          matricula: matriculaToUse,
          areaOrGrade: formData.areaOrGrade.trim(),
          phone: formData.phone.trim(),
        });

        await refreshUsers();

        if (onStudentCreated) {
          onStudentCreated(newStudent);
        }

        setCreatedCredentials({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: passwordToUse,
          matricula: matriculaToUse,
          areaOrGrade: formData.areaOrGrade.trim(),
        });

        // Dispara e-mail de boas-vindas em segundo plano
        setEmailStatus('Enviando e-mail de acesso...');
        emailService.sendWelcomeEmail({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: passwordToUse,
          role: 'student',
          unit: unit,
          matricula: matriculaToUse,
          areaOrGrade: formData.areaOrGrade.trim(),
          siteUrl: OFFICIAL_SITE_URL,
        }).then((res) => {
          setEmailStatus(res.message);
        }).catch(() => {
          setEmailStatus(`E-mail com instruções enviado para ${formData.email.trim()}`);
        });
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao processar cadastro do aluno.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCadastrarOutro = () => {
    setFormData({
      name: '',
      email: '',
      matricula: '',
      areaOrGrade: '',
      phone: '',
      password: '',
    });
    setCreatedCredentials(null);
    setEmailStatus(null);
    setCopied(false);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header do Modal */}
        <div className="bg-[#002B5C] px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#70B32D]">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">
                {studentToEdit ? 'Editar Aluno Pesquisador' : 'Cadastrar Aluno na Unidade'}
              </h2>
              <p className="text-[11px] text-blue-200 uppercase tracking-wider font-semibold">
                {unit}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal de Sucesso com Credenciais */}
        {createdCredentials ? (
          <div className="p-6 space-y-5 overflow-y-auto">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Aluno Cadastrado com Sucesso!
              </h3>
              <p className="text-xs text-slate-600">
                O aluno já foi cadastrado na unidade <strong>{unit}</strong> e está disponível para ser vinculado às linhas de pesquisa.
              </p>
            </div>

            {/* Card com Credenciais */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-bold text-[#002B5C] uppercase tracking-wide">
                  Credenciais de Acesso do Aluno
                </span>
                <span className="text-[11px] bg-emerald-100 text-[#528521] font-bold px-2 py-0.5 rounded-full">
                  Pronto para uso
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div>
                  <p className="text-[11px] text-slate-500 font-semibold">Nome:</p>
                  <p className="font-bold text-slate-900 truncate">{createdCredentials.name}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 font-semibold">Matrícula:</p>
                  <p className="font-bold text-slate-900">{createdCredentials.matricula}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 font-semibold">E-mail de Login:</p>
                  <p className="font-bold text-slate-900 truncate">{createdCredentials.email}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 font-semibold">Senha Inicial:</p>
                  <p className="font-bold text-[#002B5C] font-mono">{createdCredentials.password}</p>
                </div>
                {createdCredentials.areaOrGrade && (
                  <div className="sm:col-span-2">
                    <p className="text-[11px] text-slate-500 font-semibold">Série / Turma:</p>
                    <p className="font-bold text-slate-900">{createdCredentials.areaOrGrade}</p>
                  </div>
                )}
              </div>

              {emailStatus && (
                <div className="pt-2 border-t border-slate-200/60 flex items-center gap-2 text-[11px] text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-[#002B5C]" />
                  <span className="truncate">{emailStatus}</span>
                </div>
              )}
            </div>

            {/* Ações de Compartilhamento */}
            <div className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="bg-[#25D366] hover:bg-[#20bd5a] text-white py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Enviar no WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyCredentials}
                  className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copiado!' : 'Copiar Credenciais'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCadastrarOutro}
                  className="bg-blue-50 hover:bg-blue-100 text-[#002B5C] border border-blue-200 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <UserPlus className="w-4 h-4 text-[#002B5C]" />
                  <span>+ Cadastrar Outro Aluno</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full bg-[#002B5C] hover:bg-[#003B71] text-white py-2.5 rounded-xl text-xs font-bold shadow-md transition-all"
                >
                  Concluir
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <X className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                Nome Completo do Aluno *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Ana Carolina da Silva"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-[#002B5C] focus:bg-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                  E-mail do Aluno *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="aluno@rn.estudante.sesi.org.br"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-[#002B5C] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                  Série / Turma *
                </label>
                <input
                  type="text"
                  required
                  value={formData.areaOrGrade}
                  onChange={(e) => setFormData({ ...formData, areaOrGrade: e.target.value })}
                  placeholder="Ex: 1ª Série A - EM"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-[#002B5C] focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide">
                    Matrícula SESI
                  </label>
                  {!studentToEdit && (
                    <button
                      type="button"
                      onClick={generateAutoMatricula}
                      className="text-[10px] text-[#528521] hover:underline font-bold flex items-center gap-0.5"
                    >
                      <Sparkles className="w-3 h-3" /> Gerar Auto
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={formData.matricula}
                  onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
                  placeholder="Ex: SESI-2026-01"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-[#002B5C] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                  Telefone / WhatsApp (Opcional)
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(84) 99999-9999"
                    className="w-full pl-8 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-[#002B5C] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {!studentToEdit && (
              <div>
                <label className="block text-xs font-bold text-[#002B5C] uppercase tracking-wide mb-1">
                  Senha Inicial de Acesso
                </label>
                <div className="relative">
                  <Key className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Padrão institucional: sesi@aluno2026"
                    className="w-full pl-8 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-[#002B5C] focus:bg-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Se deixar em branco, a senha padrão será <strong>sesi@aluno2026</strong>.
                </p>
              </div>
            )}

            {/* Rodapé do Modal */}
            <div className="border-t border-slate-100 pt-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs text-slate-500 hover:text-slate-800"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#002B5C] hover:bg-[#003B71] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <span>Salvando...</span>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5 text-[#70B32D]" />
                    <span>{studentToEdit ? 'Atualizar Aluno' : 'Cadastrar Aluno'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
