import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, ChevronLeft, ChevronRight, Instagram, X, Heart, MessageCircle, Send, Bookmark } from "lucide-react";

const carouselPosts = [
  {
    id: 1,
    images: ["/carousel/process1.webp"]
  },
  {
    id: 2,
    images: ["/carousel/process2.webp"]
  },
  {
    id: 3,
    images: ["/carousel/process3.webp"]
  },
  {
    id: 4,
    images: ["/carousel/process4.webp"]
  },
  {
    id: 5,
    images: ["/carousel/process5.webp"]
  },
  {
    id: 6,
    images: ["/carousel/process6.webp"]
  },
  {
    id: 7,
    images: ["/carousel/process7.webp"]
  },
  {
    id: 8,
    images: ["/carousel/process8.webp"]
  },
  {
    id: 9,
    images: ["/carousel/process9.webp"]
  },
  {
    id: 10,
    images: ["/carousel/process10.webp"]
  }
];

export default function CarouselPostsSection({ isDark }) {
  const [selectedPost, setSelectedPost] = useState(null);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [expandedId, setExpandedId] = useState(null);

  const openPostModal = (e, post) => {
    e.preventDefault();
    setSelectedPost(post);
    setCurrentImgIndex(0);
  };

  const handleColumnClick = (id) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  const nextImg = (e) => {
    e.stopPropagation();
    if (selectedPost) {
      setCurrentImgIndex((prev) => (prev + 1) % selectedPost.images.length);
    }
  };

  const prevImg = (e) => {
    e.stopPropagation();
    if (selectedPost) {
      setCurrentImgIndex((prev) => (prev - 1 + selectedPost.images.length) % selectedPost.images.length);
    }
  };

  return (
    <div className="py-10" >
      <div className="mb-6 sm:mb-10 text-center">
        <h2 className={`text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-2 sm:mb-4 ${isDark ? "text-white" : "text-neutral-900"}`} style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
          Interactive <span className="text-neutral-500 ">Carousel Gallery</span>
        </h2>
        <p className={`text-[13px] sm:text-[14px] leading-relaxed max-w-xl mx-auto px-2 ${isDark ? "text-neutral-400" : "text-neutral-500"}`}>
          Hover to expand and explore the different stages of the masterpiece in full detail.
        </p>
      </div>

      {/* Expanding Flex Gallery */}
      <div className="w-full max-w-full mx-auto px-2 box-border">
        <div className={`flex flex-col md:flex-row gap-2 sm:gap-3 h-auto md:h-[350px] overflow-hidden group/wrapper ${expandedId ? 'has-expanded' : ''}`}>
          {carouselPosts.map((post) => {
            const isExpanded = expandedId === post.id;
            return (
              <div
                key={post.id}
                onClick={(e) => {
                  if (expandedId === post.id || window.innerWidth >= 768) {
                    openPostModal(e, post);
                  } else {
                    handleColumnClick(post.id);
                  }
                }}
                className={`relative flex-1 md:h-full h-[60px] sm:h-[80px] rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group/column
                  ${isExpanded ? 'md:flex-[3] flex-none h-[250px] sm:h-[300px]' : ''}
                  md:hover:flex-[3] 
                  md:group-hover/wrapper:not(:hover):not(.md\\:flex-\\[3\\]) ${!isExpanded && expandedId ? 'md:flex-[0.5] h-[40px] sm:h-[50px] opacity-70' : ''}
                `}
                style={
                  !isExpanded && expandedId ? { flex: "0.5" } : {}
                }
              >
                <div className="block w-full h-full relative overflow-hidden">
                  <img
                    src={post.images[0]}
                    alt={`Process step ${post.id}`}
                    className={`w-full h-full object-cover object-center block rounded-3xl transition-transform duration-700 ease-in-out group-hover/column:scale-110 ${isDark ? "opacity-90 hover:opacity-100" : ""}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    {/* Instagram Style Carousel Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8 backdrop-blur-2xl bg-black/90"
            onClick={() => setSelectedPost(null)}
          >
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 sm:top-6 right-4 sm:right-6 z-[120] text-white hover:scale-110 transition-transform"
            >
              <X size={24} className="sm:w-8 sm:h-8" />
            </button>

            <div 
              className={`relative w-full max-w-5xl aspect-[4/5] sm:aspect-square md:aspect-video rounded-2xl overflow-hidden flex flex-col md:flex-row ${
                isDark ? "bg-black" : "bg-white"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image Side */}
              <div className="relative flex-1 bg-neutral-950 flex items-center justify-center group/modal">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImgIndex}
                    src={selectedPost.images[currentImgIndex]}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="max-w-full max-h-full object-contain"
                  />
                </AnimatePresence>

                {/* Nav Arrows */}
                <button 
                  onClick={prevImg}
                  className="absolute left-2 sm:left-4 p-1.5 sm:p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-all z-10"
                >
                  <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
                </button>
                <button 
                  onClick={nextImg}
                  className="absolute right-2 sm:right-4 p-1.5 sm:p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-all z-10"
                >
                  <ChevronRight size={20} className="sm:w-6 sm:h-6" />
                </button>

                {/* Image Dots */}
                <div className="absolute bottom-4 sm:bottom-6 flex gap-1.5 z-10">
                  {selectedPost.images.map((_, idx) => (
                    <div 
                      key={idx}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        idx === currentImgIndex ? "bg-blue-500 scale-125" : "bg-white/40"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Sidebar Side (Desktop) */}
              <div className={`hidden md:flex flex-col w-80 border-l ${isDark ? "border-white/10" : "border-black/10"}`}>
                <div className="p-4 border-b flex items-center justify-between border-neutral-800">
                   <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-[10px] font-bold text-white">A</div>
                    <p className={`text-[12px] font-bold ${isDark ? "text-white" : "text-black"}`}>{selectedPost.user}</p>
                   </div>
                   <Instagram size={18} className="text-pink-500" />
                </div>
                
                <div className="flex-1 p-4 overflow-y-auto">
                   <p className={`text-[13px] leading-relaxed ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
                     <span className={`font-bold mr-2 ${isDark ? "text-white" : "text-black"}`}>{selectedPost.user}</span>
                     {selectedPost.caption}
                   </p>
                </div>

                <div className="p-4 border-t border-neutral-800">
                   <div className={`flex items-center justify-between mb-2 ${isDark ? "text-white" : "text-black"}`}>
                      <div className="flex gap-4">
                        <Heart size={22} />
                        <MessageCircle size={22} />
                        <Send size={22} />
                      </div>
                      <Bookmark size={22} />
                   </div>
                   <p className={`text-[13px] font-bold ${isDark ? "text-white" : "text-black"}`}>{selectedPost.likes} likes</p>
                   <p className="text-[10px] text-neutral-500 uppercase mt-1">2 DAYS AGO</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
