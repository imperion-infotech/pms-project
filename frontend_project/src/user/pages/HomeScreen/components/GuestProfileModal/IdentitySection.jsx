import React from 'react'
import { User, Camera, Loader2, Save, X, Building, Phone, Mail, ShieldCheck, Plus, Edit, Trash2 } from 'lucide-react'
import { AuthImage } from '../../../../../admin/components/common/AuthImage'

const IdentitySection = ({
  formData,
  handleChange,
  handleImageSelect,
  handleImageClear,
  uploadingType,
  cleanImageUrl,
  labelClass,
  inputContainerClass,
  iconClass,
  inputClass,
  cardClass,
  toggleDocForm,
  handleDeleteDocument,
  documentDetails,
  documentTypes,
  profile,
  room,
}) => {
  return (
    <div className="flex w-full flex-col border-b border-slate-100 bg-white transition-all lg:w-[32%] lg:border-r lg:border-b-0 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-2 px-3 py-1.5 text-left">
        <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
          <ShieldCheck size={10} className="text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-pms-micro font-black tracking-widest text-slate-800 uppercase dark:text-slate-200">
          Personal Information
        </h3>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto px-3 pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* Integrated Asset Capture */}
        <div className={cardClass}>
          <div className="flex items-start gap-3">
            <div className="group relative">
              <div className="h-24 w-24 overflow-hidden rounded-[20px] border-4 border-white bg-slate-100 shadow-md dark:border-slate-800 dark:bg-slate-900">
                {formData.profilePhoto ? (
                  <AuthImage
                    src={`/user/${cleanImageUrl(formData.profilePhoto)}`}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center text-slate-300 dark:text-slate-600">
                    <User size={32} />
                    <span className="text-pms-micro mt-1 font-bold tracking-wider uppercase">
                      Photo
                    </span>
                  </div>
                )}
                {uploadingType === 'profilePhoto' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                  </div>
                )}
              </div>
              <label className="absolute -right-2 -bottom-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl bg-blue-500 text-white shadow-lg ring-2 ring-white transition-transform hover:scale-110 dark:ring-slate-900">
                <Camera size={14} />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleImageSelect(e.target.files[0], 'profilePhoto')}
                />
              </label>
            </div>

            <div className="flex h-24 flex-1 flex-col justify-end space-y-2">
              <div className="relative flex-1 rounded-[18px] border-2 border-dashed border-slate-200 bg-white p-1.5 text-center transition-colors hover:border-blue-400 dark:border-slate-700 dark:bg-slate-800">
                {formData.signature ? (
                  <div className="relative flex h-full items-center justify-center">
                    <AuthImage
                      src={`/user/${cleanImageUrl(formData.signature)}`}
                      alt="Signature"
                      className="max-h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => handleImageClear('signature')}
                      className="absolute -top-2 -right-2 rounded-full bg-red-100 p-1.5 text-red-500 shadow-sm transition-colors hover:bg-red-500 hover:text-white"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center">
                    <Save size={20} className="mb-1 text-slate-300" />
                    <p className="text-pms-micro font-bold tracking-widest text-slate-400 uppercase">
                      Digital Signature
                    </p>
                  </div>
                )}
                <label className="absolute inset-0 cursor-pointer opacity-0">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleImageSelect(e.target.files[0], 'signature')}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="text-pms-tiny font-black tracking-widest text-blue-500 uppercase">
              Background Info
            </span>
            <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800"></div>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            <div>
              <label className={labelClass}>
                First Name <span className="text-red-500">*</span>
              </label>
              <div className={inputContainerClass}>
                <User size={14} className={iconClass} />
                <input
                  required
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="John"
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>
                Last Name <span className="text-red-500">*</span>
              </label>
              <div className={inputContainerClass}>
                <User size={14} className={iconClass} />
                <input
                  required
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Doe"
                />
              </div>
            </div>
            <div className="col-span-2">
              <label className={labelClass}>Company Name</label>
              <div className={inputContainerClass}>
                <Building size={14} className={iconClass} />
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Inc. Pvt Ltd"
                />
              </div>
            </div>
            <div className="col-span-2">
              <label className="text-pms-micro font-bold text-slate-400 uppercase">
                Contact Info Type
              </label>
              <select
                name="contactInformationTypeEnum"
                value={formData.contactInformationTypeEnum}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="HOME">HOME</option>
                <option value="OFFICE">OFFICE</option>
                <option value="OTHER">OTHER</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>
                {formData.contactInformationTypeEnum} Phone{' '}
                <span className="text-red-500">*</span>
              </label>
              <div className={inputContainerClass}>
                <Phone size={14} className={iconClass} />
                <input
                  required
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Phone No."
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>
                {formData.contactInformationTypeEnum} Email{' '}
                <span className="text-red-500">*</span>
              </label>
              <div className={inputContainerClass}>
                <Mail size={14} className={iconClass} />
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Email address"
                />
              </div>
            </div>
            <div className="col-span-2">
              <label className="text-pms-micro font-bold text-slate-400 uppercase">
                {formData.contactInformationTypeEnum} Full Address{' '}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows="2"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="mt-1 w-full resize-none rounded-md border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-800 transition-all outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                placeholder="Address details..."
              />
            </div>
          </div>
        </div>

        {/* Documentation Table */}
        <div className="rounded-lg border border-blue-100/50 bg-blue-50/50 p-4 dark:border-blue-900/30 dark:bg-blue-900/10">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-pms-tiny font-black tracking-widest text-blue-600 uppercase dark:text-blue-400">
              ID Documents
            </span>
            <button
              type="button"
              onClick={() => toggleDocForm()}
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500 text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-600 active:scale-95"
            >
              <Plus size={14} />
            </button>
          </div>
          <div className="overflow-hidden rounded-lg border border-blue-100/50 bg-white dark:border-blue-900/20 dark:bg-slate-900">
            <table className="w-full text-left font-bold">
              <thead className="bg-blue-50/50 dark:bg-blue-900/20">
                <tr className="text-pms-micro font-black tracking-wider text-slate-400 uppercase">
                  <th className="px-3 py-2">Action</th>
                  <th className="px-3 py-2">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {(profile?.id || room?.personalDetailId
                  ? documentDetails
                  : formData.documents || []
                ).length > 0 ? (
                  (profile?.id || room?.personalDetailId
                    ? documentDetails
                    : formData.documents || []
                  ).map((doc, idx) => {
                    const docType = documentTypes.find(
                      (t) => String(t.id) === String(doc.documentTypeId),
                    )
                    return (
                      <tr key={doc.id || idx} className="text-pms-tiny">
                        <td className="px-3 py-2">
                          <div className="flex gap-2 text-slate-400">
                            <button
                              type="button"
                              onClick={() => toggleDocForm(idx)}
                              className="hover:text-blue-500"
                            >
                              <Edit size={12} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteDocument(doc, idx)}
                              className="hover:text-red-500"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <div className="font-bold text-slate-700 dark:text-slate-300">
                            {docType?.documentTypeName}
                          </div>
                          <div className="text-pms-micro text-slate-400">
                            {doc.documentNumber}
                          </div>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="2"
                      className="text-pms-micro px-3 py-4 text-center font-bold text-slate-400"
                    >
                      No Documents
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IdentitySection
