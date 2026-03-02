import { Dot } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function CancellationPolicy({ isDark }) {

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
            Cancellation Policy
          </h1>
        </div>

        {/* INTRO */}
        <p
          className={`text-sm mb-8 leading-relaxed ${
            isDark ? "text-[#b5b5b5]" : "text-black"
          }`}
        >
          At <span className="font-bold">artistic</span>, every artwork is individually crafted based on the client’s submitted images and instructions. Due to the customized nature of our services, cancellations are governed by the terms outlined below.
          <br /><br />
          By placing an order with artistic, you acknowledge and agree to this Cancellation Policy.
        </p>

        {/* SECTIONS */}
        <Section
          dark={isDark}
          title="1. Order Confirmation"
          content={
            <>
              An order is considered confirmed once:
              <br /><br />
              <Dot className="inline-block mr-1"/>Payment has been successfully completed, and
              <br />
              <Dot className="inline-block mr-1"/>The order details have been submitted and accepted.
              <br /><br />
              Upon confirmation, the order is scheduled and added to the production queue. Preparation for artwork creation may begin immediately.
              <br /><br />
              Customers are responsible for reviewing all details carefully before confirming their order.
            </>
          }
        />

        <Section
          dark={isDark}
          title="2. Cancellation Before Work Begins"
          content={
            <>
              Cancellation requests may be accepted only if:
              <br /><br />
              <Dot className="inline-block mr-1"/>The artist has not yet started working on the artwork.
              <br /><br />
              If a cancellation request is submitted before production begins:
              <br /><br />
              <Dot className="inline-block mr-1"/>It will be reviewed promptly.
              <br />
              <Dot className="inline-block mr-1"/>Refund eligibility will be handled in accordance with our Refund Policy.
              <br /><br />
              artistic reserves the right to determine whether production has commenced.
            </>
          }
        />

        <Section
          dark={isDark}
          title="3. Cancellation After Work Begins"
          content={
            <>
              Once the artwork creation process has started:
              <br /><br />
              <Dot className="inline-block mr-1"/>Cancellations are not permitted.
              <br />
              <Dot className="inline-block mr-1"/>Refunds will generally not be issued.
              <br />
              <Dot className="inline-block mr-1"/>Partial refunds are not guaranteed.
              <br /><br />
              This policy exists because time, effort, and creative resources are invested at the beginning of the production process.
            </>
          }
        />

        <Section
          dark={isDark}
          title="4. Customer Delays & Unresponsiveness"
          content={
            <>
              To ensure timely delivery:
              <br /><br />
              <Dot className="inline-block mr-1"/>Customers must respond to clarification or revision requests within a reasonable timeframe.
              <br />
              <Dot className="inline-block mr-1"/>If a customer becomes unresponsive, the project may be completed based on the original instructions provided.
              <br />
              <Dot className="inline-block mr-1"/>In prolonged cases of inactivity, the order may be closed at our discretion.
              <br /><br />
              artistic is not responsible for delays caused by incomplete submissions or lack of communication.
            </>
          }
        />

        <Section
          dark={isDark}
          title="5. Exceptional Circumstances"
          content={
            <>
              In rare and unforeseen circumstances such as:
              <br /><br />
              <Dot className="inline-block mr-1"/>Technical failures
              <br />
              <Dot className="inline-block mr-1"/>Operational disruptions
              <br />
              <Dot className="inline-block mr-1"/>Emergencies beyond our control
              <br /><br />
              Cancellation requests may be reviewed individually.
              <br /><br />
              Approval of such requests is at the sole discretion of artistic and is not guaranteed.
            </>
          }
        />

        <Section
          dark={isDark}
          title="6. Policy Updates"
          content={
            <>
              artistic reserves the right to modify or update this Cancellation Policy at any time. Any changes will be reflected on this page with a revised “Last Updated” date.
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
              <Dot className="inline-block mr-1"/>Email: support@artistic.com
              <br />
              <Dot className="inline-block mr-1"/>Phone: +1 (555) 123-4567
            </>
          }
        />

        {/* FOOTER */}
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
  </div>
);