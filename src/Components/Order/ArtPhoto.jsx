import { Upload, X, ZoomIn, Check, ArrowRight, ArrowLeft } from "lucide-react";
import { useState } from "react";


export default function ArtPhoto({
  isDark,
  setStep,
  photo,
  metadata,
  handlePhoto,
  removePhoto,
  setZoom
}) {

const [selectedStyle, setSelectedStyle] = useState(null);
const [frameOption, setFrameOption] = useState("standard8x10");
const [instructions, setInstructions] = useState("");

  return (
    <div className="space-y-6">

      {/* ART STYLE */}
      <div className={`rounded-xl border p-8  shadow-lg ${
        isDark
          ? "bg-[#111] border-neutral-700"
          : "bg-white border-neutral-300"
      }`}>

        <h2 className="text-xl font-semibold mb-6 " style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
          Choose Art Style
        </h2>

       <div className="grid md:grid-cols-2 gap-4">

{/* Realistic */}
<div
  onClick={() => setSelectedStyle("realistic")}
  className={`relative p-4 text-[15px] border rounded-lg flex justify-between cursor-pointer transition hover:-translate-y-1
  ${
    selectedStyle === "realistic"
      ? isDark
        ? "bg-green-950 border-green-600 text-white"
        : "bg-green-100 border-green-500 "
      : isDark
      ? "bg-[#1c1c1c] border-neutral-700"
      : "bg-white border-gray-300 shadow-md"
  }`}
>

{selectedStyle === "realistic" && (
  <div className="absolute -top-2 -left-2 bg-green-500 text-white rounded-full p-1">
    <Check size={14} />
  </div>
)}

<span>Realistic Pencil Drawing</span>
<span>₹1,500</span>

</div>


{/* Charcoal */}
<div
  onClick={() => setSelectedStyle("charcoal")}
  className={`relative p-4 text-[15px] border rounded-lg flex justify-between cursor-pointer transition hover:-translate-y-1
  ${
    selectedStyle === "charcoal"
      ? isDark
        ? "bg-green-950 border-green-600 text-white"
        : "bg-green-100 border-green-500 "
      : isDark
      ? "bg-[#1c1c1c] border-neutral-700"
      : "bg-white border-gray-300 shadow-md"
  }`}
>

{selectedStyle === "charcoal" && (
  <div className="absolute -top-2 -left-2 bg-green-500 text-white rounded-full p-1">
    <Check size={14} />
  </div>
)}

<span>Charcoal Art</span>
<span>₹1,500</span>

</div>


{/* Pencil Sketch */}
<div
  onClick={() => setSelectedStyle("sketch")}
  className={`relative p-4 text-[15px] border rounded-lg flex justify-between cursor-pointer transition hover:-translate-y-1
  ${
    selectedStyle === "sketch"
      ? isDark
        ? "bg-green-950 border-green-600 text-white"
        : "bg-green-100 border-green-500 "
      : isDark
      ? "bg-[#1c1c1c] border-neutral-700"
      : "bg-white border-gray-300 shadow-md"
  }`}
>

{selectedStyle === "sketch" && (
  <div className="absolute -top-2 -left-2 bg-green-500 text-white rounded-full p-1">
    <Check size={14} />
  </div>
)}

<span>Pencil Sketch</span>
<span>₹2,000</span>

</div>


{/* Caricature */}
<div
  onClick={() => setSelectedStyle("caricature")}
  className={`relative p-4 text-[15px] border rounded-lg flex justify-between cursor-pointer transition hover:-translate-y-1
  ${
    selectedStyle === "caricature"
      ? isDark
        ? "bg-green-950 border-green-600 text-white"
        : "bg-green-100 border-green-500 "
      : isDark
      ? "bg-[#1c1c1c] border-neutral-700"
      : "bg-white border-gray-300 shadow-md"
  }`}
>

{selectedStyle === "caricature" && (
  <div className="absolute -top-2 -left-2 bg-green-500 text-white rounded-full p-1">
    <Check size={14} />
  </div>
)}

<span>Caricature</span>
<span>₹1,800</span>

</div>

</div>
      </div>



{/* FRAME OPTION */}
<div
  className={`rounded-xl border p-8 shadow-lg ${
    isDark
      ? "bg-[#111] border-neutral-700"
      : "bg-white border-neutral-300"
  }`}
>

<h2
  className="text-xl font-semibold mb-4"
  style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
>
Frame Option
</h2>

<select
  value={frameOption}
  onChange={(e) => setFrameOption(e.target.value)}
  className={`px-3 py-2 rounded-lg border text-[14px] ${
    isDark
      ? "bg-[#1c1c1c] border-neutral-700 text-white"
      : "bg-white border-neutral-300 shadow-md"
  }`}
>

<option value="noframe">
No Frame (Digital Delivery) (Free)
</option>

<option value="standard8x10">
Standard Frame 8×10 inch (+₹200)
</option>

<option value="standard12x16">
Standard Frame 12×16 inch (+₹400)
</option>

<option value="custom">
Custom Frame Size (+₹600)
</option>

</select>

<p className="text-sm mt-3 flex items-center gap-2 text-neutral-500">
🚚 Delivery charges are extra and paid by customer at actuals.
</p>

</div>






      {/* PHOTO UPLOAD */}
      <div className={`rounded-xl border p-8 shadow-lg ${
        isDark
          ? "bg-[#111] border-neutral-700"
          : "bg-white border-neutral-300"
      }`}>

        <h2 className="text-xl font-semibold  mb-2 "style={{ fontFamily: "Bricolage Grotesque, sans-serif" }} >Upload Your Photo</h2>

        <p className={`mb-6 text-sm ${
            isDark ? "text-neutral-400" : "text-neutral-600"
          }`}>
High-resolution front-facing photos work best. JPG, PNG, WEBP supported.

        </p>

        {!photo ? (

          <label className="border-2 border-neutral-400 border-dashed rounded-xl p-12 flex flex-col items-center cursor-pointer">

            <Upload size={30} />

            <p className="mt-2">Drop photo here or click to browse</p>
            <p className="text-sm text-neutral-500 mt-1">
              Max Size - 5MB. JPG, PNG, WEBP.
            </p>

            <input
              type="file"
              onChange={handlePhoto}
              className="hidden"
            />

          </label>

        ) : (

          <div className="space-y-4">

            <div className="relative flex justify-center">

              <img
                src={photo}
                alt="preview"
                className="max-h-80 rounded-lg"
              />

              

              <button
                onClick={removePhoto}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
              >
                <X size={16} />
              </button>

              <button
                onClick={() => setZoom(true)}
                className="absolute bottom-2 right-2 bg-black text-white p-2 rounded-full"
              >
                <ZoomIn size={16} />
              </button>

            </div>

            {metadata && (
              <div className="text-sm text-neutral-500 space-y-1">
                <p>Name: {metadata.name}</p>
                <p>Size: {metadata.size}</p>
                <p>Type: {metadata.type}</p>
             

              </div>
            )}

            {photo && (
  <p className="text-green-500 text-sm flex items-center gap-2">
    <Check size={16} />
    Photo uploaded successfully
  </p>
)}

          </div>

        )}

      </div>



      {/* SPECIAL INSTRUCTIONS */}
<div
  className={`rounded-xl border p-8 shadow-lg ${
    isDark
      ? "bg-[#111] border-neutral-700"
      : "bg-white border-neutral-300"
  }`}
>

<h2
  className="text-xl font-semibold mb-2"
  style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
>
Special Instructions
</h2>

<p
  className={`text-sm mb-4 ${
    isDark ? "text-neutral-400" : "text-neutral-600"
  }`}
>
Any specific requests, preferences, or details you want the artist to know.
</p>

<textarea
      rows="4"
      value = {instructions}
        onChange={(e) => setInstructions(e.target.value)}
      placeholder="E.g. 'Focus on the eyes', 'Add flowers in the background', 'Make it a gift for my mother'..."
      className={`w-full p-2 rounded-md border text-sm focus:outline-none ${
        isDark
          ? "bg-[#1c1c1c] border-neutral-700 placeholder:text-neutral-400 focus:ring-1 focus:ring-white"
          : "bg-white border-gray-300 shadow-md placeholder:text-neutral-500 focus:ring-1 focus:ring-black"
      }`}
    />

</div>




      {/* BUTTONS */}
      <div className="grid grid-cols-2 gap-6">

  {/* Back Button */}
  <button
    onClick={() => setStep(1)}
    className={`px-6 py-2 text-[14px] rounded-lg border transition cursor-pointer flex items-center justify-center gap-2 ${
      isDark
        ? "bg-[#1c1c1c] text-white border-neutral-700 hover:bg-neutral-900"
        : "bg-white text-black border-neutral-300 shadow-lg hover:bg-gray-100"
    }`}
  >
    <ArrowLeft size={16} />
    Back
  </button>

  {/* Review Button */}
  <button
    onClick={() => setStep(3)}
    className={`px-6 py-2 text-[14px] rounded-lg transition cursor-pointer flex items-center justify-center gap-2 ${
      isDark
        ? "bg-white text-black"
        : "bg-black text-white hover:bg-neutral-900"
    }`}
  >
    Review Order <ArrowRight size={16} />
  </button>

</div>

    </div>
    
  );
}