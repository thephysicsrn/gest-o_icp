import { doc, getDoc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../config';
import { SesiUnit, UserRole } from '../../types';

export interface WelcomeEmailPayload {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  unit: SesiUnit;
  matricula?: string;
  areaOrGrade?: string;
  siteUrl?: string;
}

export const emailService = {
  /**
   * Obtém a chave de API do Resend configurada no Firestore
   */
  getApiKey: async (): Promise<string | null> => {
    try {
      const snap = await getDoc(doc(db, 'settings', 'email'));
      if (snap.exists() && snap.data().resendApiKey) {
        return snap.data().resendApiKey;
      }
    } catch {
      // ignore
    }
    return null;
  },

  /**
   * Salva a chave de API do Resend no Firestore
   */
  saveApiKey: async (resendApiKey: string): Promise<void> => {
    await setDoc(doc(db, 'settings', 'email'), {
      resendApiKey: resendApiKey.trim(),
      updatedAt: serverTimestamp(),
    }, { merge: true });
  },

  /**
   * Envia o e-mail oficial formatado em Português SESI RN diretamente da nuvem
   */
  sendWelcomeEmail: async (payload: WelcomeEmailPayload): Promise<{ success: boolean; method: string; message: string }> => {
    const siteUrl = payload.siteUrl || 'https://gestao-icp.vercel.app';
    const isStudent = payload.role === 'student';
    const roleName = isStudent ? 'Aluno(a) Pesquisador(a)' : payload.role === 'teacher' ? 'Professor(a) Pesquisador(a) Líder' : 'Administrador(a)';
    const cleanEmail = payload.email.trim().toLowerCase();

    const apiKey = await emailService.getApiKey();

    let serverlessSent = false;
    let resendMessage = '';

    // Envia através do endpoint serverless da Vercel (/api/send-email)
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: cleanEmail,
          name: payload.name,
          role: roleName,
          unit: payload.unit,
          matricula: payload.matricula,
          areaOrGrade: payload.areaOrGrade,
          password: payload.password,
          siteUrl,
          apiKey,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.sent) {
          serverlessSent = true;
          resendMessage = `E-mail oficial institucional entregue com sucesso para ${cleanEmail}`;
        }
      }
    } catch (err: any) {
      console.warn('Erro ao chamar /api/send-email:', err.message);
    }

    // Registra na coleção de auditoria do Firestore
    try {
      await addDoc(collection(db, 'mail'), {
        to: cleanEmail,
        message: {
          subject: 'Acesso ao Sistema de Iniciação Científica (ICP) - SESI RN',
          recipient: payload.name,
          role: roleName,
          unit: payload.unit,
        },
        createdAt: serverTimestamp(),
        status: serverlessSent ? 'sent' : 'queued',
      });
    } catch {
      // ignore
    }

    if (serverlessSent) {
      return {
        success: true,
        method: 'cloud_smtp',
        message: resendMessage || `E-mail oficial formatado entregue na caixa de entrada de ${cleanEmail}`,
      };
    }

    return {
      success: true,
      method: 'registered',
      message: `Credenciais registradas para ${cleanEmail}. Você também pode usar os botões abaixo para envio imediato.`,
    };
  },
};
