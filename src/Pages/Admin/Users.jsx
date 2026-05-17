import { useEffect, useState, useRef } from "react";
import { API_BASE_URL } from "../../config";

import { RefreshCcw, Search, ChevronDown, CheckCircle2, Ban, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";
import AdminLayout from "../../Layout/AdminLayout";

export default function Users({ isDark }) {
  const dropdownRef = useRef(null);

  const [openFilter, setOpenFilter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 20;

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [sortField, setSortField] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");


















  const openUser = (user) => setSelectedUser(user);
  const closeUser = () => setSelectedUser(null);

  useEffect(() => {
    fetchUsers();
  }, []);

const fetchUsers = async () => {
  try {
    setLoading(true);

    const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    });

      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        toast.error("Failed to fetch users");
      }
    } catch (err) {
      toast.error("An error occurred while fetching users");
      console.error(err);
  } finally {
    setLoading(false);
  }
};

  const filteredUsers = users
    .filter((user) => {
      const matchesSearch =
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter = (() => {
        if (statusFilter === "all") return true;

        const now = new Date();
        const userDate = new Date(user.createdAt);
        let diffTime = 0;

        switch (statusFilter) {
          case "24h": diffTime = 24 * 60 * 60 * 1000; break;
          case "3d": diffTime = 3 * 24 * 60 * 60 * 1000; break;
          case "7d": diffTime = 7 * 24 * 60 * 60 * 1000; break;
          case "30d": diffTime = 30 * 24 * 60 * 60 * 1000; break;
          default: return true;
        }
        return now - userDate <= diffTime;
      })();

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (!sortField) return 0;

      let valA, valB;
      if (sortField === "name") {
        valA = a.fullName?.toLowerCase() || "";
        valB = b.fullName?.toLowerCase() || "";
      }
      if (sortField === "date") {
        valA = new Date(a.createdAt);
        valB = new Date(b.createdAt);
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
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

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const toggleBlockStatus = async (user) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/block-users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`, // ✅ FIXED
          },
        body: JSON.stringify({ userIds: [user._id] }),
      });

      if (res.ok) {
        // Update local state for both the list and the selected user
        const updatedUsers = users.map(u => 
          u._id === user._id ? { ...u, isBlocked: !u.isBlocked } : u
        );
        setUsers(updatedUsers);
        setSelectedUser({ ...user, isBlocked: !user.isBlocked });
        toast.success(`User ${user.isBlocked ? 'unblocked' : 'blocked'} successfully`);
      } else {
        toast.error("Failed to update block status");
      }
    } catch (err) {
      toast.error("An error occurred");
      console.error(err);
    }
  };

  return (
      <div style={{ fontFamily: "Inter, sans-serif" }} className="animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* Header */}
        <div className={`mb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 rounded-2xl transition-all duration-300
          ${isDark ? "bg-white/[0.03] border border-white/5" : "bg-white border border-black/5 shadow-sm"}`}>
          <div>
            <h1 className={`text-lg md:text-xl  ${isDark ? "text-white" : "text-black"}`} style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
              Users
            </h1>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={fetchUsers}
              disabled={loading}    
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px]  uppercase transition-all duration-300 transform active:scale-95 shadow-sm cursor-pointer
                ${isDark 
                  ? "bg-white text-black hover:bg-gray-100" 
                  : "bg-black text-white hover:bg-neutral-800"}`}
            >
              <RefreshCcw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
              {loading ? "Refreshing" : "Refresh Pipeline"}
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
                placeholder="Search by name or email"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className={`w-full pl-10 pr-4 py-2 md:py-2.5 rounded-lg border outline-none transition-all duration-300 text-[13px] ${isDark
                    ? "bg-black border-white/10 text-white focus:border-white/50 focus:bg-white/[0.04]"
                    : "bg-gray-50 border-black/10 text-black focus:border-black/50 focus:bg-white"
                  }`}
              />
            </div>

            {/* FILTERS */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              {/* Status Filter */}
              <div ref={dropdownRef} className="relative w-full min-w-[145px]">
                <button
                  onClick={(e) => {
                    e.stopPropagation();   
                    setOpenFilter((prev) => !prev);
                  }}
                  className={`w-full px-2.5 py-1.5 rounded-lg text-[11px] flex justify-between items-center transition-all border cursor-pointer
                    ${isDark 
                      ? "bg-[#0a0a0a] text-white border-white/10 hover:bg-white/5" 
                      : "bg-white text-black border-black/10 hover:bg-gray-50 shadow-sm"}`}
                >
                  <span className="flex items-center gap-1.5">
                    {statusFilter === "all" && "All Users"}
                    {statusFilter === "24h" && "Last 24 Hours"}
                    {statusFilter === "3d" && "Last 3 Days"}
                    {statusFilter === "7d" && "Last 1 Week"}
                    {statusFilter === "30d" && "Last 1 Month"}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-50 ml-1" />
                </button>

                {openFilter && (
                  <div className={`absolute mt-1.5 w-full rounded-lg shadow-2xl z-50 text-[12px] border overflow-hidden
                    ${isDark ? "bg-[#0a0a0a] border-white/10" : "bg-white shadow-xl border-black/10"}`}>
                    {[
                      { label: "All Users", value: "all" },
                      { label: "Last 24 Hours", value: "24h" },
                      { label: "Last 3 Days", value: "3d" },
                      { label: "Last 1 Week", value: "7d" },
                      { label: "Last 1 Month", value: "30d" },
                    ].map((item) => (
                      <div
                        key={item.value}
                        onClick={() => {
                          setStatusFilter(item.value);
                          setCurrentPage(1);
                          setOpenFilter(false);
                        }}
                        className={`flex justify-between items-center px-4 py-2.5 cursor-pointer transition-colors
                          ${isDark 
                            ? "hover:bg-white/10 text-gray-200" 
                            : "hover:bg-black/5 text-gray-800"}`}
                      >
                        <span className="font-medium">{item.label}</span>
                        {statusFilter === item.value && (
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

        {/* Container */}
        <div className={`rounded-2xl overflow-hidden shadow-lg border transition-all duration-300
          ${isDark 
            ? "bg-black border-white/10" 
            : "bg-white border-black/5"}`}>

          {/* Mobile Card Layout */}
          <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <div key={user._id} className={`p-4 rounded-xl border flex flex-col gap-3 transition-colors duration-200 ${isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-black/5"}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className={`font-normal text-[13px] ${isDark ? "text-gray-100" : "text-gray-900"}`}>{user.fullName || "N/A"}</h3>
                      <p className={`text-[11px] opacity-50 ${isDark ? "text-gray-400" : "text-gray-600"}`}>{user.email}</p>
                    </div>
                    {user.isBlocked ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-red-500/10 text-red-500 border border-red-500/20">
                        <span className="w-1 h-1 rounded-full bg-red-500"></span> Blocked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                        <span className="w-1 h-1 rounded-full bg-green-500"></span> Active
                      </span>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center pt-3 border-t border-dashed border-gray-500/20">
                    <p className={`text-[11px] font-normal uppercase tracking-wider ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                      Joined: {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                    <button
                      onClick={() => openUser(user)}
                      className={`text-[11px] font-normal uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all ${isDark ? "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20" : "bg-blue-50 text-blue-600 hover:bg-blue-100"}`}
                    >
                      View
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className={`text-center py-10 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                <ShieldAlert size={32} className="mx-auto mb-3 opacity-20" />
                <p className="text-sm font-medium">No users found</p>
              </div>
            )}
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className={`${isDark ? "bg-[#0d0d0d] text-gray-400 border-b border-white/10" : "bg-gray-200 text-black border-b border-black/10"}`}>

                  <th
                    onClick={() => {
                      if (sortField === "name") setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
                      else { setSortField("name"); setSortOrder("asc"); }
                    }}
                    className="px-5 py-3 font-normal text-left text-[11px] uppercase tracking-wider cursor-pointer hover:text-blue-500 transition-colors"
                  >
                    Name {sortField === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="px-5 py-3 font-normal text-left text-[11px] uppercase tracking-wider">Email</th>
                  <th
                    onClick={() => {
                      if (sortField === "date") setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
                      else { setSortField("date"); setSortOrder("desc"); }
                    }}
                    className="px-5 py-3 font-normal text-left text-[11px] uppercase tracking-wider cursor-pointer hover:text-blue-500 transition-colors"
                  >
                    Joined {sortField === "date" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="px-5 py-3 font-normal text-center text-[11px] uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 font-normal text-center text-[11px] uppercase tracking-wider">Details</th>
                </tr>
              </thead>

              <tbody>
                {currentUsers.length > 0 ? (
                  currentUsers.map((user) => (
                    <tr
                      key={user._id}
                      className={`group transition-colors duration-200 border-b last:border-none
                        ${isDark
                          ? "border-white/5 hover:bg-white/5"
                          : "border-black/5 hover:bg-black/5"}`}
                    >


                      <td className={`px-5 py-2.5 text-[13px] tracking-tight ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                        {user.fullName || "N/A"}
                      </td>

                      <td className={`px-5 py-2.5 text-[13px] font-normal ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                        {user.email}
                      </td>

                      <td className={`px-5 py-2.5 font-normal uppercase tracking-wider text-[11px] ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-5 py-2.5 text-center">
                        {user.isBlocked ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-normal bg-red-500/10 text-red-500 border border-red-500/20">
                            <span className="w-1 h-1 rounded-full bg-red-500"></span>
                            Blocked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-normal bg-green-500/10 text-green-500 border border-green-500/20">
                            <span className="w-1 h-1 rounded-full bg-green-500"></span>
                            Active
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-2.5 text-center">
                        <button
                          onClick={() => openUser(user)}
                          className={`text-[11px] font-normal transition-all duration-300 hover:scale-105 ${isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"}`}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className={`text-center py-12 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                      <div className="flex flex-col items-center justify-center">
                        <ShieldAlert size={40} className="mb-4 opacity-20" />
                        <p className="text-lg font-medium">No users found</p>
                        <p className="text-sm mt-1">Try adjusting your filters or search terms.</p>
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
              className={`px-3 py-1.5 text-xs  rounded-lg transition-all border
                ${isDark 
                  ? "bg-white/5 text-white border-white/10 hover:bg-white/10" 
                  : "bg-white text-black border-black/10 hover:bg-gray-100 shadow-sm"} 
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
              className={`px-3 py-1.5 text-xs  rounded-lg transition-all border
                ${isDark 
                  ? "bg-white/5 text-white border-white/10 hover:bg-white/10" 
                  : "bg-white text-black border-black/10 hover:bg-gray-100 shadow-sm"} 
                disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              Next
            </button>

          </div>
        </div>

        {/* Modal Overlay */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className={`w-full max-w-[400px] rounded-2xl p-6 shadow-2xl border relative overflow-hidden animate-in zoom-in-95 duration-200
              ${isDark ? "bg-[#0d0d0d] border-white/10 text-white" : "bg-white border-black/10 text-black"}`}>


              <h2 className="text-xl tracking-tight mb-4" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
                User Details
              </h2>

              <div className="space-y-5 text-[14px] relative z-10">
                <div className={`p-4 rounded-xl border ${isDark ? "bg-white/5 border-white/5" : "bg-gray-50 border-black/5"}`}>
                  <p className="flex justify-between items-center mb-3">
                    <span className={`${isDark ? "text-gray-400" : "text-gray-500"}`}>Name:</span>
                    <span className="text-[14px] ">{selectedUser.fullName}</span>
                  </p>
                  <p className="flex justify-between items-center mb-3">
                    <span className={`${isDark ? "text-gray-400" : "text-gray-500"}`}>Email:</span>
                    <span className="text-[14px] ">{selectedUser.email}</span>
                  </p>
                  <p className="flex justify-between items-center mb-3">
                    <span className=  {`${isDark ? "text-gray-400" : "text-gray-500"}`}>Joined:</span>
                    <span className="text-[13px] ">
                      {new Date(selectedUser.createdAt).toLocaleDateString()}
                    </span>
                  </p>
                  <p className="flex justify-between text-[14px] items-center pt-3 border-t border-dashed border-gray-500/30">
                    <span className={`${isDark ? "text-gray-400" : "text-gray-500"}`}>Status:</span>
                    {selectedUser.isBlocked ? (
                      <span className="px-2 py-1 rounded-full text-xs  bg-red-500/10 text-red-500 border border-red-500/20">Blocked</span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs   bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">Active</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => toggleBlockStatus(selectedUser)}
                  className={`flex-1 py-1.5 rounded-xl cursor-pointer text-[13px] font-medium transition-all duration-300 flex items-center justify-center gap-2
                    ${selectedUser.isBlocked 
                      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-green-600 hover:text-white" 
                      : "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white"}`}
                >
                  {selectedUser.isBlocked ? <CheckCircle2 size={14} /> : <Ban size={14} />}
                  {selectedUser.isBlocked ? "Unblock User" : "Block User"}
                </button>

                <button
                  onClick={closeUser}
                  className={`flex-1 py-1.5 rounded-xl cursor-pointer text-[13px] font-medium transition-all duration-300
                    ${isDark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-neutral-800"}`}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
  );
}