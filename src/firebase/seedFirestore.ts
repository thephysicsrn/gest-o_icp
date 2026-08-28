import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAHnDmlVftPYd8KwNl5p0IO2zZIKkcKd1I",
  authDomain: "sesi-icp-rn.firebaseapp.com",
  projectId: "sesi-icp-rn",
  storageBucket: "sesi-icp-rn.firebasestorage.app",
  messagingSenderId: "455141586793",
  appId: "1:455141586793:web:ef57fcbc3144fab1b06ff8",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const USERS_SEED = [
  // Admins Gerais
  {
    email: 'admin@sesi.org.br',
    password: 'sesi@admin2026',
    name: 'Coordenação Regional SESI RN',
    role: 'admin',
    unit: 'SESI SÃO GONÇALO DO AMARANTE',
    matricula: 'ADM-9901',
    phone: '(84) 3200-1000',
    areaOrGrade: 'Gestão Pedagógica & Inovação',
  },
  {
    email: 'carolinefernandes@rn.sesi.org.br',
    password: 'K9#mP4$vX8',
    name: 'Caroline Fernandes',
    role: 'admin',
    unit: 'SESI SÃO GONÇALO DO AMARANTE',
    matricula: 'ADM-2026-01',
    phone: '(84) 3200-2001',
    areaOrGrade: 'Coordenação Regional de Iniciação Científica',
  },
  {
    email: 'franciscalima@rn.sesi.org.br',
    password: 'T7@wL2&qR5',
    name: 'Francisca Lima',
    role: 'admin',
    unit: 'SESI MACAU',
    matricula: 'ADM-2026-02',
    phone: '(84) 3200-2002',
    areaOrGrade: 'Gestão Pedagógica & Avaliação Regional',
  },
  {
    email: 'mateussilva@rn.sesi.org.br',
    password: 'Z3!yN6*bF9',
    name: 'Mateus Silva',
    role: 'admin',
    unit: 'SESI SÃO GONÇALO DO AMARANTE',
    matricula: 'ADM-2026-03',
    phone: '(84) 3200-2003',
    areaOrGrade: 'Supervisão de Projetos & Inovação Regional',
  },
  // Professores
  {
    email: 'carlos.medeiros@sesi.org.br',
    password: 'sesi@prof2026',
    name: 'Prof. Dr. Carlos Eduardo Medeiros',
    role: 'teacher',
    unit: 'SESI SÃO GONÇALO DO AMARANTE',
    matricula: 'PROF-4412',
    phone: '(84) 99123-4567',
    areaOrGrade: 'Engenharia & Robótica',
  },
  {
    email: 'juliana.albuquerque@sesi.org.br',
    password: 'sesi@prof2026',
    name: 'Profa. Dra. Juliana Albuquerque',
    role: 'teacher',
    unit: 'SESI MACAU',
    matricula: 'PROF-3321',
    phone: '(84) 98877-6655',
    areaOrGrade: 'Química & Sustentabilidade',
  },
  {
    email: 'lucas.costa@sesi.org.br',
    password: 'sesi@prof2026',
    name: 'Prof. Me. Lucas Ferreira Costa',
    role: 'teacher',
    unit: 'SESI MOSSORÓ',
    matricula: 'PROF-7789',
    phone: '(84) 99432-1122',
    areaOrGrade: 'Física & Inteligência Artificial',
  },
  // Alunos SGA
  {
    email: 'arthur.silva@aluno.sesi.org.br',
    password: 'sesi@aluno2026',
    name: 'Arthur Vinícius Silva',
    role: 'student',
    unit: 'SESI SÃO GONÇALO DO AMARANTE',
    matricula: 'ALU-2026-01',
    phone: '(84) 99988-1111',
    areaOrGrade: '3ª Série do Ensino Médio - Turma A',
  },
  {
    email: 'beatriz.ramos@aluno.sesi.org.br',
    password: 'sesi@aluno2026',
    name: 'Beatriz Vasconcelos Ramos',
    role: 'student',
    unit: 'SESI SÃO GONÇALO DO AMARANTE',
    matricula: 'ALU-2026-02',
    phone: '(84) 99988-2222',
    areaOrGrade: '2ª Série do Ensino Médio - Turma B',
  },
  {
    email: 'caio.meireles@aluno.sesi.org.br',
    password: 'sesi@aluno2026',
    name: 'Caio Felipe Meireles',
    role: 'student',
    unit: 'SESI SÃO GONÇALO DO AMARANTE',
    matricula: 'ALU-2026-03',
    phone: '(84) 99988-3333',
    areaOrGrade: '3ª Série do Ensino Médio - Turma A',
  },
  {
    email: 'daniela.moura@aluno.sesi.org.br',
    password: 'sesi@aluno2026',
    name: 'Daniela Fontes Moura',
    role: 'student',
    unit: 'SESI SÃO GONÇALO DO AMARANTE',
    matricula: 'ALU-2026-04',
    phone: '(84) 99988-4444',
    areaOrGrade: '2ª Série do Ensino Médio - Turma A',
  },
  {
    email: 'enzo.soares@aluno.sesi.org.br',
    password: 'sesi@aluno2026',
    name: 'Enzo Gabriel Soares',
    role: 'student',
    unit: 'SESI SÃO GONÇALO DO AMARANTE',
    matricula: 'ALU-2026-05',
    phone: '(84) 99988-5555',
    areaOrGrade: '1ª Série do Ensino Médio - Turma C',
  },
  // Alunos Macau
  {
    email: 'fernanda.nogueira@aluno.sesi.org.br',
    password: 'sesi@aluno2026',
    name: 'Fernanda Lima Nogueira',
    role: 'student',
    unit: 'SESI MACAU',
    matricula: 'ALU-2026-06',
    phone: '(84) 98765-4321',
    areaOrGrade: '3ª Série do Ensino Médio',
  },
  // Alunos Mossoró
  {
    email: 'gabriel.dantas@aluno.sesi.org.br',
    password: 'sesi@aluno2026',
    name: 'Gabriel Bezerra Dantas',
    role: 'student',
    unit: 'SESI MOSSORÓ',
    matricula: 'ALU-2026-07',
    phone: '(84) 98111-2233',
    areaOrGrade: '3ª Série do Ensino Médio - Técnico em Automação',
  },
];

