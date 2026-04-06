import React from 'react'
import {
  Building,
  Mail,
  Phone,
  MapPin,
  Trash2,
  Plus,
  User,
  AlertTriangle,
  X,
  Search,
  ShieldCheck,
  ChevronRight,
  UserCircle2,
  Edit3,
  PlusCircle,
  Pencil,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import usePersonalDetailController from '../controllers/usePersonalDetailController'
import { AuthImage } from '../../../components/common/AuthImage'

/**
 * View: PersonalDetailManagement
 * Guest directory and profile management using MVC architecture.
 */
const PersonalDetailManagement = ({
  details = [],
  documentDetails = [],
  stayDetails = [],
  guestDetails = [], // New
  documentTypes = [],
  onAdd,
  onEdit,
  onDelete,
}) => {
  const {
    stats,
    cleanImageUrl,
    deleteTarget,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
    getGuestDocument,
    getGuestStay,
    getGuestDetail, // New
    getDocumentTypeName,
  } = usePersonalDetailController({
    details,
    documentDetails,
    stayDetails,
    guestDetails, // New
    documentTypes,
    onDelete,
  })

  /* ... skipping unchanged ... */

  return (
    <div className="space-y-6">
      {/* Search and Action Bar */}
      <div className="dark:bg-surface-100 flex flex-col items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-md transition-colors duration-300 sm:flex-row sm:p-6 dark:border-slate-800">
        <div className="text-center sm:text-left">
          <h2 className="font-heading text-lg font-bold tracking-tight text-[#1a2b4b] md:text-xl dark:text-slate-100">
            User Personal Details
          </h2>
          <p className="text-xs font-medium text-slate-400 md:text-sm">
            Manage and organize user profile information
          </p>
        </div>

        <button
          onClick={onAdd}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-[11px] font-black tracking-wider text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-600 active:scale-95 sm:w-auto md:px-6 md:text-xs"
        >
          <PlusCircle size={18} />
          ADD NEW PROFILE
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="dark:bg-surface-100 group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-emerald-500/30 dark:border-slate-800"
          >
            <div className="flex flex-col">
              <span className="mb-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                {stat.label}
              </span>
              <div className="flex items-end justify-between">
                <h4 className="text-2xl font-bold text-[#1a2b4b] dark:text-slate-100">
                  {stat.value}
                </h4>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 transition-all group-hover:bg-emerald-500 group-hover:text-white">
                  <ChevronRight size={16} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Guest Table */}
      <div className="dark:bg-surface-100 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md transition-colors duration-300 dark:border-slate-800">
        <div className="custom-scrollbar max-h-[600px] w-full overflow-auto">
          <table className="w-full min-w-[1400px] border-collapse text-left">
            <thead className="sticky top-0 z-10">
              <tr className="border-b border-slate-200 bg-[#f8fafc] text-[11px] font-bold tracking-wider text-[#64748b] uppercase dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400">
                <th className="w-24 border-r border-slate-200 px-8 py-4 text-center dark:border-slate-800">
                  No.
                </th>
                <th className="border-r border-slate-200 px-8 py-4 dark:border-slate-800">
                  User Name
                </th>
                <th className="border-r border-slate-200 px-8 py-4 dark:border-slate-800">
                  Email Address
                </th>
                <th className="border-r border-slate-200 px-8 py-4 text-center dark:border-slate-800">
                  Phone No.
                </th>
                <th className="border-r border-slate-200 px-8 py-4 dark:border-slate-800">
                  Doc Type
                </th>
                <th className="border-r border-slate-200 px-8 py-4 dark:border-slate-800">
                  Document No.
                </th>
                <th className="border-r border-slate-200 px-8 py-4 text-center dark:border-slate-800">
                  Valid Till
                </th>
                <th className="px-8 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[13px] dark:divide-slate-800">
              {details.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-8 py-20 text-center text-slate-400 dark:text-slate-500"
                  >
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <AlertTriangle className="h-10 w-10 opacity-20" />
                      <p className="text-[10px] font-medium tracking-widest uppercase">
                        No guest profiles defined
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                details.map((guest, idx) => {
                  const guestDocument = getGuestDocument(guest.id)
                  const guestStay = getGuestStay(guest.id)
                  const guestDetail = getGuestDetail(guest.id) // New
                  return (
                    <tr
                      key={guest.id}
                      className="group h-14 transition-all hover:bg-emerald-50/40 dark:hover:bg-emerald-500/5"
                    >
                      <td className="border-r border-slate-100 px-8 py-2 text-center font-mono text-[11px] font-bold text-slate-300 group-hover:text-emerald-500 dark:border-slate-800 dark:text-slate-600">
                        {idx + 1}
                      </td>
                      <td className="border-r border-slate-100 px-8 py-2 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 overflow-hidden rounded-full border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
                            {cleanImageUrl(guest.profilePhoto) ? (
                              <AuthImage
                                src={`/user/${cleanImageUrl(guest.profilePhoto)}`}
                                alt="Profile"
                                className="h-full w-full object-cover"
                                fallback={
                                  <img
                                    src={`https://ui-avatars.com/api/?name=${guest.firstName}+${guest.lastName}&background=334155&color=fff&bold=true`}
                                    alt="Profile"
                                    className="h-full w-full object-cover"
                                  />
                                }
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-slate-400">
                                <User size={14} />
                              </div>
                            )}
                          </div>
                          <span className="font-bold tracking-tight text-slate-800 uppercase dark:text-slate-200">
                            {guest.firstName} {guest.lastName}
                          </span>
                        </div>
                      </td>
                      <td className="border-r border-slate-100 px-8 py-2 font-mono text-slate-500 lowercase dark:border-slate-800 dark:text-slate-400">
                        {guest.email || '—'}
                      </td>
                      <td className="border-r border-slate-100 px-8 py-2 text-center font-bold text-slate-600 dark:border-slate-800 dark:text-slate-400">
                        {guest.phone || '—'}
                      </td>
                      <td className="border-r border-slate-100 px-8 py-2 font-bold text-blue-600 uppercase dark:border-slate-800 dark:text-blue-400/80">
                        {getDocumentTypeName(guestDocument?.documentTypeId)}
                      </td>
                      <td className="border-r border-slate-100 px-8 py-2 font-mono text-[11px] font-bold text-slate-600 dark:border-slate-800 dark:text-slate-400">
                        {guestDocument?.documentNumber || '—'}
                      </td>
                      <td className="border-r border-slate-100 px-8 py-2 text-center font-bold text-emerald-600 dark:border-slate-800 dark:text-emerald-400/80">
                        {guestDocument?.validTill || '—'}
                      </td>
                      <td className="px-8 py-2 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => onEdit(guest, guestDocument, guestStay, guestDetail)}
                            className="rounded-lg p-1.5 text-blue-500 transition-colors hover:bg-blue-50 dark:hover:bg-blue-500/10"
                            title="Edit Profile"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(guest)}
                            className="rounded-lg p-1.5 text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
                            title="Delete Profile"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Custom Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={handleCancelDelete}
          />
          <div className="dark:bg-surface-100 relative z-10 w-full max-w-sm rounded-2xl border border-red-100 bg-white p-6 shadow-2xl dark:border-red-900/30">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/10">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  Delete Profile
                </h3>
                <p className="text-xs text-slate-400">This action cannot be undone.</p>
              </div>
              <button
                onClick={handleCancelDelete}
                className="ml-auto rounded-lg p-1 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X className="h-4 w-4 text-slate-400" />
              </button>
            </div>
            <p className="mb-6 text-sm font-medium text-slate-600 dark:text-slate-300">
              Are you sure you want to delete profile{' '}
              <span className="font-bold text-red-500">"{deleteTarget.name}"</span>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCancelDelete}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-500 transition-all hover:bg-slate-50 hover:text-slate-800 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-2 rounded-xl bg-red-500 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition-all hover:bg-red-600 active:scale-95"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default React.memo(PersonalDetailManagement)
