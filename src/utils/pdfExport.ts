import jsPDF from 'jspdf';
import { LogbookEntry, UserProfile, ResearchGroup, ResearchLine } from '../types';

export const exportLogbookToPDF = (
  entries: LogbookEntry[],
  student: UserProfile,
  group: ResearchGroup | null,
  line: ResearchLine | null
) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let currentY = 15;

  const checkPageBreak = (neededHeight: number) => {
    if (currentY + neededHeight > pageHeight - margin) {
      doc.addPage();
      currentY = margin;
      drawHeader();
    }
  };

  const drawHeader = () => {
    // Top banner
    doc.setFillColor(0, 59, 113); // SESI Blue #003B71
    doc.rect(margin, currentY, pageWidth - (margin * 2), 16, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('ICP — INICIAÇÃO CIENTÍFICA PRÉ - UNIVERSITÁRIA • SESI RN', pageWidth / 2, currentY + 7, { align: 'center' });
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`DIÁRIO DE BORDO OFICIAL • ${student.unit.toUpperCase()}`, pageWidth / 2, currentY + 12, { align: 'center' });

    currentY += 22;
  };

  // Initial Header
  drawHeader();

  // Project Info Card
  doc.setFillColor(245, 248, 252);
  doc.setDrawColor(200, 215, 235);
  doc.rect(margin, currentY, pageWidth - (margin * 2), 34, 'FD');

  doc.setTextColor(0, 59, 113);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('DADOS DO PROJETO E DO PESQUISADOR', margin + 4, currentY + 6);

  doc.setTextColor(50, 50, 50);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  doc.text(`Aluno(a) Pesquisador(a): ${student.name} (Matrícula: ${student.matricula})`, margin + 4, currentY + 12);
  doc.text(`Grupo de Pesquisa: ${group ? group.title : 'Não informado'}`, margin + 4, currentY + 17);
  doc.text(`Linha de Pesquisa: Linha ${line?.lineNumber || 1} - ${line ? line.title : 'Não informada'}`, margin + 4, currentY + 22);
  doc.text(`Orientador(a) Líder: ${group ? group.leaderTeacherName : 'Não informado'}`, margin + 4, currentY + 27);
  doc.text(`Data de Emissão do Documento: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, margin + 4, currentY + 32);

  currentY += 40;

  if (entries.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text('Nenhum registro de diário de bordo cadastrado até o momento.', margin, currentY);
    doc.save(`Diario_de_Bordo_${student.name.replace(/\s+/g, '_')}.pdf`);
    return;
  }

  // Iterate over entries
  entries.forEach((entry, index) => {
    checkPageBreak(55);

    // Entry Header Box
    doc.setFillColor(230, 240, 250);
    doc.setDrawColor(180, 205, 235);
    doc.rect(margin, currentY, pageWidth - (margin * 2), 8, 'FD');

    doc.setTextColor(0, 59, 113);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text(`REGISTRO #${entries.length - index} • DATA: ${new Date(entry.date + 'T12:00:00Z').toLocaleDateString('pt-BR')} • DURAÇÃO: ${entry.hoursWorked}h`, margin + 3, currentY + 5.5);

    const statusText = entry.supervisorStatus === 'approved' 
      ? '[APROVADO PELO ORIENTADOR]' 
      : entry.supervisorStatus === 'needs_revision' 
        ? '[REQUER REVISÃO]' 
        : '[EM ANÁLISE]';
    
    if (entry.supervisorStatus === 'approved') {
      doc.setTextColor(0, 130, 60);
    } else if (entry.supervisorStatus === 'needs_revision') {
      doc.setTextColor(200, 30, 30);
    } else {
      doc.setTextColor(180, 120, 0);
    }
    doc.text(statusText, pageWidth - margin - 3, currentY + 5.5, { align: 'right' });

    currentY += 12;

    // Etapa
    doc.setTextColor(0, 59, 113);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text('Etapa da Pesquisa:', margin, currentY);
    doc.setTextColor(60, 60, 60);
    doc.setFont('helvetica', 'normal');
    doc.text(entry.stage, margin + 35, currentY);
    currentY += 6;

    const printField = (label: string, value: string) => {
      if (!value) return;
      checkPageBreak(16);
      doc.setTextColor(0, 59, 113);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.text(`${label}:`, margin, currentY);
      currentY += 4.5;

      doc.setTextColor(50, 50, 50);
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(value, pageWidth - (margin * 2) - 4);
      
      lines.forEach((lineText: string) => {
        checkPageBreak(5);
        doc.text(lineText, margin + 2, currentY);
        currentY += 4.2;
      });
      currentY += 2;
    };

    printField('1. Objetivos da Sessão', entry.objectives);
    printField('2. Metodologia / Procedimentos', entry.methodology);
    printField('3. Atividades Realizadas', entry.activities);
    printField('4. Resultados Obtidos', entry.results);
    printField('5. Dificuldades Encontradas', entry.difficulties);
    printField('6. Próximos Passos', entry.nextSteps);

    if (entry.supervisorComment) {
      checkPageBreak(18);
      doc.setFillColor(254, 249, 235);
      doc.setDrawColor(245, 215, 145);
      
      const commentLines = doc.splitTextToSize(`Parecer do Orientador: "${entry.supervisorComment}"`, pageWidth - (margin * 2) - 6);
      const boxHeight = 7 + (commentLines.length * 4);
      
      doc.rect(margin, currentY, pageWidth - (margin * 2), boxHeight, 'FD');
      doc.setTextColor(140, 90, 0);
      doc.setFont('helvetica', 'italic');
      doc.text(commentLines, margin + 3, currentY + 5);
      currentY += boxHeight + 4;
    }

    // Divider line between entries
    doc.setDrawColor(220, 225, 230);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 6;
  });

  // Footer Signature Section
  checkPageBreak(35);
  currentY += 10;
  
  doc.setDrawColor(120, 120, 120);
  doc.line(margin + 10, currentY + 15, margin + 70, currentY + 15);
  doc.line(pageWidth - margin - 70, currentY + 15, pageWidth - margin - 10, currentY + 15);

  doc.setFontSize(8);
  doc.setTextColor(80, 80, 80);
  doc.setFont('helvetica', 'normal');
  doc.text('Assinatura do(a) Aluno(a)', margin + 40, currentY + 19, { align: 'center' });
  doc.text('Assinatura do(a) Professor(a) Orientador(a)', pageWidth - margin - 40, currentY + 19, { align: 'center' });

  // Download PDF
  doc.save(`Diario_de_Bordo_${student.name.replace(/\s+/g, '_')}_SESI.pdf`);
};
