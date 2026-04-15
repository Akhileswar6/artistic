import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
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
import ArtStyles from "../Components/ArtStyles";
import RecentSketches from "../Components/RecentSketches";
import CustomerShowcase from "../Components/CustomerShowcase";





export default function Home({ isDark }) {
  const { user } = useOutletContext();
  const [isNewUser, setIsNewUser ] = useState(false);

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



  const promiseRef = useRef(null);
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

    if (promiseRef.current) observer.observe(promiseRef.current);

    return () => observer.disconnect();
  }, []);





  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-black text-white" : "bg-white text-black"
        }`} style={{ fontFamily: "Inter, serif" }}
    >
      <div className="max-w-7xl mx-auto px-5 py-4">


        <div ref={heroRef} className="grid md:grid-cols-2 gap-14 items-center">

          {/* LEFT SIDE — Text Content */}
          <div
            className={`transition-all duration-1000
            ${showHero ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-20"}
            `}
          >
            {user && (
              <div
                className={`mb-6 px-5 py-3 rounded-2xl border transition-all duration-700 flex items-center w-fit animate-in fade-in slide-in-from-left-6 
                ${isDark
                    ? "bg-white/5 border-white/10 shadow-2xl shadow-black/20 text-white"
                    : "bg-black/[0.02] border-black/5 shadow-sm text-black"
                  }`}
              >
                  <p className="text-[15px] font-medium" style={{ fontFamily: "Inter, sans-serif" }}>
                    {isNewUser ? "Welcome to Artistic," : "Welcome back,"} {" "}
                    <span className="text-orange-400 capitalize">{user.fullName?.split(" ")[0]}!</span>
                    {isNewUser ? " 🎉" : " 👋"}
                  </p>
              </div>
            )}

            <span
              className={`text-xs px-3 py-1 rounded-full border ${isDark ? "border-neutral-700 text-white" : "border-neutral-300 text-neutral-600"
                }`}
            >
              Handcrafted with Love
            </span>

            {/* Heading */}
            <h1
              className=" md:text-4xl mt-4 font-semibold leading-tight"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Turn Your Photos <br />
              Into{" "}
              <span className="relative text-orange-400 inline-block">
                Beautiful

                <svg
                  viewBox="0 0 220 24"
                  className="absolute left-1/2 -translate-x-1/2 top-[78%] w-[120%]"
                  fill="none"
                >
                  <path
                    d="M5 15 C60 5, 160 25, 215 15"
                    stroke="#fb923c"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span> {" "}
              Hand-Drawn <br />
              Sketches
            </h1>

            <p
              className={`mt-4 text-[14px] leading-6 ${isDark ? "text-neutral-400" : "text-neutral-600"
                }`}
            >
              Professional pencil, charcoal, color, digital, and caricature
              artworks. Each sketch is crafted individually — a unique piece of
              art you'll treasure forever.
            </p>

            {/* Buttons */}
            <div className="flex gap-4 mt-8">

              <Link to="/order" style={{ textDecoration: "none" }}>
                <button
                  className={`px-6 py-2 text-[14px] rounded-full transition cursor-pointer ${isDark
                      ? "bg-white text-black"
                      : "bg-black text-white hover:bg-neutral-900"
                    }`}
                >
                  Order Your Sketch
                </button>
              </Link>

              <Link to="/gallery">
                <button
                  className={`px-6 py-2 text-[13px] rounded-full border bg-[#1c1c1c] transition cursor-pointer ${isDark
                      ? "bg-[#1c1c1c] text-white border-neutral-700 hover:bg-neutral-900"
                      : "bg-white text-black border border-neutral-300 shadow-lg hover:bg-gray-100"
                    }`}
                >

                  View Samples
                </button>
              </Link>

            </div>

            {/* Feature icons */}
            <div className="flex gap-6 mt-8 text-sm">

              <span className="flex items-center gap-2">
                <CheckCircle size={19} className="text-green-500" />
                100% Hand-drawn
              </span>

              <span className="flex items-center gap-2">
                <Shield size={19} className="text-blue-500" />
                Satisfaction Guarantee
              </span>

              <span className="flex items-center gap-2">
                <Truck size={19} className="text-purple-500" />
                Pan-India Delivery
              </span>

          </div>

          </div>

          {/* RIGHT SIDE — Images */}
          <div className="grid grid-cols-2 gap-4 relative">


            {/* Image 1 — SCALE IN */}
            <img
              src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429"
              className={`rounded-xl h-64 w-full object-cover shadow-lg mt-5
  transition-all duration-700 float-slow
  ${showHero ? "scale-100 opacity-100" : "scale-75 opacity-0"}
  `}
            />

            {/* Image 2 — FADE IN */}
            <img
              src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429"
              className={`rounded-xl h-40 w-full object-cover shadow-lg mt-5
  transition-all duration-700 delay-200 float-slow
  ${showHero ? "opacity-100" : "opacity-0"}
  `}
            />

            {/* Image 3 — SLIDE UP */}
            <img
              src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429"
              className={`rounded-xl h-40 w-full object-cover shadow-lg
  transition-all duration-700 delay-300 float-slow
  ${showHero ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}
  `}
            />

            {/* Image 4 — ZOOM */}
            <img
              src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429"
              className={`rounded-xl h-72 w-full object-cover -mt-24 shadow-lg
  transition-all duration-700 delay-500 float-slow
  ${showHero ? "scale-100 opacity-100" : "scale-125 opacity-0"}
  `}
            />

            {/* Rating Card */}
            <div
              className={`absolute bottom-1 left-8 p-4 rounded-xl border mt-4
    transition-all duration-700 delay-700
    ${showHero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}
    ${isDark
                  ? "bg-black border-neutral-700"
                  : "bg-white border-neutral-300 shadow-lg"
                }`}
            >
              <div className="flex gap-1 text-yellow-400">
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
              </div>

              <p className="text-sm font-medium mt-1">
                100+ Happy Customers
              </p>

              <p className="text-xs opacity-70">
                4.9/5 average rating
              </p>
            </div>

          </div>
        </div>








        {/* HOW IT WORKS */}
        <div ref={stepsRef} className="mt-32">

          {/* Title */}
          <div className="text-center mb-16">

            <span
              className={`text-xs px-3 py-1 rounded-full border ${isDark ? "border-neutral-700" : "border-neutral-300"
                }`}
            >
              Simple Process
            </span>

            <h2
              className="text-4xl mt-4 font-semibold"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              How It Works
            </h2>

            <p
              className={`mt-3 text-[16px] ${isDark ? "text-neutral-400" : "text-neutral-600"
                }`}
            >
              From your photo to a framed masterpiece — it's simple, fast, and delightful.
            </p>

          </div>


          {/* Steps */}
          <div className="grid md:grid-cols-4 gap-10">

            {/* Step 1 */}
            <div
              className={`border rounded-2xl p-8 transition-all duration-700
      ${visibleSteps ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-20"}
      ${isDark
                  ? "border-neutral-800 bg-[#141414]"
                  : "border-neutral-300 bg-white shadow-lg"
                }`}
            >

              <div className="flex items-center justify-between mb-6">

                <div
                  className={`p-4 rounded-xl ${isDark ? "bg-[#1c1c1c]" : "bg-neutral-100"
                    }`}
                >
                  <Upload size={22} />
                </div>

                <span className="text-sm opacity-50">1</span>

              </div>

              <h3
                className="text-lg font-semibold mb-2"
                style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
              >
                Upload Your Photo
              </h3>

              <p className={`${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                Share the photo you want converted. Any clear image works great.
              </p>

            </div>


            {/* Step 2 */}
            <div
              className={`border rounded-2xl p-8 transition-all duration-700 delay-200
      ${visibleSteps ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-20"}
      ${isDark
                  ? "border-neutral-800 bg-[#141414]"
                  : "border-neutral-300 bg-white shadow-lg"
                }`}
            >

              <div className="flex items-center justify-between mb-6">

                <div
                  className={`p-4 rounded-xl ${isDark ? "bg-[#1c1c1c]" : "bg-neutral-100"
                    }`}
                >
                  <Search size={22} />
                </div>

                <span className="text-sm opacity-50">2</span>

              </div>

              <h3
                className="text-lg font-semibold mb-2"
                style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
              >
                Artist Reviews
              </h3>

              <p className={`${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                Our artist carefully reviews your photo and confirms the details.
              </p>

            </div>


            {/* Step 3 */}
            <div
              className={`border rounded-2xl p-8 transition-all duration-700 delay-300
      ${visibleSteps ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-20"}
      ${isDark
                  ? "border-neutral-800 bg-[#141414]"
                  : "border-neutral-300 bg-white shadow-lg"
                }`}
            >

              <div className="flex items-center justify-between mb-6">

                <div
                  className={`p-4 rounded-xl ${isDark ? "bg-[#1c1c1c]" : "bg-neutral-100"
                    }`}
                >
                  <Palette size={22} />
                </div>

                <span className="text-sm opacity-50">3</span>

              </div>

              <h3
                className="text-lg font-semibold mb-2"
                style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
              >
                Sketch Created
              </h3>

              <p className={`${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                Your hand-drawn sketch is crafted with love and attention to detail.
              </p>

            </div>


            {/* Step 4 */}
            <div
              className={`border rounded-2xl p-8 transition-all duration-700 delay-500
      ${visibleSteps ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-20"}
      ${isDark
                  ? "border-neutral-800 bg-[#141414]"
                  : "border-neutral-300 bg-white shadow-lg"
                }`}
            >

              <div className="flex items-center justify-between mb-6">

                <div
                  className={`p-4 rounded-xl ${isDark ? "bg-[#1c1c1c]" : "bg-neutral-100"
                    }`}
                >
                  <Package size={22} />
                </div>

                <span className="text-sm opacity-50">4</span>

              </div>

              <h3
                className="text-lg font-semibold mb-2"
                style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
              >
                Delivered to You
              </h3>

              <p className={`${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                Framed and packed securely, shipped right to your doorstep.
              </p>

            </div>

          </div>

        </div>




        <RecentSketches isDark={isDark} />











        <CustomerShowcase isDark={isDark} limit={4} />








        <Testimonials isDark={isDark} />




        <ArtStyles isDark={isDark} />


        {/* OUR PROMISE */}
        <div
          ref={promiseRef}
          className={`mt-32 flex justify-center mb-20
  transition-all duration-1000 transform
  ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}
`}
        >
          <div
            className={`max-w-4xl w-full rounded-3xl border px-12 py-16 text-center ${isDark
                ? "bg-[#111] border-neutral-800"
                : "bg-white border-neutral-300 shadow-md"
              }`}
          >

            {/* Icon */}
            <div className="flex justify-center mb-6">
              <Heart
                size={36}
                className={isDark ? "text-pink-500" : "text-red-500"}
              />
            </div>

            {/* Title */}
            <h2
              className="text-4xl font-semibold mb-6"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Our Promise to You
            </h2>

            {/* Quote */}
            <p
              className={`max-w-2xl mx-auto text-[18px] italic leading-8 ${isDark ? "text-neutral-300" : "text-neutral-700"
                }`}
            >
              “Customer satisfaction is more important than commercialization.
              Every sketch I create is a piece of my heart.
              If you're not happy, we'll make it right.”
            </p>

            {/* Artist */}
            <p className="mt-6 font-semibold text-[20px]" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
              — Akhileswar Kamale, Artist
            </p>

            {/* Buttons */}
            <div className="flex justify-center gap-4 mt-10">

              <Link to="/order" style={{ textDecoration: "none" }}>
                <button
                  className={`px-6 py-2 text-[14px] rounded-xl transition cursor-pointer ${isDark
                      ? "bg-white text-black"
                      : "bg-black text-white hover:bg-neutral-900"
                    }`}
                >
                  Start your Order
                </button>
              </Link>

              <Link to="/about">
                <button
                  className={`px-6 py-2 text-[13px] rounded-xl border bg-[#1c1c1c] transition cursor-pointer ${isDark
                      ? "bg-[#1c1c1c] text-white border-neutral-700 hover:bg-neutral-900"
                      : "bg-white text-black border border-neutral-300 shadow-lg hover:bg-gray-100"
                    }`}
                >

                  Meet Artist
                </button>
              </Link>

            </div>

          </div>

        </div>


      </div>



    </div>
  );
}