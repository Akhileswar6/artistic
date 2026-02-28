import { NavLink, useLocation } from "react-router-dom";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function PolicyNavbar({ isDark, setIsDark }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const navClass = ({ isActive }) =>
    `px-3 py-2 text-[13px] rounded-sm transition-all duration-200 ${
      isActive
        ? "bg-neutral-800 text-white dark:bg-white dark:text-black"
        : "text-neutral-600 hover:text-black hover:bg-neutral-200 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-800"
    }`;

  return (
    <div
      className="sticky top-0 z-40 w-full shadow-md transition-colors duration-300
                 bg-white border-b border-neutral-300
                 dark:bg-[#0f0f0f] dark:border-neutral-800"
      style={{ fontFamily: "Inter, serif" }}
    >
      {/* TOP BAR */}
      <div className="w-full md:px-8 px-4 py-2 flex items-center">

        {/* LOGO */}
        <NavLink
          to="/"
          className="text-[22px] mr-auto text-black dark:text-white"
          style={{ fontFamily: "Playfair Display, serif" }}
          onClick={() => setOpen(false)}
        >
          artistic
        </NavLink>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-3">

          <NavLink to="/terms" className={navClass}>
            Terms of Service
          </NavLink>

          <NavLink to="/privacy-policy" className={navClass}>
            Privacy Policy
          </NavLink>

          <NavLink to="/refund-policy" className={navClass}>
            Refund Policy
          </NavLink>

          <NavLink to="/cancellation-policy" className={navClass}>
            Cancellation Policy
          </NavLink>

          {/* THEME TOGGLE */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-1.5 rounded-full border transition-all duration-300
                       border-neutral-400 bg-neutral-200 text-black hover:bg-neutral-300
                       dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* MOBILE BUTTONS */}
        <div className="flex md:hidden items-center gap-3">

          <button
            onClick={() => setIsDark(!isDark)}
            className="p-1.5 rounded-full border transition-all duration-300
                       border-neutral-400 bg-neutral-200 text-black hover:bg-neutral-300
                       dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            onClick={() => setOpen(!open)}
            className="text-black dark:text-white"
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div
          className="md:hidden px-4 pb-4 space-y-2 border-t pt-4 transition-colors duration-300
                     bg-white border-neutral-300
                     dark:bg-[#0f0f0f] dark:border-neutral-800"
        >
          <NavLink to="/terms" className={navClass}>
            Terms of Service
          </NavLink>

          <NavLink to="/privacy-policy" className={navClass}>
            Privacy Policy
          </NavLink>

          <NavLink to="/refund-policy" className={navClass}>
            Refund Policy
          </NavLink>

          <NavLink to="/cancellation-policy" className={navClass}>
            Cancellation Policy
          </NavLink>
        </div>
      )}
    </div>
  );
}