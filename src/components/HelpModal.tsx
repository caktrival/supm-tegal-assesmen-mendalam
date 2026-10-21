import React from 'react';
import { X, BookOpen, Anchor, Compass, CheckCircle2, Shield, FileCheck, Layers } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-blue-900 px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10">
              <BookOpen className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <h3 className="font-bold text-base">Panduan Penyusunan Asesmen &bull; SUPM TEGAL</h3>
              <p className="text-xs text-blue-200">
                Standar Kurikulum Merdeka Pendidikan Menengah Kejuruan Kelautan & Perikanan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs text-slate-700 leading-relaxed">
          {/* Section 1: Jenis Asesmen */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-700" />
              1. Karakteristik & Logika Jenis Asesmen
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200">
                <span className="font-bold text-blue-900 block mb-1">Diagnostik</span>
                <p className="text-slate-600 text-[11px]">
                  Dilakukan di awal materi untuk memetakan pemahaman awal, prasyarat kompetensi dasar, serta mendeteksi
                  miskonsepsi teknis pelayaran/perikanan. Hasilnya digunakan untuk pengelompokan diferensiasi belajar.
                </p>
              </div>
              <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-200">
                <span className="font-bold text-teal-900 block mb-1">Formatif</span>
                <p className="text-slate-600 text-[11px]">
                  Dilakukan selama proses pembelajaran di kelas, bengkel kapal, atau tambak. Berfungsi memantau
                  progres, memberikan umpan balik perbaikan segera, dan merefleksikan efektivitas strategi guru.
                </p>
              </div>
              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-200">
                <span className="font-bold text-indigo-900 block mb-1">Sumatif</span>
                <p className="text-slate-600 text-[11px]">
                  Dilakukan di akhir lingkup materi atau akhir semester untuk mengukur ketercapaian tujuan
                  pembelajaran (KKTP) secara objektif dengan kisi-kisi dan penskoran terstandar.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Jurusan SUPM */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
              <Anchor className="w-4 h-4 text-blue-700" />
              2. Program Keahlian SUPM TEGAL
            </h4>
            <ul className="space-y-1.5 pl-2">
              <li>
                <strong>NKPI (Nautika Kapal Penangkap Ikan):</strong> Navigasi, olah gerak kapal penangkap ikan,
                pengoperasian alat tangkap (purse seine, longline, gillnet), radar/ARPA, keselamatan jiwa di laut
                (SOLAS/STCW-F).
              </li>
              <li>
                <strong>TKPI (Teknika Kapal Penangkap Ikan):</strong> Mesin penggerak utama kapal perikanan, mesin
                bantu, sistem pendingin/refrigerasi pembekuan ikan, kelistrikan dan perpipaan kamar mesin.
              </li>
              <li>
                <strong>APPL (Agribisnis Perikanan Air Payau & Laut):</strong> Pembenihan dan pembesaran udang vaname,
                ikan bandeng/kerapu, manajemen mutu air tambak, biosekuriti, dan pencegahan hama-penyakit.
              </li>
              <li>
                <strong>APHP (Agribisnis Pengolahan Hasil Perikanan):</strong> Penanganan pascapanen ikan, rantai
                dingin, produksi diversifikasi olahan ikan (surimi, kamaboko, abon, nugget), dan sistem jaminan mutu
                (HACCP & SSOP).
              </li>
            </ul>
          </div>

          {/* Section 3: Taksonomi SOLO */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-blue-700" />
              3. Taksonomi SOLO (Structure of Observed Learning Outcomes)
            </h4>
            <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <p>
                <strong>1. Prastruktural:</strong> Peserta didik belum memahami konsep atau melewatkan inti masalah.
              </p>
              <p>
                <strong>2. Unistruktural:</strong> Peserta didik menguasai satu aspek konseptual atau istilah sederhana.
              </p>
              <p>
                <strong>3. Multistruktural:</strong> Peserta didik menguasai beberapa aspek teknis terpisah namun belum
                mengintegrasikannya.
              </p>
              <p>
                <strong>4. Relasional:</strong> Peserta didik mampu menghubungkan beberapa aspek teknis menjadi sistem
                utuh (sebab-akibat operasional).
              </p>
              <p>
                <strong>5. Abstrak Diperluas:</strong> Peserta didik mampu menggeneralisasikan prinsip ke kasus atau
                situasi baru, melakukan evaluasi kritis, dan merumuskan inovasi solusi di lapangan.
              </p>
            </div>
          </div>

          {/* Section 4: Panduan Unduhan & Kunci Terpisah */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
            <h4 className="font-bold text-amber-950 mb-1 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-amber-700" />
              Kerahasiaan Kunci Jawaban & Format Dokumen
            </h4>
            <p className="text-amber-900 text-[11px]">
              Dokumen naskah soal yang diunduh untuk peserta didik dijamin bersih tanpa kunci jawaban. Kunci jawaban dan
              pedoman penskoran berada di file tersendiri atau pada lembar terpisah di halaman akhir untuk kemudahan guru.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition"
          >
            Mengerti & Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
