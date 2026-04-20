import React from 'react'
import { FileText, X, CheckCircle2 } from 'lucide-react'

export const DocumentTypeModal = ({
  isOpen,
  setIsOpen,
  newDocType,
  setNewDocType,
  handleAdd,
  documentTypes = [],
}) => {
  if (!isOpen) return null

  const isDuplicate = documentTypes.some(
    (d) =>
      String(d.documentTypeName).toLowerCase() ===
      String(newDocType.documentTypeName).toLowerCase(),
  )

  const onSubmit = (e) => {
    e.preventDefault()
    if (isDuplicate) return
    handleAdd(e)
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div
        className="animate-in fade-in absolute inset-0 bg-slate-900/60 backdrop-blur-sm duration-300"
        onClick={() => setIsOpen(false)}
      ></div>
      <div className="dark:bg-surface-100 animate-in zoom-in-95 relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200/50 bg-white shadow-2xl duration-300 dark:border-slate-800/50">
        <div className="relative flex items-center justify-between overflow-hidden bg-orange-600 p-6 text-white">
          <div className="pointer-events-none absolute top-0 right-0 p-4 opacity-10">
            <FileText className="h-24 w-24 rotate-12" />
          </div>
          <div className="relative z-10 flex items-center gap-3">
            <div className="rounded-xl bg-white/20 p-2">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold tracking-tight">New Document Type</h3>
              <p className="text-pms-tiny font-bold tracking-[0.2em] text-orange-200 uppercase">
                Configuration Portal
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="relative z-10 rounded-xl p-2 transition-colors hover:bg-white/20 active:scale-90"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-6 p-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1">
              <label className="mb-2 block px-1 text-pms-tiny font-bold tracking-widest text-slate-400 uppercase dark:text-slate-500">
                Short Name
              </label>
              <input
                required
                type="text"
                value={newDocType.documentTypeShortName}
                onChange={(e) =>
                  setNewDocType({ ...newDocType, documentTypeShortName: e.target.value })
                }
                placeholder="e.g., DL"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 transition-all focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 focus:outline-none dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200"
              />
            </div>
            <div className="col-span-1">
              <label className="mb-2 block px-1 text-pms-tiny font-bold tracking-widest text-slate-400 uppercase dark:text-slate-500">
                Category
              </label>
              <select
                value={newDocType.documentTypeCategory}
                onChange={(e) =>
                  setNewDocType({ ...newDocType, documentTypeCategory: e.target.value })
                }
                className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 transition-all focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 focus:outline-none dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200"
              >
                <option value="">Select Category</option>
                <option value="Driving License">Driving License</option>
                <option value="Passport">Passport</option>
                <option value="Identification Card">Identification Card</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block px-1 text-pms-tiny font-bold tracking-widest text-slate-400 uppercase dark:text-slate-500">
              Document Name
            </label>
            <input
              autoFocus
              required
              type="text"
              value={newDocType.documentTypeName}
              onChange={(e) => setNewDocType({ ...newDocType, documentTypeName: e.target.value })}
              placeholder="e.g., Driving License"
              className={`w-full border bg-slate-50 px-4 py-3 dark:bg-slate-800/50 ${isDuplicate ? 'border-red-500 ring-4 ring-red-500/10' : 'border-slate-200 dark:border-slate-700'} rounded-2xl text-sm font-medium text-slate-800 transition-all focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 focus:outline-none dark:text-slate-200`}
            />
            {isDuplicate && (
              <p className="mt-2 flex items-center gap-1 text-pms-tiny font-bold text-red-500">
                <X className="h-3 w-3" /> This document name already exists!
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block px-1 text-pms-tiny font-bold tracking-widest text-slate-400 uppercase dark:text-slate-500">
              Description
            </label>
            <textarea
              rows="3"
              value={newDocType.documentTypeDescription}
              onChange={(e) =>
                setNewDocType({ ...newDocType, documentTypeDescription: e.target.value })
              }
              placeholder="What is this document used for?"
              className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 transition-all focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 focus:outline-none dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200"
            ></textarea>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/30">
            <div className="flex items-center gap-3">
              <div
                className={`rounded-lg p-2 transition-colors ${newDocType.documentTypeDefault ? 'bg-emerald-500/10 text-emerald-600' : 'bg-slate-200 text-slate-400 dark:bg-slate-700'}`}
              >
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Set as Default
                </h4>
                <p className="text-pms-tiny text-slate-400">Mark this as the primary document type</p>
              </div>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={newDocType.documentTypeDefault}
                onChange={(e) =>
                  setNewDocType({ ...newDocType, documentTypeDefault: e.target.checked })
                }
              />
              <div className="peer h-6 w-11 rounded-full bg-slate-200 peer-checked:bg-orange-600 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white dark:bg-slate-700"></div>
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 py-3 text-xs font-extrabold tracking-widest text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
            >
              DISCARD
            </button>
            <button
              type="submit"
              disabled={
                isDuplicate || !newDocType.documentTypeName || !newDocType.documentTypeShortName
              }
              className={`flex-2 rounded-2xl py-3.5 text-xs font-extrabold tracking-widest text-white shadow-xl transition-all active:scale-95 ${isDuplicate || !newDocType.documentTypeName || !newDocType.documentTypeShortName ? 'cursor-not-allowed bg-slate-300 shadow-none grayscale dark:bg-slate-800' : 'bg-orange-600 shadow-orange-600/30 hover:bg-orange-700'}`}
            >
              {isDuplicate ? 'ALREADY EXISTS' : 'SAVE DOCUMENT TYPE'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
