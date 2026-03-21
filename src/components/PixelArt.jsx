import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

// Decorative element with parallax effect
const ParallaxElement = ({ children, position, delay, offset = 30 }) => {
  const ref = useRef(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, offset]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 0.7, y: 0 }}
      transition={{ delay }}
      style={{ y }}
      className={`absolute ${position}`}
    >
      {children}
    </motion.div>
  );
};

// Pixel Art Components
const Book = ({ position, delay }) => (
  <ParallaxElement position={position} delay={delay} offset={20}>
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect x="4" y="6" width="10" height="16" fill="#5B5FDE" opacity="0.8" />
      <rect x="18" y="6" width="10" height="16" fill="#FFD60A" opacity="0.8" />
      <line x1="14" y1="6" x2="14" y2="22" stroke="#5B5FDE" strokeWidth="2" />
      <circle cx="9" cy="14" r="1.5" fill="#FFD60A" />
      <circle cx="23" cy="14" r="1.5" fill="#5B5FDE" />
    </svg>
  </ParallaxElement>
);

const Star = ({ position, delay }) => (
  <ParallaxElement position={position} delay={delay} offset={25}>
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <polygon points="14,2 20,10 28,12 22,18 24,26 14,22 4,26 6,18 0,12 8,10" fill="#FFD60A" opacity="0.8" />
    </svg>
  </ParallaxElement>
);

const GraduationCap = ({ position, delay }) => (
  <ParallaxElement position={position} delay={delay} offset={15}>
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <polygon points="6,14 16,6 26,14" fill="#5B5FDE" opacity="0.8" />
      <rect x="10" y="14" width="12" height="12" fill="#5B5FDE" opacity="0.6" />
      <line x1="16" y1="26" x2="16" y2="32" stroke="#5B5FDE" strokeWidth="2" />
    </svg>
  </ParallaxElement>
);

const Heart = ({ position, delay }) => (
  <ParallaxElement position={position} delay={delay} offset={20}>
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <path d="M13 24C6 18 2 14 2 10C2 7 4 5 7 5C9 5 11 6 13 8C15 6 17 5 19 5C22 5 24 7 24 10C24 14 20 18 13 24Z" fill="#FF6B9D" opacity="0.7" />
    </svg>
  </ParallaxElement>
);

export { Book, Star, GraduationCap, Heart };
