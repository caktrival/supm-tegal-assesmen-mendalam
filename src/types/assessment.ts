export type GradeLevel = 'X' | 'XI' | 'XII';
export type MajorCode = 'NKPI' | 'TKPI' | 'APPL' | 'APHP';
export type AssessmentType = 'Diagnostik' | 'Formatif' | 'Sumatif';
export type InstrumentType = 'Pilihan Ganda' | 'Esai/Uraian' | 'Praktik/Unjuk Kerja' | 'Observasi' | 'Campuran';
export type CognitiveLevel = 'Prastruktural' | 'Unistruktural' | 'Multistruktural' | 'Relasional' | 'Abstrak Diperluas';
export type ItemCountOption = 5 | 10 | 15 | 20 | 25 | 30 | 40;

export interface AssessmentFormData {
  schoolName: string; // "SUPM TEGAL" (fixed)
  teacherName: string;
  subject: string;
  educationLevel: string; // "SMK" (fixed)
  grade: GradeLevel;
  major: MajorCode;
  assessmentType: AssessmentType;
  topic: string;
  learningObjective: string;
  additionalIndicator?: string;
  instrumentType: InstrumentType;
  itemCount: ItemCountOption;
  cognitiveLevel: CognitiveLevel;
  additionalNotes?: string;
}

export interface KisiKisiItem {
  no: number;
  learningObjective: string;
  topic: string;
  itemIndicator: string;
  cognitiveLevel: string;
  instrumentType: string;
  itemNumber: number;
  scoreWeight: number;
}

export interface QuestionItem {
  itemNumber: number;
  type: 'pilihan_ganda' | 'esai' | 'praktik' | 'observasi';
  questionText: string;
  options?: {
    A: string;
    B: string;
    C: string;
    D: string;
    E: string;
  };
  workSteps?: string[];
  allocatedScore: number;
}

export interface AnswerKeyItem {
  itemNumber: number;
  correctAnswer: string;
  explanation: string;
  expectedPerformance?: string[];
}

export interface RubricCriteria {
  itemNumberOrAspect: string;
  indicators: {
    level: string; // e.g., "Sangat Baik (4)", "Baik (3)", "Cukup (2)", "Perlu Bimbingan (1)"
    scoreRange: string;
    description: string;
  }[];
}

export interface RubrikData {
  generalRule: string;
  totalMaxScore: number;
  formula: string;
  criteria: RubricCriteria[];
  followUpRecommendations: {
    remedial: string;
    enrichment: string;
    pedagogicalNote: string;
  };
}

export interface QualityCheckData {
  itemCountMatched: boolean;
  targetCount: number;
  actualCount: number;
  mcFiveOptionsVerified: boolean;
  answerKeyMatched: boolean;
  rubricAligned: boolean;
  teacherVerificationNotes: string[];
}

export interface AssessmentResult {
  metadata: {
    id: string;
    schoolName: string;
    teacherName: string;
    subject: string;
    educationLevel: string;
    grade: GradeLevel;
    major: MajorCode;
    majorFullName: string;
    assessmentType: AssessmentType;
    topic: string;
    learningObjective: string;
    additionalIndicator?: string;
    instrumentType: InstrumentType;
    cognitiveLevel: CognitiveLevel;
    itemCount: number;
    createdAt: string;
    purposeDescription: string;
  };
  kisiKisi: KisiKisiItem[];
  naskahSoal: {
    generalInstructions: string[];
    items: QuestionItem[];
  };
  kunciJawaban: AnswerKeyItem[];
  rubrikPenskoran: RubrikData;
  qualityCheck: QualityCheckData;
}
