import { NavLink, useLocation, Outlet } from "react-router-dom";
import { Sun, Moon, Menu, X, ArrowLeft, FileText, Shield, RotateCcw, AlertTriangle, Home } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PolicyNavbar({ isDark, setIsDark }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const navClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-1.5 text-[13px] rounded-full transition-all duration-300 font-medium ${isActive
      ? isDark
        ? "bg-white text-black shadow-lg shadow-white/5"
        : "bg-black text-white shadow-lg shadow-black/10"
      : isDark
        ? "text-neutral-400 hover:text-white hover:bg-white/5"
        : "text-neutral-600 hover:text-black hover:bg-black/5"
    }`;

  const mobileNavClass = ({ isActive }) =>
    `flex items-center gap-4 px-4 py-2 text-[14px] rounded-full transition-all duration-300 ${isActive
      ? isDark
        ? "bg-white text-black font-semibold shadow-xl shadow-white/5"
        : "bg-black text-white font-semibold shadow-lg shadow-black/10"
      : isDark
        ? "text-neutral-400 hover:bg-white/5 hover:text-white"
        : "text-neutral-600 hover:bg-black/5 hover:text-black"
    }`;

  return (
    <>
      {/* NAVBAR CONTAINER */}
      <div
        className="absolute top-0 left-0 z-50 w-full bg-transparent pt-3 md:pt-2 transition-colors duration-500"
        style={{ fontFamily: "Inter, serif" }}
      >
        {/* TOP BAR */}
        <div className="w-full px-4 py-3 md:px-6 md:py-2 flex items-center justify-between">

          {/* LEFT SIDE — MENU + LOGO */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden"
              aria-label="Toggle menu"
            >
              {open ? (
                <X size={22} className={isDark ? "text-white" : "text-black"} />
              ) : (
                <Menu size={22} className={isDark ? "text-white" : "text-black"} />
              )}
            </button>
            <NavLink to="/" className="flex items-center gap-1">
              <span className={`text-2xl font-bold tracking-tight ${isDark ? "text-white" : "text-black"}`} style={{ fontFamily: "Bricolage Grotesque" }}>
                art<span className="text-neutral-500 font-normal">istic</span>
              </span>
            </NavLink>
          </div>

          {/* RIGHT SIDE — THEME TOGGLE (MOBILE) */}
          <button
            onClick={() => setIsDark(!isDark)}
            className={`md:hidden p-1.5 rounded-full transition-colors duration-300 ${isDark
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
              Terms
            </NavLink>

            <NavLink to="/privacy-policy" className={navClass}>
              Privacy
            </NavLink>

            <NavLink to="/refund-policy" className={navClass}>
              Refund
            </NavLink>

            <NavLink to="/cancellation-policy" className={navClass}>
              Cancellation
            </NavLink>

            {/* DESKTOP THEME TOGGLE */}
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-1.5 rounded-full transition-colors duration-300 cursor-pointer ${isDark
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
        className={`fixed left-0 top-0 h-screen w-[280px] z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${open ? "translate-x-0" : "-translate-x-full"
          } ${isDark ? "bg-[#080808] text-white" : "bg-white text-black"
          } border-r ${isDark ? "border-white/5" : "border-neutral-200"
          } flex flex-col shadow-2xl`}
      >
        {/* DRAWER HEADER */}
        <div className={`p-5 border-b flex items-center justify-between ${isDark ? "border-white/5 bg-black/60" : "border-neutral-100 bg-white"}`}>
          <NavLink to="/" onClick={() => setOpen(false)} className="flex items-center gap-1">
            <span className={`text-2xl font-bold tracking-tight ${isDark ? "text-white" : "text-black"}`} style={{ fontFamily: "Bricolage Grotesque" }}>
              art<span className="text-neutral-500 font-normal">istic</span>
            </span>
          </NavLink>
          <button
            onClick={() => setOpen(false)}
            className={`p-2 rounded-full transition-colors ${isDark ? "hover:bg-white/10" : "hover:bg-black/5"}`}
          >
            <X size={18} className={isDark ? "text-white/60" : "text-black/60"} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-8 px-4">
          <div className="space-y-6">
            {/* General */}
            <div>
              <h3 className={`px-5 mb-4 text-[10px] font-semibold uppercase tracking-[0.2em]  ${isDark ? "text-white" : "text-black"}`}>
                General
              </h3>
              <div className="space-y-1.5">
                <NavLink to="/" className={mobileNavClass} onClick={() => setOpen(false)}>
                  <Home size={18} />
                  Home
                </NavLink>
                <NavLink to="/terms" className={mobileNavClass} onClick={() => setOpen(false)}>
                  <FileText size={18} />
                  Terms of Service
                </NavLink>
              </div>
            </div>

            {/* Privacy & Safety */}
            <div>
              <h3 className={`px-5 mb-4 text-[10px] font-bold uppercase tracking-[0.2em]  ${isDark ? "text-white" : "text-black"}`}>
                Privacy & Safety
              </h3>
              <div className="space-y-1.5">
                <NavLink to="/privacy-policy" className={mobileNavClass} onClick={() => setOpen(false)}>
                  <Shield size={18} />
                  Privacy Policy
                </NavLink>
              </div>
            </div>

            {/* Billing */}
            <div>
              <h3 className={`px-5 mb-4 text-[10px] font-bold uppercase tracking-[0.2em]  ${isDark ? "text-white" : "text-black"}`} style={{ fontFamily: "Inter, serif" }}>
                Orders & Billing
              </h3>
              <div className="space-y-1.5">
                <NavLink to="/refund-policy" className={mobileNavClass} onClick={() => setOpen(false)}>
                  <RotateCcw size={18} />
                  Refund Policy
                </NavLink>
                <NavLink to="/cancellation-policy" className={mobileNavClass} onClick={() => setOpen(false)}>
                  <AlertTriangle size={18} />
                  Cancellation Policy
                </NavLink>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className={`p-8 border-t ${isDark ? "border-white/5" : "border-neutral-100"}`}>
          <p className={`text-[11px] leading-relaxed opacity-50 font-medium ${isDark ? "text-neutral-400" : "text-neutral-500"}`}>
            © 2026 Artistic Official<br />
            Legal Documentation
          </p>
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