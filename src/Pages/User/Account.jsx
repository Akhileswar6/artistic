import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config";
import { User, Mail, Calendar, ShieldCheck, Settings, ShoppingBag, Bell, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function Account({ isDark }) {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ orders: 0, notifications: 0 });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      fetchStats(storedUser._id);
    }
  }, []);

  const fetchStats = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/auth/stats/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  if (!user) {
    return (
      <div className={`min-h-[60vh] flex items-center justify-center ${isDark ? "text-white" : "text-black"}`}>
        <div className="text-center space-y-4">
          <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center backdrop-blur-xl ${isDark ? "bg-white/5 border border-white/10" : "bg-white/60 border border-black/10"}`}>
            <User size={32} className="opacity-20" />
          </div>
          <p className="text-lg font-medium opacity-50">Please login to view your account</p>
        </div>
      </div>
    );
  }

  /* ── shared glass class helper ── */
  const glass = isDark
    ? "bg-white/[0.04] backdrop-blur-2xl border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_8px_40px_rgba(0,0,0,0.4)]"
    : "bg-white/60 backdrop-blur-2xl border border-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_8px_40px_rgba(0,0,0,0.08)]";

  const glassInner = isDark
    ? "bg-white/[0.04] backdrop-blur-xl border border-white/8 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
    : "bg-white/50 backdrop-blur-xl border border-white/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]";

  return (
    <div
      className={`min-h-screen pt-24 md:pt-32 pb-24 px-4 md:px-6 transition-colors duration-300 ${isDark ? "bg-[#0a0a0b] text-white" : "bg-[#f0f4f8] text-black"}`}
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="max-w-4xl mx-auto space-y-5 md:space-y-6">

        {/* ── Account Details Card ── */}
        <div className={`p-6 md:p-8 rounded-3xl relative overflow-hidden ${glass}`}>

          <div className="relative z-10">
            {/* Avatar + title row */}
            <div className="flex items-center gap-4 mb-8">
              <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center shrink-0 ${isDark ? "bg-white/8 border border-white/10" : "bg-white/70 border border-white/80 shadow-sm"}`}>
                <User size={24} className="opacity-60" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-semibold" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
                  Account Details
                </h3>
                <p className={`text-[11px] uppercase tracking-wider mt-0.5 ${isDark ? "text-white/30" : "text-black/30"}`}>Your profile information</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Full Name */}
              <div className={`p-4 rounded-2xl ${glassInner}`}>
                <div className="flex items-center gap-2 mb-2">
                  <User size={14} className="opacity-40" />
                  <p className="text-[11px] uppercase  opacity-40">Full Name</p>
                </div>
                <p className="text-sm md:text-[15px]  capitalize">{user.fullName}</p>
              </div>

              {/* Email */}
              <div className={`p-4 rounded-2xl ${glassInner}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Mail size={14} className="opacity-40" />
                  <p className="text-[11px] uppercase  opacity-40">Email Address</p>
                </div>
                <p className="text-sm md:text-[15px] truncate">{user.email}</p>
              </div>

              {/* Member Since */}
              <div className={`p-4 rounded-2xl ${glassInner}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={14} className="opacity-40" />
                  <p className="text-[11px] uppercase  opacity-40">Member Since</p>
                </div>
                <p className="text-sm md:text-[15px] ">
                  {new Date(user.createdAt || Date.now()).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
          {[
            { label: "Total Orders", value: stats.orders, icon: ShoppingBag },
            { label: "Notifications", value: stats.notifications, icon: Bell }
          ].map((item, i) => (
            <div
              key={i}
              className={`p-6 md:p-7 rounded-3xl relative overflow-hidden transition-all duration-300 hover:scale-[1.015] ${glass}`}
            >
              <div className="relative z-10 flex justify-between items-start mb-6">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${isDark ? "bg-white/5 border-white/10" : "bg-white/70 border-black/8 shadow-sm"}`}>
                  <item.icon size={18} className="opacity-60" />
                </div>
                <p className="text-4xl md:text-5xl font-bold tracking-tight" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>{item.value}</p>
              </div>
              <p className="text-xs md:text-sm uppercase tracking-wider font-medium opacity-70">{item.label}</p>
            </div>
          ))}
        </div>

        {/* ── Security & Preferences ── */}
        <div className={`p-6 md:p-8 rounded-3xl relative overflow-hidden ${glass}`}>


          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center shrink-0 ${isDark ? "bg-white/8 border border-white/10" : "bg-white/70 border border-white/80 shadow-sm"}`}>
                <ShieldCheck size={22} className="opacity-60" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-semibold" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
                  Security & Preferences
                </h3>
                <p className={`text-[11px] uppercase tracking-wider mt-0.5 ${isDark ? "text-white/30" : "text-black/30"}`}>Manage your account settings</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                {
                  icon: ShieldCheck,
                  title: "Password & Security",
                  desc: "Manage your login methods",
                  onClick: () => toast("Security settings are currently managed via OTP", { icon: "🛡️" })
                },
                {
                  icon: Settings,
                  title: "Preferences",
                  desc: "Customize your experience",
                  onClick: () => toast.success("Preferences saved (simulation)")
                }
              ].map((btn, i) => (
                <button
                  key={i}
                  onClick={btn.onClick}
                  className={`p-4 md:p-5 rounded-2xl flex items-center justify-between group transition-all duration-300 text-left cursor-pointer ${glassInner} hover:scale-[1.01]`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isDark ? "bg-white/8 border border-white/10" : "bg-white/80 border border-black/8 shadow-sm"}`}>
                      <btn.icon size={17} className="opacity-60" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{btn.title}</p>
                      <p className="text-[11px] opacity-40">{btn.desc}</p>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-8px] group-hover:translate-x-0">
                    <ArrowRight size={16} className="opacity-50" />
                  </div>
                </button>
              ))}
            </div>

            {/* Privacy note */}
            <div className={`mt-5 p-4 rounded-2xl border border-dashed text-center ${isDark ? "border-white/10 bg-white/[0.02]" : "border-black/10 bg-black/[0.02]"}`}>
              <p className="text-[11px] md:text-xs opacity-40 leading-relaxed">
                Your privacy is important to us. We never share your personal data with third parties.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}