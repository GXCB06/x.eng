import { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Instagram, ArrowRight, Loader } from 'lucide-react';
import QRCode from 'qrcode.react';
import { Book, Star, GraduationCap, Heart } from './components/PixelArt';
import { useToast, ToastContainer } from './components/Toast';
import { NetworkStatus } from './components/NetworkStatus';
import Modal from './components/Modal';
import QRModal from './components/QRModal';
import { useCounterAnimation } from './hooks/useCounterAnimation';
import { RippleButton } from './components/Ripple';

// Decorative floating elements
const FloatingIcon = ({ icon: Icon, position, delay, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 0.6, y: 0 }}
    transition={{ delay, type: 'spring', stiffness: 100 }}
    className={`absolute ${position}`}
  >
    <Icon size={24} color={color} strokeWidth={1.5} />
  </motion.div>
);

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toasts, showToast, removeToast } = useToast();
  const { scrollY } = useScroll();

  // Parallax background effect
  const backgroundY = useTransform(scrollY, [0, 400], [0, 100]);

  // Counter animations (only animate when in view)
  const intakeCount = useCounterAnimation(20, 1500, true);
  const minGpax = useCounterAnimation(300, 1500, true);

  // Environment variables with fallbacks
  const PORTFOLIO_LINK = import.meta.env.VITE_PORTFOLIO_LINK || 'https://drive.google.com/drive/folders/10KSk8LbTmCpnJA-m-Utv8xiW7MSGnLRN?usp=sharing';
  const INSTAGRAM_LINK = import.meta.env.VITE_INSTAGRAM_LINK || 'https://www.instagram.com/oph.cu.edueng?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.02, y: -4 },
    tap: { scale: 0.98 },
  };

  const openPortfolio = async () => {
    try {
      setIsLoading(true);
      // Simulate slight delay for loading state visibility
      await new Promise(resolve => setTimeout(resolve, 300));
      window.open(PORTFOLIO_LINK, '_blank');
      showToast('✨ Opening Portfolio...', 'success', 2000);
    } catch (error) {
      showToast('❌ Failed to open Portfolio', 'error');
      console.error('Error opening portfolio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyQRToClipboard = () => {
    const qrCanvas = document.querySelector('canvas');
    if (qrCanvas) {
      qrCanvas.toBlob(blob => {
        navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]).then(() => {
          showToast('📋 QR Code copied!', 'success');
        }).catch(() => {
          showToast('QR Code copy failed', 'error');
        });
      });
    }
  };

  return (
    <>
      <NetworkStatus />
      <div className="min-h-screen bg-gradient-to-b from-background via-white to-background relative overflow-hidden px-3 sm:px-4 py-6 sm:py-8">
        {/* Animated Background Gradient */}
        <motion.div
          style={{ y: backgroundY }}
          className="absolute inset-0 opacity-30 pointer-events-none"
        >
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </motion.div>

        {/* Decorative Pixel Art Elements */}
        <Book position="top-16 left-8" delay={0.2} />
        <Star position="top-20 right-12" delay={0.3} />
        <GraduationCap position="bottom-40 left-6" delay={0.4} />
        <Heart position="top-48 right-16" delay={0.5} />
        <Star position="bottom-20 right-8" delay={0.6} />
        <Book position="bottom-60 right-20" delay={0.7} />

        <motion.div
          className="w-full max-w-2xl mx-auto relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
        {/* Header Badge - Enhanced */}
        <motion.div
          className="flex justify-center mb-4 sm:mb-6"
          variants={itemVariants}
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-full"
          >
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-primary/10 to-yellow/10 rounded-full border border-primary/20 w-full justify-center hover:border-primary/40 transition-colors">
              <motion.span
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-xs font-semibold text-primary"
              >
                ●
              </motion.span>
              <span className="text-xs sm:text-sm font-semibold text-primary">EDU Chula Open House 2026</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          className="text-xl sm:text-2xl md:text-5xl font-black text-center leading-tight mb-1 sm:mb-2 text-darkText"
          variants={itemVariants}
        >
          อยากติดเอกอังกฤษ
          <br />
          จุฬาฯ ต้องรู้อะไรบ้าง?
        </motion.h1>

        {/* Subheading */}
        <motion.p
          className="text-center text-xs sm:text-sm md:text-base text-darkText/70 mb-4 sm:mb-6 md:mb-8 leading-relaxed px-1"
          variants={itemVariants}
        >
          รวม Portfolio รุ่นพี่ + เกณฑ์ล่าสุด ครบในที่เดียว 🎓
        </motion.p>

        {/* Stats Section - Enhanced */}
        <motion.div
          className="grid grid-cols-3 gap-2 md:gap-3 mb-8"
          variants={containerVariants}
        >
          {/* Stat 1 - Intake */}
          <motion.div
            className="bg-gradient-to-br from-white to-primary/5 rounded-2xl p-3 md:p-4 shadow-iosSm border border-primary/10 hover:border-primary/30 transition-all"
            variants={itemVariants}
            whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(91, 95, 222, 0.15)' }}
          >
            <div className="text-xl md:text-2xl mb-2">👥</div>
            <div className="text-xs text-primary/70 font-semibold mb-1">รับสมัคร</div>
            <div className="text-xl md:text-2xl font-black text-primary">{intakeCount}</div>
            <div className="text-xs text-text/50 mt-1">คน</div>
          </motion.div>

          {/* Stat 2 - GPAX */}
          <motion.div
            className="bg-gradient-to-br from-white to-yellow/5 rounded-2xl p-3 md:p-4 shadow-iosSm border border-yellow/20 hover:border-yellow/40 transition-all"
            variants={itemVariants}
            whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(255, 214, 10, 0.15)' }}
          >
            <div className="text-xl md:text-2xl mb-2">📊</div>
            <div className="text-xs text-yellow/70 font-semibold mb-1">GPAX ขั้นต่ำ</div>
            <div className="text-xl md:text-2xl font-black text-yellow">
              3.00 - 3.50
            </div>
          </motion.div>

          {/* Stat 3 - Admission */}
          <motion.div
            className="bg-gradient-to-br from-white to-primary/5 rounded-2xl p-3 md:p-4 shadow-iosSm border border-primary/10 hover:border-primary/30 transition-all"
            variants={itemVariants}
            whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(91, 95, 222, 0.15)' }}
          >
            <div className="text-xl md:text-2xl mb-2">📁</div>
            <div className="text-xs text-primary/70 font-semibold mb-1"> Portfolio & Admission</div>
            <div className="text-xl md:text-2xl font-black text-primary">TCAS69</div>
          </motion.div>
        </motion.div>

        {/* Action Buttons - Enhanced with Ripple */}
        <motion.div className="space-y-3 md:space-y-4 mb-8" variants={containerVariants}>
          {/* Purple Button */}
          <motion.div
            variants={itemVariants}
            className="relative"
          >
            <RippleButton
              whileHover="hover"
              whileTap="tap"
              onClick={openPortfolio}
              disabled={isLoading}
              aria-label="ดู Portfolio รุ่นพี่ - ตัวอย่างที่ติดจริง + แนวทางทำ"
              className="w-full bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-4 md:p-6 shadow-iOS text-left group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />

              <motion.div variants={buttonVariants} className="relative z-10">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h2 className="text-lg md:text-xl font-black text-white mb-1 flex items-center gap-2">
                      <span>🎓</span> ดู Portfolio รุ่นพี่
                    </h2>
                    <p className="text-xs md:text-sm text-white/80">
                      ตัวอย่างที่ติดจริง + แนวทางทำ
                    </p>
                  </div>
                  {isLoading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                      <Loader size={20} className="text-white/80 flex-shrink-0" />
                    </motion.div>
                  ) : (
                    <motion.div
                      animate={{ x: [0, 6, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                      className="flex-shrink-0"
                    >
                      <ArrowRight size={20} className="text-white/80" />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </RippleButton>
          </motion.div>

          {/* Yellow Button */}
          <motion.div
            variants={itemVariants}
            className="relative"
          >
            <RippleButton
              whileHover="hover"
              whileTap="tap"
              onClick={() => setIsModalOpen(true)}
              aria-label="ดูเกณฑ์การรับเข้า - สรุป TCAS แบบเข้าใจง่าย"
              className="w-full bg-gradient-to-br from-yellow to-yellow/85 rounded-3xl p-4 md:p-6 shadow-iOS text-left group relative overflow-hidden transition-all"
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />

              <motion.div variants={buttonVariants} className="relative z-10">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h2 className="text-lg md:text-xl font-black text-darkText mb-1 flex items-center gap-2">
                      <span>📈</span> ดูเกณฑ์การรับเข้า
                    </h2>
                    <p className="text-xs md:text-sm text-darkText/70">
                      สรุป TCAS แบบเข้าใจง่าย
                    </p>
                  </div>
                  <motion.div
                    animate={{ x: [0, 6, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    className="flex-shrink-0"
                  >
                    <ArrowRight size={20} className="text-darkText/60" />
                  </motion.div>
                </div>
              </motion.div>
            </RippleButton>
          </motion.div>
        </motion.div>

        {/* QR Code Section */}
        <motion.div
          className="flex flex-col items-center mb-8"
          variants={itemVariants}
        >
          <p className="text-xs text-primary/60 font-semibold mb-4 uppercase tracking-wider">
            👋 Tap to Share
          </p>
          <motion.button
            className="bg-white p-3 md:p-4 rounded-3xl shadow-iOS border-2 border-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all hover:shadow-lg cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsQRModalOpen(true)}
            aria-label="QR Code - Tap to open and share"
            title="Tap to scan or share this link"
          >
            <QRCode
              value={typeof window !== 'undefined' ? window.location.href : 'https://oph.cu.edueng'}
              size={120}
              level="H"
              includeMargin={true}
              bgColor="#FFFFFF"
              fgColor="#5B5FDE"
            />
          </motion.button>
          <p className="text-xs text-primary/50 mt-2 text-center">
            Tap QR code to scan or share with friends
          </p>
        </motion.div>

        {/* Footer Section */}
        <motion.div
          className="text-center"
          variants={itemVariants}
        >
          <p className="text-xs sm:text-sm font-semibold text-primary/70 mb-4">
            💜 ชอบแล้วแชร์ให้เพื่อน!
          </p>

          {/* Social Link */}
          <a
            href={INSTAGRAM_LINK}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow us on Instagram - @oph.cu.edueng"
          >
            <motion.div
              className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 text-white shadow-iOS hover:shadow-iOS focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Instagram size={22} />
            </motion.div>
          </a>

          {/* Footer Text */}
          <p className="text-xs text-primary/50 mt-6">
            ครุศาสตร์ เอกอังกฤษ จุฬาลงกรณ์มหาวิทยาลัย | EDU Chula Open House 2026
          </p>
        </motion.div>
      </motion.div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* QR Modal */}
      <QRModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    </>
  );
}
