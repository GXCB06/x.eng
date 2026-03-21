import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

export function NetworkStatus() {
  const { isOnline, isSlowNetwork, effectiveType } = useNetworkStatus();

  if (!isOnline) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-0 left-0 right-0 z-[999] bg-red-50 border-b border-red-200 px-3 sm:px-4 py-3"
        >
          <div className="flex items-center justify-center gap-2 text-red-700 text-sm sm:text-base">
            <WifiOff size={18} className="flex-shrink-0" />
            <span className="font-medium">You are currently offline. Viewing cached content.</span>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (isSlowNetwork) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-0 left-0 right-0 z-[999] bg-yellow-50 border-b border-yellow-200 px-3 sm:px-4 py-3"
        >
          <div className="flex items-center justify-center gap-2 text-yellow-700 text-sm sm:text-base">
            <AlertCircle size={18} className="flex-shrink-0" />
            <span className="font-medium">
              Slow network detected ({effectiveType}). Content is being loaded from cache when available.
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return null;
}
