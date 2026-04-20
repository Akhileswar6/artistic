import { Mail, Phone, MapPin, Clock, MessageCircle, Send, Lock, User, AtSign, Tag, MessageSquare } from "lucide-react";
import { Instagram, Facebook, Linkedin, ChatCircle } from "griddy-icons";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import toast from "react-hot-toast";

import instagramImg from "../assets/instagram_dark.png";
import facebookImg from "../assets/facebook_dark.png";
import linkedinImg from "../assets/linkedin_dark.png";

export default function Contact() {
  const { user, isDark } = useOutletContext();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.fullName || "",
        email: user.email || ""
      }));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!formData.fullName || !formData.email || !formData.message) {
      return toast.error("Please fill in all required fields");
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setShowAuthModal(true);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setFormData(prev => ({ ...prev, subject: "", message: "" }));
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
      q: "How do I choose the right photo for a portrait?",
      a: "For the best detail, upload a high-resolution, well-lit photo where facial features are clearly visible. Avoid photos with harsh shadows, heavy filters, or blurry backgrounds. If you're unsure, our team can review your photo before you place an order!"
    },
    {
      q: "Can you combine people from different photos?",
      a: "Absolutely! We specialize in 'Merge Portraits.' You can provide separate photos of individuals, and our artists will skillfully compose them into a single, cohesive masterpiece that looks natural and balanced."
    },
    {
      q: "What is the typical turnaround time?",
      a: "Pencil sketches usually take 3-5 business days, while more detailed works like Charcoal or Oil Painting can take 7-10 days. Need it faster? We offer 'Express Delivery' options for urgent gifting needs."
    },
    {
      q: "Is physical shipping available worldwide?",
      a: "Yes, we ship high-quality physical artworks across India and globally. Every sketch is carefully rolled in protective tubes or flat-packed with multiple layers of cushioning to ensure it reaches you in pristine condition."
    },
    {
      q: "Do you offer framing services?",
      a: "Yes, you can opt for premium framing at checkout. We offer a curated selection of minimalist, classic, and rustic frames that complement our artistic styles perfectly."
    },
    {
      q: "Will I get a preview before shipping?",
      a: "Quality is our priority. Once the artwork is complete, we share a high-resolution digital preview via your dashboard or email. Physical shipping only begins after you are 100% satisfied with the result."
    },
    {
      q: "What payment methods do you accept?",
      a: "We support all major payment methods including UPI (PhonePe, Google Pay), Credit/Debit Cards, Net Banking, and secure wallets. For large-scale commissioned works, we also offer flexible installment options."
    },
    {
      q: "What if I'm not happy with the sketch?",
      a: "We offer unlimited minor revisions during the digital preview stage. Our goal is to capture the essence of your vision. If the artwork doesn't meet your expectations, we'll work closely with you to make it right."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${isDark ? "bg-[#0a0a0b] text-white" : "bg-[#f8f9fa] text-black"
        }`}
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAuthModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`relative w-full max-w-sm p-8 rounded-xl text-center shadow-2xl border ${isDark ? "bg-[#141416] border-white/10" : "bg-white border-black/5"
                }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 ${isDark ? "bg-white/10" : "bg-black/5"
                }`}>
                <Lock size={22} className={isDark ? "text-white" : "text-black"} />
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: "Bricolage Grotesque" }}>Signin Required</h3>
              <p className={`text-sm mb-8 ${isDark ? "text-white/60" : "text-black/60"}`}>
                Please login to send us a message.
              </p>
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAuthModal(false)}
                  className={`w-full py-2 rounded-lg text-sm transition-all ${isDark ? "bg-white text-black hover:bg-neutral-200" : "bg-black text-white hover:bg-neutral-800"
                    }`}
                >
                  Login to Continue
                </motion.button>
                <button
                  onClick={() => setShowAuthModal(false)}
                  className={`text-sm font-medium opacity-50 hover:opacity-100 transition-opacity ${isDark ? "text-white" : "text-black"}`}
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-12 md:pt-16 pb-8 md:pb-10 px-4 md:px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] md:h-[400px] pointer-events-none opacity-20">
          <div className={`absolute inset-0 bg-gradient-to-b from-transparent to-transparent ${isDark ? "from-white/10" : "from-black/5"}`} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <h1
            className="text-3xl md:text-4xl font-bold mb-2 md:mb-3 tracking-tight"
            style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
          >
            Let's create something <br />
            <span className={isDark ? "text-neutral-400" : "text-neutral-500"}>extraordinary together.</span>
          </h1>
          <p className={`text-[13px] md:text-sm leading-relaxed px-2 md:px-0 ${isDark ? "text-neutral-400" : "text-neutral-600"
            }`}>
            Have a vision in mind? Reach out to turn your ideas into hand-crafted masterpieces. <br className="hidden md:block" />
            We're here to help you bring your artistic imagination to life.
          </p>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 pb-16 md:pb-20">
        <div className="grid lg:grid-cols-12 gap-6 md:gap-8 items-start">

          {/* Contact Details - LG: Col 4 */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-4 space-y-4 order-2 lg:order-1"
          >
            <motion.div variants={itemVariants} className={`p-5 md:p-6 rounded-xl border ${isDark ? "bg-[#141416] border-white/5" : "bg-white border-black/10 shadow-2xl shadow-black/20"
              }`}>
              <h3 className="text-xl mb-5 flex items-center gap-2" style={{ fontFamily: "Bricolage Grotesque" }}>
                Contact Info
              </h3>


              <div className="space-y-6">
                {[
                  { icon: Mail, label: "Email", value: "artistic.official12@gmail.com", sub: "Drop us a line anytime" },
                  { icon: Phone, label: "Phone", value: "+91 9392822250", sub: "Mon-Sat, 10am-8pm IST" },
                  { icon: MapPin, label: "Studio", value: "Adoni, Andhra Pradesh", sub: "Artistic Headquarters" }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 group">

                    <div className={`w-9 h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${isDark ? "bg-white/5 group-hover:bg-white/10" : "bg-black/5 group-hover:bg-black/10"
                      }`}>
                      <item.icon size={16} className={isDark ? "text-white/70" : "text-black/70"} />
                    </div>
                    <div>
                      <p className={`text-[9px] md:text-[10px] font-medium uppercase ${isDark ? "text-white/40" : "text-black/40"}`}>{item.label}</p>
                      <p className="text-[13px] md:text-sm">{item.value}</p>
                      <p className={`text-[11px] md:text-[12px] ${isDark ? "text-white/30" : "text-black/30"}`}>{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className={`mt-6 pt-5 border-t ${isDark ? "border-white/5" : "border-black/5"}`}>
                <div className="flex gap-2">
                  {[
                    { Icon: Instagram, dark: instagramImg },
                    { Icon: Facebook, dark: facebookImg },
                    { Icon: Linkedin, dark: linkedinImg },
                  ].map((item, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      className={`w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${isDark ? "bg-white/5 hover:bg-white/10" : "bg-black/5 hover:bg-black/10"
                        }`}
                    >
                      {isDark && item.dark ? (
                        <img src={item.dark} alt="social" className="w-[20px] h-[20px]" />
                      ) : (
                        <item.Icon size={22} className={isDark ? "text-white" : "text-black"} />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className={`p-5 md:p-6 rounded-xl overflow-hidden relative ${isDark ? "bg-[#0b1221] border border-blue-500/10 shadow-2xl shadow-black/40" : "bg-blue-50/30 border border-blue-200/50 shadow-2xl shadow-blue-900/10"
              }`}>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2 text-blue-500" style={{ fontFamily: "Bricolage Grotesque" }}>
                  <Clock size={14} />
                  <span>Business Hours</span>
                </div>
                <p className={`text-[11px] md:text-[13px] leading-relaxed ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                  <strong className={isDark ? "text-white" : "text-black"}>Mon – Sat:</strong> 10:00 AM – 08:00 PM<br />
                  <strong className={isDark ? "text-white" : "text-black"}>Sunday:</strong> Creative Break Day
                </p>
              </div>
            </motion.div>
          </motion.div>          {/* Contact Form - LG: Col 8 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-8 order-1 lg:order-2"
          >
            <div className={`p-5 md:p-8 rounded-xl border ${isDark ? "bg-[#141416] border-white/5" : "bg-white border-black/5 shadow-2xl shadow-black/20"
              }`}>
              <div className="mb-8 text-center md:text-left">
                <h3 className="text-xl mb-1" style={{ fontFamily: "Bricolage Grotesque" }}>Send a Message</h3>
                <p className={`text-[12px] ${isDark ? "text-white/40" : "text-black/40"}`}>
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className={`text-[11px] uppercase tracking-wider ml-1 ${isDark ? "text-white/40" : "text-black/40"}`}>
                      Full Name
                    </label>
                    <div className="relative group">
                      <User size={15} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${focused === "fullName" ? (isDark ? "text-white" : "text-black") : (isDark ? "text-white/40" : "text-black/40")
                        }`} />
                      <input
                        onFocus={(e) => {
                          if (!user) {
                            e.target.blur();
                            setShowAuthModal(true);
                          } else {
                            setFocused("fullName");
                          }
                        }}
                        onBlur={() => setFocused(null)}
                        value={formData.fullName}
                        readOnly={!!user}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. John Doe"
                        className={`w-full pl-11 pr-4 py-2.5 rounded-lg border transition-all text-[14px] focus:outline-none capitalize ${isDark
                          ? "bg-white/[0.02] border-white/5 focus:border-white/30 focus:bg-white/[0.05] placeholder:text-white/20"
                          : "bg-black/[0.02] border-black/5 focus:border-black/30 focus:bg-black/5 shadow-md focus:shadow-none placeholder:text-black/30"
                          }`}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className={`text-[11px] uppercase tracking-wider ml-1 ${isDark ? "text-white/40" : "text-black/40"}`}>
                      Email Address
                    </label>
                    <div className="relative group">
                      <AtSign size={15} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${focused === "email" ? (isDark ? "text-white" : "text-black") : (isDark ? "text-white/40" : "text-black/  40")
                        }`} />
                      <input
                        onFocus={(e) => {
                          if (!user) {
                            e.target.blur();
                            setShowAuthModal(true);
                          } else {
                            setFocused("email");
                          }
                        }}
                        onBlur={() => setFocused(null)}
                        value={formData.email}
                        readOnly={!!user}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. john@example.com"
                        className={`w-full pl-11 pr-4 py-2.5 rounded-lg border transition-all text-[14px] focus:outline-none ${isDark
                          ? "bg-white/[0.02] border-white/5 focus:border-white/30 focus:bg-white/[0.05] placeholder:text-white/20"
                          : "bg-black/[0.02] border-black/5 focus:border-black/30 focus:bg-black/5 shadow-md focus:shadow-none placeholder:text-black/30"
                          }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-1.5">
                  <label className={`text-[11px] uppercase tracking-wider ml-1 ${isDark ? "text-white/40" : "text-black/40"}`}>
                    Subject
                  </label>
                  <div className="relative group">
                    <Tag size={15} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${focused === "subject" ? (isDark ? "text-white" : "text-black") : (isDark ? "text-white/40" : "text-black/40")
                      }`} />
                    <input
                      onFocus={(e) => {
                        if (!user) {
                          e.target.blur();
                          setShowAuthModal(true);
                        } else {
                          setFocused("subject");
                        }
                      }}
                      onBlur={() => setFocused(null)}
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="How can we help?"
                      className={`w-full pl-11 pr-4 py-2.5 rounded-lg border transition-all text-[14px] focus:outline-none ${isDark
                        ? "bg-white/[0.02] border-white/5 focus:border-white/30 focus:bg-white/[0.05] placeholder:text-white/20"
                        : "bg-black/[0.02] border-black/5 focus:border-black/30 focus:bg-black/5 shadow-md focus:shadow-none placeholder:text-black/30"
                        }`}
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className={`text-[11px] uppercase tracking-wider ml-1 ${isDark ? "text-white/40" : "text-black/40"}`}>
                    Your Message
                  </label>
                  <div className="relative group">
                    <MessageSquare size={15} className={`absolute left-4 top-4 transition-colors ${focused === "message" ? (isDark ? "text-white" : "text-black") : (isDark ? "text-white/40" : "text-black/40")
                      }`} />
                    <textarea
                      onFocus={(e) => {
                        if (!user) {
                          e.target.blur();
                          setShowAuthModal(true);
                        } else {
                          setFocused("message");
                        }
                      }}
                      onBlur={() => setFocused(null)}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows="4"
                      placeholder="Write your message here..."
                      className={`w-full pl-11 pr-4 py-3 rounded-lg border transition-all text-[14px] focus:outline-none resize-none ${isDark
                        ? "bg-white/[0.02] border-white/5 focus:border-white/30 focus:bg-white/[0.05] placeholder:text-white/20"
                        : "bg-black/[0.02] border-black/5 focus:border-black/30 focus:bg-black/5 shadow-md focus:shadow-none placeholder:text-black/30"
                        }`}
                    />
                  </div>
                </div>

                <motion.button
                  disabled={loading}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  variants={{
                    initial: { scale: 1, boxShadow: "0px 0px 0px rgba(0,0,0,0)" },
                    hover: {
                      scale: 1.02,
                      boxShadow: isDark
                        ? "0px 10px 25px rgba(255,255,255,0.05)"
                        : "0px 10px 25px rgba(0,0,0,0.1)"
                    },
                    tap: { scale: 0.98 }
                  }}
                  className={`w-full py-3 rounded-lg text-sm flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${isDark
                    ? "bg-white text-black disabled:opacity-50"
                    : "bg-black text-white disabled:opacity-50"
                    }`}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </div>
                  ) : (
                    <>
                      Send Message
                      <Send size={16} />
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 md:mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-10"
          >
            <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-2" style={{ fontFamily: "Bricolage Grotesque" }}>
              Frequently Asked Questions (FAQ)
            </h2>
            <p className={`text-[12px] md:text-sm ${isDark ? "text-neutral-500" : "text-neutral-400"}`}>Find solutions to common questions</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
            {faq.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`p-6 rounded-xl border border-transparent transition-all duration-500 group relative overflow-hidden  ${isDark
                  ? "bg-[#141416]/80 hover:bg-[#18181b] hover:border-white/10"
                  : "bg-white hover:border-black/10 shadow-lg shadow-black/[0.09] hover:shadow-black/[0.2]"
                  }`}
              >
                {/* Liquid Glass Glow Effects (Background Layer) */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none z-0 ${isDark ? "bg-white/[0.03] backdrop-blur-xl" : "bg-white/40 backdrop-blur-xl"
                  }`} />

                <div className={`absolute top-0 left-0 w-full h-[1px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 bg-gradient-to-r from-transparent via-white to-transparent z-0`} />

                <div className="relative z-10">
                  <h4 className={` text-base md:text-[17px] mb-3 tracking-tight transition-colors ${isDark ? "text-white" : "text-black"}`}>
                    {item.q}
                  </h4>
                  <p className={`text-[13px] leading-relaxed transition-all duration-500 ${isDark ? "text-white/40 group-hover:text-white/80" : "text-black/50 group-hover:text-black/80"
                    }`}>
                    {item.a}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
