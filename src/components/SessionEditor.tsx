import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useData } from '../context/DataContext';
import { analyzeSessionNotes, AnalysisResult } from '../services/aiService';
import { Sparkles, Save, X, AlertTriangle, CheckCircle2, Loader2, FileText, User, Calendar, Clock } from 'lucide-react';

export const SessionEditor: React.FC = () => {
  const { t, language } = useLanguage();
  const { patients, addSession } = useData();
  
  const [patientId, setPatientId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const handleAnalyze = async () => {
    if (!notes.trim()) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const result = await analyzeSessionNotes(notes, language);
      setAnalysis(result);
    } catch (err) {
      setError(t('error'));
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = () => {
    if (!patientId || !date || !time || !notes.trim()) {
      setError('Please fill in all required fields (Patient, Date, Time, Notes)');
      return;
    }

    addSession({
      patientId,
      date,
      time,
      notes,
      analysis
    });

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      // Reset form
      setPatientId('');
      setNotes('');
      setAnalysis(null);
      setTime('');
    }, 2000);
  };

  const handleClear = () => {
    setNotes('');
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className="h-full overflow-hidden bg-slate-50 flex flex-col">
      <header className="px-6 md:px-10 py-6 md:py-8 bg-white/80 backdrop-blur-xl border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 z-10 shadow-sm">
        <div>
          <h2 className="text-2xl md:text-3xl font-serif text-slate-800 font-medium tracking-tight mb-1">
            {t('newSession')}
          </h2>
          <p className="text-slate-500 text-sm">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {isSaved && (
            <span className="text-emerald-600 font-medium text-sm animate-in fade-in mr-2">
              {t('saved')}
            </span>
          )}
          <button 
            onClick={handleClear}
            className="px-4 md:px-5 py-2 md:py-2.5 rounded-2xl border border-slate-200 text-slate-500 font-medium hover:bg-slate-50 transition-colors flex items-center gap-2 text-sm md:text-base"
          >
            <X size={18} />
            <span className="hidden sm:inline">{t('clear')}</span>
          </button>
          <button 
            onClick={handleSave}
            className="px-5 md:px-6 py-2 md:py-2.5 rounded-2xl bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors flex items-center gap-2 shadow-lg shadow-teal-600/30 text-sm md:text-base"
          >
            <Save size={18} />
            {t('save')}
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
        {/* Editor Section */}
        <div className="flex-1 p-4 md:p-10 overflow-y-auto flex flex-col">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-slate-200/40 border border-white flex-1 flex flex-col overflow-hidden min-h-[400px]">
            <div className="p-4 md:p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t('patientName')} *</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select 
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition-all appearance-none text-slate-800 shadow-sm"
                  >
                    <option value="" disabled>{t('selectPatient')}</option>
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="w-full sm:w-auto">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t('date')} *</label>
                <div className="relative">
                  <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition-all text-slate-600 shadow-sm"
                  />
                </div>
              </div>
              <div className="w-full sm:w-auto">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t('time')} *</label>
                <div className="relative">
                  <Clock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="time" 
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition-all text-slate-600 shadow-sm"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex-1 p-4 md:p-6 flex flex-col relative">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t('writeNotesHere')}
                className="flex-1 w-full resize-none outline-none text-slate-800 text-base md:text-lg leading-relaxed placeholder:text-slate-300 font-serif min-h-[200px] bg-transparent"
              />
              
              <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6">
                <button
                  onClick={handleAnalyze}
                  disabled={!notes.trim() || isAnalyzing}
                  className={`px-4 md:px-6 py-2.5 md:py-3 rounded-2xl font-medium flex items-center gap-2 shadow-xl transition-all text-sm md:text-base ${
                    !notes.trim() 
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' 
                      : 'bg-slate-800 text-white hover:bg-slate-900 hover:-translate-y-0.5 shadow-slate-800/20'
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span className="hidden sm:inline">{t('analyzing')}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} className="text-teal-400" />
                      <span className="hidden sm:inline">{t('generateAnalysis')}</span>
                      <span className="sm:hidden">AI</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Section */}
        <div className="w-full lg:w-[450px] bg-white/60 backdrop-blur-xl border-t lg:border-t-0 lg:border-l border-slate-200 overflow-y-auto shrink-0 lg:shrink">
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 shadow-inner">
                <Sparkles size={20} />
              </div>
              <h3 className="text-2xl font-serif font-medium text-slate-800">{t('aiAnalysis')}</h3>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 flex items-start gap-3">
                <AlertTriangle size={20} className="shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {!analysis && !isAnalyzing && !error && (
              <div className="text-center py-10 md:py-20 px-6">
                <div className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <FileText size={24} className="text-slate-300 md:w-8 md:h-8" />
                </div>
                <p className="text-slate-500 text-base md:text-lg font-serif">{t('noNotesYet')}</p>
              </div>
            )}

            {isAnalyzing && (
              <div className="space-y-8 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    <div className="h-6 w-32 bg-slate-200 rounded-md mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-full bg-slate-100 rounded-md"></div>
                      <div className="h-4 w-5/6 bg-slate-100 rounded-md"></div>
                      <div className="h-4 w-4/6 bg-slate-100 rounded-md"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {analysis && !isAnalyzing && (
              <div className="space-y-8 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Summary */}
                <section>
                  <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <FileText size={16} />
                    {t('summary')}
                  </h4>
                  <p className="text-slate-600 leading-relaxed bg-white/80 backdrop-blur-sm p-4 md:p-5 rounded-3xl border border-white shadow-lg shadow-slate-200/30 text-sm md:text-base">
                    {analysis.summary}
                  </p>
                </section>

                {/* Key Themes */}
                <section>
                  <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    {t('keyThemes')}
                  </h4>
                  <ul className="space-y-3">
                    {analysis.keyThemes.map((theme, i) => (
                      <li key={i} className="flex items-start gap-3 bg-white/80 backdrop-blur-sm p-3 md:p-4 rounded-2xl border border-white shadow-md shadow-slate-200/20">
                        <div className="w-6 h-6 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 text-xs font-bold shrink-0 mt-0.5 shadow-inner">
                          {i + 1}
                        </div>
                        <span className="text-slate-600 pt-0.5 text-sm md:text-base">{theme}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Risk Factors */}
                {analysis.riskFactors && analysis.riskFactors.length > 0 && analysis.riskFactors[0] !== 'None identified' && (
                  <section>
                    <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <AlertTriangle size={16} className="text-amber-500" />
                      {t('riskFactors')}
                    </h4>
                    <ul className="space-y-3">
                      {analysis.riskFactors.map((risk, i) => (
                        <li key={i} className="flex items-start gap-3 bg-amber-50/80 backdrop-blur-sm p-3 md:p-4 rounded-2xl border border-amber-100 shadow-md shadow-amber-500/10">
                          <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-2"></div>
                          <span className="text-slate-700 text-sm md:text-base">{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Suggested Questions */}
                <section>
                  <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Sparkles size={16} />
                    {t('suggestedQuestions')}
                  </h4>
                  <div className="bg-slate-800 rounded-3xl p-4 md:p-5 shadow-xl shadow-slate-800/20">
                    <ul className="space-y-4">
                      {analysis.suggestedQuestions.map((q, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0 mt-2.5 opacity-80 shadow-[0_0_8px_rgba(45,212,191,0.6)]"></div>
                          <span className="text-slate-100 leading-relaxed font-serif italic text-base md:text-lg">{q}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
