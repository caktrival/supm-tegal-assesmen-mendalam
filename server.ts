import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateAssessmentWithGemini } from './server/geminiService.js';
import { generateDocxBuffer, ExportScope } from './server/exportDocx.js';
import { generatePdfBuffer } from './server/exportPdf.js';
import { generateManualPrompt } from './server/promptTemplate.js';
import { AssessmentFormData, AssessmentResult } from './src/types/assessment.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '20mb' }));

  // Status check
  app.get('/api/status', (_req: Request, res: Response) => {
    const key = process.env.GEMINI_API_KEY;
    const isConfigured = Boolean(key && key.trim() !== '' && key !== 'MY_GEMINI_API_KEY');
    res.json({
      configured: isConfigured,
      model: 'gemini-3.8-flash',
      school: 'SUPM TEGAL',
    });
  });

  // Mode Manual Cadangan Prompt
  app.post('/api/generate-prompt', (req: Request, res: Response) => {
    try {
      const formData = req.body as AssessmentFormData;
      const prompt = generateManualPrompt(formData);
      res.json({ prompt });
    } catch (err: any) {
      res.status(400).json({ error: 'Gagal membuat prompt manual: ' + err.message });
    }
  });

  // Generate Asesmen dengan Gemini API
  app.post('/api/generate-assessment', async (req: Request, res: Response) => {
    try {
      const formData = req.body as AssessmentFormData;

      // Validate required inputs
      if (!formData.teacherName || !formData.teacherName.trim()) {
        return res.status(400).json({ error: 'Nama Guru pengampu wajib diisi.' });
      }
      if (!formData.subject || !formData.subject.trim()) {
        return res.status(400).json({ error: 'Mata Pelajaran wajib diisi.' });
      }
      if (!formData.topic || !formData.topic.trim()) {
        return res.status(400).json({ error: 'Materi / Topik Pembelajaran wajib diisi.' });
      }
      if (!formData.learningObjective || !formData.learningObjective.trim()) {
        return res.status(400).json({ error: 'Tujuan Pembelajaran wajib diisi.' });
      }

      const result = await generateAssessmentWithGemini(formData);
      res.json({ success: true, data: result });
    } catch (error: any) {
      console.error('Error generating assessment:', error);

      if (error?.code === 'KEY_MISSING' || error?.message?.includes('GEMINI_API_KEY')) {
        return res.status(400).json({
          error: 'Kunci API Gemini (GEMINI_API_KEY) belum diatur di server.',
          detail: 'Silakan konfigurasikan GEMINI_API_KEY pada tab Settings > Secrets di AI Studio, atau gunakan Mode Manual Cadangan untuk menyalin prompt.',
          isKeyMissing: true,
        });
      }

      if (error?.status === 429 || error?.message?.includes('RESOURCE_EXHAUSTED')) {
        return res.status(429).json({
          error: 'Batas kuota Gemini API tercapai atau server sedang sibuk.',
          detail: 'Silakan tunggu sekitar 30 detik lalu coba lagi, atau gunakan tombol Mode Manual Cadangan.',
        });
      }

      if (error?.name === 'AbortError' || error?.message?.includes('timeout')) {
        return res.status(504).json({
          error: 'Permintaan ke Gemini API melebihi batas waktu (timeout).',
          detail: 'Silakan klik Generate ulang atau kurangi jumlah butir soal untuk mempercepat pemrosesan.',
        });
      }

      return res.status(500).json({
        error: 'Terjadi kendala saat memproses pembuatan asesmen.',
        detail: error?.message || 'Layanan AI sedang tidak dapat diakses sementara. Anda dapat menggunakan tombol Mode Manual Cadangan di bawah.',
      });
    }
  });

  // Unduh DOCX
  app.post('/api/export/docx', async (req: Request, res: Response) => {
    try {
      const { assessmentData, scope } = req.body as {
        assessmentData: AssessmentResult;
        scope: ExportScope;
      };

      if (!assessmentData) {
        return res.status(400).json({ error: 'Data asesmen tidak ditemukan.' });
      }

      const buffer = await generateDocxBuffer(assessmentData, scope || 'all');

      let filename = 'SUPM_TEGAL_SemuaPerangkat.docx';
      if (scope === 'kisi_kisi') filename = 'SUPM_TEGAL_KisiKisi.docx';
      else if (scope === 'naskah_soal') filename = 'SUPM_TEGAL_NaskahSoal.docx';
      else if (scope === 'kunci_jawaban') filename = 'SUPM_TEGAL_KunciJawaban.docx';
      else if (scope === 'rubrik') filename = 'SUPM_TEGAL_Rubrik.docx';

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(buffer);
    } catch (err: any) {
      console.error('Error exporting DOCX:', err);
      res.status(500).json({ error: 'Gagal membuat file DOCX: ' + err.message });
    }
  });

  // Unduh PDF
  app.post('/api/export/pdf', (req: Request, res: Response) => {
    try {
      const { assessmentData, scope } = req.body as {
        assessmentData: AssessmentResult;
        scope: ExportScope;
      };

      if (!assessmentData) {
        return res.status(400).json({ error: 'Data asesmen tidak ditemukan.' });
      }

      const buffer = generatePdfBuffer(assessmentData, scope || 'all');

      let filename = 'SUPM_TEGAL_SemuaPerangkat.pdf';
      if (scope === 'kisi_kisi') filename = 'SUPM_TEGAL_KisiKisi.pdf';
      else if (scope === 'naskah_soal') filename = 'SUPM_TEGAL_NaskahSoal.pdf';
      else if (scope === 'kunci_jawaban') filename = 'SUPM_TEGAL_KunciJawaban.pdf';
      else if (scope === 'rubrik') filename = 'SUPM_TEGAL_Rubrik.pdf';

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(buffer);
    } catch (err: any) {
      console.error('Error exporting PDF:', err);
      res.status(500).json({ error: 'Gagal membuat file PDF: ' + err.message });
    }
  });

  // Vite Integration
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SUPM TEGAL Assesmen Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
