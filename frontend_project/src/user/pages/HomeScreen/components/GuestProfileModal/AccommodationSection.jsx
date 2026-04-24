import React from 'react'
import { CalendarCheck } from 'lucide-react'
import GuestInformation from '../../../../../components/common/GuestInformation'
import StaySpecifications from '../../../../../components/common/StaySpecifications'

const AccommodationSection = ({
  formData,
  setFormData,
  handleChange,
  buildings,
  floors,
  roomTypes,
  rooms,
  roomStatuses,
  isDark,
}) => {
  return (
    <div className="flex w-full flex-col border-b border-slate-100 bg-slate-50/50 transition-all lg:w-[46%] lg:border-r lg:border-b-0 dark:border-slate-800 dark:bg-slate-800/10">
      <div
        className={`flex items-center gap-2 border-b px-4 py-3 text-left ${isDark ? 'border-slate-800' : 'border-slate-100'}`}
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500 shadow-lg shadow-amber-500/20">
          <CalendarCheck size={12} className="text-white" />
        </div>
        <h3 className="text-pms-tiny font-black tracking-widest text-slate-800 uppercase dark:text-slate-200">
          Accomodation Information
        </h3>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center gap-3">
            <span className="text-pms-tiny font-black tracking-widest text-amber-500 uppercase">
              Guest Details
            </span>
            <div className="h-px flex-1 bg-amber-50 dark:bg-amber-900/20"></div>
          </div>
          <GuestInformation
            formData={formData}
            handleChange={(e) => {
              const { name, value } = e.target
              let updated = { ...formData, [name]: value }
              if (name === 'noOfDays' || name === 'checkInDate') {
                const days =
                  parseInt(name === 'noOfDays' ? value : formData.noOfDays || 1) || 1
                const start = name === 'checkInDate' ? value : formData.checkInDate
                if (start) {
                  const [y, m, d] = start.split('-').map(Number)
                  const date = new Date(y, m - 1, d)
                  date.setDate(date.getDate() + days)
                  updated.checkOutDate = [
                    date.getFullYear(),
                    String(date.getMonth() + 1).padStart(2, '0'),
                    String(date.getDate()).padStart(2, '0'),
                  ].join('-')
                  updated.noOfDays = days
                }
              } else if (name === 'checkOutDate') {
                if (formData.checkInDate && value) {
                  const [y1, m1, d1] = formData.checkInDate.split('-').map(Number)
                  const [y2, m2, d2] = value.split('-').map(Number)
                  const start = new Date(y1, m1 - 1, d1)
                  const end = new Date(y2, m2 - 1, d2)
                  const diff = Math.round((end - start) / (1000 * 60 * 60 * 24))
                  updated.noOfDays = diff >= 0 ? diff : 0
                }
              }
              setFormData(updated)
            }}
            isDark={isDark}
          />
        </div>

        <div className="rounded-lg border border-amber-100/50 bg-amber-50/50 p-2 dark:border-amber-900/20 dark:bg-amber-900/5">
          <div className="mb-1.5 flex items-center gap-3">
            <span className="text-pms-micro font-black tracking-widest text-amber-600 uppercase dark:text-amber-400">
              Booking & Unit Allocation
            </span>
            <div className="h-px flex-1 bg-amber-200/50 dark:bg-amber-800/30"></div>
          </div>
          <StaySpecifications
            formData={formData}
            handleChange={handleChange}
            buildings={buildings}
            floors={floors}
            roomTypes={roomTypes}
            rooms={rooms}
            roomStatuses={roomStatuses}
            isDark={isDark}
            showStatus={true}
          />
        </div>
      </div>
    </div>
  )
}

export default AccommodationSection
