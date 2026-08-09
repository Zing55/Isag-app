import React, { useState } from 'react';
import { Flashcard } from '../types';
import { calculateSM2, isCardDueToday, formatDaysLabel } from '../utils/sm2';
import confetti from 'canvas-confetti';
import {
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Eye,
  Zap,
  Calendar,
  Layers,
  Award
} from 'lucide-react';

interface SpacedRepetitionViewProps {
  flashcards: Flashcard[];
  onUpdateFlashcards: (updatedCard: Flashcard) => void;
  onIncrementReviewStats: (quality: number) => void;
}

export const SpacedRepetitionView: React.FC<SpacedRepetitionViewProps> = ({
  flashcards,
  onUpdateFlashcards,
  onIncrementReviewStats,
}) => {
  const [filterMode, setFilterMode] = useState<'due' | 'all'>('due');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Filter cards due today
  const dueCards = flashcards.filter((c) => isCardDueToday(c.dueDate));
  const activeDeck = filterMode === 'due' ? dueCards : flashcards;

  const currentCard = activeDeck[currentCardIndex];

  const handleRateCard = (quality: number) => {
    if (!currentCard) return;

    // Calculate new SM-2 values
    const sm2Result = calculateSM2(currentCard, quality);

    const updatedCard: Flashcard = {
      ...currentCard,
      repetition: sm2Result.repetition,
      interval: sm2Result.interval,
      easeFactor: sm2Result.easeFactor,
      dueDate: sm2Result.dueDate,
      lastReviewed: new Date().toISOString(),
    };

    onUpdateFlashcards(updatedCard);
    onIncrementReviewStats(quality);

    // Reset card view state
    setIsFlipped(false);
    setShowHint(false);

    // Check if deck finished
    if (currentCardIndex >= activeDeck.length - 1) {
      // Trigger confetti celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      setCurrentCardIndex(0);
    } else {
      setCurrentCardIndex((prev) => prev + 1);
    }
  };

  if (activeDeck.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 shadow-sm max-w-xl mx-auto space-y-4 my-8">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Nenhum Flashcard Pendente para Hoje!</h2>
        <p className="text-sm text-slate-600">
          Parabéns! Todas as cartas com revisão agendada já foram estudadas hoje. A sua memória a longo prazo está a ser consolidada.
        </p>
        <div className="pt-4 flex items-center justify-center gap-3">
          <button
            onClick={() => setFilterMode('all')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs transition-all shadow-sm"
          >
            Rever Todas as Cartas ({flashcards.length})
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Banner & Stats */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6 rounded-2xl shadow-xl border border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30">
              Algoritmo SM-2 SuperMemo
            </span>
            <span className="text-xs text-slate-300">
              Carta {currentCardIndex + 1} de {activeDeck.length}
            </span>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight mt-1">Repetição Espaçada Ativa</h1>
          <p className="text-xs text-slate-300">
            Aumente a sua capacidade de retenção para exames no ISAG avaliando a facilidade de cada resposta.
          </p>
        </div>

        {/* Filter Toggle Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => {
              setFilterMode('due');
              setCurrentCardIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterMode === 'due' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Para Hoje ({dueCards.length})
          </button>
          <button
            onClick={() => {
              setFilterMode('all');
              setCurrentCardIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterMode === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Todas ({flashcards.length})
          </button>
        </div>
      </div>

      {/* Interactive Flashcard Container */}
      {currentCard && (
        <div className="space-y-4">
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className={`min-h-[280px] sm:min-h-[320px] bg-white rounded-2xl p-6 sm:p-8 border-2 shadow-md cursor-pointer transition-all duration-300 flex flex-col justify-between relative overflow-hidden group ${
              isFlipped ? 'border-indigo-500 bg-indigo-50/10' : 'border-slate-200 hover:border-indigo-300'
            }`}
          >
            {/* Subject Badge */}
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 font-bold">
                {currentCard.subjectName}
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>Intervalo Atual: {currentCard.interval}d</span>
              </span>
            </div>

            {/* Card Content Text */}
            <div className="my-auto py-6 space-y-4 text-center">
              {!isFlipped ? (
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">PERGUNTA / CONCEITO</span>
                  <p className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                    {currentCard.front}
                  </p>
                  <p className="text-xs text-indigo-600 font-medium pt-2 animate-pulse">
                    (Clique ou pressione para revelar a resposta)
                  </p>
                </div>
              ) : (
                <div className="space-y-3 animate-fadeIn">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">RESPOSTA & EXPLICAÇÃO</span>
                  <p className="text-base sm:text-lg font-medium text-slate-800 leading-relaxed">
                    {currentCard.back}
                  </p>
                  {currentCard.hint && showHint && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 text-left">
                      <strong>💡 Dica de Memorização:</strong> {currentCard.hint}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Card Footer Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-500">
              {currentCard.hint && !isFlipped && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowHint(!showHint);
                  }}
                  className="text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{showHint ? 'Ocultar Dica' : 'Ver Dica'}</span>
                </button>
              )}

              <span className="ml-auto flex items-center gap-1 text-slate-400">
                <Eye className="w-3.5 h-3.5" />
                <span>Clique para virar</span>
              </span>
            </div>
          </div>

          {/* SM-2 Rating Controls (Revealed after flip) */}
          {isFlipped ? (
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
              <p className="text-xs font-bold text-center text-slate-600 uppercase tracking-wider">
                Como avalia a facilidade de recordação desta carta?
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => handleRateCard(0)}
                  className="p-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 flex flex-col items-center text-center transition-all"
                >
                  <span className="font-bold text-xs">🔴 Errei (0)</span>
                  <span className="text-[10px] text-rose-600 mt-0.5">Rever amanhã (1d)</span>
                </button>

                <button
                  onClick={() => handleRateCard(3)}
                  className="p-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 flex flex-col items-center text-center transition-all"
                >
                  <span className="font-bold text-xs">🟡 Difícil (3)</span>
                  <span className="text-[10px] text-amber-600 mt-0.5">Intervalo curto</span>
                </button>

                <button
                  onClick={() => handleRateCard(4)}
                  className="p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 flex flex-col items-center text-center transition-all"
                >
                  <span className="font-bold text-xs">🟢 Bom (4)</span>
                  <span className="text-[10px] text-emerald-600 mt-0.5">Intervalo normal</span>
                </button>

                <button
                  onClick={() => handleRateCard(5)}
                  className="p-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 flex flex-col items-center text-center transition-all"
                >
                  <span className="font-bold text-xs">🔵 Fácil (5)</span>
                  <span className="text-[10px] text-sky-600 mt-0.5">Intervalo longo</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-2">
              <p className="text-xs text-slate-500">
                Pense na resposta antes de virar a carta para garantir evocação ativa real.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
