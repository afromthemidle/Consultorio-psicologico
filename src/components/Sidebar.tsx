import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { LayoutDashboard, Users, CalendarDays, Settings, Languages, X } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const { t, language, setLanguage } = useLanguage();

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: t('dashboard') },
    { id: 'patients', icon: Users, label: t('patients') },
    { id: 'sessions', icon: CalendarDays, label: t('sessions') },
    { id: 'settings', icon: Settings, label: t('settings') },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-[#2C2C24]/20 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed md:static inset-y-0 left-0 z-50 w-72 md:w-64 bg-[#FDFBF7] border-r border-[#E8E4DB] flex flex-col pt-8 pb-6 px-4 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex items-center justify-between mb-12 px-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#5A5A40] flex items-center justify-center text-white font-serif font-bold text-lg">
              C
            </div>
            <h1 className="font-serif text-2xl font-semibold text-[#2C2C24] tracking-tight">
              {t('appTitle')}
            </h1>
          </div>
          <button className="md:hidden text-[#7A7A68] hover:bg-[#F4F1E8] p-1.5 rounded-lg transition-colors" onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-[#EAE6DB] text-[#2C2C24] font-medium shadow-sm'
                    : 'text-[#7A7A68] hover:bg-[#F4F1E8] hover:text-[#4A4A3A]'
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[15px]">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-[#E8E4DB]">
          <button
            onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-[#7A7A68] hover:bg-[#F4F1E8] hover:text-[#4A4A3A] transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <Languages size={20} />
              <span className="text-[15px]">{t('language')}</span>
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider bg-[#EAE6DB] px-2 py-1 rounded-md text-[#5A5A40]">
              {language}
            </span>
          </button>
        </div>
      </div>
    </>
  );
};
