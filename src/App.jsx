import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./Layout/Layout";
import PolicyNavbar from "./Components/PolicyNavbar";
import AdminLogin from "./Pages/Admin/AdminLogin";

// Main Pages
import Home from "./Pages/Home";
import Gallery from "./Pages/Gallery";
import Order from "./Pages/Order";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import CustomerShowcase from "./Pages/CustomerShowcase";

// Policy Pages
import Terms from "./Pages/Policies/TermsOfService";
import PrivacyPolicy from "./Pages/Policies/PrivacyPolicy";
import RefundPolicy from "./Pages/Policies/RefundPolicy";
import CancellationPolicy from "./Pages/Policies/CancellationPolicy";

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
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        isDark ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <Routes>

<Route
  path="/admin"
  element={<AdminLogin isDark={isDark} setIsDark={setIsDark} />}
/>
        {/* ========================= */}
        {/* MAIN WEBSITE ROUTES */}
        {/* ========================= */}
        <Route element={<Layout isDark={isDark} setIsDark={setIsDark} />}>
          <Route path="/" element={<Home isDark={isDark} />} />
          <Route path="/gallery" element={<Gallery isDark={isDark} />} />
          <Route path="/order" element={<Order isDark={isDark} />} />
          <Route path="/about" element={<About isDark={isDark} />} />
          <Route path="/contact" element={<Contact isDark={isDark} />} />
          <Route path="/showcase" element={<CustomerShowcase isDark={isDark} />} />
        </Route>

        {/* ========================= */}
        {/* POLICY ROUTES */}
        {/* ========================= */}
        <Route element={<PolicyNavbar isDark={isDark} setIsDark={setIsDark} />}>
          <Route
            path="/terms"
            element={<Terms isDark={isDark} />}
          />
          <Route
            path="/privacy-policy"
            element={<PrivacyPolicy isDark={isDark} />}
          />
          <Route
            path="/refund-policy"
            element={<RefundPolicy isDark={isDark} />}
          />
          <Route
            path="/cancellation-policy"
            element={<CancellationPolicy isDark={isDark} />}
          />
        </Route>

      </Routes>
    </div>
  );
}