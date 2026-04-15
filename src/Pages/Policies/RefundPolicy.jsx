import { motion } from "framer-motion";
import { useEffect } from "react";
import { Dot } from "lucide-react";

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

export default function RefundPolicy({ isDark }) {

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
            Refund Policy
          </h1>
        </motion.div>

        {/* INTRO */}
        <motion.p
          variants={itemVariants}
          className={`text-sm mb-8 leading-relaxed ${
            isDark ? "text-[#b5b5b5]" : "text-black"
          }`}
        >
          At <span className="font-bold">artistic</span>, every artwork is thoughtfully crafted and customized based on individual client requests. Due to the personalized nature of our services, we encourage customers to review this Refund Policy carefully before placing an order.
          <br /><br />
          By placing an order with artistic, you agree to the terms outlined below.
        </motion.p>

        <Section
          dark={isDark}
          title="1. Custom Artwork Policy & 25% Advance"
          content={
            <>
              All artworks provided by Artistic are custom-made specifically based on the images and instructions submitted by the customer.
              <br /><br />
              To initiate production, a non-refundable <span className="font-semibold text-orange-500">25% Advance Payment</span> is required.
              <br /><br />
              Because each order is personalized:
              <br />
              <Dot className="inline mr-1"/>The 25% advance payment strictly covers the artist's initial time, effort, and materials.
              <br />
              <Dot className="inline mr-1"/>Refunds are not provided once the artist reaches the "Payment Done" or "In Progress" stage.
            </>
          }
        />

        <Section
          dark={isDark}
          title="2. Full Refunds"
          content={
            <>
              A full refund (including any advance paid) will only be issued if:
              <br /><br />
              <Dot className="inline mr-1"/>The cancellation request is made <b>before</b> the artwork process has begun (before you pay the 25% advance or before we update the status to "Payment Done").
              <br />
              <Dot className="inline mr-1"/>Artistic is unable to fulfill the order due to operational disruptions.
            </>
          }
        />

        <Section
          dark={isDark}
          title="3. Final Payment (75% Balance)"
          content={
            <>
              Once your artwork is completed, we will notify you to submit the remaining 75% balance along with any frame costs if applicable.
              <br /><br />
              <Dot className="inline mr-1"/>Shipping will only commence after the balance is paid.
              <br />
              <Dot className="inline mr-1"/>If you are unsatisfied with the final result despite standard revisions, the 25% advance remains non-refundable, but you are not obligated to pay the final 75% balance if you choose to abandon the order.
            </>
          }
        />

        <Section
          dark={isDark}
          title="4. Revisions"
          content={
            <>
              Artistic offers minor revisions to ensure you receive a beautiful final product.
              <br /><br />
              Please note:
              <br /><br />
              <Dot className="inline mr-1"/>Revisions are intended to refine the artwork within reasonable limits.
              <br />
              <Dot className="inline mr-1"/>Revision requests do not qualify as grounds for a refund.
              <br />
              <Dot className="inline mr-1"/>Extensive change requests that deviate from original instructions may incur additional fees.
            </>
          }
        />

        <Section
          dark={isDark}
          title="5. Damaged Frames or Incorrect Deliverables"
          content={
            <>
              If you order a physical frame and it arrives damaged, or if you receive an incorrect digital deliverable, you must notify us within <b>48 hours of delivery</b>.
              <br /><br />
              Please provide clear photographic evidence. We will review the issue and may:
              <br /><br />
              <Dot className="inline mr-1"/>Correct and resend the digital file, or
              <br />
              <Dot className="inline mr-1"/>Provide a replacement for the damaged physical item at our discretion.
              <br /><br />
              Failure to report issues within 48 hours limits our ability to assist.
            </>
          }
        />

        <Section
          dark={isDark}
          title="6. Non-Refundable Circumstances"
          content={
            <>
              Refunds will not be issued for:
              <br /><br />
              <Dot className="inline mr-1"/>Change of mind after the 25% advance payment is made.
              <br />
              <Dot className="inline mr-1"/>Dissatisfaction based on personal artistic preference.
              <br />
              <Dot className="inline mr-1"/>Delays caused by incomplete submissions or unresponsiveness.
            </>
          }
        />

        <Section
          dark={isDark}
          title="7. Policy Updates"
          content={
            <>
              Artistic reserves the right to update or modify this Refund Policy at any time. Updates will be posted on this page with a revised “Last Updated” date.
            </>
          }
        />

        <Section
          dark={isDark}
          title="8. Contact Us"
          content={
            <>
              If you have any questions or concerns about this Refund Policy, please contact us at:
              <br /><br />
              <Dot className="inline mr-1"/>Email: artistic.official12@gmail.com
              <br />
              <Dot className="inline mr-1"/>Phone: +91 0000000000
            </>
          }
        />

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
        dark ? "text-white" : "text-black"
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