import { Heart, Award, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import akhil from "../assets/Akhil.JPG";

export default function About({ isDark }) {
  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-black text-white" : "bg-white text-black"
      }`}
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-15">

<motion.div
  initial={{ opacity: 0, y: 80 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.7 }}
  className="grid md:grid-cols-[420px_1fr] gap-14 items-center"
>
          <div className="relative flex justify-center md:justify-start">

              <img
                src={akhil}
                
                alt="artist"
                className="rounded-xl w-[360px] h-[400px] md:w-[420px] object-cover shadow-lg"
              />

          </div>

          {/* Artist Details */}
          <div>

            <span
              className={`text-xs px-3 py-1 rounded-full border ${
                isDark ? "border-neutral-700" : "border-neutral-300"
              }`}
            >
              Meet the Artist
            </span>

            <h1
              className="text-4xl font-semibold mt-4"
              style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
            >
              Akhileswar Sahoo
            </h1>

            <p className="mt-2 text-lg">
              Professional Sketch Artist · 8+ Years Experience
            </p>

            <p
              className={`mt-6 leading-7 ${
                isDark ? "text-neutral-400" : "text-neutral-600"
              }`}
            >
              I am a passionate sketch artist with over 8 years of experience
              creating hand-drawn portraits and artworks. My work spans pencil,
              charcoal, watercolor, and digital mediums. Each piece I create
              is crafted with love and dedication, ensuring every stroke tells
              a story.
            </p>

            {/* Buttons */}
            <div className="flex gap-4 mt-8">
              
              <Link to = "/order" style={{ textDecoration: "none" }}>
              <button
                className={`px-5 py-1.5 text-[14px] rounded-full transition cursor-pointer ${
                  isDark
                    ? "bg-white text-black"
                    : "bg-black text-white hover:bg-neutral-900"
                }`}
              >
                Order a Sketch
              </button>
              </Link>

              <Link to="/contact" style={{ textDecoration: "none" }}>
              <button
                className={`px-5 py-1.5 text-[14px] rounded-full border transition cursor-pointer ${
                  isDark
                    ? "bg-[#1c1c1c] text-white border-neutral-700 hover:bg-neutral-900"
                    : "border-neutral-300 text-black shadow-md "
                }`}
              >
                Contact Me
              </button>
              </Link> 
              

            </div>

          </div>
          

        </motion.div>
        {/* My Philosophy */}
<motion.div
  initial={{ opacity: 0, y: 80 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.7 }}
  className="mt-24"
>
  <h2
    className="text-center text-4xl font-semibold mb-16"
    style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
  >
    My Philosophy
  </h2>

  <div className="grid md:grid-cols-3 gap-8">

    {/* Card 1 */}
  <div
  className={`rounded-2xl border p-8 text-center transition-transform duration-300 hover:scale-102 ${
    isDark
      ? "border-neutral-700 bg-neutral-900"
      : "border-neutral-300 shadow-lg"
  }`}
>
  <div className="flex justify-center mb-4">
    <div className="p-3 rounded-xl">
      <Heart className="text-pink-500" size={26} />
    </div>
  </div>

  <h3
    className="text-xl font-semibold mb-3"
    style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
  >
    Made with Love
  </h3>

  <p
    className={`${
      isDark ? "text-neutral-400" : "text-neutral-600"
    } leading-7 text-[15px]`}
  >
    Each artwork is crafted individually with full attention and
    emotional investment. No templates, no shortcuts.
  </p>
</div>

    {/* Card 2 */}
     <div
  className={`rounded-2xl border p-8 text-center transition-transform duration-300 hover:scale-102 ${
    isDark
      ? "border-neutral-700 bg-neutral-900"
      : "border-neutral-300 shadow-lg"
  }`}
>
      <div className="flex justify-center mb-4">
        <div className="p-3 rounded-xl">
          <Award className="text-yellow-600" size={26} />
        </div>
      </div>

      <h3
        className="text-xl font-semibold mb-3"
        style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
      >
        Quality First
      </h3>

      <p className={`${isDark ? "text-neutral-400" : "text-neutral-600"} leading-7 text-[15px]`}>
        I only use premium art supplies. Each piece goes through
        multiple revision rounds before delivery.
      </p>
    </div>

    {/* Card 3 */}
      <div
  className={`rounded-2xl border p-8 text-center transition-transform duration-300 hover:scale-102 ${
    isDark
      ? "border-neutral-700 bg-neutral-900"
      : "border-neutral-300 shadow-lg"
  }`}
>
      <div className="flex justify-center mb-4">
        <div className="p-3 rounded-xl">
          <Star className="text-orange-600" size={26} />
        </div>
      </div>

      <h3
        className="text-xl font-semibold mb-3"
        style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
      >
        Customer Satisfaction
      </h3>

      <p className={`${isDark ? "text-neutral-400" : "text-neutral-600"} leading-7 text-[15px]`}>
        "Customer satisfaction is more important than commercialization."
        This is the guiding principle of my work.
      </p>
    </div>
    
</div>
  </motion.div>



      </div>
    </div>
  );
}