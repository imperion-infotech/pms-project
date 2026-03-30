import { motion, AnimatePresence } from 'framer-motion';
/**
 * LoadingBar - A sleek top-level progress bar.
 */
export const LoadingBar = ({ isLoading }) => (
  <AnimatePresence>
    {isLoading && (
      <motion.div
        initial={{ scaleX: 0, opacity: 1, originX: 0 }}
        animate={{
          scaleX: [0, 0.2, 0.4, 0.8, 0.95],
          opacity: 1
        }}
        exit={{
          scaleX: 1,
          opacity: 0,
          transition: { duration: 0.3 }
        }}
        transition={{
          duration: 1.5,
          ease: "easeInOut",
          times: [0, 0.3, 0.6, 0.8, 1],
          repeat: Infinity,
          repeatType: "loop"
        }}
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-sky-500 to-emerald-500 z-[99999] shadow-[0_0_15px_rgba(16,185,129,0.4)]"
        style={{ transformOrigin: 'left' }}
      />
    )}
  </AnimatePresence>
);

/**
 * LoadingSpinner - A circular spinner with optional message.
 */
export const LoadingSpinner = ({ fullScreen = true, message }) => (
  <div className={`flex flex-col items-center justify-center ${fullScreen ? 'h-screen w-screen bg-slate-50 dark:bg-slate-900 fixed inset-0 z-9999' : 'py-12 w-full'} transition-colors duration-300`}>
    <div className="relative mb-4">
      <div className={`${fullScreen ? 'h-16 w-16' : 'h-12 w-12'} rounded-full border-t-4 border-b-4 border-blue-500 animate-spin`}></div>
      <div className={`absolute top-0 left-0 ${fullScreen ? 'h-16 w-16' : 'h-12 w-12'} rounded-full border-t-4 border-b-4 border-blue-200 opacity-20`}></div>
    </div>
    {message && (
      <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 animate-pulse text-center px-4">
        {message}
      </span>
    )}
  </div>
);

/**
 * LoadingProcess - Unified loading component.
 * Can be used as a wrapper or standalone.
 */
const LoadingProcess = ({ isLoading, barOnly = false, spinnerOnly = false, message, fullScreen = false }) => {
  return (
    <>
      {!spinnerOnly && <LoadingBar isLoading={isLoading} />}
      {!barOnly && isLoading && <LoadingSpinner fullScreen={fullScreen} message={message} />}
    </>
  );
};

export default LoadingProcess;
