import React from 'react'
import { Save, RefreshCw, X, Camera } from 'lucide-react'

/**
 * ImageUpload Component
 * Handle image selection and previews for guest photos or signatures.
 */
const ImageUpload = ({
  label,
  value,
  onUpload,
  onClear,
  icon: Icon,
  isDark,
  aspect = 'aspect-video',
  renderCustomPreview,
}) => {
  const containerClass = `p-3 rounded-[20px] border ${isDark ? 'bg-slate-800/20 border-slate-800' : 'bg-slate-50 border-slate-100'}`

  const uploadAreaClass = `${aspect} rounded-lg border-2 border-dashed flex flex-col items-center justify-center relative overflow-hidden group transition-all ${
    isDark
      ? 'border-slate-700 bg-slate-950/50 hover:border-emerald-500/50'
      : 'border-slate-200 bg-white hover:border-emerald-500'
  }`

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      onUpload(file)
    }
  }

  const getImageUrl = (path) => {
    if (!path) return ''
    if (String(path).startsWith('data:') || String(path).startsWith('blob:')) return path

    // Industrial cleanup: Extract only filename if backend returns local path
    const filename = String(path).split('/').pop().split('\\').pop()
    return `/user/${filename}`
  }

  return (
    <div className="w-full">
      <div className={containerClass}>
        <div className="mb-3 flex items-center justify-between">
          <h4 className="flex items-center gap-2 text-[10px] leading-none font-black tracking-widest text-emerald-500 uppercase">
            {Icon && <Icon size={14} />} {label}
          </h4>
          {value && onClear && (
            <button
              type="button"
              onClick={onClear}
              className="rounded-md bg-red-500/10 p-1 text-red-500 shadow-sm transition-all hover:bg-red-500 hover:text-white"
            >
              <X size={10} />
            </button>
          )}
        </div>
        <div className={uploadAreaClass}>
          {value ? (
            <>
              {renderCustomPreview ? (
                renderCustomPreview(value)
              ) : (
                <img
                  src={getImageUrl(value)}
                  alt={label}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              )}
              <div className="absolute inset-0 bg-slate-900/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </>
          ) : (
            <>
              <div
                className={`mb-2 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-500/10 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}
              >
                <Save
                  size={14}
                  className="text-slate-400 transition-colors duration-300 group-hover:text-emerald-500"
                />
              </div>
              <span className="text-[8px] leading-none font-black tracking-widest text-slate-400 uppercase transition-colors duration-300 group-hover:text-emerald-500">
                Upload {label}
              </span>
            </>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
        </div>
      </div>
    </div>
  )
}

export default ImageUpload
