import { useEffect, useState } from 'react';

const useCounterAnimation = (endValue, duration = 1500, isVisible = true) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    let startTime = null;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Use easeOutQuad for smooth deceleration
      const easeProgress = 1 - Math.pow(1 - progress, 2);
      const currentValue = Math.floor(easeProgress * endValue);

      setCount(currentValue);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(endValue);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [endValue, duration, isVisible]);

  return count;
};

export { useCounterAnimation };
