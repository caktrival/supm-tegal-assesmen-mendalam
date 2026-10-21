import React, { useState } from 'react';
import {
  AssessmentFormData,
  GradeLevel,
  MajorCode,
  AssessmentType,
  InstrumentType,
  CognitiveLevel,
  ItemCountOption,
} from '../types/assessment.js';
import {
  Sparkles,
  BookOpen,
  User,
  GraduationCap,
  Layers,
  FileText,
  Target,
  Sliders,
  AlertCircle,
  Copy,
  Download,
  RotateCcw,
  Compass,
} from 'lucide-react';

interface AssessmentFormProps {
  formData: AssessmentFormData;
  onChange: (updated: AssessmentFormData) => void;
  onSubmit: () => void;
  isLoading: boolean;
  onOpenManualModal: () => void;
  onReset: () => void;
  onApplyPreset: (presetKey: string) => void;
}

export const AssessmentForm: React.FC<AssessmentFormProps> = ({
  formData,
  onChange,
  onSubmit,
  isLoading,
  onOpenManualModal,
  onReset,
  onApplyPreset,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.teacherName.trim()) {
      newErrors.teacherName = 'Nama Guru wajib diisi.';
    }
    if (!formData.subject.trim()) {
      newErrors.subject = 'Mata Pelajaran wajib diisi.';
    }
    if (!formData.topic.trim()) {
      newErrors.topic = 'Materi / Topik pembelajaran wajib diisi.';
    }
    if (!formData.learningObjective.trim()) {
      newErrors.learningObjective = 'Tujuan Pembelajaran wajib diisi.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit();
    }
  };

  const majorDetails: Record<MajorCode, { name: string; desc: string; color: string }> = {
    NKPI: {
      name: 'Nautika Kapal Penangkap Ikan',
      desc: 'Navigasi laut, olah gerak kapal, radar, keselamatan pelayaran',
      color: 'border-blue-500 text-blue-700 bg-blue-50/50',
    },
    TKPI: {
      name: 'Teknika Kapal Penangkap Ikan',
      desc: 'Mesin induk, kelistrikan kapal, refrigerasi palkah ikan',
      color: 'border-cyan-500 text-cyan-700 bg-cyan-50/50',
    },
    APPL: {
      name: 'Agribisnis Perikanan Air Payau & Laut',
      desc: 'Budidaya udang vaname, ikan laut/payau, kualitas air',
      color: 'border-teal-500 text-teal-700 bg-teal-50/50',
    },
    APHP: {
      name: 'Agribisnis Pengolahan Hasil Perikanan',
      desc: 'HACCP, sanitasi, pengolahan surimi, diversifikasi hasil laut',
      color: 'border-indigo-500 text-indigo-700 bg-indigo-50/50',
    },
  };

  const assessmentTypeCards: Record<AssessmentType, { title: string; subtitle: string; icon: string }> = {
    Diagnostik: {
      title: 'Diagnostik',
      subtitle: 'Petakan pengetahuan awal, kesiapan prasyarat, & lacak miskonsepsi peserta didik',
      icon: '🔍',
    },
    Formatif: {
      title: 'Formatif',
      subtitle: 'Pantau proses belajar, berikan umpan balik langsung, & perbaiki instruksional',
      icon: '📈',
    },
    Sumatif: {
      title: 'Sumatif',
      subtitle: 'Ukur pencapaian kompetensi akhir, ketercapaian KKTP, & evaluasi objektif',
      icon: '🎯',
    },
  };

  const cognitiveLevels: { level: CognitiveLevel; title: string; desc: string }[] = [
    {
      level: 'Prastruktural',
      title: 'Prastruktural',
      desc: 'Informasi belum terhubung, mengenali istilah dasar/istilah awal maritim',
    },
    {
      level: 'Unistruktural',
      title: 'Unistruktural',
      desc: 'Fokus pada satu aspek sederhana, definisi, atau identifikasi komponen tunggal',
    },
    {
      level: 'Multistruktural',
      title: 'Multistruktural',
      desc: 'Mengingat beberapa aspek teknis terpisah atau prosedur operasional berurutan',
    },
    {
      level: 'Relasional',
      title: 'Relasional',
      desc: 'Menghubungkan sebab-akibat antar komponen sistem kapal/perikanan secara utuh',
    },
    {
      level: 'Abstrak Diperluas',
      title: 'Abstrak Diperluas',
      desc: 'Generalisasi konsep ke skenario baru, evaluasi kritis, dan perumusan inovasi pemecahan masalah',
    },
  ];

  return (
    <form onSubmit={handleGenerate} className="space-y-6">
      {/* Quick Presets Bar */}
      <div className="bg-gradient-to-r from-blue-50 via-slate-50 to-indigo-50 border border-blue-200/80 rounded-xl p-3 sm:p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-900 text-white shadow-xs">
              <Compass className="w-4 h-4" />
            </span>
            <div>
              <p className="text-xs font-bold text-slate-800">Contoh Cepat Sesuai Jurusan SUPM TEGAL</p>
              <p className="text-[11px] text-slate-600">Klik salah satu contoh untuk mengisi otomatis formulir:</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => onApplyPreset('NKPI')}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-900 border border-blue-300 transition shadow-2xs"
            >
              ⚓ NKPI (Navigasi)
            </button>
            <button
              type="button"
              onClick={() => onApplyPreset('TKPI')}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-cyan-100 hover:bg-cyan-200 text-cyan-900 border border-cyan-300 transition shadow-2xs"
            >
              ⚙️ TKPI (Mesin Kapal)
            </button>
            <button
              type="button"
              onClick={() => onApplyPreset('APPL')}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-teal-100 hover:bg-teal-200 text-teal-900 border border-teal-300 transition shadow-2xs"
            >
              🦐 APPL (Budidaya)
            </button>
            <button
              type="button"
              onClick={() => onApplyPreset('APHP')}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-100 hover:bg-indigo-200 text-indigo-900 border border-indigo-300 transition shadow-2xs"
            >
              🐟 APHP (Pengolahan)
            </button>
          </div>
        </div>
      </div>

      {/* Group 1: Identitas Guru & Sekolah */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5">
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
            1
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">Identitas Sekolah & Guru</h2>
            <p className="text-xs text-slate-500">Data satuan pendidikan dan guru pengampu mata pelajaran</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Nama Sekolah (Fixed) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Sekolah <span className="text-slate-400 font-normal">(Otomatis)</span>
            </label>
            <div className="flex items-center bg-slate-100 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 text-xs font-bold cursor-not-allowed select-none">
              <span className="w-2 h-2 rounded-full bg-blue-600 mr-2"></span>
              SUPM TEGAL
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Sesuai unit pelaksana KKP</p>
          </div>

          {/* Jenjang (Fixed) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Jenjang <span className="text-slate-400 font-normal">(Tetap)</span>
            </label>
            <div className="flex items-center bg-slate-100 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 text-xs font-bold cursor-not-allowed select-none">
              SMK
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Pendidikan Kejuruan</p>
          </div>

          {/* Nama Guru (Input) */}
          <div className="sm:col-span-1 lg:col-span-1">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Guru Pengampu <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Contoh: Capt. Hartono, M.Mar"
                value={formData.teacherName}
                onChange={(e) => {
                  onChange({ ...formData, teacherName: e.target.value });
                  if (errors.teacherName) setErrors({ ...errors, teacherName: '' });
                }}
                className={`w-full text-xs rounded-lg px-3 py-2 border transition ${
                  errors.teacherName
                    ? 'border-rose-400 bg-rose-50/50 focus:ring-2 focus:ring-rose-200'
                    : 'border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                }`}
              />
              <User className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
            {errors.teacherName && <p className="text-[11px] text-rose-600 mt-1">{errors.teacherName}</p>}
          </div>

          {/* Mata Pelajaran (Input) */}
          <div className="sm:col-span-1 lg:col-span-1">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mata Pelajaran Kejuruan <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Contoh: Navigasi Datar & Radar"
                value={formData.subject}
                onChange={(e) => {
                  onChange({ ...formData, subject: e.target.value });
                  if (errors.subject) setErrors({ ...errors, subject: '' });
                }}
                className={`w-full text-xs rounded-lg px-3 py-2 border transition ${
                  errors.subject
                    ? 'border-rose-400 bg-rose-50/50 focus:ring-2 focus:ring-rose-200'
                    : 'border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                }`}
              />
              <BookOpen className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
            {errors.subject && <p className="text-[11px] text-rose-600 mt-1">{errors.subject}</p>}
          </div>
        </div>
      </div>

      {/* Group 2: Rancangan Asesmen & Kejuruan */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5">
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
            2
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">Rancangan Asesmen Kejuruan</h2>
            <p className="text-xs text-slate-500">Kelas, jurusan perikanan, jenis asesmen, materi, dan tujuan pembelajaran</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Kelas Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tingkat Kelas <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.grade}
                onChange={(e) => onChange({ ...formData, grade: e.target.value as GradeLevel })}
                className="w-full text-xs rounded-lg px-3 py-2 border border-slate-300 bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              >
                <option value="X">Kelas X (Fase E - Tingkat Dasar)</option>
                <option value="XI">Kelas XI (Fase F - Tingkat Lanjutan)</option>
                <option value="XII">Kelas XII (Fase F - Tingkat Mahir / Magang Laut)</option>
              </select>
            </div>

            {/* Jurusan Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Program Keahlian / Jurusan <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.major}
                onChange={(e) => onChange({ ...formData, major: e.target.value as MajorCode })}
                className="w-full text-xs rounded-lg px-3 py-2 border border-slate-300 bg-white font-medium text-slate-800 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              >
                <option value="NKPI">NKPI - Nautika Kapal Penangkap Ikan</option>
                <option value="TKPI">TKPI - Teknika Kapal Penangkap Ikan</option>
                <option value="APPL">APPL - Agribisnis Perikanan Air Payau & Laut</option>
                <option value="APHP">APHP - Agribisnis Pengolahan Hasil Perikanan</option>
              </select>
              <p className="text-[11px] text-slate-500 mt-1 italic">
                {majorDetails[formData.major]?.desc}
              </p>
            </div>
          </div>

          {/* Jenis Asesmen Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Jenis Asesmen Pembelajaran <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {(['Diagnostik', 'Formatif', 'Sumatif'] as AssessmentType[]).map((type) => {
                const info = assessmentTypeCards[type];
                const isSelected = formData.assessmentType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => onChange({ ...formData, assessmentType: type })}
                    className={`p-3 rounded-xl border text-left transition relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-1 ring-blue-600'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">{info.icon}</span>
                        <span className={`text-xs font-bold ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
                          {info.title}
                        </span>
                      </div>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{info.subtitle}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Materi / Topik */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Materi Pokok / Topik Pembelajaran <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              placeholder="Contoh: Pengoperasian Radar Maritim untuk Penentuan Posisi dan Penghindaran Tubrukan di Laut"
              value={formData.topic}
              onChange={(e) => {
                onChange({ ...formData, topic: e.target.value });
                if (errors.topic) setErrors({ ...errors, topic: '' });
              }}
              className={`w-full text-xs rounded-lg px-3 py-2 border transition ${
                errors.topic
                  ? 'border-rose-400 bg-rose-50/50 focus:ring-2 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
              }`}
            />
            {errors.topic && <p className="text-[11px] text-rose-600 mt-1">{errors.topic}</p>}
          </div>

          {/* Tujuan Pembelajaran */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tujuan Pembelajaran (TP) <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              placeholder="Contoh: Peserta didik mampu menganalisis tampilan target gema pada layar radar dan mengambil tindakan olah gerak kapal sesuai aturan 7 dan 8 COLREG 1972."
              value={formData.learningObjective}
              onChange={(e) => {
                onChange({ ...formData, learningObjective: e.target.value });
                if (errors.learningObjective) setErrors({ ...errors, learningObjective: '' });
              }}
              className={`w-full text-xs rounded-lg px-3 py-2 border transition ${
                errors.learningObjective
                  ? 'border-rose-400 bg-rose-50/50 focus:ring-2 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
              }`}
            />
            {errors.learningObjective && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.learningObjective}</p>
            )}
          </div>

          {/* Capaian Pembelajaran / Indikator Tambahan (Opsional) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Capaian Pembelajaran (CP) / Indikator Tambahan <span className="text-slate-400 font-normal">(Opsional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="Contoh: Elemen Olah Gerak dan Pengendalian Kapal Penangkap Ikan; Mampu menerapkan prosedur standar darurat di laut."
              value={formData.additionalIndicator || ''}
              onChange={(e) => onChange({ ...formData, additionalIndicator: e.target.value })}
              className="w-full text-xs rounded-lg px-3 py-2 border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>
      </div>

      {/* Group 3: Pengaturan Output & Taksonomi */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5">
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
            3
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">Pengaturan Output & Taksonomi</h2>
            <p className="text-xs text-slate-500">Bentuk instrumen, jumlah butir, dan level kognitif Taksonomi SOLO</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Bentuk Instrumen */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Bentuk Instrumen Asesmen <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.instrumentType}
                onChange={(e) => onChange({ ...formData, instrumentType: e.target.value as InstrumentType })}
                className="w-full text-xs rounded-lg px-3 py-2 border border-slate-300 bg-white font-medium text-slate-800 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              >
                <option value="Pilihan Ganda">Pilihan Ganda (Wajib 5 Opsi: A, B, C, D, E)</option>
                <option value="Esai/Uraian">Esai / Uraian (Stimulus Kasus & Rubrik Kualitas)</option>
                <option value="Praktik/Unjuk Kerja">Praktik / Unjuk Kerja (Langkah Kerja & Rubrik Kinerja)</option>
                <option value="Observasi">Observasi (Lembar Pengamatan Sikap & Praktik Kerja)</option>
                <option value="Campuran">Campuran (Pilihan Ganda + Uraian / Studi Kasus)</option>
              </select>
              {formData.instrumentType === 'Pilihan Ganda' && (
                <p className="text-[11px] text-blue-700 mt-1 font-medium">
                  ✓ Sesuai standar ujian: setiap butir memiliki 5 opsi homogen (A, B, C, D, E)
                </p>
              )}
            </div>

            {/* Jumlah Soal / Tugas */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Jumlah Soal / Tugas <span className="text-rose-500">*</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {([5, 10, 15, 20, 25, 30, 40] as ItemCountOption[]).map((count) => {
                  const isSelected = formData.itemCount === count;
                  return (
                    <button
                      key={count}
                      type="button"
                      onClick={() => onChange({ ...formData, itemCount: count })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                        isSelected
                          ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {count} Butir
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tingkat Kognitif (Taksonomi SOLO) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Tingkat Kognitif (Taksonomi SOLO) <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {cognitiveLevels.map((item) => {
                const isSelected = formData.cognitiveLevel === item.level;
                return (
                  <button
                    key={item.level}
                    type="button"
                    onClick={() => onChange({ ...formData, cognitiveLevel: item.level })}
                    className={`p-2.5 rounded-lg border text-left transition flex flex-col justify-between ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-600'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-bold ${isSelected ? 'text-indigo-950' : 'text-slate-800'}`}>
                        {item.title}
                      </span>
                      {isSelected && <span className="w-2 h-2 rounded-full bg-indigo-600"></span>}
                    </div>
                    <p className="text-[10.5px] text-slate-600 leading-snug">{item.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Instruksi Tambahan (Opsional) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Instruksi Tambahan Guru <span className="text-slate-400 font-normal">(Opsional)</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Sertakan gambar/tabel skenario pelayaran malam hari; tekankan aspek K3 kapal perikanan"
              value={formData.additionalNotes || ''}
              onChange={(e) => onChange({ ...formData, additionalNotes: e.target.value })}
              className="w-full text-xs rounded-lg px-3 py-2 border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={onReset}
            disabled={isLoading}
            className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition flex items-center justify-center gap-1.5 w-full sm:w-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Formulir</span>
          </button>

          <button
            type="button"
            onClick={onOpenManualModal}
            className="px-3 py-2 text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-300 transition flex items-center justify-center gap-1.5 w-full sm:w-auto"
          >
            <Compass className="w-3.5 h-3.5 text-amber-600" />
            <span>Mode Manual (Prompt)</span>
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full sm:w-auto px-6 py-2.5 rounded-lg text-sm font-bold text-white transition flex items-center justify-center gap-2 shadow-md ${
            isLoading
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-900 hover:bg-blue-800 active:scale-[0.98]'
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Memproses Asesmen Mendalam...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span>Generate Asesmen Sekarang</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
