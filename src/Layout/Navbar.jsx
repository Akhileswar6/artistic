import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, Link } from "react-router-dom";
import ThemeToggle from "../Components/ThemeToggle";
import { ShoppingBag, Menu, X } from "lucide-react";
import SignIn from "../Pages/SignIn";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Gallery", path: "/gallery" },
  { label: "Order Now", path: "/order" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

export default function Navbar({ isDark, setIsDark }) {
  const location = useLocation();
  const [activeStyle, setActiveStyle] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
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
    return () => window.removeEventListener("resize", updateUnderline);
  }, [activeIndex]);

  return (
    <>
      <div
        className={`w-full px-3 py-2 border-b transition-colors duration-300 ${
          isDark
            ? "bg-[#0f1115] border-neutral-800"
            : "bg-white border-neutral-300"
        }`}  style={{ fontFamily:"Inter, serif"}}
      >
        <div className="flex items-center justify-between">

          {/* Left Side */}
          <div className="flex items-center px-4 gap-12">

            <NavLink to="/" className="flex items-center gap-3">
              
              <span
                className={`text-[25px] font-semibold ${
                  isDark ? "text-white" : "text-black"
                }`} style={{ fontFamily:"Playfair Display, serif"}}
              >
                artistic
              </span>
            </NavLink>

            {/* Desktop Links */}
            <div className="relative hidden md:flex items-center gap-5 ">

              {activeIndex !== -1 && (
                <div
                  className={`absolute -bottom-1 h-[2px] transition-all duration-300  ${
                    isDark ? "bg-white" : "bg-black"
                  }`}
                  style={activeStyle}
                />
              )}

              {navLinks.map((link, index) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  ref={(el) => (linkRefs.current[index] = el)}
                  className={({ isActive }) =>
                    `relative z-10 px-2 py-1 text-[14.5px] transition-colors duration-200 ${
                      isActive
                        ? isDark
                          ? "text-white"
                          : "text-black"
                        : isDark
                        ? "text-neutral-400 hover:text-white"
                        : "text-neutral-600 hover:text-black"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Right Side Desktop */}
          <div className="hidden md:flex items-center gap-6">
            <ThemeToggle isDark={isDark} setIsDark={setIsDark} />




            <button
              onClick={() => setShowSignIn(true)}
              className={`px-4 py-2 rounded-full text-sm border border-neutral-400 dark:border-neutral-700
                 transition-all cursor-pointer active:scale-95 duration-200 ${
                isDark
                  ? "bg-black text-white border-neutral-700 hover:bg-neutral-900"
                  : "bg-white text-black border-neutral-900 hover:bg-neutral-200"
              }`}
            >
              Sign In
            </button>

            <Link
              to="/order"
              className={`px-4 py-2 flex gap-2 rounded-full text-sm border transition-all duration-200 cursor-pointer active:scale-95 ${
                isDark
                  ? "bg-black text-white border-neutral-700 hover:bg-neutral-900"
                  : "bg-white text-black border-neutral-900 hover:bg-neutral-200"
              }`}
            >
              <ShoppingBag size={18} />
              Order Now
            </Link>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-4">
            <ThemeToggle isDark={isDark} setIsDark={setIsDark} />
            <button onClick={() => setIsOpen(true)}>
              <Menu
                size={24}
                className={isDark ? "text-white" : "text-black"}
              />
            </button>
          </div>
        </div>
      </div>

      {showSignIn && <SignIn onClose={() => setShowSignIn(false)} />}
    </>
  );
}