import { Dot } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import PolicyNavbar from "../../Components/PolicyNavbar.jsx";

export default function CancellationPolicy() {
const [darkPolicy, setDarkPolicy] = useState(
  localStorage.getItem("policyTheme") === "dark"
);



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
          
          

          <h1
            className={`text-[28px] font-semibold ${
              darkPolicy ? "text-[#f5f5f5]" : "text-[#3a2a1a]"
            }`}
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Cancellation Policy
          </h1>
        </div>

        {/* INTRO */}
        <p
          className={`text-sm mb-8 ${
            darkPolicy ? "text-[#b5b5b5]" : "text-black"
          }`}
        >
         At <span className="font-bold">artistic</span>, every artwork is individually crafted based on the client’s submitted images and instructions. Due to the customized nature of our services, cancellations are governed by the terms outlined below.<br/>

By placing an order with artistic, you acknowledge and agree to this Cancellation Policy.
        </p>

        {/* SECTIONS */}
        <Section
          dark={darkPolicy}
          title="1. Order Confirmation"
          content = {<>An order is considered confirmed once:<br/>

<Dot className="inline-block "/>Payment has been successfully completed, and<br/>

<Dot className="inline-block "/>The order details have been submitted and accepted.<br/>

Upon confirmation, the order is scheduled and added to the production queue. Preparation for artwork creation may begin immediately.<br/>

Customers are responsible for reviewing all details carefully before confirming their order.</>}
        />

        <Section
          dark={darkPolicy}
          title="2. Cancellation Before Work Begins"
          content = {<>Cancellation requests may be accepted only if:<br/>

<Dot className="inline-block "/>The artist has not yet started working on the artwork.<br/>

If a cancellation request is submitted before production begins:<br/>

<Dot className="inline-block "/>It will be reviewed promptly.<br/>

<Dot className="inline-block "/>Refund eligibility will be handled in accordance with our Refund Policy.<br/>

artistic reserves the right to determine whether production has commenced.</>}
        />

        <Section
          dark={darkPolicy}
          title="3. Cancellation After Work Begins"
          content = {<>Once the artwork creation process has started:<br/>

<Dot className="inline-block "/>Cancellations are not permitted.<br/>

<Dot className="inline-block "/>Refunds will generally not be issued.<br/>

<Dot className="inline-block "/>Partial refunds are not guaranteed.<br/>

This policy exists because time, effort, and creative resources are invested at the beginning of the production process.</>}
        />

        <Section
          dark={darkPolicy}
          title="4. Customer Delays & Unresponsiveness"
          content = {<>To ensure timely delivery:<br/>

<Dot className="inline-block "/>Customers must respond to clarification or revision requests within a reasonable timeframe.<br/>

<Dot className="inline-block "/>If a customer becomes unresponsive, the project may be completed based on the original instructions provided.<br/>

<Dot className="inline-block "/>In prolonged cases of inactivity, the order may be closed at our discretion.<br/>

artistic is not responsible for delays caused by incomplete submissions or lack of communication.</>}
        />

        <Section
          dark={darkPolicy}
          title="5. Exceptional Circumstances"
          content={<>In rare and unforeseen circumstances such as:<br/>

<Dot className="inline-block "/>Technical failures<br/>

<Dot className="inline-block "/>Operational disruptions<br/>

<Dot className="inline-block "/>Emergencies beyond our control<br/>

Cancellation requests may be reviewed individually.<br/>

Approval of such requests is at the sole discretion of artistic and is not guaranteed.</>}
        />

        <Section
          dark={darkPolicy}
          title="6. Policy Updates"
          content = {<>artistic reserves the right to modify or update this Cancellation Policy at any time. Any changes will be reflected on this page with a revised “Last Updated” date. Continued use of our services constitutes acceptance of the updated policy.</>}

        />

        <Section
          dark={darkPolicy}
          title="7. Contact Us"
          content = {<>If you have questions regarding cancellations, please contact:<br/>

<Dot className="inline-block "/>Email: support@artistic.com<br/>

<Dot className="inline-block "/>Phone: +1 (555) 123-4567</>}

        />

        {/* FOOTER */}
        <div
          className={`mt-10 text-xs ${
            darkPolicy ? "text-[#888]" : "text-black"
          }`}
        >
          Last updated: February 27, 2026

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
        dark ? "text-[#b5b5b5]" : "text-black"
      }`}
    >
      {content}
    </p>
  </div>
);
