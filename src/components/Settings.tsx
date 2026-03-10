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
    <div className="h-full overflow-y-auto bg-[#F5F5F0] p-6 md:p-10">
      <header className="mb-8 md:mb-12">
        <h2 className="text-3xl md:text-4xl font-serif text-[#2C2C24] font-medium tracking-tight mb-2 flex items-center gap-3">
          <SettingsIcon size={32} className="text-[#5A5A40]" />
          {t('settings')}
        </h2>
        <p className="text-[#7A7A68] text-base md:text-lg font-light">
          {t('preferences')}
        </p>
      </header>

      <div className="max-w-2xl">
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#E8E4DB]">
          <h3 className="text-xl font-serif font-semibold text-[#2C2C24] mb-6 border-b border-[#E8E4DB] pb-4">
            {t('doctorProfile')}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-[#9A9A88] uppercase tracking-wider mb-2 flex items-center gap-2">
                <User size={16} />
                {t('doctorName')}
              </label>
              <input 
                type="text" 
                required
                value={formData.doctorName}
                onChange={(e) => setFormData({...formData, doctorName: e.target.value})}
                className="w-full px-4 py-3 bg-[#FDFBF7] border border-[#EAE6DB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 focus:border-[#5A5A40] transition-all text-[#2C2C24] font-medium"
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-[#9A9A88] uppercase tracking-wider mb-2 flex items-center gap-2">
                <Building2 size={16} />
                {t('clinicName')}
              </label>
              <input 
                type="text" 
                required
                value={formData.clinicName}
                onChange={(e) => setFormData({...formData, clinicName: e.target.value})}
                className="w-full px-4 py-3 bg-[#FDFBF7] border border-[#EAE6DB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 focus:border-[#5A5A40] transition-all text-[#2C2C24] font-medium"
              />
            </div>

            <div className="pt-6 border-t border-[#E8E4DB] flex items-center justify-between">
              {isSaved ? (
                <div className="flex items-center gap-2 text-emerald-600 font-medium animate-in fade-in duration-300">
                  <CheckCircle2 size={20} />
                  <span>{t('saved')}</span>
                </div>
              ) : (
                <div></div>
              )}
              
              <button 
                type="submit"
                className="px-6 py-3 rounded-full bg-[#5A5A40] text-white font-medium hover:bg-[#4A4A3A] transition-colors flex items-center gap-2 shadow-md shadow-[#5A5A40]/20"
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
