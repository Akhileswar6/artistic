import { motion } from "framer-motion";
import { useEffect } from "react";
import { Dot } from "lucide-react";

export default function RefundPolicy({ isDark }) {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      className={`w-full min-h-screen transition-colors duration-300 ${
        isDark ? "bg-[#0f0f0f]" : "bg-[#fbf8f3]"
      }`}
      style={{ fontFamily: "Inter, serif" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`max-w-5xl mx-auto shadow-lg rounded-lg p-10 transition-colors duration-300 ${
          isDark ? "bg-[#0e0e12]" : "bg-white"
        }`}
      >
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <h1
            className={`text-[28px] font-semibold ${
              isDark ? "text-[#f5f5f5]" : "text-[#3a2a1a]"
            }`}
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Refund Policy
          </h1>
        </div>

        {/* INTRO */}
        <p
          className={`text-sm mb-8 leading-relaxed ${
            isDark ? "text-[#b5b5b5]" : "text-black"
          }`}
        >
          At <span className="font-bold">artistic</span>, every artwork is thoughtfully crafted and customized based on individual client requests. Due to the personalized nature of our services, we encourage customers to review this Refund Policy carefully before placing an order.
          <br /><br />
          By placing an order with artistic, you agree to the terms outlined below.
        </p>

        <Section
          dark={isDark}
          title="1. Custom Artwork Policy"
          content={
            <>
              All artworks provided by artistic are custom-made and created specifically based on the images, references, and instructions submitted by the customer.
              <br /><br />
              Because each order is personalized:
              <br /><br />
              <Dot className="inline mr-1"/>Refunds are generally not provided once work has commenced.
              <br />
              <Dot className="inline mr-1"/>Minor artistic variations do not qualify as grounds for refund.
              <br />
              <Dot className="inline mr-1"/>Customers are responsible for providing accurate references and instructions at the time of order.
            </>
          }
        />

        <Section
          dark={isDark}
          title="2. Order Cancellation"
          content={
            <>
              Orders may be canceled only under the following condition:
              <br /><br />
              <Dot className="inline mr-1"/>The cancellation request is made before the artwork process has begun.
              <br /><br />
              Once the artist has started working on the order, cancellations are not permitted due to the time and effort invested.
            </>
          }
        />

        <Section
          dark={isDark}
          title="3. Revisions"
          content={
            <>
              artistic may offer revisions depending on the selected package or agreement.
              <br /><br />
              Please note:
              <br /><br />
              <Dot className="inline mr-1"/>Revisions are intended to refine the artwork within reasonable limits.
              <br />
              <Dot className="inline mr-1"/>Revision requests do not qualify for refunds.
              <br />
              <Dot className="inline mr-1"/>Excessive or unreasonable revision requests may be declined at our discretion.
            </>
          }
        />

        <Section
          dark={isDark}
          title="4. Incorrect or Damaged Deliverables"
          content={
            <>
              If you receive:
              <br /><br />
              An incorrect final file, or
              <br />
              <Dot className="inline mr-1"/>A damaged digital deliverable,
              <br /><br />
              <Dot className="inline mr-1"/>You must notify us within 48 hours of delivery.
              <br /><br />
              We will review the issue and may:
              <br /><br />
              <Dot className="inline mr-1"/>Correct and resend the file, or
              <br />
              <Dot className="inline mr-1"/>Provide an appropriate resolution at our discretion.
              <br /><br />
              Failure to report issues within the stated timeframe may limit our ability to assist.
            </>
          }
        />

        <Section
          dark={isDark}
          title="5. Payment Disputes & Fraud Prevention"
          content={
            <>
              If you notice any unauthorized payment activity, please contact us immediately.
              <br /><br />
              artistic reserves the right to:
              <br /><br />
              <Dot className="inline mr-1"/>Suspend services in cases of suspected fraud
              <br />
              <Dot className="inline mr-1"/>Refuse future orders
              <br />
              <Dot className="inline mr-1"/>Take necessary action to protect against chargeback abuse
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
              <Dot className="inline mr-1"/>Change of mind after order confirmation
              <br />
              <Dot className="inline mr-1"/>Dissatisfaction based on personal artistic preference
              <br />
              <Dot className="inline mr-1"/>Delays caused by incomplete or unclear submissions
            </>
          }
        />

        <Section
          dark={isDark}
          title="7. Policy Updates"
          content={
            <>
              artistic reserves the right to update or modify this Refund Policy at any time. Updates will be posted on this page with a revised “Last Updated” date.
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
              <Dot className="inline mr-1"/>Email: support@artistic.com
              <br />
              <Dot className="inline mr-1"/>Phone: +1 (555) 123-4567
            </>
          }
        />

        <div
          className={`mt-10 text-xs ${
            isDark ? "text-[#888]" : "text-black"
          }`}
        >
          Last updated: February 27, 2026
        </div>

      </motion.div>
    </div>
  );
}

/* SECTION COMPONENT */
const Section = ({ title, content, dark }) => (
  <div className="mb-6">
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
  </div>
);