import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Subject, Module, QuizQuestion } from '../types';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Lock,
  Unlock,
  ChevronRight,
  ArrowRight,
  Sparkles,
  X,
  RotateCcw
} from 'lucide-react';

interface LevelQuizModalProps {
  subject: Subject;
  module: Module; // The module representing the current level being evaluated
  onPassLevel: (subjectId: string, completedLevel: number) => void;
  onClose: () => void;
}

export const LevelQuizModal: React.FC<LevelQuizModalProps> = ({
  subject,
  module,
  onPassLevel,
  onClose,
}) => {
  // Use module quiz questions or generate fallback questions based on topics if empty
  const defaultQuestions: QuizQuestion[] = (module.quizQuestions && module.quizQuestions.length > 0)
    ? module.quizQuestions
    : [
        {
          id: `q-${module.id}-1`,
          question: `Em relação a "${module.topics[0] || module.title}", qual é o princípio técnico essencial estudado no programa do ISAG?`,
          options: [
            'Aplicação rigorosa dos conceitos operacionais, enquadramento regulatório e gestão estratégica do setor.',
            'Dispensa de planeamento financeiro e de recursos humanos.',
            'Eliminação total de auditoria e controlo de qualidade.',
            'Substituição de processos técnicos por estimativas informais.'
          ],
          correctOptionIndex: 0,
          explanation: 'O programa académico do ISAG exige uma abordagem técnica estruturada com foco na gestão estratégica e normas operacionais.'
        },
        {
          id: `q-${module.id}-2`,
          question: `Qual das seguintes opções reflete a importância de "${module.topics[1] || 'deste nível'}" na gestão do setor em Portugal?`,
          options: [
            'Garantir elevado padrão de qualidade de serviço, otimização de recursos e sustentabilidade do destino.',
            'Reduzir a segurança dos clientes para diminuir custos operacionais.',
            'Ignorar o impacto ambiental e sociocultural nas comunidades locais.',
            'Limitar a comunicação interna nas empresas turísticas.'
          ],
          correctOptionIndex: 0,
          explanation: 'A otimização de recursos aliada à qualidade e sustentabilidade é o pilar do desenvolvimento do setor em Portugal.'
        }
      ];

  const [questions] = useState<QuizQuestion[]>(defaultQuestions);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [passed, setPassed] = useState<boolean | null>(null);
  const [scorePercent, setScorePercent] = useState<number>(0);

  const handleSelectOption = (questionIdx: number, optionIdx: number) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIdx]: optionIdx,
    }));
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctOptionIndex) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / questions.length) * 100);
    setScorePercent(score);
    const isPassing = score >= 70;
    setPassed(isPassing);
    setSubmitted(true);

    if (isPassing) {
      // Trigger level pass callback
      onPassLevel(subject.id, module.level);

      // Trigger Confetti Celebration
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setPassed(null);
    setScorePercent(0);
  };

  const allAnswered = Object.keys(selectedAnswers).length === questions.length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in duration-200 my-8">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 border border-indigo-400/40 text-indigo-300 font-bold text-xs">
              {subject.code} • {subject.name}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            <span>Quiz de Validação de Nível {module.level}</span>
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Responda corretamente para comprovar a aprendizagem das aulas de 5 parágrafos e desbloquear o <strong className="text-indigo-200">Nível {module.level + 1}</strong>!
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {!submitted ? (
            <div className="space-y-6">
              {questions.map((q, qIdx) => {
                const selectedOption = selectedAnswers[qIdx];

                return (
                  <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {qIdx + 1}
                      </span>
                      <h3 className="text-sm font-semibold text-slate-900 leading-snug">
                        {q.question}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-2 pl-9">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = selectedOption === optIdx;

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectOption(qIdx, optIdx)}
                            className={`w-full text-left p-3 rounded-lg text-xs transition-all border flex items-center justify-between ${
                              isSelected
                                ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-medium ring-2 ring-indigo-500/20'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                            }`}
                          >
                            <span>{opt}</span>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ml-2 ${
                              isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                            }`}>
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  {Object.keys(selectedAnswers).length} de {questions.length} respondidas
                </span>

                <button
                  onClick={handleSubmitQuiz}
                  disabled={!allAnswered}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Submeter e Validar Nível</span>
                </button>
              </div>
            </div>
          ) : (
            /* Results Screen */
            <div className="space-y-6 text-center py-4">
              {passed ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 border-4 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                    <Trophy className="w-8 h-8 text-amber-500" />
                  </div>

                  <div className="space-y-1">
                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                      Pontuação: {scorePercent}% • Aprovado!
                    </span>
                    <h3 className="text-2xl font-extrabold text-slate-900">
                      🎉 Nível {module.level} Concluído com Sucesso!
                    </h3>
                    <p className="text-slate-600 text-sm max-w-md mx-auto">
                      Parabéns! Desbloqueou o <strong className="text-indigo-600">Nível {module.level + 1}</strong> de {subject.name}. O seu progresso na unidade curricular subiu para {Math.min(100, module.level * 25)}%.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-full bg-rose-100 border-4 border-rose-400 text-rose-600 flex items-center justify-center mx-auto">
                    <XCircle className="w-8 h-8" />
                  </div>

                  <div className="space-y-1">
                    <span className="inline-block px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold uppercase tracking-wider">
                      Pontuação: {scorePercent}% (Mínimo: 70%)
                    </span>
                    <h3 className="text-xl font-bold text-slate-900">
                      Ainda Não Atingiu a Pontuação de Desbloqueio
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto">
                      Precisa de pelo menos 70% de respostas corretas. Reveja os conceitos das aulas de 5 parágrafos do Nível {module.level} e tente novamente.
                    </p>
                  </div>
                </div>
              )}

              {/* Explanations Review */}
              <div className="text-left space-y-3 pt-4 border-t border-slate-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Revisão do Quiz e Explicações:
                </h4>

                {questions.map((q, idx) => {
                  const userAns = selectedAnswers[idx];
                  const isCorrect = userAns === q.correctOptionIndex;

                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                        isCorrect ? 'bg-emerald-50/60 border-emerald-200' : 'bg-rose-50/60 border-rose-200'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold text-slate-800">
                        <span>
                          {idx + 1}. {q.question}
                        </span>
                        {isCorrect ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Correto
                          </span>
                        ) : (
                          <span className="text-rose-700 font-bold flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" /> Incorreto
                          </span>
                        )}
                      </div>

                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        <strong className="text-slate-800">Explicação:</strong> {q.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Footer Actions */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-center gap-3">
                {passed ? (
                  <button
                    onClick={onClose}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                  >
                    <span>Continuar para o Nível {module.level + 1}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleRetry}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Tentar Novamente</span>
                    </button>
                    <button
                      onClick={onClose}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                    >
                      Voltar às Aulas
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
