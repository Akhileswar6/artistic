import { motion } from "framer-motion";
import jsPDF from "jspdf";
import { useState, useEffect } from "react";
import PolicyNavbar from "../../Components/PolicyNavbar.jsx";
import { Dot } from "lucide-react";

export default function TermsOfService() {
const [darkPolicy, setDarkPolicy] = useState(
  localStorage.getItem("policyTheme") === "dark"
);


  // ✅ Always open page from top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const termsText = `
SketchCraft – Terms of Service

1. Services Offered
SketchCraft provides custom hand-drawn sketches based on user-submitted images.

2. User Responsibilities
Users must provide accurate information and lawful content.

3. Orders & Custom Work
All artworks are custom-made.

4. Payments
Payments must be completed before work begins.

5. Intellectual Property
Artwork ownership transfers after payment.

6. Refunds
Refunds follow the Refund Policy.

7. Liability
No liability for indirect damages.

8. Privacy
User data is protected.

9. Updates
Terms may change.

10. Contact
Contact us for questions.
`;

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("SketchCraft – Terms of Service", 10, 15);
    doc.setFontSize(11);
    doc.text(termsText, 10, 30, { maxWidth: 180 });
    doc.save("SketchCraft_Terms_of_Service.pdf");
  };

  return (
    <div
      className={`w-full min-h-screen transition-colors ${
        darkPolicy ? "bg-[#0f0f0f]" : "bg-[#fbf8f3]"
      }`} style={{fontFamily: "Inter, serif"}}
    >
      {/* ✅ NAVBAR CONTROLS THEME */}
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
            className={`text-[26px] font-semibold  ${
              darkPolicy ? "text-white" : "text-black"
            }`}
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Terms of Service

          </h1>
             <span className={`text-[12px] pb-4 ${darkPolicy ? "text-white" : "text-black"}`}>
Last Updated: February 25, 2026<br /> 
       </span>
          
        </div>

         

        <p
          className={`text-sm mb-8 ${
            darkPolicy ? "text-[#b5b5b5]" : "text-black"
          }`}
        >


Welcome to <span className="font-bold">artistic</span>. These Terms of Service (“Terms”) govern your access to and use of our website and services. By accessing or using artistic, you agree to comply with and be legally bound by these Terms. If you do not agree to these Terms, please discontinue use of our services immediately.
        </p>

<Section
  dark={darkPolicy}
  title="1. Overview of Services"
  content={
    <>
      SketchCraft provides custom hand-drawn and/or digital sketch artwork
      created based on images or references submitted by users.
      <br />
      All artwork is made to order and tailored specifically to each customer.
    </>
  }
/>        

<Section dark={darkPolicy} title="2. Eligibility" content={<>By using our services, you confirm that: <br /> 
<Dot className="inline"/>You are at least 18 years old, or have parental/guardian consent. <br />
<Dot className="inline "/>You provide accurate and lawful information. <br />
<Dot className="inline"/>You own or have proper authorization to use the images you submit.</>}/>


<Section dark={darkPolicy} title="3. User Responsibilities" content={<>When submitting content to SketchCraft, you agree:<br /> 
<Dot className="inline"/>Not to upload copyrighted material without permission.<br /> 
<Dot className="inline"/>Not to submit illegal, explicit, abusive, defamatory, or harmful content.<br /> 
<Dot className="inline"/>Not to misuse, hack, or attempt to disrupt the website or services.<br /> 
SketchCraft reserves the right to refuse or cancel orders that violate these conditions.</>}/>



<Section dark={darkPolicy} title="4. Orders & Custom Artwork" content={<><Dot className="inline"/>All orders are custom-made based on the user’s submission..<br /> 
<Dot className="inline"/>Once work has begun, changes may be limited.<br /> 
<Dot className="inline"/>The final artwork may vary slightly due to artistic interpretation.<br /> 
<Dot className="inline"/>Estimated delivery timelines are provided but not guaranteed.</>} />



        <Section dark={darkPolicy} title="5. Pricing & Payment" content={<>Full payment is required before work begins.<br /> 

<Dot className="inline"/>Prices are displayed prior to order confirmation.<br /> 

<Dot className="inline"/>SketchCraft reserves the right to modify pricing at any time.<br /> 

<Dot className="inline"/>Failure to complete payment will result in cancellation of the order.</>} />

        <Section dark={darkPolicy} title="6. Intellectual Property Rights" content={<><Dot className="inline"/>Upon full payment, the customer receives rights to use the final artwork for personal use.<br /> 

<Dot className="inline"/>SketchCraft retains the right to showcase completed artwork in portfolios, social media, or promotional materials unless the customer requests confidentiality before project completion.<br /> 

<Dot className="inline"/>Commercial use, resale, or reproduction requires prior written permission unless explicitly agreed otherwise.</>}/>

        <Section dark={darkPolicy} title="7. Order Refusal & Termination" content={<>SketchCraft reserves the right to:<br /> 

<Dot className="inline"/>Refuse any order at its discretion.<br /> 

<Dot className="inline"/>Cancel orders involving prohibited content.<br /> 

<Dot className="inline"/>Suspend or terminate access if Terms are violated.</>}/>

        <Section dark={darkPolicy} title="8. Limitation of Liability" content={<>To the fullest extent permitted by law:<br /> 
<Dot className="inline"/>SketchCraft shall not be liable for indirect, incidental, or consequential damages.<br /> 
<Dot className="inline"/>Total liability shall not exceed the amount paid for the specific order.</>}/>

        <Section dark={darkPolicy} title="9. Third-Party Services" content={<>Our website may use third-party services (such as payment gateways). SketchCraft is not responsible for issues arising from third-party platforms.</>} />
        <Section dark={darkPolicy} title="10. Privacy" content={<>User data is handled in accordance with our Privacy Policy. By using our services, you consent to the collection and use of information as described therein.</>} />
        <Section dark={darkPolicy} title="11. Changes to Terms" content={<>We reserve the right to update these Terms at any time. Updated versions will be posted on this page with a revised “Last Updated” date. Continued use of the website indicates acceptance of the updated Terms.</>}/>

        <Section dark={darkPolicy} title="12. Governing Law" content={<>These Terms shall be governed by and interpreted in accordance with the laws of India.</>} />
        <Section dark={darkPolicy} title="13. Contact Information" content={<>For any questions regarding these Terms, please contact:<br /> 

Email: artistic@gmail.com<br /> 
Website: artistic.studio</>} />




        <button
          onClick={downloadPDF}
          className={`mt-6 px-3 py-2 rounded-lg text-[13px] border border-gray-300 font-medium shadow-lg transition cursor-pointer ${
            darkPolicy
              ? "bg-[#2b2b2b] text-white hover:bg-[#2b2b2b]/80"
              : "bg-[#151312] text-white hover:bg-[#1c1a19]"
          }`}
        >
          Download Terms as PDF
        </button>
        
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

