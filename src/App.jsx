import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";


import Layout from "./Layout/Layout";
import PolicyNavbar from "./Components/PolicyNavbar";
import AdminLogin from "./Pages/Admin/AdminLogin";

// Main Pages
import Home from "./Pages/Home";
import Gallery from "./Pages/Gallery";
import Order from "./Pages/Order";
import About from "./Pages/About";
import Contact from "./Pages/Contact";

// Policy Pages
import Terms from "./Pages/Policies/TermsOfService";
import PrivacyPolicy from "./Pages/Policies/PrivacyPolicy";
import RefundPolicy from "./Pages/Policies/RefundPolicy";
import CancellationPolicy from "./Pages/Policies/CancellationPolicy";


import Account from "./Pages/User/Account";
import Orders from "./Pages/User/Orders";
import Notifications from "./Pages/User/Notifications";



export default function App() {
    const [user, setUser] = useState(null); // ✅ MOVE HERE
 

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
        <>

<Toaster
  position="top-right"
  toastOptions={{
    duration: 3000,
    style: {
      fontSize: "13px",
      padding: "10px 12px",
      borderRadius: "8px",
      fontFamily: "Inter, serif",



      // 🔥 Dynamic styles
      background: isDark ? "#1c1c1c" : "#ffffff",
      color: isDark ? "#ffffff" : "#000000",
      border: isDark
        ? "1px solid #333"
        : "1px solid #e5e5e5",
    },
    iconTheme: {
     
      fontSize: "10px",
    },
  }}
/>

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
        <Route element={<Layout isDark={isDark} setIsDark={setIsDark} setUser={setUser} />}>
          <Route path="/" element={<Home isDark={isDark} />} />
          <Route path="/gallery" element={<Gallery isDark={isDark} />} />
          <Route path="/order" element={<Order isDark={isDark} />} />
          <Route path="/about" element={<About isDark={isDark} />} />
          <Route path="/contact" element={<Contact isDark={isDark} />} />
          <Route path="/account" element={<Account isDark={isDark} />} />
          <Route path="/orders" element={<Orders isDark={isDark} />} />
          <Route path="/notifications" element={<Notifications isDark={isDark} />} />
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
    </>
  );
}