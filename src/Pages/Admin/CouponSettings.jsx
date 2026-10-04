import { useState, useEffect, useMemo } from "react";
import { API_BASE_URL } from "../../config";
import {
  Tag,
  Plus,
  Trash2,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Copy,
  Check,
  RefreshCcw,
  Percent,
  IndianRupee,
  X,
  Zap,
  Power,
  Users,
  ArrowLeft,
  Sparkles,
  Pencil,
  Calendar,
  ShieldCheck,
  Sliders,
  HelpCircle,
  Shuffle,
  CheckCircle,
  ArrowRight,
  TrendingDown,
  Info,
} from "lucide-react";
import toast from "react-hot-toast";

// ==========================================
// 🎨 MASCOT ILLUSTRATION FOR LIVE PREVIEW
// ==========================================
function PreviewMascot() {
  return (
    <svg viewBox="0 0 120 120" className="w-20 h-20 drop-shadow-md select-none">
      <defs>
        <radialGradient id="prev-m-grad" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#7c3aed" />
        </radialGradient>
      </defs>
      {/* Sprout / Ribbon */}
      <path d="M58 24 C55 12, 65 10, 68 18 C72 12, 80 16, 74 24 Z" fill="#34d399" />
      {/* Dumpling Body */}
      <ellipse cx="60" cy="68" rx="46" ry="40" fill="url(#prev-m-grad)" />
      {/* Cheeks */}
      <circle cx="34" cy="68" r="6" fill="#c084fc" opacity="0.6" />
      <circle cx="86" cy="68" r="6" fill="#c084fc" opacity="0.6" />
      {/* Eyes */}
      <circle cx="44" cy="58" r="4.5" fill="#ffffff" />
      <circle cx="76" cy="58" r="4.5" fill="#ffffff" />
      <circle cx="45.5" cy="56.5" r="1.5" fill="#18181b" />
      <circle cx="77.5" cy="56.5" r="1.5" fill="#18181b" />
      {/* Smile */}
      <path d="M46 68 Q60 88 74 68 Z" fill="#ffffff" />
      <path d="M50 74 Q60 84 70 74 Q60 80 50 74 Z" fill="#f43f5e" />
    </svg>
  );
}

// Initial default form state
const initialFormState = {
  code: "",
  discountType: "percentage",
  discountValue: "",
  minOrderValue: "",
  maxDiscount: "",
  expiryDate: "",
  usageLimit: "",
  userLimit: "1",
  description: "",
  isActive: true,
};

