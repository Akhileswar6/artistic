import { Routes, Route } from "react-router-dom";
import Navbar from "./Layout/Navbar";
import Footer from "./Layout/Footer";
import AuthLayout from "./Layout/AuthLayout";
import Layout from "./Layout/Layout";

// Main Pages
import Home from "./Pages/Home";
import Gallery from "./Pages/Gallery";
import Order from "./Pages/Order";
import About from "./Pages/About";
import Contact from "./Pages/Contact";

// Policy Pages
import PrivacyPolicy from "./Pages/Policies/PrivacyPolicy";
import CancellationPolicy from "./Pages/Policies/CancellationPolicy";
import RefundPolicy from "./Pages/Policies/RefundPolicy";
import TermsOfService from "./Pages/Policies/TermsOfService";

export default function App() {
  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white transition-colors duration-300">
      <Routes>

        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/order" element={<Order />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/cancellation-policy" element={<CancellationPolicy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
        </Route>

      </Routes>
    </div>
  );
}