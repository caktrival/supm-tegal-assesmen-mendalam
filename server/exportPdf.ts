import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AssessmentResult } from '../src/types/assessment.js';
import { ExportScope } from './exportDocx.js';

function drawKop(doc: jsPDF, title: string, data: AssessmentResult, forStudent = false): number {
  const pageWidth = doc.internal.pageSize.getWidth();

  // Top header text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text('KEMENTERIAN KELAUTAN DAN PERIKANAN REPUBLIK INDONESIA', pageWidth / 2, 14, { align: 'center' });

  doc.setFontSize(12);
  doc.setTextColor(30, 58, 138); // Dark Navy #1E3A8A
  doc.text('SEKOLAH USAHA PERIKANAN MENENGAH (SUPM) TEGAL', pageWidth / 2, 20, { align: 'center' });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('Jl. Martoloyo No. 22, Kel. Mintaragen, Kec. Tegal Timur, Kota Tegal, Jawa Tengah 52121', pageWidth / 2, 25, { align: 'center' });

  // Double horizontal line
  doc.setDrawColor(30, 58, 138);
  doc.setLineWidth(0.8);
  doc.line(14, 28, pageWidth - 14, 28);
  doc.setLineWidth(0.2);
  doc.line(14, 29.2, pageWidth - 14, 29.2);

  // Document Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(title.toUpperCase(), pageWidth / 2, 36, { align: 'center' });

  // Metadata block
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);

  const startY = 42;
  const col1Left = 14;
  const col2Left = pageWidth / 2 + 5;

  doc.text(`Mata Pelajaran  : ${data.metadata.subject}`, col1Left, startY);
  doc.text(`Kelas / Jurusan : Kelas ${data.metadata.grade} - ${data.metadata.majorFullName}`, col2Left, startY);

  doc.text(`Jenis Asesmen   : ${data.metadata.assessmentType}`, col1Left, startY + 5);
  doc.text(`Bentuk / Butir  : ${data.metadata.instrumentType} (${data.metadata.itemCount} Butir)`, col2Left, startY + 5);

  doc.text(`Guru Pengampu   : ${data.metadata.teacherName || '-'}`, col1Left, startY + 10);
  doc.text(`Tingkat SOLO    : ${data.metadata.cognitiveLevel}`, col2Left, startY + 10);

  let currentY = startY + 16;

  if (forStudent) {
    doc.setDrawColor(203, 213, 225);
    doc.setFillColor(248, 250, 252);
    doc.rect(14, currentY, pageWidth - 28, 10, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    doc.text('Nama Peserta Didik : __________________________________   No. Absen : ________', 18, currentY + 6.5);
    currentY += 14;
  }

  return currentY;
}

