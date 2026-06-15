import { ShoppingBag, ArrowLeft, Package, Clock, CheckCircle2, CheckCircle, ChevronRight, IndianRupee, X, Check, Copy, AlertCircle, ExternalLink, MapPin, Star, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config";

import axios from "axios";
import toast from "react-hot-toast";
import { OrderSkeleton } from "../../Components/Skeleton";
import OptimizedImage from "../../Components/OptimizedImage";

export default function OrderDetail({ isDark }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [balanceTransactionId, setBalanceTransactionId] = useState("");
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [showPaymentHub, setShowPaymentHub] = useState(false);
  const [showFeedbackHub, setShowFeedbackHub] = useState(() => {
    const saved = localStorage.getItem("showFeedbackHub");
    return saved !== null ? JSON.parse(saved) : true;
  });

  const togglePaymentHub = () => {
    setShowPaymentHub(prev => !prev);
  };

  const toggleFeedbackHub = () => {
    setShowFeedbackHub(prev => {
      const next = !prev;
      localStorage.setItem("showFeedbackHub", JSON.stringify(next));
      return next;
    });
  };

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }
      const response = await axios.get(`${API_BASE_URL}/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const fetchedOrder = response.data;
      setOrder(fetchedOrder);
      if (fetchedOrder.rating) {
        setRating(fetchedOrder.rating);
      }
      if (fetchedOrder.feedback) {
        setFeedbackText(fetchedOrder.feedback);
      }

      // Auto open/collapse payment hub based on order payment/status stage
      if (fetchedOrder.isFullPaid) {
        setShowPaymentHub(false);
      } else if (fetchedOrder.status === "completed") {
        setShowPaymentHub(true);
      } else if (fetchedOrder.isAdvancePaid) {
        setShowPaymentHub(false);
      } else if (fetchedOrder.status === "accepted") {
        setShowPaymentHub(true);
      } else {
        setShowPaymentHub(false);
      }
    } catch (err) {
      toast.error("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handlePaymentSubmit = async (e, type = 'advance') => {
    e.preventDefault();
    const idValue = type === 'advance' ? transactionId : balanceTransactionId;
    if (!idValue.trim()) return;

    setSubmittingPayment(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_BASE_URL}/api/orders/payment/${id}`,
        { transactionId: idValue, paymentType: type },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`${type === 'advance' ? 'Advance' : 'Balance'} Transaction ID submitted successfully! Admin will verify soon.`);
      if (type === 'advance') setTransactionId("");
      else setBalanceTransactionId("");
      fetchOrder();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit payment info");
    } finally {
      setSubmittingPayment(false);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setSubmittingFeedback(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_BASE_URL}/api/orders/feedback/${id}`,
        { rating, feedback: feedbackText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Thank you for your feedback!");
      fetchOrder();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit feedback");
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const getStatusInfo = (status) => {
    const map = {
      pending: { label: "Pending", color: "text-neutral-500 bg-neutral-500/10", step: 0 },
      accepted: { label: "Accepted", color: "text-blue-500 bg-blue-500/10", step: 1 },
      payment_done: { label: "Payment Done", color: "text-indigo-500 bg-indigo-500/10", step: 2 },
      in_progress: { label: "In Progress", color: "text-purple-500 bg-purple-500/10", step: 3 },
      completed: { label: "Completed", color: "text-emerald-500 bg-emerald-500/10", step: 4 },
      out_for_delivery: { label: "Out For Delivery", color: "text-sky-500 bg-sky-500/10", step: 5 },
      delivered: { label: "Delivered", color: "text-emerald-500 bg-emerald-500/20", step: 6 },
      cancelled: { label: "Cancelled", color: "text-red-500 bg-red-500/10", step: -1 },
    };
    return map[status] || { label: status, color: "text-neutral-500 bg-neutral-500/10", step: 0 };
  };

  const steps = [
    { label: "Ordered", status: "pending" },
    { label: "Accepted", status: "accepted" },
    { label: "Payment", status: "payment_done" },
    { label: "Drawing", status: "in_progress" },
    { label: "Finished", status: "completed" },
    { label: "Shipped", status: "out_for_delivery" },
    { label: "Delivered", status: "delivered" },
  ];

  if (loading) {
    return (
      <div className={`min-h-screen pt-28 md:pt-32 pb-24 px-6 transition-colors duration-300 ${isDark ? "bg-[#0a0a0b] text-white" : "bg-[#f8f9fa] text-black"}`}>
        <div className="max-w-4xl mx-auto">
          <OrderSkeleton />
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className={`min-h-screen pt-24 md:pt-28 pb-24 px-4 md:px-8 lg:px-12 transition-colors duration-300 ${isDark ? "bg-[#0a0a0b] text-white" : "bg-[#f8f9fa] text-black"}`} style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">

        {/* Professional Header */}
        <div className={`p-5 md:p-8 rounded-2xl md:rounded-3xl border relative overflow-hidden ${isDark ? "bg-white/[0.02] border-white/10" : "bg-white border-black/5 shadow-lg"}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 md:gap-6">
            <div className="flex items-center gap-3 md:gap-4">
              <button
                onClick={() => navigate("/orders")}
                className={`p-2.5 rounded-xl border transition-all ${isDark ? "hover:bg-white/10 text-gray-400 border-white/10" : "hover:bg-black/5 text-gray-600 border-black/10"}`}
              >
                <ArrowLeft size={20} />
              </button>
              <div className="overflow-hidden">
                <h1 className="text-xl md:text-3xl font-bold tracking-tight truncate" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
                  Order Details
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-[10px] md:text-sm opacity-50 truncate">#{order._id.toUpperCase()}</p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(order._id);
                      toast.success("Order ID copied to clipboard!");
                    }}
                    className={`p-1 rounded-md transition-colors ${isDark ? "hover:bg-white/10 text-gray-400" : "hover:bg-black/5 text-gray-600"}`}>
                    <Copy size={14} />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className={`px-3 md:px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider ${getStatusInfo(order.status).color}`}>
                {getStatusInfo(order.status).label}
              </span>
            </div>
          </div>
        </div>

        <div className={`rounded-2xl md:rounded-3xl border shadow-xl overflow-hidden ${isDark ? "bg-[#0d0d0d] border-white/10" : "bg-white border-black/5"}`}>
          <div className="p-5 md:p-10 lg:p-12 space-y-8 md:space-y-12">

            {/* Status Stepper */}
            <div className="space-y-5 md:space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-sm md:text-[15px] uppercase tracking-wide">Order Progress</h3>

              </div>

              {/* Desktop Stepper */}
              <div className="hidden md:block">
                <div className="relative">
                  {/* Track background */}
                  <div className={`absolute top-3 left-0 w-full h-[2px] ${isDark ? "bg-white/8" : "bg-black/6"}`} />
                  {/* Progress fill */}
                  <div
                    className="absolute top-3 left-0 h-[2px] bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-1000 ease-out"
                    style={{
                      width: `${Math.max(0, (getStatusInfo(order.status).step / (steps.length - 1)) * 100)}%`,
                      boxShadow: "0 0 12px rgba(16,185,129,0.45)"
                    }}
                  />

                  <div className="relative flex justify-between">
                    {steps.map((step, idx) => {
                      const currentStep = getStatusInfo(order.status).step;
                      const isCompleted = idx < currentStep;
                      const isCurrent = idx === currentStep;
                      const isFuture = idx > currentStep;

                      return (
                        <div key={idx} className="flex flex-col items-center gap-2.5" style={{ minWidth: 52 }}>
                          {/* Node */}
                          <div className="relative flex items-center justify-center">
                            {isCurrent && (
                              <span className="absolute inset-0 rounded-full animate-ping bg-emerald-500/30" style={{ borderRadius: "50%" }} />
                            )}
                            <div
                              className={`w-6 h-6 rounded-full z-10 flex items-center justify-center border-[1.5px] transition-all duration-500
                                ${isCompleted
                                  ? "bg-emerald-500 border-emerald-500 text-white shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                                  : isCurrent
                                    ? `border-emerald-500 ${isDark ? "bg-[#0d0d0d]" : "bg-white"} ring-4 ring-emerald-500/20`
                                    : isDark
                                      ? "bg-[#0d0d0d] border-white/20"
                                      : "bg-white border-black/15"
                                }`}
                            >
                              {isCompleted
                                ? <Check size={11} strokeWidth={3} className="text-white" />
                                : isCurrent
                                  ? <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                  : null
                              }
                            </div>
                          </div>

                          {/* Label */}
                          <div className="flex flex-col items-center gap-0.5">
                            <span className={`text-[10px] font-semibold uppercase tracking-wider transition-all duration-300
                              ${isCurrent
                                ? "text-emerald-500"
                                : isCompleted
                                  ? isDark ? "text-white/55" : "text-black/55"
                                  : isDark ? "text-white/35" : "text-black/35"
                              }`}>
                              {step.label}
                            </span>
                            {isCurrent && (
                              <span className="text-[8px] text-emerald-500/60 uppercase tracking-wide">Active</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Mobile Stepper — compact horizontal scroll */}
              <div className="md:hidden overflow-x-auto no-scrollbar pb-2">
                <div className="relative" style={{ minWidth: 400 }}>
                  <div className={`absolute top-2.5 left-0 w-full h-[2px] ${isDark ? "bg-white/8" : "bg-black/6"}`} />
                  <div
                    className="absolute top-2.5 left-0 h-[2px] bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-1000 ease-out"
                    style={{
                      width: `${Math.max(0, (getStatusInfo(order.status).step / (steps.length - 1)) * 100)}%`,
                      boxShadow: "0 0 8px rgba(16,185,129,0.4)"
                    }}
                  />
                  <div className="relative flex justify-between">
                    {steps.map((step, idx) => {
                      const currentStep = getStatusInfo(order.status).step;
                      const isCompleted = idx < currentStep;
                      const isCurrent = idx === currentStep;
                      const isFuture = idx > currentStep;

                      return (
                        <div key={idx} className="flex flex-col items-center gap-2" style={{ minWidth: 46 }}>
                          <div className="relative flex items-center justify-center">
                            {isCurrent && (
                              <span className="absolute inset-0 rounded-full animate-ping bg-emerald-500/25" style={{ borderRadius: "50%" }} />
                            )}
                            <div
                              className={`w-5 h-5 rounded-full z-10 flex items-center justify-center border-[1.5px] transition-all duration-500
                                ${isCompleted
                                  ? "bg-emerald-500 border-emerald-500 text-white"
                                  : isCurrent
                                    ? `border-emerald-500 ${isDark ? "bg-[#0d0d0d]" : "bg-white"} ring-2 ring-emerald-500/20`
                                    : isDark ? "bg-[#0d0d0d] border-white/20" : "bg-white border-black/15"
                                }`}
                            >
                              {isCompleted
                                ? <Check size={9} strokeWidth={3} className="text-white" />
                                : isCurrent
                                  ? <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                  : null
                              }
                            </div>
                          </div>
                          <span className={`text-[9px] font-semibold uppercase tracking-wide transition-all duration-300
                            ${isCurrent
                              ? "text-emerald-500"
                              : isCompleted
                                ? "opacity-55"
                                : "opacity-35"
                            }`}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Commission Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              <div className="space-y-6 md:space-y-8">
                <div>
                  <h3 className="text-sm md:text-[15px] mb-4 uppercase tracking-wide">
                    Order Details
                  </h3>
                  <div className={`p-4 md:p-5 rounded-xl border space-y-3.5 ${isDark ? "bg-white/5 border-white/5" : "bg-gray-50 border-black/5 shadow-sm"}`}>
                    <div className="flex justify-between text-xs md:text-sm">
                      <span className="opacity-50">Style</span>
                      <span className="font-medium">{order.artStyle}</span>
                    </div>
                    <div className="flex justify-between text-xs md:text-sm">
                      <span className="opacity-50">Frame</span>
                      <span className="font-medium">{order.frameOption}</span>
                    </div>
                    <div className="flex justify-between text-xs md:text-sm">
                      <span className="opacity-50">Total Price</span>
                      <span className="font-bold text-emerald-500">₹{order.totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs md:text-sm">
                      <span className="opacity-50">Advance Amount</span>
                      <span className="font-medium">₹{order.advanceAmount.toLocaleString()}</span>
                    </div>
                    <div className={`flex justify-between text-[11px] md:text-sm pt-2 border-t ${isDark ? "border-white/5" : "border-black/5"}`}>
                      <span className="opacity-50">Advance Status</span>
                      <span className={`text-[9px] md:text-[10px] px-2 py-0.5 rounded ${order.isAdvancePaid ? "text-emerald-500 bg-emerald-500/10" : "text-amber-500 bg-amber-500/10"}`}>
                        {order.isAdvancePaid ? "Paid & Verified" : "Pending Verification"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm md:text-[15px] mb-4 uppercase tracking-wide">
                    Delivery Details
                  </h3>
                  <div className={`p-4 md:p-5 rounded-xl border space-y-4 ${isDark ? "bg-white/5 border-white/5" : "bg-gray-50 border-black/5 shadow-sm"}`}>
                    <div className="space-y-1">
                      <p className="text-[10px] md:text-[11px] text-white/50 uppercase tracking-wider">Name</p>
                      <p className="text-xs md:text-sm font-medium capitalize">{order.name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] md:text-[11px] text-white/50 uppercase tracking-wider">Address</p>
                      <p className="text-xs md:text-sm leading-relaxed">{order.address}</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-[10px] md:text-[11px] text-white/50 uppercase tracking-wider">Email</p>
                        <p className="text-xs md:text-sm truncate">{order.email}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] md:text-[11px] text-white/50 uppercase tracking-wider">Phone</p>
                        <p className="text-xs md:text-sm">{order.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>


              </div>

              <div className="space-y-6 md:space-y-8">
                <div>
                  <h3 className="text-sm md:text-[15px] mb-4 uppercase tracking-wider">
                    Reference Photo
                  </h3>
                  <div className={`w-48 md:w-64 mx-auto md:mx-0 aspect-square rounded-2xl border overflow-hidden shadow-xl relative ${isDark ? "border-white/10" : "border-black/5"}`}>
                    <OptimizedImage src={order.photo} alt="Reference" className="w-full h-full object-cover" />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm md:text-[15px] mb-4 uppercase tracking-wider">Special Instructions</h3>
                  <div className={`text-xs md:text-sm p-4 md:p-5 rounded-xl border min-h-[100px] leading-relaxed italic ${isDark ? "bg-white/5 border-white/5 text-gray-300" : "bg-gray-50 border-black/5 text-gray-700 shadow-sm"}`}>
                    {order.instructions || "No special instructions provided."}
                  </div>
                </div>


              </div>
            </div>

            {/* PAYMENT HUB */}
            {(order.status !== "pending" && order.status !== "cancelled") && (
              <div className={`p-6 md:p-8 rounded-2xl border border-white/10 relative overflow-hidden transition-all shadow-xl
                ${isDark ? "bg-emerald-950/30" : "bg-emerald-50/80"} backdrop-blur-2xl`}>

                <div className="absolute -top-16 -left-16 w-48 h-48 bg-emerald-500/10 blur-[80px] rounded-full animate-pulse"></div>
                <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-emerald-400/10 blur-[80px] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>

                <div className="relative z-10 space-y-6 md:space-y-8">
                  <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 md:w-10 md:h-10 rounded-2xl flex items-center justify-center transition-transform hover:scale-105 duration-500 shadow-md 
                        ${isDark ? "bg-emerald-500/20 border border-emerald-500/30" : "bg-emerald-100 border border-emerald-200"}`}>
                        <IndianRupee size={20} className="text-emerald-500" />
                      </div>
                      <div>
                        <h4 className="text-md md:text-xl" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>Payment Hub</h4>
                        <p className="text-[10px] md:text-xs opacity-50">Complete your payment to proceed with the artwork</p>
                      </div>
                    </div>
                    <button
                      onClick={togglePaymentHub}
                      className={`p-2 rounded-xl transition-all ${isDark ? "hover:bg-white/10 text-gray-400" : "hover:bg-black/5 text-gray-600"}`}
                      title={showPaymentHub ? "Collapse Payment Hub" : "Expand Payment Hub"}
                    >
                      {showPaymentHub ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>

                  {showPaymentHub && (
                    <div className="flex flex-col lg:flex-row gap-8 md:gap-10 items-center lg:items-start text-left">
                      {!order.isFullPaid && (
                        <div className="shrink-0 space-y-4 w-full sm:w-auto flex flex-col items-center">
                          <div className={`group relative p-3 rounded-2xl transition-all duration-500 hover:scale-[1.02] shadow-2xl
                          ${isDark ? "bg-white/5 border border-white/10" : "bg-white border border-emerald-100"}`}>
                            <div className="relative w-40 h-40 md:w-56 md:h-56 bg-white flex items-center justify-center overflow-hidden rounded-lg">
                              <img
                                src="/Payment.png"
                                alt="Payment QR Code"
                                className="w-full h-full object-contain p-2"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'block';
                                }}
                              />
                              <div className="hidden text-neutral-300 text-center p-2">
                                <Package size={32} className="mx-auto mb-1 opacity-10" />
                                <p className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest">Unavailable</p>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-1 text-center">
                            <p className="text-xs md:text-sm text-emerald-500 font-black flex items-center justify-center gap-2 animate-pulse">
                              <CheckCircle size={16} /> Scan & Pay UPI
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex-1 w-full space-y-4 md:space-y-5">
                        {/* Stage 1: Advance */}
                        <div className={`p-3 md:p-4 rounded-2xl border transition-all duration-500 relative overflow-hidden group
                        ${order.isAdvancePaid
                            ? (isDark ? "bg-neutral-900/60 border-white/10 opacity-90" : "bg-neutral-50/80 border-black/5 opacity-90")
                            : (isDark ? "bg-white/5 border-white/10" : "bg-white border-black/5 shadow-sm")}`}>

                          <div className="relative z-10 flex justify-between items-center mb-3">
                            <div className="space-y-0.5">
                              <h5 className="text-xs md:text-sm font-medium flex items-center gap-2">
                                01. Advance (25%)
                                {order.isAdvancePaid && <CheckCircle size={14} className="text-emerald-500" />}
                              </h5>
                              <p className="text-[9px] md:text-[10px] opacity-50">Required to start the artwork</p>
                            </div>
                            <span className={`text-lg md:text-xl font-bold ${isDark ? "text-white" : "text-black"}`}>₹{order.advanceAmount.toLocaleString()}</span>
                          </div>

                          <div className="relative z-10">
                            {!order.isAdvancePaid ? (
                              order.transactionId ? (
                                <div className={`text-[10px] md:text-[11px] p-2.5 rounded-xl flex items-center gap-3 backdrop-blur-md ${isDark ? "bg-white/5 border border-white/10 text-gray-400" : "bg-black/5 border border-black/10 text-gray-600"}`}>
                                  <Clock size={14} className="animate-pulse" />
                                  <span className="uppercase tracking-wide">Verification Pending: {order.transactionId}</span>
                                </div>
                              ) : (
                                <form onSubmit={(e) => handlePaymentSubmit(e, 'advance')} className="flex flex-col sm:flex-row gap-2">
                                  <input
                                    type="text"
                                    placeholder="Transaction ID"
                                    value={transactionId}
                                    onChange={(e) => setTransactionId(e.target.value)}
                                    className={`flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-gray-500 transition-all ${isDark ? "text-white" : "text-black bg-gray-50 border-black/5"}`}
                                    required
                                    style={{ colorScheme: "dark" }}
                                  />
                                  <button type="submit" className={`sm:w-auto px-4 py-2 rounded-lg text-xs cursor-pointer transition-all active:scale-95 border ${isDark ? "bg-white/10 hover:bg-white/5 text-white border-white/10" : "bg-white/60 hover:bg-white text-black border-black/10"}`}>Submit</button>
                                </form>
                              )
                            ) : (
                              <div className={`text-[9px] md:text-[10px] py-1.5 px-3 rounded-full inline-block border uppercase tracking-wide ${isDark ? "bg-white/5 border-white/10 text-gray-400" : "bg-black/5 border border-black/10 text-gray-600"}`}>
                                Ref: {order.transactionId} (VERIFIED)
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Stage 2: Balance */}
                        <div className={`p-3 md:p-4 rounded-2xl border transition-all duration-500 relative overflow-hidden group
                        ${order.isFullPaid
                            ? (isDark ? "bg-neutral-900/60 border-white/10" : "bg-neutral-50/80 border-black/5")
                            : (isDark ? "bg-white/5 border-white/10" : "bg-white border-black/5 shadow-sm")} 
                        ${!order.isAdvancePaid ? "opacity-20 pointer-events-none grayscale" : ""}`}>

                          <div className="relative z-10 flex justify-between items-center mb-3">
                            <div className="space-y-0.5">
                              <h5 className="text-xs md:text-sm font-medium flex items-center gap-2">
                                02. Final Balance (75%)
                                {order.isFullPaid && <CheckCircle size={14} className="text-emerald-500" />}
                              </h5>
                              <p className="text-[9px] md:text-[10px] opacity-50">Required before dispatch</p>
                            </div>
                            <span className={`text-lg md:text-xl font-bold ${isDark ? "text-white" : "text-black"}`}>₹{(order.totalPrice - order.advanceAmount).toLocaleString()}</span>
                          </div>

                          <div className="relative z-10">
                            {!order.isFullPaid ? (
                              order.balanceTransactionId ? (
                                <div className={`text-[10px] md:text-[11px] p-2.5 rounded-xl flex items-center gap-3 backdrop-blur-md ${isDark ? "bg-white/5 border border-white/10 text-gray-400" : "bg-black/5 border border-black/10 text-gray-600"}`}>
                                  <Clock size={14} className="animate-pulse" />
                                  <span className="uppercase tracking-wide">Verification Pending: {order.balanceTransactionId}</span>
                                </div>
                              ) : (
                                <form onSubmit={(e) => handlePaymentSubmit(e, 'balance')} className="flex flex-col sm:flex-row gap-2">
                                  <input
                                    type="text"
                                    placeholder="Balance Ref ID"
                                    value={balanceTransactionId}
                                    onChange={(e) => setBalanceTransactionId(e.target.value)}
                                    className={`flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-gray-500 transition-all ${isDark ? "text-white" : "text-black bg-gray-50 border-black/5"}`}
                                    required
                                    style={{ colorScheme: "dark" }}
                                  />
                                  <button type="submit" className={`sm:w-auto px-4 py-2 rounded-lg text-xs cursor-pointer transition-all active:scale-95 border ${isDark ? "bg-white/10 hover:bg-white/5 text-white border-white/10" : "bg-white/60 hover:bg-white text-black border-black/10"}`}>Submit</button>
                                </form>
                              )
                            ) : (
                              <div className={`text-[9px] md:text-[10px] py-1.5 px-3 rounded-full inline-block border uppercase tracking-wide ${isDark ? "bg-white/5 border-white/10 text-gray-400" : "bg-black/5 border border-black/10 text-gray-600"}`}>
                                Ref: {order.balanceTransactionId} (VERIFIED SUCCESSFUL)
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* PENDING VIEW */}
            {order.status === "pending" && (
              <div className={`p-6 md:p-10 rounded-2xl border-2 border-dashed relative overflow-hidden transition-all shadow-2xl
                ${isDark ? "bg-emerald-500/5 border-emerald-500/30" : "bg-emerald-50 border-emerald-500/20"}`}>
                <div className="relative z-10 flex flex-col items-center text-center py-4 md:py-6 space-y-4 md:space-y-6">
                  <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center ${isDark ? "bg-white/5" : "bg-black/5"}`}>
                    <Clock size={36} className="text-emerald-500 animate-spin-slow" />
                  </div>
                  <div className="max-w-md space-y-2 md:space-y-3">
                    <h4 className="text-lg md:text-xl" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>Awaiting Artist Approval</h4>
                    <p className="text-xs md:text-sm opacity-60 leading-relaxed">
                      Your commission request has been received! Once the artist reviews your reference photo and instructions, they will accept the order and provide the QR code for the advance payment here.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* FEEDBACK HUB */}
            {order.status === "delivered" && (
              <div className={`p-6 md:p-8 rounded-2xl border relative overflow-hidden transition-all shadow-xl
                ${isDark ? "bg-amber-950/20 border-amber-500/20" : "bg-amber-50/80 border-amber-200"} `}>

                <div className="absolute -top-16 -right-16 w-32 h-32 bg-amber-500/10 blur-[60px] rounded-full animate-pulse"></div>

                <div className="relative z-10 space-y-6 md:space-y-8">
                  <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 md:w-10 md:h-10 rounded-2xl flex items-center justify-center transition-transform hover:scale-105 duration-500 shadow-md 
                        ${isDark ? "bg-amber-500/20 border border-amber-500/30" : "bg-amber-100 border border-amber-200"}`}>
                        <Star size={20} className="text-amber-500 fill-amber-500" />
                      </div>

                      <div>
                        <h4 className="text-lg md:text-xl " style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>Feedback Hub</h4>
                        <p className="text-[10px] md:text-xs opacity-50 font-medium">Share your experience with the artwork</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={toggleFeedbackHub}
                      className={`p-2 rounded-xl transition-all ${isDark ? "hover:bg-white/10 text-gray-400" : "hover:bg-black/5 text-gray-600"}`}
                      title={showFeedbackHub ? "Collapse Feedback Hub" : "Expand Feedback Hub"}
                    >
                      {showFeedbackHub ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>

                  {showFeedbackHub && (
                    (order.rating > 0) ? (
                      <div className="space-y-4 md:space-y-6">
                        <div className="flex gap-1.5 md:gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={22}
                              className={`${star <= order.rating ? "text-amber-500 fill-amber-500" : "text-gray-300 opacity-20"}`}
                            />
                          ))}
                        </div>
                        <div className={`p-4 md:p-6 rounded-2xl border ${isDark ? "bg-white/5 border-white/5" : "bg-white border-black/5"}`}>
                          <p className="text-xs md:text-sm italic opacity-90 leading-relaxed">
                            "{order.feedback || "Verified service with no comments."}"
                          </p>
                        </div>
                        <p className="text-[9px] md:text-[10px] opacity-40  uppercase ">Submitted on {new Date(order.feedbackDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      </div>
                    ) : (
                      <form onSubmit={handleFeedbackSubmit} className="space-y-5 md:space-y-6">
                        <div className="space-y-2 md:space-y-3">
                          <p className="text-[10px] md:text-xs  uppercase tracking-wider opacity-50">Rate the Experience</p>
                          <div className="flex gap-2 md:gap-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className="transition-all transform hover:scale-125 active:scale-90"
                              >
                                <Star
                                  size={30}
                                  className={`${star <= rating ? "text-amber-500 fill-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]" : "text-gray-400 opacity-30"} transition-colors`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2 md:space-y-3">
                          <p className="text-[10px] md:text-xs uppercase tracking-wider opacity-50">Your Thoughts</p>
                          <textarea
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            placeholder="What did you love about the artwork?..."
                            className={`w-full bg-black/40 border border-white/10 rounded-2xl p-4 md:p-5 text-sm outline-none focus:border-amber-500 transition-all min-h-[100px] md:min-h-[120px] 
                            ${isDark ? "text-white placeholder:text-white/20" : "text-black bg-white border-black/5 placeholder:text-black/20"}`}
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={submittingFeedback}
                          className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 md:py-4 rounded-xl text-xs md:text-sm uppercase tracking-widest transition-all active:scale-[0.98] "
                        >
                          {submittingFeedback ? "Submitting..." : "Submit Review"}
                        </button>
                      </form>
                    ))}
                </div>
              </div>
            )}

            {/* HELP & SUPPORT */}
            <div className="pt-8 md:pt-10 border-t border-white/5 opacity-50 flex items-center justify-center md:justify-start">
              <div className="flex items-center gap-3 text-[10px] md:text-xs font-medium">
                <Clock size={16} />
                <span>Delivery: 3-5 Business Days after Final Payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
