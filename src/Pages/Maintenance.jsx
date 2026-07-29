import React from "react";
import { Settings, Wrench, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

export default function Maintenance({ isDark }) {
  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-500 ${
        isDark ? "bg-[#050505] text-white" : "bg-neutral-50 text-black"
      }`}
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="max-w-2xl w-full text-center space-y-8 relative z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative inline-flex items-center justify-center"
        >
          <div
            
          >
            <Settings size={48} className="animate-[spin_4s_linear_infinite] opacity-80 text-blue-300" />
            <Wrench
              size={24}
              className="absolute bottom-6 right-6 md:bottom-8 md:right-8 text-blue-400"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="space-y-4"
        >
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight"
            style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
          >
            System Maintenance
          </h1>
          <p
            className={`text-base md:text-md max-w-lg mx-auto leading-relaxed ${
              isDark ? "text-neutral-400" : "text-neutral-600"
            }`}
          >
            We are currently upgrading our platform architecture to provide you with a faster, more secure, and seamless experience. Normal operations will resume shortly.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="pt-8 flex justify-center gap-4"
        >
          <div
            className={`inline-flex items-center gap-3 px-4 py-2 rounded-full text-sm font-medium border shadow-lg ${
              isDark
                ? "bg-amber-500/10 border-amber-500/20 text-amber-400 shadow-amber-500/5"
                : "bg-amber-50 border-amber-200 text-amber-700 shadow-amber-500/10"
            }`}
          >
            <ShieldAlert size={18} className="animate-pulse" />
            Check back in a few minutes
          </div>
        </motion.div>
      </div>

      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/5 blur-[120px]"></div>
      </div>
    </div>
  );
}
