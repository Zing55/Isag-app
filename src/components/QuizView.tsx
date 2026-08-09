import React, { useState } from 'react';
import { Quiz, QuizQuestion } from '../types';
import confetti from 'canvas-confetti';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Award
} from 'lucide-react';

interface QuizViewProps {
  quiz: Quiz | null;
  onFinishQuiz: (scorePercent: number) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ quiz, onFinishQuiz }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 shadow-sm max-w-xl mx-auto space-y-4 my-8">
        <HelpCircle className="w-12 h-12 text-sky-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Nenhum Quiz Disponível</h2>
        <p className="text-sm text-slate-600">
          Gere ou selecione uma aula de 5 parágrafos para realizar testes de avaliação interativos com correção explicada em tempo real.
        </p>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);

    if (selectedOption === currentQuestion.correctOptionIndex) {
      setCorrectAnswersCount((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex >= quiz.questions.length - 1) {
      setQuizCompleted(true);
      const finalScore = Math.round(((correctAnswersCount + (selectedOption === currentQuestion.correctOptionIndex ? 1 : 0)) / quiz.questions.length) * 100);
      onFinishQuiz(finalScore);

      if (finalScore >= 70) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      }
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setCorrectAnswersCount(0);
    setQuizCompleted(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Quiz Header */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6 rounded-2xl shadow-xl border border-indigo-500/20 flex items-center justify-between">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-bold text-xs border border-sky-500/30">
            TESTE DE FIXAÇÃO DE CONHECIMENTOS
          </span>
          <h1 className="text-xl font-extrabold tracking-tight mt-1">{quiz.lessonTitle}</h1>
        </div>
        {!quizCompleted && (
          <span className="text-xs font-bold px-3 py-1 bg-slate-800 text-slate-300 rounded-full border border-slate-700">
            {currentQuestionIndex + 1} / {quiz.questions.length}
          </span>
        )}
      </div>

      {!quizCompleted ? (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          {/* Question Text */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
              PERGUNTA DE AVALIAÇÃO
            </span>
            <p className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {currentQuestion.question}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQuestion.correctOptionIndex;

              let optionStyle = 'bg-slate-50 border-slate-200 text-slate-800 hover:border-indigo-300';

              if (isAnswerSubmitted) {
                if (isCorrect) {
                  optionStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold';
                } else if (isSelected) {
                  optionStyle = 'bg-rose-50 border-rose-400 text-rose-950 font-medium';
                } else {
                  optionStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                }
              } else if (isSelected) {
                optionStyle = 'bg-indigo-50 border-indigo-500 text-indigo-950 font-bold ring-2 ring-indigo-200';
              }

              return (
                <div
                  key={idx}
                  onClick={() => !isAnswerSubmitted && setSelectedOption(idx)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${optionStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full font-bold text-xs flex items-center justify-center border border-current opacity-80">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-xs sm:text-sm">{option}</span>
                  </div>

                  {isAnswerSubmitted && (
                    <>
                      {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />}
                      {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />}
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Explanation Box */}
          {isAnswerSubmitted && (
            <div className="p-4 bg-indigo-50/80 border border-indigo-200 rounded-xl space-y-1.5 animate-fadeIn">
              <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Explicação Pedagógica:</span>
              </span>
              <p className="text-xs text-indigo-950 leading-relaxed font-normal">
                {currentQuestion.explanation}
              </p>
            </div>
          )}

          {/* Submit / Next Button */}
          <div className="pt-2 flex justify-end">
            {!isAnswerSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-xl text-xs shadow-sm transition-all"
              >
                Confirmar Resposta
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs shadow-sm transition-all"
              >
                <span>{currentQuestionIndex < quiz.questions.length - 1 ? 'Próxima Pergunta' : 'Ver Resultado'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Summary Screen */
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Award className="w-8 h-8 text-indigo-600" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900">Quiz Concluído!</h2>
            <p className="text-slate-600 text-sm">
              Acertou em <strong>{correctAnswersCount}</strong> de <strong>{quiz.questions.length}</strong> perguntas.
            </p>
          </div>

          <div className="text-4xl font-extrabold text-indigo-600 bg-indigo-50 py-4 rounded-xl border border-indigo-100 max-w-xs mx-auto">
            {Math.round((correctAnswersCount / quiz.questions.length) * 100)}%
          </div>

          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {Math.round((correctAnswersCount / quiz.questions.length) * 100) >= 70
              ? 'Excelente desempenho! Os conceitos estão bem fixados para as avaliações no ISAG.'
              : 'Recomendamos reeler a aula de 5 parágrafos e praticar os flashcards para reforçar a memorização.'}
          </p>

          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={handleRestartQuiz}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs shadow-sm transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Repetir Quiz</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
