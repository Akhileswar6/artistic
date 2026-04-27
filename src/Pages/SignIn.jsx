import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { X, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import EmailIcon from "../assets/email.png";
import PencilSketch from "../assets/Pencil.webp";
import CharcoalSketch from "../assets/Charcoal.jpg";
import { motion, AnimatePresence } from "framer-motion";

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

  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";




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
      const res = await fetch(`${BASE_URL}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type })
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("OTP resent successfully");
        setResendTimer(60);
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

      const res = await fetch(`${BASE_URL}/api/auth/verify-otp`, {
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
      const res = await fetch(`${BASE_URL}/api/auth/google`, {
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
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`w-full max-w-3xl min-h-[480px] flex flex-col md:flex-row rounded-2xl overflow-hidden relative shadow-2xl transition-colors duration-300 ${isDark
            ? "bg-[#141414] text-white shadow-black/80"
            : "bg-white text-black shadow-xl"
          }`}
      >
        {/* ================= LEFT SIDE (ARTISTIC BG) ================= */}
        <div className="hidden md:block md:w-1/2 relative overflow-hidden bg-black">
          <motion.img
            // initial={{ scale: 1.0 }}
            // animate={{ scale: 1.1 }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
            src={isDark ? CharcoalSketch : PencilSketch}
            alt="Artistic Sketch"
            className={`absolute inset-0 w-full h-full object-cover ${isDark ? "opacity-60" : "opacity-90 grayscale-[20%]"}`}
          />
          {/* Blend Gradient */}
          <div
            className={`absolute inset-0 bg-gradient-to-r ${isDark
                ? "from-transparent via-transparent to-[#141414]"
                : "from-transparent via-transparent to-white"
              }`}
          />
          {/* Overlay Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-8 z-10 mix-blend-normal">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className={`text-4xl font-bold mb-3 ${isDark ? "text-white" : "text-[#1a1a1a]"}`}
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Artistic.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className={`text-sm leading-relaxed max-w-[90%] font-medium ${isDark ? "text-neutral-300" : "text-gray-800"}`}
            >
              Where imagination meets canvas. Join our community and bring your creative visions to life.
            </motion.p>
          </div>
        </div>

        {/* ================= RIGHT SIDE (CONTENT) ================= */}
        <div className="w-full md:w-1/2 p-6 md:p-10 relative flex flex-col justify-center">
          {/* Close Button */}
          <button
            onClick={onClose}
            className={`absolute top-5 right-5 transition cursor-pointer z-50 ${isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-black"
              }`}
          >
            <X size={20} />
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
                className="text-center space-y-6"
              >
                <motion.h2
                  variants={itemVariants}
                  className="text-[30px] font-semibold"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  Welcome back..
                </motion.h2>

                <motion.div variants={itemVariants} className="space-y-4 w-full mx-auto text-[15px]">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className={`w-full h-11 border rounded-lg flex items-center justify-center gap-3 cursor-pointer transition shadow-sm ${isDark
                        ? "border-neutral-700 bg-[#202020] hover:bg-neutral-800"
                        : "border-gray-300 bg-white hover:bg-gray-50"
                      }`}
                  >
                    <FcGoogle size={22} />
                    Sign in with Google
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setAuthType("login");
                      localStorage.setItem("authType", "login");
                      setStep("email");
                    }}
                    className={`w-full h-11 border rounded-lg flex items-center justify-center gap-2 cursor-pointer transition pr-4 shadow-sm ${isDark
                        ? "border-neutral-700 bg-[#202020] hover:bg-neutral-800"
                        : "border-gray-300 bg-white hover:bg-gray-50"
                      }`}
                  >
                    <img src={EmailIcon} alt="Email Icon" className="w-6 h-6" />
                    Sign in with email
                  </motion.button>
                </motion.div>

                <motion.p variants={itemVariants} className={`text-sm ${isDark ? "text-gray-400 " : "text-gray-600"}`}>
                  Don't have an account?{" "}
                  <span
                    onClick={() => {
                      setAuthType("signup");
                      localStorage.setItem("authType", "signup");
                      setStep("signup-email");
                    }}
                    className={`underline cursor-pointer font-medium ${isDark ? "hover:text-white" : "hover:text-black"
                      }`}
                  >
                    Create one
                  </span>
                </motion.p>

                <motion.p variants={itemVariants} className={`text-[12px] pt-4 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                  By signing in, you agree to {"Artistic's "}
                  <Link to="/terms" onClick={onClose} className={`underline cursor-pointer ${isDark ? "hover:text-white" : "hover:text-black"}`}>
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy-policy" onClick={onClose} className={`underline cursor-pointer ${isDark ? "hover:text-white" : "hover:text-black"}`}>
                    Privacy Policy
                  </Link>
                </motion.p>
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
                className="text-center space-y-6"
              >
                <motion.div variants={itemVariants} className="flex justify-center mb-2">
                  <div className={`p-3 rounded-full ${isDark ? 'bg-neutral-800' : 'bg-gray-100'}`}>
                    <img src={EmailIcon} alt="Email Icon" className="w-6 h-6 opacity-70" />
                  </div>
                </motion.div>

                <motion.h2 variants={itemVariants} className="text-[28px] font-semibold" style={{ fontFamily: "Playfair Display" }}>
                  Enter OTP
                </motion.h2>

                <motion.p variants={itemVariants} className={`text-[14px] ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  We sent a 6-digit code to <br />
                  <span className={`font-medium mt-1 inline-block ${isDark ? "text-white" : "text-black"}`}>
                    {email}
                  </span>
                </motion.p>

                <motion.form
                  variants={itemVariants}
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleVerify();
                  }}
                >
                  {/* OTP Inputs */}
                  <div className="flex justify-center gap-2 sm:gap-3 mb-6 mt-4">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index + 1}`}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(e.target.value, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        className={`w-9 sm:w-11 h-12 text-center text-lg border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${isDark
                            ? "border-neutral-700 bg-[#1c1c1c] text-white focus:ring-white/30"
                            : "border-gray-300 bg-white text-black focus:ring-black/20"
                          }`}
                      />
                    ))}
                  </div>

                  {/* Button */}
                  <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2.5 text-[14px] font-medium rounded-lg transition cursor-pointer shadow-md ${isDark
                        ? "bg-white text-black hover:bg-gray-200"
                        : "bg-black text-white hover:bg-neutral-800"
                      } ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </motion.button>
                </motion.form>

                {resendTimer > 0 ? (
                  <p className={`text-[13px] ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    Resend code in 00:{resendTimer.toString().padStart(2, "0")}
                  </p>
                ) : (
                  <p className={`text-[13px] ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    Didn't receive the code?{" "}
                    <span
                      onClick={handleResendOTP}
                      className={`font-medium cursor-pointer underline ${isDark ? "text-white hover:text-gray-300" : "text-black hover:text-gray-500"
                        }`}
                    >
                      Resend
                    </span>
                  </p>
                )}
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
                className="text-center space-y-5"
              >
                <motion.h2
                  variants={itemVariants}
                  className="text-[30px] font-semibold"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  Create Account
                </motion.h2>

                <motion.form
                  variants={itemVariants}
                  onSubmit={async (e) => {
                    e.preventDefault();

                    if (validateForm()) {
                      localStorage.setItem("authType", "signup");

                      if (!acceptTerms) {
                        toast.error("Please accept terms and conditions");
                        return;
                      }

                      setLoading(true);

                      try {
                        const res = await fetch(`${BASE_URL}/api/auth/send-otp`, {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({ email, type: "signup" }),
                        });

                        const data = await res.json();

                        if (res.ok) {
                          setEmailError("");
                          toast.success("OTP sent to your email");
                          setStep("otp");
                        } else {
                          if (
                            data.message.includes("exists") ||
                            data.message.includes("signup")
                          ) {
                            setEmailError(data.message);
                          } else {
                            toast.error(data.message);
                          }
                        }
                      } catch {
                        toast.error("Something went wrong");
                      } finally {
                        setLoading(false);
                      }
                    }
                  }}
                  className="space-y-4 text-left"
                >
                  <motion.div variants={itemVariants}>
                    <label className={`text-[13px] font-medium ml-1 ${isDark ? "text-gray-300" : "text-gray-600"}`}>Full Name</label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      className={`w-full border p-2.5 mt-1.5 rounded-lg text-[14px] focus:outline-none transition-shadow ${isDark
                          ? "border-neutral-700 bg-[#1c1c1c] text-white focus:ring-1 focus:ring-white"
                          : "border-gray-300 bg-white text-black focus:ring-1 focus:ring-black"
                        }`}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-[12px] mt-1.5 ml-1">{errors.fullName}</p>
                    )}
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label className={`text-[13px] font-medium ml-1 ${isDark ? "text-gray-300" : "text-gray-600"}`}>Email Address</label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className={`w-full border p-2.5 mt-1.5 rounded-lg text-[14px] focus:outline-none transition-shadow ${isDark
                          ? "border-neutral-700 bg-[#1c1c1c] text-white focus:ring-1 focus:ring-white"
                          : "border-gray-300 bg-white text-black focus:ring-1 focus:ring-black"
                        }`}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError("");
                      }}
                    />
                    {emailError && <p className="text-red-500 text-[12px] mt-1.5 ml-1">{emailError}</p>}
                    {errors.email && <p className="text-red-500 text-[12px] mt-1.5 ml-1">{errors.email}</p>}
                  </motion.div>

                  {/* Terms */}
                  <motion.div variants={itemVariants} className="flex items-start gap-3 mt-2 px-1">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="mt-1 w-4 h-4 cursor-pointer accent-black"
                    />
                    <div>
                      <p className={`text-[13px] font-medium ${isDark ? "text-white" : "text-black"}`}>
                        Accept terms and conditions
                      </p>
                      <p className={`text-[12px] leading-tight mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        By checking this, you agree to our Terms of Service.
                      </p>
                    </div>
                  </motion.div>

                  {/* Button */}
                  <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className={`w-full mt-2 py-2.5 text-[14px] font-medium rounded-lg transition cursor-pointer shadow-md ${isDark
                        ? "bg-white text-black hover:bg-gray-200"
                        : "bg-black text-white hover:bg-neutral-800"
                      } ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    {loading ? "Creating..." : "Create account"}
                  </motion.button>
                </motion.form>

                <p className={`text-[13.5px] ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Already have an account?{" "}
                  <span
                    onClick={() => {
                      setAuthType("login");
                      localStorage.setItem("authType", "login");
                      setStep("email");
                      setEmailError("");
                    }}
                    className={`underline font-medium cursor-pointer ${isDark ? "hover:text-white" : "hover:text-black"
                      }`}
                  >
                    Sign in
                  </span>
                </p>
              </motion.div>
            )}

            {/* ================= EMAIL ================= */}
            {step === "email" && (
              <motion.div
                key="email"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="text-center space-y-6"
              >
                <motion.div variants={itemVariants} className="flex justify-center mb-2">
                  <div className={`p-4 rounded-full ${isDark ? 'bg-neutral-800' : 'bg-gray-100'}`}>
                    <img src={EmailIcon} alt="Email Icon" className="w-8 h-8 opacity-80" />
                  </div>
                </motion.div>

                <motion.h1
                  variants={itemVariants}
                  className="text-[28px] font-semibold"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  Sign In
                </motion.h1>

                <motion.form
                  variants={itemVariants}
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setLoading(true);

                    try {
                      const res = await fetch(`${BASE_URL}/api/auth/send-otp`, {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ email, type: "login" }),
                      });

                      const data = await res.json();

                      if (res.ok) {
                        setEmailError("");
                        toast.success("OTP sent to your email");
                        setStep("otp");
                      } else {
                        if (
                          data.message.includes("No account") ||
                          data.message.includes("signup")
                        ) {
                          setEmailError(data.message);
                        } else {
                          toast.error(data.message);
                        }
                      }
                    } catch {
                      toast.error("Something went wrong");
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="text-left space-y-4"
                >
                  <motion.div variants={itemVariants}>
                    <label className={`text-[13px] font-medium ml-1 ${isDark ? "text-gray-300" : "text-gray-600"}`}>Email Address</label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className={`w-full border p-2.5 mt-1.5 rounded-lg text-[14px] focus:outline-none transition-shadow ${isDark
                          ? "border-neutral-700 bg-[#1c1c1c] text-white focus:ring-1 focus:ring-white"
                          : "border-gray-300 bg-white text-black focus:ring-1 focus:ring-black"
                        }`}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError("");
                      }}
                    />
                    {emailError && (
                      <p className="text-red-500 text-[12px] mt-1.5 ml-1">{emailError}</p>
                    )}
                  </motion.div>

                  <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className={`w-full mt-2 py-2.5 text-[14px] font-medium rounded-lg transition cursor-pointer shadow-md ${isDark
                        ? "bg-white text-black hover:bg-gray-200"
                        : "bg-black text-white hover:bg-neutral-800"
                      } ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    {loading ? "Sending code..." : "Continue"}
                  </motion.button>
                </motion.form>

                <motion.p variants={itemVariants} className={`text-[13.5px] ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Don't have an account?{" "}
                  <span
                    onClick={() => {
                      setAuthType("signup");
                      localStorage.setItem("authType", "signup");
                      setStep("signup-email");
                      setEmailError("");
                    }}
                    className={`underline font-medium cursor-pointer ${isDark ? "hover:text-white" : "hover:text-black"
                      }`}
                  >
                    Create one
                  </span>
                </motion.p>

                <motion.p
                  variants={itemVariants}
                  onClick={() => setStep("options")}
                  className={`text-[13.5px] cursor-pointer inline-flex items-center mt-4 transition-colors ${isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-black"
                    }`}
                >
                  <ArrowLeft className="mr-1.5" size={14} />
                  Back to options
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}