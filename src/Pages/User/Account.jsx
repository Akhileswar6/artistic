import { useEffect, useState } from "react";
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
      const res = await fetch(`http://localhost:5000/api/auth/stats/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
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
          <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${isDark ? "bg-white/5" : "bg-black/5"}`}>
            <User size={32} className="opacity-20" />
          </div>
          <p className="text-lg font-medium opacity-50">Please login to view your account</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-28 md:pt-32 pb-24 px-6 transition-colors duration-300 ${isDark ? "bg-[#0b0c10] text-white" : "bg-gray-50 text-black"}`} style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="max-w-4xl mx-auto space-y-8">


        {/* Account Information */}
        <div className={`p-8 rounded-3xl border transition-all duration-300 ${isDark ? "bg-[#111111] border-white/5" : "bg-white border-black/5 shadow-sm"
          }`}>
          <h3 className="text-[20px] mb-8  gap-3" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
            Account Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-lg ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
                <User size={20} className="opacity-60" />
              </div>
              <div>
                <p className={`text-[11px] uppercase tracking-wider  opacity-40`}>Full Name</p>
                <p className="text-[16px] capitalize font-medium">{user.fullName}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-lg ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
                <Mail size={20} className="opacity-60" />
              </div>
              <div>
                <p className={`text-[11px] uppercase tracking-wider  opacity-40`}>Email Address</p>
                <p className="text-[16px] font-medium">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-lg ${isDark ? "bg-white/5" : "bg-gray-100 "}`}>
                <Calendar size={20} className="opacity-60" />
              </div>
              <div>
                <p className={`text-[11px] uppercase tracking-wider  opacity-40`}>Member Since</p>
                <p className="text-[16px] font-medium">{new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-6">
          {[
            { label: "Total Orders", value: stats.orders, icon: ShoppingBag, color: "text-blue-500", desc: "Manage your art commissions" },
            { label: "Notifications", value: stats.notifications, icon: Bell, color: "text-purple-500", desc: "Stay updated on your progress" }
          ].map((item, i) => (
            <div key={i} className={`p-7 rounded-3xl border transition-all duration-300 hover:scale-[1.02] ${isDark ? "bg-[#111111] border-white/5" : "bg-white border-black/5 shadow-sm"}`}>
              <div className="flex justify-between items-start mb-6">
                <div className={`${item.color}`}>
                  <item.icon size={24} />
                </div>
                <p className="text-4xl " style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>{item.value}</p>
              </div>
              <div>
                <p className="text-[14px] uppercase tracking-wider mb-1">{item.label}</p>
                <p className="text-xs opacity-30">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Security & Preferences */}
        <div className={`p-8 rounded-3xl border transition-all duration-300 ${isDark ? "bg-[#111111] border-white/5" : "bg-white border-black/5 shadow-sm"
          }`}>
          <h3 className="text-[20px] mb-6  gap-2" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
            Security & Preferences
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button onClick={() => toast("Security settings are currently managed via OTP", { icon: '🛡️' })} className={`p-4 rounded-xl flex items-center justify-between group transition-all cursor-pointer ${isDark ? "bg-white/5 hover:bg-white/10" : "bg-gray-50 hover:bg-gray-100"
              }`}>
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg bg-blue-500/10 text-blue-500`}>
                  <ShieldCheck size={22} />
                </div>
                <div className="text-left">
                  <p className="text-sm ">Password & Security</p>
                  <p className="text-[11px] opacity-40">Manage your login methods</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                <ArrowRight size={18} />
              </div>
            </button>

            <button onClick={() => toast.success("Preferences saved (simulation)")} className={`p-4 rounded-xl flex items-center justify-between group transition-all cursor-pointer ${isDark ? "bg-white/5 hover:bg-white/10" : "bg-gray-50 hover:bg-gray-100"
              }`}>
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg bg-neutral-500/10 text-neutral-500`}>
                  <Settings size={20} />
                </div>
                <div className="text-left">
                  <p className="text-sm ">Preferences</p>
                  <p className="text-[11px] opacity-40">Customize your experience</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                <ArrowRight size={18} />
              </div>
            </button>
          </div>

          <div className={`mt-8 p-4 rounded-xl border border-dashed ${isDark ? "border-white/10 bg-white/5" : "border-black/10 bg-gray-50"}`}>
            <p className="text-[12px] opacity-50 leading-relaxed text-center">
              Your privacy is important to us. We never share your personal data with third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}