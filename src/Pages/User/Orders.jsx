import { ShoppingBag, ArrowRight, Package, Clock, CheckCircle2, CheckCircle, ChevronRight, IndianRupee, X, Check, Copy, AlertCircle, ExternalLink, MapPin, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function Orders({ isDark }) {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/signin");
        return;
      }
      const response = await axios.get("http://localhost:5000/api/orders/my-orders", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedOrder) {
      const updated = orders.find(o => o._id === selectedOrder._id);
      if (updated && JSON.stringify(updated) !== JSON.stringify(selectedOrder)) {
        // Updated modal data automatically
        setSelectedOrder(updated);
      }
    }
  }, [orders]);

  const handlePaymentSubmit = async (e, type = 'advance') => {
    e.preventDefault();
    if (!transactionId.trim()) return;

    setSubmittingPayment(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/orders/payment/${selectedOrder._id}`,
        { transactionId, paymentType: type },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`${type === 'advance' ? 'Advance' : 'Balance'} Transaction ID submitted successfully! Admin will verify soon.`);
      setTransactionId("");
      fetchOrders();
      // Optimistic update for modal
      setSelectedOrder(prev => ({
        ...prev,
        [type === 'advance' ? 'transactionId' : 'balanceTransactionId']: transactionId
      }));
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
      const response = await axios.put(`http://localhost:5000/api/orders/feedback/${selectedOrder._id}`,
        { rating, feedback: feedbackText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Thank you for your feedback!");
      fetchOrders();
      // Optimistic update for modal
      setSelectedOrder(prev => ({
        ...prev,
        rating,
        feedback: feedbackText,
        feedbackDate: new Date()
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit feedback");
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const getStatusInfo = (status) => {
    const map = {
      pending: { label: "Pending", color: "text-orange-500 bg-orange-500/10", step: 0 },
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

  return (
    <div className={`min-h-screen pt-12 pb-24 px-6 transition-colors duration-300 ${isDark ? "bg-black text-white" : "bg-gray-50 text-black"}`} style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
                My Orders
              </h1>
              {loading && <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin opacity-50"></div>}
            </div>
            <p className={`text-sm mt-1 opacity-50`}>Track and manage your recent commissions</p>
          </div>

          <button
            onClick={() => navigate("/order")}
            className={`px-6 py-2.5 rounded-md font-medium text-sm flex items-center gap-2 transition-all cursor-pointer ${isDark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-neutral-800"
              }`}
          >
            New Commission
            <ArrowRight size={16} />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : orders.length > 0 ? (
          <div className="grid gap-6">
            {orders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              return (
                <div
                  key={order._id}
                  className={`group rounded-lg p-4 border transition-all duration-500 hover:shadow-2xl  ${
                    isDark 
                      ? "bg-white/[0.02] border-white/10 hover:border-white/20 " 
                      : "bg-white border-black/5 hover:border-black/10 "
                  }`}
                >
                  <div className="flex flex-col md:flex-row gap-5 items-center">
                    {/* Compact Image Preview */}
                    <div className="w-full md:w-32 h-32 rounded-lg overflow-hidden shrink-0 border border-white/5 shadow-xl relative group-hover:scale-105 transition-transform duration-500">
                      <img src={order.photo} alt="Commission" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>

                    <div className="flex-1 w-full space-y-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-3">
                            <h3 className="font-bold text-[17px]" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
                              {order.artStyle.charAt(0).toUpperCase() + order.artStyle.slice(1)} Portrait
                            </h3>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                              statusInfo.color.replace('bg-', 'bg-opacity-10 border-').replace('/10', '/20')
                            }`}>
                              {statusInfo.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 opacity-40">
                             <p className="text-[13px] flex items-center gap-1.5 ">
                               <Clock size={12} /> {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                             </p>
                             <div className="w-1 h-1 rounded-full bg-current opacity-30"></div>
                             <p className="text-[13px] flex items-center gap-1.5 ">
                               <Package size={12} /> #{order._id.slice(-6).toUpperCase()}
                             </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className={`px-3 py-1.5 rounded-lg border ${isDark ? "bg-white/5 border-white/5" : "bg-gray-50 border-black/5"}`}>
                            <p className="text-base font-black flex items-center justify-end gap-0.5 tracking-tighter">
                              <IndianRupee size={14} /> {order.totalPrice.toLocaleString()}
                            </p>
                          </div>
                          <p className="text-[13px]  opacity-30 mt-1">Total Value</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-end pt-2 border-t border-white/5">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className={`group/btn flex items-center gap-2 text-[13px]  cursor-pointer transition-all px-3 py-1.5 rounded-lg ${
                            isDark 
                              ? "text-blue-400 hover:bg-blue-400/10" 
                              : "text-blue-600 hover:bg-blue-50"
                          }`}
                        >
                          View Details 
                          <ChevronRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className={`min-h-[400px] flex flex-col items-center justify-center rounded-[32px] border border-dashed transition-all duration-300 ${isDark ? "bg-[#141414] border-white/10" : "bg-white border-black/10"
            }`}>
            <div className="text-center space-y-6 max-w-sm px-6">
              <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center rotate-6 transition-transform hover:rotate-0 duration-500 ${isDark ? "bg-white/5" : "bg-black/5"}`}>
                <ShoppingBag size={40} className="opacity-20" />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-bold" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>No orders found</h2>
                <p className="text-sm opacity-50 leading-relaxed">
                  It looks like you haven't placed any orders yet. Start exploring our gallery to find something you love!
                </p>
              </div>

              <button
                onClick={() => navigate("/order")}
                className={`inline-flex items-center gap-2 text-sm font-semibold transition-colors ${isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"
                  }`}
              >
                <Package size={18} />
                Place your first order
              </button>
            </div>
          </div>
        )}

        {/* Helpful Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-white/5">
          {[
            { title: "Artisan Quality", desc: "Hand-drawn with premium materials" },
            { title: "Safe Shipping", desc: "Special packaging for fragile art" },
            { title: "Updates", desc: "Receive photo updates as we draw" }
          ].map((item, i) => (
            <div key={i} className="text-center md:text-left space-y-2">
              <h4 className="text-sm font-bold" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>{item.title}</h4>
              <p className="text-[12px] opacity-40 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

      </div>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div
            className={`w-full max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar rounded-xl border shadow-2xl animate-in zoom-in-95 duration-300
              ${isDark ? "bg-[#0d0d0d] border-white/10 text-white" : "bg-white border-black/5 text-black"}`}
          >
            {/* Modal Header */}
            <div className={`sticky top-0 z-10 p-6 flex justify-between items-center border-b ${isDark ? "bg-[#0d0d0d]/90 border-white/10 backdrop-blur-md" : "bg-white/90 border-black/5 backdrop-blur-md"}`}>
              <div className="flex items-center gap-3">
                <Package className="text-emerald-500" size={24} />
                <h2 className="text-xl font-bold" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>Order Details</h2>
              </div>
              <button
                onClick={() => {
                  setSelectedOrder(null);
                  setTransactionId("");
                }}
                className={` ${isDark ? "hover:text-white text-gray-400" : "hover:text-black text-gray-500"}`}>
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-8">
              {/* Status Stepper */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-[15px]">Order Progress</h3>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusInfo(selectedOrder.status).color}`}>
                    {getStatusInfo(selectedOrder.status).label}
                  </span>
                </div>

                <div className="relative pt-4 pb-8">
                  {/* Progress Line Background */}
                  <div className={`absolute top-[26px] left-0 w-full h-[3.5px] rounded-full ${isDark ? "bg-white/5" : "bg-black/5"}`}></div>

                  {/* Active Progress Line */}
                  <div
                    className="absolute top-[26px] left-0 h-[3.5px] rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    style={{ width: `${(getStatusInfo(selectedOrder.status).step / (steps.length - 1)) * 100}%` }}
                  ></div>

                  <div className="relative flex justify-between px-1">
                    {steps.map((step, idx) => {
                      const currentStep = getStatusInfo(selectedOrder.status).step;
                      const isCompleted = idx < currentStep;
                      const isCurrent = idx === currentStep;

                      return (
                        <div key={idx} className="flex flex-col items-center gap-3 w-0">
                          <div className={`w-5 h-5 rounded-full z-10 transition-all duration-500 flex items-center justify-center border-2 ${isCompleted
                              ? "bg-emerald-500 border-emerald-500 text-white scale-110 shadow-lg shadow-emerald-500/30"
                              : isCurrent
                                ? "bg-emerald-500/20 border-emerald-500 text-emerald-500 ring-4 ring-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                                : isDark ? "bg-[#0d0d0d] border-white/10" : "bg-white border-black/10"
                            }`}>
                            {isCompleted && <Check size={10} strokeWidth={4} />}
                            {isCurrent && <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />}
                          </div>

                          <span className={`text-[12px] whitespace-nowrap transition-all duration-300 ${isCurrent
                              ? "text-emerald-500 scale-110"
                              : isCompleted
                                ? "opacity-80"
                                : "opacity-30"
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-[15px] mb-3">Commission Info</h3>
                    <div className={`p-4 rounded-lg border space-y-2.5 ${isDark ? "bg-white/5 border-white/5" : "bg-gray-50 border-black/5 shadow-sm"}`}>
                      <div className="flex justify-between text-sm">
                        <span className="opacity-50">Style</span>
                        <span>{selectedOrder.artStyle}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="opacity-50">Frame</span>
                        <span>{selectedOrder.frameOption}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="opacity-50">Total Price</span>
                        <span>₹{selectedOrder.totalPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="opacity-50">Advance Amount</span>
                        <span className=" text-orange-500">₹{selectedOrder.advanceAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="opacity-50">Advance Status</span>
                        <span className={`${selectedOrder.isAdvancePaid ? "text-green-500" : "text-orange-500"}`}>
                          {selectedOrder.isAdvancePaid ? "Paid" : "Pending"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[15px] mb-3">Customer Profile</h3>
                    <div className={`p-4 rounded-lg border space-y-2 ${isDark ? "bg-white/5 border-white/5" : "bg-gray-50 border-black/5 shadow-sm"}`}>
                       <div className="flex justify-between text-sm">
                         <span className="opacity-50">Name</span>
                         <span>{selectedOrder.name}</span>
                       </div>
                       <div className="flex justify-between text-sm">
                         <span className="opacity-50">Email</span>
                         <span>{selectedOrder.email}</span>
                       </div>
                       <div className="flex justify-between text-sm">
                         <span className="opacity-50">Phone</span>
                         <span>{selectedOrder.phone}</span>
                       </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[15px] mb-3">Delivery Address</h3>
                    <p className={`text-sm p-4 rounded-lg border ${isDark ? "bg-white/5 border-white/5" : "bg-gray-50 border-black/5 shadow-sm"}`}>
                      {selectedOrder.address}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-[15px] mb-3">Special Instructions</h3>
                    <p className={`text-sm p-4 rounded-lg border ${isDark ? "bg-white/5 border-white/5 opacity-80" : "bg-gray-50 border-black/5 shadow-sm opacity-80"}`}>
                      {selectedOrder.instructions || "No special instructions provided."}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-[15px] mb-3">Reference Photo</h3>
                    <div className={`aspect-square rounded-lg border overflow-hidden shadow-2xl ${isDark ? "border-white/10" : "border-black/5"}`}>
                      <img src={selectedOrder.photo} alt="Reference" className="w-full h-full object-cover" />
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg border flex items-center justify-between gap-4 ${isDark ? "bg-white/5 border-white/5" : "bg-gray-50 border-black/5"}`}>
                    <div className="space-y-0.5">
                      <p className="text-[13px]">Order ID</p>
                      <p className="text-xs text-blue-400">#{selectedOrder._id.toUpperCase()}</p>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(selectedOrder._id);
                        toast.success("Order ID copied to clipboard!");
                      }}
                      className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-white/10 text-gray-400" : "hover:bg-gray-200 text-gray-600"}`}>
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* PAYMENT HUB (Liquid Glass Style) */}
              {(selectedOrder.status !== "pending" && selectedOrder.status !== "cancelled") && (
                <div className={`p-6 rounded-lg border border-white/10 relative overflow-hidden transition-all shadow-xl animate-in slide-in-from-bottom-4 duration-500
                  ${isDark ? "bg-emerald-950/30" : "bg-emerald-50/80"} backdrop-blur-2xl`}>
                  
                  {/* Decorative Liquid Orbs */}
                  <div className="absolute -top-16 -left-16 w-48 h-48 bg-emerald-500/10 blur-[80px] rounded-full animate-pulse"></div>
                  <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-emerald-400/10 blur-[80px] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>

                  <div className="relative z-10 space-y-6">
                    {/* Payment Header */}
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-transform hover:scale-105 duration-500 shadow-md 
                        ${isDark ? "bg-emerald-500/20 border border-emerald-500/30" : "bg-emerald-100 border border-emerald-200"}`}>
                        <IndianRupee size={24} className="text-emerald-500" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>Payment Hub</h4>
                        <p className="text-[12px] opacity-40">Verified security for your artistic investments</p>
                      </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-start text-left">
                      {/* QR Code Section (Liquid Glass Container) */}
                      {!selectedOrder.isFullPaid && (
                        <div className="shrink-0 space-y-3">
                          <div className={`group relative p-2  transition-all duration-500 hover:scale-[1.02] shadow-lg
                            ${isDark ? "bg-white/5 border border-white/10" : "bg-white border border-emerald-100"}`}>
                            <div className="relative w-34 h-35 bg-white flex items-center justify-center overflow-hidden shadow-inner">
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
                          <div className="space-y-0.5 text-center">
                            <p className="text-[12px] text-emerald-500 font-black flex items-center justify-center gap-1.5 animate-pulse">
                              <CheckCircle size={14} /> Scan & Pay
                            </p>
                            <p className="text-[8px] opacity-30 font-black uppercase tracking-[0.2em]">UPI Verified</p>
                          </div>
                        </div>
                      )}

                      {/* Payment Stages (Glass Cards) */}
                      <div className="flex-1 w-full space-y-4">
                        {/* Stage 1: Advance */}
                        <div className={`p-4 rounded-lg border transition-all duration-500 relative overflow-hidden group
                          ${selectedOrder.isAdvancePaid 
                            ? (isDark ? "bg-emerald-500/10 border-emerald-500/30 opacity-60" : "bg-emerald-50 border-emerald-200 opacity-80") 
                            : (isDark ? "bg-white/5 border-white/10" : "bg-white border-black/5 shadow-sm")}`}>
                          
                          <div className="relative z-10 flex justify-between items-center mb-3">
                            <div className="space-y-0.5">
                              <h5 className=" text-[13px] flex items-center gap-1.5">
                                01. Advance (25%)
                                {selectedOrder.isAdvancePaid && <CheckCircle size={14} className="text-emerald-500" />}
                              </h5>
                              <p className="text-[12px] opacity-50">To initiate the process</p>
                            </div>
                            <span className="text-xl font-black text-emerald-500 ">₹{selectedOrder.advanceAmount.toLocaleString()}</span>
                          </div>

                          <div className="relative z-10">
                            {!selectedOrder.isAdvancePaid ? (
                              selectedOrder.transactionId ? (
                                <div className="text-[10px] p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center gap-2 backdrop-blur-md">
                                  <Clock size={12} className="animate-pulse" />
                                  <span className="font-bold uppercase tracking-tight">Pending: {selectedOrder.transactionId}</span>
                                </div>
                              ) : (
                                <form onSubmit={(e) => handlePaymentSubmit(e, 'advance')} className="flex gap-2">
                                  <input
                                    type="text"
                                    placeholder="Enter Transaction ID"
                                    value={transactionId}
                                    onChange={(e) => setTransactionId(e.target.value)}
                                    className={`flex-1 bg-black/40 border border-white/5 rounded-lg px-4 py-2 text-xs outline-none focus:border-emerald-500/40 transition-all ${isDark ? "text-white" : "text-black bg-gray-50 border-black/5"}`}
                                    required
                                  />
                                  <button type="submit" className="bg-emerald-500 text-white px-4 py-2 rounded-md text-xs cursor-pointer transition-all active:scale-95">SUBMIT</button>
                                </form>
                              )
                            ) : (
                              <div className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 py-1.5 px-3 rounded-full inline-block border border-emerald-500/20 uppercase tracking-tight">
                                TXN ID: {selectedOrder.transactionId} (VERIFIED)
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Stage 2: Balance */}
                        <div className={`p-4 rounded-lg border transition-all duration-500 relative overflow-hidden group
                          ${selectedOrder.isFullPaid 
                             ? (isDark ? "bg-emerald-500/10 border-emerald-500/40" : "bg-emerald-50 border-emerald-500/30") 
                             : (isDark ? "bg-white/5 border-white/10" : "bg-white border-black/5 shadow-sm")} 
                          ${!selectedOrder.isAdvancePaid ? "opacity-20 pointer-events-none grayscale" : ""}`}>
                          
                          <div className="relative z-10 flex justify-between items-center mb-3">
                            <div className="space-y-0.5">
                              <h5 className=" text-[13px]  flex items-center gap-1.5">
                                02. Final Balance (75%)
                                {selectedOrder.isFullPaid && <CheckCircle size={14} className="text-emerald-500" />}
                              </h5>
                              <p className="text-[12px] opacity-50 ">Before shipping</p>
                            </div>
                            <span className="text-xl font-black text-emerald-500 ">₹{(selectedOrder.totalPrice - selectedOrder.advanceAmount).toLocaleString()}</span>
                          </div>

                          <div className="relative z-10">
                            {!selectedOrder.isFullPaid ? (
                              selectedOrder.balanceTransactionId ? (
                                <div className="text-[10px] p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center gap-2 backdrop-blur-md">
                                  <Clock size={12} className="animate-pulse" />
                                  <span className="font-bold uppercase tracking-tight">Verifying: {selectedOrder.balanceTransactionId}</span>
                                </div>
                              ) : (
                                <form onSubmit={(e) => handlePaymentSubmit(e, 'balance')} className="flex gap-2">
                                  <input
                                    type="text"
                                    placeholder="Enter Balance Ref ID"
                                    value={transactionId}
                                    onChange={(e) => setTransactionId(e.target.value)}
                                    className={`flex-1 bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-xs outline-none focus:border-emerald-500/40 transition-all ${isDark ? "text-white" : "text-black bg-gray-50 border-black/5"}`}
                                    required
                                  />
                                  <button type="submit" className="bg-emerald-500 text-white px-4 py-2 rounded-md text-xs   cursor-pointer transition-all active:scale-95">SUBMIT</button>
                                </form>
                              )
                            ) : (
                              <div className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 py-1.5 px-3 rounded-full inline-block border border-emerald-500/20 uppercase tracking-tight">
                                TXN ID: {selectedOrder.balanceTransactionId} (VERIFIED SUCCESSFUL)
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {selectedOrder.isFullPaid && (
                      <div className="pt-4 border-t border-white/5 text-center">
                        <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-500 text-white rounded-2xl font-black text-sm shadow-lg shadow-emerald-500/30 animate-in zoom-in-90 duration-500 uppercase tracking-tighter">
                          <Check size={18} strokeWidth={4} /> MISSION PAID (SUCCESSFUL)
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* PENDING VIEW (Only show if not accepted) */}
              {selectedOrder.status === "pending" && (
                <div className={`p-8 rounded-xl border-2 border-dashed relative overflow-hidden transition-all shadow-2xl animate-in slide-in-from-bottom-4 duration-500
                  ${isDark ? "bg-emerald-500/5 border-emerald-500/30" : "bg-emerald-50 border-emerald-500/20"}`}>
                  <div className="relative z-10 flex flex-col items-center text-center py-4 space-y-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isDark ? "bg-white/5" : "bg-black/5"}`}>
                      <Clock size={32} className="text-emerald-500 animate-spin-slow" />
                    </div>
                    <div className="max-w-md space-y-2">
                      <h4 className="text-lg font-bold" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>Awaiting Artist Approval</h4>
                      <p className="text-sm opacity-60 leading-relaxed">
                        Your commission request has been received! Once the artist reviews your reference photo and instructions, they will accept the order and provide the QR code for the advance payment here.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* FEEDBACK HUB (Special Delivered Feature) */}
              {selectedOrder.status === "delivered" && (
                <div className={`p-6 rounded-[32px] border relative overflow-hidden transition-all shadow-xl animate-in slide-in-from-bottom-4 duration-500
                  ${isDark ? "bg-amber-950/20 border-amber-500/20" : "bg-amber-50/80 border-amber-200"} backdrop-blur-2xl`}>
                  
                  {/* Decorative Amber Orb */}
                  <div className="absolute -top-16 -right-16 w-32 h-32 bg-amber-500/10 blur-[60px] rounded-full animate-pulse"></div>

                  <div className="relative z-10 space-y-6">
                    {/* Feedback Header */}
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform hover:scale-105 duration-500 shadow-md 
                        ${isDark ? "bg-amber-500/20 border border-amber-500/30" : "bg-amber-100 border border-amber-200"}`}>
                        <Star size={24} className="text-amber-500 fill-amber-500" />
                      </div>
                      <div>
                        <h4 className="text-lg font-black tracking-tight" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>Feedback Hub</h4>
                        <p className="text-[11px] opacity-40 font-medium tracking-tight">How was your experience with Akhileswar's art?</p>
                      </div>
                    </div>

                    {(selectedOrder.rating > 0) ? (
                      /* Display Submitted Feedback */
                      <div className="space-y-4">
                        <div className="flex gap-1.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              size={20} 
                              className={`${star <= selectedOrder.rating ? "text-amber-500 fill-amber-500" : "text-gray-300 opacity-20"}`} 
                            />
                          ))}
                        </div>
                        <p className={`text-sm italic p-4 rounded-xl border ${isDark ? "bg-white/5 border-white/5" : "bg-white border-black/5"}`}>
                          "{selectedOrder.feedback || "Verified service with no comments."}"
                        </p>
                        <p className="text-[10px] opacity-40 font-bold uppercase tracking-widest">SUBMITTED ON {new Date(selectedOrder.feedbackDate).toLocaleDateString()}</p>
                      </div>
                    ) : (
                      /* Feedback Form */
                      <form onSubmit={handleFeedbackSubmit} className="space-y-5">
                        <div className="space-y-2">
                          <p className="text-xs font-bold uppercase tracking-wider opacity-50">Rate the Artwork</p>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setRating(star)}
                                className="transition-all transform hover:scale-125 active:scale-90"
                              >
                                <Star 
                                  size={28} 
                                  className={`${star <= rating ? "text-amber-500 fill-amber-500 shadow-lg shadow-amber-500/20" : "text-gray-400 opacity-30"} transition-colors`} 
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-xs font-bold uppercase tracking-wider opacity-50">Your Thoughts</p>
                          <textarea
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            placeholder="Tell us about the detail, the framing, or your overall joy..."
                            className={`w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-amber-500/40 transition-all min-h-[100px] 
                              ${isDark ? "text-white placeholder:text-white/20" : "text-black bg-white border-black/5 placeholder:text-black/20"}`}
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={submittingFeedback}
                          className="w-full bg-amber-500 text-white py-3 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-amber-400 shadow-xl shadow-amber-500/20 transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                          {submittingFeedback ? "SUBMITTING..." : "SUBMIT FEEDBACK"}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              )}

              {/* HELP & SUPPORT */}
              <div className="pt-8 border-t border-white/5 opacity-50 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2 text-xs">
                  <Clock size={14} />
                  <span>Estimated Delivery: 3-5 Business Days after Payment Done</span>
                </div>
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1.5 text-xs hover:text-white transition-colors">
                    <AlertCircle size={14} /> Report Issue
                  </button>
                  <button className="flex items-center gap-1.5 text-xs hover:text-white transition-colors">
                    <ExternalLink size={14} /> Terms of Service
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
