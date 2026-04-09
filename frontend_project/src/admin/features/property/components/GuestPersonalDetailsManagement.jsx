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
import useGuestPersonalDetailsController from '../controllers/useGuestPersonalDetailsController'
import { AuthImage } from '../../../components/common/AuthImage'

/**
 * View: PersonalDetailManagement
 * Guest directory and profile management using MVC architecture.
 */
const GuestPersonalDetailsManagement = ({
  details = [],
  documentDetails = [],
  stayDetails = [],
  guestDetails = [], // New
  rentDetails = [], // New
  documentTypes = [],
  onAdd,
  onEdit,
  onDelete,
  currentPage = 1,
  itemsPerPage = 8,
}) => {
  const {
    stats,
    processedDetails,
    getIndex,
    cleanImageUrl,
    deleteTarget,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
    getGuestDocument,
    getGuestStay,
    getGuestDetail, // New
    getDocumentTypeName,
  } = useGuestPersonalDetailsController({
    details,
    documentDetails,
    stayDetails,
    guestDetails, // New
    documentTypes,
    onDelete,
    currentPage,
    itemsPerPage,
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
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-2.5 text-[11px] font-black tracking-wider text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-600 active:scale-95 sm:w-auto md:px-6 md:text-xs"
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
            className="dark:bg-surface-100 group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-blue-500/30 dark:border-slate-800"
          >
            <div className="flex flex-col">
              <span className="mb-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                {stat.label}
              </span>
              <div className="flex items-end justify-between">
                <h4 className="text-2xl font-bold text-[#1a2b4b] dark:text-slate-100">
                  {stat.value}
                </h4>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 transition-all group-hover:bg-blue-500 group-hover:text-white">
                  <ChevronRight size={16} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Guest Table */}
      <div className="dark:bg-surface-100 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 transition-colors duration-300 dark:border-slate-800 dark:shadow-none">
        <div className="scrollbar-hide max-h-[650px] w-full overflow-auto">
          <table className="w-full min-w-[1400px] border-collapse text-left">
            <thead className="sticky top-0 z-10 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.1)]">
              <tr className="border-b border-slate-200 bg-white/95 text-[11px] font-black tracking-widest text-slate-400 uppercase backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 dark:text-slate-500">
                <th className="w-24 border-r border-slate-100 px-8 py-5 text-center dark:border-slate-800">
                  No.
                </th>
                <th className="border-r border-slate-100 px-8 py-5 dark:border-slate-800">
                  User Name
                </th>
                <th className="border-r border-slate-100 px-8 py-5 dark:border-slate-800">
                  Email Address
                </th>
                <th className="border-r border-slate-100 px-8 py-5 text-center dark:border-slate-800">
                  Phone No.
                </th>
                <th className="border-r border-slate-100 px-8 py-5 dark:border-slate-800">
                  Doc Type
                </th>
                <th className="border-r border-slate-100 px-8 py-5 dark:border-slate-800">
                  Document No.
                </th>
                <th className="border-r border-slate-100 px-8 py-5 text-center dark:border-slate-800">
                  Valid Till
                </th>
                <th className="border-r border-slate-100 px-8 py-5 text-center dark:border-slate-800">
                  Status
                </th>
                <th className="border-r border-slate-100 px-8 py-5 text-center dark:border-slate-800">
                  Total Rent
                </th>
                <th className="px-8 py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[13px] dark:divide-slate-800">
              {processedDetails.length === 0 ? (
                <tr>
                  <td
                    colSpan="10"
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
                processedDetails.map((guest, idx) => {
                  const guestDocument = getGuestDocument(guest.id)
                  const guestStay = getGuestStay(guest.id)
                  const guestDetail = getGuestDetail(guest.id)
                  const rent = guestDetail && rentDetails ? rentDetails.find((r) => String(r.id) === String(guestDetail.rentDetailsId || guestDetail.rentId)) : null
                  return (
                    <tr
                      key={guest.id}
                      className="group h-14 transition-all hover:bg-blue-50/40 dark:hover:bg-blue-500/5"
                    >
                      <td className="border-r border-slate-100 px-8 py-2 text-center font-mono text-[11px] font-bold text-slate-300 group-hover:text-blue-500 dark:border-slate-800 dark:text-slate-600">
                        {getIndex(idx)}
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
                                    src={`https://ui-avatars.com/api/?name=${guest.firstName}+${guest.lastName}&background=3b82f6&color=fff&bold=true`}
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
                        {getDocumentTypeName(guestDocument?.documentType?.id || guestDocument?.documentTypeId)}
                      </td>
                      <td className="border-r border-slate-100 px-8 py-2 font-mono text-[11px] font-bold text-slate-600 dark:border-slate-800 dark:text-slate-400">
                        {guestDocument?.documentNumber || '—'}
                      </td>
                      <td className="border-r border-slate-100 px-8 py-2 text-center font-bold text-blue-600 dark:border-slate-800 dark:text-blue-400/80">
                        {guestDocument?.validTill || '—'}
                      </td>
                      <td className="border-r border-slate-100 px-8 py-2 text-center font-bold text-purple-600 uppercase dark:border-slate-800 dark:text-purple-400/80">
                        {guestStay?.stayStatusEnum || '—'}
                      </td>
                      <td className="border-r border-slate-100 px-8 py-2 text-center font-mono font-bold text-slate-600 dark:border-slate-800 dark:text-slate-300">
                        {rent?.totalCharges ? `₹${rent.totalCharges}` : '—'}
                      </td>
                      <td className="px-8 py-2 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => onEdit(guest, guestDocument, guestStay, guestDetail, rent)}
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
      <AnimatePresence>
        {deleteTarget && (
          <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={handleCancelDelete}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="dark:bg-surface-100 relative z-10 w-full max-w-sm overflow-hidden rounded-[32px] border border-white/20 bg-white p-8 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] dark:border-slate-800"
            >
              <div className="mb-6 flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500 shadow-inner dark:bg-red-500/10">
                  <AlertTriangle size={32} />
                </div>
                <h3 className="text-xl font-black tracking-tight text-slate-800 uppercase dark:text-white">
                  Delete Profile
                </h3>
                <p className="mt-1 text-xs font-bold tracking-wider text-slate-400 uppercase">
                  This action is permanent
                </p>
              </div>

              <p className="mb-8 text-center text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300">
                Are you sure you want to delete profile for{' '}
                <span className="block mt-1 font-black text-red-500 uppercase tracking-tight">"{deleteTarget.name}"</span>?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handleCancelDelete}
                  className="flex-1 rounded-2xl border border-slate-100 py-3.5 text-[11px] font-black tracking-widest text-slate-400 uppercase transition-all hover:bg-slate-50 hover:text-slate-600 dark:border-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-2 rounded-2xl bg-linear-to-r from-red-500 to-red-600 py-3.5 text-[11px] font-black tracking-widest text-white shadow-xl shadow-red-500/30 transition-all hover:translate-y-[-2px] hover:shadow-red-500/40 active:translate-y-px"
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default React.memo(GuestPersonalDetailsManagement)
