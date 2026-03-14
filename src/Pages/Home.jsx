import { Link } from "react-router-dom";
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

export default function Home({ isDark }) {
  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-black text-white" : "bg-white text-black"
      }`} style={{ fontFamily: "Inter, serif" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">

        <div className="grid md:grid-cols-2 gap-14 items-center">

          {/* LEFT SIDE */}
          <div>

            <span
            className={`text-xs px-3 py-1 rounded-full border ${
              isDark ? "border-neutral-700 text-white" : "border-neutral-300 text-neutral-600"
            }`}
          >
            Handcrafted with Love
          </span>

            {/* Heading */}
            <h1
              className="text-3xl md:text-4xl mt-7 font-semibold leading-tight"
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
              className={`mt-6 text-[15px] leading-7 ${
                isDark ? "text-neutral-400" : "text-neutral-600"
              }`}
            >
              Professional pencil, charcoal, color, digital, and caricature
              artworks. Each sketch is crafted individually — a unique piece of
              art you'll treasure forever.
            </p>

            {/* Buttons */}
            <div className="flex gap-4 mt-8">

              <Link to = "/order" style={{ textDecoration: "none" }}>
              <button
                className={`px-6 py-2 text-[14px] rounded-full transition cursor-pointer ${
                  isDark
                    ? "bg-white text-black"
                    : "bg-black text-white hover:bg-neutral-900"
                }`}
              >
                 Order Your Sketch
              </button>
              </Link>

              <Link to="/samples">
                <button
                  className={`px-6 py-2 text-[13px] rounded-full border bg-[#1c1c1c] transition cursor-pointer ${
                isDark
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
                <CheckCircle size={18} className="text-green-500" />
                100% Hand-drawn
              </span>

              <span className="flex items-center gap-2">
                <Shield size={18} className="text-blue-500" />
                Satisfaction Guarantee
              </span>

              <span className="flex items-center gap-2">
                <Truck size={18} className="text-purple-500" />
                Pan-India Delivery
              </span>

            </div>

          </div>

          {/* RIGHT SIDE IMAGE GRID */}
          <div className="grid grid-cols-2 gap-4 relative">

            <img
              src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429"
              className="rounded-xl h-64 w-full object-cover shadow-lg"
            />

            <img
              src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429"
              className="rounded-xl h-40 w-full object-cover shadow-lg"
            />

            <img
              src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429"
              className="rounded-xl h-40 w-full object-cover shadow-lg"
            />

           <img
  src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429"
  className="rounded-xl h-74 w-full object-cover -mt-24 shadow-lg"
/>

            {/* Rating Card */}
            <div
              className={`absolute bottom-8 left-8 p-4 rounded-xl border ${
                isDark
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
<div className="mt-32">

  {/* Title */}
  <div className="text-center mb-16">

    <span
      className={`text-xs px-3 py-1 rounded-full border ${
        isDark ? "border-neutral-700" : "border-neutral-300"
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
      className={`mt-3 text-[16px] ${
        isDark ? "text-neutral-400" : "text-neutral-600"
      }`}
    >
      From your photo to a framed masterpiece — it's simple, fast, and delightful.
    </p>

  </div>


  {/* Steps */}
<div className="relative grid md:grid-cols-4 gap-16">
      {/* Flow Line */}
<div
  className={`hidden md:block absolute top-1/2 left-[8%] right-[8%] h-[2px] -translate-y-1/2 ${
    isDark ? "bg-neutral-800" : "bg-neutral-300"
  }`}
/>

    {/* Animated Moving Line */}
<div className="hidden md:block absolute top-1/2 left-[8%] h-[2px] w-[18%] -translate-y-1/2 bg-orange-400 animate-[flow_4s_linear_infinite]" />
    {/* Step 1 */}
    <div
      className={`relative z-10 border rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl ${
        isDark
          ? "border-neutral-800 bg-[#141414]"
          : "border-neutral-300 bg-white shadow-lg"
      } animate-[stepGlow_6s_infinite]`}
    >

      <div className="flex items-center justify-between mb-6">

        <div
          className={`p-4 rounded-xl ${
            isDark ? "bg-[#1c1c1c]" : "bg-neutral-100"
          }`}
        >
          <Upload size={22} />
        </div>

        <span className="text-sm opacity-50">1</span>

      </div>

      <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
        Upload Your Photo
      </h3>

      <p className={`${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
        Share the photo you want converted. Any clear image works great.
      </p>

    </div>


    {/* Step 2 */}
    <div
      className={`relative z-10 border rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl ${
        isDark
          ? "border-neutral-800 bg-[#141414]"
          : "border-neutral-300 bg-white shadow-lg"
      } animate-[stepGlow_6s_infinite_1.5s]`}
    >

      <div className="flex items-center justify-between mb-6">

        <div
          className={`p-4 rounded-xl ${
            isDark ? "bg-[#1c1c1c]" : "bg-neutral-100"
          }`}
        >
          <Search size={22} />
        </div>

        <span className="text-sm opacity-50">2</span>

      </div>

      <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
        Artist Reviews
      </h3>

      <p className={`${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
        Our artist carefully reviews your photo and confirms the details.
      </p>

    </div>


    {/* Step 3 */}
    <div
      className={`relative z-10  border rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl ${
        isDark
          ? "border-neutral-800 bg-[#141414]"
          : "border-neutral-300 bg-white shadow-lg"
      } animate-[stepGlow_6s_infinite_3s]`}
    >

      <div className="flex items-center justify-between mb-6">

        <div
          className={`p-4 rounded-xl ${
            isDark ? "bg-[#1c1c1c]" : "bg-neutral-100"
          }`}
        >
          <Palette size={22} />
        </div>

        <span className="text-sm opacity-50">3</span>

      </div>

      <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
        Sketch Created
      </h3>

      <p className={`${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
        Your hand-drawn sketch is crafted with love and attention to detail.
      </p>

    </div>


    {/* Step 4 */}
    <div
      className={`relative z-10 border rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl ${
        isDark
          ? "border-neutral-800 bg-[#141414]"
          : "border-neutral-300 bg-white shadow-lg"
      } animate-[stepGlow_6s_infinite_4.5s]`}
    >

      <div className="flex items-center justify-between mb-6">

        <div
          className={`p-4 rounded-xl ${
            isDark ? "bg-[#1c1c1c]" : "bg-neutral-100"
          }`}
        >
          <Package size={22} />
        </div>

        <span className="text-sm opacity-50">4</span>

      </div>

      <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
        Delivered to You
      </h3>

      <p className={`${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
        Framed and packed securely, shipped right to your doorstep.
      </p>

    </div>

  </div>

</div>


  
  
       <Testimonials isDark={isDark} />

       <RecentSketches isDark={isDark} />


<ArtStyles isDark={isDark} />


{/* OUR PROMISE */}
<div className="mt-32 flex justify-center">

  <div
    className={`max-w-4xl w-full rounded-3xl border px-12 py-16 text-center ${
      isDark
        ? "bg-black border-neutral-800"
        : "bg-white border-neutral-300 shadow-md"
    }`}
  >

    {/* Icon */}
    <div className="flex justify-center mb-6">
      <Heart
        size={36}
        className={isDark ? "text-white" : "text-black"}
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
      className={`max-w-2xl mx-auto text-lg italic leading-8 ${
        isDark ? "text-neutral-300" : "text-neutral-700"
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

      <Link to = "/order" style={{ textDecoration: "none" }}>
              <button
                className={`px-6 py-2 text-[14px] rounded-xl transition cursor-pointer ${
                  isDark
                    ? "bg-white text-black"
                    : "bg-black text-white hover:bg-neutral-900"
                }`}
              >
                Start your Order
              </button>
              </Link>

      <Link to="/about">
                <button
                  className={`px-6 py-2 text-[13px] rounded-xl border bg-[#1c1c1c] transition cursor-pointer ${
                isDark
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