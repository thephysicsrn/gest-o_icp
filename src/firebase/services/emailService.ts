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

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="background-color: #002B5C; padding: 24px; text-align: center; border-radius: 8px; color: white;">
          <h1 style="margin: 0; font-size: 22px; font-weight: bold;">SESI Iniciação Científica e Pesquisa (ICP)</h1>
          <p style="margin: 6px 0 0 0; font-size: 13px; color: #93c5fd;">Escolas SESI Rio Grande do Norte</p>
        </div>
        <div style="padding: 24px 0; color: #334155; line-height: 1.6;">
          <p style="font-size: 15px;">Olá, <strong>${payload.name}</strong>!</p>
          <p>Seu cadastro no sistema institucional de gestão de iniciação científica foi realizado com sucesso como <strong>${roleName}</strong>.</p>
          
          <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 18px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0; font-weight: bold; color: #002B5C; font-size: 14px;">📌 Seus Dados de Acesso:</p>
            <p style="margin: 5px 0;"><strong>• E-mail Institucional:</strong> ${cleanEmail}</p>
            <p style="margin: 5px 0;"><strong>• Senha Provisória:</strong> <code style="background: #e2e8f0; padding: 3px 8px; border-radius: 4px; font-weight: bold; color: #528521; font-family: monospace;">${payload.password}</code></p>
            <p style="margin: 5px 0;"><strong>• Polo SESI:</strong> ${payload.unit}</p>
            ${payload.matricula ? `<p style="margin: 5px 0;"><strong>• Matrícula:</strong> ${payload.matricula}</p>` : ''}
            ${payload.areaOrGrade ? `<p style="margin: 5px 0;"><strong>• ${isStudent ? 'Série / Turma' : 'Área de Atuação'}:</strong> ${payload.areaOrGrade}</p>` : ''}
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${siteUrl}" style="background-color: #70B32D; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">
              Acessar Plataforma ICP SESI
            </a>
          </div>

          <p style="font-size: 12px; color: #64748b; text-align: center;">
            Link direto: <a href="${siteUrl}" style="color: #002B5C;">${siteUrl}</a>
          </p>
        </div>
        <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; text-align: center; font-size: 11px; color: #94a3b8;">
          Sistema FIERN • SESI RN — Departamento Regional do Rio Grande do Norte
        </div>
      </div>
    `;

    // 1. Verifica se há chave Resend salva no Firestore ou envia via API serverless
    let directSent = false;
    try {
      const apiKey = await emailService.getApiKey();
      if (apiKey) {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'SESI ICP RN <onboarding@resend.dev>',
            to: [cleanEmail],
            subject: 'Acesso ao Sistema de Iniciação Científica (ICP) - SESI RN',
            html: htmlBody,
          }),
        });
        if (response.ok) {
          directSent = true;
        }
      }
    } catch {
      // continua para tentativa serverless
    }

    if (!directSent) {
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
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.sent) {
            directSent = true;
          }
        }
      } catch {
        // ignore
      }
    }

    // 2. Registra na fila do Firestore
    try {
      await addDoc(collection(db, 'mail'), {
        to: cleanEmail,
        message: {
          subject: 'Acesso ao Sistema de Iniciação Científica (ICP) - SESI RN',
          html: htmlBody,
        },
        createdAt: serverTimestamp(),
        status: directSent ? 'sent' : 'queued',
      });
    } catch {
      // ignore
    }

    if (directSent) {
      return {
        success: true,
        method: 'cloud_smtp',
        message: `E-mail oficial formatado entregue na caixa de entrada de ${cleanEmail}`,
      };
    }

    return {
      success: false,
      method: 'manual',
      message: `Credenciais registradas. Utilize o botão "Disparar E-mail" para enviar ou configure a chave de envio automático.`,
    };
  },
};
