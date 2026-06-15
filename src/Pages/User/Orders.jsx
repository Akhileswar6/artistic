import { ShoppingBag, ArrowRight, Package, Clock, CheckCircle2, CheckCircle, ChevronRight, IndianRupee, X, Check, Copy, AlertCircle, ExternalLink, MapPin, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config";

import axios from "axios";
import toast from "react-hot-toast";
import { OrderSkeleton } from "../../Components/Skeleton";
import OptimizedImage from "../../Components/OptimizedImage";

export default function Orders({ isDark }) {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }
      const response = await axios.get(`${API_BASE_URL}/api/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("loginTimestamp");
        toast.error("Session expired. Please sign in again.");
        navigate("/");
        window.location.reload();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

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

  return (
    <div className={`min-h-screen pt-24 md:pt-32 pb-24 px-4 md:px-6 transition-colors duration-300 ${isDark ? "bg-[#0a0a0b] text-white" : "bg-[#f8f9fa] text-black"}`} style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">

        {/* Premium Coloured Header Section */}
        <div className={`p-6 md:p-8 rounded-2xl md:rounded-3xl border relative overflow-hidden transition-all shadow-lg ${isDark ? "bg-purple-950/10 border-purple-500/10" : "bg-purple-50/50 border-purple-100"}`}>
          {/* Subtle Background Glows */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/5 blur-[80px] rounded-full pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-fuchsia-500/5 blur-[80px] rounded-full pointer-events-none"></div>

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="text-left space-y-2">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 md:p-3 rounded-[14px] flex items-center justify-center relative overflow-hidden backdrop-blur-xl border ${isDark ? "bg-purple-900/40 border-purple-400/20 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.1)]" : "bg-white/80 border-purple-200 text-purple-600 shadow-md"}`}>
                  <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50"></div>
                  <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
                  <ShoppingBag size={24} strokeWidth={2.5} className="relative z-10" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
                  My Orders
                </h1>
                {loading && <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin opacity-50"></div>}
              </div>
              <p className={`text-xs md:text-sm opacity-60 ml-12 md:ml-14`}>Track and manage your recent commissions</p>
            </div>

            <button
              onClick={() => navigate("/order")}
              className={`w-full sm:w-auto px-5 py-3 md:py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer backdrop-blur-xl border ${isDark ? "bg-white/[0.05] border-white/10 text-white hover:bg-white/[0.08] hover:border-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.03)]" : "bg-white/60 border-white/80 text-purple-800 shadow-[0_8px_32px_rgba(168,85,247,0.1)] hover:bg-white/90"}`}
            >
              New Order
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4 md:gap-6">
            <OrderSkeleton />
            <OrderSkeleton />
            <OrderSkeleton />
          </div>
        ) : orders.length > 0 ? (
          <div className="grid gap-6 md:gap-8">
            {orders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              return (
                <div
                  key={order._id}
                  className={`group relative overflow-hidden rounded-2xl p-5 md:p-6 border transition-all duration-500 backdrop-blur-2xl ${isDark
                    ? "bg-white/[0.03] border-white/10"
                    : "bg-white/60 border-white/80 shadow-lg"
                    }`}
                >
                  <div className={`absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent ${isDark ? 'via-white/20' : 'via-white/80'} to-transparent opacity-50`}></div>
                  <div className={`absolute inset-0 bg-gradient-to-b ${isDark ? 'from-white/5' : 'from-white/40'} to-transparent pointer-events-none`}></div>

                  <div className="relative z-10 flex flex-col sm:flex-row gap-5 md:gap-6 items-start sm:items-center">
                    {/* Compact Image Preview */}
                    <div className="w-full sm:w-32 md:w-36 h-48 sm:h-32 md:h-36 rounded-xl overflow-hidden shrink-0 border border-white/5 shadow-xl relative group-hover:scale-[1.02] transition-transform duration-500">
                      <OptimizedImage src={order.photo} alt="Commission" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>

                    <div className="flex-1 w-full space-y-3 md:space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-3">
                            <h3 className="text-base md:text-[17px]" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
                              {order.artStyle.charAt(0).toUpperCase() + order.artStyle.slice(1)} Portrait
                            </h3>
                            <span className={`px-2.5 py-1 rounded-full text-[9px] md:text-[10px]  uppercase tracking-wider ${statusInfo.color}`}>
                              {statusInfo.label}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 md:gap-4 opacity-40">
                            <p className="text-[12px] md:text-[13px] flex items-center gap-1.5 ">
                              <Clock size={12} /> {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </p>
                            <div className="hidden md:block w-1 h-1 rounded-full bg-current opacity-30"></div>
                            <p className="text-[12px] md:text-[13px] flex items-center gap-1.5 ">
                              <Package size={12} /> #{order._id.slice(-6).toUpperCase()}
                            </p>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
                          <div className="flex items-center gap-1.5">
                            <IndianRupee size={16} className={isDark ? "text-emerald-400" : "text-emerald-600"} strokeWidth={2.5} />
                            <span className={`text-base md:text-lg font-bold tracking-tight ${isDark ? "text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300" : "text-emerald-700"}`} style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
                              {order.totalPrice.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end pt-2 border-t border-white/5">
                        <button
                          onClick={() => navigate(`/orders/${order._id}`)}
                          className={`group/btn flex items-center gap-2 text-[12px] md:text-[13px] font-medium cursor-pointer transition-all px-3 py-1.5 rounded-lg ${isDark
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
          <div className={`min-h-[350px] md:min-h-[400px] flex flex-col items-center justify-center rounded-2xl md:rounded-[32px] border border-dashed transition-all duration-300 ${isDark ? "bg-[#111111] border-white/10" : "bg-white border-black/10"
            }`}>
            <div className="text-center space-y-6 max-w-sm px-6">
              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto rounded-full flex items-center justify-center mb-4 md:mb-6">
                <ShoppingBag size={32} className="opacity-20" />
              </div>

              <div className="space-y-2">
                <h2 className="text-lg md:text-xl font-bold" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>No orders found</h2>
                <p className="text-xs md:text-sm opacity-50 leading-relaxed">
                  It looks like you haven't placed any orders yet. Start exploring our gallery to find something you love!
                </p>
              </div>

              <button
                onClick={() => navigate("/order")}
                className={`inline-flex items-center gap-2 text-xs md:text-sm  transition-colors ${isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"
                  }`}
              >
                <Package size={18} />
                Place your first order
              </button>
            </div>
          </div>
        )}



      </div>
    </div>
  );
}
