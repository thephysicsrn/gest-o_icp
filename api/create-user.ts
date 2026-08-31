import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as admin from 'firebase-admin';

// Inicializa o Firebase Admin SDK se ainda não estiver inicializado
if (!admin.apps.length) {
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (serviceAccountKey) {
    try {
      const serviceAccount = JSON.parse(serviceAccountKey);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: 'sesi-icp-rn',
      });
    } catch {
      admin.initializeApp({ projectId: 'sesi-icp-rn' });
    }
  } else {
    admin.initializeApp({ projectId: 'sesi-icp-rn' });
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, password, role, unit, matricula, phone, areaOrGrade } = req.body || {};

  if (!name || !email || !role || !unit) {
    return res.status(400).json({ error: 'Nome, e-mail, perfil e unidade são obrigatórios.' });
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const defaultPassword = role === 'student' ? 'sesi@aluno2026' : role === 'teacher' ? 'sesi@prof2026' : 'sesi@admin2026';
  const pwdToUse = password || defaultPassword;

  try {
    let uid = '';

    // 1. Cria ou recupera o usuário no Firebase Auth
    try {
      const userRecord = await admin.auth().createUser({
        email: cleanEmail,
        password: pwdToUse,
        displayName: String(name).trim(),
      });
      uid = userRecord.uid;
    } catch (authErr: any) {
      if (authErr.code === 'auth/email-already-exists') {
        const existing = await admin.auth().getUserByEmail(cleanEmail);
        uid = existing.uid;
        // Atualiza senha se fornecida
        if (password) {
          await admin.auth().updateUser(uid, { password: pwdToUse, displayName: String(name).trim() });
        }
      } else {
        throw authErr;
      }
    }

    // 2. Cria / Atualiza no Firestore
    const userProfile = {
      uid,
      name: String(name).trim(),
      email: cleanEmail,
      role,
      unit,
      matricula: String(matricula || '').trim() || `SESI-${Math.floor(1000 + Math.random() * 9000)}`,
      phone: String(phone || '').trim(),
      areaOrGrade: String(areaOrGrade || '').trim(),
      createdAt: new Date().toISOString(),
    };

    await admin.firestore().collection('users').doc(uid).set({
      ...userProfile,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    return res.status(200).json({ success: true, profile: userProfile });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Erro ao criar usuário no servidor.' });
  }
}
