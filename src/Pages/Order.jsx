import { useState, useEffect, useRef } from "react";
import { API_BASE_URL } from "../config";

import axios from "axios";
import { Clock, Package, Info, Check, X, ShieldCheck, Lock, Tag, Loader2, AlertCircle, Sparkles, ChevronRight, TicketPercent, ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate, useOutletContext, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

import Details from "../Components/Order/Details";
import ArtPhoto from "../Components/Order/ArtPhoto";
import Review from "../Components/Order/Review";
import CouponExplorerModal from "../Components/Order/CouponExplorerModal";
import {
  saveOrderDraftText,
  getOrderDraftText,
  saveDraftPhoto,
  getDraftPhoto,
  clearDraftPhoto,
  clearOrderDraft,
  disableOrderDraftSaving,
  enableOrderDraftSaving,
} from "../utils/orderDraftStorage";
import { triggerPartyBlasters } from "../utils/confettiBlaster";

export default function Order({ isDark }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setShowSignIn } = useOutletContext();

  // If navigating with resetOrder flag, clear draft first
  if (location.state?.resetOrder) {
    clearOrderDraft();
  }

  // Load saved draft from localStorage if available
  const initialDraft = location.state?.resetOrder ? null : getOrderDraftText();

  // Always start on Step 1 (Select art style & photo) for any new/active session
  // Never trap or jump the user directly into Review page (Step 3) on entry
  const [step, setStep] = useState(1);
  const isSubmittedRef = useRef(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSuccessBlast, setShowSuccessBlast] = useState(false);
  const [successOrderInfo, setSuccessOrderInfo] = useState(null);

  // Form State (hydrated from saved draft so user data persists across refresh)
  const [orderData, setOrderData] = useState(() => {
    return {
      name: initialDraft?.name || user?.fullName || "",
      email: initialDraft?.email || user?.email || "",
      phone: initialDraft?.phone || "",
      address: initialDraft?.address || "",
      doorNo: initialDraft?.doorNo || "",
      street: initialDraft?.street || "",
      landmark: initialDraft?.landmark || "",
      city: initialDraft?.city || "",
      state: initialDraft?.state || "",
      pincode: initialDraft?.pincode || "",
      addressType: initialDraft?.addressType || "Home",
      artStyle: initialDraft?.artStyle || "realistic",
      frameOption: initialDraft?.frameOption || "noframe",
      quantity: initialDraft?.quantity ?? 1,
      extraPeople: initialDraft?.extraPeople ?? 0,
      rushDelivery: Boolean(initialDraft?.rushDelivery),
      couponCode: initialDraft?.couponCode || "",
      artworkId: location.state?.artworkId || initialDraft?.artworkId || null,
      instructions: initialDraft?.instructions || "",
      photo: null,
      rawFile: null,
      metadata: null,
    };
  });

  // Restore saved photo from IndexedDB on initial load
  useEffect(() => {
    let isMounted = true;
    getDraftPhoto().then((draftPhotoRecord) => {
      if (isMounted && draftPhotoRecord?.file) {
        const file = draftPhotoRecord.file;
        const previewUrl = URL.createObjectURL(file);
        setOrderData((prev) => ({
          ...prev,
          photo: previewUrl,
          rawFile: file,
          metadata: draftPhotoRecord.metadata || {
            name: file.name,
            size: (file.size / 1024 / 1024).toFixed(2) + " MB",
            type: file.type,
          },
        }));
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Re-enable draft saving on mount for new active drafting sessions
  useEffect(() => {
    enableOrderDraftSaving();
    isSubmittedRef.current = false;
  }, []);

  // Persist order data and current step to localStorage whenever they change
  useEffect(() => {
    if (isSubmittedRef.current) return;
    saveOrderDraftText(orderData, step);
  }, [orderData, step]);

  // Scroll to top whenever step changes so user starts at the top of the new step
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }, [step]);

  useEffect(() => {
    if (user) {
      setOrderData(prev => ({
        ...prev,
        name: prev.name?.trim() ? prev.name : (user.fullName || ""),
        email: prev.email?.trim() ? prev.email : (user.email || "")
      }));
    }
  }, [user]);

  const [loading, setLoading] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [systemConfig, setSystemConfig] = useState(null);

  // Backend Pricing Calculation State
  const [pricingBreakdown, setPricingBreakdown] = useState(null);
  const [isPricingLoading, setIsPricingLoading] = useState(false);
  const [couponInput, setCouponInput] = useState(() => initialDraft?.couponCode || "");
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  // Available Coupons (Swiggy / Blinkit style explorer)
  const [isCouponExplorerOpen, setIsCouponExplorerOpen] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [isCouponsLoading, setIsCouponsLoading] = useState(false);

  const fetchAvailableCoupons = async () => {
    setIsCouponsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(`${API_BASE_URL}/api/orders/available-coupons`, { headers });
      if (res.data?.success && Array.isArray(res.data.coupons)) {
        setAvailableCoupons(res.data.coupons);
      }
    } catch (err) {
      console.error("Failed to load available coupons", err);
    } finally {
      setIsCouponsLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableCoupons();
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/config`)
      .then(res => res.json())
      .then(data => setSystemConfig(data))
      .catch(console.error);
  }, []);

  // Labels
  const styleLabels = {
    realistic: "Realistic Portrait",
    sketch: "Pencil Sketch",
    couple: "Couple Art",
    anime: "Cartoon Anime",
    cartoon: "Cartoon Anime",
    cartoon_anime: "Cartoon Anime",
  };

  const stylePrices = {
    realistic: systemConfig?.artworkStyles?.realistic ?? systemConfig?.basePricing?.realistic ?? 500,
    sketch: systemConfig?.artworkStyles?.sketch ?? systemConfig?.basePricing?.sketch ?? 300,
    couple: systemConfig?.artworkStyles?.couple ?? systemConfig?.basePricing?.couple ?? 700,
    anime: systemConfig?.artworkStyles?.anime ?? systemConfig?.basePricing?.anime ?? 600,
  };

  // Authoritative Backend Price Calculation API call
  const calculatePrice = async (couponToTest = orderData.couponCode) => {
    setIsPricingLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.post(
        `${API_BASE_URL}/api/orders/calculate-price`,
        {
          artworkId: orderData.artworkId || undefined,
          style: orderData.artStyle,
          frame: orderData.frameOption,
          quantity: orderData.quantity,
          extraPeople: orderData.extraPeople,
          rushDelivery: orderData.rushDelivery,
          couponCode: couponToTest || undefined,
        },
        { headers }
      );

      if (response.data?.success) {
        const pricing = response.data.pricing || response.data;
        setPricingBreakdown(pricing);
        return { success: true, data: pricing };
      }
      return { success: false, message: response.data?.message || "Failed to calculate price" };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to calculate price";
      return { success: false, message: msg };
    } finally {
      setIsPricingLoading(false);
    }
  };

  // Recalculate price whenever relevant options change
  useEffect(() => {
    calculatePrice();
  }, [
    orderData.artStyle,
    orderData.frameOption,
    orderData.quantity,
    orderData.extraPeople,
    orderData.rushDelivery,
    orderData.artworkId,
    orderData.couponCode,
  ]);

  const handleApplyCoupon = async (codeToApply) => {
    const code = (typeof codeToApply === "string" ? codeToApply : couponInput).trim().toUpperCase();
    if (!code) {
      setCouponError("Please enter a coupon code");
      return { success: false, message: "Please enter a coupon code" };
    }

    // Check if the user already used this coupon
    const usedMatch = availableCoupons.find(
      (c) => c.code?.toUpperCase() === code && (c.alreadyUsed || c.isAlreadyUsed)
    );
    if (usedMatch) {
      const msg = "You have already used this coupon";
      setCouponError(msg);
      toast.error(msg);
      return { success: false, message: msg };
    }

    setCouponLoading(true);
    setCouponError("");

    const res = await calculatePrice(code);
    setCouponLoading(false);

    if (res?.success) {
      if (res.data.discount > 0) {
        setOrderData((prev) => ({ ...prev, couponCode: code }));
        setCouponInput(code);
        toast.success(`Coupon ${code} redeemed! Saved ₹${res.data.discount}`);
        return { success: true, data: res.data };
      } else {
        const msg = "Coupon is valid but provides ₹0 discount on this order";
        setCouponError(msg);
        toast.error(msg);
        return { success: false, message: msg };
      }
    } else {
      const msg = res?.message || "Invalid or expired coupon";
      setCouponError(msg);
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const handleRemoveCoupon = () => {
    setCouponInput("");
    setCouponError("");
    setOrderData(prev => ({ ...prev, couponCode: "" }));
    toast.success("Coupon removed");
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
      const metadata = {
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + " MB",
        type: file.type,
        width: img.width,
        height: img.height,
      };
      setOrderData((prev) => ({
        ...prev,
        photo: url,
        rawFile: file,
        metadata,
      }));
      saveDraftPhoto(file, metadata);
    };

    img.src = url;
  };

  const removePhoto = () => {
    setOrderData((prev) => ({ ...prev, photo: null, rawFile: null, metadata: null }));
    clearDraftPhoto();
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token || !user) {
      toast.error("Please sign in to place your commission order");
      setShowAuthModal(true);
      return;
    }

    if (!orderData.rawFile) {
      return toast.error("Please upload a photo first");
    }

    setLoading(true);

    try {
      // Use FormData to send options and the file to backend
      // NOTE: NEVER send client-calculated price. Backend is the single source of truth!
      const formData = new FormData();
      formData.append("name", orderData.name);
      formData.append("email", orderData.email);
      formData.append("phone", orderData.phone);
      formData.append("address", orderData.address);
      formData.append("artStyle", orderData.artStyle);
      formData.append("frameOption", orderData.frameOption);
      formData.append("quantity", orderData.quantity || 1);
      formData.append("extraPeople", orderData.extraPeople || 0);
      formData.append("rushDelivery", orderData.rushDelivery ? "true" : "false");
      if (orderData.couponCode) {
        formData.append("couponCode", orderData.couponCode);
      }
      if (orderData.artworkId) {
        formData.append("artworkId", orderData.artworkId);
      }
      formData.append("instructions", orderData.instructions || "");
      formData.append("photo", orderData.rawFile);

      const response = await axios.post(
        `${API_BASE_URL}/api/orders/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 1. Immediately block any further auto-saving of this placed order
      disableOrderDraftSaving();
      isSubmittedRef.current = true;

      // 2. Wipe persistent storage completely (localStorage, sessionStorage, IndexedDB)
      await clearOrderDraft();

      // 3. Trigger party blasters celebration explosion!
      triggerPartyBlasters();

      const createdOrderId = response.data?.order?._id || "ORD-" + Date.now().toString().slice(-6);
      const placedStyleLabel = styleLabels[orderData.artStyle] || orderData.artStyle;
      const placedTotal = finalTotalDisplay;
      const placedAdvance = advanceAmountDisplay;

      setSuccessOrderInfo({
        orderId: createdOrderId,
        artStyle: placedStyleLabel,
        total: placedTotal,
        advance: placedAdvance,
      });
      setShowSuccessBlast(true);

      toast.success("Order confirmed successfully! 🎉");

      // 4. Revoke previous preview URL if any
      if (orderData.photo && orderData.photo.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(orderData.photo);
        } catch (_) {}
      }

      // 5. Completely reset form state back to clean initial values for any subsequent order
      setStep(1);
      setOrderData({
        name: user?.fullName || "",
        email: user?.email || "",
        phone: "",
        address: "",
        doorNo: "",
        street: "",
        landmark: "",
        city: "",
        state: "",
        pincode: "",
        addressType: "Home",
        artStyle: "realistic",
        frameOption: "noframe",
        quantity: 1,
        extraPeople: 0,
        rushDelivery: false,
        couponCode: "",
        artworkId: null,
        instructions: "",
        photo: null,
        rawFile: null,
        metadata: null,
      });
      setPricingBreakdown(null);
      setCouponInput("");
      setCouponError("");

    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("loginTimestamp");
        toast.error("Your session has expired. Please sign in to place your order.");
        setShowAuthModal(true);
      } else {
        toast.error(err.response?.data?.message || "Failed to submit request");
      }
    } finally {
      setLoading(false);
    }
  };

  const currentStylePrice = pricingBreakdown?.styleCharge ?? stylePrices[orderData.artStyle] ?? 500;
  const effectiveSubtotal = pricingBreakdown?.subtotal ?? currentStylePrice;
  const effectiveDiscount = pricingBreakdown?.discount ?? 0;
  const finalTotalDisplay = pricingBreakdown?.finalTotal ?? Math.max(0, effectiveSubtotal - effectiveDiscount);
  const advanceAmountDisplay = Math.round(finalTotalDisplay * 0.25);
  const balanceAmountDisplay = Math.max(0, finalTotalDisplay - advanceAmountDisplay);

  return (
    <div
      className={`min-h-[calc(100vh-64px)] pt-24 md:pt-32 pb-12 md:pb-20 px-4 md:px-8 transition-colors duration-500 relative overflow-hidden ${isDark ? "bg-[#0a0a0b] text-white" : "bg-[#f8f9fa] text-black"
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
          className="text-center mb-10 md:mb-16"
        >
          <h1
            className="text-2xl md:text-4xl font-bold tracking-tight mb-2 md:mb-3"
            style={{ fontFamily: "Bricolage Grotesque" }}
          >
            Start Your <span className="text-neutral-500 font-bold">Masterpiece</span>
          </h1>
          <p className={`max-w-xl mx-auto text-[12px] md:text-[14px] leading-relaxed ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
            Order your custom portrait now and get it delivered to your doorstep
          </p>
        </motion.div>

        {/* STEPS INDICATOR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center items-center gap-2 md:gap-8 mb-8 md:mb-12"
        >
          {[
            { num: 1, label: "Details" },
            { num: 2, label: "Artwork" },
            { num: 3, label: "Confirm" }
          ].map((s, index) => (
            <div key={s.num} className="flex items-center gap-2 md:gap-8">
              <div className="flex flex-col md:flex-row items-center gap-1.5 md:gap-3 group cursor-pointer" onClick={() => step > s.num && setStep(s.num)}>
                <div className={`w-6 h-6 md:w-8 md:h-8 text-[10px] md:text-[14px] rounded-full flex items-center justify-center transition-all duration-300 ${step > s.num
                  ? "bg-green-500 text-white"
                  : step === s.num
                    ? "bg-neutral-700 text-white scale-110 shadow-lg"
                    : isDark ? "bg-[#141416] text-neutral-600 border border-white/5" : "bg-white text-neutral-400 border border-black/5 shadow-sm"
                  }`}>
                  {step > s.num ? <Check size={12} className="md:w-[18px]" strokeWidth={3} /> : s.num}
                </div>
                <span className={`text-[9px] md:text-[13px] uppercase font-bold tracking-tight md:tracking-widest transition-colors ${step >= s.num ? (isDark ? "text-white" : "text-black") : (isDark ? "text-neutral-600" : "text-neutral-400")
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

        {/* STEP 1: DETAILS ONLY (Centered, No Commission Summary) */}
        {step === 1 ? (
          <motion.div
            key="step-1-details"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
            className="max-w-3xl mx-auto"
          >
            <Details
              isDark={isDark}
              setStep={setStep}
              orderData={orderData}
              setOrderData={setOrderData}
              handleInputChange={handleInputChange}
              user={user}
              setShowAuthModal={() => setShowAuthModal(true)}
            />
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* LEFT SIDE (Steps Content: Artwork or Review - First on phone, Left on desktop) */}
            <div className="lg:col-span-8 order-1 lg:order-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
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
                      setShowAuthModal={() => setShowAuthModal(true)}
                      stylePrices={stylePrices}
                      systemConfig={systemConfig}
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

            {/* RIGHT SIDE (Dynamic Order Summary - Lower on phone, Right sticky on desktop) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col gap-6 lg:sticky lg:top-28 self-start lg:col-span-4 order-2 lg:order-2"
            >
            {/* ORDER SUMMARY */}
            <div
              className={`rounded-3xl border p-4 sm:p-5 xl:p-6 transition-all duration-300 shadow-xl relative overflow-hidden ${isDark
                ? "bg-[#131418]/90 backdrop-blur-2xl border-white/[0.08] shadow-2xl shadow-black/50"
                : "bg-white/95 backdrop-blur-2xl border-black/[0.06] shadow-xl shadow-neutral-200/50"
                }`}
            >
              {/* Subtle Ambient Glow */}
              <div className="absolute -top-20 -right-20 w-44 h-44 bg-emerald-500/[0.06] rounded-full blur-3xl pointer-events-none" />

              {/* Header */}
              <div className="flex justify-between items-center mb-5 relative z-10">
                <div>
                  <h3 className="text-lg md:text-xl font-medium tracking-tight" style={{ fontFamily: "Bricolage Grotesque" }}>
                    Commission Summary
                  </h3>
                  <p className={`text-[11px] font-medium pt-0.5 ${isDark ? "text-neutral-400" : "text-neutral-500"}`}>
                    Handcrafted Custom Portrait
                  </p>
                </div>
                {isPricingLoading ? (
                  <Loader2 size={16} className="animate-spin text-neutral-400" />
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Verified
                  </span>
                )}
              </div>

              <div className="space-y-3.5 text-xs md:text-sm relative z-10">
                {/* Art Style Price */}
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{styleLabels[orderData.artStyle]}</span>
                  <span className="text-sm font-medium">₹{currentStylePrice.toLocaleString()}</span>
                </div>

                <div className={`h-[1px] w-full my-1 ${isDark ? "bg-white/[0.08]" : "bg-black/[0.06]"}`} />

                {/* Subtotal */}
                <div className="flex justify-between items-center text-xs opacity-75">
                  <span className="uppercase font-medium tracking-wider">Subtotal</span>
                  <span className="font-medium">₹{effectiveSubtotal.toLocaleString()}</span>
                </div>

                {/* Coupon Discount */}
                {effectiveDiscount > 0 && (
                  <div className="flex justify-between items-center text-emerald-400 font-medium">
                    <span className="flex items-center gap-1.5 text-xs">
                      <Tag size={13} className="text-emerald-400" />
                      Coupon Discount ({orderData.couponCode})
                    </span>
                    <span className="font-medium text-sm">-₹{effectiveDiscount.toLocaleString()}</span>
                  </div>
                )}

                <div className={`h-[1px] w-full my-1 ${isDark ? "bg-white/[0.08]" : "bg-black/[0.06]"}`} />

                {/* Final Total */}
                <div className="flex justify-between items-baseline py-1">
                  <div>
                    <span className="text-xs uppercase font-medium tracking-wider opacity-70 block">Total Amount</span>
                  </div>
                  <span className="text-xl md:text-2xl font-medium text-emerald-400 tracking-tight" style={{ fontFamily: "Bricolage Grotesque" }}>
                    ₹{finalTotalDisplay.toLocaleString()}
                  </span>
                </div>

                {/* Professional Milestone Payment Breakdown Card */}
                <div className={`p-3.5 rounded-2xl border transition-all ${isDark ? "bg-white/[0.03] border-white/[0.08]" : "bg-neutral-50/80 border-black/[0.06]"
                  }`}>
                  <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400 shrink-0">
                        <ShieldCheck size={14} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-medium flex items-center gap-1.5 flex-nowrap">
                          <span className="truncate">Advance (25%)</span>
                          <span className="text-[8px] px-1.5 py-0.2 rounded font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                            Payable Now
                          </span>
                        </div>
                        <p className={`text-[10px] font-medium pt-0.5 truncate ${isDark ? "text-neutral-400" : "text-neutral-500"}`}>
                          To confirm & begin artwork
                        </p>
                      </div>
                    </div>
                    <span className={`text-sm font-medium shrink-0 ${isDark ? "text-white" : "text-black"}`}>
                      ₹{advanceAmountDisplay.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2.5">
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-neutral-400 shrink-0">
                        <Clock size={13} />
                      </div>
                      <div className="min-w-0">
                        <div className={`text-xs font-medium truncate ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
                          Balance on Completion (75%)
                        </div>
                        <p className={`text-[10px] font-medium pt-0.5 truncate ${isDark ? "text-neutral-500" : "text-neutral-400"}`}>
                          Payable after approving preview
                        </p>
                      </div>
                    </div>
                    <span className={`text-sm font-medium shrink-0 ${isDark ? "text-white" : "text-black"}`}>
                      ₹{balanceAmountDisplay.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* OFFERS & COUPONS SECTION */}
                <div className="pt-3.5 border-t border-dashed border-gray-500/20 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className={`text-[11px] uppercase tracking-wider font-extrabold block ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                      Offers & Coupons
                    </label>
                    {availableCoupons.length > 0 && !orderData.couponCode && (
                      <span className="text-[10px] text-purple-400 font-bold px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20">
                        {availableCoupons.length} Offers
                      </span>
                    )}
                  </div>

                  {!orderData.couponCode ? (
                    <div className="space-y-2.5">
                      {/* Swiggy/Blinkit Style Promotional Tile - Laptop Optimized */}
                      <div
                        onClick={() => {
                          fetchAvailableCoupons();
                          setIsCouponExplorerOpen(true);
                        }}
                        className={`p-3 rounded-2xl border transition-all duration-300 cursor-pointer group flex items-center justify-between gap-3 ${isDark
                            ? "bg-gradient-to-r from-purple-500/[0.08] via-indigo-500/[0.05] to-purple-500/[0.08] border-purple-500/20 hover:border-purple-500/40 hover:bg-purple-500/[0.12] shadow-sm"
                            : "bg-gradient-to-r from-purple-50 via-indigo-50/50 to-purple-50 border-purple-200/70 hover:border-purple-300 hover:shadow-sm"
                          }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${isDark
                                ? "bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/30"
                                : "bg-purple-500 text-white shadow-sm"
                              }`}
                          >
                            <TicketPercent size={16} />
                          </div>
                          <div className="min-w-0">
                            <p
                              className={`text-xs font-medium leading-snug truncate ${isDark ? "text-white" : "text-neutral-900"
                                }`}
                            >
                              Explore Coupons
                            </p>
                            <p
                              className={`text-[11px] font-medium leading-tight truncate ${isDark ? "text-purple-300/80" : "text-purple-700/90"
                                }`}
                            >
                              {availableCoupons.length > 0
                                ? `Save up to ₹2,000 with ${availableCoupons.length} offers`
                                : "View available discount codes"}
                            </p>
                          </div>
                        </div>

                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-purple-400 group-hover:text-purple-300 group-hover:translate-x-0.5 transition-all shrink-0">
                          View
                          <ChevronRight size={13} />
                        </span>
                      </div>

                      {/* Manual input for unlisted or custom codes */}
                      <div className="flex gap-2">
                        <div className="relative flex-1 min-w-0">
                          <Tag
                            size={13}
                            className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-neutral-500" : "text-neutral-400"
                              }`}
                          />
                          <input
                            type="text"
                            placeholder="ENTER PROMO CODE"
                            value={couponInput}
                            onChange={(e) => {
                              setCouponInput(e.target.value.toUpperCase());
                              setCouponError("");
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleApplyCoupon();
                              }
                            }}
                            className={`w-full pl-8 pr-2.5 py-2 text-xs uppercase font-mono font-semibold rounded-xl border outline-none transition-all ${isDark
                                ? "bg-white/[0.04] border-white/10 text-white placeholder:text-neutral-500 focus:border-white/30 focus:bg-white/[0.07]"
                                : "bg-black/[0.03] border-black/10 text-black placeholder:text-neutral-400 focus:border-black/30 focus:bg-white"
                              }`}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleApplyCoupon()}
                          disabled={couponLoading || !couponInput.trim()}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm active:scale-95 shrink-0 ${isDark
                              ? "bg-white text-black hover:bg-neutral-200"
                              : "bg-black text-white hover:bg-neutral-800"
                            }`}
                        >
                          {couponLoading ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            "Redeem"
                          )}
                        </button>
                      </div>
                      {couponError && (
                        <p className="text-[11px] text-red-500 flex items-center gap-1">
                          <AlertCircle size={12} /> {couponError}
                        </p>
                      )}
                    </div>
                  ) : (
                    /* Professional Applied Coupon Card */
                    <div
                      className={`p-3 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-2.5 ${isDark
                          ? "bg-gradient-to-r from-emerald-950/40 via-emerald-900/20 to-emerald-950/40 border-emerald-500/30 shadow-md"
                          : "bg-gradient-to-r from-emerald-50/90 via-emerald-100/50 to-emerald-50/90 border-emerald-200/80 shadow-sm"
                        }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Tag Icon Squircle */}
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${isDark
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              : "bg-emerald-500 text-white shadow-sm"
                            }`}
                        >
                          <Tag size={15} />
                        </div>

                        {/* Coupon Details */}
                        <div className="min-w-0">
                          <p
                            className={`text-xs font-mono font-bold tracking-wider ${isDark ? "text-white" : "text-emerald-950"
                              }`}
                          >
                            {orderData.couponCode}
                          </p>
                          <p
                            className={`text-[11px] font-medium pt-0.5 truncate ${isDark ? "text-emerald-300/80" : "text-emerald-700"
                              }`}
                          >
                            You saved{" "}
                            <span
                              className={`font-medium ${isDark ? "text-white" : "text-emerald-950"
                                }`}
                            >
                              ₹{effectiveDiscount.toLocaleString()}
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Actions: Change & Remove */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => setIsCouponExplorerOpen(true)}
                          className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-all cursor-pointer ${isDark
                              ? "bg-white/5 hover:bg-emerald-500/20 text-emerald-300 hover:text-white border border-emerald-500/25"
                              : "bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm"
                            }`}
                        >
                          Change
                        </button>
                        <button
                          type="button"
                          onClick={handleRemoveCoupon}
                          className={`p-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center ${isDark
                              ? "text-neutral-400 hover:text-rose-400 hover:bg-rose-500/15"
                              : "text-neutral-500 hover:text-rose-600 hover:bg-rose-100"
                            }`}
                          title="Remove coupon"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2.5 pt-4 border-t border-dashed border-gray-500/30">
                  <div className={`flex items-center gap-3 text-xs font-medium ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                    <Clock size={14} className="text-neutral-500 shrink-0" />
                    <span>Execution: 3-5 business days</span>
                  </div>
                  <div className={`flex items-center gap-3 text-xs font-medium ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                    <Package size={14} className="text-neutral-500 shrink-0" />
                    <span>Archival-grade acid-free paper & packaging</span>
                  </div>
                </div>
              </div>
            </div>

            {/* PAYMENT INFO */}
            <div
              className={`p-4 md:p-5 rounded-2xl border transition-all shadow-md ${isDark
                ? "bg-[#141416]/50 border-white/5"
                : "bg-white/50 border-black/5"
                }`}
            >
              <div className="flex items-center gap-2 mb-2 text-sm font-medium">
                <Info size={16} className={isDark ? "text-white" : "text-black"} />
                Payment Information
              </div>
              <p className={`text-[11px] md:text-[12px] leading-relaxed font-medium ${isDark ? "text-neutral-500" : "text-neutral-600"}`}>
                A secure UPI payment link will be sent to your dashboard after artist confirmation.
              </p>
            </div>

            {/* MOBILE NAVIGATION BUTTONS (Under Order Summary on Phone, Hidden on Desktop) */}
            <div className="block lg:hidden pt-1 pb-4">
              {step === 2 && (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
                      setStep(1);
                    }}
                    className={`px-4 py-3.5 text-[12px] sm:text-[13px] uppercase font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      isDark
                        ? "bg-[#141416] text-white border border-white/10 hover:bg-neutral-800"
                        : "bg-white text-black border border-black/10 shadow-sm hover:bg-neutral-50"
                    }`}
                  >
                    <ArrowLeft size={16} />
                    Go Back
                  </button>

                  <button
                    onClick={() => {
                      if (!user) {
                        setShowAuthModal(true);
                        return;
                      }
                      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
                      setStep(3);
                    }}
                    disabled={user && !orderData.photo}
                    className={`px-4 py-3.5 text-[12px] sm:text-[13px] uppercase font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer ${
                      isDark
                        ? "bg-white text-black hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-600 disabled:cursor-not-allowed"
                        : "bg-black text-white hover:bg-neutral-800 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed"
                    }`}
                  >
                    Review Order
                    <ArrowRight size={16} className="transition-transform duration-300 ease-out group-hover:translate-x-1" />
                  </button>
                </div>
              )}

              {step === 3 && (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
                      setStep(2);
                    }}
                    className={`px-4 py-3.5 text-[12px] sm:text-[13px] uppercase font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      isDark
                        ? "bg-[#141416] text-white border border-white/10 hover:bg-neutral-800"
                        : "bg-white text-black border border-black/10 shadow-sm hover:bg-neutral-50"
                    }`}
                  >
                    <ArrowLeft size={16} />
                    Go Back
                  </button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`px-4 py-3.5 text-[12px] sm:text-[13px] uppercase font-bold cursor-pointer rounded-xl shadow-2xl flex items-center justify-center gap-2 ${
                      loading
                        ? isDark
                          ? "bg-white/50 text-black/50"
                          : "bg-black/50 text-white/50"
                        : isDark
                          ? "bg-white text-black hover:bg-neutral-200"
                          : "bg-black text-white hover:bg-neutral-800"
                    }`}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Confirming...
                      </>
                    ) : (
                      <>
                        Confirm Order
                        <Check size={16} strokeWidth={3} />
                      </>
                    )}
                  </motion.button>
                </div>
              )}
            </div>

          </motion.div>

        </div>
      )}

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
                Please login to place your order.
              </p>
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowAuthModal(false);
                    setShowSignIn(true);
                  }}
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

      {/* SWIGGY / BLINKIT STYLE COUPON EXPLORER MODAL */}
      <CouponExplorerModal
        isOpen={isCouponExplorerOpen}
        onClose={() => setIsCouponExplorerOpen(false)}
        coupons={availableCoupons}
        loading={isCouponsLoading}
        subtotal={pricingBreakdown?.subtotal || 0}
        activeCouponCode={orderData.couponCode}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
        isDark={isDark}
      />

      {/* SUCCESS BLAST & PARTY BLASTERS CELEBRATION MODAL */}
      <AnimatePresence>
        {showSuccessBlast && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.7, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 18, stiffness: 280 }}
              className={`relative max-w-md w-full rounded-3xl p-6 sm:p-8 text-center border shadow-2xl overflow-hidden ${
                isDark
                  ? "bg-[#141416] border-white/15 text-white shadow-emerald-500/10"
                  : "bg-white border-black/10 text-black"
              }`}
            >
              {/* Background celebration radial glow */}
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/25 rounded-full blur-3xl pointer-events-none" />

              {/* Animated Party Popper and Check Icon */}
              <div className="relative flex items-center justify-center gap-3 mb-5">
               

                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center shadow-xl shadow-emerald-500/30">
                    <Check size={32} className="text-emerald-500" strokeWidth={3} />
                  </div>
                </div>

                
              </div>

              {/* Celebration Headline */}
              <h2
                className="text-2xl sm:text-3xl font-medium tracking-tight mb-2"
                style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
              >
                Order Confirmed!
              </h2>
              <p className={`text-xs sm:text-sm mb-6 ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                Your custom portrait commission is placed! Our artist is ready to craft your masterpiece.
              </p>

              {/* Order Info Card */}
              <div
                className={`rounded-2xl p-4 mb-6 border text-left space-y-2.5 ${
                  isDark ? "bg-white/[0.03] border-white/10" : "bg-black/[0.02] border-black/10"
                }`}
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="opacity-60">Order Reference</span>
                  <span className="font-mono font-medium text-emerald-500">
                    #{successOrderInfo?.orderId?.slice(-8) || "CONFIRMED"}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="opacity-60">Art Style</span>
                  <span className="font-medium">{successOrderInfo?.artStyle || "Custom Art"}</span>
                </div>

                <div className="flex justify-between items-center text-xs pt-2 border-t border-dashed border-gray-500/20">
                  <span className="opacity-60">Total Amount</span>
                  <span className="font-bold text-sm">₹{successOrderInfo?.total?.toLocaleString() || "0"}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setShowSuccessBlast(false);
                    setSuccessOrderInfo(null);
                    navigate("/orders");
                  }}
                  className={`w-full py-3.5 px-6 rounded-xl font-bold text-xs uppercase transition-all cursor-pointer shadow-xl flex items-center justify-center gap-2 ${
                    isDark
                      ? "bg-white text-black hover:bg-neutral-200"
                      : "bg-black text-white hover:bg-neutral-800"
                  }`}
                >
                  <span>View My Orders</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => triggerPartyBlasters()}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                    isDark
                      ? "text-neutral-400 hover:text-white hover:bg-white/5"
                      : "text-neutral-600 hover:text-black hover:bg-black/5"
                  }`}
                >
                  <span>🎉 Blast Again!</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}