import React from 'react'
import { Plus, Search, Edit3, Trash2, FileText, Check, X, ShieldCheck } from 'lucide-react'

/**
 * DocumentTypeManagement component for managing various document types (ID proofs, etc.)
 */
const DocumentTypeManagement = ({
  documentTypes = [],
  setIsDocumentTypeModalOpen,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-700">
      {/* Header & Search Bar Layer */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500 shadow-sm transition-all hover:scale-110">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">
              Document Types
            </h2>
            <p className="text-xs font-medium text-slate-400">
              Manage acceptable identity proofs and guest documentation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDocumentTypeModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-700 hover:shadow-orange-500/40 active:scale-95"
          >
            <Plus className="h-4 w-4 stroke-3" />
            <span>Add Document Type</span>
          </button>
        </div>
      </div>

      {/* Main Table Layer */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/60 bg-white/80 shadow-2xl shadow-slate-200/40 backdrop-blur-xl transition-all hover:shadow-slate-300/50 dark:border-slate-800/50 dark:bg-slate-900/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 dark:border-slate-800/50 dark:bg-slate-800/30">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">
                  Short Name
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">
                  Document Name
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">
                  Category
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">
                  Description
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500 text-center">
                  Default
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-widest text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {documentTypes.length > 0 ? (
                documentTypes.map((doc, index) => (
                  <tr
                    key={doc.id || index}
                    className="group transition-all hover:bg-orange-500/5 dark:hover:bg-orange-500/10"
                  >
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {doc.documentTypeShortName}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400">
                          <FileText className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                          {doc.documentTypeName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        {doc.documentTypeCategory || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="line-clamp-1 text-xs font-medium text-slate-400 dark:text-slate-500">
                        {doc.documentTypeDescription || 'No description provided'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center">
                        {doc.documentTypeDefault ? (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
                            <Check className="h-3.5 w-3.5 stroke-3" />
                          </div>
                        ) : (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                            <X className="h-3.5 w-3.5 stroke-3" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          onClick={() => onEdit(doc)}
                          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm border border-slate-200 transition-all hover:scale-110 hover:border-orange-200 hover:text-orange-500 hover:shadow-orange-100 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-orange-900 dark:hover:shadow-none"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDelete(doc.id)}
                          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm border border-slate-200 transition-all hover:scale-110 hover:border-red-200 hover:text-red-500 hover:shadow-red-100 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-red-900 dark:hover:shadow-none"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800/20">
                        <FileText className="h-8 w-8 text-slate-200 dark:text-slate-700" />
                      </div>
                      <p className="text-sm font-medium text-slate-400">No document types found</p>
                      <button
                        onClick={() => setIsDocumentTypeModalOpen(true)}
                        className="text-xs font-bold text-orange-500 hover:underline"
                      >
                        Create your first document type
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default DocumentTypeManagement
