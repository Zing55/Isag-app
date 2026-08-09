import React, { useState } from 'react';
import { Subject, Module, Lesson, SubjectLevelState } from '../types';
import { LevelQuizModal } from './LevelQuizModal';
import {
  BookOpen,
  Search,
  Sparkles,
  ChevronRight,
  GraduationCap,
  CheckCircle2,
  Clock,
  Loader2,
  Compass,
  Lock,
  Unlock,
  Trophy,
  Award,
  Zap,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface SyllabusExplorerProps {
  subjects: Subject[];
  onSelectTopicToGenerate: (subject: Subject, moduleTitle: string, topic: string) => void;
  onOpenLesson: (lesson: Lesson) => void;
  existingLessons: Lesson[];
  onSearchAI: (semester: number | null, query: string) => Promise<void>;
  isSearchingAI: boolean;
  subjectLevels: Record<string, SubjectLevelState>;
  onPassLevel: (subjectId: string, completedLevel: number) => void;
  onToggleTopicCompleted?: (subjectId: string, topicTitle: string) => void;
  onUnlockAllLevels?: () => void;
}

export const SyllabusExplorer: React.FC<SyllabusExplorerProps> = ({
  subjects,
  onSelectTopicToGenerate,
  onOpenLesson,
  existingLessons,
  onSearchAI,
  isSearchingAI,
  subjectLevels,
  onPassLevel,
  onToggleTopicCompleted,
  onUnlockAllLevels,
}) => {
  const [selectedSemester, setSelectedSemester] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [aiCustomPrompt, setAiCustomPrompt] = useState('');
  const [activeQuizModal, setActiveQuizModal] = useState<{ subject: Subject; module: Module } | null>(null);
  const [expandedSubjects, setExpandedSubjects] = useState<Record<string, boolean>>({});

  const toggleSubjectExpanded = (id: string) => {
    setExpandedSubjects((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredSubjects = subjects.filter((s) => {
    const matchesSemester = selectedSemester === 'all' || s.semester === selectedSemester;
    const matchesSearch =
      searchQuery === '' ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.modules.some((m) =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.topics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    return matchesSemester && matchesSearch;
  });

  const handleAiSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiCustomPrompt.trim()) return;
    const sem = selectedSemester === 'all' ? null : selectedSemester;
    onSearchAI(sem, aiCustomPrompt);
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-indigo-500/20 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <GraduationCap className="w-4 h-4" />
              <span>ISAG - European Business School • Porto, Portugal</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
              <Unlock className="w-3.5 h-3.5" />
              <span>Nível 1 Desbloqueado Por Definição</span>
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Programa de Estudos CTeSP & Sistema de Níveis
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mt-2">
                Aprenda as aulas de 5 parágrafos do <strong className="text-emerald-300">Nível 1 (sempre disponível)</strong>. Complete as aulas, realize o <strong className="text-amber-300">Quiz do Nível</strong> para desbloquear o nível seguinte e progredir do Nível 1 ao 4!
              </p>
            </div>

            {onUnlockAllLevels && (
              <button
                onClick={onUnlockAllLevels}
                className="flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 rounded-xl font-bold text-xs transition-colors shadow-sm"
                title="Desbloquear todos os níveis imediatamente para navegação livre"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Desbloquear Todos os Níveis</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter and AI Search Section */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Semester Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedSemester('all')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                selectedSemester === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todos os Semestres
            </button>
            {[1, 2, 3, 4].map((sem) => (
              <button
                key={sem}
                onClick={() => setSelectedSemester(sem)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  selectedSemester === sem
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {sem}º Semestre
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Pesquisar disciplina ou tópico..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
            />
          </div>
        </div>

        {/* AI Live Syllabus Search Bar */}
        <form
          onSubmit={handleAiSearchSubmit}
          className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-2"
        >
          <div className="relative flex-1">
            <Compass className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500" />
            <input
              type="text"
              placeholder="Ex: Atualizar programa com o programa oficial de Gestão de Eventos e MICE..."
              value={aiCustomPrompt}
              onChange={(e) => setAiCustomPrompt(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50/50 text-slate-800"
            />
          </div>
          <button
            type="submit"
            disabled={isSearchingAI || !aiCustomPrompt.trim()}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-xs font-medium transition-all shadow-sm"
          >
            {isSearchingAI ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Enriquecendo com IA...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Buscar Programa com IA</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Subjects Grid */}
      <div className="space-y-6">
        {filteredSubjects.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300 p-8 space-y-3">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-slate-600 font-medium text-sm">Nenhuma Unidade Curricular encontrada.</p>
            <p className="text-slate-400 text-xs">Tente mudar o filtro de semestre ou faça uma busca com IA acima.</p>
          </div>
        ) : (
          filteredSubjects.map((subject) => {
            const levelState = subjectLevels[subject.id] || {
              currentUnlockedLevel: 1,
              completedLevelQuizzes: [],
              completedTopicTitles: [],
            };

            const maxLevel = subject.modules.length > 0 ? Math.max(...subject.modules.map((m) => m.level)) : 4;
            const currentLevel = levelState.currentUnlockedLevel || 1;
            const progressPercent = Math.round((currentLevel - 1 + (levelState.completedLevelQuizzes.includes(maxLevel) ? 1 : 0)) * (100 / maxLevel));
            const isFullyMastered = progressPercent >= 100;

            const isExpanded = expandedSubjects[subject.id] ?? true;

            return (
              <div
                key={subject.id}
                className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                  isFullyMastered
                    ? 'border-emerald-300 ring-1 ring-emerald-400/30 shadow-md'
                    : 'border-slate-200 shadow-sm hover:shadow-md'
                }`}
              >
                {/* Subject Card Header */}
                <div className="p-5 sm:p-6 bg-slate-50/90 border-b border-slate-200 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs">
                          {subject.code}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 text-xs font-semibold">
                          {subject.semester}º Semestre
                        </span>
                        <span className="text-xs text-slate-500">{subject.credits} ECTS</span>

                        {isFullyMastered ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold border border-emerald-300">
                            <Trophy className="w-3.5 h-3.5 text-amber-500" />
                            <span>100% Mestria Alcançada</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
                            <Award className="w-3.5 h-3.5 text-indigo-500" />
                            <span>Nível {currentLevel} de {maxLevel} Desbloqueado</span>
                          </span>
                        )}
                      </div>

                      <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">{subject.name}</h2>
                      <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">{subject.description}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Overall Subject Level Progress Meter */}
                      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs space-y-1.5 min-w-[160px]">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-slate-600">Progresso UC</span>
                          <span className={isFullyMastered ? 'text-emerald-600' : 'text-indigo-600'}>
                            {progressPercent}%
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${
                              isFullyMastered ? 'bg-emerald-500' : 'bg-indigo-600'
                            }`}
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => toggleSubjectExpanded(subject.id)}
                        className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
                        title={isExpanded ? 'Recolher Módulos' : 'Expandir Módulos'}
                      >
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Level Modules List */}
                {isExpanded && (
                  <div className="p-5 sm:p-6 space-y-8">
                    {subject.modules.map((module) => {
                      const isUnlocked = module.level <= currentLevel || module.level === 1;
                      const isCompletedLevel = levelState.completedLevelQuizzes.includes(module.level);

                      // Check how many topic lessons are generated for this module
                      const generatedLessonsForModule = module.topics.map((topic) =>
                        existingLessons.find(
                          (l) => l.subjectId === subject.id && l.title.toLowerCase().includes(topic.toLowerCase().slice(0, 15))
                        )
                      );
                      const generatedCount = generatedLessonsForModule.filter(Boolean).length;

                      // Completed topics in this module
                      const completedTopicsCount = module.topics.filter((t) =>
                        (levelState.completedTopicTitles || []).includes(t)
                      ).length;

                      return (
                        <div
                          key={module.id}
                          className={`rounded-xl border transition-all overflow-hidden ${
                            !isUnlocked
                              ? 'border-slate-200 bg-slate-50/50 opacity-75'
                              : isCompletedLevel
                              ? 'border-emerald-200 bg-emerald-50/20'
                              : 'border-indigo-100 bg-white shadow-xs'
                          }`}
                        >
                          {/* Module / Level Header */}
                          <div className={`p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                            !isUnlocked
                              ? 'bg-slate-100/80 border-slate-200'
                              : isCompletedLevel
                              ? 'bg-emerald-100/50 border-emerald-200'
                              : 'bg-indigo-50/60 border-indigo-100'
                          }`}>
                            <div className="flex items-center gap-2.5">
                              {isUnlocked ? (
                                isCompletedLevel ? (
                                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                                    <CheckCircle2 className="w-4 h-4" />
                                  </div>
                                ) : (
                                  <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 font-bold text-xs">
                                    {module.level}
                                  </div>
                                )
                              ) : (
                                <div className="w-7 h-7 rounded-full bg-slate-300 text-slate-600 flex items-center justify-center flex-shrink-0">
                                  <Lock className="w-4 h-4" />
                                </div>
                              )}

                              <div>
                                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                  <span>{module.title}</span>
                                  {module.level === 1 && (
                                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full uppercase">
                                      Nível 1 • Desbloqueado
                                    </span>
                                  )}
                                  {!isUnlocked && module.level > 1 && (
                                    <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full uppercase">
                                      Bloqueado
                                    </span>
                                  )}
                                  {isCompletedLevel && (
                                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full uppercase">
                                      Quiz Validado & Concluído
                                    </span>
                                  )}
                                </h3>
                                <p className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                                  <span>{module.topics.length} Aulas de 5 Parágrafos</span>
                                  <span>•</span>
                                  <span className="font-semibold text-indigo-700">
                                    {completedTopicsCount}/{module.topics.length} Aulas Concluídas
                                  </span>
                                </p>
                              </div>
                            </div>

                            {/* Quiz Checkpoint Button for current unlocked level */}
                            {isUnlocked && (
                              <button
                                onClick={() => setActiveQuizModal({ subject, module })}
                                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                                  isCompletedLevel
                                    ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300'
                                    : 'bg-amber-500 hover:bg-amber-600 text-white shadow-md animate-pulse'
                                }`}
                              >
                                <Trophy className="w-4 h-4 text-amber-100" />
                                <span>{isCompletedLevel ? 'Refazer Quiz de Nível' : `Quiz para Desbloquear Nível ${module.level + 1}`}</span>
                              </button>
                            )}
                          </div>

                          {/* Level Content & Topics Grid */}
                          <div className="p-4 space-y-4">
                            {!isUnlocked ? (
                              <div className="py-6 text-center space-y-2">
                                <Lock className="w-8 h-8 text-slate-300 mx-auto" />
                                <p className="text-xs font-bold text-slate-600">Nível {module.level} Bloqueado</p>
                                <p className="text-[11px] text-slate-400 max-w-md mx-auto">
                                  Conclua as aulas e o Quiz de Validação do <strong className="text-slate-600">Nível {module.level - 1}</strong> para desbloquear os tópicos e aulas deste nível.
                                </p>
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {module.topics.map((topic, topicIdx) => {
                                  const existingLesson = generatedLessonsForModule[topicIdx];
                                  const isTopicCompleted = (levelState.completedTopicTitles || []).includes(topic);

                                  return (
                                    <div
                                      key={topicIdx}
                                      className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between gap-3 group ${
                                        isTopicCompleted
                                          ? 'border-emerald-300 bg-emerald-50/40'
                                          : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-300'
                                      }`}
                                    >
                                      <div className="space-y-1">
                                        <div className="flex items-start justify-between gap-2">
                                          <span className={`text-xs font-semibold leading-snug ${
                                            isTopicCompleted ? 'text-emerald-950 font-bold' : 'text-slate-800 group-hover:text-indigo-900'
                                          }`}>
                                            {topic}
                                          </span>

                                          {/* Toggle completed button */}
                                          {onToggleTopicCompleted && (
                                            <button
                                              onClick={() => onToggleTopicCompleted(subject.id, topic)}
                                              className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 transition-colors ${
                                                isTopicCompleted
                                                  ? 'bg-emerald-600 text-white'
                                                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                                              }`}
                                              title={isTopicCompleted ? 'Desmarcar aula' : 'Marcar aula como concluída'}
                                            >
                                              <CheckCircle2 className="w-3 h-3" />
                                              <span>{isTopicCompleted ? 'Concluída' : 'Marcar Lida'}</span>
                                            </button>
                                          )}
                                        </div>
                                      </div>

                                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                                          <Clock className="w-3 h-3 text-slate-400" />
                                          <span>Aula Didática (5 Parágrafos)</span>
                                        </span>

                                        {existingLesson ? (
                                          <button
                                            onClick={() => onOpenLesson(existingLesson)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg transition-colors"
                                          >
                                            <span>Estudar Aula</span>
                                            <ChevronRight className="w-3.5 h-3.5" />
                                          </button>
                                        ) : (
                                          <button
                                            onClick={() => onSelectTopicToGenerate(subject, module.title, topic)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
                                          >
                                            <Sparkles className="w-3 h-3 text-indigo-200" />
                                            <span>Gerar Aula IA</span>
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Level Quiz Modal */}
      {activeQuizModal && (
        <LevelQuizModal
          subject={activeQuizModal.subject}
          module={activeQuizModal.module}
          onPassLevel={onPassLevel}
          onClose={() => setActiveQuizModal(null)}
        />
      )}
    </div>
  );
};