async function seed() {
  console.log('🧹 [1/3] Limpando dados antigos no Cloud Firestore...');
  const collectionsToClear = ['groups', 'lines', 'meetings', 'tasks', 'resources', 'logbooks', 'photos'];
  for (const colName of collectionsToClear) {
    try {
      const snap = await getDocs(collection(db, colName));
      console.log(`  🗑️ Limpando coleção '${colName}' (${snap.docs.length} documentos encontrados)...`);
      for (const docSnap of snap.docs) {
        await deleteDoc(doc(db, colName, docSnap.id));
      }
    } catch (err: any) {
      console.warn(`  ⚠️ Aviso ao limpar coleção '${colName}':`, err.message);
    }
  }

  console.log('\n🌱 [2/3] Autenticando e atualizando perfis no Firebase...');
  const uids: Record<string, string> = {};

  for (const user of USERS_SEED) {
    let uid = '';
    try {
      const cred = await createUserWithEmailAndPassword(auth, user.email, user.password);
      await updateProfile(cred.user, { displayName: user.name });
      uid = cred.user.uid;
      console.log(`  ✅ Criado no Auth: ${user.email} (UID: ${uid})`);
    } catch (e: any) {
      if (e.code === 'auth/email-already-in-use') {
        const cred = await signInWithEmailAndPassword(auth, user.email, user.password);
        uid = cred.user.uid;
        console.log(`  🔑 Login efetuado: ${user.email} (UID: ${uid})`);
      } else {
        console.error(`  ❌ Erro no Auth para ${user.email}:`, e.message);
        continue;
      }
    }

    uids[user.email] = uid;

    // Salva perfil atualizado no Firestore
    await setDoc(doc(db, 'users', uid), {
      uid,
      name: user.name,
      email: user.email,
      role: user.role,
      unit: user.unit,
      matricula: user.matricula,
      phone: user.phone,
      areaOrGrade: user.areaOrGrade,
      createdAt: new Date().toISOString(),
    });
    console.log(`     📄 Perfil salvo no Firestore para ${user.name} (${user.unit})`);
  }

  // Faz login como admin para criar os grupos de pesquisa com permissão
  await signInWithEmailAndPassword(auth, 'admin@sesi.org.br', 'sesi@admin2026');

  console.log('\n🏛️ [3/3] Criando Grupos de Pesquisa Oficiais (Prontos para cadastro de linhas reais)...');
  
  // Grupo SGA
  const groupSgaRef = await addDoc(collection(db, 'groups'), {
    title: 'GPROB - Grupo de Pesquisa em Robótica e Sistemas Inteligentes',
    description: 'Investigação e desenvolvimento de protótipos de automação, sensoriamento remoto e visão computacional aplicados à indústria e ao meio ambiente.',
    unit: 'SESI SÃO GONÇALO DO AMARANTE',
    leaderTeacherId: uids['carlos.medeiros@sesi.org.br'] || 'teacher-sg',
    leaderTeacherName: 'Prof. Dr. Carlos Eduardo Medeiros',
    createdAt: new Date().toISOString(),
  });
  console.log(`  ✅ Grupo SGA criado: ${groupSgaRef.id}`);

  // Grupo Macau
  const groupMacauRef = await addDoc(collection(db, 'groups'), {
    title: 'NUPES - Núcleo de Pesquisa em Energias Renováveis e Meio Ambiente',
    description: 'Estudos de dessalinização solar, biopolímeros a partir de resíduos da carcinicultura e eficiência energética.',
    unit: 'SESI MACAU',
    leaderTeacherId: uids['juliana.albuquerque@sesi.org.br'] || 'teacher-macau',
    leaderTeacherName: 'Profa. Dra. Juliana Albuquerque',
    createdAt: new Date().toISOString(),
  });
  console.log(`  ✅ Grupo Macau criado: ${groupMacauRef.id}`);

  // Grupo Mossoró
  const groupMossoroRef = await addDoc(collection(db, 'groups'), {
    title: 'LABIOT - Laboratório de Automação e IoT para o Semiárido',
    description: 'Desenvolvimento de sistemas embarcados de baixo custo para otimização de recursos hídricos na fruticultura irrigada.',
    unit: 'SESI MOSSORÓ',
    leaderTeacherId: uids['lucas.costa@sesi.org.br'] || 'teacher-mossoro',
    leaderTeacherName: 'Prof. Me. Lucas Ferreira Costa',
    createdAt: new Date().toISOString(),
  });
  console.log(`  ✅ Grupo Mossoró criado: ${groupMossoroRef.id}`);

  console.log('\n🎉🎉🎉 BANCO DE DADOS RESETADO E PRONTO COM OS GRUPOS OFICIAIS! 🎉🎉🎉');
  console.log('Nenhuma linha fictícia foi criada. Os orientadores e alunos podem cadastrar os dados reais.');
}

seed().catch(err => {
  console.error('❌ Erro fatal durante o reset e seed:', err);
  process.exit(1);
});
