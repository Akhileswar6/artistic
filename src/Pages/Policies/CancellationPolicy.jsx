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
      className={`relative w-full min-h-screen pt-24 pb-10 sm:pt-32 sm:pb-16 px-6 sm:px-12 overflow-hidden transition-colors duration-500 ${isDark ? "bg-[#0f1115]" : "bg-white"
        }`}
      style={{ fontFamily: "Inter, serif" }}
    >


      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`relative z-10 max-w-6xl mx-auto shadow-2xl rounded-[1.5rem] p-6 sm:p-8 md:p-10 backdrop-blur-xl border transition-all duration-300 ${isDark ? "bg-[#0A0A0C]/80 border-white/5 shadow-black/50" : "bg-white/80 border-gray-200/50 shadow-xl"
          }`}
      >
        {/* HEADER */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-center mb-8">
            <h1 className={`text-3xl md:text-4xl font-bold tracking-tight text-center ${isDark ? "text-white" : "text-black"}`} style={{ fontFamily: "Bricolage Grotesque" }}>
              Cancellation Policy
            </h1>
          </div>
        </motion.div>

        {/* INTRO */}
        <motion.p
          variants={itemVariants}
          className={`text-xs sm:text-sm mb-8 leading-relaxed opacity-80 ${isDark ? "text-[#b5b5b5]" : "text-black"
            }`}
        >
          At <span className="font-bold">artistic</span>, every artwork is individually crafted based on the client’s submitted images and instructions. Due to the customized nature of our services, cancellations are governed by the terms outlined below.
          <br /><br />
          By placing an order with artistic, you acknowledge and agree to this Cancellation Policy.
        </motion.p>

        {/* SECTIONS */}
        <div className="space-y-8">
          <Section
            dark={isDark}
            title="1. Order Confirmation & Advance Payment"
            content={
              <>
                An order is considered confirmed once:
                <br /><br />
                <div className="flex items-start gap-2">
                  <Dot className="shrink-0 mt-1" />
                  <span>The artist reviews and accepts your custom order request.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Dot className="shrink-0 mt-1" />
                  <span>The mandatory 25% Advance Payment has been successfully verified.</span>
                </div>
                <br />
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
                <div className="flex items-start gap-2">
                  <Dot className="shrink-0 mt-1" />
                  <span>Your order is still in the "Pending" or "Accepted" stage.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Dot className="shrink-0 mt-1" />
                  <span>You have not yet made the 25% advance payment.</span>
                </div>
                <br />
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
                <div className="flex items-start gap-2">
                  <Dot className="shrink-0 mt-1" />
                  <span>The order cannot be cancelled.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Dot className="shrink-0 mt-1" />
                  <span>The 25% advance payment is strictly non-refundable.</span>
                </div>
                <br />
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
                <div className="flex items-start gap-2">
                  <Dot className="shrink-0 mt-1" />
                  <span>Respond to clarification requests promptly.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Dot className="shrink-0 mt-1" />
                  <span>Complete the final 75% balance payment upon artwork completion to initiate shipping.</span>
                </div>
                <br />
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
                <div className="flex items-start gap-2">
                  <Dot className="shrink-0 mt-1" />
                  <span>Email: artistic.official12@gmail.com</span>
                </div>
                <div className="flex items-start gap-2">
                  <Dot className="shrink-0 mt-1" />
                  <span>Phone: +91 9392822250</span>
                </div>
              </>
            }
          />
        </div>

        {/* FOOTER */}
        <motion.div
          variants={itemVariants}
          className={`mt-16 pt-8 border-t transition-colors duration-300 text-xs sm:text-sm ${isDark ? "text-[#888] border-white/5" : "text-gray-500 border-gray-200"
            }`}
        >
          Last updated: April, 2026
        </motion.div>
      </motion.div>
    </div>
  );
}

/* SECTION COMPONENT */
const Section = ({ title, content, dark }) => (
  <motion.div variants={itemVariants} className="group">
    <h2
      className={`text-sm sm:text-base md:text-lg font-semibold mb-2 transition-colors duration-300 ${dark ? "text-[#f0f0f0] group-hover:text-white" : "text-[#2d1f12] group-hover:text-black"
        }`}
    >
      {title}
    </h2>
    <div
      className={`text-xs sm:text-sm leading-relaxed transition-colors duration-300 ${dark ? "text-[#b5b5b5] group-hover:text-[#d5d5d5]" : "text-gray-700 group-hover:text-black"
        }`}
    >
      {content}
    </div>
  </motion.div>
);