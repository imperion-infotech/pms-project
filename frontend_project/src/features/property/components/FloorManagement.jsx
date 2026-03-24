// "Property" feature ke components - FloorManagement
import { PlusCircle, Search, X, Pencil, Trash2 } from 'lucide-react';

const FloorManagement = ({ floors, setIsFloorModalOpen }) => {
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
            {floors.map((floor, idx) => (
              <tr key={idx} className="group hover:bg-emerald-50/40 dark:hover:bg-emerald-500/5 transition-all duration-200">
                <td className="px-8 py-5 text-center font-bold text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 font-mono text-xs border-r border-slate-50 dark:border-slate-800/50">{idx + 1}</td>
                <td className="px-8 py-5 font-bold text-slate-700 dark:text-slate-300 border-r border-slate-50 dark:border-slate-800/50">{floor.name}</td>
                <td className="px-8 py-5 text-slate-500 dark:text-slate-400 italic text-xs border-r border-slate-50 dark:border-slate-800/50">{floor.description || "—"}</td>
                <td className="px-8 py-5">
                  <div className="flex justify-center gap-2">
                    <button className="p-2 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg text-blue-500 transition-all" title="Edit">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg text-red-500 transition-all" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FloorManagement;
