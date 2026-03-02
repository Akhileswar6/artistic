import { Dot } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function PrivacyPolicy({ isDark }) {

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
        <div className="flex items-center justify-between gap-3 mb-6">
          <h1
            className={`text-[28px] font-semibold ${
              isDark ? "text-[#f5f5f5]" : "text-black"
            }`}
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Privacy Policy
          </h1>
        </div>

        {/* INTRO */}
        <p
          className={`text-sm mb-8 leading-relaxed ${
            isDark ? "text-[#b5b5b5]" : "text-black"
          }`}
        >
          At <span className="font-bold">artistic</span>, we value your privacy and are committed to protecting your personal information. 
          This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
          <br />
          By using artistic, you consent to the practices described in this Privacy Policy.
        </p>

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
              <Dot className="inline mr-1"/>Contact details<br />
              <Dot className="inline mr-1"/>Payment information (processed securely via third-party providers)<br />
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
              <Dot className="inline mr-1"/>Process and manage your orders<br />
              <Dot className="inline mr-1"/>Communicate order updates and support responses<br />
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
              artistic implements appropriate technical and organizational security measures to protect your personal information against:<br /><br />
              <Dot className="inline mr-1"/>Unauthorized access<br />
              <Dot className="inline mr-1"/>Data loss<br />
              <Dot className="inline mr-1"/>Misuse or alteration<br /><br />
              However, no method of transmission over the internet is 100% secure.
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
              <Dot className="inline mr-1"/>With trusted third-party service providers<br />
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
              <Dot className="inline mr-1"/>Payment processing<br />
              <Dot className="inline mr-1"/>Analytics<br />
              <Dot className="inline mr-1"/>Website hosting
            </>
          }
        />

        <Section
          dark={isDark}
          title="7. Data Retention"
          content={
            <>
              We retain personal information only as necessary to:<br /><br />
              <Dot className="inline mr-1"/>Fulfill orders<br />
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
              <Dot className="inline mr-1"/>Request access<br />
              <Dot className="inline mr-1"/>Request correction<br />
              <Dot className="inline mr-1"/>Request deletion<br />
              <Dot className="inline mr-1"/>Withdraw consent
            </>
          }
        />

        <Section
          dark={isDark}
          title="9. Children’s Privacy"
          content={
            <>
              We do not knowingly collect personal information from children under 13 years of age.
            </>
          }
        />

        <Section
          dark={isDark}
          title="10. Policy Updates"
          content={
            <>
              We may update this Privacy Policy periodically.
            </>
          }
        />

        <Section
          dark={isDark}
          title="11. Contact Us"
          content={
            <>
              <Dot className="inline mr-1"/>Email: artistic@gmail.com<br />
              <Dot className="inline mr-1"/>Phone: +1 (555) 123-4567
            </>
          }
        />

        <div
          className={`mt-8 text-xs ${
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