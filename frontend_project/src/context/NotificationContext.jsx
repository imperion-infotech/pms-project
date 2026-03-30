/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { ...notification, id }]);
    
    // Auto-remove after 5 seconds
    if (notification.duration !== 0) {
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, notification.duration || 5000);
    }
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const success = (message, title = 'Success') => addNotification({ type: 'success', title, message });
  const error = (message, title = 'Error') => addNotification({ type: 'error', title, message });
  const info = (message, title = 'Info') => addNotification({ type: 'info', title, message });
  const warn = (message, title = 'Warning') => addNotification({ type: 'warning', title, message });

  return (
    <NotificationContext.Provider value={{ success, error, info, warn, removeNotification }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-3 min-w-[320px] max-w-[420px]">
        <AnimatePresence>
          {notifications.map((n) => (
            <NotificationItem key={n.id} notification={n} onDismiss={() => removeNotification(n.id)} />
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};

const NotificationItem = ({ notification, onDismiss }) => {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-400" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400" />,
    info: <Info className="w-5 h-5 text-sky-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
  };

  const bgStyles = {
    success: 'bg-emerald-500/10 border-emerald-500/20',
    error: 'bg-rose-500/10 border-rose-500/20',
    info: 'bg-sky-500/10 border-sky-500/20',
    warning: 'bg-amber-500/10 border-amber-500/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      className={`p-4 rounded-xl border ${bgStyles[notification.type]} backdrop-blur-md flex gap-3 shadow-2xl overflow-hidden relative group`}
    >
      <div className="flex-shrink-0 mt-0.5">{icons[notification.type]}</div>
      <div className="flex-grow">
        <h4 className="font-semibold text-sm text-slate-100">{notification.title}</h4>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{notification.message}</p>
      </div>
      <button 
        onClick={onDismiss}
        className="flex-shrink-0 text-slate-500 hover:text-white transition-colors p-1"
      >
        <X className="w-4 h-4" />
      </button>
      
      {/* Progress Bar Animation */}
      <motion.div 
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: 5, ease: "linear" }}
        className={`absolute bottom-0 left-0 right-0 h-0.5 origin-left ${
          notification.type === 'success' ? 'bg-emerald-500/50' : 
          notification.type === 'error' ? 'bg-rose-500/50' : 
          notification.type === 'info' ? 'bg-sky-500/50' : 'bg-amber-500/50'
        }`}
      />
    </motion.div>
  );
};

export const useToast = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useToast must be used within a NotificationProvider');
  return context;
};
