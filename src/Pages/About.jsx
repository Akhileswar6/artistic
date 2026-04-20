import { Heart, Award, Star, Clock, MapPin, CheckCircle, Palette, Sparkles, User, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import akhil from "../assets/Akhil.JPG";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function About({ isDark }) {
  return (
    <div
      className={`min-h-screen transition-colors duration-500  ${isDark ? "bg-[#0a0a0b] text-white" : "bg-[#f8f9fa] text-black"
        }`}
      style={{ fontFamily: "Inter, sans-serif" }}
    >

      <div className="max-w-6xl mx-auto px-6 pt-12 pb-16 relative z-10">

        {/* Hero Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-[380px_1fr] gap-12 items-center"
        >
          {/* Artist Image with Glass Effect */}
          <motion.div variants={itemVariants} className="relative group">
            <div className={`absolute -inset-4 rounded-lg blur-2xl opacity-20 transition-opacity`} />
            <div className={`relative rounded-xl overflow-hidden shadow-2xl border ${isDark ? "border-white/10" : "border-black/5"}`}>
              <img
                src={akhil}
                alt="Akhileswar Kamale"
                loading="eager"
                className="w-full h-[450px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </motion.div>

          {/* Artist Content */}
          <motion.div variants={itemVariants} className="flex flex-col">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-10 h-[1px] bg-orange-500" />
              <span className={`text-[12px] uppercase tracking-widest ${isDark ? "text-orange-500" : "text-orange-600"}`}>
                The Artist Behind the Canvas
              </span>
            </div>

            <h1
              className="text-3xl md:text-4xl font-bold leading-[1.1] mb-6"
              style={{ fontFamily: "Bricolage Grotesque" }}
            >
              Akhileswar <br />
              <span className={isDark ? "text-white/40" : "text-black/40"}>Kamale</span>
            </h1>

            <div className={`text-[15px] mb-8 font-medium ${isDark ? "text-white/80" : "text-black/80"}`}>
              Founder & Master Sketch Artist · <span className="text-orange-500">6+ Years</span> Professional Excellence
            </div>

            <div className={`space-y-6 text-[15px] leading-relaxed mb-10 ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
              <p>
                My journey began with a simple pencil and a piece of paper, fueled by a relentless drive to capture the complexity of human emotion. Over the last eight years, this passion has evolved into <strong className={isDark ? "text-white" : "text-black"}>Artistic</strong>, a dedicated studio where we transform cherished memories into timeless physical masterpieces.
              </p>
              <p>
                Specializing in hyper-realistic pencil sketches, charcoal portraits, and vibrant watercolors, I believe that a portrait is more than just a representation—it's a soulful narrative that preserves a moment forever. Each stroke is deliberate, each detail is intentional.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link to="/order">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-5 py-2.5 rounded-lg text-sm transition-all ${isDark
                    ? "bg-white text-black hover:bg-neutral-200"
                    : "bg-black text-white hover:bg-neutral-800"
                    }`}
                >
                  Commission an Artwork
                </motion.button>
              </Link>
              <Link to="/gallery">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-5 py-2.5 rounded-lg text-sm  border transition-all ${isDark
                    ? "border-white/10 text-white hover:bg-white/5"
                    : "border-black/10 text-black hover:bg-black/5"
                    }`}
                >
                  View My Portfolio
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </motion.div>



        {/* Philosophy Block */}
        <div className="mt-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2
              className="text-3xl md:text-4xl text-neutral-400 font-bold mb-4"
              style={{ fontFamily: "Bricolage Grotesque" }}
            >
              Our Philosophy of <span className="text-white">Excellence</span>
            </h2>
            <p className={`max-w-2xl mx-auto text-[14px] ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
              We don't just sketch, we breathe life into paper. Our core principles ensure that every client receives a piece of art that they can cherish for generations.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Heart,
                color: "text-pink-500",
                title: "Made with Soul",
                desc: "Each artwork is approached as a unique emotional journey. We invest hours in capturing the subtle nuances that make your subject special."
              },
              {
                icon: Award,
                color: "text-orange-500",
                title: "Premium Standards",
                desc: "Using only the finest archival-grade papers and professional mediums to ensure your artwork remains vibrant and pristine for a lifetime."
              },
              {
                icon: Sparkles,
                color: "text-blue-500",
                title: "Client Centric",
                desc: "Your satisfaction is our ultimate metric. We provide high-res previews and unlimited minor revisions until the piece is perfect."
              }
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className={`p-8 rounded-xl border transition-all duration-500 ${isDark
                  ? "bg-[#141416] border-white/5 hover:border-white/20"
                  : "bg-white border-black/5 shadow-lg shadow-black/[0.03] hover:shadow-black/[0.1]"
                  }`}
              >
                <div className={`mb-5 p-3 rounded-lg inline-block ${isDark ? "bg-white/5" : "bg-black/5"}`}>
                  <card.icon size={24} className={card.color} />
                </div>
                <h3
                  className="text-xl mb-3"
                  style={{ fontFamily: "Bricolage Grotesque" }}
                >
                  {card.title}
                </h3>
                <p className={`text-[13px] leading-relaxed ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                  {card.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>



      </div>
    </div>
  );
}