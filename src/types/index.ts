export type SesiUnit = 
  | 'SESI SÃO GONÇALO DO AMARANTE'
  | 'SESI MACAU'
  | 'SESI MOSSORÓ';

export const SESI_UNITS: SesiUnit[] = [
  'SESI SÃO GONÇALO DO AMARANTE',
  'SESI MACAU',
  'SESI MOSSORÓ'
];

export type UserRole = 'admin' | 'teacher' | 'student';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  unit: SesiUnit;
  matricula: string;
  phone?: string;
  areaOrGrade?: string; // Para professores (área) ou alunos (série/turma)
  avatarUrl?: string;
  createdAt: string;
}

export interface ResearchGroup {
  id: string;
  title: string;
  description: string;
  unit: SesiUnit;
  leaderTeacherId: string;
  leaderTeacherName: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ResearchLine {
  id: string;
  groupId: string;
  lineNumber: number; // 1 a 5 (limite de 5 linhas)
  title: string;
  area: string;
  description: string;
  studentIds: string[]; // max 3 alunos
  studentNames: string[];
  createdAt: string;
}

export type AttendanceStatus = 'present' | 'absent_justified' | 'absent';

export interface AttendanceRecord {
  studentId: string;
  studentName: string;
  status: AttendanceStatus;
  note?: string;
}

export interface MeetingAttendance {
  id: string;
  groupId: string;
  lineId?: string; // opcional se for reunião geral ou específica
  lineTitle?: string;
  date: string; // YYYY-MM-DD
  time?: string;
  title: string;
  agenda: string;
  summary?: string;
  records: AttendanceRecord[];
  createdAt: string;
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'approved';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface ActivityTask {
  id: string;
  groupId: string;
  lineId: string;
  lineTitle?: string;
  targetStudentId?: string; // se atribuída a um aluno específico ou à linha toda
  targetStudentName?: string;
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  submissionLink?: string;
  submissionNotes?: string;
  teacherFeedback?: string;
  createdAt: string;
  updatedAt?: string;
}

export type ResourceType = 'link' | 'file';

export interface LineResource {
  id: string;
  groupId: string;
  lineId: string; // Exclusivo para os membros desta linha
  lineTitle?: string;
  type: ResourceType;
  title: string;
  url: string;
  fileName?: string;
  fileSize?: string;
  fileType?: string;
  description?: string;
  uploadedBy: string;
  uploadedByName: string;
  createdAt: string;
}

export type ResearchStage = 
  | 'Planejamento e Hipótese'
  | 'Revisão Bibliográfica'
  | 'Metodologia e Prototipagem'
  | 'Experimentação e Coleta de Dados'
  | 'Análise e Discussão de Resultados'
  | 'Redação do Artigo / Relatório Final'
  | 'Preparação para Feira Científica';

export type SupervisorValidationStatus = 'pending' | 'approved' | 'needs_revision';

export interface LogbookEntry {
  id: string;
  studentId: string;
  studentName: string;
  lineId: string;
  lineTitle: string;
  groupId: string;
  date: string; // YYYY-MM-DD
  hoursWorked: number;
  stage: ResearchStage;
  objectives: string;
  methodology: string;
  activities: string;
  results: string;
  difficulties: string;
  nextSteps: string;
  supervisorStatus: SupervisorValidationStatus;
  supervisorComment?: string;
  supervisorReviewedAt?: string;
  createdAt: string;
}

export interface PhotoRecord {
  id: string;
  studentId: string;
  studentName: string;
  lineId: string;
  lineTitle: string;
  groupId: string;
  imageUrl: string;
  caption: string;
  date: string;
  stage: string;
  tags: string[];
  createdAt: string;
}
