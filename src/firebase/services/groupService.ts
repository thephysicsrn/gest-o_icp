import { ResearchGroup, ResearchLine, SesiUnit } from '../../types';
import { STORAGE_KEYS, getFromStorage, saveToStorage } from './storageHelper';
import { INITIAL_GROUPS, INITIAL_LINES } from '../seedData';

export const groupService = {
  getAllGroups: async (): Promise<ResearchGroup[]> => {
    return getFromStorage<ResearchGroup[]>(STORAGE_KEYS.GROUPS, INITIAL_GROUPS);
  },

  getGroupByLeader: async (teacherId: string): Promise<ResearchGroup | null> => {
    const groups = await groupService.getAllGroups();
    return groups.find(g => g.leaderTeacherId === teacherId) || null;
  },

  getGroupById: async (groupId: string): Promise<ResearchGroup | null> => {
    const groups = await groupService.getAllGroups();
    return groups.find(g => g.id === groupId) || null;
  },

  saveGroup: async (groupData: {
    id?: string;
    title: string;
    description: string;
    unit: SesiUnit;
    leaderTeacherId: string;
    leaderTeacherName: string;
  }): Promise<ResearchGroup> => {
    const groups = await groupService.getAllGroups();
    
    if (groupData.id) {
      const index = groups.findIndex(g => g.id === groupData.id);
      if (index !== -1) {
        groups[index] = {
          ...groups[index],
          ...groupData,
          updatedAt: new Date().toISOString()
        };
        saveToStorage(STORAGE_KEYS.GROUPS, groups);
        return groups[index];
      }
    }

    const newGroup: ResearchGroup = {
      id: `grp-${Date.now()}`,
      title: groupData.title,
      description: groupData.description,
      unit: groupData.unit,
      leaderTeacherId: groupData.leaderTeacherId,
      leaderTeacherName: groupData.leaderTeacherName,
      createdAt: new Date().toISOString()
    };

    groups.push(newGroup);
    saveToStorage(STORAGE_KEYS.GROUPS, groups);
    return newGroup;
  },

  // Linhas de Pesquisa
  getAllLines: async (): Promise<ResearchLine[]> => {
    return getFromStorage<ResearchLine[]>(STORAGE_KEYS.LINES, INITIAL_LINES);
  },

  getLinesByGroup: async (groupId: string): Promise<ResearchLine[]> => {
    const lines = await groupService.getAllLines();
    return lines
      .filter(l => l.groupId === groupId)
      .sort((a, b) => a.lineNumber - b.lineNumber);
  },

  getLineById: async (lineId: string): Promise<ResearchLine | null> => {
    const lines = await groupService.getAllLines();
    return lines.find(l => l.id === lineId) || null;
  },

  createLine: async (lineData: {
    groupId: string;
    title: string;
    area: string;
    description: string;
    studentIds: string[];
    studentNames: string[];
  }): Promise<ResearchLine> => {
    const lines = await groupService.getAllLines();
    const groupLines = lines.filter(l => l.groupId === lineData.groupId);

    // REGRA DE NEGÓCIO: Máximo 5 linhas por grupo de pesquisa
    if (groupLines.length >= 5) {
      throw new Error('Limite atingido! Um grupo de pesquisa pode ter no máximo 5 linhas de pesquisa.');
    }

    // REGRA DE NEGÓCIO: Máximo 3 alunos por linha de pesquisa
    if (lineData.studentIds.length > 3) {
      throw new Error('Limite atingido! Cada linha de pesquisa pode ter no máximo 3 alunos.');
    }

    const newLine: ResearchLine = {
      id: `line-${Date.now()}`,
      groupId: lineData.groupId,
      lineNumber: groupLines.length + 1,
      title: lineData.title,
      area: lineData.area,
      description: lineData.description,
      studentIds: lineData.studentIds,
      studentNames: lineData.studentNames,
      createdAt: new Date().toISOString()
    };

    lines.push(newLine);
    saveToStorage(STORAGE_KEYS.LINES, lines);
    return newLine;
  },

  updateLine: async (
    lineId: string, 
    updates: Partial<Omit<ResearchLine, 'id' | 'groupId'>>
  ): Promise<ResearchLine> => {
    const lines = await groupService.getAllLines();
    const index = lines.findIndex(l => l.id === lineId);
    if (index === -1) throw new Error('Linha de pesquisa não encontrada.');

    if (updates.studentIds && updates.studentIds.length > 3) {
      throw new Error('Limite atingido! Cada linha de pesquisa pode ter no máximo 3 alunos.');
    }

    lines[index] = { ...lines[index], ...updates };
    saveToStorage(STORAGE_KEYS.LINES, lines);
    return lines[index];
  },

  deleteLine: async (lineId: string): Promise<void> => {
    let lines = await groupService.getAllLines();
    const target = lines.find(l => l.id === lineId);
    if (!target) return;

    lines = lines.filter(l => l.id !== lineId);
    
    // Reordenar números das linhas restantes no grupo
    let counter = 1;
    lines = lines.map(l => {
      if (l.groupId === target.groupId) {
        return { ...l, lineNumber: counter++ };
      }
      return l;
    });

    saveToStorage(STORAGE_KEYS.LINES, lines);
  },

  // Retorna a linha e o grupo em que um aluno está alocado
  getStudentGroupAndLine: async (studentId: string): Promise<{
    group: ResearchGroup | null;
    line: ResearchLine | null;
  }> => {
    const lines = await groupService.getAllLines();
    const studentLine = lines.find(l => l.studentIds.includes(studentId));
    
    if (!studentLine) {
      return { group: null, line: null };
    }

    const group = await groupService.getGroupById(studentLine.groupId);
    return { group, line: studentLine };
  }
};
