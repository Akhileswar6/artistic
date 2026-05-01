import { Star } from "lucide-react";

export default function Testimonials({ isDark }) {

const testimonials = [
  {
    name: "Ananya Sharma",
    city: "Mumbai",
    style: "Charcoal Drawing",
    text: "The attention to detail is unbelievable. Every shade and line looks exactly like the original photo. My family couldn't believe it was hand drawn. Truly impressive work."
  },
  {
    name: "Priya Singh",
    city: "Bangalore",
    style: "Pencil Sketch",
    text: "I gifted this sketch to my parents on their anniversary and it became the highlight of the celebration. The likeness is perfect and the emotions in the artwork are beautiful."
  },
  {
    name: "Rahul Kapoor",
    city: "Delhi",
    style: "Color Portrait",
    text: "Absolutely amazing work. The colors are vibrant and the detailing is exceptional. It looks even better in person than in the preview images."
  },
  {
    name: "Ishaan Mehta",
    city: "Pune",
    style: "Caricature",
    text: "The caricature was hilarious and beautifully done. It captured the personality perfectly while still looking elegant and artistic."
  },
  {
    name: "Aditya Verma",
    city: "Hyderabad",
    style: "Pencil Sketch",
    text: "Clean, professional, and incredibly detailed artwork. The sketch feels alive and every small feature is captured perfectly."
  },
  {
    name: "Sneha Patil",
    city: "Nagpur",
    style: "Charcoal Drawing",
    text: "I ordered a charcoal sketch for my sister's birthday and she absolutely loved it. The shading and texture look so realistic."
  },
  {
    name: "Arjun Reddy",
    city: "Chennai",
    style: "Pencil Sketch",
    text: "One of the best artworks I have ever received. The artist perfectly captured the emotions in the photograph."
  },
  {
    name: "Meera Iyer",
    city: "Kochi",
    style: "Color Portrait",
    text: "The colors are stunning and the artwork feels premium. Everyone who visits my house asks about the portrait."
  },
  {
    name: "Karan Malhotra",
    city: "Chandigarh",
    style: "Caricature",
    text: "Such a fun and creative caricature. It perfectly represents our personalities and makes everyone smile."
  },
  {
    name: "Ayesha Khan",
    city: "Lucknow",
    style: "Charcoal Drawing",
    text: "The portrait exceeded my expectations. The detailing in the eyes and hair is incredible and the overall finish looks very professional."
  }
];


  return (
    <div className="mt-20 md:mt-32 overflow-hidden relative py-12">

      {/* Title */}
      <div className="text-center mb-12 md:mb-16 px-4">
        <h2
          className="text-3xl sm:text-4xl font-semibold tracking-tight"
          style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
        >
          Loved by <span className="text-neutral-500 font-bold">Customers</span>
        </h2>

        <p className={`mt-2 sm:mt-3 text-[13px] sm:text-sm ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
          Real reviews from happy clients
        </p>
      </div>

      {/* TOP ROW */}
<div
  className={`pointer-events-none absolute left-0 top-0 h-full w-12 sm:w-20 md:w-40 z-10 ${
    isDark
      ? "bg-gradient-to-r from-black to-transparent"
      : "bg-gradient-to-r from-white to-transparent"
  }`}
/>
<div
  className={`pointer-events-none absolute right-0 top-0 h-full w-12 sm:w-20 md:w-40 z-10 ${
    isDark
      ? "bg-gradient-to-l from-black to-transparent"
      : "bg-gradient-to-l from-white to-transparent"
  }`}
/>
      <div className="scroll-row scroll-left">

        {[...testimonials, ...testimonials].map((t, i) => (

  <div
  key={i}
  className={`min-w-[300px] max-w-[300px] sm:min-w-[350px] sm:max-w-[350px] border rounded-2xl p-4 flex-shrink-0 transition duration-300 hover:-translate-y-1 ${
    isDark
      ? "bg-[#111] border-neutral-700 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
      : "bg-white border-neutral-200 shadow-xl"
  }`}
>

            <div className="flex items-center gap-3 mb-3">
              <div>
                <p className="font-semibold text-[14px] sm:text-[15px]" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>{t.name}</p>
                <p className="text-[11px] sm:text-[12px] text-neutral-500">
                  {t.city} · {t.style}
                </p>
              </div>

            </div>

            <div className="flex mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={11} className="sm:w-[12px] sm:h-[12px]" fill="#facc15" color="#facc15" />
              ))}
            </div>

            <p className="text-[12px] sm:text-[13px] opacity-90 leading-relaxed">{t.text}</p>

          </div>

        ))}

      </div>
      

      {/* BOTTOM ROW */}
      <div className="scroll-row scroll-right mt-6">

        {[...testimonials, ...testimonials].map((t, i) => (

          <div
  key={i}
  className={`min-w-[300px] max-w-[300px] sm:min-w-[350px] sm:max-w-[350px] border rounded-2xl p-4 flex-shrink-0 transition duration-300 hover:-translate-y-1 ${
    isDark
      ? "bg-[#111] border-neutral-700 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
      : "bg-white border-neutral-200 shadow-xl"
  }`}
>

            <div className="flex items-center gap-3 mb-3">
              <div>
                <p className="font-semibold text-[14px] sm:text-[15px]" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>{t.name}</p>
                <p className="text-[11px] sm:text-[12px] text-neutral-500">
                  {t.city} · {t.style}
                </p>
              </div>

            </div>

            <div className="flex mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={11} className="sm:w-[12px] sm:h-[12px]" fill="#facc15" color="#facc15" />
              ))}
            </div>

            <p className="text-[12px] sm:text-[13px] opacity-90 leading-relaxed">{t.text}</p>

          </div>

        ))}

      </div>

    </div>
  );
}