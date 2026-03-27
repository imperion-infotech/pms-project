import React from 'react';
import { Save } from 'lucide-react';

/**
 * ImageUpload Component
 * Handle image selection and previews for guest photos or signatures.
 */
const ImageUpload = ({ label, value, onUpload, icon: Icon, isDark, aspect = "aspect-video" }) => {
  const containerClass = `p-8 rounded-[35px] border ${isDark ? 'bg-slate-800/20 border-slate-800' : 'bg-slate-50 border-slate-100'}`;
  
  const uploadAreaClass = `${aspect} rounded-2xl border-2 border-dashed flex flex-col items-center justify-center relative overflow-hidden group transition-all ${
    isDark ? 'border-slate-700 bg-slate-950/50 hover:border-emerald-500/50' : 'border-slate-200 bg-white hover:border-emerald-500'
  }`;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return '';
    if (String(path).startsWith('data:') || String(path).startsWith('blob:')) return path;
    
    // Industrial cleanup: Extract only filename if backend returns local path
    const filename = String(path).split('/').pop().split('\\').pop();
    return `/user/${filename}`;
  };

  return (
    <div className={containerClass}>
      <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-500 mb-6 leading-none">
        {Icon && <Icon size={16} />} {label}
      </h4>
      <div className={uploadAreaClass}>
        {value ? (
          <img 
             src={getImageUrl(value)} 
             alt={label} 
             className="w-full h-full object-cover" 
             onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
              <Save size={20} className="text-slate-400" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
              Upload {label}
            </span>
          </>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default ImageUpload;
