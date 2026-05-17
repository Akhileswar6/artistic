import { useEffect, useRef, useState, memo } from "react";
import { NavLink, useLocation, Link, useNavigate } from "react-router-dom";
import ThemeToggle from "../Components/ThemeToggle";
import { ShoppingBag, Menu, X, ChevronDown, ChevronLeft, LogOut, Bell, User, Home, Image, Info, Phone, Settings, Instagram, Twitter, MessageSquare, ExternalLink } from "lucide-react";
import SignIn from "../Components/SignIn";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from "../config";


const navLinks = [
  { label: "Home", path: "/", icon: <Home size={20} /> },
  { label: "Gallery", path: "/gallery", icon: <Image size={20} /> },
  { label: "Order", path: "/order", icon: <ShoppingBag size={20} /> },
  { label: "About", path: "/about", icon: <Info size={20} /> },
  { label: "Contact", path: "/contact", icon: <Phone size={20} /> },
];

function Navbar({ isDark, setIsDark, user, setUser, showSignIn, setShowSignIn }) {
  const location = useLocation();
  const [activeStyle, setActiveStyle] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  const linkRefs = useRef([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const desktopDropdownRef = useRef();
  const mobileDropdownRef = useRef();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) return;
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${API_BASE_URL}/api/notifications/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        const data = await res.json();
        const unread = data.filter((n) => !n.read).length;
        setUnreadCount(unread);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUnread();
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(e) {
      const clickedOutsideDesktop = desktopDropdownRef.current && !desktopDropdownRef.current.contains(e.target);
      const clickedOutsideMobile = mobileDropdownRef.current && !mobileDropdownRef.current.contains(e.target);
      if (clickedOutsideDesktop && clickedOutsideMobile) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        className="absolute top-0 left-0 z-50 w-full bg-transparent pt-3 md:pt-2 transition-colors duration-300"
        style={{ fontFamily: "Inter, serif" }}
      >
        {/* ===== DESKTOP NAVBAR ===== */}
        <div className="hidden md:flex items-center justify-between px-6 py-2">
          {/* Left */}
          <div className="flex items-center gap-12">
            <NavLink to="/" className="flex items-center gap-1">
              <span className={`text-2xl font-bold tracking-tight ${isDark ? "text-white" : "text-black"}`} style={{ fontFamily: "Bricolage Grotesque" }}>
                art<span className="text-neutral-500 font-normal">istic</span>
              </span>
            </NavLink>
            {/* Desktop Links */}
            <div className="relative flex items-center gap-2">
              {activeIndex !== -1 && (
                <div
                  className={`absolute h-full rounded-full transition-all duration-300 ${isDark
                    ? "bg-white/10 backdrop-blur-xl border border-white/10 shadow-[0_4px_20px_rgba(255,255,255,0.05)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
                    : "bg-black/5 backdrop-blur-xl border border-black/10 shadow-[0_4px_20px_rgba(0,0,0,0.08)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]"
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
                    `relative z-10 px-4 py-1.5 rounded-full text-[14px] font-medium transition-colors duration-200 ${isActive
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
            {user ? (
              <div className="relative" ref={desktopDropdownRef}>
                {/* Avatar */}
                <div
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  {user.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt="profile"
                      className={`w-9 h-9 rounded-xl object-cover border-2 transition-all duration-300 ${showDropdown ? "border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" : isDark ? "border-white/10" : "border-black/5"}`}
                    />
                  ) : (
                    <div className={`w-9 h-9 border-2 rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-300 ${showDropdown ? "border-blue-500 bg-blue-500/10 text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" : isDark ? "bg-neutral-800 text-white border-white/10" : "bg-black text-white border-black/10"}`}>
                      {user.fullName?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-200 ${showDropdown ? "rotate-180" : "rotate-0"
                      } ${isDark ? "text-white" : "text-black"}`}
                  />
                </div>
                {/* Premium Dropdown */}
                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className={`absolute right-0 mt-4 w-64 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border z-50 overflow-hidden ${isDark
                        ? "bg-[#111111]/90 border-white/10 text-white"
                        : "bg-white/95 border-black/5 text-black"
                        } backdrop-blur-xl`}
                    >
                      {/* Profile Header */}
                      <div className={`px-5 py-4 border-b ${isDark ? "border-white/5 bg-white/5" : "border-black/5 bg-black/[0.02]"}`}>
                        <p className="text-[13px]  capitalize">{user.fullName}</p>
                        <p className={`text-[11px]  opacity-50 font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>{user.email}</p>
                      </div>

                      <div className="p-2">
                        <ul className="space-y-0.5">
                          <li onClick={() => {
                            navigate("/account");
                            setShowDropdown(false);
                          }}
                            className={`px-4 py-1.5 flex items-center gap-4 rounded-xl cursor-pointer transition-all duration-200 group ${isDark ? "hover:bg-white/10" : "hover:bg-black/5"}`}>
                            <div className={`p-1.5 rounded-lg transition-colors ${isDark ? "bg-white/5 group-hover:bg-blue-500/20 text-blue-400" : "bg-black/5 group-hover:bg-blue-50 text-blue-600"}`}>
                              <User size={16} />
                            </div>
                            <span className="text-[13px] font-medium">Account Settings</span>
                          </li>

                          <li onClick={() => {
                            navigate("/orders");
                            setShowDropdown(false);
                          }}
                            className={`px-4 py-1.5 flex items-center gap-4 rounded-xl cursor-pointer transition-all duration-200 group ${isDark ? "hover:bg-white/10" : "hover:bg-black/5"}`}>
                            <div className={`p-1.5 rounded-lg transition-colors ${isDark ? "bg-white/5 group-hover:bg-purple-500/20 text-purple-400" : "bg-black/5 group-hover:bg-purple-50 text-purple-600"}`}>
                              <ShoppingBag size={16} />
                            </div>
                            <span className="text-[13px] font-medium">My Orders</span>
                          </li>

                          <li
                            onClick={() => {
                              navigate("/notifications");
                              setShowDropdown(false);
                            }}
                            className={`px-4 py-1.5 flex items-center gap-4 rounded-xl cursor-pointer transition-all duration-200 group ${isDark ? "hover:bg-white/10" : "hover:bg-black/5"}`}
                          >
                            <div className={`relative p-1.5 rounded-lg transition-colors ${isDark ? "bg-white/5 group-hover:bg-orange-500/20 text-orange-400" : "bg-black/5 group-hover:bg-orange-50 text-orange-600"}`}>
                              <Bell size={16} />
                              {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-[#111] dark:border-[#111]"></span>
                              )}
                            </div>
                            <div className="flex items-center justify-between flex-1">
                              <span className="text-[13px] font-medium">Notifications</span>
                              {unreadCount > 0 && (
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isDark ? "bg-red-500/20 text-red-400" : "bg-red-500 text-white"}`}>
                                  {unreadCount}
                                </span>
                              )}
                            </div>
                          </li>
                        </ul>

                        <div className={`my-2 h-px ${isDark ? "bg-white/5" : "bg-black/5"}`} />

                        <button
                          onClick={() => {
                            localStorage.removeItem("user");
                            setShowDropdown(false);
                            setUser(null);
                            toast.success("Logged out successfully");
                            navigate("/");
                          }}
                          className={`w-full px-4 py-1.5 flex items-center gap-4 rounded-xl  transition-all duration-200 group text-red-500`}
                        >
                          <div className={`p-1.5 rounded-lg transition-colors ${isDark ? "bg-red-500/10" : "bg-red-50"}`}>
                            <LogOut size={16} />
                          </div>
                          <span className="text-[13px]">Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => setShowSignIn(true)}
                className={`px-4 py-1.5 text-[13px] rounded-full border transition cursor-pointer ${isDark
                  ? "bg-[#1c1c1c] text-white border-neutral-700 hover:bg-neutral-900"
                  : "bg-white text-black border-neutral-300 shadow-lg hover:bg-gray-100"
                  }`}
              >
                Sign In
              </button>
            )}
            {!user && (
              <Link
                to="/order"
                className={`px-4 py-1.5 flex gap-2 rounded-full text-[13px] border transition-all duration-200 ${isDark
                  ? "bg-[#1c1c1c] text-white border-neutral-700 hover:bg-neutral-900"
                  : "bg-white text-black border border-neutral-300 shadow-lg hover:bg-gray-100"
                  }`}
              >
                Order Now
              </Link>
            )}
          </div>
        </div>

        {/* ===== MOBILE NAVBAR ===== */}
        <div className="flex md:hidden items-center justify-between px-4 py-3">
          {/* Left: Hamburger + Logo */}
          <div className="flex items-center gap-4 ">
            <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu">
              {isOpen ? (
                <X
                  size={22}
                  className={isDark ? "text-white" : "text-black"}
                />
              ) : (
                <Menu
                  size={22}
                  className={isDark ? "text-white" : "text-black"}
                />
              )}
            </button>
            <NavLink to="/" className="flex items-center gap-1">
              <span className={`text-2xl font-bold tracking-tight ${isDark ? "text-white" : "text-black"}`} style={{ fontFamily: "Bricolage Grotesque" }}>
                art<span className="text-neutral-500 font-normal">istic</span>
              </span>
            </NavLink>
          </div>
          {/* Right */}
          <div className="flex items-center gap-3">
            <ThemeToggle isDark={isDark} setIsDark={setIsDark} />
            {user ? (
              <div className="relative" ref={mobileDropdownRef}>
                {/* Avatar */}
                <div
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  {user.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt="profile"
                      className={`w-8 h-8 rounded-xl object-cover border-2 transition-all duration-300 ${showDropdown ? "border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]" : isDark ? "border-white/10" : "border-black/5"}`}
                    />
                  ) : (
                    <div className={`w-8 h-8 border-2 rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-300 ${showDropdown ? "border-blue-500 bg-blue-500/10 text-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]" : isDark ? "bg-neutral-800 text-white border-white/10" : "bg-black text-white border-black/10"}`}>
                      {user.fullName?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${showDropdown ? "rotate-180" : "rotate-0"
                      } ${isDark ? "text-white" : "text-black"}`}
                  />
                </div>
                {/* Premium Mobile Dropdown */}
                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className={`absolute right-0 mt-4 w-60 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border z-50 overflow-hidden ${isDark
                        ? "bg-[#111111]/95 border-white/10 text-white"
                        : "bg-white/95 border-black/5 text-black"
                        } backdrop-blur-xl`}
                    >
                      {/* Profile Header */}
                      <div className={`px-5 py-4 border-b ${isDark ? "border-white/5 bg-white/5" : "border-black/5 bg-black/[0.02]"}`}>
                        <p className="text-[13px] font-bold capitalize">{user.fullName}</p>
                        <p className={`text-[11px] opacity-50 font-medium truncate ${isDark ? "text-gray-400" : "text-gray-500"}`}>{user.email}</p>
                      </div>

                      <div className="p-2">
                        <ul className="space-y-0.5">
                          <li onClick={() => {
                            navigate("/account");
                            setShowDropdown(false);
                          }}
                            className={`px-4 py-2 flex items-center gap-4 rounded-xl cursor-pointer transition-all duration-200 group ${isDark ? "hover:bg-white/10" : "hover:bg-black/5"}`}>
                            <div className={`p-1.5 rounded-lg transition-colors ${isDark ? "bg-white/5 group-hover:bg-blue-500/20 text-blue-400" : "bg-black/5 group-hover:bg-blue-50 text-blue-600"}`}>
                              <User size={16} />
                            </div>
                            <span className="text-[13px] font-medium">Account Settings</span>
                          </li>

                          <li onClick={() => {
                            navigate("/orders");
                            setShowDropdown(false);
                          }}
                            className={`px-4 py-2 flex items-center gap-4 rounded-xl cursor-pointer transition-all duration-200 group ${isDark ? "hover:bg-white/10" : "hover:bg-black/5"}`}>
                            <div className={`p-1.5 rounded-lg transition-colors ${isDark ? "bg-white/5 group-hover:bg-purple-500/20 text-purple-400" : "bg-black/5 group-hover:bg-purple-50 text-purple-600"}`}>
                              <ShoppingBag size={16} />
                            </div>
                            <span className="text-[13px] font-medium">My Orders</span>
                          </li>

                          <li
                            onClick={() => {
                              navigate("/notifications");
                              setShowDropdown(false);
                            }}
                            className={`px-4 py-2 flex items-center gap-4 rounded-xl cursor-pointer transition-all duration-200 group ${isDark ? "hover:bg-white/10" : "hover:bg-black/5"}`}
                          >
                            <div className={`relative p-1.5 rounded-lg transition-colors ${isDark ? "bg-white/5 group-hover:bg-orange-500/20 text-orange-400" : "bg-black/5 group-hover:bg-orange-50 text-orange-600"}`}>
                              <Bell size={16} />
                              {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-[#111] dark:border-[#111]"></span>
                              )}
                            </div>
                            <div className="flex items-center justify-between flex-1">
                              <span className="text-[13px] font-medium">Notifications</span>
                              {unreadCount > 0 && (
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isDark ? "bg-red-500/20 text-red-400" : "bg-red-500 text-white"}`}>
                                  {unreadCount}
                                </span>
                              )}
                            </div>
                          </li>
                        </ul>

                        <div className={`my-2 h-px ${isDark ? "bg-white/5" : "bg-black/5"}`} />

                        <button
                          onClick={() => {
                            localStorage.removeItem("user");
                            setShowDropdown(false);
                            setUser(null);
                            toast.success("Logged out successfully");
                            navigate("/");
                          }}
                          className={`w-full px-4 py-2 flex items-center gap-4 rounded-xl transition-all duration-200 group text-red-500 hover:bg-red-500/5`}
                        >
                          <div className={`p-1.5 rounded-lg transition-colors cursor-pointer ${isDark ? "bg-red-500/10" : "bg-red-50"}`}>
                            <LogOut size={16} />
                          </div>
                          <span className="text-[13px] font-medium cursor-pointer">Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => setShowSignIn(true)}
                className={`px-3 py-1.5 text-[11px] font-medium rounded-full border transition cursor-pointer ${isDark
                  ? "bg-[#1c1c1c] text-white border-neutral-700 hover:bg-neutral-900"
                  : "bg-white text-black border-neutral-300 shadow-sm hover:bg-gray-100"
                  }`}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ================= PREMIUM MOBILE SIDEBAR (REDESIGNED) ================= */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Ultra-smooth Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-md z-[60] md:hidden"
            />

            {/* Premium Glassmorphic Drawer */}
            <motion.div
              initial={{ x: "-100%", opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0.5 }}
              transition={{
                type: "spring",
                damping: 30,
                stiffness: 300,
                mass: 0.8
              }}
              className={`fixed left-0 top-0 h-[100dvh] w-[200px] z-[70] md:hidden shadow-[20px_0_50px_-20px_rgba(0,0,0,0.5)] flex flex-col
                ${isDark
                  ? "bg-black/90 border-r border-white/10"
                  : "bg-white/95 border-r border-black/5"
                } backdrop-blur-2xl`}
            >
              {/* Animated Background Decoration (Wrapped to hide overflow) */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-40 h-40 rounded-full blur-[80px] opacity-20 bg-blue-500" />
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-[80px] opacity-10 bg-purple-500" />
              </div>

              {/* Drawer Header */}
              <div className={`relative p-6 pl-5 flex items-center ${isDark ? "border-b border-white/5" : "border-b border-black/5"}`}>
                <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-1">
                  <span className={`text-2xl font-bold tracking-tight ${isDark ? "text-white" : "text-black"}`} style={{ fontFamily: "Bricolage Grotesque" }}>
                    art<span className="text-neutral-500 font-normal">istic</span>
                  </span>
                </Link>

                <motion.button
                  whileHover={{ scale: 1.1, x: -2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className={`absolute right-0 translate-x-1/2 flex items-center justify-center w-8 h-8 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] border transition-all z-50 ${isDark ? "bg-[#1c1c1c] border-white/10 text-white hover:bg-neutral-800" : "bg-white border-black/10 text-black hover:bg-gray-50"}`}
                >
                  <ChevronLeft size={18} />
                </motion.button>
              </div>

              {/* Navigation Links with Staggered Animation */}
              <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3 custom-scrollbar" style={{ fontFamily: "Inter" }}>
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.05 }}
                  >
                    <NavLink
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) => `
                        flex items-center gap-3 px-4 py-1.5 rounded-full text-[14px] font-medium transition-colors duration-200 group relative
                        ${isActive
                          ? isDark
                            ? "bg-white/10 backdrop-blur-xl border border-white/10 shadow-[0_4px_20px_rgba(255,255,255,0.05)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] text-white"
                            : "bg-black/5 backdrop-blur-xl border border-black/10 shadow-[0_4px_20px_rgba(0,0,0,0.08)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] text-black"
                          : isDark
                            ? "text-neutral-400 hover:text-white hover:bg-white/5"
                            : "text-neutral-600 hover:text-black hover:bg-black/5"
                        }
                      `}
                    >
                      {({ isActive }) => (
                        <>
                          <span className={`transition-all duration-500 group-hover:scale-110 group-hover:rotate-6
                            ${isActive ? (isDark ? "text-white" : "text-black") : "opacity-60 group-hover:opacity-100"}`}>
                            {link.icon}
                          </span>
                          <span>{link.label}</span>
                        </>
                      )}
                    </NavLink>
                  </motion.div>
                ))}
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ================= SIGN IN MODAL ================= */}
      {showSignIn && (
        <SignIn
          onClose={() => setShowSignIn(false)}
          isDark={isDark}
          setUser={setUser}
        />
      )}
    </>
  );
}

export default memo(Navbar);