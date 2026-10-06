import { useState } from "react";
import { 
  ArrowRight, 
  MapPin, 
  Loader2, 
  Home, 
  Briefcase, 
  User, 
  ShieldCheck 
} from "lucide-react";
import toast from "react-hot-toast";

export const compileFullAddress = (fields) => {
  const parts = [];
  if (fields.doorNo?.trim()) parts.push(fields.doorNo.trim());
  if (fields.street?.trim()) parts.push(fields.street.trim());
  if (fields.landmark?.trim()) {
    const cleanLm = fields.landmark.trim().replace(/^near\s+/i, "");
    parts.push(`Near ${cleanLm}`);
  }
  if (fields.city?.trim()) parts.push(fields.city.trim());

  const stateZip = [];
  if (fields.state?.trim()) stateZip.push(fields.state.trim());
  if (fields.pincode?.trim()) stateZip.push(fields.pincode.trim());
  if (stateZip.length > 0) parts.push(stateZip.join(" - "));

  const base = parts.filter(Boolean).join(", ");
  const tag = fields.addressType ? ` [${fields.addressType}]` : "";
  return base ? `${base}${tag}` : (fields.address || "");
};

export default function Details({ 
  isDark, 
  setStep, 
  orderData, 
  setOrderData, 
  handleInputChange, 
  user, 
  setShowAuthModal 
}) {
  const [gettingLocation, setGettingLocation] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(orderData.email || "");
  const isPhoneValid = Boolean(orderData.phone && orderData.phone.replace(/\s/g, "").length === 10);
  const isDoorValid = Boolean(orderData.doorNo && orderData.doorNo.trim().length > 0);
  const isStreetValid = Boolean(orderData.street && orderData.street.trim().length > 1);
  const isCityValid = Boolean(orderData.city && orderData.city.trim().length > 1);
  const isStateValid = Boolean(orderData.state && orderData.state.trim().length > 1);
  const isPincodeValid = Boolean(orderData.pincode && orderData.pincode.trim().length === 6);

  const isAddressComplete = (isDoorValid && isStreetValid && isCityValid && isStateValid && isPincodeValid) || Boolean(orderData.address && orderData.address.trim().length >= 10);

  const canProceed = Boolean(
    orderData.name?.trim() &&
    isEmailValid &&
    isPhoneValid &&
    isAddressComplete
  );

  const handleFocus = (e) => {
    if (!user) {
      if (e?.target?.blur) e.target.blur();
      setShowAuthModal(true);
    }
  };

  const handleAddressFieldChange = (field, val) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    let cleanVal = val;
    if (field === "pincode") {
      cleanVal = val.replace(/[^0-9]/g, "").slice(0, 6);
    }

    if (setOrderData) {
      setOrderData((prev) => {
        const next = { ...prev, [field]: cleanVal };
        next.address = compileFullAddress(next);
        return next;
      });
    } else if (handleInputChange) {
      handleInputChange({ target: { name: field, value: cleanVal } });
    }
  };

  const handleAddressTypeSelect = (type) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    if (setOrderData) {
      setOrderData((prev) => {
        const next = { ...prev, addressType: type };
        next.address = compileFullAddress(next);
        return next;
      });
    }
  };

  const handleGetLocation = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          if (data && (data.address || data.display_name)) {
            const addr = data.address || {};
            const detectedDoor = addr.house_number || addr.building || "";
            const detectedStreet = [addr.road, addr.suburb || addr.neighbourhood].filter(Boolean).join(", ") || "";
            const detectedCity = addr.city || addr.town || addr.village || addr.county || addr.state_district || "";
            const detectedState = addr.state || "";
            const detectedPin = addr.postcode ? addr.postcode.replace(/[^0-9]/g, "").slice(0, 6) : "";

            if (setOrderData) {
              setOrderData((prev) => {
                const next = {
                  ...prev,
                  doorNo: detectedDoor || prev.doorNo || "",
                  street: detectedStreet || prev.street || (data.display_name ? data.display_name.split(",").slice(0, 2).join(", ").trim() : ""),
                  city: detectedCity || prev.city || "",
                  state: detectedState || prev.state || "",
                  pincode: detectedPin || prev.pincode || "",
                };
                next.address = compileFullAddress(next) || data.display_name;
                return next;
              });
            } else if (handleInputChange) {
              handleInputChange({ target: { name: "address", value: data.display_name } });
            }
            toast.success("Location detected & address auto-filled!");
          } else {
            toast.error("Could not determine address from coordinates");
          }
        } catch (err) {
          console.error(err);
          toast.error("Failed to fetch address details");
        } finally {
          setGettingLocation(false);
        }
      },
      (error) => {
        setGettingLocation(false);
        toast.error("Location access denied or unavailable");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div
      className={`rounded-2xl border p-6 md:p-8 mb-10 transition-all duration-300 ${isDark
        ? "border-white/10 bg-[#141416]/80 backdrop-blur-xl shadow-2xl shadow-black/40"
        : "border-black/5 bg-white/80 backdrop-blur-xl shadow-2xl shadow-black/5"
        }`}
    >
      {/* SECTION HEADER */}
      <div className="flex items-center gap-3 mb-6 md:mb-8">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <User size={18} />
        </div>
        <div>
          <h2 className="text-lg md:text-xl font-medium " style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
            Recipient Details
          </h2>
          <p className={`text-[12px] font-medium ${isDark ? "text-neutral-400" : "text-neutral-500"}`}>
            Contact details for order confirmation and artwork proof delivery
          </p>
        </div>
      </div>

      {/* CONTACT DETAILS GRID */}
      <div className="grid md:grid-cols-2 gap-5 md:gap-6">

        {/* Full Name */}
        <div className="space-y-2">
          <label className={`text-[11px] font-semibold uppercase tracking-wider ml-1 flex items-center gap-1.5 ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            value={orderData.name || ""}
            onChange={handleInputChange}
            onFocus={handleFocus}
            placeholder="e.g. Rahul Sharma"
            className={`w-full border p-3 rounded-xl text-[14px] outline-none transition-all capitalize shadow-sm
              ${isDark
                ? "border-white/10 bg-white/[0.02] text-white focus:border-white/30 focus:bg-white/[0.05] placeholder:text-neutral-600"
                : "border-black/10 bg-black/[0.02] text-black focus:border-black/30 focus:bg-black/5 placeholder:text-neutral-400"
              }`}
          />
        </div>

        {/* Email Address */}
        <div className="space-y-2">
          <label className={`text-[11px] font-semibold uppercase tracking-wider ml-1 flex items-center gap-1.5 ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            name="email"
            value={orderData.email || ""}
            onChange={handleInputChange}
            onFocus={handleFocus}
            type="email"
            placeholder="e.g. rahul@example.com"
            className={`w-full border p-3 rounded-xl text-[14px] outline-none transition-all shadow-sm ${isDark
              ? "border-white/10 bg-white/[0.02] text-white focus:border-white/30 focus:bg-white/[0.05] placeholder:text-neutral-600"
              : "border-black/10 bg-black/[0.02] text-black focus:border-black/30 focus:bg-black/5 placeholder:text-neutral-400"
              } ${orderData.email && !isEmailValid ? "border-red-500/50 focus:border-red-500" : ""}`}
          />
          {orderData.email && !isEmailValid && (
            <p className="text-[11px] font-medium text-red-500 ml-1">Please enter a valid email address</p>
          )}
        </div>

        {/* Contact Phone */}
        <div className="space-y-2 md:col-span-2">
          <label className={`text-[11px] font-semibold uppercase tracking-wider ml-1 flex items-center gap-1.5 ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
            Mobile Phone Number <span className="text-red-500">*</span>
          </label>

          <div className="relative flex items-center max-w-md">
            <span
              className={`absolute left-3.5 text-[14px] font-semibold flex items-center gap-1 ${isDark ? "text-neutral-400" : "text-neutral-500"}`}
            >
              IN +91
            </span>

            <input
              name="phone"
              value={orderData.phone || ""}
              onChange={handleInputChange}
              onFocus={handleFocus}
              inputMode="numeric"
              maxLength={10}
              placeholder="10-digit mobile number"
              className={`w-full pl-18 pr-3 p-3 border rounded-xl text-[14px] tracking-wide focus:outline-none transition-all shadow-sm ${isDark
                ? "border-white/10 bg-white/[0.02] text-white focus:border-white/30 focus:bg-white/[0.05] placeholder:text-neutral-600"
                : "border-black/10 bg-black/[0.02] text-black focus:border-black/30 focus:bg-black/5 placeholder:text-neutral-400"
                } ${orderData.phone && orderData.phone.replace(/\s/g, "").length !== 10 ? "border-amber-500/50" : ""}`}
            />
          </div>

          {orderData.phone && orderData.phone.replace(/\s/g, "").length < 10 && (
            <p className="text-[11px] text-amber-500 font-medium ml-1">
              Requires 10 digits ({orderData.phone.replace(/\s/g, "").length}/10)
            </p>
          )}
        </div>
      </div>

      {/* DIVIDER */}
      <div className={`my-8 border-t ${isDark ? "border-white/[0.08]" : "border-black/[0.06]"}`} />

      <div className="space-y-6">

        {/* Section Header & Location Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <MapPin size={18} />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-medium" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
                Delivery Location
              </h3>
              <p className={`text-[12px] font-medium ${isDark ? "text-neutral-400" : "text-neutral-500"}`}>
                Doorstep delivery address for your handcrafted portrait
              </p>
            </div>
          </div>

          {/* Blinkit Style Live Location Button */}
          <button
            type="button"
            onClick={handleGetLocation}
            disabled={gettingLocation}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-[11px] font-medium tracking-wide transition-all shadow-sm cursor-pointer ${
              isDark 
                ? "bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20" 
                : "bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100"
            } ${gettingLocation ? 'opacity-60 cursor-not-allowed' : 'active:scale-95'}`}
          >
            {gettingLocation ? (
              <Loader2 size={13} className="animate-spin text-blue-400" />
            ) : (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
            )}
            {gettingLocation ? "Detecting GPS..." : "Use Current Location"}
          </button>
        </div>

        {/* Save Address As (Swiggy / Blinkit Tag Selector) */}
        <div>
          <label className={`text-[11px] font-semibold uppercase tracking-wider block mb-2.5 ml-1 ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
            Save Address As
          </label>
          <div className="flex flex-wrap items-center gap-2.5">
            {[
              { id: "Home", label: "Home", icon: Home },
              { id: "Work", label: "Work / Office", icon: Briefcase },
              { id: "Other", label: "Other", icon: MapPin },
            ].map((t) => {
              const Icon = t.icon;
              const isSelected = (orderData.addressType || "Home") === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleAddressTypeSelect(t.id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-[12px] font-medium transition-all cursor-pointer ${
                    isSelected
                      ? isDark
                        ? "bg-white text-black font-semibold shadow-lg"
                        : "bg-black text-white font-semibold shadow-lg"
                      : isDark
                        ? "bg-white/[0.03] border border-white/10 text-neutral-400 hover:text-white hover:border-white/20"
                        : "bg-black/[0.02] border border-black/10 text-neutral-600 hover:text-black hover:border-black/20"
                  }`}
                >
                  <Icon size={14} className={isSelected ? (isDark ? "text-black" : "text-white") : "opacity-60"} />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Structured Address Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">

          {/* Door No / House No / Flat / Building */}
          <div className="space-y-1.5 md:col-span-1">
            <label className={`text-[11px] font-semibold uppercase tracking-wider ml-1 flex items-center justify-between ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
              <span>Flat / House / Door No. & Building <span className="text-red-500">*</span></span>
            </label>
            <div className="relative">
              <input
                name="doorNo"
                value={orderData.doorNo || ""}
                onChange={(e) => handleAddressFieldChange("doorNo", e.target.value)}
                onFocus={handleFocus}
                placeholder="e.g. Flat 402, Lotus Residency / Door No. 12-4-5"
                className={`w-full p-3 rounded-xl border text-[13.5px] outline-none transition-all shadow-sm ${isDark
                  ? "border-white/10 bg-white/[0.02] text-white focus:border-white/30 focus:bg-white/[0.05] placeholder:text-neutral-600"
                  : "border-black/10 bg-black/[0.02] text-black focus:border-black/30 focus:bg-black/5 placeholder:text-neutral-400"
                  }`}
              />
            </div>
          </div>

          {/* Street / Road / Area / Locality */}
          <div className="space-y-1.5 md:col-span-1">
            <label className={`text-[11px] font-semibold uppercase tracking-wider ml-1 flex items-center justify-between ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
              <span>Street Address / Area / Locality <span className="text-red-500">*</span></span>
            </label>
            <div className="relative">
              <input
                name="street"
                value={orderData.street || ""}
                onChange={(e) => handleAddressFieldChange("street", e.target.value)}
                onFocus={handleFocus}
                placeholder="e.g. 5th Cross Road, Indiranagar"
                className={`w-full p-3 rounded-xl border text-[13.5px] outline-none transition-all shadow-sm ${isDark
                  ? "border-white/10 bg-white/[0.02] text-white focus:border-white/30 focus:bg-white/[0.05] placeholder:text-neutral-600"
                  : "border-black/10 bg-black/[0.02] text-black focus:border-black/30 focus:bg-black/5 placeholder:text-neutral-400"
                  }`}
              />
            </div>
          </div>

          {/* Landmark (Optional) */}
          <div className="space-y-1.5 md:col-span-1">
            <label className={`text-[11px] font-semibold uppercase tracking-wider ml-1 flex items-center justify-between ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
              <span>Nearby Landmark <span className="text-[10px] opacity-60 font-normal lowercase">(optional)</span></span>
            </label>
            <input
              name="landmark"
              value={orderData.landmark || ""}
              onChange={(e) => handleAddressFieldChange("landmark", e.target.value)}
              onFocus={handleFocus}
              placeholder="e.g. Near Apollo Pharmacy / Behind Metro Station"
              className={`w-full p-3 rounded-xl border text-[13.5px] outline-none transition-all shadow-sm ${isDark
                ? "border-white/10 bg-white/[0.02] text-white focus:border-white/30 focus:bg-white/[0.05] placeholder:text-neutral-600"
                : "border-black/10 bg-black/[0.02] text-black focus:border-black/30 focus:bg-black/5 placeholder:text-neutral-400"
                }`}
            />
          </div>

          {/* 6-Digit Pincode */}
          <div className="space-y-1.5 md:col-span-1">
            <label className={`text-[11px] font-semibold uppercase tracking-wider ml-1 flex items-center justify-between ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
              <span>Pincode <span className="text-red-500">*</span></span>
              
            </label>
            <input
              name="pincode"
              value={orderData.pincode || ""}
              onChange={(e) => handleAddressFieldChange("pincode", e.target.value)}
              onFocus={handleFocus}
              inputMode="numeric"
              maxLength={6}
              placeholder="e.g. 560038"
              className={`w-full p-3 rounded-xl border text-[13.5px] outline-none transition-all shadow-sm ${isDark
                ? "border-white/10 bg-white/[0.02] text-white focus:border-white/30 focus:bg-white/[0.05] placeholder:text-neutral-600"
                : "border-black/10 bg-black/[0.02] text-black focus:border-black/30 focus:bg-black/5 placeholder:text-neutral-400"
                } ${orderData.pincode && orderData.pincode.length !== 6 ? "border-amber-500/50" : ""}`}
            />
          </div>

          {/* City */}
          <div className="space-y-1.5 md:col-span-1">
            <label className={`text-[11px] font-semibold uppercase tracking-wider ml-1 flex items-center justify-between ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
              <span>City / District <span className="text-red-500">*</span></span>
            </label>
            <input
              name="city"
              value={orderData.city || ""}
              onChange={(e) => handleAddressFieldChange("city", e.target.value)}
              onFocus={handleFocus}
              placeholder="e.g. Bengaluru"
              className={`w-full p-3 rounded-xl border text-[13.5px] outline-none transition-all capitalize shadow-sm ${isDark
                ? "border-white/10 bg-white/[0.02] text-white focus:border-white/30 focus:bg-white/[0.05] placeholder:text-neutral-600"
                : "border-black/10 bg-black/[0.02] text-black focus:border-black/30 focus:bg-black/5 placeholder:text-neutral-400"
                }`}
            />
          </div>

          {/* State */}
          <div className="space-y-1.5 md:col-span-1">
            <label className={`text-[11px] font-semibold uppercase tracking-wider ml-1 flex items-center justify-between ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
              <span>State <span className="text-red-500">*</span></span>
            </label>
            <input
              name="state"
              value={orderData.state || ""}
              onChange={(e) => handleAddressFieldChange("state", e.target.value)}
              onFocus={handleFocus}
              placeholder="e.g. Karnataka"
              className={`w-full p-3 rounded-xl border text-[13.5px] outline-none transition-all capitalize shadow-sm ${isDark
                ? "border-white/10 bg-white/[0.02] text-white focus:border-white/30 focus:bg-white/[0.05] placeholder:text-neutral-600"
                : "border-black/10 bg-black/[0.02] text-black focus:border-black/30 focus:bg-black/5 placeholder:text-neutral-400"
                }`}
            />
          </div>

        </div>

        {/* Live Address Confirmation Preview Card (Blinkit / Swiggy style) */}
        {orderData.address && (
          <div className={`p-4 rounded-xl border transition-all ${
            isDark 
              ? "bg-emerald-500/[0.04] border-emerald-500/20 text-neutral-200" 
              : "bg-emerald-50/70 border-emerald-200 text-neutral-800"
          }`}>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-500">
                <MapPin size={13} className="shrink-0" />
                Formatted Delivery Address
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase tracking-wider">
                {orderData.addressType || "Home"}
              </span>
            </div>
            <p className="text-[13px] font-medium leading-relaxed">
              {orderData.address}
            </p>
          </div>
        )}

      </div>

      {/* STUDIO PACKAGING & DISCRETION NOTICE */}
      <div
        className={`flex items-start gap-3.5 mt-8 p-4 md:p-5 rounded-xl border transition-all ${isDark
          ? "bg-white/[0.02] border-white/5"
          : "bg-black/[0.02] border-black/5"
          }`}
      >
        <ShieldCheck size={18} className={`shrink-0 mt-0.5 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
        <p className={`text-[12.5px] leading-relaxed font-medium ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
          Your physical address is kept strictly confidential. Hand-painted portraits are cushioned in multi-layer moisture-resistant protective packaging to guarantee flawless doorstep arrival.
        </p>
      </div>

      {/* PROCEED BUTTON */}
      <button
        type="button"
        onClick={() => {
          if (!user) {
            setShowAuthModal(true);
            return;
          }
          if (!canProceed) {
            if (!orderData.name?.trim()) return toast.error("Please enter recipient name");
            if (!isEmailValid) return toast.error("Please enter a valid email address");
            if (!isPhoneValid) return toast.error("Please enter a 10-digit mobile number");
            if (!isDoorValid) return toast.error("Please enter door/flat number and building name");
            if (!isStreetValid) return toast.error("Please enter street address or locality");
            if (!isCityValid) return toast.error("Please enter your city");
            if (!isStateValid) return toast.error("Please enter your state");
            if (!isPincodeValid) return toast.error("Please enter a valid 6-digit pincode");
            return;
          }
          window.scrollTo({ top: 0, left: 0, behavior: "instant" });
          if (document.documentElement) document.documentElement.scrollTop = 0;
          if (document.body) document.body.scrollTop = 0;
          setStep(2);
        }}
        disabled={user && !canProceed}
        className={`mt-8 md:mt-10 w-full px-5 py-3.5 text-[13px] md:text-[14px] uppercase font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 group cursor-pointer ${isDark
          ? "bg-white text-black hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-600 disabled:cursor-not-allowed "
          : "bg-black text-white hover:bg-neutral-800 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed "
          }`}
      >
        Proceed to Art Selection
        <ArrowRight
          size={18}
          className="transition-transform duration-300 ease-out group-hover:translate-x-1.5"
        />
      </button>
    </div>
  );
}
