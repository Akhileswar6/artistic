import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";


import Layout from "./Layout/Layout";
import PolicyNavbar from "./Components/PolicyNavbar";
import AdminLayout from "./Layout/AdminLayout";

// Admin Pages
import AdminRoute from "./Components/AdminRoute";
import Dashboard from "./Pages/Admin/Dashboard";
import AdminLogin from "./Pages/Admin/AdminLogin";
import Users from "./Pages/Admin/Users";
import UserOrders from "./Pages/Admin/UserOrders";
import Messages from "./Pages/Admin/Messages";
import Settings from "./Pages/Admin/Settings";
import ActivityLog from "./Pages/Admin/ActivityLog";



// Main Pages
import Home from "./Pages/Home";
import Gallery from "./Pages/Gallery";
import Process from "./Pages/Process";
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
    const [user, setUser] = useState(null);

    useEffect(() => {
      const checkSession = () => {
        const storedUser = localStorage.getItem("user");
        const loginTimestamp = localStorage.getItem("loginTimestamp");

        if (storedUser && loginTimestamp) {
          const now = Date.now();
          const twoHours = 2 * 60 * 60 * 1000;

          if (now - parseInt(loginTimestamp) > twoHours) {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            localStorage.removeItem("loginTimestamp");
            setUser(null);
            toast.error("Session expired, please login again");
          } else {
            setUser(JSON.parse(storedUser));
          }
        }
      };

      checkSession();
      const interval = setInterval(checkSession, 10000);
      return () => clearInterval(interval);
    }, []);
 

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

<Route path="/admin/dashboard" element={<AdminRoute ><AdminLayout><Dashboard /></AdminLayout></AdminRoute>} />
<Route 
  path="/admin/users" 
  element={
    <AdminRoute>
      <AdminLayout>
        <Users />
      </AdminLayout>
    </AdminRoute>
  } 
/>

<Route 
  path="/admin/messages" 
  element={
    <AdminRoute>
      <AdminLayout>
        <Messages />
      </AdminLayout>
    </AdminRoute>
  } 
/>
<Route 
  path="/admin/settings"
  element={
    <AdminRoute>
      <AdminLayout>
        <Settings />
      </AdminLayout>
    </AdminRoute>
  }
/>  

<Route 
  path="/admin/activities"
  element={
    <AdminRoute>
      <AdminLayout>
        <ActivityLog />
      </AdminLayout>
    </AdminRoute>
  }
/>  


<Route
  path="/admin/userOrders"
  element={
    <AdminRoute>
      <AdminLayout>
        <UserOrders />
      </AdminLayout>
    </AdminRoute>
  }
/>
        {/* ========================= */}
        {/* MAIN WEBSITE ROUTES */}
        {/* ========================= */}
        <Route element={<Layout isDark={isDark} setIsDark={setIsDark} user={user} setUser={setUser} />}>
          <Route path="/" element={<Home isDark={isDark} />} />
          <Route path="/gallery" element={<Gallery isDark={isDark} />} />
          <Route path="/process" element={<Process isDark={isDark} />} />
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