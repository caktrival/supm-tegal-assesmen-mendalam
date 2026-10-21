import { AssessmentFormData } from '../src/types/assessment.js';

export function getMajorFullName(major: string): string {
  switch (major) {
    case 'NKPI':
      return 'Nautika Kapal Penangkap Ikan (NKPI)';
    case 'TKPI':
      return 'Teknika Kapal Penangkap Ikan (TKPI)';
    case 'APPL':
      return 'Agribisnis Perikanan Air Payau dan Laut (APPL)';
    case 'APHP':
      return 'Agribisnis Pengolahan Hasil Perikanan (APHP)';
    default:
      return major;
  }
}

export function generateManualPrompt(data: AssessmentFormData): string {
  const majorFull = getMajorFullName(data.major);

  return `================================================================================
PROMPT PERANGKAT ASESMEN PEMBELAJARAN SMK - SUPM TEGAL
(Salin seluruh prompt di bawah ini ke Google Gemini / AI Chat)
================================================================================

PERAN ANDA:
Anda adalah Pakar Kurikulum dan Asesmen Pendidikan Kejuruan Kelautan dan Perikanan untuk SMK SUPM (Sekolah Usaha Perikanan Menengah) Tegal.
Tugas Anda adalah menyusun Perangkat Asesmen Pembelajaran Mendalam yang komprehensif, valid, dan siap pakai.

IDENTITAS ASESMEN:
- Satuan Pendidikan : SUPM TEGAL (Sekolah Menengah Kejuruan Kelautan & Perikanan)
- Nama Guru        : ${data.teacherName || '[Nama Guru Pengampu]'}
- Mata Pelajaran   : ${data.subject}
- Jenjang          : SMK
- Kelas / Semester : Kelas ${data.grade}
- Program Keahlian : ${majorFull}
- Jenis Asesmen    : ${data.assessmentType}
- Materi / Topik   : ${data.topic}
- Tujuan Belajar   : ${data.learningObjective}
${data.additionalIndicator ? `- Capaian / Indikator Tambahan: ${data.additionalIndicator}` : ''}
- Bentuk Instrumen : ${data.instrumentType}
- Jumlah Butir     : ${data.itemCount} butir
- Tingkat Kognitif : Berdasarkan Taksonomi SOLO (fokus pada level: ${data.cognitiveLevel})
${data.additionalNotes ? `- Instruksi Tambahan : ${data.additionalNotes}` : ''}

PEDOMAN KHUSUS BERDASARKAN JENIS ASESMEN (${data.assessmentType}):
${
  data.assessmentType === 'Diagnostik'
    ? `* Tujuan: Mengidentifikasi pengetahuan awal, kesiapan belajar, prasyarat kompetensi kemaritiman/perikanan, serta melacak potensi miskonsepsi teknis.
* Kisi-kisi dan butir soal dirancang untuk mendeteksi akar kelemahan siswa.
* Sertakan rekomendasi tindak lanjut diferensiasi: materi intervensi untuk yang belum siap dan pengayaan untuk yang sudah mahir.`
    : data.assessmentType === 'Formatif'
    ? `* Tujuan: Memantau perkembangan belajar peserta didik selama proses berlangsung, memberikan umpan balik spesifik, dan menyarankan tindakan korektif cepat.
* Soal menggunakan stimulus kontekstual nyata di kapal, bengkel mesin kapal, tambak budidaya, atau unit pengolahan ikan.
* Rubrik memberikan panduan feedback langsung bagi guru dan refleksi bagi siswa.`
    : `* Tujuan: Mengukur ketercapaian kompetensi akhir (capaian pembelajaran) peserta didik secara akurat, adil, dan objektif.
* Menggunakan kisi-kisi terstandar, pedoman penskoran baku, dan kunci jawaban definitif dengan pembagian bobot yang proporsional.`
}

ATURAN STRUKTURAL WAJIB:
1. Jika instrumen adalah Pilihan Ganda (atau terdapat bagian PG pada Campuran), setiap butir WAJIB memiliki tepat 5 opsi (A, B, C, D, E). Opsi harus homogen, masuk akal secara teknis kelautan/perikanan, dan hanya ada 1 jawaban paling benar.
2. Jika instrumen adalah Esai, Praktik/Unjuk Kerja, atau Observasi, susun stimulus kontekstual, instruksi tugas operasional yang jelas, dan kriteria kinerja yang dapat diamati (observable).
3. Buat tepat ${data.itemCount} butir soal, tidak boleh kurang dan tidak boleh lebih.
4. Naskah soal untuk peserta didik harus BERSIH tanpa kunci jawaban atau bocoran pembahasan.

SUSUN OUTPUT MENJADI 4 BAGIAN TERPISAH:

BAGIAN 1: KISI-KISI ASESMEN
Buat tabel dengan kolom:
| No | Tujuan Pembelajaran | Materi Pokok | Indikator Soal / Kinerja | Level SOLO | Bentuk Soal | No. Butir | Bobot Skor |

BAGIAN 2: NASKAH SOAL (SIAP CETAK UNTUK PESERTA DIDIK)
- Kop Judul: SUPM TEGAL, Mata Pelajaran, Kelas, Jurusan, Alokasi Waktu
- Petunjuk Umum Pengerjaan
- Naskah Butir Soal Nomor 1 sampai ${data.itemCount}
(PERINGATAN: Jangan mencantumkan kunci atau jawaban di bagian ini!)

BAGIAN 3: KUNCI JAWABAN & PEMBAHASAN TERPISAH
- Tabel Kunci Jawaban Resmi (Nomor Soal, Kunci Benar / Poin Kunci Jawaban)
- Pembahasan Rinci dan Penjelasan Konsep Teknis Maritim / Perikanan
- Unsur Jawaban / Kinerja yang Diharapkan (untuk Esai / Praktik)

BAGIAN 4: RUBRIK DAN PEDOMAN PENSKORAN
- Aturan penskoran spesifik sesuai bentuk instrumen
- Total Skor Maksimal dan Rumus Perhitungan Nilai Akhir (Skala 0 - 100)
- Rubrik Deskriptif Kriteria Ketercapaian (Sangat Baik / Baik / Cukup / Perlu Bimbingan)
- Tindak Lanjut Hasil Asesmen (Rekomendasi Remedial, Pengayaan, dan Catatan Pedagogis Guru)

Silakan susun seluruh perangkat asesmen tersebut dalam Bahasa Indonesia baku, profesional, dan akurat secara terminologi kejuruan maritim/perikanan.`;
}
