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
      className={`min-h-screen pt-28 md:pt-32 pb-8 md:pb-12 transition-colors duration-500 ${isDark ? "bg-[#0a0a0a]" : "bg-[#fcfcfc]"}`} 
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
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-md mx-auto mb-8 sm:mb-12"
          >
            {/* Inactive Gallery Button */}
            <Link to="/gallery" className="flex-1 w-full">
              <div className={`flex items-center justify-center w-full px-5 py-3 text-[15px] font-medium rounded-full shadow-lg transition-all cursor-pointer border ${isDark
                  ? "bg-white/5 text-neutral-400 border-white/10 hover:border-white/30 hover:text-white"
                  : "bg-white/40 text-neutral-500 border-black/10 hover:border-black/30 hover:text-black shadow-sm"
                }`}>
                <span>All Artworks</span>
              </div>
            </Link>

            {/* Active Carousel Button */}
            <div className={`flex-1 flex items-center justify-center w-full px-2 py-3 text-[15px] font-medium rounded-full transition-all border cursor-default backdrop-blur-md ${isDark
                ? "bg-white/10 text-white border-white/20 shadow-[0_4px_15px_rgba(0,0,0,0.2)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
                : "bg-black/5 text-black border-black/10 shadow-[0_4px_15px_rgba(0,0,0,0.05)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] shadow-md"
              }`}>
              <span>Process Carousel</span>
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
