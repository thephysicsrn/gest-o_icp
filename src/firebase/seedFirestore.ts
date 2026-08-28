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
    unit: 'SESI MOSSORÓ',
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
  console.log('🧹 [0/5] Limpando dados antigos no Cloud Firestore...');
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

  console.log('\n🌱 [1/5] Autenticando e criando perfis no Firebase...');
  const uids: Record<string, string> = {};

  for (const user of USERS_SEED) {
    let uid = '';
    try {
      // Tenta criar usuário no Auth
      const cred = await createUserWithEmailAndPassword(auth, user.email, user.password);
      await updateProfile(cred.user, { displayName: user.name });
      uid = cred.user.uid;
      console.log(`  ✅ Criado no Auth: ${user.email} (UID: ${uid})`);
    } catch (e: any) {
      if (e.code === 'auth/email-already-in-use') {
        // Se já existe, faz login para obter o UID
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
    console.log(`     📄 Perfil salvo no Firestore para ${user.name}`);
  }

  // Faz login como admin para criar os grupos e linhas com permissão
  await signInWithEmailAndPassword(auth, 'admin@sesi.org.br', 'sesi@admin2026');

  console.log('\n🏛️ [2/5] Criando Grupos de Pesquisa Oficiais...');
  
  // Grupo SGA
  const groupSgaRef = await addDoc(collection(db, 'groups'), {
    title: 'GPROB - Grupo de Pesquisa em Robótica e Sistemas Inteligentes',
    description: 'Investigação e desenvolvimento de protótipos de automação, sensoriamento remoto e visão computacional aplicados à indústria e ao meio ambiente.',
    unit: 'SESI SÃO GONÇALO DO AMARANTE',
    leaderTeacherId: uids['carlos.medeiros@sesi.org.br'] || 'teacher-sg',
    leaderTeacherName: 'Prof. Dr. Carlos Eduardo Medeiros',
    createdAt: new Date().toISOString(),
  });
  const groupSgaId = groupSgaRef.id;
  console.log(`  ✅ Grupo SGA criado: ${groupSgaId}`);

  // Grupo Macau
  const groupMacauRef = await addDoc(collection(db, 'groups'), {
    title: 'NUPES - Núcleo de Pesquisa em Energias Renováveis e Meio Ambiente',
    description: 'Estudos de dessalinização solar, biopolímeros a partir de resíduos da carcinicultura e eficiência energética.',
    unit: 'SESI MACAU',
    leaderTeacherId: uids['juliana.albuquerque@sesi.org.br'] || 'teacher-macau',
    leaderTeacherName: 'Profa. Dra. Juliana Albuquerque',
    createdAt: new Date().toISOString(),
  });
  const groupMacauId = groupMacauRef.id;
  console.log(`  ✅ Grupo Macau criado: ${groupMacauId}`);

  // Grupo Mossoró
  const groupMossoroRef = await addDoc(collection(db, 'groups'), {
    title: 'LABIOT - Laboratório de Automação e IoT para o Semiárido',
    description: 'Desenvolvimento de sistemas embarcados de baixo custo para otimização de recursos hídricos na fruticultura irrigada.',
    unit: 'SESI MOSSORÓ',
    leaderTeacherId: uids['lucas.costa@sesi.org.br'] || 'teacher-mossoro',
    leaderTeacherName: 'Prof. Me. Lucas Ferreira Costa',
    createdAt: new Date().toISOString(),
  });
  const groupMossoroId = groupMossoroRef.id;
  console.log(`  ✅ Grupo Mossoró criado: ${groupMossoroId}`);

  console.log('\n🔬 [3/5] Criando Linhas de Pesquisa...');

  // Linha 1 SGA
  const sgaL1Students = [
    uids['arthur.silva@aluno.sesi.org.br'],
    uids['beatriz.ramos@aluno.sesi.org.br'],
    uids['caio.meireles@aluno.sesi.org.br'],
  ].filter(Boolean);

  const lineSga1Ref = await addDoc(collection(db, 'lines'), {
    groupId: groupSgaId,
    lineNumber: 1,
    title: 'Monitoramento IoT de Parâmetros Ambientais em Ambientes Escolares',
    area: 'Engenharia e Ciências da Computação',
    description: 'Criação de estações de monitoramento de qualidade do ar (CO2, temperatura e umidade) com envio de alertas para dashboards em tempo real.',
    studentIds: sgaL1Students,
    studentNames: ['Arthur Vinícius Silva', 'Beatriz Vasconcelos Ramos', 'Caio Felipe Meireles'],
    createdAt: new Date().toISOString(),
  });
  const lineSga1Id = lineSga1Ref.id;
  console.log(`  ✅ Linha 1 SGA criada: ${lineSga1Id}`);

  // Linha 2 SGA
  const sgaL2Students = [
    uids['daniela.moura@aluno.sesi.org.br'],
    uids['enzo.soares@aluno.sesi.org.br'],
  ].filter(Boolean);

  await addDoc(collection(db, 'lines'), {
    groupId: groupSgaId,
    lineNumber: 2,
    title: 'Visão Computacional para Triagem Automatizada de Resíduos Plásticos',
    area: 'Inteligência Artificial e Sustentabilidade',
    description: 'Implementação de redes neurais convolucionais em Raspberry Pi para classificação de polímeros (PET, PEAD, PVC) em esteiras de reciclagem.',
    studentIds: sgaL2Students,
    studentNames: ['Daniela Fontes Moura', 'Enzo Gabriel Soares'],
    createdAt: new Date().toISOString(),
  });
  console.log(`  ✅ Linha 2 SGA criada`);

  // Linha Macau
  const macauStudents = [uids['fernanda.nogueira@aluno.sesi.org.br']].filter(Boolean);
  await addDoc(collection(db, 'lines'), {
    groupId: groupMacauId,
    lineNumber: 1,
    title: 'Bioplásticos Obtidos da Quitosana de Carapaças de Camarão',
    area: 'Química e Biotecnologia',
    description: 'Síntese de filmes biodegradáveis a partir de rejeitos da indústria de frutos do mar da região salineira.',
    studentIds: macauStudents,
    studentNames: ['Fernanda Lima Nogueira'],
    createdAt: new Date().toISOString(),
  });
  console.log(`  ✅ Linha Macau criada`);

  // Linha Mossoró
  const mossoroStudents = [uids['gabriel.dantas@aluno.sesi.org.br']].filter(Boolean);
  await addDoc(collection(db, 'lines'), {
    groupId: groupMossoroId,
    lineNumber: 1,
    title: 'Irrigação de Precisão com Redes de Sensores LoRaWAN',
    area: 'Agronomia Digital e Telecomunicações',
    description: 'Controle autônomo de gotejamento por análise de umidade do solo em plantios de melão no semiárido potiguar.',
    studentIds: mossoroStudents,
    studentNames: ['Gabriel Bezerra Dantas'],
    createdAt: new Date().toISOString(),
  });
  console.log(`  ✅ Linha Mossoró criada`);

  console.log('\n📅 [4/5] Criando Reuniões, Tarefas e Recursos Iniciais...');

  // Reuniões
  await addDoc(collection(db, 'meetings'), {
    groupId: groupSgaId,
    lineId: lineSga1Id,
    lineTitle: 'Monitoramento IoT de Parâmetros Ambientais',
    date: '2026-02-12',
    time: '14:00 - 16:00',
    title: 'Reunião de Alinhamento Metodológico e Calibração dos Sensores MQ-135',
    agenda: '1. Revisão do cronograma FEBRACE; 2. Teste prático do circuito ESP32 com display OLED; 3. Divisão dos tópicos do diário de bordo.',
    summary: 'Todos os membros participaram ativamente. Circuito montado na protoboard com sucesso. Próxima etapa será a calibração com gás de referência.',
    records: [
      { studentId: uids['arthur.silva@aluno.sesi.org.br'] || 'student-sg-01', studentName: 'Arthur Vinícius Silva', status: 'present', note: 'Responsável pela programação do microcontrolador' },
      { studentId: uids['beatriz.ramos@aluno.sesi.org.br'] || 'student-sg-02', studentName: 'Beatriz Vasconcelos Ramos', status: 'present', note: 'Apresentou a revisão bibliográfica das normas ABNT' },
      { studentId: uids['caio.meireles@aluno.sesi.org.br'] || 'student-sg-03', studentName: 'Caio Felipe Meireles', status: 'present', note: 'Responsável pela montagem do protótipo físico' }
    ],
    createdAt: '2026-02-12T16:30:00Z'
  });

  await addDoc(collection(db, 'meetings'), {
    groupId: groupSgaId,
    lineId: lineSga1Id,
    lineTitle: 'Monitoramento IoT de Parâmetros Ambientais',
    date: '2026-02-19',
    time: '14:00 - 16:00',
    title: 'Sessão de Coleta de Dados e Validação dos Logs',
    agenda: '1. Verificação da taxa de amostragem de dados via MQTT; 2. Análise de ruído no sinal analógico.',
    summary: 'A aluna Beatriz precisou se ausentar para consulta médica previamente justificada. Arthur e Caio realizaram o teste com êxito.',
    records: [
      { studentId: uids['arthur.silva@aluno.sesi.org.br'] || 'student-sg-01', studentName: 'Arthur Vinícius Silva', status: 'present' },
      { studentId: uids['beatriz.ramos@aluno.sesi.org.br'] || 'student-sg-02', studentName: 'Beatriz Vasconcelos Ramos', status: 'absent_justified', note: 'Atestado médico entregue à coordenação' },
      { studentId: uids['caio.meireles@aluno.sesi.org.br'] || 'student-sg-03', studentName: 'Caio Felipe Meireles', status: 'present' }
    ],
    createdAt: '2026-02-19T16:30:00Z'
  });

  // Tarefas
  await addDoc(collection(db, 'tasks'), {
    groupId: groupSgaId,
    lineId: lineSga1Id,
    lineTitle: 'Monitoramento IoT',
    targetStudentId: uids['arthur.silva@aluno.sesi.org.br'] || 'student-sg-01',
    targetStudentName: 'Arthur Vinícius Silva',
    title: 'Desenvolver script em C++ / Arduino para leitura periódica do MQ-135 e DHT22',
    description: 'Implementar a biblioteca de leitura, configurar a taxa de envio a cada 10 segundos e formatar o payload JSON.',
    dueDate: '2026-02-25',
    priority: 'high',
    status: 'in_progress',
    teacherFeedback: 'Excelente início! Lembre-se de adicionar tratamento de erro caso o sensor DHT retorne NaN.',
    createdAt: '2026-02-13T09:00:00Z'
  });

  await addDoc(collection(db, 'tasks'), {
    groupId: groupSgaId,
    lineId: lineSga1Id,
    lineTitle: 'Monitoramento IoT',
    targetStudentId: uids['beatriz.ramos@aluno.sesi.org.br'] || 'student-sg-02',
    targetStudentName: 'Beatriz Vasconcelos Ramos',
    title: 'Estruturar a Introdução e Justificativa no padrão ABNT / Feira Científica',
    description: 'Escrever no mínimo 3 laudas com referencial teórico sobre qualidade do ar em salas de aula e impacto no rendimento acadêmico.',
    dueDate: '2026-02-28',
    priority: 'medium',
    status: 'completed',
    submissionLink: 'https://docs.google.com/document/d/sesi-artigo-revisao-qualidade-ar',
    submissionNotes: 'Documento finalizado com 12 referências de periódicos Scielo e IEEE.',
    teacherFeedback: 'Trabalho impecável na fundamentação teórica!',
    createdAt: '2026-02-13T09:15:00Z'
  });

  await addDoc(collection(db, 'tasks'), {
    groupId: groupSgaId,
    lineId: lineSga1Id,
    lineTitle: 'Monitoramento IoT',
    title: 'Projetar case em 3D (CAD/Fusion 360) para acondicionamento da placa no laboratório',
    description: 'Considerar aberturas para ventilação natural dos sensores e encaixe para display OLED 0.96".',
    dueDate: '2026-03-05',
    priority: 'low',
    status: 'pending',
    createdAt: '2026-02-15T10:00:00Z'
  });

  // Recursos
  await addDoc(collection(db, 'resources'), {
    groupId: groupSgaId,
    lineId: lineSga1Id,
    lineTitle: 'Monitoramento IoT',
    type: 'link',
    title: 'Repositório de Firmware e Bibliotecas no GitHub',
    url: 'https://github.com/sesi-icp/iot-air-quality-station',
    description: 'Código base com bibliotecas para ESP32, PubSubClient e Adafruit_Sensor.',
    uploadedBy: uids['carlos.medeiros@sesi.org.br'] || 'teacher-sg',
    uploadedByName: 'Prof. Dr. Carlos Eduardo Medeiros',
    createdAt: '2026-02-10T11:00:00Z'
  });

  await addDoc(collection(db, 'resources'), {
    groupId: groupSgaId,
    lineId: lineSga1Id,
    lineTitle: 'Monitoramento IoT',
    type: 'file',
    title: 'Guia de Calibração de Sensores Eletroquímicos de Gás (PDF)',
    url: '#',
    fileName: 'Manual_Calibracao_Sensores_MQ_IEEE.pdf',
    fileSize: '2.4 MB',
    fileType: 'application/pdf',
    description: 'Documento técnico oficial para cálculo de Ro/Rs e curvas características.',
    uploadedBy: uids['carlos.medeiros@sesi.org.br'] || 'teacher-sg',
    uploadedByName: 'Prof. Dr. Carlos Eduardo Medeiros',
    createdAt: '2026-02-11T14:30:00Z'
  });

  console.log('\n📖 [5/5] Criando Diários de Bordo e Registros Fotográficos...');

  // Diários de Bordo
  await addDoc(collection(db, 'logbooks'), {
    studentId: uids['arthur.silva@aluno.sesi.org.br'] || 'student-sg-01',
    studentName: 'Arthur Vinícius Silva',
    lineId: lineSga1Id,
    lineTitle: 'Monitoramento IoT de Parâmetros Ambientais',
    groupId: groupSgaId,
    date: '2026-02-14',
    hoursWorked: 3.5,
    stage: 'Metodologia e Prototipagem',
    objectives: 'Montar a primeira versão do circuito na protoboard e testar comunicação I2C com o display OLED 128x64.',
    methodology: 'Utilizamos uma placa ESP32 DevKit V1, conectando os pinos SDA (GPIO 21) e SCL (GPIO 22). Foi utilizado o software Arduino IDE 2.3 com a biblioteca U8g2.',
    activities: '1. Ligação física dos fios jumper;\n2. Scanner I2C para localizar o endereço do display (encontrado em 0x3C);\n3. Renderização de tela de boas-vindas com a logo do SESI ICP.',
    results: 'Display inicializou perfeitamente, taxa de atualização de 30 FPS sem flickering. Tensão de alimentação estável em 3.3V.',
    difficulties: 'Inicialmente o display não respondia devido a um cabo jumper partido, identificado após teste de continuidade no multímetro.',
    nextSteps: 'Integrar o sensor de gás MQ-135 na entrada analógica ADC1_CH0 (GPIO 36).',
    supervisorStatus: 'approved',
    supervisorComment: 'Excelente rigor no registro do problema e da solução com o multímetro! Parabéns pelo detalhamento técnico.',
    supervisorReviewedAt: '2026-02-15T10:00:00Z',
    createdAt: '2026-02-14T17:30:00Z'
  });

  await addDoc(collection(db, 'logbooks'), {
    studentId: uids['beatriz.ramos@aluno.sesi.org.br'] || 'student-sg-02',
    studentName: 'Beatriz Vasconcelos Ramos',
    lineId: lineSga1Id,
    lineTitle: 'Monitoramento IoT de Parâmetros Ambientais',
    groupId: groupSgaId,
    date: '2026-02-16',
    hoursWorked: 4.0,
    stage: 'Revisão Bibliográfica',
    objectives: 'Mapear estudos recentes (2021-2025) sobre limites recomendados de CO2 pela OMS e ANVISA em ambientes escolares.',
    methodology: 'Busca sistemática no Google Scholar e Scielo com as palavras-chave "qualidade do ar", "escolas", "dióxido de carbono" e "aprendizagem".',
    activities: 'Leitura de 8 artigos científicos, compilação de tabela comparativa de concentrações (PPM) e impactos na sonolência e foco de estudantes.',
    results: 'Verificou-se que concentrações acima de 1000 ppm já causam redução de até 15% na capacidade de concentração dos alunos.',
    difficulties: 'Alguns artigos internacionais na ScienceDirect estavam em acesso fechado, necessitando uso do portal de periódicos CAPES.',
    nextSteps: 'Redigir a subseção 2.1 do artigo científico do grupo com os dados tabulados.',
    supervisorStatus: 'approved',
    supervisorComment: 'Ótima fundamentação. Esses dados servirão como justificativa sólida para a relevância social da pesquisa.',
    supervisorReviewedAt: '2026-02-17T09:15:00Z',
    createdAt: '2026-02-16T18:00:00Z'
  });

  await addDoc(collection(db, 'logbooks'), {
    studentId: uids['caio.meireles@aluno.sesi.org.br'] || 'student-sg-03',
    studentName: 'Caio Felipe Meireles',
    lineId: lineSga1Id,
    lineTitle: 'Monitoramento IoT de Parâmetros Ambientais',
    groupId: groupSgaId,
    date: '2026-02-18',
    hoursWorked: 3.0,
    stage: 'Experimentação e Coleta de Dados',
    objectives: 'Submeter o protótipo montado a variações térmicas controladas em câmara de teste.',
    methodology: 'Colocação do circuito em recipiente fechado com fonte de calor controlada por termostato, registrando variação a cada 2 minutos.',
    activities: 'Aquecimento gradual de 24°C até 42°C, observando deriva térmica nas leituras do sensor analógico.',
    results: 'Foi detectado desvio linear de aproximadamente 1.8% a cada 5°C de elevação na temperatura.',
    difficulties: 'Necessidade de isolar os cabos para não derreter a fita isolante durante a medição máxima.',
    nextSteps: 'Implementar fórmula de compensação de temperatura no algoritmo do microcontrolador.',
    supervisorStatus: 'pending',
    createdAt: '2026-02-18T16:45:00Z'
  });

  // Fotos
  await addDoc(collection(db, 'photos'), {
    studentId: uids['arthur.silva@aluno.sesi.org.br'] || 'student-sg-01',
    studentName: 'Arthur Vinícius Silva',
    lineId: lineSga1Id,
    lineTitle: 'Monitoramento IoT',
    groupId: groupSgaId,
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
    caption: 'Montagem inicial da protoboard com ESP32 e display OLED no laboratório Maker do SESI São Gonçalo do Amarante.',
    date: '2026-02-14',
    stage: 'Metodologia e Prototipagem',
    tags: ['ESP32', 'Protoboard', 'Laboratório Maker', 'Bancada'],
    createdAt: '2026-02-14T17:40:00Z'
  });

  await addDoc(collection(db, 'photos'), {
    studentId: uids['caio.meireles@aluno.sesi.org.br'] || 'student-sg-03',
    studentName: 'Caio Felipe Meireles',
    lineId: lineSga1Id,
    lineTitle: 'Monitoramento IoT',
    groupId: groupSgaId,
    imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1000&q=80',
    caption: 'Teste de calibração do sensor MQ-135 com auxílio do osciloscópio e fonte de bancada ajustável.',
    date: '2026-02-18',
    stage: 'Experimentação e Coleta de Dados',
    tags: ['Calibração', 'Instrumentação', 'Medição', 'Eletrônica'],
    createdAt: '2026-02-18T16:50:00Z'
  });

  console.log('\n🎉🎉🎉 BANCO DE DADOS FIREBASE RESETADO E POPULADO COM SUCESSO! 🎉🎉🎉');
  console.log('\nCredenciais de acesso institucionais prontas:');
  console.log('  👑 Administrador: admin@sesi.org.br / sesi@admin2026');
  console.log('  🎓 Professor SGA: carlos.medeiros@sesi.org.br / sesi@prof2026');
  console.log('  🎓 Profa. Macau:  juliana.albuquerque@sesi.org.br / sesi@prof2026');
  console.log('  🎓 Prof. Mossoró: lucas.costa@sesi.org.br / sesi@prof2026');
  console.log('  🧪 Aluno Arthur:  arthur.silva@aluno.sesi.org.br / sesi@aluno2026');
  console.log('  🧪 Aluna Beatriz: beatriz.ramos@aluno.sesi.org.br / sesi@aluno2026');
  console.log('  🧪 Aluno Caio:    caio.meireles@aluno.sesi.org.br / sesi@aluno2026');
}

seed().catch(err => {
  console.error('❌ Erro fatal durante o reset e seed:', err);
  process.exit(1);
});
