import { NavLink, useLocation } from "react-router-dom";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function PolicyNavbar({ darkPolicy, setDarkPolicy }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const toggleTheme = () => {
    const newTheme = !darkPolicy;
    setDarkPolicy(newTheme);
    localStorage.setItem("policyTheme", newTheme ? "dark" : "light");
  };

  // Nav link styling (NO underline here)
  const navClass = ({ isActive }) =>
    `
    block px-4 py-2 text-[14px] transition-colors duration-200
    ${
      isActive
        ? "text-white"
        : "text-[#d1d1d1] hover:text-white"
    }
  `;

  return (
    <div
      className="sticky top-0 z-40 w-full  bg-[#0f0f0f]  shadow-md"
      style={{ fontFamily: "Inter, serif" }}
    >
      {/* TOP BAR */}
      <div className="w-full px-4 md:px-10 py-2 flex items-center">
        
        {/* LOGO */}
        <NavLink
          to="/"
          className="text-[20px] text-white mr-auto"
          onClick={() => setOpen(false)}
        >
          artistic
        </NavLink>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-6">

          <NavLink to="/terms" className={navClass}>
            {({ isActive }) => (
              <span className="relative inline-block">
                Terms
                {isActive && (
                  <span className="absolute left-0 -bottom-2 w-full h-[2px] bg-white" />
                )}
              </span>
            )}
          </NavLink>

          <NavLink to="/privacy-policy" className={navClass}>
            {({ isActive }) => (
              <span className="relative inline-block">
                Privacy
                {isActive && (
                  <span className="absolute left-0 -bottom-2 w-full h-[2px] bg-white" />
                )}
              </span>
            )}
          </NavLink>

          <NavLink to="/refund-policy" className={navClass}>
            {({ isActive }) => (
              <span className="relative inline-block">
                Refund
                {isActive && (
                  <span className="absolute left-0 -bottom-2 w-full h-[2px] bg-white" />
                )}
              </span>
            )}
          </NavLink>

          <NavLink to="/cancellation-policy" className={navClass}>
            {({ isActive }) => (
              <span className="relative inline-block">
                Cancellation
                {isActive && (
                  <span className="absolute left-0 -bottom-2 w-full h-[2px] bg-white" />
                )}
              </span>
            )}
          </NavLink>

          <button
            onClick={toggleTheme}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1f1f1f] text-white hover:bg-[#2a2a2a] transition"
            aria-label="Toggle theme"
          >
            {darkPolicy ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* MOBILE BUTTONS */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-[#1f1f1f] text-white transition"
            aria-label="Toggle theme"
          >
            {darkPolicy ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            onClick={() => setOpen(!open)}
            className="text-white cursor-pointer focus:outline-none"
            aria-label="Toggle menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden px-4 pb-4 space-y-2 bg-[#0f0f0f] border-t border-white/10 ">
          
          <NavLink to="/terms" className={navClass}>
            {({ isActive }) => (
              <span className="relative inline-block mt-2">
                Terms
                {isActive && (
                  <span className=" w-full h-[2px] bg-white" />
                )}
              </span>
            )}
          </NavLink>

          <NavLink to="/privacy-policy" className={navClass}>
            {({ isActive }) => (
              <span className="relative inline-block">
                Privacy
                {isActive && (
                  <span className=" w-full h-[2px] bg-white" />
                )}
              </span>
            )}
          </NavLink>

          <NavLink to="/refund-policy" className={navClass}>
            {({ isActive }) => (
              <span className="relative inline-block">
                Refund
                {isActive && (
                  <span className=" w-full h-[2px] bg-white" />
                )}
              </span>
            )}
          </NavLink>

          <NavLink to="/cancellation-policy" className={navClass}>
            {({ isActive }) => (
              <span className="relative inline-block">
                Cancellation
                {isActive && (
                  <span className=" w-full h-[2px] bg-white" />
                )}
              </span>
            )}
          </NavLink>

        </div>
      )}
    </div>
  );
}