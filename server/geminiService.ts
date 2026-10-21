import { GoogleGenAI } from '@google/genai';
import { AssessmentFormData, AssessmentResult, QualityCheckData } from '../src/types/assessment.js';
import { getMajorFullName } from './promptTemplate.js';

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'MY_GEMINI_API_KEY') {
    const error = new Error('GEMINI_API_KEY_UNCONFIGURED');
    (error as any).code = 'KEY_MISSING';
    throw error;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export async function generateAssessmentWithGemini(formData: AssessmentFormData): Promise<AssessmentResult> {
  const ai = getAiClient();
  const majorFullName = getMajorFullName(formData.major);

  const systemInstruction = `Anda adalah Pakar Asesmen dan Kurikulum Pendidikan Kejuruan Kelautan dan Perikanan SMK SUPM (Sekolah Usaha Perikanan Menengah) Tegal.
Tugas Anda adalah menghasilkan perangkat asesmen pembelajaran lengkap, valid, mendalam, dan profesional dalam format JSON terstruktur murni.
Standar Kejuruan:
- SUPM TEGAL memiliki 4 jurusan unggulan: NKPI (Nautika Kapal Penangkap Ikan), TKPI (Teknika Kapal Penangkap Ikan), APPL (Agribisnis Perikanan Air Payau dan Laut), APHP (Agribisnis Pengolahan Hasil Perikanan).
- Perangkat asesmen harus relevan dengan standar industri kemaritiman dan perikanan (IMO STCW-F, Good Aquaculture Practices, HACCP perikanan).
- Taksonomi SOLO diterapkan: Prastruktural, Unistruktural, Multistruktural, Relasional, Abstrak Diperluas.
- Pilihan Ganda: SETIAP butir WAJIB memiliki tepat 5 pilihan opsi: A, B, C, D, E. Satu jawaban definitif benar, opsi masuk akal dan kontekstual.
- Jumlah butir: WAJIB tepat sejumlah ${formData.itemCount} butir.
- Naskah soal untuk peserta didik tidak boleh memuat jawaban atau kunci. Kunci jawaban berada di bagian terpisah.
- Rubrik penskoran harus spesifik untuk bentuk instrumen (${formData.instrumentType}) dan jenis asesmen (${formData.assessmentType}).
- Keluarkan HANYA string JSON valid, tanpa teks pengantar atau penutup.`;

  const userPrompt = `Buatkan perangkat asesmen pembelajaran lengkap untuk SUPM TEGAL dengan rincian berikut:
{
  "schoolName": "SUPM TEGAL",
  "teacherName": "${formData.teacherName}",
  "subject": "${formData.subject}",
  "educationLevel": "SMK",
  "grade": "${formData.grade}",
  "major": "${formData.major} - ${majorFullName}",
  "assessmentType": "${formData.assessmentType}",
  "topic": "${formData.topic}",
  "learningObjective": "${formData.learningObjective}",
  "additionalIndicator": "${formData.additionalIndicator || '-'}",
  "instrumentType": "${formData.instrumentType}",
  "itemCount": ${formData.itemCount},
  "cognitiveLevel": "${formData.cognitiveLevel}",
  "additionalNotes": "${formData.additionalNotes || '-'}"
}

Spesifikasi Jenis Asesmen (${formData.assessmentType}):
${
  formData.assessmentType === 'Diagnostik'
    ? '- Fokus: Identifikasi pengetahuan awal, kesiapan prasyarat maritim/perikanan, deteksi miskonsepsi teknis, dan rancangan tindak lanjut pembelajaran berdiferensiasi.'
    : formData.assessmentType === 'Formatif'
    ? '- Fokus: Monitoring proses pembelajaran di kelas/laboratorium/bengkel/tambak/kapal latih, pemberian umpan balik konstruktif, dan perbaikan metode belajar.'
    : '- Fokus: Pengukuran ketercapaian kompetensi akhir (capaian pembelajaran) dengan validitas isi, reliabilitas penskoran, dan grading terstandar.'
}

Keluarkan format JSON dengan skema persis seperti ini:
{
  "kisiKisi": [
    {
      "no": 1,
      "learningObjective": "Tujuan pembelajaran spesifik",
      "topic": "Sub-materi/materi",
      "itemIndicator": "Indikator butir soal",
      "cognitiveLevel": "${formData.cognitiveLevel}",
      "instrumentType": "${formData.instrumentType}",
      "itemNumber": 1,
      "scoreWeight": 10
    }
  ],
  "naskahSoal": {
    "generalInstructions": [
      "Tuliskan identitas nama, nomor absen, dan kelas pada lembar jawaban.",
      "Bacalah setiap butir soal dengan cermat sebelum menjawab.",
      "Dilarang bekerja sama atau menggunakan alat bantu tanpa izin pengawas."
    ],
    "items": [
      {
        "itemNumber": 1,
        "type": "${formData.instrumentType === 'Pilihan Ganda' ? 'pilihan_ganda' : formData.instrumentType === 'Esai/Uraian' ? 'esai' : formData.instrumentType === 'Praktik/Unjuk Kerja' ? 'praktik' : 'observasi'}",
        "questionText": "Teks stimulus soal yang kontekstual dan jelas...",
        "options": {
          "A": "Pilihan A",
          "B": "Pilihan B",
          "C": "Pilihan C",
          "D": "Pilihan D",
          "E": "Pilihan E"
        },
        "workSteps": ["Langkah 1 jika praktik..."],
        "allocatedScore": 10
      }
    ]
  },
  "kunciJawaban": [
    {
      "itemNumber": 1,
      "correctAnswer": "A",
      "explanation": "Pembahasan rinci berdasarkan konsep kemaritiman/perikanan...",
      "expectedPerformance": ["Unsur penting jika esai/praktik"]
    }
  ],
  "rubrikPenskoran": {
    "generalRule": "Pedoman umum penskoran untuk asesmen ${formData.assessmentType} bentuk ${formData.instrumentType}",
    "totalMaxScore": 100,
    "formula": "Nilai Akhir = (Total Skor Perolehan / Total Skor Maksimal) x 100",
    "criteria": [
      {
        "itemNumberOrAspect": "Aspek Pemahaman Konsep / Soal No. 1",
        "indicators": [
          { "level": "Sangat Baik (4)", "scoreRange": "86 - 100", "description": "Deskripsi penguasaan sangat mendalam dan presisi." },
          { "level": "Baik (3)", "scoreRange": "71 - 85", "description": "Deskripsi penguasaan baik dengan kesalahan minor." },
          { "level": "Cukup (2)", "scoreRange": "56 - 70", "description": "Deskripsi penguasaan cukup namun memerlukan pendampingan." },
          { "level": "Perlu Bimbingan (1)", "scoreRange": "< 56", "description": "Belum memahami konsep dasar." }
        ]
      }
    ],
    "followUpRecommendations": {
      "remedial": "Langkah remedial terarah bagi peserta didik yang belum mencapai ketuntasan...",
      "enrichment": "Kegiatan pengayaan kontekstual maritim bagi peserta didik yang telah melampaui kriteria...",
      "pedagogicalNote": "Catatan reflektif bagi guru dalam menyempurnakan strategi instruksional..."
    }
  }
}
Pastikan jumlah items pada kisiKisi, naskahSoal.items, dan kunciJawaban tepat berjumlah ${formData.itemCount}!`;

  // Retry logic with exponential backoff
  let lastError: any = null;
  const maxRetries = 2;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userPrompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const responseText = response.text || '';
      if (!responseText.trim()) {
        throw new Error('Respons dari Gemini API kosong');
      }

      // Clean markdown code blocks if any
      let cleanedJson = responseText.trim();
      if (cleanedJson.startsWith('```json')) {
        cleanedJson = cleanedJson.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
      } else if (cleanedJson.startsWith('```')) {
        cleanedJson = cleanedJson.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      const parsed = JSON.parse(cleanedJson);

      // Perform Quality Checks
      const targetCount = Number(formData.itemCount);
      const actualCount = parsed?.naskahSoal?.items?.length || 0;
      const itemCountMatched = actualCount === targetCount;

      let mcFiveOptionsVerified = true;
      if (formData.instrumentType === 'Pilihan Ganda') {
        parsed?.naskahSoal?.items?.forEach((it: any) => {
          if (!it.options || !it.options.A || !it.options.B || !it.options.C || !it.options.D || !it.options.E) {
            mcFiveOptionsVerified = false;
          }
        });
      }

      const answerKeyMatched = (parsed?.kunciJawaban?.length || 0) >= actualCount;
      const rubricAligned = Boolean(parsed?.rubrikPenskoran?.formula && parsed?.rubrikPenskoran?.criteria?.length);

      const teacherVerificationNotes: string[] = [];
      if (!itemCountMatched) {
        teacherVerificationNotes.push(`Jumlah butir soal yang digenerate adalah ${actualCount} (target: ${targetCount}).`);
      }
      if (formData.instrumentType === 'Pilihan Ganda' && !mcFiveOptionsVerified) {
        teacherVerificationNotes.push('Periksa kelengkapan opsi pilihan ganda A-E pada beberapa butir soal.');
      }
      teacherVerificationNotes.push('Verifikasi keselarasan kunci jawaban dengan kondisi kapal/laboratorium aktual di SUPM Tegal.');
      teacherVerificationNotes.push('Sesuaikan bobot penilaian dengan rubrik Kriteria Ketercapaian Tujuan Pembelajaran (KKTP) sekolah.');

      const qualityCheck: QualityCheckData = {
        itemCountMatched,
        targetCount,
        actualCount,
        mcFiveOptionsVerified,
        answerKeyMatched,
        rubricAligned,
        teacherVerificationNotes,
      };

      const result: AssessmentResult = {
        metadata: {
          id: 'supm-asm-' + Date.now().toString(36),
          schoolName: 'SUPM TEGAL',
          teacherName: formData.teacherName,
          subject: formData.subject,
          educationLevel: 'SMK',
          grade: formData.grade,
          major: formData.major,
          majorFullName,
          assessmentType: formData.assessmentType,
          topic: formData.topic,
          learningObjective: formData.learningObjective,
          additionalIndicator: formData.additionalIndicator,
          instrumentType: formData.instrumentType,
          cognitiveLevel: formData.cognitiveLevel,
          itemCount: actualCount,
          createdAt: new Date().toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          purposeDescription:
            formData.assessmentType === 'Diagnostik'
              ? 'Asesmen awal untuk memetakan kesiapan, pemahaman prasyarat, dan mendeteksi miskonsepsi.'
              : formData.assessmentType === 'Formatif'
              ? 'Asesmen proses untuk memantau perkembangan kompetensi dan memberikan umpan balik perbaikan.'
              : 'Asesmen akhir untuk mengukur ketercapaian kompetensi pembelajaran secara komprehensif.',
        },
        kisiKisi: parsed.kisiKisi || [],
        naskahSoal: parsed.naskahSoal || { generalInstructions: [], items: [] },
        kunciJawaban: parsed.kunciJawaban || [],
        rubrikPenskoran: parsed.rubrikPenskoran || {
          generalRule: 'Pedoman Penskoran',
          totalMaxScore: 100,
          formula: 'Nilai = (Skor / Skor Maksimal) x 100',
          criteria: [],
          followUpRecommendations: { remedial: '', enrichment: '', pedagogicalNote: '' },
        },
        qualityCheck,
      };

      return result;
    } catch (err: any) {
      lastError = err;
      // If error is configuration/permanent (e.g. key missing), do not retry
      if (err.code === 'KEY_MISSING' || err.message?.includes('API_KEY_INVALID')) {
        throw err;
      }
    }
  }

  throw lastError;
}
