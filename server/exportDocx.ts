import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  WidthType,
  AlignmentType,
  BorderStyle,
  PageBreak,
} from 'docx';
import { AssessmentResult } from '../src/types/assessment.js';

export type ExportScope = 'all' | 'kisi_kisi' | 'naskah_soal' | 'kunci_jawaban' | 'rubrik';

const BORDER_STYLE_SINGLE = {
  style: BorderStyle.SINGLE,
  size: 1,
  color: '94A3B8',
};

const CELL_BORDERS = {
  top: BORDER_STYLE_SINGLE,
  bottom: BORDER_STYLE_SINGLE,
  left: BORDER_STYLE_SINGLE,
  right: BORDER_STYLE_SINGLE,
};

function createHeaderSection(title: string, data: AssessmentResult, forStudent = false): Paragraph[] {
  const paragraphs: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: 'KEMENTERIAN KELAUTAN DAN PERIKANAN REPUBLIK INDONESIA',
          bold: true,
          size: 20, // 10pt
          font: 'Arial',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: 'SEKOLAH USAHA PERIKANAN MENENGAH (SUPM) TEGAL',
          bold: true,
          size: 24, // 12pt
          color: '1E3A8A', // Navy
          font: 'Arial',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 180 },
      children: [
        new TextRun({
          text: 'Jl. Martoloyo No. 22, Kel. Mintaragen, Kec. Tegal Timur, Kota Tegal, Jawa Tengah 52121',
          italics: true,
          size: 16,
          font: 'Arial',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: 180 },
      children: [
        new TextRun({
          text: title.toUpperCase(),
          bold: true,
          size: 26,
          color: '0F172A',
          font: 'Arial',
        }),
      ],
    }),
  ];

  // Identity block table or paragraph
  paragraphs.push(
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({ text: 'Mata Pelajaran    : ', bold: true, font: 'Arial' }),
        new TextRun({ text: `${data.metadata.subject}\t\t`, font: 'Arial' }),
        new TextRun({ text: 'Kelas / Jurusan : ', bold: true, font: 'Arial' }),
        new TextRun({ text: `Kelas ${data.metadata.grade} - ${data.metadata.majorFullName}`, font: 'Arial' }),
      ],
    }),
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({ text: 'Jenis Asesmen     : ', bold: true, font: 'Arial' }),
        new TextRun({ text: `${data.metadata.assessmentType}\t\t`, font: 'Arial' }),
        new TextRun({ text: 'Bentuk / Jumlah : ', bold: true, font: 'Arial' }),
        new TextRun({ text: `${data.metadata.instrumentType} (${data.metadata.itemCount} Butir)`, font: 'Arial' }),
      ],
    }),
    new Paragraph({
      spacing: { after: 180 },
      children: [
        new TextRun({ text: 'Guru Pengampu     : ', bold: true, font: 'Arial' }),
        new TextRun({ text: `${data.metadata.teacherName || '-'}\t\t`, font: 'Arial' }),
        new TextRun({ text: 'Tanggal / Level : ', bold: true, font: 'Arial' }),
        new TextRun({ text: `${data.metadata.createdAt} | SOLO: ${data.metadata.cognitiveLevel}`, font: 'Arial' }),
      ],
    })
  );

  if (forStudent) {
    paragraphs.push(
      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun({ text: 'Nama Peserta Didik : _____________________________________   ', bold: true, font: 'Arial' }),
          new TextRun({ text: 'No. Absen / NIS : ___________________', bold: true, font: 'Arial' }),
        ],
      })
    );
  }

  return paragraphs;
}

