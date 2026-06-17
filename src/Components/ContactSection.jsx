import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, ArrowRight, MessageSquare, Check, Copy, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactSection({ isDark }) {
  const [copiedText, setCopiedText] = useState("");

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    toast.success(`${type} copied to clipboard!`);
    setTimeout(() => setCopiedText(""), 2000);
  };

  return (
    <section className={`py-16 md:py-28 relative overflow-hidden transition-colors duration-500 ${isDark ? "bg-black" : "bg-white"}`}>
      {/* Background Lights/Effects */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute bottom-[-10%] right-[-10%] w-[300px] md:w-[500px] aspect-square rounded-full filter blur-[80px] md:blur-[120px] ${
            isDark ? "bg-orange-500/20 mix-blend-screen" : "bg-orange-200/30 mix-blend-multiply"
          }`}
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute top-[-10%] left-[-10%] w-[250px] md:w-[450px] aspect-square rounded-full filter blur-[70px] md:blur-[100px] ${
            isDark ? "bg-pink-500/10 mix-blend-screen" : "bg-pink-200/20 mix-blend-multiply"
          }`}
        />
      </div>

      <div className="max-w-7xl mx-auto px-5 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 md:gap-16 items-center">
          
          {/* Left Content Column */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className={`text-3xl sm:text-4xl font-bold tracking-tight font-bold tracking-tight leading-tight ${isDark ? "text-white" : "text-black"}`}
              style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
            >
              Have a vision in mind?<br />
              <span className={isDark ? "text-neutral-400" : "text-neutral-500"}>Let's bring it to life.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className={`text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0 ${isDark ? "text-neutral-400" : "text-neutral-600"}`}
            >
              Whether you want a custom portrait, need advice on photo quality, or want to discuss a merge sketch, we're just a message away. Reach out to coordinate directly with our artists!
            </motion.p>

            {/* Quick Info Grid */}
            
          </div>

          {/* Right Action / CTA Card Column */}
          <div className="lg:col-span-6 flex justify-center w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
              className={`w-full max-w-lg p-8 md:p-10 rounded-3xl relative overflow-hidden flex flex-col items-center justify-between text-center group backdrop-blur-2xl ${
                isDark
                  ? "bg-white/[0.04] border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_8px_40px_rgba(0,0,0,0.4)]"
                  : "bg-white/60 border border-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_8px_40px_rgba(0,0,0,0.08)]"
              }`}
            >
              {/* Card Liquid Light Decorator */}
<div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
<div className="absolute inset-0 pointer-events-none rounded-3xl">
  <div className="absolute -top-20 -left-10 w-56 h-56 rounded-full bg-white/5 blur-3xl" />
  <div className="absolute bottom-0 right-0 w-40 h-40 rounded-full bg-white/5 blur-3xl" />
</div>

              <div className="relative z-10 flex flex-col items-center">
                {/* Floating Icons Graphic */}
                <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
                  <motion.div
                    animate={{
                      y: [0, -6, 0],
                      rotate: [0, 5, 0]
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center backdrop-blur-xl ${
  isDark
    ? "bg-white/[0.04] border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] text-white"
    : "bg-white/50 border border-white/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] text-black"
}`}
                  >
                    <MessageSquare size={24} />
                  </motion.div>
                  
                  {/* Small decorative sparkle */}
                  <motion.div
                    animate={{
                      scale: [0.8, 1.2, 0.8],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1 right-1 "
                  >
                    <Sparkles size={16} />
                  </motion.div>
                </div>

                <h3 className={`text-xl sm:text-2xl font-bold mb-3 ${isDark ? "text-white" : "text-black"}`} style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
                  Got a custom request?
                </h3>
                
                <p className={`text-xs sm:text-sm leading-relaxed max-w-sm mb-8 ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                  Visit our Contact Page to send us a direct message, check business hours, or read through our comprehensive FAQs!
                </p>

                <Link to="/contact" className="w-full" style={{ textDecoration: "none" }}>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`w-full py-3.5 px-6 rounded-full text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                      isDark 
                        ? "bg-white text-black hover:bg-neutral-200" 
                        : "bg-black text-white hover:bg-neutral-800"
                    }`}
                  >
                    <span>Go to Contact Page</span>
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </motion.button>
                </Link>
              </div>
              
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
