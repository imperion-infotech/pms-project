import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Pencil, Trash2, AlertTriangle, X, Workflow, Calendar, Palette, Type } from 'lucide-react';
import useRoomStatusController from '../hooks/useRoomStatusController';

/**
 * View: RoomStatusManagement
 * Custom status management for room workflows using MVC architecture.
 */
const RoomStatusManagement = ({ roomStatuses, setIsRoomStatusModalOpen, onEdit, onDelete }) => {
  
  const {
    processedStatuses,
    deleteTarget,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete
  } = useRoomStatusController({
    roomStatuses,
    onDelete
  });

  return (
    <div className="bg-white dark:bg-surface-100 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 transition-colors duration-300">
      {/* Room Status Action Bar */}
      <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center border-b border-slate-100 dark:border-slate-800 gap-4">
        <div className="text-center sm:text-left">
          <h2 className="text-lg md:text-xl font-bold text-[#1a2b4b] dark:text-slate-100 font-heading tracking-tight">Room Status Management</h2>
          <p className="text-xs md:text-sm text-slate-400 font-medium">Manage and configure room operational states</p>
        </div>

        <button
          onClick={() => setIsRoomStatusModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white px-5 md:px-6 py-2.5 rounded-xl text-[11px] md:text-xs font-black tracking-wider transition-all shadow-lg shadow-emerald-500/20"
        >
          <PlusCircle className="w-5 h-5" />
          ADD NEW STATUS
        </button>
      </div>

      {/* Room Status Table */}
      <div className="w-full overflow-auto custom-scrollbar max-h-[600px]">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead className="sticky top-0 z-10">
            <tr className="bg-[#f8fafc] dark:bg-slate-800 text-[#64748b] dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <th className="px-8 py-4 w-24 text-center border-r border-slate-200 dark:border-slate-800">No.</th>
              <th className="px-8 py-4 border-r border-slate-200 dark:border-slate-800">Status Name</th>
              <th className="px-8 py-4 border-r border-slate-200 dark:border-slate-800">Display Label</th>
              <th className="px-8 py-4 border-r border-slate-200 dark:border-slate-800 text-center">Color Code</th>
              <th className="px-8 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-[13px] divide-y divide-slate-100 dark:divide-slate-800">
            {processedStatuses.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-8 py-20 text-center text-slate-400 dark:text-slate-500">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <AlertTriangle className="w-10 h-10 opacity-20" />
                    <p className="font-medium uppercase tracking-widest text-[10px]">No statuses defined</p>
                  </div>
                </td>
              </tr>
            ) : (
              processedStatuses.map((status, idx) => (
                <tr key={status.id} className="group hover:bg-emerald-50/40 dark:hover:bg-emerald-500/5 transition-all h-14">
                  <td className="px-8 py-2 text-center font-bold text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 font-mono text-[11px] border-r border-slate-100 dark:border-slate-800">
                    {idx + 1}
                  </td>
                  <td className="px-8 py-2 border-r border-slate-100 dark:border-slate-800 font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tighter">
                    {status.roomStatusName}
                  </td>
                  <td className="px-8 py-2 border-r border-slate-100 dark:border-slate-800">
                    <span 
                      className="px-3 py-1 rounded-lg text-xs font-bold tracking-wide border border-slate-100 dark:border-slate-700 shadow-sm"
                      style={{ 
                        backgroundColor: `${status.roomStatusColor}15`,
                        color: status.roomStatusColor || '#64748b'
                      }}
                    >
                      {status.roomStatusTitle || 'Untitled State'}
                    </span>
                  </td>
                  <td className="px-8 py-2 border-r border-slate-100 dark:border-slate-800 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                      <div 
                        className="w-3 h-3 rounded-full shadow-sm"
                        style={{ backgroundColor: status.roomStatusColor }}
                      />
                      <span className="font-mono text-[10px] text-slate-400 font-bold uppercase">
                        {status.roomStatusColor || 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-2 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => onEdit(status)}
                        className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg text-blue-500 transition-colors" title="Edit Status"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(status)}
                        className="p-1.5 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg text-red-500 transition-colors" title="Delete Status"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Custom Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={handleCancelDelete} />
          <div className="relative z-10 bg-white dark:bg-surface-100 rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-red-100 dark:border-red-900/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">Delete Status</h3>
                <p className="text-xs text-slate-400">This action cannot be undone.</p>
              </div>
              <button onClick={handleCancelDelete} className="ml-auto p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
              Are you sure you want to delete status{' '}
              <span className="font-bold text-red-500">"{deleteTarget.name}"</span>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCancelDelete}
                className="flex-1 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl transition-all hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-2 py-2.5 bg-red-500 hover:bg-red-600 active:scale-95 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-500/20 transition-all"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(RoomStatusManagement);
