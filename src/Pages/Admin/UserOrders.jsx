import { useState, useEffect } from "react";
import { API_BASE_URL } from "../../config";

import AdminLayout from "../../Layout/AdminLayout";
import { Copy, CopyPlus, MoreVertical, Trash2, CheckCircle, CheckCircle2, Clock, X, Eye, MapPin, IndianRupee, ExternalLink, ShoppingBag, Download, Search, Filter, ChevronDown, Star, XCircle, CircleCheckBig } from "lucide-react";
import toast from "react-hot-toast";

const getStatusIcon = (status) => {
  switch (status) {
    case "pending": return <Clock size={12} />;
    case "accepted": return <CheckCircle size={12} className="text-blue-500" />;
    case "payment_done": return <IndianRupee size={12} className="text-indigo-500" />;
    case "in_progress": return <CopyPlus size={12} className="text-purple-500" />;
    case "completed": return <CheckCircle size={12} className="text-emerald-500" />;
    case "out_for_delivery": return <Clock size={12} className="text-sky-500" />;
    case "delivered": return <CheckCircle size={12} className="text-green-500" />;
    case "cancelled": return <XCircle size={12} className="text-red-500" />;
    default: return null;
  }
};

const getStatusBadgeClass = (status) => {
  const base = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase border transition-all duration-300 ";
  switch (status) {
    case "pending": return base + "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    case "accepted": return base + "bg-blue-500/10 text-blue-500 border-blue-500/20 ";
    case "payment_done": return base + "bg-indigo-500/10 text-indigo-500 border-indigo-500/20 ";
    case "in_progress": return base + "bg-purple-500/10 text-purple-500 border-purple-500/20 ";
    case "completed": return base + "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 ";
    case "out_for_delivery": return base + "bg-sky-500/10 text-sky-500 border-sky-500/20 ";
    case "delivered": return base + "bg-green-500/10 text-green-500 border-green-500/20 ";
    case "cancelled": return base + "bg-red-500/10 text-red-500 border-red-500/20";
    default: return base + "bg-gray-500/10 text-gray-500 border-gray-500/20";
  }
};

