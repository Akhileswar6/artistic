import { useState } from "react";
import { Heart, X, Download, Share2 } from "lucide-react";



const artworks = [
  {
    id: 1,
    title: "Charcoal Face",
    category: "Charcoal",
    image: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=600&q=80",
    description: "A detailed charcoal portrait capturing calm emotion and soft expressions.",
    medium: "Charcoal on Paper",
    size: "A3",
    time: "6 days",
  },
  {
    id: 2,
    title: "Pencil Portrait",
    category: "Pencil",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    description: "Fine pencil portrait focusing on facial realism and depth.",
    medium: "Graphite Pencil",
    size: "A4",
    time: "4 days",
  },
  {
    id: 3,
    title: "Color Portrait",
    category: "Color",
    image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=600&q=80",
    description: "Hand colored portrait with vibrant tones and realistic shading.",
    medium: "Color Pencil",
    size: "A3",
    time: "7 days",
  },
  {
    id: 4,
    title: "Expressive Caricature",
    category: "Caricature",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
    description: "A fun, exaggerated caricature bringing out the subject's unique features.",
    medium: "Digital & Ink",
    size: "A4",
    time: "2 days",
  },
  {
    id: 5,
    title: "Vintage Charcoal",
    category: "Charcoal",
    image: "https://images.unsplash.com/photo-1616874535244-73aea5daadb4?auto=format&fit=crop&w=600&q=80",
    description: "Classic vintage style charcoal sketch with heavy contrast.",
    medium: "Charcoal on Canvas",
    size: "A2",
    time: "8 days",
  },
  {
    id: 6,
    title: "Vibrant Color Spread",
    category: "Color",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    description: "A vivid splash of colored pencils blending realism and abstract.",
    medium: "Color Pencil",
    size: "A3",
    time: "5 days",
  },
  {
    id: 7,
    title: "Monochrome Pencil",
    category: "Pencil",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
    description: "Subtle grading and soft blending on this graphite masterpiece.",
    medium: "Graphite Pencil",
    size: "A5",
    time: "3 days",
  },
  {
    id: 8,
    title: "Playful Caricature",
    title: "Old Man Winter",
    category: "Charcoal",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
    description: "Deep shadows on an expressive face.",
    medium: "Charcoal",
    size: "A3",
    time: "8 days",
    aspect: "aspect-[3/4]",
  },
  {
    id: 9,
    title: "Sunset Boulevard",
    category: "Color",
    image: "https://images.unsplash.com/photo-1502224562085-6dfe2fdeadad",
    description: "Vibrant color palette displaying urban sunset.",
    medium: "Color Pencil",
    size: "A3",
    time: "5 days",
    aspect: "aspect-square",
  },
  {
    id: 10,
    title: "Gentle Smile",
    category: "Pencil",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
    description: "Soft focus portrait sketch.",
    medium: "Graphite Pencil",
    size: "A4",
    time: "3 days",
    aspect: "aspect-[4/5]",
  }
];

