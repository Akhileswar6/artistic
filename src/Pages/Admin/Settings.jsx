import { useState, useEffect, useRef } from "react";
import { API_BASE_URL } from "../../config";

import { Lock, Save, LogOut, Shield, Activity as ActivityIcon, ShieldCheck, RefreshCcw, ShieldUser, Settings as SettingsIcon, IndianRupee, Image as ImageIcon, X, Star, Tag, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import TestimonialSettings from "./TestimonialSettings";
import CouponSettings from "./CouponSettings";

export default function Settings({ isDark }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(() => {
    return localStorage.getItem("settings_nav_collapsed") === "true";
  });

  const toggleNavCollapsed = () => {
    setIsNavCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("settings_nav_collapsed", next ? "true" : "false");
      return next;
    });
  };

  const [admins, setAdmins] = useState([]);
  const [newAdmin, setNewAdmin] = useState({
    email: "",
    password: "",
    fullName: ""
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [systemConfig, setSystemConfig] = useState(null);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [pricingForm, setPricingForm] = useState({
    basePricing: { realistic: 1500, charcoal: 1500, sketch: 2000, caricature: 1800 },
    framePricing: { noframe: 0, standard8x10: 200, standard12x16: 400, custom: 600 }
  });

  const [galleryItems, setGalleryItems] = useState([]);
  const [galleryForm, setGalleryForm] = useState({
    title: "",
    instagramLink: "",
    date: "",
    category: "",
    description: "",
    displayLocations: [] // Array of selected locations
  });
  const [galleryFile, setGalleryFile] = useState(null);
  const galleryFileRef = useRef(null);

  useEffect(() => {
    fetchAdmins();
    fetchSystemConfig();
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/gallery`);
      if (res.ok) {
        const data = await res.json();
        setGalleryItems(data);
      }
    } catch (err) {
      console.error("Failed to load gallery items");
    }
  };

  const fetchSystemConfig = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/config`, {
        headers: { Authorization: localStorage.getItem("adminToken") },
      });
      if (res.ok) {
        const data = await res.json();
        setSystemConfig(data);
        setMaintenanceMode(data.maintenanceMode);
        if (data.basePricing) {
          setPricingForm(prev => ({
            basePricing: { ...prev.basePricing, ...data.basePricing },
            framePricing: { ...prev.framePricing, ...data.framePricing }
          }));
        }
      }
    } catch (err) {
      console.error("Failed to load config");
    }
  };

  const handleMaintenanceToggle = async () => {
    setLoading(true);
    const newValue = !maintenanceMode;
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/config`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("adminToken"),
        },
        body: JSON.stringify({ ...systemConfig, maintenanceMode: newValue }),
      });
      if (res.ok) {
        toast.success(`Maintenance Mode ${newValue ? 'Enabled' : 'Disabled'}`);
        setMaintenanceMode(newValue);
        setSystemConfig(prev => ({ ...prev, maintenanceMode: newValue }));
      } else {
        toast.error("Failed to update system config");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handlePricingSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/config`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("adminToken"),
        },
        body: JSON.stringify({ ...systemConfig, basePricing: pricingForm.basePricing, framePricing: pricingForm.framePricing }),
      });
      if (res.ok) {
        toast.success("Pricing updated successfully");
        setSystemConfig(prev => ({ ...prev, basePricing: pricingForm.basePricing, framePricing: pricingForm.framePricing }));
      } else {
        toast.error("Failed to update pricing");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };


  const fetchAdmins = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/all-admins`, {
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
      const res = await fetch(`${API_BASE_URL}/api/admin/add-admin`, {
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
                const res = await fetch(`${API_BASE_URL}/api/admin/remove-admin/${id}`, {
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
      const res = await fetch(`${API_BASE_URL}/api/admin/change-password`, {
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

  const handleGallerySubmit = async (e) => {
    e.preventDefault();
    if (!galleryFile) {
      return toast.error("Please select an image");
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", galleryFile);
      formData.append("title", galleryForm.title);
      formData.append("instagramLink", galleryForm.instagramLink);
      formData.append("date", galleryForm.date);
      formData.append("category", galleryForm.category);
      formData.append("description", galleryForm.description);
      formData.append("displayLocations", JSON.stringify(galleryForm.displayLocations));

      const res = await fetch(`${API_BASE_URL}/api/gallery`, {
        method: "POST",
        headers: { Authorization: localStorage.getItem("adminToken") },
        body: formData
      });

      if (res.ok) {
        toast.success("Gallery item added");
        setGalleryForm({
          title: "", instagramLink: "", date: "", category: "", description: "", displayLocations: []
        });
        setGalleryFile(null);
        fetchGalleryItems();
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to add item");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGalleryItem = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-xs font-medium">Delete this image forever?</p>
        <div className="flex gap-2">
          <button 
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const res = await fetch(`${API_BASE_URL}/api/gallery/${id}`, {
                  method: "DELETE",
                  headers: { Authorization: localStorage.getItem("adminToken") }
                });
                if (res.ok) {
                  toast.success("Gallery item deleted");
                  fetchGalleryItems();
                } else {
                  toast.error("Failed to delete item");
                }
              } catch (err) {
                toast.error("An error occurred");
              }
            }}
            className="px-3 py-1 bg-red-500 text-white rounded text-[10px] font-bold uppercase tracking-wider hover:bg-red-600 transition-colors"
          >
            Confirm
          </button>
          <button 
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 bg-neutral-200 text-black rounded text-[10px] font-bold uppercase tracking-wider hover:bg-neutral-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 5000, position: "top-center" });
  };

  const TabButton = ({ id, label, icon: Icon }) => {
    const isActive = activeTab === id;
    return (
      <button
        type="button"
        onClick={() => setActiveTab(id)}
        title={label}
        className={`relative flex items-center ${
          isNavCollapsed ? "justify-center px-0 w-full h-10" : "justify-start px-3.5 py-2.5 w-full"
        } rounded-xl transition-all duration-200 group cursor-pointer ${
          isActive
            ? isDark
              ? "bg-white text-black font-semibold shadow-md shadow-white/5 scale-[1.01]"
              : "bg-black text-white font-semibold shadow-md shadow-black/10 scale-[1.01]"
            : isDark
            ? "text-neutral-400 hover:text-white hover:bg-white/[0.06]"
            : "text-neutral-600 hover:text-black hover:bg-black/[0.04]"
        }`}
      >
        <Icon
          size={17}
          className={`shrink-0 transition-transform duration-200 ${
            isActive ? "scale-105" : "group-hover:scale-105 opacity-80 group-hover:opacity-100"
          }`}
        />
        {!isNavCollapsed && (
          <span className="text-xs font-medium tracking-tight truncate ml-3 select-none">
            {label}
          </span>
        )}
      </button>
    );
  };

  return (
    <div style={{ fontFamily: "Inter, sans-serif" }} className="animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-out pb-20">
      
      {/* Editorial Header */}
      <div className={`mb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 rounded-2xl transition-all duration-300
          ${isDark ? "bg-white/[0.03] border border-white/5" : "bg-white border border-black/5 shadow-sm"}`}>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleNavCollapsed}
            className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-medium ${
              isDark
                ? "bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border-white/10"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-black border-black/10"
            }`}
            title={isNavCollapsed ? "Open sidebar menu" : "Close sidebar menu"}
          >
            {isNavCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
            <span className="hidden sm:inline">{isNavCollapsed ? "Open Menu" : "Close Menu"}</span>
          </button>
          <div>
            <h1 className={`text-lg md:text-xl ${isDark ? "text-white" : "text-black"}`} style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
              Admin Access & Security
            </h1>
          </div>
        </div>
        <div className={`hidden md:flex items-center gap-3 px-3 py-2 rounded-xl border ${isDark ? "bg-white/[0.05] border-white/10" : "bg-gray-50 border-black/5"}`}>
           <div className="text-right">
              <p className={`text-[9px] font-normal uppercase tracking-widest ${isDark ? "text-gray-500" : "text-gray-400"}`}>System Status</p>
              <p className={`text-[11px] ${isDark ? "text-blue-400" : "text-black"}`}>Multi-Admin Enabled</p>
           </div>
           <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDark ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-600"}`}>
              <Shield size={16} />
           </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-5 items-start">
        
        {/* Navigation Sidebar */}
        <div className={`transition-all duration-300 ease-in-out flex-shrink-0 ${
          isNavCollapsed ? "w-[68px]" : "w-[240px]"
        }`}>
          <div className={`sticky top-24 p-2 rounded-2xl border transition-all duration-300 flex flex-col gap-1.5 shadow-sm overflow-hidden select-none
            ${isDark ? "bg-[#0b0b0e] border-white/10" : "bg-white border-black/10 shadow-sm"}`}>
            
            {/* Collapse / Expand Toggle Arrow Bar */}
            <div className={`flex items-center ${isNavCollapsed ? "justify-center" : "justify-between"} px-1 pb-2.5 mb-1 border-b ${isDark ? "border-white/5" : "border-black/5"}`}>
              {!isNavCollapsed && (
                <span className={`text-[10px] font-bold uppercase tracking-wider pl-1 ${isDark ? "text-neutral-400" : "text-neutral-500"}`}>
                  Settings Menu
                </span>
              )}
              <button
                type="button"
                onClick={toggleNavCollapsed}
                className={`w-7 h-7 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
                  isDark
                    ? "bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border-white/10"
                    : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700 hover:text-black border-black/10"
                }`}
                title={isNavCollapsed ? "Open sidebar" : "Close sidebar"}
              >
                {isNavCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
              </button>
            </div>

            {/* Navigation Tabs - Pure Vertical, No Scrollbar */}
            <div className="flex flex-col gap-1 w-full overflow-hidden">
              <TabButton id="profile" label="Admin Access" icon={ShieldUser} />
              <TabButton id="security" label="My Security" icon={Lock} />
              <TabButton id="system" label="System Settings" icon={SettingsIcon} />
              <TabButton id="pricing" label="Pricing" icon={IndianRupee} />
              <TabButton id="coupons" label="Coupons" icon={Tag} />
              <TabButton id="gallery" label="Gallery" icon={ImageIcon} />
              <TabButton id="testimonials" label="Testimonials" icon={Star} />
            </div>
          </div>
        </div>

        {/* Dynamic Content Surface */}
        <div className={`flex-1 rounded-2xl p-4 md:p-6 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] border transition-all duration-700 relative overflow-hidden
          ${isDark 
            ? "bg-[#080808] border-white/10 shadow-white/[0.01]" 
            : "bg-white border-black/5"}`}>
          
          <div className="max-w-4xl relative z-10">
            {/* ADMIN ACCESS SECTION */}
            {activeTab === "profile" && (
              <div className="animate-in fade-in slide-in-from-bottom-10 duration-700 space-y-6">
                <div className="space-y-1">
                   <h3 className={`text-lg ${isDark ? "text-white" : "text-black"}`} style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>Access List</h3>
                   <p className={`text-[12px] font-normal ${isDark ? "text-gray-500" : "text-gray-400"}`}>Manage administrative personnel with full system access.</p>
                </div>

                {/* Admin List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {admins.map((admin) => (
                    <div key={admin._id} className={`p-3 rounded-xl border flex items-center justify-between group transition-all duration-300 ${isDark ? "bg-white/[0.02] border-white/5 hover:bg-white/[0.05]" : "bg-gray-50 border-black/5 hover:bg-gray-100"}`}>
                       <div className="flex items-center gap-3">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${isDark ? "bg-white/10 text-white" : "bg-black/10 text-black"}`}>
                             {admin.fullName.charAt(0)}
                          </div>
                          <div>
                             <p className="text-[13px] font-normal">{admin.fullName}</p>
                             <p className="text-[11px] opacity-50 font-normal">{admin.email}</p>
                          </div>
                       </div>
                       <button 
                        onClick={() => handleRemoveAdmin(admin._id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                       >
                          <LogOut size={14} />
                       </button>
                    </div>
                  ))}
                </div>

                {/* Add New Admin Form */}
                <form onSubmit={handleAddAdmin} className={`p-4 md:p-6 rounded-xl border space-y-5 ${isDark ? "bg-white/[0.01] border-white/5" : "bg-neutral-50 border-black/5"}`}>
                  <div className="space-y-1">
                    <h4 className="text-[15px]" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>Grant New Access</h4>
                    <p className={`text-[10px] uppercase tracking-widest font-normal ${isDark ? "text-gray-600" : "text-gray-400"}`}>Account Initialization</p>
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


            {/* SECURITY SECTION */}
            {activeTab === "security" && (
              <form onSubmit={handlePasswordChange} className="animate-in fade-in slide-in-from-bottom-10 duration-700 space-y-6">
                <div className="space-y-1">
                   <h3 className={`text-lg ${isDark ? "text-white" : "text-black"}`} style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>My Security</h3>
                   <p className={`text-[12px] font-normal ${isDark ? "text-gray-500" : "text-gray-400"}`}>Rotate your cryptographic access keys to maintain system integrity.</p>
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

            {/* SYSTEM SETTINGS SECTION */}
            {activeTab === "system" && (
              <div className="animate-in fade-in slide-in-from-bottom-10 duration-700 space-y-6">
                <div className="space-y-1">
                   <h3 className={`text-lg ${isDark ? "text-white" : "text-black"}`} style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>System Configuration</h3>
                   <p className={`text-[12px] font-normal ${isDark ? "text-gray-500" : "text-gray-400"}`}>Manage global system state and operations.</p>
                </div>

                <div className={`p-5 rounded-xl flex items-center justify-between border transition-all duration-300 ${isDark ? "bg-white/[0.02] border-white/5" : "bg-gray-50 border-black/5"}`}>
                  <div>
                    <h4 className="text-[14px] font-semibold" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>Maintenance Mode</h4>
                    <p className={`text-[11px] mt-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                      When enabled, the public facing website will be put offline and users will see a maintenance screen. Admin dashboard remains accessible.
                    </p>
                  </div>
                  
                  {/* Toggle Switch */}
                  <button
                    onClick={handleMaintenanceToggle}
                    disabled={loading}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      maintenanceMode ? "bg-blue-600" : isDark ? "bg-white/20" : "bg-gray-200"
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    role="switch"
                    aria-checked={maintenanceMode}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        maintenanceMode ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}

            {/* PRICING SECTION */}
            {activeTab === "pricing" && (
              <form onSubmit={handlePricingSubmit} className="animate-in fade-in slide-in-from-bottom-10 duration-700 space-y-6">
                <div className="space-y-1">
                   <h3 className={`text-lg ${isDark ? "text-white" : "text-black"}`} style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>Pricing Configuration</h3>
                   <p className={`text-[12px] font-normal ${isDark ? "text-gray-500" : "text-gray-400"}`}>Update the base prices for art styles and frame options.</p>
                </div>

                {/* Base Pricing */}
                <div className={`p-5 rounded-xl border transition-all duration-300 ${isDark ? "bg-white/[0.02] border-white/5" : "bg-gray-50 border-black/5"}`}>
                  <h4 className="text-[14px] font-semibold mb-4" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>Art Style Base Pricing (₹)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.keys(pricingForm.basePricing).map(style => (
                      <div key={style} className="space-y-1">
                        <label className={`text-[10px] uppercase font-bold ${isDark ? "text-gray-500" : "text-gray-500"}`}>{style}</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          required
                          value={pricingForm.basePricing[style]}
                          onChange={(e) => {
                            let val = e.target.value.replace(/[^0-9]/g, "");
                            if (val.length > 1 && val.startsWith("0")) val = val.replace(/^0+/, '');
                            setPricingForm(prev => ({
                              ...prev,
                              basePricing: { ...prev.basePricing, [style]: val === '' ? '' : Number(val) }
                            }));
                          }}
                          className={`w-full py-2 px-3 rounded-lg text-[13px] outline-none border transition-all
                            ${isDark ? "bg-black/40 border-white/10 text-white focus:border-white/30" : "bg-white border-black/10 text-black focus:border-black/30"}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Frame Pricing */}
                <div className={`p-5 rounded-xl border transition-all duration-300 ${isDark ? "bg-white/[0.02] border-white/5" : "bg-gray-50 border-black/5"}`}>
                  <h4 className="text-[14px] font-semibold mb-4" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>Frame Pricing (₹)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.keys(pricingForm.framePricing).map(frame => (
                      <div key={frame} className="space-y-1">
                        <label className={`text-[10px] uppercase font-bold ${isDark ? "text-gray-500" : "text-gray-500"}`}>{frame}</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          required
                          value={pricingForm.framePricing[frame]}
                          onChange={(e) => {
                            let val = e.target.value.replace(/[^0-9]/g, "");
                            if (val.length > 1 && val.startsWith("0")) val = val.replace(/^0+/, '');
                            setPricingForm(prev => ({
                              ...prev,
                              framePricing: { ...prev.framePricing, [frame]: val === '' ? '' : Number(val) }
                            }));
                          }}
                          className={`w-full py-2 px-3 rounded-lg text-[13px] outline-none border transition-all
                            ${isDark ? "bg-black/40 border-white/10 text-white focus:border-white/30" : "bg-white border-black/10 text-black focus:border-black/30"}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex items-center justify-center gap-3 px-8 py-2 rounded-lg uppercase text-[11px] font-bold tracking-[0.1em] transition-all transform hover:scale-[1.02] shadow-xl
                      ${isDark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-neutral-800"}`}
                  >
                    {loading ? <RefreshCcw size={14} className="animate-spin" /> : <Save size={16} />}
                    {loading ? "Saving..." : "Save Pricing"}
                  </button>
                </div>
              </form>
            )}

            {/* GALLERY SECTION */}
            {activeTab === "gallery" && (
              <div className="animate-in fade-in slide-in-from-bottom-10 duration-700 space-y-6">
                <div className="space-y-1">
                   <h3 className={`text-lg ${isDark ? "text-white" : "text-black"}`} style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>Gallery & Portfolio</h3>
                   <p className={`text-[12px] font-normal ${isDark ? "text-gray-500" : "text-gray-400"}`}>Upload and manage artworks. Select where they should be displayed on the main page.</p>
                </div>

                {/* Upload Form */}
                <form onSubmit={handleGallerySubmit} className={`p-5 rounded-xl border space-y-5 transition-all duration-300 ${isDark ? "bg-white/[0.02] border-white/5" : "bg-gray-50 border-black/5"}`}>
                  <h4 className="text-[14px] font-semibold" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>Upload New Work</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className={`text-[10px] uppercase font-bold ${isDark ? "text-gray-500" : "text-gray-500"}`}>Title *</label>
                      <input type="text" required value={galleryForm.title} onChange={e => setGalleryForm({...galleryForm, title: e.target.value})} className={`w-full py-2 px-3 rounded-lg text-[13px] outline-none border transition-all ${isDark ? "bg-black/40 border-white/10 text-white focus:border-white/30" : "bg-white border-black/10 text-black focus:border-black/30"}`} placeholder="e.g. Moonlight Sonata" />
                    </div>
                    <div className="space-y-1">
                      <label className={`text-[10px] uppercase font-bold ${isDark ? "text-gray-500" : "text-gray-500"}`}>Category</label>
                      <input type="text" value={galleryForm.category} onChange={e => setGalleryForm({...galleryForm, category: e.target.value})} className={`w-full py-2 px-3 rounded-lg text-[13px] outline-none border transition-all ${isDark ? "bg-black/40 border-white/10 text-white focus:border-white/30" : "bg-white border-black/10 text-black focus:border-black/30"}`} placeholder="e.g. Oil Painting" />
                    </div>
                    <div className="space-y-1">
                      <label className={`text-[10px] uppercase font-bold ${isDark ? "text-gray-500" : "text-gray-500"}`}>Date</label>
                      <input type="text" value={galleryForm.date} onChange={e => setGalleryForm({...galleryForm, date: e.target.value})} className={`w-full py-2 px-3 rounded-lg text-[13px] outline-none border transition-all ${isDark ? "bg-black/40 border-white/10 text-white focus:border-white/30" : "bg-white border-black/10 text-black focus:border-black/30"}`} placeholder="e.g. July 2026" />
                    </div>
                    <div className="space-y-1">
                      <label className={`text-[10px] uppercase font-bold ${isDark ? "text-gray-500" : "text-gray-500"}`}>Instagram Link</label>
                      <input type="url" value={galleryForm.instagramLink} onChange={e => setGalleryForm({...galleryForm, instagramLink: e.target.value})} className={`w-full py-2 px-3 rounded-lg text-[13px] outline-none border transition-all ${isDark ? "bg-black/40 border-white/10 text-white focus:border-white/30" : "bg-white border-black/10 text-black focus:border-black/30"}`} placeholder="https://instagram.com/..." />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className={`text-[10px] uppercase font-bold ${isDark ? "text-gray-500" : "text-gray-500"}`}>Description</label>
                    <textarea value={galleryForm.description} onChange={e => setGalleryForm({...galleryForm, description: e.target.value})} rows="2" className={`w-full py-2 px-3 rounded-lg text-[13px] outline-none border transition-all resize-none ${isDark ? "bg-black/40 border-white/10 text-white focus:border-white/30" : "bg-white border-black/10 text-black focus:border-black/30"}`} placeholder="Short description..."></textarea>
                  </div>

                  <div className="space-y-2">
                    <label className={`text-[10px] uppercase font-bold ${isDark ? "text-gray-500" : "text-gray-500"}`}>Display Locations (Optional)</label>
                    <div className="flex flex-wrap gap-4">
                      {[
                        { id: 'latest_works', label: 'Latest Works' },
                        { id: 'artists_works', label: "Artist's Works" },
                        { id: 'customer_showcase', label: 'Customer Showcase' }
                      ].map(loc => (
                        <label key={loc.id} className={`flex items-center gap-2 text-[12px] cursor-pointer ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            checked={galleryForm.displayLocations.includes(loc.id)}
                            onChange={(e) => {
                              if(e.target.checked) {
                                setGalleryForm(prev => ({...prev, displayLocations: [...prev.displayLocations, loc.id]}));
                              } else {
                                setGalleryForm(prev => ({...prev, displayLocations: prev.displayLocations.filter(id => id !== loc.id)}));
                              }
                            }}
                          />
                          {loc.label}
                        </label>
                      ))}
                    </div>
                    <p className={`text-[10px] ${isDark ? "text-gray-500" : "text-gray-400"}`}>* If none are selected, it defaults to the main Gallery.</p>
                  </div>

                  <div className="space-y-1">
                    <label className={`text-[10px] uppercase font-bold ${isDark ? "text-gray-500" : "text-gray-500"}`}>Image File *</label>
                    <input type="file" ref={galleryFileRef} required accept="image/*" onChange={e => setGalleryFile(e.target.files[0])} className={`w-full text-[12px] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[11px] file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${isDark ? "text-gray-400" : "text-gray-600"}`} />
                    {galleryFile && ( <div className="mt-4 relative rounded-xl overflow-hidden border border-black/10 dark:border-white/10 w-full sm:w-64 group"> <img src={URL.createObjectURL(galleryFile)} alt="Preview" className="w-full h-40 object-cover" /> <button type="button" onClick={() => { setGalleryFile(null); if(galleryFileRef.current) galleryFileRef.current.value = ""; }} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X size={14} /></button> </div> )}
                  </div>

                  <div className="flex justify-end pt-2">
                    <button type="submit" disabled={loading} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-[11px] uppercase font-bold transition-all shadow-md ${isDark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-neutral-800"}`}>
                      {loading ? <RefreshCcw size={14} className="animate-spin" /> : <Save size={14} />}
                      {loading ? "Uploading..." : "Upload Artwork"}
                    </button>
                  </div>
                </form>

                {/* Gallery Grid */}
                <div className="space-y-4 pt-4">
                  <h4 className="text-[14px] font-semibold" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>Uploaded Artworks ({galleryItems.length})</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {galleryItems.map(item => (
                      <div key={item._id} className={`group relative rounded-xl overflow-hidden border transition-all ${isDark ? "border-white/10" : "border-black/10"}`}>
                        <img src={item.imageUrl} alt={item.title} className="w-full h-32 md:h-40 object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                          <p className="text-white text-[12px] font-semibold truncate">{item.title}</p>
                          <p className="text-white/70 text-[10px] truncate">{item.category}</p>
                          <button onClick={() => handleDeleteGalleryItem(item._id)} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors shadow-lg">
                            <LogOut size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {galleryItems.length === 0 && (
                      <div className={`col-span-full py-8 text-center text-[13px] ${isDark ? "text-gray-500" : "text-gray-400"}`}>No gallery items uploaded yet.</div>
                    )}
                  </div>
                </div>

              </div>
            )}
            {activeTab === "testimonials" && <TestimonialSettings isDark={isDark} />} 
            {activeTab === "coupons" && <CouponSettings isDark={isDark} />} 
          </div>
        </div>
      </div>
    </div>
  );
}


