import { CheckCheck, Bell, Info, Calendar, Filter } from "lucide-react";
import { useEffect, useState } from "react";

export default function Notifications({ isDark }) {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/notifications/${user._id}`
        );
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };
    if (user) fetchNotifications();
  }, []);

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "read") return n.read;
    return true;
  });

  const markAllAsRead = async () => {
    try {
      await fetch(`http://localhost:5000/api/notifications/mark-all/${user._id}`, {
        method: "PUT",
      });
      const updated = notifications.map((n) => ({ ...n, read: true }));
      setNotifications(updated);
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/notifications/${id}`, {
        method: "PUT",
      });
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, read: true } : n
        )
      );
    } catch (err) {
      console.error("Error updating notification:", err);
    }
  };

  return (
    <div className={`min-h-screen pt-12 pb-24 px-6 transition-colors duration-300 ${isDark ? "bg-[#0b0c10] text-white" : "bg-gray-50 text-black"}`} style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
              Notifications
            </h1>
            <p className={`text-sm mt-1 opacity-50`}>Stay updated with your account activity</p>
          </div>
          
          <button
            onClick={markAllAsRead}
            disabled={notifications.filter(n => !n.read).length === 0}
            className={`px-5 py-2 rounded-full font-medium text-[13px] flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isDark ? "bg-white/5 border border-white/10 hover:bg-white/10" : "bg-white border border-black/5 shadow-sm hover:bg-gray-50"
            } disabled:opacity-30 disabled:cursor-not-allowed`}
          >
            <CheckCheck size={16} className="text-blue-500" />
            Mark all as read
          </button>
        </div>

        {/* Filter Tabs */}
        <div className={`p-1.5 rounded-2xl flex items-center gap-1 transition-all ${isDark ? "bg-white/5" : "bg-gray-200/50 shadow-inner"}`}>
          {["all", "unread", "read"].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`flex-1 py-2 px-4 rounded-xl text-[13px] font-bold capitalize transition-all cursor-pointer ${
                filter === t
                  ? (isDark ? "bg-[#1c1c1c] text-white shadow-lg shadow-black/20" : "bg-white text-black shadow-sm")
                  : (isDark ? "text-gray-500 hover:text-gray-300" : "text-gray-500 hover:text-black")
              }`}
            >
              {t} {t === 'unread' && notifications.filter(n => !n.read).length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 bg-blue-500 text-white text-[10px] rounded-full">{notifications.filter(n => !n.read).length}</span>
              )}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className={`py-20 text-center rounded-[32px] border border-dashed ${isDark ? "border-white/10 bg-white/5" : "border-black/5 bg-white"}`}>
              <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 opacity-20">
                <Bell size={32} />
              </div>
              <p className="text-sm font-medium opacity-50">No notifications to show</p>
            </div>
          ) : (
            filteredNotifications.map((n) => (
              <div
                key={n._id}
                onClick={() => !n.read && markAsRead(n._id)}
                className={`group relative p-6 rounded-[24px] border transition-all duration-300 ${
                  n.read
                    ? (isDark ? "bg-[#111111] border-white/5 opacity-60" : "bg-white/50 border-black/5 opacity-70")
                    : (isDark ? "bg-[#1c1c1c] border-blue-500/50 shadow-[0_10px_30px_rgba(59,130,246,0.1)]" : "bg-white border-blue-500 shadow-sm shadow-blue-500/10")
                }`}
              >
                {!n.read && (
                  <div className="absolute top-6 left-0 w-1 h-8 bg-blue-500 rounded-r-full" />
                )}
                
                <div className="flex gap-4">
                  <div className={`mt-1 h-10 w-10 flex-shrink-0 rounded-xl flex items-center justify-center ${
                    n.read 
                      ? (isDark ? "bg-white/5" : "bg-gray-100") 
                      : "bg-blue-500/10 text-blue-500"
                  }`}>
                    <Info size={20} />
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className={`font-bold tracking-tight text-[15px] ${isDark ? "text-white" : "text-black"}`} style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
                        {n.title}
                      </h2>
                      <div className="flex items-center gap-1.5 opacity-40 text-[11px] font-medium uppercase tracking-wider">
                        <Calendar size={12} />
                        {new Date(n.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <p className={`text-[14px] leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      {n.message}
                    </p>
                    
                    <p className="pt-2 text-[11px] opacity-30 font-medium italic">
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}