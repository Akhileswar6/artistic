import React, { useState, useEffect } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, Legend
} from "recharts";
import { Calendar, Database, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Helper to format dates
const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

const generateFakeData = (days) => {
  const revenueTrends = [];
  const userGrowth = [];
  const messageTrends = [];

  for (let i = days; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateString = formatDate(d);

    // add some randomness
    const dailyRevenue = Math.floor(Math.random() * 5000) + 500;
    const newUsers = Math.floor(Math.random() * 15);
    const newMessages = Math.floor(Math.random() * 8);

    revenueTrends.push({ _id: dateString, revenue: dailyRevenue, count: Math.floor(Math.random() * 10) + 1 });
    userGrowth.push({ _id: dateString, count: newUsers });
    messageTrends.push({ _id: dateString, count: newMessages });
  }

  const artStyles = [
    { _id: "Anime", value: Math.floor(Math.random() * 50) + 10 },
    { _id: "Realistic", value: Math.floor(Math.random() * 40) + 10 },
    { _id: "Minimalist", value: Math.floor(Math.random() * 30) + 10 },
    { _id: "Abstract", value: Math.floor(Math.random() * 20) + 5 },
  ];

  const statuses = [
    { _id: "Pending", value: Math.floor(Math.random() * 20) + 5 },
    { _id: "In Progress", value: Math.floor(Math.random() * 15) + 5 },
    { _id: "Completed", value: Math.floor(Math.random() * 40) + 10 },
    { _id: "Cancelled", value: Math.floor(Math.random() * 5) + 1 },
  ];

  return { revenueTrends, userGrowth, messageTrends, artStyles, statuses };
};

export default function Analytics({ isDark }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);
  const [useFakeData, setUseFakeData] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#6366f1'];

  useEffect(() => {
    if (useFakeData) {
      setLoading(true);
      setTimeout(() => {
        setData(generateFakeData(days));
        setLoading(false);
      }, 500); // simulate network delay
    } else {
      fetchAnalytics();
    }
  }, [days, useFakeData]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API_BASE_URL}/api/admin/analytics?days=${days}`, {
        headers: { Authorization: token },
      });
      const result = await res.json();
      if (res.ok) {
        // If data is empty (no revenue, no users, etc), maybe show a toast
        setData(result);
      } else {
        toast.error("Failed to load analytics");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching analytics");
    } finally {
      setLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-3 rounded-lg border ${isDark ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-black/10 text-black'} shadow-xl`}>
          <p className="font-semibold mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-[13px]" style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'revenue' ? '₹' : ''}{entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 w-full max-w-7xl mx-auto space-y-6" style={{ fontFamily: "Inter, sans-serif" }}>

      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight" style={{ fontFamily: "Bricolage Grotesque" }}>
            Analytics Overview
          </h2>
          <p className={`text-[13px] ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            Track your business performance and user engagement.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Fake Data Toggle */}
          <button
            onClick={() => setUseFakeData(!useFakeData)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-colors ${useFakeData ? (isDark ? "bg-blue-500/20 border-blue-500/50 text-blue-400" : "bg-blue-50 border-blue-200 text-blue-600") : (isDark ? "bg-[#111] border-white/10 text-gray-400" : "bg-white border-gray-200 text-gray-500")}`}
            title="Toggle Demo Data"
          >
            <span className="text-[13px] font-medium hidden sm:inline">{useFakeData ? "Demo Data: ON" : "Demo Data: OFF"}</span>
          </button>

          {/* Date Range Selector */}
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-colors ${isDark ? "bg-[#111] border-white/10 hover:bg-white/5" : "bg-white border-gray-200 hover:bg-black/5"}`}
            >
              <Calendar size={16} className={isDark ? "text-gray-400" : "text-gray-500"} />
              <span className={`text-[13px] font-medium ${isDark ? "text-white" : "text-black"}`}>
                {days === 7 ? "Last 7 Days" : days === 30 ? "Last 30 Days" : days === 90 ? "Last 3 Months" : "Last 1 Year"}
              </span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''} ${isDark ? "text-gray-400" : "text-gray-500"}`} />
            </button>

            {isDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                <div className={`absolute right-0 mt-2 w-40 rounded-xl border shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 py-1 ${isDark ? "bg-[#1a1a1a] border-white/10" : "bg-white border-black/5"}`}>
                  {[
                    { label: "Last 7 Days", value: 7 },
                    { label: "Last 30 Days", value: 30 },
                    { label: "Last 3 Months", value: 90 },
                    { label: "Last 1 Year", value: 365 },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => { setDays(option.value); setIsDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-[13px] font-medium transition-colors
                        ${days === option.value 
                          ? "bg-blue-600 text-white" 
                          : (isDark ? "text-gray-300 hover:bg-white/10" : "text-gray-700 hover:bg-black/5")}
                      `}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-[60vh]">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : data ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Revenue Chart */}
          <div className={`p-6 rounded-2xl border ${isDark ? "bg-[#0a0a0a] border-white/5" : "bg-white border-black/5"} shadow-sm col-span-1 lg:col-span-2`}>
            <h3 className="text-[15px] font-medium mb-6">Revenue Over Time</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.revenueTrends}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#333" : "#eee"} />
                  <XAxis dataKey="_id" tick={{ fontSize: 12, fill: isDark ? "#888" : "#666" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: isDark ? "#888" : "#666" }} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User Growth Chart */}
          <div className={`p-6 rounded-2xl border ${isDark ? "bg-[#0a0a0a] border-white/5" : "bg-white border-black/5"} shadow-sm`}>
            <h3 className="text-[15px] font-medium mb-6">User Growth</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.userGrowth}>
                  <defs>
                    <linearGradient id="colorUserGrowth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#333" : "#eee"} />
                  <XAxis dataKey="_id" tick={{ fontSize: 12, fill: isDark ? "#888" : "#666" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: isDark ? "#888" : "#666" }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="smooth" dataKey="count" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorUserGrowth)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Messages Trends */}
          <div className={`p-6 rounded-2xl border ${isDark ? "bg-[#0a0a0a] border-white/5" : "bg-white border-black/5"} shadow-sm`}>
            <h3 className="text-[15px] font-medium mb-6">Messages Received</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.messageTrends}>
                  <defs>
                    <linearGradient id="colorMessageTrends" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#333" : "#eee"} />
                  <XAxis dataKey="_id" tick={{ fontSize: 12, fill: isDark ? "#888" : "#666" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: isDark ? "#888" : "#666" }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorMessageTrends)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Art Style Distribution */}
          <div className={`p-6 rounded-2xl border ${isDark ? "bg-[#0a0a0a] border-white/5" : "bg-white border-black/5"} shadow-sm`}>
            <h3 className="text-[15px] font-medium mb-6">Art Style Popularity</h3>
            <div className="h-[250px] w-full flex justify-center items-center">
              {data.artStyles && data.artStyles.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.artStyles}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      nameKey="_id"
                    >
                      {data.artStyles.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 text-[13px]">No data available</p>
              )}
            </div>
          </div>

          {/* Order Status Distribution */}
          <div className={`p-6 rounded-2xl border ${isDark ? "bg-[#0a0a0a] border-white/5" : "bg-white border-black/5"} shadow-sm`}>
            <h3 className="text-[15px] font-medium mb-6">Order Statuses</h3>
            <div className="h-[250px] w-full">
              {data.statuses && data.statuses.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.statuses} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke={isDark ? "#333" : "#eee"} />
                    <XAxis type="number" tick={{ fontSize: 12, fill: isDark ? "#888" : "#666" }} tickLine={false} axisLine={false} allowDecimals={false} />
                    <YAxis dataKey="_id" type="category" width={100} tick={{ fontSize: 12, fill: isDark ? "#888" : "#666" }} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: isDark ? '#ffffff0a' : '#0000000a' }} />
                    <Bar dataKey="value" fill="#f59e0b" radius={[0, 4, 4, 0]}>
                      {data.statuses.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[(index + 4) % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-500 text-[13px]">No data available</p>
                </div>
              )}
            </div>
          </div>

        </div>
      ) : null}

    </div>
  );
}
