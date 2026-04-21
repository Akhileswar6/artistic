import { Info, ArrowRight } from "lucide-react";

export default function Details({ isDark, setStep, orderData, handleInputChange }) {

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(orderData.email);

  return (
    <div
      className={`rounded-2xl border p-6 md:p-8 mb-10 transition-all duration-300 ${isDark
        ? "border-white/10 bg-[#141416]/80 backdrop-blur-xl shadow-2xl shadow-black/40"
        : "border-black/5 bg-white/80 backdrop-blur-xl shadow-2xl shadow-black/5"
        }`}
    >
      <div className="flex items-center gap-3 mb-8">
        <h2 className="text-lg md:text-xl" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>Shipping Details</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">

        <div className="space-y-2">
          <label className={`text-[11px] uppercase tracking-widest ml-1 ${isDark ? "text-neutral-500" : "text-neutral-500"}`}>Full Name <span className="text-red-500">*</span></label>
          <input
            name="name"
            value={orderData.name}
            onChange={handleInputChange}
            placeholder="Enter Full Name"
            className={`w-full border p-2.5 rounded-lg text-[14px] outline-none transition-all capitalize
              ${isDark
                ? "border-white/10 bg-white/[0.02] text-white focus:border-white/30 focus:bg-white/[0.05] placeholder:text-neutral-700"
                : "border-black/10 bg-black/[0.02] text-black focus:border-black/30 focus:bg-black/5 placeholder:text-neutral-400"
              }`}
          />
        </div>

        <div className="space-y-2">
          <label className={`text-[11px] uppercase tracking-widest ml-1 ${isDark ? "text-neutral-500" : "text-neutral-500"}`}>Email Address <span className="text-red-500">*</span></label>
          <input
            name="email"
            value={orderData.email}
            onChange={handleInputChange}
            type="email"
            placeholder="Enter Email Address"
            className={`w-full border p-2.5 rounded-lg text-[14px] outline-none transition-all ${isDark
              ? "border-white/10 bg-white/[0.02] text-white focus:border-white/30 focus:bg-white/[0.05] placeholder:text-neutral-700"
              : "border-black/10 bg-black/[0.02] text-black focus:border-black/30 focus:bg-black/5 placeholder:text-neutral-400"
              } ${orderData.email && !isEmailValid ? "border-red-500/50 focus:border-red-500" : ""}`}
          />
          {orderData.email && !isEmailValid && (
            <p className="text-[11px] font-medium text-red-500 ml-1">Requires a valid email format</p>
          )}
        </div>

        <div className="space-y-2">
          <label className={`text-[11px]  uppercase tracking-widest ml-1 ${isDark ? "text-neutral-500" : "text-neutral-500"}`}>Contact Number <span className="text-red-500">*</span></label>

          <div className="relative flex items-center">
            <span
              className={`absolute left-4 text-[14px] font-medium ${isDark ? "text-neutral-600" : "text-neutral-400"
                }`}
            >
              +91
            </span>

            <input
              name="phone"
              value={orderData.phone}
              onChange={handleInputChange}
              inputMode="numeric"
              placeholder="10-digit Mobile Number"
              className={`w-full pl-12 pr-3 p-2.5 border rounded-lg text-[14px] focus:outline-none transition-all ${isDark
                ? "border-white/10 bg-white/[0.02] text-white focus:border-white/30 focus:bg-white/[0.05] placeholder:text-neutral-700"
                : "border-black/10 bg-black/[0.02] text-black focus:border-black/30 focus:bg-black/5 placeholder:text-neutral-400"
                } ${orderData.phone && orderData.phone.replace(/\s/g, "").length !== 10 ? "border-orange-500/50" : ""}`}
            />
          </div>

          {orderData.phone &&
            orderData.phone.replace(/\s/g, "").length < 10 && (
              <p className="text-[11px] text-red-500 font-medium ml-1">
                Required: 10 digits ({orderData.phone.replace(/\s/g, "").length}/10)
              </p>
            )}
        </div>
      </div>

      <div className="mt-8 space-y-2">
        <label className={`text-[11px]  uppercase tracking-widest ml-1 ${isDark ? "text-neutral-500" : "text-neutral-500"}`}>Delivery Location <span className="text-red-500">*</span></label>
        <textarea
          name="address"
          value={orderData.address}
          onChange={handleInputChange}
          rows="3"
          placeholder="Complete physical address including landmarks and postal code..."
          className={`w-full p-4 rounded-lg border text-[14px] focus:outline-none transition-all resize-none ${isDark
            ? "border-white/10 bg-white/[0.02] text-white focus:border-white/30 focus:bg-white/[0.05] placeholder:text-neutral-700"
            : "border-black/10 bg-black/[0.02] text-black focus:border-black/30 focus:bg-black/5 placeholder:text-neutral-400"
            }`}
        />
      </div>

      {/* Info Notice */}
      <div
        className={`flex items-start gap-4 mt-8 p-5 rounded-lg border transition-all ${isDark
          ? "bg-[#1c1c1c]/50 border-white/5"
          : "bg-black/[0.02] border-black/5"
          }`}
      >
        <Info size={18} className={`shrink-0 mt-0.5 ${isDark ? "text-neutral-500" : "text-neutral-400"}`} />
        <p className={`text-[13px]  font-medium ${isDark ? "text-neutral-400" : "text-neutral-500"}`}>
          Client information is strictly confidential. Details are solely utilized for secure delivery coordination and critical studio updates regarding your commission.
        </p>
      </div>

      <button
        onClick={() => setStep(2)}
        disabled={!orderData.name || !isEmailValid || orderData.phone.length !== 10 || !orderData.address}
        className={`mt-10 w-full px-5 py-3 text-[14px] font-bold uppercase  rounded-lg transition-all duration-300 flex items-center justify-center gap-3 group cursor-pointer ${isDark
          ? "bg-white text-black hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-600 disabled:cursor-not-allowed"
          : "bg-black text-white hover:bg-neutral-800 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed"
          }`}
      >
        Proceed to Art Selection
        <ArrowRight
          size={18}
          className="transition-transform duration-300 ease-out group-hover:translate-x-2"
        />
      </button>
    </div>
  );
}
