import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { X, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import EmailIcon from "../assets/email.png";

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
  const [ authType, setAuthType] = useState(null);
  const [ emailError, setEmailError] = useState("");







useEffect(() => {
  if (step === "otp") {
    setOtp(Array(6).fill(""));
  }
}, [step]);


  

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

    const res = await fetch("https://artistic-cjd8.onrender.com/api/auth/verify-otp", {
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
    const res = await fetch("https://artistic-cjd8.onrender.com/api/auth/google", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (res.ok) {
  localStorage.setItem("user", JSON.stringify(data.user)); // ✅ store user
  setUser(data.user);
  toast.success("Signed in successfully");

  setTimeout(() => {
    onClose();
  }, 500);

  
}  else {
      toast.error("Backend Error");
    }

  } catch (error) {
    console.error(error);

    if (error.code === "auth/popup-closed-by-user") return;
    if(error.code === "auth/cancelled-popup-request") return;
    toast.error("Google Sign-In Failed");
  } finally {
    setLoading(false);
  }
};











  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div
        className={`w-full max-w-xl rounded-md p-12 relative shadow-2xl transition-colors duration-300  ${
          isDark
            ? "bg-[#141414] text-white border-neutral-800"
            : "bg-white text-black border-neutral-300"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-5 right-5 transition cursor-pointer ${
            isDark
              ? "text-gray-400 hover:text-white"
              : "text-gray-600 hover:text-black"
          }`}
        >
          <X size={20} />
        </button>





















{/* ================= OPTIONS ================= */}
{step === "options" && (
  <div className="text-center space-y-6">

    <h2
      className="text-[30px] font-semibold"
      style={{ fontFamily: "Playfair Display, serif" }}
    >
      Welcome back..
    </h2>

    <div className="space-y-4 max-w-sm mx-auto text-[15px]" >

      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className={`w-full h-10 border rounded-md flex items-center justify-center gap-3 cursor-pointer transition shadow-md ${
          isDark
            ? "border-neutral-700 bg-[#202020] hover:bg-neutral-800"
            : "border-gray-300 bg-white"
        }`}
      > 
        <FcGoogle size={22} />
        Sign in with Google
      </button>

      <button
        onClick={() => {
          setAuthType("login");
          localStorage.setItem("authType", "login");
          setStep("email");
        }}
        className={`w-full h-10 border rounded-md flex items-center justify-center gap-2 cursor-pointer transition pr-4 shadow-md ${
          isDark
            ? "border-neutral-700 bg-[#202020] hover:bg-neutral-800"
            : "border-gray-300 bg-white hover:bg-gray-100"
        }`}
      >
        <img src={EmailIcon} alt="Email Icon" className="w-8 h-8" />
        Sign in with email
      </button>
    </div>

    <p className={`text-sm ${isDark ? "text-gray-400 " : "text-gray-600"}`}>
      Don't have an account?{" "}
      <span
        onClick={() => {
          setAuthType("signup");
          localStorage.setItem("authType", "signup");
          setStep("signup-email");
        }}
        className={`underline cursor-pointer ${isDark ? "hover:text-white" : "hover:text-black"}`}
      >
        Create one
      </span>
    </p>

    <p className={`text-[13px] ${isDark ? "text-gray-400" : "text-gray-600"}`}>
      By signing in, you agree to artistic's{" "}
      <Link to="/terms" className={`underline cursor-pointer ${isDark ? "hover:text-white" : "hover:text-black"}`}>
        Terms of Service
      </Link>{" "}
      and{" "}
      <Link to="/privacy-policy" className={`underline cursor-pointer ${isDark ? "hover:text-white" : "hover:text-black"}`}>
        Privacy Policy
      </Link>
    </p>
  </div>
)}


{/* ================= OTP ================= */}
{step === "otp" && (
  <div className="text-center space-y-6">

    <p className={`text-[15px] ${isDark ? "text-gray-400" : "text-gray-500"}`} >
      We send the 6-digit code to{" "}
      <span className={`font-medium ${isDark ? "text-white" : "text-black"}`}>
        {email}
      </span>
    </p>

    <h2 className="text-[28px] font-semibold" style={{ fontFamily: "Playfair Display" }}>
      Enter OTP
    </h2>

    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleVerify();
      }}
    >

      {/* OTP Inputs */}
      <div className="flex justify-center gap-3 mb-4">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index + 1}`}
            type="text"
            maxLength="1"
            value={digit}
            onChange={(e) => handleOtpChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`w-10 h-12 text-center text-lg border rounded-md shadow-lg ${
              isDark
                ? "border-neutral-700 bg-[#1c1c1c] text-white"
                : "border-gray-300 bg-white text-black"
            }`}
          />
        ))}
      </div>

      {/* Button */}
      <button
        type="submit"
        disabled={loading}
        className={`px-5 py-1.5 text-[14px] rounded-full transition cursor-pointer ${
          isDark
            ? "bg-white text-black"
            : "bg-black text-white hover:bg-neutral-900"
        } ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>

    </form>

    <p className={`text-[13px] ${isDark ? "text-gray-400" : "text-gray-600"}`}>
      Didn't receive the code?{" "}
      <span className={`font-medium cursor-pointer ${
        isDark ? "text-white hover:text-gray-300" : "text-black hover:text-gray-500"
      }`}>
        Resend
      </span>
    </p>

  </div>
)}













