import React, { useState, useEffect } from 'react';
import {
  X, User, Save, Loader2, Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../../services/api';

// Sub-components for better organization
import GuestForm from './roomAction/GuestForm';
import ImageUpload from './roomAction/ImageUpload';

/**
 * RoomActionModal Component
 * 
 * This is the main modal for managing Guest Personal Details.
 * It handles:
 * 1. Fetching/Setting initial form data from room profile.
 * 2. Creating a new personal detail record (Initial Check-in).
 * 3. Updating existing personal details.
 * 4. Image uploads for Guest Photo and Signature.
 */
const RoomActionModal = ({ isOpen, onClose, room, isDark, onRefresh }) => {
  // Initial state for the guest form
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    phone: '',
    email: '',
    address: '',
    profilePhoto: '',
    signature: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingType, setUploadingType] = useState(null);

  // Synchronize component state with room data when modal opens
  useEffect(() => {
    if (room && room.profile) {
      const p = room.profile;
      let fName = p.firstName || '';
      let lName = p.lastName || '';

      // Fallback: split personalDetailName if first/last name fields are empty
      if (!fName && p.personalDetailName) {
        const parts = p.personalDetailName.split(' ');
        fName = parts[0] || '';
        lName = parts.slice(1).join(' ') || '';
      }

      setFormData({
        firstName: fName,
        lastName: lName,
        companyName: p.companyName || '',
        phone: p.phone || '',
        email: p.email || '',
        address: p.address || '',
        profilePhoto: p.profilePhoto || '',
        signature: p.signature || ''
      });
    } else {
      // Reset form for fresh entry
      setFormData({
        firstName: '', lastName: '', companyName: '',
        phone: '', email: '', address: '',
        profilePhoto: '', signature: ''
      });
    }
  }, [room, isOpen]);

  if (!isOpen || !room) return null;

  const profile = room.profile || {};
  const isExisting = !!profile.id;

  // Handle generic input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle real image uploads (Industrial Level)
  const handleImageSelect = async (file, type) => {
    if (!file) return;

    setUploadingType(type);
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    try {
      const response = await api.post('/user/upload', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const responseData = response.data.fileName || response.data;
      let fileName = responseData;
      if (typeof responseData === 'string' && responseData.includes(': ')) {
        fileName = responseData.split(': ')[1].trim();
      }

      setFormData(prev => ({ ...prev, [type]: fileName }));
    } catch (err) {
      console.error('Image upload failed:', err);
      alert('Photo upload failed. Please try again.');
    } finally {
      setUploadingType(null);
    }
  };

  // Submit form to backend
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.email) {
      alert('Missing required fields: Name, Phone, and Email are mandatory.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        id: isExisting ? profile.id : 0
      };

      if (isExisting) {
        await api.put(`/user/updatepersonaldetail/${profile.id}`, payload);
      } else {
        await api.post('/user/createpersonaldetail', payload);
      }

      if (onRefresh) onRefresh();
      onClose();
    } catch (err) {
      console.error('Error saving personal detail:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Server connection failed';
      alert(`Failed to save: ${errorMessage}. Please check the database constraints and try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Overlay with blur effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 30 }}
          className={`relative w-full max-w-4xl my-auto rounded-[40px] border shadow-2xl flex flex-col transition-colors duration-300 ${isDark ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'
            }`}
        >
          {/* Header Section */}
          <div className={`p-6 sm:p-10 flex justify-between items-center relative overflow-hidden rounded-t-[40px] ${isDark ? 'bg-slate-800/20' : 'bg-slate-50/50'
            }`}>
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full"></div>

            <div className="flex items-center gap-5 relative z-10">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-xl shadow-emerald-500/30 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                <User className="text-white w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-700'}`}>
                    {isExisting ? 'UPDATE' : 'CREATE '} <span className="text-emerald-400">PROFILE</span>
                  </h2>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${isDark ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
                    }`}>
                    Room {room.roomName}
                  </span>
                </div>
                <p className={`text-[10px] font-bold uppercase tracking-[0.3em] mt-1.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  Guest Identification Service
                </p>
              </div>
            </div>

            <button onClick={onClose} className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm text-slate-400 hover:text-emerald-500 transition-all border border-slate-100 dark:border-slate-700">
              <X size={20} />
            </button>
          </div>

          {/* Modal Content - Scrollable Form */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-10 max-h-[60vh]">
            <form id="personalDetailForm" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">

              {/* Left Column: Text Inputs */}
              <div className="lg:col-span-7">
                <div className="flex items-center gap-3 mb-8">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
                    <User size={16} className="text-emerald-500" />
                  </div>
                  <h3 className={`text-xs font-black uppercase tracking-[0.2em] ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    Guest Information
                  </h3>
                </div>
                <GuestForm formData={formData} handleChange={handleChange} isDark={isDark} />
              </div>

              {/* Right Column: Media Uploads */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <ImageUpload
                  label="Guest Photo"
                  value={formData.profilePhoto}
                  icon={User}
                  isDark={isDark}
                  aspect="aspect-square"
                  onUpload={(file) => handleImageSelect(file, 'profilePhoto')}
                />

                <ImageUpload
                  label="Signature"
                  value={formData.signature}
                  icon={Save}
                  isDark={isDark}
                  aspect="aspect-video"
                  onUpload={(file) => handleImageSelect(file, 'signature')}
                />
              </div>
            </form>
          </div>

          {/* Footer: Control Buttons */}
          <div className={`p-6 sm:p-8 flex justify-end gap-4 border-t rounded-b-[40px] ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
            }`}>
            <button
              type="button"
              onClick={onClose}
              className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              form="personalDetailForm"
              disabled={isSubmitting || uploadingType}
              className={`px-10 py-3 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl transition-all active:scale-95 flex items-center gap-2 ${isSubmitting || uploadingType ? 'bg-slate-400 cursor-not-allowed shadow-none' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
                }`}
            >
              {isSubmitting || uploadingType ? <Loader2 className="w-4 h-4 animate-spin" /> : isExisting ? <Save size={14} /> : <Plus size={14} />}
              {uploadingType ? 'Uploading Assets...' : isSubmitting ? 'Syncing...' : isExisting ? 'Update Profile' : 'Create Profile'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RoomActionModal;