function buildKisiKisiTable(data: AssessmentResult): Table {
  const headerRow = new TableRow({
    tableHeader: true,
    children: [
      new TableCell({
        width: { size: 600, type: WidthType.DXA },
        borders: CELL_BORDERS,
        children: [new Paragraph({ children: [new TextRun({ text: 'No', bold: true, font: 'Arial' })] })],
      }),
      new TableCell({
        width: { size: 2400, type: WidthType.DXA },
        borders: CELL_BORDERS,
        children: [new Paragraph({ children: [new TextRun({ text: 'Tujuan Pembelajaran', bold: true, font: 'Arial' })] })],
      }),
      new TableCell({
        width: { size: 1800, type: WidthType.DXA },
        borders: CELL_BORDERS,
        children: [new Paragraph({ children: [new TextRun({ text: 'Materi Pokok', bold: true, font: 'Arial' })] })],
      }),
      new TableCell({
        width: { size: 2400, type: WidthType.DXA },
        borders: CELL_BORDERS,
        children: [new Paragraph({ children: [new TextRun({ text: 'Indikator Soal/Tugas', bold: true, font: 'Arial' })] })],
      }),
      new TableCell({
        width: { size: 1200, type: WidthType.DXA },
        borders: CELL_BORDERS,
        children: [new Paragraph({ children: [new TextRun({ text: 'Level SOLO', bold: true, font: 'Arial' })] })],
      }),
      new TableCell({
        width: { size: 1000, type: WidthType.DXA },
        borders: CELL_BORDERS,
        children: [new Paragraph({ children: [new TextRun({ text: 'No. Soal', bold: true, font: 'Arial' })] })],
      }),
      new TableCell({
        width: { size: 1000, type: WidthType.DXA },
        borders: CELL_BORDERS,
        children: [new Paragraph({ children: [new TextRun({ text: 'Bobot', bold: true, font: 'Arial' })] })],
      }),
    ],
  });

  const dataRows = (data.kisiKisi || []).map(
    (item, index) =>
      new TableRow({
        children: [
          new TableCell({
            borders: CELL_BORDERS,
            children: [new Paragraph({ children: [new TextRun({ text: String(item.no || index + 1), font: 'Arial' })] })],
          }),
          new TableCell({
            borders: CELL_BORDERS,
            children: [new Paragraph({ children: [new TextRun({ text: item.learningObjective || '-', font: 'Arial' })] })],
          }),
          new TableCell({
            borders: CELL_BORDERS,
            children: [new Paragraph({ children: [new TextRun({ text: item.topic || '-', font: 'Arial' })] })],
          }),
          new TableCell({
            borders: CELL_BORDERS,
            children: [new Paragraph({ children: [new TextRun({ text: item.itemIndicator || '-', font: 'Arial' })] })],
          }),
          new TableCell({
            borders: CELL_BORDERS,
            children: [new Paragraph({ children: [new TextRun({ text: item.cognitiveLevel || '-', font: 'Arial' })] })],
          }),
          new TableCell({
            borders: CELL_BORDERS,
            children: [new Paragraph({ children: [new TextRun({ text: String(item.itemNumber || index + 1), font: 'Arial' })] })],
          }),
          new TableCell({
            borders: CELL_BORDERS,
            children: [new Paragraph({ children: [new TextRun({ text: String(item.scoreWeight || '-'), font: 'Arial' })] })],
          }),
        ],
      })
  );

  return new Table({
    width: { size: 10400, type: WidthType.DXA },
    rows: [headerRow, ...dataRows],
  });
}