export default function CouponSettings({ isDark }) {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [viewMode, setViewMode] = useState("list"); // 'list' | 'create'
  const [editingCouponId, setEditingCouponId] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);
  const [filter, setFilter] = useState("all"); // 'all' | 'active' | 'expired' | 'inactive'
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const [form, setForm] = useState(initialFormState);

  // Cart Simulation for Live Preview
  const [simCartAmount, setSimCartAmount] = useState(2500);

  // Fetch Coupons from API
  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API_BASE_URL}/api/admin/coupons`, {
        headers: { Authorization: token },
      });
      if (res.ok) {
        const data = await res.json();
        setCoupons(data);
      } else {
        toast.error("Failed to load coupons");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error loading coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // Format date helper for input (YYYY-MM-DDTHH:mm)
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "";
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  // Open Create Mode
  const handleOpenCreate = () => {
    setForm(initialFormState);
    setEditingCouponId(null);
    setViewMode("create");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Open Edit Mode
  const handleOpenEdit = (coupon) => {
    setEditingCouponId(coupon._id);
    setForm({
      code: coupon.code || "",
      discountType: coupon.discountType || "percentage",
      discountValue: coupon.discountValue !== undefined ? String(coupon.discountValue) : "",
      minOrderValue: coupon.minOrderValue ? String(coupon.minOrderValue) : "",
      maxDiscount: coupon.maxDiscount ? String(coupon.maxDiscount) : "",
      expiryDate: formatDateForInput(coupon.expiryDate),
      usageLimit: coupon.usageLimit ? String(coupon.usageLimit) : "",
      userLimit: coupon.userLimit ? String(coupon.userLimit) : "1",
      description: coupon.description || "",
      isActive: coupon.isActive ?? true,
    });
    setViewMode("create");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Close Create/Edit Mode
  const handleCloseStudio = () => {
    setForm(initialFormState);
    setEditingCouponId(null);
    setViewMode("list");
  };

  // Random Code Generator
  const handleGenerateRandomCode = () => {
    const prefixes = ["WELCOME", "FESTIVE", "ARTLOVE", "CREATIVE", "FLASH", "VIP", "SAVE", "PORTRAIT"];
    const numbers = ["10", "15", "20", "25", "30", "50", "100", "250", "500"];
    const p = prefixes[Math.floor(Math.random() * prefixes.length)];
    const n = numbers[Math.floor(Math.random() * numbers.length)];
    const generated = `${p}${n}`;
    setForm((prev) => ({ ...prev, code: generated }));
    toast.success(`Generated code: ${generated}`);
  };

  // Quick Prefix Tag Click
  const handlePrefixClick = (prefix) => {
    const currentNum = form.code.replace(/^[A-Za-z]+/, "") || (form.discountValue || "20");
    setForm((prev) => ({ ...prev, code: `${prefix}${currentNum}` }));
  };

  // Expiry Presets in Days
  const handleSetExpiryDays = (days) => {
    if (days === null) {
      setForm((prev) => ({ ...prev, expiryDate: "" }));
      return;
    }
    const d = new Date();
    d.setDate(d.getDate() + days);
    d.setHours(23, 59, 0, 0);
    setForm((prev) => ({ ...prev, expiryDate: formatDateForInput(d.toISOString()) }));
  };

  // Save Coupon (Create or Update)
  const handleSaveCoupon = async (e) => {
    if (e) e.preventDefault();

    if (!form.code.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }
    if (!form.discountValue || parseFloat(form.discountValue) <= 0) {
      toast.error("Please enter a valid discount amount");
      return;
    }

    const payload = {
      code: form.code.trim().toUpperCase(),
      discountType: form.discountType,
      discountValue: parseFloat(form.discountValue),
      minOrderValue: form.minOrderValue ? parseFloat(form.minOrderValue) : 0,
      maxDiscount:
        form.discountType === "percentage" && form.maxDiscount
          ? parseFloat(form.maxDiscount)
          : null,
      expiryDate: form.expiryDate ? new Date(form.expiryDate).toISOString() : null,
      usageLimit: form.usageLimit ? parseInt(form.usageLimit, 10) : null,
      userLimit: form.userLimit ? parseInt(form.userLimit, 10) : 1,
      description: form.description.trim(),
      isActive: form.isActive,
    };

    if (payload.discountType === "percentage" && payload.discountValue > 100) {
      toast.error("Percentage discount cannot exceed 100%");
      return;
    }

    setActionLoadingId("save");
    try {
      const token = localStorage.getItem("adminToken");
      const url = editingCouponId
        ? `${API_BASE_URL}/api/admin/coupons/${editingCouponId}`
        : `${API_BASE_URL}/api/admin/coupons`;
      const method = editingCouponId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(
          editingCouponId
            ? `Coupon ${payload.code} updated successfully!`
            : `Coupon ${payload.code} created and published!`
        );
        handleCloseStudio();
        fetchCoupons();
      } else {
        toast.error(data.message || "Failed to save coupon");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error while saving coupon");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Expire Coupon Handler
  const handleExpireCoupon = (id, code) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium">Expire coupon "{code}" immediately?</p>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                setActionLoadingId(id);
                try {
                  const token = localStorage.getItem("adminToken");
                  const res = await fetch(`${API_BASE_URL}/api/admin/coupons/${id}/expire`, {
                    method: "PUT",
                    headers: { Authorization: token },
                  });
                  const data = await res.json();
                  if (res.ok) {
                    toast.success(`Coupon ${code} has been expired`);
                    fetchCoupons();
                  } else {
                    toast.error(data.message || "Failed to expire coupon");
                  }
                } catch (err) {
                  toast.error("Failed to expire coupon");
                } finally {
                  setActionLoadingId(null);
                }
              }}
              className="px-3 py-1 bg-red-500 text-white rounded text-[10px] font-bold uppercase tracking-wider hover:bg-red-600 transition-colors"
            >
              Confirm Expire
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 bg-neutral-200 text-black rounded text-[10px] font-bold uppercase tracking-wider hover:bg-neutral-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 5000, position: "top-center" }
    );
  };

  // Toggle Status Handler
  const handleToggleStatus = async (id, code, currentActive) => {
    setActionLoadingId(id);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API_BASE_URL}/api/admin/coupons/${id}/toggle`, {
        method: "PATCH",
        headers: { Authorization: token },
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Coupon ${code} is now ${!currentActive ? "Active" : "Inactive"}`);
        fetchCoupons();
      } else {
        toast.error(data.message || "Failed to toggle status");
      }
    } catch (err) {
      toast.error("Failed to toggle status");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete Coupon Handler
  const handleDeleteCoupon = (id, code) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium">Delete coupon "{code}" permanently?</p>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                setActionLoadingId(id);
                try {
                  const token = localStorage.getItem("adminToken");
                  const res = await fetch(`${API_BASE_URL}/api/admin/coupons/${id}`, {
                    method: "DELETE",
                    headers: { Authorization: token },
                  });
                  const data = await res.json();
                  if (res.ok) {
                    toast.success(`Coupon ${code} deleted`);
                    setCoupons((prev) => prev.filter((c) => c._id !== id));
                  } else {
                    toast.error(data.message || "Failed to delete coupon");
                  }
                } catch (err) {
                  toast.error("Failed to delete coupon");
                } finally {
                  setActionLoadingId(null);
                }
              }}
              className="px-3 py-1 bg-red-500 text-white rounded text-[10px] font-bold uppercase tracking-wider hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 bg-neutral-200 text-black rounded text-[10px] font-bold uppercase tracking-wider hover:bg-neutral-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 5000, position: "top-center" }
    );
  };

  // Copy Code to Clipboard
  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Code "${code}" copied!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Simulated Discount Computation for Live Preview
  const simulatedDiscount = useMemo(() => {
    const val = parseFloat(form.discountValue) || 0;
    if (val <= 0) return 0;
    const minOrder = parseFloat(form.minOrderValue) || 0;
    if (minOrder > 0 && simCartAmount < minOrder) return 0;

    let disc = 0;
    if (form.discountType === "percentage") {
      disc = Math.round((simCartAmount * val) / 100);
      const maxCap = parseFloat(form.maxDiscount);
      if (maxCap && maxCap > 0) {
        disc = Math.min(disc, maxCap);
      }
    } else {
      disc = Math.round(val);
    }
    return Math.min(disc, simCartAmount);
  }, [form.discountType, form.discountValue, form.minOrderValue, form.maxDiscount, simCartAmount]);

  // Expiry preview formatted text
  const formattedExpiryDisplay = useMemo(() => {
    if (!form.expiryDate) return "Never Expires";
    const d = new Date(form.expiryDate);
    if (isNaN(d.getTime())) return "Never Expires";
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }, [form.expiryDate]);

  // Statistics
  const totalCoupons = coupons.length;
  const activeCoupons = coupons.filter((c) => c.computedStatus === "active").length;
  const expiredCoupons = coupons.filter(
    (c) => c.computedStatus === "expired" || c.computedStatus === "depleted"
  ).length;
  const totalUses = coupons.reduce((sum, c) => sum + (c.usedCount || 0), 0);

  // Filtered Coupons
  const filteredCoupons = coupons.filter((c) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchCode = c.code.toLowerCase().includes(q);
      const matchDesc = c.description?.toLowerCase().includes(q);
      if (!matchCode && !matchDesc) return false;
    }
    if (filter === "active") return c.computedStatus === "active";
    if (filter === "expired") return c.computedStatus === "expired" || c.computedStatus === "depleted";
    if (filter === "inactive") return c.computedStatus === "inactive";
    return true;
  });

  // Pre-flight checks for creation
  const isCodeValid = form.code.trim().length >= 2;
  const isDiscountValid = parseFloat(form.discountValue) > 0;
  const isFormReady = isCodeValid && isDiscountValid;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-500 space-y-6">
      {/* ======================================================== */}
      {/* 🌟 VIEW MODE: DEDICATED COUPON CREATION & EDIT STUDIO   */}
      {/* ======================================================== */}
      {viewMode === "create" ? (
        <div className="space-y-6">
          {/* Top Sticky Navigation Bar */}
          <div
            className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-xl transition-all shadow-sm ${
              isDark
                ? "bg-neutral-900/80 border-white/10"
                : "bg-white/90 border-black/10"
            }`}
          >
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleCloseStudio}
                className={`p-2 rounded-xl border transition-all flex items-center justify-center cursor-pointer ${
                  isDark
                    ? "bg-white/5 border-white/10 text-gray-300 hover:text-white hover:bg-white/10"
                    : "bg-gray-100 border-gray-200 text-gray-700 hover:text-black hover:bg-gray-200"
                }`}
                title="Back to all coupons"
              >
                <ArrowLeft size={16} />
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <h3
                    className={`text-lg font-medium  ${
                      isDark ? "text-white" : "text-black"
                    }`}
                    style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
                  >
                    {editingCouponId ? `Edit Coupon: ${form.code || "..."}` : "Create Promotional Coupon"}
                  </h3>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider border ${
                      form.isActive
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                    }`}
                  >
                    {form.isActive ? "Live on Save" : "Draft / Inactive"}
                  </span>
                </div>
                <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  {editingCouponId
                    ? "Update discount rules, spending thresholds, or validity dates."
                    : "Configure discount rules, spend conditions, and preview the live customer card."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-end sm:self-center">
              <button
                type="button"
                onClick={handleCloseStudio}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all border cursor-pointer ${
                  isDark
                    ? "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white"
                    : "bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200 hover:text-black"
                }`}
              >
                Discard
              </button>

              <button
                type="button"
                onClick={handleSaveCoupon}
                disabled={actionLoadingId === "save" || !isFormReady}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-medium uppercase tracking-wider transition-all shadow-md cursor-pointer ${
                  isFormReady
                    ? isDark
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white "
                      : "bg-black hover:bg-neutral-800 text-white shadow-black/20"
                    : "opacity-40 cursor-not-allowed bg-gray-400 text-gray-200"
                }`}
              >
                {actionLoadingId === "save" ? (
                  <RefreshCcw size={14} className="animate-spin" />
                ) : (
                  <Tag size={14} />
                )}
                {actionLoadingId === "save"
                  ? "Saving..."
                  : editingCouponId
                  ? "Update Coupon"
                  : "Publish Coupon"}
              </button>
            </div>
          </div>

          {/* Studio 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* ======================================================== */}
            {/* LEFT COLUMN: THE FORM CONFIGURATION (7 cols)            */}
            {/* ======================================================== */}
            <div className="lg:col-span-7 space-y-5">
              {/* CARD 1: Identity & Code */}
              <div
                className={`p-5 rounded-2xl border transition-all ${
                  isDark
                    ? "bg-white/[0.02] border-white/10"
                    : "bg-white border-black/10 shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        isDark ? "bg-purple-500/10 text-purple-400" : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      <Tag size={14} />
                    </div>
                    <div>
                      <h4
                        className={`text-xs font-medium uppercase ${
                          isDark ? "text-white" : "text-black"
                        }`}
                      >
                        1. Coupon Code & Identity
                      </h4>
                      <p className={`text-[11px] ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        The unique promo code customers enter at checkout
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 uppercase tracking-wider">
                    Required
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Code Input with Generator */}
                  <div>
                    <label
                      className={`text-[11px] font-semibold uppercase tracking-wider block mb-1.5 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Promo Code
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          required
                          value={form.code}
                          onChange={(e) =>
                            setForm({ ...form, code: e.target.value.toUpperCase().replace(/\s+/g, "") })
                          }
                          placeholder="e.g. FESTIVE20"
                          className={`w-full py-2.5 pl-3.5 pr-10 rounded-xl text-sm font-mono font-medium uppercase tracking-widest transition-all outline-none border ${
                            isDark
                              ? "border-white/10 bg-black/60 text-white focus:border-white-400"
                              : "border-gray-300 bg-white text-black "
                          }`}
                        />
                        <span className="absolute right-3 top-3 text-xs text-gray-400 font-mono">
                          {form.code.length}/25
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={handleGenerateRandomCode}
                        className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium border transition-all cursor-pointer shrink-0 ${
                          isDark
                            ? "bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border-purple-500/30"
                            : "bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200"
                        }`}
                        title="Generate catchy random promo code"
                      >
                        <Shuffle size={13} />
                        <span>Generate</span>
                      </button>
                    </div>

                    {/* Quick Prefix Pills */}
                    <div className="flex items-center gap-1.5 flex-wrap mt-2.5">
                      <span className={`text-[10px] uppercase  ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                        Quick Prefix:
                      </span>
                      {["WELCOME", "FESTIVE", "VIP", "FLASH", "PORTRAIT", "SAVE"].map((pref) => (
                        <button
                          key={pref}
                          type="button"
                          onClick={() => handlePrefixClick(pref)}
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                            form.code.startsWith(pref)
                              ? isDark
                                ? "bg-purple-500/30 text-purple-300 border-purple-400"
                                : "bg-purple-100 text-purple-800 border-purple-300"
                              : isDark
                              ? "bg-white/[0.03] text-gray-400 border-white/5 hover:bg-white/[0.08] hover:text-white"
                              : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200 hover:text-black"
                          }`}
                        >
                          +{pref}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Campaign Description */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        className={`text-[11px] font-semibold uppercase tracking-wider block ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Public Campaign Description
                      </label>
                      <span className={`text-[10px] ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                        {form.description.length}/250
                      </span>
                    </div>
                    <textarea
                      rows={2}
                      maxLength={250}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="e.g. Festival Season Mega Saver — 20% off on all couple & family hand-drawn portraits!"
                      className={`w-full py-2.5 px-3.5 rounded-xl text-xs transition-all outline-none resize-none border ${
                        isDark
                          ? "border-white/10 bg-black/60 text-white focus:border-white-100"
                          : "border-gray-300 bg-white text-black f:ring-purple-200"
                      }`}
                    />

                    {/* Quick description templates */}
                    <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                      <span className={`text-[10px] uppercase tracking-wider ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                        Templates:
                      </span>
                      {[
                        "20% off on all portrait artworks",
                        "Flat ₹500 off on festive orders",
                        "Welcome gift for first-time art lovers",
                      ].map((tmpl) => (
                        <button
                          key={tmpl}
                          type="button"
                          onClick={() => setForm({ ...form, description: tmpl })}
                          className={`text-[10px] px-2 py-0.5 rounded-md border truncate max-w-[200px] transition-all cursor-pointer ${
                            form.description === tmpl
                              ? isDark
                                ? "bg-white/10 text-white border-white/20"
                                : "bg-gray-200 text-black border-gray-300"
                              : isDark
                              ? "bg-white/[0.02] text-gray-400 border-white/5 hover:text-white"
                              : "bg-gray-50 text-gray-600 border-gray-200 hover:text-black"
                          }`}
                        >
                          "{tmpl}"
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 2: Discount Logic & Mechanics */}
              <div
                className={`p-5 rounded-2xl border transition-all ${
                  isDark
                    ? "bg-white/[0.02] border-white/10"
                    : "bg-white border-black/10 shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        isDark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      <Percent size={14} />
                    </div>
                    <div>
                      <h4
                        className={`text-xs font-medium uppercase tracking-wider ${
                          isDark ? "text-white" : "text-black"
                        }`}
                      >
                        2. Discount Logic & Value
                      </h4>
                      <p className={`text-[11px] ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        Choose percentage off or flat rupee deduction
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 uppercase tracking-wider">
                    Required
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Segmented Cards for Discount Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, discountType: "percentage" })}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                        form.discountType === "percentage"
                          ? isDark
                            ? "bg-gradient-to-br from-purple-500/20 via-purple-500/10 to-transparent border-purple-500/50 shadow-md shadow-purple-950/30"
                            : "bg-purple-50 border-purple-400 shadow-sm"
                          : isDark
                          ? "bg-white/[0.02] border-white/5 hover:border-white/15 text-gray-400"
                          : "bg-gray-50 border-gray-200 hover:border-gray-300 text-gray-600"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          form.discountType === "percentage"
                            ? isDark
                              ? "bg-purple-500 text-white"
                              : "bg-purple-600 text-white"
                            : isDark
                            ? "bg-white/5 text-gray-400"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        <Percent size={15} />
                      </div>
                      <div>
                        <p
                          className={`text-xs font-medium ${
                            form.discountType === "percentage"
                              ? isDark
                                ? "text-white"
                                : "text-purple-950"
                              : ""
                          }`}
                        >
                          Percentage Discount
                        </p>
                        <p className="text-[11px] opacity-75 mt-0.5">
                          e.g. 15% or 25% off the entire artwork order
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,
                          discountType: "fixed",
                          maxDiscount: "", // fixed discount doesn't need cap
                        })
                      }
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                        form.discountType === "fixed"
                          ? isDark
                            ? "bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-transparent border-emerald-500/50 shadow-md shadow-emerald-950/30"
                            : "bg-emerald-50 border-emerald-400 shadow-sm"
                          : isDark
                          ? "bg-white/[0.02] border-white/5 hover:border-white/15 text-gray-400"
                          : "bg-gray-50 border-gray-200 hover:border-gray-300 text-gray-600"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          form.discountType === "fixed"
                            ? isDark
                              ? "bg-emerald-500 text-white"
                              : "bg-emerald-600 text-white"
                            : isDark
                            ? "bg-white/5 text-gray-400"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        <IndianRupee size={15} />
                      </div>
                      <div>
                        <p
                          className={`text-xs font-medium ${
                            form.discountType === "fixed"
                              ? isDark
                                ? "text-white"
                                : "text-emerald-950"
                              : ""
                          }`}
                        >
                          Fixed Rupee Discount
                        </p>
                        <p className="text-[11px] opacity-75 mt-0.5">
                          e.g. Flat ₹250 or ₹500 off at checkout
                        </p>
                      </div>
                    </button>
                  </div>

                  {/* Value Input and Presets */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        className={`text-[11px] font-medium uppercase tracking-wider block mb-1.5 ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {form.discountType === "percentage" ? "Percentage Off (%)" : "Flat Amount (₹)"}
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="any"
                          min="0.01"
                          max={form.discountType === "percentage" ? "100" : undefined}
                          required
                          value={form.discountValue}
                          onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                          placeholder={form.discountType === "percentage" ? "20" : "500"}
                          className={`w-full py-2.5 pl-3.5 pr-8 rounded-xl text-sm font-bold transition-all outline-none border ${
                            isDark
                              ? "border-white/10 bg-black/60 text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20"
                              : "border-gray-300 bg-white text-black focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
                          }`}
                        />
                        <span className="absolute right-3.5 top-3 text-xs font-bold text-gray-400">
                          {form.discountType === "percentage" ? "%" : "₹"}
                        </span>
                      </div>

                      {/* Quick Presets */}
                      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        <span className={`text-[10px] uppercase tracking-wider ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                          Presets:
                        </span>
                        {(form.discountType === "percentage"
                          ? ["10", "15", "20", "25", "30", "50"]
                          : ["100", "250", "500", "750", "1000"]
                        ).map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setForm({ ...form, discountValue: val })}
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                              form.discountValue === val
                                ? isDark
                                  ? "bg-emerald-500/30 text-emerald-300 border-emerald-400"
                                  : "bg-emerald-100 text-emerald-800 border-emerald-300"
                                : isDark
                                ? "bg-white/[0.03] text-gray-400 border-white/5 hover:text-white"
                                : "bg-gray-100 text-gray-600 border-gray-200 hover:text-black"
                            }`}
                          >
                            {form.discountType === "percentage" ? `${val}%` : `₹${val}`}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Max Discount Cap (Only for percentage) */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label
                          className={`text-[11px] font-medium  uppercase tracking-wider block ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Max Discount Cap (₹)
                        </label>
                        <span
                          className={`text-[10px] ${
                            form.discountType === "fixed" ? "text-gray-500" : "text-purple-400"
                          }`}
                        >
                          {form.discountType === "fixed" ? "Fixed is uncapped" : "Optional"}
                        </span>
                      </div>

                      <div className="relative">
                        <input
                          type="number"
                          min="1"
                          disabled={form.discountType === "fixed"}
                          value={form.maxDiscount}
                          onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })}
                          placeholder={
                            form.discountType === "fixed" ? "Not applicable" : "Uncapped (No limit)"
                          }
                          className={`w-full py-2.5 pl-3.5 pr-8 rounded-xl text-sm transition-all outline-none border ${
                            form.discountType === "fixed"
                              ? "opacity-35 cursor-not-allowed bg-transparent border-gray-500/20"
                              : isDark
                              ? "border-white/10 bg-black/60 text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20"
                              : "border-gray-300 bg-white text-black focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
                          }`}
                        />
                        <span className="absolute right-3.5 top-3 text-xs font-bold text-gray-400">
                          ₹
                        </span>
                      </div>

                      {form.discountType === "percentage" && (
                        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                          <span className={`text-[10px] uppercase tracking-wider ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                            Cap:
                          </span>
                          {["250", "500", "1000", "2000"].map((cap) => (
                            <button
                              key={cap}
                              type="button"
                              onClick={() => setForm({ ...form, maxDiscount: cap })}
                              className={`text-[10px] font-medium px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                                form.maxDiscount === cap
                                  ? isDark
                                    ? "bg-purple-500/30 text-purple-300 border-purple-400"
                                    : "bg-purple-100 text-purple-800 border-purple-300"
                                  : isDark
                                  ? "bg-white/[0.03] text-gray-400 border-white/5 hover:text-white"
                                  : "bg-gray-100 text-gray-600 border-gray-200 hover:text-black"
                              }`}
                            >
                              ₹{cap}
                            </button>
                          ))}
                          <button
                            type="button"
                            onClick={() => setForm({ ...form, maxDiscount: "" })}
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                              !form.maxDiscount
                                ? isDark
                                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/40"
                                  : "bg-emerald-50 text-emerald-800 border-emerald-300"
                                : isDark
                                ? "bg-white/[0.03] text-gray-400 border-white/5"
                                : "bg-gray-100 text-gray-600 border-gray-200"
                            }`}
                          >
                            Uncapped
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 3: Cart Requirements & Restrictions */}
              <div
                className={`p-5 rounded-2xl border transition-all ${
                  isDark
                    ? "bg-white/[0.02] border-white/10"
                    : "bg-white border-black/10 shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        isDark ? "bg-blue-500/10 text-blue-400" : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      <ShieldCheck size={14} />
                    </div>
                    <div>
                      <h4
                        className={`text-xs font-medium uppercase tracking-wider ${
                          isDark ? "text-white" : "text-black"
                        }`}
                      >
                        3. Minimum Spend & Usage Limits
                      </h4>
                      <p className={`text-[11px] ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        Control customer cart qualification and redemption caps
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Min Order Value */}
                  <div>
                    <label
                      className={`text-[11px] font-medium uppercase tracking-wider block mb-1.5 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Min Order Value (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={form.minOrderValue}
                      onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })}
                      placeholder="0 (No Minimum)"
                      className={`w-full py-2.5 px-3.5 rounded-xl text-xs transition-all outline-none border ${
                        isDark
                          ? "border-white/10 bg-black/60 text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20"
                          : "border-gray-300 bg-white text-black focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
                      }`}
                    />
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      {["0", "500", "1000", "2500"].map((mv) => (
                        <button
                          key={mv}
                          type="button"
                          onClick={() => setForm({ ...form, minOrderValue: mv === "0" ? "" : mv })}
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                            (mv === "0" && !form.minOrderValue) || form.minOrderValue === mv
                              ? isDark
                                ? "bg-blue-500/30 text-blue-300 border-blue-400"
                                : "bg-blue-100 text-blue-800 border-blue-300"
                              : isDark
                              ? "bg-white/[0.03] text-gray-400 border-white/5 hover:text-white"
                              : "bg-gray-100 text-gray-600 border-gray-200 hover:text-black"
                          }`}
                        >
                          {mv === "0" ? "₹0 (Any)" : `₹${mv}`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Total Usage Limit */}
                  <div>
                    <label
                      className={`text-[11px] font-medium uppercase tracking-wider block mb-1.5 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Total Redemptions
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={form.usageLimit}
                      onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
                      placeholder="Unlimited"
                      className={`w-full py-2.5 px-3.5 rounded-xl text-xs transition-all outline-none border ${
                        isDark
                          ? "border-white/10 bg-black/60 text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20"
                          : "border-gray-300 bg-white text-black focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
                      }`}
                    />
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      {["Unlimited", "50", "100", "500"].map((ul) => (
                        <button
                          key={ul}
                          type="button"
                          onClick={() =>
                            setForm({ ...form, usageLimit: ul === "Unlimited" ? "" : ul })
                          }
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                            (ul === "Unlimited" && !form.usageLimit) || form.usageLimit === ul
                              ? isDark
                                ? "bg-blue-500/30 text-blue-300 border-blue-400"
                                : "bg-blue-100 text-blue-800 border-blue-300"
                              : isDark
                              ? "bg-white/[0.03] text-gray-400 border-white/5 hover:text-white"
                              : "bg-gray-100 text-gray-600 border-gray-200 hover:text-black"
                          }`}
                        >
                          {ul}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Per User Limit */}
                  <div>
                    <label
                      className={`text-[11px] font-medium uppercase tracking-wider block mb-1.5 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Limit Per Customer
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={form.userLimit}
                      onChange={(e) => setForm({ ...form, userLimit: e.target.value })}
                      placeholder="1 use"
                      className={`w-full py-2.5 px-3.5 rounded-xl text-xs transition-all outline-none border ${
                        isDark
                          ? "border-white/10 bg-black/60 text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20"
                          : "border-gray-300 bg-white text-black focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
                      }`}
                    />
                    <p className={`text-[10px] mt-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                      Standard: 1 redemption per registered account
                    </p>
                  </div>
                </div>
              </div>

              {/* CARD 4: Scheduling & Status */}
              <div
                className={`p-5 rounded-2xl border transition-all ${
                  isDark
                    ? "bg-white/[0.02] border-white/10"
                    : "bg-white border-black/10 shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        isDark ? "bg-amber-500/10 text-amber-400" : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      <Clock size={14} />
                    </div>
                    <div>
                      <h4
                        className={`text-xs font-medium uppercase tracking-wider ${
                          isDark ? "text-white" : "text-black"
                        }`}
                      >
                        4. Validity Schedule & Activation
                      </h4>
                      <p className={`text-[11px] ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        Set auto-expiry date or activate coupon immediately
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  {/* Expiry Date */}
                  <div>
                    <label
                      className={`text-[11px] font-semibold uppercase tracking-wider block mb-1.5 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Expiry Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={form.expiryDate}
                      onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                      className={`w-full py-2.5 px-3.5 rounded-xl text-xs transition-all outline-none border ${
                        isDark
                          ? "border-white/10 bg-black/60 text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 [color-scheme:dark]"
                          : "border-gray-300 bg-white text-black focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
                      }`}
                    />

                    {/* Expiry Presets */}
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      <span className={`text-[10px] uppercase tracking-wider ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                        Quick:
                      </span>
                      {[
                        { label: "+7 Days", days: 7 },
                        { label: "+14 Days", days: 14 },
                        { label: "+30 Days", days: 30 },
                        { label: "+90 Days", days: 90 },
                        { label: "Never", days: null },
                      ].map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => handleSetExpiryDays(item.days)}
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                            item.days === null && !form.expiryDate
                              ? isDark
                                ? "bg-amber-500/30 text-amber-300 border-amber-400"
                                : "bg-amber-100 text-amber-800 border-amber-300"
                              : isDark
                              ? "bg-white/[0.03] text-gray-400 border-white/5 hover:text-white"
                              : "bg-gray-100 text-gray-600 border-gray-200 hover:text-black"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Immediate Activation Switch */}
                  <div
                    className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                      isDark ? "bg-black/30 border-white/5" : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div>
                      <p className={`text-xs font-medium ${isDark ? "text-white" : "text-black"}`}>
                        Activate Immediately
                      </p>
                      <p className={`text-[11px] ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        {form.isActive
                          ? "Customers can apply this coupon as soon as you save"
                          : "Save as draft / paused without making it available yet"}
                      </p>
                    </div>

                    {/* Sleek Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, isActive: !form.isActive })}
                      className={`w-12 h-6.5 rounded-full p-0.5 transition-colors duration-300 ease-in-out shrink-0 cursor-pointer ${
                        form.isActive
                          ? "bg-emerald-500"
                          : isDark
                          ? "bg-neutral-800 border border-white/10"
                          : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`w-5.5 h-5.5 rounded-full bg-white shadow-md transform transition-transform duration-300 ease-in-out ${
                          form.isActive ? "translate-x-5.5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ======================================================== */}
            {/* RIGHT COLUMN: REAL-TIME LIVE PREVIEW STUDIO (5 cols)    */}
            {/* ======================================================== */}
            <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-6">
              {/* Studio Live Preview Box */}
              <div
                className={`p-5 rounded-2xl border transition-all ${
                  isDark
                    ? "bg-gradient-to-b from-neutral-900 via-neutral-900/90 to-neutral-950 border-white/10 shadow-xl"
                    : "bg-gradient-to-b from-white via-gray-50 to-white border-black/10 shadow-lg"
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <h4
                      className={`text-xs font-medium uppercase tracking-wider ${
                        isDark ? "text-white" : "text-black"
                      }`}
                    >
                      Customer Experience Preview
                    </h4>
                  </div>
                </div>

                {/* THE VIBRANT CUSTOMER VOUCHER CARD */}
                <div className="relative overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-950/40 via-neutral-900 to-indigo-950/40 p-4 shadow-xl transition-all duration-300">
                  {/* Decorative Glow */}
                  <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-purple-500/20 blur-2xl pointer-events-none" />
                  <div className="absolute -bottom-12 -left-12 w-28 h-28 rounded-full bg-indigo-500/20 blur-2xl pointer-events-none" />

                  <div className="relative flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <PreviewMascot />
                      <div>
                        {/* Discount Banner */}
                        <p
                          className="text-2xl font-black tracking-tight text-white"
                          style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
                        >
                          {form.discountType === "percentage"
                            ? `${form.discountValue || "0"}% OFF`
                            : `₹${form.discountValue || "0"} OFF`}
                        </p>

                        {/* Code Pill */}
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2.5 py-0.5 rounded-md bg-purple-500/20 border border-purple-400/40 font-mono font-bold text-xs uppercase tracking-wider text-purple-300">
                            {form.code || "ENTER_CODE"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="inline-block px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold uppercase tracking-wider shadow-md">
                        Apply
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="mt-3 text-xs text-purple-200/90 font-medium leading-relaxed break-words">
                    {form.description || "Enter a campaign description to explain this discount to customers."}
                  </p>

                  {/* Dashed tear line */}
                  <div className="my-3 border-t border-dashed border-white/15 relative">
                    <div className="absolute -left-6 -top-2 w-3.5 h-3.5 rounded-full bg-neutral-950 border border-white/10" />
                    <div className="absolute -right-6 -top-2 w-3.5 h-3.5 rounded-full bg-neutral-950 border border-white/10" />
                  </div>

                  {/* Conditions Pills */}
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-300">
                    <div className="flex items-center gap-1">
                      <span className="opacity-60">Min Order:</span>
                      <span className="font-medium text-white">
                        {form.minOrderValue ? `₹${form.minOrderValue}` : "None"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="opacity-60">Max Discount:</span>
                      <span className="font-medium text-white">
                        {form.discountType === "percentage"
                          ? form.maxDiscount
                            ? `₹${form.maxDiscount}`
                            : "Uncapped"
                          : "Fixed ₹" + (form.discountValue || 0)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="opacity-60">Expires:</span>
                      <span className="font-medium text-emerald-300">
                        {formattedExpiryDisplay}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="opacity-60">Usage Cap:</span>
                      <span className="font-medium text-white">
                        {form.usageLimit ? `${form.usageLimit} uses` : "Unlimited"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* CART SAVINGS SIMULATOR */}
                <div
                  className={`mt-5 p-4 rounded-xl border space-y-3 ${
                    isDark ? "bg-black/40 border-white/5" : "bg-gray-100/70 border-black/5"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Sliders size={13} className="text-purple-400" />
                      <span
                        className={`text-xs font-bold uppercase tracking-wider ${
                          isDark ? "text-white" : "text-black"
                        }`}
                      >
                        Interactive Cart Simulator
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-purple-400">
                      ₹{simCartAmount.toLocaleString()}
                    </span>
                  </div>

                  {/* Slider or Preset buttons */}
                  <div className="flex items-center gap-2">
                    {[500, 1500, 2500, 4000, 6000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setSimCartAmount(amt)}
                        className={`flex-1 py-1 text-[10px] font-semibold rounded-lg border transition-all cursor-pointer ${
                          simCartAmount === amt
                            ? isDark
                              ? "bg-purple-600 text-white border-purple-500"
                              : "bg-black text-white border-black"
                            : isDark
                            ? "bg-white/5 text-gray-400 border-white/5 hover:text-white"
                            : "bg-white text-gray-600 border-gray-200 hover:text-black"
                        }`}
                      >
                        ₹{amt}
                      </button>
                    ))}
                  </div>

                  {/* Calculation Breakdown */}
                  <div
                    className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                      isDark ? "bg-white/[0.02] border-white/5" : "bg-white border-black/5"
                    }`}
                  >
                    <div className="flex justify-between text-gray-400">
                      <span>Order Subtotal</span>
                      <span className="font-mono text-white">₹{simCartAmount.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between text-emerald-400 font-medium">
                      <span>Discount ({form.code || "VOUCHER"})</span>
                      <span className="font-mono font-medium">
                        -₹{simulatedDiscount.toLocaleString()}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex justify-between font-medium">
                      <span className={isDark ? "text-white" : "text-black"}>Customer Pays</span>
                      <span className="font-mono text-purple-400 text-sm">
                        ₹{(simCartAmount - simulatedDiscount).toLocaleString()}
                      </span>
                    </div>

                    {/* Simulation Message Note */}
                    <div className="pt-2">
                      {parseFloat(form.minOrderValue) > 0 &&
                      simCartAmount < parseFloat(form.minOrderValue) ? (
                        <p className="text-[11px] text-amber-400 flex items-center gap-1.5">
                          <AlertCircle size={12} className="shrink-0" />
                          Cart is below min order (₹{form.minOrderValue}). Discount will NOT apply.
                        </p>
                      ) : simulatedDiscount > 0 ? (
                        <p className="text-[11px] text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle size={12} className="shrink-0" />
                          Customer saves ₹{simulatedDiscount.toLocaleString()} (
                          {Math.round((simulatedDiscount / simCartAmount) * 100)}% off cart)
                        </p>
                      ) : (
                        <p className="text-[11px] text-gray-400">
                          Set a discount amount to see real-time calculation.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Pre-flight Checklist */}
                <div
                  className={`mt-4 p-3.5 rounded-xl border text-xs space-y-2 ${
                    isDark ? "bg-black/30 border-white/5" : "bg-gray-50 border-black/5"
                  }`}
                >
                  <p
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Launch Readiness
                  </p>

                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex items-center gap-2">
                      {isCodeValid ? (
                        <CheckCircle2 size={13} className="text-emerald-400" />
                      ) : (
                        <XCircle size={13} className="text-rose-400" />
                      )}
                      <span className={isCodeValid ? "text-gray-300" : "text-gray-500"}>
                        Valid promo code ({form.code || "Empty"})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isDiscountValid ? (
                        <CheckCircle2 size={13} className="text-emerald-400" />
                      ) : (
                        <XCircle size={13} className="text-rose-400" />
                      )}
                      <span className={isDiscountValid ? "text-gray-300" : "text-gray-500"}>
                        Discount value defined ({form.discountValue || "0"}
                        {form.discountType === "percentage" ? "%" : "₹"})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-emerald-400" />
                      <span className="text-gray-300">
                        {form.isActive ? "Ready to launch immediately" : "Will save as draft"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Big Action Button */}
                <div className="mt-5 space-y-2">
                  <button
                    type="button"
                    onClick={handleSaveCoupon}
                    disabled={actionLoadingId === "save" || !isFormReady}
                    className={`w-full py-3 rounded-xl text-xs font-medium uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
                      isFormReady
                        ? isDark
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white "
                          : "bg-black hover:bg-neutral-800 text-white shadow-black/30"
                        : "opacity-40 cursor-not-allowed bg-gray-500 text-gray-200"
                    }`}
                  >
                    {actionLoadingId === "save" ? (
                      <RefreshCcw size={15} className="animate-spin" />
                    ) : (
                      <Tag size={15} />
                    )}
                    {actionLoadingId === "save"
                      ? "Saving Coupon..."
                      : editingCouponId
                      ? "Save Coupon Changes"
                      : "Publish & Activate Coupon"}
                  </button>

                  <button
                    type="button"
                    onClick={handleCloseStudio}
                    className={`w-full py-2 rounded-xl text-xs font-medium transition-all text-center cursor-pointer ${
                      isDark
                        ? "text-gray-400 hover:text-white"
                        : "text-gray-600 hover:text-black"
                    }`}
                  >
                    Cancel and Return to Coupons
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ======================================================== */
        /* 📋 VIEW MODE: COUPONS LIST & MANAGEMENT OVERVIEW        */
        /* ======================================================== */
        <>
          {/* Header and Add Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3
                  className={`text-xl font-bold tracking-tight ${isDark ? "text-white" : "text-black"}`}
                  style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
                >
                  Coupon & Discount Management
                </h3>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold border ${
                    isDark
                      ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                      : "bg-purple-50 text-purple-700 border-purple-200"
                  }`}
                >
                  ORDER PRICING
                </span>
              </div>
              <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                Create promo codes, set discount limits, control expiry dates, and manage customer redemptions.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={fetchCoupons}
                disabled={loading}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isDark
                    ? "bg-white/[0.03] border-white/10 text-gray-300 hover:text-white hover:bg-white/[0.08]"
                    : "bg-white border-black/10 text-gray-600 hover:text-black hover:bg-gray-50"
                }`}
                title="Refresh coupons"
              >
                <RefreshCcw size={15} className={loading ? "animate-spin" : ""} />
              </button>

              <button
                onClick={handleOpenCreate}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer ${
                  isDark
                    ? "bg-white text-black hover:bg-gray-100"
                    : "bg-black text-white hover:bg-neutral-800"
                }`}
              >
                <Plus size={15} />
                Add Coupon
              </button>
            </div>
          </div>

          {/* Stats Counter Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div
              className={`p-3.5 rounded-xl border ${
                isDark ? "bg-white/[0.02] border-white/5" : "bg-gray-50/70 border-black/5"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[11px] ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  Total Codes
                </span>
                <Tag size={14} className={isDark ? "text-gray-400" : "text-gray-500"} />
              </div>
              <p className={`text-xl font-bold mt-1 ${isDark ? "text-white" : "text-black"}`}>
                {totalCoupons}
              </p>
            </div>

            <div
              className={`p-3.5 rounded-xl border ${
                isDark
                  ? "bg-emerald-500/[0.04] border-emerald-500/10"
                  : "bg-emerald-50/50 border-emerald-200/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-emerald-500 font-medium">Active</span>
                <CheckCircle2 size={14} className="text-emerald-500" />
              </div>
              <p className="text-xl font-bold mt-1 text-emerald-500">{activeCoupons}</p>
            </div>

            <div
              className={`p-3.5 rounded-xl border ${
                isDark ? "bg-rose-500/[0.04] border-rose-500/10" : "bg-rose-50/50 border-rose-200/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-rose-500 font-medium">Expired / Depleted</span>
                <Clock size={14} className="text-rose-500" />
              </div>
              <p className="text-xl font-bold mt-1 text-rose-500">{expiredCoupons}</p>
            </div>

            <div
              className={`p-3.5 rounded-xl border ${
                isDark ? "bg-blue-500/[0.04] border-blue-500/10" : "bg-blue-50/50 border-blue-200/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-blue-500 font-medium">Redemptions</span>
                <Users size={14} className="text-blue-500" />
              </div>
              <p className="text-xl font-bold mt-1 text-blue-500">{totalUses}</p>
            </div>
          </div>

          {/* Filter Tabs & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {[
                { id: "all", label: `All (${totalCoupons})` },
                { id: "active", label: `Active (${activeCoupons})` },
                { id: "expired", label: `Expired (${expiredCoupons})` },
                {
                  id: "inactive",
                  label: `Inactive (${coupons.filter((c) => c.computedStatus === "inactive").length})`,
                },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setFilter(t.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer shrink-0 ${
                    filter === t.id
                      ? isDark
                        ? "bg-white text-black font-semibold"
                        : "bg-black text-white font-semibold"
                      : isDark
                      ? "bg-white/[0.04] text-gray-400 hover:text-white"
                      : "bg-gray-100 text-gray-600 hover:text-black"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Search input */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by code or description..."
                className={`w-full py-1.5 pl-3 pr-8 rounded-xl text-xs outline-none border transition-all ${
                  isDark
                    ? "bg-white/[0.03] border-white/10 text-white placeholder-gray-500 focus:border-purple-400"
                    : "bg-gray-50 border-gray-200 text-black placeholder-gray-400 focus:border-purple-600"
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2 text-gray-400 hover:text-white"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* COUPONS LIST */}
          {loading && coupons.length === 0 ? (
            <div className="text-center py-16">
              <RefreshCcw size={28} className="animate-spin mx-auto text-gray-400" />
              <p className="text-xs text-gray-400 mt-2">Loading promotions...</p>
            </div>
          ) : filteredCoupons.length === 0 ? (
            <div
              className={`p-12 rounded-2xl border text-center space-y-3 ${
                isDark ? "bg-white/[0.01] border-white/5" : "bg-gray-50 border-black/5"
              }`}
            >
              <Tag size={36} className="mx-auto text-gray-400 opacity-60" />
              <h4 className={`text-sm font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                No coupons found
              </h4>
              <p className={`text-xs max-w-sm mx-auto ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                {searchQuery
                  ? `No promotions match your search "${searchQuery}".`
                  : filter === "all"
                  ? "You haven't created any promotional discount codes yet. Click '+ Add Coupon' to design your first offer."
                  : `No coupons match the '${filter}' filter.`}
              </p>
              <button
                type="button"
                onClick={handleOpenCreate}
                className="inline-flex items-center gap-1.5 px-4 py-2 mt-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white cursor-pointer shadow-md"
              >
                <Plus size={14} /> Create First Coupon
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCoupons.map((coupon) => {
                const isExpired = coupon.computedStatus === "expired";
                const isDepleted = coupon.computedStatus === "depleted";
                const isInactive = coupon.computedStatus === "inactive";
                const isActive = coupon.computedStatus === "active";
                const isBusy = actionLoadingId === coupon._id;

                return (
                  <div
                    key={coupon._id}
                    className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between group relative overflow-hidden ${
                      isActive
                        ? isDark
                          ? "bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.05]"
                          : "bg-white border-black/10 hover:shadow-md"
                        : isDark
                        ? "bg-white/[0.01] border-white/5 opacity-80"
                        : "bg-gray-50/70 border-black/5 opacity-80"
                    }`}
                  >
                    {/* Top Row: Code, Status & Discount in 1 line */}
                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 flex-wrap min-w-0">
                          {/* Coupon Code Pill */}
                          <div
                            onClick={() => handleCopyCode(coupon.code)}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border font-mono font-bold text-xs uppercase tracking-wider cursor-pointer transition-all ${
                              isDark
                                ? "bg-black/60 border-white/15 text-white hover:border-white/30"
                                : "bg-gray-100 border-black/10 text-black hover:border-black/25"
                            }`}
                            title="Click to copy code"
                          >
                            <span>{coupon.code}</span>
                            {copiedCode === coupon.code ? (
                              <Check size={12} className="text-emerald-400" />
                            ) : (
                              <Copy size={11} className="text-gray-400 opacity-60" />
                            )}
                          </div>

                          {/* Status Badge */}
                          {isActive && (
                            <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                              Active
                            </span>
                          )}
                          {isExpired && (
                            <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20 whitespace-nowrap">
                              <XCircle size={10} /> Expired
                            </span>
                          )}
                          {isDepleted && (
                            <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 whitespace-nowrap">
                              <AlertCircle size={10} /> Limit Reached
                            </span>
                          )}
                          {isInactive && (
                            <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium bg-gray-500/10 text-gray-400 border border-gray-500/20 whitespace-nowrap">
                              Inactive
                            </span>
                          )}
                        </div>

                        {/* Big Discount Value: Always 1 Line */}
                        <div className="shrink-0 text-right">
                          <span
                            className={`text-base sm:text-lg font-black tracking-tight whitespace-nowrap ${
                              isActive
                                ? isDark
                                  ? "text-purple-400"
                                  : "text-purple-600"
                                : isDark
                                ? "text-gray-500"
                                : "text-gray-400"
                            }`}
                            style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
                          >
                            {coupon.discountType === "percentage"
                              ? `${coupon.discountValue}% OFF`
                              : `₹${coupon.discountValue} OFF`}
                          </span>
                        </div>
                      </div>

                      {/* Full Coupon Description (Shows all text, no truncation) */}
                      {coupon.description && (
                        <p
                          className={`text-xs mt-2.5 leading-relaxed break-words ${
                            isDark ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {coupon.description}
                        </p>
                      )}

                      {/* Coupon Details & Constraints */}
                      <div
                        className={`mt-4 pt-3 border-t grid grid-cols-2 gap-2 text-[11px] ${
                          isDark ? "border-white/5 text-gray-400" : "border-black/5 text-gray-600"
                        }`}
                      >
                        <div>
                          <span className="opacity-60">Min Order: </span>
                          <span className={`font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                            {coupon.minOrderValue > 0 ? `₹${coupon.minOrderValue}` : "None"}
                          </span>
                        </div>

                        <div>
                          <span className="opacity-60">Max Discount: </span>
                          <span className={`font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                            {coupon.maxDiscount ? `₹${coupon.maxDiscount}` : "Uncapped"}
                          </span>
                        </div>

                        <div>
                          <span className="opacity-60">Expiry: </span>
                          <span
                            className={`font-medium ${
                              isExpired
                                ? "text-rose-400"
                                : isDark
                                ? "text-gray-200"
                                : "text-gray-800"
                            }`}
                          >
                            {coupon.expiryDate
                              ? new Date(coupon.expiryDate).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "Never"}
                          </span>
                        </div>

                        <div>
                          <span className="opacity-60">Redeemed: </span>
                          <span className={`font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                            {coupon.usedCount || 0}
                            {coupon.usageLimit ? ` / ${coupon.usageLimit}` : " uses"}
                          </span>
                        </div>
                      </div>

                      {/* Progress bar if usage limit set */}
                      {coupon.usageLimit && (
                        <div className="mt-2.5">
                          <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 ${
                                isDepleted
                                  ? "bg-rose-500"
                                  : coupon.usedCount / coupon.usageLimit > 0.8
                                  ? "bg-amber-400"
                                  : "bg-purple-500"
                              }`}
                              style={{
                                width: `${Math.min(
                                  100,
                                  Math.round(((coupon.usedCount || 0) / coupon.usageLimit) * 100)
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Card Actions Bottom Bar */}
                    <div
                      className={`mt-4 pt-3 border-t flex items-center justify-between gap-2 ${
                        isDark ? "border-white/5" : "border-black/5"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        {/* Edit Button */}
                        <button
                          onClick={() => handleOpenEdit(coupon)}
                          disabled={isBusy}
                          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all cursor-pointer ${
                            isDark
                              ? "bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 hover:text-white border border-purple-500/20"
                              : "bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200"
                          }`}
                          title="Edit coupon settings"
                        >
                          <Pencil size={11} />
                          Edit
                        </button>

                        {/* Toggle Active / Inactive */}
                        <button
                          onClick={() => handleToggleStatus(coupon._id, coupon.code, coupon.isActive)}
                          disabled={isBusy}
                          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all cursor-pointer ${
                            coupon.isActive
                              ? isDark
                                ? "bg-white/[0.05] text-gray-300 hover:text-white hover:bg-white/[0.08]"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              : isDark
                              ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                              : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          }`}
                          title={coupon.isActive ? "Deactivate coupon" : "Activate coupon"}
                        >
                          <Power size={11} />
                          {coupon.isActive ? "Pause" : "Activate"}
                        </button>

                        {/* Instant Expire Button (Only active/unexpired) */}
                        {isActive && (
                          <button
                            onClick={() => handleExpireCoupon(coupon._id, coupon.code)}
                            disabled={isBusy}
                            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all cursor-pointer ${
                              isDark
                                ? "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20"
                                : "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                            }`}
                            title="Expire this coupon immediately"
                          >
                            <Zap size={11} />
                            Expire
                          </button>
                        )}
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteCoupon(coupon._id, coupon.code)}
                        disabled={isBusy}
                        className={`p-1.5 rounded-lg text-gray-400 hover:text-rose-500 transition-colors cursor-pointer ${
                          isDark ? "hover:bg-rose-500/10" : "hover:bg-rose-50"
                        }`}
                        title="Delete coupon"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
