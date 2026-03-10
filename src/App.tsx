/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LanguageProvider } from './i18n/LanguageContext';
import { DataProvider } from './context/DataContext';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { SessionEditor } from './components/SessionEditor';
import { Patients } from './components/Patients';
import { Settings } from './components/Settings';
import { Menu } from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#F5F5F0] font-sans text-[#2C2C24] overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setIsSidebarOpen(false);
        }} 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden w-full">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between bg-white border-b border-[#E8E4DB] p-4 shrink-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#5A5A40] flex items-center justify-center text-white font-serif font-bold text-lg">
              C
            </div>
            <h1 className="font-serif text-xl font-semibold text-[#2C2C24] tracking-tight">
              PsychoAssist
            </h1>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-[#5A5A40] hover:bg-[#F4F1E8] rounded-lg transition-colors">
            <Menu size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-hidden relative">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'sessions' && <SessionEditor />}
          {activeTab === 'patients' && <Patients />}
          {activeTab === 'settings' && <Settings />}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </LanguageProvider>
  );
}
