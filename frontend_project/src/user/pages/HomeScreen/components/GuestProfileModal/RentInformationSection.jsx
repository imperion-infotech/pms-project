import React from 'react'
import { Receipt } from 'lucide-react'
import RentDetails from '../../../../../components/common/RentDetails'

const RentInformationSection = ({ formData, setFormData, taxes, isDark }) => {
  return (
    <div className="flex w-full flex-col bg-slate-50 transition-all lg:w-[22%] dark:bg-slate-900/50">
      <div className="flex items-center gap-2 px-3 py-1.5 text-left">
        <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
          <Receipt size={10} className="text-emerald-600 dark:text-emerald-400" />
        </div>
        <h3 className="text-pms-micro font-black tracking-widest text-slate-800 uppercase dark:text-slate-200">
          Rent Information
        </h3>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto px-3 pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex h-full flex-col overflow-hidden rounded-xl border border-emerald-100 bg-white p-4 shadow-xl shadow-emerald-500/5 transition-all hover:shadow-emerald-500/10 dark:border-emerald-900/20 dark:bg-slate-900">
          <RentDetails
            formData={formData}
            handleChange={(e) => {
              const { name, value } = e.target
              let updated = { ...formData, [name]: value }

              const basic = Number(name === 'basic' ? value : formData.basic) || 0
              const currentTaxId = name === 'taxId' ? value : formData.taxId
              const selectedTax = taxes.find((t) => String(t.id) === String(currentTaxId))

              if (selectedTax) {
                const taxRate = Number(selectedTax.amount) || 0
                const taxAmt = (basic * taxRate) / 100
                updated.taxAmount = taxAmt.toFixed(2)
                updated.totalRental = (basic + taxAmt).toFixed(2)
              } else if (name === 'taxId' && !value) {
                updated.taxAmount = '0.00'
                updated.totalRental = basic.toFixed(2)
              }

              // Chain update for Total Charges and Balance if relevant
              const totalRent = Number(updated.totalRental || formData.totalRental) || 0
              const other = Number(name === 'otherCharges' ? value : formData.otherCharges) || 0
              const disc = Number(name === 'discount' ? value : formData.discount) || 0
              const totalChg = totalRent + other - disc
              updated.totalCharges = totalChg.toFixed(2)

              const pay = Number(name === 'payments' ? value : formData.payments) || 0
              const dep = Number(name === 'deposite' ? value : formData.deposite) || 0
              updated.balance = (totalChg - pay - dep).toFixed(2)

              setFormData(updated)
            }}
            taxes={taxes}
            isDark={isDark}
          />
        </div>
      </div>
    </div>
  )
}

export default RentInformationSection
