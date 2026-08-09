import React from 'react';
import {
  BookOpen,
  BrainCircuit,
  Layers,
  Sparkles,
  BarChart2,
  HelpCircle,
  GraduationCap,
  RotateCcw
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'syllabus' | 'lesson' | 'sm2' | 'summary' | 'quiz' | 'stats';
  setActiveTab: (tab: 'syllabus' | 'lesson' | 'sm2' | 'summary' | 'quiz' | 'stats') => void;
  dueCardsCount: number;
  streakDays: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  dueCardsCount,
  streakDays,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Title */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab('syllabus')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-100 tracking-tight">StudyISAG</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Gestão de Turismo
                </span>
              </div>
              <p className="text-xs text-slate-400">ISAG Porto • CTeSP 5 Parágrafos + SM-2</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => setActiveTab('syllabus')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'syllabus'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Programa</span>
            </button>

            <button
              onClick={() => setActiveTab('lesson')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'lesson'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Aula (5 Parágrafos)</span>
            </button>

            <button
              onClick={() => setActiveTab('sm2')}
              className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'sm2'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              <span>Repetição Espaçada</span>
              {dueCardsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs font-bold bg-amber-500 text-slate-950 rounded-full animate-pulse">
                  {dueCardsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('summary')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'summary'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Resumo Inteligente</span>
            </button>

            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'quiz'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Quiz & Evocação</span>
            </button>

            <button
              onClick={() => setActiveTab('stats')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'stats'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              <span>Desempenho</span>
            </button>
          </nav>

          {/* User Streak Badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
              <span className="text-base">🔥</span>
              <span>{streakDays} {streakDays === 1 ? 'dia' : 'dias'} de estudo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Submenu Bar */}
      <div className="md:hidden flex overflow-x-auto gap-1 p-2 bg-slate-950 border-t border-slate-800 text-xs scrollbar-none">
        <button
          onClick={() => setActiveTab('syllabus')}
          className={`flex-shrink-0 px-3 py-1.5 rounded-md font-medium ${
            activeTab === 'syllabus' ? 'bg-indigo-600 text-white' : 'text-slate-400'
          }`}
        >
          Programa
        </button>
        <button
          onClick={() => setActiveTab('lesson')}
          className={`flex-shrink-0 px-3 py-1.5 rounded-md font-medium ${
            activeTab === 'lesson' ? 'bg-indigo-600 text-white' : 'text-slate-400'
          }`}
        >
          Aula (5P)
        </button>
        <button
          onClick={() => setActiveTab('sm2')}
          className={`flex-shrink-0 px-3 py-1.5 rounded-md font-medium flex items-center gap-1 ${
            activeTab === 'sm2' ? 'bg-indigo-600 text-white' : 'text-slate-400'
          }`}
        >
          <span>Repetição Espaçada</span>
          {dueCardsCount > 0 && (
            <span className="px-1.5 bg-amber-500 text-slate-950 rounded-full font-bold text-[10px]">
              {dueCardsCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('summary')}
          className={`flex-shrink-0 px-3 py-1.5 rounded-md font-medium ${
            activeTab === 'summary' ? 'bg-indigo-600 text-white' : 'text-slate-400'
          }`}
        >
          Resumo
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex-shrink-0 px-3 py-1.5 rounded-md font-medium ${
            activeTab === 'quiz' ? 'bg-indigo-600 text-white' : 'text-slate-400'
          }`}
        >
          Quiz
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex-shrink-0 px-3 py-1.5 rounded-md font-medium ${
            activeTab === 'stats' ? 'bg-indigo-600 text-white' : 'text-slate-400'
          }`}
        >
          Desempenho
        </button>
      </div>
    </header>
  );
};
