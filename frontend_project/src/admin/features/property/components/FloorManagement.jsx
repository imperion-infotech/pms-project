// Property feature components - FloorManagement
/**
 * FloorManagement.jsx (Admin Domain -> Features: Property)
 * 
 * Feature component to manage building Floors. 
 * Renders a list/table of active floors, triggering options to edit or delete floors via API.
 */
import React, { useState } from 'react';
import { PlusCircle, Pencil, Trash2, AlertTriangle, X } from 'lucide-react';

const FloorManagement = ({ floors, setIsFloorModalOpen, onEdit, onDelete }) => {
  // Confirmation state for delete
  const [deleteTarget, setDeleteTarget] = useState(null); // stores { id, name }

  const handleDeleteClick = (floor) => {
    setDeleteTarget({ id: floor.id, name: floor.name });
  };

  const handleConfirmDelete = () => {
    if (deleteTarget?.id) {
      onDelete(deleteTarget.id);
    }
    setDeleteTarget(null);
  };

  const handleCancelDelete = () => {
    setDeleteTarget(null);
  };

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-md border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors duration-300">
      {/* Floor Action Bar */}
      <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center border-b border-slate-100 dark:border-slate-800 gap-4">
        <div className="text-center sm:text-left">
          <h2 className="text-lg md:text-xl font-bold text-[#1a2b4b] dark:text-slate-100 font-heading tracking-tight">Floor Management</h2>
          <p className="text-xs md:text-sm text-slate-400 font-medium">Configure and organize property levels</p>
        </div>
        <button
          onClick={() => setIsFloorModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white px-5 md:px-6 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all shadow-lg shadow-emerald-500/20"
        >
          <PlusCircle className="w-5 h-5" />
          NEW FLOOR
        </button>
      </div>

      {/* Floor Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-[0.1em] border-b border-slate-200 dark:border-slate-800">
              <th className="px-8 py-4 w-20 text-center border-r border-slate-100 dark:border-slate-800">No.</th>
              <th className="px-8 py-4 border-r border-slate-100 dark:border-slate-800">Floor Name</th>
              <th className="px-8 py-4 border-r border-slate-100 dark:border-slate-800">Description</th>
              <th className="px-8 py-4 w-32 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-800">
            {floors.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-8 py-10 text-center text-slate-400 dark:text-slate-500 text-sm italic">
                  No floors found. Please create your first floor.
                </td>
              </tr>
            ) : (
              floors.map((floor, idx) => (
                <tr key={floor.id ?? idx} className="group hover:bg-emerald-50/40 dark:hover:bg-emerald-500/5 transition-all duration-200">
                  <td className="px-8 py-5 text-center font-bold text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 font-mono text-xs border-r border-slate-50 dark:border-slate-800/50">{idx + 1}</td>
                  <td className="px-8 py-5 font-bold text-slate-700 dark:text-slate-300 border-r border-slate-50 dark:border-slate-800/50">{floor.name}</td>
                  <td className="px-8 py-5 text-slate-500 dark:text-slate-400 italic text-xs border-r border-slate-50 dark:border-slate-800/50">{floor.description || '—'}</td>
                  <td className="px-8 py-5">
                    <div className="flex justify-center gap-2">
                      {/* Edit Button — PUT API */}
                      <button
                        onClick={() => onEdit(floor)}
                        className="p-2 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg text-blue-500 transition-all"
                        title="Edit Floor"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      {/* Delete Button — shows inline confirmation */}
                      <button
                        onClick={() => handleDeleteClick(floor)}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg text-red-500 transition-all"
                        title="Delete Floor"
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
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={handleCancelDelete}
          />
          {/* Dialog Box */}
          <div className="relative z-10 bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-red-100 dark:border-red-900/30">
            {/* Icon + Title */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">Delete Floor</h3>
                <p className="text-xs text-slate-400">This action cannot be undone.</p>
              </div>
              <button
                onClick={handleCancelDelete}
                className="ml-auto p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Message */}
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
              Are you sure you want to delete{' '}
              <span className="font-bold text-red-500">"{deleteTarget.name}"</span>?
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleCancelDelete}
                className="flex-1 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl transition-all hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-[2] py-2.5 bg-red-500 hover:bg-red-600 active:scale-95 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-500/20 transition-all"
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

export default React.memo(FloorManagement);
