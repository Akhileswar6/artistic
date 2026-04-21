import { Upload, X, ZoomIn, Check, ArrowRight, ArrowLeft, Package, Sparkles } from "lucide-react";

export default function ArtPhoto({
  isDark,
  setStep,
  orderData,
  setOrderData,
  handlePhoto,
  removePhoto,
  setZoom
}) {

  const updateField = (field, value) => {
    setOrderData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8">

      {/* ART STYLE */}
      <div className={`rounded-xl border p-6 md:p-8 transition-all duration-300 ${isDark
        ? "border-white/10 bg-[#141416]/80 backdrop-blur-xl shadow-2xl shadow-black/40"
        : "border-black/5 bg-white/80 backdrop-blur-xl shadow-2xl shadow-black/5"
        }`}>

        <div className="flex items-center gap-3 mb-8">
          <h2 className="text-lg md:text-xl" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
            Select Art Style
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 md:gap-5">

          {/* Realistic */}
          <div
            onClick={() => updateField("artStyle", "realistic")}
            className={`relative p-5 rounded-xl flex flex-col gap-2 cursor-pointer transition-all duration-300 group
  ${orderData.artStyle === "realistic"
                ? `${isDark
                  ? "bg-white/[0.08] border-1 border-white text-white"
                  : "bg-black/[0.03] border-1 border-black text-black"
                }`
                : isDark
                  ? "bg-white/[0.02] border border-white/10 hover:border-white/30 text-neutral-400 hover:text-neutral-200"
                  : "bg-black/[0.02] border border-black/10 hover:border-black/30 text-neutral-600 hover:text-neutral-800"
              }`}
          >
            <div className="flex justify-between items-center">
              <span className="text-[15px]">Realistic Pencil</span>
              <span className={`text-[14px] ${orderData.artStyle === "realistic" ? (isDark ? "text-white" : "text-black") : (isDark ? "text-neutral-500" : "text-neutral-400")}`}>₹1,500</span>
            </div>
            <p className="text-[12px] opacity-70 leading-relaxed font-medium">
              Detailed, lifelike portrait captured with hyper-realistic precision.
            </p>
            {orderData.artStyle === "realistic" && (
              <div className="absolute -top-3 -right-3 bg-green-600 text-white rounded-full p-1.5">
                <Check size={14} strokeWidth={3} />
              </div>
            )}
          </div>

          <div
            onClick={() => updateField("artStyle", "charcoal")}
            className={`relative p-5 rounded-2xl flex flex-col gap-2 cursor-pointer transition-all duration-300 group
  ${orderData.artStyle === "charcoal"
                ? `${isDark
                  ? "bg-white/[0.08] border-1 border-white text-white"
                  : "bg-black/[0.03] border-1 border-black text-black"
                }`
                : isDark
                  ? "bg-white/[0.02] border border-white/10 hover:border-white/30 text-neutral-400 hover:text-neutral-200"
                  : "bg-black/[0.02] border border-black/10 hover:border-black/30 text-neutral-600 hover:text-neutral-800"
              }`}
          >
            <div className="flex justify-between items-center">
              <span className="text-[15px]">Charcoal Art</span>
              <span className={`text-[14px] ${orderData.artStyle === "charcoal" ? (isDark ? "text-white" : "text-black") : (isDark ? "text-neutral-500" : "text-neutral-400")}`}>
                ₹1,500
              </span>
            </div>

            <p className="text-[12px] opacity-70 leading-relaxed font-medium">
              Moody, expressive textures with deep, rich blacks and stark contrasts.
            </p>

            {orderData.artStyle === "charcoal" && (
              <div className="absolute -top-3 -right-3 bg-green-600 text-white rounded-full p-1.5">
                <Check size={14} strokeWidth={3} />
              </div>
            )}
          </div>

          {/* Pencil Sketch */}
          <div
            onClick={() => updateField("artStyle", "sketch")}
            className={`relative p-5 rounded-2xl flex flex-col gap-2 cursor-pointer transition-all duration-300 group
  ${orderData.artStyle === "sketch"
                ? `${isDark
                  ? "bg-white/[0.08] border-1 border-white text-white"
                  : "bg-black/[0.03] border-1 border-black text-black"
                }`
                : isDark
                  ? "bg-white/[0.02] border border-white/10 hover:border-white/30 text-neutral-400 hover:text-neutral-200"
                  : "bg-black/[0.02] border border-black/10 hover:border-black/30 text-neutral-600 hover:text-neutral-800"
              }`}
          >
            <div className="flex justify-between items-center">
              <span className="text-[15px]">Pencil Sketch</span>
              <span className={`text-[14px]  ${orderData.artStyle === "sketch" ? (isDark ? "text-white" : "text-black") : (isDark ? "text-neutral-500" : "text-neutral-400")}`}>
                ₹2,000
              </span>
            </div>

            <p className="text-[12px] opacity-70 leading-relaxed font-medium">
              Sophisticated architectural line work and elegant artistic shading.
            </p>

            {orderData.artStyle === "sketch" && (
              <div className="absolute -top-3 -right-3 bg-green-600 text-white rounded-full p-1.5">
                <Check size={14} strokeWidth={3} />
              </div>
            )}
          </div>

          {/* Caricature */}
          <div
            onClick={() => updateField("artStyle", "caricature")}
            className={`relative p-5 rounded-2xl flex flex-col gap-2 cursor-pointer transition-all duration-300 group
  ${orderData.artStyle === "caricature"
                ? `${isDark
                  ? "bg-white/[0.08] border-1 border-white text-white"
                  : "bg-black/[0.03] border-1 border-black text-black"
                }`
                : isDark
                  ? "bg-white/[0.02] border border-white/10 hover:border-white/30 text-neutral-400 hover:text-neutral-200"
                  : "bg-black/[0.02] border border-black/10 hover:border-black/30 text-neutral-600 hover:text-neutral-800"
              }`}
          >
            <div className="flex justify-between items-center">
              <span className="text-[15px]">Caricature</span>
              <span className={`text-[14px] ${orderData.artStyle === "caricature" ? (isDark ? "text-white" : "text-black") : (isDark ? "text-neutral-500" : "text-neutral-400")}`}>
                ₹1,800
              </span>
            </div>
            <p className="text-[12px] opacity-70 leading-relaxed font-medium">Fun, stylized exaggeration designed to uniquely capture personality.</p>
            {orderData.artStyle === "caricature" && (
              <div className="absolute -top-3 -right-3 bg-green-600 text-white rounded-full p-1.5">
                <Check size={14} strokeWidth={3} />
              </div>
            )}
          </div>

        </div>
      </div>



      {/* FRAME OPTION */}
      <div className={`rounded-2xl border p-6 md:p-8 transition-all duration-300 ${isDark
        ? "border-white/10 bg-[#141416]/80 backdrop-blur-xl shadow-2xl shadow-black/40"
        : "border-black/5 bg-white/80 backdrop-blur-xl shadow-2xl shadow-black/5"
        }`}>

        <div className="flex items-center gap-3 mb-8">
          <h2 className="text-lg md:text-xl" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
            Select Frame
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { id: "noframe", label: "No Frame", extra: "Included" },
            { id: "standard8x10", label: "Standard 8x10\"", extra: "+₹200" },
            { id: "standard12x16", label: "Standard 12x16\"", extra: "+₹400" },
            { id: "custom", label: "Custom Frame", extra: "+₹600" },
          ].map((option) => (
            <div
              key={option.id}
              onClick={() => updateField("frameOption", option.id)}
              className={`relative p-5 rounded-xl flex justify-between items-center cursor-pointer transition-all ${orderData.frameOption === option.id
                ? `${isDark ? "bg-white/[0.08] border-1 border-white text-white" : "bg-black/[0.03] border-1 border-black text-black"}`
                : isDark
                  ? "bg-white/[0.02] border border-white/10 hover:border-white/30 text-neutral-400"
                  : "bg-black/[0.02] border border-black/10 hover:border-black/30 text-neutral-600"
                }`}
            >
              <span className="text-[14px]">{option.label}</span>
              <span className={`text-[13px] ${orderData.frameOption === option.id ? (isDark ? "text-white" : "text-black") : (isDark ? "text-neutral-500" : "text-neutral-400")}`}>{option.extra}</span>
              {orderData.frameOption === option.id && (
                <div className="absolute -top-2 -right-2 bg-green-600 text-white rounded-full p-1 shadow-lg shadow-green-600/20">
                  <Check size={12} strokeWidth={3} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={`mt-6 p-4 rounded-xl flex items-start gap-3 ${isDark ? "bg-neutral-900 border border-neutral-800" : "bg-neutral-100 border border-neutral-200"}`}>
          <Package size={16} className={`shrink-0 mt-0.5 ${isDark ? "text-neutral-500" : "text-neutral-400"}`} />
          <p className={`text-[13px] font-medium ${isDark ? "text-neutral-400" : "text-neutral-500"}`}>
            Physical frames are sourced from premium suppliers. Wood grain/color variations may slightly differ from digital proofs. Shipping logistics are calculated post-production.
          </p>
        </div>
      </div>




      {/* PHOTO UPLOAD */}
      <div className={`rounded-2xl border p-6 md:p-8 transition-all duration-300 ${isDark
        ? "border-white/10 bg-[#141416]/80 backdrop-blur-xl shadow-2xl shadow-black/40"
        : "border-black/5 bg-white/80 backdrop-blur-xl shadow-2xl shadow-black/5"
        }`}>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h2 className="text-lg md:text-xl" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
              Reference Image
            </h2>
          </div>
          {orderData.photo && (
            <span className="flex items-center gap-1.5 text-[11px] text-green-500 bg-green-500/10 px-3 py-1 rounded-full uppercase tracking-widest">
              <Check size={12} strokeWidth={3} /> Uploaded
            </span>
          )}
        </div>


        {!orderData.photo ? (
          <label className={`group border-2 border-dashed rounded-2xl p-10 flex flex-col items-center cursor-pointer transition-all duration-300 ${isDark ? "border-white/20 hover:border-white/40 bg-white/[0.02] hover:bg-white/[0.04]" : "border-black/20 hover:border-black/40 bg-black/[0.02] hover:bg-black/[0.04]"
            }`}>
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-5 transition-transform duration-300 group-hover:-translate-y-2 ${isDark ? "bg-white/10 text-white" : "bg-black/5 text-black"}`}>
              <Upload size={24} />
            </div>
            <p className="text-[16px] mb-2">Drop photo here or click to browse</p>
            <p className={`text-[13px] font-medium ${isDark ? "text-neutral-500" : "text-neutral-500"}`}>Optimal: High-res, well-lit, front-facing (Max 5MB)</p>
            <input type="file" onChange={handlePhoto} className="hidden" />
          </label>
        ) : (
          <div className="space-y-6">
            <div className="relative group mx-auto rounded-xl overflow-hidden bg-black object-contain w-fit">
              <img src={orderData.photo} alt="preview" className="max-h-[350px] w-auto transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-sm">
                <button onClick={() => setZoom(true)} className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform shadow-2xl">
                  <ZoomIn size={16} />
                </button>
                <button onClick={removePhoto} className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-2xl">
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className={`flex items-center gap-2 text-[12px] font-medium px-4 py-2 rounded-lg ${isDark ? "bg-neutral-900 text-neutral-400" : "bg-neutral-100 text-neutral-500"}`}>
                {orderData.metadata?.name} <span className="opacity-50">({orderData.metadata?.size})</span>
              </div>

              <label className={`text-[13px] font-medium cursor-pointer px-4 py-2 rounded-lg transition-colors ${isDark ? "hover:bg-white/10 text-white" : "hover:bg-black/5 text-black"}`}>
                Change File
                <input type="file" onChange={handlePhoto} className="hidden" />
              </label>
            </div>
          </div>
        )}
      </div>




      {/* SPECIAL INSTRUCTIONS */}
      <div className={`rounded-2xl border p-6 md:p-8 transition-all duration-300 ${isDark
        ? "border-white/10 bg-[#141416]/80 backdrop-blur-xl shadow-2xl shadow-black/40"
        : "border-black/5 bg-white/80 backdrop-blur-xl shadow-2xl shadow-black/5"
        }`}>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-2">
          <div className="flex items-center gap-3">
            <h2 className="text-lg md:text-xl" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
              Special Instructions
            </h2>
          </div>
          <span className={`text-[13px] ${isDark ? "text-neutral-600" : "text-neutral-400"}`}>Optional</span>
        </div>

        <textarea
          rows="4"
          value={orderData.instructions}
          onChange={(e) => updateField("instructions", e.target.value)}
          placeholder="E.g., 'Enhance eye details', 'Remove background clutter', 'Ensure a vintage feel'..."
          className={`w-full p-4 rounded-xl border text-[14px] leading-relaxed focus:outline-none transition-all resize-none ${isDark
              ? "border-white/10 bg-white/[0.02] text-white focus:border-white/30 focus:bg-white/[0.05] placeholder:text-neutral-700"
              : "border-black/10 bg-black/[0.02] text-black focus:border-black/30 focus:bg-black/5 placeholder:text-neutral-400"
            }`}
        />
      </div>


      {/* BUTTONS */}
      <div className="grid grid-cols-2 gap-4 md:gap-6 pt-4">

        <button
          onClick={() => setStep(1)}
          className={`group px-6 py-2.5 text-[14px] font-bold uppercase  rounded-lg transition-all cursor-pointer flex items-center justify-center gap-3 ${isDark
              ? "bg-[#141416] text-white border border-white/10 hover:bg-neutral-800"
              : "bg-white text-black border border-black/10 shadow-sm hover:bg-neutral-50"
            }`}
        >
          <ArrowLeft
            size={18}
            className="transition-transform duration-300 ease-out group-hover:-translate-x-1"
          />
          Go Back
        </button>

        <button
          onClick={() => setStep(3)}
          disabled={!orderData.photo}
          className={`px-6 py-2.5 text-[14px] font-bold uppercase rounded-lg transition-all duration-300 flex items-center justify-center gap-3 group cursor-pointer ${isDark
            ? "bg-white text-black hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-600 disabled:cursor-not-allowed"
            : "bg-black text-white hover:bg-neutral-800 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed"
            }`}
        >
          Review Order
          <ArrowRight size={18} className="transition-transform duration-300 ease-out group-hover:translate-x-1" />
        </button>

      </div>

    </div>
  );
}
