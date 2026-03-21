import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { useState, useCallback } from 'react';

const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);

    if (duration) {
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return { toasts, showToast, removeToast };
};

const Toast = ({ id, message, type, onRemove }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, x: 300 }}
    animate={{ opacity: 1, y: 0, x: 0 }}
    exit={{ opacity: 0, y: 50, x: 300 }}
    className={`fixed bottom-6 right-6 flex items-center gap-3 px-4 py-4 rounded-2xl shadow-iOS max-w-sm z-[100] ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`}
  >
    {type === 'success' ? (
      <CheckCircle size={20} />
    ) : (
      <AlertCircle size={20} />
    )}
    <p className="font-medium text-sm">{message}</p>
    <button
      onClick={() => onRemove(id)}
      className="ml-2 text-white/80 hover:text-white transition-colors"
      aria-label="Close notification"
    >
      ✕
    </button>
  </motion.div>
);

const ToastContainer = ({ toasts, onRemove }) => (
  <AnimatePresence>
    {toasts.map(toast => (
      <Toast
        key={toast.id}
        id={toast.id}
        message={toast.message}
        type={toast.type}
        onRemove={onRemove}
      />
    ))}
  </AnimatePresence>
);

export { useToast, ToastContainer };
