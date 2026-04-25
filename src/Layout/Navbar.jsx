import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, Link, useNavigate } from "react-router-dom";
import ThemeToggle from "../Components/ThemeToggle";
import { ShoppingBag, Menu, X, ChevronDown, LogOut, Bell, User } from "lucide-react";
import SignIn from "../Pages/SignIn";
import toast from "react-hot-toast";



const navLinks = [
  { label: "Home", path: "/" },
  { label: "Gallery", path: "/gallery" },
  { label: "Order Now", path: "/order" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

export default function Navbar({ isDark, setIsDark, user, setUser }) {
  const location = useLocation();
  const [activeStyle, setActiveStyle] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const linkRefs = useRef([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);



  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user) return;

        const res = await fetch(
          `http://localhost:5000/api/notifications/${user._id}`
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
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
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
        className={`sticky top-0 z-50 w-full shadow-md border-b transition-colors duration-300 ${isDark
            ? "bg-black border-neutral-800"
            : "bg-white border-neutral-300"
          }`}
        style={{ fontFamily: "Inter, serif" }}
      >

        {/* ===== DESKTOP NAVBAR ===== */}
        <div className="hidden md:flex items-center justify-between px-6 py-2">

          {/* Left */}
          <div className="flex items-center gap-12">
            <NavLink to="/">
              <span
                className={`text-[25px] font-semibold ${isDark ? "text-white" : "text-black"
                  }`} style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
              >
                artistic
              </span>
            </NavLink>

            {/* Desktop Links */}
            <div className="relative flex items-center gap-8">
              {activeIndex !== -1 && (
                <div
                  className={`absolute -bottom-1 h-[2px] transition-all duration-300 ${isDark ? "bg-white" : "bg-black"
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
                    `relative z-10 text-[14px] transition-colors duration-200 ${isActive
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
              <div className="relative" ref={dropdownRef}>

                {/* Avatar */}
                <div
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  {user.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt="profile"
                      className="w-9 h-9 rounded-full object-cover border"
                    />
                  ) : (
                    <div className={`w-9 h-9 border rounded-full bg-black text-white flex items-center justify-center ${isDark ? "bg-neutral-800 text-white border-neutral-700 hover:bg-neutral-900" : "border-neutral-300"}`}>
                      {user.fullName?.charAt(0).toUpperCase()}
                    </div>
                  )}

                  {/* 🔽 Down Arrow */}
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-200 ${showDropdown ? "rotate-180" : "rotate-0"
                      } ${isDark ? "text-white" : "text-black"}`}
                  />
                </div>

                {/* Dropdown */}
                {showDropdown && (
                  <div
                    className={`absolute right-0 mt-4 w-50 rounded-xl shadow-lg border z-50 ${isDark
                        ? "bg-[#1c1c1c] border-neutral-700 text-white"
                        : "bg-white border-neutral-200 text-black"
                      }`}
                  >
                    <ul className="text-sm">
                      <li onClick={() => {
                        navigate("/account");
                        setShowDropdown(false);
                      }}
                        className={`px-4 py-2 flex items-center gap-4 rounded-xl cursor-pointer ${isDark ? "text-white " : "hover:bg-neutral-200"}`}>
                        <User size={18} />
                        Account
                      </li>
                      <li onClick={() => {
                        navigate("/orders");
                        setShowDropdown(false);
                      }}
                        className={`px-4 py-2 flex items-center gap-4 rounded-xl cursor-pointer ${isDark ? "text-white " : "hover:bg-neutral-200"}`}>
                        <ShoppingBag size={18} />
                        Orders
                      </li>

                      <li
                        onClick={() => {
                          navigate("/notifications");
                          setShowDropdown(false);
                        }}
                        className={`px-4 py-2 flex items-center gap-4 rounded-xl cursor-pointer ${isDark ? "text-white" : "text-black hover:bg-neutral-200"
                          }`}
                      >
                        {/* 🔔 Icon + Red Dot */}
                        <div className="relative">
                          <Bell size={18} />

                          {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                          )}
                        </div>

                        Notifications
                      </li>

                      <hr className={`my-1 border-neutral-300 ${isDark ? "dark:border-neutral-700" : ""}`} />

                      <li
                        onClick={() => {
                          localStorage.removeItem("user");
                          setShowDropdown(false);
                          setUser(null);
                          toast.success("Logged out successfully");

                          setTimeout(() => {
                            navigate("/");
                          }, 800);

                        }}
                        className={`px-5 py-2 flex gap-4 rounded-xl text-red-500 cursor-pointer ${isDark ? "text-red-500 " : "text-red-500 dark:hover:bg-neutral-200 hover:text-red-500"}`}>

                        <LogOut size={18} />
                        Logout
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowSignIn(true)}
                className={`px-4 py-1.5 text-[13px] rounded-lg border transition cursor-pointer ${isDark
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
                className={`px-4 py-1.5 flex gap-2 rounded-lg text-[13px] border transition-all duration-200 ${isDark
                    ? "bg-[#1c1c1c] text-white border-neutral-700 hover:bg-neutral-900"
                    : "bg-white text-black border border-neutral-300 shadow-lg hover:bg-gray-100"
                  }`}
              >
                <ShoppingBag size={18} />
                Order Now
              </Link>
            )}
          </div>
        </div>

        {/* ===== MOBILE NAVBAR ===== */}
        <div className="flex md:hidden items-center justify-between px-4 py-3">

          {/* Left: Hamburger + Logo */}
          <div className="flex items-center gap-4 ">
            <button onClick={() => setIsOpen(!isOpen)}>
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

            <NavLink to="/">
              <span
                className={`text-[20px] font-semibold ${isDark ? "text-white" : "text-black"
                  }`}
                style={{ fontFamily: "Yatra One, system-ui" }}
              >
                artistic
              </span>
            </NavLink>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <ThemeToggle isDark={isDark} setIsDark={setIsDark} />
            
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <div
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  {user.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt="profile"
                      className="w-8 h-8 rounded-full object-cover border"
                    />
                  ) : (
                    <div className={`w-8 h-8 border rounded-full bg-black text-white flex items-center justify-center text-xs ${isDark ? "bg-neutral-800 text-white border-neutral-700 hover:bg-neutral-900" : "border-neutral-300"}`}>
                      {user.fullName?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {showDropdown && (
                  <div
                    className={`absolute right-0 mt-3 w-48 rounded-xl shadow-lg border z-50 ${isDark
                        ? "bg-[#1c1c1c] border-neutral-700 text-white"
                        : "bg-white border-neutral-200 text-black"
                      }`}
                  >
                    <ul className="text-sm">
                      <li onClick={() => {
                        navigate("/account");
                        setShowDropdown(false);
                      }}
                        className={`px-4 py-2 flex items-center gap-4 rounded-xl cursor-pointer ${isDark ? "hover:bg-neutral-800" : "hover:bg-neutral-100"}`}>
                        <User size={16} />
                        Account
                      </li>
                      <li onClick={() => {
                        navigate("/orders");
                        setShowDropdown(false);
                      }}
                        className={`px-4 py-2 flex items-center gap-4 rounded-xl cursor-pointer ${isDark ? "hover:bg-neutral-800" : "hover:bg-neutral-100"}`}>
                        <ShoppingBag size={16} />
                        Orders
                      </li>
                      <li
                        onClick={() => {
                          navigate("/notifications");
                          setShowDropdown(false);
                        }}
                        className={`px-4 py-2 flex items-center gap-4 rounded-xl cursor-pointer ${isDark ? "hover:bg-neutral-800" : "hover:bg-neutral-100"
                          }`}
                      >
                        <div className="relative">
                          <Bell size={16} />
                          {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                          )}
                        </div>
                        Notifications
                      </li>
                      <hr className={`my-1 ${isDark ? "border-neutral-700" : "border-neutral-200"}`} />
                      <li
                        onClick={() => {
                          localStorage.removeItem("user");
                          setShowDropdown(false);
                          setUser(null);
                          toast.success("Logged out successfully");
                          navigate("/");
                        }}
                        className="px-4 py-2 flex items-center gap-4 rounded-xl text-red-500 cursor-pointer">
                        <LogOut size={16} />
                        Logout
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowSignIn(true)}
                className={`px-3 py-1.5 text-[11px] font-medium rounded-lg border transition cursor-pointer ${isDark
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

      {/* ================= MOBILE OVERLAY ================= */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 z-40"
        />
      )}

      {/* ================= SLIDE DRAWER ================= */}
      <div
        className={`fixed left-0 top-[56px] h-[calc(100%-56px)] w-[200px] z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"
          } ${isDark ? "bg-black text-white" : "bg-white text-black"
          } border-r ${isDark ? "border-neutral-800" : "border-neutral-300"
          } flex flex-col`}
      >

        {/* 🔹 NAV LINKS */}
        <div className="flex flex-col text-[15px]" style={{ fontFamily: "Inter, serif" }}>
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `px-8 py-4 transition-colors ${isActive
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