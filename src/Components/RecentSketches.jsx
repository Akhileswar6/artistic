import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import pencil from "../assets/Pencil.webp";
import charcoal from "../assets/Charcoal.jpg";
import sketching from "../assets/Sketch.webp";
import { ArrowRight } from "lucide-react";

export default function RecentSketches({ isDark }) {

  const sketches = [
    { img: pencil, title: "Pencil Portrait" },
    { img: charcoal, title: "Charcoal Artwork" },
    { img: sketching, title: "Sketch" },
    { img: pencil, title: "Caricature" },
    { img: charcoal, title: "Charcoal Artwork" },
    { img: sketching, title: "Sketch" },
  ];

  const gridRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (gridRef.current) observer.observe(gridRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="mt-36">

      {/* Header */}
      <div className="relative text-center mb-12 max-w-7xl mx-auto">

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
          className={`mt-3 text-[15px] ${
            isDark ? "text-neutral-400" : "text-neutral-600"
          }`}
        >
          Some of our latest hand-drawn artworks
        </p>

        {/* Desktop Button */}
        <Link
          to="/samples"
           className={`absolute right-0 bottom-0 hidden sm:flex items-center gap-1 text-[13px] transition hover:translate-x-1 ${
              isDark
                ? "text-neutral-400 hover:text-neutral-200"
                : "text-black hover:text-gray-700"
            }`}
        >
          <span
           
          >
            View Full Gallery
          </span>
          <ArrowRight size={15} />
        </Link>

        {/* Mobile Button */}
        <div className="mt-5 sm:hidden">
          <Link to="/samples">
            <button
              className={`px-5 py-2 text-[13px] rounded-full border ${
                isDark
                  ? "bg-[#1c1c1c] text-white border-neutral-700"
                  : "bg-white text-black border border-neutral-300 shadow-lg"
              }`}
            >
              View Full Gallery
            </button>
          </Link>
        </div>

      </div>


      {/* Sketch Grid */}
      <div
        ref={gridRef}
className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-7xl mx-auto"      >

        {sketches.map((sketch, i) => (

          <div
            key={i}
            style={{ transitionDelay: `${i * 120}ms` }}
            className={`group overflow-hidden rounded-xl border
            transition-all duration-700
            ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
            ${
              isDark
                ? "border-neutral-800 bg-[#111]"
                : "border-neutral-200 bg-white shadow-sm"
            }`}
          >

            {/* Image */}
            <div className="overflow-hidden h-70">

              <img
                src={sketch.img}
                alt="sketch"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

            </div>

            {/* Title */}
            <div className="p-3">

              <h3 className="text-sm font-medium">
                {sketch.title}
              </h3>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}