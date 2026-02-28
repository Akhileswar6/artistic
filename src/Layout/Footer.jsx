import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import { Instagram, Github, Linkedin, Facebook } from "griddy-icons";

export default function Footer({ isDark }) {
  return (
    <footer
      className={`w-full border-t transition-colors duration-300 ${
        isDark
          ? "bg-[#0f1115] text-white border-neutral-800"
          : "bg-white text-black border-neutral-300"
      }`}
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="flex flex-col md:flex-row gap-10 md:gap-24">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              
              <span
                className={`text-[25px] font-semibold ${
                  isDark ? "text-white" : "text-black"
                }`} style={{ fontFamily:"Playfair Display, serif"}}
              >
                artistic
              </span>
            </div>

            <p className={`text-sm max-w-xs ${
              isDark ? "text-neutral-400" : "text-neutral-600"
            }`}>
              Every Sketch Breathes.
            </p>

            <div className="flex items-center gap-4 mt-4">
              {[Instagram, Facebook, Linkedin, Github].map((Icon, i) => (
                <Icon
                  key={i}
                  size={24}
                  className={`transition cursor-pointer ${
                    isDark
                      ? "text-neutral-400 hover:text-white"
                      : "text-neutral-600 hover:text-black"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-medium mb-3">
              Quick Links
            </h4>
            <ul className={`space-y-2 text-sm ${
              isDark ? "text-neutral-400" : "text-neutral-600"
            }`}>
              <li><Link to="/" className={`space-y-2 text-sm ${ isDark ? "text-neutral-400 hover:text-white" : "text-neutral-600 hover:text-black"}`}>Home</Link></li>
              <li><Link to="/gallery" className={`space-y-2 text-sm ${ isDark ? "text-neutral-400 hover:text-white" : "text-neutral-600 hover:text-black"}`}>Gallery</Link></li>
              <li><Link to="/order" className={`space-y-2 text-sm ${ isDark ? "text-neutral-400 hover:text-white" : "text-neutral-600 hover:text-black"}`}>Order</Link></li>
              <li><Link to="/about" className={`space-y-2 text-sm ${ isDark ? "text-neutral-400 hover:text-white" : "text-neutral-600 hover:text-black"}`}>About</Link></li>
              <li><Link to="/contact" className={`space-y-2 text-sm ${ isDark ? "text-neutral-400 hover:text-white" : "text-neutral-600 hover:text-black"}`}>Contact</Link></li>
            </ul>
          </div>


          <div>
            <h4 className="font-medium mb-3">
              Policies
            </h4>
            <ul className={`space-y-2 text-sm ${
              isDark ? "text-neutral-400" : "text-neutral-600"
            }`}>
              <li><Link to="/terms" className={`space-y-2 text-sm ${ isDark ? "text-neutral-400 hover:text-white" : "text-neutral-600 hover:text-black"}`}>Terms of Service</Link></li>
              <li><Link to="/privacy-policy" className={`space-y-2 text-sm ${ isDark ? "text-neutral-400 hover:text-white" : "text-neutral-600 hover:text-black"}`}>Privacy Policy</Link></li>
              <li><Link to="/refund-policy" className={`space-y-2 text-sm ${ isDark ? "text-neutral-400 hover:text-white" : "text-neutral-600 hover:text-black"}`}>Refund Policy</Link></li>
              <li><Link to="/cancellation-policy" className={`space-y-2 text-sm ${ isDark ? "text-neutral-400 hover:text-white" : "text-neutral-600 hover:text-black"}`}>Cancellation Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-medium mb-4">
              Contact
            </h4>
            <div className={`space-y-3 text-sm ${
              isDark ? "text-neutral-400" : "text-neutral-600"
            }`}>
              <div className="flex items-center gap-3">
                <Mail size={16} />
                <span>akhilkamale@gmail.com</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={16} />
                <span>+91 12345 67890</span>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={16} className="mt-[2px]" />
                <span>Adoni, Andhra Pradesh, India</span>
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
          <p className="mt-2 md:mt-0">Made with ♥ Akhil</p>
        </div>

      </div>
    </footer>
  );
}