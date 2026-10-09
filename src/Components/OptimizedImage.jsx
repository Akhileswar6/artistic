import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function OptimizedImage({ 
  src, 
  alt, 
  className = "", 
  imgClassName = "",
  objectFit = "cover",
  ...props 
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  const isContain = objectFit === "contain" || className.includes("object-contain") || imgClassName.includes("object-contain");
  const fitClass = isContain ? "object-contain" : "object-cover";

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Skeleton / Placeholder */}
      <AnimatePresence>
        {!isLoaded && !error && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
          >
             <div className="w-full h-full animate-pulse bg-neutral-200 dark:bg-neutral-800" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actual Image */}
      <motion.img
        src={src}
        alt={alt}
        className={`w-full ${className.includes("h-auto") ? "h-auto" : "h-full"} ${fitClass} transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"} ${imgClassName}`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        loading="lazy"
        decoding="async"
        {...props}
      />

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-neutral-400 text-xs">
          Failed to load
        </div>
      )}
    </div>
  );
}
