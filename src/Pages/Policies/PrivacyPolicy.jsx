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
              Privacy Policy
            </h1>
          </div>
        </motion.div>

        {/* INTRO */}
        <motion.p
          variants={itemVariants}
          className={`text-xs sm:text-sm mb-8 leading-relaxed opacity-80 ${isDark ? "text-[#b5b5b5]" : "text-black"
            }`}
        >
          At <span className="font-bold">Artistic</span>, we value your privacy and are committed to protecting your personal information.
          This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
          <br /><br />
          By using Artistic, you consent to the practices described in this Privacy Policy.
        </motion.p>

        <div className="space-y-8">
          <Section
            dark={isDark}
            title="1. Information We Collect"
            content={
              <div className="space-y-4">
                <p>We may collect the following types of information:</p>

                <div>
                  <span className={`font-semibold ${isDark ? "text-white" : "text-black"}`}>
                    a) Personal Information
                  </span>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2"><Dot className="shrink-0" />Full name</div>
                    <div className="flex items-center gap-2"><Dot className="shrink-0" />Email address</div>
                    <div className="flex items-center gap-2"><Dot className="shrink-0" />Contact details (Phone Number, Delivery Address)</div>
                    <div className="flex items-center gap-2"><Dot className="shrink-0" />Payment Information (UPI Transaction IDs handled securely)</div>
                    <div className="flex items-center gap-2"><Dot className="shrink-0" />Order details and submitted images</div>
                  </div>
                </div>

                <div>
                  <span className={`font-semibold ${isDark ? "text-white" : "text-black"}`}>
                    b) Non-Personal Information
                  </span>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2"><Dot className="shrink-0" />Browser type</div>
                    <div className="flex items-center gap-2"><Dot className="shrink-0" />Device information</div>
                    <div className="flex items-center gap-2"><Dot className="shrink-0" />IP address</div>
                    <div className="flex items-center gap-2"><Dot className="shrink-0" />Website usage data</div>
                  </div>
                </div>
              </div>
            }
          />

          <Section
            dark={isDark}
            title="2. How We Use Your Information"
            content={
              <div className="space-y-2">
                <p>We use the collected information to:</p>
                <div className="flex items-start gap-2"><Dot className="shrink-0 mt-1" />Process, manage, and deliver your custom orders</div>
                <div className="flex items-start gap-2"><Dot className="shrink-0 mt-1" />Communicate order updates, payment requests, and support responses</div>
                <div className="flex items-start gap-2"><Dot className="shrink-0 mt-1" />Improve website functionality and user experience</div>
                <div className="flex items-start gap-2"><Dot className="shrink-0 mt-1" />Prevent fraud and unauthorized activity</div>
                <div className="flex items-start gap-2"><Dot className="shrink-0 mt-1" />Comply with legal obligations</div>
                <p className="mt-4 italic opacity-80">We only use your information for legitimate business purposes.</p>
              </div>
            }
          />

          <Section
            dark={isDark}
            title="3. Data Protection & Security"
            content={
              <div className="space-y-4">
                <p>Artistic implements appropriate technical and organizational security measures to protect your personal information against:</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2"><Dot className="shrink-0" />Unauthorized access</div>
                  <div className="flex items-center gap-2"><Dot className="shrink-0" />Data loss</div>
                  <div className="flex items-center gap-2"><Dot className="shrink-0" />Misuse or alteration</div>
                </div>
                <p>However, no method of transmission over the internet is 100% secure. We encourage you to use caution when submitting highly sensitive images.</p>
              </div>
            }
          />

          <Section
            dark={isDark}
            title="4. Sharing of Information"
            content={
              <div className="space-y-4">
                <p>We do not sell, rent, or trade your personal information.</p>
                <p>We may share information only in the following cases:</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2"><Dot className="shrink-0" />With trusted third-party delivery/shipping partners</div>
                  <div className="flex items-center gap-2"><Dot className="shrink-0" />When required by law</div>
                  <div className="flex items-center gap-2"><Dot className="shrink-0" />To protect legal rights or prevent fraud</div>
                </div>
              </div>
            }
          />

          <Section
            dark={isDark}
            title="5. Cookies & Tracking Technologies"
            content={
              <div className="space-y-2">
                <p>Our website may use cookies and similar technologies to:</p>
                <div className="flex items-center gap-2"><Dot className="shrink-0" />Enhance user experience</div>
                <div className="flex items-center gap-2"><Dot className="shrink-0" />Analyze website traffic</div>
                <div className="flex items-center gap-2"><Dot className="shrink-0" />Improve performance</div>
              </div>
            }
          />

          <Section
            dark={isDark}
            title="6. Third-Party Services"
            content={
              <div className="space-y-2">
                <p>We may use third-party services for:</p>
                <div className="flex items-center gap-2"><Dot className="shrink-0" />Payment processing (e.g., UPI providers)</div>
                <div className="flex items-center gap-2"><Dot className="shrink-0" />Analytics</div>
                <div className="flex items-center gap-2"><Dot className="shrink-0" />Website hosting and database management</div>
              </div>
            }
          />

          <Section
            dark={isDark}
            title="7. Data Retention"
            content={
              <div className="space-y-2">
                <p>We retain personal information only as necessary to:</p>
                <div className="flex items-center gap-2"><Dot className="shrink-0" />Fulfill orders and physical shipping</div>
                <div className="flex items-center gap-2"><Dot className="shrink-0" />Comply with legal obligations</div>
                <div className="flex items-center gap-2"><Dot className="shrink-0" />Resolve disputes</div>
                <div className="flex items-center gap-2"><Dot className="shrink-0" />Enforce agreements</div>
              </div>
            }
          />

          <Section
            dark={isDark}
            title="8. Your Rights"
            content={
              <div className="space-y-2">
                <p>You have the right to:</p>
                <div className="flex items-center gap-2"><Dot className="shrink-0" />Request access to the personal data we hold</div>
                <div className="flex items-center gap-2"><Dot className="shrink-0" />Request correction of inaccurate data</div>
                <div className="flex items-center gap-2"><Dot className="shrink-0" />Request deletion of your data (post-delivery)</div>
                <div className="flex items-center gap-2"><Dot className="shrink-0" />Withdraw consent</div>
              </div>
            }
          />

          <Section
            dark={isDark}
            title="9. Children’s Privacy"
            content={
              <p>We do not knowingly collect personal information from children under 18 years of age without parental consent.</p>
            }
          />

          <Section
            dark={isDark}
            title="10. Policy Updates"
            content={
              <p>We may update this Privacy Policy periodically. Continued use of our site means you agree to the latest policy.</p>
            }
          />

          <Section
            dark={isDark}
            title="11. Contact Us"
            content={
              <div className="space-y-1 mt-2">
                <div className="flex items-center gap-2"><Dot className="shrink-0" />Email: artistic.official12@gmail.com</div>
                <div className="flex items-center gap-2"><Dot className="shrink-0" />Phone: +91 9392822250</div>
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
      className={`text-sm sm:text-base md:text-lg font-semibold mb-2 transition-colors duration-300 ${dark ? "text-white group-hover:text-white" : "text-black group-hover:text-black"
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