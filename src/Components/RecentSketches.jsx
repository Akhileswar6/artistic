import { Link } from "react-router-dom";
import pencil from "../assets/Pencil.webp";
import charcoal from "../assets/Charcoal.jpg";
import sketching from "../assets/Sketch.webp";

export default function RecentSketches({ isDark }) {

  const sketches = [
    { img: pencil, title: "Pencil Portrait" },
    { img: charcoal, title: "Charcoal Artwork" },
    { img: sketching, title: "Sketch" },
    { img: pencil, title: "Caricature" },
    { img: charcoal, title: "Charcoal Artwork" },
    { img: sketching, title: "Sketch" },

  ];

  return (
    <div className="mt-40">

      {/* Title */}
      <div className="text-center mb-14">

        <span
          className={`text-xs px-3 py-1 rounded-full border ${
            isDark ? "border-neutral-700" : "border-neutral-300"
          }`}
        >
          Recent Work
        </span>

        <h2
          className="text-4xl mt-4 font-semibold"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Recent Sketches
        </h2>

        <p
          className={`mt-3 text-[16px] ${
            isDark ? "text-neutral-400" : "text-neutral-600"
          }`}
        >
          Some of our latest hand-drawn artworks
        </p>

      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">

        {sketches.map((sketch, i) => (

          <div
            key={i}
            className={`group overflow-hidden rounded-xl border transition duration-300 ${
              isDark
                ? "border-neutral-800 bg-[#111]"
                : "border-neutral-200 bg-white shadow-sm"
            }`}
          >

            <div className="overflow-hidden aspect-square">

              <img
                src={sketch.img}
                alt="sketch"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

            </div>

            <div className="p-3">

              <h3 className="text-sm font-medium">
                {sketch.title}
              </h3>

            </div>

          </div>

        ))}

      </div>

      {/* Button */}
      <div className="flex justify-center mt-10">

        <Link to="/samples">
                <button
                  className={`px-6 py-2 text-[13px] rounded-full border bg-[#1c1c1c] transition cursor-pointer ${
                isDark
                  ? "bg-[#1c1c1c] text-white border-neutral-700 hover:bg-neutral-900"
                  : "bg-white text-black border border-neutral-300 shadow-lg hover:bg-gray-100"
              }`}
                >
                  
                  View Full Gallery
                </button>
              </Link>

      </div>

    </div>
  );
}