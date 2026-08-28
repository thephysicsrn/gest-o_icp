import emailjs from '@emailjs/browser';
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

export interface EmailjsConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
}

export const emailService = {
  /**
   * Obtém as configurações do EmailJS salvas no Firestore
   */
  getEmailjsConfig: async (): Promise<EmailjsConfig | null> => {
    try {
      const snap = await getDoc(doc(db, 'settings', 'emailjs'));
      if (snap.exists() && snap.data().publicKey && snap.data().serviceId) {
        return {
          serviceId: snap.data().serviceId,
          templateId: snap.data().templateId,
          publicKey: snap.data().publicKey,
        };
      }
    } catch {
      // ignore
    }
    return null;
  },

  /**
   * Salva as configurações do EmailJS no Firestore
   */
  saveEmailjsConfig: async (config: EmailjsConfig): Promise<void> => {
    await setDoc(doc(db, 'settings', 'emailjs'), {
      serviceId: config.serviceId.trim(),
      templateId: config.templateId.trim(),
      publicKey: config.publicKey.trim(),
      updatedAt: serverTimestamp(),
    }, { merge: true });
  },

  /**
   * Testa o disparo com os dados informados
   */
  testEmailjs: async (config: EmailjsConfig, testEmail: string): Promise<boolean> => {
    const cleanEmail = testEmail.trim();
    const response = await emailjs.send(
      config.serviceId.trim(),
      config.templateId.trim(),
      {
        to_email: cleanEmail,
        user_email: cleanEmail,
        email: cleanEmail,
        to: cleanEmail,
        recipient: cleanEmail,
        reply_to: cleanEmail,
        to_name: 'Usuário Teste SESI ICP',
        name: 'Usuário Teste SESI ICP',
        user_name: 'Usuário Teste SESI ICP',
        user_role: 'Administrador(a)',
        role: 'Administrador(a)',
        user_unit: 'SESI RN',
        unit: 'SESI RN',
        user_password: 'teste@acesso2026',
        password: 'teste@acesso2026',
        user_matricula: 'SESI-TESTE',
        matricula: 'SESI-TESTE',
        user_grade: 'Geral',
        site_url: 'https://gestao-icp.vercel.app',
      },
      config.publicKey.trim()
    );
    return response.status === 200;
  },

  /**
   * Envia o e-mail oficial formatado em Português SESI RN via EmailJS / Nuvem
   */
  sendWelcomeEmail: async (payload: WelcomeEmailPayload): Promise<{ success: boolean; method: string; message: string }> => {
    const siteUrl = payload.siteUrl || 'https://gestao-icp.vercel.app';
    const isStudent = payload.role === 'student';
    const roleName = isStudent ? 'Aluno(a) Pesquisador(a)' : payload.role === 'teacher' ? 'Professor(a) Pesquisador(a) Líder' : 'Administrador(a)';
    const cleanEmail = payload.email.trim().toLowerCase();

    let emailjsSent = false;
    let errorMessage = '';

    // 1. Tenta envio via EmailJS com suporte a todas as variações de nomes de variáveis
    try {
      const emailjsConfig = await emailService.getEmailjsConfig();
      if (emailjsConfig && emailjsConfig.serviceId && emailjsConfig.publicKey) {
        const res = await emailjs.send(
          emailjsConfig.serviceId,
          emailjsConfig.templateId,
          {
            to_email: cleanEmail,
            user_email: cleanEmail,
            email: cleanEmail,
            to: cleanEmail,
            recipient: cleanEmail,
            reply_to: cleanEmail,
            to_name: payload.name,
            user_name: payload.name,
            name: payload.name,
            user_role: roleName,
            role: roleName,
            user_unit: payload.unit,
            unit: payload.unit,
            user_password: payload.password,
            password: payload.password,
            user_matricula: payload.matricula || 'SESI-ICP',
            matricula: payload.matricula || 'SESI-ICP',
            user_grade: payload.areaOrGrade || 'Geral',
            area_grade: payload.areaOrGrade || 'Geral',
            site_url: siteUrl,
          },
          emailjsConfig.publicKey
        );

        if (res.status === 200) {
          emailjsSent = true;
        }
      }
    } catch (err: any) {
      errorMessage = err.text || err.message;
      console.warn('Erro ao enviar via EmailJS:', errorMessage);
    }

    // 2. Registra auditoria no Firestore
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
        status: emailjsSent ? 'sent_emailjs' : 'fallback_required',
      });
    } catch {
      // ignore
    }

    if (emailjsSent) {
      return {
        success: true,
        method: 'emailjs',
        message: `E-mail de acesso entregue automaticamente para ${cleanEmail}`,
      };
    }

    return {
      success: false,
      method: 'manual',
      message: errorMessage 
        ? `Aviso EmailJS: ${errorMessage}. Use o botão "Disparar E-mail" abaixo.`
        : `Credenciais registradas. Para envio 100% automático, configure o EmailJS no menu superior.`,
    };
  },
};
