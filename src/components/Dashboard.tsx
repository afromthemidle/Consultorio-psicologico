import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useData } from '../context/DataContext';
import { Clock, User, FileText, ArrowRight } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const { patients, sessions, settings } = useData();

  // Get upcoming sessions (mock logic: just take the most recent ones for today/future)
  const today = new Date().toISOString().split('T')[0];
  const upcomingSessions = sessions
    .filter(s => s.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
    .slice(0, 3)
    .map(s => {
      const patient = patients.find(p => p.id === s.patientId);
      return {
        id: s.id,
        patient: patient ? patient.name : 'Unknown Patient',
        time: s.time,
        type: 'Session'
      };
    });

  // Get recent notes (mock logic: past sessions with notes)
  const recentNotes = sessions
    .filter(s => s.notes.trim().length > 0)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)
    .map(s => {
      const patient = patients.find(p => p.id === s.patientId);
      return {
        id: s.id,
        patient: patient ? patient.name : 'Unknown Patient',
        date: s.date,
        excerpt: s.notes.substring(0, 100) + (s.notes.length > 100 ? '...' : '')
      };
    });

  return (
    <div className="h-full overflow-y-auto bg-slate-50 p-6 md:p-10">
      <header className="mb-8 md:mb-12">
        <h2 className="text-3xl md:text-4xl font-serif text-slate-800 font-medium tracking-tight mb-2">
          {t('welcomeBack')} <span className="italic text-teal-600">{settings.doctorName}</span>
        </h2>
        <p className="text-slate-500 text-base md:text-lg font-light">
          {t('today')} is {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Sessions */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-serif font-semibold text-slate-800">{t('upcomingSessions')}</h3>
            <button className="text-sm font-medium text-teal-600 hover:text-teal-700 flex items-center gap-1 transition-colors">
              {t('viewAll')} <ArrowRight size={16} />
            </button>
          </div>
          
          <div className="space-y-4">
            {upcomingSessions.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 text-center border border-white shadow-xl shadow-slate-200/40 text-slate-500">
                {t('noSessionsYet')}
              </div>
            ) : (
              upcomingSessions.map((session) => (
                <div key={session.id} className="bg-white/80 backdrop-blur-xl rounded-3xl p-5 md:p-6 shadow-xl shadow-slate-200/40 border border-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-2xl hover:shadow-slate-200/60 transition-all cursor-pointer group hover:-translate-y-1">
                  <div className="flex items-center gap-4 md:gap-5">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 shrink-0 shadow-inner">
                      <User size={20} className="md:w-6 md:h-6" />
                    </div>
                    <div>
                      <h4 className="text-base md:text-lg font-medium text-slate-800 group-hover:text-teal-600 transition-colors">{session.patient}</h4>
                      <p className="text-xs md:text-sm text-slate-500 mt-0.5 md:mt-1">{session.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-teal-700 bg-teal-50/50 px-3 py-1.5 md:px-4 md:py-2 rounded-2xl border border-teal-100 self-start sm:self-auto">
                    <Clock size={14} className="md:w-4 md:h-4" />
                    <span className="font-medium text-xs md:text-sm">{session.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Notes */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-serif font-semibold text-slate-800">{t('recentNotes')}</h3>
          </div>
          
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-5 md:p-6 shadow-xl shadow-slate-200/40 border border-white">
            {recentNotes.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                {t('noNotesYet')}
              </div>
            ) : (
              <>
                <div className="space-y-6">
                  {recentNotes.map((note) => (
                    <div key={note.id} className="group cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-slate-800 group-hover:text-teal-600 transition-colors">{note.patient}</h4>
                        <span className="text-[10px] md:text-xs text-slate-400 font-medium uppercase tracking-wider">{note.date}</span>
                      </div>
                      <p className="text-xs md:text-sm text-slate-500 line-clamp-2 leading-relaxed">
                        "{note.excerpt}"
                      </p>
                      <div className="h-px bg-slate-100 mt-6 group-last:hidden"></div>
                    </div>
                  ))}
                </div>
                
                <button className="w-full mt-6 py-2.5 md:py-3 rounded-2xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 hover:text-teal-600 transition-colors flex items-center justify-center gap-2 text-sm md:text-base">
                  <FileText size={18} />
                  {t('viewAll')}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
