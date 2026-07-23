import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config";
import toast from "react-hot-toast";
import { IndianRupee, CheckCircle, Clock, AlertCircle, Search, Eye, X, CircleCheckBig, Copy, ExternalLink, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Transactions({ isDark }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API_BASE_URL}/api/orders/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        // Sort by newest first
        const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(sorted);
      } else {
        toast.error("Failed to fetch transactions");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching transactions");
    } finally {
      setLoading(false);
    }
  };

  const verifyAdvancePayment = async (id) => {
    setUpdatingId(id);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API_BASE_URL}/api/orders/status/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isAdvancePaid: true }),
      });
      if (res.ok) {
        const data = await res.json();
        const updatedOrder = data.order;
        setOrders(orders.map(o => o._id === id ? updatedOrder : o));
        setSelectedOrder(updatedOrder);
        toast.success("Advance payment verified successfully!");
      } else {
        const errorData = await res.json();
        toast.error(`Error: ${errorData.message || "Failed to verify advance payment"}`);
      }
    } catch (err) {
      console.error("Failed to verify advance payment", err);
      toast.error("Network error: Failed to verify advance payment");
    } finally {
      setUpdatingId(null);
    }
  };

  const verifyBalancePayment = async (id) => {
    setUpdatingId(id);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API_BASE_URL}/api/orders/status/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isFullPaid: true }),
      });
      if (res.ok) {
        const data = await res.json();
        const updatedOrder = data.order;
        setOrders(orders.map(o => o._id === id ? updatedOrder : o));
        setSelectedOrder(updatedOrder);
        toast.success("Balance payment verified successfully!");
      } else {
        const errorData = await res.json();
        toast.error(`Error: ${errorData.message || "Failed to verify balance payment"}`);
      }
    } catch (err) {
      console.error("Failed to verify balance payment", err);
      toast.error("Network error: Failed to verify balance payment");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order._id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 w-full max-w-7xl mx-auto space-y-6" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight" style={{ fontFamily: "Bricolage Grotesque" }}>
            Revenue & Payments
          </h2>
          <p className={`text-[13px] ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            Track all order payments, advances, and pending balances.
          </p>
        </div>
        <div className={`px-4 py-2.5 rounded-xl border flex items-center gap-3 ${isDark ? "bg-[#111] border-white/10" : "bg-emerald-50 border-emerald-100"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDark ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-100 text-emerald-600"}`}>
            <IndianRupee size={16} />
          </div>
          <div>
            <p className={`text-[11px] font-medium uppercase tracking-wider ${isDark ? "text-gray-400" : "text-emerald-700"}`}>Total Revenue</p>
            <p className={`text-lg font-bold leading-tight ${isDark ? "text-white" : "text-emerald-900"}`}>
              ₹{orders.reduce((acc, curr) => acc + (curr.isFullPaid ? curr.totalPrice : (curr.isAdvancePaid ? curr.advanceAmount : 0)), 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTERS BAR */}
      <div className={`p-2.5 rounded-xl border transition-all duration-300 ${isDark ? "bg-white/[0.02] border-white/5 shadow-2xl" : "bg-white border-black/5 shadow-lg"}`}>
        <div className="relative group">
          <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isDark ? "text-gray-500 group-focus-within:text-white" : "text-gray-400 group-focus-within:text-black"}`} size={16} />
          <input
            type="text"
            placeholder="Search by customer name or order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 md:py-2.5 rounded-lg border outline-none transition-all duration-300 text-[13px] ${isDark ? "bg-black border-white/10 text-white focus:border-white/50 focus:bg-white/[0.04]" : "bg-gray-50 border-black/10 text-black focus:border-black/50 focus:bg-white"}`}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-[60vh]">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className={`rounded-2xl border overflow-hidden ${isDark ? "bg-[#0a0a0a] border-white/5" : "bg-white border-black/5 shadow-sm"}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`text-[11px] font-medium uppercase tracking-widest ${isDark ? "bg-white/5 text-gray-400" : "bg-gray-50 text-gray-500 border-b border-black/5"}`}>
                  <th className="px-6 py-4 font-normal">Customer & Order</th>
                  <th className="px-6 py-4 font-normal">Pricing</th>
                  <th className="px-6 py-4 font-normal">Advance Status</th>
                  <th className="px-6 py-4 font-normal">Balance Status</th>
                  <th className="px-6 py-4 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredOrders.map((order) => {
                  const balance = order.totalPrice - order.advanceAmount;
                  
                  return (
                    <tr key={order._id} className={`${isDark ? "hover:bg-white/5" : "hover:bg-gray-50"} transition-colors`}>
                      {/* Customer & Order */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-medium ${isDark ? "bg-white/10 text-white" : "bg-black/5 text-black"}`}>
                            {order.name.charAt(0)}
                          </div>
                          <div>
                            <p className={`text-[14px] font-medium ${isDark ? "text-white" : "text-black"}`}>{order.name}</p>
                            <p className="text-[11px] text-gray-500 font-mono tracking-tighter">#{order._id.slice(-8)}</p>
                          </div>
                        </div>
                      </td>

                      {/* Pricing */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between items-center w-32">
                            <span className="text-[11px] text-gray-500">Total:</span>
                            <span className={`text-[13px] font-medium ${isDark ? "text-white" : "text-black"}`}>₹{order.totalPrice}</span>
                          </div>
                          <div className="flex justify-between items-center w-32">
                            <span className="text-[11px] text-gray-500">Advance:</span>
                            <span className="text-[13px] text-emerald-500 font-medium">₹{order.advanceAmount}</span>
                          </div>
                          <div className="flex justify-between items-center w-32 border-t border-dashed border-gray-500/30 pt-1 mt-1">
                            <span className="text-[11px] text-gray-500">Balance:</span>
                            <span className="text-[13px] text-amber-500 font-medium">₹{balance}</span>
                          </div>
                        </div>
                      </td>

                      {/* Advance Status */}
                      <td className="px-6 py-4">
                        {order.isAdvancePaid ? (
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wide ${isDark ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-emerald-50 text-emerald-700 border border-emerald-200"}`}>
                            <CheckCircle size={12} /> Paid
                          </span>
                        ) : (
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wide ${isDark ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-red-50 text-red-700 border border-red-200"}`}>
                            <AlertCircle size={12} /> Pending
                          </span>
                        )}
                      </td>

                      {/* Balance Status */}
                      <td className="px-6 py-4">
                        {order.isFullPaid ? (
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wide ${isDark ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "bg-blue-50 text-blue-700 border border-blue-200"}`}>
                            <CheckCircle size={12} /> Full Paid
                          </span>
                        ) : (
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wide ${isDark ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>
                            <Clock size={12} /> Pending
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-medium uppercase transition-all ${isDark ? "bg-white/10 hover:bg-white/20 text-white" : "bg-black/5 hover:bg-black/10 text-black"}`}
                        >
                           View Details
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredOrders.length === 0 && !loading && (
              <div className="p-10 text-center text-gray-500 text-sm">
                No transactions found matching your search.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TRANSACTION DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-500">
          <div
            className={`w-full max-w-2xl overflow-hidden rounded-2xl border shadow-[0_0_100px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-500 flex flex-col
              ${isDark ? "bg-[#080808] border-white/10 text-white" : "bg-white border-black/5 text-black"}`}
          >
            {/* Header */}
            <div className={`p-4 md:p-5 flex justify-between items-center border-b transition-all ${isDark ? "bg-white/[0.02] border-white/5" : "bg-neutral-50/80 border-black/5"}`}>
              <div>
                <h2 className="text-md md:text-xl truncate" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>Transaction Details</h2>
                <p className="text-[10px] md:text-xs opacity-40 tracking-wider mt-1" style={{ fontFamily: "'Fira Code', monospace" }} >ORDER ID: #{selectedOrder._id.toUpperCase()}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className={`p-2 hover:scale-110 transition-transform ${isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-black"}`}>
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
              {/* TRANSACTION ID PANEL */}
              <div className={`p-6 rounded-2xl border transition-all duration-500 shadow-xl relative overflow-hidden backdrop-blur-md
                ${(selectedOrder.transactionId || selectedOrder.balanceTransactionId)
                  ? (isDark ? "bg-emerald-950/20 border-emerald-500/20" : "bg-emerald-50/50 border-emerald-200")
                  : (isDark ? "bg-white/5 border-white/10 opacity-30" : "bg-black/5 border-black/10 opacity-30")}`}>

                <div className="relative z-10 space-y-5">
                  {/* ADVANCE ID */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className={`text-[10px] uppercase tracking-wide ${isDark ? "text-white/40" : "text-neutral-500"}`}>
                        01. Advance Payment
                      </span>
                      {selectedOrder.isAdvancePaid ? (
                        <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider flex items-center gap-1 ${isDark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-100 text-emerald-800"}`}>
                          <CircleCheckBig size={10} /> Verified
                        </span>
                      ) : selectedOrder.transactionId ? (
                        <span className="px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider bg-amber-500/10 text-amber-500 flex items-center gap-1">
                          <Clock size={10} className="animate-pulse" /> Pending
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider bg-red-500/10 text-red-500">
                          Awaiting
                        </span>
                      )}
                    </div>

                    {selectedOrder.transactionId ? (
                      <div className="space-y-3">
                        <div className={`p-3 rounded-xl flex items-center justify-between gap-3 text-sm border ${isDark ? "bg-black/40 border-emerald-500/10 text-emerald-300" : "bg-white border-emerald-200 text-emerald-800"}`}>
                          <span className="break-all select-all font-medium tracking-wider">
                            {selectedOrder.transactionId}
                          </span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(selectedOrder.transactionId);
                              toast.success("Advance Transaction ID Copied!");
                            }}
                            className={`p-1.5 rounded-lg transition-all shrink-0 active:scale-95 ${isDark ? "bg-white/5 hover:bg-white/10 text-emerald-400" : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700"}`}
                            title="Copy ID"
                          >
                            <Copy size={16} />
                          </button>
                        </div>

                        {!selectedOrder.isAdvancePaid && (
                          <button
                            onClick={() => verifyAdvancePayment(selectedOrder._id)}
                            disabled={updatingId === selectedOrder._id}
                            className="w-full py-3 rounded-xl uppercase text-xs tracking-wider font-bold transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer disabled:opacity-50"
                          >
                            {updatingId === selectedOrder._id ? <Clock size={14} className="animate-spin" /> : <CircleCheckBig size={14} />} 
                            Verify Advance Payment
                          </button>
                        )}
                      </div>
                    ) : (
                      <p className={`text-xs italic pl-1 ${isDark ? "text-white/30" : "text-neutral-400"}`}>
                        No transaction ID submitted yet.
                      </p>
                    )}
                  </div>

                  {/* BALANCE ID */}
                  {(selectedOrder.isAdvancePaid || selectedOrder.balanceTransactionId) && (
                    <div className={`pt-5 border-t ${isDark ? "border-emerald-500/10" : "border-emerald-200/50"} space-y-2`}>
                      <div className="flex justify-between items-center">
                        <span className={`text-[10px] uppercase tracking-wide ${isDark ? "text-white/40" : "text-neutral-500"}`}>
                          02. Final Balance
                        </span>
                        {selectedOrder.isFullPaid ? (
                          <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider flex items-center gap-1 ${isDark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-100 text-emerald-800"}`}>
                            <CircleCheckBig size={10} /> Verified
                          </span>
                        ) : selectedOrder.balanceTransactionId ? (
                          <span className="px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider bg-amber-500/10 text-amber-500 flex items-center gap-1">
                            <Clock size={10} className="animate-pulse" /> Pending
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider bg-red-500/10 text-red-500">
                            Awaiting
                          </span>
                        )}
                      </div>

                      {selectedOrder.balanceTransactionId ? (
                        <div className="space-y-3">
                          <div className={`p-3 rounded-xl flex items-center justify-between gap-3 text-sm border ${isDark ? "bg-black/40 border-emerald-500/10 text-emerald-300" : "bg-white border-emerald-200 text-emerald-800"}`}>
                            <span className="break-all select-all font-medium tracking-wider">
                              {selectedOrder.balanceTransactionId}
                            </span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(selectedOrder.balanceTransactionId);
                                toast.success("Balance Transaction ID Copied!");
                              }}
                              className={`p-1.5 rounded-lg transition-all shrink-0 active:scale-95 ${isDark ? "bg-white/5 hover:bg-white/10 text-emerald-400" : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700"}`}
                              title="Copy ID"
                            >
                              <Copy size={16} />
                            </button>
                          </div>

                          {!selectedOrder.isFullPaid && (
                            <button
                              onClick={() => verifyBalancePayment(selectedOrder._id)}
                              disabled={updatingId === selectedOrder._id}
                              className="w-full py-3 rounded-xl uppercase text-xs tracking-wider font-bold transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
                            >
                              {updatingId === selectedOrder._id ? <Clock size={14} className="animate-spin" /> : <CircleCheckBig size={14} />} 
                              Verify Balance Payment
                            </button>
                          )}
                        </div>
                      ) : (
                        <p className={`text-xs italic pl-1 ${isDark ? "text-white/30" : "text-neutral-400"}`}>
                          No transaction ID submitted yet.
                        </p>
                      )}
                    </div>
                  )}
                </div>
                {(selectedOrder.transactionId || selectedOrder.balanceTransactionId) && (
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500/10 blur-[60px] rounded-full pointer-events-none"></div>
                )}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => navigate(`/admin/userOrders`)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium uppercase transition-all border
                    ${isDark ? "bg-white/10 border-white/20 hover:bg-white/20 text-white" : "bg-black/5 border-black/10 hover:bg-black/10 text-black"}`}
                >
                  Go to Orders Page <ArrowRight size={14} />
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

