import { Ban } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import PolicyNavbar from "../../Components/PolicyNavbar.jsx";

export default function CancellationPolicy() {
const [darkPolicy, setDarkPolicy] = useState(
  localStorage.getItem("policyTheme") === "dark"
);



  // ✅ Always open from top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      className={`w-full min-h-screen transition-colors ${
        darkPolicy ? "bg-[#0f0f0f]" : "bg-[#fbf8f3]" 
      }`}
    >
      {/* CONSTANT DARK NAVBAR */}
      <PolicyNavbar
        darkPolicy={darkPolicy}
        setDarkPolicy={setDarkPolicy}
      />
      <hr className="text-[white]/40"/>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`max-w-full shadow-lg p-8 transition-colors ${
          darkPolicy ? "bg-[#0e0e12]" : "bg-white"
        }`}
        style={{ fontFamily: "Inter, serif" }}
      >
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className={`p-2 rounded-full ${
              darkPolicy
                ? "bg-[#2a2a2a] text-[#f5f5f5]"
                : "bg-[#D3D3D3] text-black"
            }`}
          >
            <Ban size={22} />
          </div>

          <h1
            className={`text-[26px] font-semibold ${
              darkPolicy ? "text-[#f5f5f5]" : "text-[#3a2a1a]"
            }`}
            style={{ fontFamily: "Inter, serif" }}
          >
            Cancellation Policy
          </h1>
        </div>

        {/* INTRO */}
        <p
          className={`text-sm mb-8 ${
            darkPolicy ? "text-[#b5b5b5]" : "text-[#6b5a48]"
          }`}
        >
          At <span className="font-medium">SketchCraft</span>, every artwork is
          custom-created with care. Please review our cancellation policy
          carefully before placing an order.
        </p>

        {/* SECTIONS */}
        <Section
          dark={darkPolicy}
          title="1. Order Confirmation"
          content="Once an order is placed and confirmed, it is queued for production."
        />

        <Section
          dark={darkPolicy}
          title="2. Cancellation Before Work Begins"
          content="Orders may be cancelled only if the artist has not started working on the artwork."
        />

        <Section
          dark={darkPolicy}
          title="3. Cancellation After Work Begins"
          content="Cancellations are not permitted once artwork creation has begun due to the personalized nature of the service."
        />

        <Section
          dark={darkPolicy}
          title="4. Delays & Customer Unavailability"
          content="If a customer becomes unresponsive during the process, the order may be completed or closed at our discretion."
        />

        <Section
          dark={darkPolicy}
          title="5. Exceptional Circumstances"
          content="In rare cases such as technical issues or unavoidable situations, cancellations may be reviewed individually."
        />

        <Section
          dark={darkPolicy}
          title="6. Policy Updates"
          content="SketchCraft reserves the right to update this Cancellation Policy at any time."
        />

        {/* FOOTER */}
        <div
          className={`mt-10 text-xs ${
            darkPolicy ? "text-[#888]" : "text-[#9b8a7a]"
          }`}
        >
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </motion.div>
    </div>
  );
}

/* SECTION COMPONENT — SAME FOR ALL POLICY PAGES */
const Section = ({ title, content, dark }) => (
  <div className="mb-6">
    <h2
      className={`text-[16px] font-semibold mb-2 ${
        dark ? "text-[#f0f0f0]" : "text-[#2d1f12]"
      }`}
    >
      {title}
    </h2>
    <p
      className={`text-sm leading-relaxed ${
        dark ? "text-[#b5b5b5]" : "text-[#6b5a48]"
      }`}
    >
      {content}
    </p>
  </div>
);
