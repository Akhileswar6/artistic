import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config";

import AdminLayout from "../../Layout/AdminLayout";
import { Activity, User, ShoppingBag, Settings, Search, Clock, ShieldCheck, Trash2, ArrowUpDown, RefreshCcw } from "lucide-react";

export default function ActivityLog({ isDark }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API_BASE_URL}/api/admin/activities`, {
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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const currentActivities = filteredActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
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
      <div className={`mb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 rounded-2xl transition-all duration-300
          ${isDark ? "bg-white/[0.03] border border-white/5" : "bg-white border border-black/5 shadow-sm"}`}>
        <div>
          <h1 className={`text-lg md:text-xl ${isDark ? "text-white" : "text-black"}`} style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
            Audit Logs
          </h1>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={fetchActivities}
            disabled={loading}    
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] uppercase transition-all duration-300 transform active:scale-95 shadow-sm cursor-pointer
              ${isDark 
                ? "bg-white text-black hover:bg-gray-100" 
                : "bg-black text-white hover:bg-neutral-800"}`}
          >
            <RefreshCcw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Syncing..." : "Refresh Pipeline"}
          </button>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className={`mb-4 p-2.5 rounded-xl border transition-all duration-300 ${isDark ? "bg-white/[0.02] border-white/5 shadow-2xl" : "bg-white border-black/5 shadow-lg"}`}>
        <div className="relative flex-1 group">
          <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isDark ? "text-gray-500 group-focus-within:text-white" : "text-gray-400 group-focus-within:text-black"}`} size={16} />
          <input
            type="text"
            placeholder="Search by admin name, action, or details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 md:py-2.5 rounded-lg border outline-none transition-all duration-300 text-[13px] ${isDark
                ? "bg-black border-white/10 text-white focus:border-white/50 focus:bg-white/[0.04]"
                : "bg-gray-50 border-black/10 text-black focus:border-black/50 focus:bg-white"}`}
          />
        </div>
      </div>

      {/* Container */}
      <div className={`rounded-2xl border overflow-hidden shadow-2xl transition-all duration-300 ${isDark ? "bg-[#0a0a0a] border-white/10" : "bg-white border-black/5"}`}>

        {/* Mobile View: Cards */}
        <div className="grid grid-cols-1 divide-y lg:hidden divide-white/5">
          {loading ? (
            <div className="py-20 text-center text-gray-500">
               <div className="flex flex-col items-center gap-3">
                  <div className={`w-10 h-10 border-4 border-t-transparent ${isDark ? "border-white" : "border-black"} rounded-full animate-spin`}></div>
                  <p className="text-sm animate-pulse">Retracing activities...</p>
               </div>
            </div>
          ) : currentActivities.length === 0 ? (
            <div className="py-20 text-center text-gray-500">
               <div className="flex flex-col items-center gap-3 opacity-30">
                  <Activity size={48} />
                  <p className="text-lg font-bold">No activity matches your query</p>
               </div>
            </div>
          ) : currentActivities.map((act) => (
            <div key={act._id} className="p-4 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-normal ${isDark ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-600"}`}>
                    {act.adminName.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-[13px] font-normal ${isDark ? "text-white" : "text-black"}`}>{act.adminName}</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {getActionIcon(act.action)}
                      <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-normal ${isDark ? "bg-white/5 text-gray-400" : "bg-black/5 text-gray-600"}`}>
                        {act.action}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] block ${isDark ? "text-gray-400" : "text-gray-500"}`}>{new Date(act.timestamp).toLocaleDateString()}</span>
                  <span className={`text-[9px] opacity-40 block uppercase tracking-tighter`}>{new Date(act.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>

              <div className={`p-3 rounded-lg border text-xs leading-relaxed ${isDark ? "bg-white/[0.02] border-white/5 text-gray-300" : "bg-gray-50 border-black/5 text-gray-600"}`}>
                {act.details}
              </div>

              <div className="flex items-center justify-between">
                <span className={`text-[9px] uppercase tracking-widest font-normal ${isDark ? "text-blue-400" : "text-blue-600"}`}>
                  ID: {act.targetId?.slice(-8) || "SYSTEM"}
                </span>
                {act.targetType && act.targetType.toLowerCase() !== "order" && (
                  <span className={`text-[9px] uppercase px-2 py-1 rounded bg-black/10 ${isDark ? "text-blue-400" : "text-blue-700"}`}>
                    {act.targetType}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className={`${isDark ? "bg-[#0d0d0d] text-gray-400 border-b border-white/10" : "bg-gray-200 text-black border-b border-black/10"}`}>
                <th className="px-5 py-3 font-normal text-left text-[11px] uppercase tracking-wider">Admin</th>
                <th className="px-5 py-3 font-normal text-left text-[11px] uppercase tracking-wider">Event</th>
                <th className="px-5 py-3 font-normal text-left text-[11px] uppercase tracking-wider">Target</th>
                <th className="px-5 py-3 font-normal text-left text-[11px] uppercase tracking-wider">Activity Details</th>
                <th className="px-5 py-3 text-right font-normal text-[11px] uppercase tracking-wider">Timestamp</th>
              </tr> 
            </thead>
            <tbody className={`divide-y ${isDark ? "divide-white/5" : "divide-black/5"}`}>
              {loading ? (
                <tr>
                   <td colSpan="5" className="px-6 py-20 text-center">
                     <div className="flex flex-col items-center gap-3">
                        <div className={`w-8 h-8 border-3 border-t-transparent ${isDark ? "border-white" : "border-black"} rounded-full animate-spin`}></div>
                        <p className="text-sm text-gray-500 animate-pulse">Retracing audit trail...</p>
                     </div>
                   </td>
                </tr>
              ) : currentActivities.length === 0 ? (
                <tr>
                   <td colSpan="5" className="px-6 py-20 text-center">
                     <div className="flex flex-col items-center gap-3 opacity-20">
                        <Activity size={48} />
                        <p className="text-xl font-bold">No records found</p>
                     </div>
                   </td>
                </tr>
              ) : currentActivities.map((act) => (
                <tr key={act._id} className={`${isDark ? "hover:bg-white/[0.02]" : "hover:bg-black/[0.01]"} transition-colors group`}>
                  <td className="px-5 py-2.5">
                    <div className="flex items-center gap-3">
                       <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-normal ${isDark ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-600"}`}>
                          {act.adminName.charAt(0)}
                       </div>
                       <span className={`text-[13px] font-normal ${isDark ? "text-gray-200" : "text-black"}`}>{act.adminName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-2.5">
                    <div className="flex items-center gap-2">
                       {getActionIcon(act.action)}
                       <span className={`text-[11px] px-2.5 py-1 rounded-full uppercase font-normal ${isDark ? "bg-white/5 text-gray-400" : "bg-black/5 text-gray-600"}`}>
                          {act.action}
                       </span>
                    </div>
                  </td>
                  <td className="px-5 py-2.5">
                    <div className="flex flex-col">
                      {act.targetType && act.targetType.toLowerCase() !== "order" && (
                        <span className={`text-[10px] font-normal ${isDark ? "text-blue-400/80" : "text-blue-600"}`}>{act.targetType}</span>
                      )}
                      <span className={`text-[13px] ${isDark ? "text-blue-400" : "text-blue-600"}`} style={{fontFamily: "'Fira Code', monospace"}}>
                         #{act.targetId?.slice(-10) || "SYSTEM"}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-2.5">
                    <p className={`text-[12px] font-normal max-w-[400px] leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                       {act.details}
                    </p>
                  </td>
                  <td className="px-5 py-2.5 text-right">
                    <div className="flex flex-col items-end">
                       <span className={`text-[11px] font-normal ${isDark ? "text-gray-300" : "text-black"}`}>{new Date(act.timestamp).toLocaleDateString()}</span>
                       <span className={`text-[10px] opacity-40 uppercase tracking-tighter font-normal ${isDark ? "text-blue-400" : "text-blue-600"}`}>{new Date(act.timestamp).toLocaleTimeString()}</span>
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

        <div className={`px-6 py-3 flex justify-between items-center ${isDark ? "bg-white/[0.02]" : "bg-neutral-50"}`}>
           <p className="text-[9px] uppercase tracking-[0.2em] opacity-30 flex items-center gap-2">
              <ShieldCheck size={12} /> Secure Audit Trail Logic Verified
           </p>
        </div>
      </div>

    </div>
  );
}
