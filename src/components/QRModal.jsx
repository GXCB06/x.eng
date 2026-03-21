import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import QRCode from 'qrcode.react';

export default function QRModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    const url = typeof window !== 'undefined' ? window.location.href : 'https://oph.cu.edueng';
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

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
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-2 sm:p-4"
          >
            <motion.div className="bg-white rounded-2xl sm:rounded-3xl shadow-iOS w-full max-w-sm sm:max-w-md relative">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label="Close modal"
              >
                <X size={20} className="text-gray-600" />
              </button>

              {/* Content */}
              <div className="p-4 sm:p-6 md:p-8 pt-12 flex flex-col items-center">
                <h2 className="text-lg sm:text-xl md:text-2xl font-black text-darkText mb-1 sm:mb-2 text-center">
                  Scan to Visit
                </h2>
                <p className="text-xs sm:text-sm text-darkText/60 mb-4 sm:mb-6 text-center px-2">
                  Share this link with your friends
                </p>

                {/* QR Code */}
                <motion.div
                  className="bg-white p-2 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl border-2 border-primary/10 mb-4 sm:mb-6 shadow-iosSm"
                  whileHover={{ scale: 1.02 }}
                >
                  <QRCode
                    value={typeof window !== 'undefined' ? window.location.href : 'https://oph.cu.edueng'}
                    size={160}
                    level="H"
                    includeMargin={true}
                    bgColor="#FFFFFF"
                    fgColor="#5B5FDE"
                  />
                </motion.div>

                {/* Buttons */}
                <div className="w-full space-y-2 sm:space-y-3">
                  {/* Share Link Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCopyLink}
                    className="w-full bg-gradient-to-br from-primary to-primary/80 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-white font-semibold text-xs sm:text-sm md:text-base flex items-center justify-center gap-2 shadow-iOS transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    {copied ? (
                      <>
                        <Check size={16} className="text-white flex-shrink-0" />
                        <span>Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={16} className="text-white flex-shrink-0" />
                        <span>Share via Link</span>
                      </>
                    )}
                  </motion.button>

                  {/* Close Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="w-full bg-gray-100 hover:bg-gray-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-darkText font-semibold text-xs sm:text-sm md:text-base transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    Close
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
