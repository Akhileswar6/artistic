import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function CustomerShowcase({ isDark }) {


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



  const customers = [
    {
      id: 1,
      name: "Rahul",
      style: "Charcoal Portrait",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
      review: "Amazing artwork! The portrait looks exactly like the photo."
    },
    {
      id: 2,
      name: "Priya",
      style: "Pencil Portrait",
      image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
      review: "Beautiful drawing and great detailing."
    },
    {
      id: 3,
      name: "Arjun",
      style: "Color Portrait",
      image: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e",
      review: "Loved the colors and shading!"
    },
    {
      id: 4,
      name: "Sneha",
      style: "Realistic Sketch",
      image: "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7",
      review: "Super realistic! I was impressed with every detail."
    }
  ];


  return (

    
    <section
      className={`py-20 px-4 transition-colors duration-300 ${
        isDark ? "bg-black text-white" : "bg-white text-black"
      }`}
    >

      {/* Heading + Link */}
      <div className="relative mb-12 max-w-6xl mx-auto">
        <h2
          className="text-4xl text-center font-semibold"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Customer Showcase
        </h2>

        <Link
          to="/samples"
          className={`absolute right-0 bottom-0 hidden sm:flex items-center gap-1 text-[13px] transition hover:translate-x-1 ${
            isDark
              ? "text-neutral-400 hover:text-neutral-200"
              : "text-black hover:text-gray-700"
          }`}
        >
          <span>View Full Gallery</span>
          <ArrowRight size={15} />
        </Link>
      </div>

      {/* Grid */}
      <div ref={gridRef} className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">

        {customers.map((c) => (

          <div
  key={c.id}
  style={{ transitionDelay: `${c.id * 120}ms` }}
  className={`group rounded-xl overflow-hidden shadow-lg
  transition-all duration-700 transform
  ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}
  ${isDark ? "bg-[#111]" : "bg-white"}
  hover:scale-[1.04]`}
>

            {/* Image */}
            <div className="relative">
              <img
                src={c.image}
                alt={c.name}
                className="h-[260px] w-full object-cover"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center px-4">
                <p className="text-white text-sm text-center">
                  "{c.review}"
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="font-semibold text-lg">{c.name}</h3>

              <p
                className={`text-xs mt-1 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {c.style}
              </p>
            </div>

          </div>

        ))}

      </div>

    </section>
  );
}