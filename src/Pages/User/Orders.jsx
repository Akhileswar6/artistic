import { ShoppingBag, ArrowRight, Package, Clock, CheckCircle2, CheckCircle, ChevronRight, IndianRupee, X, Check, Copy, AlertCircle, ExternalLink, MapPin, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
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
    <div className={`min-h-screen pt-12 pb-24 px-6 transition-colors duration-300 ${isDark ? "bg-[#0b0c10] text-white" : "bg-gray-50 text-black"}`} style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
                My Orders
              </h1>
              {loading && <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin opacity-50"></div>}
            </div>
            <p className={`text-xs md:text-sm mt-1 opacity-50`}>Track and manage your recent commissions</p>
          </div>

          <button
            onClick={() => navigate("/order")}
            className={`w-full md:w-auto px-4 py-3 md:py-2 rounded-lg  text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${isDark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-neutral-800"
              }`}
          >
            New Commission
            <ArrowRight size={16} />
          </button>
        </div>

        {loading ? (
          <div className="grid gap-6">
            <OrderSkeleton />
            <OrderSkeleton />
            <OrderSkeleton />
          </div>
        ) : orders.length > 0 ? (
          <div className="grid gap-6">
            {orders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              return (
                <div
                  key={order._id}
                  className={`group rounded-2xl p-4 border transition-all duration-500 hover:shadow-2xl  ${isDark
                    ? "bg-[#111111] border-white/5 hover:border-white/10 "
                    : "bg-white border-black/5 hover:border-black/15 shadow-lg "
                    }`}
                >
                  <div className="flex flex-col md:flex-row gap-5 items-center">
                    {/* Compact Image Preview */}
                    <div className="w-full md:w-32 h-32 rounded-lg overflow-hidden shrink-0 border border-white/5 shadow-xl relative group-hover:scale-105 transition-transform duration-500">
                      <OptimizedImage src={order.photo} alt="Commission" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>

                    <div className="flex-1 w-full space-y-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-3">
                            <h3 className="font-bold text-[17px]" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
                              {order.artStyle.charAt(0).toUpperCase() + order.artStyle.slice(1)} Portrait
                            </h3>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusInfo.color.replace('bg-', 'bg-opacity-10 border-').replace('/10', '/20')
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
                          onClick={() => navigate(`/orders/${order._id}`)}
                          className={`group/btn flex items-center gap-2 text-[13px]  cursor-pointer transition-all px-3 py-1.5 rounded-lg ${isDark
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
          <div className={`min-h-[400px] flex flex-col items-center justify-center rounded-[32px] border border-dashed transition-all duration-300 ${isDark ? "bg-[#111111] border-white/10" : "bg-white border-black/10"
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
              <h4 className="text-md" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>{item.title}</h4>
              <p className="text-[12px] opacity-40 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
