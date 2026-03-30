/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const addNotification = useCallback((notification) => {
    // Generate a unique identifier safely
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 9);
    const duration = notification.duration !== undefined ? notification.duration : 5000;
    
    setNotifications((prev) => [...prev, { ...notification, id, duration }]);
    
    // Auto-remove after the defined duration
    if (duration !== 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
  }, [removeNotification]);

  // Context provider actions with default industrial-standard titles
  const success = useCallback((message, title = 'Process Successful', duration) => addNotification({ type: 'success', title, message, duration }), [addNotification]);
  const error = useCallback((message, title = 'Action Failed', duration) => addNotification({ type: 'error', title, message, duration }), [addNotification]);
  const info = useCallback((message, title = 'Information', duration) => addNotification({ type: 'info', title, message, duration }), [addNotification]);
  const warn = useCallback((message, title = 'Warning', duration) => addNotification({ type: 'warning', title, message, duration }), [addNotification]);

  return (
    <NotificationContext.Provider value={{ success, error, info, warn, removeNotification }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-4 min-w-[340px] max-w-[420px] pointer-events-none">
        <AnimatePresence mode="popLayout">
          {notifications.map((n) => (
            <NotificationItem key={n.id} notification={n} onDismiss={() => removeNotification(n.id)} />
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};

const NotificationItem = ({ notification, onDismiss }) => {
  const { type, title, message, duration } = notification;

  // Premium, corporate-grade aesthetic styling for each notification type
  const config = {
    success: {
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />,
      accent: 'bg-emerald-500',
      lightBg: 'bg-emerald-50/90 border-emerald-200/50',
      darkBg: 'dark:bg-emerald-500/10 dark:border-emerald-500/30',
      shadow: 'shadow-emerald-500/10',
    },
    error: {
      icon: <AlertCircle className="w-5 h-5 text-rose-500 dark:text-rose-400" />,
      accent: 'bg-rose-500',
      lightBg: 'bg-rose-50/90 border-rose-200/50',
      darkBg: 'dark:bg-rose-500/10 dark:border-rose-500/30',
      shadow: 'shadow-rose-500/10',
    },
    info: {
      icon: <Info className="w-5 h-5 text-blue-500 dark:text-blue-400" />,
      accent: 'bg-blue-500',
      lightBg: 'bg-blue-50/90 border-blue-200/50',
      darkBg: 'dark:bg-blue-500/10 dark:border-blue-500/30',
      shadow: 'shadow-blue-500/10',
    },
    warning: {
      icon: <AlertTriangle className="w-5 h-5 text-amber-500 dark:text-amber-400" />,
      accent: 'bg-amber-500',
      lightBg: 'bg-amber-50/90 border-amber-200/50',
      darkBg: 'dark:bg-amber-500/10 dark:border-amber-500/30',
      shadow: 'shadow-amber-500/10',
    },
  }[type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 0.9, filter: 'blur(8px)', transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={`pointer-events-auto relative overflow-hidden flex gap-4 p-5 rounded-2xl border ${config.lightBg} ${config.darkBg} shadow-2xl ${config.shadow} backdrop-blur-2xl group hover:-translate-y-1 transition-transform duration-300 isolate`}
    >
      {/* Accent Line Left for visual distinction */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${config.accent} opacity-90`} />

      <div className="shrink-0 pt-0.5 ml-1">
        <div className="p-2.5 rounded-xl bg-white/60 dark:bg-slate-900/50 border border-white/40 dark:border-white/5 shadow-sm">
          {config.icon}
        </div>
      </div>
      
      <div className="flex-1 pr-6 flex flex-col justify-center">
        <h4 className="font-extrabold text-[13px] tracking-wide text-slate-800 dark:text-slate-100 uppercase mb-1">{title}</h4>
        <p className="text-[13px] font-medium text-slate-600 dark:text-slate-400 leading-relaxed">{message}</p>
      </div>
      
      <button 
        onClick={onDismiss}
        className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all p-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800/60 active:scale-90"
        title="Dismiss Notification"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Dynamic Progress Bar Animation */}
      {duration !== 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/5 dark:bg-white/5">
          <motion.div 
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: duration / 1000, ease: 'linear' }}
            className={`h-full origin-left ${config.accent} opacity-80`}
          />
        </div>
      )}
    </motion.div>
  );
};

export const useToast = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useToast must be used within a NotificationProvider');
  return context;
};
