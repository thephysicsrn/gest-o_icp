import { sendPasswordResetEmail } from 'firebase/auth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config';
import { SesiUnit, UserRole } from '../../types';

export interface WelcomeEmailPayload {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  unit: SesiUnit;
  siteUrl?: string;
}

export const emailService = {
  /**
   * Dispara automaticamente o e-mail de boas-vindas e acesso em segundo plano
   */
  sendWelcomeEmail: async (payload: WelcomeEmailPayload): Promise<{ success: boolean; method: string; message: string }> => {
    const siteUrl = payload.siteUrl || 'https://gestao-icp.vercel.app';
    const roleName = payload.role === 'teacher' ? 'Professor(a) Pesquisador(a) Líder' : payload.role === 'student' ? 'Aluno(a) Pesquisador(a)' : 'Administrador(a)';
    const cleanEmail = payload.email.trim().toLowerCase();

    let serverlessSent = false;

    // 1. Tenta envio através do endpoint serverless da Vercel (/api/send-email) se disponível
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: cleanEmail,
          name: payload.name,
          role: roleName,
          unit: payload.unit,
          password: payload.password,
          siteUrl,
        }),
      });
      if (res.ok) {
        serverlessSent = true;
      }
    } catch {
      // Endpoint serverless opcional em modo local
    }

    // 2. Registra a mensagem na coleção 'mail' do Firestore (para extensão Firebase Email Trigger e auditoria)
    try {
      await addDoc(collection(db, 'mail'), {
        to: cleanEmail,
        message: {
          subject: 'Acesso ao Sistema de Iniciação Científica (ICP) - SESI RN',
          text: `Olá, ${payload.name}!\n\nSeu cadastro no Sistema de Iniciação Científica (ICP) das Escolas SESI RN foi concluído com sucesso como ${roleName}.\n\nPortal de Acesso: ${siteUrl}\nE-mail: ${cleanEmail}\nSenha Provisória: ${payload.password}\nPolo SESI: ${payload.unit}\n\nAcesse o portal para gerenciar seus grupos e linhas de pesquisa!`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;">
              <div style="background-color: #002B5C; padding: 20px; text-align: center; border-radius: 8px; color: white;">
                <h1 style="margin: 0; font-size: 20px;">SESI Iniciação Científica e Pesquisa (ICP)</h1>
                <p style="margin: 5px 0 0 0; font-size: 13px; color: #93c5fd;">Escolas SESI Rio Grande do Norte</p>
              </div>
              <div style="padding: 20px 0; color: #334155; line-height: 1.6;">
                <p>Olá, <strong>${payload.name}</strong>!</p>
                <p>Seu cadastro no sistema institucional de gestão de iniciação científica foi realizado com sucesso com a função de <strong>${roleName}</strong>.</p>
                
                <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 15px; margin: 20px 0;">
                  <p style="margin: 0 0 8px 0; font-weight: bold; color: #002B5C;">📌 Dados de Acesso:</p>
                  <p style="margin: 4px 0;"><strong>• E-mail:</strong> ${cleanEmail}</p>
                  <p style="margin: 4px 0;"><strong>• Senha Provisória:</strong> <code style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">${payload.password}</code></p>
                  <p style="margin: 4px 0;"><strong>• Polo SESI:</strong> ${payload.unit}</p>
                </div>

                <div style="text-align: center; margin: 30px 0;">
                  <a href="${siteUrl}" style="background-color: #70B32D; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                    Acessar Plataforma ICP SESI
                  </a>
                </div>

                <p style="font-size: 12px; color: #64748b;">Se o botão não funcionar, copie e cole este link no seu navegador: <br/><a href="${siteUrl}">${siteUrl}</a></p>
              </div>
              <div style="border-top: 1px solid #e2e8f0; padding-top: 15px; text-align: center; font-size: 11px; color: #94a3b8;">
                Sistema FIERN • SESI RN — Departamento Regional do Rio Grande do Norte
              </div>
            </div>
          `,
        },
        createdAt: serverTimestamp(),
        status: serverlessSent ? 'sent_serverless' : 'queued',
      });
    } catch {
      // Ignora erro de gravação em auditoria se houver
    }

    // 3. Dispara e-mail oficial de definição/acesso do Firebase Auth
    try {
      await sendPasswordResetEmail(auth, cleanEmail);
      return {
        success: true,
        method: 'firebase_auth',
        message: `E-mail de acesso e ativação enviado automaticamente para ${cleanEmail}`,
      };
    } catch (err: any) {
      if (serverlessSent) {
        return {
          success: true,
          method: 'serverless',
          message: `E-mail de boas-vindas enviado automaticamente para ${cleanEmail}`,
        };
      }
      return {
        success: false,
        method: 'manual',
        message: `Cadastro realizado. Notificação registrada para ${cleanEmail}.`,
      };
    }
  },
};
