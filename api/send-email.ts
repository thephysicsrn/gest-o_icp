import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, name, role, unit, matricula, areaOrGrade, password, siteUrl, apiKey } = req.body || {};

  if (!to || !name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const resendApiKey = process.env.RESEND_API_KEY || apiKey;

  if (resendApiKey) {
    try {
      const isStudent = role?.toLowerCase().includes('aluno');
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'SESI ICP RN <onboarding@resend.dev>',
          to: [to],
          subject: 'Acesso ao Sistema de Iniciação Científica (ICP) - SESI RN',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
              <div style="background-color: #002B5C; padding: 24px; text-align: center; border-radius: 8px; color: white;">
                <h1 style="margin: 0; font-size: 22px; font-weight: bold;">SESI Iniciação Científica e Pesquisa (ICP)</h1>
                <p style="margin: 6px 0 0 0; font-size: 13px; color: #93c5fd;">Escolas SESI Rio Grande do Norte</p>
              </div>
              <div style="padding: 24px 0; color: #334155; line-height: 1.6;">
                <p style="font-size: 15px;">Olá, <strong>${name}</strong>!</p>
                <p>Seu cadastro no sistema institucional de gestão de iniciação científica foi realizado com sucesso como <strong>${role}</strong>.</p>
                
                <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 18px; margin: 20px 0;">
                  <p style="margin: 0 0 10px 0; font-weight: bold; color: #002B5C; font-size: 14px;">📌 Seus Dados de Acesso:</p>
                  <p style="margin: 5px 0;"><strong>• E-mail Institucional:</strong> ${to}</p>
                  <p style="margin: 5px 0;"><strong>• Senha Provisória:</strong> <code style="background: #e2e8f0; padding: 3px 8px; border-radius: 4px; font-weight: bold; color: #528521; font-family: monospace;">${password}</code></p>
                  <p style="margin: 5px 0;"><strong>• Polo SESI:</strong> ${unit}</p>
                  ${matricula ? `<p style="margin: 5px 0;"><strong>• Matrícula:</strong> ${matricula}</p>` : ''}
                  ${areaOrGrade ? `<p style="margin: 5px 0;"><strong>• ${isStudent ? 'Série / Turma' : 'Área de Atuação'}:</strong> ${areaOrGrade}</p>` : ''}
                </div>

                <div style="text-align: center; margin: 30px 0;">
                  <a href="${siteUrl || 'https://gestao-icp.vercel.app'}" style="background-color: #70B32D; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">
                    Acessar Plataforma ICP SESI
                  </a>
                </div>

                <p style="font-size: 12px; color: #64748b; text-align: center;">
                  Link direto: <a href="${siteUrl || 'https://gestao-icp.vercel.app'}" style="color: #002B5C;">${siteUrl || 'https://gestao-icp.vercel.app'}</a>
                </p>
              </div>
              <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; text-align: center; font-size: 11px; color: #94a3b8;">
                Sistema FIERN • SESI RN — Departamento Regional do Rio Grande do Norte
              </div>
            </div>
          `,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        return res.status(200).json({ sent: false, error: data.message || 'Erro no provedor de e-mail Resend' });
      }
      return res.status(200).json({ sent: true, data });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(200).json({
    sent: false,
    message: 'Nenhuma chave Resend configurada.',
  });
}
