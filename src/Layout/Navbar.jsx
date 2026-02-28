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
      {/* ================= MAIN NAVBAR ================= */}
      <div
        className={`sticky top-0 z-50 w-full border-b transition-colors duration-300 ${
          isDark
            ? "bg-[#0f1115] border-neutral-800"
            : "bg-white border-neutral-300"
        }`}
        style={{ fontFamily: "Inter, serif" }}
      >

        {/* ===== DESKTOP NAVBAR ===== */}
        <div className="hidden md:flex items-center justify-between px-6 py-3">

          {/* Left */}
          <div className="flex items-center gap-12">
            <NavLink to="/">
              <span
                className={`text-[25px] font-semibold ${
                  isDark ? "text-white" : "text-black"
                }`}
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                artistic
              </span>
            </NavLink>

            {/* Desktop Links */}
            <div className="relative flex items-center gap-6">
              {activeIndex !== -1 && (
                <div
                  className={`absolute -bottom-1 h-[2px] transition-all duration-300 ${
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
                    `relative z-10 text-[14.5px] transition-colors duration-200 ${
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

          {/* Right */}
          <div className="flex items-center gap-6">
            <ThemeToggle isDark={isDark} setIsDark={setIsDark} />

            <button
              onClick={() => setShowSignIn(true)}
              className={`px-4 py-2 rounded-full text-sm border transition-all duration-200 ${
                isDark
                  ? "bg-black text-white border-neutral-700 hover:bg-neutral-900"
                  : "bg-white text-black border-neutral-900 hover:bg-neutral-200"
              }`}
            >
              Sign In
            </button>

            <Link
              to="/order"
              className={`px-4 py-2 flex gap-2 rounded-full text-sm border transition-all duration-200 ${
                isDark
                  ? "bg-black text-white border-neutral-700 hover:bg-neutral-900"
                  : "bg-white text-black border-neutral-900 hover:bg-neutral-200"
              }`}
            >
              <ShoppingBag size={18} />
              Order Now
            </Link>
          </div>
        </div>

        {/* ===== MOBILE NAVBAR ===== */}
        <div className="flex md:hidden items-center justify-between px-4 py-3">

          {/* Left: Hamburger + Logo */}
          <div className="flex items-center gap-4">
            <button onClick={() => setIsOpen(!isOpen)}>
  {isOpen ? (
    <X
      size={20}
      className={isDark ? "text-white" : "text-black"}
    />
  ) : (
    <Menu
      size={20}
      className={isDark ? "text-white" : "text-black"}
    />
  )}
</button>

            <NavLink to="/">
              <span
                className={`text-[20px] font-semibold ${
                  isDark ? "text-white" : "text-black"
                }`}
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                artistic
              </span>
            </NavLink>
          </div>

          {/* Right */}
          <ThemeToggle isDark={isDark} setIsDark={setIsDark} />
        </div>
      </div>

      {/* ================= MOBILE OVERLAY ================= */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 z-40"
        />
      )}

      {/* ================= SLIDE DRAWER ================= */}
<div
  className={`fixed left-0 top-[56px] h-[calc(100%-56px)] w-[340px] z-50 transform transition-transform duration-300 ease-in-out ${
    isOpen ? "translate-x-0" : "-translate-x-full"
  } ${
    isDark ? "bg-[#0f1115] text-white" : "bg-white text-black"
  } border-r ${
    isDark ? "border-neutral-800" : "border-neutral-300"
  } flex flex-col`}
>

  <div className="flex flex-col text-lg">

    {navLinks.map((link) => (
      <NavLink
        key={link.path}
        to={link.path}
        onClick={() => setIsOpen(false)}
        className={`px-6 py-4 border-b transition-colors ${
          isDark
            ? "border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-900"
            : "border-neutral-200 text-neutral-600 hover:text-black hover:bg-gray-100"
        }`}
      >
        {link.label}
      </NavLink>
    ))}

  </div>
</div>

      {/* ================= SIGN IN MODAL ================= */}
      {showSignIn && (
        <SignIn
          onClose={() => setShowSignIn(false)}
          isDark={isDark}
        />
      )}
    </>
  );
}