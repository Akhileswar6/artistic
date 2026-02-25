import { Dot } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import PolicyNavbar from "../../Components/PolicyNavbar.jsx";

export default function PrivacyPolicy() {
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
          darkPolicy ? "bg-[#1a1a1a]" : "bg-white"
        }`}
        style={{ fontFamily: "Inter, serif" }}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between gap-3 mb-6">
          

          <h1
            className={`text-[26px] font-semibold ${
              darkPolicy ? "text-[#f5f5f5]" : "text-black"
            }`}
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Privacy Policy
          </h1>
                       <span className={`text-[12px] ${darkPolicy ? "text-white" : "text-black"}`}>
Last Updated: February 25, 2026<br /> 
       </span>
        </div>

        {/* INTRO */}
        <p
        
          className={`text-sm mb-8 ${
            darkPolicy ? "text-[#b5b5b5]" : "text-black"
          }`}
        >
         At <span className="font-bold">artistic</span>, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.<br/>
By using artistic, you consent to the practices described in this Privacy Policy
        </p>

        <Section
          dark={darkPolicy}
          title="1. Information We Collect"
          content={<>We may collect the following types of information:<br/>

<span className="font-semibold text-white">a) Personal Information</span><br/>

<Dot className="inline"/>Full name<br/>

<Dot className="inline"/>Email address<br/>

<Dot className="inline"/>Contact details<br/>

<Dot className="inline"/>Payment information (processed securely via third-party providers)<br/>

<Dot className="inline"/>Order details and submitted images<br/>

<span className="font-semibold text-white">b) Non-Personal Information</span>  <br/>

<Dot className="inline"/>Browser type<br/>

<Dot className="inline"/>Device information<br/>

<Dot className="inline"/>IP address<br/>

<Dot className="inline"/>Website usage data</>}
        />

        <Section
          dark={darkPolicy}
          title="2. How We Use Your Information"
          content={<>We use the collected information to:<br/>

<Dot className="inline"/>Process and manage your orders<br/>

<Dot className="inline"/>Communicate order updates and support responses<br/>

<Dot className="inline"/>Improve website functionality and user experience<br/>

  <Dot className="inline"/>Prevent fraud and unauthorized activity<br/>

<Dot className="inline"/>Comply with legal obligations<br/>

We only use your information for legitimate business purposes.</>}
        />

        <Section
          dark={darkPolicy}
          title="3. Data Protection & Security"
          content={<>artistic implements appropriate technical and organizational security measures to protect your personal information against:<br/>

<Dot className="inline"/>Unauthorized access<br/>

<Dot className="inline"/>Data loss<br/>

<Dot className="inline"/>Misuse or alteration<br/>

However, no method of transmission over the internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.</>}
        />

        <Section
          dark={darkPolicy}
          title="4. Sharing of Information"
          content = {<>We do not sell, rent, or trade your personal information.<br/>

We may share information only in the following cases:<br/>

<Dot className="inline"/>With trusted third-party service providers (such as payment gateways or hosting providers) to operate our services<br/>

<Dot className="inline"/>When required by law or legal process<br/>

<Dot className="inline"/>To protect our legal rights or prevent fraud<br/>

All third-party partners are expected to maintain confidentiality and data protection standards.</>}
        />

        <Section
          dark={darkPolicy}
          title="5. Cookies & Tracking Technologies"
          content = {<>Our website may use cookies and similar technologies to:<br/>

<Dot className="inline"/>Enhance user experience<br/>

<Dot className="inline"/>Analyze website traffic<br/>

<Dot className="inline"/>Improve performance<br/>

You may disable cookies through your browser settings. However, certain features of the website may not function properly if cookies are disabled.</>}
        />

        <Section
          dark={darkPolicy}
          title="6. Third-Party Services"
          content = {<>We may use third-party services for:<br/>

<Dot className="inline"/>Payment processing<br/>

<Dot className="inline"/>Analytics<br/>

<Dot className="inline"/>Website hosting<br/>

These third-party providers operate under their own privacy policies, and we encourage users to review them.</>}
        />

        <Section
          dark={darkPolicy}
          title="7. Data Retention"
          content = {<>We retain personal information only for as long as necessary to:<br/>

<Dot className="inline"/>Fulfill orders<br/>

<Dot className="inline"/>Comply with legal obligations<br/>

<Dot className="inline"/>Resolve disputes<br/>
<Dot className="inline"/>Enforce our agreements<br/>

After that, information is securely deleted or anonymized.</>}
        />

        <Section
          dark={darkPolicy}
          title="8. Your Rights"
          content = {<>You have the right to:<br/>

<Dot className="inline"/>Request access to your personal data<br/>

<Dot className="inline"/>Request correction of inaccurate information<br/>

<Dot className="inline"/>Request deletion of your data (subject to legal requirements)<br/>

<Dot className="inline"/>Withdraw consent where applicable<br/>

To exercise these rights, please contact us.</>}
        />

          <Section  
          dark={darkPolicy}
          title="9. Children’s Privacy"
          content = {<>We do not knowingly collect personal information from children under 13 years of age. If we discover that a child has provided us with personal information, we will take steps to delete such information from our systems.</>}
        />

        <Section
          dark={darkPolicy}
          title="10. Policy Updates"
          content = {<>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page with a revised “Last Updated” date. We encourage you to review this Privacy Policy periodically for any updates.</>}
        />

        <Section
        dark = {darkPolicy}
        title="11. Contact Us"
        content = {<>If you have any questions about this Privacy Policy, please contact us at:<br/>
Email:  akhilkamale@gmail.com
<br/>
Website: artistic.studio</>}
        />

        <div
          className={`mt-10 text-xs ${
            darkPolicy ? "text-[#888]" : "text-[#9b8a7a]"
          }`}
        >
        </div>
      </motion.div>
    </div>
  );
}

/* SECTION COMPONENT — SAME AS OTHER POLICY PAGES */
const Section = ({ title, content, dark }) => (
  <div className="mb-6">
    <h2
      className={`text-[16px] font-semibold mb-2 ${
        dark ? "text-[#f0f0f0]" : "text-black"
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
