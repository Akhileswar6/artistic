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



  const navClass = ({ isActive }) =>
  `
  px-3 py-2 text-[13px] rounded-sm transition-all duration-200
  ${
    isActive
      ? "bg-neutral-800 text-white"
      : "text-[#d1d1d1] hover:text-white hover:bg-neutral-900"
  }
`;

  return (
    <div
      className="sticky top-0 z-40 w-full  bg-[#0f0f0f]  shadow-md"
      style={{ fontFamily: "Inter, serif" }}
    >
      {/* TOP BAR */}
      <div className="w-full md:px-8   px-4 py-2 flex items-center">
        
        {/* LOGO */}
        <NavLink
          to="/"
          className="text-[22px] text-white mr-auto" style={{ fontFamily: "Playfair Display, serif" }}
          onClick={() => setOpen(false)}
        >
          artistic
        </NavLink>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-3">

          <NavLink to="/terms" className={navClass}>
            {({ isActive }) => (
              <span className="relative inline-block">
                Terms of Service
                {isActive && (
                  <span className=" w-full h-[2px] bg-white" />
                )}
              </span>
            )}
          </NavLink>

          <NavLink to="/privacy-policy" className={navClass}>
            {({ isActive }) => (
              <span className="relative inline-block">
                Privacy Policy
                {isActive && (
                  <span className=" w-full h-[2px] bg-white" />
                )}
              </span>
            )}
          </NavLink>

          <NavLink to="/refund-policy" className={navClass}>
            {({ isActive }) => (
              <span className="relative inline-block">
                Refund Policy
                {isActive && (
                  <span className=" w-full h-[2px] bg-white" />
                )}
              </span>
            )}
          </NavLink>

          <NavLink to="/cancellation-policy" className={navClass}>
            {({ isActive }) => (
              <span className=" relative inline-block">
                Cancellation Policy
                {isActive && (
                  <span className=" w-full h-[2px] bg-white" />
                )}
              </span>
            )}
          </NavLink>

          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-full border 
                 border-neutral-400 dark:border-neutral-700
                 bg-neutral-200 dark:bg-neutral-800
                 text-black dark:text-white
                 cursor-pointer hover:bg-neutral-800 dark:hover:bg-neutral-700
                 rounded-full transition-all duration-300"
            aria-label="Toggle theme"
          >
            {darkPolicy ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* MOBILE BUTTONS */}
        <div className="flex md:hidden items-center gap-3">


          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-full border 
                 border-neutral-400 dark:border-neutral-700
                 bg-neutral-200 dark:bg-neutral-800
                 text-black dark:text-white
                  hover:bg-neutral-300 dark:hover:bg-neutral-700
                 transition-all duration-300 cursor-pointer"
            aria-label="Toggle theme"
          >
            {darkPolicy ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            onClick={() => setOpen(!open)}
            className="text-white cursor-pointer focus:outline-none "
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden  px-4 pb-4 space-y-2 bg-[#0f0f0f] border-t border-white/10  flex flex-col items-start pt-4">

          
          
          <NavLink to="/terms" className={navClass}>
            {({ isActive }) => (
              <span className="relative inline-block ">
                Terms of Service
                {isActive && (
                  <span className=" w-full h-[2px] bg-white" />
                )}
              </span>
            )}
          </NavLink>

          <NavLink to="/privacy-policy" className={navClass}>
            {({ isActive }) => (
              <span className="relative inline-block">
                Privacy Policy
                {isActive && (
                  <span className=" w-full h-[2px] bg-white" />
                )}
              </span>
            )}
          </NavLink>

          <NavLink to="/refund-policy" className={navClass}>
            {({ isActive }) => (
              <span className="relative inline-block">
                Refund Policy
                {isActive && (
                  <span className=" w-full h-[2px] bg-white" />
                )}
              </span>
            )}
          </NavLink>

          <NavLink to="/cancellation-policy" className={navClass}>
            {({ isActive }) => (
              <span className="relative inline-block">
                Cancellation Policy
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