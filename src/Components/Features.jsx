import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Truck, Trophy, PenTool, Zap, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: <PenTool size={22} />,
    title: "Artisan Craftsmanship",
    desc: "Every piece is 100% hand-drawn from scratch. No digital filters, just pure skill and artistic intuition.",
    color: "text-neutral-900 dark:text-white",
    bg: "bg-black/5 dark:bg-white/10"
  },
  {
    icon: <Trophy size={22} />,
    title: "Museum Grade",
    desc: "We use archival-quality papers and premium professional-grade materials ensuring your art lasts for generations.",
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    icon: <ShieldCheck size={22} />,
    title: "Artist Verification",
    desc: "Direct communication with the artist throughout the process to ensure every detail matches your vision.",
    color: "text-green-500",
    bg: "bg-green-500/10"
  },
  {
    icon: <Truck size={22} />,
    title: "Global Excellence",
    desc: "Bespoke, secure packaging and insured pan-India delivery. Your masterpiece arrives in pristine condition.",
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  }
];

export default function Features({ isDark }) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`py-12 md:py-24 px-4 sm:px-6 transition-colors duration-500 ${isDark ? "bg-black" : "bg-white"}`}
    >
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2
              className={`text-3xl sm:text-4xl font-bold tracking-tight mb-4 sm:mb-6 ${isDark ? "text-white" : "text-black"}`}
              style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}
            >
              Professional <span className="text-neutral-500">Standards</span>
            </h2>
            <p className={`max-w-2xl mx-auto text-[13px] sm:text-[14px] md:text-base leading-relaxed ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
              More than just a sketch. We provide a premium experience from the first consultation
              to the final delivery, ensuring excellence in every stroke.
            </p>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className={`p-6 md:p-8 rounded-2xl border transition-all duration-300 group hover:-translate-y-2 ${isDark
                  ? "bg-neutral-900/50 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900"
                  : "bg-neutral-50 border-neutral-200 hover:border-neutral-300 hover:shadow-xl hover:bg-white"
                }`}
            >
              <div className={`w-10 h-10 rounded-lg ${feature.bg} ${feature.color} flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300`}>
                {feature.icon}
              </div>
              <h3
                className={`text-xl mb-4 ${isDark ? "text-white" : "text-neutral-900"}`}
                style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}
              >
                {feature.title}
              </h3>
              <p className={`text-sm leading-relaxed ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Final CTA Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className={`mt-12 md:mt-20 p-6 sm:p-8 md:p-12 rounded-2xl md:rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 ${isDark ? "bg-white text-black" : "bg-black text-white"
            }`}
        >
          <div className="relative z-10 text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-bold mb-2">Ready to start your commission?</h3>
            <p className="opacity-70 text-[13px] sm:text-sm md:text-base">Experience the blend of soul and precision in every artwork.</p>
          </div>

          <div className="flex w-full md:w-auto relative z-10">
            <Link to="/order" className="w-full md:w-auto">
              <button className={`w-full md:w-auto px-8 py-3 rounded-2xl font-medium transition-transform active:scale-95 ${isDark ? "bg-black text-white hover:bg-neutral-900" : "bg-white text-black hover:bg-neutral-100"
                }`}>
                Order Now
              </button>
            </Link>
          </div>

          {/* Decorative Elements */}
          <div className={`absolute right-0 top-0 w-64 h-64 blur-3xl opacity-20 -mr-20 -mt-20 ${isDark ? "bg-black" : "bg-white"}`} />
        </motion.div>
      </div>
    </section>
  );
}
