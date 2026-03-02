import { NavLink, useLocation, Outlet } from "react-router-dom";
import { Sun, Moon, Menu, X, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";

export default function PolicyNavbar({ isDark, setIsDark }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const navClass = ({ isActive }) =>
    `px-3 py-2 text-[13px] rounded-sm transition-all duration-200 ${
      isActive
        ? isDark
          ? "bg-white text-black"
          : "bg-neutral-800 text-white"
        : isDark
          ? "text-neutral-400 hover:text-white hover:bg-neutral-800"
          : "text-neutral-600 hover:text-black hover:bg-neutral-200"
    }`;

    const mobileNavClass = ({ isActive }) =>
  `px-3 py-2 text-[14px] transition-colors duration-200 ${
    isActive
      ? isDark
        ? "text-white"
        : "text-black"
      : isDark
        ? "text-neutral-400 hover:text-white"
        : "text-neutral-600 hover:text-black"
  }`;

  return (
    <>
      {/* NAVBAR CONTAINER */}
      <div
        className={`sticky top-0 z-40 w-full shadow-md border-b transition-colors duration-300 ${
          isDark
            ? "bg-[#0f0f0f] border-neutral-800"
            : "bg-white border-neutral-300"
        }`}
        style={{ fontFamily: "Inter, serif" }}
      >
        {/* TOP BAR */}
        <div className="w-full px-4 py-3 flex items-center justify-between md:px-8">

          {/* LEFT SIDE — MENU + LOGO */}
          <div className="flex items-center gap-3">

            <button
  onClick={() => setOpen(!open)}
  className="md:hidden"
  aria-label="Toggle menu"
>
  {open ? (
    <X size={24} className={isDark ? "text-white" : "text-black"} />
  ) : (
    <Menu size={24} className={isDark ? "text-white" : "text-black"} />
  )}
            </button>

            {/* LOGO */}
            <NavLink
              to="/"
              className={`text-[22px] ${
                isDark ? "text-white" : "text-black"
              }`}
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              artistic
            </NavLink>
          </div>

          {/* RIGHT SIDE — THEME TOGGLE (MOBILE) */}
          <button
            onClick={() => setIsDark(!isDark)}
            className={`md:hidden p-1.5 rounded-full transition-colors duration-300 ${
              isDark
                ? "text-white hover:text-neutral-300"
                : "text-black hover:text-neutral-600"
            }`}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-4">

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

            {/* DESKTOP THEME TOGGLE */}
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-1.5 rounded-full transition-colors duration-300 cursor-pointer ${
                isDark
                  ? "text-white"
                  : "text-black"
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE SIDEBAR */}
<div
  className={`fixed left-0 top-[64px] h-[calc(100%-64px)] w-[260px] z-50 transform transition-transform duration-300 ease-in-out  ${
    open ? "translate-x-0" : "-translate-x-full"
  } ${
    isDark ? "bg-[#0f0f0f]" : "bg-white"
  } border-r ${
    isDark ? "border-neutral-800" : "border-neutral-300"
  }`}
>

  
  <div className="px-6 py-6 flex flex-col space-y-4" style={{ fontFamily: "Inter, serif" }}>

    {/* Home*/}
    <NavLink to="/" className={mobileNavClass} onClick={() => setOpen(false)}>
      <ArrowLeft size={16} className="inline mr-2" />
      Home
    </NavLink>

    <NavLink to="/terms" className={mobileNavClass} onClick={() => setOpen(false)}>
      Terms of Service
    </NavLink>

    <NavLink to="/privacy-policy" className={mobileNavClass} onClick={() => setOpen(false)}>
      Privacy Policy
    </NavLink>

    <NavLink to="/refund-policy" className={mobileNavClass} onClick={() => setOpen(false)}>
      Refund Policy
    </NavLink>

    <NavLink to="/cancellation-policy" className={mobileNavClass} onClick={() => setOpen(false)}>
      Cancellation Policy
    </NavLink>


    
  </div>
</div>

      {/* OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* PAGE CONTENT */}
      <Outlet />
    </>
  );
}