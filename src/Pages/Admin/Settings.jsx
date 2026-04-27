import { useState, useEffect } from "react";
import { User, Lock, Save, LogOut, Shield } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Settings({ isDark }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);

  // Form States
  const [profile, setProfile] = useState({
    email: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });


  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/profile", {
        headers: { Authorization: localStorage.getItem("adminToken") },
      });
      if (res.ok) {
        const data = await res.json();
        setProfile({
          email: data.email || "",
        });
      }
    } catch (err) {
      toast.error("Failed to load profile");
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/admin/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("adminToken"),
        },
        body: JSON.stringify({ email: profile.email }),
      });
      if (res.ok) {
        toast.success("Profile updated successfully");
        fetchProfile();
      } else {
        toast.error("Failed to update profile");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };


  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/admin/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("adminToken"),
        },
        body: JSON.stringify({
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Password updated successfully");
        setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        toast.error(data.message || "Failed to update password");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-3 px-4 py-3 rounded-[16px] transition-all duration-300 w-full text-left
        ${activeTab === id 
          ? isDark 
            ? "bg-white text-black shadow-2xl scale-[1.02]" 
            : "bg-black text-white shadow-lg scale-[1.02]"
          : isDark 
            ? "text-gray-400 hover:bg-white/5" 
            : "text-gray-500 hover:bg-black/5"
        }`}
    >
      <Icon size={18} />
      <span className="text-[14px] font-medium">{label}</span>
    </button>
  );

  return (
    <div style={{ fontFamily: "Inter, sans-serif" }} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="mb-6">
        <h1 className={`text-2xl font-semibold tracking-tight ${isDark ? "text-white" : "text-black"}`} style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
          Admin Settings
        </h1>
        <p className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          Manage your essential security and profile details.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
        
        {/* Sidebar Tabs */}
        <div className="space-y-2">
          <TabButton id="profile" label="Update Email" icon={User} />
          <TabButton id="security" label="Change Password" icon={Lock} />
        </div>

        {/* Content Area */}
        <div className={`rounded-3xl p-8 shadow-2xl border transition-all duration-500
          ${isDark 
            ? "bg-black/40 backdrop-blur-[40px] border-white/10" 
            : "bg-white border-black/5"}`}>
          
          <div className="max-w-2xl">
            {/* PROFILE SECTION */}
            {activeTab === "profile" && (
              <form onSubmit={handleProfileUpdate} className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
                <h3 className="text-xl font-semibold" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>Contact Information</h3>

                <div className="space-y-1.5">
                  <label className={`text-[12px] font-bold uppercase tracking-wider ${isDark ? "text-gray-500" : "text-gray-400"}`}>Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    placeholder="Enter new admin email"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:ring-2 outline-none
                      ${isDark ? "bg-white/5 border-white/10 text-white focus:ring-blue-500/30" : "bg-gray-50 border-black/5 text-black focus:ring-blue-500/20"}`}
                  />
                  <p className="text-[10px] opacity-70 mt-1 italic">This email will be used for logins and OTP verifications.</p>
                </div>

                <div className="pt-4 border-t border-dashed border-gray-500/20">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex items-center gap-2 px-8 py-2.5 rounded-xl font-bold transition-all transform hover:scale-[1.02] active:scale-95 shadow-2xl
                      ${isDark ? "bg-white text-black hover:bg-gray-100" : "bg-black text-white hover:bg-neutral-800"}`}
                  >
                    <Save size={18} />
                    {loading ? "Updating..." : "Update Email"}
                  </button>
                </div>
              </form>
            )}

            {/* SECURITY SECTION */}
            {activeTab === "security" && (
              <form onSubmit={handlePasswordChange} className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
                <h3 className="text-xl font-semibold" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>Account Security</h3>
                
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-4">
                  <Shield className="text-amber-500 mt-1" size={20} />
                  <div>
                    <p className="text-sm font-semibold text-amber-500">2FA OTP Enabled for Admin</p>
                    <p className={`text-xs mt-0.5 ${isDark ? "text-amber-500/80" : "text-amber-700/80"}`}>
                      Your account securely sends an OTP verification code to your email upon successful login.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className={`text-[12px] font-bold uppercase tracking-wider ${isDark ? "text-gray-500" : "text-gray-400"}`}>Old Password</label>
                    <input 
                      type="password" 
                      required
                      value={passwordForm.oldPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, oldPassword: e.target.value})}
                      placeholder="Enter current password"
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:ring-2 outline-none
                        ${isDark ? "bg-white/5 border-white/10 text-white focus:ring-blue-500/30" : "bg-gray-50 border-black/5 text-black focus:ring-blue-500/20"}`}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={`text-[12px] font-bold uppercase tracking-wider ${isDark ? "text-gray-500" : "text-gray-400"}`}>New Password</label>
                      <input 
                        type="password" 
                        required
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                        placeholder="Min. 6 chars"
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:ring-2 outline-none
                          ${isDark ? "bg-white/5 border-white/10 text-white focus:ring-blue-500/30" : "bg-gray-50 border-black/5 text-black focus:ring-blue-500/20"}`}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={`text-[12px] font-bold uppercase tracking-wider ${isDark ? "text-gray-500" : "text-gray-400"}`}>Confirm New Password</label>
                      <input 
                        type="password" 
                        required
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                        placeholder="Verify password"
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:ring-2 outline-none
                          ${isDark ? "bg-white/5 border-white/10 text-white focus:ring-blue-500/30" : "bg-gray-50 border-black/5 text-black focus:ring-blue-500/20"}`}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-dashed border-gray-500/20 flex justify-between items-center">
                   <button
                    type="button"
                    onClick={() => {
                      localStorage.removeItem("adminToken");
                      navigate("/admin");
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-red-500 hover:bg-red-500/10 transition-all"
                  >
                    <LogOut size={16} /> Logout from session
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex items-center gap-2 px-8 py-2.5 rounded-xl font-bold transition-all transform hover:scale-[1.02] active:scale-95 shadow-2xl
                      ${isDark ? "bg-white text-black hover:bg-gray-100" : "bg-black text-white hover:bg-neutral-800"}`}
                  >
                    <Save size={18} />
                    {loading ? "Changing..." : "Change Password"}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
