import React, { useEffect, useState } from "react";
import AdminLayout from "../../Layout/AdminLayout";
import { useNavigate } from "react-router-dom";
import {
  Users,
  MessageCircle,
  ShoppingBag,
  IndianRupee,
  BadgeAlert,
  Package,
  CheckCircle,
  Clock,
  Truck,
  Box,
  TrendingUp,
  PieChart as PieChartIcon,
  Activity as ActivityIcon,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

export default function Dashboard({ isDark }) {
  const [counts, setCounts] = useState({ users: 0, messages: 0, orders: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [analytics, setAnalytics] = useState({
    revenueTrends: [],
    artStyles: [],
    statuses: [],
    userGrowth: [],
    messageTrends: []
  });
  const [activities, setActivities] = useState([]);
  const [chartReady, setChartReady] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchRecentOrders();
    fetchAnalytics();
    fetchActivities();
    // Delay chart rendering until layout is painted
    const timer = setTimeout(() => setChartReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("http://localhost:5000/api/admin/stats-summary", {
        headers: { Authorization: token },
      });
      if (res.ok) {
        const data = await res.json();
        setCounts({
          users: data.users || 0,
          messages: data.messages || 0,
          orders: data.orders || 0,
          revenue: data.revenue || 0,
        });
      }
    } catch (err) {
      console.error("Fetch stats failed:", err);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("http://localhost:5000/api/orders/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setRecentOrders(data.slice(0, 5));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("http://localhost:5000/api/admin/analytics", {
        headers: { Authorization: token },
      });
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("http://localhost:5000/api/admin/activities", {
        headers: { Authorization: token },
      });
      if (res.ok) {
        const data = await res.json();
        setActivities(data.slice(0, 5));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const stats = [
    { title: "Total Users", value: counts.users.toLocaleString(), icon: <Users size={22} />, color: "blue", gradient: "from-blue-500/20 to-blue-500/5", border: "border-blue-500/20", textColor: "text-blue-400", iconBg: "bg-blue-500/10" },
    { title: "Messages", value: counts.messages.toLocaleString(), icon: <MessageCircle size={22} />, color: "purple", gradient: "from-purple-500/20 to-purple-500/5", border: "border-purple-500/20", textColor: "text-purple-400", iconBg: "bg-purple-500/10" },
    { title: "Total Orders", value: counts.orders.toLocaleString(), icon: <ShoppingBag size={22} />, color: "orange", gradient: "from-orange-500/20 to-orange-500/5", border: "border-orange-500/20", textColor: "text-orange-400", iconBg: "bg-orange-500/10" },
    { title: "Revenue", value: `₹${counts.revenue.toLocaleString()}`, icon: <IndianRupee size={22} />, color: "emerald", gradient: "from-emerald-500/20 to-emerald-500/5", border: "border-emerald-500/20", textColor: "text-emerald-400", iconBg: "bg-emerald-500/10" },
  ];

  const statusStyles = {
    Pending: { icon: <Clock size={12} />, dark: "bg-amber-500/10 text-amber-400 border border-amber-500/20", light: "bg-amber-100 text-amber-700 border border-amber-200" },
    Accepted: { icon: <CheckCircle size={12} />, dark: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20", light: "bg-indigo-100 text-indigo-700 border border-indigo-200" },
    "In Progress": { icon: <Clock size={12} />, dark: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20", light: "bg-yellow-100 text-yellow-700 border border-yellow-200" },
    Shipped: { icon: <Truck size={12} />, dark: "bg-purple-500/10 text-purple-400 border border-purple-500/20", light: "bg-purple-100 text-purple-700 border border-purple-200" },
    Delivered: { icon: <Box size={12} />, dark: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20", light: "bg-emerald-100 text-emerald-700 border border-emerald-200" },
  };

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#6366f1", "#8b5cf6", "#ec4899"];

  return (
    <div style={{ fontFamily: "Inter, sans-serif" }} className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">

      {/* HEADER */}
      <div className="mb-8">

        <p className={` text-[14px] flex items-center gap-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          Welcome back, <span className=" text-blue-500  underline underline-offset-4 decoration-white/10">Akhileswar👋</span>
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, index) => (
          <div key={index} className={`relative group p-4 rounded-[20px] border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden ${isDark ? `bg-gradient-to-br ${item.gradient} backdrop-blur-[30px] ${item.border}` : `bg-white border-black/5 shadow-md shadow-black/5 backdrop-blur-xl`}`}>
            <div className="relative z-10 flex flex-col">
              <div className={`w-9 h-9 flex items-center justify-center rounded-xl mb-3 border transition-transform duration-500 group-hover:scale-105 shadow-inner ${isDark ? `${item.iconBg} ${item.border} ${item.textColor}` : `bg-white border-black/5 shadow-sm ${item.textColor}`}`}>
                {React.cloneElement(item.icon, { size: 18 })}
              </div>
              <div className="flex flex-col">
                <span className={`text-[14px] mb-0.5 ${isDark ? "text-gray-400" : "text-black"}`}>{item.title}</span>
                <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-black"} tracking-tight`}>{item.value}</h2>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS SECTION - ROW 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

        {/* REVENUE TRENDS CHART */}
        <div className={`p-6 rounded-xl border ${isDark ? "bg-black/40 border-white/10 shadow-xl" : "bg-white border-black/5 shadow-lg"}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg  flex items-center gap-2 ${isDark ? "text-white" : "text-black"}`}>
              <TrendingUp size={18} className="text-blue-500" /> Revenue Trends
            </h3>
            <span className="text-xs text-gray-400 uppercase tracking-widest underline decoration-blue-500/20 underline-offset-4 decoration-2">Last 7 Days</span>
          </div>
          <div className="h-[250px] w-full">
            {chartReady && <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={analytics.revenueTrends}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#ffffff0a" : "#0000000a"} />
                <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: isDark ? '#9ca3af' : '#6b7280' }} tickFormatter={(str) => str.split('-').slice(1).join('/')} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: isDark ? '#9ca3af' : '#6b7280' }} />
                <Tooltip contentStyle={{ backgroundColor: isDark ? '#000' : '#fff', border: isDark ? '1px solid #ffffff1a' : '1px solid #0000001a', borderRadius: '12px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>}
          </div>
        </div>

        {/* ART STYLE DISTRIBUTION */}
        <div className={`p-6 rounded-xl border ${isDark ? "bg-black/40 border-white/10 shadow-xl" : "bg-white border-black/5 shadow-lg"}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg flex items-center gap-2 ${isDark ? "text-white" : "text-black"}`}>
              <PieChartIcon size={18} className="text-emerald-500" /> Style Distribution
            </h3>
            <span className="text-xs text-gray-400 uppercase tracking-widest underline decoration-emerald-500/20 underline-offset-4 decoration-2">Order Types</span>
          </div>
          <div className="h-[250px] w-full flex items-center justify-center">
            {chartReady && <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={analytics.artStyles} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" nameKey="_id">
                  {analytics.artStyles.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: isDark ? '#000' : '#fff', border: isDark ? '1px solid #ffffff1a' : '1px solid #0000001a', borderRadius: '12px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>}
            <div className="flex flex-col gap-2 ml-4">
              {analytics.artStyles.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-xs font-medium text-gray-400">{entry._id}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* CHARTS SECTION - ROW 2 (NEW) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

        {/* USER GROWTH CHART */}
        <div className={`p-6 rounded-xl border ${isDark ? "bg-black/40 border-white/10 shadow-xl" : "bg-white border-black/5 shadow-lg"}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg flex items-center gap-2 ${isDark ? "text-white" : "text-black"}`}>
              <Users size={18} className="text-purple-500" /> User Growth
            </h3>
            <span className="text-xs text-gray-400 uppercase tracking-widest underline decoration-purple-500/20 underline-offset-4 decoration-2">New Registrations</span>
          </div>
          <div className="h-[250px] w-full">
            {chartReady && <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analytics.userGrowth || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#ffffff0a" : "#0000000a"} />
                <XAxis
                  dataKey="_id"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: isDark ? '#9ca3af' : '#6b7280' }}
                  tickFormatter={(str) => {
                    if (!str || typeof str !== 'string') return '';
                    const parts = str.split('-');
                    return parts.length >= 2 ? parts.slice(1).join('/') : str;
                  }}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: isDark ? '#9ca3af' : '#6b7280' }} />
                <Tooltip cursor={{ fill: isDark ? '#ffffff05' : '#00000005' }} contentStyle={{ backgroundColor: isDark ? '#000' : '#fff', border: isDark ? '1px solid #ffffff1a' : '1px solid #0000001a', borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>}
          </div>
        </div>

        {/* MESSAGE TRENDS CHART */}
        <div className={`p-6 rounded-xl border ${isDark ? "bg-black/40 border-white/10 shadow-xl" : "bg-white border-black/5 shadow-lg"}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg flex items-center gap-2 ${isDark ? "text-white" : "text-black"}`}>
              <MessageCircle size={18} className="text-orange-500" /> Message Trends
            </h3>
            <span className="text-xs text-gray-400 uppercase tracking-widest underline decoration-orange-500/20 underline-offset-4 decoration-2">Inbound Queries</span>
          </div>
          <div className="h-[250px] w-full">
            {chartReady && <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analytics.messageTrends || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#ffffff0a" : "#0000000a"} />
                <XAxis
                  dataKey="_id"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: isDark ? '#9ca3af' : '#6b7280' }}
                  tickFormatter={(str) => {
                    if (!str || typeof str !== 'string') return '';
                    const parts = str.split('-');
                    return parts.length >= 2 ? parts.slice(1).join('/') : str;
                  }}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: isDark ? '#9ca3af' : '#6b7280' }} />
                <Tooltip
                  cursor={{ fill: isDark ? '#ffffff05' : '#00000005' }}
                  contentStyle={{ backgroundColor: isDark ? '#000' : '#fff', border: isDark ? '1px solid #ffffff1a' : '1px solid #0000001a', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>}
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">

        {/* RECENT ORDERS TABLE (WIDER) */}
        <div className={`xl:col-span-2 rounded-xl border overflow-hidden ${isDark ? "bg-black/40 border-white/10 shadow-2xl" : "bg-white border-black/5 shadow-lg"}`}>
          <div className={`px-5 py-4 border-b flex items-center justify-between ${isDark ? "border-white/10" : "border-black/5"}`}>
            <h2 className={`text-lg ${isDark ? "text-white" : "text-black"}`}>Recent Orders</h2>
            <button onClick={() => navigate("/admin/userOrders")} className="text-[12px] text-blue-500  hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className={`text-[13px] font-normal  ${isDark ? "text-gray-500 " : "text-gray-400 bg-gray-50/50"}`}>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Project</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentOrders.map((order) => {
                  const status = order.status.charAt(0).toUpperCase() + order.status.slice(1);
                  const style = statusStyles[status] || statusStyles["Pending"];
                  return (
                    <tr key={order._id} className={`${isDark ? "hover:bg-white/5" : "hover:bg-gray-50"} transition-colors`}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[13px] ${isDark ? "bg-white/10 text-white" : "bg-black/10 text-black"}`}>
                            {order.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{order.name}</p>
                            <p className="text-[11px] text-gray-500 truncate max-w-[120px]">{order.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-sm font-medium">{order.artStyle}</p>
                        <p className="text-[10px] text-gray-500 uppercase">#{order._id.slice(-6)}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider ${isDark ? style.dark : style.light}`}>
                          {style.icon} {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right font-bold text-sm">₹{order.totalPrice}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ACTIVITY LOG (SIDEBAR) */}
        <div className={`rounded-xl border ${isDark ? "bg-black/40 border-white/10 shadow-2xl" : "bg-white border-black/5 shadow-lg"}`}>
          <div className={`px-5 py-4 border-b flex items-center justify-between ${isDark ? "border-white/10" : "border-black/5"}`}>
            <h2 className={`text-lg ${isDark ? "text-white" : "text-black"}`}>Activity Log</h2>
            <ActivityIcon size={16} className="text-gray-500" />
          </div>
          <div className="p-4 space-y-4">
            {activities.length === 0 ? (
              <p className="text-center text-xs text-gray-500 py-10 underline underline-offset-4 decoration-white/10 decoration-2">No recent activity.</p>
            ) : activities.map((act) => (
              <div key={act._id} className="flex gap-3 items-start animate-in fade-in slide-in-from-right-4 duration-500 ease-out">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                <div>
                  <p className={`text-[13px] font-medium ${isDark ? "text-white" : "text-black"}`}>
                    <span className="text-blue-500 font-bold  underline decoration-blue-500/20 underline-offset-4 decoration-2">{act.adminName}</span> {act.action}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{act.details}</p>
                  <p className="text-[10px] text-gray-600 mt-1">{new Date(act.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}