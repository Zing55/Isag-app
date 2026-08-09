import React, { useState, useEffect } from 'react';
import { Subject, Lesson, SmartSummary, Flashcard, Quiz, UserStudyStats, SubjectLevelState } from './types';
import { INITIAL_ISAG_SUBJECTS, SAMPLE_INITIAL_LESSONS } from './data/isagSyllabus';
import { calculateSM2, isCardDueToday } from './utils/sm2';
import { fetchISAGSyllabusFromAI, generateLessonFromAI } from './services/api';

import { Navbar } from './components/Navbar';
import { SyllabusExplorer } from './components/SyllabusExplorer';
import { LessonView } from './components/LessonView';
import { SpacedRepetitionView } from './components/SpacedRepetitionView';
import { SmartSummaryView } from './components/SmartSummaryView';
import { QuizView } from './components/QuizView';
import { ActiveRecallModal } from './components/ActiveRecallModal';
import { StatsDashboard } from './components/StatsDashboard';
import { StudyReminder } from './components/StudyReminder';

import { Loader2, Sparkles, BookOpen } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'syllabus' | 'lesson' | 'sm2' | 'summary' | 'quiz' | 'stats'>('syllabus');

  // Core Data States
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem('isag_subjects');
    return saved ? JSON.parse(saved) : INITIAL_ISAG_SUBJECTS;
  });

  const [lessons, setLessons] = useState<Lesson[]>(() => {
    const saved = localStorage.getItem('isag_lessons');
    return saved ? JSON.parse(saved) : SAMPLE_INITIAL_LESSONS;
  });

  const [activeLesson, setActiveLesson] = useState<Lesson | null>(lessons[0] || null);
  const [activeSummary, setActiveSummary] = useState<SmartSummary | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);

  // Initial Flashcards derived from sample lessons
  const [flashcards, setFlashcards] = useState<Flashcard[]>(() => {
    const saved = localStorage.getItem('isag_flashcards');
    if (saved) return JSON.parse(saved);

    // Initial default flashcards
    return [
      {
        id: 'fc-1',
        lessonId: 'lesson-gt201-goet',
        subjectId: 'isag-gt201',
        subjectName: 'Gestão de Organizações e Empresas Turísticas',
        lessonTitle: 'Ciclo do Hóspede e Gestão do RevPAR no Front-Office',
        front: 'Qual é a fórmula de cálculo do RevPAR (Revenue Per Available Room)?',
        back: 'RevPAR = ADR (Average Daily Rate) × Taxa de Ocupação (%), ou Receita Total de Quartos ÷ Total de Quartos Disponíveis.',
        hint: 'Multiplica a tarifa média diária pela taxa de ocupação.',
        repetition: 0,
        interval: 1,
        easeFactor: 2.5,
        dueDate: new Date().toISOString().split('T')[0],
      },
      {
        id: 'fc-2',
        lessonId: 'lesson-gt201-goet',
        subjectId: 'isag-gt201',
        subjectName: 'Gestão de Organizações e Empresas Turísticas',
        lessonTitle: 'Ciclo do Hóspede e Gestão do RevPAR no Front-Office',
        front: 'Quais são as 4 fases do ciclo do hóspede na hotelaria?',
        back: '1. Pré-chegada (Reserva e Comunicação)\n2. Acolhimento (Check-in e Atribuição de Quarto)\n3. Estadia (Consumos e Serviços)\n4. Saída (Check-out e Faturação).',
        hint: 'Mencionadas no 1º parágrafo da aula.',
        repetition: 0,
        interval: 1,
        easeFactor: 2.5,
        dueDate: new Date().toISOString().split('T')[0],
      },
      {
        id: 'fc-3',
        lessonId: 'lesson-gt209-hcap',
        subjectId: 'isag-gt209',
        subjectName: 'História da Arte, Etnografia e Património',
        lessonTitle: 'O Centro Histórico do Porto UNESCO e a Gestão Turística do Património',
        front: 'Em que ano o Centro Histórico do Porto foi classificado como Património Mundial pela UNESCO?',
        back: 'Em 1996, incluindo a Ponte Luiz I e o Mosteiro da Serra do Pilar.',
        hint: 'Anos 90.',
        repetition: 0,
        interval: 1,
        easeFactor: 2.5,
        dueDate: new Date().toISOString().split('T')[0],
      }
    ];
  });

  const [userStats, setUserStats] = useState<UserStudyStats>(() => {
    const saved = localStorage.getItem('isag_user_stats');
    return saved
      ? JSON.parse(saved)
      : {
          lessonsCompleted: 1,
          cardsReviewedToday: 0,
          totalCardsReviewed: 12,
          streakDays: 3,
          lastStudyDate: new Date().toISOString().split('T')[0],
          accuracyRate: 88,
          subjectProgress: {
            'isag-gt201': 25,
            'isag-gt205': 25,
            'isag-gt204': 0,
            'isag-gt202': 0,
            'isag-gt203': 0,
          },
        };
  });

  // Subject Level Progression State
  const [subjectLevels, setSubjectLevels] = useState<Record<string, {
    currentUnlockedLevel: number;
    completedLevelQuizzes: number[];
    completedTopicTitles: string[];
  }>>(() => {
    const saved = localStorage.getItem('isag_subject_levels');
    let baseState: Record<string, any> = {};
    if (saved) {
      try {
        baseState = JSON.parse(saved);
      } catch (e) {
        baseState = {};
      }
    }

    // Ensure EVERY subject in INITIAL_ISAG_SUBJECTS has at least currentUnlockedLevel = 1
    INITIAL_ISAG_SUBJECTS.forEach((s) => {
      if (!baseState[s.id]) {
        baseState[s.id] = {
          currentUnlockedLevel: 1,
          completedLevelQuizzes: [],
          completedTopicTitles: [],
        };
      } else if (!baseState[s.id].currentUnlockedLevel || baseState[s.id].currentUnlockedLevel < 1) {
        baseState[s.id].currentUnlockedLevel = 1;
      }
    });

    return baseState;
  });

  // Lesson Progress State (Quiz + Explanation to Professor)
  const [lessonProgressMap, setLessonProgressMap] = useState<Record<string, {
    hasPassedQuiz?: boolean;
    hasExplainedToProfessor?: boolean;
  }>>(() => {
    const saved = localStorage.getItem('isag_lesson_progress');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return {}; }
    }
    return {};
  });

  // UI Modals & Loading States
  const [isGeneratingLesson, setIsGeneratingLesson] = useState(false);
  const [isSearchingSyllabusAI, setIsSearchingSyllabusAI] = useState(false);
  const [isActiveRecallModalOpen, setIsActiveRecallModalOpen] = useState(false);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('isag_subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('isag_lessons', JSON.stringify(lessons));
  }, [lessons]);

  useEffect(() => {
    localStorage.setItem('isag_flashcards', JSON.stringify(flashcards));
  }, [flashcards]);

  useEffect(() => {
    localStorage.setItem('isag_user_stats', JSON.stringify(userStats));
  }, [userStats]);

  useEffect(() => {
    localStorage.setItem('isag_subject_levels', JSON.stringify(subjectLevels));
  }, [subjectLevels]);

  useEffect(() => {
    localStorage.setItem('isag_lesson_progress', JSON.stringify(lessonProgressMap));
  }, [lessonProgressMap]);

  // Handler: Level Passed
  const handlePassLevel = (subjectId: string, completedLevel: number) => {
    setSubjectLevels((prev) => {
      const current = prev[subjectId] || {
        currentUnlockedLevel: 1,
        completedLevelQuizzes: [],
        completedTopicTitles: [],
      };

      const updatedQuizzes = Array.from(new Set([...current.completedLevelQuizzes, completedLevel]));
      const newUnlockedLevel = Math.max(current.currentUnlockedLevel, completedLevel + 1);

      return {
        ...prev,
        [subjectId]: {
          ...current,
          currentUnlockedLevel: newUnlockedLevel,
          completedLevelQuizzes: updatedQuizzes,
        },
      };
    });

    setUserStats((prev) => {
      const newProgress = Math.min(100, Math.round((completedLevel / 4) * 100));
      return {
        ...prev,
        subjectProgress: {
          ...prev.subjectProgress,
          [subjectId]: Math.max(prev.subjectProgress[subjectId] || 0, newProgress),
        },
      };
    });
  };

  // Handler: Toggle Topic Completed
  const handleToggleTopicCompleted = (subjectId: string, topicTitle: string) => {
    setSubjectLevels((prev) => {
      const current = prev[subjectId] || {
        currentUnlockedLevel: 1,
        completedLevelQuizzes: [],
        completedTopicTitles: [],
      };
      const isAlreadyCompleted = (current.completedTopicTitles || []).includes(topicTitle);
      const updatedTopics = isAlreadyCompleted
        ? (current.completedTopicTitles || []).filter((t) => t !== topicTitle)
        : [...(current.completedTopicTitles || []), topicTitle];

      return {
        ...prev,
        [subjectId]: {
          ...current,
          completedTopicTitles: updatedTopics,
        },
      };
    });
  };

  // Handler: Desbloquear Todos os Níveis (Modo Livre / Livre Navegação)
  const handleUnlockAllLevels = () => {
    setSubjectLevels((prev) => {
      const updated: Record<string, any> = { ...prev };
      INITIAL_ISAG_SUBJECTS.forEach((s) => {
        updated[s.id] = {
          currentUnlockedLevel: 4,
          completedLevelQuizzes: [1, 2, 3, 4],
          completedTopicTitles: updated[s.id]?.completedTopicTitles || [],
        };
      });
      return updated;
    });
  };

  // Handler: Generate 5-Paragraph Lesson via AI
  const handleGenerateLesson = async (subject: Subject, moduleTitle: string, topic: string) => {
    setIsGeneratingLesson(true);
    try {
      const payload = await generateLessonFromAI({
        subjectName: subject.name,
        moduleTitle,
        topic,
        semester: subject.semester,
      });

      const newLessonId = `lesson-${Date.now()}`;

      // 1. Create Lesson object with 5 paragraphs
      const newLesson: Lesson = {
        id: newLessonId,
        subjectId: subject.id,
        subjectName: subject.name,
        moduleId: moduleTitle,
        moduleTitle,
        title: payload.title,
        estimatedReadTimeMinutes: payload.estimatedReadTimeMinutes || 5,
        paragraphs: payload.paragraphs,
        createdAt: new Date().toISOString(),
      };

      // 2. Create Summary
      const newSummary: SmartSummary = {
        lessonId: newLessonId,
        lessonTitle: payload.title,
        keyTakeaways: payload.summary.keyTakeaways,
        technicalGlossary: payload.summary.technicalGlossary,
        conceptNodes: payload.summary.conceptNodes || [],
        examChecklist: payload.summary.examChecklist,
        practicalApplication: payload.summary.practicalApplication,
      };

      // 3. Create Flashcards
      const todayStr = new Date().toISOString().split('T')[0];
      const newCards: Flashcard[] = (payload.flashcards || []).map((fc, idx) => ({
        id: `fc-${Date.now()}-${idx}`,
        lessonId: newLessonId,
        subjectId: subject.id,
        subjectName: subject.name,
        lessonTitle: payload.title,
        front: fc.front,
        back: fc.back,
        hint: fc.hint,
        repetition: 0,
        interval: 1,
        easeFactor: 2.5,
        dueDate: todayStr,
      }));

      // 4. Create Quiz
      const newQuiz: Quiz = {
        lessonId: newLessonId,
        lessonTitle: payload.title,
        questions: (payload.quizQuestions || []).map((q, idx) => ({
          id: `q-${Date.now()}-${idx}`,
          question: q.question,
          options: q.options,
          correctOptionIndex: q.correctOptionIndex,
          explanation: q.explanation,
        })),
      };

      setLessons((prev) => [newLesson, ...prev]);
      setFlashcards((prev) => [...newCards, ...prev]);
      setActiveLesson(newLesson);
      setActiveSummary(newSummary);
      setActiveQuiz(newQuiz);

      // Navigate directly to the lesson view
      setActiveTab('lesson');
    } catch (err: any) {
      alert(`Erro ao gerar aula: ${err.message || 'Falha de comunicação com a IA.'}`);
    } finally {
      setIsGeneratingLesson(false);
    }
  };

  // Handler: AI Syllabus Live Search
  const handleSearchSyllabusAI = async (semester: number | null, query: string) => {
    setIsSearchingSyllabusAI(true);
    try {
      const data = await fetchISAGSyllabusFromAI(semester || undefined, query);
      if (data && data.subjects && Array.isArray(data.subjects)) {
        // Merge or replace subjects
        const formattedNewSubjects: Subject[] = data.subjects.map((s: any, idx: number) => ({
          id: `ai-subj-${Date.now()}-${idx}`,
          code: s.code || `GT${idx + 200}`,
          name: s.name,
          semester: s.semester || semester || 1,
          credits: s.credits || 6,
          description: s.description || 'Unidade curricular do ISAG Porto.',
          modules: (s.modules || []).map((m: any, mIdx: number) => ({
            id: `mod-${Date.now()}-${mIdx}`,
            subjectId: `ai-subj-${Date.now()}-${idx}`,
            title: m.title || `Módulo ${mIdx + 1}`,
            topics: m.topics || [],
          })),
        }));

        setSubjects((prev) => [...formattedNewSubjects, ...prev]);
      }
    } catch (err: any) {
      alert(`Erro na pesquisa de programa: ${err.message}`);
    } finally {
      setIsSearchingSyllabusAI(false);
    }
  };

  // Handler: Update Flashcard SM-2 Score
  const handleUpdateFlashcard = (updatedCard: Flashcard) => {
    setFlashcards((prev) => prev.map((c) => (c.id === updatedCard.id ? updatedCard : c)));
  };

  const recordStudyActivity = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    setUserStats((prev) => {
      const lastDate = prev.lastStudyDate || todayStr;
      if (lastDate === todayStr) {
        return {
          ...prev,
          cardsReviewedToday: prev.cardsReviewedToday + 1,
        };
      }

      const prevDateObj = new Date(lastDate);
      const todayObj = new Date(todayStr);
      const diffTime = Math.abs(todayObj.getTime() - prevDateObj.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      let newStreak = prev.streakDays;
      if (diffDays === 1) {
        newStreak = prev.streakDays + 1;
      } else if (diffDays > 1) {
        newStreak = 1;
      }

      return {
        ...prev,
        cardsReviewedToday: 1,
        lastStudyDate: todayStr,
        streakDays: newStreak,
      };
    });
  };

  const handleResetAllProgress = () => {
    localStorage.removeItem('isag_subjects');
    localStorage.removeItem('isag_lessons');
    localStorage.removeItem('isag_flashcards');
    localStorage.removeItem('isag_user_stats');
    localStorage.removeItem('isag_subject_levels');
    localStorage.removeItem('isag_lesson_progress');

    const todayStr = new Date().toISOString().split('T')[0];

    const resetStats: UserStudyStats = {
      lessonsCompleted: 0,
      cardsReviewedToday: 0,
      totalCardsReviewed: 0,
      streakDays: 1,
      lastStudyDate: todayStr,
      accuracyRate: 100,
      subjectProgress: {
        'isag-gt201': 0,
        'isag-gt205': 0,
        'isag-gt204': 0,
        'isag-gt202': 0,
        'isag-gt203': 0,
      },
    };

    const resetLevels: Record<string, SubjectLevelState> = {};
    INITIAL_ISAG_SUBJECTS.forEach((s) => {
      resetLevels[s.id] = {
        currentUnlockedLevel: 1,
        completedLevelQuizzes: [],
        completedTopicTitles: [],
      };
    });

    setUserStats(resetStats);
    setSubjectLevels(resetLevels);
    setLessonProgressMap({});
    setLessons(SAMPLE_INITIAL_LESSONS);
    setSubjects(INITIAL_ISAG_SUBJECTS);
    setFlashcards([
      {
        id: 'fc-1',
        lessonId: 'lesson-gt201-goet',
        subjectId: 'isag-gt201',
        subjectName: 'Gestão de Organizações e Empresas Turísticas',
        lessonTitle: 'Ciclo do Hóspede e Gestão do RevPAR no Front-Office',
        front: 'Qual é a fórmula de cálculo do RevPAR (Revenue Per Available Room)?',
        back: 'RevPAR = ADR (Average Daily Rate) × Taxa de Ocupação (%), ou Receita Total de Quartos ÷ Total de Quartos Disponíveis.',
        hint: 'Multiplica a tarifa média diária pela taxa de ocupação.',
        repetition: 0,
        interval: 1,
        easeFactor: 2.5,
        dueDate: new Date().toISOString().split('T')[0],
      },
      {
        id: 'fc-2',
        lessonId: 'lesson-gt201-goet',
        subjectId: 'isag-gt201',
        subjectName: 'Gestão de Organizações e Empresas Turísticas',
        lessonTitle: 'Ciclo do Hóspede e Gestão do RevPAR no Front-Office',
        front: 'Quais são as 4 fases do ciclo do hóspede na hotelaria?',
        back: '1. Pré-chegada (Reserva e Comunicação)\n2. Acolhimento (Check-in e Atribuição de Quarto)\n3. Estadia (Consumos e Serviços)\n4. Saída (Check-out e Faturação).',
        hint: 'Mencionadas no 1º parágrafo da aula.',
        repetition: 0,
        interval: 1,
        easeFactor: 2.5,
        dueDate: new Date().toISOString().split('T')[0],
      },
      {
        id: 'fc-3',
        lessonId: 'lesson-gt209-hcap',
        subjectId: 'isag-gt209',
        subjectName: 'História da Arte, Etnografia e Património',
        lessonTitle: 'O Centro Histórico do Porto UNESCO e a Gestão Turística do Património',
        front: 'Em que ano o Centro Histórico do Porto foi classificado como Património Mundial pela UNESCO?',
        back: 'Em 1996, incluindo a Ponte Luiz I e o Mosteiro da Serra do Pilar.',
        hint: 'Anos 90.',
        repetition: 0,
        interval: 1,
        easeFactor: 2.5,
        dueDate: new Date().toISOString().split('T')[0],
      }
    ]);
  };

  const handleIncrementReviewStats = (quality: number) => {
    recordStudyActivity();
    setUserStats((prev) => ({
      ...prev,
      cardsReviewedToday: prev.cardsReviewedToday + 1,
      totalCardsReviewed: prev.totalCardsReviewed + 1,
      accuracyRate: Math.round((prev.accuracyRate * 0.9) + (quality >= 3 ? 10 : 0)),
    }));
  };

  // Helper: Generate structured Quiz for any lesson
  const getQuizForLesson = (lesson: Lesson): Quiz => {
    return {
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      questions: [
        {
          id: `q-${lesson.id}-1`,
          question: `De acordo com o enquadramento de "${lesson.title}", qual é o foco principal no setor do Turismo?`,
          options: [
            `Aplicação prática e estratégica dos conceitos de ${lesson.subjectName}`,
            'Apenas memorização teórica sem aplicação em contexto hoteleiro',
            'Aumento descontrolado de custos operacionais',
            'Eliminação de processos digitais nas empresas do Porto'
          ],
          correctOptionIndex: 0,
          explanation: `O enquadramento inicial da aula de ${lesson.subjectName} destaca a aplicação prática e a otimização de gestão no setor hoteleiro e turístico em Portugal.`,
        },
        {
          id: `q-${lesson.id}-2`,
          question: `Qual das seguintes opções melhor reflete o caso prático e a análise técnica apresentada nesta aula?`,
          options: [
            'A gestão de excelência exige análise de indicadores de desempenho e personalização da experiência do cliente.',
            'O setor do turismo não necessita de planeamento estratégico nem medição de resultados.',
            'A tecnologia substitui totalmente a componente humana no atendimento.',
            'Os indicadores operacionais aplicam-se apenas a grandes multinacionais.'
          ],
          correctOptionIndex: 0,
          explanation: 'O estudo de caso da aula salienta o equilíbrio entre a eficiência técnica dos indicadores e o acolhimento personalizado.',
        },
        {
          id: `q-${lesson.id}-3`,
          question: `Com base nas conclusões da aula, qual é o requisito fundamental para os estudantes e profissionais de Turismo?`,
          options: [
            'Domínio de ferramentas de análise, visão crítica do mercado e resolução de problemas reais.',
            'Apenas presença nas aulas teóricas sem realização de trabalhos práticos.',
            'Desconhecimento do património turístico regional.',
            'Manter modelos operacionais ultrapassados.'
          ],
          correctOptionIndex: 0,
          explanation: 'A síntese final da aula enfatiza a visão crítica, capacidade analítica e preparação para exames e mercado de trabalho.',
        }
      ]
    };
  };

  // Handler: Mark Lesson Completed
  const handleMarkLessonCompleted = (lessonId: string) => {
    recordStudyActivity();
    setLessons((prev) =>
      prev.map((l) => (l.id === lessonId ? { ...l, isCompleted: true } : l))
    );

    const targetLesson = lessons.find((l) => l.id === lessonId) || activeLesson;
    if (targetLesson) {
      setSubjectLevels((prev) => {
        const current = prev[targetLesson.subjectId] || {
          currentUnlockedLevel: 1,
          completedLevelQuizzes: [],
          completedTopicTitles: [],
        };
        if (!(current.completedTopicTitles || []).includes(targetLesson.title)) {
          return {
            ...prev,
            [targetLesson.subjectId]: {
              ...current,
              completedTopicTitles: [...(current.completedTopicTitles || []), targetLesson.title],
            },
          };
        }
        return prev;
      });
    }

    setUserStats((prev) => ({
      ...prev,
      lessonsCompleted: prev.lessonsCompleted + 1,
    }));
  };

  const handleQuizPassedForLesson = (lessonId: string) => {
    setLessonProgressMap((prev) => {
      const current = prev[lessonId] || {};
      const updated = { ...current, hasPassedQuiz: true };
      if (updated.hasPassedQuiz && updated.hasExplainedToProfessor) {
        handleMarkLessonCompleted(lessonId);
      }
      return { ...prev, [lessonId]: updated };
    });
  };

  const handleExplanationSubmittedForLesson = (lessonId: string) => {
    setLessonProgressMap((prev) => {
      const current = prev[lessonId] || {};
      const updated = { ...current, hasExplainedToProfessor: true };
      if (updated.hasPassedQuiz && updated.hasExplainedToProfessor) {
        handleMarkLessonCompleted(lessonId);
      }
      return { ...prev, [lessonId]: updated };
    });
  };

  const dueCardsCount = flashcards.filter((c) => isCardDueToday(c.dueDate)).length;

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans flex flex-col antialiased">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        dueCardsCount={dueCardsCount}
        streakDays={userStats.streakDays}
      />

      {/* Main Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'syllabus' && (
          <div className="space-y-6">
            <StudyReminder
              flashcards={flashcards}
              userStats={userStats}
              subjects={subjects}
              subjectLevels={subjectLevels}
              lessonProgressMap={lessonProgressMap}
              onNavigateToTab={(tab) => setActiveTab(tab)}
              onResetProgress={handleResetAllProgress}
            />
            <SyllabusExplorer
              subjects={subjects}
              onSelectTopicToGenerate={handleGenerateLesson}
              onOpenLesson={(lesson) => {
                setActiveLesson(lesson);
                setActiveTab('lesson');
              }}
              existingLessons={lessons}
              onSearchAI={handleSearchSyllabusAI}
              isSearchingAI={isSearchingSyllabusAI}
              subjectLevels={subjectLevels}
              onPassLevel={handlePassLevel}
              onToggleTopicCompleted={handleToggleTopicCompleted}
              onUnlockAllLevels={handleUnlockAllLevels}
            />
          </div>
        )}

        {activeTab === 'lesson' && (
          <LessonView
            lesson={activeLesson}
            allSubjects={subjects}
            subjectLevels={subjectLevels}
            existingLessons={lessons}
            lessonProgressMap={lessonProgressMap}
            isGeneratingLesson={isGeneratingLesson}
            onSelectLesson={(lesson) => {
              setActiveLesson(lesson);
              setActiveQuiz(getQuizForLesson(lesson));
            }}
            onSelectTopicToGenerate={handleGenerateLesson}
            onBackToSyllabus={() => setActiveTab('syllabus')}
            onOpenFlashcards={() => setActiveTab('sm2')}
            onOpenSummary={() => setActiveTab('summary')}
            onOpenQuiz={() => {
              if (activeLesson) {
                setActiveQuiz(getQuizForLesson(activeLesson));
              }
              setActiveTab('quiz');
            }}
            onOpenActiveRecallModal={() => setIsActiveRecallModalOpen(true)}
            onMarkLessonCompleted={handleMarkLessonCompleted}
          />
        )}

        {activeTab === 'sm2' && (
          <SpacedRepetitionView
            flashcards={flashcards}
            onUpdateFlashcards={handleUpdateFlashcard}
            onIncrementReviewStats={handleIncrementReviewStats}
          />
        )}

        {activeTab === 'summary' && (
          <SmartSummaryView
            summary={activeSummary}
            lessonTitle={activeLesson?.title || 'Aula ISAG'}
            currentLesson={activeLesson}
          />
        )}

        {activeTab === 'quiz' && (
          <QuizView
            quiz={activeQuiz || (activeLesson ? getQuizForLesson(activeLesson) : null)}
            onFinishQuiz={(score) => {
              setUserStats((prev) => ({
                ...prev,
                accuracyRate: Math.round((prev.accuracyRate + score) / 2),
              }));
              if (activeQuiz && activeQuiz.lessonId) {
                handleQuizPassedForLesson(activeQuiz.lessonId);
              } else if (activeLesson) {
                handleQuizPassedForLesson(activeLesson.id);
              }
            }}
          />
        )}

        {activeTab === 'stats' && (
          <StatsDashboard
            stats={userStats}
            subjects={subjects}
            flashcards={flashcards}
            subjectLevels={subjectLevels}
            lessonProgressMap={lessonProgressMap}
            onNavigateToTab={(tab) => setActiveTab(tab)}
            onResetProgress={handleResetAllProgress}
          />
        )}
      </main>

      {/* Generating Modal Overlay */}
      {isGeneratingLesson && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl border border-slate-200">
            <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">A estruturar a sua Aula em 5 Parágrafos</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                A IA do ISAG está a compor o enquadramento, conceitos-chave, caso prático do turismo em Portugal, análise crítica e pontos de exame...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Active Recall Modal */}
      {activeLesson && (
        <ActiveRecallModal
          isOpen={isActiveRecallModalOpen}
          onClose={() => setIsActiveRecallModalOpen(false)}
          lessonTitle={activeLesson.title}
          lessonContent={activeLesson.paragraphs.map((p) => p.content).join('\n')}
          onExplanationSubmitted={() => handleExplanationSubmittedForLesson(activeLesson.id)}
        />
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-1">
          <p className="font-semibold text-slate-300">
            StudyISAG • CTeSP em Gestão de Turismo (Porto, Portugal)
          </p>
          <p className="text-slate-500">
            Aulas em 5 Parágrafos • Repetição Espaçada SM-2 • Resumos Ativos • Desenvolvido com IA do Google Gemini
          </p>
        </div>
      </footer>
    </div>
  );
}
