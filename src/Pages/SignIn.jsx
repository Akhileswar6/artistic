import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import EmailIcon from "../assets/email.png";

export default function SignIn({ onClose, isDark }) {
  const [errors, setErrors] = useState({});
  const [fullName, setFullName] = useState("");
  const [step, setStep] = useState("options");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));

  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!fullName.trim()) newErrors.fullName = "Full name is required";
    if (!email.includes("@")) newErrors.email = "Enter a valid email";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div
        className={`w-full max-w-xl rounded-md p-12 relative shadow-2xl transition-colors duration-300 ${
          isDark
            ? "bg-[#0f1115] text-white"
            : "bg-white text-black"
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

            <div className="space-y-4 max-w-sm mx-auto text-[15px]">

              <button
                className={`w-full h-10 border rounded-md flex items-center justify-center gap-3 cursor-pointer transition shadow-md ${
                  isDark
                    ? "border-neutral-700 bg-[#1c1c1c]"
                    : "border-gray-300 bg-white"
                }`}
              >
                <FcGoogle size={22} />
                Sign in with Google
              </button>

              <button
                onClick={() => setStep("email")}
                className={`w-full h-10 border rounded-md flex items-center justify-center gap-2 cursor-pointer transition pr-4 shadow-md ${
                  isDark
                    ? "border-neutral-700 bg-[#1c1c1c] hover:bg-neutral-800"
                    : "border-gray-300 bg-white hover:bg-gray-100"
                }`}
              >
                <img src={EmailIcon} alt="Email Icon" className="w-8 h-8" />
                Sign in with email
              </button>
            </div>

            <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Don't have an account?{" "}
              <span
                onClick={() => setStep("signup-email")}
                className="underline cursor-pointer"
              >
                Create one
              </span>
            </p>

            <p className={`text-[12px] ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              By signing in, you agree to artistic's{" "}
              <Link to="/terms" className="underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy-policy" className="underline">
                Privacy Policy
              </Link>
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
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && (
                  <p className="text-red-500 text-[12px] mt-1">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => {
                if (validateForm()) setStep("otp");
              }}
              className={`px-8 py-2 text-[14px] rounded-full transition ${
                isDark
                  ? "bg-white text-black hover:bg-neutral-200"
                  : "bg-black text-white hover:bg-neutral-900"
              }`}
            >
              Create account
            </button>

            <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Already have an account?{" "}
              <span
                onClick={() => setStep("options")}
                className="underline cursor-pointer"
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
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              onClick={() => setStep("otp")}
              className={`px-6 py-2 rounded-full transition ${
                isDark
                  ? "bg-white text-black hover:bg-neutral-200"
                  : "bg-black text-white hover:bg-neutral-900"
              }`}
            >
              Continue
            </button>
          </div>
        )}

      </div>
    </div>
  );
}