import React, { useState, useEffect } from 'react'
import { X, FileText, Camera, Paperclip, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { propertyService } from '../../../../../services/propertyService'
import { usePmsDocumentDetails } from '../../../../../hooks/usePmsDocumentDetails'
import ImageUpload from './ImageUpload'
import { AuthImage } from '../../../../../admin/components/common/AuthImage'

/**
 * cleanImageUrl - Helper to extract just the filename from potentially complex paths.
 */
const cleanImageUrl = (path) => {
  if (!path || path === 'photo' || path === 'sign') return null
  let cleanPath = String(path)
  if (cleanPath.includes(': ')) cleanPath = cleanPath.split(': ')[1].trim()
  if (cleanPath.startsWith('/')) cleanPath = cleanPath.substring(1)
  const parts = cleanPath.split('/')
  return parts[parts.length - 1]
}

/**
 * DocumentModal Component
 * Updated to match the specific JSON format for Document Details Management.
 */
const DocumentModal = ({
  isOpen,
  onClose,
  onSave,
  isDark,
  documentTypes = [],
  initialData = null,
  personalDetailsId = null, // ID of the guest this document belongs to
}) => {
  const { addDocumentDetail, updateDocumentDetail } = usePmsDocumentDetails()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [docFormData, setDocFormData] = useState({
    documentNumber: '',
    validTill: '',
    frontImagePath: '',
    backImagePath: '',
    remark: '',
    personalDetailsId: '',
    documentTypeId: '',
  })

  const [docPreviews, setDocPreviews] = useState({ frontImagePath: null, backImagePath: null })
  const [uploadingType, setUploadingType] = useState(null)

  // Initialize form when editing or opening
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setDocFormData({
          documentNumber: initialData.documentNumber || '',
          validTill: initialData.validTill || '',
          frontImagePath: initialData.frontImagePath || '',
          backImagePath: initialData.backImagePath || '',
          remark: initialData.remark || '',
          personalDetailsId: initialData.personalDetailsId || personalDetailsId || '',
          documentTypeId: initialData.documentTypeId || '',
          id: initialData.id, // For updates
        })
        setDocPreviews({
          frontImagePath: initialData.frontImagePath
            ? propertyService.getImageUrl(initialData.frontImagePath)
            : null,
          backImagePath: initialData.backImagePath
            ? propertyService.getImageUrl(initialData.backImagePath)
            : null,
        })
      } else {
        setDocFormData({
          documentNumber: '',
          validTill: '',
          frontImagePath: '',
          backImagePath: '',
          remark: '',
          personalDetailsId: personalDetailsId || '',
          documentTypeId: '',
        })
        setDocPreviews({ frontImagePath: null, backImagePath: null })
      }
    }
  }, [isOpen, initialData, personalDetailsId])

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
      const responseData = response.data?.fileName || response.data

      let fileName = responseData
      if (typeof responseData === 'string' && responseData.includes(':')) {
        // Robust splitting: Take everything after the last colon
        fileName = responseData.substring(responseData.lastIndexOf(':') + 1).trim()
      }

      setDocFormData((prev) => ({ ...prev, [type]: fileName }))
    } catch (err) {
      console.error('Doc image upload failed:', err)
    } finally {
      setUploadingType(null)
    }
  }

  const handleSave = async () => {
    if (!docFormData.documentTypeId || !docFormData.documentNumber) {
      alert('Document Type and Number are required.')
      return
    }

    setIsSubmitting(true)
    try {
      // Ensure IDs are correctly formatted as numbers
      const pId = Number(docFormData.personalDetailsId)
      const payload = {
        ...docFormData,
        personalDetailsId: pId,
        documentTypeId: Number(docFormData.documentTypeId),
      }

      console.log('--- Document Submission Data ---:', payload)

      // CRITICAL FIX: Only call API if personalDetailsId is a valid ID (> 0)
      if (pId > 0) {
        if (docFormData.id) {
          await updateDocumentDetail(docFormData.id, payload)
        } else {
          await addDocumentDetail(payload)
        }
      } else {
        console.log('--- Local Save Only (New Profile) ---')
      }

      // Always trigger onSave to update parent state/UI
      if (onSave) onSave(payload)
      onClose()
    } catch (err) {
      console.error('Failed to save document:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  // Shared UI classes
  const labelClass =
    'text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1'
  const inputContainerClass = `flex items-center gap-3 px-3 py-2 rounded-xl border transition-all ${
    isDark
      ? 'bg-slate-800/30 border-slate-700 focus-within:border-emerald-500/50'
      : 'bg-slate-50 border-slate-200 focus-within:border-emerald-500'
  }`
  const inputClass =
    'bg-transparent border-none outline-none w-full text-xs font-bold text-slate-600 dark:text-slate-200'

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
          className={`relative flex h-fit max-h-[95vh] w-full max-w-3xl flex-col overflow-hidden rounded-[30px] border shadow-2xl ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 p-4 px-6 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                <FileText size={18} />
              </div>
              <div>
                <h3
                  className={`text-sm font-black tracking-widest uppercase ${isDark ? 'text-white' : 'text-slate-800'}`}
                >
                  {docFormData.id ? 'Edit' : 'Add'} Document
                </h3>
                <p className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">
                  PMS Identification Management
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

          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Left Column: Form Fields */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-l-4 border-emerald-500 pl-3">
                  <h4 className="text-[10px] font-black tracking-widest text-slate-800 uppercase dark:text-slate-200">
                    Primary Information
                  </h4>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                    <label className={labelClass}>Doc. Number</label>
                    <div className={inputContainerClass}>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="abc12345rtyui..."
                        value={docFormData.documentNumber}
                        onChange={(e) =>
                          setDocFormData({ ...docFormData, documentNumber: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                    <label className={labelClass}>Remark</label>
                    <div className={inputContainerClass}>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="Add notes..."
                        value={docFormData.remark}
                        onChange={(e) => setDocFormData({ ...docFormData, remark: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/10">
                  <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">
                    Linked Personal ID
                  </span>
                  <div className="mt-1 text-sm font-black text-emerald-500">
                    {docFormData.personalDetailsId || 'NEW_PROFILE'}
                  </div>
                </div>
              </div>

              {/* Right Column: Image Uploads */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-l-4 border-emerald-500 pl-3">
                  <h4 className="text-[10px] font-black tracking-widest text-slate-800 uppercase dark:text-slate-200">
                    Image Assets
                  </h4>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1">
                  <ImageUpload
                    label="Front Photo"
                    value={docFormData.frontImagePath}
                    onUpload={(file) => handleDocImageSelect(file, 'frontImagePath')}
                    onClear={() => {
                      setDocFormData({ ...docFormData, frontImagePath: '' })
                      setDocPreviews({ ...docPreviews, frontImagePath: null })
                    }}
                    isDark={isDark}
                    aspect="aspect-[3/1]"
                    renderCustomPreview={(val) => (
                      <AuthImage
                        src={`/user/${cleanImageUrl(val)}`}
                        alt="Front"
                        className="h-full w-full object-cover"
                      />
                    )}
                  />
                  <ImageUpload
                    label="Back Photo"
                    value={docFormData.backImagePath}
                    onUpload={(file) => handleDocImageSelect(file, 'backImagePath')}
                    onClear={() => {
                      setDocFormData({ ...docFormData, backImagePath: '' })
                      setDocPreviews({ ...docPreviews, backImagePath: null })
                    }}
                    isDark={isDark}
                    aspect="aspect-[3/1]"
                    renderCustomPreview={(val) => (
                      <AuthImage
                        src={`/user/${cleanImageUrl(val)}`}
                        alt="Back"
                        className="h-full w-full object-cover"
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 border-t border-slate-100 p-6 px-10 dark:border-slate-800">
            <button
              onClick={onClose}
              disabled={isSubmitting || !!uploadingType}
              className={`text-[9px] font-black tracking-widest text-slate-400 uppercase ${isSubmitting || uploadingType ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSubmitting || !!uploadingType}
              className={`flex items-center gap-2 rounded-2xl bg-emerald-600 px-8 py-3 text-[10px] font-black tracking-widest text-white uppercase shadow-lg shadow-emerald-500/20 transition-all active:scale-95 ${isSubmitting || uploadingType ? 'cursor-not-allowed bg-slate-400 shadow-none' : 'hover:bg-emerald-700'}`}
            >
              {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : null}
              {uploadingType ? 'Uploading Assets...' : docFormData.id ? 'Update' : 'Save Document'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default DocumentModal
