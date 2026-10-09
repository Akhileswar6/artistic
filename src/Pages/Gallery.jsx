import { useState, useEffect } from "react";
import { 
  X, User, Tag, Calendar, Instagram, 
  ExternalLink, Filter, ChevronLeft, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config";
import { GallerySkeleton } from "../Components/Skeleton";

const defaultArtworks = [
  // 1. Recent Sketches from Main Page
  {
    id: "rs-1",
    title: "Divine Hanuman",
    category: "Divine",
    image: "/RecentArtworks/Lord%20hanuman.webp",
    description: "A detailed divine portrait capturing the powerful yet serene essence of Lord Hanuman. जय श्री राम",
    medium: "Pencil Sketch",
    size: "A3",
    date: "February 2026",
    artist: "Akhileswar Kamale",
    instagramUrl: "https://www.instagram.com/p/DVk8LsUkd8p/",
  },
  {
    id: "rs-2",
    title: "Goddess Durga",
    category: "Realistic",
    image: "/RecentArtworks/Durga.webp",
    description: "Intricate charcoal study focusing on the fierce and protective nature of Goddess Durga.",
    medium: "Realistic Charcoal",
    size: "A3",
    date: "October 2025",
    artist: "Akhileswar Kamale",
    instagramUrl: "https://www.instagram.com/p/DPTl3WfEbtJ/",
  },
  {
    id: "rs-3",
    title: "Lord Hanuman",
    category: "Realistic",
    image: "/RecentArtworks/Hanuman.webp",
    description: "Vibrant color study showcasing divine strength and spiritual devotion.",
    medium: "Color Pencil",
    size: "A4",
    date: "January 2026",
    artist: "Akhileswar Kamale",
    instagramUrl: "https://www.instagram.com/p/DTCofNoEaYq/",
  },
  {
    id: "rs-4",
    title: "Realistic Portrait",
    category: "Realistic",
    image: "/RecentArtworks/Akhil.webp",
    description: "High-fidelity pencil portrait focusing on realistic skin textures and lighting.",
    medium: "Pencil Sketch",
    size: "A4",
    date: "January 2025",
    artist: "Akhileswar Kamale",
    instagramUrl: "https://www.instagram.com/p/DE9pYusSont/",
  },
  {
    id: "rs-5",
    title: "Pawan Kalyan Sketch",
    category: "Realistic",
    image: "/RecentArtworks/Pawan%20Kalyan.webp",
    description: "Character study sketch capturing the iconic persona through detailed pencil work.",
    medium: "Pencil Portrait",
    size: "A4",
    date: "September 2023",
    artist: "Akhileswar Kamale",
    instagramUrl: "https://www.instagram.com/p/C7y-VdkyKKr/",
  },

  // 2. Artist's Artworks from Main Page
  {
    id: "aa-1",
    title: "Chatrapati Shivaji Maharaj",
    category: "Realistic",
    image: "/ArtistArtWorks/Chatrapathi%20shivaji%20maharaj.webp",
    description: "A powerful realistic portrait of the legendary Maratha warrior king, capturing his visionary leadership and warrior spirit.",
    medium: "Pencil Sketch",
    size: "A3",
    date: "December 2022",
    artist: "Akhileswar Kamale",
    instagramUrl: "https://www.instagram.com/p/CmQcOgDo7GN/",
  },
  {
    id: "aa-2",
    title: "Lord Ganesha",
    category: "Divine",
    image: "/ArtistArtWorks/Lord%20ganesha.webp",
    description: "Vibrant depiction of the remover of obstacles, showcasing intricate details and traditional symbolism.",
    medium: "Color Pencil",
    size: "A4",
    date: "August 2022",
    artist: "Akhileswar Kamale",
    instagramUrl: "https://www.instagram.com/p/Ch5NPLxvANj/",
  },
  {
    id: "aa-3",
    title: "Art vs Artist",
    category: "Series",
    image: "/ArtistArtWorks/artvsartist.webp",
    description: "A creative compilation showcasing the artist alongside their favorite creations from the past year.",
    medium: "Compilation",
    size: "Multiple",
    date: "June 2023",
    artist: "Akhileswar Kamale",
    instagramUrl: "https://www.instagram.com/p/Cm_-V4JSEWO/",
  },
  {
    id: "aa-4",
    title: "Childhood",
    category: "Realistic",
    image: "/ArtistArtWorks/Child%20Akhil.webp",
    description: "A soulful study of childhood, capturing the pure and innocent expression of a young boy.",
    medium: "Pencil Portrait",
    size: "A4",
    date: "August 2023",
    artist: "Akhileswar Kamale",
    instagramUrl: "https://www.instagram.com/p/Cv-bBZlywP6/",
  },
  {
    id: "aa-5",
    title: "Lord Hanuman - Divine Grace",
    category: "Divine",
    image: "/ArtistArtWorks/lord%20hanuman1.webp",
    description: "Majestic depiction of Lord Hanuman, focusing on divine strength and unwavering devotion.",
    medium: "Charcoal & Pencil",
    size: "A3",
    date: "January 2026",
    artist: "Akhileswar Kamale",
    instagramUrl: "https://www.instagram.com/p/DTI9S5oEwkH/",
  },
  {
    id: "aa-6",
    title: "Nature Study",
    category: "Nature",
    image: "/ArtistArtWorks/nature.jpg",
    description: "Detailed landscape and flora study, exploring the intricate patterns of the natural world.",
    medium: "Pencil Sketch",
    size: "A4",
    date: "October 2021",
    artist: "Akhileswar Kamale",
    instagramUrl: "https://www.instagram.com/p/CVahGNFMJPS/",
  },

  // 3. Customer Showcase from Main Page
  {
    id: "cs-1",
    title: "Realistic Girl Portrait",
    category: "Realistic",
    image: "/ArtistArtWorks/girl.webp",
    description: "Soft pencil study of human emotion, capturing the subtle nuances of grace and contemplation.",
    medium: "Pencil Sketch",
    size: "A4",
    date: "March 2024",
    artist: "Akhileswar Kamale",
    instagramUrl: "https://www.instagram.com/linesbyakhileswar",
  },
  {
    id: "cs-2",
    title: "Realistic Portrait - Sreekanth",
    category: "Realistic",
    image: "/ArtistArtWorks/Sree.jpg",
    description: "Masterful charcoal portrait capturing expressive depth and subtle lifelike shading.",
    medium: "Realistic Sketch",
    size: "A4",
    date: "January 2024",
    artist: "Akhileswar Kamale",
    instagramUrl: "https://www.instagram.com/linesbyakhileswar",
  },
  {
    id: "cs-3",
    title: "Realistic Portrait - Harsha",
    category: "Realistic",
    image: "/ArtistArtWorks/harsha.jpg",
    description: "Soulful realistic portrait capturing deep emotion and precision through pencil work.",
    medium: "Pencil Sketch",
    size: "A4",
    date: "April 2024",
    artist: "Akhileswar Kamale",
    instagramUrl: "https://www.instagram.com/linesbyakhileswar",
  },

  // 4. Other Curated Studio Masterpieces
  {
    id: "gal-2",
    title: "Lord Shiva",
    category: "Divine",
    image: "/ArtistArtWorks/Lord%20Shiva.webp",
    description: "Meditative study of Mahadev, focusing on the divine serenity and cosmic power of the Adiyogi.",
    medium: "Charcoal",
    size: "A3",
    date: "April 2024",
    artist: "Akhileswar Kamale",
    instagramUrl: "https://www.instagram.com/linesbyakhileswar",
  },
  {
    id: "gal-5",
    title: "Hanuman Movie Art",
    category: "Realistic",
    image: "/ArtistArtWorks/hanuman%20movie.webp",
    description: "Cinematic sketch inspired by the epic film, capturing the grand scale and mystical energy of the character.",
    medium: "Digital & Pencil",
    size: "Digital",
    date: "February 2024",
    artist: "Akhileswar Kamale",
    instagramUrl: "https://www.instagram.com/linesbyakhileswar",
  },
  {
    id: "gal-6",
    title: "Ram Charan",
    category: "Realistic",
    image: "/ArtistArtWorks/ramcharan.jpg",
    description: "Hyper-realistic portrait of Mega Power Star Ram Charan, focusing on expressive eyes and lighting.",
    medium: "Pencil Portrait",
    size: "A4",
    date: "December 2023",
    artist: "Akhileswar Kamale",
    instagramUrl: "https://www.instagram.com/linesbyakhileswar",
  },
  {
    id: "gal-15",
    title: "Mom Love",
    category: "Realistic",
    image: "/ArtistArtWorks/Child%20Akhil1.webp",
    description: "Detailed facial study focusing on the soft features and curiosity of youth.",
    medium: "Graphite Pencil",
    size: "A4",
    date: "January 2024",
    artist: "Akhileswar Kamale",
    instagramUrl: "https://www.instagram.com/linesbyakhileswar",
  },
  {
    id: "gal-16",
    title: "Realistic Boy Portrait",
    category: "Realistic",
    image: "/ArtistArtWorks/baby.jpg",
    description: "Intricate pencil study of a baby, focusing on soft skin textures and delicate features.",
    medium: "Pencil Sketch",
    size: "A5",
    date: "January 2024",
    artist: "Akhileswar Kamale",
    instagramUrl: "https://www.instagram.com/linesbyakhileswar",
  },
  {
    id: "gal-17",
    title: "Baby Portrait",
    category: "Realistic",
    image: "/ArtistArtWorks/babyakhil.webp",
    description: "Soulful realistic portrait capturing the pure innocence of childhood.",
    medium: "Pencil Portrait",
    size: "A4",
    date: "January 2024",
    artist: "Akhileswar Kamale",
    instagramUrl: "https://www.instagram.com/linesbyakhileswar",
  },
];

export default function Gallery({ isDark }) {
  const [galleryList, setGalleryList] = useState(defaultArtworks);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  // Fetch dynamic artworks from backend API so all uploaded works appear automatically
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/gallery`);
        if (res.ok) {
          const data = await res.json();
          const apiWorks = data.map((item) => ({
            id: item._id,
            title: item.title,
            category: item.category || "Realistic",
            image: item.imageUrl,
            img: item.imageUrl,
            artist: "Internal Studio",
            date: item.date || "Recent",
            instagramUrl: item.instagramLink || "",
            description: item.description || "",
            medium: item.category === "Sketch" ? "Pencil Sketch" : "Realistic Portrait",
            size: "A3",
          }));

          // Avoid duplicating any defaults if uploaded with same title
          const existingTitles = new Set(apiWorks.map((w) => w.title.toLowerCase().trim()));
          const filteredDefaults = defaultArtworks.filter(
            (d) => !existingTitles.has(d.title.toLowerCase().trim())
          );

          // Uploaded works appear first!
          setGalleryList([...apiWorks, ...filteredDefaults]);
        }
      } catch (err) {
        console.error("Failed to load gallery from API:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (selected) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [selected]);

  const categories = ["All", "Realistic", "Divine", "Sketch", "Nature", "Series"];

  const filtered =
    filter === "All"
      ? galleryList
      : galleryList.filter((art) => {
          const cat = (art.category || "").toLowerCase();
          const selectedCat = filter.toLowerCase();
          if (selectedCat === "series") {
            return cat.includes("series") || cat.includes("collage");
          }
          return cat.includes(selectedCat);
        });

  const currentIndex = selected ? filtered.findIndex((art) => art.id === selected.id) : -1;

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    if (filtered.length <= 1) return;
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : filtered.length - 1;
    setSelected(filtered[prevIndex]);
  };

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    if (filtered.length <= 1) return;
    const nextIndex = currentIndex < filtered.length - 1 ? currentIndex + 1 : 0;
    setSelected(filtered[nextIndex]);
  };

  // Keyboard navigation for modal
  useEffect(() => {
    if (!selected) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setSelected(null);
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selected, currentIndex, filtered]);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? "bg-[#0a0a0b]" : "bg-[#fcfcfc]"}`} style={{ fontFamily: "Inter, sans-serif" }}>
      <section className="pt-28 md:pt-32 pb-12 md:pb-20 px-4 md:px-8 max-w-[1400px] mx-auto">

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

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-md mx-auto mb-8 sm:mb-12">
              {/* Active Gallery Button */}
              <div className={`flex-1 flex items-center justify-center w-full px-2 py-3 text-[15px] font-medium rounded-full transition-all border cursor-default backdrop-blur-md ${isDark
                ? "bg-white/10 text-white border-white/20 shadow-[0_4px_15px_rgba(0,0,0,0.2)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
                : "bg-black/5 text-black border-black/10 shadow-[0_4px_15px_rgba(0,0,0,0.05)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] shadow-md"
                }`}>
                <span>All Artworks</span>
              </div>

              {/* Inactive Carousel Button */}
              <Link to="/process" className="flex-1 w-full">
                <div className={`flex items-center justify-center w-full px-5 py-3 text-[15px] font-medium rounded-full shadow-lg transition-all cursor-pointer border ${isDark
                  ? "bg-white/5 text-neutral-400 border-white/10 hover:border-white/30 hover:text-white"
                  : "bg-white/40 text-neutral-500 border-black/10 hover:border-black/30 hover:text-black shadow-sm"
                  }`}>
                  <span>Process Carousel</span>
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
                    className={`px-4 py-1.5 rounded-full text-[12px] transition-all duration-300 border cursor-pointer ${filter === cat
                      ? (isDark 
                          ? "bg-white/10 text-white border-white/20 backdrop-blur-md shadow-[0_4px_15px_rgba(0,0,0,0.2)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]" 
                          : "bg-black/5 text-black border-black/10 backdrop-blur-md shadow-[0_4px_15px_rgba(0,0,0,0.05)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] shadow-md")
                      : (isDark ? "border-white/10 text-neutral-500 hover:border-white/30 hover:text-white" : "border-black/10 text-neutral-400 hover:border-black/30 hover:text-black ")
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Gallery Grid - Exactly matching Recent Artworks style */}
        <div className="mb-16 md:mb-24">
          {loading ? (
            <GallerySkeleton />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
              {filtered.map((art) => (
                <motion.div
                  key={art.id}
                  whileHover={{ y: -5 }}
                  onClick={() => setSelected(art)}
                  className={`group relative rounded-xl overflow-hidden transition-all duration-500 cursor-pointer ${
                    isDark
                      ? "bg-neutral-900 border border-white/5 hover:border-white/10 shadow-2xl"
                      : "bg-white border border-black/5 shadow-lg hover:shadow-xl"
                  }`}
                >
                  {/* Image Container with 3/4 aspect ratio and shimmer effect */}
                  <div className="relative overflow-hidden aspect-[3/4] bg-neutral-900/50">
                    <motion.img
                      src={art.image || art.img}
                      alt={art.title}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.4 }}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />

                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full pointer-events-none" />
                  </div>

                  {/* Bottom Label exactly like Recent Sketches */}
                  <div className="p-3">
                    <h3
                      className={`text-xs font-medium truncate ${
                        isDark ? "text-neutral-300" : "text-neutral-800"
                      }`}
                    >
                      {art.title}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal Backdrop & Content - Exactly like Recent Artworks Style with Total Uncropped Artwork */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-8 backdrop-blur-xl bg-black/80"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col md:flex-row ${
                isDark ? "bg-[#111] border border-white/10 text-white" : "bg-white text-black"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelected(null)}
                className={`absolute top-3 right-3 z-50 p-1.5 rounded-full transition-colors cursor-pointer ${
                  isDark ? "bg-white/10 text-white hover:bg-white/20" : "bg-black/5 text-black hover:bg-black/10"
                }`}
              >
                <X size={18} />
              </button>

              {/* Image Side - TOTAL ARTWORK GUARANTEED UNCROPPED */}
              <div className="w-full md:w-3/5 bg-black/5 flex items-center justify-center p-4 md:p-6 relative select-none">
                {/* Previous Button */}
                <button
                  type="button"
                  onClick={handlePrev}
                  title="Previous Artwork"
                  className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center backdrop-blur-xl bg-black/40 hover:bg-black/70 border border-white/20 text-white shadow-lg transition-all cursor-pointer"
                >
                  <ChevronLeft size={18} />
                </button>

                <img
                  src={selected.image || selected.img}
                  alt={selected.title}
                  className="max-w-full max-h-[42vh] md:max-h-[80vh] w-auto h-auto object-contain rounded-lg shadow-xl"
                />

                {/* Next Button */}
                <button
                  type="button"
                  onClick={handleNext}
                  title="Next Artwork"
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center backdrop-blur-xl bg-black/40 hover:bg-black/70 border border-white/20 text-white shadow-lg transition-all cursor-pointer"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Content Side */}
              <div className="w-full md:w-2/5 p-5 sm:p-6 md:p-8 overflow-y-auto flex flex-col justify-between">
                <div>
                  <div className="mb-5 md:mb-6">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[11px] sm:text-[12px] mb-3 font-semibold uppercase tracking-wider ${
                        isDark ? "bg-white/10 text-white" : "bg-black/5 text-black"
                      }`}
                    >
                      {selected.category}
                    </span>
                    <h2
                      className={`text-xl sm:text-2xl md:text-3xl mb-2 sm:mb-3 tracking-tight font-bold ${
                        isDark ? "text-white" : "text-neutral-900"
                      }`}
                      style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
                    >
                      {selected.title}
                    </h2>
                    <p
                      className={`text-[13px] sm:text-[14px] leading-relaxed mb-5 md:mb-6 ${
                        isDark ? "text-neutral-400" : "text-neutral-600"
                      }`}
                    >
                      {selected.description}
                    </p>
                  </div>

                  <div className="space-y-3 mb-6 md:mb-8">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-1.5 rounded-lg ${
                          isDark ? "bg-white/5 text-neutral-400" : "bg-neutral-100 text-neutral-500"
                        }`}
                      >
                        <User size={16} />
                      </div>
                      <div>
                        <p
                          className={`text-[9px] uppercase tracking-wider font-bold ${
                            isDark ? "text-neutral-600" : "text-neutral-400"
                          }`}
                        >
                          Artist
                        </p>
                        <p
                          className={`text-xs font-medium ${
                            isDark ? "text-neutral-300" : "text-neutral-800"
                          }`}
                        >
                          {selected.artist || "Akhileswar Kamale"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div
                        className={`p-1.5 rounded-lg ${
                          isDark ? "bg-white/5 text-neutral-400" : "bg-neutral-100 text-neutral-500"
                        }`}
                      >
                        <Tag size={16} />
                      </div>
                      <div>
                        <p
                          className={`text-[9px] uppercase tracking-wider font-bold ${
                            isDark ? "text-neutral-600" : "text-neutral-400"
                          }`}
                        >
                          Medium & Format
                        </p>
                        <p
                          className={`text-xs font-medium ${
                            isDark ? "text-neutral-300" : "text-neutral-800"
                          }`}
                        >
                          {selected.medium || "Pencil Sketch"}{selected.size ? ` (${selected.size})` : ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div
                        className={`p-1.5 rounded-lg ${
                          isDark ? "bg-white/5 text-neutral-400" : "bg-neutral-100 text-neutral-500"
                        }`}
                      >
                        <Calendar size={16} />
                      </div>
                      <div>
                        <p
                          className={`text-[9px] uppercase tracking-wider font-bold ${
                            isDark ? "text-neutral-600" : "text-neutral-400"
                          }`}
                        >
                          Date Created
                        </p>
                        <p
                          className={`text-xs font-medium ${
                            isDark ? "text-neutral-300" : "text-neutral-800"
                          }`}
                        >
                          {selected.date}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-2 flex flex-col gap-2 shrink-0">
                  <Link
                    to="/order"
                    state={{
                      artworkId: selected.id,
                      artStyle:
                        (selected.category || "").toLowerCase().includes("sketch")
                          ? "sketch"
                          : (selected.category || "").toLowerCase().includes("couple")
                          ? "couple"
                          : (selected.category || "").toLowerCase().includes("anime")
                          ? "anime"
                          : "realistic",
                    }}
                    className="w-full"
                    onClick={() => setSelected(null)}
                  >
                    <button
                      type="button"
                      className={`w-full py-3 sm:py-2.5 rounded-lg text-[14px] sm:text-[13px] font-medium transition-all transform active:scale-[0.98] cursor-pointer ${
                        isDark
                          ? "bg-white text-black hover:bg-neutral-200 shadow-lg shadow-white/5"
                          : "bg-black text-white hover:bg-neutral-900 shadow-lg shadow-black/20"
                      }`}
                    >
                      Order Similar Sketch
                    </button>
                  </Link>

                  {selected.instagramUrl ? (
                    <a
                      href={selected.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <button
                        type="button"
                        className={`w-full py-3 sm:py-2.5 rounded-lg text-[14px] sm:text-[13px] font-medium border flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] cursor-pointer ${
                          isDark
                            ? "bg-white/5 text-white border-white/10 hover:bg-white/10"
                            : "bg-black/5 text-black border-black/10 hover:bg-black/10"
                        }`}
                      >
                        <Instagram size={16} className="text-pink-500" />
                        View on Instagram
                        <ExternalLink size={14} className="opacity-50" />
                      </button>
                    </a>
                  ) : (
                    <a
                      href="https://www.instagram.com/linesbyakhileswar"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <button
                        type="button"
                        className={`w-full py-3 sm:py-2.5 rounded-lg text-[14px] sm:text-[13px] font-medium border flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] cursor-pointer ${
                          isDark
                            ? "bg-white/5 text-white border-white/10 hover:bg-white/10"
                            : "bg-black/5 text-black border-black/10 hover:bg-black/10"
                        }`}
                      >
                        <Instagram size={16} className="text-pink-500" />
                        View on Instagram
                        <ExternalLink size={14} className="opacity-50" />
                      </button>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
