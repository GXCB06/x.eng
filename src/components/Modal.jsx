import { motion, AnimatePresence } from 'framer-motion';
import { X, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import SkeletonLoader from './SkeletonLoader';

export default function Modal({ isOpen, onClose }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Reset image loaded state when modal opens
  useEffect(() => {
    if (isOpen) {
      setImageLoaded(false);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
          >
            <motion.div className="bg-white rounded-2xl sm:rounded-3xl shadow-iOS w-full max-w-lg sm:max-w-2xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto relative">
              {/* Close Button - iOS Style */}
              <button
                onClick={onClose}
                className="sticky top-3 right-3 sm:top-4 sm:right-4 z-20 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label="Close modal"
              >
                <X size={20} className="text-gray-600" />
              </button>

              {/* Infographic Image */}
              <div className="p-3 sm:p-4 md:p-6 pt-2">
                {!imageLoaded && <SkeletonLoader />}
                <motion.img
                  src="/inforgraphic.png"
                  alt="เกณฑ์การรับเข้า Chulalongkorn English Major"
                  className={`w-full h-auto rounded-xl sm:rounded-2xl transition-opacity duration-300 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageLoaded(true)}
                />

                {/* Download Button */}
                {imageLoaded && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="mt-4 sm:mt-6"
                  >
                    <a
                      href="/poster.pdf"
                      download="Chulalongkorn-English-Criteria.pdf"
                      className="flex items-center justify-center gap-2 w-full bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white rounded-xl sm:rounded-2xl px-4 py-3 sm:py-4 font-semibold text-sm sm:text-base shadow-iOS transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      aria-label="Download criteria PDF"
                      title="Download criteria as PDF"
                    >
                      <Download size={18} className="flex-shrink-0" />
                      <span>Download PDF</span>
                    </a>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
