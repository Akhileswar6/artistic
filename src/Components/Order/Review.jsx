import { Check, Edit2, MapPin, Mail, Phone, User, Brush, Frame, MessageSquare, AlertTriangle, Package, ArrowLeft, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function Review({ isDark, setStep, orderData, handleSubmit, loading }) {

  const styleLabels = {
    realistic: "Realistic Pencil Drawing",
    charcoal: "Charcoal Art",
    sketch: "Pencil Sketch",
    caricature: "Caricature",
  };

  const frameLabels = {
    noframe: "No Frame (Digital Delivery)",
    standard8x10: "Standard Frame 8×10 inch",
    standard12x16: "Standard Frame 12×16 inch",
    custom: "Custom Frame Size",
  };

  return (
    <div className="space-y-8">

      <div className={`rounded-2xl border p-6 md:p-8 transition-all duration-300 ${isDark
          ? "border-white/10 bg-[#141416]/80 backdrop-blur-xl shadow-2xl shadow-black/40"
          : "border-black/5 bg-white/80 backdrop-blur-xl shadow-2xl shadow-black/5"
        }`}>

        <div className="flex items-center gap-3 mb-8">
          <h2 className="text-lg md:text-xl" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
            Review Order
          </h2>
        </div>

        <div className="space-y-10">

          {/* USER DETAILS */}
          <div>
            <div className="flex justify-between items-center mb-5">
              <h3 className={`text-[13px]  uppercase flex items-center gap-2 ${isDark ? "text-neutral-500" : "text-neutral-400"}`}>
                <User size={15} className="text-neutral-500" /> Client Information
              </h3>
              <button onClick={() => setStep(1)} className={`text-[12px]  flex items-center gap-1.5 transition-all ${isDark ? "text-neutral-500 hover:text-white" : "text-neutral-400 hover:text-black"}`}>
                <Edit2 size={12} /> Modify
              </button>
            </div>
            <div className={`grid md:grid-cols-2 gap-6 p-6 rounded-xl border ${isDark ? "bg-white/[0.02] border-white/5" : "bg-black/[0.02] border-black/5"}`}>
              <div className="space-y-1">
                <span className={`text-[12px] uppercase tracking-widest ${isDark ? "text-neutral-600" : "text-neutral-400"}`}>Full Name</span>
                <p className="text-[15px] font-medium capitalize">{orderData.name}</p>
              </div>
              <div className="space-y-1">
                <span className={`text-[12px] uppercase tracking-widest ${isDark ? "text-neutral-600" : "text-neutral-400"}`}>Email Address</span>
                <p className="text-[14px] font-medium flex items-center gap-2 truncate"><Mail size={14} className="opacity-50" /> {orderData.email}</p>
              </div>
              <div className="space-y-1">
                <span className={`text-[12px]  uppercase tracking-widest ${isDark ? "text-neutral-600" : "text-neutral-400"}`}>Contact Number</span>
                <p className="text-[14px] font-medium flex items-center gap-2"><Phone size={14} className="opacity-50" /> +91 {orderData.phone}</p>
              </div>
              <div className="space-y-1 md:col-span-2 pt-2 border-t border-dashed border-gray-500/20">
                <span className={`text-[12px] uppercase tracking-widest ${isDark ? "text-neutral-600" : "text-neutral-400"}`}>Shipping Destination</span>
                <p className="text-[14px] font-medium flex items-start gap-2 leading-relaxed mt-2">
                  <MapPin size={16} className="text-neutral-500 shrink-0 mt-0.5" />
                  <span className={isDark ? "text-neutral-300" : "text-neutral-700"}>{orderData.address}</span>
                </p>
              </div>
            </div>
          </div>

          {/* ART & STYLE DETAILS */}
          <div>
            <div className="flex justify-between items-center mb-5">
              <h3 className={`text-[13px]  uppercase  flex items-center gap-2 ${isDark ? "text-neutral-500" : "text-neutral-400"}`}>
                <Brush size={14} className="text-neutral-500" /> Commission Specifications
              </h3>
              <button onClick={() => setStep(2)} className={`text-[12px]  flex items-center gap-1.5 transition-all ${isDark ? "text-neutral-500 hover:text-white" : "text-neutral-400 hover:text-black"}`}>
                <Edit2 size={12} /> Modify
              </button>
            </div>

            <div className="grid md:grid-cols-12 gap-8">
              <div className="md:col-span-4 lg:col-span-3">
                <span className={`text-[12px]  uppercase tracking-widest mb-3 block ${isDark ? "text-neutral-600" : "text-neutral-400"}`}>Reference Image</span>
                <div className={`relative group rounded-xl overflow-hidden border-2 ${isDark ? "border-white/10" : "border-black/5"} bg-black`}>
                  <img src={orderData.photo} alt="reference" className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100" />
                </div>
              </div>

              <div className="md:col-span-8 lg:col-span-9 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-xl border ${isDark ? "bg-white/[0.02] border-white/5" : "bg-black/[0.02] border-black/5"}`}>
                    <span className={`text-[11px] font-bold uppercase tracking-widest ${isDark ? "text-neutral-600" : "text-neutral-400"}`}>Selected Style</span>
                    <p className="text-[15px] mt-2 flex items-center gap-2 ">
                      <Check size={16} className="text-green-500" /> {styleLabels[orderData.artStyle]}
                    </p>
                  </div>

                  <div className={`p-4 rounded-xl border ${isDark ? "bg-white/[0.02] border-white/5" : "bg-black/[0.02] border-black/5"}`}>
                    <span className={`text-[11px] font-bold uppercase tracking-widest ${isDark ? "text-neutral-600" : "text-neutral-400"}`}>Selected Frame</span>
                    <p className="text-[14px] mt-2 flex items-center gap-2">
                      <Frame size={16} className="text-green-500" /> {frameLabels[orderData.frameOption]}
                    </p>
                  </div>
                </div>

                {orderData.instructions && (
                  <div className={`p-4 rounded-xl border ${isDark ? "bg-white/[0.02] border-white/5" : "bg-black/[0.02] border-black/5"}`}>
                    <span className={`text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 mb-2 ${isDark ? "text-neutral-600" : "text-neutral-400"}`}>
                      <MessageSquare size={14} className="text-green-500" /> Directives
                    </span>
                    <p className={`text-[14px] ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>{orderData.instructions}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* POLICIES & INFO */}
      <div className="grid md:grid-cols-2 gap-4">

        {/* Cancellation Policy */}
        <div className={`flex gap-4 p-5 rounded-xl border transition-all ${isDark
            ? "bg-orange-950/10 border-orange-900/30 text-orange-200/90"
            : "bg-[#FFF9F0] border-orange-100/50 text-orange-900"
          }`}>
          <AlertTriangle size={20} className="shrink-0 mt-0.5 text-orange-500" />
          <p className="text-[12px] leading-relaxed font-medium ">
            <span className=" flex items-center text-[14px] gap-1 mb-1 text-white">Cancellation Policy</span>
            <span className="opacity-80">Free cancellation prior to studio acceptance. Post-acceptance, the 25% retainer is non-refundable. Work-in-progress cannot be cancelled.</span>
          </p>
        </div>

        {/* Delivery Info */}
        <div className={`flex gap-4 p-5 rounded-xl border transition-all ${isDark
            ? "bg-[#141416]/80 border-white/5 text-neutral-300"
            : "bg-white border-black/5 text-neutral-700 shadow-sm"
          }`}>
          <ShieldCheck size={20} className="shrink-0 mt-0.5 text-green-500" />
          <p className="text-[12px] leading-relaxed font-medium ">
            <span className="text-[14px] flex items-center gap-1 mb-1 text-white">Quality Assurance</span>
            <span className="opacity-80">You will receive a high-resolution digital preview for final approval before the physical piece is securely varnished, packaged, and dispatched.</span>
          </p>
        </div>

      </div>

      <div className="grid grid-cols-2 gap-4 md:gap-6 pt-4 pb-10">

        <button
          onClick={() => setStep(2)}
          className={`group px-6 py-3 text-[14px] font-bold uppercase  rounded-xl transition-all cursor-pointer flex items-center justify-center gap-3 ${isDark
              ? "bg-[#141416] text-white border border-white/10 hover:bg-neutral-800"
              : "bg-white text-black border border-black/10 shadow-sm hover:bg-neutral-50"
            }`}
        >
          <ArrowLeft
            size={18}
            className="transition-transform duration-300 ease-out group-hover:-translate-x-1"
          />
          Go Back
        </button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={loading}
          className={`px-6 py-3 text-white text-[14px] font-bold uppercase  cursor-pointer rounded-xl shadow-2xl flex items-center justify-center gap-3 
            ${loading ? "bg-orange-500/70 border-orange-500/50 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600 border border-orange-400"}
          `}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Confirming...
            </>
          ) : (
            <>
              Confirm Commission
              <Check size={18} strokeWidth={3} />
            </>
          )}
        </motion.button>

      </div>

    </div>
  );
}

