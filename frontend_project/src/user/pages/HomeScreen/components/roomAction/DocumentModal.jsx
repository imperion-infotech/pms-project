import React, { useState, useEffect } from 'react'
import { X, FileText, Camera, Paperclip } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { propertyService } from '../../../../../services/propertyService'
import ImageUpload from './ImageUpload'

/**
 * DocumentModal Component
 * A specialized sub-modal for adding/editing guest identification documents.
 */
const DocumentModal = ({
  isOpen,
  onClose,
  onSave,
  isDark,
  documentTypes = [],
  initialData = null,
  profileAddress = '',
}) => {
  const [docFormData, setDocFormData] = useState({
    documentTypeId: '',
    documentNumber: '',
    validTill: '',
    nameOnDoc: '',
    isPrimary: false,
    copyAddressFrom: 'N/A',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    remark: '',
    frontImage: '',
    backImage: '',
  })

  const [docPreviews, setDocPreviews] = useState({ frontImage: null, backImage: null })
  const [uploadingType, setUploadingType] = useState(null)

  // Initialize form when editing
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setDocFormData({ ...initialData })
        setDocPreviews({
          frontImage: initialData.frontImage
            ? propertyService.getImageUrl(initialData.frontImage)
            : null,
          backImage: initialData.backImage
            ? propertyService.getImageUrl(initialData.backImage)
            : null,
        })
      } else {
        setDocFormData({
          documentTypeId: '',
          documentNumber: '',
          validTill: '',
          nameOnDoc: '',
          isPrimary: false,
          copyAddressFrom: 'N/A',
          address: '',
          city: '',
          state: '',
          zipCode: '',
          country: '',
          remark: '',
          frontImage: '',
          backImage: '',
        })
        setDocPreviews({ frontImage: null, backImage: null })
      }
    }
  }, [isOpen, initialData])

  // Handle document image uploads
  const handleDocImageSelect = async (file, type) => {
    if (!file) return

    const url = URL.createObjectURL(file)
    setDocPreviews((prev) => {
      if (prev[type]) URL.revokeObjectURL(prev[type])
      return { ...prev, [type]: url }
    })

    setUploadingType(type)
    const uploadFormData = new FormData()
    uploadFormData.append('file', file)

    try {
      const response = await propertyService.uploadImage(uploadFormData)
      const fileName = response.data.fileName || response.data
      setDocFormData((prev) => ({ ...prev, [type]: fileName }))
    } catch (err) {
      console.error('Doc image upload failed:', err)
    } finally {
      setUploadingType(null)
    }
  }

  const handleSave = () => {
    if (!docFormData.documentTypeId || !docFormData.documentNumber) {
      alert('Document Type and Number are required.')
      return
    }
    onSave(docFormData)
  }

  if (!isOpen) return null

  // Shared classes
  const labelClass =
    'text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1'
  const inputContainerClass = `flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all ${
    isDark
      ? 'bg-slate-800/30 border-slate-700 focus-within:border-emerald-500/50'
      : 'bg-slate-50 border-slate-200 focus-within:border-emerald-500'
  }`
  const inputClass =
    'bg-transparent border-none outline-none w-full text-sm font-bold text-slate-600 dark:text-slate-200'

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={`relative flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-[40px] border shadow-2xl ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}
        >
          {/* Sub-header */}
          <div className="flex items-center justify-between border-b border-slate-100 p-8 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-500/20">
                <FileText size={20} />
              </div>
              <div>
                <h3
                  className={`text-sm font-black tracking-widest uppercase ${isDark ? 'text-white' : 'text-slate-800'}`}
                >
                  {initialData ? 'Edit' : 'Add'} Document
                </h3>
                <p className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">
                  Upload legal identity card details
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-100 p-2 text-slate-400 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              {/* Left: Card Details */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-l-4 border-orange-500 pl-3">
                  <h4 className="text-[10px] font-black tracking-widest text-slate-800 uppercase dark:text-slate-200">
                    Card Details
                  </h4>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <label className={labelClass}>Doc. Type</label>
                    <div className={inputContainerClass}>
                      <select
                        className={inputClass}
                        value={docFormData.documentTypeId}
                        onChange={(e) =>
                          setDocFormData({ ...docFormData, documentTypeId: e.target.value })
                        }
                      >
                        <option value="">Select Type</option>
                        {documentTypes.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.documentTypeName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="sm:col-span-1">
                    <label className={labelClass}>Number</label>
                    <div className={inputContainerClass}>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="ID Number"
                        value={docFormData.documentNumber}
                        onChange={(e) =>
                          setDocFormData({ ...docFormData, documentNumber: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Valid Till</label>
                    <div className={inputContainerClass}>
                      <input
                        type="date"
                        className={inputClass}
                        value={docFormData.validTill}
                        onChange={(e) =>
                          setDocFormData({ ...docFormData, validTill: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Name on Doc</label>
                    <div className={inputContainerClass}>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="Full name as on ID"
                        value={docFormData.nameOnDoc}
                        onChange={(e) =>
                          setDocFormData({ ...docFormData, nameOnDoc: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={docFormData.isPrimary}
                    onChange={(e) =>
                      setDocFormData({ ...docFormData, isPrimary: e.target.checked })
                    }
                    className="h-5 w-5 rounded-lg border-slate-300 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
                    Set as primary identification
                  </span>
                </label>
              </div>

              {/* Right: Address Details */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-l-4 border-blue-500 pl-3">
                  <h4 className="text-[10px] font-black tracking-widest text-slate-800 uppercase dark:text-slate-200">
                    Address Details
                  </h4>
                  <span className="text-[8px] font-bold text-slate-400">
                    (Optional if same as profile)
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Copy Address From</label>
                    <div className={inputContainerClass}>
                      <select
                        className={inputClass}
                        value={docFormData.copyAddressFrom}
                        onChange={(e) => {
                          const val = e.target.value
                          if (val === 'Guest Profile') {
                            setDocFormData({
                              ...docFormData,
                              copyAddressFrom: val,
                              address: profileAddress,
                            })
                          } else {
                            setDocFormData({ ...docFormData, copyAddressFrom: val })
                          }
                        }}
                      >
                        <option value="N/A">N/A</option>
                        <option value="Guest Profile">Guest Profile</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Address</label>
                    <div className={inputContainerClass}>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="Street address"
                        value={docFormData.address}
                        onChange={(e) =>
                          setDocFormData({ ...docFormData, address: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>City</label>
                      <input
                        type="text"
                        className={`${inputContainerClass} ${inputClass} py-3`}
                        value={docFormData.city}
                        onChange={(e) => setDocFormData({ ...docFormData, city: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>State</label>
                      <input
                        type="text"
                        className={`${inputContainerClass} ${inputClass} py-3`}
                        value={docFormData.state}
                        onChange={(e) => setDocFormData({ ...docFormData, state: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Zip Code</label>
                      <input
                        type="text"
                        className={`${inputContainerClass} ${inputClass} py-3`}
                        value={docFormData.zipCode}
                        onChange={(e) =>
                          setDocFormData({ ...docFormData, zipCode: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Country</label>
                      <input
                        type="text"
                        className={`${inputContainerClass} ${inputClass} py-3`}
                        value={docFormData.country}
                        onChange={(e) =>
                          setDocFormData({ ...docFormData, country: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Remark</label>
                  <input
                    type="text"
                    className={`${inputContainerClass} ${inputClass} py-3`}
                    placeholder="Additional notes"
                    value={docFormData.remark}
                    onChange={(e) => setDocFormData({ ...docFormData, remark: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Image Uploads Area */}
            <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Front Image
                  </h4>
                  <div className="flex gap-2">
                    <button className="text-slate-400 hover:text-emerald-500">
                      <Paperclip size={14} />
                    </button>
                    <button className="text-slate-400 hover:text-emerald-500">
                      <Camera size={14} />
                    </button>
                  </div>
                </div>
                <ImageUpload
                  label="Front Photo"
                  value={docPreviews.frontImage || docFormData.frontImage}
                  onUpload={(file) => handleDocImageSelect(file, 'frontImage')}
                  onClear={() => {
                    setDocFormData({ ...docFormData, frontImage: '' })
                    setDocPreviews({ ...docPreviews, frontImage: null })
                  }}
                  isDark={isDark}
                  aspect="aspect-video"
                />
              </div>
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Back Image
                  </h4>
                  <div className="flex gap-2">
                    <button className="text-slate-400 hover:text-emerald-500">
                      <Paperclip size={14} />
                    </button>
                    <button className="text-slate-400 hover:text-emerald-500">
                      <Camera size={14} />
                    </button>
                  </div>
                </div>
                <ImageUpload
                  label="Back Photo"
                  value={docPreviews.backImage || docFormData.backImage}
                  onUpload={(file) => handleDocImageSelect(file, 'backImage')}
                  onClear={() => {
                    setDocFormData({ ...docFormData, backImage: '' })
                    setDocPreviews({ ...docPreviews, backImage: null })
                  }}
                  isDark={isDark}
                  aspect="aspect-video"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 border-t border-slate-100 p-8 dark:border-slate-800">
            <button
              onClick={onClose}
              disabled={!!uploadingType}
              className={`text-[10px] font-black tracking-widest text-slate-400 uppercase ${uploadingType ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!!uploadingType}
              className={`rounded-xl bg-emerald-600 px-8 py-3 text-[10px] font-black tracking-widest text-white uppercase shadow-lg shadow-emerald-500/20 transition-all active:scale-95 ${uploadingType ? 'cursor-not-allowed bg-slate-400 shadow-none' : ''}`}
            >
              {uploadingType ? 'Uploading...' : 'Save Document'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default DocumentModal
