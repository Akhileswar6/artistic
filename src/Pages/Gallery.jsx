import { useState, useEffect } from "react";
import { Heart, X, Download, Share2, User, Tag, Calendar, Instagram, ExternalLink, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const artworks = [
  // ... (keep the artworks array as is, but ensure IDs and paths are correct)
  {
    id: 1,
    title: "Chatrapati Shivaji Maharaj",
    category: "Realistic",
    image: "/ArtistArtWorks/Chatrapathi%20shivaji%20maharaj.webp",
    description: "A powerful realistic portrait of the legendary Maratha warrior king, capturing his visionary leadership and warrior spirit.",
    medium: "Pencil Sketch",
    size: "A3",
    date: "March 2024",
  },
  {
    id: 2,
    title: "Lord Shiva",
    category: "Divine",
    image: "/ArtistArtWorks/Lord%20Shiva.webp",
    description: "Meditative study of Mahadev, focusing on the divine serenity and cosmic power of the Adiyogi.",
    medium: "Charcoal",
    size: "A3",
    date: "April 2024",
  },
  {
    id: 3,
    title: "Lord Ganesha",
    category: "Divine",
    image: "/ArtistArtWorks/Lord%20ganesha.webp",
    description: "Vibrant depiction of the remover of obstacles, showcasing intricate details and traditional symbolism.",
    medium: "Color Pencil",
    size: "A4",
    date: "January 2024",
  },
  {
    id: 5,
    title: "Hanuman Movie Art",
    category: "Realistic",
    image: "/ArtistArtWorks/hanuman%20movie.webp",
    description: "Cinematic sketch inspired by the epic film, capturing the grand scale and mystical energy of the character.",
    medium: "Digital & Pencil",
    size: "Digital",
    date: "February 2024",
  },
  {
    id: 6,
    title: "Ram Charan",
    category: "Realistic",
    image: "/ArtistArtWorks/ramcharan.jpg",
    description: "Hyper-realistic portrait of Mega Power Star Ram Charan, focusing on expressive eyes and lighting.",
    medium: "Pencil Portrait",
    size: "A4",
    date: "December 2023",
  },
  {
    id: 7,
    title: "Realistic Girl Portrait",
    category: "Realistic",
    image: "/ArtistArtWorks/girl.webp",
    description: "Soft pencil study of human emotion, capturing the subtle nuances of grace and contemplation.",
    medium: "Pencil Sketch",
    size: "A4",
    date: "March 2024",
  },
  {
    id: 8,
    title: "Art vs Artist",
    category: "Series",
    image: "/ArtistArtWorks/artvsartist.webp",
    description: "A creative compilation showcasing the artist alongside their favorite creations from the past year.",
    medium: "Compilation",
    size: "Multiple",
    date: "Annual 2024",
  },
  {
    id: 14,
    title: "Childhood",
    category: "Realistic",
    image: "/ArtistArtWorks/Child%20Akhil.webp",
    description: "A soulful study of childhood, capturing the pure and innocent expression of a young boy.",
    medium: "Pencil Portrait",
    size: "A4",
    date: "January 2024",
  },
  {
    id: 15,
    title: "Mom Love",
    category: "Realistic",
    image: "/ArtistArtWorks/Child%20Akhil1.webp",
    description: "Detailed facial study focusing on the soft features and curiosity of youth.",
    medium: "Graphite Pencil",
    size: "A4",
    date: "January 2024",
  },
  {
    id: 16,
    title: "Realistic Boy Portrait",
    category: "Realistic",
    image: "/ArtistArtWorks/baby.jpg",
    description: "Intricate pencil study of a baby, focusing on soft skin textures and delicate features.",
    medium: "Pencil Sketch",
    size: "A5",
    date: "January 2024",
  },
  {
    id: 17,
    title: "Baby Portrait",
    category: "Realistic",
    image: "/ArtistArtWorks/babyakhil.webp",
    description: "Soulful realistic portrait capturing the pure innocence of childhood.",
    medium: "Pencil Portrait",
    size: "A4",
    date: "January 2024",
  },
  {
    id: 18,
    title: "Lord Hanuman - Divine Grace",
    category: "Divine",
    image: "/ArtistArtWorks/lord%20hanuman1.webp",
    description: "Majestic depiction of Lord Hanuman, focusing on divine strength and unwavering devotion.",
    medium: "Charcoal & Pencil",
    size: "A3",
    date: "April 2024",
  },
  {
    id: 19,
    title: "Nature",
    category: "Nature",
    image: "/ArtistArtWorks/nature.jpg",
    description: "Detailed landscape and flora study, exploring the intricate patterns of the natural world.",
    medium: "Pencil Sketch",
    size: "A4",
    date: "April 2024",
  },
  {
    id: 20,
    title: "Realistic Portrait",
    category: "Realistic",
    image: "/ArtistArtWorks/harsha.jpg",
    description: "Soulful realistic portrait capturing deep emotion and precision through pencil work.",
    medium: "Pencil Sketch",
    size: "A4",
    date: "April 2024",
  },
  // Recent Sketches
  {
    id: 9,
    title: "Divine Hanuman",
    category: "Divine",
    image: "/RecentArtworks/Lord%20hanuman.webp",
    description: "A detailed divine portrait capturing the powerful yet serene essence of Lord Hanuman. \u091c\u092f \u0936\u094d\u0930\u0940 \u0930\u093e\u092e",
    medium: "Pencil Sketch",
    size: "A3",
    date: "April 2024",
  },
  {
    id: 10,
    title: "Goddess Durga",
    category: "Divine",
    image: "/RecentArtworks/Durga.webp",
    description: "Intricate charcoal study focusing on the fierce and protective nature of Goddess Durga.",
    medium: "Realistic Charcoal",
    size: "A3",
    date: "April 2024",
  },
  {
    id: 11,
    title: "Lord Hanuman",
    category: "Divine",
    image: "/RecentArtworks/Hanuman.webp",
    description: "Vibrant color study showcasing divine strength and spiritual devotion.",
    medium: "Color Pencil",
    size: "A4",
    date: "March 2024",
  },
  {
    id: 12,
    title: "Realistic Portrait",
    category: "Realistic",
    image: "/RecentArtworks/Akhil.webp",
    description: "High-fidelity pencil portrait focusing on realistic skin textures and lighting.",
    medium: "Pencil Sketch",
    size: "A4",
    date: "April 2024",
  },
  {
    id: 13,
    title: "Pawan Kalyan Sketch",
    category: "Realistic",
    image: "/RecentArtworks/Pawan%20Kalyan.webp",
    description: "Character study sketch capturing the iconic persona through detailed pencil work.",
    medium: "Pencil Portrait",
    size: "A4",
    date: "February 2024",
  }
];

import CarouselPostsSection from "../Components/CarouselPostsSection";

export default function Gallery({ isDark }) {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("All");
  const [likes, setLikes] = useState({});

  useEffect(() => {
    if (selected) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [selected]);

  const toggleLike = (e, id) => {
    e.stopPropagation();
    setLikes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const categories = ["All", "Realistic", "Divine", "Nature", "Series"];

  const filtered =
    filter === "All"
      ? artworks
      : artworks.filter((art) => art.category === filter);

  const handleDownload = (e, imageUrl, title) => {
    e.stopPropagation();
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `${title.replace(/\s+/g, "_")}_Artistic.jpg`;
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? "bg-[#0a0a0b]" : "bg-[#fcfcfc]"}`} style={{ fontFamily: "Inter, sans-serif" }}>
      <section className="pt-16 md:pt-24 pb-12 md:pb-20 px-4 md:px-8 max-w-[1400px] mx-auto">

        {/* Centered Editorial Header */}
        <div className="text-center mb-10 sm:mb-16 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-2 sm:mb-4 ${isDark ? "text-white" : "text-neutral-900"}`} style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
              The <span className="text-neutral-500 ">Gallery</span>
            </h1>
            <p className={`text-[13px] sm:text-[14px] md:text-[15px] leading-relaxed mb-6 sm:mb-8 ${isDark ? "text-neutral-400" : "text-neutral-500"}`}>
              Explore our complete collection of hand-drawn masterpieces. Each piece tells a story of precision, emotion, and the timeless art of sketching.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-lg mx-auto mb-8 sm:mb-12">
              {/* Active Gallery Card */}
              <div className={`flex-1 flex flex-col items-center justify-center w-full p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all cursor-default ${
                isDark ? "bg-white/5 border-white text-white" : "bg-black/5 border-black text-black"
              }`}>
                <h3 className="text-base sm:text-lg font-bold mb-1" style={{fontFamily:"Bricolage Grotesque, sans-serif"}}>All Artworks</h3>
                <p className={`text-[11px] sm:text-xs ${isDark ? "text-neutral-400" : "text-neutral-500"}`}>Main Collection</p>
              </div>

              {/* Inactive Carousel Card */}
              <Link to="/process" className="flex-1 w-full">
                <div className={`flex flex-col items-center justify-center w-full p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all hover:-translate-y-1 hover:shadow-lg ${
                  isDark ? "bg-transparent border-white/20 text-neutral-400 hover:border-white hover:text-white" : "bg-transparent border-black/20 text-neutral-500 hover:border-black hover:text-black"
                }`}>
                  <h3 className="text-base sm:text-lg font-bold mb-1" style={{fontFamily:"Bricolage Grotesque, sans-serif"}}>
                    Process Carousel
                  </h3>
                    <p className="text-[11px] sm:text-xs opacity-70">Swipeable Stories</p>
                </div>
              </Link>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col items-center gap-4 w-full"
            >
              <div className="flex items-center gap-2 text-[12px] text-neutral-500">
                <Filter size={12} />
                Filter by Style
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-4 py-1.5 rounded-lg text-[12px] transition-all duration-300 border ${filter === cat
                        ? (isDark ? "bg-white text-black border-white" : "bg-black text-white border-black")
                        : (isDark ? "border-white/10 text-neutral-500 hover:border-white/30" : "border-black/10 text-neutral-400 hover:border-black/30")
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Masonry Grid */}
        <div className="columns-2 md:columns-3 xl:columns-4 gap-3 sm:gap-6 space-y-3 sm:space-y-6 mb-16 md:mb-24">
          <AnimatePresence mode="popLayout">
            {filtered.map((art, index) => (
              <motion.div
                layout
                key={art.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                onClick={() => setSelected(art)}
                className="break-inside-avoid relative group cursor-pointer"
              >
                <div className={`relative overflow-hidden rounded-2xl transition-all duration-500 ${isDark ? "bg-neutral-900 border border-white/5 shadow-2xl" : "bg-neutral-100 border border-black/5 shadow-lg"
                  }`}>
                  <img
                    src={art.image}
                    alt={art.title}
                    className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Immersive Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 p-6 flex flex-col justify-end">
                    <div className="flex justify-between items-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <div>
                        <span className="text-[10px] text-yellow-300 uppercase tracking-widest mb-1 block">
                          {art.category}
                        </span>
                        <h4 className="text-white text-md leading-tight">
                          {art.title}
                        </h4>
                      </div>
                      <div className="bg-white/20 backdrop-blur-md p-2 rounded-full border border-white/30 text-white">
                        <ExternalLink size={14} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 px-1 flex justify-between items-start">
                  <div>
                    <h5 className={`text-[13px] ${isDark ? "text-white" : "text-neutral-900"}`}>
                      {art.title}
                    </h5>
                    
                  </div>
                  <button
                    onClick={(e) => toggleLike(e, art.id)}
                    className={`transition-colors mt-0.5 ${likes[art.id] ? "text-red-500" : (isDark ? "text-neutral-700" : "text-neutral-300 hover:text-neutral-400")}`}
                  >
                    <Heart size={22} fill={likes[art.id] ? "currentColor" : "none"} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Synchronized Professional Modal */}


      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}

            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 backdrop-blur-xl bg-black/80"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`relative w-full max-w-5xl max-h-[85vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col md:flex-row ${isDark ? "bg-[#111] border border-white/10 text-white" : "bg-white text-black"
                }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelected(null)}
                className={`absolute top-4 right-4 z-50 p-2 rounded-full transition-colors ${isDark ? "bg-white/10 text-white hover:bg-white/20" : "bg-black/5 text-black hover:bg-black/10"
                  }`}
              >
                <X size={16} />
              </button>

              {/* Image Side */}
              <div className="w-full md:w-3/5 bg-black/5 flex items-center justify-center p-4">
                <img
                  src={selected.image}
                  alt={selected.title}
                  className="max-w-full max-h-[40vh] md:max-h-[80vh] object-contain rounded-lg shadow-2xl"
                />
              </div>

              {/* Content Side */}
              <div className="w-full md:w-2/5 p-5 sm:p-6 md:p-10 overflow-y-auto">
                <div className="flex flex-col h-full">
                  <div className="mb-6 sm:mb-8">
                    <span className="inline-block px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-500 text-[11px] sm:text-[12px] mb-2 sm:mb-3 font-medium">
                      {selected.category}
                    </span>
                    <h2 className="text-xl sm:text-2xl mb-2 tracking-tight" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
                      {selected.title}
                    </h2>
                    <p className={`text-[13px] sm:text-[14px] leading-relaxed  ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                      {selected.description}
                    </p>
                  </div>

                  <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-10">
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 sm:p-2 rounded-lg ${isDark ? "bg-white/5 text-neutral-400" : "bg-neutral-100 text-neutral-500"}`}>
                        <User size={16} className="sm:w-[18px] sm:h-[18px]" />
                      </div>
                      <div>
                        <p className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold opacity-50">Artist</p>
                        <p className="text-[12px] sm:text-[13px] font-medium">Akhileswar Kamale</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 sm:p-2 rounded-lg ${isDark ? "bg-white/5 text-neutral-400" : "bg-neutral-100 text-neutral-500"}`}>
                        <Tag size={16} className="sm:w-[18px] sm:h-[18px]" />
                      </div>
                      <div>
                        <p className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold opacity-50">Medium</p>
                        <p className="text-[12px] sm:text-[13px] font-medium">{selected.medium} ({selected.size})</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 sm:p-2 rounded-lg ${isDark ? "bg-white/5 text-neutral-400" : "bg-neutral-100 text-neutral-500"}`}>
                        <Calendar size={16} className="sm:w-[18px] sm:h-[18px]" />
                      </div>
                      <div>
                        <p className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold opacity-50">Date Crafted</p>
                        <p className="text-[12px] sm:text-[13px] font-medium">{selected.date}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto flex flex-col gap-2 sm:gap-3">
                    <Link to="/order" className="w-full" onClick={() => setSelected(null)}>
                      <button className={`w-full py-3 sm:py-2.5 rounded-lg text-[14px] sm:text-sm font-medium transition-all transform active:scale-[0.98] ${isDark ? "bg-white text-black hover:bg-neutral-200" : "bg-black text-white hover:bg-neutral-900"
                        }`}>
                        Order Artwork
                      </button>
                    </Link>
                    <a
                      href="https://www.instagram.com/linesbyakhileswar"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <button className={`w-full py-3 sm:py-2.5 rounded-lg text-[14px] sm:text-sm font-medium border flex items-center justify-center gap-2 transition-all hover:bg-neutral-500/10 ${isDark ? "border-white/10" : "border-black/10"}`}>
                        <Instagram size={16} className="text-pink-500" />
                        Follow on Instagram
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
