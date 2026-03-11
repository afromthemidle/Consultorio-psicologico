import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useData } from '../context/DataContext';
import { Settings as SettingsIcon, User, Building2, Save, CheckCircle2 } from 'lucide-react';

export const Settings: React.FC = () => {
  const { t } = useLanguage();
  const { settings, updateSettings } = useData();
  
  const [formData, setFormData] = useState({
    doctorName: settings.doctorName,
    clinicName: settings.clinicName
  });
  
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setFormData({
      doctorName: settings.doctorName,
      clinicName: settings.clinicName
    });
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-50 p-6 md:p-10">
      <header className="mb-8 md:mb-12">
        <h2 className="text-3xl md:text-4xl font-serif text-slate-800 font-medium tracking-tight mb-2 flex items-center gap-3">
          <SettingsIcon size={32} className="text-teal-600" />
          {t('settings')}
        </h2>
        <p className="text-slate-500 text-base md:text-lg font-light">
          {t('preferences')}
        </p>
      </header>

      <div className="max-w-2xl">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/40 border border-white">
          <h3 className="text-xl font-serif font-semibold text-slate-800 mb-6 border-b border-slate-100 pb-4">
            {t('doctorProfile')}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <User size={16} />
                {t('doctorName')}
              </label>
              <input 
                type="text" 
                required
                value={formData.doctorName}
                onChange={(e) => setFormData({...formData, doctorName: e.target.value})}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition-all text-slate-800 font-medium shadow-sm"
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Building2 size={16} />
                {t('clinicName')}
              </label>
              <input 
                type="text" 
                required
                value={formData.clinicName}
                onChange={(e) => setFormData({...formData, clinicName: e.target.value})}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition-all text-slate-800 font-medium shadow-sm"
              />
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              {isSaved ? (
                <div className="flex items-center gap-2 text-teal-600 font-medium animate-in fade-in duration-300">
                  <CheckCircle2 size={20} />
                  <span>{t('saved')}</span>
                </div>
              ) : (
                <div></div>
              )}
              
              <button 
                type="submit"
                className="px-6 py-3 rounded-2xl bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors flex items-center gap-2 shadow-lg shadow-teal-600/30"
              >
                <Save size={18} />
                {t('save')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
