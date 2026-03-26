// src/Pages/User/Notifications.jsx
import { CheckCheck } from "lucide-react";
import { useEffect, useState } from "react";

export default function Notifications({ isDark }) {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");

  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ Fetch notifications from backend
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

  // ✅ Filter logic
  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "read") return n.read;
    return true;
  });

  // ✅ Mark all as read
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

  // ✅ Mark single notification as read
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

   <div
      className={`p-6 max-w-5xl mx-auto transition-colors duration-300 ${
        isDark ? "bg-black text-white" : "bg-white text-black"
      }`}
      style={{ fontFamily: "Inter, serif" }}
    >

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold" style={{ fontFamily: "Playfair Display, serif" }}>
          Notifications
        </h1>

        <button
          onClick={markAllAsRead}
          className="text-blue-400 text-sm flex transition-opacity opacity-80 cursor-pointer"
        >
          <CheckCheck className="w-4 h-4 mr-1" />
          Mark all as read
        </button>
      </div>

      {/* Tabs */}
      <div className="flex text-sm gap-6 border-b border-neutral-700 mb-4">
        <button
          onClick={() => setFilter("all")}
          className={`pb-2 ${
            filter === "all" ? "border-b-2 border-blue-500" : ""
          }`}
        >
          All
        </button>

        <button
          onClick={() => setFilter("unread")}
          className={`pb-2 ${
            filter === "unread" ? "border-b-2 border-blue-500" : ""
          }`}
        >
          Unread
        </button>

        <button
          onClick={() => setFilter("read")}
          className={`pb-2 ${
            filter === "read" ? "border-b-2 border-blue-500" : ""
          }`}
        >
          Read
        </button>
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <p className="text-gray-400 text-center">No notifications</p>
        ) : (
          filteredNotifications.map((n) => (
            <div
              key={n._id}
              onClick={() => markAsRead(n._id)}
              className={`p-4 rounded-lg border transition cursor-pointer ${
                n.read
                  ? "bg-[#1c1c1c] border-neutral-800"
                  : "bg-[#262626] border-blue-500"
              }`}
            >
              <h2 className="font-medium">{n.title}</h2>
              <p className="text-sm text-gray-400 mt-1">{n.message}</p>

              <p className="text-xs text-gray-500 mt-2">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}