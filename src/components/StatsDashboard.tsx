import React from 'react';
import { UserStudyStats, Subject, Flashcard, SubjectLevelState } from '../types';
import { StudyReminder } from './StudyReminder';
import {
  BarChart2,
  Award,
  Flame,
  CheckCircle2,
  BookOpen,
  RotateCcw,
  Target,
  TrendingUp,
  GraduationCap
} from 'lucide-react';

interface StatsDashboardProps {
  stats: UserStudyStats;
  subjects: Subject[];
  flashcards: Flashcard[];
  subjectLevels: Record<string, SubjectLevelState>;
  lessonProgressMap: Record<string, { hasPassedQuiz?: boolean; hasExplainedToProfessor?: boolean }>;
  onNavigateToTab: (tab: 'syllabus' | 'lesson' | 'sm2' | 'summary' | 'quiz' | 'stats') => void;
  onResetProgress: () => void;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({
  stats,
  subjects,
  flashcards,
  subjectLevels,
  lessonProgressMap,
  onNavigateToTab,
  onResetProgress,
}) => {
  return (
    <div className="space-y-8">
      {/* 1. Lembrete de Estudo Inteligente & Reset Progress Component */}
      <StudyReminder
        flashcards={flashcards}
        userStats={stats}
        subjects={subjects}
        subjectLevels={subjectLevels}
        lessonProgressMap={lessonProgressMap}
        onNavigateToTab={onNavigateToTab}
        onResetProgress={onResetProgress}
      />

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center flex-shrink-0 text-xl font-bold">
            🔥
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900">{stats.streakDays}</span>
            <p className="text-xs font-semibold text-slate-500">Dias Seguidos de Estudo</p>
          </div>
        </div>

        {/* Lessons Completed */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900">{stats.lessonsCompleted}</span>
            <p className="text-xs font-semibold text-slate-500">Aulas (5P) Concluídas</p>
          </div>
        </div>

        {/* Cards Reviewed */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center flex-shrink-0">
            <RotateCcw className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900">{stats.totalCardsReviewed}</span>
            <p className="text-xs font-semibold text-slate-500">Flashcards Revistos (SM-2)</p>
          </div>
        </div>

        {/* Accuracy Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900">{stats.accuracyRate}%</span>
            <p className="text-xs font-semibold text-slate-500">Taxa de Acerto em Testes</p>
          </div>
        </div>
      </div>

      {/* Subject Progress Section */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-600" />
              <span>Progresso Real por Unidade Curricular (ISAG Porto)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Métricas detalhadas de conclusão de tópicos, níveis e quizzes para cada disciplina:
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {subjects.map((subject) => {
            const sState = subjectLevels[subject.id] || { currentUnlockedLevel: 1, completedTopicTitles: [] };
            const totalTopicsInSubj = subject.modules.reduce((acc, m) => acc + m.topics.length, 0);
            const completedCount = (sState.completedTopicTitles || []).length;
            const computedProgress = totalTopicsInSubj > 0 ? Math.round((completedCount / totalTopicsInSubj) * 100) : 0;
            const progress = Math.max(stats.subjectProgress[subject.id] || 0, computedProgress);

            return (
              <div key={subject.id} className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 font-bold text-[10px]">
                      {subject.code}
                    </span>
                    <span className="text-slate-900 font-bold">{subject.name}</span>
                    <span className="text-slate-500 text-[11px]">({subject.semester}º Semestre)</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                      Nível {sState.currentUnlockedLevel} / 4
                    </span>
                    <span className="text-indigo-700 font-extrabold">{progress}%</span>
                  </div>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-600 to-sky-500 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Tópicos Concluídos: {completedCount} de {totalTopicsInSubj}</span>
                  <span className="font-medium text-slate-600">
                    {progress === 100 ? '✓ Disciplina Totalmente Dominada' : `${100 - progress}% para completar a disciplina`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Exam Readiness Indicator */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-xl border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1 justify-center sm:justify-start">
            <TrendingUp className="w-4 h-4" />
            <span>ÍNDICE DE PREPARAÇÃO PARA ÉPOCA DE EXAMES ISAG</span>
          </span>
          <h3 className="text-xl font-extrabold">A sua retenção está no bom caminho!</h3>
          <p className="text-xs text-slate-300 max-w-lg">
            Mantenha a rotina diária de repetição espaçada SM-2 por pelo menos 10 minutos para garantir a melhor nota final nas frequências do ISAG.
          </p>
        </div>

        <div className="flex-shrink-0 bg-slate-800/80 p-4 rounded-xl border border-slate-700 text-center">
          <span className="text-3xl font-black text-indigo-300">
            {Math.min(100, Math.round((stats.streakDays * 10) + (stats.lessonsCompleted * 5)))} / 100
          </span>
          <p className="text-[10px] text-slate-400 font-semibold uppercase mt-1">Pontuação de Prontidão</p>
        </div>
      </div>
    </div>
  );
};
