import { useState } from "react";
import { motion } from "framer-motion";
import { API_BASE_URL } from "../../config";

import ThemeToggle from "../../Components/ThemeToggle";
import { Link } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, LockIcon } from "lucide-react";

export default function AdminLogin({ isDark, setIsDark }) {

  const [email, setEmail] = useState("artistic.official12@gmail.com");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = Login, 2 = OTP
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    otp: "",
    general: ""
  });



  const handleLogin = async (e) => {
    e.preventDefault();

    setErrors({ email: "", password: "", general: "" });

    // ✅ FRONTEND VALIDATION
    let hasError = false;

    if (!email.trim()) {
      setErrors((prev) => ({ ...prev, email: "Enter email" }));
      hasError = true;
    }

    if (!password.trim()) {
      setErrors((prev) => ({ ...prev, password: "Enter password" }));
      hasError = true;
    }

    // 🚫 Stop API call if validation fails
    if (hasError) return;

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(step === 1 ? { email, password } : { email, password, otp }),
      });

      const data = await res.json();

      // ✅ BACKEND ERROR
      if (!res.ok) {
        setErrors({
          email: "",
          password: "",
          otp: step === 2 ? data.message : "",
          general: step === 1 ? data.message || "Invalid credentials" : ""
        });
        return;
      }

      if (data.requireOtp) {
        setStep(2);
        return;
      }

      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminLoginTimestamp", Date.now().toString());
      window.location.href = "/admin/dashboard";

    } catch (err) {
      console.error(err);
      setErrors((prev) => ({
        ...prev,
        general: "Server error. Try again."
      }));
    } finally {
      setLoading(false);
    }
  };



  return (
    <div
      className={`min-h-screen relative flex items-center justify-center overflow-hidden transition-colors duration-700 ${isDark ? "bg-[#050505] text-white" : "bg-[#f4f6f8] text-black"
        }`}
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Decorative Ambient Background */}
      {isDark ? (
        <>
          <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none animate-pulse-slow" />
          <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }} />
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_100%)] pointer-events-none" />
        </>
      ) : (
        <>
          <div className="absolute top-[10%] left-[20%] w-[400px] h-[400px] bg-blue-400/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-purple-400/10 blur-[100px] rounded-full pointer-events-none" />
        </>
      )}

      {/* Toggle Button */}
      <div className="absolute top-6 right-6 z-30">
        <ThemeToggle isDark={isDark} setIsDark={setIsDark} />
      </div>

      <div className="w-full max-w-[400px] relative z-20 animate-in fade-in zoom-in-95 duration-1000 slide-in-from-bottom-8">

        {/* Header Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-1 mb-4">
            <span className={`text-2xl font-bold tracking-tight ${isDark ? "text-white" : "text-black"}`} style={{ fontFamily: "Bricolage Grotesque" }}>
              art<span className="text-neutral-500 font-normal">istic</span>
            </span>
          </div>
          <h1 className="text-2xl font-bold text-center tracking-tight opacity-60" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
            Admin Portal
          </h1>
          <p className={`text-center text-[13px] mt-2 font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            Secure access to Artistic workspace
          </p>
        </div>

        {/* Login Card */}
        <div
          className={`p-7 rounded-[24px] backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border transition-all duration-300 ${isDark
            ? "bg-[#111]/80 border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]"
            : "bg-white/90 border-white/50 border-t-white/80 shadow-[0_20px_40px_rgba(0,0,0,0.08)]"
            }`}
        >
          <form onSubmit={handleLogin} className="flex flex-col gap-4">

            {step === 1 && (
              <>
                {/* Email */}
                <div>
                  <label className={`text-[14px]  ml-1 ${isDark ? "text-gray-300" : "text-gray-700"}`} style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>Email Address</label>
                  <input
                    type="email"
                    placeholder="admin@artistic.com"
                    className={`w-full py-2.5 px-3 mt-1.5 rounded-lg text-[13px] 
  transition-all duration-200 outline-none border
  ${isDark
                        ? "border-white/10 bg-black/40 text-white focus:border-neutral-300/50"
                        : "border-gray-300 bg-gray-50 text-black focus:border-gray-400"
                      }`}

                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  {errors.email && (
                    <p className="text-xs mt-1 ml-1 text-red-500">
                      {errors.email}
                    </p>
                  )}
                </div>



                {/* Password */}
                <div>
                  <label className={`text-[14px]  ml-1 ${isDark ? "text-gray-300" : "text-gray-700"}`} style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>Password</label>
                  <div className="relative mt-1.5 group">

                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className={`w-full py-2.5 pl-3 pr-10 rounded-lg text-[13px] 
  transition-all duration-200 outline-none border
  ${isDark
                          ? "border-white/10 bg-black/40 text-white focus:border-neutral-300/50"
                          : "border-gray-300 bg-gray-50 text-black focus:border-gray-400"
                        }`}

                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setErrors((prev) => ({ ...prev, password: "" }));
                      }}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer transition-colors duration-200 
                    ${isDark ? "text-gray-500 hover:text-white" : "text-gray-400 hover:text-black"}`}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs mt-1 ml-1 text-red-500">
                      {errors.password}
                    </p>
                  )}

                </div>
              </>
            )}

            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4">
                <label className={`text-[14px]  ml-1 ${isDark ? "text-gray-300" : "text-gray-700"}`} style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>Enter 6-digit OTP</label>
                <div className="bg-emerald-500/10 text-emerald-500 text-xs p-3 rounded-lg mb-4 mt-2">
                  Code sent to {email}
                </div>
                <input
                  type="text"
                  maxLength={6}
                  autoFocus
                  placeholder="------"
                  className={`w-full py-2.5 px-3 rounded-lg text-[20px] text-center tracking-widest
  transition-all duration-200 outline-none border uppercase 
  ${isDark
                      ? "border-white/10 bg-black/40 text-white focus:border-blue-500/50"
                      : "border-gray-300 bg-gray-50 text-black focus:border-blue-500/50"
                    }`}
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value);
                    setErrors((prev) => ({ ...prev, otp: "" }));
                  }}
                />
                {errors.otp && (
                  <p className="text-xs mt-1 ml-1 text-red-500 text-center">
                    {errors.otp}
                  </p>
                )}
              </div>
            )}

            {errors.general && (
              <p className="text-sm text-center text-red-500">
                {errors.general}
              </p>
            )}




            <button
              type="submit"
              disabled={loading || (step === 2 && otp.length < 6)}
              className={`py-2.5 mt-4 px-5 text-sm rounded-lg font-medium cursor-pointer
  flex items-center justify-center gap-2 
  transition-all duration-200 active:scale-[0.97]
  ${loading && "opacity-70 cursor-not-allowed"}
  ${isDark
                  ? "bg-white text-black hover:bg-gray-200"
                  : "bg-black text-white hover:bg-gray-800"
                }`}
            >
              {loading ? "Authenticating..." : (
                <>
                  <LockIcon size={16} />
                  {step === 1 ? "Secure Login" : "Verify & Enter"}
                </>
              )}
            </button>

          </form>
        </div>

        {/* Back */}
        <div className="text-center mt-6">
          <Link to="/" className={` text-[13px] px-4 py-2 rounded-full transition-all duration-300 inline-flex items-center gap-2 group
            ${isDark ? "text-gray-400 hover:text-white hover:bg-white/10" : "text-gray-500 hover:text-black hover:bg-black/5"}`}>
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
            Back to Artistic
          </Link>
        </div>

      </div>

    </div>


  );
} 