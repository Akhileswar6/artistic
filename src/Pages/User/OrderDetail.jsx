import { ShoppingBag, ArrowLeft, Package, Clock, CheckCircle2, CheckCircle, ChevronRight, IndianRupee, X, Check, Copy, AlertCircle, ExternalLink, MapPin, Star } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
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
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }
      const response = await axios.get(`http://localhost:5000/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrder(response.data);
      if (response.data.rating) {
        setRating(response.data.rating);
        setFeedbackText(response.data.feedback);
      }
    } catch (err) {
      console.error("Failed to fetch order details:", err);
      toast.error("Order not found or access denied");
      navigate("/orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 10000);
    return () => clearInterval(interval);
  }, [id]);

  const handlePaymentSubmit = async (e, type = 'advance') => {
    e.preventDefault();
    if (!transactionId.trim()) return;

    setSubmittingPayment(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/orders/payment/${id}`,
        { transactionId, paymentType: type },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`${type === 'advance' ? 'Advance' : 'Balance'} Transaction ID submitted successfully! Admin will verify soon.`);
      setTransactionId("");
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
      await axios.put(`http://localhost:5000/api/orders/feedback/${id}`,
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
      <div className={`min-h-screen pt-28 md:pt-32 pb-24 px-6 transition-colors duration-300 ${isDark ? "bg-black text-white" : "bg-gray-50 text-black"}`}>
        <div className="max-w-4xl mx-auto">
          <OrderSkeleton />
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className={`min-h-screen pt-28 md:pt-32 pb-24 px-6 transition-colors duration-300 ${isDark ? "bg-black text-white" : "bg-gray-50 text-black"}`} style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate("/orders")}
              className={`p-2 rounded-lg transition-all ${isDark ? "hover:bg-white/10 text-gray-400" : "hover:bg-black/5 text-gray-600"}`}
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
                Order Details
              </h1>
              <p className="text-xs md:text-sm mt-1 opacity-50">#{order._id.toUpperCase()}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusInfo(order.status).color}`}>
                {getStatusInfo(order.status).label}
              </span>
          </div>
        </div>

        <div className={`rounded-2xl border shadow-xl overflow-hidden ${isDark ? "bg-[#0d0d0d] border-white/10" : "bg-white border-black/5"}`}>
          <div className="p-6 md:p-10 space-y-12">
            
            {/* Status Stepper */}
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-[13px] font-bold uppercase tracking-wider opacity-40">Order Progress</h3>
              </div>

              <div className="relative px-2">
                <div className={`absolute top-[10px] left-0 w-full h-[2px] ${isDark ? "bg-white/10" : "bg-black/5"}`}></div>
                <div
                  className="absolute top-[10px] left-0 h-[2px] bg-emerald-500 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                  style={{ width: `${(getStatusInfo(order.status).step / (steps.length - 1)) * 100}%` }}
                ></div>

                <div className="relative flex justify-between">
                  {steps.map((step, idx) => {
                    const currentStep = getStatusInfo(order.status).step;
                    const isCompleted = idx < currentStep;
                    const isCurrent = idx === currentStep;

                    return (
                      <div key={idx} className="flex flex-col items-center gap-2 md:gap-4">
                        <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full z-10 transition-all duration-500 flex items-center justify-center border-2 ${isCompleted
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : isCurrent
                            ? "bg-black border-emerald-500 text-emerald-500 ring-4 ring-emerald-500/20"
                            : isDark ? "bg-[#0d0d0d] border-white/20" : "bg-white border-black/10"
                          }`}>
                          {isCompleted && <Check size={8} className="md:w-[10px]" strokeWidth={4} />}
                          {isCurrent && <div className="w-1 md:w-1.5 h-1 md:h-1.5 bg-emerald-500 rounded-full animate-pulse" />}
                        </div>

                        <span className={`text-[8px] md:text-[10px] font-bold uppercase tracking-tighter transition-all duration-300 ${isCurrent
                          ? "text-emerald-500"
                          : isCompleted
                            ? "opacity-60"
                            : "opacity-20"
                          }`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Commission Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-8">
                <div>
                  <h3 className="text-[15px] font-bold mb-4 flex items-center gap-2">
                    <Package size={18} className="text-blue-500" />
                    Commission Info
                  </h3>
                  <div className={`p-5 rounded-xl border space-y-3.5 ${isDark ? "bg-white/5 border-white/5" : "bg-gray-50 border-black/5 shadow-sm"}`}>
                    <div className="flex justify-between text-sm">
                      <span className="opacity-50">Style</span>
                      <span className="font-medium">{order.artStyle}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="opacity-50">Frame</span>
                      <span className="font-medium">{order.frameOption}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="opacity-50">Total Price</span>
                      <span className="font-bold text-emerald-500">₹{order.totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="opacity-50">Advance Amount</span>
                      <span className="font-medium">₹{order.advanceAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-white/5">
                      <span className="opacity-50">Advance Status</span>
                      <span className={`font-bold uppercase text-[10px] px-2 py-0.5 rounded ${order.isAdvancePaid ? "text-emerald-500 bg-emerald-500/10" : "text-amber-500 bg-amber-500/10"}`}>
                        {order.isAdvancePaid ? "Paid & Verified" : "Pending Verification"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-[15px] font-bold mb-4 flex items-center gap-2">
                    <MapPin size={18} className="text-rose-500" />
                    Delivery Details
                  </h3>
                  <div className={`p-5 rounded-xl border space-y-4 ${isDark ? "bg-white/5 border-white/5" : "bg-gray-50 border-black/5 shadow-sm"}`}>
                    <div className="space-y-1">
                      <p className="text-[11px] uppercase tracking-wider opacity-40 font-bold">Recipient</p>
                      <p className="text-sm font-medium">{order.name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] uppercase tracking-wider opacity-40 font-bold">Address</p>
                      <p className="text-sm leading-relaxed">{order.address}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-[11px] uppercase tracking-wider opacity-40 font-bold">Email</p>
                        <p className="text-sm truncate">{order.email}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[11px] uppercase tracking-wider opacity-40 font-bold">Phone</p>
                        <p className="text-sm">{order.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-[15px] font-bold mb-4">Special Instructions</h3>
                  <div className={`text-sm p-5 rounded-xl border min-h-[100px] ${isDark ? "bg-white/5 border-white/5 opacity-80" : "bg-gray-50 border-black/5 shadow-sm opacity-80"}`}>
                    {order.instructions || "No special instructions provided."}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-[15px] font-bold mb-4 flex items-center gap-2">
                    <ExternalLink size={18} className="text-purple-500" />
                    Reference Photo
                  </h3>
                  <div className={`aspect-square rounded-2xl border overflow-hidden shadow-2xl relative group ${isDark ? "border-white/10" : "border-black/5"}`}>
                    <OptimizedImage src={order.photo} alt="Reference" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <button 
                         onClick={() => window.open(order.photo, '_blank')}
                         className="px-4 py-2 bg-white text-black rounded-lg text-xs font-bold"
                       >
                         View Full Image
                       </button>
                    </div>
                  </div>
                </div>

                <div className={`p-5 rounded-xl border flex items-center justify-between gap-4 ${isDark ? "bg-white/5 border-white/5" : "bg-gray-50 border-black/5"}`}>
                  <div className="space-y-1">
                    <p className="text-[11px] uppercase tracking-wider opacity-40 font-bold">Order ID</p>
                    <p className="text-sm font-mono text-blue-400">#{order._id.toUpperCase()}</p>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(order._id);
                      toast.success("Order ID copied to clipboard!");
                    }}
                    className={`p-2.5 rounded-lg transition-colors ${isDark ? "hover:bg-white/10 text-gray-400" : "hover:bg-gray-200 text-gray-600"}`}>
                    <Copy size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* PAYMENT HUB */}
            {(order.status !== "pending" && order.status !== "cancelled") && (
              <div className={`p-8 rounded-2xl border border-white/10 relative overflow-hidden transition-all shadow-xl
                ${isDark ? "bg-emerald-950/30" : "bg-emerald-50/80"} backdrop-blur-2xl`}>

                <div className="absolute -top-16 -left-16 w-48 h-48 bg-emerald-500/10 blur-[80px] rounded-full animate-pulse"></div>
                <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-emerald-400/10 blur-[80px] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>

                <div className="relative z-10 space-y-8">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform hover:scale-105 duration-500 shadow-md 
                      ${isDark ? "bg-emerald-500/20 border border-emerald-500/30" : "bg-emerald-100 border border-emerald-200"}`}>
                      <IndianRupee size={28} className="text-emerald-500" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>Payment Hub</h4>
                      <p className="text-xs opacity-50">Complete your payment to proceed with the artwork</p>
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row gap-10 items-center lg:items-start text-left">
                    {!order.isFullPaid && (
                      <div className="shrink-0 space-y-4">
                        <div className={`group relative p-3 rounded-2xl transition-all duration-500 hover:scale-[1.02] shadow-2xl
                          ${isDark ? "bg-white/5 border border-white/10" : "bg-white border border-emerald-100"}`}>
                          <div className="relative w-40 h-40 bg-white flex items-center justify-center overflow-hidden rounded-lg">
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
                          <p className="text-sm text-emerald-500 font-black flex items-center justify-center gap-2 animate-pulse">
                            <CheckCircle size={16} /> Scan & Pay UPI
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex-1 w-full space-y-5">
                      {/* Stage 1: Advance */}
                      <div className={`p-6 rounded-2xl border transition-all duration-500 relative overflow-hidden group
                        ${order.isAdvancePaid
                          ? (isDark ? "bg-emerald-500/10 border-emerald-500/30 opacity-60" : "bg-emerald-50 border-emerald-200 opacity-80")
                          : (isDark ? "bg-white/5 border-white/10" : "bg-white border-black/5 shadow-sm")}`}>

                        <div className="relative z-10 flex justify-between items-center mb-4">
                          <div className="space-y-1">
                            <h5 className="font-bold flex items-center gap-2">
                              01. Advance (25%)
                              {order.isAdvancePaid && <CheckCircle size={16} className="text-emerald-500" />}
                            </h5>
                            <p className="text-xs opacity-50">Required to start the artwork</p>
                          </div>
                          <span className="text-2xl font-black text-emerald-500 ">₹{order.advanceAmount.toLocaleString()}</span>
                        </div>

                        <div className="relative z-10">
                          {!order.isAdvancePaid ? (
                            order.transactionId ? (
                              <div className="text-xs p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center gap-3 backdrop-blur-md">
                                <Clock size={16} className="animate-pulse" />
                                <span className="font-bold uppercase tracking-wide">Verification Pending: {order.transactionId}</span>
                              </div>
                            ) : (
                              <form onSubmit={(e) => handlePaymentSubmit(e, 'advance')} className="flex gap-3">
                                <input
                                  type="text"
                                  placeholder="Enter UPI Transaction ID"
                                  value={transactionId}
                                  onChange={(e) => setTransactionId(e.target.value)}
                                  className={`flex-1 bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-sm outline-none focus:border-emerald-500 transition-all ${isDark ? "text-white" : "text-black bg-gray-50 border-black/5"}`}
                                  required
                                />
                                <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl text-xs font-bold cursor-pointer transition-all active:scale-95">SUBMIT</button>
                              </form>
                            )
                          ) : (
                            <div className="text-[11px] font-black text-emerald-500 bg-emerald-500/10 py-2 px-4 rounded-full inline-block border border-emerald-500/20 uppercase tracking-wide">
                              Transaction ID: {order.transactionId} (VERIFIED)
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Stage 2: Balance */}
                      <div className={`p-6 rounded-2xl border transition-all duration-500 relative overflow-hidden group
                        ${order.isFullPaid
                          ? (isDark ? "bg-emerald-500/10 border-emerald-500/40" : "bg-emerald-50 border-emerald-500/30")
                          : (isDark ? "bg-white/5 border-white/10" : "bg-white border-black/5 shadow-sm")} 
                        ${!order.isAdvancePaid ? "opacity-20 pointer-events-none grayscale" : ""}`}>

                        <div className="relative z-10 flex justify-between items-center mb-4">
                          <div className="space-y-1">
                            <h5 className="font-bold flex items-center gap-2">
                              02. Final Balance (75%)
                              {order.isFullPaid && <CheckCircle size={16} className="text-emerald-500" />}
                            </h5>
                            <p className="text-xs opacity-50 ">Required before dispatch</p>
                          </div>
                          <span className="text-2xl font-black text-emerald-500 ">₹{(order.totalPrice - order.advanceAmount).toLocaleString()}</span>
                        </div>

                        <div className="relative z-10">
                          {!order.isFullPaid ? (
                            order.balanceTransactionId ? (
                              <div className="text-xs p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center gap-3 backdrop-blur-md">
                                <Clock size={16} className="animate-pulse" />
                                <span className="font-bold uppercase tracking-wide">Verification Pending: {order.balanceTransactionId}</span>
                              </div>
                            ) : (
                              <form onSubmit={(e) => handlePaymentSubmit(e, 'balance')} className="flex gap-3">
                                <input
                                  type="text"
                                  placeholder="Enter Balance Ref ID"
                                  value={transactionId}
                                  onChange={(e) => setTransactionId(e.target.value)}
                                  className={`flex-1 bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-sm outline-none focus:border-emerald-500 transition-all ${isDark ? "text-white" : "text-black bg-gray-50 border-black/5"}`}
                                  required
                                />
                                <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl text-xs font-bold cursor-pointer transition-all active:scale-95">SUBMIT</button>
                              </form>
                            )
                          ) : (
                            <div className="text-[11px] font-black text-emerald-500 bg-emerald-500/10 py-2 px-4 rounded-full inline-block border border-emerald-500/20 uppercase tracking-wide">
                              Transaction ID: {order.balanceTransactionId} (VERIFIED SUCCESSFUL)
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {order.isFullPaid && (
                    <div className="pt-6 border-t border-white/5 text-center">
                      <div className="inline-flex items-center gap-3 px-6 py-3 bg-emerald-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/20">
                        <CheckCircle2 size={20} strokeWidth={3} /> FULLY PAID & VERIFIED
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* PENDING VIEW */}
            {order.status === "pending" && (
              <div className={`p-10 rounded-2xl border-2 border-dashed relative overflow-hidden transition-all shadow-2xl
                ${isDark ? "bg-emerald-500/5 border-emerald-500/30" : "bg-emerald-50 border-emerald-500/20"}`}>
                <div className="relative z-10 flex flex-col items-center text-center py-6 space-y-6">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center ${isDark ? "bg-white/5" : "bg-black/5"}`}>
                    <Clock size={40} className="text-emerald-500 animate-spin-slow" />
                  </div>
                  <div className="max-w-md space-y-3">
                    <h4 className="text-xl font-bold" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>Awaiting Artist Approval</h4>
                    <p className="text-sm opacity-60 leading-relaxed">
                      Your commission request has been received! Once the artist reviews your reference photo and instructions, they will accept the order and provide the QR code for the advance payment here.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* FEEDBACK HUB */}
            {order.status === "delivered" && (
              <div className={`p-8 rounded-2xl border relative overflow-hidden transition-all shadow-xl
                ${isDark ? "bg-amber-950/20 border-amber-500/20" : "bg-amber-50/80 border-amber-200"} `}>

                <div className="absolute -top-16 -right-16 w-32 h-32 bg-amber-500/10 blur-[60px] rounded-full animate-pulse"></div>

                <div className="relative z-10 space-y-8">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform hover:scale-105 duration-500 shadow-md 
                      ${isDark ? "bg-amber-500/20 border border-amber-500/30" : "bg-amber-100 border border-amber-200"}`}>
                      <Star size={28} className="text-amber-500 fill-amber-500" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black tracking-tight" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>Feedback Hub</h4>
                      <p className="text-xs opacity-50 font-medium">Share your experience with the artwork</p>
                    </div>
                  </div>

                  {(order.rating > 0) ? (
                    <div className="space-y-6">
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={24}
                            className={`${star <= order.rating ? "text-amber-500 fill-amber-500" : "text-gray-300 opacity-20"}`}
                          />
                        ))}
                      </div>
                      <div className={`p-6 rounded-2xl border ${isDark ? "bg-white/5 border-white/5" : "bg-white border-black/5"}`}>
                        <p className="text-sm italic opacity-90 leading-relaxed">
                          "{order.feedback || "Verified service with no comments."}"
                        </p>
                      </div>
                      <p className="text-[10px] opacity-40 font-bold uppercase tracking-[0.2em]">Submitted on {new Date(order.feedbackDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                  ) : (
                    <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                      <div className="space-y-3">
                        <p className="text-xs font-bold uppercase tracking-wider opacity-50">Rate the Experience</p>
                        <div className="flex gap-3">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              onMouseEnter={() => setRating(star)}
                              className="transition-all transform hover:scale-125 active:scale-90"
                            >
                              <Star
                                size={32}
                                className={`${star <= rating ? "text-amber-500 fill-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]" : "text-gray-400 opacity-30"} transition-colors`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <p className="text-xs font-bold uppercase tracking-wider opacity-50">Your Thoughts</p>
                        <textarea
                          value={feedbackText}
                          onChange={(e) => setFeedbackText(e.target.value)}
                          placeholder="What did you love about the artwork? The detailing, the delivery, or the communication..."
                          className={`w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-sm outline-none focus:border-amber-500 transition-all min-h-[120px] 
                            ${isDark ? "text-white placeholder:text-white/20" : "text-black bg-white border-black/5 placeholder:text-black/20"}`}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submittingFeedback}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-white py-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-amber-500/20"
                      >
                        {submittingFeedback ? "Submitting..." : "Submit Review"}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}

            {/* HELP & SUPPORT */}
            <div className="pt-10 border-t border-white/5 opacity-50 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3 text-xs font-medium">
                <Clock size={16} />
                <span>Delivery: 3-5 Business Days after Final Payment</span>
              </div>
              <div className="flex items-center gap-6">
                <button className="flex items-center gap-2 text-xs font-bold hover:text-white transition-colors uppercase tracking-wider">
                  <AlertCircle size={16} /> Report Issue
                </button>
                <button className="flex items-center gap-2 text-xs font-bold hover:text-white transition-colors uppercase tracking-wider">
                  <ExternalLink size={16} /> Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
