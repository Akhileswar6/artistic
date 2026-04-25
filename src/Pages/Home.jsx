import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";

const artworkCols = [
  [
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5",
    "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8",
    "https://images.unsplash.com/photo-1499557408845-810a905a8f4c",
    "https://images.unsplash.com/photo-1513364776144-60967b0f800f"
  ],
  [
    "https://images.unsplash.com/photo-1536924940846-227afb31e2a5",
    "https://images.unsplash.com/photo-1580136608260-4eb11f4b24fe",
    "https://images.unsplash.com/photo-1578301978018-3005759f48f7",
    "https://images.unsplash.com/photo-1542887800-faca0261c9e1"
  ],
  [
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429"
  ],
  [
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429"
  ]
];
import {
  Palette,
  Search,
  CheckCircle,
  Shield,
  Truck,
  Star,
  Upload,
  Package,

  Heart,
  Zap
} from "lucide-react";
import Testimonials from "../Components/Testimonials";
import RecentSketches from "../Components/RecentSketches";
import ArtistArtworks from "../Components/ArtistArtworks";
import Features from "../Components/Features";
import CustomerShowcase from "../Components/CustomerShowcase";

export default function Home({ isDark }) {
  const { user } = useOutletContext();
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    if (user) {
      const newUser = localStorage.getItem("isNewUser") === "true";
      setIsNewUser(newUser);
    }
  }, [user]);





  const heroRef = useRef(null);
  const [showHero, setShowHero] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowHero(true);
        }
      },
      { threshold: 0.3 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const stepsRef = useRef(null);
  const [visibleSteps, setVisibleSteps] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleSteps(true);
        }
      },
      { threshold: 0.3 }
    );

    if (stepsRef.current) {
      observer.observe(stepsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-black text-white" : "bg-white text-black"
        }`} style={{ fontFamily: "Inter, serif" }}
    >

      <div ref={heroRef} className={`relative w-full overflow-hidden min-h-[90vh] flex items-center justify-center`}>

        {/* BACKGROUND ANIMATION */}
        <div 
          className="absolute inset-0 z-0 flex px-4 md:px-8 mix-blend-luminosity scale-[1.15] rotate-[-4deg] pointer-events-none"
          style={{ maskImage: "radial-gradient(ellipse at center, black 20%, transparent 80%)", WebkitMaskImage: "radial-gradient(ellipse at center, black 20%, transparent 80%)" }}
        >
          {artworkCols.map((colImages, i) => (
            <div key={i} className={`flex-1 hidden md:flex flex-col overflow-hidden ${i === 1 || i === 2 ? '!flex' : ''}`}>
              <motion.div
                animate={{ y: i % 2 === 0 ? ["0%", "-50%"] : ["-50%", "0%"] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 35 + i * 5 }}
                className="flex flex-col w-full"
              >
                {[...colImages, ...colImages].map((src, idx) => (
                  <div key={idx} className="relative w-full h-48 md:h-72">
                    <img
                      src={`${src}?auto=format&fit=crop&q=80&w=600`}
                      className={`w-full h-full object-cover ${isDark ? "opacity-100" : "opacity-90"}`}
                      alt=""
                    />
                    <div className={`absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_40px_${isDark ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"}]`} />
                  </div>
                ))}
              </motion.div>
            </div>
          ))}
        </div>

        {/* FADE BACKGROUND GRADIENT (VIGNETTE) */}
        <div className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: isDark
              ? "radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 70%, #000 100%)"
              : "radial-gradient(ellipse at center, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.8) 75%, #fff 100%)"
          }}
        />

        {/* CENTERED CONTENT */}
        <div className="relative z-20 flex flex-col items-center text-center max-w-4xl px-4 md:px-8 mt-10">
          {/* Welcome Badge */}
          {user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: showHero ? 1 : 0, y: showHero ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={`mb-8 px-5 py-2.5 rounded-full border flex items-center backdrop-blur-md
                ${isDark
                  ? "bg-white/5 border-white/10 shadow-2xl text-white"
                  : "bg-white/60 border-black/10 shadow-sm text-black"
                }`}
            >
              <p className="text-[14px] font-medium" style={{ fontFamily: "Inter, sans-serif" }}>
                {isNewUser ? "Welcome to Artistic," : "Welcome back,"} {" "}
                <span className="text-neutral-500 capitalize">{user.fullName}</span>
                {isNewUser ? " 🎉" : " 👋"}
              </p>
            </motion.div>
          )}



          {/* Header Text */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: showHero ? 1 : 0, scale: showHero ? 1 : 0.95 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight"
            style={{ fontFamily: "Bricolage Grotesque, serif" }}
          >
            Turn Your Photos Into <br className="hidden md:block" />
            <span className="relative inline-block mt-2 md:mt-0 px-2 py-1">
              {/* Text Mask Gradient on "Beautiful" */}
              {/* Animate on header text implemented with framer-motion background position */}
              <motion.span
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 6, ease: "linear", repeat: Infinity }}
                className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-pink-500 to-orange-400 mb-1"
                style={{ backgroundSize: "200% auto" }}
              >
                Beautiful
              </motion.span>

              {/* Underline SVG */}
              <svg
                viewBox="0 0 220 24"
                className="absolute left-1/2 -translate-x-1/2 top-[75%] w-[110%] opacity-90"
                fill="none"
              >
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: showHero ? 1 : 0 }}
                  transition={{ duration: 1.5, delay: 1, ease: "easeInOut" }}
                  d="M5 15 C60 5, 160 25, 215 15"
                  stroke="url(#orange-gradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="orange-gradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#fb923c" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
            </span> {" "}
            <br className="hidden md:block" />
            <span className={` ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>Hand-Drawn Sketches</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: showHero ? 1 : 0, y: showHero ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className={`mt-6 sm:mt-8 md:mt-10 text-[14px] sm:text-[15px] leading-relaxed ${isDark ? "text-neutral-300" : "text-neutral-700 font-medium"
              }`}
          >
            Professional pencil, charcoal, color, digital, and caricature
            artworks. Each sketch is crafted individually — a unique piece of
            art you'll treasure forever.
          </motion.p>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: showHero ? 1 : 0, y: showHero ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-10 md:mt-12 w-full max-w-md sm:max-w-none sm:w-auto px-4 sm:px-0"
          >
            <Link to="/order" className="w-full sm:w-auto" style={{ textDecoration: 'none' }}>
              <button
                className={`w-full sm:w-auto px-5 py-2.5 sm:py-2 text-[14px] font-medium rounded-lg shadow-lg transition-all transform hover:-translate-y-1 active:scale-95 ${isDark
                  ? "bg-white text-black hover:bg-neutral-200"
                  : "bg-black text-white hover:bg-neutral-900 shadow-black/20"
                  }`}
              >
                Order Your Sketch

              </button>
            </Link>
            <Link to="/gallery" className="w-full sm:w-auto" style={{ textDecoration: 'none' }}>
              <button
                className={`w-full sm:w-auto px-5 py-2.5 sm:py-2 text-[14px] font-medium rounded-lg shadow-lg transition-all transform hover:-translate-y-1 active:scale-95 ${isDark
                  ? "bg-white/5 text-white border-white/20 hover:bg-white/10"
                  : "bg-white/50 text-black border-black/20 hover:bg-black/5 shadow-sm"
                  }`}
              >
                View Gallery
              </button>
            </Link>
          </motion.div>

          {/* Features underneath */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showHero ? 1 : 0, y: showHero ? 0 : 20 }}
            transition={{ duration: 1, delay: 1 }}
            className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-x-8 gap-y-4 mt-8 md:mt-10 text-[14px] sm:text-[15px] font-medium"
          >
            <span className={`flex items-center gap-2 ${isDark ? "text-neutral-400" : "text-neutral-700"}`}>
              <CheckCircle size={18} className="text-green-500" />
              100% Hand-drawn
            </span>
            <span className={`flex items-center gap-2 ${isDark ? "text-neutral-400" : "text-neutral-700"}`}>
              <Shield size={18} className="text-blue-500" />
              Satisfaction Guarantee
            </span>
            <span className={`flex items-center gap-2 ${isDark ? "text-neutral-400" : "text-neutral-700"}`}>
              <Truck size={18} className="text-purple-500" />
              Pan-India Delivery
            </span>
          </motion.div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 py-4">

        {/* HOW IT WORKS */}
        <div ref={stepsRef} className="mt-32">

          {/* Title */}
          <div className="text-center mb-20 max-w-2xl mx-auto">


            <h2
              className={`text-3xl sm:text-4xl md:text-5xl mt-6 font-bold tracking-tight ${isDark ? "text-white" : "text-black"}`}
              style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
            >
              From photo to <span className="text-neutral-500">masterpiece</span>
            </h2>

            <p
              className={`mt-4 text-[14px] sm:text-[15px] md:text-base leading-relaxed ${isDark ? "text-neutral-400" : "text-neutral-600"
                }`}
            >
              It's simple, fast, and delightful. Four clear steps to get your personalized, hand-drawn sketch delivered straight to your door.
            </p>
          </div>


          {/* Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">

            {/* Step 1 */}
            <div
              className={`relative group overflow-hidden border rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2
      ${visibleSteps ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
      ${isDark
                  ? "border-neutral-800 bg-[#111]/80 backdrop-blur-xl hover:border-neutral-600 hover:bg-[#161616]"
                  : "border-neutral-200 bg-white/80 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:border-neutral-300 hover:bg-neutral-50"
                }`}
            >
              <div className={`absolute right-5 -bottom-6 text-9xl font-black italic opacity-[0.03] pointer-events-none transition-opacity duration-500 group-hover:opacity-[0.1] ${isDark ? "text-white" : "text-black"}`} style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
                1
              </div>

              <div className="flex items-center gap-4 mb-8">
                <div
                  className={`p-4 rounded-lg flex items-center justify-center transition-colors duration-300 ${isDark ? "bg-white/5 text-neutral-300 group-hover:bg-orange-500/20 group-hover:text-orange-400" : "bg-neutral-100 text-neutral-600 group-hover:bg-orange-100 group-hover:text-orange-600"
                    }`}
                >
                  <Upload size={24} strokeWidth={1.5} />
                </div>
                <div className={`text-[13px] uppercase tracking-widest ${isDark ? "text-neutral-500" : "text-neutral-400"}`}>
                  Step 01
                </div>
              </div>

              <h3
                className={`text-[22px]  mb-3 ${isDark ? "text-white" : "text-neutral-900"}`}
                style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
              >
                Upload Photo
              </h3>

              <p className={`text-[14px] leading-relaxed ${isDark ? "text-neutral-400 group-hover:text-neutral-300 transition-colors" : "text-neutral-600 group-hover:text-neutral-700 transition-colors"}`}>
                Share the photo you want converted. Any clear image works great.
              </p>
            </div>

            {/* Step 2 */}
            <div
              className={`relative group overflow-hidden border rounded-2xl p-8 transition-all duration-500 delay-100 hover:-translate-y-2
      ${visibleSteps ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
      ${isDark
                  ? "border-neutral-800 bg-[#111]/80 backdrop-blur-xl hover:border-neutral-600 hover:bg-[#161616]"
                  : "border-neutral-200 bg-white/80 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:border-neutral-300 hover:bg-neutral-50"
                }`}
            >
              <div className={`absolute right-3 -bottom-6 text-9xl font-black italic opacity-[0.03] pointer-events-none transition-opacity duration-500 group-hover:opacity-[0.08] ${isDark ? "text-white" : "text-black"}`} style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
                2
              </div>

              <div className="flex items-center gap-4 mb-8">
                <div
                  className={`p-4 rounded-lg flex items-center justify-center transition-colors duration-300 ${isDark ? "bg-white/5 text-neutral-300 group-hover:bg-pink-500/20 group-hover:text-pink-400" : "bg-neutral-100 text-neutral-600 group-hover:bg-pink-100 group-hover:text-pink-600"
                    }`}
                >
                  <Search size={24} strokeWidth={1.5} />
                </div>
                <div className={`text-[13px] uppercase tracking-widest ${isDark ? "text-neutral-500" : "text-neutral-400"}`}>
                  Step 02
                </div>
              </div>

              <h3
                className={`text-[22px]  mb-3 ${isDark ? "text-white" : "text-neutral-900"}`}
                style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
              >
                Artist Reviews
              </h3>

              <p className={`text-[15px] leading-relaxed ${isDark ? "text-neutral-400 group-hover:text-neutral-300 transition-colors" : "text-neutral-600 group-hover:text-neutral-700 transition-colors"}`}>
                Our artist carefully reviews your photo and confirms the details.
              </p>
            </div>

            {/* Step 3 */}
            <div
              className={`relative group overflow-hidden border rounded-2xl p-8 transition-all duration-500 delay-200 hover:-translate-y-2
      ${visibleSteps ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
      ${isDark
                  ? "border-neutral-800 bg-[#111]/80 backdrop-blur-xl hover:border-neutral-600 hover:bg-[#161616]"
                  : "border-neutral-200 bg-white/80 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:border-neutral-300 hover:bg-neutral-50"
                }`}
            >
              <div className={`absolute right-3 -bottom-6 text-9xl font-black italic opacity-[0.03] pointer-events-none transition-opacity duration-500 group-hover:opacity-[0.08] ${isDark ? "text-white" : "text-black"}`} style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
                3
              </div>

              <div className="flex items-center gap-4 mb-8">
                <div
                  className={`p-4 rounded-lg flex items-center justify-center transition-colors duration-300 ${isDark ? "bg-white/5 text-neutral-300 group-hover:bg-purple-500/20 group-hover:text-purple-400" : "bg-neutral-100 text-neutral-600 group-hover:bg-purple-100 group-hover:text-purple-600"
                    }`}
                >
                  <Palette size={24} strokeWidth={1.5} />
                </div>
                <div className={`text-[13px] uppercase tracking-widest ${isDark ? "text-neutral-500" : "text-neutral-400"}`}>
                  Step 03
                </div>
              </div>

              <h3
                className={`text-[22px] mb-3 ${isDark ? "text-white" : "text-neutral-900"}`}
                style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
              >
                Sketch Created
              </h3>

              <p className={`text-[15px] leading-relaxed ${isDark ? "text-neutral-400 group-hover:text-neutral-300 transition-colors" : "text-neutral-600 group-hover:text-neutral-700 transition-colors"}`}>
                Your hand-drawn sketch is crafted with love and attention to detail.
              </p>
            </div>

            {/* Step 4 */}
            <div
              className={`relative group overflow-hidden border rounded-2xl p-8 transition-all duration-500 delay-300 hover:-translate-y-2
      ${visibleSteps ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
      ${isDark
                  ? "border-neutral-800 bg-[#111]/80 backdrop-blur-xl hover:border-neutral-600 hover:bg-[#161616]"
                  : "border-neutral-200 bg-white/80 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:border-neutral-300 hover:bg-neutral-50"
                }`}
            >
              <div className={`absolute right-3 -bottom-6 text-9xl font-black italic opacity-[0.03] pointer-events-none transition-opacity duration-500 group-hover:opacity-[0.08] ${isDark ? "text-white" : "text-black"}`} style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
                4
              </div>

              <div className="flex items-center gap-4 mb-8">
                <div
                  className={`p-4 rounded-lg flex items-center justify-center transition-colors duration-300 ${isDark ? "bg-white/5 text-neutral-300 group-hover:bg-blue-500/20 group-hover:text-blue-400" : "bg-neutral-100 text-neutral-600 group-hover:bg-blue-100 group-hover:text-blue-600"
                    }`}
                >
                  <Package size={24} strokeWidth={1.5} />
                </div>
                <div className={`text-[13px] uppercase tracking-widest ${isDark ? "text-neutral-500" : "text-neutral-400"}`}>
                  Step 04
                </div>
              </div>

              <h3
                className={`text-[22px]  mb-3 ${isDark ? "text-white" : "text-neutral-900"}`}
                style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
              >
                Delivered
              </h3>

              <p className={`text-[15px] leading-relaxed ${isDark ? "text-neutral-400 group-hover:text-neutral-300 transition-colors" : "text-neutral-600 group-hover:text-neutral-700 transition-colors"}`}>
                Framed and packed securely, shipped straight to your doorstep.
              </p>
            </div>

          </div>

        </div>




        <RecentSketches isDark={isDark} />











        <ArtistArtworks isDark={isDark} />








        <Testimonials isDark={isDark} />




        <CustomerShowcase isDark={isDark} />


        <Features isDark={isDark} />


      </div>



    </div>
  );
}