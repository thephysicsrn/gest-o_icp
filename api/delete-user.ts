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

  const { uid, email } = req.body || {};

  if (!uid && !email) {
    return res.status(400).json({ error: 'UID or email is required' });
  }

  try {
    let targetUid = uid;

    if (!targetUid && email) {
      const userRecord = await admin.auth().getUserByEmail(email);
      targetUid = userRecord.uid;
    }

    if (targetUid) {
      // 1. Remove do Firebase Authentication
      try {
        await admin.auth().deleteUser(targetUid);
      } catch (authErr: any) {
        console.warn('Auth deletion warning:', authErr.message);
      }

      // 2. Remove do Firestore
      try {
        await admin.firestore().collection('users').doc(targetUid).delete();
      } catch (dbErr: any) {
        console.warn('Firestore deletion warning:', dbErr.message);
      }
    }

    return res.status(200).json({ success: true, message: `Usuário ${targetUid || email} removido completamente.` });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Erro ao remover usuário' });
  }
}
