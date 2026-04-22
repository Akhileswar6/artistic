import { useEffect, useState } from "react";
import { User, Mail, Calendar, ShieldCheck, Edit3, Settings, Save, X, ShoppingBag, Bell } from "lucide-react";
import toast from "react-hot-toast";

export default function Account({ isDark }) {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ orders: 0, notifications: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setNewName(storedUser.fullName);
      fetchStats(storedUser._id);
    }
  }, []);

  const fetchStats = async (userId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/auth/stats/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) return toast.error("File is too large (max 5MB)");
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async () => {
    if (!newName.trim()) return toast.error("Name cannot be empty");
    
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("userId", user._id);
      formData.append("fullName", newName);
      if (selectedFile) {
        formData.append("profilePic", selectedFile);
      }

      const res = await fetch("http://localhost:5000/api/auth/update-profile", {
        method: "PUT",
        // Note: Don't set Content-Type header when sending FormData
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        setIsEditing(false);
        setSelectedFile(null);
        setPreview(null);
        toast.success("Profile updated successfully");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setIsSaving(false);
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
    <div className={`min-h-screen pt-12 pb-24 px-6 transition-colors duration-300 ${isDark ? "bg-[#0b0c10] text-white" : "bg-gray-50 text-black"}`} style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Profile Header Card */}
        <div className={`relative overflow-hidden rounded-[32px] border transition-all duration-500 ${
          isDark ? "bg-[#141414] border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]" : "bg-white border-black/5 shadow-[0_20px_50px_rgba(0,0,0,0.05)]"
        }`}>
          <div className={`absolute top-0 left-0 w-full h-32 opacity-20 ${isDark ? "bg-gradient-to-r from-blue-600 to-purple-600" : "bg-gradient-to-r from-blue-400 to-purple-400"}`} />
          
          <div className="relative pt-16 px-8 pb-8 flex flex-col md:flex-row items-center md:items-end gap-6">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-500" />
              {preview || user.profilePic ? (
                <img src={preview || user.profilePic} alt="profile" className="relative w-32 h-32 rounded-full object-cover border-4 border-[#141414]" />
              ) : (
                <div className={`relative w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold border-4 ${isDark ? "bg-[#1c1c1c] text-white border-[#141414]" : "bg-black text-white border-white"}`}>
                  {user.fullName?.charAt(0).toUpperCase()}
                </div>
              )}
              
              {isEditing && (
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Edit3 size={24} className="text-white" />
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              )}
            </div>

            <div className="flex-1 text-center md:text-left space-y-2">
              {isEditing ? (
                <div className="flex flex-col md:flex-row gap-2 items-center">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className={`px-4 py-2 rounded-xl border text-xl font-bold focus:ring-2 focus:ring-blue-500 outline-none ${isDark ? "bg-white/5 border-white/10" : "bg-gray-100 border-black/10"}`}
                  />
                  <div className="flex gap-2">
                    <button onClick={handleUpdateProfile} disabled={isSaving} className="p-2 bg-blue-500 text-white rounded-xl hover:scale-105 transition active:scale-95 disabled:opacity-50">
                      <Save size={18} />
                    </button>
                    <button onClick={() => { setIsEditing(false); setNewName(user.fullName); setSelectedFile(null); setPreview(null); }} className="p-2 bg-red-500 text-white rounded-xl hover:scale-105 transition active:scale-95">
                      <X size={18} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
                    {user.fullName}
                  </h1>
                  <div className="flex items-center justify-center md:justify-start gap-2 opacity-50 text-sm">
                    <Mail size={14} />
                    <span>{user.email}</span>
                  </div>
                </>
              )}
            </div>

            <button 
              onClick={() => setIsEditing(!isEditing)}
              className={`px-6 py-2.5 rounded-full font-medium text-sm flex items-center gap-2 transition-all cursor-pointer ${
                isDark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-neutral-800"
              }`}
            >
              <Settings size={16} />
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Orders", value: stats.orders, icon: ShoppingBag, color: "text-blue-500" },
            { label: "Notifications", value: stats.notifications, icon: Bell, color: "text-purple-500" },
            { label: "Points", value: "120", icon: ShieldCheck, color: "text-orange-500" },
            { label: "Active Plan", value: "Basic", icon: Settings, color: "text-green-500" }
          ].map((item, i) => (
            <div key={i} className={`p-6 rounded-3xl border ${isDark ? "bg-[#141414] border-white/5" : "bg-white border-black/5 shadow-sm"}`}>
              <div className={`p-3 w-fit rounded-xl mb-4 bg-gray-500/5 ${item.color}`}>
                <item.icon size={20} />
              </div>
              <p className="text-[11px] uppercase tracking-wider font-bold opacity-40">{item.label}</p>
              <p className="text-2xl font-bold mt-1" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>{item.value}</p>
            </div>
          ))}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Account Information */}
          <div className={`p-8 rounded-[24px] border transition-all duration-300 ${
            isDark ? "bg-[#141414] border-white/5" : "bg-white border-black/5 shadow-sm"
          }`}>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
              <ShieldCheck size={20} className="text-blue-500" />
              Account Details
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
                  <User size={18} className="opacity-60" />
                </div>
                <div>
                  <p className={`text-[11px] uppercase tracking-wider font-bold opacity-40`}>Full Name</p>
                  <p className="font-medium">{user.fullName}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
                  <Mail size={18} className="opacity-60" />
                </div>
                <div>
                  <p className={`text-[11px] uppercase tracking-wider font-bold opacity-40`}>Email Address</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
                  <Calendar size={18} className="opacity-60" />
                </div>
                <div>
                  <p className={`text-[11px] uppercase tracking-wider font-bold opacity-40`}>Member Since</p>
                  <p className="font-medium">{new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Security & Preferences */}
          <div className={`p-8 rounded-[24px] border transition-all duration-300 ${
            isDark ? "bg-[#141414] border-white/5" : "bg-white border-black/5 shadow-sm"
          }`}>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
              <ShieldCheck size={20} className="text-purple-500" />
              Security
            </h3>
            
            <div className="space-y-4">
              <button onClick={() => toast("Security settings are currently managed via OTP", { icon: '🛡️' })} className={`w-full p-4 rounded-2xl flex items-center justify-between group transition-all cursor-pointer ${
                isDark ? "bg-white/5 hover:bg-white/10" : "bg-gray-50 hover:bg-gray-100"
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-blue-500/10 text-blue-500`}>
                    <ShieldCheck size={18} />
                  </div>
                  <span className="text-sm font-medium">Password & Security</span>
                </div>
                <div className="w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </div>
              </button>

              <button onClick={() => toast.success("Preferences saved (simulation)")} className={`w-full p-4 rounded-2xl flex items-center justify-between group transition-all cursor-pointer ${
                isDark ? "bg-white/5 hover:bg-white/10" : "bg-gray-50 hover:bg-gray-100"
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-orange-500/10 text-orange-500`}>
                    <Settings size={18} />
                  </div>
                  <span className="text-sm font-medium">Preferences</span>
                </div>
                <div className="w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </div>
              </button>

              <div className={`mt-8 p-4 rounded-2xl border border-dashed ${isDark ? "border-white/10 bg-white/5" : "border-black/10 bg-gray-50"}`}>
                <p className="text-[12px] opacity-50 leading-relaxed text-center">
                  Your privacy is important to us. We never share your personal data with third parties.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}