import React, { useState, useEffect } from 'react';
import { SmartSummary, Lesson } from '../types';
import {
  Sparkles,
  BookOpen,
  CheckSquare,
  Network,
  FileText,
  Printer,
  Copy,
  Check,
  Search,
  Building,
  Download,
  Maximize2,
  Minimize2,
  Sun,
  Moon,
  Play,
  Pause,
  RotateCcw,
  Type,
  Clock,
  X,
  FileDown
} from 'lucide-react';

interface SmartSummaryViewProps {
  summary: SmartSummary | null;
  lessonTitle: string;
  currentLesson?: Lesson | null;
}

export const SmartSummaryView: React.FC<SmartSummaryViewProps> = ({
  summary,
  lessonTitle,
  currentLesson
}) => {
  const [activeTab, setActiveTab] = useState<'takeaways' | 'map' | 'glossary' | 'checklist'>('takeaways');
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  // Focus Mode States
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [focusTheme, setFocusTheme] = useState<'dark' | 'sepia' | 'light'>('dark');
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [focusSeconds, setFocusSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Esc key listener for exiting focus mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFocusMode) {
        setIsFocusMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocusMode]);

  // Focus Mode Stopwatch Timer
  useEffect(() => {
    let interval: any = null;
    if (isFocusMode && isTimerRunning) {
      interval = setInterval(() => {
        setFocusSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isFocusMode, isTimerRunning]);

  if (!summary) {
    return (
      <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 shadow-sm max-w-xl mx-auto space-y-4 my-8">
        <Sparkles className="w-12 h-12 text-indigo-500 mx-auto animate-pulse" />
        <h2 className="text-xl font-bold text-slate-900">Nenhum Resumo Gerado</h2>
        <p className="text-sm text-slate-600">
          Abra uma aula de 5 parágrafos e clique em <strong>"Resumo Inteligente"</strong> para gerar sínteses automáticas, glossário técnico e checklist de exame.
        </p>
      </div>
    );
  }

  const toggleChecklist = (idx: number) => {
    setCheckedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleCopyMarkdown = () => {
    const markdown = `
# Resumo Inteligente: ${summary.lessonTitle} (ISAG Gestão de Turismo)

## Pontos Vitais de Memorização
${summary.keyTakeaways.map((k) => `- ${k}`).join('\n')}

## Aplicação Prática no Turismo em Portugal
${summary.practicalApplication}

## Glossário Técnico
${summary.technicalGlossary.map((g) => `- **${g.term}**: ${g.definition}`).join('\n')}

## Checklist para Exames
${summary.examChecklist.map((c) => `[ ] ${c}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Export full lesson & summary as formatted text file
  const handleDownloadTextFile = () => {
    const dateStr = new Date().toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    let fileContent = `========================================================================
INSTITUTO SUPERIOR DE ADMINISTRAÇÃO E GESTÃO (ISAG)
LICENCIATURA EM GESTÃO DE TURISMO - ARQUIVO DE ESTUDO OFFLINE
========================================================================

TÍTULO DA AULA: ${summary.lessonTitle}
DISCIPLINA: ${currentLesson?.subjectName || 'Gestão de Turismo'}
MÓDULO: ${currentLesson?.moduleTitle || 'Módulo Curricular'}
DATA DE EXPORTAÇÃO: ${dateStr}

========================================================================
1. PONTOS VITAIS PARA RETENÇÃO RÁPIDA (KEY TAKEAWAYS)
========================================================================
${summary.keyTakeaways.map((point, i) => `${i + 1}. ${point}`).join('\n\n')}

========================================================================
2. APLICAÇÃO PRÁTICA NO SETOR TURÍSTICO EM PORTUGAL
========================================================================
${summary.practicalApplication}

`;

    if (currentLesson && currentLesson.paragraphs && currentLesson.paragraphs.length > 0) {
      fileContent += `========================================================================
3. CONTEÚDO INTEGRAL DA AULA (5 PARÁGRAFOS ESTRUTURADOS)
========================================================================
${currentLesson.paragraphs
  .map(
    (p) => `[PARÁGRAFO ${p.number}] ${p.title}
${p.content}
Palavras-chave: ${p.keyTerms && p.keyTerms.length > 0 ? p.keyTerms.join(', ') : 'N/A'}
`
  )
  .join('\n------------------------------------------------------------------------\n')}

`;
    }

    fileContent += `========================================================================
4. GLOSSÁRIO TÉCNICO ESPECIALIZADO (${summary.technicalGlossary.length} TERMOS)
========================================================================
${summary.technicalGlossary.map((item) => `• ${item.term.toUpperCase()}: ${item.definition}`).join('\n\n')}

========================================================================
5. CHECKLIST DE AUTO-AVALIAÇÃO PARA EXAMES DO ISAG
========================================================================
${summary.examChecklist.map((item) => `[ ] ${item}`).join('\n')}

========================================================================
Fim do Documento - Gerado pelo ISAG Tutor AI (Gestão de Turismo)
========================================================================`;

    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const sanitizedTitle = (summary.lessonTitle || 'Aula')
      .replace(/[^a-zA-Z0-9à-úÀ-Ú_\-]/g, '_')
      .substring(0, 40);
    link.href = url;
    link.download = `ISAG_Resumo_${sanitizedTitle}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  const handleStartFocusMode = () => {
    setIsFocusMode(true);
    setIsTimerRunning(true);
  };

  const formatFocusTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredGlossary = summary.technicalGlossary.filter(
    (item) =>
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Theme styles for Focus Mode
  const getFocusThemeClasses = () => {
    switch (focusTheme) {
      case 'sepia':
        return 'bg-[#fbf0d9] text-[#433422] border-[#e8d7b8]';
      case 'light':
        return 'bg-slate-50 text-slate-900 border-slate-200';
      case 'dark':
      default:
        return 'bg-slate-950 text-slate-100 border-slate-800';
    }
  };

  const getFocusCardClasses = () => {
    switch (focusTheme) {
      case 'sepia':
        return 'bg-[#f3e4c8] border-[#dfcb9f] text-[#332515]';
      case 'light':
        return 'bg-white border-slate-200 text-slate-800 shadow-xs';
      case 'dark':
      default:
        return 'bg-slate-900/90 border-slate-800 text-slate-200';
    }
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'sm':
        return 'text-sm leading-relaxed';
      case 'lg':
        return 'text-lg leading-relaxed';
      case 'xl':
        return 'text-xl leading-relaxed';
      case 'base':
      default:
        return 'text-base leading-relaxed';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 print:max-w-none print:m-0">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:shadow-none print:border-none">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs">
              SÍNTESE EXECUTIVA ISAG
            </span>
            <span className="text-xs text-slate-500">Gestão de Turismo</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Resumo Inteligente: {summary.lessonTitle}
          </h1>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap print:hidden">
          <button
            onClick={handleStartFocusMode}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-xl font-semibold text-xs transition-colors shadow-sm"
            title="Entrar em leitura sem distrações"
          >
            <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Modo de Foco</span>
          </button>

          <button
            onClick={handleDownloadTextFile}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl font-semibold text-xs transition-colors"
            title="Baixar resumo e 5 parágrafos em arquivo de texto (.txt)"
          >
            {downloaded ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <FileDown className="w-3.5 h-3.5 text-emerald-600" />
            )}
            <span>{downloaded ? 'Descarregado!' : 'Exportar (.txt)'}</span>
          </button>

          <button
            onClick={handleCopyMarkdown}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiado!' : 'Copiar Texto'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs transition-colors shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir / PDF</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto print:hidden">
        <button
          onClick={() => setActiveTab('takeaways')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'takeaways'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Pontos Vitais & Prática</span>
        </button>

        <button
          onClick={() => setActiveTab('map')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'map'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Network className="w-4 h-4" />
          <span>Mapa de Conceitos</span>
        </button>

        <button
          onClick={() => setActiveTab('glossary')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'glossary'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Glossário Técnico ({summary.technicalGlossary.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('checklist')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'checklist'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Checklist de Exame</span>
        </button>
      </div>

      {/* Content Panels */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        {/* Tab 1: Takeaways & Practical Application */}
        {activeTab === 'takeaways' && (
          <div className="space-y-6">
            <div className="space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Pontos-Chave para Retenção Rápida</span>
              </h2>
              <ul className="space-y-2.5">
                {summary.keyTakeaways.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-amber-50/80 border border-amber-200 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-2">
                <Building className="w-4 h-4 text-amber-700" />
                <span>Aplicação Prática no Setor Turístico em Portugal</span>
              </h3>
              <p className="text-xs sm:text-sm text-amber-950 leading-relaxed font-medium">
                {summary.practicalApplication}
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Concept Map */}
        {activeTab === 'map' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-2">
              <Network className="w-4 h-4" />
              <span>Conexões & Teia Conceitual</span>
            </h2>
            <p className="text-xs text-slate-500">
              Visualização sintética das relações lógicas entre conceitos da disciplina:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {summary.conceptNodes && summary.conceptNodes.length > 0 ? (
                summary.conceptNodes.map((node, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                    <div className="flex-1 bg-white p-2.5 rounded-lg border border-slate-200 text-center font-bold text-xs text-indigo-900 shadow-2xs">
                      {node.concept}
                    </div>

                    <div className="flex flex-col items-center flex-shrink-0 text-[10px] text-slate-500 font-semibold px-1">
                      <span className="text-indigo-600 uppercase tracking-tighter">{node.relation}</span>
                      <span className="text-lg leading-none font-bold text-slate-400">➔</span>
                    </div>

                    <div className="flex-1 bg-indigo-50 p-2.5 rounded-lg border border-indigo-200 text-center font-bold text-xs text-indigo-950 shadow-2xs">
                      {node.target}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-8 text-xs text-slate-400">
                  Nenhum nó conceitual disponível para este resumo.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Glossary */}
        {activeTab === 'glossary' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>Glossário Técnico do Turismo</span>
              </h2>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Pesquisar termo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {filteredGlossary.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 hover:border-indigo-300 transition-colors">
                  <span className="font-bold text-xs text-indigo-900 bg-indigo-100/80 px-2 py-0.5 rounded inline-block">
                    {item.term}
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed font-normal pt-1">
                    {item.definition}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Exam Checklist */}
        {activeTab === 'checklist' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-2">
              <CheckSquare className="w-4 h-4" />
              <span>Checklist de Auto-Avaliação para Exames</span>
            </h2>
            <p className="text-xs text-slate-500">
              Verifique se domina estes tópicos antes de realizar testes no ISAG:
            </p>

            <div className="space-y-2 pt-2">
              {summary.examChecklist.map((item, idx) => {
                const isChecked = !!checkedItems[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleChecklist(idx)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                      isChecked
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-medium'
                        : 'bg-slate-50 border-slate-200 hover:border-indigo-300 text-slate-800'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                    />
                    <span className="text-xs sm:text-sm font-medium">{item}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* FULL-SCREEN FOCUS MODE OVERLAY */}
      {isFocusMode && (
        <div className={`fixed inset-0 z-50 overflow-y-auto flex flex-col transition-colors duration-300 ${getFocusThemeClasses()}`}>
          {/* Top Focus Bar */}
          <div className="sticky top-0 z-10 backdrop-blur-md bg-opacity-90 border-b p-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                MODO DE FOCO
              </span>
              <h2 className="text-sm sm:text-base font-bold truncate max-w-xs sm:max-w-md">
                {summary.lessonTitle}
              </h2>
            </div>

            {/* Middle Controls: Stopwatch, Theme, Font size */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Focus Timer */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/20 border border-current/20 text-xs font-mono font-bold">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{formatFocusTime(focusSeconds)}</span>
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="hover:opacity-80 transition-opacity ml-1"
                  title={isTimerRunning ? 'Pausar cronómetro' : 'Iniciar cronómetro'}
                >
                  {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
                <button
                  onClick={() => setFocusSeconds(0)}
                  className="hover:opacity-80 transition-opacity"
                  title="Reiniciar cronómetro"
                >
                  <RotateCcw className="w-3 h-3 text-slate-400" />
                </button>
              </div>

              {/* Theme Switcher */}
              <div className="flex items-center gap-1 bg-black/20 p-1 rounded-xl border border-current/20">
                <button
                  onClick={() => setFocusTheme('dark')}
                  className={`p-1.5 rounded-lg text-xs transition-all ${
                    focusTheme === 'dark' ? 'bg-amber-400 text-slate-950 font-bold' : 'opacity-60 hover:opacity-100'
                  }`}
                  title="Tema Escuro Zen"
                >
                  <Moon className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setFocusTheme('sepia')}
                  className={`p-1.5 rounded-lg text-xs transition-all ${
                    focusTheme === 'sepia' ? 'bg-[#433422] text-[#fbf0d9] font-bold' : 'opacity-60 hover:opacity-100'
                  }`}
                  title="Tema Sépia Clássico"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setFocusTheme('light')}
                  className={`p-1.5 rounded-lg text-xs transition-all ${
                    focusTheme === 'light' ? 'bg-indigo-600 text-white font-bold' : 'opacity-60 hover:opacity-100'
                  }`}
                  title="Tema Claro Leitura"
                >
                  <Sun className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Font Size Selector */}
              <div className="flex items-center gap-1 bg-black/20 p-1 rounded-xl border border-current/20">
                {(['sm', 'base', 'lg', 'xl'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setFontSize(s)}
                    className={`px-2 py-1 rounded-lg text-xs font-bold transition-all uppercase ${
                      fontSize === s ? 'bg-amber-400 text-slate-950' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Download in Focus Mode */}
              <button
                onClick={handleDownloadTextFile}
                className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                title="Descarregar documento de estudo em .txt"
              >
                <FileDown className="w-4 h-4" />
                <span className="hidden sm:inline">Baixar .txt</span>
              </button>

              {/* Close Focus Mode */}
              <button
                onClick={() => setIsFocusMode(false)}
                className="p-2 bg-rose-600/90 hover:bg-rose-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                title="Sair do Modo de Foco (ESC)"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">Sair (ESC)</span>
              </button>
            </div>
          </div>

          {/* Main Reading Container */}
          <div className="flex-1 max-w-3xl w-full mx-auto px-6 py-12 space-y-12">
            {/* Header Title inside reader */}
            <div className="text-center space-y-3 pb-6 border-b border-current/15">
              <span className="text-xs tracking-widest uppercase font-bold opacity-70">
                {currentLesson?.subjectName || 'ISAG Gestão de Turismo'} • {currentLesson?.moduleTitle || 'Sintese de Estudo'}
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                {summary.lessonTitle}
              </h1>
              <p className="text-xs opacity-75">
                Leitura em ambiente focado sem distrações visuais
              </p>
            </div>

            {/* 5-Paragraph Lesson Content (If Available) */}
            {currentLesson && currentLesson.paragraphs && (
              <div className="space-y-8">
                <h3 className="text-xs font-bold uppercase tracking-widest text-amber-500 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>Conteúdo Integral da Aula (5 Parágrafos)</span>
                </h3>

                <div className="space-y-6">
                  {currentLesson.paragraphs.map((para) => (
                    <div
                      key={para.number}
                      className={`p-6 rounded-2xl border transition-all ${getFocusCardClasses()}`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center justify-center">
                          {para.number}
                        </span>
                        <h4 className="font-bold text-base">{para.title}</h4>
                      </div>

                      <p className={`${getFontSizeClass()} font-normal opacity-95`}>
                        {para.content}
                      </p>

                      {para.keyTerms && para.keyTerms.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-current/10 flex items-center gap-1.5 flex-wrap">
                          <span className="text-[11px] font-semibold opacity-60">Termos:</span>
                          {para.keyTerms.map((t, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 font-medium"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Takeaways Section */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-amber-500 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Pontos Vitais de Memorização</span>
              </h3>

              <div className="space-y-3">
                {summary.keyTakeaways.map((point, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border flex items-start gap-3 ${getFocusCardClasses()}`}
                  >
                    <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className={`${getFontSizeClass()} font-medium`}>{point}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Practical Application */}
            <div className={`p-6 rounded-2xl border space-y-3 ${getFocusCardClasses()}`}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-amber-500 flex items-center gap-2">
                <Building className="w-4 h-4" />
                <span>Aplicação Prática no Turismo em Portugal</span>
              </h3>
              <p className={`${getFontSizeClass()} leading-relaxed`}>
                {summary.practicalApplication}
              </p>
            </div>

            {/* Technical Glossary */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-amber-500 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>Glossário Técnico ({summary.technicalGlossary.length} Termos)</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {summary.technicalGlossary.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border space-y-1.5 ${getFocusCardClasses()}`}
                  >
                    <span className="font-bold text-xs px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 inline-block">
                      {item.term}
                    </span>
                    <p className="text-xs opacity-90 leading-relaxed">{item.definition}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Exam Checklist */}
            <div className="space-y-6 pb-12">
              <h3 className="text-xs font-bold uppercase tracking-widest text-amber-500 flex items-center gap-2">
                <CheckSquare className="w-4 h-4" />
                <span>Checklist de Exame</span>
              </h3>

              <div className="space-y-2">
                {summary.examChecklist.map((item, idx) => {
                  const isChecked = !!checkedItems[idx];
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleChecklist(idx)}
                      className={`p-4 rounded-xl border cursor-pointer flex items-center gap-3 transition-all ${
                        isChecked
                          ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                          : getFocusCardClasses()
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
                      />
                      <span className={`${getFontSizeClass()} font-medium`}>{item}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
