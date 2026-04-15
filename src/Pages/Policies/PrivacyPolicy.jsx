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

export default function PrivacyPolicy({ isDark }) {

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
        <motion.div variants={itemVariants} className="flex items-center justify-between gap-3 mb-6">
          <h1
            className={`text-[28px] font-semibold ${
              isDark ? "text-[#f5f5f5]" : "text-black"
            }`}
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Privacy Policy
          </h1>
        </motion.div>

        {/* INTRO */}
        <motion.p
          variants={itemVariants}
          className={`text-sm mb-8 leading-relaxed ${
            isDark ? "text-[#b5b5b5]" : "text-black"
          }`}
        >
          At <span className="font-bold">Artistic</span>, we value your privacy and are committed to protecting your personal information. 
          This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
          <br />
          By using Artistic, you consent to the practices described in this Privacy Policy.
        </motion.p>

        <Section
          dark={isDark}
          title="1. Information We Collect"
          content={
            <>
              We may collect the following types of information:<br /><br />

              <span className={`font-semibold ${isDark ? "text-white" : "text-black"}`}>
                a) Personal Information
              </span><br />

              <Dot className="inline mr-1"/>Full name<br />
              <Dot className="inline mr-1"/>Email address<br />
              <Dot className="inline mr-1"/>Contact details (Phone Number, Delivery Address)<br />
              <Dot className="inline mr-1"/>Payment Information (UPI Transaction IDs handled securely)<br />
              <Dot className="inline mr-1"/>Order details and submitted images<br /><br />

              <span className={`font-semibold ${isDark ? "text-white" : "text-black"}`}>
                b) Non-Personal Information
              </span><br />

              <Dot className="inline mr-1"/>Browser type<br />
              <Dot className="inline mr-1"/>Device information<br />
              <Dot className="inline mr-1"/>IP address<br />
              <Dot className="inline mr-1"/>Website usage data
            </>
          }
        />

        <Section
          dark={isDark}
          title="2. How We Use Your Information"
          content={
            <>
              We use the collected information to:<br /><br />
              <Dot className="inline mr-1"/>Process, manage, and deliver your custom orders<br />
              <Dot className="inline mr-1"/>Communicate order updates, payment requests, and support responses<br />
              <Dot className="inline mr-1"/>Improve website functionality and user experience<br />
              <Dot className="inline mr-1"/>Prevent fraud and unauthorized activity<br />
              <Dot className="inline mr-1"/>Comply with legal obligations<br /><br />
              We only use your information for legitimate business purposes.
            </>
          }
        />

        <Section
          dark={isDark}
          title="3. Data Protection & Security"
          content={
            <>
              Artistic implements appropriate technical and organizational security measures to protect your personal information against:<br /><br />
              <Dot className="inline mr-1"/>Unauthorized access<br />
              <Dot className="inline mr-1"/>Data loss<br />
              <Dot className="inline mr-1"/>Misuse or alteration<br /><br />
              However, no method of transmission over the internet is 100% secure. We encourage you to use caution when submitting highly sensitive images.
            </>
          }
        />

        <Section
          dark={isDark}
          title="4. Sharing of Information"
          content={
            <>
              We do not sell, rent, or trade your personal information.<br /><br />
              We may share information only in the following cases:<br /><br />
              <Dot className="inline mr-1"/>With trusted third-party delivery/shipping partners<br />
              <Dot className="inline mr-1"/>When required by law<br />
              <Dot className="inline mr-1"/>To protect legal rights or prevent fraud
            </>
          }
        />

        <Section
          dark={isDark}
          title="5. Cookies & Tracking Technologies"
          content={
            <>
              Our website may use cookies and similar technologies to:<br /><br />
              <Dot className="inline mr-1"/>Enhance user experience<br />
              <Dot className="inline mr-1"/>Analyze website traffic<br />
              <Dot className="inline mr-1"/>Improve performance
            </>
          }
        />

        <Section
          dark={isDark}
          title="6. Third-Party Services"
          content={
            <>
              We may use third-party services for:<br /><br />
              <Dot className="inline mr-1"/>Payment processing (e.g., UPI providers)<br />
              <Dot className="inline mr-1"/>Analytics<br />
              <Dot className="inline mr-1"/>Website hosting and database management
            </>
          }
        />

        <Section
          dark={isDark}
          title="7. Data Retention"
          content={
            <>
              We retain personal information only as necessary to:<br /><br />
              <Dot className="inline mr-1"/>Fulfill orders and physical shipping<br />
              <Dot className="inline mr-1"/>Comply with legal obligations<br />
              <Dot className="inline mr-1"/>Resolve disputes<br />
              <Dot className="inline mr-1"/>Enforce agreements
            </>
          }
        />

        <Section
          dark={isDark}
          title="8. Your Rights"
          content={
            <>
              You have the right to:<br /><br />
              <Dot className="inline mr-1"/>Request access to the personal data we hold<br />
              <Dot className="inline mr-1"/>Request correction of inaccurate data<br />
              <Dot className="inline mr-1"/>Request deletion of your data (post-delivery)<br />
              <Dot className="inline mr-1"/>Withdraw consent
            </>
          }
        />

        <Section
          dark={isDark}
          title="9. Children’s Privacy"
          content={
            <>
              We do not knowingly collect personal information from children under 18 years of age without parental consent.
            </>
          }
        />

        <Section
          dark={isDark}
          title="10. Policy Updates"
          content={
            <>
              We may update this Privacy Policy periodically. Continued use of our site means you agree to the latest policy.
            </>
          }
        />

        <Section
          dark={isDark}
          title="11. Contact Us"
          content={
            <>
              <Dot className="inline mr-1"/>Email: artistic.official12@gmail.com<br />
              <Dot className="inline mr-1"/>Phone: +91 0000000000
            </>
          }
        />

        <motion.div
          variants={itemVariants}
          className={`mt-8 text-xs ${
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