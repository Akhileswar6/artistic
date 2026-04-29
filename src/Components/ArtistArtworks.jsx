import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, X, User, Tag, Calendar, Instagram, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const artworks = [
  {
    id: 1,
    title: "Chatrapati Shivaji Maharaj",
    category: "Realistic",
    image: "/ArtistArtWorks/Chatrapathi%20shivaji%20maharaj.webp",
    artist: "Internal Studio",
    date: "December 2022",
    instagramUrl: "https://www.instagram.com/p/CmQcOgDo7GN/",
    description: "A powerful realistic portrait of the legendary Maratha warrior king, capturing his visionary leadership and warrior spirit.",
  },
  {
    id: 2,
    title: "Lord Ganesha",
    category: "Divine",
    image: "/ArtistArtWorks/Lord%20ganesha.webp",
    artist: "Internal Studio",
    date: "August 2022",
    instagramUrl: "https://www.instagram.com/p/Ch5NPLxvANj/",
    description: "Vibrant depiction of the remover of obstacles, showcasing intricate details and traditional symbolism.",
  },
  {
    id: 3,
    title: "Art vs Artist",
    category: "Collage",
    image: "/ArtistArtWorks/artvsartist.webp",
    artist: "Internal Studio",
    date: "June 2023",
    instagramUrl: "https://www.instagram.com/p/Cm_-V4JSEWO/",
    description: "A creative compilation showcasing the artist alongside their favorite creations from the past year.",
  },
  {
    id: 4,
    title: "Childhood",
    category: "Realistic",
    image: "/ArtistArtWorks/Child%20Akhil.webp",
    artist: "Internal Studio",
    date: "August 2023",
    instagramUrl: "https://www.instagram.com/p/Cv-bBZlywP6/",
    description: "A soulful study of childhood, capturing the pure and innocent expression of a young boy.",
  },
  {
    id: 5,
    title: "Lord Hanuman - Divine Grace",
    category: "Divine",
    image: "/ArtistArtWorks/lord%20hanuman1.webp",
    artist: "Internal Studio",
    date: "January 2026",
    instagramUrl: "https://www.instagram.com/p/DTI9S5oEwkH/",
    description: "Majestic depiction of Lord Hanuman, focusing on divine strength and unwavering devotion.",
  },
  {
    id: 6,
    title: "Nature Study",
    category: "Nature",
    image: "/ArtistArtWorks/nature.jpg",
    artist: "Internal Studio",
    date: "October 2021",
    instagramUrl: "https://www.instagram.com/p/CVahGNFMJPS/",
    description: "Detailed landscape and flora study, exploring the intricate patterns of the natural world.",
  }
];

