import { useState } from "react";
import { Heart, X } from "lucide-react";
import LikeButton from "../Components/LikeButton";

const artworks = [
  {
    id: 1,
    title: "Charcoal Face",
    category: "Charcoal",
    image:
      "https://images.unsplash.com/photo-1549880338-65ddcdfd017b",
    description:
      "A detailed charcoal portrait capturing calm emotion and soft expressions.",
    medium: "Charcoal on Paper",
    size: "A3",
    time: "6 days",
  },
  {
    id: 2,
    title: "Pencil Portrait",
    category: "Pencil",
    image:
      "https://images.unsplash.com/photo-1549880338-65ddcdfd017b",
    description:
      "Fine pencil portrait focusing on facial realism and depth.",
    medium: "Graphite Pencil",
    size: "A4",
    time: "4 days",
  },
  {
    id: 3,
    title: "Color Portrait",
    category: "Color",
    image:
      "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620",
    description:
      "Hand colored portrait with vibrant tones and realistic shading.",
    medium: "Color Pencil",
    size: "A3",
    time: "7 days",
  },
];




export default function Gallery({ isDark }) {
  const [selected, setSelected] = useState(null);
  const [likes, setLikes] = useState({});
  const [filter, setFilter] = useState("All");

  const categories = ["All", "Pencil", "Charcoal", "Color", "Caricature"];

  const filtered =
    filter === "All"
      ? artworks
      : artworks.filter((art) => art.category === filter);

  const toggleLike = (id) => {
    setLikes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section
      className={`py-20 px-10 transition  ${
        isDark ? "bg-[#0b0b0b] text-white" : "bg-[#f6f3ef] text-black"
      }`} style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Title */}
      <div className="text-center mb-12 flex flex-col items-center gap-4">

        <span
            className={`text-xs px-3 py-1 text-center rounded-full border ${
              isDark ? "border-neutral-700 text-white" : "border-neutral-300 text-neutral-600"
            }`}
          >
            Our Gallery
          </span>

        <h1 className="text-4xl font-semibold mb-3" style={{ fontFamily: "Playfair Display, serif" }}>  
          Artist Gallery & Customer Showcase
        </h1>

        <p className="text-gray-500 max-w-xl mx-auto text-[15px]">
          Browse our collection of hand-drawn artworks. Every piece is
          unique, crafted with care and skill.
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3 justify-center mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3.5 py-1.5 rounded-lg border transition text-sm cursor-pointer ${
              filter === cat
                ? "bg-neutral-600 text-white border-neutral-600 transition hover:bg-neutral-700"
                : "border-gray-400 hover:bg-neutral-300 hover:text-black transition hover:border-gray-500"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

 {/* Masonry Gallery */}
<div className="columns-1 sm:columns-2 md:columns-3 lg:columns-3 gap-8">

{filtered.map((art) => (

<div
key={art.id}
onClick={() => setSelected(art)}
className={`mb-8 break-inside-avoid cursor-pointer group rounded-xl overflow-hidden shadow-lg transition
${isDark ? "bg-[#111] text-white" : "bg-white text-black"}`}
>

{/* Image */}
<div className="overflow-hidden">
<img
src={art.image}
alt={art.title}
className="w-full object-cover transition duration-500 group-hover:scale-105"
/>
</div>

{/* Content */}
<div className="flex justify-between items-center p-4">

<p className="font-medium text-[15px]">
{art.title}
</p>

<div onClick={(e)=>e.stopPropagation()}>
<LikeButton id={art.id}/>
</div>

</div>

</div>

))}

</div>




  {/* Modal */}
{selected && (
  <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6 z-50">


    <div
      className={`rounded-2xl max-w-6xl w-full grid md:grid-cols-2 overflow-hidden shadow-2xl transition
      ${isDark ? "bg-[#000] text-white" : "bg-white text-black"}`}
    >

      {/* Artwork Image */}
      <div className="relative">
        <img
          src={selected.image}
          className="w-full h-full object-cover"
          alt={selected.title}
        />
      </div>

      {/* Artwork Details */}
      <div className="p-10 relative flex flex-col justify-between">

        {/* Close Button */}
        <button
          onClick={() => setSelected(null)}
          className={`absolute top-5 right-5 transition 
          ${isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-black"}`}
        >
          <X size={24} />
        </button>

        <div>

          {/* Title */}
          <h2 className="text-3xl font-bold mb-1">
            {selected.title}
          </h2>

          {/* Category */}
          <p
            className={`mb-4 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {selected.category} Artwork
          </p>

          {/* Description */}
          <p
            className={`mb-6 leading-relaxed ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {selected.description}
          </p>

          {/* Artwork Info */}
          <div className="grid grid-cols-2 gap-6 mb-6">

            <div>
              <p className={`${isDark ? "text-gray-500" : "text-gray-400"} text-sm`}>
                Medium
              </p>
              <p className="font-semibold">
                {selected.medium}
              </p>
            </div>

            <div>
              <p className={`${isDark ? "text-gray-500" : "text-gray-400"} text-sm`}>
                Size
              </p>
              <p className="font-semibold">
                {selected.size}
              </p>
            </div>

            <div>
              <p className={`${isDark ? "text-gray-500" : "text-gray-400"} text-sm`}>
                Time Taken
              </p>
              <p className="font-semibold">
                {selected.time}
              </p>
            </div>

            <div>
              <p className={`${isDark ? "text-gray-500" : "text-gray-400"} text-sm`}>
                Artist
              </p>
              <p className="font-semibold">
                Akhileswar Kamale
              </p>
            </div>

          </div>

        </div>

        {/* Buttons */}
        <div className="flex gap-4 flex-wrap">

          {/* Instagram */}
          <a
            href="https://instagram.com/linesbyakhileswar"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            View on Instagram
          </a>

          {/* Order Button */}
          <button
            className={`px-6 py-3 rounded-lg font-medium transition border
            ${
              isDark
                ? "border-gray-600 hover:bg-gray-800"
                : "border-gray-300 hover:bg-gray-100"
            }`}
          >
            Order Similar Artwork
          </button>

        </div>

      </div>

    </div>

  </div>
)}
    </section>
  );
}