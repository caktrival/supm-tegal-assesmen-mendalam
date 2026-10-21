import React, { useState } from 'react';
import { AssessmentResult } from '../types/assessment.js';
import {
  FileText,
  Table as TableIcon,
  HelpCircle,
  Award,
  Download,
  Copy,
  Printer,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

interface OutputViewerProps {
  assessment: AssessmentResult;
  onExportDocx: (scope: 'all' | 'kisi_kisi' | 'naskah_soal' | 'kunci_jawaban' | 'rubrik') => void;
  onExportPdf: (scope: 'all' | 'kisi_kisi' | 'naskah_soal' | 'kunci_jawaban' | 'rubrik') => void;
  isExporting: boolean;
  onRegenerate: () => void;
}

type TabType = 'kisi_kisi' | 'naskah_soal' | 'kunci_jawaban' | 'rubrik';

export const OutputViewer: React.FC<OutputViewerProps> = ({
  assessment,
  onExportDocx,
  onExportPdf,
  isExporting,
  onRegenerate,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('naskah_soal');
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [showDocxMenu, setShowDocxMenu] = useState(false);
  const [showPdfMenu, setShowPdfMenu] = useState(false);

  const copyTabContent = () => {
    let textToCopy = '';

    if (activeTab === 'kisi_kisi') {
      textToCopy = `KISI-KISI ASESMEN PEMBELAJARAN - SUPM TEGAL\n` +
        `Mata Pelajaran: ${assessment.metadata.subject} | Kelas: ${assessment.metadata.grade} ${assessment.metadata.major}\n\n` +
        assessment.kisiKisi
          .map(
            (k) =>
              `No: ${k.no || k.itemNumber}\nTP: ${k.learningObjective}\nMateri: ${k.topic}\nIndikator Soal: ${k.itemIndicator}\nLevel SOLO: ${k.cognitiveLevel}\nBentuk: ${k.instrumentType}\nNomor Butir: ${k.itemNumber}\nBobot: ${k.scoreWeight}\n-------------------------`
          )
          .join('\n');
    } else if (activeTab === 'naskah_soal') {
      textToCopy = `NASKAH SOAL ASESMEN PESERTA DIDIK - SUPM TEGAL\n` +
        `Mata Pelajaran: ${assessment.metadata.subject} | Kelas: ${assessment.metadata.grade} ${assessment.metadata.major}\n` +
        `Petunjuk Umum:\n${assessment.naskahSoal.generalInstructions.map((g, i) => `${i + 1}. ${g}`).join('\n')}\n\n` +
        assessment.naskahSoal.items
          .map((item) => {
            let str = `${item.itemNumber}. ${item.questionText}\n`;
            if (item.options) {
              str += `A. ${item.options.A}\nB. ${item.options.B}\nC. ${item.options.C}\nD. ${item.options.D}\nE. ${item.options.E}\n`;
            }
            if (item.workSteps && item.workSteps.length) {
              str += `Petunjuk Kerja:\n` + item.workSteps.map((s, idx) => `  ${idx + 1}) ${s}`).join('\n') + '\n';
            }
            return str;
          })
          .join('\n');
    } else if (activeTab === 'kunci_jawaban') {
      textToCopy = `KUNCI JAWABAN & PEDOMAN PEMBAHASAN - SUPM TEGAL\n` +
        assessment.kunciJawaban
          .map(
            (k) =>
              `Nomor: ${k.itemNumber}\nKunci: ${k.correctAnswer}\nPembahasan: ${k.explanation}\n${
                k.expectedPerformance ? `Unsur Kinerja: ${k.expectedPerformance.join(', ')}\n` : ''
              }-------------------------`
          )
          .join('\n');
    } else if (activeTab === 'rubrik') {
      textToCopy = `RUBRIK PENILAIAN & PEDOMAN PENSKORAN - SUPM TEGAL\n` +
        `Aturan: ${assessment.rubrikPenskoran.generalRule}\n` +
        `Rumus: ${assessment.rubrikPenskoran.formula}\n\n` +
        assessment.rubrikPenskoran.criteria
          .map(
            (c) =>
              `Aspek: ${c.itemNumberOrAspect}\n` +
              c.indicators.map((ind) => `  - [${ind.level}] (Skor ${ind.scoreRange}): ${ind.description}`).join('\n')
          )
          .join('\n\n') +
        `\n\nTindak Lanjut:\nRemedial: ${assessment.rubrikPenskoran.followUpRecommendations.remedial}\nPengayaan: ${assessment.rubrikPenskoran.followUpRecommendations.enrichment}\nCatatan: ${assessment.rubrikPenskoran.followUpRecommendations.pedagogicalNote}`;
    }

    navigator.clipboard.writeText(textToCopy);
    setCopiedTab(activeTab);
    setTimeout(() => setCopiedTab(null), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Quality Check & Metadata Summary Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-900 text-white">
                SUPM TEGAL
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                {assessment.metadata.assessmentType}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                Kelas {assessment.metadata.grade} - {assessment.metadata.major}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                SOLO: {assessment.metadata.cognitiveLevel}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {assessment.metadata.subject}: {assessment.metadata.topic}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Guru: <span className="font-semibold text-slate-700">{assessment.metadata.teacherName}</span> &bull;{' '}
              Dibuat: {assessment.metadata.createdAt} &bull; {assessment.metadata.itemCount} Butir{' '}
              ({assessment.metadata.instrumentType})
            </p>
          </div>

          {/* Action Bar (Export DOCX / PDF & Regenerate) */}
          <div className="flex flex-wrap items-center gap-2">
            {/* DOCX Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowDocxMenu(!showDocxMenu);
                  setShowPdfMenu(false);
                }}
                disabled={isExporting}
                className="px-3 py-2 text-xs font-bold text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-300 rounded-lg transition flex items-center gap-1.5 shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-blue-700" />
                <span>Unduh Word (.docx)</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {showDocxMenu && (
                <div className="absolute right-0 mt-1.5 w-60 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-40 text-xs">
                  <div className="px-3 py-1 font-bold text-slate-400 uppercase text-[10px] tracking-wider">
                    Format Dokumen Word (.docx)
                  </div>
                  <button
                    onClick={() => {
                      onExportDocx('all');
                      setShowDocxMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50 text-slate-800 font-semibold flex items-center justify-between"
                  >
                    <span>Paket Lengkap (Semua Bagian)</span>
                    <span className="text-[10px] text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">Rekomendasi</span>
                  </button>
                  <button
                    onClick={() => {
                      onExportDocx('naskah_soal');
                      setShowDocxMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50 text-slate-700"
                  >
                    Naskah Soal Saja (Tanpa Kunci)
                  </button>
                  <button
                    onClick={() => {
                      onExportDocx('kisi_kisi');
                      setShowDocxMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50 text-slate-700"
                  >
                    Kisi-Kisi Soal Saja
                  </button>
                  <button
                    onClick={() => {
                      onExportDocx('kunci_jawaban');
                      setShowDocxMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50 text-slate-700"
                  >
                    Kunci Jawaban Saja
                  </button>
                  <button
                    onClick={() => {
                      onExportDocx('rubrik');
                      setShowDocxMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50 text-slate-700"
                  >
                    Rubrik Penilaian Saja
                  </button>
                </div>
              )}
            </div>

            {/* PDF Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowPdfMenu(!showPdfMenu);
                  setShowDocxMenu(false);
                }}
                disabled={isExporting}
                className="px-3 py-2 text-xs font-bold text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-300 rounded-lg transition flex items-center gap-1.5 shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-rose-700" />
                <span>Unduh PDF</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {showPdfMenu && (
                <div className="absolute right-0 mt-1.5 w-60 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-40 text-xs">
                  <div className="px-3 py-1 font-bold text-slate-400 uppercase text-[10px] tracking-wider">
                    Format Dokumen PDF
                  </div>
                  <button
                    onClick={() => {
                      onExportPdf('all');
                      setShowPdfMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-rose-50 text-slate-800 font-semibold flex items-center justify-between"
                  >
                    <span>Paket Lengkap PDF (Semua Bagian)</span>
                    <span className="text-[10px] text-rose-600 bg-rose-100 px-1.5 py-0.5 rounded">Resmi</span>
                  </button>
                  <button
                    onClick={() => {
                      onExportPdf('naskah_soal');
                      setShowPdfMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-rose-50 text-slate-700"
                  >
                    Naskah Soal Saja (Siap Cetak Siswa)
                  </button>
                  <button
                    onClick={() => {
                      onExportPdf('kisi_kisi');
                      setShowPdfMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-rose-50 text-slate-700"
                  >
                    Kisi-Kisi Asesmen Saja
                  </button>
                  <button
                    onClick={() => {
                      onExportPdf('kunci_jawaban');
                      setShowPdfMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-rose-50 text-slate-700"
                  >
                    Kunci Jawaban Saja
                  </button>
                  <button
                    onClick={() => {
                      onExportPdf('rubrik');
                      setShowPdfMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-rose-50 text-slate-700"
                  >
                    Rubrik Penilaian Saja
                  </button>
                </div>
              )}
            </div>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="px-2.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition flex items-center gap-1.5"
              title="Cetak tampilan dokumen"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cetak</span>
            </button>

            {/* Regenerate Button */}
            <button
              onClick={onRegenerate}
              className="px-2.5 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition flex items-center gap-1.5"
              title="Buat ulang atau perbaiki dengan formulir yang sama"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Perbaiki / Buat Ulang</span>
            </button>
          </div>
        </div>

        {/* Quality Check Indicator Bar */}
        <div className="mt-3 bg-slate-50 border border-slate-200/80 rounded-lg p-2.5 sm:p-3 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Pemeriksaan Mutu AI Studio:
              </span>
              <span className="text-slate-600">
                {assessment.qualityCheck?.actualCount} Butir Soal Terpetakan &bull; Kunci & Rubrik Terverifikasi
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Kunci Terpisah
              </span>
              {assessment.metadata.instrumentType === 'Pilihan Ganda' && (
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  5 Opsi (A-E) Valid
                </span>
              )}
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                Taksonomi SOLO
              </span>
            </div>
          </div>

          {/* Teacher verification notes */}
          {assessment.qualityCheck?.teacherVerificationNotes?.length > 0 && (
            <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-start gap-1.5 text-[11px] text-slate-600">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <span>
                <strong>Catatan Guru:</strong> {assessment.qualityCheck.teacherVerificationNotes.join(' ')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex flex-wrap border-b border-slate-200 bg-slate-50/50">
          <button
            onClick={() => setActiveTab('naskah_soal')}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition ${
              activeTab === 'naskah_soal'
                ? 'border-blue-900 text-blue-900 bg-white shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4 text-blue-600" />
            <span>B. Naskah Soal Peserta Didik</span>
            <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full">
              Siap Cetak Siswa
            </span>
          </button>

          <button
            onClick={() => setActiveTab('kisi_kisi')}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition ${
              activeTab === 'kisi_kisi'
                ? 'border-blue-900 text-blue-900 bg-white shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <TableIcon className="w-4 h-4 text-blue-600" />
            <span>A. Kisi-Kisi Soal</span>
            <span className="text-[10px] font-semibold bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded-full">
              {assessment.kisiKisi.length} Butir
            </span>
          </button>

          <button
            onClick={() => setActiveTab('kunci_jawaban')}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition ${
              activeTab === 'kunci_jawaban'
                ? 'border-blue-900 text-blue-900 bg-white shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-rose-600" />
            <span>C. Kunci Jawaban Terpisah</span>
            <span className="text-[10px] font-semibold bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded-full">
              Rahasia Guru
            </span>
          </button>

          <button
            onClick={() => setActiveTab('rubrik')}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition ${
              activeTab === 'rubrik'
                ? 'border-blue-900 text-blue-900 bg-white shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Award className="w-4 h-4 text-amber-600" />
            <span>D. Rubrik & Penskoran</span>
          </button>

          <div className="ml-auto p-2 flex items-center">
            <button
              onClick={copyTabContent}
              className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg border border-slate-200 transition flex items-center gap-1.5"
              title="Salin isi tab yang sedang aktif"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedTab === activeTab ? 'Tersalin ke Clipboard!' : 'Salin Tab Ini'}</span>
            </button>
          </div>
        </div>

        {/* Tab Body */}
        <div className="p-4 sm:p-6 min-h-[420px]">
          {/* TAB B: NASKAH SOAL */}
          {activeTab === 'naskah_soal' && (
            <div className="space-y-6">
              {/* Kop Peserta Didik */}
              <div className="border border-slate-300 rounded-xl p-4 bg-slate-50/70 text-slate-800">
                <div className="text-center pb-3 border-b border-slate-300">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Kementerian Kelautan dan Perikanan RI
                  </h3>
                  <h2 className="text-sm sm:text-base font-black text-blue-900">
                    SEKOLAH USAHA PERIKANAN MENENGAH (SUPM) TEGAL
                  </h2>
                  <p className="text-[11px] text-slate-500 italic">
                    Jl. Martoloyo No. 22, Kel. Mintaragen, Kec. Tegal Timur, Kota Tegal, Jawa Tengah 52121
                  </p>
                  <div className="mt-2 inline-block px-3 py-1 bg-blue-900 text-white font-bold text-xs rounded-md uppercase tracking-wider">
                    LEMBAR ASESMEN PESERTA DIDIK
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mt-3 pt-1">
                  <div>
                    <span className="font-semibold text-slate-600">Mata Pelajaran:</span>{' '}
                    <span className="font-bold">{assessment.metadata.subject}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-600">Kelas / Jurusan:</span>{' '}
                    <span className="font-bold">Kelas {assessment.metadata.grade} - {assessment.metadata.majorFullName}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-600">Jenis Asesmen:</span>{' '}
                    <span className="font-bold">{assessment.metadata.assessmentType}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-600">Bentuk Soal:</span>{' '}
                    <span className="font-bold">{assessment.metadata.instrumentType} ({assessment.metadata.itemCount} Butir)</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-white p-2.5 rounded-lg border">
                  <div>
                    <span className="text-slate-500">Nama Peserta Didik:</span>{' '}
                    <span className="font-mono text-slate-400">....................................................................</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Nomor Absen / NIS:</span>{' '}
                    <span className="font-mono text-slate-400">...................................................</span>
                  </div>
                </div>
              </div>

              {/* Petunjuk Umum */}
              {assessment.naskahSoal.generalInstructions?.length > 0 && (
                <div className="bg-blue-50/50 border border-blue-200 rounded-lg p-3 text-xs text-blue-950">
                  <p className="font-bold text-blue-900 mb-1">PETUNJUK UMUM PENGERJAAN:</p>
                  <ol className="list-decimal list-inside space-y-1 text-slate-700">
                    {assessment.naskahSoal.generalInstructions.map((inst, i) => (
                      <li key={i}>{inst}</li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Daftar Butir Soal */}
              <div className="space-y-4">
                {assessment.naskahSoal.items.map((item, idx) => (
                  <div
                    key={item.itemNumber || idx}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition shadow-2xs"
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-900 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {item.itemNumber || idx + 1}
                      </span>
                      <div className="flex-1 space-y-3">
                        <p className="text-xs sm:text-sm font-medium text-slate-900 leading-relaxed whitespace-pre-line">
                          {item.questionText}
                        </p>

                        {/* Opsi Pilihan Ganda (A, B, C, D, E) */}
                        {item.options && (
                          <div className="space-y-1.5 pl-1 sm:pl-2">
                            {(['A', 'B', 'C', 'D', 'E'] as Array<keyof typeof item.options>).map((optKey) => {
                              const optText = item.options ? item.options[optKey] : '';
                              if (!optText) return null;
                              return (
                                <div
                                  key={optKey}
                                  className="flex items-start gap-2 text-xs text-slate-800 p-1.5 rounded hover:bg-slate-50"
                                >
                                  <span className="w-5 h-5 rounded border border-slate-300 text-slate-700 font-bold flex items-center justify-center text-[11px] shrink-0 bg-slate-50">
                                    {optKey}
                                  </span>
                                  <span className="pt-0.5 leading-snug">{optText}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Langkah Kerja jika Praktik / Observasi */}
                        {item.workSteps && item.workSteps.length > 0 && (
                          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800">
                            <p className="font-bold text-slate-700 mb-1">Langkah / Petunjuk Kerja:</p>
                            <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
                              {item.workSteps.map((step, sIdx) => (
                                <li key={sIdx}>{step}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] text-slate-400">
                          <span className="capitalize">Bentuk: {item.type.replace('_', ' ')}</span>
                          <span>Alokasi Bobot: {item.allocatedScore || 10} Poin</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB A: KISI-KISI SOAL */}
          {activeTab === 'kisi_kisi' && (
            <div className="space-y-4">
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-blue-900 text-white font-bold text-[11px]">
                      <th className="p-2.5 border-r border-blue-800 w-10 text-center">No</th>
                      <th className="p-2.5 border-r border-blue-800 min-w-[160px]">Tujuan Pembelajaran</th>
                      <th className="p-2.5 border-r border-blue-800 min-w-[120px]">Materi Pokok</th>
                      <th className="p-2.5 border-r border-blue-800 min-w-[180px]">Indikator Soal / Kinerja</th>
                      <th className="p-2.5 border-r border-blue-800 text-center min-w-[90px]">Level SOLO</th>
                      <th className="p-2.5 border-r border-blue-800 text-center w-16">No. Soal</th>
                      <th className="p-2.5 text-center w-16">Bobot</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800">
                    {assessment.kisiKisi.map((k, idx) => (
                      <tr key={idx} className="hover:bg-blue-50/40">
                        <td className="p-2.5 text-center font-bold text-slate-600 border-r border-slate-200">
                          {k.no || idx + 1}
                        </td>
                        <td className="p-2.5 border-r border-slate-200 font-medium">
                          {k.learningObjective}
                        </td>
                        <td className="p-2.5 border-r border-slate-200 text-slate-700">
                          {k.topic}
                        </td>
                        <td className="p-2.5 border-r border-slate-200 text-slate-700">
                          {k.itemIndicator}
                        </td>
                        <td className="p-2.5 border-r border-slate-200 text-center">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                            {k.cognitiveLevel}
                          </span>
                        </td>
                        <td className="p-2.5 border-r border-slate-200 text-center font-bold text-blue-900">
                          {k.itemNumber || idx + 1}
                        </td>
                        <td className="p-2.5 text-center font-semibold text-slate-700">
                          {k.scoreWeight || 10}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB C: KUNCI JAWABAN TERPISAH */}
          {activeTab === 'kunci_jawaban' && (
            <div className="space-y-4">
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-center justify-between text-xs text-rose-900">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                  <span className="font-bold">DOKUMEN RAHASIA GURU &bull; SUPM TEGAL</span>
                </div>
                <span className="text-[11px] text-rose-700">
                  Kunci jawaban tidak ditampilkan pada naskah soal peserta didik
                </span>
              </div>

              <div className="space-y-3">
                {assessment.kunciJawaban.map((kunci, idx) => (
                  <div
                    key={kunci.itemNumber || idx}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-blue-900 text-white font-bold text-xs">
                          Soal No. {kunci.itemNumber}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="text-slate-500">Kunci Benar:</span>
                          <span className="font-black text-blue-700 text-sm bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            {kunci.correctAnswer}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-slate-700 space-y-2 mt-2 pt-2 border-t border-slate-100">
                      <div>
                        <span className="font-bold text-slate-900">Pembahasan & Landasan Konseptual:</span>
                        <p className="mt-0.5 text-slate-600 leading-relaxed whitespace-pre-line">
                          {kunci.explanation}
                        </p>
                      </div>

                      {kunci.expectedPerformance && kunci.expectedPerformance.length > 0 && (
                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/80">
                          <span className="font-bold text-slate-800">Unsur Kinerja / Jawaban yang Diharapkan:</span>
                          <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-600">
                            {kunci.expectedPerformance.map((u, uIdx) => (
                              <li key={uIdx}>{u}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB D: RUBRIK DAN PEDOMAN PENSKORAN */}
          {activeTab === 'rubrik' && (
            <div className="space-y-6">
              {/* Formula & General Rule */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 text-xs text-blue-950">
                  <h4 className="font-bold text-blue-900 mb-1 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-blue-700" />
                    Aturan Umum Penskoran
                  </h4>
                  <p className="text-slate-700 leading-relaxed">
                    {assessment.rubrikPenskoran.generalRule}
                  </p>
                  <p className="mt-2 font-semibold text-blue-900">
                    Total Skor Maksimal: {assessment.rubrikPenskoran.totalMaxScore || 100}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50 text-xs text-indigo-950">
                  <h4 className="font-bold text-indigo-900 mb-1">Rumus Nilai Akhir</h4>
                  <p className="font-mono bg-white px-3 py-2 rounded-lg border border-indigo-200 text-indigo-900 font-semibold mt-2">
                    {assessment.rubrikPenskoran.formula}
                  </p>
                  <p className="text-[11px] text-slate-600 mt-2">
                    Hasil dikonversikan ke skala 0 - 100 sesuai standar penilaian SMK Kemendikbudristek & KKP.
                  </p>
                </div>
              </div>

              {/* Rubric Criteria Table / Cards */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900">Kriteria Penilaian & Deskriptor Kinerja:</h4>
                <div className="space-y-3">
                  {assessment.rubrikPenskoran.criteria.map((crit, idx) => (
                    <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                      <div className="bg-slate-100 px-4 py-2 font-bold text-xs text-slate-800 border-b border-slate-200">
                        {crit.itemNumberOrAspect}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                        {crit.indicators.map((ind, iIdx) => (
                          <div key={iIdx} className="p-3 text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900">{ind.level}</span>
                              <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[10px] font-bold">
                                {ind.scoreRange}
                              </span>
                            </div>
                            <p className="text-slate-600 text-[11px] leading-relaxed">{ind.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tindak Lanjut Rekomendasi */}
              {assessment.rubrikPenskoran.followUpRecommendations && (
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 text-xs">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                    Rancangan Tindak Lanjut Pembelajaran (Remedial & Pengayaan)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                      <span className="font-bold text-rose-700 block mb-1">Rekomendasi Remedial:</span>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        {assessment.rubrikPenskoran.followUpRecommendations.remedial}
                      </p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                      <span className="font-bold text-emerald-700 block mb-1">Rekomendasi Pengayaan:</span>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        {assessment.rubrikPenskoran.followUpRecommendations.enrichment}
                      </p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                      <span className="font-bold text-blue-700 block mb-1">Catatan Pedagogis Guru:</span>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        {assessment.rubrikPenskoran.followUpRecommendations.pedagogicalNote}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