export default function ArtistArtworks({ isDark }) {
  const [selectedArt, setSelectedArt] = useState(null);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

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

  // Prevent scroll when modal is open
  useEffect(() => {
    if (selectedArt) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [selectedArt]);

  return (
    <section
      ref={sectionRef}
      className={`py-14 px-4 md:px-8 transition-colors duration-500 ${isDark ? "bg-black" : "bg-[#fcfcfc]"
        }`}
    >
      <div className="max-w-[1400px] mx-auto">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 md:mb-12 gap-4 sm:gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight ${isDark ? "text-white" : "text-neutral-900"
              }`} style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
              Artist's <span className="text-neutral-500">Artworks</span>
            </h2>
            <p className={`mt-2 sm:mt-3 max-w-xl text-[13px] sm:text-[14px] leading-relaxed ${isDark ? "text-neutral-400" : "text-neutral-500"
              }`}>
              A curated collection of masterfully crafted pieces from our main artist.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Link
              to="/gallery"
              className={`inline-flex items-center gap-2 text-[13px] sm:text-sm px-4 py-2 rounded-full border transition-all duration-300 ${isDark
                ? "text-white border-white/20 hover:bg-white/10"
                : "text-black border-black/20 hover:bg-black/5"
                }`}
            >
              <span>Explore Full Gallery</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* Art Grid - Masonry Layout */}
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="columns-2 lg:columns-4 gap-4 sm:gap-6 px-2 sm:px-4 space-y-4 sm:space-y-6"
        >
          {artworks.map((art) => (
            <motion.div
              key={art.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
              }}
              whileHover={{ y: -5 }}
              onClick={() => setSelectedArt(art)}
              className={`break-inside-avoid group relative rounded-xl overflow-hidden transition-all duration-500 cursor-pointer mb-4 sm:mb-6 ${isDark
                ? "bg-neutral-900 border border-white/5 hover:border-white/10 shadow-2xl"
                : "bg-white border border-black/5 shadow-lg hover:shadow-xl"
                }`}
            >
              {/* Image Container - Natural Aspect Ratio */}
              <div className="relative overflow-hidden">
                <motion.img
                  src={art.image}
                  alt={art.title}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-auto"
                />

                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full pointer-events-none" />
              </div>

              {/* Bottom Label */}
              <div className="p-3">
                <h3 className={`text-xs font-medium truncate ${isDark ? "text-neutral-300" : "text-neutral-800"}`}>
                  {art.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Modal Backdrop & Content */}
        <AnimatePresence>
          {selectedArt && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 backdrop-blur-xl bg-black/80"
              onClick={() => setSelectedArt(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className={`relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col md:flex-row ${isDark ? "bg-[#111] border border-white/10" : "bg-white"
                  }`}
                onClick={(e) => e.stopPropagation()}
              >

                {/* Close Button */}
                <button
                  onClick={() => setSelectedArt(null)}
                  className={`absolute top-3 right-3 z-50 p-1.5 rounded-full transition-colors ${isDark ? "bg-white/10 text-white hover:bg-white/20" : "bg-black/5 text-black hover:bg-black/10"
                    }`}
                >
                  <X size={18} />
                </button>

                {/* Image Side */}
                <div className="w-full md:w-3/5 bg-black/5 flex items-center justify-center p-4">
                  <img
                    src={selectedArt.image}
                    alt={selectedArt.title}
                    className="max-w-full max-h-[40vh] md:max-h-[80vh] object-contain rounded-lg shadow-xl"
                  />
                </div>

                {/* Content Side */}
                <div className="w-full md:w-2/5 p-5 sm:p-6 md:p-8 overflow-y-auto">
                  <div className="flex flex-col h-full">
                    <div className="mb-5 md:mb-6">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] sm:text-[12px] mb-3 font-semibold uppercase tracking-wider ${isDark ? "bg-white/10 text-white" : "bg-black/5 text-black"}`}>
                        {selectedArt.category}
                      </span>
                      <h2 className={`text-xl sm:text-2xl md:text-3xl mb-2 sm:mb-3 tracking-tight ${isDark ? "text-white" : "text-neutral-900"}`} style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
                        {selectedArt.title}
                      </h2>
                      <p className={`text-[13px] sm:text-[14px] leading-relaxed mb-5 md:mb-6 ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                        {selectedArt.description}
                      </p>
                    </div>

                    <div className="space-y-3 mb-8">
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg ${isDark ? "bg-white/5 text-neutral-400" : "bg-neutral-100 text-neutral-500"}`}>
                          <User size={16} />
                        </div>
                        <div>
                          <p className={`text-[9px] uppercase tracking-wider font-bold ${isDark ? "text-neutral-600" : "text-neutral-400"}`}>Artist</p>
                          <p className={`text-xs font-medium ${isDark ? "text-neutral-300" : "text-neutral-800"}`}>{selectedArt.artist}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg ${isDark ? "bg-white/5 text-neutral-400" : "bg-neutral-100 text-neutral-500"}`}>
                          <Tag size={16} />
                        </div>
                        <div>
                          <p className={`text-[9px] uppercase tracking-wider font-bold ${isDark ? "text-neutral-600" : "text-neutral-400"}`}>Category</p>
                          <p className={`text-xs font-medium ${isDark ? "text-neutral-300" : "text-neutral-800"}`}>{selectedArt.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg ${isDark ? "bg-white/5 text-neutral-400" : "bg-neutral-100 text-neutral-500"}`}>
                          <Calendar size={16} />
                        </div>
                        <div>
                          <p className={`text-[9px] uppercase tracking-wider font-bold ${isDark ? "text-neutral-600" : "text-neutral-400"}`}>Date Created</p>
                          <p className={`text-xs font-medium ${isDark ? "text-neutral-300" : "text-neutral-800"}`}>{selectedArt.date}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto flex flex-col gap-2">
                      <Link to="/order" className="w-full" onClick={() => setSelectedArt(null)}>
                        <button className={`w-full py-3 sm:py-2.5 rounded-lg text-[14px] sm:text-[13px] font-medium transition-all transform active:scale-[0.98] ${isDark ? "bg-white text-black hover:bg-neutral-200 shadow-lg shadow-white/5" : "bg-black text-white hover:bg-neutral-900 shadow-lg shadow-black/20"
                          }`}>
                          Order Similar Sketch
                        </button>
                      </Link>

                      {selectedArt.instagramUrl && (
                        <a href={selectedArt.instagramUrl} target="_blank" rel="noopener noreferrer" className="w-full">
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

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-20 text-center"
        >
          <p className={`text-sm italic ${isDark ? "text-neutral-600" : "text-neutral-400"}`}>
            Curating the finest moments through the lens of artistry.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
