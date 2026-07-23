import { useState, useEffect } from "react";
import React from "react";
import AdminSidebar from "../Components/Admin/AdminSidebar";
import ThemeToggle from "../Components/ThemeToggle";
import { Menu } from "lucide-react";

export default function AdminLayout({ children }) {
  const [isDark, setIsDark] = useState(localStorage.getItem("theme") !== "light");
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
       ${isDark ? "bg-[#050505] text-white" : "bg-[#f4f6f8] text-black"}`}>

      {/* Sidebar */}
      <AdminSidebar isDark={isDark} setIsDark={setIsDark} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div 
          onClick={() => setIsCollapsed(true)}
          className="md:hidden fixed inset-0 bg-black/60 z-[90] backdrop-blur-sm animate-in fade-in duration-300"
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto z-10 w-full relative">
        
        {/* Floating Mobile Menu Button */}
        {isCollapsed && (
          <button 
            onClick={() => setIsCollapsed(false)}
            className={`md:hidden fixed top-4 right-4 z-50 p-2.5 rounded-full border shadow-lg backdrop-blur-md transition-all duration-300 ${isDark ? "bg-[#111]/80 border-white/10 text-white" : "bg-white/80 border-black/10 text-black"}`}
          >
            <Menu size={20} />
          </button>
        )}

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