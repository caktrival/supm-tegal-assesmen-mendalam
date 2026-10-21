import React, { useState, useEffect, useRef } from 'react';
import { AssessmentFormData, AssessmentResult } from './types/assessment.js';
import { Header } from './components/Header.js';
import { AssessmentForm } from './components/AssessmentForm.js';
import { OutputViewer } from './components/OutputViewer.js';
import { ManualPromptModal } from './components/ManualPromptModal.js';
import { HelpModal } from './components/HelpModal.js';
import {
  Compass,
  AlertCircle,
  Sparkles,
  CheckCircle,
  FileText,
  Anchor,
  HelpCircle,
} from 'lucide-react';

const INITIAL_FORM: AssessmentFormData = {
  schoolName: 'SUPM TEGAL',
  teacherName: '',
  subject: '',
  educationLevel: 'SMK',
  grade: 'XI',
  major: 'NKPI',
  assessmentType: 'Sumatif',
  topic: '',
  learningObjective: '',
  additionalIndicator: '',
  instrumentType: 'Pilihan Ganda',
  itemCount: 10,
  cognitiveLevel: 'Relasional',
  additionalNotes: '',
};

export default function App() {
  const [formData, setFormData] = useState<AssessmentFormData>(INITIAL_FORM);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<{ title: string; detail?: string; isKeyMissing?: boolean } | null>(null);
  const [apiStatus, setApiStatus] = useState<'checking' | 'configured' | 'unconfigured'>('checking');
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const viewerRef = useRef<HTMLDivElement>(null);

  // Check API health on mount
  useEffect(() => {
    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => {
        setApiStatus(data.configured ? 'configured' : 'unconfigured');
      })
      .catch(() => {
        setApiStatus('unconfigured');
      });
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleApplyPreset = (presetKey: string) => {
    if (presetKey === 'NKPI') {
      setFormData({
        ...formData,
        teacherName: 'Capt. Hendro Wibowo, M.Mar',
        subject: 'Navigasi Datar & Radar Maritim',
        grade: 'XI',
        major: 'NKPI',
        assessmentType: 'Sumatif',
        topic: 'Penentuan Posisi Kapal dan Penghindaran Tubrukan Menggunakan Radar ARPA',
        learningObjective: 'Peserta didik mampu mengidentifikasi target bahaya tubrukan pada layar radar, menghitung CPA (Closest Point of Approach) dan TCPA, serta merumuskan olah gerak kapal sesuai aturan 7 & 8 COLREG 1972.',
        additionalIndicator: 'Mampu mengoperasikan kontrol gain, sea clutter, dan rain clutter pada radar navigasi.',
        instrumentType: 'Pilihan Ganda',
        itemCount: 10,
        cognitiveLevel: 'Relasional',
        additionalNotes: 'Sertakan contoh kasus pelayaran malam hari di Selat Sunda.',
      });
      showToast('Contoh jurusan NKPI berhasil dimuat!');
    } else if (presetKey === 'TKPI') {
      setFormData({
        ...formData,
        teacherName: 'Ir. Danang Prasetyo, S.T., M.T.',
        subject: 'Permesinan Bantu & Refrigerasi Kapal',
        grade: 'XI',
        major: 'TKPI',
        assessmentType: 'Formatif',
        topic: 'Perawatan Sistem Pendingin Kompresor Palkah Ikan Berbasis Freon',
        learningObjective: 'Peserta didik mampu mendeteksi gejala kebocoran zat pendingin pada sistem refrigerasi palkah kapal dan menentukan langkah penggantian filter drier secara aman.',
        additionalIndicator: 'Menerapkan K3 pemakaian gas bertekanan di kamar mesin kapal penangkap ikan.',
        instrumentType: 'Campuran',
        itemCount: 10,
        cognitiveLevel: 'Relasional',
        additionalNotes: 'Fokus pada studi kasus penurunan suhu palkah ikan yang lambat.',
      });
      showToast('Contoh jurusan TKPI berhasil dimuat!');
    } else if (presetKey === 'APPL') {
      setFormData({
        ...formData,
        teacherName: 'Dr. Tri Wahyuni, S.Pi., M.Si.',
        subject: 'Pengelolaan Kualitas Air Tambak Payau',
        grade: 'X',
        major: 'APPL',
        assessmentType: 'Diagnostik',
        topic: 'Parameter Kualitas Air Tambak Udang Vaname (DO, pH, Salinitas)',
        learningObjective: 'Peserta didik mampu mengukur parameter kimia-fisika air tambak udang vaname dan menganalisis hubungan fluktuasi pH terhadap pertumbuhan fitoplankton.',
        additionalIndicator: 'Keterampilan kalibrasi DO meter dan refraktometer salinitas.',
        instrumentType: 'Praktik/Unjuk Kerja',
        itemCount: 5,
        cognitiveLevel: 'Multistruktural',
        additionalNotes: 'Lakukan di laboratorium basah tambak SUPM Tegal.',
      });
      showToast('Contoh jurusan APPL berhasil dimuat!');
    } else if (presetKey === 'APHP') {
      setFormData({
        ...formData,
        teacherName: 'Siti Maryam, S.St.Pi., M.P.',
        subject: 'Diversifikasi Pengolahan & Sanitasi HACCP',
        grade: 'XII',
        major: 'APHP',
        assessmentType: 'Sumatif',
        topic: 'Penerapan Titik Kendali Kritis (CCP) Pembuatan Surimi Beku',
        learningObjective: 'Peserta didik mampu menganalisis bahaya fisik dan mikrobiologis pada tahapan pencucian (leaching) daging lumat ikan dan menentukan batas kritis suhu air pencucian.',
        additionalIndicator: 'Standar SNI Surimi dan uji organoleptik.',
        instrumentType: 'Pilihan Ganda',
        itemCount: 10,
        cognitiveLevel: 'Abstrak Diperluas',
        additionalNotes: 'Kaitkan dengan regulasi ekspor produk perikanan ke Uni Eropa.',
      });
      showToast('Contoh jurusan APHP berhasil dimuat!');
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM);
    setErrorMessage(null);
    showToast('Formulir direset ke pengaturan awal.');
  };

  const handleGenerateAssessment = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/generate-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.detail || 'Gagal memproses permintaan asesmen.');
      }

      setAssessmentResult(data.data);
      showToast('Perangkat asesmen berhasil dihasilkan!');

      // Smooth scroll to results
      setTimeout(() => {
        viewerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } catch (err: any) {
      console.error('Error generating assessment:', err);
      const isMissingKey = err.message?.includes('GEMINI_API_KEY') || err.message?.includes('Kunci API');
      setErrorMessage({
        title: isMissingKey ? 'Kunci API Gemini Belum Dikonfigurasi' : 'Kendala Saat Memproses Asesmen',
        detail:
          err.message ||
          'Layanan AI tidak dapat diakses saat ini. Anda dapat menggunakan tombol Mode Manual Cadangan untuk menyalin prompt langsung.',
        isKeyMissing: isMissingKey,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportDocx = async (scope: 'all' | 'kisi_kisi' | 'naskah_soal' | 'kunci_jawaban' | 'rubrik') => {
    if (!assessmentResult) return;
    setIsExporting(true);

    try {
      const response = await fetch('/api/export/docx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessmentData: assessmentResult, scope }),
      });

      if (!response.ok) {
        throw new Error('Gagal mengunduh file DOCX.');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      let filename = 'SUPM_TEGAL_SemuaPerangkat.docx';
      if (scope === 'kisi_kisi') filename = 'SUPM_TEGAL_KisiKisi.docx';
      else if (scope === 'naskah_soal') filename = 'SUPM_TEGAL_NaskahSoal.docx';
      else if (scope === 'kunci_jawaban') filename = 'SUPM_TEGAL_KunciJawaban.docx';
      else if (scope === 'rubrik') filename = 'SUPM_TEGAL_Rubrik.docx';

      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      showToast(`Dokumen ${filename} berhasil diunduh!`);
    } catch (err: any) {
      alert('Gagal mengunduh DOCX: ' + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPdf = async (scope: 'all' | 'kisi_kisi' | 'naskah_soal' | 'kunci_jawaban' | 'rubrik') => {
    if (!assessmentResult) return;
    setIsExporting(true);

    try {
      const response = await fetch('/api/export/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessmentData: assessmentResult, scope }),
      });

      if (!response.ok) {
        throw new Error('Gagal mengunduh file PDF.');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      let filename = 'SUPM_TEGAL_SemuaPerangkat.pdf';
      if (scope === 'kisi_kisi') filename = 'SUPM_TEGAL_KisiKisi.pdf';
      else if (scope === 'naskah_soal') filename = 'SUPM_TEGAL_NaskahSoal.pdf';
      else if (scope === 'kunci_jawaban') filename = 'SUPM_TEGAL_KunciJawaban.pdf';
      else if (scope === 'rubrik') filename = 'SUPM_TEGAL_Rubrik.pdf';

      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      showToast(`Dokumen PDF ${filename} berhasil diunduh!`);
    } catch (err: any) {
      alert('Gagal mengunduh PDF: ' + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-800">
      {/* Header */}
      <Header
        onOpenHelp={() => setIsHelpModalOpen(true)}
        onOpenManualModal={() => setIsManualModalOpen(true)}
        apiStatus={apiStatus}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:py-8 space-y-6">
        {/* Error Notification Banner if any */}
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-300 rounded-xl p-4 sm:p-5 shadow-sm text-rose-950 flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-rose-100 text-rose-700 shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-rose-900">{errorMessage.title}</h3>
                <p className="text-xs text-rose-800 mt-1 leading-relaxed">{errorMessage.detail}</p>
                {errorMessage.isKeyMissing && (
                  <p className="text-[11px] text-rose-700 mt-2 font-medium">
                    💡 Tips: Anda tetap dapat menggunakan <strong>Mode Manual Cadangan</strong> untuk menyalin teks prompt
                    ke Google Gemini atau ChatGPT.
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                type="button"
                onClick={() => setIsManualModalOpen(true)}
                className="px-3 py-1.5 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg transition flex items-center gap-1.5 shadow-2xs"
              >
                <Compass className="w-3.5 h-3.5 text-amber-700" />
                <span>Buka Mode Manual</span>
              </button>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1"
              >
                Tutup
              </button>
            </div>
          </div>
        )}

        {/* Hero Info Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-950 to-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-md relative overflow-hidden border border-blue-900">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-end pr-6">
            <Anchor className="w-64 h-64 text-white" />
          </div>
          <div className="relative z-10 max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-800/80 border border-blue-700 text-blue-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>Aplikasi Resmi Guru SUPM TEGAL</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Generator Perangkat Asesmen Pembelajaran Mendalam
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Otomatisasi pembuatan perangkat evaluasi pembelajaran SMK Perikanan & Kelautan: Kisi-kisi terpetakan,
              Naskah Soal siswa siap cetak (bersih tanpa kunci), Kunci Jawaban terpisah dengan pembahasan konseptual,
              serta Rubrik Penskoran berbasis Taksonomi SOLO & KKTP.
            </p>
          </div>
        </div>

        {/* Assessment Form */}
        <AssessmentForm
          formData={formData}
          onChange={setFormData}
          onSubmit={handleGenerateAssessment}
          isLoading={isLoading}
          onOpenManualModal={() => setIsManualModalOpen(true)}
          onReset={handleReset}
          onApplyPreset={handleApplyPreset}
        />

        {/* Output Viewer Section */}
        {assessmentResult && (
          <div ref={viewerRef} className="pt-4 scroll-mt-20">
            <OutputViewer
              assessment={assessmentResult}
              onExportDocx={handleExportDocx}
              onExportPdf={handleExportPdf}
              isExporting={isExporting}
              onRegenerate={handleGenerateAssessment}
            />
          </div>
        )}
      </main>

      {/* Floating Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">SUPM TEGAL ASSESMEN MENDALAM</span>
            <span>&bull;</span>
            <span>Kementerian Kelautan dan Perikanan RI</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Menggunakan Gemini 3.8 Flash &bull; Dokumen Word (.docx) & PDF didukung penuh
          </p>
        </div>
      </footer>

      {/* Modals */}
      <ManualPromptModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        formData={formData}
      />

      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />
    </div>
  );
}
