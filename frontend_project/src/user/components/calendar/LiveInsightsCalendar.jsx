import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Users, UserPlus, CreditCard, X, TrendingUp, Activity, ArrowLeft } from 'lucide-react';

const LiveInsightsCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mockData, setMockData] = useState({});

  // Generate days for the current month
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const handleDateClick = (day) => {
    const clickedDate = new Date(year, month, day);
    setSelectedDate(clickedDate);
    setIsFlipped(true);
    
    const isToday = new Date().toDateString() === clickedDate.toDateString();
    setMockData({
      arrivals: Math.floor(Math.random() * 50) + 10,
      registrations: Math.floor(Math.random() * 30) + 5,
      revenue: Math.floor(Math.random() * 50000) + 10000,
      occupancy: Math.floor(Math.random() * 40) + 40,
      isToday: isToday
    });
  };

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
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isFlipped, mockData.isToday]);

  const renderCalendar = () => {
    const days = [];
    const today = new Date();

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10 sm:h-12 sm:w-12"></div>);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const isCurrentDay = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      
      days.push(
        <button
          key={d}
          onClick={() => handleDateClick(d)}
          className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-[12px] text-sm sm:text-base font-bold transition-all duration-200 hover:scale-110
            ${isCurrentDay 
              ? 'bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.4)] border border-emerald-400 z-10' 
              : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-800/40 dark:border-slate-700/50 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white'}
          `}
        >
          {d}
        </button>
      );
    }
    return days;
  };

  return (
    <div className="mx-auto w-full max-w-[700px] h-[480px] relative mt-2 mb-8" style={{ perspective: '1500px' }}>
      <AnimatePresence initial={false} mode="wait">
        {!isFlipped ? (
          /* FRONT: CALENDAR GRID */
          <motion.div
            key="front"
            initial={{ rotateY: -180, opacity: 0, scale: 0.95 }}
            animate={{ rotateY: 0, opacity: 1, scale: 1 }}
            exit={{ rotateY: 180, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, type: 'spring', stiffness: 250, damping: 25 }}
            className="absolute inset-0 flex flex-col rounded-[28px] border border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-xl p-6 dark:border-slate-800/60 dark:bg-slate-900/80 overflow-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            {/* Header */}
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between px-2 sm:px-6 mb-6">
                <button onClick={prevMonth} className="rounded-xl p-2.5 bg-slate-100/80 text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-800/80 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white transition-colors border border-transparent dark:hover:border-slate-600">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="flex flex-col items-center">
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight uppercase">
                    {monthNames[month]} {year}
                  </h2>
                  <span className="text-[10px] sm:text-xs font-bold text-emerald-500 tracking-widest uppercase mt-1">Select a Date for Insights</span>
                </div>
                <button onClick={nextMonth} className="rounded-xl p-2.5 bg-slate-100/80 text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-800/80 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white transition-colors border border-transparent dark:hover:border-slate-600">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 flex flex-col justify-center px-0 sm:px-4">
                {/* Day names */}
                <div className="grid grid-cols-7 gap-2 sm:gap-3 mb-4 text-center text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-2 sm:gap-3 place-items-center">
                  {renderCalendar()}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* BACK: DATA CARD */
          <motion.div
            key="back"
            initial={{ rotateY: 180, opacity: 0, scale: 0.95 }}
            animate={{ rotateY: 0, opacity: 1, scale: 1 }}
            exit={{ rotateY: -180, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, type: 'spring', stiffness: 250, damping: 25 }}
            className="absolute inset-0 flex flex-col rounded-[28px] border border-emerald-500/30 bg-white/95 backdrop-blur-xl shadow-2xl overflow-hidden dark:bg-slate-900/95 dark:shadow-[0_10px_40px_rgba(16,185,129,0.15)]"
            style={{ backfaceVisibility: 'hidden' }}
          >
            {/* Top Banner (Sleek AAA Widget Style) */}
            <div className="relative border-b border-slate-200/60 bg-slate-50/50 p-5 px-6 dark:border-slate-800/60 dark:bg-slate-800/20 flex items-center justify-between">
              <button 
                onClick={() => setIsFlipped(false)}
                className="group flex items-center gap-2 rounded-xl bg-slate-200/60 px-4 py-2.5 text-xs font-bold text-slate-600 transition-all hover:bg-slate-300 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white border border-slate-300/50 dark:border-slate-700"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back
              </button>
              
              <div className="flex items-center gap-4">
                 <div className="flex flex-col text-right">
                   <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 leading-tight">
                     {selectedDate?.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                   </h2>
                   <div className="flex items-center justify-end gap-1.5 mt-1">
                    {mockData.isToday && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                      )}
                      <span className={`text-[10px] font-black uppercase tracking-widest ${mockData.isToday ? 'text-emerald-500' : 'text-slate-500'}`}>
                        {mockData.isToday ? 'Live Insights' : 'Historical Data'}
                      </span>
                   </div>
                 </div>
                 <div className={`flex h-12 w-12 items-center justify-center rounded-[14px] ${mockData.isToday ? 'bg-emerald-500/20 text-emerald-500' : 'bg-blue-500/20 text-blue-500'}`}>
                    <CalendarIcon className="h-6 w-6" />
                  </div>
              </div>
            </div>

            {/* Stats Grid (AAA Layout) */}
            <div className="flex-1 p-6 flex flex-col justify-center">
              <div className="grid grid-cols-2 gap-4 h-full max-h-[300px]">
                
                {/* Arrival Stat */}
                <div className="group relative flex flex-col justify-center overflow-hidden rounded-2xl border border-slate-200/60 bg-linear-to-br from-slate-50 to-white p-5 transition-all hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-lg dark:border-slate-800 dark:from-slate-800/40 dark:to-slate-900/40 dark:hover:border-blue-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="rounded-xl bg-blue-500/10 p-2 text-blue-500 dark:text-blue-400 transition-transform group-hover:scale-110">
                      <Users className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Total Arrivals</p>
                    <p className="text-4xl font-black text-slate-800 dark:text-slate-100 mt-1">{mockData.arrivals}</p>
                  </div>
                </div>

                {/* Registration Stat */}
                <div className="group relative flex flex-col justify-center overflow-hidden rounded-2xl border border-slate-200/60 bg-linear-to-br from-slate-50 to-white p-5 transition-all hover:-translate-y-1 hover:border-purple-500/30 hover:shadow-lg dark:border-slate-800 dark:from-slate-800/40 dark:to-slate-900/40 dark:hover:border-purple-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="rounded-xl bg-purple-500/10 p-2 text-purple-500 dark:text-purple-400 transition-transform group-hover:scale-110">
                      <UserPlus className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">New Registrations</p>
                    <p className="text-4xl font-black text-slate-800 dark:text-slate-100 mt-1">{mockData.registrations}</p>
                  </div>
                </div>

                {/* Revenue Stat */}
                <div className="group relative flex flex-col justify-center overflow-hidden rounded-2xl border border-slate-200/60 bg-linear-to-br from-slate-50 to-white p-5 transition-all hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-lg dark:border-slate-800 dark:from-slate-800/40 dark:to-slate-900/40 dark:hover:border-emerald-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-500 dark:text-emerald-400 transition-transform group-hover:scale-110">
                      <CreditCard className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Total Revenue</p>
                    <p className="text-3xl sm:text-4xl font-black text-emerald-500 dark:text-emerald-400 mt-1">₹{mockData.revenue?.toLocaleString()}</p>
                  </div>
                </div>

                {/* Occupancy Stat */}
                <div className="group relative flex flex-col justify-center overflow-hidden rounded-2xl border border-slate-200/60 bg-linear-to-br from-slate-50 to-white p-5 transition-all hover:-translate-y-1 hover:border-amber-500/30 hover:shadow-lg dark:border-slate-800 dark:from-slate-800/40 dark:to-slate-900/40 dark:hover:border-amber-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="rounded-xl bg-amber-500/10 p-2 text-amber-500 dark:text-amber-400 transition-transform group-hover:scale-110">
                      <Activity className="h-5 w-5" />
                    </div>
                    <TrendingUp className="h-5 w-5 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Occupancy Rate</p>
                    <p className="text-4xl font-black text-slate-800 dark:text-slate-100 mt-1">{mockData.occupancy}%</p>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LiveInsightsCalendar;
