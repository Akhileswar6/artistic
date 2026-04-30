import { useState } from "react";
import axios from "axios";
import { Clock, Package, Info, Check, X, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

import Details from "../Components/Order/Details";
import ArtPhoto from "../Components/Order/ArtPhoto";
import Review from "../Components/Order/Review";

export default function Order({ isDark }) {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const user = JSON.parse(localStorage.getItem("user"));

  // Form State
  const [orderData, setOrderData] = useState({
    name: user?.fullName || "",
    email: user?.email || "",
    phone: "",
    address: "",
    artStyle: "realistic",
    frameOption: "noframe",
    instructions: "",
    photo: null,
    rawFile: null,
    metadata: null,
  });

  const [loading, setLoading] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Price Configuration
  const stylePrices = {
    realistic: 1500,
    charcoal: 1500,
    sketch: 2000,
    caricature: 1800,
  };

  const styleLabels = {
    realistic: "Realistic Pencil Drawing",
    charcoal: "Charcoal Art",
    sketch: "Pencil Sketch",
    caricature: "Caricature",
  };

  const framePrices = {
    noframe: 0,
    standard8x10: 200,
    standard12x16: 400,
    custom: 600,
  };

  const frameLabels = {
    noframe: "No Frame (Digital Delivery)",
    standard8x10: "Standard Frame 8×10 inch",
    standard12x16: "Standard Frame 12×16 inch",
    custom: "Custom Frame Size",
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Only allow numbers for phone field (max 10 digits)
    if (name === "phone") {
      const numericValue = value.replace(/[^0-9]/g, "").slice(0, 10);
      setOrderData((prev) => ({ ...prev, [name]: numericValue }));
      return;
    }

    setOrderData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Photo size should be less than 5MB");
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      setOrderData((prev) => ({
        ...prev,
        photo: url,
        rawFile: file,
        metadata: {
          name: file.name,
          size: (file.size / 1024 / 1024).toFixed(2) + " MB",
          type: file.type,
          width: img.width,
          height: img.height,
        },
      }));
    };

    img.src = url;
  };

  const removePhoto = () => {
    setOrderData((prev) => ({ ...prev, photo: null, rawFile: null, metadata: null }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      // Use FormData to send the file to the backend
      const formData = new FormData();
      formData.append("name", orderData.name);
      formData.append("email", orderData.email);
      formData.append("phone", orderData.phone);
      formData.append("address", orderData.address);
      formData.append("artStyle", orderData.artStyle);
      formData.append("frameOption", orderData.frameOption);
      formData.append("instructions", orderData.instructions);
      formData.append("price", basePrice + framePrice);

      if (orderData.rawFile) {
        formData.append("photo", orderData.rawFile);
      } else {
        return toast.error("Please upload a photo first");
      }

      const response = await axios.post(
        "http://localhost:5000/api/orders/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // Note: axios handles the Content-Type for FormData automatically
          },
        }
      );

      toast.success("Commission request submitted successfully");
      navigate("/orders");

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  // Calculations
  const basePrice = stylePrices[orderData.artStyle] || 0;
  const framePrice = framePrices[orderData.frameOption] || 0;
  const totalPrice = basePrice + framePrice;
  const advanceAmount = Math.round(totalPrice * 0.25);

  return (
    <div
      className={`min-h-[calc(100vh-64px)] py-12 md:py-20 px-4 md:px-8 transition-colors duration-500 relative overflow-hidden ${isDark ? "bg-[#0a0a0b] text-white" : "bg-[#f8f9fa] text-black"
        }`}
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-[0.03]">
        <div className={`absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]`} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1
            className="text-3xl md:text-4xl font-bold tracking-tight mb-3"
            style={{ fontFamily: "Bricolage Grotesque" }}
          >
            Start Your <span className="text-neutral-500 font-bold">Masterpiece</span>
          </h1>
          <p className={`max-w-xl mx-auto text-[14px] leading-relaxed ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
            Order your custom portrait now and get it delivered to your doorstep
          </p>
        </motion.div>

        {/* STEPS INDICATOR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center items-center gap-2 md:gap-8 mb-10 md:mb-12"
        >
          {[
            { num: 1, label: "Details" },
            { num: 2, label: "Artwork" },
            { num: 3, label: "Confirm" }
          ].map((s, index) => (
            <div key={s.num} className="flex items-center gap-2 md:gap-8">
              <div className="flex flex-col md:flex-row items-center gap-1.5 md:gap-3 group cursor-pointer" onClick={() => step > s.num && setStep(s.num)}>
                <div className={`w-6 h-6 md:w-8 md:h-8 text-[11px] md:text-[14px] rounded-full flex items-center justify-center transition-all duration-300 ${step > s.num
                  ? "bg-green-500 text-white"
                  : step === s.num
                    ? "bg-neutral-700 text-white scale-110"
                    : isDark ? "bg-[#141416] text-neutral-600 border border-white/5" : "bg-white text-neutral-400 border border-black/5 shadow-sm"
                  }`}>
                  {step > s.num ? <Check size={14} className="md:w-[18px]" strokeWidth={3} /> : s.num}
                </div>
                <span className={`text-[10px] md:text-[13px] uppercase tracking-wider md:tracking-widest transition-colors ${step >= s.num ? (isDark ? "text-white" : "text-black") : (isDark ? "text-neutral-600" : "text-neutral-400")
                  }`}>
                  {s.label}
                </span>
              </div>
              {index < 2 && (
                <div className={`hidden md:block w-8 lg:w-12 h-[1px] transition-colors duration-500 ${step > s.num ? "bg-green-500" : isDark ? "bg-neutral-800" : "bg-neutral-300"}`} />
              )}
            </div>
          ))}
        </motion.div>

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* LEFT SIDE (Steps Content) */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {step === 1 && (
                  <Details
                    isDark={isDark}
                    setStep={setStep}
                    orderData={orderData}
                    handleInputChange={handleInputChange}
                    user={user}
                    setShowAuthModal={setShowAuthModal}
                  />
                )}

                {step === 2 && (
                  <ArtPhoto
                    isDark={isDark}
                    setStep={setStep}
                    orderData={orderData}
                    setOrderData={setOrderData}
                    handlePhoto={handlePhoto}
                    removePhoto={removePhoto}
                    setZoom={setZoom}
                    user={user}
                    setShowAuthModal={setShowAuthModal}
                  />
                )}

                {step === 3 && (
                  <Review
                    isDark={isDark}
                    setStep={setStep}
                    orderData={orderData}
                    handleSubmit={handleSubmit}
                    loading={loading}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>


          {/* RIGHT SIDE (Dynamic Order Summary) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col gap-6 lg:sticky lg:top-28 self-start lg:col-span-4"
          >
            {/* ORDER SUMMARY */}
            <div
              className={`rounded-2xl border p-5 md:p-6 transition-all duration-300 ${isDark
                ? "bg-[#141416]/80 backdrop-blur-xl border-white/10 shadow-2xl shadow-black/40"
                : "bg-white/80 backdrop-blur-xl border-black/5 shadow-2xl shadow-black/5"
                }`}
            >
              <h3 className="mb-6 text-xl" style={{ fontFamily: "Bricolage Grotesque" }}>
                Commission Summary
              </h3>

              <div className="space-y-5">
                <div className="flex justify-between items-start text-sm">
                  <div className="flex flex-col gap-1">
                    <span className=" text-[15px]">{styleLabels[orderData.artStyle]}</span>
                    <span className="text-[11px]  uppercase text-neutral-500">Art Style</span>
                  </div>
                  <span className="text-[15px]">₹{basePrice.toLocaleString()}</span>
                </div>

                {orderData.frameOption !== "noframe" && (
                  <div className="flex justify-between items-start text-sm">
                    <div className="flex flex-col gap-1">
                      <span className="text-[14px]">{frameLabels[orderData.frameOption]}</span>
                      <span className="text-[11px]  uppercase tracking-widest text-neutral-500">Frame</span>
                    </div>
                    <span className={`${isDark ? "text-white" : "text-black"}`}>+₹{framePrice.toLocaleString()}</span>
                  </div>
                )}

                <div className={`h-[1px] w-full ${isDark ? "bg-white/10" : "bg-black/10"}`} />

                <div className="flex justify-between items-center py-2">
                  <span className="text-sm  uppercase ">Total Amount</span>
                  <span className="text-xl" style={{ fontFamily: "Bricolage Grotesque" }}>₹{totalPrice.toLocaleString()}</span>
                </div>

                <div className={`p-4 rounded-xl flex flex-col gap-2 relative overflow-hidden ${isDark ? "bg-white/5 border border-white/10" : "bg-black/5 border border-black/10"}`}>
                  <ShieldCheck className={`absolute -bottom-4 -right-4 w-20 h-20 opacity-10 ${isDark ? "text-white" : "text-black"}`} />
                  <div className="flex justify-between items-center relative z-10">
                    <span className={`text-[12px] uppercase ${isDark ? "text-neutral-400" : "text-neutral-600"}`} >Advance Payment (25%)</span>
                    <span className={`text-lg  ${isDark ? "text-white" : "text-black"}`}>₹{advanceAmount.toLocaleString()}</span>
                  </div>
                  <p className={`text-[11px] font-medium leading-relaxed relative z-10 ${isDark ? "text-neutral-500" : "text-neutral-500"}`}>
                    Advance payment is required to confirm your order, and the remaining amount will be collected after the final artwork is delivered.
                  </p>
                </div>

                <div className="space-y-4 mt-6 pt-6 border-t border-dashed border-gray-500/30">
                  <div className={`flex items-center gap-3 text-sm font-medium ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                    <Clock size={16} className="text-neutral-500 shrink-0" />
                    <span className="text-[12px]">Execution: 3-5 business days</span>
                  </div>
                  <div className={`flex items-center gap-3 text-sm font-medium ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                    <Package size={16} className="text-neutral-500 shrink-0" />
                    <span className="text-[12px]">Archival-grade packaging included</span>
                  </div>
                </div>
              </div>
            </div>

            {/* PAYMENT INFO */}
            <div
              className={`p-5 rounded-2xl border transition-all ${isDark
                ? "bg-[#141416]/50 border-white/5"
                : "bg-white/50 border-black/5"
                }`}
            >
              <div className="flex items-center gap-2 mb-3 text-[14px]">
                <Info size={16} className={isDark ? "text-white" : "text-black"} />
                Payment Information
              </div>
              <p className={`text-[12px] leading-relaxed font-medium ${isDark ? "text-neutral-500" : "text-neutral-600"}`}>
                Once Artist confirms the order, a secure UPI payment link for the advance amount will be sent to your dashboard.
              </p>
            </div>

          </motion.div>

        </div>

      </div>

      {/* IMAGE ZOOM MODAL */}
      <AnimatePresence>
        {zoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-[100] p-4"
          >
            <div className="relative max-w-5xl w-full flex justify-center">
              <motion.img
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                src={orderData.photo}
                alt="zoom"
                className="max-h-[85vh] rounded-2xl shadow-2xl ring-1 ring-white/10"
              />
              <button
                onClick={() => setZoom(false)}
                className="absolute -top-6 -right-6 md:-right-12 bg-white/10 text-white p-3 rounded-full hover:bg-white hover:text-black transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
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
                <ShieldCheck size={22} className={isDark ? "text-white" : "text-black"} />
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: "Bricolage Grotesque" }}>Signin Required</h3>
              <p className={`text-sm mb-8 ${isDark ? "text-white/60" : "text-black/60"}`}>
                Please login to start your custom commission.
              </p>
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/signin")}
                  className={`w-full py-3 rounded-lg text-sm font-bold transition-all cursor-pointer ${isDark ? "bg-white text-black hover:bg-neutral-200" : "bg-black text-white hover:bg-neutral-800"
                    }`}
                >
                  Login to Continue
                </motion.button>
                <button
                  onClick={() => setShowAuthModal(false)}
                  className={`text-sm font-medium opacity-50 hover:opacity-100 transition-opacity cursor-pointer ${isDark ? "text-white" : "text-black"}`}
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}