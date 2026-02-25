import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import { Instagram, Github, Linkedin, Facebook } from "griddy-icons";

export default function Footer() {
  return (
    <footer className="w-full mt-16 
                       border-t border-neutral-300 dark:border-neutral-800 
                       bg-gray-100 dark:bg-[#0f1115] 
                       transition-colors duration-300" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Top Section */}
<div className="flex flex-col md:flex-row gap-6 md:gap-30">        
    {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-neutral-400 dark:bg-neutral-300" />
              <span className="text-lg font-semibold text-black dark:text-white">

                artistic
              </span>

           </div>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm max-w-xs">
              Every Sketch Breathes.
            </p>
            <div className="flex items-center gap-4 mt-3">
            <Instagram size={25} className="text-neutral-600 dark:text-neutral-400 hover:text-white transition cursor-pointer stroke:white" />
            <Facebook size={25} className="text-neutral-600 dark:text-neutral-400 hover:text-white transition cursor-pointer" />
            <Linkedin size={25} className="text-neutral-600 dark:text-neutral-400 hover:text-white transition cursor-pointer" />
            <Github size={25} className="text-neutral-600 dark:text-neutral-400 hover:text-white transition cursor-pointer" />
          </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-black dark:text-white font-medium mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li><Link to="/gallery" className="hover:text-white">Gallery</Link></li>
              <li><Link to="/order" className="hover:text-white">Order Now</Link></li>
              <li><Link to="/about" className="hover:text-white">About</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-black dark:text-white font-medium mb-3">
              Policies
            </h4>
            <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/refund-policy" className="hover:text-white">Refund Policy</Link></li>
              <li><Link to="/cancellation-policy" className="hover:text-white">Cancellation Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
         <div>
  <h4 className="text-black dark:text-white font-medium mb-4">
    Contact Us
  </h4>

  <div className="space-y-3 text-sm text-neutral-600 dark:text-neutral-400">

    <div className="flex items-center gap-3">
      <Mail size={16} className="shrink-0" />
      <span>akhilkamale@gmail.com</span>
    </div>

    <div className="flex items-center gap-3">
      <Phone size={16} className="shrink-0" />
      <span>+91 12345 67890</span>
    </div>

    <div className="flex items-start gap-3">
      <MapPin size={16} className="shrink-0 mt-[2px]" />
      <span>Adoni, Andhra Pradesh, India</span>
    </div>

  </div>
</div>

        </div>

        {/* Bottom Section */}
        <div className="border-t border-neutral-300 flex justify-between items-center dark:border-neutral-800 
                        mt-10 pt-6  text-sm 
                        text-neutral-600 dark:text-neutral-500 
                        transition-colors duration-300">
          © {new Date().getFullYear()} artistic. All rights reserved.

          <p>Made with ♥ Akhil</p>
        </div>

      </div>
    </footer>
  );
}