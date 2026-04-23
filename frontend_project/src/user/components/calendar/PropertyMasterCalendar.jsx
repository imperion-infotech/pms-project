import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Users, UserPlus, CreditCard, X, TrendingUp, Activity, ArrowLeft } from 'lucide-react';

const PropertyMasterCalendar = ({ onClose }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mockData, setMockData] = useState({});

  // Generate days for the current month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(year, month, day);
    setSelectedDate(clickedDate);
    setIsFlipped(true);
    
    // Generate initial mock data for the selected date
    const isToday = new Date().toDateString() === clickedDate.toDateString();
    
    // Base data
    let data = {
      arrivals: Math.floor(Math.random() * 50) + 10,
      registrations: Math.floor(Math.random() * 30) + 5,
      revenue: Math.floor(Math.random() * 50000) + 10000,
      occupancy: Math.floor(Math.random() * 40) + 40, // 40-80%
      isToday: isToday
    };

    setMockData(data);
  };

  // Real-time effect for "Today"
  useEffect(() => {
    let interval;
    if (isFlipped && mockData.isToday) {
      interval = setInterval(() => {
        setMockData(prev => ({
          ...prev,
          arrivals: prev.arrivals + (Math.random() > 0.7 ? 1 : 0),
          registrations: prev.registrations + (Math.random() > 0.8 ? 1 : 0),
          revenue: prev.revenue + (Math.random() > 0.5 ? Math.floor(Math.random() * 500) : 0),
          occupancy: prev.occupancy < 100 && Math.random() > 0.9 ? prev.occupancy + 1 : prev.occupancy
        }));
      }, 3000); // Update every 3 seconds for a real-time feel
    }
    return () => clearInterval(interval);
  }, [isFlipped, mockData.isToday]);

  const renderCalendar = () => {
    const days = [];
    const today = new Date();

    // Empty cells for days before the 1st
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24"></div>);
    }

    // Actual days
    for (let d = 1; d <= daysInMonth; d++) {
      const isCurrentDay = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      
      days.push(
        <button
          key={d}
          onClick={() => handleDateClick(d)}
          className={`flex h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 items-center justify-center rounded-3xl text-xl sm:text-2xl transition-all duration-300 hover:scale-105
            ${isCurrentDay 
              ? 'bg-emerald-500 font-bold text-white shadow-[0_0_20px_rgba(16,185,129,0.5)] border-2 border-emerald-400' 
              : 'bg-slate-800/60 border border-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white'}
          `}
        >
          {d}
        </button>
      );
    }

    return days;
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
      />
      
      {/* Container with Perspective */}
      <div className="relative w-full max-w-5xl h-[85vh] min-h-[600px]" style={{ perspective: '2500px' }}>
        <AnimatePresence initial={false} mode="wait">
          {!isFlipped ? (
            /* FRONT: CALENDAR GRID */
            <motion.div
              key="front"
              initial={{ rotateY: -180, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: 180, opacity: 0 }}
              transition={{ duration: 0.7, type: 'spring', stiffness: 150, damping: 20 }}
              className="absolute inset-0 flex flex-col rounded-3xl border border-slate-700/80 bg-slate-900/95 shadow-2xl p-6 sm:p-10"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <button 
                onClick={onClose} 
                className="absolute right-6 top-6 rounded-full bg-slate-800 p-3 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Header */}
              <div className="mb-10 flex items-center justify-center gap-8">
                <button onClick={prevMonth} className="rounded-full p-4 bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors">
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <h2 className="text-3xl sm:text-5xl font-black text-white tracking-wide w-[300px] text-center">
                  {monthNames[month]} {year}
                </h2>
                <button onClick={nextMonth} className="rounded-full p-4 bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors">
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>

              {/* Day names */}
              <div className="mb-4 grid grid-cols-7 gap-2 sm:gap-4 text-center text-sm font-bold uppercase tracking-widest text-slate-500">
                <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
              </div>

              {/* Days Grid */}
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-7 gap-2 sm:gap-4 place-items-center pb-4">
                  {renderCalendar()}
                </div>
              </div>
            </motion.div>
          ) : (
            /* BACK: DATA CARD */
            <motion.div
              key="back"
              initial={{ rotateY: 180, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -180, opacity: 0 }}
              transition={{ duration: 0.7, type: 'spring', stiffness: 150, damping: 20 }}
              className="absolute inset-0 flex flex-col rounded-3xl border border-emerald-500/40 bg-slate-900/95 shadow-[0_0_50px_rgba(16,185,129,0.1)] overflow-hidden"
              style={{ backfaceVisibility: 'hidden' }}
            >
              {/* Top Banner */}
              <div className="relative border-b border-slate-800 bg-slate-800/40 p-8 sm:p-12">
                <button 
                  onClick={() => setIsFlipped(false)}
                  className="absolute left-8 top-8 flex items-center gap-2 rounded-full bg-slate-800 px-5 py-2.5 text-sm font-bold text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
                >
                  <ArrowLeft className="h-5 w-5" /> Back to Calendar
                </button>
                <button 
                  onClick={onClose}
                  className="absolute right-8 top-8 rounded-full bg-slate-800 p-3 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
                
                <div className="mt-12 flex flex-col items-center justify-center text-center">
                  <div className={`mb-6 flex h-24 w-24 items-center justify-center rounded-4xl ${mockData.isToday ? 'bg-emerald-500/20 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]' : 'bg-blue-500/20 text-blue-400'}`}>
                    <CalendarIcon className="h-12 w-12" />
                  </div>
                  <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
                    {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </h2>
                  <div className="mt-6 flex items-center gap-4">
                    <span className={`rounded-full px-5 py-2 text-sm font-black uppercase tracking-widest ${mockData.isToday ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-300'}`}>
                      {mockData.isToday ? 'Live Insights Active' : 'Historical Record'}
                    </span>
                    {mockData.isToday && (
                      <span className="flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="flex-1 overflow-y-auto p-8 sm:p-12">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8 max-w-4xl mx-auto">
                  {/* Arrival Stat */}
                  <div className="group flex items-center gap-6 rounded-3xl border border-slate-800 bg-slate-800/30 p-8 transition-all hover:bg-slate-800/60 hover:-translate-y-1">
                    <div className="rounded-2xl bg-blue-500/20 p-5 transition-transform group-hover:scale-110">
                      <Users className="h-10 w-10 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Total Arrivals</p>
                      <p className="text-5xl font-black text-white mt-2">{mockData.arrivals}</p>
                    </div>
                  </div>

                  {/* Registration Stat */}
                  <div className="group flex items-center gap-6 rounded-3xl border border-slate-800 bg-slate-800/30 p-8 transition-all hover:bg-slate-800/60 hover:-translate-y-1">
                    <div className="rounded-2xl bg-purple-500/20 p-5 transition-transform group-hover:scale-110">
                      <UserPlus className="h-10 w-10 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-widest text-slate-400">New Registrations</p>
                      <p className="text-5xl font-black text-white mt-2">{mockData.registrations}</p>
                    </div>
                  </div>

                  {/* Revenue Stat */}
                  <div className="group flex items-center gap-6 rounded-3xl border border-slate-800 bg-slate-800/30 p-8 transition-all hover:bg-slate-800/60 hover:-translate-y-1">
                    <div className="rounded-2xl bg-emerald-500/20 p-5 transition-transform group-hover:scale-110">
                      <CreditCard className="h-10 w-10 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Total Revenue</p>
                      <p className="text-5xl font-black text-emerald-400 mt-2">₹{mockData.revenue?.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Occupancy Stat */}
                  <div className="group flex items-center gap-6 rounded-3xl border border-slate-800 bg-slate-800/30 p-8 transition-all hover:bg-slate-800/60 hover:-translate-y-1">
                    <div className="rounded-2xl bg-amber-500/20 p-5 transition-transform group-hover:scale-110">
                      <Activity className="h-10 w-10 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Occupancy Rate</p>
                      <div className="flex items-baseline gap-3 mt-2">
                        <p className="text-5xl font-black text-white">{mockData.occupancy}%</p>
                        <TrendingUp className="h-6 w-6 text-emerald-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  if (typeof document !== 'undefined') {
    return createPortal(
      <AnimatePresence>
        {modalContent}
      </AnimatePresence>,
      document.body
    );
  }
  return null;
};

export default PropertyMasterCalendar;
