import React, { useState } from 'react';
import { Flashcard, UserStudyStats, Subject, SubjectLevelState } from '../types';
import {
  Bell,
  Calendar,
  Flame,
  RotateCcw,
  BookOpen,
  ArrowRight,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Trash2,
  HelpCircle,
  Clock,
  Target
} from 'lucide-react';

interface StudyReminderProps {
  flashcards: Flashcard[];
  userStats: UserStudyStats;
  subjects: Subject[];
  subjectLevels: Record<string, SubjectLevelState>;
  lessonProgressMap: Record<string, { hasPassedQuiz?: boolean; hasExplainedToProfessor?: boolean }>;
  onNavigateToTab: (tab: 'syllabus' | 'lesson' | 'sm2' | 'summary' | 'quiz' | 'stats') => void;
  onResetProgress: () => void;
}

export const StudyReminder: React.FC<StudyReminderProps> = ({
  flashcards,
  userStats,
  subjects,
  subjectLevels,
  lessonProgressMap,
  onNavigateToTab,
  onResetProgress,
}) => {
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];
  const lastStudyDate = userStats.lastStudyDate || todayStr;

  // Calculate days difference between today and lastStudyDate
  const getDaysDifference = (d1Str: string, d2Str: string) => {
    try {
      const date1 = new Date(d1Str);
      const date2 = new Date(d2Str);
      const diffTime = Math.abs(date1.getTime() - date2.getTime());
      return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    } catch {
      return 0;
    }
  };

  const daysSinceLastStudy = getDaysDifference(todayStr, lastStudyDate);
  const studiedToday = todayStr === lastStudyDate && userStats.cardsReviewedToday > 0;

  // 1. SM-2 Due Flashcards Analysis
  const dueFlashcards = flashcards.filter((card) => {
    if (!card.dueDate) return true;
    return card.dueDate <= todayStr;
  });

  // 2. Weak/Priority Area Identification
  // Analyze subjects to find which one has the lowest completion percentage or unlocked level progress
  const subjectProgressList = subjects.map((subj) => {
    const sState = subjectLevels[subj.id] || { currentUnlockedLevel: 1, completedTopicTitles: [] };
    const totalTopicsInSubj = subj.modules.reduce((acc, m) => acc + m.topics.length, 0);
    const completedCount = (sState.completedTopicTitles || []).length;
    const percent = totalTopicsInSubj > 0 ? Math.round((completedCount / totalTopicsInSubj) * 100) : 0;

    return {
      subject: subj,
      level: sState.currentUnlockedLevel,
      completedCount,
      totalTopics: totalTopicsInSubj,
      percent,
    };
  });

  // Sort ascending by completion percent to find lowest
  const lowestProgressSubj = [...subjectProgressList].sort((a, b) => a.percent - b.percent)[0];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                Lembrete de Estudo Inteligente
              </h2>
              <span className="text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                SM-2 & Diagnóstico
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Análise personalizada das suas revisões, consistência de streak e áreas a reforçar.
            </p>
          </div>
        </div>

        {/* Reset Progress Button */}
        <button
          onClick={() => setIsResetModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors self-start sm:self-auto"
          title="Apagar todo o histórico e recomeçar do zero"
        >
          <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
          <span>Começar do Zero</span>
        </button>
      </div>

      {/* Main Alert Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Streak & Last Study Analysis */}
        <div className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
          studiedToday
            ? 'bg-emerald-50/60 border-emerald-200'
            : daysSinceLastStudy <= 1
            ? 'bg-amber-50/60 border-amber-200'
            : 'bg-rose-50/60 border-rose-200'
        }`}>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>Estado do Streak</span>
              </span>
              <span className="text-xs font-black px-2 py-0.5 rounded-full bg-white/80 border border-slate-200 text-slate-900">
                🔥 {userStats.streakDays} {userStats.streakDays === 1 ? 'dia' : 'dias'}
              </span>
            </div>

            {studiedToday ? (
              <div className="space-y-1">
                <p className="text-xs font-bold text-emerald-950 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Estudo Registado Hoje!</span>
                </p>
                <p className="text-[11px] text-emerald-800 leading-snug">
                  Excelente consistência! O seu streak de {userStats.streakDays} dias está garantido para a data de hoje.
                </p>
              </div>
            ) : daysSinceLastStudy <= 1 ? (
              <div className="space-y-1">
                <p className="text-xs font-bold text-amber-950 flex items-center gap-1">
                  <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                  <span>Manter o Streak Hoje</span>
                </p>
                <p className="text-[11px] text-amber-900 leading-snug">
                  Última revisão realizada em <strong>{lastStudyDate}</strong>. Complete pelo menos 1 aula ou cartão hoje para estender a sua sequência!
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-xs font-bold text-rose-950 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Reativar Sequência de Estudo</span>
                </p>
                <p className="text-[11px] text-rose-900 leading-snug">
                  Não realiza estudos há {daysSinceLastStudy} dias. Estude hoje para reativar o seu contador de streak e fixar a matéria.
                </p>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-slate-200/50 text-[11px] text-slate-500">
            Última atividade: <strong className="text-slate-700">{lastStudyDate}</strong>
          </div>
        </div>

        {/* Card 2: SM-2 Flashcards Alert */}
        <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/40 flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1">
                <RotateCcw className="w-4 h-4 text-indigo-600" />
                <span>Revisão Espaçada (SM-2)</span>
              </span>
              <span className="text-xs font-black px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                {dueFlashcards.length} pendentes
              </span>
            </div>

            {dueFlashcards.length > 0 ? (
              <div className="space-y-1.5">
                <p className="text-xs font-bold text-indigo-950">
                  {dueFlashcards.length} cartões prontos para consolidação hoje.
                </p>
                <div className="bg-white/80 p-2 rounded-lg border border-indigo-100 space-y-1">
                  <span className="text-[10px] font-bold text-indigo-700 uppercase block">Próximo Cartão:</span>
                  <p className="text-[11px] text-slate-800 line-clamp-1 italic font-medium">
                    "{dueFlashcards[0].front}"
                  </p>
                  <span className="text-[10px] text-slate-500 block">
                    {dueFlashcards[0].subjectName}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-indigo-900 leading-relaxed">
                🎉 Sem cartões acumulados para hoje! Todas as revisões SM-2 estão em dia.
              </p>
            )}
          </div>

          <button
            onClick={() => onNavigateToTab('sm2')}
            className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5"
          >
            <span>Revisar Flashcards SM-2</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 3: Priority Area Recommended for Repetition */}
        <div className="p-4 rounded-xl border border-sky-100 bg-sky-50/40 flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-900 uppercase tracking-wider flex items-center gap-1">
                <Target className="w-4 h-4 text-sky-600" />
                <span>Área Recomendada para Repetição</span>
              </span>
              {lowestProgressSubj && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                  {lowestProgressSubj.percent}% Concluído
                </span>
              )}
            </div>

            {lowestProgressSubj ? (
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                  UC: {lowestProgressSubj.subject.code}
                </span>
                <p className="text-xs font-bold text-slate-900 leading-snug">
                  {lowestProgressSubj.subject.name}
                </p>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Esta unidade curricular possui o menor número de tópicos e quizzes concluídos ({lowestProgressSubj.completedCount}/{lowestProgressSubj.totalTopics} aulas).
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-600">
                Todas as disciplinas apresentam excelente equilíbrio de progresso!
              </p>
            )}
          </div>

          <button
            onClick={() => onNavigateToTab('syllabus')}
            className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-400" />
            <span>Estudar Disciplina Prioritária</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Resetting Progress */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Redefinir Progresso do Curso?
                </h3>
                <p className="text-xs text-slate-500">
                  Esta ação irá apagar todo o seu histórico escolar na app.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs text-slate-700">
              <p className="font-bold text-slate-900">O que será redefinido ao começar do zero:</p>
              <ul className="list-disc pl-4 space-y-1 text-slate-600">
                <li>Todos os níveis das Unidades Curriculares voltarão ao Nível 1.</li>
                <li>O registo de tópicos, aulas e quizzes concluídos será limpo.</li>
                <li>O histórico de repetições SM-2 dos flashcards voltará ao estado inicial.</li>
                <li>O contador de dias de streak e estatísticas gerais serão zerados.</li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsResetModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onResetProgress();
                  setIsResetModalOpen(false);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Sim, Começar do Zero</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
