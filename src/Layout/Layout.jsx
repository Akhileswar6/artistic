import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ isDark, setIsDark, user, setUser }) {
  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${isDark
          ? "bg-[#0f1115] text-white"
          : "bg-white text-black"
        }`}
    >
      {/* Navbar */}
      <Navbar isDark={isDark} setIsDark={setIsDark} user={user} setUser={setUser} />

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet context={{ user, isDark, setIsDark, setUser }} />
      </main>

      {/* Footer */}
      <Footer isDark={isDark} />
    </div>
  );
}