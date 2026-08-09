import { Lesson, SmartSummary, Flashcard, QuizQuestion, ActiveRecallFeedback } from '../types';

export interface GeneratedLessonPayload {
  title: string;
  estimatedReadTimeMinutes: number;
  paragraphs: {
    number: number;
    title: string;
    content: string;
    keyTerms: string[];
  }[];
  summary: {
    keyTakeaways: string[];
    technicalGlossary: { term: string; definition: string }[];
    conceptNodes: { concept: string; relation: string; target: string }[];
    examChecklist: string[];
    practicalApplication: string;
  };
  flashcards: {
    front: string;
    back: string;
    hint?: string;
  }[];
  quizQuestions: {
    question: string;
    options: string[];
    correctOptionIndex: number;
    explanation: string;
  }[];
}

export async function fetchISAGSyllabusFromAI(semester?: number, query?: string) {
  const response = await fetch('/api/syllabus/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ semester, query }),
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'Erro ao buscar programa curricular no ISAG.');
  }
  return data.data;
}

export async function generateLessonFromAI(params: {
  subjectName: string;
  moduleTitle: string;
  topic: string;
  semester?: number;
}): Promise<GeneratedLessonPayload> {
  const response = await fetch('/api/lessons/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'Erro ao gerar aula de 5 parágrafos.');
  }
  return data.data;
}

export async function evaluateActiveRecallFromAI(params: {
  lessonTitle: string;
  lessonContent: string;
  userExplanation: string;
}): Promise<ActiveRecallFeedback> {
  const response = await fetch('/api/active-recall/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'Erro ao avaliar a explicação.');
  }
  return data.data;
}
