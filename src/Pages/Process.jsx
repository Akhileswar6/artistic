import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CarouselPostsSection from "../Components/CarouselPostsSection";

export default function Process({ isDark }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen pt-16 md:pt-24 pb-8 md:pb-12 transition-colors duration-500 ${isDark ? "bg-[#0a0a0a]" : "bg-[#fcfcfc]"}`} 
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        
        {/* Toggle Cards Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-2 sm:mb-4 ${isDark ? "text-white" : "text-neutral-900"}`} style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
            Behind The <span className="text-neutral-500">Process</span>
          </h1>
          <p className={`text-[13px] sm:text-[14px] leading-relaxed mb-6 sm:mb-8 ${isDark ? "text-neutral-400" : "text-neutral-500"}`}>
            Dive deeper into the creation of each masterpiece. Swipe through these carousel posts to see the evolution from raw sketch to final detail.
          </p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-lg mx-auto mb-8 sm:mb-12"
          >
            {/* Inactive Gallery Card */}
            <Link to="/gallery" className="flex-1 w-full">
              <div className={`flex flex-col items-center justify-center p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all hover:-translate-y-1 hover:shadow-lg ${
                isDark ? "bg-transparent border-white/20 text-neutral-400 hover:border-white hover:text-white" : "bg-transparent border-black/20 text-neutral-500 hover:border-black hover:text-black"
              }`}>
                <h3 className="text-base sm:text-lg font-bold mb-1">All Artworks</h3>
                <p className="text-[11px] sm:text-xs opacity-70">Main Collection</p>
              </div>
            </Link>

            {/* Active Carousel Card */}
            <div className={`flex-1 flex flex-col items-center justify-center w-full p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all cursor-default ${
              isDark ? "bg-white/5 border-white text-white" : "bg-black/5 border-black text-black"
            }`}>
              <h3 className="text-base sm:text-lg font-bold mb-1">
                Process Carousel
              </h3>
              <p className={`text-[11px] sm:text-xs ${isDark ? "text-neutral-400" : "text-neutral-500"}`}>Swipeable Stories</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          <CarouselPostsSection isDark={isDark} />
        </motion.div>
      </div>
    </motion.div>
  );
}
