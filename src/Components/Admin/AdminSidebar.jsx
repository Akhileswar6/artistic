import { useNavigate, useLocation } from "react-router-dom";
import { ShoppingBag, Image, Settings, MessageCircle, Users, ChartColumnIncreasing, LogOut, ChevronLeft, ChevronRight, Activity, PieChart, IndianRupee, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import ThemeToggle from "../ThemeToggle";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config";

export default function AdminSidebar({ isDark, setIsDark, isCollapsed, setIsCollapsed }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [updates, setUpdates] = useState({});

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) return;
        const res = await axios.get(`${API_BASE_URL}/api/admin/notifications-updates`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUpdates(res.data);
      } catch (err) {
        console.error("Failed to fetch notification updates:", err);
      }
    };
    fetchUpdates();
    const interval = setInterval(fetchUpdates, 30000);
    return () => clearInterval(interval);
  }, []);

  const hasNew = (categoryLabel) => {
    const categoryMap = {
      "Users": "users",
      "Orders": "orders",
      "Messages": "messages",
      "Revenue": "revenue",
    };
    const key = categoryMap[categoryLabel];
    if (!key || !updates[key]) return false;
    
    const lastViewed = localStorage.getItem(`admin_lastViewed_${key}`);
    if (!lastViewed) return true; // Never viewed, so it's new
    
    return new Date(updates[key]) > new Date(lastViewed);
  };

  const handleMenuClick = (item) => {
    const categoryMap = {
      "Users": "users",
      "Orders": "orders",
      "Messages": "messages",
      "Revenue": "revenue",
    };
    const key = categoryMap[item.label];
    if (key && updates[key]) {
      localStorage.setItem(`admin_lastViewed_${key}`, new Date().toISOString());
      // Optionally optimistically remove the dot:
      setUpdates(prev => ({ ...prev, [key]: null }));
    }

    navigate(item.path);
    if (window.innerWidth < 768) {
      setIsCollapsed(true);
    }
  };

  const menuClass = (path) => {
    const isActive = location.pathname === path;
    return `
      flex items-center gap-3 rounded-full cursor-pointer font-medium text-[12px] relative group border transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] outline-none select-none
      ${isActive
        ? isDark
          ? "bg-white/10 text-white border-white/20 shadow-[0_4px_15px_rgba(0,0,0,0.2)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] backdrop-blur-md"
          : "bg-black/5 text-black border-black/10 shadow-[0_4px_15px_rgba(0,0,0,0.05)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] backdrop-blur-md shadow-md"
        : isDark
          ? "text-gray-400 border-transparent hover:text-white hover:bg-white/5"
          : "text-gray-500 border-transparent hover:text-black hover:bg-black/5"
      }
      ${isCollapsed ? "justify-center w-[36px] h-[36px] mx-auto px-0" : "px-3 py-2 w-full"}
    `;
  };

  const menuItems = [
    { path: "/admin/dashboard", label: "Overview", icon: ChartColumnIncreasing },
    { path: "/admin/analytics", label: "Analytics", icon: PieChart },
    { path: "/admin/transactions", label: "Revenue", icon: IndianRupee },
    { path: "/admin/userOrders", label: "Orders", icon: ShoppingBag },
    { path: "/admin/users", label: "Users", icon: Users },
    { path: "/admin/messages", label: "Messages", icon: MessageCircle },
    { path: "/admin/activities", label: "Activity Log", icon: Activity },
    { path: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div
      className={`h-screen flex flex-col p-3 border-r z-[100] transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]
        fixed md:relative left-0 top-0 
        ${isCollapsed ? "-translate-x-full md:translate-x-0 md:w-[68px]" : "translate-x-0 w-[200px] md:w-[200px]"}
        ${isDark
          ? "bg-[#050505]/95 md:bg-[#050505]/60 backdrop-blur-[40px] backdrop-saturate-[180%] border-white/5 shadow-[20px_0_50px_rgba(0,0,0,0.3)]"
          : "bg-white/95 md:bg-white/60 backdrop-blur-[40px] backdrop-saturate-[180%] border-black/5 shadow-[10px_0_40px_rgba(0,0,0,0.02)]"
        }
      `}
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Floating Toggle Button (Hidden on Mobile) */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`hidden md:flex absolute -right-3 top-8 w-6 h-6 rounded-full border items-center justify-center z-50 transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:scale-110 shadow-2xl
          ${isDark
            ? "bg-[#1a1a1a]/80 backdrop-blur-xl border-white/10 text-gray-400 hover:text-white"
            : "bg-white border-black/10 text-gray-500 hover:text-black"
          }
        `}
      >
        <div className={`transition-transform duration-500 ${isCollapsed ? "" : "rotate-180"}`}>
          <ChevronRight size={12} />
        </div>
      </button>

      {/* Logo Area */}
      <div className={`mb-8 px-1 flex items-center gap-1 transition-all duration-500 ${isCollapsed ? "justify-center" : ""}`}>
        {isCollapsed ? (
          <span className={`text-xl font-bold tracking-tight ${isDark ? "text-white" : "text-black"}`} style={{ fontFamily: "Bricolage Grotesque" }}>
            a
          </span>
        ) : (
          <span className={`text-xl font-bold tracking-tight ${isDark ? "text-white" : "text-black"}`} style={{ fontFamily: "Bricolage Grotesque" }}>
            art<span className="text-neutral-500 font-normal">istic</span>
          </span>
        )}
      </div>

      {/* Navigation */}
      <div className="flex flex-col gap-y-2 flex-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <div
              key={item.path}
              onClick={() => handleMenuClick(item)}
              className={menuClass(item.path)}
            >
              <div className="relative">
                <Icon size={18} className={`${isActive ? "opacity-100" : "opacity-60 group-hover:opacity-100"} transition-all duration-300`} />
                {hasNew(item.label) && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-[#050505]"></span>
                )}
              </div>
              {!isCollapsed ? (
                <span className="animate-in fade-in slide-in-from-left-5 duration-500">{item.label}</span>
              ) : (
                <div className="absolute left-[56px] px-3 py-1.5 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-x-0 -translate-x-2 transition-all duration-300 whitespace-nowrap z-[100] shadow-2xl pointer-events-none
                  bg-black/80 backdrop-blur-[30px] backdrop-saturate-[180%] border border-white/10 text-white text-[11px]">
                  {item.label}
                  <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-black/80 rotate-45 border-l border-b border-white/10" />
                </div>
              )}
            </div>
          );
        })}

      </div>

      {/* Bottom Section */}
      <div className="mt-auto flex flex-col gap-2">
        <div
          onClick={() => setIsDark(!isDark)}
          className={`group flex items-center gap-3 rounded-[12px] cursor-pointer font-medium text-[12px] transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] relative
            ${isCollapsed 
              ? "justify-center w-[36px] h-[36px] mx-auto text-gray-500 hover:text-white" 
              : `px-3 py-2 text-gray-500 hover:text-black ${isDark ? "hover:text-white hover:bg-white/5" : "hover:bg-black/5"}`}
          `}
        >
          {isDark ? (
            <Sun size={18} className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-45" />
          ) : (
            <Moon size={18} className="transition-transform duration-300 group-hover:scale-110 -group-hover:rotate-12" />
          )}
          {!isCollapsed ? (
            <span className="animate-in fade-in slide-in-from-left-5 duration-500">
              {isDark ? "Light Mode" : "Dark Mode"}
            </span>
          ) : (
            <div className={`absolute left-[56px] px-3 py-1.5 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-x-0 -translate-x-2 transition-all duration-300 whitespace-nowrap z-[100] shadow-2xl pointer-events-none
              backdrop-blur-[30px] backdrop-saturate-[180%] text-[11px] border ${isDark ? "bg-white/10 text-white border-white/10 shadow-white/5" : "bg-black/80 text-white border-black/10"}`}>
              {isDark ? "Light Mode" : "Dark Mode"}
              <div className={`absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 border-l border-b ${isDark ? "bg-[#1a1a1a] border-white/10" : "bg-black/80 border-black/10"}`} />
            </div>
          )}
        </div>
        
        <div
          onClick={() => {
            localStorage.removeItem("adminToken");
            navigate("/admin");
          }}
          className={`group flex items-center gap-3 rounded-[12px] cursor-pointer font-medium text-[12px] transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] relative
            ${isCollapsed ? "justify-center w-[36px] h-[36px] mx-auto text-red-500/60 hover:text-red-500" : "px-3 py-2 text-red-500/60 hover:text-red-500 hover:bg-red-500/5"}
          `}
        >
          <LogOut size={18} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          {!isCollapsed ? (
            <span className="animate-in fade-in slide-in-from-left-5 duration-500">Sign Out</span>
          ) : (
            <div className="absolute left-[56px] px-3 py-1.5 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-x-0 -translate-x-2 transition-all duration-300 whitespace-nowrap z-[100] shadow-2xl pointer-events-none
              bg-red-600/90 backdrop-blur-xl text-white text-[11px] border border-white/10">
              Sign Out
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-600/90 rotate-45" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