export function generatePdfBuffer(data: AssessmentResult, scope: ExportScope): Buffer {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const renderKisiKisi = (startY: number) => {
    const tableData = (data.kisiKisi || []).map((k, i) => [
      String(k.no || i + 1),
      k.learningObjective || '-',
      k.topic || '-',
      k.itemIndicator || '-',
      k.cognitiveLevel || '-',
      String(k.itemNumber || i + 1),
      String(k.scoreWeight || '-'),
    ]);

    autoTable(doc, {
      startY: startY + 2,
      head: [['No', 'Tujuan Pembelajaran', 'Materi', 'Indikator Soal/Tugas', 'Level SOLO', 'No. Soal', 'Bobot']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [30, 58, 138],
        textColor: 255,
        fontSize: 8,
        fontStyle: 'bold',
        halign: 'center',
      },
      bodyStyles: {
        fontSize: 7.5,
        textColor: 30,
      },
      columnStyles: {
        0: { cellWidth: 8, halign: 'center' },
        1: { cellWidth: 42 },
        2: { cellWidth: 32 },
        3: { cellWidth: 50 },
        4: { cellWidth: 24, halign: 'center' },
        5: { cellWidth: 14, halign: 'center' },
        6: { cellWidth: 12, halign: 'center' },
      },
      margin: { left: 14, right: 14 },
    });
  };

  const renderNaskahSoal = (startY: number) => {
    let currentY = startY;

    // Instructions
    if (data.naskahSoal?.generalInstructions?.length) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(30, 58, 138);
      doc.text('PETUNJUK UMUM PENGERJAAN:', 14, currentY);
      currentY += 4.5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      data.naskahSoal.generalInstructions.forEach((inst, i) => {
        const splitText = doc.splitTextToSize(`${i + 1}. ${inst}`, pageWidth - 28);
        doc.text(splitText, 14, currentY);
        currentY += splitText.length * 4;
      });
      currentY += 3;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(30, 58, 138);
    doc.text('DAFTAR BUTIR ASESMEN:', 14, currentY);
    currentY += 6;

    const items = data.naskahSoal?.items || [];
    items.forEach((item, index) => {
      // Check page overflow
      if (currentY > pageHeight - 35) {
        doc.addPage();
        currentY = 20;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      const qNum = `${item.itemNumber || index + 1}. `;
      const numWidth = doc.getTextWidth(qNum);
      doc.text(qNum, 14, currentY);

      doc.setFont('helvetica', 'normal');
      const qText = doc.splitTextToSize(item.questionText, pageWidth - 28 - numWidth);
      doc.text(qText, 14 + numWidth, currentY);
      currentY += qText.length * 4.2 + 2;

      // Options
      if (item.options) {
        const optKeys: Array<keyof typeof item.options> = ['A', 'B', 'C', 'D', 'E'];
        optKeys.forEach((k) => {
          if (item.options && item.options[k]) {
            if (currentY > pageHeight - 20) {
              doc.addPage();
              currentY = 20;
            }
            doc.setFont('helvetica', 'bold');
            doc.text(`${k}. `, 20, currentY);
            doc.setFont('helvetica', 'normal');
            const optText = doc.splitTextToSize(item.options[k], pageWidth - 36);
            doc.text(optText, 25, currentY);
            currentY += optText.length * 4 + 1.2;
          }
        });
        currentY += 2;
      }

      // Work steps if praktik
      if (item.workSteps && item.workSteps.length > 0) {
        if (currentY > pageHeight - 25) {
          doc.addPage();
          currentY = 20;
        }
        doc.setFont('helvetica', 'bold');
        doc.text('Langkah / Petunjuk Kerja:', 20, currentY);
        currentY += 4.5;
        doc.setFont('helvetica', 'normal');
        item.workSteps.forEach((step, sIdx) => {
          const sText = doc.splitTextToSize(`${sIdx + 1}) ${step}`, pageWidth - 36);
          doc.text(sText, 24, currentY);
          currentY += sText.length * 4;
        });
        currentY += 2;
      }
    });
  };

  const renderKunciJawaban = (startY: number) => {
    let currentY = startY;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(220, 38, 38);
    doc.text('DOKUMEN RAHASIA - HANYA UNTUK GURU / PENILAI', pageWidth / 2, currentY, { align: 'center' });
    currentY += 7;

    const tableData = (data.kunciJawaban || []).map((k) => [
      String(k.itemNumber),
      k.correctAnswer || '-',
      k.explanation || '-',
      (k.expectedPerformance || []).join('; ') || '-',
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [['No', 'Kunci Jawaban', 'Pembahasan / Rasional Konsep', 'Unsur Kinerja / Jawaban yang Diharapkan']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [30, 58, 138],
        textColor: 255,
        fontSize: 8,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 7.5,
        textColor: 30,
      },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 26, fontStyle: 'bold' },
        2: { cellWidth: 80 },
        3: { cellWidth: 66 },
      },
      margin: { left: 14, right: 14 },
    });
  };

  const renderRubrik = (startY: number) => {
    let currentY = startY;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 58, 138);
    doc.text('ATURAN PENSKORAN:', 14, currentY);
    currentY += 4.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    const ruleText = doc.splitTextToSize(data.rubrikPenskoran?.generalRule || '-', pageWidth - 28);
    doc.text(ruleText, 14, currentY);
    currentY += ruleText.length * 4 + 3;

    doc.setFont('helvetica', 'bold');
    doc.text(`Rumus Nilai: ${data.rubrikPenskoran?.formula || 'Nilai = (Skor / Skor Maksimal) x 100'}`, 14, currentY);
    currentY += 6;

    // Criteria Table
    const critRows: string[][] = [];
    (data.rubrikPenskoran?.criteria || []).forEach((crit) => {
      crit.indicators.forEach((ind) => {
        critRows.push([crit.itemNumberOrAspect, ind.level, ind.scoreRange, ind.description]);
      });
    });

    autoTable(doc, {
      startY: currentY,
      head: [['Aspek / Butir', 'Kategori Capaian', 'Rentang Skor', 'Deskripsi Kualitas / Indikator']],
      body: critRows,
      theme: 'grid',
      headStyles: {
        fillColor: [30, 58, 138],
        textColor: 255,
        fontSize: 8,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 7.5,
        textColor: 30,
      },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 35 },
        2: { cellWidth: 24, halign: 'center' },
        3: { cellWidth: 83 },
      },
      margin: { left: 14, right: 14 },
    });

    const finalY = (doc as any).lastAutoTable?.finalY || currentY + 40;
    let nextY = finalY + 8;

    if (data.rubrikPenskoran?.followUpRecommendations) {
      if (nextY > pageHeight - 35) {
        doc.addPage();
        nextY = 20;
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 58, 138);
      doc.text('RANCANGAN TINDAK LANJUT PEMBELAJARAN:', 14, nextY);
      nextY += 5;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      doc.text('Remedial: ', 14, nextY);
      doc.setFont('helvetica', 'normal');
      const remText = doc.splitTextToSize(data.rubrikPenskoran.followUpRecommendations.remedial, pageWidth - 40);
      doc.text(remText, 32, nextY);
      nextY += remText.length * 3.8 + 2;

      doc.setFont('helvetica', 'bold');
      doc.text('Pengayaan: ', 14, nextY);
      doc.setFont('helvetica', 'normal');
      const enrichText = doc.splitTextToSize(data.rubrikPenskoran.followUpRecommendations.enrichment, pageWidth - 40);
      doc.text(enrichText, 32, nextY);
      nextY += enrichText.length * 3.8 + 2;

      doc.setFont('helvetica', 'bold');
      doc.text('Catatan Guru: ', 14, nextY);
      doc.setFont('helvetica', 'normal');
      const noteText = doc.splitTextToSize(data.rubrikPenskoran.followUpRecommendations.pedagogicalNote, pageWidth - 40);
      doc.text(noteText, 32, nextY);
    }
  };

  if (scope === 'all') {
    // 1. NASKAH SOAL (Halaman pertama untuk Peserta Didik)
    const y1 = drawKop(doc, 'Naskah Soal Asesmen Peserta Didik', data, true);
    renderNaskahSoal(y1);

    // 2. KISI-KISI SOAL (Halaman baru)
    doc.addPage();
    const y2 = drawKop(doc, 'Kisi-Kisi Asesmen Pembelajaran', data, false);
    renderKisiKisi(y2);

    // 3. KUNCI JAWABAN (Halaman baru)
    doc.addPage();
    const y3 = drawKop(doc, 'Kunci Jawaban & Pedoman Pembahasan', data, false);
    renderKunciJawaban(y3);

    // 4. RUBRIK (Halaman baru)
    doc.addPage();
    const y4 = drawKop(doc, 'Rubrik Penilaian & Pedoman Penskoran', data, false);
    renderRubrik(y4);
  } else if (scope === 'kisi_kisi') {
    const y = drawKop(doc, 'Kisi-Kisi Asesmen Pembelajaran', data, false);
    renderKisiKisi(y);
  } else if (scope === 'naskah_soal') {
    const y = drawKop(doc, 'Naskah Soal Asesmen Peserta Didik', data, true);
    renderNaskahSoal(y);
  } else if (scope === 'kunci_jawaban') {
    const y = drawKop(doc, 'Kunci Jawaban & Pedoman Pembahasan', data, false);
    renderKunciJawaban(y);
  } else if (scope === 'rubrik') {
    const y = drawKop(doc, 'Rubrik Penilaian & Pedoman Penskoran', data, false);
    renderRubrik(y);
  }

  // Add Page Numbers
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `SUPM TEGAL - Asesmen Mendalam | Halaman ${i} dari ${totalPages}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }

  const arrayBuffer = doc.output('arraybuffer');
  return Buffer.from(arrayBuffer);
}
