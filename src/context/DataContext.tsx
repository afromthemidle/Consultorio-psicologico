import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AnalysisResult } from '../services/aiService';

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
  createdAt: string;
}

export interface Session {
  id: string;
  patientId: string;
  date: string;
  time: string;
  notes: string;
  analysis: AnalysisResult | null;
  createdAt: string;
}

export interface Settings {
  doctorName: string;
  clinicName: string;
}

interface DataContextType {
  patients: Patient[];
  sessions: Session[];
  settings: Settings;
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt'>) => void;
  updatePatient: (id: string, patient: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  addSession: (session: Omit<Session, 'id' | 'createdAt'>) => void;
  updateSettings: (settings: Partial<Settings>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Initial mock data
const initialPatients: Patient[] = [
  { id: '1', name: 'Maria Garcia', email: 'maria@example.com', phone: '555-0101', notes: 'Anxiety and stress', createdAt: new Date().toISOString() },
  { id: '2', name: 'John Smith', email: 'john@example.com', phone: '555-0102', notes: 'Depression', createdAt: new Date().toISOString() },
  { id: '3', name: 'Elena Rodriguez', email: 'elena@example.com', phone: '555-0103', notes: 'Couples therapy', createdAt: new Date().toISOString() },
];

const initialSessions: Session[] = [
  {
    id: '1',
    patientId: '1',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    notes: 'Discussed anxiety triggers at work...',
    analysis: null,
    createdAt: new Date().toISOString()
  }
];

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('psychoassist_patients');
    return saved ? JSON.parse(saved) : initialPatients;
  });

  const [sessions, setSessions] = useState<Session[]>(() => {
    const saved = localStorage.getItem('psychoassist_sessions');
    return saved ? JSON.parse(saved) : initialSessions;
  });

  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('psychoassist_settings');
    return saved ? JSON.parse(saved) : { doctorName: 'Dra. Carolina Cordero', clinicName: 'Clínica Bienestar' };
  });

  useEffect(() => {
    localStorage.setItem('psychoassist_patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('psychoassist_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('psychoassist_settings', JSON.stringify(settings));
  }, [settings]);

  const addPatient = (patientData: Omit<Patient, 'id' | 'createdAt'>) => {
    const newPatient: Patient = {
      ...patientData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setPatients([...patients, newPatient]);
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients(patients.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deletePatient = (id: string) => {
    setPatients(patients.filter(p => p.id !== id));
    // Also delete associated sessions
    setSessions(sessions.filter(s => s.patientId !== id));
  };

  const addSession = (sessionData: Omit<Session, 'id' | 'createdAt'>) => {
    const newSession: Session = {
      ...sessionData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setSessions([newSession, ...sessions]);
  };

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings({ ...settings, ...newSettings });
  };

  return (
    <DataContext.Provider value={{ patients, sessions, settings, addPatient, updatePatient, deletePatient, addSession, updateSettings }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
