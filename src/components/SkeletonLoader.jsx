import { motion } from 'framer-motion';

export default function SkeletonLoader() {
  return (
    <motion.div
      className="w-full bg-gray-200 rounded-2xl"
      style={{ aspectRatio: '16 / 9' }}
      animate={{
        opacity: [0.5, 0.8, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}
