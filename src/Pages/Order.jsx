import { useState } from "react";
import { Clock, Package, Info, Check, X } from "lucide-react";

import Details from "../Components/Order/Details";
import ArtPhoto from "../Components/Order/ArtPhoto";
import Review from "../Components/Order/Review";

export default function Order({ isDark }) {

  const [step, setStep] = useState(1);

  const [photo, setPhoto] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [zoom, setZoom] = useState(false);

  const handlePhoto = (e) => {

    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      setMetadata({
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + " MB",
        type: file.type,
        width: img.width,
        height: img.height,
      });

      setPhoto(url);
    };

    img.src = url;
  };

  const removePhoto = () => {
    setPhoto(null);
    setMetadata(null);
  };

  return (
    <div
      className={`min-h-screen p-10 transition-colors duration-300 ${
        isDark ? "bg-black text-white" : "bg-white text-black"
      }`}
      style={{ fontFamily: "Inter, serif" }}
    >

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-10">

          <h1
            className="text-4xl font-semibold"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Place Your Order
          </h1>

          <p
            className={`mt-2 ${
              isDark ? "text-neutral-400" : "text-neutral-600"
            }`}
          >
            Fill in your details and we'll get started on your sketch.
          </p>

        </div>

        {/* STEPS */}
        <div className="flex justify-center items-center gap-10 mb-10">

          {/* STEP 1 */}
          <div className="flex items-center gap-2">

            {step > 1 ? (
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <Check size={16} />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#6b3b1f] text-white flex items-center justify-center">
                1
              </div>
            )}

            <span className="text-[15px]">Your Details</span>

          </div>

          {/* STEP 2 */}
          <div className="flex items-center gap-2 text-sm">

            {step > 2 ? (
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <Check size={16} />
              </div>
            ) : (
              <div
                className={`w-8 h-8 rounded-full border flex items-center justify-center ${
                  step === 2 ? "bg-[#6b3b1f] text-white border-[#6b3b1f]" : ""
                }`}
              >
                2
              </div>
            )}

            <span className="text-[15px]">Art Style & Photo</span>

          </div>

          {/* STEP 3 */}
          <div className="flex items-center gap-2">

            <div
              className={`w-8 h-8 rounded-full border flex items-center justify-center ${
                step === 3 ? "bg-[#6b3b1f] text-white border-[#6b3b1f]" : ""
              }`}
            >
              3
            </div>

            <span className="text-[15px]">Review & Submit</span>

          </div>

        </div>

        {/* MAIN GRID */}
        <div className="grid md:grid-cols-3 gap-10">

          {/* LEFT SIDE (Steps Content) */}
          <div className="md:col-span-2">

            {step === 1 && (
              <Details
                isDark={isDark}
                setStep={setStep}
              />
            )}

            {step === 2 && (
              <ArtPhoto
                isDark={isDark}
                setStep={setStep}
                photo={photo}
                metadata={metadata}
                handlePhoto={handlePhoto}
                removePhoto={removePhoto}
                setZoom={setZoom}
              />
            )}

            {step === 3 && (
              <Review
                isDark={isDark}
                setStep={setStep}
                photo={photo}
              />
            )}

          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-col gap-6">

            {/* ORDER SUMMARY */}
            <div
              className={`rounded-2xl border p-6 ${
                isDark
                  ? "bg-[#111] border-neutral-800 text-neutral-300"
                  : "bg-white border-neutral-300 text-neutral-700 shadow-lg"
              }`}
            >

              <h3 className={`font-semibold mb-4 text-lg ${isDark ? "text-white" : "text-black"}`} style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>Order Summary</h3>

              <div className="flex justify-between mb-2 text-sm">
                <span>Pencil Sketch</span>
                <span>₹1,000</span>
              </div>

              <div className="flex justify-between mb-2 text-sm">
                <span>Frame</span>
                <span>+₹200</span>
              </div>

              <hr className="my-3 text-neutral-600 " />

              <div className="flex justify-between font-semibold text-md">
                <span>Total</span>
                <span className="text-blue-400">₹1,200</span>
              </div>

              <div className={`flex justify-between mt-2 font-medium text-sm ${isDark ? "text-yellow-200" : "text-yellow-700"}`}>
                <span> Advance (25%)</span>
                <span>₹300</span>
              </div>

              <p className="text-sm text-neutral-500 mt-2">
                + Delivery charges at actuals
              </p>

              <hr className="my-3 text-neutral-600 " />

              <div className="flex items-center text-neutral-500 gap-2 text-sm mb-2">
                <Clock size={16} />
                ~3 business days
              </div>

              <div className="flex items-center text-neutral-500 gap-2 text-sm">
                <Package size={16} />
                Carefully packed & shipped
              </div>

            </div>

            {/* PAYMENT INFO */}
            <div
              className={`p-5 rounded-2xl border ${
                isDark
                  ? "bg-[#1E0900] border-orange-300 text-yellow-200"
                  : "bg-[#f7f1e3] border-yellow-300 text-orange-700 shadow-lg"
              }`}
            >

              <div className={`flex items-center gap-2 font-md mb-2 ${isDark ? "text-yellow-200" : "text-yellow-700"}`} style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
                <Info size={18} />
                About Payment
              </div>

              <p className="text-[13px]">
                Payment details (UPI QR code) will be shared after the artist
                reviews and accepts your order.
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* IMAGE ZOOM MODAL */}
      {zoom && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">

          <div className="relative">

            <img
              src={photo}
              alt="zoom"
              className="max-h-[90vh] rounded-lg"
            />

            <button
              onClick={() => setZoom(false)}
              className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full"
            >
              <X size={18} />
            </button>

          </div>

        </div>
      )}

    </div>
  );
}