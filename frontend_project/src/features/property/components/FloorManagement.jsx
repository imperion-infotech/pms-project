import React from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { PlusCircle, Pencil, Trash2, Layers, Info } from 'lucide-react'
import useFloorController from '../hooks/useFloorController'

/**
 * View: FloorManagement
 * Purely presentational component that renders the floor management table.
 */
const FloorManagement = ({
  floors = [],
  setIsFloorModalOpen,
  onEdit,
  onDelete,
  currentPage = 1,
  itemsPerPage = 8,
}) => {
  const { processedFloors, getIndex } = useFloorController({
    floors,
    currentPage,
    itemsPerPage,
  })

  return (
    <Motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-glass overflow-hidden rounded-3xl border border-white/5 shadow-2xl transition-all duration-500"
    >
      {/* Header Section */}
      <div className="flex flex-col justify-between gap-6 border-b border-white/5 bg-gradient-to-br from-indigo-500/5 to-transparent p-6 md:p-8 lg:flex-row lg:items-center">
        <div className="flex items-start gap-4">
          <div className="bg-brand/10 border-brand/20 rounded-2xl border p-3">
            <Layers className="text-brand h-6 w-6" />
          </div>
          <div>
            <h2 className="flex items-center gap-3 text-2xl font-bold tracking-tight text-white">
              Floor System
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold tracking-wider text-emerald-400 uppercase">
                Active
              </span>
            </h2>
            <p className="mt-1 text-sm font-medium tracking-[0.1em] text-slate-400 uppercase opacity-80">
              PHYSICAL LEVEL ORGANIZATION
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsFloorModalOpen(true)}
          className="group bg-brand hover:bg-brand-hover shadow-brand/25 relative flex items-center justify-center gap-3 overflow-hidden rounded-2xl px-8 py-3.5 text-sm font-bold text-white shadow-xl transition-all active:scale-95"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
          <PlusCircle className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
          NEW FLOOR
        </button>
      </div>

      {/* Table Section */}
      <div className="custom-scrollbar w-full overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse text-left">
          <thead>
            <tr className="border-b border-white/5 bg-slate-900/40 text-[11px] font-bold tracking-widest text-slate-400 uppercase">
              <th className="w-24 px-8 py-5">Index</th>
              <th className="px-8 py-5">Floor Name</th>
              <th className="px-8 py-5">Level Description</th>
              <th className="w-32 px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <AnimatePresence mode="popLayout">
              {processedFloors.length > 0 ? (
                processedFloors.map((floor, idx) => (
                  <Motion.tr
                    key={floor.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="group transition-colors hover:bg-white/2"
                  >
                    <td className="px-8 py-6">
                      <span className="rounded bg-white/5 px-2 py-1 font-mono text-xs font-bold text-slate-500">
                        #{getIndex(idx)}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 text-slate-400 group-hover:text-brand transition-colors">
                          {floor.name.charAt(0)}
                        </div>
                        <span className="text-base font-bold tracking-tight text-slate-200 group-hover:text-brand transition-colors">
                          {floor.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-slate-600 shrink-0" />
                        <p className="line-clamp-1 max-w-xs text-xs font-medium text-slate-500 italic">
                          {floor.description || 'No descriptive data available for this level'}
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex translate-x-4 items-center justify-end gap-3 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                        <button
                          onClick={() => onEdit(floor)}
                          className="rounded-xl border border-sky-500/20 bg-sky-500/10 p-3 text-sky-400 transition-all hover:bg-sky-500 hover:text-white active:scale-95"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDelete(floor.id)}
                          className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-rose-400 transition-all hover:bg-rose-500 hover:text-white active:scale-95"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </Motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center justify-center gap-4 opacity-50">
                      <Layers className="h-12 w-12 text-slate-600" />
                      <p className="text-sm font-bold tracking-widest text-slate-500 uppercase">
                        No levels generated yet
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </Motion.div>
  )
}

export default FloorManagement
