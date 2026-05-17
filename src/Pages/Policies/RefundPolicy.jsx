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
              Refund Policy
            </h1>
          </div>
        </motion.div>

        {/* INTRO */}
        <motion.p
          variants={itemVariants}
          className={`text-xs sm:text-sm mb-8 leading-relaxed opacity-80 ${isDark ? "text-[#b5b5b5]" : "text-black"
            }`}
        >
          At <span className="font-bold">artistic</span>, every artwork is thoughtfully crafted and customized based on individual client requests. Due to the personalized nature of our services, we encourage customers to review this Refund Policy carefully before placing an order.
          <br /><br />
          By placing an order with artistic, you agree to the terms outlined below.
        </motion.p>

        <div className="space-y-8">
          <Section
            dark={isDark}
            title="1. Custom Artwork Policy & 25% Advance"
            content={
              <div className="space-y-4">
                <p>All artworks provided by Artistic are custom-made specifically based on the images and instructions submitted by the customer.</p>
                <p>To initiate production, a non-refundable <span className="font-bold underline">25% Advance Payment</span> is required.</p>
                <p>Because each order is personalized:</p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2"><Dot className="shrink-0 mt-1" /><span>The 25% advance payment strictly covers the artist's initial time, effort, and materials.</span></div>
                  <div className="flex items-start gap-2"><Dot className="shrink-0 mt-1" /><span>Refunds are not provided once the artist reaches the "Payment Done" or "In Progress" stage.</span></div>
                </div>
              </div>
            }
          />

          <Section
            dark={isDark}
            title="2. Full Refunds"
            content={
              <div className="space-y-4">
                <p>A full refund (including any advance paid) will only be issued if:</p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2"><Dot className="shrink-0 mt-1" /><span>The cancellation request is made <b>before</b> the artwork process has begun (before you pay the 25% advance or before we update the status to "Payment Done").</span></div>
                  <div className="flex items-start gap-2"><Dot className="shrink-0 mt-1" /><span>Artistic is unable to fulfill the order due to operational disruptions.</span></div>
                </div>
              </div>
            }
          />

          <Section
            dark={isDark}
            title="3. Final Payment (75% Balance)"
            content={
              <div className="space-y-4">
                <p>Once your artwork is completed, we will notify you to submit the remaining 75% balance along with any frame costs if applicable.</p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2"><Dot className="shrink-0 mt-1" /><span>Shipping will only commence after the balance is paid.</span></div>
                  <div className="flex items-start gap-2"><Dot className="shrink-0 mt-1" /><span>If you are unsatisfied with the final result despite standard revisions, the 25% advance remains non-refundable, but you are not obligated to pay the final 75% balance if you choose to abandon the order.</span></div>
                </div>
              </div>
            }
          />

          <Section
            dark={isDark}
            title="4. Revisions"
            content={
              <div className="space-y-4">
                <p>Artistic offers minor revisions to ensure you receive a beautiful final product.</p>
                <p>Please note:</p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2"><Dot className="shrink-0 mt-1" /><span>Revisions are intended to refine the artwork within reasonable limits.</span></div>
                  <div className="flex items-start gap-2"><Dot className="shrink-0 mt-1" /><span>Revision requests do not qualify as grounds for a refund.</span></div>
                  <div className="flex items-start gap-2"><Dot className="shrink-0 mt-1" /><span>Extensive change requests that deviate from original instructions may incur additional fees.</span></div>
                </div>
              </div>
            }
          />

          <Section
            dark={isDark}
            title="5. Damaged Frames or Incorrect Deliverables"
            content={
              <div className="space-y-4">
                <p>If you order a physical frame and it arrives damaged, or if you receive an incorrect digital deliverable, you must notify us within <b>48 hours of delivery</b>.</p>
                <p>Please provide clear photographic evidence. We will review the issue and may:</p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2"><Dot className="shrink-0 mt-1" /><span>Correct and resend the digital file, or</span></div>
                  <div className="flex items-start gap-2"><Dot className="shrink-0 mt-1" /><span>Provide a replacement for the damaged physical item at our discretion.</span></div>
                </div>
                <p className="italic opacity-80">Failure to report issues within 48 hours limits our ability to assist.</p>
              </div>
            }
          />

          <Section
            dark={isDark}
            title="6. Non-Refundable Circumstances"
            content={
              <div className="space-y-4">
                <p>Refunds will not be issued for:</p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2"><Dot className="shrink-0 mt-1" /><span>Change of mind after the 25% advance payment is made.</span></div>
                  <div className="flex items-start gap-2"><Dot className="shrink-0 mt-1" /><span>Dissatisfaction based on personal artistic preference.</span></div>
                  <div className="flex items-start gap-2"><Dot className="shrink-0 mt-1" /><span>Delays caused by incomplete submissions or unresponsiveness.</span></div>
                </div>
              </div>
            }
          />

          <Section
            dark={isDark}
            title="7. Policy Updates"
            content={
              <p>Artistic reserves the right to update or modify this Refund Policy at any time. Updates will be posted on this page with a revised “Last Updated” date.</p>
            }
          />

          <Section
            dark={isDark}
            title="8. Contact Us"
            content={
              <div className="space-y-4 mt-2">
                <p>If you have any questions or concerns about this Refund Policy, please contact us at:</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2"><Dot className="shrink-0" /><span>Email: artistic.official12@gmail.com</span></div>
                  <div className="flex items-center gap-2"><Dot className="shrink-0" /><span>Phone: +91 9392822250</span></div>
                </div>
              </div>
            }
          />
        </div>

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
      className={`text-sm sm:text-base md:text-lg font-semibold mb-2 transition-colors duration-300 ${dark ? "text-white group-hover:text-white" : "text-[#2d1f12] group-hover:text-black"
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