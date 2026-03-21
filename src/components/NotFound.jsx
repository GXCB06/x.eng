import { motion } from 'framer-motion';
import { ArrowLeft, Home } from 'lucide-react';

export function NotFound() {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-white to-background relative overflow-hidden px-3 sm:px-4 py-12 sm:py-16 flex items-center">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <motion.div
        className="w-full max-w-2xl mx-auto relative z-10 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 404 Number */}
        <motion.div variants={itemVariants}>
          <h1 className="text-9xl sm:text-[120px] md:text-[150px] font-black text-transparent bg-gradient-to-br from-primary to-yellow bg-clip-text leading-none mb-4">
            404
          </h1>
        </motion.div>

        {/* Title */}
        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl font-black text-darkText mb-3"
          variants={itemVariants}
        >
          Page Not Found
        </motion.h2>

        {/* Description */}
        <motion.p
          className="text-base sm:text-lg text-darkText/60 mb-4 px-2"
          variants={itemVariants}
        >
          Oops! ดูเหมือนว่าหน้าเว็บนี้หาไม่เจอ หรือถูกย้ายไปที่อื่น
        </motion.p>

        <motion.p
          className="text-sm sm:text-base text-darkText/50 mb-8 px-2"
          variants={itemVariants}
        >
          ลองกลับไปหน้าแรกหรือตรวจสอบ URL ใหม่
        </motion.p>

        {/* Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 justify-center"
          variants={itemVariants}
        >
          {/* Back Button */}
          <motion.button
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl sm:rounded-2xl bg-gray-100 hover:bg-gray-200 text-darkText font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            <ArrowLeft size={20} />
            <span>Go Back</span>
          </motion.button>

          {/* Home Button */}
          <motion.a
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold shadow-iOS transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <Home size={20} />
            <span>Back to Home</span>
          </motion.a>
        </motion.div>

        {/* Decorative Element */}
        <motion.div
          className="mt-12"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="text-4xl">🔍</div>
        </motion.div>

        {/* Extra Info */}
        <motion.div
          className="mt-12 p-4 bg-primary/5 rounded-xl border border-primary/10"
          variants={itemVariants}
        >
          <p className="text-xs sm:text-sm text-darkText/70">
            💡 Helpful tips:
            <br />
            • Check the URL for typos
            <br />
            • Use the menu to navigate
            <br />
            • Contact us if the issue persists
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