function buildNaskahSoalSection(data: AssessmentResult): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  // Petunjuk Umum
  if (data.naskahSoal?.generalInstructions?.length) {
    paragraphs.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 120, after: 60 },
        children: [new TextRun({ text: 'PETUNJUK UMUM PENGERJAAN:', bold: true, font: 'Arial' })],
      })
    );
    data.naskahSoal.generalInstructions.forEach((inst, i) => {
      paragraphs.push(
        new Paragraph({
          spacing: { after: 40 },
          children: [new TextRun({ text: `${i + 1}. ${inst}`, font: 'Arial' })],
        })
      );
    });
  }

  paragraphs.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 180, after: 120 },
      children: [new TextRun({ text: 'DAFTAR BUTIR ASESMEN:', bold: true, font: 'Arial' })],
    })
  );

  const items = data.naskahSoal?.items || [];
  items.forEach((item, index) => {
    paragraphs.push(
      new Paragraph({
        spacing: { before: 120, after: 60 },
        children: [
          new TextRun({
            text: `${item.itemNumber || index + 1}. `,
            bold: true,
            font: 'Arial',
          }),
          new TextRun({
            text: item.questionText,
            font: 'Arial',
          }),
        ],
      })
    );

    // Opsi A-E jika ada
    if (item.options) {
      const keys: Array<keyof typeof item.options> = ['A', 'B', 'C', 'D', 'E'];
      keys.forEach((k) => {
        if (item.options && item.options[k]) {
          paragraphs.push(
            new Paragraph({
              indent: { left: 400 },
              spacing: { after: 30 },
              children: [
                new TextRun({ text: `${k}. `, bold: true, font: 'Arial' }),
                new TextRun({ text: item.options[k], font: 'Arial' }),
              ],
            })
          );
        }
      });
    }

    // Work steps jika praktik
    if (item.workSteps && item.workSteps.length > 0) {
      paragraphs.push(
        new Paragraph({
          indent: { left: 400 },
          spacing: { before: 60, after: 40 },
          children: [new TextRun({ text: 'Langkah / Instruksi Kerja:', bold: true, italics: true, font: 'Arial' })],
        })
      );
      item.workSteps.forEach((step, sIdx) => {
        paragraphs.push(
          new Paragraph({
            indent: { left: 600 },
            spacing: { after: 30 },
            children: [new TextRun({ text: `${sIdx + 1}) ${step}`, font: 'Arial' })],
          })
        );
      });
    }
  });

  return paragraphs;
}

function buildKunciJawabanSection(data: AssessmentResult): Paragraph[] {
  const paragraphs: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: 'DOKUMEN RAHASIA - HANYA UNTUK GURU / PENILAI',
          bold: true,
          color: 'DC2626', // Red
          font: 'Arial',
          size: 20,
        }),
      ],
    }),
  ];

  (data.kunciJawaban || []).forEach((kunci) => {
    paragraphs.push(
      new Paragraph({
        spacing: { before: 100, after: 40 },
        children: [
          new TextRun({ text: `Nomor ${kunci.itemNumber} - Kunci: `, bold: true, font: 'Arial' }),
          new TextRun({ text: kunci.correctAnswer, bold: true, color: '1E3A8A', font: 'Arial' }),
        ],
      }),
      new Paragraph({
        indent: { left: 400 },
        spacing: { after: 40 },
        children: [
          new TextRun({ text: 'Pembahasan: ', bold: true, italics: true, font: 'Arial' }),
          new TextRun({ text: kunci.explanation, font: 'Arial' }),
        ],
      })
    );

    if (kunci.expectedPerformance && kunci.expectedPerformance.length > 0) {
      paragraphs.push(
        new Paragraph({
          indent: { left: 400 },
          spacing: { after: 40 },
          children: [
            new TextRun({ text: 'Kriteria Kinerja / Unsur Jawaban: ', bold: true, font: 'Arial' }),
            new TextRun({ text: kunci.expectedPerformance.join(', '), font: 'Arial' }),
          ],
        })
      );
    }
  });

  return paragraphs;
}

