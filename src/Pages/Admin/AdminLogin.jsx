import { useState } from "react";
import ThemeToggle from "../../Components/ThemeToggle";
import { Link } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff  } from "lucide-react";

export default function AdminLogin({ isDark, setIsDark }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    console.log(email, password);
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        isDark ? "bg-black text-white" : "bg-white text-black"
      }`} style={{ fontFamily: "Inter, sans-serif" }}
    >

      {/* Toggle Button */}
      <div className="absolute top-6 right-6">
        <ThemeToggle isDark={isDark} setIsDark={setIsDark} />
      </div>

      <div className="w-[500px]">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          
        </div>

        {/* Title */}
        <h1 className="text-3xl font-semibold text-center mb-2" style={{ fontFamily: "Playfair Display, serif" }}>
          Admin Dashboard
        </h1>

        <p className="text-center text-[15px] text-gray-400 mb-8">
          Artistic by Akhileswar
        </p>

        {/* Login Card */}
        <div
          className={`p-8 rounded-2xl shadow-xl ${
            isDark ? "bg-[#141414] border border-neutral-700" : "bg-white border border-gray-300"
          }`}
        >
          <form onSubmit={handleLogin} className="flex flex-col gap-5">

            {/* Email */}
            <div>
              <label className="text-[14px]">Email</label>
                <input
                  type="text"
                  placeholder="Enter email"
                  className={`w-full border shadow-sm p-2 mt-2 rounded-md text-[14px] focus:outline-none ${
                    isDark
                      ? "border-neutral-700 bg-[#1c1c1c] text-white focus:ring-1 focus:ring-white"
                      : "border-gray-300 bg-white text-black focus:ring-1 focus:ring-black"
                  }`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            

            {/* Password */}
             <div>
  <label className="text-[14px]">Password</label>

  <div className="relative mt-2">
    <input
      type={showPassword ? "text" : "password"}
      placeholder="Enter password"
      className={`w-full border shadow-sm p-2 pr-10 rounded-md text-[14px] focus:outline-none ${
        isDark
          ? "border-neutral-700 bg-[#1c1c1c] text-white focus:ring-1 focus:ring-white"
          : "border-gray-300 bg-white text-black focus:ring-1 focus:ring-black"
      }`}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-400  cursor-pointer ${ isDark ? "hover:text-white" : "hover:text-black" }`}
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>
</div>

            {/* Button */}
            <button
              className={`p-2 mt-4 text-[15px] rounded-lg transition cursor-pointer ${
                isDark
                  ? "bg-white text-black hover:bg-gray-200"
                  : "bg-black text-white hover:bg-neutral-800"
              }`}
            >
              Login to Dashboard
            </button>

          </form>
        </div>

        {/* Back */}
        <div className="text-center text-[15px] mt-6 ">

          <Link to="/" className={`text-gray-400 ${isDark ? "hover:text-white" : "hover:text-black"}
           px-2 py-1 rounded-md transition-colors duration-200 inline-flex items-center`}>
            <ArrowLeft size={16} className="inline mr-2" />
            Back to site
          </Link>
        </div>

      </div>
    </div>
  );
}