const StatusDropdown = ({ currentStatus, onStatusChange, isDark, disabled, position = "bottom" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useState(null)[0]; // We'll use event target instead for simplicity in this one-off

  const statuses = [
    { value: "pending", label: "Pending", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
    { value: "accepted", label: "Accepted", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
    { value: "payment_done", label: "Payment Verified", color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20" },
    { value: "in_progress", label: "In Progress", color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
    { value: "completed", label: "Completed", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
    { value: "out_for_delivery", label: "Out For Delivery", color: "bg-sky-500/10 text-sky-500 border-sky-500/20" },
    { value: "delivered", label: "Delivered", color: "bg-green-500/10 text-green-500 border-green-500/20" },
    { value: "cancelled", label: "Cancelled", color: "bg-red-500/10 text-red-500 border-red-500/20" },
  ];

  const currentStatusObj = statuses.find(s => s.value === currentStatus) || statuses[0];

  const handleToggle = (e) => {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
      bottom: rect.bottom + window.scrollY
    });
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        disabled={disabled}
        className={`flex items-center justify-between gap-1.5 px-2 py-0.5 md:px-2.5 md:py-1 rounded-full border text-[8px] md:text-[9px] font-normal transition-all cursor-pointer min-w-[110px] md:min-w-[125px] shadow-sm uppercase tracking-wider
          ${currentStatusObj.color} 
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <div className="flex items-center gap-1 truncate">
          <div className="flex-shrink-0">{getStatusIcon(currentStatus)}</div>
          <span className="truncate">{currentStatusObj.label}</span>
        </div>
        <ChevronDown size={10} className={`transition-transform duration-300 flex-shrink-0 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-[100]" onClick={() => setIsOpen(false)}></div>
          <div
            style={{
              position: 'fixed',
              top: position === 'top' ? 'auto' : `${coords.bottom + 8 - window.scrollY}px`,
              bottom: position === 'top' ? `${window.innerHeight - (coords.top - 8) + window.scrollY}px` : 'auto',
              left: `${coords.left - window.scrollX}px`,
              minWidth: `${coords.width}px`
            }}
            className={`z-[110] w-max p-1.5 rounded-xl border shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-3xl animate-in fade-in slide-in-from-bottom-2 duration-200
              ${isDark ? "bg-[#111] border-white/20" : "bg-white border-black/10 text-black"}`}
          >
            <div className="max-h-[300px] overflow-y-auto no-scrollbar">
              {statuses.map((status) => (
                <button
                  key={status.value}
                  onClick={() => {
                    onStatusChange(status.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-[11px] font-medium uppercase tracking-wider transition-all mb-1 last:mb-0 cursor-pointer flex items-center justify-between gap-4
                    ${currentStatus === status.value
                      ? status.color
                      : (isDark ? "hover:bg-white/5 text-gray-400 hover:text-white" : "hover:bg-black/5 text-gray-600 hover:text-black")}`}
                >
                  {status.label}
                  {currentStatus === status.value && <CheckCircle size={12} />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default function UserOrders({ isDark }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [styleFilter, setStyleFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState([]);
  const [openStatusFilter, setOpenStatusFilter] = useState(false);
  const [openStyleFilter, setOpenStyleFilter] = useState(false);

  const handleDownload = async (imageUrl, orderId) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `order_${orderId || 'image'}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Download started!");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download image. Try opening it in a new tab.");
    }
  };

  const handleBulkStatusUpdate = async (newStatus) => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Update ${selectedIds.length} orders to ${newStatus}?`)) return;

    setLoading(true);
    let successCount = 0;
    try {
      const token = localStorage.getItem("adminToken");
      // For now, we loop through and update each one. 
      // In a production app, we'd add a bulk endpoint on the backend.
      for (const id of selectedIds) {
        const res = await fetch(`${API_BASE_URL}/api/orders/status/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        });
        if (res.ok) successCount++;
      }

      toast.success(`Successfully updated ${successCount} orders!`);
      await fetchOrders();
      setSelectedIds([]);
    } catch (err) {
      toast.error("Something went wrong during bulk update.");
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ["Order ID", "Customer", "Email", "Style", "Price", "Status", "Date"];
    const rows = filteredOrders.map(o => [
      o._id,
      o.name,
      o.email,
      o.artStyle,
      o.totalPrice,
      o.status,
      new Date(o.createdAt).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `artistic_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV Export Successful!");
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API_BASE_URL}/api/orders/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(sortedData);
      } else {
        setError(data.message || "Failed to fetch orders");
      }
    } catch (err) {
      setError("Server error while fetching orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API_BASE_URL}/api/orders/status/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders(orders.map(o => o._id === id ? {
          ...o,
          status: newStatus,
          isAdvancePaid: ['payment_done', 'out_for_delivery', 'delivered'].includes(newStatus) ? true : o.isAdvancePaid,
          isFullPaid: ['out_for_delivery', 'delivered'].includes(newStatus) ? true : o.isFullPaid
        } : o));

        if (selectedOrder && selectedOrder._id === id) {
          setSelectedOrder({
            ...selectedOrder,
            status: newStatus,
            isAdvancePaid: ['payment_done', 'out_for_delivery', 'delivered'].includes(newStatus) ? true : selectedOrder.isAdvancePaid,
            isFullPaid: ['out_for_delivery', 'delivered'].includes(newStatus) ? true : selectedOrder.isFullPaid
          });
        }
      } else {
        const errorData = await res.json();
        toast.error(`Error: ${errorData.message || "Failed to update status"}`);
      }
    } catch (err) {
      console.error("Failed to update status");
      toast.error("Network error: Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteOrder = async (id) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-xs font-medium">Delete this order forever?</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const token = localStorage.getItem("adminToken");
                const res = await fetch(`${API_BASE_URL}/api/orders/${id}`, {
                  method: "DELETE",
                  headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                  setOrders(orders.filter(o => o._id !== id));
                  if (selectedOrder && selectedOrder._id === id) setSelectedOrder(null);
                  toast.success("Order deleted successfully");
                } else {
                  toast.error("Failed to delete order");
                }
              } catch (err) {
                toast.error("An error occurred");
                console.error("Failed to delete order", err);
              }
            }}
            className="px-3 py-1 bg-red-500 text-white rounded text-[10px] font-bold uppercase tracking-wider"
          >
            Confirm
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 bg-neutral-200 text-black rounded text-[10px] font-bold uppercase tracking-wider"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 4000, position: 'top-center' });
  };



  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order._id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesStyle = styleFilter === "all" || order.artStyle === styleFilter;

    return matchesSearch && matchesStatus && matchesStyle;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, styleFilter]);

  const ordersPerPage = 20;
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  return (
    <div style={{ fontFamily: "Inter, sans-serif" }} className="animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Header */}
      <div className={`mb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 rounded-2xl transition-all duration-300
          ${isDark ? "bg-white/[0.03] border border-white/5" : "bg-white border border-black/5 shadow-sm"}`}>
        <div>
          <h1 className={`text-lg md:text-xl ${isDark ? "text-white" : "text-black"}`} style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
            Order Management
          </h1>
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            onClick={fetchOrders}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] uppercase transition-all duration-300 transform active:scale-95 shadow-sm cursor-pointer
              ${isDark
                ? "bg-white text-black hover:bg-gray-100"
                : "bg-black text-white hover:bg-neutral-800"}`}>
            <Clock size={12} className={loading ? "animate-spin" : ""} />
            <span className="whitespace-nowrap">Refresh Pipeline</span>
          </button>

          <button
            onClick={exportToCSV}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] uppercase transition-all duration-300 transform active:scale-95 shadow-sm cursor-pointer
              ${isDark
                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white"
                : "bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-600 hover:text-white"}`}>
            <Download size={12} />
            <span className="whitespace-nowrap">Export CSV</span>
          </button>
        </div>
      </div>

      {/* SEARCH AND FILTERS BAR */}
      <div className={`mb-4 p-2.5 rounded-xl border transition-all duration-300 ${isDark ? "bg-white/[0.02] border-white/5 shadow-2xl" : "bg-white border-black/5 shadow-lg"
        }`}>
        <div className="flex flex-col lg:flex-row gap-2.5">
          {/* SEARCH */}
          <div className="relative flex-1 group">
            <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isDark ? "text-gray-500 group-focus-within:text-white" : "text-gray-400 group-focus-within:text-black"
              }`} size={16} />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 md:py-2.5 rounded-lg border outline-none transition-all duration-300 text-[13px] ${isDark
                  ? "bg-black border-white/10 text-white focus:border-white/50 focus:bg-white/[0.04]"
                  : "bg-gray-50 border-black/10 text-black focus:border-black/50 focus:bg-white"
                }`}
            />
          </div>

          {/* FILTERS */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            {/* Status Filter */}
            <div className="relative w-full min-w-[145px]">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenStatusFilter((prev) => !prev);
                  setOpenStyleFilter(false); // close other
                }}
                className={`w-full px-2.5 py-1.5 rounded-lg text-[11px] flex justify-between items-center transition-all border cursor-pointer
                  ${isDark
                    ? "bg-[#0a0a0a] text-white border-white/10 hover:bg-white/5"
                    : "bg-white text-black border-black/10 hover:bg-gray-50 shadow-sm"}`}
              >
                <div className="flex items-center gap-1.5">
                  <Filter size={12} className="opacity-70" />
                  <span>
                    {statusFilter === "all" && "All Statuses"}
                    {statusFilter === "pending" && "Pending"}
                    {statusFilter === "accepted" && "Accepted"}
                    {statusFilter === "payment_done" && "Payment Verified"}
                    {statusFilter === "in_progress" && "In Progress"}
                    {statusFilter === "completed" && "Completed"}
                    {statusFilter === "out_for_delivery" && "Out for Delivery"}
                    {statusFilter === "delivered" && "Delivered"}
                    {statusFilter === "cancelled" && "Cancelled"}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 opacity-50 ml-1" />
              </button>

              {openStatusFilter && (
                <div className={`absolute mt-1.5 w-full rounded-lg shadow-2xl z-50 text-[12px] border overflow-hidden
                  ${isDark ? "bg-[#0a0a0a] border-white/10" : "bg-white shadow-xl border-black/10"}`}>
                  {[
                    { label: "All Statuses", value: "all" },
                    { label: "Pending", value: "pending" },
                    { label: "Accepted", value: "accepted" },
                    { label: "Payment Verified", value: "payment_done" },
                    { label: "In Progress", value: "in_progress" },
                    { label: "Completed", value: "completed" },
                    { label: "Out for Delivery", value: "out_for_delivery" },
                    { label: "Delivered", value: "delivered" },
                    { label: "Cancelled", value: "cancelled" },
                  ].map((item) => (
                    <div
                      key={item.value}
                      onClick={() => {
                        setStatusFilter(item.value);
                        setOpenStatusFilter(false);
                      }}
                      className={`flex justify-between items-center px-4 py-2.5 cursor-pointer transition-colors
                        ${isDark
                          ? "hover:bg-white/10 text-gray-200"
                          : "hover:bg-black/5 text-gray-800"}`}
                    >
                      <span className="font-medium text-[12px]">{item.label}</span>
                      {statusFilter === item.value && (
                        <CheckCircle2 className={`w-4 h-4 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Style Filter */}
            <div className="relative w-full min-w-[130px]">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenStyleFilter((prev) => !prev);
                  setOpenStatusFilter(false); // close other
                }}
                className={`w-full px-2.5 py-1.5 rounded-lg text-[11px] flex justify-between items-center transition-all border cursor-pointer
                  ${isDark
                    ? "bg-[#0a0a0a] text-white border-white/10 hover:bg-white/5"
                    : "bg-white text-black border-black/10 hover:bg-gray-50 shadow-sm"}`}
              >
                <div className="flex items-center gap-1.5">
                  <ShoppingBag size={12} className="opacity-70" />
                  <span>
                    {styleFilter === "all" && "All Styles"}
                    {styleFilter === "realistic" && "Realistic"}
                    {styleFilter === "charcoal" && "Charcoal"}
                    {styleFilter === "pencil" && "Pencil"}
                    {styleFilter === "color" && "Color"}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 opacity-50 ml-1" />
              </button>

              {openStyleFilter && (
                <div className={`absolute mt-1.5 w-full rounded-lg shadow-2xl z-50 text-[12px] border overflow-hidden
                  ${isDark ? "bg-[#0a0a0a] border-white/10" : "bg-white shadow-xl border-black/10"}`}>
                  {[
                    { label: "All Styles", value: "all" },
                    { label: "Realistic", value: "realistic" },
                    { label: "Charcoal", value: "charcoal" },
                    { label: "Pencil", value: "pencil" },
                    { label: "Color", value: "color" },
                  ].map((item) => (
                    <div
                      key={item.value}
                      onClick={() => {
                        setStyleFilter(item.value);
                        setOpenStyleFilter(false);
                      }}
                      className={`flex justify-between items-center px-4 py-2.5 cursor-pointer transition-colors
                        ${isDark
                          ? "hover:bg-white/10 text-gray-200"
                          : "hover:bg-black/5 text-gray-800"}`}
                    >
                      <span className="font-medium">{item.label}</span>
                      {styleFilter === item.value && (
                        <CheckCircle2 className={`w-4 h-4 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Card Container */}
      <div className={`rounded-2xl shadow-2xl border transition-all duration-500
          ${isDark
          ? "bg-[#0a0a0a] border-white/10"
          : "bg-white border-black/5"}`}>

        {/* Mobile View: Order Cards */}
        <div className="grid grid-cols-1 gap-4 p-4 lg:hidden">
          {loading ? (
            <div className="py-20 text-center text-gray-500 col-span-full">
              <div className="flex flex-col items-center gap-4">
                <div className={`w-10 h-10 border-4 border-t-transparent ${isDark ? "border-white" : "border-black"} rounded-full animate-spin `}></div>
                <p className="text-lg animate-pulse">Syncing orders...</p>
              </div>
            </div>
          ) : currentOrders.length === 0 ? (
            <div className="py-20 text-center col-span-full">
              <div className="flex flex-col items-center gap-3 opacity-30">
                <ShoppingBag size={64} className="mb-2" />
                <p className="text-xl font-bold">No orders match your filters</p>
              </div>
            </div>
          ) : (
            currentOrders.map((order) => (
              <div
                key={order._id}
                className={`p-4 rounded-xl border flex flex-col gap-3.5 transition-all duration-300
                  ${selectedIds.includes(order._id) ? (isDark ? "bg-orange-500/5 border-orange-500/30" : "bg-orange-50 border-orange-200") : (isDark ? "bg-white/[0.02] border-white/5" : "bg-gray-50 border-black/5")}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      className={`w-4 h-4 rounded border-gray-300 ${isDark ? "text-white focus:ring-white" : "text-black focus:ring-black"} cursor-pointer`}
                      checked={selectedIds.includes(order._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds([...selectedIds, order._id]);
                        } else {
                          setSelectedIds(selectedIds.filter(id => id !== order._id));
                        }
                      }}
                    />
                    <div className="flex flex-col">
                      <span className={`font-normal text-[13px] ${isDark ? "text-white" : "text-neutral-900"}`}>{order.name}</span>
                      <span className={`text-[11px] opacity-50`}>{order.email}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`font-normal text-[14px] ${isDark ? "text-white" : "text-black"}`}>₹{order.totalPrice.toLocaleString()}</span>
                    <span className="text-[9px] opacity-40 uppercase">#{order._id.slice(-6)}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className={`px-2 py-0.5 rounded-md text-[9px] uppercase border ${isDark ? "bg-white/5 border-white/10 text-gray-300" : "bg-black/5 border-black/10 text-gray-600"}`}>
                    {order.artStyle}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2.5 border-t border-dashed border-gray-500/20">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] opacity-40 uppercase">
                      Ordered {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <StatusDropdown
                    currentStatus={order.status}
                    onStatusChange={(newStatus) => updateStatus(order._id, newStatus)}
                    isDark={isDark}
                    disabled={updatingId === order._id}
                    position="top"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${isDark ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "bg-blue-50 text-blue-600 border border-blue-100"}`}>
                    <Eye size={14} /> View
                  </button>
                  <button
                    onClick={() => deleteOrder(order._id)}
                    className={`px-3 flex items-center justify-center rounded-lg transition-all ${isDark ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-red-50 text-red-600 border border-red-100"}`}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-sm border-collapse">

            {/* Header */}
            <thead>
              <tr className={`${isDark ? "bg-white/5 text-gray-400 border-b border-white/10" : "bg-gray-200 text-black border-b border-black/10"}`}>
                <th className="px-5 py-3.5 w-10">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                    checked={selectedIds.length === filteredOrders.length && filteredOrders.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIds(filteredOrders.map(o => o._id));
                      } else {
                        setSelectedIds([]);
                      }
                    }}
                  />
                </th>
                <th className="px-5 py-3.5 font-normal text-left text-[11px] uppercase tracking-wider">Customer</th>
                <th className="px-5 py-3.5 font-normal text-left text-[11px] uppercase tracking-wider">Commission Type</th>
                <th className="px-5 py-3.5 font-normal text-left text-[11px] uppercase tracking-wider">Pricing</th>
                <th className="px-5 py-3.5 font-normal text-center text-[11px] uppercase tracking-wider">Status Flow</th>
                <th className="px-5 py-3.5 font-normal text-center text-[11px] uppercase tracking-wider">Received</th>
                <th className="px-5 py-3.5 font-normal text-right text-[11px] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-5 py-20 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-4">
                      <div className={`w-10 h-10 border-4 border-t-transparent ${isDark ? "border-white" : "border-black"} rounded-full animate-spin `}></div>
                      <p className="text-lg animate-pulse">Syncing orders...</p>
                    </div>
                  </td>
                </tr>
              ) : currentOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-5 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-30">
                      <ShoppingBag size={64} className="mb-2" />
                      <p className="text-xl font-bold">No orders match your filters</p>
                    </div>
                  </td>
                </tr>
              ) : currentOrders.map((order) => (
                <tr
                  key={order._id}
                  className={`group transition-all duration-300 relative hover:z-20
                      ${selectedIds.includes(order._id) ? (isDark ? "bg-orange-500/5 hover:bg-orange-500/10" : "bg-orange-50 hover:bg-orange-100") : ""}
                      ${isDark
                      ? "hover:bg-white/[0.03]"
                      : "hover:bg-black/[0.02] shadow-sm"}`}
                >
                  <td className="px-5 py-3.5">
                    <input
                      type="checkbox"
                      className={`w-4 h-4 rounded border-gray-300 ${isDark ? "text-white focus:ring-white" : "text-black focus:ring-black"} cursor-pointer`}
                      checked={selectedIds.includes(order._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds([...selectedIds, order._id]);
                        } else {
                          setSelectedIds(selectedIds.filter(id => id !== order._id));
                        }
                      }}
                    />
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${isDark ? "bg-white/5 text-white" : "bg-black/5 text-black"}`}>
                        {order.name.charAt(0)}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className={`text-[13px]  truncate ${isDark ? "text-white" : "text-neutral-900"}`}>{order.name}</span>
                        <span className={`text-[11px] font-medium opacity-50 truncate`}>{order.email}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-3.5">
                    <div className="flex flex-col gap-1.5">
                      <span className={`px-2 py-0.5 w-fit rounded-md text-[9px] uppercase border transition-all ${isDark ? "bg-white/5 border-white/10 text-gray-300 group-hover:bg-white/10" : "bg-black/5 border-black/10 text-gray-600 group-hover:bg-black/10"}`}>
                        {order.artStyle}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-3.5">
                    <div className="flex flex-col items-start">
                      <span className={`text-[13px] ${isDark ? "text-white" : "text-black"}`}>
                        ₹{order.totalPrice.toLocaleString()}
                      </span>
                      <span className="text-[9px] opacity-60 uppercase">Advance: ₹{order.advanceAmount}</span>
                      {((order.transactionId && !order.isAdvancePaid) || (order.balanceTransactionId && !order.isFullPaid)) && (
                        <span className="px-1.5 py-0.5 mt-0.5 bg-blue-500/10 text-blue-500 text-[8px] font-bold uppercase rounded-full border border-blue-500/20 animate-pulse">Pay Verify</span>
                      )}
                    </div>
                  </td>

                  {/* STATUS BADGE & CHANGER */}
                  <td className="px-5 py-3.5 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <StatusDropdown
                        currentStatus={order.status}
                        onStatusChange={(newStatus) => updateStatus(order._id, newStatus)}
                        isDark={isDark}
                        disabled={updatingId === order._id}
                        position="top"
                      />
                    </div>
                  </td>

                  <td className="px-5 py-3.5 text-center">
                    <div className="flex flex-col">
                      <span className={`text-[12px] ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                        {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                      </span>
                      <span className="text-[10px] opacity-30 font-medium">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex justify-end gap-2 transition-all duration-300">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        title="View Details"
                        className={`p-2 transition-all hover:scale-110 ${isDark ? " text-blue-400 hover:text-blue-500 " : " text-blue-600 hover:text-blue-700"}`}>
                        <Eye size={17} />
                      </button>
                      <button
                        onClick={() => deleteOrder(order._id)}
                        title="Archive Order"
                        className={`p-2 rounded-lg transition-all hover:scale-110 active:scale-90 ${isDark ? " text-red-400 hover:text-red-500 " : " text-red-600 hover:text-red-600 "}`}>
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {/* Pagination */}
        <div className={`flex justify-between items-center px-4 py-2.5 border-t 
          ${isDark ? "border-white/10" : "border-black/5"}`}>
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1.5 text-xs rounded-lg transition-all border
              ${isDark ? "bg-white/5 text-white border-white/10 hover:bg-white/10" : "bg-white text-black border-black/10 hover:bg-gray-100 shadow-sm"} 
              disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            Previous
          </button>
          <span className={`text-[11px] font-medium px-3 py-1 rounded-md ${isDark ? "bg-white/5 text-gray-400" : "bg-black/5 text-gray-600"}`}>
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1.5 text-xs rounded-lg transition-all border
              ${isDark ? "bg-white/5 text-white border-white/10 hover:bg-white/10" : "bg-white text-black border-black/10 hover:bg-gray-100 shadow-sm"} 
              disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            Next
          </button>
        </div>
      </div>

      {/* DETAIL AUDIT MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-500">
          <div
            className={`w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-2xl border shadow-[0_0_100px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-500 flex flex-col
              ${isDark ? "bg-[#080808] border-white/10 text-white" : "bg-white border-black/5 text-black"}`}
          >
            {/* Header */}
            <div className={`p-4 md:p-5 flex justify-between items-center border-b transition-all ${isDark ? "bg-white/[0.02] border-white/5" : "bg-neutral-50/80 border-black/5"}`}>
              <div className="flex items-center gap-4 overflow-hidden">
                <div className="overflow-hidden">
                  <h2 className="text-md md:text-xl truncate" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>Order Details</h2>
                  <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 mt-1">
                    <p className="text-[10px] md:text-xs opacity-40 tracking-wider" style={{ fontFamily: "'Fira Code', monospace" }} >ORDER ID: #{selectedOrder._id.toUpperCase()}</p>
                    <div className="hidden md:flex items-center gap-1.5 opacity-50">
                      <span className="text-xs tracking-wider">|</span>
                      <span className="text-xs tracking-wider">
                        Ordered on {new Date(selectedOrder.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className={`p-2 md:p-3 hover:scale-110 transition-transform ${isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-black"}`}>
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">

                {/* Left: General Info (8 cols) */}
                <div className="lg:col-span-7 space-y-12">

                  {/* Status & Quick Actions */}
                  <div className={`p-6 rounded-lg border ${isDark ? "bg-white/[0.02] border-white/5" : "bg-neutral-50 border-black/5"}`}>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-[12px]  uppercase opacity-30">Current Lifecycle Stage</h3>
                      <span className={getStatusBadgeClass(selectedOrder.status)}>
                        {selectedOrder.status.replaceAll('_', ' ')}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["pending", "accepted", "payment_done", "in_progress", "completed", "out_for_delivery", "delivered", "cancelled"].map(s => (
                        <button
                          key={s}
                          onClick={() => updateStatus(selectedOrder._id, s)}
                          className={`px-3 py-2 rounded-lg text-[10px] uppercase transition-all
                             ${selectedOrder.status === s
                              ? (isDark ? "bg-white text-black" : "bg-black text-white")
                              : isDark ? "bg-white/5 hover:bg-white/10 text-gray-400" : "bg-black/5 hover:bg-black/10 text-gray-600"}`}
                        >
                          {s.replaceAll('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Data Sections */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10">
                    <section>
                      <h4 className="text-[12px] uppercase mb-4">Customer Profile</h4>
                      <div className="space-y-3">
                        <div className="flex flex-col">
                          <span className="text-xs opacity-40">Full Name</span>
                          <span className=" text-lg">{selectedOrder.name}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs opacity-40">Direct Email</span>
                          <span className=" text-sm text-blue-500 underline underline-offset-4 decoration-blue-500/30">{selectedOrder.email}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs opacity-40">Phone Number</span>
                          <span className=" text-sm">{selectedOrder.phone}</span>
                        </div>
                      </div>
                    </section>

                    <section>
                      <h4 className="text-[12px] uppercase mb-4 ">Product Specs</h4>
                      <div className="space-y-3">
                        <div className="flex flex-col">
                          <span className="text-xs opacity-40">Artistic Style</span>
                          <span className=" text-sm uppercase tracking-wide">{selectedOrder.artStyle}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs opacity-40">Frame Selection</span>
                          <span className=" text-sm uppercase tracking-wide ">{selectedOrder.frameOption === 'noframe' ? 'Digital Asset Only (No Frame)' : selectedOrder.frameOption}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs opacity-40">Base Revenue</span>
                          <span className=" text-xl text-emerald-500">₹{selectedOrder.totalPrice}</span>
                        </div>
                      </div>
                    </section>
                  </div>

                  <section className={`p-4 rounded-lg border ${isDark ? "bg-white/[0.02] border-white/5" : "bg-neutral-50 border-black/5"}`}>
                    <h4 className="text-[12px] uppercase  opacity-30 mb-4 flex items-center gap-2">
                      <MapPin size={12} /> Delivery Destination
                    </h4>
                    <p className="font-medium text-sm leading-relaxed tracking-tight">{selectedOrder.address}</p>
                  </section>

                  <section>
                    <h4 className="text-[12px] uppercase opacity-30 mb-4">Artistic Direction</h4>
                    <p className={`p-4 rounded-lg border text-sm font-medium leading-relaxed italic ${isDark ? "bg-white/[0.01] border-white/5 text-gray-300" : "bg-gray-50 border-black/5 text-gray-600 shadow-inner"}`}>
                      {selectedOrder.instructions || "No custom instructions provided by customer."}
                    </p>
                  </section>

                  {/* ORDER TIMELINE */}
                  <section className="mt-12">
                    <h4 className="text-[12px] uppercase opacity-30 mb-6 flex items-center gap-2">
                      <Clock size={12} /> Lifecycle History
                    </h4>
                    <div className="relative pl-8 space-y-8">
                      {/* Vertical Line */}
                      <div className={`absolute left-[11px] top-2 bottom-2 w-[2px] ${isDark ? "bg-white/5" : "bg-black/5"}`}></div>

                      {/* History Items */}
                      {(selectedOrder.history && selectedOrder.history.length > 0) ? (
                        selectedOrder.history.map((item, idx) => (
                          <div key={idx} className="relative animate-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                            <div className={`absolute -left-[27px] top-1 w-4 h-4 rounded-full border-4 ${isDark ? "bg-black border-blue-500" : "bg-white border-blue-500"}`}></div>
                            <div>
                              <p className="text-sm  uppercase tracking-wide">{item.status.replaceAll('_', ' ')}</p>
                              <p className="text-[10px] opacity-40 uppercase mt-1">
                                {new Date(item.timestamp).toLocaleString()} &bull; Updated by {item.updatedBy}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="relative">
                          <div className={`absolute -left-[27px] top-1 w-4 h-4 rounded-full border-4 ${isDark ? "bg-black border-yellow-500" : "bg-white border-yellow-500"}`}></div>
                          <div>
                            <p className="text-sm font-black uppercase opacity-30 italic">No history records found.</p>
                            <p className="text-[10px] opacity-20 font-bold uppercase mt-1">Start updating status to track the journey.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* CUSTOMER FEEDBACK */}
                  {selectedOrder.rating > 0 && (
                    <section className={`mt-8 p-6 rounded-lg border relative overflow-hidden transition-all ${isDark ? "bg-amber-950/20 border-amber-500/20" : "bg-amber-50/80 border-amber-200"}`}>
                      <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 blur-[60px] rounded-full animate-pulse"></div>
                      <div className="relative z-10">
                        <h4 className="text-[12px] uppercase opacity-30 mb-4 flex items-center gap-2">
                          <Star size={12} /> Customer Feedback
                        </h4>
                        <div className="flex gap-1.5 mb-3">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={18}
                              className={`${star <= selectedOrder.rating ? "text-amber-500 fill-amber-500" : "text-gray-300 opacity-20"}`}
                            />
                          ))}
                          <span className="text-xs font-bold text-amber-500 ml-2">{selectedOrder.rating}/5</span>
                        </div>
                        {selectedOrder.feedback && (
                          <p className={`text-sm  p-4 rounded-xl border ${isDark ? "bg-white/5 border-white/5 text-gray-300" : "bg-white border-black/5 text-gray-600"}`}>
                            "{selectedOrder.feedback}"
                          </p>
                        )}
                        {selectedOrder.feedbackDate && (
                          <p className="text-[10px] opacity-40 uppercase mt-3">
                            Submitted on {new Date(selectedOrder.feedbackDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </section>
                  )}

                </div>

                {/* Right: Payment & Visual (4 cols) */}
                <div className="lg:col-span-5 space-y-10">

                  {/* TRANSACTION ID ALERT */}
                  <div className={`p-6 md:p-8 rounded-lg border transition-all duration-500 shadow-2xl relative overflow-hidden
                    ${(selectedOrder.transactionId || selectedOrder.balanceTransactionId)
                      ? "bg-indigo-600/10 border-indigo-500/30 text-indigo-400"
                      : isDark ? "bg-white/5 border-white/10 opacity-30" : "bg-black/5 border-black/10 opacity-30"}`}>

                    <div className="relative z-10 flex flex-col gap-5">
                      {/* ADVANCE ID */}
                      <div>
                        <p className="text-[11px] opacity-60 uppercase mb-1.5">Advance UPI ID</p>
                        <div className="flex items-center justify-between gap-4 w-full">
                          <div className="flex items-center gap-2">
                            <p className={`text-sm md:text-base break-all leading-relaxed ${selectedOrder.transactionId ? "text-indigo-400" : "text-gray-500"}`}>
                              {selectedOrder.transactionId || "No ID Submitted Yet"}
                            </p>
                            {selectedOrder.isAdvancePaid && (
                              <CircleCheckBig size={16} className="text-emerald-500 shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {selectedOrder.transactionId && (
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(selectedOrder.transactionId);
                                  toast.success("Advance ID Copied!");
                                }}
                                className="flex items-center justify-center p-1.5 hover:bg-white/5 rounded text-indigo-400 hover:text-indigo-300 transition-colors"
                                title="Copy Advance ID">
                                <Copy size={16} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* BALANCE ID */}
                      {(selectedOrder.isAdvancePaid || selectedOrder.balanceTransactionId) && (
                        <div className="pt-4 border-t border-indigo-500/20">
                          <p className="text-[11px] opacity-60 uppercase mb-1.5">Balance UPI ID</p>
                          <div className="flex items-center justify-between gap-4 w-full">
                            <div className="flex items-center gap-2">
                              <p className={`text-sm md:text-base break-all leading-relaxed ${selectedOrder.balanceTransactionId ? "text-indigo-400" : "text-gray-500"}`}>
                                {selectedOrder.balanceTransactionId || "No ID Submitted Yet"}
                              </p>
                              {selectedOrder.isFullPaid && (
                                <CircleCheckBig  size={16} className="text-emerald-500 shrink-0" />
                              )}
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              {selectedOrder.balanceTransactionId && (
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(selectedOrder.balanceTransactionId);
                                    toast.success("Balance ID Copied!");
                                  }}
                                  className="flex items-center justify-center p-1.5 hover:bg-white/5 rounded text-indigo-400 hover:text-indigo-300 transition-colors"
                                  title="Copy Balance ID">
                                  <Copy size={16} />
                                </button>
                              )}
                              
                            </div>
                            
                          </div>
                          {selectedOrder.balanceTransactionId && !selectedOrder.isFullPaid && (
                            <button
                              onClick={() => updateStatus(selectedOrder._id, 'out_for_delivery')}
                              className="w-full py-2 mt-4 bg-blue-500 hover:bg-blue-600 text-white rounded text-[12px]  transition-all shadow shadow-blue-500/20 active:scale-95">
                              Verify
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    {(selectedOrder.transactionId || selectedOrder.balanceTransactionId) && (
                      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500/20 blur-[60px] rounded-full animate-pulse"></div>
                    )}
                  </div>

                  <section>
                    <h4 className="text-[12px] uppercase opacity-30 mb-4">Reference Source</h4>
                    <div className={`aspect-[4/5] rounded-lg border overflow-hidden shadow-2xl relative group ${isDark ? "border-white/10" : "border-black/5"}`}>
                      {selectedOrder.photo ? (
                        <>
                          <img src={selectedOrder.photo} alt="Reference" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                            <a
                              href={selectedOrder.photo}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Open in new tab"
                              className="bg-white text-black p-2 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all">
                              <ExternalLink size={18} />
                            </a>
                            <button
                              onClick={() => handleDownload(selectedOrder.photo, selectedOrder._id)}
                              title="Download image"
                              className="bg-emerald-500 text-white p-2 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer">
                              <Download size={18} />
                            </button>
                          </div>
                          {/* PAYMENT DETAILS */}
                          <div className="space-y-4">
                            <div className="flex justify-between items-center bg-transparent backdrop-blur-sm p-4 rounded-xl border border-white/5">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${isDark ? "bg-emerald-500/10" : "bg-emerald-100"}`}>
                                  <IndianRupee size={20} className="text-emerald-500" />
                                </div>
                                <div>
                                  <p className={`text-xs font-bold uppercase tracking-widest opacity-40 ${isDark ? "text-white" : "text-black"}`}>Advance Status</p>
                                  <p className="text-sm font-bold">{selectedOrder.isAdvancePaid ? "Verified" : selectedOrder.transactionId ? "Pending Verification" : "Awaiting Payment"}</p>
                                </div>
                              </div>
                              {selectedOrder.isAdvancePaid && <CheckCircle2 size={18} className="text-emerald-500" />}
                            </div>

                            {/* BALANCE PAYMENT VIEW */}
                            <div className="flex justify-between items-center bg-transparent backdrop-blur-sm p-4 rounded-xl border border-white/5">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${isDark ? "bg-sky-500/10" : "bg-sky-100"}`}>
                                  <ShoppingBag size={20} className="text-sky-500" />
                                </div>
                                <div>
                                  <p className={`text-xs font-bold uppercase tracking-widest opacity-40 ${isDark ? "text-white" : "text-black"}`}>Balance Status</p>
                                  <p className="text-sm font-bold">{selectedOrder.isFullPaid ? "Verified" : selectedOrder.balanceTransactionId ? "Pending Verification" : "Awaiting Final Payment"}</p>
                                </div>
                              </div>
                              {selectedOrder.isFullPaid && <CheckCircle2 size={18} className="text-emerald-500" />}
                            </div>

                            <div className={`p-4 rounded-xl border space-y-3 ${isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-black/5"}`}>
                              <div className="flex justify-between text-xs">
                                <span className="opacity-50 font-bold uppercase tracking-tighter">Advance ID:</span>
                                <span className="font-mono">{selectedOrder.transactionId || "No ID Submitted"}</span>
                              </div>
                              <div className="flex justify-between text-xs pt-2 border-t border-white/5">
                                <span className="opacity-50 font-bold uppercase tracking-tighter">Balance ID:</span>
                                <span className="font-mono">{selectedOrder.balanceTransactionId || "No ID Submitted"}</span>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs text-center p-6">
                          Digital Assets Missing
                        </div>
                      )}
                    </div>
                  </section>

                </div>

              </div>
            </div>


          </div>
        </div>
      )}

      {/* BULK ACTION BAR */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-[60] w-[calc(100%-2rem)] md:w-auto animate-in slide-in-from-bottom-8 duration-500">
          <div className={`flex flex-col md:flex-row items-center gap-4 md:gap-6 px-4 md:px-6 py-4 rounded-2xl border backdrop-blur-2xl transition-all shadow-2xl ${isDark ? "bg-black/80 border-white/20 shadow-black/50" : "bg-white/90 border-black/10 shadow-black/10"
            }`}>
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start md:pr-6 md:border-r border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white font-black text-xs">
                  {selectedIds.length}
                </div>
                <span className={`text-[10px] md:text-xs uppercase tracking-widest  ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  Orders Selected
                </span>
              </div>

              <button
                onClick={() => setSelectedIds([])}
                className={`md:hidden text-[10px] uppercase tracking-widest opacity-60  ${isDark ? "text-white" : "text-black"
                  }`}
              >
                Cancel
              </button>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex-1 md:flex-none">
                <StatusDropdown
                  currentStatus="none"
                  onStatusChange={(newStatus) => handleBulkStatusUpdate(newStatus)}
                  isDark={isDark}
                  position="top"
                  disabled={loading}
                />
              </div>

              <button
                onClick={() => {
                  toast((t) => (
                    <div className="flex flex-col gap-3">
                      <p className="text-xs font-medium">Delete {selectedIds.length} orders forever?</p>
                      <div className="flex gap-2">
                        <button
                          onClick={async () => {
                            toast.dismiss(t.id);
                            try {
                              // Using Promise.all for better performance if possible, 
                              // or just loop if the API only supports single deletes
                              const token = localStorage.getItem("adminToken");
                              const results = await Promise.all(selectedIds.map(id =>
                                fetch(`${API_BASE_URL}/api/orders/${id}`, {
                                  method: "DELETE",
                                  headers: { Authorization: `Bearer ${token}` },
                                })
                              ));

                              const allOk = results.every(r => r.ok);
                              if (allOk) {
                                setOrders(orders.filter(o => !selectedIds.includes(o._id)));
                                setSelectedIds([]);
                                toast.success(`Deleted ${selectedIds.length} orders successfully`);
                              } else {
                                toast.error("Some orders failed to delete");
                                // Refresh to sync
                                fetchOrders();
                              }
                            } catch (err) {
                              toast.error("An error occurred during bulk deletion");
                            }
                          }}
                          className="px-3 py-1 bg-red-500 text-white rounded text-[10px] font-bold uppercase tracking-wider"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => toast.dismiss(t.id)}
                          className="px-3 py-1 bg-neutral-200 text-black rounded text-[10px] font-bold uppercase tracking-wider"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ), { duration: 5000, position: 'top-center' });
                }}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all text-[11px] uppercase tracking-wider border border-red-500/20"
              >
                <Trash2 size={14} />
                <span className="hidden sm:inline">Delete</span>
              </button>

              <button
                onClick={() => setSelectedIds([])}
                className={`hidden md:block text-[11px] uppercase tracking-widest opacity-40 hover:opacity-100  transition-opacity ml-2 ${isDark ? "text-white" : "text-black"
                  }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
