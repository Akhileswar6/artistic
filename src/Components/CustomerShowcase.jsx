import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Calendar, ExternalLink, X, Instagram, Star, Quote } from "lucide-react";
import { Link } from "react-router-dom";

const showcaseItems = [
  {
    id: 1,
    title: "Realistic Girl Portrait",
    customer: "Ananya ",
    style: "Pencil Sketch",
    image: "/ArtistArtWorks/girl.webp",
    date: "March 2024",
    rating: 5,
    testimonial: "Absolutely loved the portrait! The shading and the eyes are so realistic. It was the perfect gift."
  },
  {
    id: 2,
    title: "Realistic Portrait",
    customer: "Sreekanth ",
    style: "Realistic Sketch",
    image: "/ArtistArtWorks/Sree.jpg",
    date: "January 2024",
    rating: 5,
    testimonial: "The charcoal work is incredible. You've captured the expression so gracefully. Truly a masterpiece!"
  },
  {
    id: 3,
    title: "Pawan Kalyan Fan Art",
    customer: "Kiran Kumar",
    style: "Realistic Sketch",
    image: "/RecentArtworks/Pawan%20Kalyan.webp",
    date: "February 2024",
    rating: 5,
    testimonial: "The detail in this Pawan Kalyan sketch is mind-blowing. Every stroke feels alive. Highly recommended!"
  },
  {
    id: 4,
    title: "Realistic Portrait",
    customer: "Harsha",
    style: "Realistic Sketch",
    image: "/ArtistArtWorks/harsha.jpg",
    date: "April 2024",
    rating: 5,
    testimonial: "I am amazed by the level of precision in this portrait. It's more than just a sketch; it's a piece of soul."
  }
];

export default function CustomerShowcase({ isDark }) {
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

  return (
    <section 
      ref={sectionRef}
      className={`py-12 md:py-24 px-4 md:px-8 transition-colors duration-500 ${
        isDark ? "bg-black" : "bg-white"
      }`}
    >
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 md:mb-16 gap-4 sm:gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight ${
              isDark ? "text-white" : "text-neutral-900"
            }`} style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
              Customer <span className="text-neutral-500">Showcase</span>
            </h2>
            <p className={`mt-2 sm:mt-3 max-w-xl text-[13px] sm:text-[14px] leading-relaxed ${
              isDark ? "text-neutral-400" : "text-neutral-500"
            }`}>
              A gallery of commissioned works and heartwarming stories from our cherished clients across the globe.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Link to="/order" className="block w-full sm:w-auto">
              <button className={`w-full sm:w-auto px-6 py-3 sm:py-2 rounded-full text-[14px] sm:text-[13px] transition-all duration-300 transform hover:-translate-y-1 ${
                isDark 
                  ? "bg-white text-black hover:bg-neutral-200" 
                  : "bg-black text-white hover:bg-neutral-800 shadow-xl shadow-black/20"
              }`}>
                Commission Your Artwork
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Showcase Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {showcaseItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group"
            >
              <div className={`relative aspect-[4/5] overflow-hidden rounded-2xl transition-all duration-500 border ${
                isDark ? "bg-neutral-900 border-white/5" : "bg-neutral-50 border-black/5"
              }`}>
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay with Testimonial Snippet */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 p-6 flex flex-col justify-end">
                  <Quote className=" text-yellow-400 mb-2" size={20} />
                  <p className="text-white text-xs mb-2  font-medium">
                    "{item.testimonial}"
                  </p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={10} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 px-1">
                <h4 className={`text-md tracking-tight ${isDark ? "text-white" : "text-neutral-900"}`} style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
                  {item.title}
                </h4>
                <div className="flex items-center justify-between mt-1">
                  <p className={`text-[12px] font-medium ${isDark ? "text-neutral-500" : "text-neutral-400"}`}>
                    Client: {item.customer}
                  </p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${isDark ? "bg-white/5 text-neutral-400" : "bg-neutral-100 text-neutral-500"}`}>
                    {item.style}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dynamic Counter Snippet */}
        <div className="mt-16 md:mt-20 flex flex-wrap justify-center gap-8 sm:gap-12 md:gap-24">
          {[
            { label: "Happy Clients", value: "500+" },
            { label: "Custom Portraits", value: "1,200+" },
            { label: "Countries Served", value: "15+" }
          ].map((stat, i) => (
            <div key={i} className="text-center w-[40%] sm:w-auto">
              <div className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-1 sm:mb-2 ${isDark ? "text-white" : "text-neutral-900"}`} style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
                {stat.value}
              </div>
              <div className={`text-[9px] sm:text-[10px] uppercase tracking-[0.1em] sm:tracking-[0.2em] font-bold ${isDark ? "text-neutral-500" : "text-neutral-400"}`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
