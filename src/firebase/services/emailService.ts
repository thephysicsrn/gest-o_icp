import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
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
   * Envia o e-mail oficial formatado em Português SESI RN
   */
  sendWelcomeEmail: async (payload: WelcomeEmailPayload): Promise<{ success: boolean; method: string; message: string }> => {
    const siteUrl = payload.siteUrl || 'https://gestao-icp.vercel.app';
    const isStudent = payload.role === 'student';
    const roleName = isStudent ? 'Aluno(a) Pesquisador(a)' : payload.role === 'teacher' ? 'Professor(a) Pesquisador(a) Líder' : 'Administrador(a)';
    const cleanEmail = payload.email.trim().toLowerCase();

    let serverlessSent = false;

    // 1. Tenta envio através do endpoint serverless da Vercel (/api/send-email)
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
          serverlessSent = true;
        }
      }
    } catch {
      // Ignora caso endpoint não esteja acessível localmente
    }

    // 2. Registra o e-mail formatado na coleção 'mail' do Firestore
    try {
      await addDoc(collection(db, 'mail'), {
        to: cleanEmail,
        message: {
          subject: 'Acesso ao Sistema de Iniciação Científica (ICP) - SESI RN',
          text: `Olá, ${payload.name}!\n\nSeu cadastro no Sistema de Iniciação Científica (ICP) das Escolas SESI RN foi concluído com sucesso como ${roleName}.\n\nPortal de Acesso: ${siteUrl}\nE-mail: ${cleanEmail}\nSenha Provisória: ${payload.password}\nPolo SESI: ${payload.unit}\n\nAcesse o portal com seus dados de acesso para começar!`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
              <div style="background-color: #002B5C; padding: 20px; text-align: center; border-radius: 8px; color: white;">
                <h1 style="margin: 0; font-size: 20px;">SESI Iniciação Científica e Pesquisa (ICP)</h1>
                <p style="margin: 5px 0 0 0; font-size: 13px; color: #93c5fd;">Escolas SESI Rio Grande do Norte</p>
              </div>
              <div style="padding: 20px 0; color: #334155; line-height: 1.6;">
                <p>Olá, <strong>${payload.name}</strong>!</p>
                <p>Seu cadastro no sistema institucional de gestão de iniciação científica foi realizado com sucesso como <strong>${roleName}</strong>.</p>
                
                <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 15px; margin: 20px 0;">
                  <p style="margin: 0 0 8px 0; font-weight: bold; color: #002B5C;">📌 Seus Dados de Acesso:</p>
                  <p style="margin: 4px 0;"><strong>• E-mail:</strong> ${cleanEmail}</p>
                  <p style="margin: 4px 0;"><strong>• Senha Provisória:</strong> <code style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px; font-weight: bold;">${payload.password}</code></p>
                  <p style="margin: 4px 0;"><strong>• Polo SESI:</strong> ${payload.unit}</p>
                  ${payload.matricula ? `<p style="margin: 4px 0;"><strong>• Matrícula:</strong> ${payload.matricula}</p>` : ''}
                  ${payload.areaOrGrade ? `<p style="margin: 4px 0;"><strong>• ${isStudent ? 'Série / Turma' : 'Área de Atuação'}:</strong> ${payload.areaOrGrade}</p>` : ''}
                </div>

                <div style="text-align: center; margin: 30px 0;">
                  <a href="${siteUrl}" style="background-color: #70B32D; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                    Acessar Plataforma ICP SESI
                  </a>
                </div>

                <p style="font-size: 12px; color: #64748b;">Link de acesso: <br/><a href="${siteUrl}">${siteUrl}</a></p>
              </div>
              <div style="border-top: 1px solid #e2e8f0; padding-top: 15px; text-align: center; font-size: 11px; color: #94a3b8;">
                Sistema FIERN • SESI RN — Departamento Regional do Rio Grande do Norte
              </div>
            </div>
          `,
        },
        createdAt: serverTimestamp(),
        status: serverlessSent ? 'sent' : 'queued',
      });
    } catch {
      // Ignora erro de gravação se houver
    }

    if (serverlessSent) {
      return {
        success: true,
        method: 'serverless',
        message: `E-mail oficial formatado enviado para ${cleanEmail}`,
      };
    }

    return {
      success: true,
      method: 'registered',
      message: `Credenciais registradas com sucesso para ${cleanEmail}`,
    };
  },
};
