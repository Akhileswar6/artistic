import { useNavigate, useLocation } from "react-router-dom";
import { ShoppingBag, Image, Settings, MessageCircle, Users, ChartColumnIncreasing, LogOut, ChevronLeft, ChevronRight, Activity } from "lucide-react";

export default function AdminSidebar({ isDark, isCollapsed, setIsCollapsed }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuClass = (path) => {
    const isActive = location.pathname === path;
    return `
      flex items-center gap-3 rounded-[14px] cursor-pointer font-medium text-[13px] relative group
      transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] outline-none select-none
      ${isActive
        ? isDark
          ? "bg-gradient-to-br from-white/20 to-white/[0.02] backdrop-blur-[40px] backdrop-saturate-[180%] text-white shadow-xl"
          : "bg-gradient-to-br from-white/80 to-white/30 backdrop-blur-[40px] text-black font-semibold shadow-md"
        : isDark
          ? "text-gray-400 hover:text-white hover:bg-white/5"
          : "text-gray-500 hover:text-black hover:bg-black/5"
      }
      ${isCollapsed ? "justify-center w-[40px] h-[40px] mx-auto px-0" : "px-4 py-2.5 w-full"}
    `;
  };

  const menuItems = [
    { path: "/admin/dashboard", label: "Overview", icon: ChartColumnIncreasing },
    { path: "/admin/userOrders", label: "Orders", icon: ShoppingBag },
    { path: "/admin/users", label: "Users", icon: Users },
    { path: "/admin/messages", label: "Messages", icon: MessageCircle },
    { path: "/admin/activities", label: "Activity Log", icon: Activity },
    { path: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div
      className={`h-screen flex flex-col p-[14px] border-r z-[100] transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]
        fixed md:relative left-0 top-0 
        ${isCollapsed ? "-translate-x-full md:translate-x-0 md:w-[72px]" : "translate-x-0 w-[220px] md:w-[220px]"}
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
      <div className={`mb-10 px-1 flex items-center gap-3 transition-all duration-500 ${isCollapsed ? "justify-center" : ""}`}>
        <div className={`rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ${isDark ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.1)]" : "bg-black text-white shadow-lg"} w-8 h-8`}>
          <span className="text-base font-extrabold" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>A</span>
        </div>
        {!isCollapsed && (
          <div className="animate-in fade-in slide-in-from-left-2 duration-500">
            <h1 className="font-medium text-lg tracking-tight" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
              Artistic
            </h1>
          </div>
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
              onClick={() => {
                navigate(item.path);
                // Auto-close sidebar on mobile after navigation
                if (window.innerWidth < 768) {
                  setIsCollapsed(true);
                }
              }}
              className={menuClass(item.path)}
            >
              <Icon size={20} className={`${isActive ? "opacity-100" : "opacity-60 group-hover:opacity-100"} transition-all duration-300`} />
              {!isCollapsed ? (
                <span className="animate-in fade-in slide-in-from-left-5 duration-500">{item.label}</span>
              ) : (
                <div className="absolute left-[62px] px-3 py-1.5 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-x-0 -translate-x-2 transition-all duration-300 whitespace-nowrap z-[100] shadow-2xl pointer-events-none
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
      <div className="mt-auto">
        <div
          onClick={() => {
            localStorage.removeItem("adminToken");
            navigate("/admin");
          }}
          className={`group flex items-center gap-3 rounded-[12px] cursor-pointer font-medium text-[13px] transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] relative
            ${isCollapsed ? "justify-center w-[40px] h-[40px] mx-auto text-red-500/60 hover:text-red-500" : "px-4 py-2.5 text-red-500/60 hover:text-red-500 hover:bg-red-500/5"}
          `}
        >
          <LogOut size={20} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          {!isCollapsed ? (
            <span className="animate-in fade-in slide-in-from-left-5 duration-500">Sign Out</span>
          ) : (
            <div className="absolute left-[62px] px-3 py-1.5 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-x-0 -translate-x-2 transition-all duration-300 whitespace-nowrap z-[100] shadow-2xl pointer-events-none
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
