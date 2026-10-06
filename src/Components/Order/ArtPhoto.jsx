import { useState } from "react";
import { Upload, X, ZoomIn, Check, ArrowRight, ArrowLeft } from "lucide-react";

export default function ArtPhoto({
  isDark,
  setStep,
  orderData,
  setOrderData,
  handlePhoto,
  removePhoto,
  setZoom,
  user,
  setShowAuthModal,
  stylePrices,
  systemConfig
}) {
  const handleInteraction = (e) => {
    if (!user) {
      if (e && e.preventDefault) e.preventDefault();
      setShowAuthModal(true);
      return true;
    }
    return false;
  };

  const updateField = (field, value) => {
    if (handleInteraction()) return;
    setOrderData(prev => ({ ...prev, [field]: value }));
  };

  const artStyles = [
    {
      id: "realistic",
      title: "Realistic Portrait",
      image: "/styles/realistic.jpg",
      objectPosition: "object-top",
      price: stylePrices?.realistic ?? 700,
    },
    {
      id: "sketch",
      title: "Pencil Sketch",
      image: "/styles/sketch.jpg",
      objectPosition: "object-top",
      price: stylePrices?.sketch ?? 600,
    },
    {
      id: "couple",
      title: "Couple Art",
      image: "/styles/couple.jpg",
      objectPosition: "object-center",
      price: stylePrices?.couple ?? 800,
    },
    {
      id: "anime",
      title: "Cartoon Anime",
      image: "/styles/anime.jpg",
      objectPosition: "object-center",
      price: stylePrices?.anime ?? 600,
    }
  ];

  const predefinedInstructions = [
    "Focus on facial expressions & eyes",
    "Keep background clean & minimal",
    "Highlight hair texture & fine details",
    "Add couple date or initials",
    "Anniversary / Birthday gift presentation",
    "Enhance lighting & soften harsh shadows",
    "Combine two reference photos seamlessly",
    "High-contrast realistic pencil tones",
    "Expressive anime eyes & vibrant coloring",
  ];

  const toggleInstruction = (text) => {
    if (handleInteraction()) return;
    const current = orderData.instructions || "";
    const lines = current.split("\n").map(l => l.trim()).filter(Boolean);
    const existingIndex = lines.findIndex(l => l.replace(/^[•\-\*]\s*/, "").toLowerCase() === text.toLowerCase());

    if (existingIndex >= 0) {
      lines.splice(existingIndex, 1);
      updateField("instructions", lines.join("\n"));
    } else {
      const newLine = `• ${text}`;
      const updated = current.trim() ? `${current.trim()}\n${newLine}` : newLine;
      updateField("instructions", updated);
    }
  };

  return (
    <div className="space-y-8">

      {/* ART STYLE SELECTION */}
      <div className={`rounded-2xl border p-3.5 sm:p-6 md:p-8 transition-all duration-300 ${isDark
        ? "border-white/10 bg-[#141416]/80 backdrop-blur-xl shadow-2xl shadow-black/40"
        : "border-black/5 bg-white/80 backdrop-blur-xl shadow-2xl shadow-black/5"
        }`}>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-7">
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
              Select Art Style
            </h2>
            <p className={`text-xs md:text-sm mt-1 ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
              Carefully examine the reference styles below to choose the perfect artistic look.
            </p>
          </div>
        </div>

        {/* 2 Columns on Phone Display, 3 Columns on Tablet/Desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
          {artStyles.map((style) => {
            const isSelected = orderData.artStyle === style.id;
            const isAnime = style.id === "anime";
            return (
              <div
                key={style.id}
                onClick={() => updateField("artStyle", style.id)}
                className={`group relative rounded-xl sm:rounded-2xl overflow-hidden flex flex-col cursor-pointer transition-all duration-300 border ${
                  isAnime ? "sm:col-start-2" : ""
                } ${
                  isSelected
                    ? isDark
                      ? "bg-white/[0.08] border-white ring-2 ring-white text-white shadow-2xl shadow-black/60 scale-[1.01]"
                      : "bg-black/[0.03] border-black ring-2 ring-black text-black shadow-xl scale-[1.01]"
                    : isDark
                      ? "bg-white/[0.02] border-white/10 hover:border-white/30 text-neutral-300 hover:text-white hover:bg-white/[0.04]"
                      : "bg-black/[0.015] border-black/10 hover:border-black/30 text-neutral-700 hover:text-black hover:bg-black/[0.03] shadow-sm"
                }`}
              >
                {/* Full image portrait view (3:4 ratio) */}
                <div className="relative w-full aspect-[3/4] overflow-hidden bg-neutral-900/40">
                  <img
                    src={style.image}
                    alt={style.title}
                    className={`w-full h-full object-cover ${style.objectPosition} transition-transform duration-500 ease-out group-hover:scale-105`}
                    loading="lazy"
                  />

                  {/* Soft bottom edge gradient for smooth visual separation */}
                  <div className="absolute inset-x-0 bottom-0 h-10 sm:h-12 bg-gradient-to-t from-black/55 to-transparent pointer-events-none" />

                  {/* Selected Indicator in top-right */}
                  {isSelected ? (
                    <div className="absolute top-2 sm:top-2.5 right-2 sm:right-2.5 z-10 flex items-center gap-1 bg-emerald-600 text-white px-2 py-0.5 rounded-full text-[10px] font-medium">
                      <Check size={11} strokeWidth={3} />
                      <span className="hidden sm:inline">SELECTED</span>
                    </div>
                  ) : (
                    <div className="absolute top-2 sm:top-2.5 right-2 sm:right-2.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-md border border-white/15">
                      Select
                    </div>
                  )}
                </div>

                {/* Art Style Name & Price Only */}
                <div className="p-2.5 sm:p-3.5 flex items-center justify-between gap-1.5 sm:gap-2">
                  <h3 className="text-[12.5px] sm:text-[15px] font-bold tracking-tight truncate" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
                    {style.title}
                  </h3>
                  <span className={`text-[12px] sm:text-[14px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md whitespace-nowrap shrink-0 transition-colors ${
                    isSelected
                      ? isDark ? "bg-white text-black" : "bg-black text-white"
                      : isDark ? "bg-white/10 text-white" : "bg-black/5 text-black"
                  }`}>
                    ₹{style.price?.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PHOTO UPLOAD */}
      <div className={`rounded-2xl border p-5 md:p-8 transition-all duration-300 ${isDark
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
          <label 
            onClick={(e) => {
              if (handleInteraction()) e.preventDefault();
            }}
            className={`group border-2 border-dashed rounded-2xl p-6 md:p-10 flex flex-col items-center cursor-pointer transition-all duration-300 ${isDark ? "border-white/20 hover:border-white/40 bg-white/[0.02] hover:bg-white/[0.04]" : "border-black/20 hover:border-black/40 bg-black/[0.02] hover:bg-black/[0.04]"
            }`}>
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-5 transition-transform duration-300 group-hover:-translate-y-2 ${isDark ? "bg-white/10 text-white" : "bg-black/5 text-black"}`}>
              <Upload size={24} />
            </div>
            <p className="text-[16px] mb-2">Drop photo here or click to browse</p>
            <p className={`text-[13px] font-medium ${isDark ? "text-neutral-500" : "text-neutral-500"}`}>Optimal: High-res, well-lit, front-facing (Max 5MB)</p>
            <input type="file" onChange={(e) => !handleInteraction() && handlePhoto(e)} className="hidden" />
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
      <div className={`rounded-2xl border p-5 md:p-8 transition-all duration-300 ${isDark
        ? "border-white/10 bg-[#141416]/80 backdrop-blur-xl shadow-2xl shadow-black/40"
        : "border-black/5 bg-white/80 backdrop-blur-xl shadow-2xl shadow-black/5"
        }`}>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-2 ">
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
          onFocus={handleInteraction}
          onChange={(e) => updateField("instructions", e.target.value)}
          placeholder="E.g., 'Enhance eye details', 'Remove background clutter', 'Ensure a vintage feel'..."
          className={`w-full p-4 rounded-xl border text-[14px] leading-relaxed focus:outline-none transition-all resize-none shadow-md ${isDark
              ? "border-white/10 bg-white/[0.02] text-white focus:border-white/30 focus:bg-white/[0.05] placeholder:text-neutral-700"
              : "border-black/10 bg-black/[0.02] text-black focus:border-black/30 focus:bg-black/5 placeholder:text-neutral-400"
            }`}
        />

        {/* Predefined Quick Select Options */}
        <div className="mt-4 pt-3 border-t border-dashed border-gray-500/20">
          <div className="flex items-center justify-between mb-2.5">
            <span className={`text-[11px] font-semibold uppercase tracking-wider ${isDark ? "text-neutral-400" : "text-neutral-500"}`}>
              Suggested Directives (Tap to add)
            </span>
            {orderData.instructions && (
              <button
                type="button"
                onClick={() => updateField("instructions", "")}
                className="text-[11px] text-red-400 hover:text-red-300 transition-colors cursor-pointer"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {predefinedInstructions.map((item, idx) => {
              const isSelected = (orderData.instructions || "").toLowerCase().includes(item.toLowerCase());
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleInstruction(item)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium transition-all cursor-pointer ${
                    isSelected
                      ? isDark
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-sm"
                      : isDark
                        ? "bg-white/[0.04] border border-white/10 text-neutral-300 hover:bg-white/[0.08] hover:text-white"
                        : "bg-black/[0.03] border border-black/10 text-neutral-700 hover:bg-black/[0.06] hover:text-black"
                  }`}
                >
                  <span className="text-[11px]">{isSelected ? "✓" : "+"}</span>
                  {item}
                </button>
              );
            })}
          </div>
        </div>
      </div>


      {/* BUTTONS (Desktop only; on mobile rendered under Order Summary) */}
      <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-6 pt-4">

        <button
          onClick={() => {
            window.scrollTo({ top: 0, left: 0, behavior: "instant" });
            setStep(1);
          }}
          className={`group px-6 py-3 md:py-3.5 text-[13px] md:text-[14px] uppercase font-bold rounded-lg md:rounded-xl transition-all cursor-pointer flex items-center justify-center gap-3 ${isDark
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
          onClick={() => {
            if (!handleInteraction()) {
              window.scrollTo({ top: 0, left: 0, behavior: "instant" });
              setStep(3);
            }
          }}
          disabled={user && !orderData.photo}
          className={`px-6 py-3 md:py-3.5 text-[13px] md:text-[14px] uppercase font-bold rounded-lg md:rounded-xl transition-all duration-300 flex items-center justify-center gap-3 group cursor-pointer ${isDark
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
