import React, { useState, useEffect } from 'react';
import { X, User, Building, Phone, Mail, Camera, Pen as SignatureIcon, Loader2, Save } from 'lucide-react';

export const PersonalDetailsEditModal = ({ 
  isOpen, setIsOpen, formData, setFormData, handleSubmit, 
  handleFileUpload, uploadingType, loading 
}) => {
  const [localPreviews, setLocalPreviews] = useState({ photo: null, signature: null });

  // Sync / Reset local previews when modal opens
  useEffect(() => {
    if (!isOpen) {
      if (localPreviews.photo) URL.revokeObjectURL(localPreviews.photo);
      if (localPreviews.signature) URL.revokeObjectURL(localPreviews.signature);
      setTimeout(() => setLocalPreviews({ photo: null, signature: null }), 0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const cleanImageUrl = (path) => {
    if (!path || path === 'photo' || path === 'sign') return null;
    let cleanPath = String(path);
    if (cleanPath.includes(': ')) cleanPath = cleanPath.split(': ')[1].trim();
    if (cleanPath.startsWith('/')) cleanPath = cleanPath.substring(1);
    const parts = cleanPath.split('/');
    return parts[parts.length - 1]; // Only the filename
  };

  const handlePreviewUpload = (e, type) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create local preview immediately
      const url = URL.createObjectURL(file);
      setLocalPreviews(prev => {
        if (prev[type]) URL.revokeObjectURL(prev[type]);
        return { ...prev, [type]: url };
      });
    }
    handleFileUpload(e, type);
  };

  if (!isOpen) return null;

  // Determine source: Local preview takes precedence during upload/session
  const photoSrc = localPreviews.photo || (cleanImageUrl(formData.profilePhoto) ? `http://192.168.1.5:9091/user/${cleanImageUrl(formData.profilePhoto)}` : null);
  const signatureSrc = localPreviews.signature || (cleanImageUrl(formData.signature) ? `http://192.168.1.5:9091/user/${cleanImageUrl(formData.signature)}` : null);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => setIsOpen(false)}></div>
      <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl w-full max-w-4xl relative z-10 overflow-hidden flex flex-col md:flex-row max-h-[90vh] animate-in zoom-in-95">
        {/* Media Side */}
        <div className="w-full md:w-1/3 bg-slate-50 dark:bg-slate-800/50 p-8 flex flex-col items-center border-r border-slate-100 dark:border-slate-800 shrink-0">
           <div className="text-center mb-8">
             <h3 className="font-black text-blue-500 uppercase tracking-tighter">Edit Profile</h3>
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Update guest assets</p>
           </div>
           <div className="relative group mb-8">
              <div className="w-32 h-32 rounded-[32px] bg-white dark:bg-slate-800 shadow-xl overflow-hidden border-4 border-white dark:border-blue-500/20">
                {photoSrc ? (
                   <img src={photoSrc} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                   <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-100 dark:bg-slate-900/50">
                     <User size={40} />
                   </div>
                )}
                {uploadingType === 'photo' && <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center"><Loader2 className="text-white animate-spin" /></div>}
              </div>
              <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-500 text-white rounded-2xl flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-all">
                <Camera size={18} /><input type="file" className="hidden" accept="image/*" onChange={(e) => handlePreviewUpload(e, 'photo')} />
              </label>
           </div>
           <div className="w-full space-y-4">
              <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-4 bg-white dark:bg-slate-900/30 text-center">
                  {signatureSrc ? (
                     <div className="h-20 flex items-center justify-center">
                        <img src={signatureSrc} alt="Signature" className="max-h-full" />
                        <button type="button" onClick={() => {
                          setFormData({...formData, signature: ''});
                          if (localPreviews.signature) URL.revokeObjectURL(localPreviews.signature);
                          setLocalPreviews(prev => ({ ...prev, signature: null }));
                        }} className="absolute top-1 right-1 p-1 bg-red-100 text-red-500 rounded-md"><X size={12} /></button>
                     </div>
                  ) : (
                     <div className="py-2"><SignatureIcon size={24} className="mx-auto text-slate-300 mb-1" /><p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Update Signature</p></div>
                  )}
                  <label className="mt-2 block w-full py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-[10px] font-black uppercase text-slate-500 hover:bg-slate-200 cursor-pointer transition-all">
                     {uploadingType === 'signature' ? <Loader2 className="h-3 w-3 animate-spin mx-auto" /> : 'New Signature'}
                     <input type="file" className="hidden" accept="image/*" onChange={(e) => handlePreviewUpload(e, 'signature')} />
                  </label>
              </div>
           </div>
        </div>
        {/* Form Side */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900/50">
            <div><h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Modify Guest Data</h2><p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Record #{formData.id}</p></div>
            <button type="button" onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400"><X size={24} /></button>
          </div>
          <form onSubmit={handleSubmit} className="p-8 overflow-y-auto custom-scrollbar space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">First Name</label>
                <input required type="text" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Last Name</label>
                <input required type="text" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" />
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Company Name</label>
                <div className="relative"><Building size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" /><input type="text" value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" /></div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Phone</label>
                <div className="relative"><Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" /><input required type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" /></div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Email</label>
                <div className="relative"><Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" /><input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" /></div>
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Address</label>
                <textarea required rows="2" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none resize-none"></textarea>
              </div>
            </div>
            <div className="flex gap-4 pt-4 border-t border-slate-50 dark:border-slate-800">
              <button type="button" onClick={() => setIsOpen(false)} className="flex-1 py-4 text-xs font-black text-slate-400 uppercase tracking-widest transition-colors">Abort</button>
              <button type="submit" disabled={loading} className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all hover:bg-blue-700">
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}<span>Update Guest Profile</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
