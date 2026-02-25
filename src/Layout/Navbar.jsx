import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import ThemeToggle from "../Components/ThemeToggle";
import { ShoppingBag, Menu, X } from "lucide-react";
import SignIn from "../Pages/SignIn"; // ✅ IMPORT ADDED
import { Link } from "react-router-dom";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Gallery", path: "/gallery" },
  { label: "Order Now", path: "/order" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

export default function Navbar() {
  const location = useLocation();
  const [activeStyle, setActiveStyle] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false); // ✅ NEW STATE
  const linkRefs = useRef([]);

  const activeIndex = navLinks.findIndex(
    (link) => link.path === location.pathname
  );

  const updateUnderline = () => {
    if (activeIndex === -1) return;

    const el = linkRefs.current[activeIndex];
    if (el) {
      setActiveStyle({
        left: el.offsetLeft + "px",
        width: el.offsetWidth + "px",
      });
    }
  };

  useEffect(() => {
    updateUnderline();
  }, [activeIndex, location.pathname]);

  useEffect(() => {
    window.addEventListener("resize", updateUnderline);
    return () => {
      window.removeEventListener("resize", updateUnderline);
    };
  }, [activeIndex]);

  return (
    <>
      <div
        className="w-full px-3 py-2 border-b 
        border-neutral-300 dark:border-neutral-800 
        bg-white dark:bg-[#0f1115] 
        transition-colors duration-300"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        <div className="flex items-center justify-between">

          {/* Left Side */}
          <div className="flex items-center gap-12">

            {/* Logo */}
            <NavLink to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-neutral-400 dark:bg-neutral-300" />
              <span className="text-lg font-semibold text-black dark:text-white">
                artistic
              </span>
            </NavLink>

            {/* Desktop Links */}
            <div className="relative hidden md:flex items-center gap-5">

              {activeIndex !== -1 && (
                <div
                  className="absolute -bottom-1 h-[2px] 
                  bg-black dark:bg-white 
                  transition-all duration-300 ease-out"
                  style={activeStyle}
                />
              )}

              {navLinks.map((link, index) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  ref={(el) => (linkRefs.current[index] = el)}
                  className={({ isActive }) =>
                    `
                    relative z-10 px-2 py-1 text-[14.5px]
                    transition-colors duration-200
                    ${
                      isActive
                        ? "text-black dark:text-white"
                        : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                    }
                  `
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Right Side Desktop */}
          <div className="hidden md:flex items-center gap-6">
            <ThemeToggle />

            {/* ✅ DESKTOP SIGN IN */}
            <button
              onClick={() => setShowSignIn(true)}
              className="px-4 py-2 rounded-full text-sm 
              border border-neutral-400 dark:border-neutral-700
              bg-white dark:bg-black
              text-black dark:text-white
              hover:bg-neutral-100 dark:hover:bg-neutral-900
              transition-all cursor-pointer active:scale-95 duration-200"
            >
              Sign In
            </button>

            <Link to="/order"
              className="px-4 py-2 flex gap-2 rounded-full text-sm 
              border border-neutral-400 dark:border-neutral-700
              bg-white dark:bg-black
              text-black dark:text-white
              hover:bg-neutral-100 dark:hover:bg-neutral-900
              transition-all cursor-pointer active:scale-95 duration-200"
            >
              <ShoppingBag size={18} />
              Order Now
            </Link>
              
          </div>
          

          {/* Mobile Right */}
          <div className="md:hidden flex items-center gap-4">
            <ThemeToggle />
            <button onClick={() => setIsOpen(true)}>
              <Menu size={24} className="text-black dark:text-white cursor-pointer" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 
        ${isOpen ? "visible opacity-100" : "invisible opacity-0"}`}
      >

        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setIsOpen(false)}
        />

        <div
          className={`absolute top-0 right-0 h-full w-72 
          bg-white dark:bg-[#0f1115] 
          border-l border-neutral-300 dark:border-neutral-800
          p-6 flex flex-col justify-between
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        >

          <div>
            <div className="flex justify-between items-center mb-8">
              <span className="text-lg font-semibold text-black dark:text-white">
                artistic
              </span>
              <button onClick={() => setIsOpen(false)}>
                <X className="text-black dark:text-white cursor-pointer" />
              </button>
            </div>

            <div className="flex flex-col gap-6 text-[14px]" style={{ fontFamily: "Inter, sans-serif" }}>
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `
                    relative text-[15px] font-medium transition-colors duration-200
                    ${
                      isActive
                        ? "text-black dark:text-white"
                        : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                    }
                  `
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4" style={{ fontFamily: "Inter, sans-serif" }}>

            {/* ✅ MOBILE SIGN IN */}
            <button
              onClick={() => {
                setIsOpen(false);
                setShowSignIn(true);
              }}
              className="px-4 py-2 rounded-full text-sm 
              border border-neutral-400 dark:border-neutral-700
              bg-white dark:bg-black
              text-black dark:text-white
              hover:bg-neutral-100 dark:hover:bg-neutral-900
              transition-all cursor-pointer active:scale-95 duration-200"
            >
              Sign In
            </button>

            <Link to="/order"
              className="px-4 py-2 flex gap-2 justify-center rounded-full text-sm 
              border border-neutral-400 dark:border-neutral-700
              bg-white dark:bg-black
              text-black dark:text-white
              hover:bg-neutral-100 dark:hover:bg-neutral-900
              transition-all cursor-pointer active:scale-95 duration-200"
            >
              <ShoppingBag size={18} />
              Order Now
            </Link>
          </div>
        </div>
      </div>

      {/* ✅ SIGN IN MODAL */}
      {showSignIn && <SignIn onClose={() => setShowSignIn(false)} />}
    </>
  );
}