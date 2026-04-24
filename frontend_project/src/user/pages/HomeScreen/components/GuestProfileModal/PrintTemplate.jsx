import React from 'react'

const PrintTemplate = ({ formData, room }) => {
  // Use Folio Number to derive a stable, pure Authentication ID
  const authId = (formData.folioNo || '4382-TMP')
    .toString()
    .split('')
    .reverse()
    .join('')
    .substr(0, 8)
    .toUpperCase()

  return (
    <div
      id="print-root"
      className="hidden w-full bg-white pt-10 pr-12 pb-10 pl-12 text-slate-900 print:block"
    >
      <div className="mx-auto w-full max-w-[800px] font-sans">
        {/* TOP ACCENT BAR */}
        <div className="mb-10 flex h-2 w-full">
          <div className="h-full w-1/3 bg-blue-600"></div>
          <div className="h-full w-1/3 bg-slate-800"></div>
          <div className="h-full w-1/3 bg-emerald-500"></div>
        </div>

        {/* HEADER SECTION */}
        <div className="mb-10 flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic">
              Guest Profile
            </h1>
            <p className="mt-1 text-[11px] font-black tracking-[0.2em] text-blue-600 uppercase">
              Registration & Official Folio Record
            </p>
          </div>
          <div className="flex gap-8 text-right">
            <div>
              <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Invoice / Folio
              </div>
              <div className="text-lg font-black text-slate-900">
                #{formData.folioNo || '4382-990'}
              </div>
            </div>
            <div className="rounded-xl bg-slate-900 px-5 py-3 text-white">
              <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Room No.
              </div>
              <div className="text-3xl leading-none font-black">{room?.roomName || '101'}</div>
            </div>
          </div>
        </div>

        {/* TWO COLUMN DATA GRID */}
        <div className="mb-12 grid grid-cols-2 gap-16">
          {/* COLUMN 1: PERSONAL */}
          <div>
            <div className="mb-6 flex items-center gap-3">
              <div className="h-5 w-1 bg-blue-600"></div>
              <h3 className="text-sm font-black tracking-widest text-slate-900 uppercase">
                Guest Identification
              </h3>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-black tracking-widest text-slate-400 uppercase">
                    First Name
                  </label>
                  <p className="border-b border-slate-100 py-1 font-bold text-slate-800 uppercase">
                    {formData.firstName || '-'}
                  </p>
                </div>
                <div>
                  <label className="text-[9px] font-black tracking-widest text-slate-400 uppercase">
                    Last Name
                  </label>
                  <p className="border-b border-slate-100 py-1 font-bold text-slate-800 uppercase">
                    {formData.lastName || '-'}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-[9px] font-black tracking-widest text-slate-400 uppercase">
                  Organization / Company
                </label>
                <p className="border-b border-slate-100 py-1 font-bold text-slate-800 uppercase">
                  {formData.companyName || 'Individual'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-black tracking-widest text-slate-400 uppercase">
                    Contact Number
                  </label>
                  <p className="border-b border-slate-100 py-1 font-bold text-slate-800">
                    {formData.phone || '-'}
                  </p>
                </div>
                <div>
                  <label className="text-[9px] font-black tracking-widest text-slate-400 uppercase">
                    Email Address
                  </label>
                  <p className="border-b border-slate-100 py-1 font-bold text-slate-800 lowercase">
                    {formData.email || '-'}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-[9px] font-black tracking-widest text-slate-400 uppercase">
                  Permanent Residence
                </label>
                <p className="py-1 text-xs leading-relaxed font-bold text-slate-700 uppercase">
                  {formData.address || '-'}
                </p>
              </div>
            </div>
          </div>

          {/* COLUMN 2: ACCOMMODATION */}
          <div>
            <div className="mb-6 flex items-center gap-3">
              <div className="h-5 w-1 bg-amber-500"></div>
              <h3 className="text-sm font-black tracking-widest text-slate-900 uppercase">
                Stay Specifications
              </h3>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6">
              <div className="grid grid-cols-2 gap-y-6">
                <div>
                  <label className="text-[9px] font-black tracking-widest text-slate-400 uppercase">
                    Check-In
                  </label>
                  <p className="text-sm font-black text-slate-800 uppercase">
                    {formData.checkInDate || '-'}
                  </p>
                  <p className="text-[10px] font-bold text-slate-500">
                    {formData.checkInTime || ''}
                  </p>
                </div>
                <div>
                  <label className="text-[9px] font-black tracking-widest text-slate-400 uppercase">
                    Check-Out
                  </label>
                  <p className="text-sm font-black text-slate-800 uppercase">
                    {formData.checkOutDate || '-'}
                  </p>
                  <p className="text-[10px] font-bold text-slate-500">
                    {formData.checkOutTime || ''}
                  </p>
                </div>
                <div>
                  <label className="text-[9px] font-black tracking-widest text-slate-400 uppercase">
                    Stay Duration
                  </label>
                  <p className="text-sm font-black text-slate-800">
                    {formData.noOfDays || '1'} Nights
                  </p>
                </div>
                <div>
                  <label className="text-[9px] font-black tracking-widest text-slate-400 uppercase">
                    Guest Status
                  </label>
                  <span className="inline-block rounded-md bg-blue-600 px-2 py-0.5 text-[9px] font-black text-white uppercase">
                    {formData.guestDetailsStatus || 'RES'}
                  </span>
                </div>
                <div className="col-span-2">
                  <label className="text-[9px] font-black tracking-widest text-slate-400 uppercase">
                    Booking Reference (CRS)
                  </label>
                  <p className="font-mono text-xs font-black tracking-tighter text-slate-600">
                    {formData.crsFolioNo || 'CRS-AUTO-PENDING'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BILLING TABLE */}
        <div className="mb-12">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-5 w-1 bg-emerald-500"></div>
              <h3 className="text-sm font-black tracking-widest text-slate-900 uppercase">
                Financial Audit Summary
              </h3>
            </div>
            <div className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">
              Currency: INR (₹)
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border-2 border-slate-900">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="px-6 py-4 text-[10px] font-black tracking-[0.2em] uppercase">
                    Description
                  </th>
                  <th className="px-6 py-4 text-right text-[10px] font-black tracking-[0.2em] uppercase">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-slate-100">
                  <td className="px-6 py-4 font-bold text-slate-500 uppercase italic">
                    Base Room Revenue
                  </td>
                  <td className="px-6 py-4 text-right font-black tracking-tight text-slate-800">
                    {Number(formData.basic || 0).toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="px-6 py-3 font-bold text-slate-500 uppercase italic">
                    Service Tax & Levies
                  </td>
                  <td className="px-6 py-3 text-right font-black tracking-tight text-slate-800">
                    +{' '}
                    {Number(formData.taxAmount || 0).toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="px-6 py-3 font-bold text-slate-500 uppercase italic">
                    Sundries / Other Charges
                  </td>
                  <td className="px-6 py-3 text-right font-black tracking-tight text-slate-800">
                    +{' '}
                    {Number(formData.otherCharges || 0).toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="px-6 py-3 font-bold text-slate-500 uppercase italic">
                    Discounts / Rebates
                  </td>
                  <td className="px-6 py-3 text-right font-black tracking-tight text-red-600">
                    -{' '}
                    {Number(formData.discount || 0).toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                </tr>
                <tr className="border-b-2 border-slate-900 bg-slate-50">
                  <td className="px-6 py-4 text-base font-black text-slate-900 uppercase">
                    Gross Total Revenue
                  </td>
                  <td className="px-6 py-4 text-right text-base font-black tracking-tighter text-slate-900">
                    ₹{' '}
                    {Number(formData.totalCharges || 0).toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="px-6 py-3 font-bold text-emerald-600 uppercase italic">
                    Payments & Deposits Recevied
                  </td>
                  <td className="px-6 py-3 text-right font-black tracking-tight text-emerald-600">
                    (
                    {(
                      Number(formData.payments || 0) + Number(formData.deposite || 0)
                    ).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    )
                  </td>
                </tr>

                {/* FINAL BALANCE BOX */}
                <tr className="bg-emerald-500 text-white">
                  <td className="px-6 py-6 text-xl font-black tracking-tighter uppercase">
                    Net Outstanding Balance
                  </td>
                  <td className="px-6 py-6 text-right text-3xl font-black tracking-tighter">
                    ₹{' '}
                    {Number(formData.balance || 0).toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* SIGNATURE SECTION */}
        <div className="mt-20 grid grid-cols-2 gap-20">
          <div className="text-center">
            <div className="flex h-24 flex-col justify-end">
              {formData.signature ? (
                <img
                  src={
                    formData.signature.startsWith('http')
                      ? formData.signature
                      : `/user/${formData.signature}`
                  }
                  className="mx-auto max-h-20 object-contain mix-blend-multiply transition-all hover:scale-110"
                  alt="Signature"
                />
              ) : (
                <div className="mb-4 h-px w-full bg-slate-300"></div>
              )}
            </div>
            <div className="h-px bg-slate-900"></div>
            <div className="mt-4 text-[10px] font-black tracking-[0.3em] text-slate-900 uppercase">
              Guest Endorsement
            </div>
          </div>

          <div className="text-center">
            <div className="flex h-24 items-end justify-center pb-4">
              <div className="text-sm font-black tracking-widest text-slate-900 uppercase italic">
                Verified Official
              </div>
            </div>
            <div className="h-px bg-slate-900"></div>
            <div className="mt-4 text-[10px] font-black tracking-[0.3em] text-slate-900 uppercase">
              Authorized Control
            </div>
          </div>
        </div>

        {/* FOOTER LEGAL */}
        <div className="mt-16 flex items-center justify-between border-t border-slate-100 pt-8">
          <div className="text-[8px] font-black tracking-[0.2em] text-slate-300 uppercase">
            Authentication ID: {authId}
          </div>
          <div className="text-[8px] font-black tracking-[0.2em] text-slate-400 uppercase">
            © {new Date().getFullYear()} PMS Property Engine • System Generated Invoice
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrintTemplate
