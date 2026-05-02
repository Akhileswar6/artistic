import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";


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

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-black text-white" : "bg-white text-black"
        }`} style={{ fontFamily: "Inter, serif" }}
    >

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className={`relative w-full overflow-hidden min-h-screen flex items-center justify-center pt-20 pb-16`}
      >

        {/* NEW BACKGROUND ANIMATION */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-center">
          {/* Animated Orbs */}
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute top-[10%] left-[10%] w-[300px] sm:w-[40vw] max-w-[600px] aspect-square rounded-full filter blur-[70px] sm:blur-[100px] ${isDark ? "bg-orange-500/20 mix-blend-screen" : "bg-orange-400/30 mix-blend-multiply"
              }`}
          />
          <motion.div
            animate={{
              x: [0, -80, 0],
              y: [0, 100, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute top-[20%] right-[10%] w-[250px] sm:w-[35vw] max-w-[500px] aspect-square rounded-full filter blur-[60px] sm:blur-[100px] ${isDark ? "bg-pink-500/20 mix-blend-screen" : "bg-pink-400/30 mix-blend-multiply"
              }`}
          />
          <motion.div
            animate={{
              x: [0, 50, 0],
              y: [0, 50, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute bottom-[10%] left-[30%] w-[350px] sm:w-[45vw] max-w-[700px] aspect-square rounded-full filter blur-[80px] sm:blur-[120px] ${isDark ? "bg-purple-500/20 mix-blend-screen" : "bg-purple-400/30 mix-blend-multiply"
              }`}
          />
        </div>

        {/* FADE BACKGROUND GRADIENT (VIGNETTE) */}
        <div className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: isDark
              ? "radial-gradient(ellipse at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%)"
              : "radial-gradient(ellipse at center, rgba(255,255,255,0) 0%, rgba(255,255,255,0.7) 100%)"
          }}
        />

        {/* BOTTOM EDGE FADE FOR SMOOTH TRANSITION */}
        <div className={`absolute bottom-0 left-0 right-0 h-24 z-10 pointer-events-none bg-gradient-to-t ${isDark ? "from-black to-transparent" : "from-white to-transparent"}`} />

        {/* CENTERED CONTENT */}
        <div className="relative z-20 flex flex-col items-center text-center max-w-4xl px-4 md:px-8 mt-4 sm:mt-8">
          {/* Welcome Badge */}
          {user && (
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={`mb-8 px-3 py-2 rounded-full border flex items-center text-sm
                ${isDark
                  ? "bg-white/10 backdrop-blur-xl border-white/10 shadow-[0_4px_20px_rgba(255,255,255,0.05)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] text-white"
                  : "bg-white/30 backdrop-blur-xl border-black/10 shadow-sm text-black"
                }`}
            >
              <p className={`text-[14px] font-medium ${isDark ? "text-neutral-400" : "text-neutral-600"}`} style={{ fontFamily: "Inter, sans-serif" }}>
                {isNewUser ? "Welcome to Artistic," : "Welcome back,"} {" "}
                <span className={`capitalize ${isDark ? "text-white" : "text-black"}`}>{user.fullName}</span>
                {isNewUser ? " 🎉" : " 👋"}
              </p>
            </motion.div>
          )}

          {/* Header Text */}
          <motion.h1
            variants={{
              hidden: { opacity: 0, scale: 0.95 },
              visible: { opacity: 1, scale: 1 }
            }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className={`${isDark ? "text-white" : "text-neutral-700"} text-4xl sm:text-5xl font-semibold leading-tight`}
            style={{ fontFamily: "'Scope One', sans-serif" }}
          >
            Turn Your Photos Into <br className="hidden md:block" />
            <span className="relative inline-block mt-2 md:mt-0 px-2 py-1">
              {/* Text Mask Gradient on "Beautiful" */}
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
                className="absolute left-1/2 -translate-x-1/2 top-[65%] w-[110%] opacity-90"
                fill="none"
              >
                <motion.path
                  variants={{
                    hidden: { pathLength: 0 },
                    visible: { pathLength: 1 }
                  }}
                  transition={{ duration: 1.5, delay: 1, ease: "easeInOut" }}
                  d="M5 15 C60 5, 160 25, 215 15"
                  stroke="url(#orange-gradient)"
                  strokeWidth="3"
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
            <span className={` ${isDark ? "text-white" : "text-neutral-700"}`}>Hand-Drawn Sketches</span>
          </motion.h1>



          {/* Actions */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-10 md:mt-12 w-full max-w-md sm:max-w-none sm:w-auto px-4 sm:px-0"
          >
            <Link to="/order" className="w-full sm:w-auto" style={{ textDecoration: 'none' }}>
              <button
                className={`w-full sm:w-auto px-4 py-2 sm:py-2 text-[14px] font-medium rounded-full shadow-lg transition-all transform hover:-translate-y-1 active:scale-95 cursor-pointer border ${isDark
                  ? "bg-white/5 text-white border-white/10 hover:bg-white/10"
                  : "bg-white/30 text-black border-black/10 hover:bg-white/40 shadow-sm"
                  }`}
              >
                Order Your Sketch

              </button>
            </Link>
            <Link to="/gallery" className="w-full sm:w-auto" style={{ textDecoration: 'none' }}>
              <button
                className={`w-full sm:w-auto px-4 py-2 sm:py-2 text-[14px] font-medium rounded-full shadow-lg transition-all transform hover:-translate-y-1 active:scale-95 cursor-pointer border ${isDark
                  ? "bg-white/5 text-white border-white/10 hover:bg-white/10"
                  : "bg-white/30 text-black border-black/10 hover:bg-white/40 shadow-sm"
                  }`}
              >
                View Gallery
              </button>
            </Link>
          </motion.div>

          {/* Features underneath */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
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
      </motion.div>

      <div className="max-w-7xl mx-auto px-5 py-4">

        {/* HOW IT WORKS */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
          }}
          className="mt-32"
        >

          {/* Title */}
          <div className="text-center mb-20 max-w-2xl mx-auto">
            <h2
              className={`text-3xl sm:text-4xl  mt-6 font-bold tracking-tight ${isDark ? "text-white" : "text-black"}`}
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
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              className={`relative group overflow-hidden border rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2
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
                  className={`p-4 rounded-lg flex items-center justify-center transition-colors duration-300 ${isDark ? "bg-white/5 text-neutral-300 group-hover:bg-white/10 group-hover:text-white" : "bg-neutral-100 text-neutral-600 group-hover:bg-neutral-200 group-hover:text-black"
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
            </motion.div>

            {/* Step 2 */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              className={`relative group overflow-hidden border rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2
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
            </motion.div>

            {/* Step 3 */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              className={`relative group overflow-hidden border rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2
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
            </motion.div>

            {/* Step 4 */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              className={`relative group overflow-hidden border rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2
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
            </motion.div>

          </div>

        </motion.div>




        <div className="mt-24 md:mt-40">
          <RecentSketches isDark={isDark} />
        </div>











        <div className="mt-24 md:mt-40">
          <ArtistArtworks isDark={isDark} />
        </div>








        <div className="mt-24 md:mt-40">
          <Testimonials isDark={isDark} />
        </div>




        <div className="mt-24 md:mt-40">
          <CustomerShowcase isDark={isDark} />
        </div>


        <div className="mt-24 md:mt-40">
          <Features isDark={isDark} />
        </div>


      </div>



    </div>
  );
}