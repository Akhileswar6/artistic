import { useState, useEffect } from "react";
import { User, Lock, Save, LogOut, Shield, Activity as ActivityIcon, ShieldCheck, RefreshCcw, ShieldUser } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Settings({ isDark }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);

  const [admins, setAdmins] = useState([]);
  const [newAdmin, setNewAdmin] = useState({
    email: "",
    password: "",
    fullName: ""
  });
  const [myIdentity, setMyIdentity] = useState({
    fullName: "",
    email: ""
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });


  useEffect(() => {
    fetchAdmins();
    fetchMyIdentity();
  }, []);

  const fetchMyIdentity = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/profile", {
        headers: { Authorization: localStorage.getItem("adminToken") },
      });
      if (res.ok) {
        const data = await res.json();
        setMyIdentity({ fullName: data.fullName, email: data.email });
      }
    } catch (err) {
      console.error("Failed to load identity");
    }
  };

  const handleIdentityUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/admin/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("adminToken"),
        },
        body: JSON.stringify({ fullName: myIdentity.fullName }),
      });
      if (res.ok) {
        toast.success("Identity updated successfully");
        fetchMyIdentity();
        fetchAdmins(); // refresh list too
      } else {
        toast.error("Failed to update identity");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchAdmins = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/all-admins", {
        headers: { Authorization: localStorage.getItem("adminToken") },
      });
      if (res.ok) {
        const data = await res.json();
        setAdmins(data);
      }
    } catch (err) {
      toast.error("Failed to load admin list");
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/admin/add-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("adminToken"),
        },
        body: JSON.stringify(newAdmin),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("New admin added successfully");
        setNewAdmin({ email: "", password: "", fullName: "" });
        fetchAdmins();
      } else {
        toast.error(data.message || "Failed to add admin");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAdmin = async (id) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-xs font-medium">Revoke this admin's access forever?</p>
        <div className="flex gap-2">
          <button 
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const res = await fetch(`http://localhost:5000/api/admin/remove-admin/${id}`, {
                  method: "DELETE",
                  headers: { Authorization: localStorage.getItem("adminToken") },
                });
                const data = await res.json();
                if (res.ok) {
                  toast.success("Admin access revoked");
                  fetchAdmins();
                } else {
                  toast.error(data.message || "Failed to remove admin");
                }
              } catch (err) {
                toast.error("An error occurred");
                console.error(err);
              }
            }}
            className="px-3 py-1 bg-red-500 text-white rounded text-[10px] font-bold uppercase tracking-wider"
          >
            Confirm
          </button>
          <button 
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 bg-neutral-200 text-black rounded text-[10px] font-bold uppercase tracking-wider"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 4000, position: 'top-center' });
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
      className={`relative flex items-center justify-center md:justify-start gap-2.5 px-4 py-2.5 rounded-xl transition-all duration-500 flex-1 md:w-full group
        ${activeTab === id 
          ? isDark 
            ? "bg-white text-black shadow-[0_10px_30px_rgba(255,255,255,0.05)] scale-[1.01]" 
            : "bg-black text-white shadow-xl scale-[1.01]"
          : isDark 
            ? "text-gray-500 hover:text-white hover:bg-white/5" 
            : "text-gray-400 hover:text-black hover:bg-black/5"
        }`}
    >
      <Icon size={17} className={`transition-transform duration-500 ${activeTab === id ? "scale-110" : "group-hover:scale-110"}`} />
      <span className="text-[12px] md:text-[13px] tracking-tight">{label}</span>
    </button>
  );

  return (
    <div style={{ fontFamily: "Inter, sans-serif" }} className="animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-out pb-20">
      
      {/* Editorial Header */}
      <div className={`mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 p-6 rounded-3xl transition-all duration-300
          ${isDark ? "bg-white/[0.03] border border-white/5" : "bg-white border border-black/5 shadow-sm"}`}>
        <div className="max-w-2xl">
          <h1 className={`text-2xl md:text-3xl font-semibold tracking-tight ${isDark ? "text-white" : "text-black"}`} style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
            Admin Access & Security
          </h1>
        </div>
        <div className={`hidden md:flex items-center gap-4 px-5 py-3 rounded-2xl border ${isDark ? "bg-white/[0.05] border-white/10" : "bg-gray-50 border-black/5"}`}>
           <div className="text-right">
              <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? "text-gray-500" : "text-gray-400"}`}>System Status</p>
              <p className={`text-xs  ${isDark ? "text-blue-400" : "text-black"}`}>Multi-Admin Enabled</p>
           </div>
           <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-600"}`}>
              <Shield size={20} />
           </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Navigation Sidebar */}
        <div className="lg:w-[240px] flex-shrink-0">
          <div className={`sticky top-24 p-1.5 rounded-xl border transition-all duration-500 flex flex-row lg:flex-col gap-1.5 overflow-x-auto no-scrollbar
            ${isDark ? "bg-black/50 backdrop-blur-3xl border-white/5" : "bg-gray-100/50 border-black/5"}`}>
            <TabButton id="profile" label="Admin Access" icon={ShieldUser} />
            <TabButton id="identity" label="My Identity" icon={User} />
            <TabButton id="security" label="My Security" icon={Lock} />
          </div>
        </div>

        {/* Dynamic Content Surface */}
        <div className={`flex-1 rounded-2xl p-4 md:p-10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] border transition-all duration-700 relative overflow-hidden
          ${isDark 
            ? "bg-[#080808] border-white/10 shadow-white/[0.01]" 
            : "bg-white border-black/5"}`}>
          
          <div className="max-w-4xl relative z-10">
            {/* ADMIN ACCESS SECTION */}
            {activeTab === "profile" && (
              <div className="animate-in fade-in slide-in-from-bottom-10 duration-700 space-y-10">
                <div className="space-y-1.5">
                   <h3 className={`text-2xl font-medium ${isDark ? "text-white" : "text-black"}`} style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>Access List</h3>
                   <p className={`text-[13px] font-medium ${isDark ? "text-gray-500" : "text-gray-400"}`}>Manage administrative personnel with full system access.</p>
                </div>

                {/* Admin List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {admins.map((admin) => (
                    <div key={admin._id} className={`p-4 rounded-xl border flex items-center justify-between group transition-all duration-300 ${isDark ? "bg-white/[0.02] border-white/5 hover:bg-white/[0.05]" : "bg-gray-50 border-black/5 hover:bg-gray-100"}`}>
                       <div className="flex items-center gap-3.5">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm ${isDark ? "bg-white/10 text-white" : "bg-black/10 text-black"}`}>
                             {admin.fullName.charAt(0)}
                          </div>
                          <div>
                             <p className="text-[14px] font-black">{admin.fullName}</p>
                             <p className="text-[11px] opacity-50 font-medium">{admin.email}</p>
                          </div>
                       </div>
                       <button 
                        onClick={() => handleRemoveAdmin(admin._id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                       >
                          <LogOut size={16} />
                       </button>
                    </div>
                  ))}
                </div>

                {/* Add New Admin Form */}
                <form onSubmit={handleAddAdmin} className={`p-6 md:p-8 rounded-2xl border space-y-6 ${isDark ? "bg-white/[0.01] border-white/5" : "bg-neutral-50 border-black/5"}`}>
                  <div className="space-y-1.5">
                    <h4 className="text-lg " style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>Grant New Access</h4>
                    <p className={`text-[10px] uppercase tracking-widest font-black ${isDark ? "text-gray-600" : "text-gray-400"}`}>Account Initialization</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                    <label className={`text-[10px] uppercase ${isDark ? "text-gray-500 group-focus-within:text-white" : "text-gray-400 group-focus-within:text-black"} transition-colors px-1`}>Your Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={newAdmin.fullName}
                        onChange={(e) => setNewAdmin({...newAdmin, fullName: e.target.value})}
                        placeholder="Enter full name"
                        className={`w-full py-2.5 px-4 mt-1.5 rounded-lg text-[13px] transition-all duration-200 outline-none border
                          ${isDark
                            ? "border-white/10 bg-black/40 text-white focus:border-white/30"
                            : "border-gray-200 bg-gray-50 text-black focus:border-gray-400"
                          }`}
                      />
                    </div>
                    <div className="space-y-2">
                    <label className={`text-[10px] uppercase ${isDark ? "text-gray-500 group-focus-within:text-white" : "text-gray-400 group-focus-within:text-black"} transition-colors px-1`}>Email Identity</label>
                      <input 
                        type="email" 
                        required
                        value={newAdmin.email}
                        onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                        placeholder="admin@artistic.com"
                        className={`w-full py-2.5 px-4 mt-1.5 rounded-lg text-[13px] transition-all duration-200 outline-none border
                          ${isDark
                            ? "border-white/10 bg-black/40 text-white focus:border-white/30"
                            : "border-gray-200 bg-gray-50 text-black focus:border-gray-400"
                          }`}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className={`text-[10px] uppercase ${isDark ? "text-gray-500 group-focus-within:text-white" : "text-gray-400 group-focus-within:text-black"} transition-colors px-1`}>Initial Password</label>
                    <input 
                      type="password" 
                      required
                      value={newAdmin.password}
                      onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                      placeholder="Min. 8 characters"
                      className={`w-full py-2.5 px-4 mt-1.5 rounded-lg text-[13px] transition-all duration-200 outline-none border
                        ${isDark
                          ? "border-white/10 bg-black/40 text-white focus:border-white/30"
                          : "border-gray-200 bg-gray-50 text-black focus:border-gray-400"
                        }`}
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full md:w-auto flex items-center justify-center gap-3 px-4 py-2 rounded-lg uppercase text-[12px]  transition-all transform hover:scale-[1.02] shadow-xl
                        ${isDark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-neutral-800"}`}
                    >
                      {loading ? <RefreshCcw size={14} className="animate-spin" /> : <Save size={16} />}
                      {loading ? "Initializing..." : "Authorize Admin"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* MY IDENTITY SECTION */}
            {activeTab === "identity" && (
              <form onSubmit={handleIdentityUpdate} className="animate-in fade-in slide-in-from-bottom-10 duration-700 space-y-10">
                <div className="space-y-1.5">
                   <h3 className={`text-2xl  ${isDark ? "text-white" : "text-black"}`} style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>Personal Identity</h3>
                   <p className={`text-[13px] font-medium ${isDark ? "text-gray-500" : "text-gray-400"}`}>Update your public administrative name displayed across the system.</p>
                </div>

                <div className="space-y-6">
                  <div className="group space-y-2.5">
                    <label className={`text-[10px] uppercase ${isDark ? "text-gray-500 group-focus-within:text-white" : "text-gray-400 group-focus-within:text-black"} transition-colors px-1`}>Your Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={myIdentity.fullName}
                      onChange={(e) => setMyIdentity({...myIdentity, fullName: e.target.value})}
                      placeholder="e.g. Akhileswar"
                      className={`w-full py-2.5 px-4 mt-1.5 rounded-lg text-[13px] transition-all duration-200 outline-none border
                        ${isDark
                          ? "border-white/10 bg-black/40 text-white focus:border-white/30"
                          : "border-gray-200 bg-gray-50 text-black focus:border-gray-400"
                        }`}
                    />
                  </div>
                  
                  <div className="group space-y-2.5 opacity-50">
                    <label className={`text-[10px] uppercase ${isDark ? "text-gray-500" : "text-gray-400"} px-1`}>Vault Email (Read-Only)</label>
                    <input 
                      type="email" 
                      readOnly
                      value={myIdentity.email}
                      className={`w-full py-2.5 px-4 mt-1.5 rounded-lg text-[13px] outline-none border cursor-not-allowed
                        ${isDark ? "border-white/5 bg-white/5 text-gray-500" : "border-gray-200 bg-gray-100 text-gray-500"}`}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full md:w-auto flex items-center justify-center gap-3 px-4 py-2 rounded-lg  uppercase text-[12px]  transition-all transform hover:scale-[1.02] shadow-xl
                        ${isDark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-neutral-800"}`}
                    >
                      {loading ? <RefreshCcw size={14} className="animate-spin" /> : <Save size={16} />}
                      {loading ? "Updating..." : "Save Identity"}
                    </button>
                  </div>
              </form>
            )}

            {/* SECURITY SECTION */}
            {activeTab === "security" && (
              <form onSubmit={handlePasswordChange} className="animate-in fade-in slide-in-from-bottom-10 duration-700 space-y-10">
                <div className="space-y-1.5">
                   <h3 className={`text-2xl  ${isDark ? "text-white" : "text-black"}`} style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>My Security</h3>
                   <p className={`text-[13px] font-medium ${isDark ? "text-gray-500" : "text-gray-400"}`}>Rotate your cryptographic access keys to maintain system integrity.</p>
                </div>
                
                <div className={`p-5 rounded-xl flex flex-col md:flex-row items-center gap-5 transition-all duration-700 ${isDark ? "bg-amber-500/5 border border-amber-500/10 shadow-[0_0_50px_rgba(245,158,11,0.03)]" : "bg-amber-50 border border-amber-200 shadow-lg shadow-amber-500/5"}`}>
                  <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center bg-amber-500/20 text-amber-500`}>
                     <Shield size={24} strokeWidth={2.5} className="animate-pulse" />
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-xs font-black text-amber-500 uppercase ">Multi-Factor Guard: Active</p>
                    <p className={`text-[11px] mt-1.5 leading-relaxed font-medium ${isDark ? "text-amber-200/40" : "text-amber-700/60"}`}>
                      All administrative login attempts are intercepted by a mandatory 2FA handshake. A unique verification key is dispatched to your vault email for every session.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="group space-y-2.5">
                    <label className={`text-[10px] uppercase ${isDark ? "text-gray-500 group-focus-within:text-white" : "text-gray-400 group-focus-within:text-black"} transition-colors px-1`}>
                      Verification: Current Access Key
                    </label>
                    <div className="relative">
                      <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isDark ? "text-gray-600 group-focus-within:text-white" : "text-gray-300 group-focus-within:text-black"}`} size={16} />
                      <input 
                        type="password" 
                        required
                        value={passwordForm.oldPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, oldPassword: e.target.value})}
                        placeholder="Current secret key"
                        className={`w-full py-2.5 pl-11 pr-4 mt-1.5 rounded-lg text-[13px] transition-all duration-200 outline-none border
                          ${isDark
                            ? "border-white/10 bg-black/40 text-white focus:border-white/30"
                            : "border-gray-200 bg-gray-50 text-black focus:border-gray-400"
                          }`}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group space-y-2.5">
                      <label className={`text-[10px] uppercase ${isDark ? "text-gray-500 group-focus-within:text-white" : "text-gray-400 group-focus-within:text-black"} transition-colors px-1`}>
                        New Access Key
                      </label>
                      <input 
                        type="password" 
                        required
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                        placeholder="Min. 8 characters"
                        className={`w-full py-2.5 px-4 mt-1.5 rounded-lg text-[13px] transition-all duration-200 outline-none border
                          ${isDark
                            ? "border-white/10 bg-black/40 text-white focus:border-white/30"
                            : "border-gray-200 bg-gray-50 text-black focus:border-gray-400"
                          }`}
                      />
                    </div>
                    <div className="group space-y-2.5">
                      <label className={`text-[10px] uppercase ${isDark ? "text-gray-500 group-focus-within:text-white" : "text-gray-400 group-focus-within:text-black"} transition-colors px-1`}>
                        Re-verify Key
                      </label>
                      <input 
                        type="password" 
                        required
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                        placeholder="Confirm new key"
                        className={`w-full py-2.5 px-4 mt-1.5 rounded-lg text-[13px] transition-all duration-200 outline-none border
                          ${isDark
                            ? "border-white/10 bg-black/40 text-white focus:border-white/30"
                            : "border-gray-200 bg-gray-50 text-black focus:border-gray-400"
                          }`}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-10 border-t border-dashed border-gray-500/10 flex flex-col md:flex-row justify-between items-center gap-6">
                   <button
                    type="button"
                    onClick={() => {
                      localStorage.removeItem("adminToken");
                      navigate("/admin");
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] uppercase tracking-[0.1em] text-red-500 hover:bg-red-500/5 transition-all border border-transparent hover:border-red-500/10 active:scale-95`}
                  >
                    <LogOut size={14} /> Terminate My Session
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full md:w-auto flex items-center justify-center gap-3 px-8 py-2 rounded-lg uppercase text-[10px] tracking-[0.2em] transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl
                      ${isDark 
                        ? "bg-white text-black hover:bg-gray-200 shadow-white/5" 
                        : "bg-black text-white hover:bg-neutral-800 shadow-black/20"}`}
                  >
                    {loading ? <RefreshCcw size={14} className="animate-spin" /> : <Shield size={16} />}
                    {loading ? "Encrypting Vault..." : "Update Credentials"}
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