{/* ================= SIGNUP EMAIL ================= */}
{step === "signup-email" && (
  <div className="text-center space-y-6">

    <h2
      className="text-[30px] font-semibold"
      style={{ fontFamily: "Playfair Display, serif" }}
    >
      Sign up with email
    </h2>

    <form
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
            const res = await fetch("https://artistic-cjd8.onrender.com/api/auth/send-otp", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ email, type: "signup" })
            });

            const data = await res.json();

if (res.ok) {
  setEmailError("");
  toast.success("OTP sent to your email");
  setStep("otp");
} else {
  // 🔥 Show under email instead of toast
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
    >

      <div className="max-w-md mx-auto text-left space-y-4">

        <div>
          <label className="text-[14px]">Your full name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            className={`w-full border shadow-sm p-2 mt-2 rounded-md text-[14px] focus:outline-none ${
              isDark
                ? "border-neutral-700 bg-[#1c1c1c] text-white focus:ring-1 focus:ring-white"
                : "border-gray-300 bg-white text-black focus:ring-1 focus:ring-black"
            }`}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          {errors.fullName && (
            <p className="text-red-500 text-[12px] mt-1">
              {errors.fullName}
            </p>
          )}
        </div>

        <div>
          <label className="text-[14px]">Your email</label>
          <input
            type="email"
            placeholder="Enter your email address"
            className={`w-full border shadow-sm p-2 mt-2 rounded-md text-[14px] focus:outline-none ${
              isDark
                ? "border-neutral-700 bg-[#1c1c1c] text-white focus:ring-1 focus:ring-white"
                : "border-gray-300 bg-white text-black focus:ring-1 focus:ring-black"
            }`}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError(""); // clear error on change
            }}

          />

          {emailError && (
              <p className="text-red-500 text-[12px] mt-1">
                {emailError}
              </p>
            )}

          {errors.email && (
            <p className="text-red-500 text-[12px] mt-1">
              {errors.email}
            </p>
          )}
        </div>

      </div>

      {/* Terms */}
      <div className="max-w-md mx-auto text-left flex items-start gap-3 mt-4">

        <input
          type="checkbox"
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e.target.checked)}
          className="mt-1 w-4 h-4 cursor-pointer"
        />

        <div>
          <p className={`text-[14px] font-medium ${isDark ? "text-white" : "text-black"}`}>
            Accept terms and conditions
          </p>

          <p className={`text-[13px] ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            By clicking this checkbox, you agree to the terms.
          </p>
        </div>

      </div>

      {/* Button */}
      <button
        type="submit"
        disabled={loading}
        className={`mt-6 px-5 py-1.5 text-[14px] rounded-full transition cursor-pointer ${
          isDark
            ? "bg-white text-black"
            : "bg-black text-white hover:bg-neutral-900"
        } ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
      >
        {loading ? "Creating..." : "Create account"}
      </button>

    </form>

    <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
      Already have an account?{" "}
      <span
        onClick={() => {
          setAuthType("login");
          localStorage.setItem("authType", "login");
          setStep("email");
          setEmailError("");
        }}
        className={`underline cursor-pointer ${isDark ? "hover:text-white" : "hover:text-black"}`}
      >
        Sign in
      </span>
    </p>

  </div>
)}

















{/* ================= EMAIL ================= */}
{step === "email" && (
  <div className="text-center space-y-6">

    <h1
      className="text-[28px] font-semibold"
      style={{ fontFamily: "Playfair Display, serif" }}
    >
      Sign in with email
    </h1>

    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
          const res = await fetch("https://artistic-cjd8.onrender.com/api/auth/send-otp", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, type: "login" })
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
    >

      <div className="max-w-md mx-auto text-left">
        <label className="text-[14px]">Your email</label>
        <input
  type="email"
  placeholder="Enter your email address"
  className={`w-full border shadow-sm p-2 mt-2 rounded-sm text-[14px] focus:outline-none ${
    isDark
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
  <p className="text-red-500 text-[12px] mt-1">
    {emailError}
  </p>
)}
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`mt-6 px-5 py-1.5 text-[14px] rounded-full transition cursor-pointer ${
          isDark
            ? "bg-white text-black hover:bg-neutral-200"
            : "bg-black text-white hover:bg-neutral-900"
        } ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
      >
        {loading ? "Sending code..." : "Continue"}
      </button>

    </form>

    <p className={`text-[14px] ${isDark ? "text-gray-400" : "text-gray-600"}`}>
      Don't have an account?{" "}
      <span
        onClick={() => {
          setAuthType("signup");
          localStorage.setItem("authType", "signup");
          setStep("signup-email");
          setEmailError("");
        }}
        className={`underline cursor-pointer ${isDark ? "hover:text-white" : "hover:text-black"}`}
      >
        Create one
      </span>
    </p>

    <p
      onClick={() => setStep("options")}
      className={`text-[14px] cursor-pointer ${
        isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-black"
      }`}
    >
      <ArrowLeft className="inline-block mr-2" size={16} />
      Back to Sign In Options
    </p>

  </div>
)}

      </div>
    </div>
  );
}