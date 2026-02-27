import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./Layout/Layout";

// Main Pages
import Home from "./Pages/Home";
import Gallery from "./Pages/Gallery";
import Order from "./Pages/Order";
import About from "./Pages/About";
import Contact from "./Pages/Contact";

export default function App() {

  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white transition-colors duration-300">
      <Routes>
        <Route element={<Layout isDark={isDark} setIsDark={setIsDark} />}>
          <Route path="/" element={<Home isDark={isDark} />} />
          <Route path="/gallery" element={<Gallery isDark={isDark}/>} />
          <Route path="/order" element={<Order isDark={isDark}/>} />
          <Route path="/about" element={<About isDark={isDark}/>} />
          <Route path="/contact" element={<Contact isDark={isDark}/>} />
        </Route>
      </Routes>
    </div>
  );
}