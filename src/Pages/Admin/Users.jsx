import { useEffect, useState, useRef } from "react";
import { RefreshCcw, Search, ChevronDown, CheckCircle2, Ban, ShieldAlert } from "lucide-react";
import AdminLayout from "../../Layout/AdminLayout";

export default function Users({ isDark }) {
  const dropdownRef = useRef(null);

  const [openFilter, setOpenFilter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

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

    const res = await fetch("http://localhost:5000/api/admin/users", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    });

    const data = await res.json();
    setUsers(data);

  } catch (err) {
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
      const res = await fetch("http://localhost:5000/api/admin/block-users", {
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
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
      <div style={{ fontFamily: "Inter, sans-serif" }} className="animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* Header */}
        <div className="mb-4">
          <h1 className={`text-xl font-semibold tracking-tight ${isDark ? "text-white" : "text-black"}`} style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
            Users
          </h1>
        </div>

        {/* Container */}
        <div className={`rounded-2xl overflow-hidden shadow-lg border transition-all duration-300
          ${isDark 
            ? "bg-black border-white/10" 
            : "bg-white border-black/5"}`}>

          {/* Search + Filters */}
          <div className={`flex flex-col md:flex-row gap-4 px-4 py-3 border-b 
            ${isDark ? "border-white/10" : "border-black/5"}`}>

            {/* Search Input */}
            <div className="relative w-full md:w-[260px]">
              <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
              <input
                type="text"
                placeholder="Search by name or email"
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
                {statusFilter === "all" && "All Users"}
                {statusFilter === "24h" && "Last 24 Hours"}
                {statusFilter === "3d" && "Last 3 Days"}
                {statusFilter === "7d" && "Last 1 Week"}
                {statusFilter === "30d" && "Last 1 Month"}
                <ChevronDown className="w-3.5 h-3.5 opacity-50" />
              </button>

              {openFilter && (
                <div className={`absolute mt-1.5 w-full rounded-lg shadow-2xl z-50 text-xs border overflow-hidden
                  ${isDark ? "bg-[#0a0a0a] border-white/10" : "bg-white/90 backdrop-blur-xl border-black/10"}`}>
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
                      className={`flex justify-between items-center px-3 py-2 cursor-pointer transition-colors
                        ${isDark 
                          ? "hover:bg-white/10 text-gray-200" 
                          : "hover:bg-black/5 text-gray-800"}`}
                    >
                      <span className="font-medium">{item.label}</span>
                      {statusFilter === item.value && (
                        <CheckCircle2 className={`w-3.5 h-3.5 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="ml-auto flex items-center gap-3">


              <button
                onClick={fetchUsers}
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

                  <th
                    onClick={() => {
                      if (sortField === "name") setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
                      else { setSortField("name"); setSortOrder("asc"); }
                    }}
                    className="px-4 py-3 text-left font-normal text-[13px] cursor-pointer hover:text-blue-500 transition-colors"
                  >
                    Name {sortField === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="px-4 py-3 text-left font-normal text-[13px]">Email</th>
                  <th
                    onClick={() => {
                      if (sortField === "date") setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
                      else { setSortField("date"); setSortOrder("desc"); }
                    }}
                    className="px-4 py-3 text-left font-normal text-[13px] cursor-pointer hover:text-blue-500 transition-colors"
                  >
                    Joined {sortField === "date" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="px-4 py-3 text-center font-normal text-[13px]">Status</th>
                  <th className="px-4 py-3 text-center font-normal text-[13px]">Details</th>
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


                      <td className={`px-4 py-2.5 tracking-tight ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                        {user.fullName || "N/A"}
                      </td>

                      <td className={`px-4 py-2.5 font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                        {user.email}
                      </td>

                      <td className={`px-4 py-2.5 font-medium uppercase tracking-wider text-[11px] ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>

<td className="px-4 py-2.5 text-center">
  {user.isBlocked ? (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium
    bg-red-500/10 text-red-500 border border-red-500/20">
      
      <span className="w-1 h-1 rounded-full bg-red-500"></span>
      Blocked
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium
    bg-green-500/10 text-green-500 border border-green-500/20">
      
      <span className="w-1 h-1 rounded-full bg-green-500"></span>
      Active
    </span>
  )}
</td>

                      <td className="px-4 py-2.5 text-center">
                        <button
                          onClick={() => openUser(user)}
                          className={` text-xs transition-all duration-300 hover:scale-105 ${isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"}`}
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
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-in fade-in duration-200">
            <div className={`w-[400px] rounded-2xl p-6 shadow-2xl border relative overflow-hidden animate-in zoom-in-95 duration-200
              ${isDark ? "bg-black border-white/10 text-white" : "bg-white border-black/10 text-black"}`}>


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