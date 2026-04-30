import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { Instagram, Linkedin, Facebook, CheckCircle } from "griddy-icons";
import instagram from "../assets/instagram_dark.png";
import facebook from "../assets/facebook_dark.png";
import linkedin from "../assets/linkedin_dark.png";
import logo from "../assets/logo.png";



export default function Footer({ isDark }) {
  return (
    <footer
      className={`w-full border-t transition-colors duration-300 ${
        isDark
          ? "bg-black text-white border-neutral-800"
          : "bg-white text-black border-neutral-300"
      }`}
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Link to="/">
                <img
                  src={logo}
                  alt="artistic"
                  className="h-10 w-auto object-contain"
                />
              </Link>
            </div>
            <p className={`text-[15px] leading-relaxed max-w-xs ${
              isDark ? "text-neutral-400" : "text-neutral-500"
            }`}>
              Where every sketch breathes.
            </p>
            <div className="flex items-center gap-4 mt-4">
              {[
                {
                  LightIcon: Instagram,
                  darkImg: instagram,
                  alt: "Instagram",
                  link: "https://www.instagram.com/linesbyakhileswar"
                },
                {
                  LightIcon: Facebook,
                  darkImg: facebook,
                  alt: "Facebook",
                  link: "https://www.facebook.com/akhil.kamale.1/directory_names"
                },
                {
                  LightIcon: Linkedin,
                  darkImg: linkedin,
                  alt: "LinkedIn",
                  link: "https://www.linkedin.com/in/akhileswar-kamale/"
                },
              ].map((item, i) => {
                const LightIcon = item.LightIcon;
                return (
                  <motion.a
                    key={i}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -3, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-2 rounded-xl transition-all ${isDark ? "bg-white/5 hover:bg-white/10" : "bg-black/5 hover:bg-black/10"}`}
                  >
                    {isDark ? (
                      <img src={item.darkImg} alt={item.alt} className="w-5 h-5" />
                    ) : (
                      <LightIcon size={22} className="text-black" />
                    )}
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Links */}
          <div className="lg:ml-10">
            <h4 className="font-bold mb-4 text-[18px] tracking-tight" style={{fontFamily: "Bricolage Grotesque, sans-serif"}}>
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Home", to: "/" },
                { label: "Gallery", to: "/gallery" },
                { label: "Order Now", to: "/order" },
                { label: "About Artist", to: "/about" }
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className={`text-[14px] transition-colors duration-300 ${isDark ? "text-neutral-400 hover:text-white" : "text-neutral-500 hover:text-black"}`}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div className="lg:ml-5">
            <h4 className="font-bold mb-4 text-[18px] tracking-tight" style={{fontFamily: "Bricolage Grotesque, sans-serif"}}>
              Policies
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Terms of Service", to: "/terms" },
                { label: "Privacy Policy", to: "/privacy-policy" },
                { label: "Refund Policy", to: "/refund-policy" },
                { label: "Cancellation Policy", to: "/cancellation-policy" }
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className={`text-[14px] transition-colors duration-300 ${isDark ? "text-neutral-400 hover:text-white" : "text-neutral-500 hover:text-black"}`}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4 text-[18px] tracking-tight" style={{fontFamily: "Bricolage Grotesque, sans-serif"}}>
              Contact
            </h4>
            <div className={`space-y-3 text-[14px] ${isDark ? "text-neutral-400" : "text-neutral-500"}`}>
              <div className="flex items-center gap-3 group cursor-pointer hover:text-blue-500 transition-colors">
                <div className={`p-2 rounded-lg ${isDark ? "bg-white/5" : "bg-black/5"}`}>
                  <Mail size={16} />
                </div>
                <span>artistic.official12@gmail.com</span>
              </div>
              <div className="flex items-center gap-3 group cursor-pointer hover:text-green-500 transition-colors">
                <div className={`p-2 rounded-lg ${isDark ? "bg-white/5" : "bg-black/5"}`}>
                  <Phone size={16} />
                </div>
                <span>+91 9392822250</span>
              </div>
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${isDark ? "bg-white/5" : "bg-black/5"}`}>
                  <MapPin size={16} />
                </div>
                <span className="leading-relaxed">Adoni, Andhra Pradesh, India</span>
              </div>
            </div>

            {/* Message Card */}
            <div className={`mt-8 rounded-2xl border p-5 flex gap-4 transition-all hover:shadow-lg ${
              isDark ? "bg-[#141414]/50 border-white/5 hover:bg-[#141414]" : "bg-neutral-50 border-black/5 hover:bg-neutral-100 shadow-lg"
            }`}>
              <div className="mt-1">
                <CheckCircle className="text-green-500" size={18} />
              </div>
              <div>
                <p className={` text-[13px] ${isDark ? "text-white" : "text-black"}`}>Response Time</p>
                <p className={`text-[12px] mt-1.5 leading-relaxed opacity-80 ${isDark ? "text-neutral-400" : "text-neutral-500"}`}>
                  Orders are reviewed within 24 hours. You'll be notified via your dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className={`border-t mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-sm ${
          isDark
            ? "border-neutral-800 text-neutral-500"
            : "border-neutral-300 text-neutral-600"
        }`}>
          <p>© {new Date().getFullYear()} artistic. All rights reserved.</p>
          <p className="mt-2 md:mt-0 flex items-center gap-1.5">
            Made with <img src={isDark ? "/white.png" : "/black.png"} alt="heart" className="w-4 h-4 object-contain" /> Akhil
          </p>
        </div>

      </div>
    </footer>
  );
}