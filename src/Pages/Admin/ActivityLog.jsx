import React, { useEffect, useState } from "react";
import AdminLayout from "../../Layout/AdminLayout";
import { Activity, User, ShoppingBag, Settings, Search, Clock, ShieldCheck, Trash2, ArrowUpDown, RefreshCcw } from "lucide-react";

export default function ActivityLog({ isDark }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("http://localhost:5000/api/admin/activities", {
        headers: { Authorization: token },
      });
      if (res.ok) {
        const data = await res.json();
        setActivities(data);
      }
    } catch (err) {
      console.error("Failed to fetch activities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const filteredActivities = activities.filter(act => 
    act.adminName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    act.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (act.details && act.details.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getActionIcon = (action) => {
    const act = action.toLowerCase();
    if (act.includes("order")) return <ShoppingBag size={15} className="text-green-500" />;
    if (act.includes("user")) return <User size={15} className="text-blue-500" />;
    if (act.includes("config")) return <Settings size={15} className="text-emerald-500" />;
    if (act.includes("delete")) return <Trash2 size={15} className="text-red-500" />;
    return <Clock size={15} className="text-gray-500" />;
  };

  return (
    <div style={{ fontFamily: "Inter, sans-serif" }} className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      
      {/* Header */}
      <div className="mb-4">
        <h1 className={`text-xl font-semibold  ${isDark ? "text-white" : "text-black"}`} style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
          Audit Logs
        </h1>
      </div>

      {/* Container */}
      <div className={`rounded-2xl border overflow-hidden shadow-lg transition-all duration-300 ${isDark ? "bg-black border-white/10" : "bg-white border-black/5"}`}>
        
        {/* Search + Filters */}
        <div className={`flex flex-col md:flex-row gap-4 px-4 py-3 border-b ${isDark ? "border-white/10" : "border-black/5"}`}>
          
          {/* Search Input */}
          <div className="relative w-full md:w-[260px]">
            <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-9 pr-3 py-1.5 rounded-lg text-xs font-medium w-full transition-all focus:outline-none focus:ring-2 
                ${isDark 
                  ? "bg-white/5 text-white placeholder-gray-500 border border-white/10 focus:ring-blue-500/50" 
                  : "bg-white text-black placeholder-gray-400 border border-black/10 focus:ring-blue-500/30 shadow-sm"}`}
            />
          </div>

          {/* Refresh Button */}
          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={fetchActivities}
              disabled={loading}    
              className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all border
                ${isDark 
                  ? "bg-white/5 text-white border-white/10 hover:bg-white/10" 
                  : "bg-white text-black border-black/10 hover:bg-gray-50 shadow-sm"}
                ${loading && "opacity-50 cursor-not-allowed"}`}
            >
              <RefreshCcw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              {loading ? "Refreshing" : "Refresh"}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className={`${isDark ? "bg-[#0d0d0d] text-gray-400 border-b border-white/10" : "bg-gray-200 text-black border-b border-black/10"}`}>
                <th className="px-4 py-3 text-left font-normal text-[13px]">Admin</th>
                <th className="px-4 py-3 text-left font-normal text-[13px]">Event</th>
                <th className="px-4 py-3 text-left font-normal text-[13px]">Order Id</th>
                <th className="px-4 py-3 text-left font-normal text-[13px]">Details</th>
                <th className="px-4 py-3 text-right font-normal text-[13px]">Timestamp</th>
              </tr> 
            </thead>
            <tbody className={`divide-y ${isDark ? "divide-white/5" : "divide-black/5"}`}>
              {loading ? (
                <tr>
                   <td colSpan="5" className="px-4 py-12 text-center  text-gray-500">Loading audit trail...</td>
                </tr>
              ) : filteredActivities.length === 0 ? (
                <tr>
                   <td colSpan="5" className="px-4 py-12 text-center  text-gray-500">No matching activities found.</td>
                </tr>
              ) : filteredActivities.map((act) => (
                <tr key={act._id} className={`${isDark ? "border-white/5 hover:bg-white/5" : "border-black/5 hover:bg-black/5"} border-b last:border-none transition-colors group`}>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                       <div className={`w-7 h-7 rounded-md flex items-center justify-center text-md ${isDark ? "bg-blue-500/20 text-blue-400" : "bg-blue-50 text-blue-600"}`}>
                          {act.adminName.charAt(0)}
                       </div>
                       <span className="text-sm ">{act.adminName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                       {getActionIcon(act.action)}
                       <span className={`text-[12px] px-2 py-0.5 rounded-full ${isDark ? "bg-white/5" : "bg-black/5"}`}>
                          {act.action}
                       </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-[12px] opacity-50">
                       {act.targetType}: {act.targetId?.slice(-6) || "N/A"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <p className={`text-[12px] font-medium max-w-[300px] truncate ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                       {act.details}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex flex-col items-end">
                       <span className="text-[12px] ">{new Date(act.timestamp).toLocaleDateString()}</span>
                       <span className="text-[10px] text-neutral-500">{new Date(act.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className={`px-8 py-4 flex justify-between items-center ${isDark ? "bg-white/5" : "bg-gray-50"}`}>
           <p className="text-[10px]  uppercase tracking-[0.1em] opacity-30  flex items-center gap-2">
              <ShieldCheck size={14} /> End-to-end Audit Trail Verified
           </p>
           
        </div>
      </div>

    </div>
  );
}
