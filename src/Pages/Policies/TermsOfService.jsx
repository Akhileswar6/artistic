import { motion } from "framer-motion";
import jsPDF from "jspdf";
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

export default function TermsOfService({ isDark }) {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const termsText = `
Welcome to Artistic. These Terms of Service (“Terms”) govern your access to and use of our website and services. By accessing or using Artistic, you agree to comply with and be legally bound by these Terms. If you do not agree to these Terms, please discontinue use of our services immediately.

1. Overview of Services
Artistic provides custom hand-drawn and digital artwork created based on images or references submitted by users.
All artwork is made to order and tailored specifically to each customer.

2. Eligibility
By using our services, you confirm that:
- You are at least 18 years old, or have parental/guardian consent.
- You provide accurate and lawful information.
- You own or have proper authorization to use the images you submit.

3. User Responsibilities
When submitting content to Artistic, you agree:
- Not to upload copyrighted material without permission.
- Not to submit illegal, explicit, abusive, defamatory, or harmful content.
- Not to misuse, hack, or attempt to disrupt the website or services.
Artistic reserves the right to refuse or cancel orders that violate these conditions.

4. Orders & Payment Workflow
Orders follow a structured timeline:
1. Request: Customer submits order details.
2. Acceptance: Artist reviews and accepts.
3. Advance Payment: A non-refundable 25% advance via UPI confirms the order.
4. Creation: Artist completes the work.
5. Balance Payment: Customer pays the final 75% balance.
6. Delivery: Artwork is shipped or emailed within ~3-5 business days.

5. Delivery & Shipping
Physical items (framed art) are delivered in eco-friendly premium packaging.
Estimated delivery timelines are provided but not guaranteed. Shipping begins only after the 75% balance is paid.

6. Intellectual Property Rights
Upon full payment, the customer receives rights to use the final artwork for personal use.
Artistic retains the right to showcase completed artwork in portfolios or social media unless requested otherwise.
Commercial use requires prior written permission.

7. Order Refusal & Termination
Artistic reserves the right to:
- Refuse any order at its discretion.
- Cancel orders involving prohibited content or failure to pay balance.

8. Limitation of Liability
To the fullest extent permitted by law:
Artistic shall not be liable for indirect, incidental, or consequential damages.
Total liability shall not exceed the amount paid for the specific order.

9. Privacy
User data is handled in accordance with our Privacy Policy.

10. Contact Information
For any questions regarding these Terms, please contact:
Email: artistic.official12@gmail.com
Phone: +91 9392822250
`;

  const downloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");

    const pageHeight = doc.internal.pageSize.height;
    const margin = 10;
    const maxLineWidth = 190;

    doc.setFontSize(16);
    doc.text("Artistic – Terms of Service", margin, 15);

    doc.setFontSize(11);

    const splitText = doc.splitTextToSize(termsText, maxLineWidth);

    let y = 30;

    splitText.forEach((line) => {
      if (y > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += 6;
    });

    doc.save("Artistic_Terms_of_Service.pdf");
  };

  return (
    <div
      className={`relative w-full min-h-screen py-10 sm:py-16 px-6 sm:px-12 overflow-hidden transition-colors duration-500 ${
        isDark ? "bg-[#080808]" : "bg-[#faf9f6]"
      }`}
      style={{ fontFamily: "Inter, serif" }}
    >


      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`relative z-10 max-w-6xl mx-auto shadow-2xl rounded-[1.5rem] p-6 sm:p-8 md:p-10 backdrop-blur-xl border transition-all duration-300 ${
          isDark ? "bg-[#0A0A0C]/80 border-white/5 shadow-black/50" : "bg-white/80 border-gray-200/50 shadow-xl"
        }`}
      >
        {/* HEADER */}
        <motion.div variants={itemVariants} className="flex items-center justify-between gap-3 mb-6">
          <h1
            className={`text-xl sm:text-2xl md:text-3xl font-medium tracking-tight ${
              isDark ? "text-white" : "text-black"
            }`}
            style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
          >
            Terms of Service
          </h1>
        </motion.div>

        <motion.p
          variants={itemVariants}
          className={`text-xs sm:text-sm mb-8 leading-relaxed opacity-80 ${
            isDark ? "text-[#b5b5b5]" : "text-black"
          }`}
        >
          Welcome to <span className="font-bold">Artistic</span>. These Terms of Service (“Terms”) govern your access to and use of our website and services. By accessing or using Artistic, you agree to comply with and be legally bound by these Terms. If you do not agree to these Terms, please discontinue use of our services immediately.
        </motion.p>

        <div className="space-y-8">
          <Section dark={isDark} title="1. Overview of Services" content={
            <div className="space-y-2">
              <p>Artistic provides custom hand-drawn and digital artwork created based on images or references submitted by users.</p>
              <p>All artwork is made to order and tailored specifically to each customer.</p>
            </div>
          }/>

          <Section dark={isDark} title="2. Eligibility" content={
            <div className="space-y-2">
              <p>By using our services, you confirm that:</p>
              <div className="flex items-center gap-2"><Dot className="shrink-0"/><span>You are at least 18 years old, or have parental/guardian consent.</span></div>
              <div className="flex items-center gap-2"><Dot className="shrink-0"/><span>You provide accurate and lawful information.</span></div>
              <div className="flex items-center gap-2"><Dot className="shrink-0"/><span>You own or have proper authorization to use the images you submit.</span></div>
            </div>
          }/>

          <Section dark={isDark} title="3. User Responsibilities" content={
            <div className="space-y-2">
              <p>When submitting content to Artistic, you agree:</p>
              <div className="flex items-start gap-2"><Dot className="shrink-0 mt-1"/><span>Not to upload copyrighted material without permission.</span></div>
              <div className="flex items-start gap-2"><Dot className="shrink-0 mt-1"/><span>Not to submit illegal, explicit, abusive, defamatory, or harmful content.</span></div>
              <div className="flex items-start gap-2"><Dot className="shrink-0 mt-1"/><span>Not to misuse, hack, or attempt to disrupt the website or services.</span></div>
              <p className="mt-2 italic opacity-80">Artistic reserves the right to refuse or cancel orders that violate these conditions.</p>
            </div>
          }/>

          <Section dark={isDark} title="4. Orders & Payment Workflow" content={
            <div className="space-y-2">
              <p>Orders follow a structured timeline:</p>
              <div className="flex items-center gap-2"><Dot className="shrink-0"/><span>1. Request: Customer submits order details.</span></div>
              <div className="flex items-center gap-2"><Dot className="shrink-0"/><span>2. Acceptance: Artist reviews and accepts.</span></div>
              <div className="flex items-center gap-2"><Dot className="shrink-0"/><span>3. Advance Payment: A non-refundable 25% advance via UPI confirms the order.</span></div>
              <div className="flex items-center gap-2"><Dot className="shrink-0"/><span>4. Creation: Artist completes the work (In Progress → Completed).</span></div>
              <div className="flex items-center gap-2"><Dot className="shrink-0"/><span>5. Balance Payment: Customer pays the final 75% balance.</span></div>
              <div className="flex items-center gap-2"><Dot className="shrink-0"/><span>6. Delivery: Artwork is shipped or emailed within ~3-5 business days.</span></div>
            </div>
          }/>

          <Section dark={isDark} title="5. Delivery & Shipping" content={
            <div className="space-y-2">
              <div className="flex items-start gap-2"><Dot className="shrink-0 mt-1"/><span>Physical items (framed art) are delivered in eco-friendly premium packaging.</span></div>
              <div className="flex items-start gap-2"><Dot className="shrink-0 mt-1"/><span>Estimated delivery timelines are provided but not guaranteed.</span></div>
              <div className="flex items-start gap-2"><Dot className="shrink-0 mt-1"/><span>Shipping begins only after the 75% balance is paid in full.</span></div>
            </div>
          }/>

          <Section dark={isDark} title="6. Intellectual Property Rights" content={
            <div className="space-y-2">
              <div className="flex items-start gap-2"><Dot className="shrink-0 mt-1"/><span>Upon full payment, the customer receives rights to use the final artwork for personal use.</span></div>
              <div className="flex items-start gap-2"><Dot className="shrink-0 mt-1"/><span>Artistic retains the right to showcase completed artwork in portfolios or social media unless requested otherwise.</span></div>
              <div className="flex items-start gap-2"><Dot className="shrink-0 mt-1"/><span>Commercial use requires prior written permission.</span></div>
            </div>
          }/>

          <Section dark={isDark} title="7. Order Refusal & Termination" content={
            <div className="space-y-2">
              <p>Artistic reserves the right to:</p>
              <div className="flex items-center gap-2"><Dot className="shrink-0"/><span>Refuse any order at its discretion.</span></div>
              <div className="flex items-center gap-2"><Dot className="shrink-0"/><span>Cancel orders involving prohibited content or failure to pay balance.</span></div>
            </div>
          }/>

          <Section dark={isDark} title="8. Limitation of Liability" content={
            <div className="space-y-2">
              <p>To the fullest extent permitted by law:</p>
              <div className="flex items-start gap-2"><Dot className="shrink-0 mt-1"/><span>Artistic shall not be liable for indirect, incidental, or consequential damages.</span></div>
              <div className="flex items-start gap-2"><Dot className="shrink-0 mt-1"/><span>Total liability shall not exceed the amount paid for the specific order.</span></div>
            </div>
          }/>

          <Section dark={isDark} title="9. Privacy" content={
            <p>User data is handled in accordance with our Privacy Policy.</p>
          }/>

          <Section dark={isDark} title="10. Contact Information" content={
            <div className="space-y-2">
              <p>For any questions regarding these Terms, please contact:</p>
              <div className="flex items-center gap-2"><Dot className="shrink-0"/><span>Email: artistic.official12@gmail.com</span></div>
              <div className="flex items-center gap-2"><Dot className="shrink-0"/><span>Phone: +91 9392822250</span></div>
            </div>
          }/>
        </div>

        <motion.button
          variants={itemVariants}
          onClick={downloadPDF}
          className={`mt-10 px-3 py-2.5 rounded-xl text-xs  shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer border ${
            isDark
              ? "bg-white text-black hover:bg-gray-100 border-white"
              : "bg-black text-white hover:bg-gray-900 border-black"
          }`}
        >
          Download Terms as PDF
        </motion.button>

        <motion.div
          variants={itemVariants}
          className={`mt-16 pt-8 border-t transition-colors duration-300 text-xs sm:text-sm ${
            isDark ? "text-[#888] border-white/5" : "text-gray-500 border-gray-200"
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
      className={`text-sm sm:text-base md:text-lg font-semibold mb-2 transition-colors duration-300 ${
        dark ? "text-white group-hover:text-white" : "text-black group-hover:text-black"
      }`}
    >
      {title}
    </h2>
    <div
      className={`text-xs sm:text-sm leading-relaxed transition-colors duration-300 ${
        dark ? "text-[#b5b5b5] group-hover:text-[#d5d5d5]" : "text-gray-700 group-hover:text-black"
      }`}
    >
      {content}
    </div>
  </motion.div>
);