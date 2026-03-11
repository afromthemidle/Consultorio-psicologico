import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useData, Patient } from '../context/DataContext';
import { Search, Plus, Edit2, Trash2, User, Mail, Phone, FileText, X } from 'lucide-react';

export const Patients: React.FC = () => {
  const { t } = useLanguage();
  const { patients, addPatient, updatePatient, deletePatient } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (patient?: Patient) => {
    if (patient) {
      setEditingPatient(patient);
      setFormData({
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        notes: patient.notes
      });
    } else {
      setEditingPatient(null);
      setFormData({ name: '', email: '', phone: '', notes: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPatient(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPatient) {
      updatePatient(editingPatient.id, formData);
    } else {
      addPatient(formData);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t('confirmDelete'))) {
      deletePatient(id);
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-50 p-6 md:p-10 relative">
      <header className="mb-8 md:mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-serif text-slate-800 font-medium tracking-tight mb-2">
            {t('patients')}
          </h2>
          <p className="text-slate-500 text-base md:text-lg font-light">
            {patients.length} {t('patients').toLowerCase()}
          </p>
        </div>
        
        <button 
          onClick={() => handleOpenModal()}
          className="px-5 py-2.5 rounded-2xl bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-teal-600/30 self-start sm:self-auto"
        >
          <Plus size={18} />
          {t('addPatient')}
        </button>
      </header>

      <div className="mb-8">
        <div className="relative max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder={t('searchPatients')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition-all shadow-lg shadow-slate-200/40 text-slate-800"
          />
        </div>
      </div>

      {filteredPatients.length === 0 ? (
        <div className="text-center py-20 px-6 bg-white/80 backdrop-blur-xl rounded-3xl border border-white shadow-xl shadow-slate-200/40">
          <div className="w-20 h-20 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <User size={32} className="text-slate-300" />
          </div>
          <p className="text-slate-500 text-lg font-serif">{t('noPatients')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPatients.map(patient => (
            <div key={patient.id} className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl shadow-slate-200/40 border border-white hover:shadow-2xl hover:shadow-slate-200/60 transition-all group relative hover:-translate-y-1">
              <div className="absolute top-6 right-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleOpenModal(patient)} className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-full transition-colors">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(patient.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6 pr-20">
                <div className="w-14 h-14 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 shrink-0 shadow-inner">
                  <span className="font-serif font-bold text-xl">{patient.name.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-slate-800 truncate">{patient.name}</h3>
                  <p className="text-sm text-slate-400">
                    Added {new Date(patient.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-500 text-sm">
                  <Mail size={16} className="text-slate-400" />
                  <span className="truncate">{patient.email || '-'}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500 text-sm">
                  <Phone size={16} className="text-slate-400" />
                  <span>{patient.phone || '-'}</span>
                </div>
                {patient.notes && (
                  <div className="flex items-start gap-3 text-slate-500 text-sm mt-4 pt-4 border-t border-slate-100">
                    <FileText size={16} className="text-slate-400 shrink-0 mt-0.5" />
                    <p className="line-clamp-2">{patient.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={handleCloseModal}></div>
          <div className="relative bg-white/90 backdrop-blur-2xl rounded-3xl w-full max-w-lg shadow-2xl border border-white overflow-hidden flex flex-col max-h-full">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-2xl font-serif font-medium text-slate-800">
                {editingPatient ? t('editPatient') : t('addPatient')}
              </h3>
              <button onClick={handleCloseModal} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="patient-form" onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t('name')} *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition-all shadow-sm text-slate-800"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t('email')}</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition-all shadow-sm text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t('phone')}</label>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition-all shadow-sm text-slate-800"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t('additionalNotes')}</label>
                  <textarea 
                    rows={4}
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition-all resize-none shadow-sm text-slate-800"
                  ></textarea>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
              <button 
                type="button"
                onClick={handleCloseModal}
                className="px-5 py-2.5 rounded-2xl border border-slate-200 text-slate-500 font-medium hover:bg-white transition-colors"
              >
                {t('cancel')}
              </button>
              <button 
                type="submit"
                form="patient-form"
                className="px-6 py-2.5 rounded-2xl bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/30"
              >
                {t('save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
