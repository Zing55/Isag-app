export interface Module {
  id: string;
  subjectId: string;
  level: number; // 1, 2, 3, 4
  title: string;
  topics: string[];
  lessonsCount?: number;
  quizQuestions?: QuizQuestion[]; // Level checkpoint questions
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  semester: number; // 1, 2, 3, 4
  credits: number; // ECTS
  description: string;
  modules: Module[]; // Sequential modules representing Levels 1, 2, 3, 4
}

export interface SubjectLevelState {
  currentUnlockedLevel: number; // 1, 2, 3, 4 (starts at 1)
  completedLevelQuizzes: number[]; // e.g. [1]
  completedTopicTitles: string[]; // list of completed topic strings
}

export interface LessonParagraph {
  number: number; // 1 to 5
  title: string; // e.g., "1. Contexto & Enquadramento"
  content: string;
  keyTerms: string[];
}

export interface Lesson {
  id: string;
  subjectId: string;
  subjectName: string;
  moduleId: string;
  moduleTitle: string;
  title: string;
  estimatedReadTimeMinutes: number;
  paragraphs: LessonParagraph[]; // MUST contain 5 items
  createdAt: string;
  isCompleted?: boolean;
}

export interface SmartSummary {
  lessonId: string;
  lessonTitle: string;
  keyTakeaways: string[];
  technicalGlossary: { term: string; definition: string }[];
  conceptNodes: { concept: string; relation: string; target: string }[];
  examChecklist: string[];
  practicalApplication: string;
}

export interface Flashcard {
  id: string;
  lessonId: string;
  subjectId: string;
  subjectName: string;
  lessonTitle: string;
  front: string;
  back: string;
  hint?: string;
  // SM-2 Spaced Repetition fields
  repetition: number;
  interval: number; // days
  easeFactor: number; // starts at 2.5
  dueDate: string; // ISO date string YYYY-MM-DD
  lastReviewed?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface Quiz {
  lessonId: string;
  lessonTitle: string;
  questions: QuizQuestion[];
}

export interface ActiveRecallFeedback {
  score: number; // 0 to 100
  feedback: string;
  strengths: string[];
  missingConcepts: string[];
  recommendation: string;
}

export interface UserStudyStats {
  lessonsCompleted: number;
  cardsReviewedToday: number;
  totalCardsReviewed: number;
  streakDays: number;
  lastStudyDate: string;
  accuracyRate: number; // %
  subjectProgress: Record<string, number>; // subjectId -> % completion (0 to 100)
  subjectLevels?: Record<string, SubjectLevelState>; // subjectId -> level state
}
