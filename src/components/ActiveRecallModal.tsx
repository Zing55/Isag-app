import React, { useState } from 'react';
import { ActiveRecallFeedback } from '../types';
import { evaluateActiveRecallFromAI } from '../services/api';
import {
  MessageSquare,
  X,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Award,
  Send
} from 'lucide-react';

interface ActiveRecallModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonTitle: string;
  lessonContent: string;
  onExplanationSubmitted?: () => void;
}

export const ActiveRecallModal: React.FC<ActiveRecallModalProps> = ({
  isOpen,
  onClose,
  lessonTitle,
  lessonContent,
  onExplanationSubmitted,
}) => {
  const [userExplanation, setUserExplanation] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<ActiveRecallFeedback | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmitExplanation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userExplanation.trim()) return;

    setIsEvaluating(true);
    setError(null);

    try {
      const result = await evaluateActiveRecallFromAI({
        lessonTitle,
        lessonContent,
        userExplanation,
      });
      setFeedback(result);
      if (onExplanationSubmitted) {
        onExplanationSubmitted();
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao avaliar a explicação.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleReset = () => {
    setUserExplanation('');
    setFeedback(null);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 relative my-8 animate-scaleUp">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>TÉCNICA DE EVOCAÇÃO ATIVA (FEYNMAN)</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Explique ao Professor: {lessonTitle}
          </h2>
          <p className="text-xs text-slate-600">
            A melhor forma de testar se realmente aprendeu é explicar a matéria com as suas próprias palavras. O professor assistente de IA analisará a sua resposta.
          </p>
        </div>

        {!feedback ? (
          /* Form Input */
          <form onSubmit={handleSubmitExplanation} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Escreva um resumo explicativo da aula (3 a 6 frases):
              </label>
              <textarea
                rows={5}
                required
                value={userExplanation}
                onChange={(e) => setUserExplanation(e.target.value)}
                placeholder="Ex: Nesta aula aprendemos que o RevPAR mede a rentabilidade do hotel combinando a taxa de ocupação com o ADR... No contexto do Porto, o uso do PMS no Front-Office permite..."
                className="w-full p-3.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 text-slate-800 leading-relaxed"
              />
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={isEvaluating || !userExplanation.trim()}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-xl text-xs shadow-md transition-all"
              >
                {isEvaluating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>O Professor está a avaliar...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submeter para Avaliação</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Feedback Results */
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 text-white shadow-md">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-xs text-indigo-300 font-semibold uppercase tracking-wider">
                  RESULTADO DA AVALIAÇÃO
                </span>
                <h3 className="text-lg font-bold">Nota de Retenção Ativa</h3>
              </div>
              <div className="text-3xl font-black text-amber-400 bg-slate-800 px-4 py-2 rounded-xl border border-slate-700">
                {feedback.score} / 100
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Parecer Pedagógico do Professor</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {feedback.feedback}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Strengths */}
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                <h5 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Pontos Fortes Demonstrados</span>
                </h5>
                <ul className="space-y-1 text-xs text-emerald-950">
                  {feedback.strengths.map((s, idx) => (
                    <li key={idx}>• {s}</li>
                  ))}
                </ul>
              </div>

              {/* Missing Concepts */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
                <h5 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Conceitos Omissos a Reforçar</span>
                </h5>
                <ul className="space-y-1 text-xs text-amber-950">
                  {feedback.missingConcepts.map((m, idx) => (
                    <li key={idx}>• {m}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommendation */}
            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 space-y-1 text-xs text-indigo-950">
              <strong className="font-bold flex items-center gap-1.5 text-indigo-900">
                <Lightbulb className="w-4 h-4 text-indigo-600" />
                Dica para a Próxima Revisão:
              </strong>
              <p>{feedback.recommendation}</p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
              >
                Tentar Outra Vez
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors"
              >
                Concluir
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
