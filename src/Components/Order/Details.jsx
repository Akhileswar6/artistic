import { Info, ArrowRight } from "lucide-react";

export default function Details({ isDark, setStep }) {

  return (
    <div
      className={`rounded-xl border p-8 mb-15 ${
        isDark
          ? "border-neutral-800 bg-[#111]"
          : "border-neutral-300 bg-white shadow-lg" 
      }`}
    >

      <h2 className="text-xl font-semibold mb-6" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>Your Details</h2>

      <div className="grid md:grid-cols-2 gap-4">

      

        <div>
      <label className="text-sm block mb-1">Full Name *</label>
      <input
        placeholder="Your name"
        className={`w-full p-2 rounded-md border text-sm focus:outline-none ${
          isDark
            ? "bg-[#1c1c1c] border-neutral-700 placeholder:text-neutral-400   focus:ring-1 focus:ring-white"
            : "bg-white border-gray-300 shadow-md placeholder:text-neutral-500 focus:ring-1 focus:ring-black"
        }`}
      />
    </div>

        <div>
      <label className="text-sm block mb-1">Email Address *</label>
      <input
        placeholder="you@example.com"
        className={`w-full p-2 rounded-md border text-sm focus:outline-none ${
          isDark
            ? "bg-[#1c1c1c] border-neutral-700 placeholder:text-neutral-400   focus:ring-1 focus:ring-white"
            : "bg-white border-gray-300 shadow-md placeholder:text-neutral-500 focus:ring-1 focus:ring-black"
        }`}
      />
    </div>

     <div>
      <label className="text-sm block mb-1">Phone Number *</label>
      <input
        placeholder="+91"
        className={`w-full p-2 rounded-md border text-sm focus:outline-none ${
          isDark
            ? "bg-[#1c1c1c] border-neutral-700 placeholder:text-neutral-400   focus:ring-1 focus:ring-white"
            : "bg-white border-gray-300 shadow-md placeholder:text-neutral-500 focus:ring-1 focus:ring-black"
        }`}
      />
    </div>

      </div>

     

      <div className="mt-4">
    <label className="text-sm block mb-1">Message *</label>
    <textarea
      rows="4"
      placeholder="Full post address including Landmarks, City, State and PIN code"
      className={`w-full p-2 rounded-md border text-sm focus:outline-none ${
        isDark
          ? "bg-[#1c1c1c] border-neutral-700 placeholder:text-neutral-400 focus:ring-1 focus:ring-white"
          : "bg-white border-gray-300 shadow-md placeholder:text-neutral-500 focus:ring-1 focus:ring-black"
      }`}
    />
  </div>

      <div
        className={`flex items-center gap-2 mt-4 p-3 rounded-lg text-sm ${
          isDark
            ? "bg-[#14152B] text-blue-300"
            : "bg-blue-100 text-blue-700"
        }`}
      >
        <Info size={20} />
        Your email will be used to track your order and communicate with the artist.
      </div>

    

<button      onClick={() => setStep(2)}
                className={`mt-6 w-full px-6 py-2 text-[14px] rounded-lg transition cursor-pointer flex items-center justify-center gap-2 ${
                  isDark
                    ? "bg-white text-black"
                    : "bg-black text-white hover:bg-neutral-900"
                }`}
              >
                 Continue to Art Style <ArrowRight size={16} />
              </button>



    </div>
  );
}