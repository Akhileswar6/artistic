import { useState, useMemo } from "react";
import {
  X,
  Tag,
  Check,
  Copy,
  Sparkles,
  Lock,
  Percent,
  IndianRupee,
  Loader2,
  AlertCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

// ==========================================
// 🎨 MASCOT SVGS MATCHING THE USER'S IMAGE
// ==========================================
const Mascots = [
  // 1. Orange Mascot (Joyful round dumpling with open smile)
  (
    <svg viewBox="0 0 120 120" className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-md select-none">
      <defs>
        <radialGradient id="m1-grad" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ffb03a" />
          <stop offset="100%" stopColor="#e56708" />
        </radialGradient>
      </defs>
      {/* Sprout on head */}
      <path d="M58 24 C55 12, 65 10, 68 18 C72 12, 80 16, 74 24 Z" fill="#4ade80" />
      {/* Body */}
      <ellipse cx="60" cy="68" rx="46" ry="40" fill="url(#m1-grad)" />
      {/* Blushing cheeks */}
      <circle cx="34" cy="68" r="6" fill="#f97316" opacity="0.6" />
      <circle cx="86" cy="68" r="6" fill="#f97316" opacity="0.6" />
      {/* Eyes */}
      <circle cx="44" cy="58" r="4.5" fill="#18181b" />
      <circle cx="76" cy="58" r="4.5" fill="#18181b" />
      <circle cx="45.5" cy="56.5" r="1.5" fill="#ffffff" />
      <circle cx="77.5" cy="56.5" r="1.5" fill="#ffffff" />
      {/* Big open mouth smile */}
      <path d="M46 68 Q60 88 74 68 Z" fill="#18181b" />
      <path d="M50 74 Q60 84 70 74 Q60 80 50 74 Z" fill="#f43f5e" />
    </svg>
  ),

  // 2. Yellow Mascot (Cute character with black hair tuft and wide laugh)
  (
    <svg viewBox="0 0 120 120" className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-md select-none">
      <defs>
        <radialGradient id="m2-grad" cx="45%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffea55" />
          <stop offset="100%" stopColor="#f59e0b" />
        </radialGradient>
      </defs>
      {/* Body */}
      <ellipse cx="60" cy="70" rx="44" ry="42" fill="url(#m2-grad)" />
      {/* Black hair tuft */}
      <path d="M40 38 Q60 14 80 34 Q66 38 60 48 Q50 38 40 38 Z" fill="#18181b" />
      <line x1="60" y1="18" x2="60" y2="10" stroke="#18181b" strokeWidth="3" strokeLinecap="round" />
      {/* Laughing curved eyes */}
      <path d="M40 58 Q46 50 52 58" fill="none" stroke="#18181b" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M68 58 Q74 50 80 58" fill="none" stroke="#18181b" strokeWidth="3.5" strokeLinecap="round" />
      {/* Cute whisker blushes */}
      <line x1="33" y1="64" x2="33" y2="69" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="37" y1="64" x2="37" y2="69" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="83" y1="64" x2="83" y2="69" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="87" y1="64" x2="87" y2="69" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" />
      {/* Open happy mouth */}
      <path d="M44 68 Q60 92 76 68 Z" fill="#18181b" />
      <path d="M48 76 Q60 88 72 76 Z" fill="#f43f5e" />
    </svg>
  ),

  // 3. Slate Navy Mascot (Artistic paint pot / ramen with cute character)
  (
    <svg viewBox="0 0 120 120" className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-md select-none">
      {/* Bowl / Pot */}
      <ellipse cx="68" cy="74" rx="42" ry="32" fill="#2d3748" />
      <ellipse cx="68" cy="62" rx="36" ry="18" fill="#f97316" />
      {/* Soup highlights & ingredients */}
      <ellipse cx="60" cy="58" rx="8" ry="6" fill="#fef08a" />
      <circle cx="60" cy="58" r="3.5" fill="#f59e0b" />
      <ellipse cx="78" cy="62" rx="7" ry="5" fill="#fef08a" />
      <circle cx="78" cy="62" r="3" fill="#f59e0b" />
      {/* Paintbrush / chopsticks dipping */}
      <line x1="16" y1="20" x2="62" y2="78" stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" />
      <line x1="28" y1="18" x2="68" y2="74" stroke="#e2e8f0" strokeWidth="3.5" strokeLinecap="round" />
      {/* Cute little splash mascot */}
      <circle cx="70" cy="46" r="12" fill="#fed7aa" />
      <circle cx="67" cy="44" r="1.5" fill="#18181b" />
      <circle cx="73" cy="44" r="1.5" fill="#18181b" />
      <path d="M68 48 Q70 51 72 48" fill="none" stroke="#18181b" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),

  // 4. Teal Mascot (Group of cute colorful friends)
  (
    <svg viewBox="0 0 120 120" className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-md select-none">
      {/* Tall Red/Coral Friend */}
      <rect x="68" y="24" width="34" height="66" rx="17" fill="#f43f5e" />
      <circle cx="80" cy="38" r="3" fill="#18181b" />
      <circle cx="92" cy="38" r="3" fill="#18181b" />
      <path d="M80 46 Q86 54 92 46 Z" fill="#18181b" />
      {/* Purple Friend */}
      <rect x="42" y="44" width="28" height="46" rx="14" fill="#a855f7" />
      <circle cx="51" cy="54" r="2.5" fill="#18181b" />
      <circle cx="61" cy="54" r="2.5" fill="#18181b" />
      <path d="M52 60 Q56 64 60 60 Z" fill="#18181b" />
      {/* Yellow Friend front */}
      <ellipse cx="66" cy="80" rx="22" ry="18" fill="#facc15" />
      <path d="M54 74 Q66 64 78 74 Z" fill="#18181b" />
      <circle cx="58" cy="78" r="2" fill="#18181b" />
      <circle cx="74" cy="78" r="2" fill="#18181b" />
      <path d="M60 84 Q66 90 72 84 Z" fill="#18181b" />
    </svg>
  ),

  // 5. Pink / Berry Mascot (Happy strawberry-red oval character)
  (
    <svg viewBox="0 0 120 120" className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-md select-none">
      <defs>
        <radialGradient id="m5-grad" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="100%" stopColor="#be123c" />
        </radialGradient>
      </defs>
      {/* Little hair tuft */}
      <path d="M58 20 C54 10, 66 10, 68 18 C72 10, 80 14, 74 22 Z" fill="#f43f5e" />
      {/* Tall curved body */}
      <rect x="36" y="24" width="56" height="78" rx="28" fill="url(#m5-grad)" />
      {/* Blushing cheeks */}
      <ellipse cx="44" cy="64" rx="5" ry="4" fill="#f43f5e" />
      <ellipse cx="84" cy="64" rx="5" ry="4" fill="#f43f5e" />
      {/* Cheerful curved eyes */}
      <path d="M46 54 Q52 48 56 54" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
      <path d="M72 54 Q76 48 82 54" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
      {/* Big toothy mouth */}
      <path d="M50 64 Q64 84 78 64 Z" fill="#18181b" />
      <rect x="56" y="64" width="16" height="6" rx="2" fill="#ffffff" />
    </svg>
  ),

  // 6. Violet Mascot (Friendly duo waving with confetti)
  (
    <svg viewBox="0 0 120 120" className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-md select-none">
      {/* Confetti particles */}
      <circle cx="28" cy="28" r="2.5" fill="#fbcfe8" />
      <rect x="88" y="24" width="4" height="4" transform="rotate(45 88 24)" fill="#fef08a" />
      <circle cx="48" cy="18" r="2" fill="#a7f3d0" />
      {/* Golden waving character */}
      <ellipse cx="50" cy="60" rx="18" ry="34" transform="rotate(-12 50 60)" fill="#f59e0b" />
      <line x1="60" y1="44" x2="74" y2="24" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
      <circle cx="44" cy="48" r="2" fill="#18181b" />
      <circle cx="54" cy="46" r="2" fill="#18181b" />
      <path d="M46 54 Q50 58 54 54" fill="none" stroke="#18181b" strokeWidth="2" strokeLinecap="round" />
      {/* Purple friend with mustache / smile */}
      <rect x="62" y="44" width="30" height="52" rx="15" fill="#9333ea" />
      <circle cx="70" cy="54" r="2.5" fill="#ffffff" />
      <circle cx="82" cy="54" r="2.5" fill="#ffffff" />
      {/* Cute smile */}
      <path d="M72 62 Q76 66 80 62" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
];

// ==========================================
// 🎨 6 COLOR THEMES MATCHING USER'S IMAGE
// ==========================================
const CardThemes = [
  // 0: Orange
  {
    gradient: "from-[#f27e26] to-[#e66c14]",
    accentBg: "bg-[#f27e26]",
    footerBg: "bg-[#c85808]/70",
    textColor: "text-white",
    subtextColor: "text-white/95",
    btnColor: "bg-white text-[#d65a07] hover:bg-neutral-100",
  },
  // 1: Vibrant Yellow / Gold
  {
    gradient: "from-[#fbc81d] to-[#f4b810]",
    accentBg: "bg-[#fbc81d]",
    footerBg: "bg-[#c49303]/70",
    textColor: "text-white",
    subtextColor: "text-white/95",
    btnColor: "bg-white text-[#946e02] hover:bg-neutral-100",
  },
  // 2: Slate Navy
  {
    gradient: "from-[#6f7c8b] to-[#556271]",
    accentBg: "bg-[#6f7c8b]",
    footerBg: "bg-[#3e4a57]/70",
    textColor: "text-white",
    subtextColor: "text-white/95",
    btnColor: "bg-white text-[#3e4a57] hover:bg-neutral-100",
  },
  // 3: Emerald Teal
  {
    gradient: "from-[#29b7a7] to-[#1da294]",
    accentBg: "bg-[#29b7a7]",
    footerBg: "bg-[#147e73]/70",
    textColor: "text-white",
    subtextColor: "text-white/95",
    btnColor: "bg-white text-[#158074] hover:bg-neutral-100",
  },
  // 4: Crimson Berry / Watermelon
  {
    gradient: "from-[#db4365] to-[#c83254]",
    accentBg: "bg-[#db4365]",
    footerBg: "bg-[#a31f3c]/70",
    textColor: "text-white",
    subtextColor: "text-white/95",
    btnColor: "bg-white text-[#b91c3f] hover:bg-neutral-100",
  },
  // 5: Purple Violet
  {
    gradient: "from-[#7d56c9] to-[#6740b7]",
    accentBg: "bg-[#7d56c9]",
    footerBg: "bg-[#4e299b]/70",
    textColor: "text-white",
    subtextColor: "text-white/95",
    btnColor: "bg-white text-[#5c34ae] hover:bg-neutral-100",
  },
];

export default function CouponExplorerModal({
  isOpen,
  onClose,
  coupons = [],
  loading = false,
  subtotal = 0,
  activeCouponCode = "",
  onApplyCoupon,
  onRemoveCoupon,
  isDark = true,
}) {
  const [manualCode, setManualCode] = useState("");
  const [manualLoading, setManualLoading] = useState(false);
  const [manualError, setManualError] = useState("");
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopy = (code, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon "${code}" copied!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleManualApply = async (e) => {
    e.preventDefault();
    const code = manualCode.trim().toUpperCase();
    if (!code) {
      setManualError("Please enter a coupon code");
      return;
    }
    setManualLoading(true);
    setManualError("");

    const res = await onApplyCoupon(code);
    setManualLoading(false);

    if (res?.success) {
      setManualCode("");
      onClose();
    } else {
      setManualError(res?.message || "Invalid or expired coupon");
    }
  };

  // Helper to calculate prospective savings
  const calculatePotentialSavings = (coupon) => {
    if (subtotal <= 0) return 0;
    if (coupon.discountType === "percentage") {
      const rawDiscount = Math.round((subtotal * coupon.discountValue) / 100);
      return coupon.maxDiscount ? Math.min(rawDiscount, coupon.maxDiscount) : rawDiscount;
    }
    return Math.min(coupon.discountValue, subtotal);
  };

  // Separate coupons into eligible and locked
  const { eligibleCoupons, lockedCoupons } = useMemo(() => {
    const eligible = [];
    const locked = [];

    coupons.forEach((coupon) => {
      const minRequired = coupon.minOrderValue || 0;
      if (subtotal >= minRequired) {
        eligible.push(coupon);
      } else {
        locked.push(coupon);
      }
    });

    return { eligibleCoupons: eligible, lockedCoupons: locked };
  }, [coupons, subtotal]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className={`relative w-full max-w-3xl rounded-3xl shadow-2xl border overflow-hidden my-auto z-10 flex flex-col max-h-[92vh] ${isDark
              ? "bg-[#181a20] border-white/10 text-white"
              : "bg-[#1f232c] border-black/10 text-white"
            }`}
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between shrink-0 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div>
                <h3
                  className="text-lg sm:text-xl font-medium tracking-tight text-white"
                  style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
                >
                  Redeem Coupons & Save
                </h3>
                <p className="text-[12px] text-neutral-400">
                  Select a voucher to automatically redeem instant savings on your portrait
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close"
            >
              <X size={20} />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
            {/* Top Bar: Manual Code Input & Cart Subtotal */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              {/* Manual Input */}
              <form onSubmit={handleManualApply} className="flex-1">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      value={manualCode}
                      onChange={(e) => {
                        setManualCode(e.target.value.toUpperCase());
                        setManualError("");
                      }}
                      className="w-full pl-10 pr-4 py-2.5 text-sm font-mono font-bold uppercase rounded-xl border border-white/10 bg-black/40 text-white placeholder:text-neutral-500 focus:border-white/60 outline-none transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={manualLoading || !manualCode.trim()}
                    className="px-5 py-2.5 rounded-xl text-sm font-medium uppercase tracking-wider bg-white text-black hover:bg-neutral-200 transition-all disabled:opacity-40 cursor-pointer shadow-md"
                  >
                    {manualLoading ? <Loader2 size={14} className="animate-spin" /> : "Redeem"}
                  </button>
                </div>
                {manualError && (
                  <p className="text-[11px] text-rose-400 flex items-center gap-1 mt-1.5 font-medium">
                    <AlertCircle size={12} /> {manualError}
                  </p>
                )}
              </form>

              {/* Subtotal Pill */}
              <div className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between sm:justify-end gap-3 text-xs shrink-0">
                <span className="text-[11px] text-neutral-400 uppercase tracking-wider font-semibold">
                  Order Subtotal
                </span>
                <span className="font-extrabold text-white text-sm" style={{ fontFamily: "Bricolage Grotesque" }}>
                  ₹{subtotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Loading State */}
            {loading && coupons.length === 0 && (
              <div className="py-16 text-center space-y-3">
                <Loader2 size={28} className="animate-spin mx-auto text-amber-400" />
                <p className="text-xs text-neutral-400">Loading coupons and exclusive offers...</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && coupons.length === 0 && (
              <div className="p-12 rounded-3xl border border-white/10 text-center space-y-3 bg-white/[0.01]">
                <Tag size={36} className="mx-auto text-neutral-500 opacity-60" />
                <h4 className="text-base font-bold text-white">No Coupons Available Right Now</h4>
                <p className="text-xs max-w-sm mx-auto text-neutral-400">
                  There are no active public promotional vouchers at the moment. You can still enter a private discount code above.
                </p>
              </div>
            )}

            {/* ======================================================== */}
            {/* 🎟️ VIBRANT TICKET CARDS MATCHING THE USER'S IMAGE */}
            {/* ======================================================== */}
            {coupons.length > 0 && (
              <div className="space-y-6">
                {/* 1. ELIGIBLE / ACTIVE COUPONS */}
                {eligibleCoupons.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                        Available For Your Order ({eligibleCoupons.length})
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {eligibleCoupons.map((coupon, index) => {
                        const theme = CardThemes[index % CardThemes.length];
                        const mascot = Mascots[index % Mascots.length];
                        const isApplied = activeCouponCode === coupon.code;
                        const savings = calculatePotentialSavings(coupon);

                        return (
                          <div
                            key={coupon._id || coupon.code}
                            className={`rounded-2xl transition-all duration-300 relative overflow-hidden shadow-md flex flex-col justify-between group border-0 
                               outline-none ${isApplied
                                ? "scale-[1.01]"
                                : "hover:scale-[1.02]"
                              }`}
                            style={{
                              background: `linear-gradient(135deg, ${index % 6 === 0 ? "#f27e26, #e66c14" :
                                  index % 6 === 1 ? "#fbc81d, #f4b810" :
                                    index % 6 === 2 ? "#6f7c8b, #556271" :
                                      index % 6 === 3 ? "#29b7a7, #1da294" :
                                        index % 6 === 4 ? "#db4365, #c83254" :
                                          "#7d56c9, #6740b7"
                                })`,
                            }}
                          >
                            {/* Left & Right Circular Cutout Notches */}
                            <div
                              className={`absolute -left-3.5 bottom-[35px] -translate-y-1/2 w-7 h-7 rounded-full ${isDark ? "bg-[#181a20]" : "bg-[#1f232c]"
                                } shadow-inner pointer-events-none z-10`}
                            />
                            <div
                              className={`absolute -right-3.5 bottom-[35px] -translate-y-1/2 w-7 h-7 rounded-full ${isDark ? "bg-[#181a20]" : "bg-[#1f232c]"
                                } shadow-inner pointer-events-none z-10`}
                            />

                            {/* Main Upper Voucher Area */}
                            <div className="p-4 sm:p-5 relative flex items-start justify-between min-h-[120px]">
                              {/* Left Text & Details */}
                              <div className="space-y-1 z-10 pr-2 max-w-[68%]">
                                {/* Discount Big Bold Title */}
                                <h4
                                  className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none drop-shadow-sm"
                                  style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
                                >
                                  {coupon.discountType === "percentage"
                                    ? `${coupon.discountValue}% off`
                                    : `₹${coupon.discountValue} off`}
                                </h4>

                                {/* Description / Details */}
                                <p className="text-xs font-semibold text-white/95 leading-tight line-clamp-2 pt-1 drop-shadow-sm">
                                  {coupon.description || "Artistic portrait special order discount"}
                                </p>

                                {/* Code Pill + 1-Click Copy */}
                                <div className="pt-2 flex items-center gap-2 flex-wrap">
                                  <div
                                    onClick={(e) => handleCopy(coupon.code, e)}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/25 hover:bg-black/35 text-white text-[11px] font-mono font-bold uppercase tracking-wider backdrop-blur-sm cursor-pointer transition-all"
                                    title="Click to copy coupon code"
                                  >
                                    <span>{coupon.code}</span>
                                    {copiedCode === coupon.code ? (
                                      <Check size={12} className="text-emerald-300" />
                                    ) : (
                                      <Copy size={11} className="opacity-70" />
                                    )}
                                  </div>

                                  {/* Redeem / Redeemed Button */}
                                  {isApplied ? (
                                    <div className="inline-flex items-center gap-1.5 bg-white text-emerald-700 font-extrabold text-[11px] px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                                      <Check size={12} strokeWidth={2.5} /> Redeemed
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          onRemoveCoupon();
                                        }}
                                        className="text-[10px] text-red-500 hover:text-red-700 font-extrabold ml-1.5 uppercase hover:opacity-80 transition-opacity cursor-pointer"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={async () => {
                                        const res = await onApplyCoupon(coupon.code);
                                        if (res?.success) onClose();
                                      }}
                                      className={`px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-md transition-all transform hover:scale-105 active:scale-95 cursor-pointer ${theme.btnColor}`}
                                    >
                                      Redeem
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* Right Playful Mascot SVG */}
                              <div className="absolute right-1 -bottom-2 pointer-events-none opacity-95 transition-transform group-hover:scale-110 duration-300">
                                {mascot}
                              </div>
                            </div>

                            {/* Bottom Darkened Translucent Strip */}
                            <div className={`${theme.footerBg} px-5 py-2.5 text-[10px] sm:text-[11px] font-bold text-white/95 uppercase tracking-wider flex items-center justify-between z-10 border-t border-black/10`}>
                              <span className="truncate">
                                {coupon.expiryDate ? `VALID TILL ${new Date(coupon.expiryDate).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" })} • ` : ""}
                                {coupon.minOrderValue > 0
                                  ? `ORDERS ABOVE ₹${coupon.minOrderValue.toLocaleString()}`
                                  : "ALL ARTWORK ORDERS"}
                                {coupon.maxDiscount ? ` (MAX ₹${coupon.maxDiscount})` : ""}
                              </span>

                              {savings > 0 && (
                                <span className="shrink-0 bg-white/20 px-2 py-0.5 rounded text-[10px] font-extrabold tracking-normal">
                                  Save ₹{savings.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. LOCKED / INELIGIBLE COUPONS (WITH BLINKIT/SWIGGY UNLOCK PROMPT) */}
                {lockedCoupons.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                        <Lock size={12} /> Unlock With Higher Order Value ({lockedCoupons.length})
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {lockedCoupons.map((coupon, index) => {
                        const themeIndex = (index + eligibleCoupons.length) % CardThemes.length;
                        const theme = CardThemes[themeIndex];
                        const mascot = Mascots[themeIndex];
                        const difference = (coupon.minOrderValue || 0) - subtotal;
                        const progress = Math.min(100, Math.round((subtotal / coupon.minOrderValue) * 100));

                        return (
                          <div
                            key={coupon._id || coupon.code}
                            className="rounded-2xl relative overflow-hidden shadow-md flex flex-col justify-between opacity-85 hover:opacity-100 transition-opacity border-0 border-transparent hover:border-transparent outline-none"
                            style={{
                              background: `linear-gradient(135deg, ${themeIndex % 6 === 0 ? "#f27e26, #e66c14" :
                                  themeIndex % 6 === 1 ? "#fbc81d, #f4b810" :
                                    themeIndex % 6 === 2 ? "#6f7c8b, #556271" :
                                      themeIndex % 6 === 3 ? "#29b7a7, #1da294" :
                                        themeIndex % 6 === 4 ? "#db4365, #c83254" :
                                          "#7d56c9, #6740b7"
                                })`,
                            }}
                          >
                            {/* Left & Right Circular Cutout Notches */}
                            <div
                              className={`absolute -left-3.5 bottom-[42px] -translate-y-1/2 w-7 h-7 rounded-full ${isDark ? "bg-[#181a20]" : "bg-[#1f232c]"
                                } shadow-inner pointer-events-none z-10`}
                            />
                            <div
                              className={`absolute -right-3.5 bottom-[42px] -translate-y-1/2 w-7 h-7 rounded-full ${isDark ? "bg-[#181a20]" : "bg-[#1f232c]"
                                } shadow-inner pointer-events-none z-10`}
                            />

                            {/* Upper Area */}
                            <div className="p-4 sm:p-5 relative flex items-start justify-between min-h-[120px]">
                              <div className="space-y-1 z-10 pr-2 max-w-[68%]">
                                <h4
                                  className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none drop-shadow-sm"
                                  style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
                                >
                                  {coupon.discountType === "percentage"
                                    ? `${coupon.discountValue}% off`
                                    : `₹${coupon.discountValue} off`}
                                </h4>

                                <p className="text-xs font-semibold text-white/95 leading-tight line-clamp-2 pt-1 drop-shadow-sm">
                                  {coupon.description || "Artistic portrait special order discount"}
                                </p>

                                <div className="pt-2 flex items-center gap-2">
                                  <div className="inline-flex items-center px-2 py-0.5 rounded bg-black/25 text-white/90 text-[10px] font-mono font-bold uppercase tracking-wider">
                                    <span>{coupon.code}</span>
                                  </div>
                                  <span className="text-[10px] font-black uppercase tracking-wider bg-black/30 text-white/80 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                    <Lock size={10} /> Locked
                                  </span>
                                </div>
                              </div>

                              {/* Right Playful Mascot SVG */}
                              <div className="absolute right-1 -bottom-2 pointer-events-none opacity-80">
                                {mascot}
                              </div>
                            </div>

                            {/* Bottom Strip With Progress */}
                            <div className={`${theme.footerBg} px-5 py-2.5 text-[10px] sm:text-[11px] font-bold text-white uppercase tracking-wider z-10 border-t border-black/10 space-y-1.5`}>
                              <div className="flex items-center justify-between text-[10px]">
                                <span>Add ₹{difference.toLocaleString()} more to unlock</span>
                                <span>{progress}%</span>
                              </div>
                              <div className="w-full bg-black/30 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className="bg-white h-full rounded-full transition-all duration-300"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-3.5 border-t border-white/10 text-center text-[11px] text-neutral-400 shrink-0 bg-white/[0.02]">
            <span>Click any voucher to redeem instant savings on your order</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
