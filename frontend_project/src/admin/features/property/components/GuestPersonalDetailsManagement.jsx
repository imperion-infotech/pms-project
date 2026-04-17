import React from 'react'
import {
  Mail,
  Phone,
  Trash2,
  Plus,
  User,
  AlertTriangle,
  X,
  UserCircle2,
  PlusCircle,
  Pencil,
} from 'lucide-react'
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
    getRentDetail,
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
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-700">
      {/* Header & Action Bar */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 shadow-sm transition-all hover:scale-110">
            <UserCircle2 className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">
              User Personal Details
            </h2>
            <p className="text-xs font-medium text-slate-400">
              Manage and organize user profile information
            </p>
          </div>
        </div>

        <button
          onClick={onAdd}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 hover:shadow-blue-500/40 active:scale-95"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add New Profile</span>
        </button>
      </div>


      {/* Main Table Layer */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/60 bg-white/80 shadow-2xl shadow-slate-200/40 backdrop-blur-xl transition-all hover:shadow-slate-300/50 dark:border-slate-800/50 dark:bg-slate-900/80">
        <div className="scrollbar-hide max-h-[650px] w-full overflow-auto">
          <table className="w-full border-collapse text-left">
            <thead className="sticky top-0 z-10">
              <tr className="border-b border-slate-100 bg-slate-50/50 dark:border-slate-800/50 dark:bg-slate-800/30">
                <th className="px-6 py-4 text-center text-xs font-bold tracking-widest text-slate-500 uppercase">No.</th>
                <th className="px-6 py-4 text-xs font-bold tracking-widest text-slate-500 uppercase">User Name</th>
                <th className="px-6 py-4 text-xs font-bold tracking-widest text-slate-500 uppercase">Email Address</th>
                <th className="px-6 py-4 text-center text-xs font-bold tracking-widest text-slate-500 uppercase">Phone No.</th>
                <th className="px-6 py-4 text-center text-xs font-bold tracking-widest text-slate-500 uppercase">Doc Type</th>
                <th className="px-6 py-4 text-xs font-bold tracking-widest text-slate-500 uppercase">Document No.</th>
                <th className="px-6 py-4 text-center text-xs font-bold tracking-widest text-slate-500 uppercase">Valid Till</th>
                <th className="px-6 py-4 text-center text-xs font-bold tracking-widest text-slate-500 uppercase">Status</th>
                <th className="px-6 py-4 text-center text-xs font-bold tracking-widest text-slate-500 uppercase">Total Rent</th>
                <th className="px-6 py-4 text-center text-xs font-bold tracking-widest text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {processedDetails.length === 0 ? (
                <tr>
                  <td colSpan="10" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800/20">
                        <UserCircle2 className="h-8 w-8 text-slate-200 dark:text-slate-700" />
                      </div>
                      <p className="text-sm font-medium text-slate-400">No guest profiles defined</p>
                      <button onClick={onAdd} className="text-xs font-bold text-blue-500 hover:underline">Add your first profile</button>
                    </div>
                  </td>
                </tr>
              ) : (
                processedDetails.map((guest, idx) => {
                  const guestDetail = getGuestDetail(guest.id)
                  const guestDocument = getGuestDocument(guest.id, guestDetail)
                  const guestStay = getGuestStay(guest.id, guestDetail)
                  // Improved rent lookup: use controller's robust ID extraction
                  const rentId = getRentDetail(guestDetail)
                  const rent = rentId && rentDetails ? rentDetails.find((r) => String(r.id) === rentId) : null
                  return (
                    <tr
                      key={guest.id}
                      className="group h-16 transition-all hover:bg-slate-50/50 dark:hover:bg-blue-500/5"
                    >
                      <td className="px-8 py-2 text-center font-mono text-xs font-bold text-blue-400 group-hover:text-blue-600">
                        {getIndex(idx)}
                      </td>
                      <td className="px-8 py-2">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-slate-100 dark:ring-slate-800">
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
                              <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
                                <User size={18} />
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold tracking-tight text-[#1a2b4b] uppercase dark:text-slate-200">
                              {guest.firstName} {guest.lastName}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-2 font-mono text-slate-400 lowercase">
                        {guest.email || '—'}
                      </td>
                      <td className="px-8 py-2 text-center font-bold text-[#1a2b4b] dark:text-slate-400">
                        {guest.phone || '—'}
                      </td>
                      <td className="px-8 py-2 text-center font-bold text-blue-500 uppercase">
                        {getDocumentTypeName(guestDocument?.documentType?.id || guestDocument?.documentTypeId)}
                      </td>
                      <td className="px-8 py-2 font-mono text-xs font-bold text-slate-600 dark:text-slate-400">
                        {guestDocument?.documentNumber || '—'}
                      </td>
                      <td className="px-8 py-2 text-center font-bold text-blue-600 dark:text-blue-400/80">
                        {guestDocument?.validTill || '—'}
                      </td>
                      <td className="px-8 py-2 text-center text-purple-600 dark:text-purple-400/80">
                        <span className="font-bold uppercase tracking-tight">
                          {guestDetail?.guestDetailsStatus || guestStay?.stayStatusEnum || '—'}
                        </span>
                      </td>
                      <td className="px-8 py-2 text-center font-mono font-bold text-[#1a2b4b] dark:text-slate-300">
                        {rent?.totalCharges ? `₹${rent.totalCharges}` : '—'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                          <button onClick={() => {
                            console.log('[DEBUG] ===== EDIT BUTTON CLICKED =====')
                            console.log('[DEBUG] guest (personalDetail):', guest)
                            console.log('[DEBUG] guestDocument:', guestDocument)
                            console.log('[DEBUG] guestStay:', guestStay)
                            console.log('[DEBUG] guestDetail:', guestDetail)
                            console.log('[DEBUG] rent:', rent)
                            console.log('[DEBUG] All guestDetails:', guestDetails)
                            console.log('[DEBUG] All stayDetails:', stayDetails)
                            console.log('[DEBUG] All documentDetails:', documentDetails)
                            console.log('[DEBUG] All rentDetails:', rentDetails)
                            console.log('[DEBUG] ================================')
                            onEdit(guest, guestDocument, guestStay, guestDetail, rent)
                          }} className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 shadow-sm transition-all hover:scale-110 hover:border-blue-200 hover:text-blue-500 hover:shadow-blue-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-900 dark:hover:shadow-none" title="Edit Profile">
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDeleteClick(guest)} className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 shadow-sm transition-all hover:scale-110 hover:border-red-200 hover:text-red-500 hover:shadow-red-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-red-900 dark:hover:shadow-none" title="Delete Profile">
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

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={handleCancelDelete} />
          <div className="animate-in zoom-in-95 relative z-10 w-full max-w-sm overflow-hidden rounded-3xl border border-red-100 bg-white p-6 shadow-2xl transition-all dark:border-red-900/30 dark:bg-slate-900">
            <div className="mb-4 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500 dark:bg-red-500/10">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Delete Profile</h3>
                <p className="text-xs font-medium tracking-widest text-slate-400 uppercase">Permanent Action</p>
              </div>
              <button onClick={handleCancelDelete} className="ml-auto rounded-lg p-1 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700">
                <X className="h-4 w-4 text-slate-400" />
              </button>
            </div>
            <p className="mb-8 text-sm leading-relaxed font-medium text-slate-500 dark:text-slate-400">
              Are you sure you want to delete profile for{' '}
              <span className="font-bold text-slate-800 dark:text-slate-100">"{deleteTarget.name}"</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={handleCancelDelete} className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-400 transition-all hover:bg-slate-50 hover:text-slate-600 dark:border-slate-800 dark:hover:bg-slate-800">Cancel</button>
              <button onClick={handleConfirmDelete} className="flex-1 rounded-xl bg-red-500 py-3 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition-all hover:bg-red-600 active:scale-95">Delete Now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default React.memo(GuestPersonalDetailsManagement)
