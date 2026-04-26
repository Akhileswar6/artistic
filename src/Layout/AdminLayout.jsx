import { useState, useEffect } from "react";
import React from "react";
import AdminSidebar from "../Components/AdminSidebar";
import ThemeToggle from "../Components/ThemeToggle";
import { Menu } from "lucide-react";

export default function AdminLayout({ children }) {
  const [isDark, setIsDark] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Auto-collapse sidebar on mobile screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load saved preferences
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const savedCollapsed = localStorage.getItem("sidebarCollapsed");
    if (savedTheme === "light") setIsDark(false);
    if (savedCollapsed === "true" && window.innerWidth >= 768) setIsCollapsed(true);
  }, []);

  // Save preferences
  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light");
    if (window.innerWidth >= 768) {
      localStorage.setItem("sidebarCollapsed", isCollapsed.toString());
    }
  }, [isDark, isCollapsed]);

  return (
    <div className={`flex min-h-screen transition-all duration-500 relative overflow-hidden
       ${isDark ? "bg-black text-white" : "bg-[#f4f6f8] text-black"}`}>

      {/* Sidebar */}
      <AdminSidebar isDark={isDark} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div 
          onClick={() => setIsCollapsed(true)}
          className="md:hidden fixed inset-0 bg-black/60 z-[90] backdrop-blur-sm animate-in fade-in duration-300"
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto z-10 w-full">
        {/* Top Bar */}
        <div
          className={`sticky top-0 z-20 flex justify-between items-center px-4 md:px-8 py-4 border-b transition-colors duration-300 w-full
            ${isDark ? "bg-black border-white/10" : "bg-white/70 backdrop-blur-md border-black/5 shadow-[0_4px_20px_rgba(0,0,0,0.03)]"}`}
        >
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`md:hidden p-1.5 rounded-lg transition-colors ${isDark ? "hover:bg-white/10" : "hover:bg-black/5"}`}
            >
              <Menu size={24} />
            </button>
            <h1
              className="text-[20px] md:text-[22px] font-semibold tracking-tight"
              style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
            >
              Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle isDark={isDark} setIsDark={setIsDark} />
          </div>
        </div>

        {/* Content Wrapper */}
        <div className="p-8 pb-20 w-full max-w-[1400px] mx-auto relative">
          {typeof children.type === "string"
            ? children
            : React.cloneElement(children, { isDark })}
        </div>
      </div>
    </div>
  );
}