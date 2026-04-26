import { useEffect, useState, useRef } from "react";
import { RefreshCcw, Search, ChevronDown, CheckCircle2, Trash2, Mail, MessageSquare, ShieldAlert } from "lucide-react";

export default function Messages({ isDark }) {
  const dropdownRef = useRef(null);

  const [openFilter, setOpenFilter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 5;

  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");

  const openMessage = (msg) => setSelectedMessage(msg);
  const closeMessage = () => setSelectedMessage(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/admin/messages", {
        headers: {
          Authorization: localStorage.getItem("adminToken"),
        },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setMessages(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/messages/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("adminToken"),
        },
      });
      if (res.ok) {
        setMessages(messages.filter((m) => m._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredMessages = messages
    .filter((msg) => {
      const matchesSearch =
        msg.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.subject?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter = (() => {
        if (dateFilter === "all") return true;
        const now = new Date();
        const msgDate = new Date(msg.createdAt);
        let diffTime = 0;
        switch (dateFilter) {
          case "24h": diffTime = 24 * 60 * 60 * 1000; break;
          case "7d": diffTime = 7 * 24 * 60 * 60 * 1000; break;
          case "30d": diffTime = 30 * 24 * 60 * 60 * 1000; break;
          default: return true;
        }
        return now - msgDate <= diffTime;
      })();

      return matchesSearch && matchesFilter;
    });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenFilter(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);
  const currentMessages = filteredMessages.slice(
    (currentPage - 1) * messagesPerPage,
    currentPage * messagesPerPage
  );

  return (
    <div style={{ fontFamily: "Inter, sans-serif" }} className="animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Header */}
      <div className="mb-4">
        <h1 className={`text-xl font-semibold  ${isDark ? "text-white" : "text-black"}`} style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
          Messages
        </h1>
      </div>

      {/* Container */}
      <div className={`rounded-2xl overflow-hidden shadow-lg border transition-all duration-300
        ${isDark ? "bg-black border-white/10" : "bg-white border-black/5"}`}>

        {/* Search + Filters */}
        <div className={`flex flex-col md:flex-row gap-4 px-4 py-3 border-b 
          ${isDark ? "border-white/10" : "border-black/5"}`}>

          {/* Search Input */}
          <div className="relative w-full md:w-[260px]">
            <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className={`pl-9 pr-3 py-1.5 rounded-lg text-xs font-medium w-full transition-all focus:outline-none focus:ring-2 
                ${isDark 
                  ? "bg-white/5 text-white placeholder-gray-500 border border-white/10 focus:ring-blue-500/50" 
                  : "bg-white text-black placeholder-gray-400 border border-black/10 focus:ring-blue-500/30 shadow-sm"}`}
            />
          </div>

          {/* Filter Dropdown */}
          <div ref={dropdownRef} className="relative w-full md:w-[160px]">
            <button
              onClick={(e) => {
                e.stopPropagation();   
                setOpenFilter((prev) => !prev);
              }}
              className={`w-full px-3 py-1.5 rounded-lg text-xs flex justify-between items-center transition-all border
                ${isDark 
                  ? "bg-white/5 text-white border-white/10 hover:bg-white/10" 
                  : "bg-white text-black border-black/10 hover:bg-gray-50 shadow-sm"}`}
            >
              {dateFilter === "all" && "All Time"}
              {dateFilter === "24h" && "Last 24 Hours"}
              {dateFilter === "7d" && "Last Week"}
              {dateFilter === "30d" && "Last Month"}
              <ChevronDown className="w-3.5 h-3.5 opacity-50" />
            </button>

            {openFilter && (
              <div className={`absolute mt-1.5 w-full rounded-lg shadow-2xl z-50 text-xs border overflow-hidden
                ${isDark ? "bg-[#0a0a0a] border-white/10" : "bg-white shadow-xl border-black/10"}`}>
                {[
                  { label: "All Time", value: "all" },
                  { label: "Last 24 Hours", value: "24h" },
                  { label: "Last Week", value: "7d" },
                  { label: "Last Month", value: "30d" },
                ].map((item) => (
                  <div
                    key={item.value}
                    onClick={() => {
                      setDateFilter(item.value);
                      setCurrentPage(1);
                      setOpenFilter(false);
                    }}
                    className={`flex justify-between items-center px-3 py-2 cursor-pointer transition-colors
                      ${isDark 
                        ? "hover:bg-white/10 text-gray-200" 
                        : "hover:bg-black/5 text-gray-800"}`}
                  >
                    <span className="font-medium">{item.label}</span>
                    {dateFilter === item.value && (
                      <CheckCircle2 className={`w-3.5 h-3.5 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Refresh Button */}
          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={fetchMessages}
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

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className={`${isDark ? "bg-[#0d0d0d] text-gray-400 border-b border-white/10" : "bg-gray-200 text-black border-b border-black/10"}`}>
                <th className="px-4 py-3 text-left font-normal text-[13px] w-[25%]">Sender</th>
                <th className="px-4 py-3 text-left font-normal text-[13px] w-[35%]">Subject</th>
                <th className="px-4 py-3 text-center font-normal text-[13px] w-[15%]">Date</th>
                <th className="px-4 py-3 text-center font-normal text-[13px] w-[15%]">Details</th>
                <th className="px-4 py-3 text-center font-normal text-[13px] w-[10%]">Action</th>
              </tr>
            </thead>

            <tbody>
              {currentMessages.length > 0 ? (
                currentMessages.map((msg) => (
                  <tr
                    key={msg._id}
                    className={`group transition-colors duration-200 border-b last:border-none
                      ${isDark ? "border-white/5 hover:bg-white/5" : "border-black/5 hover:bg-black/5"}`}
                  >
                    <td className="px-4 py-2.5 text-left">
                      <div className="flex flex-col">
                        <span className={`font-medium ${isDark ? "text-gray-100" : "text-gray-900"}`}>{msg.fullName}</span>
                        <span className={`text-[10px] ${isDark ? "text-gray-500" : "text-gray-400"}`}>{msg.email}</span>
                      </div>
                    </td>
                    <td className={`px-4 py-2.5 text-left text-[13px] truncate max-w-[200px] ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      {msg.subject || "(No Subject)"}
                    </td>
                    <td className={`px-4 py-2.5 text-center text-[11px] ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <button
                        onClick={() => openMessage(msg)}
                        className={`text-xs transition-all duration-300 hover:scale-105 ${isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"}`}
                      >
                        View
                      </button>
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <button
                        onClick={() => deleteMessage(msg._id)}
                        className={`text-red-500  transition-all duration-300 transform hover:scale-110 p-1.5 rounded-sm hover:bg-red-500/10`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className={`text-center py-12 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                    <div className="flex flex-col items-center justify-center">
                      <MessageSquare size={40} className="mb-4 opacity-20" />
                      <p className="text-lg font-medium">No messages found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className={`flex justify-between items-center px-4 py-2.5 border-t 
          ${isDark ? "border-white/10" : "border-black/5"}`}>
          <button
            onClick={() => setCurrentPage((p) => p - 1)}
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
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1.5 text-xs rounded-lg transition-all border
              ${isDark ? "bg-white/5 text-white border-white/10 hover:bg-white/10" : "bg-white text-black border-black/10 hover:bg-gray-100 shadow-sm"} 
              disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Message Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className={`w-[450px] rounded-2xl p-6 shadow-2xl border relative overflow-hidden animate-in zoom-in-95 duration-200
            ${isDark ? "bg-black border-white/10 text-white" : "bg-white border-black/10 text-black"}`}>
            
            <h2 className="text-xl tracking-tight mb-4" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
              Message Details
            </h2>

            <div className="space-y-4">
              <div className={`p-4 rounded-xl border ${isDark ? "bg-white/5 border-white/5" : "bg-gray-50 border-black/5"}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-600"}`}>
                    <Mail size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm ">{selectedMessage.fullName}</h3>
                    <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>{selectedMessage.email}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className={`text-[11px] uppercase tracking-wider font-bold ${isDark ? "text-gray-500" : "text-gray-400"}`}>Subject</span>
                    <p className="text-sm mt-0.5">{selectedMessage.subject || "(No Subject)"}</p>
                  </div>
                  <div>
                    <span className={`text-[11px] uppercase tracking-wider font-bold ${isDark ? "text-gray-500" : "text-gray-400"}`}>Message</span>
                    <p className={`text-sm mt-1 leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      {selectedMessage.message}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-dashed border-gray-500/20">
                    <p className={`text-[10px] ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                      Received on: {new Date(selectedMessage.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={closeMessage}
              className={`mt-6 w-full py-1 rounded-xl cursor-pointer text-[14px] transition-all duration-300 relative z-10
                ${isDark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-neutral-800"}`}
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
