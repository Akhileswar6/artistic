import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { X, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import EmailIcon from "../assets/email.png";
import PencilSketch from "../assets/Pencil.webp";
import CharcoalSketch from "../assets/Charcoal.jpg";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.png";
import { API_BASE_URL } from "../config";


const containerVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      staggerChildren: 0.08,
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

import { auth, googleProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
export default function SignIn({ onClose, isDark, setUser }) {
  const [errors, setErrors] = useState({});
  const [fullName, setFullName] = useState("");
  const [step, setStep] = useState("options");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authType, setAuthType] = useState(null);
  const [emailError, setEmailError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [focusedField, setFocusedField] = useState(null);









  useEffect(() => {
    if (step === "otp") {
      setOtp(Array(6).fill(""));
      setResendTimer(60);
    }

  }, [step]);

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleResendOTP = async () => {
    if (resendTimer > 0 || loading) return;

    setLoading(true);
    try {
      const type = localStorage.getItem("authType") || "login";
      const res = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type })
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("OTP resent successfully");
        setResendTimer(5);
      } else {

        toast.error(data.message || "Failed to resend OTP");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };




  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 2}`);
      nextInput?.focus();
    }
  };



  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {

      // Case 1: If current box has value → clear it
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
      // Case 2: If empty → move to previous
      else if (index > 0) {
        document.getElementById(`otp-${index}`)?.focus();
      }
    }
  };



  const validateForm = () => {
    let newErrors = {};
    if (!fullName.trim()) newErrors.fullName = "Full name is required";
    if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Enter a valid email";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };




  const handleVerify = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length < 6) {
      toast.error("Please enter full OTP");
      return;
    }

    setLoading(true);

    try {
      const storedType = localStorage.getItem("authType");
      const isSignup = storedType === "signup";

      const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          otp: enteredOtp,
          fullName,
          type: isSignup ? "signup" : "login"
        })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        localStorage.setItem("loginTimestamp", Date.now().toString());
        localStorage.setItem("isNewUser", isSignup ? "true" : "false");
        localStorage.removeItem("authType");
        setUser(data.user);

        toast.success(
          isSignup
            ? "Account created successfully"
            : "Logged in successfully"
        );

        setTimeout(() => {
          onClose();
        }, 500);
      } else {
        toast.error(data.message);
      }

    } catch (err) {
      toast.error("Verification failed");
    } finally {
      setLoading(false);
    }
  };





  const handleGoogleSignIn = async () => {
    if (loading) return; // Prevent multiple clicks
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const token = await user.getIdToken();

      // Send token to backend
      const res = await fetch(`${API_BASE_URL}/api/auth/google`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user)); // ✅ store user
        localStorage.setItem("token", data.token);
        localStorage.setItem("loginTimestamp", Date.now().toString());
        localStorage.setItem("isNewUser", "false");
        setUser(data.user);
        toast.success("Signed in successfully");

        setTimeout(() => {
          onClose();
        }, 500);


      } else {
        toast.error("Backend Error");
      }

    } catch (error) {
      console.error(error);

      if (error.code === "auth/popup-closed-by-user") return;
      if (error.code === "auth/cancelled-popup-request") return;
      toast.error("Google Sign-In Failed");
    } finally {
      setLoading(false);
    }
  };








  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={`w-full max-w-[440px] md:max-w-4xl min-h-[500px] flex flex-col md:flex-row rounded-3xl overflow-hidden relative shadow-2xl transition-colors duration-500 ${isDark
            ? "bg-[#0a0a0a] text-white shadow-black/90 border border-white/5"
            : "bg-white text-black shadow-2xl border border-black/5"
          }`}
      >

        {/* ================= LEFT SIDE (ARTISTIC BG - DESKTOP ONLY) ================= */}
        <div className="hidden md:flex md:w-[45%] relative overflow-hidden bg-[#050505]">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ 
              scale: [1.1, 1.15, 1.1],
              rotate: [0, 1, 0]
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
            src={isDark ? CharcoalSketch : PencilSketch}
            alt="Artistic Sketch"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isDark ? "opacity-50" : "opacity-80 grayscale-[30%]"}`}
          />
          {/* Advanced Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80" />
          <div className={`absolute inset-0 bg-gradient-to-r ${isDark
                ? "from-transparent via-transparent to-[#0a0a0a]"
                : "from-transparent via-transparent to-white"
              }`}
          />
          
          {/* Floating Artistic Elements */}
          <div className="absolute top-10 left-10 w-20 h-20 border border-white/10 rounded-full blur-2xl animate-pulse" />
          
          {/* Overlay Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-10 z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
            >
                <img src={logo} alt="artistic" className="h-14 w-auto object-contain mb-4" />
              <p className={`text-[15px] leading-relaxed max-w-[85%] font-medium ${isDark ? "text-neutral-400" : "text-neutral-500"}`}>
                Where every sketch breathes
              </p>
            </motion.div>
          </div>
        </div>

        {/* ================= RIGHT SIDE (CONTENT) ================= */}
        <div className="w-full md:w-[55%] p-6 sm:p-10 md:p-12 relative flex flex-col justify-center min-h-[500px]">

          {/* Mobile Header (Hidden on Desktop) */}
          <div className="md:hidden mb-8">
              <img src={logo} alt="artistic" className="h-10 w-auto object-contain" />
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className={`absolute top-6 right-6 p-2 rounded-full transition-all duration-300 z-50 ${
              isDark 
                ? "text-gray-500 hover:text-white hover:bg-white/5" 
                : "text-gray-400 hover:text-black hover:bg-black/5"
              }`}
          >
            <X size={22} />
          </button>

          <AnimatePresence mode="wait">
            {/* ================= OPTIONS ================= */}
            {step === "options" && (
              <motion.div
                key="options"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-8"
              >
                <div className="space-y-2">
                  <motion.h2
                    variants={itemVariants}
                    className="text-3xl md:text-4xl tracking-tight"
                    style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
                  >
                    Welcome back
                  </motion.h2>
                  <motion.p 
                    variants={itemVariants}
                    className={`text-sm ${isDark ? "text-neutral-500" : "text-neutral-500"}`}
                  >
                    Sign in to manage your commissions and orders.
                  </motion.p>
                </div>

                <motion.div variants={itemVariants} className="space-y-4 w-full">
                  <motion.button
                    whileHover={{ scale: 1.01, y: -1 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className={`w-full h-11 rounded-full text-[14px] flex items-center justify-center gap-3 cursor-pointer transition-all duration-300 font-medium ${isDark
                        ? "border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800 hover:border-neutral-700 text-white"
                        : "border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 text-black shadow-sm"
                      }`}
                  >
                    <FcGoogle size={20} />
                    Continue with Google
                  </motion.button>

                  <div className="relative py-2 flex items-center">
                    <div className={`flex-grow border-t ${isDark ? "border-neutral-800" : "border-gray-200"}`}></div>
                    <span className={`flex-shrink mx-4 text-[11px] uppercase tracking-widest font-bold ${isDark ? "text-neutral-700" : "text-gray-400"}`}>or</span>
                    <div className={`flex-grow border-t ${isDark ? "border-neutral-800" : "border-gray-200"}`}></div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01, y: -1 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => {
                      setAuthType("login");
                      localStorage.setItem("authType", "login");
                      setStep("email");
                    }}
                   className={`w-full h-11 rounded-full text-[14px] flex items-center justify-center gap-3 cursor-pointer transition-all duration-300 font-medium ${isDark
                        ? "border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800 hover:border-neutral-700 text-white"
                        : "border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 text-black shadow-sm"
                      }`}
                  >
                    <div className={`p-1 rounded-md ${isDark ? "bg-black/5" : "bg-white/10"}`}>
                      <img src={EmailIcon} alt="Email" className="w-7 h-7" />
                    </div>
                    Continue with Email
                  </motion.button>
                </motion.div>

                <div className="space-y-4">
                  <motion.p variants={itemVariants} className={`text-sm text-center ${isDark ? "text-neutral-500" : "text-neutral-500"}`}>
                    New to Artistic?{" "}
                    <span
                      onClick={() => {
                        setAuthType("signup");
                        localStorage.setItem("authType", "signup");
                        setStep("signup-email");
                      }}
                      className={`cursor-pointer  underline transition-colors ${isDark ? "text-neutral-500 hover:text-white" : "text-neutral-500 hover:text-neutral-700"
                        }`}
                    >
                      Create an account
                    </span>
                  </motion.p>

                  <motion.p variants={itemVariants} className={`text-[11px] text-center leading-relaxed ${isDark ? "text-neutral-500" : "text-neutral-500"}`}>
                    By continuing, you agree to our{" "}
                    <Link to="/terms" onClick={onClose} className={`underline hover:text-neutral-400 ${isDark ? "text-neutral-500 hover:text-white" : "text-neutral-500 hover:text-neutral-700"}`}>Terms</Link>
                    {" "}and{" "}
                    <Link to="/privacy-policy" onClick={onClose} className={`underline hover:text-neutral-400 ${isDark ? "text-neutral-500 hover:text-white" : "text-neutral-500 hover:text-neutral-700"}`}>Privacy Policy</Link>.
                  </motion.p>
                </div>
              </motion.div>
            )}

            {/* ================= OTP ================= */}
            {step === "otp" && (
              <motion.div
                key="otp"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-8"
              >
                <div className="space-y-3">
                   <motion.button
                    whileHover={{ x: -3 }}
                    onClick={() => setStep(authType === 'signup' ? 'signup-email' : 'email')}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${isDark ? "text-neutral-500 hover:text-white" : "text-neutral-400 hover:text-black"}`}
                  >
                    <ArrowLeft size={16} />
                    Change email
                  </motion.button>
                  <motion.h2 variants={itemVariants} className="text-3xl font-bold tracking-tight" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
                    Verify code
                  </motion.h2>
                  <motion.p variants={itemVariants} className={`text-sm leading-relaxed ${isDark ? "text-neutral-500" : "text-neutral-500"}`}>
                    We've sent a 6-digit verification code to <br/>
                    <span className={` ${isDark ? "text-white" : "text-black"}`}>{email}</span>
                  </motion.p>
                </div>

                <motion.form
                  variants={itemVariants}
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleVerify();
                  }}
                  className="space-y-8"
                >
                  <div className="flex justify-between gap-2 sm:gap-3">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index + 1}`}
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(e.target.value, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        className={`w-full h-14 text-center text-xl font-bold border rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 ${isDark
                            ? "border-neutral-800 bg-neutral-900/50 text-white focus:ring-white/20 focus:border-white/30"
                            : "border-gray-200 bg-white text-black focus:ring-black/5 focus:border-black/20 shadow-sm"
                          }`}
                      />
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={loading}
                    className={`w-full h-10 text-[15px] rounded-lg transition-all duration-300 cursor-pointer shadow-lg ${isDark
                        ? "bg-white text-black hover:bg-neutral-200"
                        : "bg-black text-white hover:bg-neutral-800"
                      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {loading ? "Verifying..." : "Verify Identity"}
                  </motion.button>
                </motion.form>

                <div className="text-center">
                  {resendTimer > 0 ? (
                    <p className={`text-sm font-medium ${isDark ? "text-neutral-600" : "text-neutral-400"}`}>
                      Resend code in <span className="font-bold tabular-nums">00:{resendTimer.toString().padStart(2, "0")}</span>
                    </p>
                  ) : (
                    <p className={`text-sm ${isDark ? "text-neutral-500" : "text-neutral-500"} `}>Didn't receive code?{" "}
                    <button
                      onClick={handleResendOTP}
                      className={`text-sm underline cursor-pointer transition-colors ${isDark ? "text-neutral-500 hover:text-white" : "text-neutral-500 hover:text-black"
                        }`}
                    >
                        Resend
                    </button>
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {/* ================= SIGNUP EMAIL ================= */}
            {step === "signup-email" && (
              <motion.div
                key="signup-email"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-8"
              >
                 <div className="space-y-3">
                   <motion.button
                    whileHover={{ x: -3 }}
                    onClick={() => setStep("options")}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${isDark ? "text-neutral-500 hover:text-white" : "text-neutral-400 hover:text-black"}`}
                  >
                    <ArrowLeft size={16} />
                    Back
                  </motion.button>
                  <motion.h2 variants={itemVariants} className="text-3xl tracking-tight" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
                    Create account
                  </motion.h2>
                  <motion.p variants={itemVariants} className={`text-sm ${isDark ? "text-neutral-500" : "text-neutral-500"}`}>
                    Join our community of art lovers.
                  </motion.p>
                </div>

                <motion.form
                  variants={itemVariants}
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (validateForm()) {
                      if (!acceptTerms) {
                        toast.error("Please accept terms and conditions");
                        return;
                      }
                      setLoading(true);
                      try {
                        const res = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ email, type: "signup" }),
                        });
                        const data = await res.json();
                        if (res.ok) {
                          setEmailError("");
                          toast.success("OTP sent to your email");
                          setStep("otp");
                        } else {
                          setEmailError(data.message.includes("exists") ? data.message : "");
                          if (!data.message.includes("exists")) toast.error(data.message);
                        }
                      } catch {
                        toast.error("Something went wrong");
                      } finally {
                        setLoading(false);
                      }
                    }
                  }}
                  className="space-y-5"
                >
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className={`text-xs uppercase ml-1 transition-colors duration-200 ${
                        focusedField === "fullName" 
                          ? (isDark ? "text-white" : "text-black") 
                          : (isDark ? "text-neutral-500" : "text-neutral-400")
                      }`}>Full Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        onFocus={() => setFocusedField("fullName")}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full h-10 px-4 rounded-lg text-sm border transition-all duration-300 focus:outline-none ${isDark
                            ? "border-neutral-800 bg-neutral-900/50 text-white focus:border-white/30 placeholder:text-neutral-700"
                            : "border-gray-200 bg-white text-black focus:border-black/20 focus:ring-2 focus:ring-black/5 shadow-sm placeholder:text-neutral-400"
                          }`}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />

                      {errors.fullName && <p className="text-red-500 text-[11px] ml-1 font-medium">{errors.fullName}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className={`text-xs uppercase ml-1 transition-colors duration-200 ${
                        focusedField === "email" 
                          ? (isDark ? "text-white" : "text-black") 
                          : (isDark ? "text-neutral-500" : "text-neutral-400")
                      }`}>Email Address</label>
                      <input
                        type="email"
                        placeholder="name@example.com"
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full h-10 px-4 rounded-lg text-sm border transition-all duration-300 focus:outline-none ${isDark
                            ? "border-neutral-800 bg-neutral-900/50 text-white focus:border-white/30 placeholder:text-neutral-700"
                            : "border-gray-200 bg-white text-black focus:border-black/20 focus:ring-2 focus:ring-black/5 shadow-sm placeholder:text-neutral-400"
                          }`}
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                      />

                      {(emailError || errors.email) && <p className="text-red-500 text-[11px] ml-1 font-medium">{emailError || errors.email}</p>}
                    </div>
                  </div>

                  <div className={`flex gap-4`}>
                    <input
                      type="checkbox"
                      id="terms"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="mt-1 w-4 h-4 cursor-pointer accent-black shrink-0"
                    />
                    <label htmlFor="terms" className={`text-sm leading-relaxed font-medium cursor-pointer ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                      <p className={`mb-1 ${isDark ? "text-neutral-300" : "text-neutral-900"}`}>Accept Terms and Conditions</p>
                      <p className={`text-xs ${isDark ? "text-neutral-500" : "text-neutral-500"}`}>By checking this, you agree to our <Link to="/terms" className={`underline ${isDark ? "hover:text-white" : "hover:text-black"}`}>Terms of Service</Link> and <Link to="/privacy-policy" className={`underline ${isDark ? "hover:text-white" : "hover:text-black"}`}>Privacy Policy</Link>.</p>
                    </label>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={loading}
                    className={`w-full h-10 text-sm rounded-lg transition-all duration-300 cursor-pointer shadow-lg ${isDark
                        ? "bg-white text-black hover:bg-neutral-200"
                        : "bg-black text-white hover:bg-neutral-800"
                      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </motion.button>
                </motion.form>

                <p className={`text-sm text-center ${isDark ? "text-neutral-500" : "text-neutral-500"}`}>
                  Already have an account?{" "}
                  <span
                    onClick={() => { setAuthType("login"); setStep("email"); setEmailError(""); }}
                    className={`cursor-pointer transition-colors underline ${isDark ? "text-neutral-500 hover:text-neutral-300" : "text-neutral-500 hover:text-black"}`}
                  >
                    Sign in
                  </span>
                </p>

              </motion.div>
            )}

            {/* ================= EMAIL SIGN IN ================= */}
            {step === "email" && (
              <motion.div
                key="email"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-8"
              >
                <div className="space-y-3">
                   <motion.button
                    whileHover={{ x: -3 }}
                    onClick={() => setStep("options")}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${isDark ? "text-neutral-500 hover:text-white" : "text-neutral-400 hover:text-black"}`}
                  >
                    <ArrowLeft size={16} />
                    Back
                  </motion.button>
                  <motion.h2 variants={itemVariants} className="text-3xl tracking-tight" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
                    Sign in
                  </motion.h2>
                  <motion.p variants={itemVariants} className={`text-sm ${isDark ? "text-neutral-500" : "text-neutral-500"}`}>
                    Enter your email to receive a secure login code.
                  </motion.p>
                </div>

                <motion.form
                  variants={itemVariants}
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!/\S+@\S+\.\S+/.test(email)) { toast.error("Please enter a valid email"); return; }
                    setLoading(true);
                    try {
                      const res = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, type: "login" }),
                      });
                      const data = await res.json();
                      if (res.ok) {
                        setEmailError("");
                        toast.success("Login code sent!");
                        setStep("otp");
                      } else {
                        setEmailError(data.message.includes("No account") ? data.message : "");
                        if (!data.message.includes("No account")) toast.error(data.message);
                      }
                    } catch {
                      toast.error("Something went wrong");
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="space-y-6"
                >
                  <div className="space-y-1.5">
                    <label className={`text-xs uppercase ml-1 transition-colors duration-200 ${
                      focusedField === "loginEmail" 
                        ? (isDark ? "text-white" : "text-black") 
                        : (isDark ? "text-neutral-500" : "text-neutral-400")
                    }`}>Email Address</label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      autoFocus
                      onFocus={() => setFocusedField("loginEmail")}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full h-10 px-4 rounded-lg text-sm border transition-all duration-300 focus:outline-none ${isDark
                          ? "border-neutral-800 bg-neutral-900/50 text-white focus:border-white/30 placeholder:text-neutral-700"
                          : "border-gray-200 bg-white text-black focus:border-black/20 focus:ring-1 focus:ring-black/20 shadow-sm placeholder:text-neutral-400"
                        }`}
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                    />

                    {emailError && <p className="text-red-500 text-[11px] ml-1 font-medium">{emailError}</p>}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={loading}
                    className={`w-full h-10 text-[15px]  rounded-lg transition-all duration-300 cursor-pointer shadow-lg ${isDark
                        ? "bg-white text-black hover:bg-neutral-200"
                        : "bg-black text-white hover:bg-neutral-800"
                      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {loading ? "Sending Code..." : "Send Login Code"}
                  </motion.button>
                </motion.form>

                <p className={`text-sm text-center ${isDark ? "text-neutral-500" : "text-neutral-500"}`}>
                  Don't have an account?{" "}
                  <span
                    onClick={() => { setAuthType("signup"); setStep("signup-email"); setEmailError(""); }}
                    className={`cursor-pointer transition-colors underline ${isDark ? "text-neutral-500 hover:text-neutral-300" : "text-neutral-500 hover:text-black"}`}
                  >
                    Join now
                  </span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>

  );
}