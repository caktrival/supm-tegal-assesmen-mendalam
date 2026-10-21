import React, { useState } from 'react';
import { AssessmentFormData } from '../types/assessment.js';
import { generateManualPrompt } from '../../server/promptTemplate.js';
import { Copy, Download, Check, X, Compass, ExternalLink, AlertCircle } from 'lucide-react';

interface ManualPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: AssessmentFormData;
}

export const ManualPromptModal: React.FC<ManualPromptModalProps> = ({
  isOpen,
  onClose,
  formData,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const promptText = generateManualPrompt(formData);

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([promptText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SUPM_TEGAL_Prompt_${formData.major}_${formData.assessmentType}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/20">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Mode Manual Cadangan (Prompt Generator)</h3>
              <p className="text-xs text-amber-100">
                Gunakan jika Gemini API tidak tersedia atau kuota habis untuk disalin langsung ke AI Chat
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

        {/* Notice Info */}
        <div className="bg-amber-50 border-b border-amber-200 px-5 py-3 text-xs text-amber-950 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong>Perhatian:</strong> Mode manual ini menghasilkan instruksi (prompt) profesional terstruktur
            berdasarkan formulir yang telah Anda isi. Mode ini <em>tidak menghasilkan soal secara instan di dalam aplikasi</em>,
            melainkan memberikan teks prompt yang siap Anda tempelkan ke Google Gemini atau ChatGPT.
          </div>
        </div>

        {/* Content Box */}
        <div className="p-5 overflow-y-auto flex-1 bg-slate-50">
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Teks Prompt Siap Pakai untuk Google Gemini / AI Chat:
          </label>
          <pre className="w-full h-80 p-3.5 bg-slate-900 text-slate-100 rounded-xl text-[11px] font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap select-all border border-slate-800 shadow-inner">
            {promptText}
          </pre>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Dapat digunakan di:</span>
            <a
              href="https://gemini.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline flex items-center gap-1 font-semibold"
            >
              Google Gemini <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadTxt}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Prompt (.txt)</span>
            </button>

            <button
              onClick={handleCopy}
              className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm transition flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin ke Clipboard!' : 'Salin Prompt Cadangan'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
