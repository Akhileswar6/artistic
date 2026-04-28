import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, X, Calendar, Tag, User, Instagram, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RecentSketches({ isDark }) {
  const sketches = [
    { id: 1, img: "/RecentArtworks/Lord%20hanuman.webp", title: "Divine Hanuman", category: "Sketch", artist: "Internal Studio", date: "February 2026", instagramUrl: "https://www.instagram.com/p/DVk8LsUkd8p/", description: "A detailed divine portrait capturing the powerful yet serene essence of Lord Hanuman. जय श्री राम" },
    { id: 2, img: "/RecentArtworks/Durga.webp", title: "Goddess Durga", category: "Realistic", artist: "Internal Studio", date: "October 2025", instagramUrl: "https://www.instagram.com/p/DPTl3WfEbtJ/", description: "Intricate charcoal study focusing on the fierce and protective nature of Goddess Durga." },
    { id: 3, img: "/RecentArtworks/Hanuman.webp", title: "Lord Hanuman", category: "Realistic", artist: "Internal Studio", date: "January 2026", instagramUrl: "https://www.instagram.com/p/DTCofNoEaYq/", description: "Vibrant color study showcasing divine strength and spiritual devotion." },
    { id: 4, img: "/RecentArtworks/Akhil.webp", title: "Realistic Portrait", category: "Realistic Potrait", artist: "Internal Studio", date: "January 2025", instagramUrl: "https://www.instagram.com/p/DE9pYusSont/", description: "High-fidelity pencil portrait focusing on realistic skin textures and lighting." },
    { id: 5, img: "/RecentArtworks/Pawan%20Kalyan.webp", title: "Pawan Kalyan Sketch", category: "Realistic Potrait", artist: "Internal Studio", date: "September 2023", instagramUrl: "https://www.instagram.com/p/C7y-VdkyKKr/", description: "Character study sketch capturing the iconic persona through detailed pencil work." },
  ];
  // ... rest of the component


  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const gridRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (gridRef.current) observer.observe(gridRef.current);
    return () => observer.disconnect();
  }, []);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (selectedArtwork) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [selectedArtwork]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section className="relative py-8 md:py-12 px-2 sm:px-4 overflow-hidden">
      <div className="max-w-[1600px] mx-auto relative z-10">

        {/* Minimal Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 px-2 sm:px-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
              Latest <span className="text-neutral-500 ">Work</span>
            </h2>
            <p className={`text-[13px] sm:text-sm mt-1 font-medium ${isDark ? "text-neutral-500" : "text-neutral-400"}`}>
              Hand-picked sketches from our studio
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <Link
              to="/gallery"
              className={`inline-flex items-center gap-2 text-[13px] sm:text-sm px-4 py-2 rounded-full border transition-all ${isDark ? "text-white border-white/20 hover:bg-white/10" : "text-black border-black/20 hover:bg-black/5"
                }`}
            >
              Go to Gallery <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>

        {/* Masonry Grid */}
        <motion.div
          ref={gridRef}
          variants={containerVariants}
          initial="hidden"
          animate={visible ? "visible" : "hidden"}
          className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-3 sm:gap-4 space-y-3 sm:space-y-4 px-2 sm:px-4"
        >
          {sketches.map((sketch) => (
            <motion.div
              key={sketch.id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              onClick={() => setSelectedArtwork(sketch)}
              className={`break-inside-avoid group relative rounded-xl overflow-hidden transition-all duration-300 cursor-pointer ${isDark
                ? "bg-neutral-900 border border-white/5 hover:border-white/10 shadow-2xl"
                : "bg-white border border-black/5 shadow-lg hover:shadow-xl"
                }`}
            >
              {/* Image Container */}
              <div className="relative overflow-hidden">
                <motion.img
                  src={sketch.img}
                  alt={sketch.title}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-auto object-contain"
                />

                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full pointer-events-none" />
              </div>

              {/* Bottom Label */}
              <div className="p-3">
                <h3 className={`text-xs font-medium truncate ${isDark ? "text-neutral-300" : "text-neutral-800"}`}>
                  {sketch.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Modal Backdrop & Content */}
      <AnimatePresence>
        {selectedArtwork && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 backdrop-blur-xl bg-black/80"
            onClick={() => setSelectedArtwork(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`relative w-full max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col md:flex-row ${isDark ? "bg-[#111] border border-white/10" : "bg-white"
                }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedArtwork(null)}
                className={`absolute top-3 right-3 z-50 p-1.5 rounded-full transition-colors ${isDark ? "bg-white/10 text-white hover:bg-white/20" : "bg-black/5 text-black hover:bg-black/10"
                  }`}
              >
                <X size={18} />
              </button>

              {/* Image Side */}
              <div className="w-full md:w-3/5 bg-black/5 flex items-center justify-center p-4">
                <img
                  src={selectedArtwork.img}
                  alt={selectedArtwork.title}
                  className="max-w-full max-h-[40vh] md:max-h-[80vh] object-contain rounded-lg shadow-xl"
                />
              </div>

              {/* Content Side */}
              <div className="w-full md:w-2/5 p-5 sm:p-6 md:p-8 overflow-y-auto">
                <div className="flex flex-col h-full">
                  <div className="mb-5 md:mb-6">
                    <span className="inline-block px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-500 text-[11px] sm:text-[12px] mb-3 font-medium">
                      {selectedArtwork.category}
                    </span>
                    <h2 className={`text-xl sm:text-2xl md:text-3xl mb-2 sm:mb-3 tracking-tight ${isDark ? "text-white" : "text-neutral-900"}`} style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
                      {selectedArtwork.title}
                    </h2>
                    <p className={`text-[13px] sm:text-[14px] leading-relaxed mb-5 md:mb-6 ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                      {selectedArtwork.description}
                    </p>
                  </div>


                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg ${isDark ? "bg-white/5 text-neutral-400" : "bg-neutral-100 text-neutral-500"}`}>
                        <User size={16} />
                      </div>
                      <div>
                        <p className={`text-[9px] uppercase tracking-wider font-bold ${isDark ? "text-neutral-600" : "text-neutral-400"}`}>Artist</p>
                        <p className={`text-xs font-medium ${isDark ? "text-neutral-300" : "text-neutral-800"}`}>{selectedArtwork.artist}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg ${isDark ? "bg-white/5 text-neutral-400" : "bg-neutral-100 text-neutral-500"}`}>
                        <Tag size={16} />
                      </div>
                      <div>
                        <p className={`text-[9px] uppercase tracking-wider font-bold ${isDark ? "text-neutral-600" : "text-neutral-400"}`}>Category</p>
                        <p className={`text-xs font-medium ${isDark ? "text-neutral-300" : "text-neutral-800"}`}>{selectedArtwork.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg ${isDark ? "bg-white/5 text-neutral-400" : "bg-neutral-100 text-neutral-500"}`}>
                        <Calendar size={16} />
                      </div>
                      <div>
                        <p className={`text-[9px] uppercase tracking-wider font-bold ${isDark ? "text-neutral-600" : "text-neutral-400"}`}>Date Created</p>
                        <p className={`text-xs font-medium ${isDark ? "text-neutral-300" : "text-neutral-800"}`}>{selectedArtwork.date}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto flex flex-col gap-2">
                    <Link to="/order" className="w-full" onClick={() => setSelectedArtwork(null)}>
                      <button className={`w-full py-3 sm:py-2.5 rounded-lg text-[14px] sm:text-[13px] font-medium transition-all transform active:scale-[0.98] ${isDark ? "bg-white text-black hover:bg-neutral-200 shadow-lg shadow-white/5" : "bg-black text-white hover:bg-neutral-900 shadow-lg shadow-black/20"
                        }`}>
                        Order Similar Sketch
                      </button>
                    </Link>

                    {selectedArtwork.instagramUrl && (
                      <a
                        href={selectedArtwork.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full"
                      >
                        <button className={`w-full py-3 sm:py-2.5 rounded-lg text-[14px] sm:text-[13px] font-medium border flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] ${isDark
                          ? "bg-white/5 text-white border-white/10 hover:bg-white/10"
                          : "bg-black/5 text-black border-black/10 hover:bg-black/10"
                          }`}>
                          <Instagram size={16} className="text-pink-500" />
                          View on Instagram
                          <ExternalLink size={14} className="opacity-50" />
                        </button>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

