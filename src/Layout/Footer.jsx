import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import { Instagram, Linkedin, Facebook, CheckCircle } from "griddy-icons";
import instagram from "../assets/instagram_dark.png";
import facebook from "../assets/facebook_dark.png";
import linkedin from "../assets/linkedin_dark.png";



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
      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="flex flex-col md:flex-row gap-10 md:gap-30">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              
              <span
                className={`text-[25px] font-semibold ${
                  isDark ? "text-white" : "text-black"
                }`} style={{fontFamily: "Bricolage Grotesque, sans-serif"}}
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
  {[
    {
      LightIcon: Instagram,
      darkImg: instagram,
      alt: "Instagram",
    },
    {
      LightIcon: Facebook,
      darkImg: facebook,
      alt: "Facebook",
    },
    {
      LightIcon: Linkedin,
      darkImg: linkedin,
      alt: "LinkedIn",
    },
    
  ].map((item, i) => {
    const LightIcon = item.LightIcon;

    return isDark ? (
      <img
        key={i}
        src={item.darkImg}
        alt={item.alt}
        className="w-5 h-5 cursor-pointer transition hover:scale-110 "
      />
    ) : (
      <LightIcon
        key={i}
        size={24}
        className="text-black transition cursor-pointer hover:scale-110 hover:text-neutral-700"
      />
    );
  })}
</div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-medium mb-3 text-[17px]" style={{fontFamily: "Bricolage Grotesque, sans-serif"}}>
              Quick Links
            </h4>
            <ul className={`space-y-3 text-[13px] ${
              isDark ? "text-neutral-400" : "text-neutral-600"
            }`}>
              <li><Link to="/" className={`space-y-2 text-sm ${ isDark ? "text-neutral-400 hover:text-white" : "text-neutral-600 hover:text-black"}`}>Home</Link></li>
              <li><Link to="/gallery" className={`space-y-2 text-sm ${ isDark ? "text-neutral-400 hover:text-white" : "text-neutral-600 hover:text-black"}`}>Gallery</Link></li>
              <li><Link to="/order" className={`space-y-2 text-sm ${ isDark ? "text-neutral-400 hover:text-white" : "text-neutral-600 hover:text-black"}`}>Order Now</Link></li>
              <li><Link to="/about" className={`space-y-2 text-sm ${ isDark ? "text-neutral-400 hover:text-white" : "text-neutral-600 hover:text-black"}`}>About Artist</Link></li>
            </ul>
          </div>


          <div>
            <h4 className="font-medium mb-3 text-[17px]"  style={{fontFamily: "Bricolage Grotesque, sans-serif"}} >
              Policies
            </h4>
            <ul className={`space-y-3 text-[13px] ${
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
  <h4 className="font-medium mb-4 text-[17px]" style={{fontFamily: "Bricolage Grotesque, sans-serif"}}  >
    Contact
  </h4>

  <div className={`space-y-3 text-sm ${
    isDark ? "text-neutral-400" : "text-neutral-600"
  }`}>

    <div className="flex items-center gap-3">
      <Mail size={16} />
      <span>artistic.official12@gmail.com</span>
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

  {/* Message Card */}
  <div
    className={`mt-5 rounded-xl border p-4 flex gap-2 ${
      isDark
        ? "bg-[#141414] border-neutral-700 text-white"
        : "bg-neutral-200 border-gray-300 text-black"
    }`}
  >
    <CheckCircle className="text-green-500 mt-[2px]" size={19} />

    <div>
      <p className="font-medium text-sm">Response Time</p>

      <p className={`text-xs mt-1 ${
        isDark ? "text-neutral-400" : "text-neutral-600"
      }`}>
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
          <p className="mt-2 md:mt-0">Made with ♥ Akhil</p>
        </div>

      </div>
    </footer>
  );
}