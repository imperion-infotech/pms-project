import React from 'react';
import {
  Building, Mail, Phone, MapPin,
  Edit, Trash2, Plus, User, CheckCircle,
  Filter, Download, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PersonalDetailManagement = ({ 
  details = [], 
  searchTerm, 
  onAdd, 
  onEdit, 
  onDelete 
}) => {
  const cleanImageUrl = (path) => {
    if (!path || path === 'photo' || path === 'sign') return null;
    let cleanPath = String(path);

    // Fix 1: Handle legacy "Image uploaded successfully: " strings in database
    if (cleanPath.includes(': ')) {
      cleanPath = cleanPath.split(': ')[1].trim();
    }

    // Fix 2: Handle "uploads/pms/" or "/uploads/pms/" prefixes
    // If the backend expects only the filename, we should extract the last part.
    // However, if it expects the relative path without leading slash, we handle that.
    if (cleanPath.startsWith('/')) cleanPath = cleanPath.substring(1);

    // If the path still contains slashes, and we are getting 403, 
    // it's possible the backend only wants the filename.
    // Let's try to extract the filename for the URL but keep the full path as fallback.
    const parts = cleanPath.split('/');
    const fileNameOnly = parts[parts.length - 1];

    return fileNameOnly;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
            <User size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Guest Database</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Master record management</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onAdd}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all shrink-0"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">ADD NEW</span>
          </button>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Records', value: details.length, color: 'emerald' },
          { label: 'With Photos', value: details.filter(d => d.profilePhoto).length, color: 'blue' },
          { label: 'With Signatures', value: details.filter(d => d.signature).length, color: 'purple' },
          { label: 'Corporate Accounts', value: details.filter(d => d.companyName).length, color: 'orange' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-[28px] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h4 className="text-2xl font-black text-slate-800 dark:text-white">{stat.value}</h4>
            </div>
            <div className={`absolute -right-4 -bottom-4 w-16 h-16 bg-${stat.color}-500/5 rounded-full group-hover:scale-150 transition-transform duration-500`}></div>
          </div>
        ))}
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {details.map((guest) => (
            <motion.div
              key={guest.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-slate-900 rounded-[35px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden flex flex-col"
            >
              {/* Profile Card Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-16 h-16 rounded-[22px] bg-slate-100 dark:bg-slate-800 overflow-hidden border-2 border-white dark:border-slate-700 shadow-md group-hover:scale-110 transition-transform duration-500 flex-shrink-0">
                    {cleanImageUrl(guest.profilePhoto) ? (
                      <img
                        src={`/user/${cleanImageUrl(guest.profilePhoto)}`}
                        alt="Guest"
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=' + guest.firstName }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300"><User size={28} /></div>
                    )}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(guest)} className="p-2 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-500/10 text-slate-400 hover:text-blue-500 rounded-xl transition-colors"><Edit size={16} /></button>
                    <button onClick={() => onDelete(guest.id)} className="p-2 bg-slate-50 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500 rounded-xl transition-colors"><Trash2 size={16} /></button>
                  </div>
                </div>

                <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight line-clamp-1">{guest.firstName} {guest.lastName}</h3>
                <div className="flex items-center gap-2 text-emerald-500 mt-1">
                  <Building size={12} />
                  <span className="text-[10px] font-bold uppercase tracking-widest truncate">{guest.companyName || 'Individual'}</span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="px-6 space-y-3 flex-1">
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/10 rounded-2xl border border-slate-50 dark:border-slate-800/20">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-medium text-slate-500 truncate">{guest.email}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/10 rounded-2xl border border-slate-50 dark:border-slate-800/20">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-medium text-slate-500">{guest.phone}</span>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-6 mt-auto">
                <button
                  onClick={() => onEdit(guest)}
                  className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-200 text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center gap-2 group/btn"
                >
                  <span>View Full Profile</span>
                  <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {details.length === 0 && (
          <div className="col-span-full py-20 bg-white dark:bg-slate-900 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-slate-800 text-center">
            <User size={48} className="mx-auto text-slate-200 mb-4" />
            <h4 className="text-xl font-black text-slate-400 uppercase">Directory Empty</h4>
            <p className="text-sm text-slate-300 mt-2">No guest records found matching your current search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalDetailManagement;