function buildRubrikSection(data: AssessmentResult): Paragraph[] {
  const paragraphs: Paragraph[] = [
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({ text: 'Aturan Umum Penskoran: ', bold: true, font: 'Arial' }),
        new TextRun({ text: data.rubrikPenskoran?.generalRule || '-', font: 'Arial' }),
      ],
    }),
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({ text: 'Rumus Konversi Nilai: ', bold: true, font: 'Arial' }),
        new TextRun({ text: data.rubrikPenskoran?.formula || 'Nilai Akhir = (Total Skor / Skor Maksimal) x 100', font: 'Arial' }),
      ],
    }),
  ];

  (data.rubrikPenskoran?.criteria || []).forEach((crit) => {
    paragraphs.push(
      new Paragraph({
        spacing: { before: 120, after: 60 },
        children: [new TextRun({ text: `Kriteria: ${crit.itemNumberOrAspect}`, bold: true, font: 'Arial' })],
      })
    );

    crit.indicators.forEach((ind) => {
      paragraphs.push(
        new Paragraph({
          indent: { left: 400 },
          spacing: { after: 40 },
          children: [
            new TextRun({ text: `• [${ind.level} | Skor: ${ind.scoreRange}] : `, bold: true, font: 'Arial' }),
            new TextRun({ text: ind.description, font: 'Arial' }),
          ],
        })
      );
    });
  });

  if (data.rubrikPenskoran?.followUpRecommendations) {
    paragraphs.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 160, after: 80 },
        children: [new TextRun({ text: 'RANCANGAN TINDAK LANJUT PEMBELAJARAN:', bold: true, font: 'Arial' })],
      }),
      new Paragraph({
        spacing: { after: 40 },
        children: [
          new TextRun({ text: 'Program Remedial: ', bold: true, font: 'Arial' }),
          new TextRun({ text: data.rubrikPenskoran.followUpRecommendations.remedial, font: 'Arial' }),
        ],
      }),
      new Paragraph({
        spacing: { after: 40 },
        children: [
          new TextRun({ text: 'Program Pengayaan: ', bold: true, font: 'Arial' }),
          new TextRun({ text: data.rubrikPenskoran.followUpRecommendations.enrichment, font: 'Arial' }),
        ],
      }),
      new Paragraph({
        spacing: { after: 40 },
        children: [
          new TextRun({ text: 'Catatan Pedagogis Guru: ', bold: true, font: 'Arial' }),
          new TextRun({ text: data.rubrikPenskoran.followUpRecommendations.pedagogicalNote, font: 'Arial' }),
        ],
      })
    );
  }

  return paragraphs;
}

export async function generateDocxBuffer(data: AssessmentResult, scope: ExportScope): Promise<Buffer> {
  const allChildren: (Paragraph | Table)[] = [];

  if (scope === 'all') {
    // 1. NASKAH SOAL PESERTA DIDIK
    allChildren.push(...createHeaderSection('Naskah Soal Asesmen Peserta Didik', data, true));
    allChildren.push(...buildNaskahSoalSection(data));

    // PAGE BREAK to separate student test from teacher rubrics/answer keys
    allChildren.push(new Paragraph({ children: [new PageBreak()] }));

    // 2. KISI-KISI SOAL
    allChildren.push(...createHeaderSection('Kisi-Kisi Asesmen Pembelajaran', data));
    allChildren.push(buildKisiKisiTable(data));

    allChildren.push(new Paragraph({ children: [new PageBreak()] }));

    // 3. KUNCI JAWABAN TERPISAH
    allChildren.push(...createHeaderSection('Kunci Jawaban & Pedoman Pembahasan', data));
    allChildren.push(...buildKunciJawabanSection(data));

    allChildren.push(new Paragraph({ children: [new PageBreak()] }));

    // 4. RUBRIK PENILAIAN
    allChildren.push(...createHeaderSection('Rubrik Penilaian & Pedoman Penskoran', data));
    allChildren.push(...buildRubrikSection(data));
  } else if (scope === 'kisi_kisi') {
    allChildren.push(...createHeaderSection('Kisi-Kisi Asesmen Pembelajaran', data));
    allChildren.push(buildKisiKisiTable(data));
  } else if (scope === 'naskah_soal') {
    allChildren.push(...createHeaderSection('Naskah Soal Asesmen Peserta Didik', data, true));
    allChildren.push(...buildNaskahSoalSection(data));
  } else if (scope === 'kunci_jawaban') {
    allChildren.push(...createHeaderSection('Kunci Jawaban & Pedoman Pembahasan', data));
    allChildren.push(...buildKunciJawabanSection(data));
  } else if (scope === 'rubrik') {
    allChildren.push(...createHeaderSection('Rubrik Penilaian & Pedoman Penskoran', data));
    allChildren.push(...buildRubrikSection(data));
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: allChildren,
      },
    ],
  });

  return await Packer.toBuffer(doc);
}
