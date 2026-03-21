import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Ripple({ x, y, onComplete }) {
  return (
    <motion.span
      initial={{ scale: 0, opacity: 0.8 }}
      animate={{ scale: 4, opacity: 0 }}
      transition={{ duration: 0.6, easeOut: 'easeOut' }}
      onAnimationComplete={onComplete}
      className="absolute rounded-full bg-white pointer-events-none"
      style={{
        left: x,
        top: y,
        width: 10,
        height: 10,
        marginLeft: -5,
        marginTop: -5,
      }}
    />
  );
}

export function RippleButton({ children, whileHover, whileTap, ...props }) {
  const [ripples, setRipples] = useState([]);

  const handleMouseDown = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples((prev) => [...prev, { id, x, y }]);

    // Auto-remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
    }, 600);
  };

  return (
    <motion.button
      whileHover={whileHover}
      whileTap={whileTap}
      {...props}
      onMouseDown={handleMouseDown}
      className={`relative overflow-hidden ${props.className || ''}`}
    >
      {ripples.map((ripple) => (
        <Ripple key={ripple.id} x={ripple.x} y={ripple.y} />
      ))}
      {children}
    </motion.button>
  );
}
