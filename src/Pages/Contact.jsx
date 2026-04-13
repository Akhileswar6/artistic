import { Mail, Phone, MapPin, Clock, Instagram, Twitter, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Contact({ isDark }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.message) {
      return toast.error("Please fill in all required fields");
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setFormData({ fullName: "", email: "", subject: "", message: "" });
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const faq = [
    {
      q: "How long does a sketch take?",
      a: "Pencil sketches take 3 business days, charcoal 5 days, color 7 days, digital 4 days, and caricatures 4 days."
    },
    {
      q: "What photo should I send?",
      a: "A clear, well-lit front-facing or side-profile photo works best. High resolution (at least 1MP) is preferred. Avoid heavily filtered images."
    },
    {
      q: "Do you offer revisions?",
      a: "Yes! Minor revisions (like minor adjustments to shading, expression tweaks) are included. Major rework may be quoted separately."
    },
    {
      q: "How is the sketch delivered?",
      a: "Physical sketches are shipped via BlueDart, DTDC, or India Post. A high-res scan is also shared digitally. Digital art is sent directly via email."
    },
    {
      q: "Can I cancel my order?",
      a: "Free cancellation before the order is accepted. After acceptance, a 25% advance is non-refundable. Once in-progress, cancellation may not be possible."
    },
    {
      q: "What payment methods are accepted?",
      a: "We accept UPI payments (GPay, PhonePe, Paytm). Payment details are shared after order acceptance."
    }
  ];

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-black text-white" : "bg-white text-black"
      }`} style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-20">

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span
            className={`text-xs px-3 py-1 rounded-full border ${
              isDark ? "border-neutral-700 text-white" : "border-neutral-300 text-neutral-600"
            }`}
          >
            Get in Touch
          </span>

          <h1
            className="text-4xl mt-4 font-semibold"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Contact Us
          </h1>

          <p className={`mt-3 text-[14px] ${
            isDark ? "text-neutral-400" : "text-neutral-600"
          }`}>
            Have a question about an order or want to discuss a custom sketch?
            We're here to help.
          </p>
        </motion.div>

        {/* Contact Section */}
        <div className="grid md:grid-cols-5 gap-10">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-3"
          >
            <form onSubmit={handleSubmit} className={`rounded-2xl border p-8 shadow-lg h-full ${
              isDark
                ? "bg-[#141414] border-neutral-800"
                : "bg-white border-neutral-200"
            }`}>
              <h3
                className="text-[20px] mb-6 font-medium"
                style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
              >
                Send a Message
              </h3>

              {/* Name + Email */}
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm block mb-1">Name *</label>
                  <input
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Your name"
                    className={`w-full p-2 rounded-md border text-sm focus:outline-none ${
                      isDark
                        ? "bg-[#1c1c1c] border-neutral-700 placeholder:text-neutral-400 focus:ring-1 focus:ring-white"
                        : "bg-white border-gray-300 shadow-md placeholder:text-neutral-500 focus:ring-1 focus:ring-black"
                    }`}
                  />
                </div>

                <div>
                  <label className="text-sm block mb-1">Email *</label>
                  <input
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                    className={`w-full p-2 rounded-md border text-sm focus:outline-none ${
                      isDark
                        ? "bg-[#1c1c1c] border-neutral-700 placeholder:text-neutral-400 focus:ring-1 focus:ring-white"
                        : "bg-white border-gray-300 shadow-md placeholder:text-neutral-500 focus:ring-1 focus:ring-black"
                    }`}
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="mt-4">
                <label className="text-sm block mb-1">Subject *</label>
                <input
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Question about my order..."
                  className={`w-full p-2 rounded-md border text-sm focus:outline-none  ${
                    isDark
                      ? "bg-[#1c1c1c] border-neutral-700 placeholder:text-neutral-400 focus:ring-1 focus:ring-white"
                      : "bg-white border-gray-300 shadow-md placeholder:text-neutral-500 focus:ring-1 focus:ring-black"
                  }`}
                />
              </div>

              {/* Message */}
              <div className="mt-4">
                <label className="text-sm block mb-1">Message *</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows="4"
                  placeholder="Tell us how we can help..."
                  className={`w-full p-2 rounded-md border text-sm focus:outline-none ${
                    isDark
                      ? "bg-[#1c1c1c] border-neutral-700 placeholder:text-neutral-400 focus:ring-1 focus:ring-white"
                      : "bg-white border-gray-300 shadow-md placeholder:text-neutral-500 focus:ring-1 focus:ring-black"
                  }`}
                />
              </div>

              <button
                disabled={loading}
                className={`mt-6 w-full py-2.5 rounded-md text-sm font-medium transition-all duration-300 ${
                  isDark
                    ? "bg-white text-black hover:bg-neutral-200"
                    : "bg-black text-white shadow-md hover:bg-neutral-800"
                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </motion.div>

          {/* Contact Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="md:col-span-2 space-y-6"
          >

  {/* Contact Details Card */}
  <div
    className={`rounded-xl border p-6 shadow-lg ${
      isDark
        ? "bg-[#141414] border-neutral-800"
        : "bg-white border-neutral-200"
    }`}
  >
    <h3
      className="mb-6 font-medium text-[20px]"
      style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
    >
      Contact Details
    </h3>

    <div className="space-y-6 text-sm">

      {/* Email */}
      <div className="flex items-start gap-3">
        <div className="p-3 rounded-xl">
          <Mail size={18} />
        </div>

        <div>
          <p className="text-neutral-400 text-xs">Email</p>
          <p className="font-medium">hello@artsketch.in</p>
        </div>
      </div>

      {/* Phone */}
      <div className="flex items-start gap-3">
        <div className="p-3 rounded-xl">
          <Phone size={18} />
        </div>

        <div>
          <p className="text-neutral-400 text-xs">Phone / WhatsApp</p>
          <p className="font-medium">+91 98765 43210</p>
        </div>
      </div>

      {/* Location */}
      <div className="flex items-start gap-3">
        <div className="p-3 rounded-xl">
          <MapPin size={18} />
        </div>

        <div>
          <p className="text-neutral-400 text-xs">Based in</p>
          <p className="font-medium">Adoni, Andhra Pradesh</p>
        </div>
      </div>

      {/* Response Time */}
      <div className="flex items-start gap-3">
        <div className="p-3 rounded-xl">
          <Clock size={18} />
        </div>

        <div>
          <p className="text-neutral-400 text-xs">Response time</p>
          <p className="font-medium">Within 24 hours</p>
        </div>
      </div>

      {/* Divider */}
      <div className={`border-t ${isDark ? "border-neutral-700" : "border-neutral-300"} pt-4`}>
        <p className="text-sm text-neutral-400">
          Follow on Social
        </p>

        <div className="flex gap-2 mt-2">

          <div className="p-3 rounded-lg cursor-pointer transition">
            <Instagram size={18} />
          </div>

          <div className="p-3 rounded-lg cursor-pointer transition">
            <Twitter size={18} />
          </div>

          <div className="p-3 rounded-lg cursor-pointer transition">
            <MessageCircle size={18} />
          </div>

        </div>
      </div>

    </div>
  </div>

  {/* Working Hours */}
  <div
    className={`rounded-2xl border p-6 ${
      isDark
        ? "border-orange-600/40 bg-[#1a0d05]"
        : "border-yellow-400/40 text-yellow-700 shadow-lg"
    }`}
  >
    <h4
      className="mb-3 font-semibold flex items-center gap-2 text-[16px] text-yellow-700" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
    >
      <Clock size={16} />
      Working Hours
    </h4>

    <p className="text-[13px] leading-6 text-yellow-700">
      Monday – Saturday: 10 AM – 8 PM IST <br />
      Sunday: Closed (but messages are read!) <br />
      Orders are reviewed within 24 hours.
    </p>
  </div>


</motion.div>

</div>
        

      

        {/* FAQ */}
        <div className="mt-10">

          <h2
            className="text-center text-[25px] mb-10 font-semibold"
            style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
          >
            Frequently Asked Questions
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

           {faq.map((item, i) => (
  <motion.div
    key={i}
    initial={{ opacity: 0, y: 60 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.5, delay: i * 0.1 }}
    className={`rounded-xl border p-6 shadow-md ${
      isDark
        ? "bg-[#141414] border-neutral-800"
        : "bg-white border-neutral-200"
    }`}
  >
    <h4 className="font-medium text-[15px] mb-2">
      {item.q}
    </h4>

    <p
      className={`text-[14px] ${
        isDark ? "text-neutral-400" : "text-neutral-600"
      }`}
    >
      {item.a}
    </p>
  </motion.div>
))}

          </div>

        </div>
      </div>
    </div>
  );
}