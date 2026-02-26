import { RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import PolicyNavbar from "../../Components/PolicyNavbar.jsx";

export default function RefundPolicy() {
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
      }`} style = {{fontFamily: "Inter, serif"}}
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
            <RotateCcw size={22} />
          </div>

          <h1
            className={`text-[26px] font-semibold ${
              darkPolicy ? "text-[#f5f5f5]" : "text-[#3a2a1a]"
            }`}
            style={{ fontFamily: "Inter, serif" }}
          >
            Refund Policy
          </h1>
        </div>

        {/* INTRO */}
        <p
          className={`text-sm mb-8 ${
            darkPolicy ? "text-[#b5b5b5]" : "text-[#6b5a48]"
          }`}
        >
          At <span className="font-medium">SketchCraft</span>, every artwork is
          handcrafted with care. Please read our refund policy carefully before
          placing an order.
        </p>

        <Section
          dark={darkPolicy}
          title="1. Custom Artwork Policy"
          content="All artworks are custom-made based on the customer’s request. Due to the personalized nature of the service, refunds are generally not provided once work has begun."
        />

        <Section
          dark={darkPolicy}
          title="2. Order Cancellation"
          content="Orders may be cancelled only before the artist has started working on the sketch. Once the artwork process has started, cancellations are not accepted."
        />

        <Section
          dark={darkPolicy}
          title="3. Revision Support"
          content="We offer revisions as per the selected package to ensure customer satisfaction. Revision requests do not qualify for refunds."
        />

        <Section
          dark={darkPolicy}
          title="4. Damaged or Incorrect Orders"
          content="If you receive an incorrect or damaged final product, please contact us within 48 hours of delivery. We will review and resolve the issue appropriately."
        />

        <Section
          dark={darkPolicy}
          title="5. Payment Disputes"
          content="Any unauthorized payment disputes should be reported immediately. We reserve the right to suspend services in case of fraudulent activity."
        />

        <Section
          dark={darkPolicy}
          title="6. Policy Updates"
          content="SketchCraft reserves the right to update this Refund Policy at any time. Changes will be effective immediately upon posting."
        />

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

/* SECTION COMPONENT (SAME AS TOS) */
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
        dark ? "text-white" : "text-[#6b5a48]"
      }`}
    >
      {content}
    </p>
  </div>
);
