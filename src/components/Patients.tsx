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
    <div className="h-full overflow-y-auto bg-[#F5F5F0] p-6 md:p-10 relative">
      <header className="mb-8 md:mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-serif text-[#2C2C24] font-medium tracking-tight mb-2">
            {t('patients')}
          </h2>
          <p className="text-[#7A7A68] text-base md:text-lg font-light">
            {patients.length} {t('patients').toLowerCase()}
          </p>
        </div>
        
        <button 
          onClick={() => handleOpenModal()}
          className="px-5 py-2.5 rounded-full bg-[#5A5A40] text-white font-medium hover:bg-[#4A4A3A] transition-colors flex items-center justify-center gap-2 shadow-md shadow-[#5A5A40]/20 self-start sm:self-auto"
        >
          <Plus size={18} />
          {t('addPatient')}
        </button>
      </header>

      <div className="mb-8">
        <div className="relative max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9A9A88]" />
          <input 
            type="text" 
            placeholder={t('searchPatients')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-[#EAE6DB] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 focus:border-[#5A5A40] transition-all shadow-sm"
          />
        </div>
      </div>

      {filteredPatients.length === 0 ? (
        <div className="text-center py-20 px-6 bg-white rounded-3xl border border-[#E8E4DB] shadow-sm">
          <div className="w-20 h-20 mx-auto bg-[#F4F1E8] rounded-full flex items-center justify-center mb-6">
            <User size={32} className="text-[#C4C4B8]" />
          </div>
          <p className="text-[#7A7A68] text-lg font-serif">{t('noPatients')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPatients.map(patient => (
            <div key={patient.id} className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8E4DB] hover:shadow-md transition-shadow group relative">
              <div className="absolute top-6 right-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleOpenModal(patient)} className="p-2 text-[#7A7A68] hover:text-[#5A5A40] hover:bg-[#F4F1E8] rounded-full transition-colors">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(patient.id)} className="p-2 text-[#7A7A68] hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6 pr-20">
                <div className="w-14 h-14 rounded-full bg-[#F4F1E8] flex items-center justify-center text-[#5A5A40] shrink-0">
                  <span className="font-serif font-bold text-xl">{patient.name.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-[#2C2C24] truncate">{patient.name}</h3>
                  <p className="text-sm text-[#9A9A88]">
                    Added {new Date(patient.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-[#7A7A68] text-sm">
                  <Mail size={16} className="text-[#9A9A88]" />
                  <span className="truncate">{patient.email || '-'}</span>
                </div>
                <div className="flex items-center gap-3 text-[#7A7A68] text-sm">
                  <Phone size={16} className="text-[#9A9A88]" />
                  <span>{patient.phone || '-'}</span>
                </div>
                {patient.notes && (
                  <div className="flex items-start gap-3 text-[#7A7A68] text-sm mt-4 pt-4 border-t border-[#F4F1E8]">
                    <FileText size={16} className="text-[#9A9A88] shrink-0 mt-0.5" />
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
          <div className="absolute inset-0 bg-[#2C2C24]/40 backdrop-blur-sm" onClick={handleCloseModal}></div>
          <div className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-full">
            <div className="p-6 border-b border-[#E8E4DB] flex items-center justify-between bg-[#FDFBF7]">
              <h3 className="text-2xl font-serif font-medium text-[#2C2C24]">
                {editingPatient ? t('editPatient') : t('addPatient')}
              </h3>
              <button onClick={handleCloseModal} className="p-2 text-[#7A7A68] hover:bg-[#EAE6DB] rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="patient-form" onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-[#9A9A88] uppercase tracking-wider mb-2">{t('name')} *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-[#EAE6DB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 focus:border-[#5A5A40] transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-[#9A9A88] uppercase tracking-wider mb-2">{t('email')}</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-[#EAE6DB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 focus:border-[#5A5A40] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#9A9A88] uppercase tracking-wider mb-2">{t('phone')}</label>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-[#EAE6DB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 focus:border-[#5A5A40] transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#9A9A88] uppercase tracking-wider mb-2">{t('additionalNotes')}</label>
                  <textarea 
                    rows={4}
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-[#EAE6DB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 focus:border-[#5A5A40] transition-all resize-none"
                  ></textarea>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-[#E8E4DB] bg-[#FDFBF7] flex justify-end gap-3">
              <button 
                type="button"
                onClick={handleCloseModal}
                className="px-5 py-2.5 rounded-full border border-[#EAE6DB] text-[#7A7A68] font-medium hover:bg-white transition-colors"
              >
                {t('cancel')}
              </button>
              <button 
                type="submit"
                form="patient-form"
                className="px-6 py-2.5 rounded-full bg-[#5A5A40] text-white font-medium hover:bg-[#4A4A3A] transition-colors shadow-md shadow-[#5A5A40]/20"
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
