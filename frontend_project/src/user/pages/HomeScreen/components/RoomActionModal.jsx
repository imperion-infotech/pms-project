import React from 'react';
import { 
  X, User, Phone, Mail, MapPin, 
  Building, ShieldCheck, Calendar,
  CreditCard, BedDouble, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RoomActionModal = ({ isOpen, onClose, room, isDark }) => {
  if (!isOpen || !room) return null;

  // Extract profile info safely
  const profile = room.profile || {};

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        {/* Glass Overlay Layer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 30, rotateX: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 30 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={`relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[40px] border shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] flex flex-col ${
            isDark 
              ? 'bg-[#0f172a] border-slate-800' 
              : 'bg-white border-slate-200'
          }`}
        >
          {/* Header ─── Sleek Industrial Design */}
          <div className={`p-6 sm:p-10 flex justify-between items-center relative overflow-hidden ${
             isDark ? 'bg-slate-800/20' : 'bg-slate-50/50'
          }`}>
             {/* Decorative Background Element */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full"></div>
            
            <div className="flex items-center gap-5 relative z-10">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-2xl shadow-emerald-500/40 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                <BedDouble className="text-white w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className={`text-2xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    UNIFIED <span className="text-emerald-500">GUEST PROFILE</span>
                  </h2>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    isDark ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
                  }`}>
                    Room {room.roomName}
                  </span>
                </div>
                <p className={`text-[10px] font-bold uppercase tracking-[0.3em] mt-1.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  PMS Secure Intelligence System v2.0
                </p>
              </div>
            </div>

            <button 
              onClick={onClose}
              className={`p-3 rounded-2xl transition-all relative z-10 group ${
                isDark ? 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white' : 'bg-white text-slate-400 hover:bg-slate-100'
              }`}
            >
              <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              
              {/* LEFT INFO PANEL (60%) */}
              <div className="lg:col-span-7 space-y-10">
                
                {/* Section 1: Pure Personal Details */}
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
                      <User size={16} className="text-emerald-500" />
                    </div>
                    <h3 className={`text-xs font-black uppercase tracking-[0.2em] ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                      Core Guest Information
                    </h3>
                  </div>

                  <div className="space-y-6">
                    {/* Full Name Field */}
                    <div className="group">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Personal Detail Name</label>
                      <div className={`flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all ${
                        isDark ? 'bg-slate-800/30 border-slate-700 focus-within:border-emerald-500/50' : 'bg-slate-50 border-slate-200 focus-within:border-emerald-500'
                      }`}>
                         <User size={18} className="text-slate-400" />
                         <input 
                           type="text" 
                           readOnly
                           value={profile.personalDetailName || room.guestName || "Pending Sync"}
                           className="bg-transparent border-none outline-none w-full text-sm font-bold text-slate-600 dark:text-slate-200"
                         />
                      </div>
                    </div>

                    {/* Company Name Field */}
                    <div className="group">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Affiliated Company</label>
                      <div className={`flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all ${
                        isDark ? 'bg-slate-800/30 border-slate-700 focus-within:border-emerald-500/50' : 'bg-slate-50 border-slate-200 focus-within:border-emerald-500'
                      }`}>
                         <Building size={18} className="text-slate-400" />
                         <input 
                           type="text" 
                           readOnly
                           value={profile.companyName || "N/A - Individual"}
                           className="bg-transparent border-none outline-none w-full text-sm font-bold text-slate-600 dark:text-slate-200"
                         />
                      </div>
                    </div>

                    {/* Contact Pair */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="group">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Phone Number</label>
                        <div className={`flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all ${
                          isDark ? 'bg-slate-800/30 border-slate-700 focus-within:border-emerald-500/50' : 'bg-slate-50 border-slate-200 focus-within:border-emerald-500'
                        }`}>
                           <Phone size={18} className="text-slate-400" />
                           <span className="text-sm font-bold text-slate-600 dark:text-slate-200">{profile.phone || "---"}</span>
                        </div>
                      </div>
                      <div className="group">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Email ID</label>
                        <div className={`flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all ${
                          isDark ? 'bg-slate-800/30 border-slate-700 focus-within:border-emerald-500/50' : 'bg-slate-50 border-slate-200 focus-within:border-emerald-500'
                        }`}>
                           <Mail size={18} className="text-slate-400" />
                           <span className="text-sm font-bold text-slate-600 dark:text-slate-200 truncate">{profile.email || "---"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Address Field */}
                    <div className="group">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Permanant Address</label>
                      <div className={`flex items-start gap-4 px-5 py-4 rounded-2xl border transition-all ${
                        isDark ? 'bg-slate-800/30 border-slate-700 focus-within:border-emerald-500/50' : 'bg-slate-50 border-slate-200 focus-within:border-emerald-500'
                      }`}>
                         <MapPin size={18} className="text-slate-400 mt-0.5" />
                         <span className="text-sm font-bold text-slate-600 dark:text-slate-200 leading-relaxed">
                           {profile.address || "No address data mapped to this guest profile."}
                         </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT ACTION PANEL (40%) */}
              <div className="lg:col-span-5 flex flex-col gap-8">
                
                {/* Security/ID Block */}
                <div className={`p-8 rounded-[35px] border ${isDark ? 'bg-slate-800/20 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                   <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-500 mb-6">
                     <ShieldCheck size={16} /> ID Verification
                   </h4>
                   <div className={`aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center ${
                     isDark ? 'border-slate-700 bg-slate-900/50' : 'border-slate-200 bg-white'
                   }`}>
                      <User size={32} className="text-slate-300 dark:text-slate-700 mb-3" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Document Found</span>
                   </div>
                   <button className="w-full mt-6 py-3 bg-slate-900 dark:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-transform active:scale-95 shadow-lg">
                     Re-upload ID
                   </button>
                </div>

                {/* Reservation Context */}
                <div className={`p-8 rounded-[35px] border flex-1 ${isDark ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-emerald-50/50 border-emerald-100'}`}>
                   <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-500 mb-6">
                     <Calendar size={16} /> Stay Context
                   </h4>
                   <div className="space-y-4">
                      <div className="flex justify-between items-center px-4 py-3 rounded-xl bg-white/50 dark:bg-slate-900/40 border border-emerald-500/10">
                         <span className="text-[10px] font-bold text-slate-500 uppercase">Check-In</span>
                         <span className="text-xs font-black text-slate-800 dark:text-slate-200">23 Mar 2026</span>
                      </div>
                      <div className="flex justify-between items-center px-4 py-3 rounded-xl bg-white/50 dark:bg-slate-900/40 border border-emerald-500/10">
                         <span className="text-[10px] font-bold text-slate-500 uppercase">Status</span>
                         <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-500 text-white">ACTIVE</span>
                      </div>
                   </div>

                   <div className="mt-10">
                     <div className="flex items-center justify-between mb-2 px-2">
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Billing Completion</span>
                       <span className="text-[10px] font-black text-emerald-500">100%</span>
                     </div>
                     <div className="h-2 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: '100%' }}
                         transition={{ duration: 1, delay: 0.5 }}
                         className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                       />
                     </div>
                   </div>
                </div>
              </div>

            </div>
          </div>
          
          {/* Footer Actions */}
          <div className={`p-6 sm:p-8 flex justify-end gap-4 border-t ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
          }`}>
             <button 
               onClick={onClose}
               className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                 isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
               }`}
             >
               Discard
             </button>
             <button 
               className="px-10 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
             >
               Validate & Close <ArrowRight size={14} />
             </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RoomActionModal;
