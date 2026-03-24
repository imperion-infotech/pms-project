// Property feature components - RoomStatusManagement
/**
 * RoomStatusManagement.jsx (Admin Domain -> Features: Property)
 * 
 * Feature component to manage Room Statuses (e.g., Vacant Ready, Occupied Clean). 
 * Contains tables and UI logic strictly constrained to creating, reading, updating, deleting (CRUD) Room Statuses.
 */
import React, { useState } from 'react';
import { PlusCircle, Pencil, Trash2, AlertTriangle, X } from 'lucide-react';

const RoomStatusManagement = ({ roomStatuses, setIsRoomStatusModalOpen, onEdit, onDelete }) => {
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleDeleteClick = (status) => {
    setDeleteTarget({ id: status.id, name: status.roomStatusName });
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

  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  };

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-md border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors duration-300">
      {/* Action Bar */}
      <div className="p-6 flex flex-col lg:flex-row justify-between items-center border-b border-slate-100 dark:border-slate-800 gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1a2b4b] dark:text-slate-100 font-heading tracking-tight">Room Statuses</h2>
          <p className="text-sm text-slate-400 font-medium">Manage and customize room status workflows</p>
        </div>
        <button
          onClick={() => setIsRoomStatusModalOpen(true)}
          className="w-full lg:w-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-500/10"
        >
          <PlusCircle className="w-5 h-5" />
          ADD NEW STATUS
        </button>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-[#f8fafc] dark:bg-slate-800/50 text-[#64748b] dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <th className="px-4 py-4 text-center border-r border-slate-200 dark:border-slate-800 w-20">ID</th>
              <th className="px-6 py-4 border-r border-slate-200 dark:border-slate-800 w-48">Status Name</th>
              <th className="px-6 py-4 border-r border-slate-200 dark:border-slate-800 w-40">Status Title</th>
              <th className="px-6 py-4 border-r border-slate-200 dark:border-slate-800 w-48">Status Color</th>
              <th className="px-6 py-4 border-r border-slate-200 dark:border-slate-800 w-40">Created On</th>
              <th className="px-4 py-4 text-center w-32">Actions</th>
            </tr>
          </thead>
          <tbody className="text-[13px] divide-y divide-slate-100 dark:divide-slate-800">
            {roomStatuses.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-8 py-10 text-center text-slate-400 dark:text-slate-500 text-sm italic">
                  No room statuses found. Please add your first status.
                </td>
              </tr>
            ) : (
              roomStatuses.map((status, idx) => (
                <tr key={status.id ?? idx} className="hover:bg-emerald-50/40 dark:hover:bg-emerald-500/5 transition-all h-16 group">
                  {/* ID */}
                  <td className="px-4 py-3 text-center border-r border-slate-100 dark:border-slate-800 font-bold text-slate-400 dark:text-slate-600 font-mono text-xs">
                    {status.id}
                  </td>
                  {/* Status Name */}
                  <td className="px-6 py-3 border-r border-slate-100 dark:border-slate-800 font-extrabold text-slate-800 dark:text-slate-200">
                    {status.roomStatusName || '—'}
                  </td>
                  {/* Status Title */}
                  <td className="px-6 py-3 border-r border-slate-100 dark:border-slate-800 font-bold text-slate-600 dark:text-slate-400">
                    <span 
                      className="px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide"
                      style={{ 
                        backgroundColor: status.roomStatusColor || '#e2e8f0',
                        color: '#000000'
                      }}
                    >
                      {status.roomStatusTitle || '—'}
                    </span>
                  </td>
                  {/* Colors Preview */}
                  <td className="px-6 py-3 border-r border-slate-100 dark:border-slate-800 font-mono text-[10px] text-slate-500">
                    <div className="flex items-center gap-2">
                       <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm border border-slate-300" style={{backgroundColor: status.roomStatusColor}}></div> {status.roomStatusColor}</span>
                    </div>
                  </td>
                  {/* Created On */}
                  <td className="px-6 py-3 border-r border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-xs font-medium">
                    {formatDate(status.createdOn)}
                  </td>
                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => onEdit(status)}
                        className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg text-blue-500 transition-colors"
                        title="Edit Room Status"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(status)}
                        className="p-1.5 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg text-red-500 transition-colors"
                        title="Delete Room Status"
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
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={handleCancelDelete} />
          <div className="relative z-10 bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-red-100 dark:border-red-900/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">Delete Room Status</h3>
                <p className="text-xs text-slate-400">This action cannot be undone.</p>
              </div>
              <button onClick={handleCancelDelete} className="ml-auto p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
              Are you sure you want to delete{' '}
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

export default React.memo(RoomStatusManagement);
