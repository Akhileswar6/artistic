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
Phone: +91 0000000000
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
              isDark ? "text-white" : "text-black"
            }`}
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Terms of Service
          </h1>
        </motion.div>

        <motion.p
          variants={itemVariants}
          className={`text-sm mb-8 ${
            isDark ? "text-[#b5b5b5]" : "text-black"
          }`}
        >
          Welcome to <span className="font-bold">Artistic</span>. These Terms of Service (“Terms”) govern your access to and use of our website and services. By accessing or using Artistic, you agree to comply with and be legally bound by these Terms. If you do not agree to these Terms, please discontinue use of our services immediately.
        </motion.p>

        <Section dark={isDark} title="1. Overview of Services" content={
          <>
            Artistic provides custom hand-drawn and digital artwork created based on images or references submitted by users.
            <br />
            All artwork is made to order and tailored specifically to each customer.
          </>
        }/>

        <Section dark={isDark} title="2. Eligibility" content={
          <>
            By using our services, you confirm that:<br />
            <Dot className="inline"/>You are at least 18 years old, or have parental/guardian consent.<br />
            <Dot className="inline"/>You provide accurate and lawful information.<br />
            <Dot className="inline"/>You own or have proper authorization to use the images you submit.
          </>
        }/>

        <Section dark={isDark} title="3. User Responsibilities" content={
          <>
            When submitting content to Artistic, you agree:<br />
            <Dot className="inline"/>Not to upload copyrighted material without permission.<br />
            <Dot className="inline"/>Not to submit illegal, explicit, abusive, defamatory, or harmful content.<br />
            <Dot className="inline"/>Not to misuse, hack, or attempt to disrupt the website or services.<br />
            Artistic reserves the right to refuse or cancel orders that violate these conditions.
          </>
        }/>

        <Section dark={isDark} title="4. Orders & Payment Workflow" content={
          <>
            Orders follow a structured timeline:<br />
            <Dot className="inline"/>1. Request: Customer submits order details.<br />
            <Dot className="inline"/>2. Acceptance: Artist reviews and accepts.<br />
            <Dot className="inline"/>3. Advance Payment: A non-refundable 25% advance via UPI confirms the order.<br />
            <Dot className="inline"/>4. Creation: Artist completes the work (In Progress  Completed).<br />
            <Dot className="inline"/>5. Balance Payment: Customer pays the final 75% balance.<br />
            <Dot className="inline"/>6. Delivery: Artwork is shipped or emailed within ~3-5 business days. 
          </>
        }/>

        <Section dark={isDark} title="5. Delivery & Shipping" content={
          <>
            <Dot className="inline"/>Physical items (framed art) are delivered in eco-friendly premium packaging.<br />
            <Dot className="inline"/>Estimated delivery timelines are provided but not guaranteed.<br />
            <Dot className="inline"/>Shipping begins only after the 75% balance is paid in full.
          </>
        }/>

        <Section dark={isDark} title="6. Intellectual Property Rights" content={
          <>
            <Dot className="inline"/>Upon full payment, the customer receives rights to use the final artwork for personal use.<br />
            <Dot className="inline"/>Artistic retains the right to showcase completed artwork in portfolios or social media unless requested otherwise.<br />
            <Dot className="inline"/>Commercial use requires prior written permission.
          </>
        }/>

        <Section dark={isDark} title="7. Order Refusal & Termination" content={
          <>
            Artistic reserves the right to:<br />
            <Dot className="inline"/>Refuse any order at its discretion.<br />
            <Dot className="inline"/>Cancel orders involving prohibited content or failure to pay balance.<br />
          </>
        }/>

        <Section dark={isDark} title="8. Limitation of Liability" content={
          <>
            To the fullest extent permitted by law:<br />
            <Dot className="inline"/>Artistic shall not be liable for indirect, incidental, or consequential damages.<br />
            <Dot className="inline"/>Total liability shall not exceed the amount paid for the specific order.
          </>
        }/>

        <Section dark={isDark} title="9. Privacy" content={
          <>
            User data is handled in accordance with our Privacy Policy.
          </>
        }/>

        <Section dark={isDark} title="10. Contact Information" content={
          <>
            For any questions regarding these Terms, please contact:<br />
            <Dot className="inline"/>Email: artistic.official12@gmail.com<br />
            <Dot className="inline"/>Phone: +91 0000000000
          </>
        }/>

        <motion.button
          variants={itemVariants}
          onClick={downloadPDF}
          className={`mt-6 px-3 py-2 rounded-lg text-[13px] border font-medium shadow-lg transition cursor-pointer ${
            isDark
              ? "bg-[#2b2b2b] text-white hover:bg-[#2b2b2b]/80 border-neutral-700"
              : "bg-[#151312] text-white hover:bg-[#1c1a19] border-gray-300"
          }`}
        >
          Download Terms as PDF
        </motion.button>

        <motion.div variants={itemVariants} className={`mt-8 text-xs ${isDark ? "text-[#888]" : "text-black"}`}>
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