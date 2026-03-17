// Common UI elements - Pagination component
import React from 'react';

const Pagination = ({ activeItem, floors, roomTypes, rooms, isLoading }) => {
  return (
    <div className="bg-[#1e293b] text-white p-4 px-8 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl mt-4 min-h-[72px]">
      {isLoading ? (
        <div className="w-full flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-slate-600"></div>
            <div className="h-3 w-48 bg-slate-700 rounded"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-24 bg-slate-700 rounded-lg"></div>
            <div className="h-10 w-10 bg-slate-700 rounded-lg"></div>
            <div className="h-10 w-24 bg-slate-700 rounded-lg"></div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Showing {activeItem === 'Floor' ? floors.length : activeItem === 'Room Type' ? roomTypes.length : rooms.length} Active Records
            </span>
          </div>
          <div className="flex gap-2">
            <button className="px-5 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-[10px] font-black tracking-tighter transition-all disabled:opacity-30" disabled>PREVIOUS</button>
            <button className="w-10 h-10 flex items-center justify-center bg-emerald-500 rounded-lg text-xs font-black">1</button>
            <button className="px-5 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-[10px] font-black tracking-tighter transition-all">NEXT</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Pagination;