export default function Gallery({ isDark }) {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("All");
  const [likes, setLikes] = useState({});

  const toggleLike = (e, id) => {
    e.stopPropagation();
    setLikes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const categories = ["All", "Pencil", "Charcoal", "Color", "Caricature"];

  const filtered =
    filter === "All"
      ? artworks
      : artworks.filter((art) => art.category === filter);



  const handleDownload = (e, imageUrl, title) => {
    e.stopPropagation();
    // Simulate Download
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `${title.replace(/\s+/g, "_")}_Artistic.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: "Artistic Gallery",
        text: "Check out this amazing artwork!",
        url: window.location.href,
      }).catch((err) => console.log("Error sharing:", err));
    }
  };

  return (
    <section
      className={`py-20 px-6 sm:px-10 min-h-screen transition duration-500 ${isDark ? "bg-[#0a0a0a] text-white" : "bg-[#f9f8f6] text-black"
        }`}
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Title Section */}
      <div className="text-center mb-14 flex flex-col items-center gap-4">
        <span
          className={`text-xs px-4 py-1.5 font-medium tracking-wide rounded-full border ${isDark ? "border-neutral-700 text-neutral-300 bg-neutral-800/50" : "border-neutral-300 text-neutral-600 bg-white"
            }`}
        >
          Curated Collection
        </span>

        <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight" style={{ fontFamily: "Playfair Display, serif" }}>
          Artist Gallery
        </h1>

        <p className={`max-w-xl mx-auto text-[16px] ${isDark ? "text-neutral-400" : "text-neutral-500"}`}>
          Discover our rich collection of hand-drawn artworks. Each piece is crafted with distinct styles, ensuring every detail is perfectly captured.
        </p>
      </div>

      {/* Modern Filter Pills */}
      <div className="flex flex-wrap gap-3 justify-center mb-14">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-5 py-2.5 rounded-full border transition-all duration-300 text-sm font-medium cursor-pointer shadow-sm ${filter === cat
                ? (isDark ? "bg-white text-black border-white" : "bg-black text-white border-black")
                : (isDark ? "border-neutral-700 text-neutral-300 hover:bg-neutral-800" : "border-neutral-300 text-neutral-600 hover:bg-neutral-100")
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Pinterest-Style Masonry Layout */}
      <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4 max-w-[1400px] mx-auto">
        {filtered.map((art) => (
          <div
            key={art.id}
            onClick={() => setSelected(art)}
            className={`relative break-inside-avoid cursor-pointer group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 w-full ${art.aspect} ${isDark ? "bg-neutral-900" : "bg-neutral-200"}`}
          >
            {/* Image */}
            <img
              src={art.image}
              alt={art.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Immersive Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">

              {/* Top Bar Actions */}
              <div className="flex justify-between items-start">
                <button
                  onClick={handleShare}
                  className="bg-white/20 backdrop-blur-md hover:bg-white/40 text-white p-2 rounded-full transition-colors"
                  title="Share"
                >
                  <Share2 size={16} />
                </button>
                <button
                  onClick={(e) => toggleLike(e, art.id)}
                  className="bg-white/20 backdrop-blur-md rounded-full p-2 hover:bg-white/40 transition-colors group/like"
                  title="Like"
                >
                  <Heart size={18} className={`transition-all duration-300 transform ${likes[art.id] ? "fill-red-500 text-red-500 scale-110" : "fill-transparent text-white group-hover/like:scale-110"}`} />
                </button>
              </div>

              {/* Bottom Content (Title & Download) */}
              <div className="flex justify-between items-end transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <div>
                  <p className="text-white font-bold text-lg drop-shadow-md leading-tight">{art.title}</p>
                  <p className="text-white/80 text-xs font-medium tracking-wide mt-1 uppercase">{art.category}</p>
                </div>

                <button
                  onClick={(e) => handleDownload(e, art.image, art.title)}
                  className="bg-white/90 hover:bg-white text-black p-2.5 rounded-full transition shadow-lg hover:scale-105"
                  title="Download Image"
                >
                  <Download size={18} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* End of Gallery Section */}

      {/* Premium Detailed Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 opacity-100 animate-in fade-in duration-300">
          <div
            className={`rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto flex flex-col md:flex-row shadow-2xl relative
            ${isDark ? "bg-[#0d0d0d] text-white" : "bg-white text-black"}`}
          >
            {/* Close Button Mobile/Global */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 z-10 bg-black/20 backdrop-blur-md hover:bg-black/40 text-white p-2 rounded-full transition"
            >
              <X size={20} />
            </button>

            {/* Artwork Image View */}
            <div className="md:w-3/5 bg-neutral-900 relative min-h-[40vh] md:min-h-[70vh] flex items-center justify-center">
              <img
                src={selected.image}
                className="max-w-full max-h-[90vh] object-contain"
                alt={selected.title}
              />
            </div>

            {/* Details Panel */}
            <div className="md:w-2/5 p-8 sm:p-10 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ fontFamily: "Playfair Display, serif" }}>
                    {selected.title}
                  </h2>
                </div>

                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-6 ${isDark ? "bg-neutral-800 text-neutral-300" : "bg-neutral-100 text-neutral-600"}`}>
                  {selected.category} Artwork
                </span>

                <p className={`text-lg leading-relaxed mb-8 ${isDark ? "text-neutral-300" : "text-neutral-600"}`}>
                  {selected.description}
                </p>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-10">
                  <div>
                    <p className={`text-xs uppercase tracking-wider font-semibold mb-1 ${isDark ? "text-neutral-500" : "text-neutral-400"}`}>Medium</p>
                    <p className="font-medium">{selected.medium}</p>
                  </div>
                  <div>
                    <p className={`text-xs uppercase tracking-wider font-semibold mb-1 ${isDark ? "text-neutral-500" : "text-neutral-400"}`}>Size</p>
                    <p className="font-medium">{selected.size}</p>
                  </div>
                  <div>
                    <p className={`text-xs uppercase tracking-wider font-semibold mb-1 ${isDark ? "text-neutral-500" : "text-neutral-400"}`}>Time Crafted</p>
                    <p className="font-medium">{selected.time}</p>
                  </div>
                  <div>
                    <p className={`text-xs uppercase tracking-wider font-semibold mb-1 ${isDark ? "text-neutral-500" : "text-neutral-400"}`}>Artist</p>
                    <p className="font-medium">Akhileswar Kamale</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button
                  className={`flex-1 py-4 px-6 rounded-xl font-semibold transition text-center shadow-sm
                  ${isDark ? "bg-white text-black hover:bg-neutral-200" : "bg-black text-white hover:bg-neutral-800"}`}
                >
                  Order Similar Artwork
                </button>

                <button
                  onClick={(e) => handleDownload(e, selected.image, selected.title)}
                  className={`flex justify-center items-center py-4 px-6 rounded-xl font-semibold transition border
                  ${isDark ? "border-neutral-700 hover:bg-neutral-800" : "border-neutral-300 hover:bg-neutral-100"}`}
                  title="Download Image"
                >
                  <Download size={20} />
                </button>
              </div>

              <a
                href="https://instagram.com/linesbyakhileswar"
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-4 text-center text-sm font-medium hover:underline transition ${isDark ? "text-neutral-400 hover:text-white" : "text-neutral-500 hover:text-black"}`}
              >
                View more on Instagram →
              </a>

            </div>
          </div>
        </div>
      )}
    </section>
  );
}