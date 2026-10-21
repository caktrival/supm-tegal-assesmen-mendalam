import React from 'react';
import { Anchor, Compass, BookOpen, ShieldCheck, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onOpenHelp: () => void;
  onOpenManualModal: () => void;
  apiStatus: 'checking' | 'configured' | 'unconfigured';
}

export const Header: React.FC<HeaderProps> = ({ onOpenHelp, onOpenManualModal, apiStatus }) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 px-4 py-1.5 text-xs text-blue-200 border-b border-blue-950/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Kementerian Kelautan dan Perikanan RI &bull; BPPSDM KP</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">Standar Kurikulum Merdeka SMK & IMO STCW-F</span>
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="text-[11px]">Status AI:</span>
              {apiStatus === 'configured' && (
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Gemini API Aktif
                </span>
              )}
              {apiStatus === 'unconfigured' && (
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Mode Siap / Manual
                </span>
              )}
              {apiStatus === 'checking' && (
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-700 text-slate-300">
                  Memeriksa...
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-lg bg-white p-1 shadow-inner flex items-center justify-center overflow-hidden border border-blue-200">
            <img
              src="/assets/aistudio/logo_supm_241ffe0e.jpeg"
              alt="Logo SUPM Tegal"
              className="w-full h-full object-contain"
              onError={(e) => {
                // Fallback icon if image path is altered
                (e.currentTarget as HTMLElement).style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) parent.innerHTML = '<span class="text-blue-900 font-black text-xs">SUPM</span>';
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>SUPM TEGAL</span>
                <span className="text-blue-400 font-light">|</span>
                <span className="bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent font-extrabold text-sm sm:text-base">
                  ASSESMEN MENDALAM
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-300">
              Generator Perangkat Asesmen SMK: Diagnostik, Formatif & Sumatif dengan Taksonomi SOLO
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenManualModal}
            className="px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800/80 hover:bg-slate-700 hover:text-white rounded-lg border border-slate-700 transition flex items-center gap-1.5 shadow-sm"
            title="Buka Mode Manual Cadangan jika ingin menyalin prompt langsung"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Mode Manual</span> Cadangan
          </button>

          <button
            onClick={onOpenHelp}
            className="px-3 py-1.5 text-xs font-medium text-blue-200 bg-blue-950/70 hover:bg-blue-900 rounded-lg border border-blue-800 transition flex items-center gap-1.5 shadow-sm"
          >
            <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
            <span>Panduan Guru</span>
          </button>
        </div>
      </div>
    </header>
  );
};
