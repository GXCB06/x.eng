import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * LazyImage component that loads images on demand with optional blur-up effect
 * Falls back to cached image if available (works with Service Worker)
 */
export function LazyImage({
  src,
  alt,
  className = '',
  width,
  height,
  onLoad,
  placeholderColor = 'bg-gray-200',
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    // Use Intersection Observer for lazy loading
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Start loading the image
            const newImg = new Image();
            newImg.onload = () => {
              setIsLoaded(true);
              if (onLoad) onLoad();
            };
            newImg.onerror = () => {
              setHasError(true);
              if (onLoad) onLoad();
            };
            newImg.src = src;
            observer.unobserve(img);
          }
        });
      },
      { rootMargin: '50px' } // Start loading 50px before visible
    );

    observer.observe(img);

    return () => observer.disconnect();
  }, [src, onLoad]);

  return (
    <motion.div
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Placeholder while loading */}
      {!isLoaded && !hasError && (
        <div className={`absolute inset-0 ${placeholderColor} animate-pulse`} />
      )}

      {/* Actual image */}
      {!hasError && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
        />
      )}

      {/* Error fallback */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
          <span className="text-gray-500 text-sm">Failed to load image</span>
        </div>
      )}
    </motion.div>
  );
}
