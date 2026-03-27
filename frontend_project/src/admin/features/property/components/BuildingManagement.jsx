// Property feature components - BuildingManagement
/**
 * BuildingManagement.jsx (Admin Domain -> Features: Property)
 * 
 * Feature component to manage Buildings. 
 * Renders a list/table of active buildings, triggering options to edit or delete buildings via API.
 */
import React, { useState } from 'react';
import { PlusCircle, Pencil, Trash2, AlertTriangle, X, Building } from 'lucide-react';

const BuildingManagement = ({
  buildings = [],
  searchTerm,
  setIsBuildingModalOpen,
  onEdit,
  onDelete,
  currentPage = 1,
  itemsPerPage = 8
}) => {
  // Confirmation state for delete
  const [deleteTarget, setDeleteTarget] = useState(null); // stores { id, name }

  const handleDeleteClick = (building) => {
    setDeleteTarget({ id: building.id, name: building.name });
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
    <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-md border border-slate-200 dark:border-slate-800 transition-colors duration-300">
      {/* Building Action Bar */}
      <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center border-b border-slate-100 dark:border-slate-800 gap-4">
        <div className="text-center sm:text-left">
          <h2 className="text-lg md:text-xl font-bold text-[#1a2b4b] dark:text-slate-100 font-heading tracking-tight">Building Management</h2>
          <p className="text-xs md:text-sm text-slate-400 font-medium">Configure and organize your properties/buildings</p>
        </div>

        <button
          onClick={() => setIsBuildingModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white px-5 md:px-6 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all shadow-lg shadow-emerald-500/20"
        >
          <PlusCircle className="w-5 h-5" />
          NEW BUILDING
        </button>
      </div>

      {/* Building Table */}
      <div className="w-full overflow-auto custom-scrollbar max-h-[600px]">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead className="sticky top-0 z-10">
            <tr className="bg-slate-50/80 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-[0.1em] border-b border-slate-200 dark:border-slate-800">
              <th className="px-8 py-4 w-20 text-center border-r border-slate-100 dark:border-slate-800">No.</th>
              <th className="px-8 py-4 border-r border-slate-100 dark:border-slate-800">Building Name</th>
              <th className="px-8 py-4 border-r border-slate-100 dark:border-slate-800">Description</th>
              <th className="px-8 py-4 border-r border-slate-100 dark:border-slate-800 text-center">Created On</th>
              <th className="px-8 py-4 w-32 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-800">
            {buildings.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-8 py-10 text-center text-slate-400 dark:text-slate-500 text-sm italic">
                  {searchTerm ? 'No buildings match your search.' : 'No buildings found. Please create your first building.'}
                </td>
              </tr>
            ) : (
              buildings.map((building, idx) => (
                <tr key={building.id ?? idx} className="group hover:bg-emerald-50/40 dark:hover:bg-emerald-500/5 transition-all duration-200">
                  <td className="px-8 py-5 text-center font-bold text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 font-mono text-xs border-r border-slate-50 dark:border-slate-800/50">
                    {((currentPage - 1) * itemsPerPage) + idx + 1}
                  </td>
                  <td className="px-8 py-5 font-bold text-slate-700 dark:text-slate-300 border-r border-slate-50 dark:border-slate-800/50">{building.name}</td>
                  <td className="px-8 py-5 text-slate-500 dark:text-slate-400 italic text-xs border-r border-slate-50 dark:border-slate-800/50">{building.description || '—'}</td>
                  <td className="px-8 py-5 text-center text-slate-500 dark:text-slate-400 text-xs border-r border-slate-50 dark:border-slate-800/50">
                    {building.createdOn ? new Date(building.createdOn).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onEdit(building)}
                        className="p-2 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg text-blue-500 transition-all"
                        title="Edit Building"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(building)}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg text-red-500 transition-all"
                        title="Delete Building"
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
          <div className="relative z-10 bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl w-full max-sm:w-auto min-w-[320px] max-w-sm p-6 border border-red-100 dark:border-red-900/30 animate-in zoom-in-95 duration-200">
            {/* Icon + Title */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">Delete Building</h3>
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

export default React.memo(BuildingManagement);
