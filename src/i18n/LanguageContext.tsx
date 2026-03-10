import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'es';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    appTitle: 'PsychoAssist',
    dashboard: 'Dashboard',
    patients: 'Patients',
    sessions: 'Sessions',
    settings: 'Settings',
    upcomingSessions: 'Upcoming Sessions',
    recentNotes: 'Recent Notes',
    newSession: 'New Session',
    analyzeNotes: 'Analyze Notes',
    keyThemes: 'Key Themes',
    suggestedQuestions: 'Suggested Questions',
    summary: 'Summary',
    riskFactors: 'Risk Factors',
    patientName: 'Patient Name',
    date: 'Date',
    time: 'Time',
    notes: 'Session Notes',
    writeNotesHere: 'Write your session notes here...',
    analyzing: 'Analyzing...',
    noNotesYet: 'No notes yet. Start typing to analyze.',
    language: 'Language',
    welcomeBack: 'Welcome back,',
    today: 'Today',
    tomorrow: 'Tomorrow',
    viewAll: 'View All',
    save: 'Save',
    cancel: 'Cancel',
    saved: 'Saved successfully',
    error: 'An error occurred',
    aiAnalysis: 'AI Analysis',
    generateAnalysis: 'Generate AI Analysis',
    clear: 'Clear',
    // New keys for Patients
    addPatient: 'Add Patient',
    editPatient: 'Edit Patient',
    deletePatient: 'Delete Patient',
    searchPatients: 'Search patients...',
    noPatients: 'No patients found. Add a new patient to get started.',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    additionalNotes: 'Additional Notes',
    confirmDelete: 'Are you sure you want to delete this patient? All their sessions will also be deleted.',
    // New keys for Settings
    doctorProfile: 'Doctor Profile',
    doctorName: 'Doctor Name',
    clinicName: 'Clinic Name',
    preferences: 'Preferences',
    selectPatient: 'Select a patient',
    noSessionsYet: 'No sessions recorded yet.',
  },
  es: {
    appTitle: 'PsicoAsiste',
    dashboard: 'Panel',
    patients: 'Pacientes',
    sessions: 'Sesiones',
    settings: 'Ajustes',
    upcomingSessions: 'Próximas Sesiones',
    recentNotes: 'Notas Recientes',
    newSession: 'Nueva Sesión',
    analyzeNotes: 'Analizar Notas',
    keyThemes: 'Temas Clave',
    suggestedQuestions: 'Preguntas Sugeridas',
    summary: 'Resumen',
    riskFactors: 'Factores de Riesgo',
    patientName: 'Nombre del Paciente',
    date: 'Fecha',
    time: 'Hora',
    notes: 'Notas de la Sesión',
    writeNotesHere: 'Escribe las notas de tu sesión aquí...',
    analyzing: 'Analizando...',
    noNotesYet: 'Aún no hay notas. Empieza a escribir para analizar.',
    language: 'Idioma',
    welcomeBack: 'Bienvenido de nuevo,',
    today: 'Hoy',
    tomorrow: 'Mañana',
    viewAll: 'Ver Todo',
    save: 'Guardar',
    cancel: 'Cancelar',
    saved: 'Guardado con éxito',
    error: 'Ocurrió un error',
    aiAnalysis: 'Análisis de IA',
    generateAnalysis: 'Generar Análisis de IA',
    clear: 'Limpiar',
    // New keys for Patients
    addPatient: 'Añadir Paciente',
    editPatient: 'Editar Paciente',
    deletePatient: 'Eliminar Paciente',
    searchPatients: 'Buscar pacientes...',
    noPatients: 'No se encontraron pacientes. Añade un nuevo paciente para empezar.',
    name: 'Nombre',
    email: 'Correo Electrónico',
    phone: 'Teléfono',
    additionalNotes: 'Notas Adicionales',
    confirmDelete: '¿Estás seguro de que deseas eliminar este paciente? Todas sus sesiones también serán eliminadas.',
    // New keys for Settings
    doctorProfile: 'Perfil del Doctor',
    doctorName: 'Nombre del Doctor',
    clinicName: 'Nombre de la Clínica',
    preferences: 'Preferencias',
    selectPatient: 'Selecciona un paciente',
    noSessionsYet: 'Aún no hay sesiones registradas.',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('es');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
