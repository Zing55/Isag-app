import React, { useState, useEffect } from 'react';
import { Lesson, Subject, SubjectLevelState } from '../types';
import {
  Volume2,
  Pause,
  Sparkles,
  BookOpen,
  RotateCcw,
  HelpCircle,
  MessageSquare,
  CheckCircle2,
  Highlighter,
  Layers,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Award,
  Unlock,
  Lock,
  Zap,
  Play
} from 'lucide-react';

interface LessonViewProps {
  lesson: Lesson | null;
  allSubjects: Subject[];
  subjectLevels: Record<string, SubjectLevelState>;
  existingLessons: Lesson[];
  lessonProgressMap: Record<string, { hasPassedQuiz?: boolean; hasExplainedToProfessor?: boolean }>;
  isGeneratingLesson?: boolean;
  onSelectLesson: (lesson: Lesson) => void;
  onSelectTopicToGenerate: (subject: Subject, moduleTitle: string, topic: string) => void;
  onBackToSyllabus: () => void;
  onOpenFlashcards: () => void;
  onOpenSummary: () => void;
  onOpenQuiz: () => void;
  onOpenActiveRecallModal: () => void;
  onMarkLessonCompleted: (lessonId: string) => void;
}

export const LessonView: React.FC<LessonViewProps> = ({
  lesson,
  allSubjects,
  subjectLevels,
  existingLessons,
  lessonProgressMap,
  isGeneratingLesson,
  onSelectLesson,
  onSelectTopicToGenerate,
  onBackToSyllabus,
  onOpenFlashcards,
  onOpenSummary,
  onOpenQuiz,
  onOpenActiveRecallModal,
  onMarkLessonCompleted,
}) => {
  const [highlightKeyTerms, setHighlightKeyTerms] = useState(true);
  const [readParagraphs, setReadParagraphs] = useState<Record<number, boolean>>({});
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  // Lesson Selector state
  const [isSelectorOpen, setIsSelectorOpen] = useState<boolean>(!lesson);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    lesson ? lesson.subjectId : (allSubjects[0]?.id || '')
  );
  const [selectedModuleIdx, setSelectedModuleIdx] = useState<number>(0);

  useEffect(() => {
    // Reset reading progress when lesson changes
    setReadParagraphs({});
    stopAudio();
    if (lesson) {
      setSelectedSubjectId(lesson.subjectId);
    }
  }, [lesson?.id]);

  const selectedSubject = allSubjects.find((s) => s.id === selectedSubjectId) || allSubjects[0];
  const levelState = selectedSubject ? (subjectLevels[selectedSubject.id] || { currentUnlockedLevel: 1, completedLevelQuizzes: [], completedTopicTitles: [] }) : { currentUnlockedLevel: 1, completedLevelQuizzes: [], completedTopicTitles: [] };
  const currentUnlockedLevel = levelState.currentUnlockedLevel || 1;

  const currentModule = selectedSubject?.modules[selectedModuleIdx] || selectedSubject?.modules[0];

  const progress = lesson ? lessonProgressMap[lesson.id] : undefined;
  const hasPassedQuiz = progress?.hasPassedQuiz || false;
  const hasExplainedToProfessor = progress?.hasExplainedToProfessor || false;
  const isFullyCompleted = hasPassedQuiz && hasExplainedToProfessor;

  const toggleParagraphRead = (num: number) => {
    setReadParagraphs((prev) => ({ ...prev, [num]: !prev[num] }));
  };

  const completedParagraphsCount = Object.values(readParagraphs).filter(Boolean).length;
  const progressPercent = Math.round((completedParagraphsCount / 5) * 100);

  // Audio Text-To-Speech Narration
  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      stopAudio();
    } else if (lesson) {
      speakLesson();
    }
  };

  const speakLesson = () => {
    if (!lesson || !('speechSynthesis' in window)) {
      alert('O seu navegador não suporta narração por voz.');
      return;
    }

    window.speechSynthesis.cancel();

    const fullText = lesson.paragraphs
      .map((p) => `${p.title}. ${p.content}`)
      .join(' ... ');

    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.lang = 'pt-PT';
    utterance.rate = playbackSpeed;

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
  };

  const renderContentWithHighlights = (content: string, terms: string[]) => {
    if (!highlightKeyTerms || !terms || terms.length === 0) {
      return content;
    }

    const escapedTerms = terms
      .map((t) => t.trim())
      .filter((t) => t.length > 2)
      .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

    if (escapedTerms.length === 0) return content;

    const regex = new RegExp(`(${escapedTerms.join('|')})`, 'gi');
    const parts = content.split(regex);

    return parts.map((part, i) => {
      const isMatch = terms.some((t) => t.toLowerCase() === part.toLowerCase());
      if (isMatch) {
        return (
          <mark
            key={i}
            className="bg-amber-200/90 text-amber-950 font-semibold px-1 rounded mx-0.5 border-b border-amber-400"
          >
            {part}
          </mark>
        );
      }
      return part;
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Universal Lesson Picker Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div
          onClick={() => setIsSelectorOpen(!isSelectorOpen)}
          className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white cursor-pointer flex items-center justify-between gap-4 select-none"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                <span>Selecionar Qualquer Aula de Qualquer Unidade Curricular</span>
                <span className="text-[10px] uppercase tracking-wider font-extrabold bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full">
                  Navegação Livre
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                {lesson ? `Aula Atual: ${lesson.subjectName} • ${lesson.title}` : 'Escolha a Unidade Curricular, Nível e Tópico para estudar'}
              </p>
            </div>
          </div>

          <button className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors">
            {isSelectorOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        {isSelectorOpen && selectedSubject && (
          <div className="p-5 sm:p-6 space-y-6 bg-slate-50/50 border-t border-slate-100">
            {/* 1. Subject Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                1. Escolha a Unidade Curricular (UC):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {allSubjects.map((subj) => {
                  const sState = subjectLevels[subj.id] || { currentUnlockedLevel: 1, completedLevelQuizzes: [], completedTopicTitles: [] };
                  const isSelected = subj.id === selectedSubjectId;

                  return (
                    <button
                      key={subj.id}
                      onClick={() => {
                        setSelectedSubjectId(subj.id);
                        setSelectedModuleIdx(0);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-200 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                          {subj.code}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          Nível {sState.currentUnlockedLevel}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                        {subj.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Module / Level Selector */}
            {selectedSubject && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                  2. Escolha o Nível / Módulo:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  {selectedSubject.modules.map((mod, modIdx) => {
                    const isUnlocked = mod.level <= currentUnlockedLevel || mod.level === 1;
                    const isSelected = modIdx === selectedModuleIdx;

                    return (
                      <button
                        key={mod.id}
                        disabled={!isUnlocked}
                        onClick={() => setSelectedModuleIdx(modIdx)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          !isUnlocked
                            ? 'opacity-50 bg-slate-100 border-slate-200 cursor-not-allowed'
                            : isSelected
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-200'
                            : 'bg-white border-slate-200 hover:border-emerald-300'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[10px] font-extrabold uppercase text-slate-500">
                            Nível {mod.level}
                          </span>
                          {isUnlocked ? (
                            <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Lock className="w-3.5 h-3.5 text-slate-400" />
                          )}
                        </div>
                        <p className="text-xs font-semibold leading-tight text-slate-900 line-clamp-2">
                          {mod.title}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. Topic Selector / Lessons List */}
            {currentModule && (
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                  3. Selecione a Aula para Estudar:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentModule.topics.map((topic, topicIdx) => {
                    // Check existing lesson in array
                    const existing = existingLessons.find(
                      (l) => l.subjectId === selectedSubject.id && (l.title === topic || l.title.includes(topic))
                    );
                    const isTopicDone = (levelState.completedTopicTitles || []).includes(topic);
                    const isCurrentActive = lesson && (lesson.title === topic || existing?.id === lesson.id);

                    return (
                      <div
                        key={topicIdx}
                        className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                          isCurrentActive
                            ? 'border-indigo-500 bg-indigo-50/70 shadow-sm'
                            : isTopicDone
                            ? 'border-emerald-300 bg-emerald-50/30'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-bold text-slate-900 leading-snug">
                              {topic}
                            </span>
                            {isTopicDone && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full flex-shrink-0">
                                ✓ Concluída
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500">
                            {existing ? 'Aula de 5 parágrafos disponível' : 'Aula pronta para ser gerada via IA'}
                          </p>
                        </div>

                        {existing ? (
                          <button
                            onClick={() => {
                              onSelectLesson(existing);
                              setIsSelectorOpen(false);
                            }}
                            className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
                          >
                            <Play className="w-3.5 h-3.5" />
                            <span>{isCurrentActive ? 'A Estudar Agora' : 'Abrir Aula'}</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              onSelectTopicToGenerate(selectedSubject, currentModule.title, topic);
                              setIsSelectorOpen(false);
                            }}
                            disabled={isGeneratingLesson}
                            className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                            <span>Gerar & Estudar Aula com IA</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {!lesson ? (
        /* Empty state when no lesson active */
        <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 shadow-sm max-w-xl mx-auto space-y-4 my-6">
          <BookOpen className="w-12 h-12 text-indigo-600 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Escolha uma Aula no Painel Acima</h2>
          <p className="text-sm text-slate-600">
            Selecione a Unidade Curricular, Nível e Tópico do seu interesse para abrir ou gerar uma aula didática em 5 parágrafos.
          </p>
        </div>
      ) : (
        /* Active Lesson View */
        <>
          {/* Top Header / Breadcrumb */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="space-y-1">
              <button
                onClick={onBackToSyllabus}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors mb-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar ao Programa Curricular</span>
              </button>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs">
                  {lesson.subjectName}
                </span>
                <span className="text-xs text-slate-500">• {lesson.moduleTitle}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {lesson.title}
              </h1>
            </div>

            {/* Action Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setHighlightKeyTerms(!highlightKeyTerms)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  highlightKeyTerms
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                title="Destacar Termos Técnicos do Turismo"
              >
                <Highlighter className="w-3.5 h-3.5" />
                <span>{highlightKeyTerms ? 'Grifos Ativos' : 'Grifar Termos'}</span>
              </button>

              <button
                onClick={handleToggleAudio}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all ${
                  isPlayingAudio
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {isPlayingAudio ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pausar Voz</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Ouvir Aula</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Paragraph Reading Tracker Progress */}
          <div className="bg-slate-900 text-white p-4 rounded-xl shadow-md space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>Leitura dos Parágrafos: {completedParagraphsCount} de 5</span>
              </span>
              <span className="text-indigo-300 font-bold">{progressPercent}%</span>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-sky-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* The 5 Paragraphs Container */}
          <div className="space-y-6">
            {lesson.paragraphs.map((para) => {
              const isDone = !!readParagraphs[para.number];

              return (
                <div
                  key={para.number}
                  className={`bg-white rounded-2xl p-6 shadow-sm border transition-all ${
                    isDone
                      ? 'border-emerald-300 bg-emerald-50/20'
                      : 'border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  {/* Paragraph Header */}
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center ${
                          isDone
                            ? 'bg-emerald-600 text-white'
                            : 'bg-indigo-600 text-white shadow-sm'
                        }`}
                      >
                        {para.number}
                      </span>
                      <h3 className="text-base font-bold text-slate-900">{para.title}</h3>
                    </div>

                    <button
                      onClick={() => toggleParagraphRead(para.number)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                        isDone
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <CheckCircle2 className={`w-3.5 h-3.5 ${isDone ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <span>{isDone ? 'Lido' : 'Marcar Lido'}</span>
                    </button>
                  </div>

                  {/* Paragraph Content */}
                  <p className="text-slate-800 text-sm sm:text-base leading-relaxed tracking-normal font-normal">
                    {renderContentWithHighlights(para.content, para.keyTerms)}
                  </p>

                  {/* Key terms tags */}
                  {para.keyTerms && para.keyTerms.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-semibold text-slate-400">Palavras-chave:</span>
                      {para.keyTerms.map((term, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200"
                        >
                          {term}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Validação e Requisitos de Conclusão da Aula (REQUISITO DA TAREFA) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold text-xs mb-1">
                  <Award className="w-3.5 h-3.5 text-indigo-600" />
                  <span>SISTEMA DE AVALIAÇÃO DE FIM DE AULA</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Requisitos para Marcar esta Aula como Concluída
                </h3>
              </div>

              {isFullyCompleted ? (
                <span className="px-3.5 py-1.5 bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold text-xs rounded-full flex items-center gap-1.5 self-start sm:self-auto">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Aula Oficialmente Concluída! 🎉</span>
                </span>
              ) : (
                <span className="px-3 py-1 bg-amber-100 text-amber-800 border border-amber-300 font-bold text-xs rounded-full self-start sm:self-auto">
                  Pendente ({(hasPassedQuiz ? 1 : 0) + (hasExplainedToProfessor ? 1 : 0)}/2 Requisitos)
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Para registar esta aula como concluída com sucesso no seu histórico escolar do CTeSP, é necessário cumprir <strong>ambos os critérios</strong>:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Requisito 1: Quiz da Aula */}
              <div className={`p-4 rounded-xl border flex flex-col justify-between gap-3 ${
                hasPassedQuiz ? 'bg-emerald-50/70 border-emerald-300' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full font-bold text-xs flex items-center justify-center ${
                        hasPassedQuiz ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
                      }`}>
                        1
                      </span>
                      <span className="font-bold text-xs text-slate-900">Quiz de Fim de Aula</span>
                    </div>
                    <p className="text-xs text-slate-600 pl-7">
                      Realizar o teste interativo de perguntas de escolha múltipla para testar os 5 parágrafos.
                    </p>
                  </div>
                  {hasPassedQuiz ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <HelpCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  )}
                </div>

                <button
                  onClick={onOpenQuiz}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    hasPassedQuiz
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                  }`}
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>{hasPassedQuiz ? 'Refazer Quiz da Aula (✓ Concluído)' : '1. Realizar Quiz de Fim de Aula'}</span>
                </button>
              </div>

              {/* Requisito 2: Explicação ao Professor */}
              <div className={`p-4 rounded-xl border flex flex-col justify-between gap-3 ${
                hasExplainedToProfessor ? 'bg-emerald-50/70 border-emerald-300' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full font-bold text-xs flex items-center justify-center ${
                        hasExplainedToProfessor ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
                      }`}>
                        2
                      </span>
                      <span className="font-bold text-xs text-slate-900">Explicar ao Professor IA</span>
                    </div>
                    <p className="text-xs text-slate-600 pl-7">
                      Submeter um resumo explicativo com as suas próprias palavras para a avaliação pedagógica do professor.
                    </p>
                  </div>
                  {hasExplainedToProfessor ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <MessageSquare className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  )}
                </div>

                <button
                  onClick={onOpenActiveRecallModal}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    hasExplainedToProfessor
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{hasExplainedToProfessor ? 'Refazer Explicação (✓ Concluído)' : '2. Explicar ao Professor IA'}</span>
                </button>
              </div>
            </div>

            {!isFullyCompleted && (
              <p className="text-xs text-amber-900 bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-center font-medium leading-relaxed">
                💡 A aula ficará oficialmente marcada como <strong>Concluída</strong> e creditada no seu progresso escolar assim que concluir o <strong>Quiz</strong> e submeter a sua <strong>Explicação ao Professor</strong>.
              </p>
            )}
          </div>

          {/* Bottom Retention Action Bar */}
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-xl border border-indigo-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>Fixação & Ferramentas Complementares</span>
                </h3>
                <p className="text-xs text-slate-300">
                  Ferramentas pedagógicas do ISAG para consolidar a matéria desta aula:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                onClick={onOpenFlashcards}
                className="flex items-center justify-center gap-2 p-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all group"
              >
                <RotateCcw className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                <span>Repetição Espaçada</span>
              </button>

              <button
                onClick={onOpenSummary}
                className="flex items-center justify-center gap-2 p-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl border border-slate-700 transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Resumo Inteligente</span>
              </button>

              <button
                onClick={onOpenQuiz}
                className="flex items-center justify-center gap-2 p-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl border border-slate-700 transition-all"
              >
                <HelpCircle className="w-4 h-4 text-sky-400" />
                <span>Quiz da Aula</span>
              </button>

              <button
                onClick={onOpenActiveRecallModal}
                className="flex items-center justify-center gap-2 p-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Explique ao Professor</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
