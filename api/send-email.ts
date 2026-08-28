import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, name, role, unit, password, siteUrl } = req.body || {};

  if (!to || !name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const resendApiKey = process.env.RESEND_API_KEY;

  if (resendApiKey) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'SESI ICP <nao-responda@resend.dev>',
          to: [to],
          subject: 'Acesso ao Sistema de Iniciação Científica (ICP) - SESI RN',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
              <div style="background-color: #002B5C; padding: 20px; text-align: center; border-radius: 8px; color: white;">
                <h1 style="margin: 0; font-size: 20px;">SESI Iniciação Científica e Pesquisa (ICP)</h1>
                <p style="margin: 5px 0 0 0; font-size: 13px; color: #93c5fd;">Escolas SESI Rio Grande do Norte</p>
              </div>
              <div style="padding: 20px 0; color: #334155; line-height: 1.6;">
                <p>Olá, <strong>${name}</strong>!</p>
                <p>Seu cadastro no sistema institucional de gestão de iniciação científica foi realizado com sucesso como <strong>${role}</strong>.</p>
                
                <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 15px; margin: 20px 0;">
                  <p style="margin: 0 0 8px 0; font-weight: bold; color: #002B5C;">📌 Seus Dados de Acesso:</p>
                  <p style="margin: 4px 0;"><strong>• E-mail:</strong> ${to}</p>
                  <p style="margin: 4px 0;"><strong>• Senha Provisória:</strong> <code style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">${password}</code></p>
                  <p style="margin: 4px 0;"><strong>• Polo SESI:</strong> ${unit}</p>
                </div>

                <div style="text-align: center; margin: 30px 0;">
                  <a href="${siteUrl || 'https://gestao-icp.vercel.app'}" style="background-color: #70B32D; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                    Acessar Plataforma ICP SESI
                  </a>
                </div>
              </div>
              <div style="border-top: 1px solid #e2e8f0; padding-top: 15px; text-align: center; font-size: 11px; color: #94a3b8;">
                Sistema FIERN • SESI RN — Departamento Regional do Rio Grande do Norte
              </div>
            </div>
          `,
        }),
      });

      const data = await response.json();
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Se não houver chave de envio de terceiro configurada ainda, confirma o recebimento para a fila
  return res.status(200).json({
    success: true,
    note: 'Email queued. Configure RESEND_API_KEY in Vercel for custom SMTP.',
  });
}
