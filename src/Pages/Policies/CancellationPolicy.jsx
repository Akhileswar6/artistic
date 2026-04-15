import { Dot } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function CancellationPolicy({ isDark }) {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      className={`relative w-full min-h-screen py-16 px-4 md:px-8 overflow-hidden transition-colors duration-500 ${
        isDark ? "bg-[#080808]" : "bg-[#faf9f6]"
      }`}
      style={{ fontFamily: "Inter, serif" }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`relative z-10 max-w-5xl mx-auto shadow-2xl rounded-2xl p-8 md:p-12 backdrop-blur-xl border transition-all duration-300 ${
          isDark ? "bg-[#0A0A0C]/80 border-white/5 shadow-black/50" : "bg-white/80 border-gray-200/50 shadow-xl"
        }`}
      >
        {/* HEADER */}
        <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
          <h1
            className={`text-[28px] font-semibold ${
              isDark ? "text-[#f5f5f5]" : "text-[#3a2a1a]"
            }`}
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Cancellation Policy
          </h1>
        </motion.div>

        {/* INTRO */}
        <motion.p
          variants={itemVariants}
          className={`text-sm mb-8 leading-relaxed ${
            isDark ? "text-[#b5b5b5]" : "text-black"
          }`}
        >
          At <span className="font-bold">artistic</span>, every artwork is individually crafted based on the client’s submitted images and instructions. Due to the customized nature of our services, cancellations are governed by the terms outlined below.
          <br /><br />
          By placing an order with artistic, you acknowledge and agree to this Cancellation Policy.
        </motion.p>

        {/* SECTIONS */}
        <Section
          dark={isDark}
          title="1. Order Confirmation & Advance Payment"
          content={
            <>
              An order is considered confirmed once:
              <br /><br />
              <Dot className="inline-block mr-1"/>The artist reviews and accepts your custom order request.
              <br />
              <Dot className="inline-block mr-1"/>The mandatory 25% Advance Payment has been successfully verified.
              <br /><br />
              Upon confirmation of the advance payment, your order is added to the production queue, and preparation for artwork creation begins immediately.
            </>
          }
        />

        <Section
          dark={isDark}
          title="2. Cancellation Before Work Begins"
          content={
            <>
              Cancellation requests are accepted under the following conditions:
              <br /><br />
              <Dot className="inline-block mr-1"/>Your order is still in the "Pending" or "Accepted" stage.
              <br />
              <Dot className="inline-block mr-1"/>You have not yet made the 25% advance payment.
              <br /><br />
              If you wish to cancel during this time, your request will be processed immediately without any charges.
            </>
          }
        />

        <Section
          dark={isDark}
          title="3. Cancellation After Advance Payment"
          content={
            <>
              Once the 25% advance payment is completed and work has commenced (status changes to "Payment Done" or "In Progress"):
              <br /><br />
              <Dot className="inline-block mr-1"/>The order cannot be cancelled.
              <br />
              <Dot className="inline-block mr-1"/>The 25% advance payment is strictly non-refundable.
              <br /><br />
              This policy ensures that the artist is fairly compensated for the time, effort, and creative resources invested at the beginning of the production process.
            </>
          }
        />

        <Section
          dark={isDark}
          title="4. Customer Delays & Unresponsiveness"
          content={
            <>
              To ensure timely delivery, customers are expected to:
              <br /><br />
              <Dot className="inline-block mr-1"/>Respond to clarification requests promptly.
              <br />
              <Dot className="inline-block mr-1"/>Complete the final 75% balance payment upon artwork completion to initiate shipping.
              <br /><br />
              If a customer becomes unresponsive after the artwork is completed, or fails to pay the final balance within 30 days, Artistic reserves the right to close the order. The initial 25% advance remains non-refundable, and you forfeit the artwork.
            </>
          }
        />

        <Section
          dark={isDark}
          title="5. Exceptional Circumstances"
          content={
            <>
              In rare and unforeseen circumstances (e.g., severe technical failure or operational disruption on our end), Artistic may be unable to fulfill an order after the advance has been paid.
              <br /><br />
              In such cases, we will issue a full refund of any payments made, including the 25% advance.
            </>
          }
        />

        <Section
          dark={isDark}
          title="6. Policy Updates"
          content={
            <>
              Artistic reserves the right to modify or update this Cancellation Policy at any time. Any changes will be reflected on this page with a revised “Last Updated” date.
              <br /><br />
              Continued use of our services constitutes acceptance of the updated policy.
            </>
          }
        />

        <Section
          dark={isDark}
          title="7. Contact Us"
          content={
            <>
              If you have questions regarding cancellations, please contact:
              <br /><br />
              <Dot className="inline-block mr-1"/>Email: artistic.official12@gmail.com
              <br />
              <Dot className="inline-block mr-1"/>Phone: +91 0000000000
            </>
          }
        />

        {/* FOOTER */}
        <motion.div
          variants={itemVariants}
          className={`mt-10 text-xs ${
            isDark ? "text-[#888]" : "text-black"
          }`}
        >
          Last updated: February 27, 2026
        </motion.div>
      </motion.div>
    </div>
  );
}

/* SECTION COMPONENT */
const Section = ({ title, content, dark }) => (
  <motion.div variants={itemVariants} className="mb-6">
    <h2
      className={`text-[16px] font-semibold mb-2 ${
        dark ? "text-[#f0f0f0]" : "text-[#2d1f12]"
      }`}
    >
      {title}
    </h2>
    <p
      className={`text-sm leading-relaxed ${
        dark ? "text-[#b5b5b5]" : "text-black"
      }`}
    >
      {content}
    </p>
  </motion.div>
);