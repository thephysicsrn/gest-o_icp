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
    let errorMessage = '';

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

      const data = await res.json();
      if (res.ok && data.sent) {
        serverlessSent = true;
      } else if (data.error || data.message) {
        errorMessage = data.error || data.message;
        if (errorMessage.includes('own email address')) {
          errorMessage = 'Chave Resend em modo Sandbox (envia apenas para o seu e-mail cadastrado no Resend). Use o botão abaixo para enviar.';
        }
      }
    } catch (err: any) {
      errorMessage = err.message;
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
        status: serverlessSent ? 'sent' : 'fallback_required',
      });
    } catch {
      // ignore
    }

    if (serverlessSent) {
      return {
        success: true,
        method: 'cloud_smtp',
        message: `E-mail oficial institucional entregue com sucesso para ${cleanEmail}`,
      };
    }

    return {
      success: false,
      method: 'sandbox_or_manual',
      message: errorMessage || `Credenciais registradas. Clique no botão "Disparar E-mail Institucional" abaixo para enviar para ${cleanEmail}.`,
    };
  },
};
